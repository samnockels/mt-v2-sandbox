import React, { Component } from 'react';
import { Row, Tag, Icon, Typography } from 'antd';
const { Text, Title } = Typography;

export const DeliveryMethodTag = ({ deliveryMethod, additionalFields, showAdditionalFields }) => {
	if (deliveryMethod === 'standard') {
		return <Tag color="#fa8c16">Standard</Tag>;
	} else if (deliveryMethod === 'direct') {
		if (
			showAdditionalFields &&
			additionalFields &&
			additionalFields.directEmail &&
			additionalFields.directPassword
		) {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div>
						<Tag color="#1890ff">Direct Credit</Tag>
					</div>
					<div>
						<Row>
							<Tag>
								<Icon type="mail" theme="filled" /> {additionalFields.directEmail}
							</Tag>
						</Row>
						<Row>
							<Tag>
								<Icon type="lock" theme="filled" />
								{'*'.repeat(additionalFields.directPassword.length)}
							</Tag>
						</Row>
					</div>
				</div>
			);
		} else {
			return <Tag color="#1890ff">Direct Credit</Tag>;
		}
	} else if (deliveryMethod === 'gift') {
		if (showAdditionalFields && additionalFields && additionalFields.giftMessage) {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div>
						<Tag color="#722ed1">Gift</Tag>
					</div>
					<div>
						<Row>
							<Tag>
								<Icon type="message" theme="filled" /> {additionalFields.giftMessage}
							</Tag>
						</Row>
					</div>
				</div>
			);
		} else {
			return <Tag color="#722ed1">Gift</Tag>;
		}
	} else {
		return null;
	}
};
