import React, { Component } from 'react';
import './Gridtable.sass';

class GridTable extends Component {
  constructor(props) {
    super(props);

    let sortOrderItems = {}
    props.columns.forEach(function (key) {
      sortOrderItems[key] = 1
    })

    this.endDate = new Date().toISOString().split('T')[0];
    this.error = false;
    this.selected = undefined;
    this.sortKey = 'name';
    this.sortOrders = sortOrderItems;
    this.startDate = undefined;
  }

  componentDidMount() {
    // load the river data
  }

  render() {
    return (
      <div className="gridtable">

        <svg className="hidden">
          <symbol viewBox="0 0 27 30" version="1.1">
            <g id="arrow-flow">
                <polygon points="21.6 29.4545455 5.4 29.4545455 5.4 16.2 0 16.2 13.5 0 27 16.2 21.6 16.2"></polygon>
            </g>
          </symbol>
        </svg>

        <div className="loading notification is-warning">Loading river information...</div>

        <table className="table">
          <thead>
            <tr>
              <th className="th-name">Name</th>
              <th className="th-cfs">Cfs</th>
              <th className="th-class">Class</th>
              <th className="th-time">Time</th>

            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>River Name</th>
              <th><abbr title="cubic feet per second">CFS</abbr></th>
              <th className="th-class">Class</th>
              <th className="th-time">Time</th>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <th>river.name</th>
              <td>
                river.cfs

                <svg
                  viewBox="0 0 27 30"
                  className="arrow-up is-rising-fast"
                >
                  <use xlinkHref="#arrow-flow" />
                </svg>
              </td>
              <td className="wwclass">river.class</td>
              <td>
                <span className="date">river.date</span>
                <span className="time">river.time</span>
              </td>
            </tr>
            <tr className="row-details">
              <td colSpan="5">
                <div className="row-details-wrapper columns">
                  <div className="column column-condition is-one-quarter">
                    <div className="content">
                      <p className="sitecode">
                        <a className="button site-link" href="river.location" target="blank">USGS site river.site location</a>
                      </p>
                      <p>river.condition</p>
                      <p className="small">NOTE: The rising / falling arrows compare the current value to the value 12 hours ago. The river may already be on the way down</p>
                    </div>
                  </div>
                  <div className="column column-graph is-three-quarters">
                    {/* graph here */}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default GridTable;
