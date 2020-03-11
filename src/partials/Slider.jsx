import React, { Component } from 'react';
import { Layout, Typography, Carousel, Button } from 'antd';
import { history } from '../util/history';
const { Header } = Layout;
const { Title, Text } = Typography;

const SliderContent = props => {
	const isImage = !!props?.sliderData?.image;
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: '160px 100px 160px 100px',
				height: 'auto',
				minHeight: '700px',
				alignItems: 'center',
				justifyContent: 'center',
				background: isImage
					? `${props.sliderData.backgroundColor} url('${props.sliderData.image}') no-repeat center center`
					: props.sliderData.backgroundColor,
				backgroundSize: 'contain',
				textAlign: 'center',
			}}
		>
			{!isImage && (
				<>
					{props.sliderData?.title && (
						<Title style={{ color: props.sliderData.textColor }}>{props.sliderData.title}</Title>
					)}
					{props.sliderData?.description && (
						<Text
							style={{
								color: props.sliderData?.textColor,
								margin: '10px 0px 25px 0px',
								fontSize: '1.2rem',
							}}
						>
							{props.sliderData?.description}
						</Text>
					)}
					{props.sliderData?.callToAction && (
						<Button
							onClick={() => {
								const link = props.sliderData?.callToAction?.link;
								if (!!link) {
									if (link[0] === '/') {
										history.push(link);
									} else {
										window.location.href = link;
									}
								}
							}}
							size="large"
							style={{
								cursor: 'pointer',
								borderRadius: '100px',
								background: props.sliderData?.buttonColor,
								borderColor: props.sliderData?.buttonColor,
								color: props.sliderData?.buttonTextColor,
								border: 0,
								paddingLeft: 20,
								paddingRight: 20,
							}}
						>
							{props.sliderData?.callToAction?.text}
						</Button>
					)}
				</>
			)}
		</div>
	);
};

class Slider extends Component {
	state = {
		selectedSliderIndex: 0,
	};
	render() {
		if (this.props.slider.length === 1) {
			return (
				<div
					style={{
						background: this.props.slider[0]?.backgroundColor,
						zIndex: 5,
					}}
				>
					<SliderContent sliderData={this.props.slider[0]} />
				</div>
			);
		}

		return (
			<Carousel
				style={{
					height: 'auto',
					maxHeight: '1000px',
					minHeight: '700px',
					zIndex: '5',
				}}
				autoplay
				effect="fade"
				beforeChange={(current, next) => {
					// setTimeout fixes bug: https://github.com/akiran/react-slick/issues/136#issuecomment-424103797
					setTimeout(() => {
						this.props.setMenuTheme({
							theme: this.props.slider[next].menuTheme,
							backgroundColor: this.props.slider[next].backgroundColor,
							primaryButtonColour: this.props.slider[next].buttonColor || '#1890ff',
							primaryButtonTextColour: this.props.slider[next].buttonTextColor || 'white',
							primaryTextColour: this.props.slider[next].textColor || 'white',
						});
					}, 1);
				}}
			>
				{this.props.slider.map((sliderData, idx) => {
					return <SliderContent key={idx} sliderData={sliderData} />;
				})}
			</Carousel>
		);
	}
}

export default Slider;
