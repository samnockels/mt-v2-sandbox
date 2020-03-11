import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import Cookies from 'js-cookie';
import queryString from 'query-string';
import ReactJson from 'react-json-view';
import { Router, Switch, Route, Link } from 'react-router-dom';
import Fuse from 'fuse.js';

import { history } from './util/history';

// Components
import Container from './components/Container';
import { SiteLoading } from './components/SiteLoading';

// Partials
import { PrimaryNavigation, SecondaryNavigation } from './partials/SiteNavigation';
import { ProductGrid } from './partials/ProductGrid';
import Notices from './partials/Notices';
import Slider from './partials/Slider';

// Pages
import Homepage from './pages/Homepage';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Product from './pages/Product/Product';
import NotFound from './pages/NotFound';
import { Login, Register } from './pages/Authentication';
import Welcome from './pages/Welcome';
import ThankYou from './pages/ThankYou';
import Account from './pages/Account/Account';
import Verification from './pages/Verification/VerificationMenu';
import VerifyEmail from './pages/Authentication/VerifyEmail';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import SearchResults from './pages/SearchResults';

import {
	Layout,
	Row,
	Icon,
	Spin,
	Result,
	message,
	Modal,
	Button,
	PageHeader,
	Typography,
	Divider,
} from 'antd';
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

Accounts.onLogin(loginDetails => {
	if (loginDetails.type !== 'resume' && history.location.pathname.includes('login')) {
		const redirect = queryString.parse(history.location.search).ru;
		// redirect after login?
		if (typeof redirect === 'string' && redirect.length > 0) {
			history.push(`/${redirect}`);
			return;
		}
		history.push('/');
	}
});

const LoggedInContainer = props => {
	console.log(
		`LoggedInContainer: isReady ${props.user.isReady ? 1 : 0} isLoggedIn ${props.user.isLoggedIn ? 1 : 0}`
	);
	if (!props.user.isReady || (props.user.isLoggedIn && !Array.isArray(props.orders))) {
		console.log('LoggedInContainer waiting for data to settle');
		return <SiteLoading />; // wait for the user data to settle
	}
	if (!props.user.isLoggedIn) {
		const route = history.location.pathname.slice(1, history.location.pathname.length);
		const invalidRoutes = ['/thank-you'];
		if (invalidRoutes.includes(route)) {
			history.push('/');
		}
		history.push(`/login?ru=${route}`);
		return null;
	}
	return props.children;
};

const searchOptions = {
	shouldSort: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
};

/*
|--------------------------------------------------------------------------
| 3. Render the app
|--------------------------------------------------------------------------
*/

class Storefront extends Component {
	state = {
		// theme for the main navbar
		menuTheme: { ...this.homepageTheme },
		cart: {
			total: '0',
			items: {},
		},
		newItemInCart: false, // if true, show the cart badge
		selectedCurrency: this.props.defaultCurrency,
		lastRoute: '/',
	};

	componentDidMount() {
		// fetch cart from cookies
		if (Cookies.get('cart')) {
			this.setState({ cart: JSON.parse(Cookies.get('cart')) }, () => {
				this.refreshCart();
			});
		}

		window.productSearcher = new Fuse(this.props.products, { ...searchOptions, keys: ['title', 'sku'] });
		window.categoriesSearcher = new Fuse(this.props.productsByCategory, { ...searchOptions, keys: ['name'] });

		window.makeSearch = searchText => {
			return {
				productResults: window.productSearcher.search(searchText),
				categoriesResults: window.categoriesSearcher.search(searchText),
			};
		};

		history.listen(this.routeChange.bind(this));
		this.routeChange(history.location);

		this.initTawk(Meteor.settings.public.tawkToId, Tawk_API => {
			Tawk_API.setAttributes(
				{
					name: Meteor.user()?.username,
					email: Meteor.user()?.emails[0]?.address,
				},
				function(error) {}
			);
		});
	}

