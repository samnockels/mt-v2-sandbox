import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { clone } from 'lodash';
import { useMediaQuery } from 'react-responsive';

const breakpoints = {
	xs: 24,
	sm: 24, // 576px+
	md: 24, // 768px+
	lg: 24, // 992px+
	xl: 20, // 1200px+
	xxl: 18, // 1200px+
};

/**
 * Copy of Bootstraps default container
 * @see https://getbootstrap.com/docs/4.3/layout/overview/#containers
 */
export default function Container(props) {
	const { children, ...remainingProps } = props;
	//prettier-ignore
	const rowPaddingNotSet = !remainingProps.rowStyle || (remainingProps.rowStyle && !remainingProps.rowStyle.padding);
	const colPaddingNotSet = !remainingProps.style || (remainingProps.style && !remainingProps.style.padding);
	let padding = '0px';
	if (colPaddingNotSet && rowPaddingNotSet) {
		const isDefault = useMediaQuery({ maxWidth: 480 });
		const isSmall = useMediaQuery({ maxWidth: 575 });
		const isMobile = useMediaQuery({ maxWidth: 767 });
		padding = isDefault ? '20px' : isSmall ? '30px' : isMobile ? '40px' : '50px 70px';
	}

	let style = {};
	let rowStyle = {};
	if (remainingProps.style) {
		style = clone(remainingProps.style);
		delete remainingProps.style;
	}
	if (remainingProps.rowStyle) {
		rowStyle = clone(remainingProps.rowStyle);
		delete remainingProps.rowStyle;
	}
	return (
		<Row
			style={{
				display: 'flex',
				justifyContent: 'center',
				...rowStyle,
			}}
		>
			<Col
				{...breakpoints}
				style={{
					padding,
					margin: '0px auto',
					maxWidth: '1300px',
					...style,
				}}
				{...remainingProps}
			>
				{children}
			</Col>
		</Row>
	);
}
