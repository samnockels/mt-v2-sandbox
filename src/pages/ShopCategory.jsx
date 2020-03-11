import React, { Component } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { ProductGrid, Product } from '../partials/ProductGrid';
import { chunk } from 'lodash';
import { history } from '../util/history';
import { useMediaQuery } from 'react-responsive';
import { Pagination, Typography, Button, Icon, Alert, Row, Avatar } from 'antd';
const { Title } = Typography;

const ShopCategory = withRouter(
	class extends Component {
		state = {
			current: 1,
			pageSize: 20,
		};

		onChange = page => {
			this.setState({ current: page });
		};

		onShowSizeChange = (page, pageSize) => {
			this.setState({ current: page, pageSize });
		};

		render() {
			let categoryToDisplay = false;
			console.log(this.props.productsByCategory);
			this.props.productsByCategory.forEach(cat => {
				if (cat._id === this.props.match.params.categoryId) {
					categoryToDisplay = cat;
				}
			});
			if (!categoryToDisplay || !Array.isArray(categoryToDisplay.products)) {
				return <Alert type="error" message="Category not found." />;
			}

			const startIdx = (this.state.current - 1) * this.state.pageSize;
			const endIdx = startIdx + this.state.pageSize;
			const productsForPage = categoryToDisplay.products.slice(startIdx, endIdx);
			const shouldShowSizeChanger = categoryToDisplay.products.length > 20;
			const pageSizeOptions = ['20', '30', '40', '50', '100'];
			console.log(chunk(productsForPage, this.props.productsPerRow));
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
						<Avatar size={60} icon="tag" style={{ marginRight: 20 }} />
						{categoryToDisplay.name}
					</Title>
					<Pagination
						showSizeChanger={shouldShowSizeChanger}
						current={this.state.current}
						onChange={this.onChange}
						onShowSizeChange={this.onShowSizeChange}
						total={categoryToDisplay.products.length}
						pageSizeOptions={pageSizeOptions}
						size="small"
						showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
						style={{ marginBottom: 50, width: '100%', textAlign: 'right' }}
					/>
					{chunk(productsForPage, this.props.productsPerRow).map((products, idx) => (
						<Row gutter={24} style={{ marginBottom: 10 }}>
							{products.map(product => (
								<Link to={`/product/${product.slug}`} key={idx}>
									<Product product={product} span={parseInt(24 / this.props.productsPerRow)} />
								</Link>
							))}
						</Row>
					))}
					<Pagination
						showSizeChanger={shouldShowSizeChanger}
						current={this.state.current}
						onChange={this.onChange}
						onShowSizeChange={this.onShowSizeChange}
						total={categoryToDisplay.products.length}
						pageSizeOptions={pageSizeOptions}
						size="small"
						showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
						style={{ marginTop: 50, width: '100%', textAlign: 'right' }}
					/>
				</div>
			);
		}
	}
);

const ShopCategoryResponsive = props => {
	const isDefault = useMediaQuery({ maxWidth: 480 });
	const isSmall = useMediaQuery({ maxWidth: 575 });
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const productsPerRow = isDefault ? 1 : isSmall ? 2 : isMobile ? 3 : 4;
	return <ShopCategory {...props} productsPerRow={productsPerRow} />;
};

export default ShopCategoryResponsive;
