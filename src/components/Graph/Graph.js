import React, { Component } from 'react';
import Classnames from 'classnames'
import './Graph.sass';

class Graph extends Component {

  constructor(props) {
    // props: selected, graphType, period
    super(props)

    this.state = {
      error: false,
      loading: false,
      url: undefined
    }

  }

  componentWillReceiveProps(props) {
    if (props.selected) {
      this.displayGraph(props.selected);
    }
  }

  render() {

    let elClasses = Classnames (
      'graph-wrapper', {
      'has-error': this.state.error ? true : false
      }
    )

    let loadingClasses = Classnames (
      'graph-loading', {
      'is-hidden': this.state.loading ? false : true
      }
    )

    return (
      <div className={elClasses}>
        <div className={loadingClasses}>Loading graph...</div>

        <div className="graph-image">
          {this.state.url &&
            <img src={this.state.url} className="graph" alt="USGS Water-data graph" />
          }

          {this.state.error &&
            <h2>Error loading the graph.</h2>
          }
        </div>
      </div>
    );
  }

  displayGraph(selected) {
    // display a graph of the flow
    // TODO: catch error for undefined params
    //       effects: Pecas at Pecos river 08419000
    //       parm_cd=00060 (cfs) or 00065 (guage height ft)
    const vm = this;
    const graphBaseUrl = '//waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS&period=7';
    // NOTE: usgs documentation is incorrect 'startDt' is 'begin_date'
    let url = graphBaseUrl + '&parm_cd=' + vm.props.graphType + '&site_no=' + selected;

    // reset the graph and show / hide loading
    vm.setState({loading: true});

    let newImage = new Image();
    newImage.src = url;
    newImage.onload = function (e) {
      vm.setState({
        loading: false,
        url: url
      });
    }
    newImage.onerror = function (e) {
      vm.setState({
        error: true,
        loading: false,
        url: undefined
      });
    }
  }
}

export default Graph;
