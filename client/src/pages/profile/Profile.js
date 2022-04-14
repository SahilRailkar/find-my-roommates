import React, { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import ImageGroup from '../../components/ImageGroup/ImageGroup';
import { ModalContext } from '../../contexts/ModalContext';
import EditProfileForm from '../../components/EditProfileForm/EditProfileForm';
import { GET_USER } from '../../graphql/queries';
import { ADD_USER_IMAGES, DELETE_USER_IMAGE } from '../../graphql/mutations';
import { getProfileInfo } from '../../helpers';
import UploadImageModal from '../../modals/UploadImageModal/UploadImageModal';
import WarningModal from '../../modals/WarningModal/WarningModal';

const calculateAge = (birthday) => {
	const dob = new Date(birthday);
	const diff = Date.now() - dob.getTime();
	const delta = new Date(diff);
	return Math.abs(delta.getUTCFullYear() - 1970);
};

const Profile = () => {
	const { id } = useParams();

	const {
		component: Component,
		props,
		showModal,
		hideModal,
	} = useContext(ModalContext);
	const [addUserImages] = useMutation(ADD_USER_IMAGES, {
		onCompleted: () => {
			refetch();
		},
	});
	const [deleteUserImage] = useMutation(DELETE_USER_IMAGE, {
		onCompleted: () => {
			refetch();
		},
	});
	const { data, refetch } = useQuery(GET_USER, {
		variables: { ...(id && { userId: id }) },
	});
	const [user, setUser] = useState(null);
	const [images, setImages] = useState(null);
	const canEdit = id ? false : true;
	const [editMode, setEditMode] = useState(false);

	const onUpload = (urls) => {
		addUserImages({
			variables: {
				urls,
			},
		});
	};

	useEffect(() => {
		if (data && data.getUser) {
			setUser(data.getUser);
			setImages(data.getUser.images);
		}
	}, [data]);

	return (
		<Box sx={{ backgroundColor: 'black', minHeight: '100vh' }}>
			<Container
				maxWidth="lg"
				sx={{ color: 'white', pt: '32px', textAlign: 'center' }}
			>
				<ImageGroup
					color="secondary"
					editMode={canEdit}
					placeholder={
						canEdit ? 'Add pictures of yourself!' : 'This user has no pictures!'
					}
					images={images}
					onDelete={(focus) => {
						showModal(WarningModal, {
							acceptButtonText: 'Delete',
							body: 'Are you sure you want to delete this image? You will not be able to undo this action.',
							isOpen: true,
							onAccept: () => {
								deleteUserImage({
									variables: {
										url: images[focus],
									},
								});
								const newImages = images.slice();
								newImages.splice(focus, 1);
								setImages(newImages);
								hideModal();
							},
							title: 'Delete image',
						});
					}}
					onUpload={onUpload}
				/>
				{canEdit && (
					<Button
						color="secondary"
						onClick={() => {
							showModal(UploadImageModal, {
								isOpen: true,
								onUpload: onUpload,
							});
						}}
						startIcon={<AddIcon />}
						variant="contained"
						sx={{ width: 300, mt: 2 }}
					>
						Upload images
					</Button>
				)}
				<Typography sx={{ my: '48px' }} variant="h4">
					{user
						? user.firstName +
						  ' ' +
						  user.lastName +
						  ', ' +
						  calculateAge(user.birthday)
						: ''}
				</Typography>
				{Component ? <Component {...props} /> : null}
			</Container>
			<Container
				sx={{
					borderRadius: '16px',
					backgroundColor: '#181818',
					color: 'white',
					mt: '32px',
					p: '32px',
					position: 'relative',
				}}
			>
				{editMode ? (
					<EditProfileForm
						refetchUser={refetch}
						toggle={() => setEditMode(!editMode)}
						user={user}
					/>
				) : (
					<>
						{canEdit && (
							<IconButton
								color="secondary"
								onClick={() => {
									setEditMode(!editMode);
								}}
								sx={{ position: 'absolute', right: '16px', top: '16px' }}
							>
								<EditIcon />
							</IconButton>
						)}
						<Typography variant="h6" mb={1}>
							I am a...
						</Typography>
						<Typography fontFamily={['Bitter', 'serif'].join(',')} variant="h4">
							{user ? getProfileInfo(user.year, user.major) : ''}
						</Typography>
						{user && user.hobbies && (
							<>
								<Typography variant="h6" mt={8} mb={1}>
									I enjoy...
								</Typography>
								<Typography
									fontFamily={['Bitter', 'serif'].join(',')}
									variant="h4"
								>
									{user.hobbies}
								</Typography>
							</>
						)}
						{user && user.bio && (
							<>
								<Typography variant="h6" mt={8} mb={1}>
									Biography
								</Typography>
								<Typography
									fontFamily={['Bitter', 'serif'].join(',')}
									variant="h4"
								>
									{user.bio}
								</Typography>
							</>
						)}
					</>
				)}
			</Container>
		</Box>
	);
};

export default Profile;
