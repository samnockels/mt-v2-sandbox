import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Icon, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import { history } from '../../util/history';
import Authentication from './Authentication';

class ResetPasswordForm extends React.Component {
	state = {
		error: null,
		success: false,
		resettingPassword: false,
	};

	handleSubmit = e => {
		const token = this.props.match.params.token;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ resettingPassword: true });
				Accounts.resetPassword(token, values.password, (error, res) => {
					if (error) {
						this.setState({ error, success: false, resettingPassword: false });
					} else {
						this.setState({ error: false, success: true, resettingPassword: false });
					}
				});
			}
		});
	};

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Your passwords are different!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Authentication
				title="Reset Password"
				loading={this.state.resettingPassword}
				loadingText="Resetting password..."
				children={
					<Form onSubmit={this.handleSubmit}>
						<Form.Item style={{ marginBottom: '5px' }}>
							{getFieldDecorator('password', {
								rules: [
									{ required: true, message: 'Please input your Password!' },
									{
										validator: this.validateToNextPassword,
									},
								],
							})(
								<Input.Password
									size="large"
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="New Password"
								/>
							)}
						</Form.Item>

						<Form.Item style={{ marginBottom: '5px' }}>
							{getFieldDecorator('confirm', {
								rules: [
									{ required: true, message: 'Please confirm your Password!' },
									{
										validator: this.compareToFirstPassword,
									},
								],
							})(
								<Input.Password
									size="large"
									prefix={<Icon type="check" style={{ color: 'rgba(0,0,0,.25)' }} />}
									onBlur={this.handleConfirmBlur}
									placeholder="Confirm New Password"
								/>
							)}
						</Form.Item>

						<Form.Item style={{ margin: 0 }}>
							<Button type="primary" htmlType="submit">
								Reset Password <Icon type="login" />
							</Button>
						</Form.Item>

						{this.state.success && <Alert message={`Password reset!`} type="success" />}

						{this.state.error && (
							<Alert message={this.state.error.reason} type="error" showIcon style={{ marginTop: '20px' }} />
						)}
					</Form>
				}
			/>
		);
	}
}

export default Form.create({ name: 'reset-password' })(withRouter(ResetPasswordForm));
