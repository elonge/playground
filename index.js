import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
//import App from './SuperUserApp';
import registerServiceWorker from './registerServiceWorker';
import './style.css';

ReactDOM.render(<App viewerId={1482681765133413}/>, document.getElementById('root'));
registerServiceWorker();
