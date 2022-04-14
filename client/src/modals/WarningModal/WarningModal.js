import React, { useContext } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

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

const WarningModal = ({ body, acceptButtonText, title, onAccept }) => {
	const { hideModal } = useContext(ModalContext);

	return (
		<>
			<Modal
				open
				onClose={() => {
					hideModal();
				}}
			>
				<Box sx={style}>
					<Typography p={1} textAlign="center">
						{title}
					</Typography>
					<Box bgcolor="#eeeeee" height="1px" />
					<Box p={4}>
						<Box mb={'24px'}>
							<Typography fontSize="16px" fontWeight="300">
								{body}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Button
								onClick={() => hideModal()}
								size="large"
								variant="outlined"
								sx={{ width: '210px' }}
							>
								Cancel
							</Button>
							<Button
								color="error"
								onClick={onAccept}
								size="large"
								variant="contained"
								sx={{ width: '210px' }}
							>
								{acceptButtonText}
							</Button>
						</Box>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default WarningModal;
