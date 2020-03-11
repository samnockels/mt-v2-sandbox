import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { history } from '../../util/history';
import { Route, Link, Switch } from 'react-router-dom';
import { Notification } from '~/imports/both/models';
import VideoRecorder from 'react-video-recorder';
import { Row, Col, Typography, Button, Spin, Layout, Steps, Result, Alert, Icon } from 'antd';
import Authentication from '../Authentication/Authentication';

// firebase to store the recorded video
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const { Title, Text } = Typography;
const { Step } = Steps;

class VideoUploadedError extends Error {
	constructor() {
		super();
		// a workaround to make `instanceof VideoUploadedError` work in ES5
		this.constructor = VideoUploadedError;
		this.__proto__ = VideoUploadedError.prototype;
	}
}

export default class VerificationVideoContainer extends Component {
	state = {
		ready: false,
		error: false,
		jwt: null,
		videoUploaded: false,
	};

	onUpload = blob => {
		return this.videoPathRef.put(blob);
	};

	checkIfVideoIsUploaded() {
		if (!this.state.jwt) {
			this.setState({ error: true, ready: true });
			return;
		}
		firebase
			.auth()
			.signInWithCustomToken(this.state.jwt)
			.then(() => {
				// Get reference path
				const path = JSON.parse(atob(this.state.jwt.split('.')[1])).claims.path;
				this.videoPathRef = firebase
					.storage()
					.ref()
					.child(`videos/${path}`);
				// Check if file exists
				return this.videoPathRef.getDownloadURL();
			})
			.then(url => {
				// Should not get download URL
				return Promise.reject(new VideoUploadedError('Video Uploaded'));
			})
			.catch(error => {
				if (error.code === 'storage/object-not-found') {
					// This is what we want. Nothing uploaded to server yet.
					return;
				} else if (error instanceof VideoUploadedError) {
					// User has already uploaded
					this.setState({ videoUploaded: true });
					return;
				} else {
					// Unknown error occurred
					this.setState({ error: true });
				}
			})
			.finally(() => {
				this.setState({ ready: true });
			});
	}

	componentDidMount() {
		// 1. Initialise the app (if not already initialised)
		if (firebase.apps.length === 0) {
			firebase.initializeApp({
				apiKey: 'AIzaSyCgtpq6IiIAa7yxWce1xwQxEb1nh8O31gI',
				authDomain: 'mitunes-vid.firebaseapp.com',
				databaseURL: 'https://mitunes-vid.firebaseio.com',
				storageBucket: 'mitunes-vid',
			});
		}
		// 2. login as the user, and check if they have uploaded a video
		Meteor.call('api.getVerificationVideoLoginToken', (err, res) => {
			if (err) {
				this.setState({ error: true });
			} else {
				this.setState({ jwt: res }, () => {
					this.checkIfVideoIsUploaded();
				});
			}
		});
	}

	render() {
		if (this.state.error) {
			return (
				<Authentication title="Video Verification">
					<Result status="error" title="An error has occurred." />
				</Authentication>
			);
		}

		if (!this.state.ready) {
			return (
				<Authentication title="Video Verification">
					<Spin spinning tip="Loading" indicator={<Icon type="loading" />}>
						<div style={{ height: '100px' }}></div>
					</Spin>
				</Authentication>
			);
		}

		if (this.state.videoUploaded) {
			return (
				<Authentication title="Video Verification">
					<Result status="success" title="Video already submitted!" />
				</Authentication>
			);
		}

		return <VerificationVideo firebase={firebase} onUpload={this.onUpload.bind(this)} />;
	}
}

class VerificationVideo extends Component {
	state = {
		error: false,
		status: 'start',
		recording: {},
	};

	getStatus() {
		if (this.state.error === true || this.state.status === 'failed') {
			return 'error';
		}
		if (this.state.status === 'completed') {
			return 'finish';
		}
		return 'process';
	}

