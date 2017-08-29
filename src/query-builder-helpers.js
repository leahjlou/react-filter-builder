import isEmpty from 'lodash.isempty';
import has from 'lodash.has';

export function setUpFilters(filters) {
	if (isEmpty(filters)) {
		return [];
	}

	// Add filterDef and operator metadata to the filters
	return filters.map(filter => {
		const filterDef = this.props.filterDefs.find(def => def.field === filter.field);
		return {
			...filter,
			filterDef,
			operator: filterDef && filter.operatorIndex >= 0 ? filterDef.operators[filter.operatorIndex] : {},
		};
	});
}

export function filtersToQuery(filters) {
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

export function getSummaryString(filter) {
	// Include the value if it's user-inputted, otherwise, the label should describe the filter completely
	return (!isFilterValueDefined(filter))
		? 'not yet defined'
		: (filter.operator.label || '') + (filter.operator.inputType === 'none' ? '' : ' ' + formatValue(filter));
}

function isFilterValueDefined(filter) {
	if (filter.value && filter.value.length == 2 && (!filter.value[0] || !filter.value[1])) return false;
	if (filter.operator && filter.operator.inputType === 'datepicker' && !filter.value) return false;
	return true;
}

function formatValue(filter) {
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