	initTawk(tawkToId, readyCallback) {
		if (!tawkToId) {
			return; // abandon tawk
		}
		const tawkToScript = document.getElementById('tawkToScript');
		if (tawkToScript) {
			// Prevent TawkTo to create root script if it already exists
			return window.Tawk_API;
		}
		const s1 = document.createElement('script');
		s1.id = 'tawkToScript';
		s1.async = true;
		s1.src = 'https://embed.tawk.to/' + tawkToId + '/default';
		s1.setAttribute('crossorigin', '*');
		const s0 = document.getElementsByTagName('script')[0];
		if (!s0 || !s0.parentNode) {
			return; // abandon tawk
		}
		s0.parentNode.insertBefore(s1, s0);

		document.body.appendChild(s0);
		document.body.appendChild(s1);

		var check = function(callback) {
			if (window && window.Tawk_API && window.Tawk_API.getStatus() !== undefined) {
				callback(window.Tawk_API);
				return;
			}
			setTimeout(function() {
				check(callback);
			}, 0);
		};

		check(readyCallback);
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
			console.log(
				`App: isLoggedIn ${this.props.user.isLoggedIn ? 1 : 0}, isReady ${
					this.props.user.isReady ? 1 : 0
				}, username ${this.props.user.username || '--'}`
			);
			window.productSearcher = new Fuse(this.props.products, { ...searchOptions, keys: ['title', 'sku'] });
			window.categoriesSearcher = new Fuse(this.props.productsByCategory, {
				...searchOptions,
				keys: ['name'],
			});
		}
	}

	routeChange(location, action) {
		console.log(location.pathname);
		// do some theme stuff
		if (location.pathname === '/') {
			this.setHomepageTheme();
		} else {
			this.setDefaultTheme();
		}

		// get latest user verification data
		console.log(location, action);
		if (
			location.pathname === '/verification' ||
			(this.state.lastRoute === '/verification' && location.pathname === '/')
		) {
			this.props.api.loadUser();
		}
		this.setState({ lastRoute: location.pathname });
	}

	/**
	 * Theme
	 */
	homepageTheme = {
		theme: this.props.slider[0]?.menuTheme || 'light',
		backgroundColor: this.props.slider[0]?.backgroundColor || '#2f54eb',
		primaryButtonColour: this.props.slider[0]?.buttonColor || '#0026c8',
		primaryTextColour: this.props.slider[0]?.textColor || 'white',
		primaryButtonTextColour: this.props.slider[0]?.buttonTextColor || 'white',
	};
	defaultTheme = {
		theme: 'light',
		backgroundColor: '#2f54eb',
		primaryButtonColour: '#0026c8',
		primaryTextColour: 'white',
		primaryButtonTextColour: 'white',
	};
	setMenuTheme = menuTheme => {
		this.setState({ menuTheme });
	};
	setHomepageTheme = () => {
		this.setState({ menuTheme: this.homepageTheme });
	};
	setDefaultTheme = () => {
		this.setState({ menuTheme: this.defaultTheme });
	};
	getNavigationContainerStyle = () => {
		if (location.pathname === '/') {
			return {
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 10,
				backgroundColor: 'transparent',
				padding: '20px 5px',
			};
		} else {
			return {
				backgroundColor: this.state.menuTheme.backgroundColor,
				zIndex: 10,
				padding: '20px 5px',
			};
		}
	};

	/**
	 * Cart
	 */

	addToCart = (lineItem, done) => {
		console.log(JSON.stringify({ 'Add to cart (raw): ': lineItem }, null, 2));

		let cart = this.state.cart;

		Meteor.call('api.addToCart', cart, lineItem, this.state.selectedCurrency, (err, res) => {
			// upon error, don't update the cart object
			if (err || !res || (res && res.success === false)) {
				if (err.error === 'mt.currencyConversion.unknownBaseCurrency') {
					message.warn(`Sorry, the selected currency is unavailable for this product.`);
				} else if (err.error === 'mt.notEnoughStock') {
					message.warn('Sorry but we do not have enough stock of this product.');
					this.refreshCart();
				} else if (err.error === 'mt.outOfStock') {
					message.warn('Sorry but we are out of stock of this product.');
					this.refreshCart();
				} else {
					message.error('Something went wrong when adding to cart.');
				}
			} else {
				console.log(JSON.stringify({ 'Add To Cart (response): ': res }, null, 2));
				const { updatedCart, addedLineItem } = res;
				message.success(`${addedLineItem.title} (x${addedLineItem.quantity}) added to cart! 🎉`);
				this.setState({ cart: updatedCart, newItemInCart: true });
				Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
			}
			if (typeof done === 'function') done(); // this is used to reset the product selection form
		});
	};

	refreshCart = done => {
		Meteor.call('api.refreshCart', this.state.cart, this.state.selectedCurrency, (err, res) => {
			if (err) {
				console.log(err);
				message.error('Something went wrong when refreshing the cart.');
				return;
			}

			if (res.messages && Array.isArray(res.messages)) {
				res.messages.forEach(msg => {
					if (typeof msg === 'string') {
						message.warning(msg);
					}
				});
			}

			console.log(JSON.stringify({ 'Refresh Cart: ': res }, null, 2));
			const refreshedCart = res.updatedCart;
			this.setState({ cart: refreshedCart });
			Cookies.set('cart', JSON.stringify(refreshedCart), { expires: 7 });

			if (typeof done === 'function') done();
		});
	};

	resetNewItemInCart = () => {
		this.setState({ newItemInCart: false });
	};

	updateCartItemQuantity = (itemHash, newQuantity) => {
		if (newQuantity === 0) {
			Modal.confirm({
				title: 'Are you sure?',
				content: 'Are you sure you want to remove this item from the cart?',
				okText: 'Yes',
				cancelText: 'Cancel',
				onOk: () => this.removeCartItem(itemHash),
			});
		} else {
			let cart = this.state.cart;
			if (!cart.items[itemHash]) return;
			console.log(newQuantity);
			cart.items[itemHash].quantity = newQuantity;
			this.setState({ cart });
			Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
			this.refreshCart();
		}
	};

	removeCartItem = itemHash => {
		let cart = this.state.cart;
		if (!cart.items[itemHash]) return;
		delete cart.items[itemHash];
		this.setState({ cart });
		Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
		this.refreshCart();
	};

	/**
	 * Misc
	 */

	changeCurrency = currency => {
		if (!this.props.currencies.includes(currency)) {
			message.error(`Sorry, but ${currency} is unavailable at this time.`);
			return;
		}
		this.setState({ selectedCurrency: currency }, () => {
			this.refreshCart();
		});
	};

	/**
	 * Render
	 */

	renderError = (status, message) => {
		return <Result status={status || '500'} message={message || 'Something went wrong'} />;
	};

	renderProductPage = props => {
		let slug = props.match.params.slug;
		let product = false;
		this.props.products.forEach(element => {
			if (element.slug === slug) {
				product = element;
			}
		});
		if (!product) {
			return this.renderError('404', 'Not Found');
		}
		return (
			<Product
				product={product}
				activeDeliveryMethods={this.props.activeDeliveryMethods}
				addToCart={(lineItem, done) => this.addToCart(lineItem, done)}
			/>
		);
	};

	render() {
		const { products, productsByCategory, homepageProducts, currencies, slider, user, orders } = this.props;
		const { menuTheme } = this.state;
		return (
			<Layout className="layout">
				<Container rowStyle={this.getNavigationContainerStyle()}>
					<PrimaryNavigation
						theme={menuTheme}
						// products for search
						products={products}
						productsByCategory={productsByCategory}
						// currency
						currencies={this.props.currencies}
						selectedCurrency={this.state.selectedCurrency}
						changeCurrency={currency => this.changeCurrency(currency)}
						// cart
						cart={this.state.cart}
						removeItem={hash => this.removeCartItem(hash)}
						showCartBadge={this.state.newItemInCart}
						hideCartBadge={() => this.resetNewItemInCart()}
					/>
				</Container>

				<Route exact path="/">
					<Slider slider={slider} setMenuTheme={this.setMenuTheme} />
				</Route>

				<SecondaryNavigation />

				{this.props.user.isLoggedIn && this.props.user.isReady && (
					<Notices
						showVerification={this.props.user.shouldShowVerificationBanner}
						emailVerification={{
							verified: this.props.user.emails[0]?.verified,
							email: this.props.user.emails[0]?.address,
						}}
					/>
				)}

				<Switch>
					<Route exact path="/checkout">
						<LoggedInContainer user={this.props.user} orders={this.props.orders}>
							<Checkout
								cart={this.state.cart}
								user={this.props.user}
								refreshCart={done => this.refreshCart(done)}
							/>
						</LoggedInContainer>
					</Route>

					<Route>
						<Container
							rowStyle={{
								background: 'white',
								minHeight: 'calc(100vh - 69px - 64px)', // viewport height - footer height - navbar height
							}}
							style={{
								background: 'white',
								boxShadow: '0 0 35px -5px #ebebeba3',
								...(history?.location?.pathname.includes('/account') ? { padding: '0px 25px' } : {}),
							}}
						>
							<Switch>
								<Route exact path="/">
									<Homepage homepageProducts={this.props.homepageProducts} />
								</Route>
								<Route exact path="/cart">
									<Cart
										cart={this.state.cart}
										removeCartItem={hash => this.removeCartItem(hash)}
										updateCartItemQuantity={(hash, quantity) => this.updateCartItemQuantity(hash, quantity)}
									/>
								</Route>
								<Route path="/product/:slug" render={props => this.renderProductPage(props)}></Route>
								<Route exact path={'/shop'}>
									<Shop productsByCategory={productsByCategory} />
								</Route>
								<Route exact path={'/shop/:categoryId'}>
									<ShopCategory productsByCategory={productsByCategory} />
								</Route>
								<Route exact path={['/search/:searchText']}>
									<SearchResults products={products} productsByCategory={productsByCategory} />
								</Route>
								<Route exact path="/place-order-failed">
									Something went wrong when placing the order. Please contact support.
								</Route>
								<Route exact path="/payment-failed">
									Something went wrong when processing the payment. Please contact support.
								</Route>
								<Route path={['/account', '/thank-you/:id']}>
									<LoggedInContainer user={this.props.user} orders={this.props.orders}>
										<Switch>
											<Route path="/account">
												<Account user={this.props.user} orders={this.props.orders} api={this.props.api} />
											</Route>
											<Route exact path="/thank-you/:id">
												<ThankYou />
											</Route>
											<Route></Route>
										</Switch>
									</LoggedInContainer>
								</Route>
								<Route component={NotFound} />
							</Switch>
						</Container>
					</Route>
				</Switch>
				<Footer style={{ textAlign: 'center' }}>MiTunes © 2019</Footer>
			</Layout>
		);
	}
}

export class App extends Component {
	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/forgot-password" component={ForgotPassword} />
					<Route path={['/verification', '/verification-call', '/verification-video']}>
						<LoggedInContainer user={this.props.user} orders={this.props.orders}>
							<Verification user={this.props.user} />
						</LoggedInContainer>
					</Route>
					<Route>{!this.props.user.isReady ? <SiteLoading /> : <Storefront {...this.props} />}</Route>
				</Switch>
			</Router>
		);
	}
}

class DevContainer extends Component {
	state = {
		visible: false,
	};
	show = () => {
		this.setState({ visible: true });
	};
	hide = () => {
		this.setState({ visible: false });
	};
	render() {
		return (
			<>
				<div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
					<Button onClick={() => this.show()}>Dev Tools</Button>
					<Modal visible={this.state.visible} footer={null} closable onCancel={() => this.hide()}>
						<ReactJson src={this.props.data.props} name="<App/> props" collapsed={1} />
						<ReactJson src={this.props.data.state} name="<App/> state" collapsed={1} />
					</Modal>
				</div>
				{this.props.children}
			</>
		);
	}
}
