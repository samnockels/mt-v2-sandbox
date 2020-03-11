import React, { Component } from 'react';
import { PageHeader, Row, Col, Card, Icon, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
const { Meta } = Card;
const { Title, Text } = Typography;

export class Product extends Component {
	render() {
		const { product, span } = this.props;
		return (
			<Col span={span}>
				<Card
					hoverable
					bordered={true}
					style={{
						borderRadius: 8,
						border: '3px solid #f8f8f8',
						padding: 0,
					}}
					bodyStyle={{
						padding: '15px 0px 0px 0px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						whiteSpace: 'normal',
					}}
				>
					<Avatar
						src={`https://firebasestorage.googleapis.com/v0/b/mitunes-assets/o/${product.sku}.png?alt=media`}
						shape="square"
						size={140}
					/>
					<Meta
						title={product.title}
						style={{
							width: '100%',
							marginTop: 8,
							padding: 15,
							background: '#f8f8f8',
							color: '#414141',
							borderRadius: '0px 0px 10px 10px',
						}}
					/>
				</Card>
			</Col>
		);
	}
}

export const ProductGrid = props => {
	const { heading, products, showAll, style } = props;
	// how many products to display in a row?
	const isDefault = useMediaQuery({ maxWidth: 480 });
	const isSmall = useMediaQuery({ maxWidth: 575 });
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const n = isDefault ? 1 : isSmall ? 2 : isMobile ? 3 : 4;
	const span = isDefault ? 24 : isSmall ? 12 : isMobile ? 8 : 6;
	return (
		<div style={{ padding: '5px 5px 60px 5px', ...style }}>
			<Title
				level={3}
				style={{
					paddingBottom: '24px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
				}}
			>
				{heading}
			</Title>
			<Row gutter={24} style={{ borderRadius: '0 0 8px 2px #e5e5e573' }}>
				{(showAll ? products : products.slice(0, n)).map((product, idx) => (
					<Link to={`/product/${product.slug}`} key={idx}>
						<Product product={product} span={span} />
					</Link>
				))}
			</Row>
		</div>
	);
};
