import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash.isempty';
import cloneDeep from 'lodash.clonedeep';
import has from 'lodash.has';

import '../style.css';
import FilterInput from './filter-input.js';

export default class QueryBuilder extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			filters: this.setUpFilters(this.props.initialFilters),
			activeFilterIndex: null,
			showFilterSelector: true,
		};
	}

	componentDidMount() {
		if (!isEmpty(this.state.filters))
			this.applyFilters();
	}

	setUpFilters(filters) {
		if (isEmpty(filters)) return [];
		// Add filterDef and operator metadata to the filters
		return filters.map(filter => {
			let filterDef = this.props.filterDefs.find(def => def.field === filter.field);
			return {
				...filter,
				operator: filterDef && filter.operatorIndex >= 0 ? filterDef.operators[filter.operatorIndex] : {},
				filterDef: filterDef,
			};
		});
	}

	setActiveFilterIndex(index) {
		if (this.state.filters[index] && !this.state.filters[index].disabled)
			this.setState({
				activeFilterIndex: index,
			});
	}

	filterOperatorChanged(filter, index, operator) {
		// Find filter in this.state.filters and update its operator to operator
		let newFilters = cloneDeep(this.state.filters);
		newFilters[index] = {
			...filter,
			operator: operator,
			value: operator.defaultValue || '',
		};
		this.setState({
			filters: newFilters,
		}, this.applyFilters);
	}

	filterValueChanged(filter, index, event) {
		let newFilters = cloneDeep(this.state.filters);
		newFilters[index] = {
			...filter,
			value: event.target.value,
		};
		this.setState({
			filters: newFilters,
		}, this.applyFilters);
	}

	applyFilters() {
		// Disable any filters that should be
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

			let query = this.filtersToQuery(this.state.filters);
			this.props.handleQueryChange(query);
		});
	}

	filtersToQuery(filters) {
		return filters.reduce((transformedFilters, filter) => {
			if (isEmpty(filter.operator) || filter.disabled || typeof filter.value === 'undefined' || (has(filter.operator, 'shouldApplyFilter') && !filter.operator.shouldApplyFilter(filter.value))) {
				return transformedFilters;
			}
			// TODO: we might not need to be as defensive below with the operator/operatorDef
			return [
				...transformedFilters,
				{
					field: filter.field,
					operator: has(filter, 'operator.operator')
						? filter.operator.operator // `operator` here is actually the operator definition, which contains the actual query operator inside
						: filter.operator,
					value: has(filter, 'operator.valueTransformer') && typeof filter.operator.valueTransformer === 'function'
						? filter.operator.valueTransformer(filter.value) // Use the transformer if given
						: filter.value,
				}
			];
		}, []);
	}

	getSummaryString(filter) {
		// Include the value if it's user-inputted, otherwise, the label should describe the filter completely
		return (!this.isFilterValueDefined(filter))
			? 'not yet defined'
			: (filter.operator.label || '') + (filter.operator.inputType === 'none' ? '' : ' ' + this.formatValue(filter));
	}

	isFilterValueDefined(filter) {
		if (filter.value && filter.value.length == 2 && (!filter.value[0] || !filter.value[1])) return false;
		if (filter.operator && filter.operator.inputType === 'datepicker' && !filter.value) return false;
		return true;
	}

	formatValue(filter) {
		// Format a filter's value based on its input type
		if (filter.operator.inputType === 'datepicker') {
			return $filter('date')(filter.value, filter.field === 'birthday' ? 'MMM d' : 'M/d/yyyy');
		} else if (filter.operator.inputType === 'daterange' && filter.value.length === 2) {
			let date1 = $filter('date')(filter.value[0], filter.field === 'birthday' ? 'MMM d' : 'M/d/yyyy');
			let date2 = $filter('date')(filter.value[1], filter.field === 'birthday' ? 'MMM d' : 'M/d/yyyy');
			return date1 + ' and ' + date2
		} else if (filter.operator.inputType === 'multiselect') {
			let noun = filter.filterDef.label.toLowerCase();
			if (noun === 'tags') noun = 'tag';
			return prettyList(filter.value, 3, noun, null, filter.operator.getItemTitle);
		} else if (filter.operator.inputType === 'select') {
			let chosenOption = find(filter.operator.options, {key: filter.value});
			return chosenOption ? chosenOption.value : '';
		}

		return `\"${filter.value}\"` || 'not yet defined';
	}

	addNewFilter(filterDef) {
		let newFilter = {
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
	}

	removeFilter(index) {
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
	}

	addFilter() {
		this.setState({
			activeFilterIndex: null,
			showFilterSelector: true,
		});
	}
	
	render() {
		let filters = this.state.filters.map((filter, index) => {
			let filterClasses = classnames(
				'rqb-filter-group__filter',
				{
					'rqb-filter-group__filter-summary': this.state.activeFilterIndex != index,
					'+disabled': filter.disabled,
				},
			);

			let disabledOverlay = (
				<div className="rqb-filter-group__disabled-overlay">
					{/* TODO: support a disabled message */}
				</div>
			);

			let operators = filter.filterDef.operators.map(operator => {
				let isOperatorSelected = filter.operator == operator;
				let input = isOperatorSelected ? (
					<FilterInput filterValue={filter.value} operator={filter.operator} onChange={this.filterValueChanged.bind(this, filter, index)} />
				) : null;
				return (
					<div key={operator.operator}>
						<label>
							<input type="radio" value={operator} checked={isOperatorSelected} onChange={this.filterOperatorChanged.bind(this, filter, index, operator)} />
							<span style={{marginLeft: '4px'}}>{operator.label}</span>
						</label>
						{input}
					</div>
				);
			});

			let editingFilter = (
				<div style={{marginTop: '8px'}}>
					{operators}
				</div>
			);

			let filterSummary = (
				<div>{this.getSummaryString(filter)}</div>
			);

			return (
				<div key={filter.field + index} className={filterClasses} onClick={this.setActiveFilterIndex.bind(this, index)}>
					{filter.disabled ? disabledOverlay : null}	
					<div>
						<a className="rqb-filter-group__close-filter" onClick={this.removeFilter.bind(this, index)}>
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
		});

		let newFilterSelector = (
			<div style={{paddingBottom: '8px'}} className="rqb-filter-group__filter">
				<h3 style={{marginTop: '0', marginBottom: '8px'}}>
					<strong>Start filtering by:</strong>
				</h3>
				{this.props.filterDefs.map(filterDef => (
					<div
						key={filterDef.field}
						onClick={this.addNewFilter.bind(this, filterDef)}
						className="rqb-filter-group__menu-item"
					>
						{filterDef.label}
					</div>
				))}
			</div>
		);

		let addFilterLink = (
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<a
					className="rqb-filter-group__button"
					style={{cursor: 'pointer'}}
					onClick={this.addFilter.bind(this)}
				>
					Add Filter
				</a>
			</div>
		);

		return (
			<div className="rqb-filter-group">
				{filters}	
				{this.state.showFilterSelector ? newFilterSelector : addFilterLink}
			</div>
		);
	}

};

QueryBuilder.propTypes = {
	filterDefs: React.PropTypes.array.isRequired,
	handleQueryChange: React.PropTypes.func.isRequired,
	initialFilters: React.PropTypes.array,
};

