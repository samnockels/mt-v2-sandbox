import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { compact } from 'lodash';
import moment from 'moment';
import { Switch, Route, Link } from 'react-router-dom';
import { history } from '../../util/history';
import { withRouter } from 'react-router';
import { Responsive } from '../../components/MediaQueries';
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
	Tabs,
	Select,
} from 'antd';

import { DeliveryMethodTag } from '../../components/DeliveryMethodTag';
import { CodeRevealer } from '../../components/CodeRevealer';
import { isoCountryCodes } from '../../../../../both/data/isoCountryCodes';

const { Title, Paragraph, Text } = Typography;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;

export const OrderStatusBadge = ({ status }) => {
	const badges = {
		processing: <Badge dot status="processing" text="Processing" />,
		on_hold: <Badge dot color="purple" text="On Hold" />,
		info_required: <Badge dot status="warning" text="Info Required" />,
		in_progress: <Badge dot status="processing" text="In Progress" />,
		awaiting_verification: <Badge dot status="warning" text="Awaiting Verification" />,
		delivered: <Badge dot status="success" text="Delivered" />,
		cancelled: <Badge dot color="black" text="Cancelled" />,
		failed: <Badge dot status="error" text="Failed" />,
		refunded: <Badge dot color="volcano" text="Refunded" />,
	};
	if (!badges[status]) {
		return <Badge dot status="error" text="-"></Badge>;
	}
	return badges[status];
};

class Orders extends Component {
	columns() {
		return [
			{
				title: 'Order Reference',
				dataIndex: '_id',
			},
			{
				title: 'Status',
				dataIndex: 'status',
				render: status => {
					return <OrderStatusBadge status={status} />;
				},
			},
			{
				title: 'Total',
				dataIndex: 'total',
				align: 'right',
				render: total => {
					return total.total;
				},
			},
		];
	}
	render() {
		return (
			<div>
				<PageHeader
					title={<Title level={3}>Your Orders</Title>}
					subTitle={<Tag color="#1890ff">{this.props.orders.length} orders</Tag>}
				/>
				<Table
					rowKey={order => order._id}
					columns={this.columns()}
					dataSource={this.props.orders}
					onRow={order => ({
						onClick: () => {
							history.push(`/account/orders/${order._id}`);
						},
					})}
				/>
			</div>
		);
	}
}

const OrderHeader = ({ order }) => {
	return (
		<PageHeader
			onBack={() => history.push('/account/orders')}
			title={
				<div>
					<Text>Order Ref: </Text>
					<Text strong copyable ellipsis>
						{order._id}
					</Text>
				</div>
			}
		>
			<Descriptions size="small" column={1}>
				<Descriptions.Item label="Status">{<OrderStatusBadge status={order.status} />}</Descriptions.Item>
				<Descriptions.Item label="Payment Method">
					<img
						src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
						height="17px"
						border="0"
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Total">
					{order.total.total} ({order.total.currency})
				</Descriptions.Item>
				<Descriptions.Item label="Placed At">
					{moment(order.placedAt).format('DD MMM YY @ HH:mm:ss')}
				</Descriptions.Item>
				<Descriptions.Item label="Last Updated">
					{moment(order.lastUpdated).format('DD MMM YY @ HH:mm:ss')}
				</Descriptions.Item>
			</Descriptions>
		</PageHeader>
	);
};

export const VerificationsRequired = ({ order }) => {
	return (
		<Card bordered title="Verification Required" style={{ margin: '5px 0px' }}>
			<Row>
				<Alert
					type="info"
					showIcon
					message="In order for us to process your order, we require you to complete the following verifications."
				/>
			</Row>
			<Row>
				{compact(
					order.verificationsRequired.map(verif => {
						if (verif === 'call') {
							return (
								<Alert
									type="warning"
									style={{ margin: '10px 0px' }}
									showIcon
									icon={<Icon type="phone" />}
									message="Call Verification Required"
								/>
							);
						} else if (verif === 'video') {
							return (
								<Alert
									type="warning"
									style={{ margin: '10px 0px' }}
									showIcon
									icon={<Icon type="video-camera" />}
									message="Video Verification Required"
								/>
							);
						} else {
							return null;
						}
					})
				)}
			</Row>
		</Card>
	);
};