	getStep() {
		switch (this.state.status) {
			case 'start':
				return 0;
			case 'record':
			case 'recording':
				return 1;
			case 'review-and-submit':
				return 2;
			case 'submitting':
			case 'completed':
			case 'failed':
				return 3;
			default:
				return 0;
		}
	}

	onTurnOnCamera() {
		this.setState({ status: 'record' });
	}

	onStartRecording() {
		this.setState({ status: 'recording' });
	}

	onRecordingComplete(videoBlob, startedAt, thumbnailBlob, duration) {
		this.setState({ recording: { videoBlob, startedAt, thumbnailBlob, duration } });
	}

	onStopRecording() {
		this.setState({ status: 'review-and-submit' });
	}

	useAnotherVideo() {
		this.setState({ status: 'start' });
	}

	submitVideo() {
		this.setState({ status: 'submitting' });
		this.props
			.onUpload(this.state.recording.videoBlob)
			.then(response => {
				this.setState({ status: 'completed' });
				Meteor.call('api.verificationVideoCompleted');
			})
			.catch(err => {
				this.setState({ status: 'failed' });
			});
	}

	render() {
		if (this.props.required === false) {
			return (
				<Authentication title="Video Verification">
					<Result status="info" title="We do not require video verification at this time" />
				</Authentication>
			);
		}
		if (this.props.approved === true) {
			return (
				<Authentication title="Video Verification">
					<Result status="success" title="Video verification passed" />
				</Authentication>
			);
		}
		if (this.props.completed === true) {
			return (
				<Authentication title="Video Verification">
					<Result status="success" title="Video verification submitted!" />
				</Authentication>
			);
		}
		return (
			<Authentication title="Video Verification">
				<Steps current={this.getStep()} status={this.getStatus()}>
					<Step title="Start" />
					<Step title="Record" icon={this.state.status === 'recording' ? <Icon type="loading" /> : null} />
					<Step title="Review" />
					<Step
						title={
							this.state.status === 'failed'
								? 'Failed'
								: this.state.status === 'submitting'
								? 'Submitting'
								: 'Complete'
						}
						icon={this.state.status === 'submitting' ? <Icon type="loading" /> : null}
					/>
				</Steps>
				{this.state.status !== 'completed' &&
					this.state.status !== 'submitting' &&
					this.state.status !== 'failed' && (
						<Row style={{ margin: '10px 0px' }}>
							<VideoRecorder
								onTurnOnCamera={this.onTurnOnCamera.bind(this)}
								onStartRecording={this.onStartRecording.bind(this)}
								onStopRecording={this.onStopRecording.bind(this)}
								onStopReplaying={this.useAnotherVideo.bind(this)}
								onError={console.log}
								onRecordingComplete={this.onRecordingComplete.bind(this)}
							/>
						</Row>
					)}
				{this.state.status === 'review-and-submit' && (
					<Row style={{ marginTop: '40px', textAlign: 'center' }}>
						<Button type="primary" size="large" onClick={this.submitVideo.bind(this)}>
							Submit Recording
						</Button>
					</Row>
				)}
				{this.state.status === 'completed' && (
					<Result
						status="success"
						title="Verification video submitted."
						subTitle="Thank you for completing the verification video. We will process your video within 24 hours."
						extra={[
							<Link to="/verification">
								<Button type="primary" key="back">
									Back to Verification Menu
								</Button>
							</Link>,
							<Link to="/">
								<Button type="primary" key="home">
									Back to MiTunes
								</Button>
							</Link>,
						]}
					/>
				)}
				{(this.state.error === true || this.state.status === 'failed') && (
					<Result
						status="error"
						title="Verification failed."
						subTitle="Oops. Something went wrong. Click the button below to try again."
						extra={
							<Button
								type="primary"
								key="restart"
								onClick={() => {
									this.setState({ error: false, status: 'start' });
								}}
							>
								Restart
							</Button>
						}
					/>
				)}
			</Authentication>
		);
	}
}
