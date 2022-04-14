import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ListingsHeader() {
	return (
		<Box
			sx={{
				alignItems: 'baseline',
				justifyContent: 'space-between',
				display: 'flex',
				flexWrap: 'wrap',
				mb: '16px',
				px: '12px',
			}}
		>
			<Typography
				variant="h5"
				sx={{
					fontFamily: 'Bitter, serif',
				}}
			>
				Listings near you
			</Typography>
		</Box>
	);
}
