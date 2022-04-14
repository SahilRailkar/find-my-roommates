import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import GoogleMaps from '../../components/GoogleMaps/GoogleMaps';
import ImageGroup from '../../components/ImageGroup/ImageGroup';
import { listingTypes, roomTypes } from '../../constants';
import { ModalContext } from '../../contexts/ModalContext';
import { ADD_LISTING, DELETE_LISTING_IMAGE } from '../../graphql/mutations';
import { GET_USER_LISTINGS } from '../../graphql/queries';
import UploadImageModal from '../../modals/UploadImageModal/UploadImageModal';

import poweredByGoogle from './powered_by_google_on_white.png';
import WarningModal from '../../modals/WarningModal/WarningModal';

const listingTypeOptions = listingTypes.map((listingType) => ({
	value: listingType,
	label: listingType,
}));

const roomTypeOptions = roomTypes.map((roomType) => ({
	value: roomType,
	label: roomType,
}));

const placesService = { current: null };

const isPositiveInteger = (value) => {
	const valueNumber = Number(value);
	if (Number.isInteger(valueNumber) && valueNumber > 0) {
		return true;
	}
	return false;
};

const placeToAddress = (place) => {
	let address = {};
	place.address_components.forEach((c) => {
		switch (c.types[0]) {
			case 'street_number':
				address.streetNumber = c.short_name;
				break;
			case 'route':
				address.streetName = c.short_name;
				break;
			case 'neighborhood':
			case 'locality':
				address.city = c.short_name;
				break;
			case 'administrative_area_level_1':
				address.state = c.short_name;
				break;
			case 'postal_code':
				address.zipCode = c.short_name;
				break;
			case 'country':
				address.country = c.short_name;
				break;
			default:
		}
	});
	return address;
};

