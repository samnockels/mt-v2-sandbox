import React, { Component } from 'react';
import { Row, Col, Typography, Button, Spin, Icon } from 'antd';
const { Title, Text } = Typography;
import { Link } from 'react-router-dom';

const Welcome = ({ user }) => {
	return (
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
				backgroundColor: '#f6f6f6',
				flexDirection: 'column',
			}}
		>
			{!user ? (
				<Spin spinning={true} indicator={<Icon type="loading" />}></Spin>
			) : (
				<Col
					xs={24}
					sm={24}
					md={12}
					lg={10}
					xl={8}
					style={{
						backgroundColor: '#fff',
						borderRadius: '10px',
						maxWidth: '400px',
						padding: '25px 30px',
						margin: '40px 0px',
						boxShadow: '0 0 20px 0px #e9e9e9',
					}}
				>
					{user.emails[0]?.verified ? (
						<div style={{ textAlign: 'center' }}>
							<Title level={2} style={{ marginBottom: '20px' }}>
								Welcome to MiTunes!
							</Title>
							<Text>
								Thank you for verifying <b>{user.emails[0]?.address}</b>!
							</Text>
							<Link to="/">
								<Button type="primary" style={{ marginTop: '28px' }}>
									Start Shopping
								</Button>
							</Link>
						</div>
					) : (
						<div style={{ textAlign: 'center' }}>
							<Title level={2} style={{ marginBottom: '20px' }}>
								Welcome to MiTunes!
							</Title>
							<Text>
								We have sent an email to <b>{user.emails[0]?.address}</b>. Please click the link in the email
								to verify your address.
							</Text>
							<Link to="/">
								<Button type="primary" style={{ marginTop: '28px' }}>
									Done, let me start shopping!
								</Button>
							</Link>
						</div>
					)}
				</Col>
			)}
		</Row>
	);
};

export default Welcome;
