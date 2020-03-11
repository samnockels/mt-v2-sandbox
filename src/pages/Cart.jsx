import React, { Component } from 'react';
import { history } from '../util/history';
import { DeliveryMethodTag } from '../components/DeliveryMethodTag';
import { Row, Col, Tag, Icon, Button, Typography, List, Empty, Table, Avatar, InputNumber, Spin } from 'antd';
import { CartItemsList } from './Checkout';
import { useMediaQuery } from 'react-responsive';
const { Text, Title } = Typography;

class Cart extends Component {
	state = {
		cart: this.props.cart,
		refreshing: false,
	};
	componentDidUpdate(prevProps) {
		// if (JSON.stringify(prevProps) !== JSON.stringify(this.props.cart)) {
		// 	this.setState({ refreshing: true }, () => {
		// 		this.setState({ cart: this.state.cart }, () => {
		// 			this.setState({ refreshing: false });
		// 		});
		// 	});
		// }
	}
	columns() {
		return [
			{
				title: '',
				width: 200,
				align: 'center',
				key: 'avatar',
				render: item => {
					return (
						<Avatar
							shape="circle"
							size={64}
							src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${item.parentProduct.sku}.png?alt=media`}
						/>
					);
				},
			},
			{
				title: 'Product',
				dataIndex: 'title',
			},
			{
				title: 'Delivery Method',
				dataIndex: 'deliveryMethod',
				width: 250,
				render: (deliveryMethod, item) => {
					return (
						<DeliveryMethodTag
							deliveryMethod={deliveryMethod}
							additionalFields={item.additionalFields}
							showAdditionalFields={true}
						/>
					);
				},
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				width: 100,
				render: (quantity, item) => {
					return (
						<InputNumber
							value={quantity}
							onChange={val => {
								this.props.updateCartItemQuantity(item.cartHash, val);
							}}
						/>
					);
				},
			},
			{
				title: 'Unit Price',
				dataIndex: 'totals.unitPrice',
				width: 100,
			},
			{
				title: 'Total',
				dataIndex: 'totals.subTotal',
				width: 100,
				render: value => <b>{value}</b>,
			},
			{
				title: '',
				width: 50,
				align: 'center',
				key: 'remove',
				render: item => {
					return (
						<Button
							icon="close"
							type="danger"
							shape="circle"
							size="small"
							ghost
							onClick={() => {
								this.props.removeCartItem(item.cartHash);
							}}
						/>
					);
				},
			},
		];
	}
	render() {
		if (!this.props.cart || !this.props.cart.items || !Object.keys(this.props.cart.items).length) {
			return (
				<Empty
					style={{ padding: '100px 0px' }}
					image={<Icon type="shopping-cart" style={{ fontSize: '50px' }} />}
					imageStyle={{ height: '60px' }}
					description={<span>Cart empty!</span>}
				>
					<Button
						type="primary"
						onClick={() => {
							history.push('/');
						}}
					>
						Start Shopping
					</Button>
				</Empty>
			);
		}

		return (
			<Spin spinning={this.state.refreshing} indicator={<Icon type="loading" />}>
				<Table
					bordered
					rowKey="cartHash"
					columns={this.columns()}
					dataSource={Object.values(this.props.cart.items)}
					pagination={false}
					size="small"
				/>
			</Spin>
		);
	}
}

const CartContainer = props => {
	const isMobile = useMediaQuery({ maxWidth: 991 });
	const cart = isMobile ? (
		<CartItemsList
			cart={props.cart}
			updateCartItemQuantity={props.updateCartItemQuantity}
			style={{
				maxWidth: 'unset',
				width: '100%',
			}}
		/>
	) : (
		<Cart {...props} />
	);

	return (
		<div>
			<Row>
				<Title level={2} style={{ marginBottom: '30px' }}>
					Cart
				</Title>
				{cart}
			</Row>
			<Row style={{ paddingTop: '50px' }}>
				<Col xs={24} md={9} style={{ float: 'right' }}>
					{!isMobile && (
						<List
							bordered
							renderItem={(value, index) => {
								return (
									<List.Item key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
										<Text strong>{index === 0 && 'Total:'}</Text>
										<Text>{value}</Text>
									</List.Item>
								);
							}}
							dataSource={[props.cart.total]}
						/>
					)}

					<Button
						type="primary"
						size="large"
						block
						style={{
							marginTop: '30px',
						}}
						onClick={() => {
							history.push('/checkout');
						}}
					>
						Proceed to Checkout
					</Button>
				</Col>
			</Row>
		</div>
	);
};

export default CartContainer;
