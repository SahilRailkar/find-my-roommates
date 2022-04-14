import React, { useContext } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { ModalContext } from '../../contexts/ModalContext';
import GoogleMaps from '../../components/GoogleMaps/GoogleMaps';
import ImageGroup from '../../components/ImageGroup/ImageGroup';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	bgcolor: 'background.paper',
	borderRadius: '10px',
	boxShadow: 24,
};

export default function AddListingModal() {
	const { hideModal } = useContext(ModalContext);

	return (
		<>
			<Modal
				open
				onClose={(_, reason) => {
					if (reason !== 'backdropClick') {
						hideModal();
					}
				}}
			>
				<Box sx={style}>
					<IconButton
						onClick={hideModal}
						sx={{
							left: '8px',
							position: 'absolute',
							top: '8px',
						}}
					>
						<CloseIcon />
					</IconButton>
					<Typography p={2} textAlign="center">
						Add a listing
					</Typography>
					<Box bgcolor="#eeeeee" height="1px" />
					<Box p={4}>
						<ImageGroup placeholder="Add pictures of your listing!" />
						<GoogleMaps />
					</Box>
				</Box>
			</Modal>
		</>
	);
}
