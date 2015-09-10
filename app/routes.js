'use strict';
import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, DefaultRoute } from 'react-router';

// Import components
import Main from './components/main';
import Home from './components/home';


export default (
	<Route handler={Main} path='/'>
		<DefaultRoute handler={Home} />
		<Route name='home' handler={Home} path='/' />
	</Route>
);
