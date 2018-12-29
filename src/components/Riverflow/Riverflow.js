import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Classnames from 'classnames';
import Gridtable from '../../components/Gridtable/Gridtable';
import Rivers from '../../rivers.json';
import Conditions from '../../conditions.json';
import { Errors, Notification } from './components';
import './Riverflow.sass';

class Riverflow extends Component {
  static propTypes = {
    selected: PropTypes.string,
  };

  static defaultProps = {
    selected: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      graphType: '00060', // defaults to cfs
      loading: true,
      searchQuery: '', // search filter
      tableData: [],
    };

    this.baseMapUrl = '//maps.google.com/?q=';
    this.baseUsgsUrl = 'https://waterservices.usgs.gov/nwis/iv/';
    this.rivers = Rivers.data;
    this.riversFormatted = [];
    this.sites = this.formatSites();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.tableData.length) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    // load the river data
    this.getUsgsData();
  }

  handleRefreshTable = e => {
    e.preventDefault();
    this.getUsgsData();
  };

  handleFilterTable = e => {
    this.setState({
      searchQuery: e.target.value,
    });
  };

  hideNotification(e) {
    e.preventDefault();
    e.currentTarget.parentElement.classList.add('is-hidden');
  }

  clearSearch = e => {
    this.setState({
      searchQuery: '',
    });
  };

  render() {
    const { error, graphType, loading, searchQuery, tableData } = this.state;
    const { selected } = this.props;

    let refreshClasses = Classnames('button is-primary', {
      'is-loading': this.state.loading,
    });

    let errorClasses = Classnames('notification is-danger', {
      'is-hidden': this.state.error === false,
    });

    return (
      <div className="rivertable">
        <section className="section">
          <div className="container">
            <div className="Riverflow">
              <Errors
                classes={errorClasses}
                error={error}
                hide={this.hideNotification}
              />

              <Notification hide={this.hideNotification} />

              <div className="columns is-flex tools">
                <div className="column column-search">
                  <div className="field level-item">
                    <label htmlFor="search" className="label">
                      Search
                    </label>
                    <p className="control">
                      <input
                        autoComplete="off"
                        onChange={this.handleFilterTable}
                        value={searchQuery}
                        id="search"
                        name="search"
                        className="input"
                        type="text"
                        placeholder="Filter the table"
                      />
                      <button
                        className="delete is-small"
                        onClick={this.clearSearch}
                        aria-label="clear the search"
                      >
                        {' '}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="column column-button">
                  <button
                    className={refreshClasses}
                    onClick={this.handleRefreshTable}
                    aria-label="Refresh the table data"
                  >
                    <span className="refresh-long is-hidden-mobile">
                      refresh river table
                    </span>
                    <span className="refresh-short is-hidden-tablet">
                      &#8634;
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <Gridtable
              loading={loading}
              tableData={tableData}
              graphType={graphType}
              searchQuery={searchQuery}
              selected={selected}
            />
          </div>
        </section>
      </div>
    );
  }

  // methods

  scrollIntoView() {
    window.setTimeout(() => {
      const el = document.querySelector('.is-selected');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000); // delay for usability
  }

  formatSites() {
    let list = [];

    this.rivers.forEach(function(d) {
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
    this.riversFormatted = [];
    this.setState({ loading: true });
    // fetch all site numbers in rivers.json
    Axios.get(this.baseUsgsUrl, {
      params: {
        parameterCd: this.state.graphType,
        sites: this.sites,
        format: 'json',
        period: 'PT12H', // past 12 hours
        siteStatus: 'active',
      },
    })
      .then(response => {
        this.setState({ loading: false });
        if (response.data.value.timeSeries) {
          this.displayUsgsData(response.data.value.timeSeries);
          this.scrollIntoView();
          this.setState({ error: false });
        } else {
          this.setState({ error: 'no river data available' });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        this.setState({ error: error.message });
      });
  }

  /**
   * Formats usgs response for display from rivers.json.
   * @return {number[]} formatted response
   * @param {number[]} response - usgs fetch response.
   */
  displayUsgsData(response) {
    const that = this;
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

    response.forEach(function(d, i, a) {
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
      time = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      percentChanged = Math.round((newestValue / oldestValue) * 100);

      // only show date if not today
      if (today.toDateString() === date.toDateString()) {
        date = '';
      }

      geo = d.sourceInfo.geoLocation.geogLocation;
      site = d.sourceInfo.siteCode[0].value;
      rising = newestValue > oldestValue;
      risingFast = percentChanged > risingFastThreshold;

      river = {
        name: d.sourceInfo.siteName,
        location: that.baseMapUrl + geo.latitude + ',+' + geo.longitude,
        site: site,
        date: date,
        time: time,
        cfs: newestValue,
        oldCfs: oldestValue,
        condition: that.getConditions(newestValue).condition,
        level: that.getConditions(newestValue).level,
        rising: rising,
        risingFast: risingFast,
      };
      // merge additional river data
      that.mergeRiverInfo(river);
    });

    that.setState({ tableData: this.riversFormatted });
  }
  /**
   * Merges class from rivers.json to matching response
   * matches are based on USGS site numbers
   * @param {Object} river
   */
  mergeRiverInfo(river) {
    this.rivers.forEach(function(d) {
      // add white water class
      if (d.value === river.site) {
        river.class = d.class;
      }
    });

    this.riversFormatted.push(river);
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
      level = 'level-0';
    } else if (cfs > 0 && cfs < 50) {
      condition = Conditions.flow1;
      level = 'level-1';
    } else if (cfs >= 50 && cfs < 100) {
      condition = Conditions.flow2;
      level = 'level-2';
    } else if (cfs >= 100 && cfs < 300) {
      condition = Conditions.flow3;
      level = 'level-3';
    } else if (cfs >= 300 && cfs < 600) {
      condition = Conditions.flow4;
      level = 'level-4';
    } else if (cfs >= 600 && cfs < 2000) {
      condition = Conditions.flow5;
      level = 'level-5';
    } else if (cfs >= 2000) {
      condition = Conditions.flow6;
      level = 'level-6';
    }

    return { condition: condition, level: level };
  }
}

export default Riverflow;
