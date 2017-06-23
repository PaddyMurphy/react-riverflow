import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Gridtable from './components/Gridtable/Gridtable';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">

        <Navbar />

        <div className="rivertable">

          <section className="section">
            <div className="container">
              <div className="notification is-danger is-hidden">
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

              <Gridtable />

            </div>
          </section>
        </div> {/* END rivertable */}

        <Footer />

      </div>
    );
  }
}

export default App;
