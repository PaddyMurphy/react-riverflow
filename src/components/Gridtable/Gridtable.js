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
    tableData: PropTypes.array,
    searchQuery: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      'sortOrder': 1,
      'sortField': 'name'
    }
  }

  componentWillMount() {
    // define state changes in componentWillMount
    this.handleSort = (e) => {
      this.setState({
        sortField: e.target.dataset.sort,
        sortOrder: (this.state.sortOrder === 1) ? -1 : 1
      });
    }
  }

  render() {
    const vm = this;
    let rows = [];
    let data = this.props.tableData;
    let query = this.props.searchQuery.toLowerCase();
    let name;

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

    let sortNameClasses = Classnames({
      'active': this.state.sortField === 'name',
      'asc': this.state.sortOrder === -1,
      'desc': this.state.sortOrder === 1
    })

    let sortCfsClasses = Classnames({
      'active': this.state.sortField === 'cfs',
      'asc': this.state.sortOrder === -1,
      'desc': this.state.sortOrder === 1
    })

    // sort first
    if (vm.state.sortField === 'cfs') {
      // sort by number
      data = data.slice().sort(function (a, b) {
        a = a[vm.state.sortField]
        b = b[vm.state.sortField]
        return (a - b) * vm.state.sortOrder
      })
    } else {
      // sort by string
      data = data.slice().sort(function (a, b) {
        a = a[vm.state.sortField]
        b = b[vm.state.sortField]
        return (a === b ? 0 : a > b ? 1 : -1) * vm.state.sortOrder
      })
    }

    // construct the table rows
    data.forEach(function (row) {
      name = row.name.toLowerCase();

      if (name.indexOf(query) === -1) {
        return;
      }

      rows.push(<Gridrow
        key={row.site}
        tableData={row}
        graphType={vm.props.graphType}
      />)
    })

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
              <th className="th-name">
                <a data-sort="name" className={sortNameClasses} onClick={this.handleSort}>Name</a>
              </th>
              <th className="th-cfs">
                <a data-sort="cfs" className={sortCfsClasses} onClick={this.handleSort}>Cfs</a>
              </th>
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
