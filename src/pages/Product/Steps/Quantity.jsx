import React, { Component } from 'react';
import { Row, Typography, InputNumber, Button, Tag, Icon } from 'antd';

export const Quantity = ({ selectedStock, quantity, onChange, show, onConfirm }) => {
	return (
		<div>
			<Typography.Title level={4} style={{ paddingBottom: '10px', color: show ? '#000000d9' : '#bcbcbcd9' }}>
				Select a quantity
			</Typography.Title>
			{show && (
				<>
					<Row>
						<InputNumber
							size="large"
							min={1}
							max={selectedStock}
							step={1}
							value={quantity}
							onChange={onChange.bind(this)}
							style={{ width: 150 }}
							autoFocus
						/>
						<br />
						<Tag color="#52c41a" style={{ marginTop: 10 }}>
							{selectedStock} code{selectedStock > 1 ? 's' : ''} in stock
						</Tag>
					</Row>
					<Button onClick={onConfirm} type="primary" style={{ marginTop: '20px' }}>
						Next
						<Icon type="caret-down" />
					</Button>
				</>
			)}
		</div>
	);
};
