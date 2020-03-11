import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { history } from '../../util/history';
import { Route, Link, Switch } from 'react-router-dom';
import _ from 'lodash';
import { TwilioCallLogs } from '~/imports/both/collections';
import { Row, Col, Typography, Button, Spin, Layout, Steps, Result, Alert, Icon } from 'antd';
import { Box } from './Box';
import { VerificationCall } from './VerificationCall';
import VerificationVideo from './VerificationVideo';
import Authentication from '../Authentication/Authentication';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Step } = Steps;

const VerificationOption = ({ name, icon, link, show, completed }) => {
	if (!show) {
		return null;
	}
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				margin: '0px 0px 10px 0px',
				background: '#f8f8f8',
				color: '#000000a6',
				padding: '8px',
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Icon theme="twoTone" style={{ fontSize: '1.3rem', padding: '0px 10px' }} type={icon} />
				<Text strong style={{ color: '#1a8fff' }}>
					{name}
				</Text>
			</div>
			<br />
			{completed ? (
				<Text strong style={{ color: '#1a8fff' }}>
					Completed <Icon type="check" />
				</Text>
			) : (
				<Row>
					<Text strong style={{ color: '#ff751a', marginRight: '10px' }}>
						Please complete
					</Text>
					<Link to={link}>
						<Button type="primary">Start</Button>
					</Link>
				</Row>
			)}
		</div>
	);
};

const VerificationMenu = props => {
	//prettier-ignore
	const noVerificationRequired = !props.verificationStatuses?.call?.show && !props.verificationStatuses?.video?.show;
	const completedAll = props?.user?.shouldShowVerificationBanner === false;
	return (
		<Authentication title="MiTunes Verification" loading={false}>
			{noVerificationRequired ? (
				<Text style={{ textAlign: 'center' }}>No verification required.</Text>
			) : (
				<>
					{completedAll ? (
						<Alert
							type="info"
							banner
							message="Thank you for completing the verification methods we asked for. We will process the verification and approve it within 24 hours."
							style={{ marginBottom: '10px' }}
						/>
					) : (
						<Alert
							type="warning"
							banner
							message="Please complete all of the following verification methods."
							style={{ marginBottom: '10px' }}
						/>
					)}
					<VerificationOption
						name="Phone Verification"
						icon="phone"
						link="/verification/call"
						show={props.verificationStatuses?.call?.show}
						completed={props.verificationStatuses?.call?.completed}
					/>
					<VerificationOption
						name="Video Verification"
						icon="video-camera"
						link="/verification/video"
						show={props.verificationStatuses?.video?.show}
						completed={props.verificationStatuses?.video?.completed}
					/>
				</>
			)}
		</Authentication>
	);
};

class VerificationContainer extends Component {
	render() {
		const { user, verificationCallStatus, ready } = this.props;
		if (!ready) {
			return (
				<Row
					type="flex"
					justify="center"
					align="middle"
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						right: 0,
						left: 0,
						backgroundColor: '#fff',
						flexDirection: 'column',
						fontSize: '3rem',
						fontWeight: 'bolder',
					}}
				>
					<Icon tip="Loading MiTunes Verification..." />
				</Row>
			);
		}
		return (
			<>
				<Switch>
					<Route exact path="/verification">
						<VerificationMenu verificationStatuses={user.verificationStatuses} user={user} />
					</Route>
					<Route exact path="/verification/call">
						<VerificationCall status={verificationCallStatus} />
					</Route>
					<Route exact path="/verification/video">
						<VerificationVideo {...user.verificationStatuses.video} />
					</Route>
				</Switch>
				<Route exact path="/verification">
					<Link to="/" style={{ color: 'white' }}>
						<Icon type="left" style={{ marginRight: '10px' }} />
						Back to MiTunes.tv
					</Link>
				</Route>
				<Route exact path="/verification/call">
					<Link to="/verification" style={{ color: 'white' }}>
						<Icon type="left" style={{ marginRight: '10px' }} />
						Back
					</Link>
				</Route>
				<Route exact path="/verification/video">
					<Link to="/verification" style={{ color: 'white' }}>
						<Icon type="left" style={{ marginRight: '10px' }} />
						Back
					</Link>
				</Route>
			</>
		);
	}
}

export default withTracker(props => {
	/**
	 * the prop 'verificationCallStatus' is used to update
	 * the frontend when the status of the call changes through
	 * 'ringing' -> 'in-progress' -> 'completed/failed'
	 */
	let handle = Meteor.subscribe('verificationCallStatus');

	const log = TwilioCallLogs.find().fetch()[0];

	console.log(log);

	if (!log || !log.status) {
		return {
			ready: handle.ready(),
			verificationCallStatus: 'not-started',
		};
	}

	return {
		ready: handle.ready(),
		verificationCallStatus: log.status,
	};
})(VerificationContainer);
