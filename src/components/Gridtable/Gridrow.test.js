import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Gridrow from './Gridrow.js';

const testData = {
  "name": "Brazos Rv nr Palo Pinto, TX",
  "location": "//maps.google.com/?q=32.8626236,+-98.3025492",
  "site": "08089000",
  "date": "",
  "time": "14:15",
  "cfs": 174,
  "oldCfs": 257,
  "condition": "This is a pretty leisurely flow but still fun. You shouldn't have any problems scraping bottom in canoes at this level",
  "level": "level-3",
  "rising": false,
  "risingFast": false,
  "class": "II-III"
};

const div = document.createElement('table');

it('renders without crashing', () => {
  // render row with test data
  ReactDOM.render(<Gridrow loading={true} graphType="00060" tableData={testData} />, div);
});


it('should contain two table rows', () => {
  let numberRows = 0;
  // count rows, there should be 2 per Gridrow
  numberRows = div.querySelectorAll('tbody tr').length;

  expect(numberRows).toEqual(2);
});