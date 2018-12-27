/* global google */
// places api lookup retricted localhost & https://design-tech.sandbox.qa.indeed.net
import React, { Component } from 'react';
import GoogleMapsLoader from 'google-maps';
import PropTypes from 'prop-types';
import { DEFAULT_SEARCH_RADIUS } from '../../constants';

class PlacesLookup extends Component {
	static defaultProps = {
		libraries: ['places'], // places api only - load maps if needed
		placesTypes: ['geocode'], // ['address',' geocode', 'establishment']
		autoFocus: false,
	};

	static propTypes = {
		autoFocus: PropTypes.bool,
		changeLocation: PropTypes.func.isRequired,
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

	// google maps places api
	// NOTE: using patrick's personal key with limits set so I don't get charged
	// admin https://console.cloud.google.com/apis
	loadGoogleMapsAPI(callback) {
		// load google maps
		GoogleMapsLoader.VERSION = '3.34';
		GoogleMapsLoader.KEY = 'AIzaSyAV7uorSExMCoSeQvjz48305OXAGx8DrMc';
		GoogleMapsLoader.LIBRARIES = this.props.libraries;
		GoogleMapsLoader.load(google => {});
		GoogleMapsLoader.onLoad(google => {
			if (callback) callback();
		});
	}

	initializeGoogle() {
		let input = document.getElementById('pac-input');
		let autocomplete = new google.maps.places.Autocomplete(input);

		autocomplete.setFields(['address_components']);
		autocomplete.setTypes(this.props.placesTypes);
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			this.formatLocation(place);
		});
	}

	formatLocation(place) {
		let address = [
			{
				streetNumber: '',
				street: '',
				city: '',
				state: '',
				country: '',
				county: '',
				zip: '',
				radius: DEFAULT_SEARCH_RADIUS, // default search radius
			},
		];

		place.address_components &&
			place.address_components.map((d, i) => {
				if (d.types.includes('street_number')) {
					address[0].streetNumber = d.short_name;
				}
				if (d.types.includes('route')) {
					address[0].street = d.short_name;
				}
				if (d.types.includes('locality')) {
					address[0].city = d.short_name;
				}
				if (d.types.includes('administrative_area_level_1')) {
					address[0].state = d.short_name;
				}
				if (d.types.includes('administrative_area_level_2')) {
					address[0].county = d.short_name;
				}
				if (d.types.includes('country')) {
					address[0].country = d.short_name;
				}
				if (d.types.includes('postal_code')) {
					address[0].zip = d.short_name;
				}
				return address;
			});
		this.props.changeLocation(address);
	}

	render() {
		const { autoFocus, defaultValue } = this.props;
		return (
			<div className="pac-card" id="pac-card">
				<input
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					id="pac-input"
					label="Enter a location"
					name="textinput"
					type="text"
					onChange={() => {}} // set empty to prevent warning
				/>
			</div>
		);
	}
}

export default PlacesLookup;
