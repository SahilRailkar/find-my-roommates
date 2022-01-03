import React, { useContext } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

import Dropzone from '../../components/Dropzone/Dropzone';
import { ModalContext } from '../../contexts/ModalContext';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'background.paper',
	borderRadius: '10px',
	boxShadow: 24,
};

export default function UploadImageModal({ refetchUser }) {
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
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
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
						Upload images
					</Typography>
					<Box bgcolor="#eeeeee" height="1px" />
					<Box p={4}>
						<Dropzone refetchUser={refetchUser} />
					</Box>
				</Box>
			</Modal>
		</>
	);
}
