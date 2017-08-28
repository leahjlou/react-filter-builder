# cpr-query-builder

A React component for building queries/filters.

![Demo](demo.gif)

The `QueryBuilder` component provides a simple UI to build a query (or set of filters) for a data set, based on custom filters and operators.

It is intended to build [Json-Query-Language](https://github.com/CanopyTax/Json-Query-Language), but operators can be defined and handled however you want.

## Installation

`npm install cpr-query-builder`

For default styles, you'll also need to load the stylesheet `style.css`

## Usage

### Props

+ [`filterDefs`](#filterdefs): **(required)** an array of objects that define all possible filters that can be applied to the query
+ `handleQueryChange`: **(required)** a function that gets called every time the query changes, to be called with one argument: the new query
+ [`initialFilters`](#initial-filters-optional): _(optional)_ filters with which to initialize

### Simple Usage

```javascript
import QueryBuilder from 'react-query-builder';

let myFilterDefs = [
  {
    field: 'name',
    label: 'Name',
    operators: [
      {
        label: 'Is',
        operator: 'eq',
        inputType: 'text',
      }
    ],
  }
];

function handleQueryChange(query) {
  // Do stuff with the query
}

<QueryBuilder filterDefs={myFilterDefs} handleQueryChange={handleQueryChange} />
```

### filterDefs

`filterDefs` is an array of objects that define all possible filters that can be applied to the query. Each object in the array has the following fields:

+ `field`: **(required)** the field on which to filter, will be passed into the query (i.e. 'first_name')
+ `label`: **(required)** the display label for the filter (i.e. 'First Name')
+ [`operators`](#operators): **(required)** an array of operator objects that are supported on this filter (see [`operators`](#operators) below)
+ `shouldDisableFilter`: _(optional)_ a function to determine whether the filter should be disabled. When disabled, a filter will not appear in the list of available filters, and any currently applied filters of that type will be "grayed out" in the list and not included in the query. This is useful for indicating that a filter is "incompatible" with something else.

Example:

```javascript
let myFilterDefs = [
  {
    field: 'first_name',
    label: 'First Name',
    operators: [/* see section on operators below */],
    shouldDisableFilter: () => true,
  },
];
```

### Operators

`operators`, within each filterDef object, is an array of operator objects that describes which operators are supported by the filter and what the input type should look like for that operator.

For example, a `first_name` filter might support an operator called "startswith" and use a text input, while a `created_on` filter might support an operator called "between" and use a datepicker range input.

Each operator object has (or can have) the following fields:

+ `operator`: **(required)** the operator value to be passed to the query (i.e. 'in')
+ `label`: **(required)** the display label for the operator, displayed as a radio button option within a filter (i.e. 'is any of')
+ `inputType`: **(required)** the input type to display for that operator. Supported values are 'text' and 'none' (use a `defaultValue`, see below)
+ `defaultValue`: _(optional)_ the default value for a filter. This is especially useful if you want your operator to have an `inputType` of 'none' to have a "hard-coded" filter.
+ `shouldApplyFilter`: _(optional)_ a function to determine whether to apply the filter to the query, to be called with one argument: the current user-entered value. This is useful if you don't want to apply, say, filters with empty strings.
+ `valueTransformer`: _(optional)_ a function to transform your value before applying to the query, to be called with one argument: the current user-entered value.

Example:

```javascript
let myOperators = [
  {
    label: 'Starts With',
    operator: 'startswith',
    inputType: 'text',
    shouldApplyFilter: value => value && value.length > 0,
    valueTransformer: value => 'foo' + value,
  },
  {
    operator: 'eq',
    label: 'Is Empty',
    inputType: 'none',
    defaultValue: null,
  },
];
```

### Query

The query passed to your `handleQueryChange` function will be an array of objects, each with three fields: `field`, `operator`, and `value`.

### Initial Filters (optional)

Optionally, you can pass an array of filters to initialize the component. Each filter should have the following fields:

+ `field`: the filtered field
+ `operatorIndex`: the index (in `operators` of the filtered field's filterDef) of the applied operator. _(This has to be an index because a filter can have multiple operators with the same `operator` string.)_
+ `value`: the value

Example:

```javascript
let myInitialFilters = {
  field: 'first_name',
  operatorIndex: 0,
  value: 'jim',
}
```

## Development

1. Clone this repo
2. `cd react-query-builder`
3. `npm install`
4. `npm run watch`
5. Open `demo/index.html`