const ProductsOrdered = ({ order }) => {
	return (
		<Card bordered title="Products Ordered" style={{ margin: '5px 0px' }}>
			<Row gutter={[24, 24]} style={{ margin: 0 }}>
				<Col xs={6} sm={5}>
					<b>Product</b>
				</Col>
				<Col xs={0} sm={5}>
					<b>Quantity</b>
				</Col>
				<Col xs={12} sm={9}>
					<b>Codes</b>
				</Col>
				<Col xs={6} sm={5} style={{ textAlign: 'right' }}>
					<b>Total</b>
				</Col>
			</Row>
			{order.items.map((item, idx) => {
				const codes = order.codes[item._id].map(codeId => (
					<CodeRevealer codeId={codeId} key={`${item._id}${codeId}`} />
				));
				if (codes.length !== item.quantity) {
					codes.push(
						<Alert showIcon={true} message={`${item.quantity - codes.length} codes not yet released`} />
					);
				}
				return (
					<div>
						<Row gutter={[24, 24]} style={{ margin: 0 }}>
							<Col xs={6} sm={5}>
								{item.title}
								<br />
								<DeliveryMethodTag status={item.deliveryMethod} />
							</Col>
							<Col xs={0} sm={5}>
								x{item.quantity}
							</Col>
							<Col xs={12} sm={9}>
								{codes}
							</Col>
							<Col
								xs={6}
								sm={5}
								style={{ textAlign: 'right' }}
							>{`${item.total.total} (${item.total.currency})`}</Col>
						</Row>
						<Divider dashed style={{ margin: 0 }} />
					</div>
				);
			})}
			<Row style={{ display: 'block', padding: '20px 12px 0px 0px' }}>
				<Text style={{ float: 'right' }} strong>{`${order.total.total} (${order.total.currency})`}</Text>
			</Row>
		</Card>
	);
};

const OrderDetails = withRouter(
	class extends Component {
		state = {
			loadingOrder: true,
			order: {},
		};
		componentDidMount() {
			let found = false;
			this.props.orders.forEach(order => {
				if (order._id === this.props.match.params.id) {
					this.setState({ order, loadingOrder: false });
					found = true;
				}
			});
			if (!found) {
				message.warn('Order not found');
				history.replace('/account/orders');
			}
		}
		render() {
			if (this.state.loadingOrder) {
				return <Skeleton loading />;
			}
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<OrderHeader order={this.state.order} />
					{this.state.order?.status === 'awaiting_verification' && (
						<VerificationsRequired order={this.state.order} />
					)}
					{this.state.order?.status === 'delivered' && (
						<Alert
							showIcon={true}
							style={{ marginBottom: 20, fontSize: '1rem' }}
							type="success"
							message="We have successfully delivered your codes via the chosen delivery methods! To view your
							codes, please click on the code you would like to reveal."
						/>
					)}
					{this.state.order?.status === 'processing' && (
						<Alert
							showIcon={true}
							style={{ marginBottom: 20, fontSize: '1rem' }}
							type="info"
							message="We are currently processing your order. Orders normally process within 1 hour during our customer service hours (9am to midnight London time, 7 days a week). Outside of these times, orders will be processed the following morning."
						/>
					)}
					{this.state.order?.status === 'in_progress' && (
						<Alert
							showIcon={true}
							style={{ marginBottom: 20, fontSize: '1rem' }}
							type="info"
							message="We are in the process of releasing your codes!"
						/>
					)}
					<ProductsOrdered order={this.state.order} />
				</div>
			);
		}
	}
);

class ManageAccount extends Component {
	state = {
		resendingEmail: false,
		resentEmail: false,
		editingPhone: false,
		editingBillingAddress: false,
		savingBillingAddress: false,
		firstName: this.props?.user?.billingAddress?.firstName,
		lastName: this.props?.user?.billingAddress?.lastName,
		address1: this.props?.user?.billingAddress?.address1,
		address2: this.props?.user?.billingAddress?.address2,
		city: this.props?.user?.billingAddress?.city,
		stateProvinceRegion: this.props?.user?.billingAddress?.stateProvinceRegion,
		zipPostcode: this.props?.user?.billingAddress?.zipPostcode,
		country: this.props?.user?.billingAddress?.country,
		phone: this.props?.user?.phone,
	};

	editingPhone(editingPhone) {
		this.setState({ editingPhone });
	}

	editingBillingAddress(editingBillingAddress) {
		this.setState({ editingBillingAddress });
	}

