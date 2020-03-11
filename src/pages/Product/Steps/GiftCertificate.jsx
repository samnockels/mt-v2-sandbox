import React, { Component } from 'react';
import { Row, Typography, Input, Button } from 'antd';

export const GiftCertificate = ({ show, onChange, onConfirm }) => {
	return (
		<div>
			<Typography.Title level={4} style={{ paddingBottom: '10px', color: show ? '#000000d9' : '#bcbcbcd9' }}>
				Enter a gift message (optional)
			</Typography.Title>
			{show && (
				<>
					<Row>
						<Input
							onChange={e => {
								onChange(e.target.value);
							}}
							type="text"
							placeholder="Gift Message"
						/>
					</Row>

					<Button
						onClick={() => {
							onConfirm();
						}}
						type="primary"
						icon="check"
						style={{ margin: '20px 0px 10px 0px' }}
					>
						Next
					</Button>
				</>
			)}
		</div>
	);
};
