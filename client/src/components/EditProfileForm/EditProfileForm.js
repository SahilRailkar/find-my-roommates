import React, { useState } from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const years = [
	{
		value: 'freshman',
		label: 'freshman',
	},
	{
		value: 'sophomore',
		label: 'sophomore',
	},
	{
		value: 'junior',
		label: 'junior',
	},
	{
		value: 'senior',
		label: 'senior',
	},
];

export default function EditProfileForm() {
	const [values, setValues] = useState({ year: '' });

	const handleYearChange = (e) => {
		setValues({ ...values, year: e.target.value });
	};

	return (
		<>
			<Typography variant="h6" mb={1}>
				Year:
			</Typography>
			<TextField
				color="secondary"
				label="Year"
				onChange={handleYearChange}
				value={values.year}
				InputLabelProps={{ sx: { color: 'white' } }}
				SelectProps={{ sx: { color: 'white' } }}
				fullWidth
				select
			>
				{years.map((option) => (
					<MenuItem color="secondary" key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>
		</>
	);
}
