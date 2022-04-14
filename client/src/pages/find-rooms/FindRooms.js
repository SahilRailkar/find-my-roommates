import React, { useEffect, useState } from 'react';

import { Route, useHistory, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import FindListings from '../../components/FindListings/FindListings';
import MyListings from '../../components/MyListings/MyListings';
import SavedListings from '../../components/SavedListings/SavedListings';

const tabs = {
	0: '/find-rooms/listings',
	1: '/find-rooms/my-listings',
	2: '/find-rooms/saved-listings',
};

const invertedTabs = {
	'/find-rooms/listings': 0,
	'/find-rooms/my-listings': 1,
	'/find-rooms/saved-listings': 2,
};

export default function FindRooms() {
	const history = useHistory();
	const { pathname } = useLocation();
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (pathname) {
			for (const key in invertedTabs) {
				if (invertedTabs.hasOwnProperty(key)) {
					if (pathname.startsWith(key)) {
						setValue(invertedTabs[key]);
					}
				}
			}
		}
	}, [pathname]);

	const handleChange = (event, newValue) => {
		history.push(tabs[newValue]);
		setValue(newValue);
	};

	return (
		<Box
			sx={{
				backgroundColor: 'rgb(249, 249, 251)',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Tabs
				value={value}
				onChange={handleChange}
				centered
				sx={{ backgroundColor: '#ffffff' }}
			>
				<Tab label="Find Listings" sx={{ width: '300px' }} />
				<Tab label="My Listings" sx={{ width: '300px' }} />
				<Tab label="Saved Listings" sx={{ width: '300px' }} />
			</Tabs>
			<Route path="/find-rooms/listings">
				<FindListings />
			</Route>
			<Route path="/find-rooms/my-listings">
				<MyListings />
			</Route>
			<Route path="/find-rooms/saved-listings">
				<SavedListings />
			</Route>
		</Box>
	);
}
