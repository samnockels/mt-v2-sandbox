import React, { Component } from 'react';

class EnsureLoggedOutContainer extends React.Component {
	render() {
		if (!this.props.user.isLoggedIn) {
			return this.props.children;
		} else {
			return null;
		}
	}
}
