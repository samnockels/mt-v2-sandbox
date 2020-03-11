import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Avatar, Icon, Button, Drawer, Input } from 'antd';
import { Responsive } from '../components/MediaQueries';
import { MiniCart } from '../components/MiniCart';
import { Search, renderSearchResults, SearchResultsAsList } from '../components/Search';
import { CurrencySwitcher } from '../components/CurrencySwitcher';
import Container from '../components/Container';
import { Link } from 'react-router-dom';
const { Header } = Layout;

const AccountMenu = (
	<Menu style={{ marginTop: '15px', width: '100px' }}>
		<Menu.Item key="1">
			<Link to="/account/manage">Account</Link>
		</Menu.Item>
		<Menu.Item key="2">
			<Link to="/account/orders">Orders</Link>
		</Menu.Item>
		<Menu.Divider />
		<Menu.Item
			key="3"
			onClick={() => {
				Meteor.logout();
			}}
		>
			Log Out
		</Menu.Item>
	</Menu>
);

const AccountDropdown = ({ theme, primaryTextColour, primaryButtonColour, primaryButtonTextColour }) => {
	if (Meteor.user()) {
		return (
			<Dropdown overlay={AccountMenu} trigger={['click']} style={{ margin: '0px 20px' }}>
				<a
					className="ant-dropdown-link"
					href="#"
					style={{
						color: theme === 'light' ? 'white' : primaryButtonTextColour,
						marginLeft: '10px',
					}}
				>
					<Avatar
						style={{
							backgroundColor: primaryButtonColour,
							color: primaryButtonTextColour,
							marginRight: '7px',
						}}
						icon="user"
						size="small"
					/>
					{Meteor.user().username} <Icon type="down" />
				</a>
			</Dropdown>
		);
	} else {
		return (
			<Link to="/login">
				<Button
					style={{
						backgroundColor: primaryButtonColour,
						border: primaryButtonColour,
						color: primaryButtonTextColour,
						marginLeft: '10px',
					}}
				>
					Log In
				</Button>
			</Link>
		);
	}
};

const NavigationButtons = props => {
	return [
		<CurrencySwitcher
			key="currencySwitcher"
			currencies={props.currencies}
			selectedCurrency={props.selectedCurrency}
			changeCurrency={props.changeCurrency}
			primaryButtonColour={props.theme.primaryButtonColour}
			primaryButtonTextColour={props.theme.primaryButtonTextColour}
		/>,
		<MiniCart
			key="miniCart"
			showBadge={props.showCartBadge}
			cart={props.cart}
			removeItem={props.removeItem}
			onClick={() => props.hideCartBadge()}
			primaryButtonColour={props.theme.primaryButtonColour}
			primaryButtonTextColour={props.theme.primaryButtonTextColour}
		/>,
		<AccountDropdown
			key="account"
			theme={props.theme.theme}
			primaryButtonColour={props.theme.primaryButtonColour}
			primaryButtonTextColour={props.theme.primaryButtonTextColour}
			primaryTextColour={props.theme.primaryTextColour}
		/>,
	];
};

menuListItemStyle = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '14px',
	backgroundColor: '#fbfbfb',
	borderBottom: '1px solid #e9e9e9',
	cursor: 'pointer',
	color: '#505050',
};

const SecondaryNavigationComponent = () => {
	return (
		<Header style={{ background: '#fff', borderBottom: '2px solid #fafafa', zIndex: 10 }}>
			<Container style={{ padding: 0 }}>
				<Link to="/" style={{ margin: '0px 15px' }}>
					Home
				</Link>
				<Link to="/shop" style={{ margin: '0px 15px' }}>
					Shop
				</Link>
				<Link to="/about" style={{ margin: '0px 15px' }}>
					About Us
				</Link>
				<Link to="/contact-us" style={{ margin: '0px 15px' }}>
					Contact Us
				</Link>
			</Container>
		</Header>
	);
};

export const SecondaryNavigation = () => (
	<Responsive
		desktop={<SecondaryNavigationComponent />}
		tablet={<SecondaryNavigationComponent />}
		mobile={null}
	/>
);

