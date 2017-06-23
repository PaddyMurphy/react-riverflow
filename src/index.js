// TODO: replaced react-scripts with custom-react-scripts
//       to support sass without ejecting
//       - find a native way to do it
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
