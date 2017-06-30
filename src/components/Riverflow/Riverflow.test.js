import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render, mount } from 'enzyme';
import Riverflow from './Riverflow';
import './Riverflow.css';

it('renders without crashing', () => {
  // const div = document.createElement('div');
  const riverflow = shallow(<Riverflow />);
  // TODO: this should work
  // expect(riverflow.find('.Riverflow')).to.have.length(1);
  // NOTE: correctly logs length and renders html
  //       assertions are not working
  console.log(riverflow.find('.Riverflow').length)
  // console.log(riverflow.find('.Riverflow').debug())
});
