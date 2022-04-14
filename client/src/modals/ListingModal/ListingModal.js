import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { format } from 'date-fns';

import { useMutation, useQuery, useLazyQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Modal from '../../components/Modal/Modal';
import { GET_LISTING, GET_USER, GET_USER_BY_ID } from '../../graphql/queries';
import { UNSAVE_LISTING, SAVE_LISTING } from '../../graphql/mutations';

const style = {
	display: 'flex',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '60vw',
	height: '60vh',
	bgcolor: 'background.paper',
	borderRadius: '10px',
	boxShadow: 24,
};

const Cell = ({ topText, bottomText }) => {
	return (
		<Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				p: '12px',
			}}
		>
			<Typography
				variant="secondary"
				sx={{
					fontSize: '20px',
					fontWeight: '700',
					mb: '-4px',
				}}
			>
				{topText}
			</Typography>
			<Typography sx={{ fontSize: '12px' }}>{bottomText}</Typography>
		</Box>
	);
};

const Details = ({ title, details }) => {
	return (
		<Box
			sx={{
				mb: '20px',
				position: 'relative',
			}}
		>
			<Typography sx={{ fontSize: '20px', fontWeight: '700', mb: '4px' }}>
				{title}
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				{details.map(({ name, value }) => {
					return (
						<Box key={name} sx={{ display: 'flex', width: '250px' }}>
							<Typography
								sx={{ fontSize: '16px', fontWeight: '300', mr: '6px' }}
							>
								{name}:
							</Typography>
							<Typography sx={{ fontSize: '16px' }}>{value}</Typography>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

const dateFormat = 'M/d/y';

const ListingModal = () => {
	const history = useHistory();
	const { pathname } = useLocation();
	const { id } = useParams();

	const page = pathname.substring(0, pathname.lastIndexOf('/'));

	const [saveListing] = useMutation(SAVE_LISTING);
	const [unsaveListing] = useMutation(UNSAVE_LISTING);

	const [getUserById, { data: listerData }] = useLazyQuery(GET_USER_BY_ID);
	const { data } = useQuery(GET_LISTING, {
		variables: {
			listingId: id,
		},
		onCompleted: ({ getListing }) => {
			const { lister } = getListing;
			getUserById({ variables: { userId: lister } });
		},
	});
	const { data: userData, refetch } = useQuery(GET_USER);

	const [listing, setListing] = useState();
	const [saved, setSaved] = useState(false);
	const [canEdit, setCanEdit] = useState(false);

	useEffect(() => {
		if (data && data.getListing) {
			setListing(data.getListing);
			if (userData && data.getListing.lister === userData.getUser.id) {
				setCanEdit(true);
			}
		}
	}, [data]);

	useEffect(() => {
		if (userData && userData.getUser) {
			if (userData.getUser.savedListings.includes(id)) {
				setSaved(true);
			}
			if (listing && listing.lister === userData.id) {
				setCanEdit(true);
			}
		}
	}, [userData]);

	const onClick = (e) => {
		var container = document.getElementById('listing-modal-container');
		if (!container.contains(e.target)) {
			history.push(page);
		}
	};

	useEffect(() => {
		document.addEventListener('click', onClick);
		return () => {
			document.removeEventListener('click', onClick);
		};
	}, []);

	const itemData =
		listing && listing.images
			? listing.images.map((img, index) => {
					return {
						img,
						title: index,
					};
			  })
			: [];

	return (
		<Modal>
			<Box id="listing-modal-container" p={4} sx={style}>
				<Box sx={{ width: '40%', overflow: 'scroll' }}>
					<ImageList cols={1} gap={8} sx={{ mt: '0px' }}>
						{itemData.map((item) => (
							<ImageListItem key={item.img}>
								<img
									src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
									srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
									alt={item.title}
									loading="lazy"
									style={{ borderRadius: '10px' }}
								/>
							</ImageListItem>
						))}
					</ImageList>
				</Box>
				{listing && (
					<Box
						ml={4}
						sx={{
							position: 'relative',
							width: '60%',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								height: 'calc(100% - 60px - 30px)',
								overflow: 'scroll',
							}}
						>
							<Typography
								variant="secondary"
								sx={{
									fontSize: '28px',
									fontWeight: '700',
								}}
							>{`${listing.address.streetNumber} ${listing.address.streetName}`}</Typography>
							<Typography
								variant="secondary"
								mb="20px"
								sx={{ fontSize: '18px' }}
							>{`${listing.address.city}, ${listing.address.state} ${listing.address.zipCode}`}</Typography>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-evenly',
									mb: '20px',
								}}
							>
								<Cell
									topText={`${listing.numBedrooms}`}
									bottomText={`${
										listing.numBedrooms === 1 ? 'bedroom' : 'bedrooms'
									}`}
								/>
								<Box sx={{ border: '1px solid #bdbdbd', height: '64px' }} />
								<Cell
									topText={`${listing.numBathrooms}`}
									bottomText={`${
										listing.numBathrooms === 1 ? 'bedroom' : 'bedrooms'
									}`}
								/>
								<Box sx={{ border: '1px solid #bdbdbd', height: '64px' }} />
								<Cell topText={`$${listing.price}`} bottomText={`/month`} />
							</Box>
							<Box
								sx={{ border: '1px solid #bdbdbd', width: '100%', mb: '20px' }}
							/>
							<Details
								title={`${
									listing.listingType === 'Apartment Relet'
										? 'Apartment'
										: 'Room'
								} Details`}
								details={[
									{ name: 'Bedroom Type', value: listing.bedroomType },
									{ name: 'Bathroom Type', value: listing.bathroomType },
									...(listing.squareFootage
										? [
												{
													name: 'Square Footage',
													value: `${listing.squareFootage} sq.ft.`,
												},
										  ]
										: []),
									{
										name: 'Maximum Occupancy',
										value: `${listing.maxOccupancy} ${
											listing.maxOccupancy === 1 ? 'person' : 'people'
										}`,
									},
								]}
							/>
							<Box
								sx={{ border: '1px solid #bdbdbd', width: '100%', mb: '20px' }}
							/>
							<Details
								title="Lease Details"
								details={[
									{ name: 'Listing Type', value: listing.listingType },
									{ name: 'Lease Term', value: `${listing.leaseTerm} months` },
									{
										name: 'Date Available',
										value: `${format(
											new Date(listing.dateAvailable),
											dateFormat
										)}`,
									},
								]}
							/>
							{listing.notes && (
								<>
									<Box
										sx={{
											border: '1px solid #bdbdbd',
											width: '100%',
											mb: '20px',
										}}
									/>
									<Typography
										sx={{ fontSize: '20px', fontWeight: '700', mb: '4px' }}
									>
										Notes
									</Typography>
									<Typography sx={{ fontSize: '16px' }}>
										{listing.notes}
									</Typography>
								</>
							)}
						</Box>
						{listerData && (
							<Box
								sx={{
									display: 'flex',
									mb: '9px',
									justifyContent: 'flex-end',
								}}
							>
								<Typography
									sx={{ fontSize: '14px', mr: '4px' }}
								>{`Listed by`}</Typography>
								<Link
									href={`/profile/${listing.lister}`}
									sx={{ fontSize: '14px', cursor: 'pointer' }}
								>{`${listerData.getUserById.firstName} 
									${listerData.getUserById.lastName}`}</Link>
							</Box>
						)}
						{canEdit ? (
							<Button
								onClick={() => {
									history.push(`/edit-listing/${id}`);
								}}
								startIcon={<EditIcon />}
								variant="contained"
								sx={{
									marginTop: '10px',
									height: '50px',
								}}
								fullWidth
							>
								Edit Listing
							</Button>
						) : (
							<Button
								onClick={() => {
									if (saved) {
										unsaveListing({
											variables: {
												listingId: id,
											},
										});
									} else {
										saveListing({
											variables: {
												listingId: id,
											},
										});
									}
									setSaved(!saved);
									refetch();
								}}
								startIcon={<FavoriteIcon color="red" />}
								variant="outlined"
								sx={{
									borderColor: saved ? 'red' : 'black',
									color: saved ? 'red' : 'black',
									height: '60px',
									'&:hover': {
										borderColor: saved ? 'red' : 'black',
										color: saved ? 'red' : 'black',
									},
								}}
								fullWidth
							>
								{saved ? 'Unsave' : 'Save'}
							</Button>
						)}
					</Box>
				)}
			</Box>
		</Modal>
	);
};

export default ListingModal;
