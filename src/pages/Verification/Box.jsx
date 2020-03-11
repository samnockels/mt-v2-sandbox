import React, { Component } from 'react';
import { Col } from 'antd';

export const Box = props => {
	return (
		<Col
			xs={24}
			sm={24}
			md={12}
			lg={10}
			xl={8}
			style={{
				backgroundColor: '#fff',
				borderRadius: '2px',
				padding: '25px 30px',
				margin: '40px 0px',
				boxShadow: '#0000003b 0px 0px 36px 0px',
			}}
		>
			{props.children}
		</Col>
	);
};
