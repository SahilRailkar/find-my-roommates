import React, { useContext, useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';

import { useQuery } from '@apollo/client';
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
import UploadImageModal from '../../modals/UploadImageModal/UploadImageModal';

const defaultStyles = {
	borderRadius: '16px',
	backgroundColor: '#181818',
	color: 'white',
	mt: '32px',
	minHeight: '100vh',
	p: '32px',
	position: 'relative',
};

const calculateAge = (birthday) => {
	const dob = new Date(birthday);
	const diff = Date.now() - dob.getTime();
	const delta = new Date(diff);
	return Math.abs(delta.getUTCFullYear() - 1970);
};

const Profile = () => {
	const { component: Component, props, showModal } = useContext(ModalContext);
	const { data, refetch } = useQuery(GET_USER);
	const [user, setUser] = useState(null);
	const [editMode, setEditMode] = useState(true);

	const duration = 300;
	const transitionStyles = {
		entering: { backgroundColor: '#444' },
		entered: { backgroundColor: '#444' },
		exiting: { backgroundColor: '#181818' },
		exited: { backgroundColor: '#181818' },
	};

	useEffect(() => {
		if (data) {
			setUser(data.getUser);
		}
	}, [data]);

	return (
		<Box sx={{ backgroundColor: 'black' }}>
			<Container
				maxWidth="lg"
				sx={{ color: 'white', pt: '32px', textAlign: 'center' }}
			>
				<ImageGroup
					images={user ? user.images || null : null}
					refetchUser={refetch}
				/>
				<Button
					color="secondary"
					onClick={() => {
						showModal(UploadImageModal, {
							isOpen: true,
							refetchUser: refetch,
						});
					}}
					startIcon={<AddIcon />}
					variant="contained"
					sx={{ width: 300, mt: 2 }}
				>
					Upload images
				</Button>
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
			<Transition in={editMode} timeout={duration}>
				{(state) => {
					return (
						<Container sx={{ ...defaultStyles, ...transitionStyles[state] }}>
							<IconButton
								color="secondary"
								onClick={() => {
									setEditMode(!editMode);
								}}
								sx={{ position: 'absolute', right: '16px', top: '16px' }}
							>
								<EditIcon />
							</IconButton>
							{editMode ? (
								<EditProfileForm />
							) : (
								<>
									<Typography variant="h6" mb={1}>
										I am a...
									</Typography>
									<Typography
										fontFamily={['Bitter', 'serif'].join(',')}
										variant="h4"
										mb={8}
									>
										a senior majoring in Computer Science and Engineering.
									</Typography>
									<Typography variant="h6" mb={1}>
										I enjoy...
									</Typography>
									<Typography
										fontFamily={['Bitter', 'serif'].join(',')}
										variant="h4"
									>
										cooking, petsitting, photography, watching Netflix,
										shopping, and listening to music.
									</Typography>
								</>
							)}
						</Container>
					);
				}}
			</Transition>
		</Box>

		/* <Row>
        <Col md={1} xl={3}></Col>
        <Col md={10} xl={6} id="content">
            <Row id="name-row"><div id="name">{this.state.firstName + " " + this.state.lastName}</div></Row>
            <Row><div> {this.tags} </div></Row>
            <Row id="about"><div>About</div></Row>
            <Row id="info">
                <div>
                    <div className="sep"><em>Year:</em>{" " + this.state.year}</div>
                    <div className="sep"><em>Major:</em>{" " + this.state.major}</div>
                    <div className="sep"><em>Bio:</em>{" " + this.state.about}</div>
                </div>
            </Row>  
            <Row id="preferences"><div>Preferences</div></Row>
            <Row id="preferences-row">
                <div>
                    <div className="sep"><em>Location:</em>{" " + this.state.location}</div>
                    <div className="sep"><em>Move-in Date:</em>{" " + this.state.moveIn}</div>
                    <div className="sep"><em>Move-out Date:</em>{" " + this.state.moveOut}</div>  
                    <div className="sep"><em>Single Gender/Mixed Gender</em></div>                              
                </div>
            </Row>
        </Col>
        <Col md={1} xl={3}></Col>
    </Row> */
	);
};

export default Profile;
