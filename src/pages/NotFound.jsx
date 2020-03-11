import React, { Component } from 'react';
import { Result, Spin, Icon } from 'antd';
import { withRouter } from 'react-router';

const NotFound = withRouter(
	class extends Component {
		state = {
			notFound: false,
			loading: true,
			content: false,
		};
		componentDidMount() {
			console.log('NOT FOUND');
			this.getPage();
		}
		componentDidUpdate(prevProps) {
			if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
				console.log('NOT FOUND UPDATE');
				this.getPage();
			}
		}
		getPage() {
			Meteor.call('api.getPage', this.props.location.pathname, (err, res) => {
				console.log(err, res);
				if (err) {
					this.setState({ notFound: true, content: false, loading: false });
				} else {
					this.setState({ notFound: false, content: res, loading: false });
				}
			});
		}
		render() {
			if (this.state.loading) {
				return (
					<Spin spinning indicator={<Icon type="loading" />}>
						<div style={{ width: '100%', height: '200px' }} />
					</Spin>
				);
			}
			if (this.state.notFound) {
				return <Result status="404" message="That page was not found!" />;
			}
			return <div dangerouslySetInnerHTML={{ __html: this.state.content }} />;
		}
	}
);

export default NotFound;
