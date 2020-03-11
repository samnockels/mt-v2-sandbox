import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Icon, Input, Button, Alert, Spin, Divider, Select, message } from 'antd';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { isoCountryCodes } from '../../../../../both/data/isoCountryCodes';
import SimpleSchema from 'simpl-schema';
import Authentication from './Authentication';
import { history } from '../../util/history';

const BillingAddressFields = ({ getFieldDecorator }) => {
	return (
		<>
			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('firstName', {
					rules: [{ required: true, message: 'Please input your first name!' }],
				})(<Input size="large" placeholder="First Name" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('lastName', {
					rules: [{ required: true, message: 'Please input your last name!' }],
				})(<Input size="large" placeholder="Last Name" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('phone', {
					rules: [
						{ required: true, message: 'Please input your phone number!' },
						{ pattern: SimpleSchema.RegEx.Phone, message: 'Please enter a valid phone number!' },
					],
				})(<Input size="large" placeholder="Phone Number" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('billingAddressLineOne', {
					rules: [{ required: true, message: 'Please input an address!' }],
				})(<Input size="large" placeholder="Address Line 1" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{/* optional */}
				{getFieldDecorator('billingAddressLineTwo', {})(<Input size="large" placeholder="Address Line 2" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('billingAddressCity', {
					rules: [{ required: true, message: 'Please input a city!' }],
				})(<Input size="large" placeholder="City" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('billingAddressRegion', {
					rules: [{ required: true, message: 'Please input a state/province/region!' }],
				})(<Input size="large" placeholder="State / Province / Region" />)}
			</Form.Item>

			<Form.Item style={{ marginBottom: '5px' }}>
				{getFieldDecorator('billingAddressZip', {
					rules: [{ required: true, message: 'Please input a zip/postal code!' }],
				})(<Input size="large" placeholder="ZIP / Postal Code" />)}
			</Form.Item>

			<Form.Item>
				{getFieldDecorator('billingAddressCountryCode', {
					rules: [
						{
							required: true,
							message: 'Please select a country!',
						},
					],
				})(
					<Select
						placeholder="Country"
						showSearch
						filterOption={(input, option) =>
							option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
							option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{Object.keys(isoCountryCodes).map((countryCode, idx) => {
							return (
								<Select.Option key={idx} value={countryCode}>
									{isoCountryCodes[countryCode].name}
								</Select.Option>
							);
						})}
					</Select>
				)}
			</Form.Item>
		</>
	);
};

class RegisterForm extends React.Component {
	state = {
		error: null,
		registering: false,
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, userData) => {
			console.log(err, userData);
			if (!err) {
				this.setState({ registering: true });
				Accounts.createUser(userData, error => {
					if (error) {
						console.log(error);
						message.error(error.reason || error.error);
						this.setState({ registering: false });
					} else {
						history.push('/');
					}
				});
			}
		});
	};

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
				title="Register"
				loading={this.state.registering}
				loadingText="Registering..."
				footer={
					<>
						<Link to="/login" style={{ marginBottom: '5px' }}>
							Already have an account? Login
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
									placeholder="Password"
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
									placeholder="Confirm Password"
								/>
							)}
						</Form.Item>

						<Divider />

						<BillingAddressFields getFieldDecorator={getFieldDecorator} />

						<Form.Item style={{ margin: 0 }}>
							<Button type="primary" htmlType="submit">
								Register <Icon type="login" />
							</Button>
						</Form.Item>

						{this.state.error && (
							<Alert message={this.state.error.reason} type="error" showIcon style={{ marginTop: '20px' }} />
						)}
					</Form>
				}
			/>
		);
	}
}

export const Register = Form.create({ name: 'register' })(RegisterForm);
