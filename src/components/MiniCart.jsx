import React from 'react';
import { history } from '../util/history';
import { FaShoppingCart } from '../util/icons/fa';
import { DeliveryMethodTag } from '../components/DeliveryMethodTag';
import { Row, Col, Button, Card, Popover, List, Avatar, Tag, Icon, Empty, Badge, Typography } from 'antd';
const { Text } = Typography;

const CartItems = props => {
	return (
		<List
			itemLayout="horizontal"
			dataSource={Object.keys(props.items)}
			renderItem={hash => {
				const item = props.items[hash];
				return (
					<List.Item
						extra={
							<Button
								type="danger"
								size="small"
								shape="circle"
								ghost
								icon="close"
								onClick={() => {
									props.removeItem(hash);
								}}
							/>
						}
					>
						<List.Item.Meta
							avatar={
								<Avatar
									src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${item.parentProduct.sku}.png?alt=media`}
								/>
							}
							title={
								<Row type="flex" direction="row" justify="start">
									<Col>{item.title}</Col>
								</Row>
							}
							description={
								<Row type="flex" direction="row" justify="space-between" style={{ marginRight: '20px' }}>
									<div>
										<DeliveryMethodTag deliveryMethod={item.deliveryMethod} />
										<Text>x{item.quantity}</Text>
									</div>
									<Text strong>{item.totals.subTotal}</Text>
								</Row>
							}
						/>
					</List.Item>
				);
			}}
		></List>
	);
};

/**
 * Dropdown cart
 *
 * @prop items
 */
export const MiniCart = props => {
	const {
		cart,
		removeItem,
		onClick,
		showBadge,
		primaryButtonColour,
		primaryButtonTextColour,
		primaryTextColour,
	} = props;
	const { total, items } = cart;
	const count = Object.keys(items).length;
	return (
		<Popover
			placement="bottomRight"
			trigger="click"
			style={{ padding: 0 }}
			content={
				<>
					<Card bordered={false} size="small" style={{ padding: '0px', minWidth: '300px' }}>
						{count === 0 ? (
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
						) : (
							<>
								<Row type="flex" justify="space-between">
									<Col span={12}>{count} Items</Col>
									<Col span={12} style={{ textAlign: 'right' }}>
										Total: {total}
									</Col>
								</Row>
								<CartItems items={items} removeItem={removeItem} />
								<div style={{ marginTop: '20px', textAlign: 'center' }}>
									<Button
										onClick={() => {
											history.push('/cart');
										}}
										type="default"
									>
										View Cart
									</Button>
									<Button
										onClick={() => {
											history.push('/checkout');
										}}
										type="primary"
										style={{ marginLeft: '5px' }}
									>
										Checkout
									</Button>
								</div>
							</>
						)}
					</Card>
				</>
			}
		>
			<Badge count={showBadge ? 1 : 0} showZero={false} dot>
				<Button
					onClick={onClick}
					type="primary"
					style={{
						backgroundColor: primaryButtonColour,
						border: primaryButtonColour,
						color: primaryButtonTextColour,
						marginLeft: '10px',
					}}
				>
					<Icon component={FaShoppingCart} />{' '}
					<Badge
						count={count}
						showZero={true}
						style={{
							backgroundColor: primaryButtonColour,
							color: primaryButtonTextColour,
							padding: 0,
							boxShadow: 'none',
							fontSize: '0.8rem',
							minWidth: 'unset',
						}}
					/>
				</Button>
			</Badge>
		</Popover>
	);
};
