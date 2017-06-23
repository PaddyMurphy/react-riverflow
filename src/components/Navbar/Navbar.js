import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <div className="Navbar">
        <header className="hero is-bold is-primary">
          <div className="container">
            <div className="header is-flex">
              <h1 className="title">Riverflow</h1>
              <p className="tagline">Texas Edition</p>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Navbar;