export class PrimaryNavigation extends Component {
	state = {
		menuOpen: false,
		searchOpen: false,
		mobileSearchText: '',
		mobileCategoriesResults: [],
		mobileProductResults: [],
	};
	openMenu() {
		this.setState({ menuOpen: true });
	}
	openSearch() {
		this.setState({ searchOpen: true });
	}
	closeMenu() {
		this.setState({ menuOpen: false });
	}
	closeSearch() {
		this.setState({ searchOpen: false });
	}
	render() {
		const { theme, primaryButtonColour, primaryTextColour, primaryButtonTextColour } = this.props.theme;
		return (
			<Header
				style={{
					background: 'transparent',
					padding: 0,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Link to="/">
					<Avatar
						shape="square"
						style={{
							width: '150px',
							height: '31px',
							margin: '16px 24px 16px 0',
							float: 'left',
						}}
						src={`https://legacy.mitunes.tv/wp-content/themes/mitunes/assets/logo_${theme}.svg`}
					/>
				</Link>

				<Responsive
					desktop={
						<>
							<Search products={this.props.products} productsByCategory={this.props.productsByCategory} />
							<div style={{ textAlign: 'right' }}>
								<NavigationButtons {...this.props} />
							</div>
						</>
					}
					tablet={
						<>
							<Search products={this.props.products} productsByCategory={this.props.productsByCategory} />
							<div style={{ textAlign: 'right' }}>
								<NavigationButtons {...this.props} />
							</div>
						</>
					}
					mobile={
						<>
							<div>
								<Button
									icon="menu"
									type="link"
									style={{
										float: 'right',
										margin: '16px 0px',
										color: primaryButtonTextColour,
									}}
									onClick={() => this.openMenu()}
								/>
								<Button
									icon="search"
									type="link"
									style={{
										float: 'right',
										margin: '16px 15px 0px 0px',
										color: primaryButtonTextColour,
									}}
									onClick={() => this.openSearch()}
								/>
							</div>
							<Drawer
								closable={false}
								title={
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<Input
											onChange={e => {
												console.log(e.target.value);
												const results = window.makeSearch(e.target.value);
												console.log(results);
												this.setState({
													mobileSearchText: e.target.value,
													mobileProductResults: results?.productResults || {},
													mobileCategoriesResults: results?.categoriesResults || {},
												});
											}}
											size="large"
											suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.45)' }} />}
										/>
										<Button
											icon="close"
											style={{ padding: '0px 18px 0px 8px', margin: '0px 4px 0px 17px' }}
											onClick={() => this.closeSearch()}
										/>
									</div>
								}
								headerStyle={{ padding: '16px 12px' }}
								placement="top"
								height="100%"
								visible={this.state.searchOpen}
								onClose={() => this.closeSearch()}
								bodyStyle={{
									padding: 0,
									overflowY: 'hidden',
								}}
							>
								<div style={{ width: '100%', padding: 10 }}>
									<SearchResultsAsList
										searchText={this.state.mobileSearchText}
										categoriesResults={this.state.mobileCategoriesResults}
										productResults={this.state.mobileProductResults}
										close={() => this.closeSearch()}
									/>
								</div>
							</Drawer>
							<Drawer
								title="Menu"
								placement="right"
								visible={this.state.menuOpen}
								onClose={() => this.closeMenu()}
								bodyStyle={{ padding: 0 }}
							>
								{Meteor.user() ? (
									<div>
										<Link to="/" style={menuListItemStyle}>
											Home
										</Link>
										<Link to="/shop" style={menuListItemStyle}>
											Shop
										</Link>
										<Link to="/about" style={menuListItemStyle}>
											About Us
										</Link>
										<Link to="/contact-us" style={menuListItemStyle}>
											Contact Us
										</Link>
										<Link to="/account/manage" style={menuListItemStyle} onClick={() => this.closeMenu()}>
											My Account
										</Link>
										<Link to="/account/orders" style={menuListItemStyle} onClick={() => this.closeMenu()}>
											My Orders
										</Link>
										<span
											style={menuListItemStyle}
											onClick={() => {
												this.closeMenu();
												Meteor.logout();
											}}
										>
											Log Out
										</span>
									</div>
								) : (
									<Link to="/login" style={menuListItemStyle} onClick={() => this.closeMenu()}>
										<Button
											style={{
												backgroundColor: primaryButtonColour,
												border: primaryButtonColour,
												color: primaryButtonTextColour,
												marginLeft: '10px',
											}}
										>
											Log In
										</Button>
									</Link>
								)}
								<Link to="/cart" style={menuListItemStyle} onClick={() => this.closeMenu()}>
									View Cart
								</Link>
								<span style={menuListItemStyle}>
									Change Currency
									<CurrencySwitcher
										key="currencySwitcher"
										currencies={this.props.currencies}
										selectedCurrency={this.props.selectedCurrency}
										changeCurrency={this.props.changeCurrency}
										primaryButtonColour={this.props.theme.primaryButtonColour}
										primaryTextColour={this.props.theme.primaryButtonTextColour}
										btnStyle={{ display: 'block' }}
									/>
								</span>
							</Drawer>
						</>
					}
				/>
			</Header>
		);
	}
}
