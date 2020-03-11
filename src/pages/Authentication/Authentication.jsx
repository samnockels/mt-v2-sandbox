import React, { Component } from 'react';
import { Row, Col, Typography, Layout, Spin, Icon } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

/**
 * Style for auth screens
 */
const Authentication = props => {
	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				bottom: 0,
				right: 0,
				left: 0,
				height: '100vh',
				padding: '100px 10px 0px 10px',
				margin: '0 auto',
				backgroundColor: '#f8f8f8',
			}}
		>
			<Title style={{ textAlign: 'center' }}>{props.title}</Title>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					maxWidth: 450,
					padding: 30,
					margin: '40px auto',
					backgroundColor: '#fff',
					borderRadius: 10,
					boxShadow: '#d6d6d673 0px 0px 12px 0px',
					...props.style,
				}}
			>
				<Spin spinning={props.loading === true} tip={props.loadingText} indicator={<Icon type="loading" />}>
					{props.children}
				</Spin>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					marginTop: '10px',
					textAlign: 'center',
				}}
			>
				{props.footer}
			</div>
		</div>
	);
};

export default Authentication;
