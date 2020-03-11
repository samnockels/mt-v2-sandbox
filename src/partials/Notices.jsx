import React, { Component } from 'react';
import { Layout, Button, Row, Alert, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
const { Header } = Layout;

const EmailVerificationNotice = ({ email }) => {
	return (
		<Header style={{ backgroundColor: '#2feba4', textAlign: 'center', zIndex: 4 }}>
			Please verify <b>{email}</b>. We have sent you an email.
		</Header>
	);
};

const VerificationRequiredNotice = () => {
	return (
		<Alert
			//'#ffc018'
			style={{ backgroundColor: '#ffbc2b', textAlign: 'center', padding: '30px', zIndex: 4 }}
			showIcon={false}
			banner
			message={
				<Row>
					<Row>
						<Icon type="safety-certificate" />
						<Text style={{ fontSize: '1.1rem', color: '#5b3e00', marginLeft: '20px' }}>
							Before we can process your order, you must first complete some verification.
						</Text>
						<Link to="/verification">
							<Button
								style={{
									backgroundColor: '#ff8b00',
									border: 0,
									color: '#5b3e00',
									marginLeft: '20px',
									fontSize: '1.1rem',
								}}
							>
								Verify{' '}
								<Icon
									type="arrow-right"
									style={{
										fontSize: '1.1rem',
									}}
								/>
							</Button>
						</Link>
					</Row>
				</Row>
			}
		/>
	);
};

const Notices = ({ emailVerification, showVerification }) => {
	const showEmailVerification = emailVerification.verified === false;
	return (
		<>
			{showVerification && <VerificationRequiredNotice />}
			{showEmailVerification && <EmailVerificationNotice email={emailVerification.email} />}
		</>
	);
};

export default Notices;
