import React, { Component } from 'react';
import { Row, Col, Typography, Button, Steps, Tag, Avatar, message, Divider, Tabs, Icon, Card } from 'antd';

import { SelectProduct, Quantity, DirectCredit, GiftCertificate, AddedToCartResult } from './Steps';
import { DeliveryMethodTag } from '../../components/DeliveryMethodTag';
import { useMediaQuery } from 'react-responsive';

const { TabPane } = Tabs;
const { Text } = Typography;

class AddToCartForm extends Component {
	state = {
		step: 0,
		selectedVariation: null,
		selectedDelivery: '',
		selectedStock: 0, // stock level for the selected variation/delivery combo
		total: 0, // total price for the selected products
		quantity: 1,
		additionalFields: {},
		addingToCart: false,
	};

	resetForm() {
		this.setState({
			step: 0,
			selectedVariation: null,
			selectedDelivery: '',
			selectedStock: 0,
			total: 0,
			quantity: 1,
			additionalFields: {},
		});
	}

	nextStep() {
		this.setState(prevState => {
			return { step: prevState.step + 1 };
		});
	}

	previousStep() {
		this.setState(prevState => {
			return { step: prevState.step - 1 };
		});
	}

	allowAddToCart() {
		const { step, selectedVariation, selectedDelivery, quantity, additionalFields } = this.state;

		if (selectedDelivery === 'standard' && step !== 2) {
			return false;
		}
		if (['direct', 'gift'].includes(selectedDelivery) && step !== 3) {
			return false;
		}
		if (!selectedVariation || !selectedDelivery || !quantity) {
			return false;
		}
		if (!['standard', 'direct', 'gift'].includes(selectedDelivery)) {
			return false;
		}
		if (
			selectedDelivery === 'direct' &&
			(!additionalFields.directEmail || !additionalFields.directPassword)
		) {
			return false;
		}
		return true;
	}

	isSelected(sku) {
		if (!this.state.selectedVariation) {
			return false;
		}
		return this.state.selectedVariation.sku == sku;
	}

	onProductChange(e, variation) {
		let deliveryMethod = e.target.value;
		let selectedStock = 0;
		switch (deliveryMethod) {
			case 'standard':
				selectedStock = variation.stock.white || 0;
				break;
			case 'gift':
				selectedStock = variation.stock.white || 0;
				break;
			case 'direct':
				selectedStock = variation.stock.white + variation.stock.orange || 0;
				break;
		}
		this.setState({
			selectedVariation: this.getVariation(variation.sku),
			selectedDelivery: deliveryMethod,
			selectedStock,
		});
	}

	onProductConfirm() {
		if (!this.state.selectedVariation || !this.state.selectedDelivery) {
			message.error('Please select a product!');
		} else {
			this.nextStep();
		}
	}

	onQuantityChange(quantity) {
		this.setState({ quantity });
	}

	onQuantityConfirm() {
		if (!this.state.quantity) {
			message.error('Please enter a quantity!');
		} else if (this.state.quantity > this.state.selectedStock) {
			message.error('We do not have enough stock!');
		} else {
			this.nextStep();
		}
	}

	onDirectCreditChange(email, password) {
		this.setState(prevState => {
			return {
				...prevState,
				additionalFields: {
					...prevState.additionalFields,
					directEmail: email,
					directPassword: password,
				},
			};
		});
	}

	onDirectCreditConfirm() {
		if (
			!this.state.additionalFields ||
			!this.state.additionalFields.directEmail ||
			!this.state.additionalFields.directPassword
		) {
			message.error('Please enter your iTunes credentails!');
		} else {
			this.nextStep();
		}
	}

	onGiftChange(message) {
		this.setState(prevState => {
			return {
				...prevState,
				additionalFields: {
					...prevState.additionalFields,
					giftMessage: message,
				},
			};
		});
	}

	onGiftConfirm() {
		this.nextStep();
	}

	addToCart() {
		const lineItem = {
			sku: this.state.selectedVariation.sku,
			deliveryMethod: this.state.selectedDelivery,
			quantity: this.state.quantity,
			additionalFields: this.state.additionalFields,
		};
		if (lineItem.deliveryMethod === 'gift' && !lineItem.additionalFields?.giftMessage) {
			lineItem.additionalFields.giftMessage = '';
		}
		this.setState({ addingToCart: true }, () => {
			this.props.addToCart(lineItem, () => {
				this.setState({ addingToCart: false });
				this.resetForm();
			});
		});
	}

	getVariation(sku) {
		if (!sku) {
			return false;
		}
		let match;
		this.props.product.variations.forEach(variation => {
			if (variation.sku === sku) {
				match = variation;
			}
		});
		return match;
	}

