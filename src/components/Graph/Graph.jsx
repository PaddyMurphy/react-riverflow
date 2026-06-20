import React, { Component } from "react";
import PropTypes from "prop-types";
import Classnames from "classnames";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./Graph.sass";

const PARAM_META = {
  "00060": { label: "Discharge", unit: "cfs" },
  "00065": { label: "Gage height", unit: "ft" },
};

class Graph extends Component {
  static propTypes = {
    selected: PropTypes.string,
    graphType: PropTypes.string,
    period: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.baseUsgsUrl = "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items";
    this.state = {
      error: false,
      loading: false,
      points: [],
    };
  }

  componentDidMount() {
    if (this.props.selected) {
      this.fetchGraphData(this.props.selected);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected && this.props.selected !== prevProps.selected) {
      this.fetchGraphData(this.props.selected);
    }
  }

  componentWillUnmount() {
    this.cancelled = true;
  }

  /**
   * Fetches the past 7 days of continuous values for the selected site from
   * the modernized USGS Water Data API (OGC API - Features). The legacy
   * waterdata.usgs.gov/nwisweb/graph image endpoint was decommissioned by
   * USGS, so we render the chart ourselves from the data.
   * @param {string} site - USGS site number.
   */
  fetchGraphData(site) {
    const now = new Date();
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // past 7 days
    const params = new URLSearchParams({
      monitoring_location_id: `USGS-${site}`,
      parameter_code: this.props.graphType,
      datetime: `${start.toISOString()}/${now.toISOString()}`,
      limit: "5000",
      f: "json",
    });

    // optional API key raises the anonymous rate limit (50/hr) to 1000/hr
    const apiKey = import.meta.env.VITE_USGS_API_KEY;
    if (apiKey) {
      params.set("api_key", apiKey);
    }

    this.setState({ loading: true, error: false });

    fetch(`${this.baseUsgsUrl}?${params}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`USGS request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (this.cancelled) return;
        const features = data.features || [];
        const points = features
          .map((f) => ({
            time: new Date(f.properties.time).getTime(),
            value: parseFloat(f.properties.value),
          }))
          .filter((d) => !Number.isNaN(d.value) && !Number.isNaN(d.time))
          .sort((a, b) => a.time - b.time);

        if (!points.length) {
          this.setState({ loading: false, error: true, points: [] });
          return;
        }

        this.setState({ loading: false, error: false, points });
      })
      .catch(() => {
        if (this.cancelled) return;
        this.setState({ loading: false, error: true, points: [] });
      });
  }

  renderTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const meta = PARAM_META[this.props.graphType] || { label: "Value", unit: "" };
    const point = payload[0].payload;
    const when = new Date(point.time).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="graph-tooltip">
        <strong>
          {point.value.toLocaleString()} {meta.unit}
        </strong>
        <span>{when}</span>
      </div>
    );
  };

  renderChart() {
    const { points } = this.state;
    if (points.length < 2) return null;

    const meta = PARAM_META[this.props.graphType] || { label: "Value", unit: "" };
    const fmtDate = (t) => new Date(t).toLocaleDateString([], { month: "numeric", day: "numeric" });

    return (
      <div className="graph">
        <p className="graph-title">
          {meta.label} ({meta.unit}) &ndash; past 7 days
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={points} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="graph-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3273dc" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3273dc" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={fmtDate}
              tick={{ fill: "#7a7a7a", fontSize: 12 }}
              minTickGap={40}
            />
            <YAxis
              width={56}
              tickFormatter={(v) => Math.round(v).toLocaleString()}
              tick={{ fill: "#7a7a7a", fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <Tooltip content={this.renderTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3273dc"
              strokeWidth={2}
              fill="url(#graph-fill)"
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  render() {
    const { error, loading } = this.state;

    let elClasses = Classnames("graph-wrapper", {
      "has-error": error ? true : false,
    });

    let loadingClasses = Classnames("graph-loading", {
      "is-hidden": loading ? false : true,
    });

    return (
      <div className={elClasses}>
        <div className={loadingClasses}>Loading graph...</div>

        <div className="graph-image">
          {!loading && this.renderChart()}

          {error && (
            <p className="graph-error">
              Graph data is unavailable for this site.{" "}
              <a
                href={`https://waterdata.usgs.gov/monitoring-location/USGS-${this.props.selected}/`}
                target="_blank"
                rel="noreferrer"
              >
                View on USGS
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default Graph;
