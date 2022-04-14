import React, { useEffect, useState } from 'react';

import { Route } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import ListingRow from '../ListingRow/ListingRow';

import { GET_SAVED_LISTINGS } from '../../graphql/queries';
import ListingModal from '../../modals/ListingModal/ListingModal';

const MyListings = () => {
	const [myListings, setMyListings] = useState();

	const { data } = useQuery(GET_SAVED_LISTINGS);

	useEffect(() => {
		if (data) {
			setMyListings(data.getSavedListings);
		}
	}, [data]);

	const listingRows = myListings
		? myListings.map((listing) => {
				return <ListingRow key={listing.id} listing={listing} />;
		  })
		: [];

	return (
		<Container
			maxWidth="lg"
			sx={{
				display: 'flex',
				justifyContent: 'center',
				minHeight: 'calc(100vh - 48px - 64px)',
			}}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>{listingRows}</Box>
			<Route path={`/find-rooms/saved-listings/:id`}>
				<ListingModal />
			</Route>
		</Container>
	);
};

export default MyListings;
