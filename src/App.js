import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Tools from './components/Tools/Tools';
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

              <Tools />

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
