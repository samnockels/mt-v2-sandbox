import React, { Component } from 'react';
import { Row, Col, Typography, Radio, Icon, Tooltip, Button, Alert } from 'antd';
import { compact } from 'lodash';

function formatDeliveryMethod(deliveryMethod) {
	switch (deliveryMethod) {
		case 'standard':
			return 'Standard';
		case 'direct':
			return 'Direct Credit';
		case 'gift':
			return 'Gift Certificate';
		default:
			return '';
	}
}

export const SelectProduct = ({
	product,
	selectedDelivery,
	isSelected,
	onChange,
	onConfirm,
	activeDeliveryMethods,
	disableNext,
}) => {
	return (
		<div>
			<Typography.Title level={4} style={{ paddingBottom: '10px' }}>
				Select a product
			</Typography.Title>
			{product.variations.map((variation, idx) => {
				const inStock = {
					standard: variation.stock.white > 0 && activeDeliveryMethods.includes('standard'),
					gift: variation.stock.white > 0 && activeDeliveryMethods.includes('gift'),
					direct:
						variation.stock.white + variation.stock.orange > 0 && activeDeliveryMethods.includes('direct'),
				};

				const deliveryMethodRadios = compact(
					product.deliveryMethods.map((deliveryMethod, idx) => {
						if (activeDeliveryMethods.includes(deliveryMethod)) {
							return (
								<Radio.Button value={deliveryMethod} disabled={!inStock[deliveryMethod]}>
									{formatDeliveryMethod(deliveryMethod)}
								</Radio.Button>
							);
						} else {
							return null;
						}
					})
				);

				return (
					<Row
						key={idx}
						style={{
							border: `4px solid ${isSelected(variation.sku) ? '#f2f2f2' : 'white'}`,
							padding: '10px',
							borderRadius: '10px',
						}}
						type="flex"
						align="middle"
						justify="start"
					>
						<Col style={{ marginRight: '20px' }}>
							<Typography.Text>{variation.title}</Typography.Text>
						</Col>
						<Col>
							<Radio.Group
								size="medium"
								value={isSelected(variation.sku) ? selectedDelivery : ''}
								buttonStyle="solid"
								onChange={e => {
									onChange(e, variation);
								}}
							>
								{deliveryMethodRadios.length ? (
									deliveryMethodRadios
								) : (
									<Alert message="No delivery methods available at this time." />
								)}
							</Radio.Group>
						</Col>
					</Row>
				);
			})}

			<Button
				onClick={() => {
					onConfirm();
				}}
				type="primary"
				style={{ margin: '20px 0px 10px 0px' }}
				disabled={disableNext}
			>
				Next
				<Icon type="caret-down" />
			</Button>
		</div>
	);
};
