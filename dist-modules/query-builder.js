'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.clonedeep');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.partial');

var _lodash6 = _interopRequireDefault(_lodash5);

require('../style.css');

var _filterInput = require('./filter-input.js');

var _filterInput2 = _interopRequireDefault(_filterInput);

var _queryBuilderHelpers = require('./query-builder-helpers.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueryBuilder = function (_React$Component) {
	_inherits(QueryBuilder, _React$Component);

	function QueryBuilder() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, QueryBuilder);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = QueryBuilder.__proto__ || Object.getPrototypeOf(QueryBuilder)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			filters: (0, _queryBuilderHelpers.setUpFilters)(_this.props.initialFilters),
			activeFilterIndex: null,
			showFilterSelector: true
		}, _this.filters = function () {
			return _react2.default.createElement(
				'div',
				null,
				_this.state.filters.map(function (filter, index) {
					var disabledOverlay = _react2.default.createElement('div', { className: 'rqb-filter-group__disabled-overlay' });

					var operators = filter.filterDef.operators.map(function (operator) {
						var isOperatorSelected = filter.operator == operator;
						var input = isOperatorSelected ? _react2.default.createElement(_filterInput2.default, { filterValue: filter.value, operator: filter.operator, onChange: (0, _lodash6.default)(_this.filterValueChanged, filter, index) }) : null;
						return _react2.default.createElement(
							'div',
							{ key: operator.operator },
							_react2.default.createElement(
								'label',
								null,
								_react2.default.createElement('input', { type: 'radio', value: operator, checked: isOperatorSelected, onChange: (0, _lodash6.default)(_this.filterOperatorChanged, filter, index, operator) }),
								_react2.default.createElement(
									'span',
									{ style: { marginLeft: '4px' } },
									operator.label
								)
							),
							input
						);
					});

					var editingFilter = _react2.default.createElement(
						'div',
						{ style: { marginTop: '8px' } },
						operators
					);

					var filterSummary = _react2.default.createElement(
						'div',
						null,
						(0, _queryBuilderHelpers.getSummaryString)(filter)
					);

					return _react2.default.createElement(
						'div',
						{
							key: filter.field + index,
							className: '\n\t\t\t\t\t\t\t\trqb-filter-group__filter\n\t\t\t\t\t\t\t\t' + (_this.state.activeFilterIndex !== index && 'rqb-filter-group__filter-summary') + '\n\t\t\t\t\t\t\t\t' + (filter.disabled && '+disabled') + '\n\t\t\t\t\t\t\t',
							onClick: (0, _lodash6.default)(_this.setActiveFilterIndex, index)
						},
						filter.disabled ? disabledOverlay : null,
						_react2.default.createElement(
							'div',
							null,
							_react2.default.createElement(
								'a',
								{ className: 'rqb-filter-group__close-filter', onClick: (0, _lodash6.default)(_this.removeFilter, index) },
								'\xD7'
							),
							_react2.default.createElement(
								'div',
								{ style: { marginBottom: '8px' } },
								_react2.default.createElement(
									'strong',
									null,
									filter.filterDef.label
								)
							),
							_this.state.activeFilterIndex == index ? editingFilter : filterSummary
						)
					);
				})
			);
		}, _this.addFilterLink = function () {
			return _react2.default.createElement(
				'div',
				{ style: { display: 'flex', justifyContent: 'center' } },
				_react2.default.createElement(
					'a',
					{
						className: 'rqb-filter-group__button',
						style: { cursor: 'pointer' },
						onClick: _this.addFilter
					},
					'Add Filter'
				)
			);
		}, _this.newFilterSelector = function () {
			return _react2.default.createElement(
				'div',
				{ style: { paddingBottom: '8px' }, className: 'rqb-filter-group__filter' },
				_react2.default.createElement(
					'h3',
					{ style: { marginTop: '0', marginBottom: '8px' } },
					_react2.default.createElement(
						'strong',
						null,
						'Start filtering by:'
					)
				),
				_this.props.filterDefs.map(function (filterDef) {
					return _react2.default.createElement(
						'div',
						{
							key: filterDef.field,
							onClick: (0, _lodash6.default)(_this.addNewFilter, filterDef),
							className: 'rqb-filter-group__menu-item'
						},
						filterDef.label
					);
				})
			);
		}, _this.setActiveFilterIndex = function (activeFilterIndex) {
			var filter = _this.state.filters[activeFilterIndex];
			if (filter && !filter.disabled) {
				_this.setState({
					activeFilterIndex: activeFilterIndex
				});
			}
		}, _this.filterOperatorChanged = function (filter, index, operator) {
			// Find filter in this.state.filters and update its operator to the given operator
			var newFilters = (0, _lodash4.default)(_this.state.filters);
			newFilters[index] = _extends({}, filter, {
				operator: operator,
				value: operator.defaultValue || ''
			});
			_this.setState({
				filters: newFilters
			}, _this.applyFilters);
		}, _this.filterValueChanged = function (filter, index, event) {
			var newFilters = (0, _lodash4.default)(_this.state.filters);
			newFilters[index] = _extends({}, filter, {
				value: event.target.value
			});
			_this.setState({
				filters: newFilters
			}, _this.applyFilters);
		}, _this.applyFilters = function () {
			// Disable any filters that should be disabled
			_this.setState({
				filters: _this.state.filters.map(function (filter) {
					return _extends({}, filter, {
						disabled: filter.filterDef.shouldDisableFilter && filter.filterDef.shouldDisableFilter(filter, _this.state.filters)
					});
				})
			}, function () {
				// Close the active filter if it should now be disabled
				if (_this.state.activeFilter && _this.state.activeFilter.disabled) _this.setState({
					activeFilterIndex: null
				});

				var query = (0, _queryBuilderHelpers.filtersToQuery)(_this.state.filters);
				_this.props.handleQueryChange(query);
			});
		}, _this.addNewFilter = function (filterDef) {
			var newFilter = {
				field: filterDef.field,
				operator: {},
				value: filterDef.defaultValue || '',
				filterDef: filterDef
			};
			_this.setState({
				filters: [].concat(_toConsumableArray(_this.state.filters), [newFilter]),
				activeFilterIndex: _this.state.filters.length,
				showFilterSelector: false
			});
		}, _this.removeFilter = function (index) {
			_this.setState({
				filters: _this.state.filters.filter(function (filter, i) {
					return index != i;
				})
			}, function () {
				_this.applyFilters();
				// If we just removed the active one, clear activeFilterIndex
				if (index === _this.state.activeFilterIndex) {
					_this.setState({
						activeFilterIndex: null
					});
				}
				// If we just removed the last filter, show the new filter create
				if ((0, _lodash2.default)(_this.state.filters)) {
					_this.addFilter();
				}
			});
		}, _this.addFilter = function () {
			_this.setState({
				activeFilterIndex: null,
				showFilterSelector: true
			});
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(QueryBuilder, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (!(0, _lodash2.default)(this.state.filters)) {
				this.applyFilters();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'rqb-filter-group' },
				this.filters(),
				this.state.showFilterSelector ? this.newFilterSelector() : this.addFilterLink()
			);
		}
	}]);

	return QueryBuilder;
}(_react2.default.Component);

exports.default = QueryBuilder;
;

QueryBuilder.propTypes = process.env.NODE_ENV !== "production" ? {
	filterDefs: _propTypes2.default.array.isRequired,
	handleQueryChange: _propTypes2.default.func.isRequired,
	initialFilters: _propTypes2.default.array
} : {};