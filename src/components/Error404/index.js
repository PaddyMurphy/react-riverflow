import React from 'react';
import './error404.scss';

const Error404 = props => {
  return (
    <div className="Error404">
      <h1>
        404 for <code>{props.location.pathname}</code>, start panicking
      </h1>
      <span className="Error404-icon" role="img" aria-label="404 page">
        🚣🏼‍♀️
      </span>
    </div>
  );
};

export default Error404;
