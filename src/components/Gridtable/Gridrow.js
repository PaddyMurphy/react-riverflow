import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Classnames from 'classnames';
import Graph from '../Graph/Graph';
import { USGS_GRAPH_TYPE } from '../../constants';
import './Gridrow.css';

class Gridrow extends Component {
	static propTypes = {
		tableData: PropTypes.object.isRequired,
		graphType: PropTypes.string.isRequired,
	};

	static defaultProps = {
		graphType: USGS_GRAPH_TYPE,
	};

	constructor(props) {
		super(props);

		this.selectRiver = this.selectRiver.bind(this);
		this.sortBy = this.sortBy.bind(this);

		this.state = {
			selected: undefined,
			sortKey: 'name',
		};
	}

	componentDidMount() {
		const { selected } = this.props;
		this.setState({ selected: selected });
	}

	sortBy(key) {
		this.setState({ sortKey: key }, () => {
			this.sortOrders[key] = this.sortOrders[key] * -1;
		});
	}

	selectRiver(e) {
		const urlId = this.props.location.pathname.replace('/', '');
		const target = e.currentTarget;
		const id = target.dataset.selected;
		console.log(this.props.history);

		// remove from url if the same
		if (id && id === urlId) {
			console.log(urlId);
			this.props.history.push({
				pathname: '/',
			});
		} else if (id && id !== urlId) {
			// otherwise set the url
			this.props.history.push({
				pathname: `${id}`,
			});
		}

		// deselect if clicking the active row
		if (target.classList.contains('is-selected')) {
			this.setState({ selected: undefined });
		} else {
			// set selected
			this.setState({ selected: target.dataset.selected });
		}
	}

	render() {
		const data = this.props.tableData;
		const endDate = new Date().toISOString().split('T')[0];
		let startDate = undefined;

		let trClasses = Classnames(data.level, {
			'is-selected': this.state.selected === data.site ? true : false,
		});

		let detailClasses = Classnames('row-details', {
			'show-row': this.state.selected === data.site ? true : false,
		});

		let svgArrowClasses = Classnames({
			'arrow-up': data.rising,
			'arrow-down': !data.rising,
			'is-rising-fast': data.risingFast,
		});

		return (
			<tbody>
				<tr
					className={trClasses}
					onClick={this.selectRiver}
					data-selected={data.site}
				>
					<th>{data.name}</th>
					<td>
						<span className="cfs-value">{data.cfs}</span>
						<svg viewBox="0 0 27 30" className={svgArrowClasses}>
							<use xlinkHref="#arrow-flow" />
						</svg>
					</td>
					<td className="wwclass">{data.class}</td>
					<td>
						<span className="date">{data.date}</span>
						<span className="time">{data.time}</span>
					</td>
				</tr>

				<tr className={detailClasses}>
					<td colSpan="5">
						<div className="row-details-wrapper columns">
							<div className="column column-condition is-one-quarter">
								<div className="content">
									<p className="sitecode">
										<a
											className="button site-link"
											href={data.location}
											target="blank"
										>
											USGS site {data.site} location
										</a>
									</p>
									<p>{data.condition}</p>
									<p className="small">
										NOTE: The rising / falling arrows
										compare the current value to the value
										12 hours ago. The river may already be
										on the way down
									</p>
								</div>
							</div>
							<div className="column column-graph is-three-quarters">
								<Graph
									endDate={endDate}
									startDate={startDate}
									selected={this.state.selected}
									graphType={this.props.graphType}
								/>
							</div>
						</div>
					</td>
				</tr>
			</tbody>
		);
	}
}

export default withRouter(Gridrow);
