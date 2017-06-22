import React, { Component } from 'react';
import axios from 'axios'
import Navbar from './components/Navbar/Navbar';
import Gridtable from './components/Gridtable/Gridtable';
import Rivers from './rivers.json';
import Conditions from './conditions.json';
import './App.sass';

class App extends Component {
  constructor(props) {
    super(props);

    this.baseMapUrl = '//maps.google.com/?q=';
    this.baseUsgsUrl = 'https://waterservices.usgs.gov/nwis/iv/';
    this.columns = ['name', 'cfs'];
    this.error = false;
    this.graphType = '00060'; // defaults to cfs
    this.loading = false;
    this.rivers = Rivers.data;
    this.sites = this.formatSites();
    this.riversFormatted = [];
    this.searchQuery = '';
    this.showLegend = true
  }

  componentDidMount() {
    // load the river data
    this.getUsgsData();
  }

  formatSites() {
    let list = [];

    this.rivers.forEach(function (d) {
      // return only number values
      if (d.value.match(/\d+/g)) {
        list.push(d.value);
      }
    });

    return list.join();
  }

  /**
   * Fetches usgs instant data from rivers.json.
   * @return {number[]} response
   */
  getUsgsData() {
    var vm = this;

    vm.riversFormatted = [];
    vm.loading = true;
    // fetch all site numbers in rivers.json
    axios.get(this.baseUsgsUrl, {
      params: {
        parameterCd: this.graphType,
        sites: this.sites,
        format: 'json',
        period: 'PT12H', // past 12 hours
        siteStatus: 'active'
      }
    })
    .then(response => {
      vm.loading = false;
      if (response.data.value.timeSeries) {
        vm.displayUsgsData(response.data.value.timeSeries);
        vm.error = undefined;
      } else {
        vm.error = 'no river data available';
      }
    })
    .catch(error => {
      console.log(error);
      vm.loading = false;
      vm.error = error.message;
    });
  }

  /**
   * Formats usgs response for display from rivers.json.
   * @return {number[]} formatted response
   * @param {number[]} response - usgs fetch response.
   */
  displayUsgsData(response) {
    const vm = this;
    const today = new Date();
    let arr;
    let river = {};
    let currentValue;
    let date;
    let geo;
    let oldestValue;
    let newestValue;
    let percentChanged;
    let rising;
    let risingFast;
    let risingFastThreshold = 130; // percent change
    let site;
    let time;

    response.forEach(function (d, i) {
      // NOTE: some rivers do not support cfs (00060)
      arr = d.values[0].value;
      // return on error
      if (!arr[0]) return;

      // oldestValue is the first item
      oldestValue = parseInt(arr[0].value, 10);
      // currentValue is the last item
      currentValue = arr[arr.length - 1];
      newestValue = parseInt(currentValue.value, 10);
      // get current date / time
      date = new Date(currentValue.dateTime);
      time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});

      percentChanged = Math.round((newestValue / oldestValue) * 100);

      // only show date if not today
      if (today.toDateString() === date.toDateString()) {
        date = '';
      }

      geo = d.sourceInfo.geoLocation.geogLocation;
      site = d.sourceInfo.siteCode[0].value;
      rising = (newestValue > oldestValue);
      risingFast = (percentChanged > risingFastThreshold);

      river = {
        'name': d.sourceInfo.siteName,
        'location': vm.baseMapUrl + geo.latitude + ',+' + geo.longitude,
        'site': site,
        'date': date,
        'time': time,
        'cfs': newestValue,
        'oldCfs': oldestValue,
        'condition': vm.getConditions(newestValue).condition,
        'level': vm.getConditions(newestValue).level,
        'rising': rising,
        'risingFast': risingFast
      }

      vm.mergeRiverInfo(river);
    });
  }
  /**
   * Merges class from rivers.json to matching response
   * matches are based on USGS site numbers
   * @param {Object} river
   */
  mergeRiverInfo(river) {
    const vm = this;
    const currentRiver = river.site;

    vm.rivers.forEach(function (d) {
      // add white water class
      if (d.value === currentRiver) {
        river.class = d.class;
      }
    });

    vm.riversFormatted.push(river);
  }
  /**
   * Returns condition description and level color code from conditions.json
   * @return {Object} condition and level
   * @param {number} cfs - from usgs fetch response.
   */
  getConditions(cfs) {
    let condition;
    let level;
    // convert to number
    cfs = parseInt(cfs, 10);
    // check the range of the cfs and display the appropriate message
    if (cfs === 0) {
      condition = Conditions.flow0;
      level = 'level-0'
    } else if ((cfs > 0) && (cfs < 50)) {
      condition = Conditions.flow1;
      level = 'level-1'
    } else if ((cfs >= 50) && (cfs < 100)) {
      condition = Conditions.flow2;
      level = 'level-2'
    } else if ((cfs >= 100) && (cfs < 300)) {
      condition = Conditions.flow3;
      level = 'level-3'
    } else if ((cfs >= 300) && (cfs < 600)) {
      condition = Conditions.flow4;
      level = 'level-4'
    } else if ((cfs >= 600) && (cfs < 2000)) {
      condition = Conditions.flow5;
      level = 'level-5'
    } else if (cfs >= 2000) {
      condition = Conditions.flow6;
      level = 'level-6'
    }

    return {'condition': condition, 'level': level};
  }

  render() {
    return (
      <div className="App">

        <Navbar />

        <div className="rivertable">

          <section className="section">
            <div className="container">
              <div className="notification is-danger">
                <button className="delete"></button>
              </div>

              <div className="notification content">
                <a className="delete is-small"> </a>
                <p>Riverflow provides the latest <abbr title="cubic feet per second">CFS</abbr> from the USGS gauges of floatable rivers and creeks. The color indicates optimal floating conditions with additional inforamtion and a 7 day graph in the details.</p>
              </div>

              <div className="columns is-flex tools">

                <div className="column column-search">
                  <div className="field level-item">
                    <label htmlFor="search" className="label">Search</label>
                    <p className="control">
                      <input id="search" name="search" className="input" type="text" placeholder="Filter the table" />
                      <a className="delete is-small"> </a>
                    </p>
                  </div>
                </div>

                <div className="column column-button">
                  <button className="button is-primary">
                    <span className="refresh-long is-hidden-mobile">refresh river table</span>
                    <span className="refresh-short is-hidden-tablet">&#8634;</span>
                  </button>
                </div>
              </div>

              <Gridtable columns={this.columns} />

            </div>
          </section>
        </div> {/* END rivertable */}
      </div>
    );
  }
}

export default App;
