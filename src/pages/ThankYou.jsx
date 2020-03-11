import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { compact } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { history } from '../util/history';
import queryString from 'query-string';
import { Result, Button, Typography, Row, Col, Alert, Tag, Icon, Spin } from 'antd';
import { Order, OrderStatus } from '~/imports/both/models';
import { OrderStatusBadge } from './Account/Account';
const { Title, Text } = Typography;

const ThankYou = withRouter(
	class extends Component {
		state = {
			result: false,
			error: false,
			loading: true,
		};
		componentDidMount() {
			const id = this.props.match.params.id;
			Meteor.call('api.getOrderThankYou', id, (err, res) => {
				if (err) {
					this.setState({ error: true, loading: false });
				} else {
					console.log(res);
					this.setState({ result: res, loading: false });
				}
			});
		}
		render() {
			if (this.state.error) {
				return (
					<Result
						status="error"
						title="Oh no! Something went wrong"
						subTitle={`Please go to account/orders, and check that order ${this.props.match.params.id} has been placed. If not, please contact support.`}
					/>
				);
			}
			if (this.state.loading) {
				return (
					<Spin spinning tip="Processing" indicator={<Icon type="loading" />}>
						<div style={{ width: '100%', height: '200px' }} />
					</Spin>
				);
			}
			return (
				<div>
					<Result
						status="success"
						title="Thank you for your Order!"
						subTitle={
							<Row align="middle">
								<Col span={24}>
									<div style={{ margin: '10px 0px' }}>
										<Text style={{ marginRight: 10 }}>Order Reference:</Text>
										<Text copyable strong>
											{this.state.result?.orderId}
										</Text>
										<br />
										<Text style={{ marginRight: 10 }}>Order Status:</Text>
										<OrderStatusBadge status={this.state.result?.status} />
									</div>
									<br />
									{this.state.result?.status === 'delivered' ? (
										<Alert
											showIcon={false}
											type="success"
											message={
												<Text>
													We have successfully delivered your codes via the chosen delivery methods! You can
													also view your codes in 'account/orders'
													<Button
														style={{
															background: '#53c41d',
															marginLeft: 20,
															border: 0,
															color: '#fff',
															marginLeft: 20,
														}}
														onClick={() => {
															history.push(`/account/orders/${this.state.result?.orderId}`);
														}}
													>
														View Codes <Icon type="arrow-right" />
													</Button>
												</Text>
											}
										/>
									) : this.state.result?.status === 'processing' ? (
										<Alert
											showIcon={false}
											type="info"
											message="We are currently processing your order. Orders normally process within 1 hour during our customer service hours (9am to midnight London time, 7 days a week). Outside of these times, orders will be processed the following morning. To check the status of your order, please go to 'account/orders' "
										/>
									) : this.state.result?.status === 'in_progress' ? (
										<Alert
											showIcon={false}
											type="info"
											message="We are in the process of releasing your codes! To check the status of your order, please go to 'account/orders' "
										/>
									) : (
										Object.keys(this.state.result?.verificationsRequired).length > 0 && (
											<Alert
												showIcon={false}
												type="warning"
												message={
													<span className="ant-alert-message">
														<Icon type="exclamation-circle" style={{ color: '#faad14' }} /> Verification
														Required
													</span>
												}
												description={
													<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
														<Text>
															Before we can process your order, you must first complete some verification
															<br />
														</Text>
														{compact(
															this.state.result?.verificationsRequired.map(verif => {
																if (verif === 'call') {
																	return (
																		<Text key={verif}>
																			<Icon type="phone" /> Call Verification Required
																		</Text>
																	);
																} else if (verif === 'video') {
																	return (
																		<Text key={verif}>
																			<Icon type="video-camera" /> Video Verification Required
																		</Text>
																	);
																} else {
																	return null;
																}
															})
														)}
														<br />
														<Link to="/verification">
															<Button
																style={{
																	backgroundColor: '#ff8b00',
																	border: 0,
																	color: '#5b3e00',
																	marginLeft: '20px',
																}}
															>
																Verify <Icon type="arrow-right" />
															</Button>
														</Link>
													</div>
												}
											/>
										)
									)}
								</Col>
							</Row>
						}
						extra={[
							<Button
								type="primary"
								key="console"
								onClick={() => {
									history.push('/account/orders');
								}}
							>
								View Orders
							</Button>,
							<Button
								key="buy"
								onClick={() => {
									history.push('/shop');
								}}
							>
								Shop Again
							</Button>,
						]}
					/>
				</div>
			);
		}
	}
);

export default ThankYou;
