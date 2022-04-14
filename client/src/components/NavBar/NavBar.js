import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { ModalContext } from '../../contexts/ModalContext';
import { SignUpModal } from '../../modals/SignUpModal';
import { LogInModal } from '../../modals/LogInModal';
import { GET_USER } from '../../graphql/queries';

const pages = [
	{ page: 'Find rooms', route: '/find-rooms/listings' },
	{ page: 'Find roommates', route: '/find-roommates' },
	{ page: 'Marketplace', route: '/marketplace' },
];

const NavBar = () => {
	const { showModal } = useContext(ModalContext);
	const history = useHistory();
	const { data, refetch } = useQuery(GET_USER);
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const [user, setUser] = useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const settings = user
		? [
				{
					setting: 'Profile',
					props: {
						onClick: () => {
							history.push('/profile');
							handleCloseUserMenu();
						},
					},
				},
				{
					setting: 'Sign out',
					props: {
						onClick: () => {
							axios({
								method: 'POST',
								withCredentials: true,
								url: 'http://localhost:4000/logout',
							})
								.then(() => {
									refetch();
									history.push('/');
								})
								.catch((err) => {
									console.error(err);
								});
							handleCloseUserMenu();
						},
					},
				},
		  ]
		: [
				{
					setting: 'Sign up',
					props: {
						onClick: () => {
							showModal(SignUpModal, { isOpen: true });
							handleCloseUserMenu();
						},
					},
				},
				{
					setting: 'Log in',
					props: {
						onClick: () => {
							showModal(LogInModal, { isOpen: true });
							handleCloseUserMenu();
						},
					},
				},
		  ];

	useEffect(() => {
		if (data) {
			setUser(data.getUser);
		}
	}, [data]);

	return (
		<AppBar position="static" elevation={0}>
			<Container maxWidth="lg">
				<Toolbar disableGutters>
					<Typography
						variant="h4"
						noWrap
						component="div"
						sx={{
							mr: 1,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'Bitter, serif',
							cursor: 'pointer',
						}}
						onClick={() => {
							if (!user) {
								history.push('/');
							} else {
								history.push('/find-rooms/listings');
							}
						}}
					>
						R
					</Typography>
					<Typography
						variant="h7"
						noWrap
						component="div"
						sx={{
							mr: 3,
							display: { xs: 'none', md: 'flex' },
							cursor: 'pointer',
						}}
						onClick={() => {
							if (!user) {
								history.push('/');
							} else {
								history.push('/find-rooms/listings');
							}
						}}
					>
						rümer
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClick={handleCloseNavMenu}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map(({ page, route }) => (
								<MenuItem key={page} onClick={() => history.push(route)}>
									<Typography textAlign="center">{page}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Typography
						variant="h4"
						noWrap
						component="div"
						sx={{
							flexGrow: 1,
							display: { xs: 'flex', md: 'none' },
							cursor: 'pointer',
						}}
						onClick={() => history.push('/')}
					>
						rümer
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'center',
						}}
					>
						{pages.map(({ page, route }) => (
							<Button
								key={page}
								onClick={() => history.push(route)}
								sx={{
									mx: 4,
									color: 'white',
									display: 'block',
									textAlign: 'center',
								}}
							>
								{page}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Account">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map(({ setting, props }) => (
								<MenuItem key={setting} {...props}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default NavBar;
