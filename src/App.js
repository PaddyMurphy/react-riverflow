import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Riverflow from './components/Riverflow/Riverflow';
import Footer from './components/Footer/Footer';
//import GoogleMaps from './components/Map'; // eslint-disable-line
import './App.sass';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null,
		};
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		// if id set selected
		if (id) {
			this.setState({ selected: id });
		}
	}

	render() {
		const { selected } = this.state;

		return (
			<div className="App">
				<Navbar />

				{/* <GoogleMaps /> */}

				<Riverflow selected={selected} />

				<Footer />
			</div>
		);
	}
}

export default App;