	updatePhone(phone) {
		Meteor.call('api.updatePhone', phone, (err, res) => {
			if (err) {
				if (err.error === 'mt.invalidPhone') {
					message.error(err.reason);
				} else {
					message.error('Something went wrong when updating your Phone.');
				}
			} else {
				this.props.api.loadUser(() => {
					message.success('Phone updated!');
				});
				this.editingPhone(false);
			}
		});
	}

	updateBillingAddress(billingAddress, done) {
		Meteor.call('api.updateBillingAddress', billingAddress, (err, res) => {
			if (err) {
				if (err.error === 'mt.invalidField') {
					message.error(err.reason);
				} else {
					message.error('Something went wrong when updating your billing address.');
				}
			} else {
				this.props.api.loadUser(() => {
					message.success('Billing Address updated!');
				});
				this.editingBillingAddress(false);
			}
			if (typeof done === 'function') done();
		});
	}

	updateChosenCurrency(currency) {
		Meteor.call('api.updateChosenCurrency', currency, (err, res) => {
			if (err) {
				if (err.error === 'mt.currencyNotSupported') {
					message.error(err.reason);
				} else {
					message.error('Something went wrong when updating your currency.');
				}
			} else {
				message.success('Currency updated!');
			}
		});
	}

	resendVerificationEmail() {
		this.setState({ resendingEmail: true });
		Meteor.call('api.resendVerificationEmail', (err, res) => {
			this.setState({ resendingEmail: false });
			if (err) {
				if (err.error === 'mt.unauthorized') {
					message.error('Please login to resend your email.');
				} else if (err.error === 'mt.alreadyVerifiedEmail') {
					message.error('Your email is already verified!');
				}
			} else {
				this.setState({ resentEmail: true });
			}
		});
	}
	render() {
		const { user } = this.props;
		const flexRowStyle = {
			justifyContent: 'start',
			alignItems: 'center',
			display: 'flex',
		};
		return (
			<Descriptions title={<Title level={3}>Your Details</Title>} bordered={true} size="small" column={1}>
				<Descriptions.Item label="Username">{user.username}</Descriptions.Item>
				<Descriptions.Item label="Email">
					<div style={flexRowStyle}>
						{user.emails[0]?.address}{' '}
						{user.emails[0]?.verified ? (
							<Tag color="blue" style={{ marginLeft: '5px' }}>
								Verified <Icon type="check" />
							</Tag>
						) : (
							<Row>
								<Tag color="red" style={{ marginLeft: '5px' }}>
									Not Verified <Icon type="close-circle" />{' '}
								</Tag>
								{this.state.resentEmail ? (
									'New email sent!'
								) : (
									<Button loading={this.state.resendingEmail} onClick={() => this.resendVerificationEmail()}>
										Resend Verification Email
									</Button>
								)}
							</Row>
						)}
					</div>
				</Descriptions.Item>
				<Descriptions.Item label="Phone Number">
					{this.state.editingPhone ? (
						<div style={flexRowStyle}>
							<Input value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} />
							<Button type="primary" onClick={() => this.updatePhone(this.state.phone)}>
								Save
							</Button>
							<Button type="link" onClick={() => this.editingPhone(false)}>
								Cancel
							</Button>
						</div>
					) : (
						<div style={flexRowStyle}>
							<Text>{user.phone} </Text>
							<Button type="link" onClick={() => this.editingPhone(true)}>
								Edit
							</Button>
						</div>
					)}
				</Descriptions.Item>
				<Descriptions.Item label="Billing Address">
					{this.state.editingBillingAddress ? (
						<Row type="flex" style={{ flexDirection: 'column' }}>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="First Name"
								value={this.state.firstName}
								onChange={e => this.setState({ firstName: e.target.value })}
							/>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="Surname"
								value={this.state.lastName}
								onChange={e => this.setState({ lastName: e.target.value })}
							/>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="Address 1"
								value={this.state.address1}
								onChange={e => this.setState({ address1: e.target.value })}
							/>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="Address 2"
								value={this.state.address2}
								onChange={e => this.setState({ address2: e.target.value })}
							/>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="City"
								value={this.state.city}
								onChange={e => this.setState({ city: e.target.value })}
							/>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="State/Province/Region"
								value={this.state.stateProvinceRegion}
								onChange={e => this.setState({ stateProvinceRegion: e.target.value })}
							/>
							<Input
								style={{ marginBottom: 5 }}
								addonBefore="Postal Code"
								value={this.state.zipPostcode}
								onChange={e => this.setState({ zipPostcode: e.target.value })}
							/>
							<Select
								onChange={country => this.setState({ country })}
								value={this.state.country}
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
							<Row style={{ marginTop: 10 }}>
								<Button
									type="primary"
									loading={this.state.savingBillingAddress}
									onClick={() =>
										this.setState({ savingBillingAddress: true }, () => {
											this.updateBillingAddress(
												{
													firstName: this.state.firstName,
													lastName: this.state.lastName,
													address1: this.state.address1,
													address2: this.state.address2,
													city: this.state.city,
													stateProvinceRegion: this.state.stateProvinceRegion,
													zipPostcode: this.state.zipPostcode,
													country: this.state.country,
												},
												() => {
													this.setState({ savingBillingAddress: false });
												}
											);
										})
									}
								>
									{this.state.savingBillingAddress ? 'Saving...' : 'Save'}
								</Button>
								<Button type="link" onClick={() => this.editingBillingAddress(false)}>
									Cancel
								</Button>
							</Row>
						</Row>
					) : (
						<Row type="flex" style={{ flexDirection: 'column' }}>
							<Text>{this.state.firstName}</Text>
							<Text>{this.state.lastName}</Text>
							<Text>{this.state.address1}</Text>
							{this.state.address2 && <Text>{this.state.address2}</Text>}
							<Text>{this.state.city}</Text>
							<Text>{this.state.stateProvinceRegion}</Text>
							<Text>{isoCountryCodes[this.state.country]?.name}</Text>
							<Text>{this.state.zipPostcode}</Text>
							<Button type="link" onClick={() => this.editingBillingAddress(true)}>
								Edit
							</Button>
						</Row>
					)}
				</Descriptions.Item>
				<Descriptions.Item label="Sign up date">
					{`${moment(user.signedUp).format('ddd Do MMM YYYY @ HH:mm:ss')} (${moment(
						user.signedUp
					).fromNow()})`}
				</Descriptions.Item>
			</Descriptions>
		);
	}
}

