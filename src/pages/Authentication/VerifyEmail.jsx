import React, { Component } from 'react';
import { Row, Col, Typography, Button, Spin, Icon, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Authentication from './Authentication';

const { Title, Text } = Typography;

export default withRouter(
	class extends Component {
		state = {
			result: false,
			resentEmail: false,
			resendingEmail: false,
		};

		componentDidMount() {
			setTimeout(() => this.verifyEmail(), 500);
		}

		verifyEmail() {
			const token = this.props.match.params.token;
			const self = this;
			console.log('verifyEmail');
			Accounts.verifyEmail(token, err => {
				console.log(err);
				if (err) {
					self.setState({ result: 'expired' });
				} else {
					self.setState({ result: 'success' });
				}
			});
		}

		resendEmail() {
			this.setState({ resendingEmail: true });
			Meteor.call('api.resendVerificationEmail', (err, res) => {
				this.setState({ resendingEmail: false });
				if (err) {
					if (err.error === 'mt.unauthorized') {
						this.setState({ result: 'loginToResend' });
					} else if (err.error === 'mt.alreadyVerifiedEmail') {
						this.setState({ result: 'alreadyVerifiedEmail' });
					}
				} else {
					this.setState({ resentEmail: true });
				}
			});
		}

		render() {
			console.log(JSON.stringify(this.state, null, 2));

			if (this.state.result === false) {
				return (
					<Authentication title="" loading={false}>
						<Text style={{ textAlign: 'center' }}>
							<Icon type="loading" /> Verifying
						</Text>
					</Authentication>
				);
			}

			if (this.state.result === 'success') {
				return (
					<Authentication title="Email verification" loading={false}>
						<Text>Thank you for verifying your email. </Text>
						<br />
						<a href={Meteor.absoluteUrl()}>
							<Button type="primary" style={{ marginTop: '28px' }}>
								Start Shopping
							</Button>
						</a>
					</Authentication>
				);
			}

			if (this.state.result === 'expired') {
				return (
					<Authentication title="Email verification" loading={false}>
						The link you clicked on has expired.
						<br />
						<Button
							type="primary"
							style={{ marginTop: '28px' }}
							loading={this.state.resendingEmail}
							onClick={() => this.resendEmail()}
						>
							Resend Email
						</Button>
						{this.state.resentEmail && <Alert type="success" message="Email sent successfully" />}
					</Authentication>
				);
			}

			if (this.state.result === 'loginToResend') {
				return (
					<Authentication title="Email verification" loading={false}>
						<Text>
							You must be logged in to resend your email. Please login, and then go to <b>Manage Account</b>
							and press the 'Resend Verification Email' button.
						</Text>
						<br />
						<a href={Meteor.absoluteUrl('/login')} target="_blank">
							<Button type="primary">Login</Button>
						</a>
					</Authentication>
				);
			}

			if (this.state.result === 'alreadyVerifiedEmail') {
				return (
					<Authentication title="Email verification" loading={false}>
						<Text>Your email has already been verified! </Text>
						<br />
						<a href={Meteor.absoluteUrl()}>
							<Button type="primary" style={{ marginTop: '28px' }}>
								Start Shopping
							</Button>
						</a>
					</Authentication>
				);
			}
		}
	}
);
