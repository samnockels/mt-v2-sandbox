import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Icon, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { history } from '../../util/history';
import Authentication from './Authentication';

class ForgotPasswordForm extends React.Component {
	state = {
		error: null,
		success: false,
		sendingEmail: false,
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ sendingEmail: true });
				Accounts.forgotPassword({ email: values.email }, (error, res) => {
					if (error) {
						this.setState({ error, success: false, sendingEmail: false });
					} else {
						this.setState({ error: false, success: values.email, sendingEmail: false });
					}
				});
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Authentication
				title="Forgot Password"
				loading={this.state.sendingEmail}
				loadingText="Sending password reset email..."
				footer={
					<>
						<Link to="/login" style={{ marginBottom: '5px' }}>
							Already have an account? Login
						</Link>
						<Link to="/register" style={{ marginBottom: '5px' }}>
							Not got an account? Register now!
						</Link>
						<Link to="/forgot-password" style={{ marginBottom: '5px' }}>
							Forgot password?
						</Link>
						<Link to="/">Back to MiTunes.tv</Link>
					</>
				}
				children={
					<Form onSubmit={this.handleSubmit}>
						<Form.Item style={{ marginBottom: '5px' }}>
							{getFieldDecorator('email', {
								rules: [
									{
										type: 'email',
										message: 'Not a valid E-mail!',
									},
									{ required: true, message: 'Please input your email address!' },
								],
							})(
								<Input
									size="large"
									prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Email"
								/>
							)}
						</Form.Item>

						<Form.Item style={{ margin: 0 }}>
							<Button type="primary" htmlType="submit">
								Send password reset email <Icon type="login" />
							</Button>
						</Form.Item>

						{this.state.success && (
							<Alert message={`Password reset email sent to ${this.state.success}`} type="success" />
						)}

						{this.state.error && (
							<Alert message={this.state.error.reason} type="error" showIcon style={{ marginTop: '20px' }} />
						)}
					</Form>
				}
			/>
		);
	}
}

export default Form.create({ name: 'forgot-password' })(ForgotPasswordForm);
