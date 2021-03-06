/* global google */
// places api lookup retricted localhost & https://design-tech.sandbox.qa.indeed.net
import React, { Component } from 'react';
import GoogleMapsLoader from 'google-maps';
import PropTypes from 'prop-types';
import './Map.sass';
//import { DEFAULT_SEARCH_RADIUS } from '../../constants';

class Maps extends Component {
	static defaultProps = {
		libraries: ['geometry'], // ['geometry', 'places']
		placesTypes: ['geocode'], // ['address', 'geocode', 'establishment']
	};

	static propTypes = {
		libraries: PropTypes.array,
		placesTypes: PropTypes.array,
	};

	componentDidMount() {
		//make sure google maps API is loaded then proceed
		if (typeof google !== 'undefined') {
			this.initializeGoogle();
		} else {
			this.loadGoogleMapsAPI(() => {
				this.initializeGoogle();
			});
		}
	}

	// NOTE: key retricted to the riverflow domain
	// with limits set so I don't get charged
	loadGoogleMapsAPI(callback) {
		// load google maps
		GoogleMapsLoader.VERSION = '3.34';
		GoogleMapsLoader.KEY = 'AIzaSyDf-t-gqXzgp18H4Zulo_q2tDWUjvkEjtU';
		GoogleMapsLoader.LIBRARIES = this.props.libraries;
		GoogleMapsLoader.load(google => {});
		GoogleMapsLoader.onLoad(google => {
			if (callback) callback();
		});
	}

	initializeGoogle() {
		let googleMap = document.getElementById('google-map');
		// eslint-disable-next-line
		let map = new google.maps.Map(googleMap, {
			center: { lat: 30.2672, lng: -97.7431 },
			zoom: 8,
		});
	}

	render() {
		return <div id="google-map" />;
	}
}

export default Maps;
