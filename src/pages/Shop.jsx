import React, { Component } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router';
import { ProductGrid } from '../partials/ProductGrid';
import { orderBy } from 'lodash';
import { history } from '../util/history';
import { Pagination, Typography, Button, Icon } from 'antd';
const { Title } = Typography;

const Shop = withRouter(
	class extends Component {
		state = {
			current: 1,
			pageSize: 2,
		};

		onChange = page => {
			this.setState({ current: page });
		};

		onShowSizeChange = (page, pageSize) => {
			this.setState({ current: page, pageSize });
		};

		render() {
			const categoriesToDisplay = this.props.productsByCategory.filter(
				category => category.products.length > 0
			);
			const categoriesInOrder = orderBy(
				categoriesToDisplay,
				[category => category.products.length],
				['desc']
			);
			const startIdx = (this.state.current - 1) * this.state.pageSize;
			const endIdx = startIdx + this.state.pageSize;
			const categoriesForPage = categoriesInOrder.slice(startIdx, endIdx);
			const shouldShowSizeChanger = categoriesToDisplay.length > 20;
			const pageSizeOptions = ['20', '30', '40', '50', '100'];
			return (
				<div>
					<Title
						style={{
							padding: '20px 0px 60px 0px',
							margin: '0px 0px 25px 0px',
							borderBottom: '3px solid #f3f3f3',
							textAlign: 'center',
						}}
					>
						Shop
					</Title>
					<Pagination
						showSizeChanger={shouldShowSizeChanger}
						current={this.state.current}
						onChange={this.onChange}
						onShowSizeChange={this.onShowSizeChange}
						total={categoriesInOrder.length}
						pageSizeOptions={pageSizeOptions}
						size="small"
						showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} categories`}
						style={{ marginBottom: 50, width: '100%', textAlign: 'right' }}
					/>
					{categoriesForPage.map((category, idx) => {
						if (category.products.length === 0) {
							return null;
						}
						return (
							<ProductGrid
								key={idx}
								heading={
									<>
										{category.name}{' '}
										<Button
											type="link"
											onClick={() => history.push(`/shop/${category._id}`)}
											style={{ marginLeft: 20 }}
										>
											See More <Icon type="arrow-right" />
										</Button>
									</>
								}
								products={category.products}
								style={{ padding: '60px 5px 0px' }}
							/>
						);
					})}
					<Pagination
						showSizeChanger={shouldShowSizeChanger}
						current={this.state.current}
						onChange={this.onChange}
						onShowSizeChange={this.onShowSizeChange}
						total={categoriesInOrder.length}
						pageSizeOptions={pageSizeOptions}
						size="small"
						showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} categories`}
						style={{ marginTop: 50, width: '100%', textAlign: 'right' }}
					/>
				</div>
			);
		}
	}
);

export default Shop;
