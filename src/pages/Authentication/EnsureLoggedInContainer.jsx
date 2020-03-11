import React, { Component } from 'react';

class EnsureLoggedInContainer extends React.Component {
	render() {
		if (this.props.user.isLoggedIn) {
			return this.props.children;
		} else {
			return <Redirect push to="/login" />;
		}
	}
}
