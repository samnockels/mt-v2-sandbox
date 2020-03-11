import React, { Component } from 'react';
import { Modal, Button, Row, Col, Card, Icon, Typography, Spin, message } from 'antd';
const { Title, Paragraph, Text } = Typography;

export class CodeRevealer extends Component {
	state = {
		hovering: false,
		revealing: false,
		code: false,
		cachedCode: false,
	};

	reveal() {
		let self = this;
		if (this.state.cachedCode) {
			self.setState({ revealing: false, code: this.state.cachedCode });
		} else {
			this.setState({ revealing: true }, () => {
				Meteor.call('api.revealCode', this.props.codeId, (err, res) => {
					if (err || typeof res !== 'string') {
						message.error('Something went wrong when revealing that code. Please contact us.');
						this.hide();
					} else {
						self.setState({ revealing: false, code: res, cachedCode: res });
					}
				});
			});
		}
	}

	hide() {
		this.setState({ revealing: false, code: false });
	}

	render() {
		return (
			<div style={{ display: 'block' }}>
				<Spin
					spinning={this.state.revealing}
					indicator={<Icon type="loading" style={{ color: '#1890ff' }} />}
				>
					<span
						onMouseEnter={() => {
							this.setState({ hovering: true });
						}}
						onMouseLeave={() => {
							this.setState({ hovering: false });
						}}
						onClick={() => {
							if (!this.state.code) {
								this.reveal();
							}
						}}
						style={{
							display: 'inline-flex',
							maxWidth: '100%',
							margin: '2px',
							cursor: this.state.code ? 'default' : 'pointer',
							padding: '5px 15px',
							background: '#f6f6f6',
							border: '1px solid #e5e5e5',
							borderRadius: '10px',
						}}
					>
						<Text
							copyable={this.state.code ? true : false}
							style={{
								color: '#000',
								// textShadow: this.state.code ? 'none' : '0 0 4px #000',
							}}
						>
							{this.state.code ? (
								this.state.code
							) : (
								<span>
									Click to view <Icon type="eye" />
								</span>
							)}
						</Text>
					</span>
					{this.state.code && (
						<Button type="link" style={{ paddingLeft: 8 }} onClick={() => this.hide()}>
							Hide
						</Button>
					)}
				</Spin>
			</div>
		);
	}
}
