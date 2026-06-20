import React, { Component } from "react";
import PropTypes from "prop-types";
import Classnames from "classnames";
import Gridtable from "../../components/Gridtable/Gridtable";
import Rivers from "../../rivers.json";
import Conditions from "../../conditions.json";
import { Errors, Notification } from "./components";
import "./Riverflow.sass";

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
      graphType: "00060", // defaults to cfs
      loading: true,
      searchQuery: "", // search filter
      tableData: [],
    };

    this.baseMapUrl = "//maps.google.com/?q=";
    this.baseUsgsUrl = "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items";
    this.rivers = Rivers.data;
    this.riversFormatted = [];
    this.siteIds = this.formatSites();
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

  handleRefreshTable = (e) => {
    e.preventDefault();
    this.getUsgsData();
  };

  handleFilterTable = (e) => {
    this.setState({
      searchQuery: e.target.value,
    });
  };

  hideNotification = (e) => {
    e.preventDefault();
    e.currentTarget.parentElement.classList.add("is-hidden");
  };

  clearSearch = () => {
    this.setState({
      searchQuery: "",
    });
  };

  render() {
    const { error, graphType, loading, searchQuery, tableData } = this.state;
    const { selected } = this.props;

    let refreshClasses = Classnames("button is-primary", {
      "is-loading": this.state.loading,
    });

    let errorClasses = Classnames("notification is-danger", {
      "is-hidden": this.state.error === false,
    });

    return (
      <div className="rivertable">
        <section className="section">
          <div className="container">
            <div className="Riverflow">
              <Errors classes={errorClasses} error={error} hide={this.hideNotification} />

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
                        {" "}
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
                    <span className="refresh-long is-hidden-mobile">refresh river table</span>
                    <span className="refresh-short is-hidden-tablet">&#8634;</span>
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
      const el = document.querySelector(".is-selected");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000); // delay for usability
  }

  formatSites() {
    let list = [];

    this.rivers.forEach(function (d) {
      // return only number values, formatted as USGS monitoring location ids
      if (d.value.match(/\d+/g)) {
        list.push(`USGS-${d.value}`);
      }
    });

    return list.join();
  }

  /**
   * Fetches the past 12 hours of continuous data for every site in
   * rivers.json from the modernized USGS Water Data API (OGC API - Features).
   * @return {number[]} response
   */
  getUsgsData() {
    this.riversFormatted = [];
    this.setState({ loading: true });

    const now = new Date();
    const start = new Date(now.getTime() - 12 * 60 * 60 * 1000); // past 12 hours
    const params = new URLSearchParams({
      monitoring_location_id: this.siteIds,
      parameter_code: this.state.graphType,
      datetime: `${start.toISOString()}/${now.toISOString()}`,
      limit: "10000",
      f: "json",
    });

    // optional API key raises the anonymous rate limit (50/hr) to 1000/hr
    const apiKey = import.meta.env.VITE_USGS_API_KEY;
    if (apiKey) {
      params.set("api_key", apiKey);
    }

    fetch(`${this.baseUsgsUrl}?${params}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`USGS request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ loading: false });
        if (data.features && data.features.length) {
          this.displayUsgsData(data.features);
          this.scrollIntoView();
          this.setState({ error: false });
        } else {
          this.setState({ error: "no river data available" });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false, error: error.message });
      });
  }

  /**
   * Formats the modernized USGS response (GeoJSON FeatureCollection) for
   * display. The API returns one feature per observation, so observations are
   * grouped by monitoring location to derive the oldest / newest values.
   * @param {Object[]} features - usgs fetch response features.
   */
  displayUsgsData(features) {
    const that = this;
    const today = new Date();
    const risingFastThreshold = 130; // percent change

    // group observations by monitoring location
    const groups = new Map();
    features.forEach((feature) => {
      const props = feature.properties;
      if (props.value === null || props.value === undefined) return;
      const value = parseInt(props.value, 10);
      if (Number.isNaN(value)) return;

      const id = props.monitoring_location_id;
      if (!groups.has(id)) {
        groups.set(id, []);
      }
      groups.get(id).push({
        value,
        time: new Date(props.time),
        coordinates: feature.geometry && feature.geometry.coordinates,
      });
    });

    groups.forEach((observations, id) => {
      // sort oldest -> newest by observation time
      observations.sort((a, b) => a.time - b.time);

      const oldestValue = observations[0].value;
      const current = observations[observations.length - 1];
      const newestValue = current.value;

      let date = current.time;
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const percentChanged = Math.round((newestValue / oldestValue) * 100);

      // only show date if not today
      if (today.toDateString() === date.toDateString()) {
        date = "";
      }

      // geometry coordinates are [longitude, latitude]
      const coords = current.coordinates;
      const location = coords ? `${that.baseMapUrl}${coords[1]},+${coords[0]}` : that.baseMapUrl;

      const river = {
        // monitoring_location_id is formatted as "USGS-<site number>"
        site: id.replace(/^USGS-/, ""),
        location: location,
        date: date,
        time: time,
        cfs: newestValue,
        oldCfs: oldestValue,
        condition: that.getConditions(newestValue).condition,
        level: that.getConditions(newestValue).level,
        rising: newestValue > oldestValue,
        risingFast: percentChanged > risingFastThreshold,
      };
      // merge additional river data
      that.mergeRiverInfo(river);
    });

    that.setState({ tableData: this.riversFormatted });
  }
  /**
   * Merges the river name and white water class from rivers.json onto the
   * matching response. Matches are based on USGS site numbers. The modernized
   * API no longer returns a site name, so the name comes from rivers.json.
   * @param {Object} river
   */
  mergeRiverInfo(river) {
    this.rivers.forEach(function (d) {
      if (d.value === river.site) {
        river.name = d.text;
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
      level = "level-0";
    } else if (cfs > 0 && cfs < 50) {
      condition = Conditions.flow1;
      level = "level-1";
    } else if (cfs >= 50 && cfs < 100) {
      condition = Conditions.flow2;
      level = "level-2";
    } else if (cfs >= 100 && cfs < 300) {
      condition = Conditions.flow3;
      level = "level-3";
    } else if (cfs >= 300 && cfs < 600) {
      condition = Conditions.flow4;
      level = "level-4";
    } else if (cfs >= 600 && cfs < 2000) {
      condition = Conditions.flow5;
      level = "level-5";
    } else if (cfs >= 2000) {
      condition = Conditions.flow6;
      level = "level-6";
    }

    return { condition: condition, level: level };
  }
}

export default Riverflow;
