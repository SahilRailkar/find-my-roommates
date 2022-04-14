const getProfileInfo = (year, major) => {
	let yearInfo = '';
	let majorInfo = '';
	if (year) {
		if (year === 'graduate') {
			yearInfo = 'a graduate student ';
		} else {
			yearInfo = `a ${year} year student `;
		}
	}
	if (major) {
		if (!year || year === 'graduate') {
			majorInfo = ` studying ${major}`;
		} else {
			majorInfo = ` majoring in ${major}`;
		}
	}
	const info = `${yearInfo}${majorInfo}`.trim();
	return info ? `${info}.` : '';
};

export { getProfileInfo };
