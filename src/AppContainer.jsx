import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { get } from 'lodash';
import { Result, message, Row, Icon } from 'antd';

import { Order } from '~/imports/both/models';
import { App } from './App';
import { SiteLoading } from './components/SiteLoading';

/*
|--------------------------------------------------------------------------
| 2. Fetch additional data
| > Make one time calls to fetch data here
|
| Here we wait for the user to be ready (either logged in or out) before
| fetching additional user data. We also fetch the products to display. 
| 
| Once all data is ready, we render the App, passing our data as props.
|--------------------------------------------------------------------------
*/
class AppContainer extends Component {
	state = {
		ready: {
			load: false,
			user: false,
			orders: false,
		},
		products: [],
		productsByCategory: [],
		homepage: [],
		currencies: [],
		defaultCurrency: '',
		slider: [],
		user: false,
		orders: false,
	};

	componentDidMount() {
		this.api.load(() => console.log(this.state));
		if (this.props.user.isReady) {
			if (this.props.user.isLoggedIn) {
				this.events.onUserLogin();
			} else {
				this.events.onUserLogout();
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const propsUpdated = JSON.stringify(prevProps) !== JSON.stringify(this.props);
		// const stateUpdated = JSON.stringify(prevState) !== JSON.stringify(this.state);
		//prettier-ignore
		const orderStatusChanged = JSON.stringify(this.props.orderStatuses) !== JSON.stringify(prevProps.orderStatuses);
		const userChanged = this.props.user.isLoggedIn !== prevProps.user.isLoggedIn;
		const userLoggedIn = this.props.user.isLoggedIn;
		const userReady = this.props.user.isReady;

		if (propsUpdated) {
			if (userChanged && userReady) {
				if (userLoggedIn) {
					this.events.onUserLogin();
				} else {
					this.events.onUserLogout();
				}
			}

			if (orderStatusChanged && userLoggedIn) {
				this.events.onOrderStatusChange();
			}
		}
	}

	readyChange(changes, done) {
		this.setState(
			{
				ready: {
					...this.state.ready,
					...changes,
				},
			},
			done
		);
	}

	error(status, message) {
		this.setState({
			error: {
				status,
				message,
			},
		});
	}

	events = {
		onUserLogin: () => {
			console.log('onUserLogin');
			this.api.loadUser(() => {
				// load orders once we know that
				// we have successfully loaded the user
				this.api.loadOrders();
			});
		},
		onUserLogout: () => {
			console.log('onUserLogout');
			this.setState({
				user: false,
				orders: false,
				ready: {
					...this.state.ready,
					user: false,
					orders: false,
				},
			});
		},
		onOrderStatusChange: () => {
			console.log('onOrderStatusChange');
			this.api.loadOrders();
		},
	};

	api = {
		load: done => {
			this.readyChange({ load: false }, () => {
				Meteor.call('api.load', (err, res) => {
					if (err) {
						console.log('load err', err);
						this.error('500', 'Oh no... Something went wrong.');
						this.readyChange({ load: true });
						return;
					}
					this.setState(
						{
							products: get(res, 'products', []),
							productsByCategory: get(res, 'productsByCategory', []),
							homepage: get(res, 'homepage', []),
							slider: get(res, 'homepageSlider', []),
							currencies: get(res, 'currencies', []),
							defaultCurrency: get(res, 'defaultCurrency', ''),
							stock: get(res, 'stock', []),
							activeDeliveryMethods: get(res, 'activeDeliveryMethods', []),
						},
						() => {
							this.readyChange({ load: true });
							if (typeof done === 'function') done();
						}
					);
				});
			});
		},

		loadUser: done => {
			this.readyChange({ user: false }, () => {
				Meteor.call('api.loadUser', (err, res) => {
					if (err || res.error === true) {
						console.log('loadUser err', err);
						Meteor.logout();
						//prettier-ignore
						message.error('An error occurred when logging you in. Please try again later.');
						return;
					}
					this.setState(
						{
							user: {
								...res,
							},
						},
						() => {
							this.readyChange({ user: true });
						}
					);
					if (typeof done === 'function') done();
				});
			});
		},

		loadOrders: done => {
			this.readyChange({ orders: false }, () => {
				Meteor.call('api.loadOrders', (err, res) => {
					this.readyChange({ orders: true });
					if (err || !Array.isArray(res)) {
						console.log('loadOrders err', err);
						this.setState({ orders: [] });
						return;
					}
					// fill status
					const orders = res.map(order => {
						return {
							...order,
							status: this.props.orderStatuses[order._id] || 'processing',
						};
					});
					this.setState({ orders });
					if (typeof done === 'function') done();
				});
			});
		},
	};

	hasLoadedUserData() {
		if (this.props.user.isReady) {
			if (this.props.user.isLoggedIn) {
				return this.state.ready.user;
			} else {
				return true;
			}
		}
	}

	render() {
		if (!this.state.ready.load) {
			return <SiteLoading />;
		}

		if (this.state.error) {
			return (
				<Result
					status={get(this.state.error, 'status', '500')}
					message={get(this.state.error, 'message', 'Oh no... Something went wrong.')}
				/>
			);
		}

		return (
			<App
				// guest
				products={this.state.products}
				productsByCategory={this.state.productsByCategory}
				homepageProducts={this.state.homepage}
				currencies={this.state.currencies}
				defaultCurrency={this.state.defaultCurrency}
				slider={this.state.slider}
				activeDeliveryMethods={this.state.activeDeliveryMethods}
				// logged in
				user={{
					...this.state.user,
					isLoggedIn: this.state.inEmailFlow === true ? false : this.props.user.isLoggedIn,
					isReady:
						this.state.inEmailFlow === true ? true : this.props.user.isReady && this.hasLoadedUserData(),
				}}
				orders={this.state.orders}
				// expose events & api
				ready={this.state.ready}
				events={this.events}
				api={this.api}
			/>
		);
	}
}

/*
|--------------------------------------------------------------------------
| 1. Subscribe to any reactive data source
| 
| FetchData will be updated whenever there is a change to Meteor.user, and 
| the user will be passed as a prop. 
|--------------------------------------------------------------------------
*/
export default withTracker(props => {
	let user = {
		isLoggedIn: !!Meteor.user() && !Meteor.loggingIn(),
		isReady: !Meteor.loggingIn(),
	};

	if (!user.isLoggedIn) {
		return { user };
	}

	// subscribe to all order statuses from the logged in user
	let orderStatusesHandle = Meteor.subscribe('allOrderStatuses');
	const orders = Order.find({}).fetch();
	let orderStatusesMap = {};
	orders.forEach(order => {
		orderStatusesMap[order._id] = order.status;
	});

	return {
		user,
		orderStatuses: orderStatusesMap,
		ready: user.ready && orderStatusesHandle.ready(),
	};
})(AppContainer);