	render() {
		const { addToCart, product } = this.props;
		const { title, sku, variations } = product;

		return (
			<>
				<Steps direction="vertical" current={this.state.step}>
					{/**
					 * Select a Product
					 */}
					<Steps.Step
						description={
							this.state.step === 0 ? (
								<SelectProduct
									product={product}
									selectedDelivery={this.state.selectedDelivery}
									isSelected={this.isSelected.bind(this)}
									onChange={this.onProductChange.bind(this)}
									onConfirm={this.onProductConfirm.bind(this)}
									activeDeliveryMethods={this.props.activeDeliveryMethods}
									disableNext={!this.state.selectedVariation || !this.state.selectedDelivery}
								/>
							) : (
								<div style={{ display: 'inline-block' }}>
									<Typography.Text style={{ marginRight: 10 }}>
										{this.state.selectedVariation.title}
									</Typography.Text>
									<DeliveryMethodTag deliveryMethod={this.state.selectedDelivery} />
								</div>
							)
						}
					/>

					{/**
					 * Select a quantity
					 */}
					<Steps.Step
						description={
							this.state.step <= 1 ? (
								<Quantity
									selectedStock={this.state.selectedStock}
									quantity={this.state.quantity}
									onChange={this.onQuantityChange.bind(this)}
									onConfirm={this.onQuantityConfirm.bind(this)}
									show={this.state.step > 0}
								/>
							) : (
								<Typography.Text>
									<Tag>x{this.state.quantity}</Tag>
								</Typography.Text>
							)
						}
					/>

					{/**
					 * Direct credit/gift
					 */}
					{this.state.selectedDelivery === 'direct' && (
						<Steps.Step
							description={
								this.state.step <= 2 ? (
									<DirectCredit
										onChange={this.onDirectCreditChange.bind(this)}
										show={this.state.step === 2}
										onConfirm={this.onDirectCreditConfirm.bind(this)}
									/>
								) : (
									this.state.additionalFields &&
									this.state.additionalFields.directEmail &&
									this.state.additionalFields.directPassword && (
										<div>
											<Row>
												<Tag>
													<Icon type="mail" theme="filled" /> {this.state.additionalFields.directEmail}
												</Tag>
											</Row>
											<Row>
												<Tag>
													<Icon type="lock" theme="filled" />
													{'*'.repeat(this.state.additionalFields.directPassword.length)}
												</Tag>
											</Row>
										</div>
									)
								)
							}
						/>
					)}
					{this.state.selectedDelivery === 'gift' && (
						<Steps.Step
							description={
								this.state.step <= 2 ? (
									<GiftCertificate
										onChange={this.onGiftChange.bind(this)}
										show={this.state.step === 2}
										onConfirm={this.onGiftConfirm.bind(this)}
									/>
								) : (
									<Typography.Text>
										{this.state.additionalFields && this.state.additionalFields.giftMessage ? (
											<Tag>
												<Icon type="message" theme="filled" /> {this.state.additionalFields.giftMessage}
											</Tag>
										) : (
											'No message.'
										)}
									</Typography.Text>
								)
							}
						/>
					)}

					{/**
					 * Add to Cart
					 */}
					<Steps.Step
						description={
							<Button
								onClick={this.addToCart.bind(this)}
								size="large"
								type="primary"
								disabled={!this.allowAddToCart()}
								loading={this.state.addingToCart}
							>
								{this.state.addingToCart ? 'Adding to Cart...' : 'Add To Cart'}
							</Button>
						}
					/>
				</Steps>

				{this.state.step > 0 && (
					<Row style={{ marginBottom: '20px' }}>
						<Button onClick={this.previousStep.bind(this)} style={{ marginRight: '10px' }}>
							Previous
						</Button>
						<Button onClick={this.resetForm.bind(this)}>Reset</Button>
					</Row>
				)}
			</>
		);
	}
}

const Product = props => {
	const isMobile = useMediaQuery({ maxWidth: 767 });
	return (
		<div style={{ marginTop: 0 }}>
			<Row>
				<Col xs={24} md={10} style={isMobile ? { textAlign: 'center' } : { textAlign: 'right' }}>
					<Avatar
						shape="square"
						size={300}
						src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${props.product.sku}.png?alt=media`}
					/>
				</Col>
				<Col xs={24} md={14}>
					<div style={{ marginTop: isMobile ? 50 : 0, marginLeft: isMobile ? 0 : 30 }}>
						<Typography.Title level={1} style={{ marginBottom: 60 }}>
							{props.product.title}
						</Typography.Title>
						<AddToCartForm
							addToCart={props.addToCart}
							product={props.product}
							activeDeliveryMethods={props.activeDeliveryMethods}
						/>
					</div>
				</Col>
				<Col span={24}>
					<div style={{ marginTop: 100 }}>
						<Card>
							<Text strong>Description</Text>
							<br />
							<div dangerouslySetInnerHTML={{ __html: props.product.description }} />
							<br />
							<br />
							<Text strong>Categories</Text>
							<br />
							{props.product.categories.map(cat => (
								<Tag>{cat}</Tag>
							))}
						</Card>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Product;
