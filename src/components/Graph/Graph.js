import React, { Component } from 'react';
import './Graph.sass';

class Graph extends Component {

  constructor(props) {
    // props: radioDateType, selected, startDate,
    //        endDate, graphType, period
    super(props)

    this.state = {
      error: undefined,
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
    return (
      <div className="graph-wrapper">
        <div className={'graph-loading ' + (this.state.loading ? '' : 'is-hidden')}>
          Loading graph...
        </div>
        <div className="graph-image">
          <img src={this.state.url} className="graph" alt="USGS Water-data graph" />
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
    // let image;
    let start = vm.props.startDate;
    let end = vm.props.endDate;
    const graphBaseUrl = '//waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS';
    // NOTE: usgs documentation is incorrect 'startDt' is 'begin_date'
    let url = graphBaseUrl + '&parm_cd=' + vm.props.graphType + '&site_no=' + selected;

    // TODO: look at computing this in Riverflow
    if (typeof (vm.props.startDate) === 'object') {
      start = vm.props.startDate.toISOString().split('T')[0]
    }

    if (typeof (vm.props.endDate) === 'object') {
      end = vm.props.endDate.toISOString().split('T')[0]
    }

    // period of days
    if (vm.props.radioDateType === 'period') {
      url = url + '&period=' + vm.period;
    }

    // add start and end
    if (vm.props.radioDateType === 'date' && start) {
      url = url + '&begin_date=' + start + '&end_date=' + end;
    }

    // image = '<img src="' + url + '"class="graph" alt="USGS Water-data graph">';

    // reset the graph and show / hide loading
    // vm.setState({graphImage: undefined});
    vm.setState({loading: true});

    var newImage = new Image();
    newImage.src = url;
    newImage.onload = function (e) {
      console.log(e)
      vm.setState({url: url});
      vm.setState({loading: false});
    }
  }
}

export default Graph;
