import React, { Component } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ProductGrid } from '../partials/ProductGrid';

export default class Homepage extends Component {
	render() {
		return (
			<>
				{this.props.homepageProducts.map((productRow, idx) => {
					return <ProductGrid key={idx} heading={productRow.name} products={productRow.products} />;
				})}
			</>
		);
	}
}
