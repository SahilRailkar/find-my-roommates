import React from 'react';

import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import BedIcon from '@mui/icons-material/Bed';
import ShowerOutlinedIcon from '@mui/icons-material/ShowerOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleIcon from '@mui/icons-material/People';

// import apartment from './apartment.jpg';

const dateFormat = 'M/d/y';

export default function ListingCard({ innerRef, listing, onClick, selected }) {
	const dateStr = listing
		? format(new Date(listing.dateAvailable), dateFormat)
		: null;

	return (
		<Box
			onClick={onClick}
			ref={innerRef}
			sx={{
				border: selected ? '1px solid black' : '',
				borderRadius: selected ? '5px' : '',
				cursor: 'pointer',
				display: 'flex',
				height: '400px',
				mb: '16px',
			}}
		>
			<Card sx={{ position: 'relative', width: '300px' }}>
				<CardMedia
					component="img"
					height="170px"
					image={listing.images[0]}
					alt="apartment"
				/>
				<Typography
					sx={{
						p: '5px',
						position: 'absolute',
						top: '5px',
						right: '5px',
						color: 'white',
						fontSize: '12px',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						borderRadius: '10px',
					}}
					variant=""
				>
					{listing.listingType}
				</Typography>
				<CardContent sx={{ pb: '8px !important' }}>
					<Box sx={{ mb: '8px' }}>
						<Typography sx={{ fontSize: '20px' }}>
							{listing.address.streetNumber + ' ' + listing.address.streetName}
						</Typography>
						<Typography sx={{ fontSize: '12px', fontWeight: '300' }}>
							{listing.address.city +
								', ' +
								listing.address.state +
								' ' +
								listing.address.zipCode}
						</Typography>
					</Box>
					<Box display="flex">
						<Box display="flex" flexDirection="column" sx={{ width: '134px' }}>
							<Box sx={{ alignItems: 'center', display: 'flex' }}>
								<BedIcon sx={{ color: '#800000', pr: '12px' }} />
								<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
									{listing.numBedrooms}
								</Typography>
							</Box>
							<Box sx={{ alignItems: 'center', display: 'flex' }}>
								<ShowerOutlinedIcon sx={{ color: '#17517e', pr: '12px' }} />
								<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
									{listing.numBathrooms}
								</Typography>
							</Box>
							<Box sx={{ alignItems: 'center', display: 'flex', mb: '8px' }}>
								<PeopleIcon sx={{ pr: '12px' }} />
								<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
									{listing.maxOccupancy}
								</Typography>
							</Box>
						</Box>
						<Box display="flex" flexDirection="column" sx={{ width: '134px' }}>
							{listing.bedroomType && (
								<Box sx={{ alignItems: 'center', display: 'flex' }}>
									<HotelIcon sx={{ color: '#800000', pr: '12px' }} />

									<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
										{listing.bedroomType}
									</Typography>
								</Box>
							)}
							{listing.bathroomType && (
								<Box sx={{ alignItems: 'center', display: 'flex' }}>
									<BathtubIcon sx={{ color: '#17517e', pr: '12px' }} />
									<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
										{listing.bathroomType}
									</Typography>
								</Box>
							)}
							{listing.squareFootage && (
								<Box sx={{ alignItems: 'center', display: 'flex', mb: '8px' }}>
									<SquareFootOutlinedIcon
										sx={{ color: '#deb887', pr: '12px' }}
									/>
									<Typography sx={{ fontSize: '16px', fontWeight: '300' }}>
										{listing.squareFootage}
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
					<Typography sx={{ fontSize: '12px', fontWeight: '300' }}>
						Lease term: {listing.leaseTerm} months
					</Typography>
					<Typography sx={{ fontSize: '12px', fontWeight: '300', mb: '4px' }}>
						Available starting {dateStr}
					</Typography>
					<Box
						sx={{
							alignItems: 'baseline',
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<Typography sx={{ fontSize: '20px' }}>${listing.price}</Typography>
						<Typography sx={{ fontSize: '12px', fontWeight: '300' }}>
							/month
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
