import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render, mount } from 'enzyme';
import Riverflow from './Riverflow';
import './Riverflow.css';

it('renders without crashing', () => {
  const riverflow = shallow(<Riverflow />);
  // rivertable should render once
  expect(riverflow.find('.rivertable').length).toBe(1);
});
