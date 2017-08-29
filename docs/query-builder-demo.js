import React from 'react';
import QueryBuilder from '../src/query-builder.js';
import demoFilterDefs from './demo-filter-defs.js';

export default class QueryBuilderDemo extends React.Component {
	state = {
		query: '',
	}

	render() {
		return (
			<div style={{display: 'flex'}}>
				<div style={{width: '300px', marginBottom: '24px'}}>
					<QueryBuilder
						filterDefs={demoFilterDefs}
						handleQueryChange={this.handleQueryChange}
					/>
				</div>
				<div>
					<h3>Preview of query:</h3>
					<pre>
						{this.state.query}
					</pre>
				</div>
			</div>
		);
	}
	
	handleQueryChange = query => {
		this.setState({
			query: JSON.stringify(query, null, '  '),
		});
	};

}
