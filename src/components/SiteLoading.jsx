import React, { Component } from 'react';
import { Row, Icon } from 'antd';

export const SiteLoading = props => (
	<Row
		type="flex"
		justify="center"
		align="middle"
		style={{
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			backgroundColor: '#fff',
			flexDirection: 'column',
			fontSize: '3rem',
			fontWeight: 'bolder',
		}}
	>
		<Icon type="loading" spin={true} style={{ color: '#2f54eb' }} />
	</Row>
);
