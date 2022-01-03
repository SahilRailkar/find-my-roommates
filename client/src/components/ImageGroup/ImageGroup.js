import React, { useContext, useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { ModalContext } from '../../contexts/ModalContext';
import UploadImageModal from '../../modals/UploadImageModal/UploadImageModal';

const duration = 300;

const imageStyles = {
	borderRadius: '15px',
	objectFit: 'cover',
	position: 'absolute',
	transition: `all ${duration}ms ease-in-out`,
	userDrag: 'none',
	userSelect: 'none',
	MozUserSelect: 'none',
	WebkitUserDrag: 'none',
	WebkitUserSelect: 'none',
	msUserSelect: 'none',
};

const iconButtonStyles = {
	position: 'absolute',
	top: 'calc(50% - 10px)',
};

const ImageGroup = ({ images, refetchUser }) => {
	const { showModal } = useContext(ModalContext);

	const [focus, setFocus] = useState(0);
	const [inProps, setInProps] = useState([]);
	useEffect(() => {
		const NUM_IMAGES = images ? images.length : 0;
		const inPropsInit = [];
		for (let i = 0; i < NUM_IMAGES; ++i) {
			inPropsInit.push(i === 0 ? true : false);
		}
		setInProps(inPropsInit);
	}, [images]);

	const transitionStyles = {
		entering: {
			height: '300px',
			left: 'calc(50% - 100px)',
			opacity: 1,
			width: '200px',
			zIndex: 1,
		},
		entered: {
			height: '300px',
			left: 'calc(50% - 100px)',
			opacity: 1,
			width: '200px',
			zIndex: 1,
		},
		exiting: {
			height: '285px',
			left: 'calc(40% - 100px)',
			opacity: focus === 1 ? 0.5 : 0,
			width: '190px',
			zIndex: 0,
		},
		exited: {
			height: '285px',
			left: 'calc(40% - 100px)',
			opacity: focus === 1 ? 0.5 : 0,
			width: '190px',
			zIndex: 0,
		},
	};

	const handleClickIconButton = (left) => {
		const newInProps = inProps.slice();
		newInProps[focus] = false;
		newInProps[left ? focus - 1 : focus + 1] = true;
		setInProps(newInProps);
		setFocus(left ? focus - 1 : focus + 1);
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
			<Box
				sx={{
					display: 'inline-block',
					height: '300px',
					width: '500px',
					position: 'relative',
				}}
			>
				<IconButton
					color="secondary"
					disabled={focus === 0}
					onClick={() => handleClickIconButton(true)}
					sx={{ ...iconButtonStyles, left: '10%' }}
				>
					<ArrowBackIcon />
				</IconButton>
				{inProps.length >= 1 ? (
					<Transition in={inProps[0]} timeout={duration}>
						{(state) => {
							return (
								<Box
									component="img"
									src={images[0]}
									sx={{ ...imageStyles, ...transitionStyles[state] }}
								></Box>
							);
						}}
					</Transition>
				) : (
					<Box
						onClick={() => {
							showModal(UploadImageModal, {
								isOpen: true,
								refetchUser,
							});
						}}
						sx={{
							alignItems: 'center',
							border: '1px dashed #ffffff',
							borderRadius: '15px',
							display: 'flex',
							height: '300px',
							justifyContent: 'center',
							left: 'calc(50% - 100px)',
							position: 'absolute',
							width: '200px',
						}}
					>
						<Typography p={2}>Add pictures of yourself!</Typography>
					</Box>
				)}
				{inProps.length > 1
					? inProps.map((inProp, index) => {
							if (index !== 0) {
								return (
									<Transition key={index} in={inProp} timeout={duration}>
										{(state) => {
											const rightTransitionStyles = {
												...transitionStyles,
												exiting: {
													height: '285px',
													[index < focus ? 'left' : 'right']:
														'calc(40% - 100px)',
													opacity:
														focus - 1 === index || focus + 1 === index
															? 0.5
															: 0,
													width: '190px',
													zIndex: 0,
												},
												exited: {
													height: '285px',
													[index < focus ? 'left' : 'right']:
														'calc(40% - 100px)',
													opacity:
														focus - 1 === index || focus + 1 === index
															? 0.5
															: 0,
													width: '190px',
													zIndex: 0,
												},
											};

											return (
												<Box
													component="img"
													src={images[index]}
													sx={{
														...imageStyles,
														...rightTransitionStyles[state],
													}}
												></Box>
											);
										}}
									</Transition>
								);
							}
							return null;
					  })
					: null}
				<IconButton
					color="secondary"
					disabled={inProps.length === 0 || focus === inProps.length - 1}
					onClick={() => handleClickIconButton(false)}
					sx={{ ...iconButtonStyles, right: '10%' }}
				>
					<ArrowForwardIcon />
				</IconButton>
			</Box>
		</Box>
	);
};

export default ImageGroup;
