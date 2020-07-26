import React from 'react'

import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
	return (
		<>
			<Dashboard></Dashboard>
			<Login />
			<Error />
		</>
	)
}

export default App
