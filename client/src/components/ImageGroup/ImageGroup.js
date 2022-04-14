import React, { useContext, useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

import { ModalContext } from '../../contexts/ModalContext';
import UploadImageModal from '../../modals/UploadImageModal/UploadImageModal';

const duration = 300;

const iconButtonStyles = {
	position: 'absolute',
	top: 'calc(50% - 10px)',
};

const errorStyles = {
	border: '1px dashed #d32f2f',
	color: '#d32f2f',
};

const ImageGroup = ({
	color = 'primary',
	containerStyles,
	editMode = true,
	error = false,
	imageWidth = '200px',
	imageHeight = '300px',
	placeholder,
	placeholderStyles,
	images,
	imageStyles,
	onUpload,
	onDelete,
}) => {
	const newImageStyles = {
		borderRadius: '15px',
		height: imageHeight,
		objectFit: 'cover',
		position: 'absolute',
		transition: `all ${duration}ms ease-in-out`,
		transform: 'translateZ(0)',
		userDrag: 'none',
		userSelect: 'none',
		width: imageWidth,
		MozUserSelect: 'none',
		WebkitUserDrag: 'none',
		WebkitUserSelect: 'none',
		msUserSelect: 'none',
		...imageStyles,
	};

	const { showModal } = useContext(ModalContext);

	const [focus, setFocus] = useState(0);
	const [inProps, setInProps] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const NUM_IMAGES = images ? images.length : 0;
		const newInProps = [];
		for (let i = 0; i < NUM_IMAGES; ++i) {
			newInProps.push(i === focus ? true : false);
		}
		setInProps(newInProps);
	}, [images]);

	const transitionStyles = {
		entering: {
			left: `calc(50% - ${imageWidth}/2)`,
			opacity: 1,
			zIndex: 1,
		},
		entered: {
			left: `calc(50% - ${imageWidth}/2)`,
			opacity: 1,
			zIndex: 1,
		},
		exiting: {
			left: `calc(50% - ${imageWidth}/2 - ${imageWidth}/4)`,
			opacity: focus === 1 ? 0.5 : 0,
			zIndex: 0,
		},
		exited: {
			left: `calc(50% - ${imageWidth}/2 - ${imageWidth}/4)`,
			opacity: focus === 1 ? 0.5 : 0,
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

	const handleClickCloseIconButton = () => {
		onDelete(focus);
		if (focus === inProps.length - 1 && inProps.length !== 1) {
			setFocus(focus - 1);
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
				...containerStyles,
			}}
		>
			<Box
				sx={{
					display: 'inline-block',
					height: imageHeight,
					position: 'relative',
				}}
			>
				<IconButton
					color={color}
					disabled={focus === 0}
					onClick={() => handleClickIconButton(true)}
					sx={{
						...iconButtonStyles,
						right: `calc(((100% - ${imageWidth})/2) + ${imageWidth} + ${imageWidth}/4 + 10px)`,
					}}
				>
					<ArrowBackIcon />
				</IconButton>
				<Box>
					{inProps.length >= 1 ? (
						<Transition in={inProps[0]} timeout={duration}>
							{(state) => {
								return (
									<>
										<Box
											component="img"
											src={images[0]}
											sx={{ ...newImageStyles, ...transitionStyles[state] }}
										></Box>
										{editMode && (
											<IconButton
												onClick={handleClickCloseIconButton}
												size="small"
												sx={{
													color: color === 'primary' ? 'white' : 'black',
													backgroundColor:
														color === 'primary' ? 'black' : 'white',
													height: '24px',
													left: `calc((100% - ${imageWidth})/2 + ${imageWidth} - 12px)`,
													top: '-12px',
													width: '24px',
													zIndex: '100',
												}}
											>
												<CloseIcon sx={{ height: '18px' }} />
											</IconButton>
										)}
									</>
								);
							}}
						</Transition>
					) : (
						<Box
							onClick={() => {
								showModal(UploadImageModal, {
									isOpen: true,
									onUpload,
									setLoading,
								});
							}}
							sx={{
								alignItems: 'center',
								border: '1px dashed white',
								borderRadius: '15px',
								display: 'flex',
								height: imageHeight,
								justifyContent: 'center',
								left: `calc(50% - ${imageWidth}/2)`,
								position: 'absolute',
								width: imageWidth,
								color: 'white',
								...placeholderStyles,
								...(error && errorStyles),
							}}
						>
							{loading ? (
								<CircularProgress />
							) : (
								<Typography p={2}>{placeholder}</Typography>
							)}
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
														[index < focus
															? 'left'
															: 'right']: `calc(50% - ${imageWidth}/2 - ${imageWidth}/4)`,
														opacity:
															focus - 1 === index || focus + 1 === index
																? 0.5
																: 0,
														zIndex: 0,
													},
													exited: {
														[index < focus
															? 'left'
															: 'right']: `calc(50% - ${imageWidth}/2 - ${imageWidth}/4)`,
														opacity:
															focus - 1 === index || focus + 1 === index
																? 0.5
																: 0,
														zIndex: 0,
													},
												};

												return (
													<Box
														component="img"
														src={images[index]}
														sx={{
															...newImageStyles,
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
				</Box>
				<IconButton
					color={color}
					disabled={inProps.length === 0 || focus === inProps.length - 1}
					onClick={() => handleClickIconButton(false)}
					sx={{
						...iconButtonStyles,
						left: `calc(((100% - ${imageWidth})/2) + ${imageWidth} + ${imageWidth}/4 + 10px)`,
					}}
				>
					<ArrowForwardIcon />
				</IconButton>
			</Box>
		</Box>
	);
};

export default ImageGroup;
