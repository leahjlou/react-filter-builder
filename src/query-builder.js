import React from 'react';
import isEmpty from 'lodash.isempty';
import cloneDeep from 'lodash.clonedeep';
import partial from 'lodash.partial';
import PropTypes from 'prop-types';

import '../style.css';
import FilterInput from './filter-input.js';
import { setUpFilters, filtersToQuery, getSummaryString } from './query-builder-helpers.js';

export default class QueryBuilder extends React.Component {
	state = {
		filters: setUpFilters(this.props.initialFilters),
		activeFilterIndex: null,
		showFilterSelector: true,
	}

	componentDidMount() {
		if (!isEmpty(this.state.filters)) {
			this.applyFilters();
		}
	}

	render() {
		return (
			<div className="rqb-filter-group">
				{this.filters()}
				{this.state.showFilterSelector ? this.newFilterSelector() : this.addFilterLink()}
			</div>
		);
	}

	filters = () => {
		return (
			<div>
				{this.state.filters.map((filter, index) => {
					const disabledOverlay = (
						<div className="rqb-filter-group__disabled-overlay">
							{/* TODO: support a disabled message */}
						</div>
					);

					const operators = filter.filterDef.operators.map(operator => {
						const isOperatorSelected = filter.operator == operator;
						const input = isOperatorSelected ? (
							<FilterInput filterValue={filter.value} operator={filter.operator} onChange={partial(this.filterValueChanged, filter, index)} />
						) : null;
						return (
							<div key={operator.operator}>
								<label>
									<input type="radio" value={operator} checked={isOperatorSelected} onChange={partial(this.filterOperatorChanged, filter, index, operator)} />
									<span style={{marginLeft: '4px'}}>{operator.label}</span>
								</label>
								{input}
							</div>
						);
					});

					const editingFilter = (
						<div style={{marginTop: '8px'}}>
							{operators}
						</div>
					);

					const filterSummary = (
						<div>{getSummaryString(filter)}</div>
					);

					return (
						<div
							key={filter.field + index}
							className={`
								rqb-filter-group__filter
								${this.state.activeFilterIndex !== index && 'rqb-filter-group__filter-summary'}
								${filter.disabled && '+disabled'}
							`}
							onClick={partial(this.setActiveFilterIndex, index)}
						>
							{filter.disabled ? disabledOverlay : null}	
							<div>
								<a className="rqb-filter-group__close-filter" onClick={partial(this.removeFilter, index)}>
									&times;	
								</a>
								<div style={{marginBottom: '8px'}}>
									<strong>{filter.filterDef.label}</strong>
								</div>

								{/* Editing filter or summary of filter */}
								{this.state.activeFilterIndex == index ? editingFilter : filterSummary}
							</div>	
						</div>
					)
				})}
			</div>
		);
	}

	addFilterLink = () => {
		return (
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<a
					className="rqb-filter-group__button"
					style={{cursor: 'pointer'}}
					onClick={this.addFilter}
				>
					Add Filter
				</a>
			</div>
		);
	}

	newFilterSelector = () => {
		return (
			<div style={{paddingBottom: '8px'}} className="rqb-filter-group__filter">
				<h3 style={{marginTop: '0', marginBottom: '8px'}}>
					<strong>Start filtering by:</strong>
				</h3>
				{this.props.filterDefs.map(filterDef => (
					<div
						key={filterDef.field}
						onClick={partial(this.addNewFilter, filterDef)}
						className="rqb-filter-group__menu-item"
					>
						{filterDef.label}
					</div>
				))}
			</div>
		);
	}

	setActiveFilterIndex = activeFilterIndex => {
		const filter = this.state.filters[activeFilterIndex];
		if (filter && !filter.disabled) {
			this.setState({
				activeFilterIndex,
			});
		}
	}

	filterOperatorChanged = (filter, index, operator) => {
		// Find filter in this.state.filters and update its operator to the given operator
		const newFilters = cloneDeep(this.state.filters);
		newFilters[index] = {
			...filter,
			operator: operator,
			value: operator.defaultValue || '',
		};
		this.setState({
			filters: newFilters,
		}, this.applyFilters);
	};

	filterValueChanged = (filter, index, event) => {
		const newFilters = cloneDeep(this.state.filters);
		newFilters[index] = {
			...filter,
			value: event.target.value,
		};
		this.setState({
			filters: newFilters,
		}, this.applyFilters);
	};

	applyFilters = () => {
		// Disable any filters that should be disabled
		this.setState({
			filters: this.state.filters.map(filter => ({
				...filter,
				disabled: filter.filterDef.shouldDisableFilter && filter.filterDef.shouldDisableFilter(filter, this.state.filters),
			})),
		}, () => {
			// Close the active filter if it should now be disabled
			if (this.state.activeFilter && this.state.activeFilter.disabled)
				this.setState({
					activeFilterIndex: null,
				});

			const query = filtersToQuery(this.state.filters);
			this.props.handleQueryChange(query);
		});
	};

	addNewFilter = filterDef => {
		const newFilter = {
			field: filterDef.field,
			operator: {},
			value: filterDef.defaultValue || '',
			filterDef: filterDef
		};
		this.setState({
			filters: [...this.state.filters, newFilter],
			activeFilterIndex: this.state.filters.length,
			showFilterSelector: false,
		});
	};

	removeFilter = index => {
		this.setState({
			filters: this.state.filters.filter((filter, i) => index != i),
		}, () => {
			this.applyFilters();
			// If we just removed the active one, clear activeFilterIndex
			if (index === this.state.activeFilterIndex) {
				this.setState({
					activeFilterIndex: null,
				});
			}
			// If we just removed the last filter, show the new filter create
			if (isEmpty(this.state.filters)) {
				this.addFilter();
			}
		});
	};

	addFilter = () => {
		this.setState({
			activeFilterIndex: null,
			showFilterSelector: true,
		});
	}
};

QueryBuilder.propTypes = {
	filterDefs: PropTypes.array.isRequired,
	handleQueryChange: PropTypes.func.isRequired,
	initialFilters: PropTypes.array,
};
