import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './style.css';

ReactDOM.render(<App viewerId={100}/>, document.getElementById('root'));
registerServiceWorker();
