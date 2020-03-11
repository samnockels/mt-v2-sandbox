import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Icon, Input, Button, Alert, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { history } from '../../util/history';
import Authentication from './Authentication';

class LoginForm extends React.Component {
	state = {
		error: null,
		loggingIn: false,
		accountSetup: false,
	};

	handleSubmit = e => {
		e.preventDefault();
		const self = this;
		this.props.form.validateFields((err, user) => {
			if (!err) {
				console.log(user);
				self.setState({ loggingIn: true }, () => {
					Meteor.loginWithPassword(user.username, user.password, (error, res) => {
						console.log(error, res);
						if (error) {
							if (error.error === 'mt.v1.firstLogin') {
								self.migrateUser(user);
							} else {
								message.error(error.reason || 'Please check your credentials.');
								this.setState({ accountSetup: false, loggingIn: false });
							}
						}
					});
				});
			}
		});
	};

	migrateUser(user) {
		Meteor.call('api.migrateUser', user.username, user.password, (error, res) => {
			console.log(error, res);
			if (error) {
				message.error(
					error.reason || 'Something went wrong when migrating your account. Please contact support.'
				);
				this.setState({ accountSetup: false, loggingIn: false });
			} else {
				this.setState({ accountSetup: true, loggingIn: true });
				Meteor.loginWithPassword(user.username, user.password, (error, res) => {
					if (error) {
						message.error(error.reason || 'Please check your credentials.');
						this.setState({ accountSetup: false, loggingIn: false });
					}
				});
			}
		});
	}

	getRedirectRoute() {
		return queryString.parse(history.location.search).ru || false;
	}

	shouldShowCheckoutMessage() {
		return this.getRedirectRoute() === 'checkout';
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Authentication
				title="Log In"
				loading={this.state.loggingIn || this.state.accountSetup}
				loadingText={
					this.state.accountSetup ? 'Setting up account... This may take a few moments' : 'Logging In'
				}
				footer={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							marginTop: '10px',
							textAlign: 'center',
						}}
					>
						<Link to="/register" style={{ marginBottom: '5px' }}>
							Not got an account? Register now!
						</Link>
						<Link to="/forgot-password" style={{ marginBottom: '5px' }}>
							Forgot password?
						</Link>
						<Link to="/">Back to MiTunes.tv</Link>
					</div>
				}
				children={
					<>
						{this.shouldShowCheckoutMessage() && (
							<Alert
								banner
								type="info"
								message="Please login to before placing an order! If you do not have an account, please register."
								style={{ marginBottom: '10px' }}
							/>
						)}
						<Form onSubmit={this.handleSubmit}>
							<Form.Item style={{ marginBottom: '5px' }}>
								{getFieldDecorator('username', {
									rules: [{ required: true, message: 'Please input your username!' }],
								})(
									<Input
										size="large"
										prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
										placeholder="Username"
									/>
								)}
							</Form.Item>
							<Form.Item style={{ marginBottom: '5px' }}>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: 'Please input your Password!' }],
								})(
									<Input
										size="large"
										prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
										type="password"
										placeholder="Password"
									/>
								)}
							</Form.Item>
							<Form.Item style={{ margin: 0 }}>
								<Button type="primary" htmlType="submit">
									Log in <Icon type="login" />
								</Button>
							</Form.Item>
						</Form>
					</>
				}
			/>
		);
	}
}

export const Login = Form.create({ name: 'login' })(LoginForm);
