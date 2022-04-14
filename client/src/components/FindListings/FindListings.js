import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, Route } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { Wrapper } from '@googlemaps/react-wrapper';

import Box from '@mui/material/Box';

import ListingCard from '../../components/ListingCard/ListingCard';
import ListingsHeader from '../../components/ListingsHeader/ListingsHeader';
import ListingModal from '../../modals/ListingModal/ListingModal';
import Map from '../../components/Map/Map';
import Marker from '../../components/Marker/Marker';
import { ModalContext } from '../../contexts/ModalContext';

import { GET_LISTINGS } from '../../graphql/queries';

const render = (status) => {
	return <h1>{status}</h1>;
};

const scrollParentToChild = (parent, child) => {
	// Where is the parent on page
	var parentRect = parent.getBoundingClientRect();
	// What can you see?
	var parentViewableArea = {
		height: parent.clientHeight,
		width: parent.clientWidth,
	};

	// Where is the child
	var childRect = child.getBoundingClientRect();
	// Is the child viewable?
	var isViewable =
		childRect.top >= parentRect.top &&
		childRect.bottom <= parentRect.top + parentViewableArea.height;

	// if you can't see the child try to scroll parent
	if (!isViewable) {
		// Should we scroll using top or bottom? Find the smaller ABS adjustment
		const scrollTop = childRect.top - parentRect.top;
		const scrollBot = childRect.bottom - parentRect.bottom;
		if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
			// we're near the top of the list
			parent.scrollTop += scrollTop;
		} else {
			// we're near the bottom of the list
			parent.scrollTop += scrollBot;
		}
	}
};

const FindListings = () => {
	const { component: Component, props } = useContext(ModalContext);

	const history = useHistory();

	const [listings, setListings] = useState([]);
	const listingContainerRef = useRef();
	const listingRefs = useRef([]);
	const [selected, setSelected] = useState(null);

	const { data } = useQuery(GET_LISTINGS);

	useEffect(() => {
		if (data) {
			setListings(data.getListings);
			listingRefs.current = listingRefs.current.slice(
				0,
				data.getListings.length
			);
		}
	}, [data]);

	return (
		<Box
			sx={{
				display: 'flex',
				height: 'calc(100vh - 112px)',
				overflow: 'hidden',
			}}
		>
			<Box width="100%">
				<Wrapper
					apiKey={'AIzaSyA3q4HgVxRBChI5eAz-t5XZ87NDwi4l1uw'}
					render={render}
				>
					<Map
						center={{ lat: 33.6461, lng: -117.8427 }}
						style={{ flexGrow: '1', height: '100%' }}
						zoom={16}
					>
						{listings.map((listing, index) => {
							const position = {
								lat: listing.lat,
								lng: listing.lng,
							};
							return (
								<Marker
									key={listing.id}
									selected={selected === index}
									onClick={() => {
										setSelected(index);
										scrollParentToChild(
											listingContainerRef.current,
											listingRefs.current[index]
										);
									}}
									options={{ position }}
								/>
							);
						})}
					</Map>
				</Wrapper>
			</Box>
			<Box
				ref={listingContainerRef}
				sx={{
					height: 'calc(100vh - 112px)',
					overflowY: 'scroll',
					px: '16px',
					pt: '16px',
					maxWidth: '40vw',
					minWidth: '650px',
					'@media (max-width: 1400px)': {
						maxWidth: '332px',
						minWidth: '332px',
						width: '332px',
					},
				}}
			>
				<ListingsHeader />
				{listings.length > 1 && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-around',
							'@media (max-width: 1400px)': {
								justifyContent: 'space-around',
							},
						}}
					>
						{listings.map((listing, index) => {
							if (listings.length % 2 === 1 && index === listings.length - 1) {
								return null;
							}
							return (
								<ListingCard
									key={listing.id}
									listing={listing}
									onClick={() => {
										setSelected(index);
										history.push(`/find-rooms/listings/${listing.id}`);
									}}
									innerRef={(el) => (listingRefs.current[index] = el)}
									selected={selected === index}
								/>
							);
						})}
					</Box>
				)}
				{listings.length % 2 === 1 && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'flex-start',
							px: '12px',
							'@media (max-width: 1400px)': {
								justifyContent: 'space-around',
							},
						}}
					>
						<ListingCard
							key={listings[listings.length - 1].id}
							listing={listings[listings.length - 1]}
							onClick={() => {
								setSelected(listings.length - 1);
								history.push(
									`/find-rooms/listings/${listings[listings.length - 1].id}`
								);
							}}
							innerRef={(el) => (listingRefs.current[listings.length - 1] = el)}
							selected={selected === listings.length - 1}
						/>
					</Box>
				)}
				{Component ? <Component {...props} /> : null}
			</Box>
			<Route path={`/find-rooms/listings/:id`}>
				<ListingModal />
			</Route>
		</Box>
	);
};

export default FindListings;
