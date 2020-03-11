import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { history } from '../util/history';

import { isoCountryCodes } from '../../../../both/data/isoCountryCodes';
import { Order } from '~/imports/both/models';
import ThankYou from './ThankYou';
import { DeliveryMethodTag } from '../components/DeliveryMethodTag';
import Dinero from 'dinero.js';

import {
	Button,
	Row,
	Col,
	Card,
	List,
	Input,
	Empty,
	Spin,
	Avatar,
	Typography,
	message,
	Icon,
	Badge,
	Skeleton,
	Radio,
	Alert,
	InputNumber,
} from 'antd';
import styled from 'styled-components';
const { Title, Text } = Typography;

const DebitCreditCardPaymentButton = styled.button`
	background-color: #2f54eb;
	font-size: 1rem;
	padding: 10px 40px;
	border-radius: 5px;
	width: 100%;
	color: white;
	outline: none;
	border: 0;
	cursor: pointer;
	&:hover {
		background-color: #2849ce;
		text-decoration: underline;
	}
`;

export const CartItemsList = props => {
	let { cart, refreshing, style } = props;
	if (typeof style !== 'object') {
		style = {};
	}
	console.log(props);
	return (
		<List
			style={{
				maxWidth: 500,
				padding: '13px 24px 12px 22px',
				margin: '18px 0px 0px 0px',
				backgroundColor: '#fff',
				border: '1px solid #ededed',
				borderRadius: 10,
				...style,
			}}
		>
			{refreshing ? (
				<Skeleton loading active title={false} paragraph={{ rows: 4, width: 400 }} />
			) : (
				<>
					{Object.keys(cart.items).map((cartHash, idx) => {
						let item = cart.items[cartHash];
						return (
							<List.Item
								key={cartHash}
								style={{
									padding: '10px 0px',
									...(idx < Object.keys(cart.items).length - 1
										? { borderBottom: '1px dashed #e8e8e8' }
										: { borderBottom: 0 }),
								}}
							>
								<List.Item.Meta
									style={{ alignItems: 'center' }}
									avatar={
										<Avatar
											shape="square"
											size={70}
											src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${item.parentProduct.sku}.png?alt=media`}
											style={{
												backgroundColor: '#fff',
												border: '1px solid #dddddd',
												borderRadius: 10,
												padding: 5,
											}}
										/>
									}
									title={item.title}
									description={<DeliveryMethodTag deliveryMethod={item.deliveryMethod} />}
								/>
								{props.updateCartItemQuantity ? (
									<InputNumber
										value={item.quantity}
										onChange={val => props.updateCartItemQuantity(item.cartHash, val)}
										style={{ marginRight: 10 }}
									/>
								) : (
									<Text style={{ marginRight: 100 }}>x{item.quantity}</Text>
								)}

								<Text strong style={{ textAlign: 'right', color: '#323232' }}>
									{item.totals.subTotal}
								</Text>
							</List.Item>
						);
					})}
					<List.Item
						style={{ padding: '30px 0px 12px 0px', alignItems: 'center', justifyContent: 'space-between' }}
					>
						<Title level={4} strong style={{ color: '#323232', margin: 0 }}>
							Total
						</Title>
						<Title level={4} strong style={{ color: '#323232', margin: 0 }}>
							{cart.total}
						</Title>
					</List.Item>
				</>
			)}
		</List>
	);
};

const BillingAddress = ({ billingAddress }) => (
	<div style={{ marginBottom: 50 }}>
		<Title level={4}>Billing Address</Title>
		<Text>This address should match your card or payment method.</Text>
		<Card style={{ marginTop: 20, borderRadius: 10 }}>
			<Row type="flex" style={{ flexDirection: 'column' }}>
				<Text>
					{billingAddress?.firstName} {billingAddress?.lastName}
				</Text>
				<Text>{billingAddress?.address1}</Text>
				{billingAddress?.address2 && <Text>{billingAddress?.address2}</Text>}
				<Text>{billingAddress?.city}</Text>
				<Text>{billingAddress?.stateProvinceRegion}</Text>
				<Text>{isoCountryCodes[billingAddress?.country]?.name}</Text>
				<Text>{billingAddress?.zipPostcode}</Text>
				<Button type="link" style={{ marginTop: 10 }} onClick={() => history.push('/account/manage')}>
					Change
				</Button>
			</Row>
		</Card>
	</div>
);

const PayPalLogo = ({ paymentMethodName }) => {
	//prettier-ignore
	const paypalLogo = <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" border="0"/>;
	//prettier-ignore
	const paypalLogoWithAvailableCards = <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/AM_mc_vs_ms_ae_UK.png" border="0"/>
	if (paymentMethodName === 'ppec') return paypalLogo;
	if (paymentMethodName === 'pro') return paypalLogoWithAvailableCards;
	return paypalLogo;
};

class PaymentMethods extends Component {
	state = {
		selectedPaymentMethod: null,
	};

	onChange = e => {
		console.log('radio checked', e.target.value);
		this.setState({
			selectedPaymentMethod: e.target.value,
		});
	};

	paymentMethodsAvailable() {
		return (
			this.props.paymentMethods &&
			Array.isArray(this.props.paymentMethods) &&
			this.props.paymentMethods.length > 0
		);
	}

	render() {
		const { cart, paymentMethods, navigatingAway, refreshing } = this.props;
		const radioStyle = {
			display: 'block',
			height: 'auto',
		};
		console.log(this.state.selectedPaymentMethod);
		return (
			<div>
				<Title level={4}>Payment</Title>
				<Text>All transactions are secure and encrypted.</Text>
				<br />
				{refreshing ? (
					<Skeleton loading active title={false} paragraph={{ rows: 4, width: 400 }} />
				) : (
					<>
						<Radio.Group
							onChange={this.onChange}
							value={this.state.selectedPaymentMethod}
							style={{ marginTop: 20 }}
						>
							{paymentMethods.map((paymentMethod, idx) => {
								return (
									<Radio style={radioStyle} value={paymentMethod.name} key={idx}>
										{['ppec', 'pro'].includes(paymentMethod.name) ? (
											<PayPalLogo paymentMethodName={paymentMethod.name} />
										) : (
											paymentMethod.title
										)}
									</Radio>
								);
							})}
						</Radio.Group>
						{this.paymentMethodsAvailable() ? (
							<Button
								style={{ margin: '20px 0px' }}
								block
								type="primary"
								size="large"
								onClick={() => this.props.pay(this.state.selectedPaymentMethod)}
								disabled={!this.state.selectedPaymentMethod}
							>
								Pay
							</Button>
						) : (
							<Alert type="info" message="No payment methods are available at this time." />
						)}
					</>
				)}
			</div>
		);
	}
}

export default class Checkout extends Component {
	state = {
		refreshingCart: true,
		inPaymentFlow: false,
		placingOrder: false,
		placedOrder: false,
		paymentMethods: [],
	};

	componentDidMount() {
		this.refreshCartAndGetPaymentMethods();
	}

	componentDidUpdate(prevProps) {
		const cartUpdated = JSON.stringify(this.props.cart) !== JSON.stringify(prevProps.cart);
		if (cartUpdated) {
			this.getPaymentMethods();
		}
	}

	refreshCartAndGetPaymentMethods() {
		const self = this;
		self.setState({ refreshingCart: true }, () => {
			this.props.refreshCart(() => {
				this.getPaymentMethods(() => {
					self.setState({ refreshingCart: false });
				});
			});
		});
	}

	getPaymentMethods(done) {
		this.setState({ fetchingPaymentMethods: true }, () => {
			Meteor.call('api.getPaymentMethods', (err, res) => {
				if (err) {
					this.setState({ paymentMethods: [], fetchingPaymentMethods: false });
					console.log(err);
					if (typeof done === 'function') done();
					return;
				}
				console.log('payment methods', JSON.stringify(res, null, 2));
				this.setState({ paymentMethods: res, fetchingPaymentMethods: false });
				if (typeof done === 'function') done();
			});
		});
	}

	pay(paymentMethod) {
		this.createOrderIntent(paymentMethod, paymentLink => {
			// order intent created, now go to payment method
			this.navigatingAway();
			location.href = paymentLink;
		});
	}

	createOrderIntent(paymentMethod, done) {
		this.setState({
			inPaymentFlow: false,
			placingOrder: true,
		});
		console.log('Placing order. Cart:', JSON.stringify(this.props.cart, null, 2));
		Meteor.call('api.createOrderIntent', this.props.cart, paymentMethod, (err, res) => {
			if (err || !res?.paymentLink) {
				if (err?.error === 'mt.unauthorized') {
					message.info('Please log in to continue');
				} else if (err?.error === 'mt.notVerifiedEmail') {
					message.info('Please verify your email to continue');
				} else if (err?.error === 'mt.invalidPaymentMethod') {
					message.info('That payment method is not available at this time.');
				} else if (
					err?.error === 'mt.cannotGetPaymentLink' ||
					err?.error === 'mt.cannotCreateIntent' ||
					!res?.paymentLink
				) {
					message.error(
						'Cannot initiate payment. This could be to do with your billing details. Please contact support for assistance.'
					);
				} else {
					message.error('An unknown error has occurred. Please contact support.');
				}
				this.setState({
					inPaymentFlow: false,
					placingOrder: false,
				});
			} else {
				if (typeof done === 'function') done(res.paymentLink);
			}
		});
	}

	navigatingAway() {
		this.setState({ placingOrder: false, inPaymentFlow: true });
	}

	render() {
		const { cart, user } = this.props;
		console.log(cart, user);

		if (Object.keys(cart.items).length === 0) {
			return (
				<Empty
					image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
					imageStyle={{
						height: 60,
					}}
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
			<Spin
				spinning={this.state.placingOrder || this.state.inPaymentFlow}
				tip={this.state.inPaymentFlow ? 'Going to payment page' : 'Placing Order'}
				indicator={<Icon type="loading" />}
			>
				{/* <TopBanner /> */}
				<Row type="flex" style={{ padding: '0px' }}>
					<Col
						xs={24}
						lg={12}
						style={{
							padding: 50,
							backgroundColor: '#fafafa',
						}}
					>
						<div
							style={{
								maxWidth: 700,
								float: 'right',
							}}
						>
							<Title level={4}>Your Order</Title>
							<CartItemsList refreshing={this.state.refreshingCart} cart={cart} />
						</div>
					</Col>
					<Col
						xs={24}
						lg={12}
						style={{
							padding: 50,
							backgroundColor: '#fff',
							borderLeft: '1px solid #ededed',
						}}
					>
						<div
							style={{
								maxWidth: 700,
								float: 'left',
							}}
						>
							<BillingAddress billingAddress={user.billingAddress} />
							<PaymentMethods
								cart={cart}
								refreshing={this.state.fetchingPaymentMethods}
								pay={this.pay.bind(this)}
								paymentMethods={this.state.paymentMethods}
								navigatingAway={this.navigatingAway.bind(this)}
							/>
						</div>
					</Col>
				</Row>
			</Spin>
		);
	}
}
