import React, { Component } from 'react';
import Highlighter from 'react-highlight-words';
import { compact } from 'lodash';
import { history } from '../util/history';
import { Row, Icon, AutoComplete, Input, Avatar, Button, Tag, List } from 'antd';
const { Option, OptGroup } = AutoComplete;

export const SearchResultsAsList = ({ searchText, categoriesResults, productResults, close }) => {
	const renderTitle = (title, count) => {
		return (
			<List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{title}
				<Tag color="blue" style={{ float: 'right' }}>
					{count} result{count > 1 ? 's' : ''}
				</Tag>
			</List.Item>
		);
	};
	const products = productResults.map(product => (
		<List.Item
			onClick={() => {
				history.push(`/product/${product.slug}`);
				close();
			}}
		>
			<List.Item.Meta
				avatar={
					<Avatar
						shape="square"
						size={30}
						src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${product.sku}.png?alt=media`}
						style={{ marginRight: 10 }}
					/>
				}
				title={
					<Highlighter
						highlightStyle={{ backgroundColor: 'unset', padding: 0, borderBottom: '1px solid black' }}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={product.title}
					/>
				}
			/>
		</List.Item>
	));
	const categories = categoriesResults.map(category => (
		<List.Item
			onClick={() => {
				history.push(`/shop/${category._id}`);
				close();
			}}
		>
			<List.Item.Meta
				avatar={<Avatar size={30} icon="tag" style={{ marginRight: 10 }} />}
				title={
					<Highlighter
						highlightStyle={{ backgroundColor: 'unset', padding: 0, borderBottom: '1px solid black' }}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={category.name}
					/>
				}
			/>
		</List.Item>
	));
	return (
		<List bordered style={{ overflowY: 'scroll' }}>
			{renderTitle('Products', products.length)}
			{products}
			{renderTitle('Categories', categories.length)}
			{categories}
			{(products.length > 0 || categories.length > 0) && (
				<List.Item>
					<Button
						type="link"
						size="large"
						block
						onClick={() => {
							history.push(`/search/${searchText}`);
							close();
						}}
					>
						See all results
					</Button>
				</List.Item>
			)}
		</List>
	);
};

export const renderSearchResults = (searchText, categoriesResults, productResults) => {
	const renderTitle = (title, count) => {
		return (
			<span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{title}
				<Tag color="blue" style={{ float: 'right' }}>
					{count} result{count > 1 ? 's' : ''}
				</Tag>
			</span>
		);
	};
	const products = productResults.map(product => (
		<Option key={`/product/${product.slug}`} value={product.title}>
			<Avatar
				shape="square"
				size={30}
				src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${product.sku}.png?alt=media`}
				style={{ marginRight: 10 }}
			/>
			<Highlighter
				highlightStyle={{ backgroundColor: 'unset', padding: 0, borderBottom: '1px solid black' }}
				searchWords={[searchText]}
				autoEscape
				textToHighlight={product.title}
			/>
		</Option>
	));
	const categories = categoriesResults.map(category => (
		<Option key={`/shop/${category._id}`} value={category.name}>
			{category.name}
		</Option>
	));
	return compact([
		<OptGroup key="products" label={renderTitle('Products', products.length)}>
			{products}
		</OptGroup>,
		<OptGroup key="categories" label={renderTitle('Categories', categories.length)}>
			{categories}
		</OptGroup>,
		searchText.length > 0 && (
			<Option key={`/search/${searchText}`} value={searchText} style={{ marginTop: 15, textAlign: 'center' }}>
				<a>See all {products.length + categories.length} results</a>
			</Option>
		),
	]);
};

export class Search extends Component {
	state = {
		productResults: [],
		categoriesResults: [],
		searchText: '',
		ready: false,
		error: false,
		value: null,
	};

	onSearch = value => {
		const results = window.makeSearch(value);
		this.setState({
			...results,
			value,
		});
	};

	onSelect = (value, option) => {
		this.setState({ value });
		history.push(option.key);
		if (typeof this.props.onSelect === 'function') {
			this.props.onSelect(value, option);
		}
	};

	render() {
		let extraProps = this.props.searchProps || {};
		let inputProps = this.props.inputProps || {};
		return (
			<AutoComplete
				placeholder="Search"
				onSelect={this.onSelect}
				onSearch={this.onSearch}
				style={{ width: '100%', maxWidth: 350, borderWidth: 0 }}
				dataSource={renderSearchResults(
					this.state.searchText,
					this.state.categoriesResults,
					this.state.productResults
				)}
				optionLabelProp="value"
				g
				{...extraProps}
			>
				<Input suffix={<Icon type="search" />} style={{ borderWidth: 0 }} {...inputProps} />
			</AutoComplete>
		);
	}
}
