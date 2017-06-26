import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Classnames from 'classnames'
import Gridrow from './Gridrow';
import './Gridtable.css';

class Gridtable extends Component {

  static propTypes = {
    error: PropTypes.bool,
    graphType: PropTypes.string,
    loading: PropTypes.bool,
    tableData: PropTypes.array
  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const vm = this;
    let rows = [];
    let data = this.props.tableData;

    let loadingClasses = Classnames(
      'loading notification is-warning', {
      'is-hidden': this.props.loading ? false : true
      }
    )

    let tableClasses = Classnames(
      'table', {
      'invisible': this.props.loading ? true : false
      }
    )

    if(data) {
      data.forEach(function (row) {
        rows.push(<Gridrow
          key={row.site}
          tableData={row}
          loading={vm.props.loading}
          graphType={vm.props.graphType}
        />)
      })
    }

    return (
      <div className="gridtable">

        <svg className="is-hidden">
          <symbol viewBox="0 0 27 30" version="1.1">
            <g id="arrow-flow">
                <polygon points="21.6 29.4545455 5.4 29.4545455 5.4 16.2 0 16.2 13.5 0 27 16.2 21.6 16.2"></polygon>
            </g>
          </symbol>
        </svg>

        <div className={loadingClasses}>Loading river information...</div>

        <table className={tableClasses}>
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

          {rows}

        </table>
      </div>
    );
  }
}

export default Gridtable;
