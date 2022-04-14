import React, { useContext } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForward';

import apartment from './apartment.jpeg';

import { ModalContext } from '../../contexts/ModalContext';
import SignUpModal from '../../modals/SignUpModal/SignUpModal';

const containerStyles = {
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
	borderRadius: '20px',
	color: 'white',
	left: '10%',
	padding: '25px',
	position: 'absolute',
	top: '10%',
	width: '40%',
	'@media (max-width: 870px)': {
		width: '60%',
	},
	'@media (max-width: 610px)': {
		right: '10%',
		width: 'unset',
	},
};

const descriptionStyles = {
	fontSize: '20px',
	mb: '32px',
	'@media (max-width: 1180px)': {
		fontSize: '18px',
	},
	'@media (max-width: 990px)': {
		fontSize: '16px',
	},
};

const titleStyles = {
	fontSize: '76px',
	mb: '32px',
	'@media (max-width: 1180px)': {
		fontSize: '64px',
	},
	'@media (max-width: 990px)': {
		fontSize: '56px',
	},
};

const imageStyles = {
	minHeight: 'calc(100vh - 64px)',
	maxHeight: 'cakc(100vh - 64px)',
	objectFit: 'cover',
	width: '100%',
};

export default function Home() {
	const { component: Component, props, showModal } = useContext(ModalContext);

	return (
		<Box sx={{ position: 'relative' }}>
			<Box component="img" src={apartment} sx={{ ...imageStyles }} />
			<Box sx={{ ...containerStyles }}>
				<Box sx={{ ...titleStyles }}>Living spaces made for students</Box>
				<Box sx={{ ...descriptionStyles }}>
					Students around the nation use Rümer to find living spaces, roommates,
					and furniture.
				</Box>
				<Button
					color="secondary"
					variant="contained"
					endIcon={<ArrowForward />}
					onClick={() => showModal(SignUpModal, { isOpen: true })}
				>
					Sign up
				</Button>
				{Component ? <Component {...props} /> : null}
			</Box>
		</Box>
	);
}
