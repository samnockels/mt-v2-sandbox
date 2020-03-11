import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { history } from './util/history';

// Pages
import VerifyEmail from './pages/Authentication/VerifyEmail';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';

import { Layout, Row, Icon, Spin, Result, message, Modal, Button } from 'antd';
const { Header, Content, Footer } = Layout;

const NotFound = () => {
	// if not a valid URL then just redirect to the normal app
	// window.location.href = Meteor.absoluteUrl();
	return null;
};

export default EmailFlow = () => {
	return (
		<Router history={history}>
			<Switch>
				<Route exact path="/verify-email/:token" component={VerifyEmail} />
				<Route exact path="/reset-password/:token" component={ResetPassword} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
};
