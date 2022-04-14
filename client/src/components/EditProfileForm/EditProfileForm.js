import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { majors, years } from '../../constants';
import { UPDATE_USER } from '../../graphql/mutations';

const StyledTextField = (props) => {
	const { children, ...otherProps } = props;
	return (
		<TextField
			color="secondary"
			InputLabelProps={{ sx: { color: 'white' } }}
			SelectProps={{
				sx: {
					color: 'white',
					'.MuiSelect-icon': {
						color: 'white',
					},
					'.MuiOutlinedInput-notchedOutline': {
						borderColor: 'white !important',
					},
				},
			}}
			fullWidth
			select
			{...otherProps}
		>
			{children}
		</TextField>
	);
};

const yearOptions = years.map((year) => ({
	value: year,
	label: year,
}));
const majorOptions = majors.map((major) => ({
	value: major,
	label: major,
}));

export default function EditProfileForm({ refetchUser, toggle, user }) {
	const [updateUser] = useMutation(UPDATE_USER, {
		onCompleted: () => {
			refetchUser();
		},
	});
	const [values, setValues] = useState({
		year: user && user.year ? user.year : '',
		hobbies: user && user.hobbies ? user.hobbies : '',
		major: user && user.major ? user.major : '',
		bio: user && user.bio ? user.bio : '',
	});

	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Button
					color="secondary"
					onClick={() => {
						const { year, hobbies, major, bio } = values;
						const userFields = {
							...(year && { year }),
							...(hobbies && { hobbies }),
							...(major && { major }),
							...(bio && { bio }),
						};
						updateUser({
							variables: {
								userFields,
							},
						});
						toggle();
					}}
					size="large"
					sx={{ mr: '16px' }}
					variant="contained"
				>
					Save
				</Button>
				<Button
					color="secondary"
					onClick={toggle}
					size="large"
					variant="contained"
				>
					Cancel
				</Button>
			</Box>
			<Typography variant="h6" mb={1}>
				What year of college are you in?
			</Typography>
			<StyledTextField
				name="year"
				onChange={handleChange}
				value={values.year}
				sx={{
					mb: '24px',
				}}
			>
				{yearOptions.map((option) => (
					<MenuItem color="secondary" key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</StyledTextField>
			<Typography variant="h6" mb={1}>
				What is your major?
			</Typography>
			<StyledTextField
				name="major"
				onChange={handleChange}
				value={values.major}
				sx={{
					mb: '24px',
				}}
			>
				{majorOptions.map((option) => (
					<MenuItem color="secondary" key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</StyledTextField>
			<Typography variant="h6" mb={1}>
				What are some of your hobbies?
			</Typography>
			<TextField
				color="secondary"
				label="Hobbies"
				name="hobbies"
				value={values.hobbies}
				InputProps={{
					sx: { color: 'white' },
				}}
				InputLabelProps={{ sx: { color: 'white' } }}
				onChange={handleChange}
				sx={{
					'.MuiOutlinedInput-notchedOutline': {
						borderColor: 'white !important',
					},
					'.MuiInput-root': {
						color: 'white !important',
					},
					mb: '24px',
				}}
				fullWidth
				multiline
			/>
			<Typography variant="h6" mb={1}>
				Biography
			</Typography>
			<TextField
				color="secondary"
				name="bio"
				value={values.bio}
				InputProps={{
					sx: { color: 'white' },
				}}
				InputLabelProps={{ sx: { color: 'white' } }}
				onChange={handleChange}
				sx={{
					'.MuiOutlinedInput-notchedOutline': {
						borderColor: 'white !important',
					},
					'.MuiInput-root': {
						color: 'white !important',
					},
				}}
				fullWidth
				multiline
			/>
		</>
	);
}
