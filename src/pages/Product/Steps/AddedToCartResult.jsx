import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';

export const AddedToCartResult = ({ title, onBuyAgain }) => {
	return (
		<div
			style={{
				width: '100%',
				padding: '10px',
				background: 'green',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<span style={{ marginLeft: '10px' }}>
				<b>{title}</b> added to Cart 🎉
			</span>
			<Link to="/cart" key="viewCart">
				<Button>
					View Cart <Icon type="arrow-right" />
				</Button>
			</Link>
			{/* <Link to="/checkout" key="checkout">
				<Button type="primary">Checkout</Button>
			</Link> */}
		</div>
	);
};
