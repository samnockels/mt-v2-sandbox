import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { history } from '../../util/history';
import {
	Layout,
	Row,
	Col,
	Alert,
	Menu,
	PageHeader,
	Descriptions,
	Table,
	Tag,
	Button,
	Icon,
	Divider,
	Badge,
	Skeleton,
	Card,
	Typography,
	Form,
	Input,
	message,
	Modal,
	Spin,
} from 'antd';

class LinkItunesAccountForm extends Component {
	state = {
		linking: false,
		requires2fa: false,
		error: false,
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values);
				this.setState({ linking: true }, () => {
					if (values.code) {
						this.linkWith2faCode(values.email, values.password, values.code);
					} else {
						this.link(values.email, values.password);
					}
				});
			}
		});
	};

	link = (email, password) => {
		Meteor.call('api.linkItunesAccount', email, password, this.handleResponse);
	};

	linkWith2faCode = (email, password, code) => {
		Meteor.call('api.linkItunesAccount', email, password, code, this.handleResponse);
	};

	handleResponse = (err, res) => {
		if (err) {
			if (err.error === 'mt.itunes.requires2fa') {
				this.setState({ requires2fa: true, linking: false });
			} else {
				console.log(err);
				this.setState({ error: true, linking: false });
			}
			return;
		}
		this.props.form.resetFields();
		message.success(`Linked!`);
		this.setState({ linking: false });
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { user } = this.props;

		if (this.state.error) {
			return 'something went wrong...';
		}

		return (
			<Spin spinning={this.state.linking} tip="Linking" icon={<Icon type="loading" />}>
				<Form onSubmit={this.handleSubmit}>
					<Form.Item style={{ marginBottom: '5px' }}>
						{getFieldDecorator('email', {
							rules: [
								{ required: true, message: 'Please enter an email!' },
								{
									type: 'email',
									message: 'Not a valid email!',
								},
							],
						})(
							<Input
								size="large"
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Email"
							/>
						)}
					</Form.Item>
					<Form.Item style={{ marginBottom: '5px' }}>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please enter a password!' }],
						})(
							<Input
								size="large"
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="Password"
							/>
						)}
					</Form.Item>
					{this.state.requires2fa && (
						<Form.Item style={{ marginBottom: '5px' }}>
							{getFieldDecorator('code', {
								rules: [{ required: true, message: 'Please enter a code!' }],
							})(
								<Input
									size="large"
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="text"
									placeholder="2FA Code"
								/>
							)}
						</Form.Item>
					)}
					<Form.Item style={{ margin: 0 }}>
						<Button type="primary" htmlType="submit" icon="lock">
							Link
						</Button>
					</Form.Item>
				</Form>
			</Spin>
			// <PageHeader onBack={() => history.push('/account/manage')} title="Link iTunes Account">
			// 	<Card>

			// 	</Card>
			// </PageHeader>
		);
	}
}

export const LinkItunesAccount = Form.create({ name: 'linkItunesAccount' })(LinkItunesAccountForm);