const ResponsiveAccount = ({ device, user, orders, getSelectedMenuItem, api }) => {
	const options = {
		mobile: {
			tabPosition: 'top',
			panelStyle: {
				padding: '0px',
			},
		},
		tablet: {
			tabPosition: 'left',
			panelStyle: {
				padding: '5px 15px',
			},
		},
		desktop: {
			tabPosition: 'left',
			panelStyle: {
				padding: '10px 25px',
			},
		},
	};
	return (
		<div>
			<PageHeader ghost={false} style={{ padding: 30 }} />
			<Layout style={{ padding: '0', background: '#fff', marginBottom: '1000px' }}>
				<Tabs tabPosition={options[device].tabPosition} activeKey={getSelectedMenuItem()}>
					<TabPane
						style={options[device].panelStyle}
						key="1"
						tab={<Link to="/account/manage">Manage Account</Link>}
					>
						<ManageAccount user={user} api={api} />
					</TabPane>
					<TabPane style={options[device].panelStyle} key="2" tab={<Link to="/account/orders">Orders</Link>}>
						<Route exact path="/account/orders">
							<Orders orders={orders} />
						</Route>
						<Route exact path="/account/orders/:id">
							<OrderDetails orders={orders} />
						</Route>
					</TabPane>
				</Tabs>
			</Layout>
		</div>
	);
};

class Account extends Component {
	getSelectedMenuItem() {
		if (history.location.pathname === '/account/manage') {
			return '1';
		}
		if (history.location.pathname === '/account/itunes/new') {
			return '1';
		}
		if (history.location.pathname === '/account/orders') {
			return '2';
		}
		if (RegExp('/account/orders/[A-z0-9]+').test(history.location.pathname)) {
			return '2';
		}
		history.push('/account/manage');
	}
	render() {
		return (
			<Responsive
				desktop={
					<ResponsiveAccount
						device="desktop"
						user={this.props.user}
						orders={this.props.orders}
						getSelectedMenuItem={() => this.getSelectedMenuItem()}
						api={this.props.api}
					/>
				}
				tablet={
					<ResponsiveAccount
						device="tablet"
						user={this.props.user}
						orders={this.props.orders}
						getSelectedMenuItem={() => this.getSelectedMenuItem()}
						api={this.props.api}
					/>
				}
				mobile={
					<ResponsiveAccount
						device="mobile"
						user={this.props.user}
						orders={this.props.orders}
						getSelectedMenuItem={() => this.getSelectedMenuItem()}
						api={this.props.api}
					/>
				}
			/>
		);
	}
}

export default Account;
