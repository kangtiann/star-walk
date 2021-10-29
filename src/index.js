import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {StarWalk} from './starwalk/star-walk.js'


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


new StarWalk()