import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Riverflow from './components/Riverflow/Riverflow';
import Footer from './components/Footer/Footer';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">

        <Navbar />

        <Riverflow />

        <Footer />

      </div>
    );
  }
}

export default App;
