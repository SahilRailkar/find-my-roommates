import React, { useContext, useEffect, useState } from 'react';

import { useHistory, Route } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import AddIcon from '@mui/icons-material/Add';

import { GET_USER_LISTINGS } from '../../graphql/queries';
import ListingRow from '../ListingRow/ListingRow';
import ListingModal from '../../modals/ListingModal/ListingModal';
import { ModalContext } from '../../contexts/ModalContext';

const MyListings = () => {
	const history = useHistory();

	const [myListings, setMyListings] = useState();

	const { component: Component, props } = useContext(ModalContext);

	const { data } = useQuery(GET_USER_LISTINGS);

	useEffect(() => {
		if (data) {
			setMyListings(data.getUserListings);
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
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => history.push('/add-listing')}
					sx={{
						height: '40px',
						mt: '16px',
					}}
				>
					Add a listing
				</Button>
				{listingRows}
				{Component ? <Component {...props} /> : null}
			</Box>
			<Route path={`/find-rooms/my-listings/:id`}>
				<ListingModal />
			</Route>
		</Container>
	);
};

export default MyListings;
