// import App from './App';

// const hello = (name) => {
// 	console.log(`hello ${name}`);
// };

// App();

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import PromisePolyfill from 'promise-polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (!window.Promise) {
	window.Promise = PromisePolyfill;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
