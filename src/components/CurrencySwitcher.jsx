import React, { Component } from 'react';
import { FaMoneyBill } from '../util/icons/fa';
import { Button, Icon, Radio, Modal } from 'antd';
import { clone } from 'lodash';

export class CurrencySwitcher extends Component {
	state = {
		modalVisible: false,
		changeMade: false,
		selectedCurrency: clone(this.props.selectedCurrency),
	};
	onChange(e) {
		if (e.target.value === this.props.selectedCurrency) {
			this.setState({ changeMade: false });
		} else {
			this.setState({ changeMade: true, selectedCurrency: e.target.value });
		}
	}
	showModal() {
		this.setState({ modalVisible: true });
	}
	hideModal() {
		this.setState({ modalVisible: false });
	}
	render() {
		return (
			<>
				<Modal
					title="Switch Currency"
					centered
					visible={this.state.modalVisible}
					okText="Save Changes"
					okButtonProps={{ disabled: !this.state.changeMade }}
					onOk={() => {
						this.props.changeCurrency(this.state.selectedCurrency);
						this.hideModal();
					}}
					onCancel={() => this.hideModal()}
					size="small"
					bodyStyle={{ textAlign: 'center' }}
				>
					<Radio.Group
						defaultValue={this.props.selectedCurrency}
						buttonStyle="solid"
						onChange={this.onChange.bind(this)}
					>
						{this.props.currencies.map((currency, idx) => (
							<div key={idx}>
								<Radio.Button style={{ borderRadius: '3px', margin: '2px' }} value={currency}>
									{currency}
								</Radio.Button>
								<br />
							</div>
						))}
					</Radio.Group>
				</Modal>
				<Button
					type="primary"
					style={{
						backgroundColor: this.props.primaryButtonColour,
						border: this.props.primaryButtonColour,
						color: this.props.primaryButtonTextColour,
						...this.props.btnStyle,
					}}
					onClick={() => this.showModal()}
				>
					<Icon component={FaMoneyBill} /> {this.props.selectedCurrency}
				</Button>
			</>
		);
	}
}
