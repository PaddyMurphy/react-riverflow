import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import Error404 from './components/Error404';
import registerServiceWorker from './registerServiceWorker';
import './index.sass';

const Routes = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={App} />
				<Route exact path="/:id" component={App} />
				<Route path="/" component={Error404} />
			</Switch>
		</Router>
	);
};

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
