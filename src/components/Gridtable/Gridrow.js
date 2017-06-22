import React, { Component } from 'react';
import './Gridrow.sass';

class Gridrow extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    console.log(this.props);
    return (
      <tbody>
        <tr>
          <th>{this.props.tableData.name}</th>
          <td>
            {this.props.tableData.cfs}

            <svg
              viewBox="0 0 27 30"
              className="arrow-up is-rising-fast"
            >
              <use xlinkHref="#arrow-flow" />
            </svg>
          </td>
          <td className="wwclass">{this.props.tableData.class}</td>
          <td>
            <span className="date">{this.props.tableData.date}</span>
            <span className="time">{this.props.tableData.time}</span>
          </td>
        </tr>
        <tr className="row-details">
          <td colSpan="5">
            <div className="row-details-wrapper columns">
              <div className="column column-condition is-one-quarter">
                <div className="content">
                  <p className="sitecode">
                    <a className="button site-link" href="{this.props.tableData.location}" target="blank">USGS site {this.props.tableData.site} location</a>
                  </p>
                  <p>{this.props.tableData.condition}</p>
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
    );
  }
}

export default Gridrow;
