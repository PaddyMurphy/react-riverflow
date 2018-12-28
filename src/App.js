import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Riverflow from './components/Riverflow/Riverflow';
import Footer from './components/Footer/Footer';
//import GoogleMaps from './components/Map';
import './App.sass';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Navbar />

				{/* <GoogleMaps /> */}

				<Riverflow />

				<Footer />
			</div>
		);
	}
}

export default App;
