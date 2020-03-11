import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { history } from '../../util/history';
import { Route, Link, Switch } from 'react-router-dom';
import { Notification } from '~/imports/both/models';
import { Row, Col, Typography, Button, Spin, Layout, Steps, Result, Alert, Icon, message } from 'antd';
import Authentication from '../Authentication/Authentication';

const { Title, Text } = Typography;
const { Step } = Steps;

export class VerificationCall extends Component {
	state = {
		error: false,
	};

	makeCall() {
		Meteor.call('api.makeVerificationCall', (err, res) => {
			if (err) {
				if (err.error === 'mt.unauthorized') {
					message.info('Please login to continue');
				} else if (err.error === 'mt.callCompleted') {
					message.info('You have already completed a verification call!');
				} else {
					this.setState({ error: true });
				}
			} else {
				this.setState({ error: false });
			}
		});
	}

	getStatus() {
		if (this.state.error === true || this.props.status.includes('failed')) {
			return 'error';
		}
		if (this.props.status === 'completed') {
			return 'finish';
		}
		return 'process';
	}

	getStep() {
		switch (this.props.status) {
			case 'not-started':
				return 0;
			case 'dialing':
				return 1;
			case 'ringing':
				return 2;
			case 'in-progress':
				return 3;
			case 'completed':
			case 'failed.whoPlacedThisOrder':
			case 'failed.stateOrder':
				return 4;
			default:
				return 0;
		}
	}

	render() {
		return (
			<Authentication title="Phone Verification">
				{this.props.status !== 'completed' && (
					<Steps
						current={this.getStep()}
						status={this.getStatus()}
						size="small"
						progressDot
						direction="vertical"
					>
						<Step title="Start" />
						<Step title="Dialing" icon={this.props.status === 'dialing' ? <Icon type="loading" /> : null} />
						<Step title="Ringing" icon={this.props.status === 'ringing' ? <Icon type="loading" /> : null} />
						<Step
							title="In Progress"
							icon={this.props.status === 'in-progress' ? <Icon type="phone" /> : null}
						/>
						<Step title={this.props.status.includes('failed') ? 'Failed' : 'Completed'} />
					</Steps>
				)}
				{this.props.status === 'not-started' && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '40px 40px 20px 40px',
						}}
					>
						<Button type="primary" onClick={this.makeCall.bind(this)}>
							Call me
						</Button>
					</div>
				)}
				{this.props.status === 'completed' && (
					<Result
						status="success"
						title="Verification call completed."
						extra={[
							<Link to="/">
								<Button type="primary" key="home">
									Back to MiTunes
								</Button>
							</Link>,
						]}
					/>
				)}
				{(this.state.error === true || this.props.status.includes('failed')) && (
					<Result
						status="error"
						title="Verification failed."
						subTitle={
							<>
								<Text>Sorry, your call verification has failed.</Text>
								<br />
								<Text>
									{this.props.status === 'failed.whoPlacedThisOrder' &&
										'Next time, you must state who placed this order.'}
								</Text>
								<Text>
									{this.props.status === 'failed.stateOrder' &&
										'Next time, you must speak into the microphone clearly. You must also confirm your order at the end of the phone call by pressing 1.'}
								</Text>
							</>
						}
						extra={
							<Button type="primary" key="restart" onClick={this.makeCall.bind(this)}>
								Call me again
							</Button>
						}
					/>
				)}
			</Authentication>
		);
	}
}
