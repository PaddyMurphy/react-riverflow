// components for Riverflow
import React from 'react';

export const Notification = props => {
	return (
		<div className="notification content">
			<button
				aria-label="Close the notification"
				className="delete is-small"
				onClick={props.hide}
			>
				{' '}
			</button>
			<p>
				Riverflow provides the latest{' '}
				<abbr title="cubic feet per second">CFS</abbr> from the USGS
				gauges of floatable rivers and creeks. The color indicates
				optimal floating conditions with additional inforamtion and a 7
				day graph in the details.
			</p>
		</div>
	);
};

export const Errors = props => {
	return (
		<div className={props.classes}>
			<button
				className="delete"
				onClick={props.hide}
				aria-label="close error message"
			>
				{' '}
			</button>
			{props.error}
		</div>
	);
};
