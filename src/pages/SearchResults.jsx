import React, { Component } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router';
import { ProductGrid } from '../partials/ProductGrid';
import { orderBy } from 'lodash';
import { history } from '../util/history';
import Fuse from 'fuse.js';
import { Row, Pagination, Typography, Button, Icon, Skeleton, List, Avatar, Tag } from 'antd';
const { Title, Text } = Typography;

const SearchResults = withRouter(
	class extends Component {
		state = {
			current: 1,
			pageSize: 10,
			productResults: false,
			categoriesResults: false,
		};

		componentDidMount() {
			const options = {
				shouldSort: true,
				threshold: 0.6,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
			};
			const searchText = this.props?.match?.params?.searchText || '';
			const productSearcher = new Fuse(this.props.products, { ...options, keys: ['title', 'sku'] });
			const categoriesSearcher = new Fuse(this.props.productsByCategory, { ...options, keys: ['name'] });
			const productResults = productSearcher.search(searchText);
			const categoriesResults = categoriesSearcher.search(searchText);
			this.setState({ productResults, categoriesResults });
		}

		onChange = page => {
			this.setState({ current: page });
		};

		onShowSizeChange = (page, pageSize) => {
			this.setState({ current: page, pageSize });
		};

		render() {
			const searchText = this.props?.match?.params?.searchText || '';
			if (this.state.productResults === false || this.state.categoriesResults === false) {
				return <Skeleton loading title={`Searching for '${this.state.searchText}'`} />;
			}
			if (!Array.isArray(this.state.productResults) || !Array.isArray(this.state.categoriesResults)) {
				return 'error';
			}

			const results = [
				<List.Item style={{ textAlign: 'center' }}>
					<Text>
						<Tag color="blue">{this.state?.productResults?.length}</Tag> Product
						{this.state?.productResults?.length > 1 ? 's' : ''}
					</Text>
				</List.Item>,
			]
				.concat(
					this.state.productResults.map(product => {
						return (
							<List.Item
								style={{ cursor: 'pointer' }}
								onClick={() => history.push(`/product/${product.slug}`)}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											size={60}
											src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${product.sku}.png?alt=media`}
										/>
									}
									title={<a onClick={() => history.push(`/product/${product.slug}`)}>{product.title}</a>}
									description={product.categories.map(cat => (
										<Tag>{cat}</Tag>
									))}
								/>
							</List.Item>
						);
					})
				)
				.concat([
					<List.Item style={{ textAlign: 'center' }}>
						<Text>
							<Tag color="blue">{this.state?.categoriesResults?.length}</Tag> Categor
							{this.state?.productResults?.length > 1 ? 'ies' : 'y'}
						</Text>
					</List.Item>,
				])
				.concat(
					this.state.categoriesResults.map(category => {
						return (
							<List.Item style={{ cursor: 'pointer' }} onClick={() => history.push(`/shop/${category._id}`)}>
								<List.Item.Meta
									avatar={<Avatar size={60} icon="tag" />}
									title={<a onClick={() => history.push(`/shop/${category._id}`)}>{category.name}</a>}
									description={`${category?.products?.length} products`}
								/>
							</List.Item>
						);
					})
				);

			const startIdx = (this.state.current - 1) * this.state.pageSize;
			const endIdx = startIdx + this.state.pageSize;

			const resultsForPage = results.slice(startIdx, endIdx);
			const shouldShowSizeChanger = results.length > 10;

			return (
				<div>
					<Row
						style={{
							padding: '20px 0px 60px 0px',
							margin: '0px 0px 25px 0px',
							borderBottom: '3px solid #f3f3f3',
							textAlign: 'center',
						}}
					>
						<Title>Search</Title>
					</Row>
					<Row>
						<Text>Showing results for '{searchText}'</Text>
						<Pagination
							showSizeChanger={shouldShowSizeChanger}
							current={this.state.current}
							onChange={this.onChange}
							onShowSizeChange={this.onShowSizeChange}
							total={results.length}
							size="small"
							showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} results`}
							style={{ marginBottom: 50, width: '100%', textAlign: 'right' }}
						/>
					</Row>
					<Row>
						<List bordered size="large">
							{results}
						</List>
					</Row>
					<Row>
						<Pagination
							showSizeChanger={shouldShowSizeChanger}
							current={this.state.current}
							onChange={this.onChange}
							onShowSizeChange={this.onShowSizeChange}
							total={results.length}
							size="small"
							showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} results`}
							style={{ marginTop: 50, width: '100%', textAlign: 'right' }}
						/>
					</Row>
				</div>
			);
		}
	}
);

export default SearchResults;
