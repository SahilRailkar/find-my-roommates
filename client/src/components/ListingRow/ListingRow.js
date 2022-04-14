import React, { useContext } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { format } from 'date-fns';

import { useMutation, useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import BedIcon from '@mui/icons-material/Bed';
import ShowerOutlinedIcon from '@mui/icons-material/ShowerOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ModalContext } from '../../contexts/ModalContext';
import { GET_USER_LISTINGS } from '../../graphql/queries';
import { DELETE_LISTING } from '../../graphql/mutations';
import WarningModal from '../../modals/WarningModal/WarningModal';

const dateFormat = 'M/d/y';

const ListingRow = ({ listing }) => {
	const dateStr = format(new Date(listing.dateAvailable), dateFormat);
	const history = useHistory();
	const { pathname } = useLocation();

	const { showModal } = useContext(ModalContext);

	const { refetch } = useQuery(GET_USER_LISTINGS);
	const [deleteListing] = useMutation(DELETE_LISTING, {
		onCompleted: () => {
			refetch();
		},
	});

	return (
		<Box
			sx={{
				backgroundColor: '#ffffff',
				border: '2px solid rgb(241, 241, 244)',
				borderRadius: '10px',
				display: 'flex',
				justifyContent: 'space-between',
				position: 'relative',
				width: '900px',
				mt: '16px',
			}}
		>
			<Box
				onClick={() => {
					history.push(`${pathname}/${listing.id}`);
				}}
				sx={{ display: 'flex' }}
			>
				<Box
					component="img"
					src={listing.images[0]}
					alt="listing"
					sx={{
						borderRadius: '8px',
						height: '220px',
						mr: '16px',
						objectFit: 'cover',
					}}
				/>
				<Box p="8px">
					<Typography
						sx={{
							color: '#888888',
							fontSize: '16px',
							fontWeight: '300',
						}}
					>
						{listing.listingType}
					</Typography>
					<Typography sx={{ fontSize: '24px' }}>
						{listing.address.streetNumber + ' ' + listing.address.streetName}
					</Typography>
					<Typography sx={{ fontSize: '16px', fontWeight: '300', mb: '16px' }}>
						{listing.address.city +
							', ' +
							listing.address.state +
							' ' +
							listing.address.zipCode}
					</Typography>
					<Box
						sx={{
							alignItems: 'baseline',
							display: 'flex',
							mb: '20px',
						}}
					>
						<Typography sx={{ fontSize: '24px' }}>${listing.price}</Typography>
						<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
							/month
						</Typography>
					</Box>
					<Box display="flex" sx={{ mb: '4px' }}>
						<Box display="flex" justifyContent="space-evenly">
							<Box sx={{ alignItems: 'center', display: 'flex', mr: '24px' }}>
								<BedIcon sx={{ color: '#800000', pr: '8px' }} />
								<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
									{listing.numBedrooms}
								</Typography>
							</Box>
							<Box sx={{ alignItems: 'center', display: 'flex', mr: '24px' }}>
								<ShowerOutlinedIcon sx={{ color: '#17517e', pr: '8px' }} />
								<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
									{listing.numBathrooms}
								</Typography>
							</Box>
							<Box sx={{ alignItems: 'center', display: 'flex', mr: '24px' }}>
								<PeopleIcon sx={{ pr: '8px' }} />
								<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
									{listing.maxOccupancy}
								</Typography>
							</Box>
							{listing.squareFootage && (
								<Box sx={{ alignItems: 'center', display: 'flex' }}>
									<SquareFootOutlinedIcon
										sx={{ color: '#deb887', pr: '8px' }}
									/>
									<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
										{listing.squareFootage}
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
					<Box display="flex">
						<Typography
							sx={{ fontSize: '12px', fontWeight: '300', mr: '24px' }}
						>
							Lease term: {listing.leaseTerm} months
						</Typography>
						<Typography sx={{ fontSize: '12px', fontWeight: '300' }}>
							Available starting {dateStr}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{ display: 'flex', flexDirection: 'column', pr: '8px', pt: '8px' }}
			>
				<IconButton
					onClick={() => {
						history.push(`/edit-listing/${listing.id}`);
					}}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					onClick={() => {
						showModal(WarningModal, {
							acceptButtonText: 'Delete',
							body: 'Are you sure you want to delete this listing? You will not be able to undo this action.',
							isOpen: true,
							onAccept: () => {
								deleteListing({ variables: { listingId: listing.id } });
							},
							title: 'Delete listing',
						});
					}}
					sx={{ '&:hover': { color: '#d11a2a' } }}
				>
					<DeleteIcon />
				</IconButton>
			</Box>
		</Box>
	);
};

export default ListingRow;
