import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import NavBar from './components/NavBar/NavBar';
import ModalProvider from './contexts/ModalContext';
import AddListing from './pages/add-listing/AddListing';
import EditListing from './pages/edit-listing/EditListing';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import FindRooms from './pages/find-rooms/FindRooms';
import './App.css';

const link = createHttpLink({
	uri: 'http://localhost:4000/graphql',
	credentials: 'include',
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLink.from([link]),
});

const theme = createTheme({
	typography: {
		button: {
			textTransform: 'none',
		},
		fontFamily: ['Readex Pro', 'sans-serif'].join(','),
		secondary: {
			fontFamily: ['Bitter', 'serif'].join(','),
		},
	},
	palette: {
		primary: {
			main: '#000000',
		},
		secondary: {
			main: '#ffffff',
		},
		action: {
			disabled: '#424242',
		},
	},
});

function App() {
	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<ModalProvider>
					<Router>
						<meta name="viewport" content="width=1060, maximum-scale=1.0" />
						<NavBar />
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/profile/:id" exact component={Profile} />
							<Route path="/profile" component={Profile} />
							<Route path="/find-rooms" component={FindRooms} />
							<Route path="/add-listing" exact component={AddListing} />
							<Route path="/edit-listing/:id" exact component={EditListing} />
						</Switch>
					</Router>
				</ModalProvider>
			</ThemeProvider>
		</ApolloProvider>
	);
}

export default App;
