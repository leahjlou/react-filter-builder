import isEmpty from 'lodash.isempty';

export default [
	{
		field: 'name',
		label: 'Name',
		operators: [
			{
				label: 'starts with',
				operator: 'beginswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'ends with',
				operator: 'endswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'contains',
				operator: 'contains',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
		]
	},
	{
		field: 'nickname',
		label: 'Nickname',
		operators: [
			{
				label: 'starts with',
				operator: 'beginswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'ends with',
				operator: 'endswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'contains',
				operator: 'contains',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'has any value',
				operator: 'ne',
				inputType: 'none',
				defaultValue: '',
			},
			{
				label: 'is blank',
				operator: 'eq',
				inputType: 'none',
				defaultValue: '',
			},
		]
	},
	{
		field: 'occupation',
		label: 'Occupation',
		operators: [
			{
				label: 'starts with',
				operator: 'beginswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'ends with',
				operator: 'endswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'contains',
				operator: 'contains',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'has any value',
				operator: 'ne',
				inputType: 'none',
				defaultValue: '',
			},
			{
				label: 'is blank',
				operator: 'eq',
				inputType: 'none',
				defaultValue: '',
			},
		]
	},
	{
		field: 'employer',
		label: 'Employer',
		operators: [
			{
				label: 'starts with',
				operator: 'beginswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'ends with',
				operator: 'endswith',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'contains',
				operator: 'contains',
				inputType: 'text',
				shouldApplyFilter: value => !isEmpty(value),
			},
			{
				label: 'has any value',
				operator: 'ne',
				inputType: 'none',
				defaultValue: '',
			},
			{
				label: 'is blank',
				operator: 'eq',
				inputType: 'none',
				defaultValue: '',
			},
		]
	},
];
