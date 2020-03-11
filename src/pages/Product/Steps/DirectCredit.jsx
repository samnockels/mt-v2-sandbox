import React, { Component } from 'react';
import { Row, Typography, Input, Button, Alert } from 'antd';

export class DirectCredit extends Component {
	state = {
		email: '',
		password: '',
	};
	emailChange(e) {
		const email = e.target.value;
		this.setState({ email }, () => {
			this.props.onChange(this.state.email, this.state.password);
		});
	}
	passwordChange(e) {
		const password = e.target.value;
		this.setState({ password }, () => {
			this.props.onChange(this.state.email, this.state.password);
		});
	}
	render() {
		const { show, onChange } = this.props;
		return (
			<div>
				<Typography.Title
					level={4}
					style={{ paddingBottom: '10px', color: show ? '#000000d9' : '#bcbcbcd9' }}
				>
					Select iTunes Account
				</Typography.Title>
				{show && (
					<>
						<Row>
							<Input
								onChange={this.emailChange.bind(this)}
								type="email"
								placeholder="iTunes Email"
								style={{ marginTop: '20px' }}
							/>
							<Input
								onChange={this.passwordChange.bind(this)}
								type="password"
								placeholder="iTunes Password"
								style={{ marginTop: '20px' }}
							/>
							<Alert message="Before " />
						</Row>
						<Button
							onClick={() => {
								// this.props.onConfirm();
							}}
							type="primary"
							icon="check"
							style={{ margin: '20px 0px 10px 0px' }}
						>
							Sign in
						</Button>
					</>
				)}
			</div>
		);
	}
}