export default function AddListing() {
	const {
		component: Component,
		props,
		showModal,
		hideModal,
	} = useContext(ModalContext);
	const history = useHistory();

	const [addListing] = useMutation(ADD_LISTING, {
		onCompleted: ({ addListing }) => {
			const { id } = addListing;
			refetch();
			history.push(`/find-rooms/my-listings/${id}`);
		},
	});
	const [deleteListingImage] = useMutation(DELETE_LISTING_IMAGE);
	const { refetch } = useQuery(GET_USER_LISTINGS);
	const [values, setValues] = useState({
		address: '',
		formattedAddress: '',
		lat: '',
		lng: '',
		placeId: '',
		numBedrooms: '',
		numBathrooms: '',
		bedroomType: 'Private',
		bathroomType: 'Private',
		maxOccupancy: '',
		squareFootage: '',
		leaseTerm: '',
		dateAvailable: '',
		price: '',
		notes: '',
		listingType: 'Bedroom Sublease',
		images: [],
	});

	const [errors, setErrors] = useState({
		address: '',
		numBedrooms: '',
		numBathrooms: '',
		maxOccupancy: '',
		squareFootage: '',
		leaseTerm: '',
		dateAvailable: '',
		price: '',
		images: '',
	});

	const validateValues = () => {
		const {
			address,
			numBedrooms,
			numBathrooms,
			maxOccupancy,
			squareFootage,
			leaseTerm,
			dateAvailable,
			price,
			images,
		} = values;

		let numBedroomsError = '';
		if (!isPositiveInteger(numBedrooms)) {
			numBedroomsError = 'Enter a valid number of bedrooms';
		}

		let numBathroomsError = '';
		if (!isNaN(numBathrooms)) {
			const num = Number(numBathrooms);
			if (!(Number.isInteger(num) || Number.isInteger(num - 0.5))) {
				numBathroomsError = 'Enter a valid number of bathrooms';
			}
		}

		let maxOccupancyError = '';
		if (!isPositiveInteger(maxOccupancy)) {
			maxOccupancyError = 'Enter a valid maximum occupancy';
		}

		let squareFootageError = '';
		if (squareFootage && !isPositiveInteger(squareFootage)) {
			squareFootageError = 'Enter a valid square footage';
		}

		let leaseTermError = '';
		if (!isPositiveInteger(leaseTerm)) {
			leaseTermError = 'Enter a valid lease term';
		}

		let priceError = '';
		if (isNaN(price) || Number(price) <= 0) {
			priceError = 'Enter a valid price';
		}

		let dateAvailableError = '';
		const dateAvailableDate = new Date(dateAvailable);
		const date = new Date();
		date.setDate(date.getDate() - 5);
		if (dateAvailableDate < date) {
			dateAvailableError = 'The date available cannot be in the past';
		}

		const obj = {
			address: address === '' ? 'Enter an address' : '',
			numBedrooms:
				numBedrooms.trim() === ''
					? 'Enter number of bedrooms'
					: numBedroomsError,
			numBathrooms:
				numBathrooms.trim() === ''
					? 'Enter number of bathrooms'
					: numBathroomsError,
			maxOccupancy:
				maxOccupancy.trim() === ''
					? 'Enter a maximum occupancy'
					: maxOccupancyError,
			squareFootage: squareFootageError,
			leaseTerm:
				leaseTerm.trim() === '' ? 'Enter a lease term' : leaseTermError,
			price: price.trim() === '' ? 'Enter a price' : priceError,
			dateAvailable:
				dateAvailable.trim() === ''
					? 'Enter the date your listing is first available'
					: dateAvailableError,
			images: images.length === 0 ? 'Upload images of your listing' : '',
		};
		setErrors({ ...obj });
		return Object.values(obj).every((x) => x === '');
	};

	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleAddressChange = (placeId) => {
		setValues({
			...values,
			placeId,
		});
	};

	React.useEffect(() => {
		if (!placesService.current && window.google) {
			placesService.current = new window.google.maps.places.PlacesService(
				document.getElementById('attributions')
			);
		}

		if (placesService.current && values.placeId) {
			placesService.current.getDetails(
				{ placeId: values.placeId },
				(result) => {
					setValues({
						...values,
						address: placeToAddress(result),
						formattedAddress: result.formatted_address,
						lat: result.geometry.location.lat(),
						lng: result.geometry.location.lng(),
					});
				}
			);
		}
	}, [values.placeId]);

	const onUpload = (urls) => {
		setValues({ ...values, images: [...values.images, ...urls] });
	};

	return (
		<Box>
			<Typography p={2} textAlign="center">
				Add a listing
			</Typography>
			<Box bgcolor="#eeeeee" height="1px" />
			<Container maxWidth="lg">
				<Box p={4}>
					<ImageGroup
						error={errors.images !== ''}
						images={values.images}
						imageWidth="600px"
						placeholder="Add pictures of your listing!"
						placeholderStyles={{
							width: '600px',
							border: '1px dashed black',
							color: 'black',
						}}
						onDelete={(focus) => {
							showModal(WarningModal, {
								acceptButtonText: 'Delete',
								body: 'Are you sure you want to delete this image? You will not be able to undo this action.',
								isOpen: true,
								onAccept: () => {
									deleteListingImage({
										variables: {
											listingWithImage: {
												imageUrl: values.images[focus],
											},
										},
									});
									const newImages = values.images.slice();
									newImages.splice(focus, 1);
									setValues({ ...values, images: newImages });
									hideModal();
								},
								title: 'Delete image',
							});
						}}
						onUpload={onUpload}
					/>
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: '48px' }}>
						<Button
							onClick={() => {
								showModal(UploadImageModal, {
									isOpen: true,
									onUpload,
								});
							}}
							startIcon={<AddIcon />}
							variant="contained"
							sx={{ mt: 2, width: '600px' }}
						>
							Upload images
						</Button>
					</Box>
					<Box>
						<TextField
							defaultValue="Bedroom Sublease"
							label="Listing Type"
							name="listingType"
							onChange={handleChange}
							size="small"
							sx={{
								mb: '24px',
							}}
							fullWidth
							select
						>
							{listingTypeOptions.map((option) => (
								<MenuItem
									color="secondary"
									key={option.value}
									value={option.value}
								>
									{option.label}
								</MenuItem>
							))}
						</TextField>
						<GoogleMaps
							error={errors.address !== ''}
							helperText={errors.address}
							onChange={handleAddressChange}
						/>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								mb: '24px',
							}}
						>
							<TextField
								error={errors.numBedrooms !== ''}
								helperText={errors.numBedrooms}
								label="Number of Bedrooms"
								name="numBedrooms"
								onChange={handleChange}
								size="small"
								sx={{ pr: '16px' }}
								fullWidth
							/>
							<TextField
								error={errors.numBathrooms !== ''}
								helperText={errors.numBathrooms}
								label="Number of Bathrooms"
								name="numBathrooms"
								onChange={handleChange}
								size="small"
								fullWidth
							/>
						</Box>
						{values.listingType !== 'Apartment Relet' && (
							<Box sx={{ display: 'flex', mb: '24px' }}>
								<TextField
									defaultValue="Private"
									label="Bedroom Type"
									name="bedroomType"
									onChange={handleChange}
									size="small"
									sx={{ pr: '16px' }}
									fullWidth
									select
								>
									{roomTypeOptions.map((option) => (
										<MenuItem
											color="secondary"
											key={option.value}
											value={option.value}
										>
											{option.label}
										</MenuItem>
									))}
								</TextField>
								<TextField
									defaultValue="Private"
									label="Bathroom Type"
									name="bathroomType"
									onChange={handleChange}
									size="small"
									fullWidth
									select
								>
									{roomTypeOptions.map((option) => (
										<MenuItem
											color="secondary"
											key={option.value}
											value={option.value}
										>
											{option.label}
										</MenuItem>
									))}
								</TextField>
							</Box>
						)}
						<Box sx={{ display: 'flex', mb: '24px' }}>
							<TextField
								error={errors.maxOccupancy !== ''}
								helperText={errors.maxOccupancy}
								label="Maximum Occupancy"
								name="maxOccupancy"
								onChange={handleChange}
								size="small"
								sx={{ pr: '16px' }}
								fullWidth
							/>
							<TextField
								error={errors.squareFootage !== ''}
								helperText={errors.squareFootage}
								label="Square Footage (sq. ft.)"
								name="squareFootage"
								onChange={handleChange}
								size="small"
								fullWidth
							/>
						</Box>
						<Box
							display="flex"
							sx={{
								display: 'flex',
								mb: '24px',
							}}
						>
							<TextField
								error={errors.price !== ''}
								helperText={errors.price}
								label="Price ($/month)"
								name="price"
								onChange={handleChange}
								size="small"
								sx={{ pr: '16px' }}
								fullWidth
							/>
							<TextField
								error={errors.leaseTerm !== ''}
								helperText={errors.leaseTerm}
								label="Lease Term (months)"
								name="leaseTerm"
								onChange={handleChange}
								size="small"
								fullWidth
							/>
						</Box>
						<Box>
							<TextField
								error={errors.dateAvailable !== ''}
								helperText={errors.dateAvailable}
								InputLabelProps={{ shrink: true }}
								label="Date Available"
								name="dateAvailable"
								onChange={(e) => {
									try {
										const date = new Date(e.target.value).toISOString();
										setValues({
											...values,
											dateAvailable: date,
										});
									} catch (err) {}
								}}
								size="small"
								sx={{ mb: '24px' }}
								type="date"
								variant="outlined"
								fullWidth
							/>
						</Box>
						<TextField
							label="Notes"
							multiline
							rows={4}
							fullWidth
							sx={{ mb: '24px' }}
						/>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								mb: '24px',
							}}
						>
							<Button
								onClick={() => {
									const {
										address,
										formattedAddress,
										lat,
										lng,
										placeId,
										numBedrooms,
										numBathrooms,
										bedroomType,
										bathroomType,
										maxOccupancy,
										squareFootage,
										leaseTerm,
										dateAvailable,
										price,
										notes,
										listingType,
										images,
									} = values;
									if (validateValues()) {
										const listing = {
											address,
											formattedAddress,
											lat,
											lng,
											placeId,
											numBedrooms: Number(numBedrooms),
											numBathrooms: Number(numBathrooms),
											...(listingType !== 'Apartment Relet' && { bedroomType }),
											...(listingType !== 'Apartment Relet' && {
												bathroomType,
											}),
											maxOccupancy: Number(maxOccupancy),
											...(squareFootage !== '' && {
												squareFootage: Number(squareFootage),
											}),
											leaseTerm: Number(leaseTerm),
											dateAvailable,
											price: Number(price),
											notes,
											listingType,
											images,
										};
										addListing({
											variables: {
												listing,
											},
										});
									}
								}}
								variant="contained"
								fullWidth
								sx={{ mr: '16px' }}
							>
								Save
							</Button>
							<Button variant="contained" size="large" fullWidth>
								Cancel
							</Button>
						</Box>
						<Box sx={{ textAlign: 'right' }}>
							<img
								alt="powered by Google"
								id="attributions"
								src={poweredByGoogle}
								sx={{ height: '100px', width: '100px' }}
							/>
						</Box>
					</Box>
				</Box>
				{Component ? <Component {...props} /> : null}
			</Container>
		</Box>
	);
}
