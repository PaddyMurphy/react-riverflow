import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Classnames from 'classnames'
import Graph from '../Graph/Graph'
import './Gridrow.css'

class Gridrow extends Component {

  static propTypes = {
    tableData: PropTypes.object.isRequired,
    graphType: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: undefined
    }

    // this.sortOrders = sortOrderItems;
    this.sortKey = 'name';
  }

  render() {
    const data = this.props.tableData;
    const endDate = new Date().toISOString().split('T')[0];
    let startDate = undefined;

    let trClasses = Classnames(
      data.level, {
      'is-selected': (this.state.selected === data.site) ? true : false
      }
    )

    let detailClasses = Classnames(
      'row-details', {
      'show-row': (this.state.selected === data.site) ? true : false
      }
    )

    let svgArrowClasses = Classnames(
      {
        'arrow-up': data.rising,
        'arrow-down': !data.rising,
        'is-rising-fast': data.risingFast
      }
    )

    return (
      <tbody>

        <tr className={trClasses} onClick={this.selectRiver} data-selected={data.site}>
          <th>{data.name}</th>
          <td>
            <span className="cfs-value">{data.cfs}</span>
            <svg
              viewBox="0 0 27 30"
              className={svgArrowClasses}
            >
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
                    <a className="button site-link" href={data.location} target="blank">USGS site {data.site} location</a>
                  </p>
                  <p>{data.condition}</p>
                  <p className="small">NOTE: The rising / falling arrows compare the current value to the value 12 hours ago. The river may already be on the way down</p>
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

  sortBy(key) {
    this.sortKey = key;
    this.sortOrders[key] = this.sortOrders[key] * -1
  }

  // binds this
  selectRiver = (e) => {
    const target = e.currentTarget;

    // deselect if clicking the active row
    if (target.classList.contains('is-selected')) {
      this.setState({selected: undefined});
    } else {
      // set selected
      this.setState({selected: target.dataset.selected});
    }
  }
}

export default Gridrow;
