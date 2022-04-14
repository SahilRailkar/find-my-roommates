import { useEffect, useState } from 'react';

const svgMarker = {
	path: `M 10.63,17.03
	C 10.63,17.03 10.63,17.03 10.63,17.03
	  11.46,17.03 12.13,17.70 12.13,18.53
	  12.13,18.53 12.13,30.53 12.13,30.53
	  12.13,31.35 11.46,32.03 10.63,32.03
	  10.63,32.03 10.63,32.03 10.63,32.03
	  9.80,32.03 9.13,31.35 9.13,30.53
	  9.13,30.53 9.13,18.53 9.13,18.53
	  9.13,17.70 9.80,17.03 10.63,17.03 Z
	M 10.33,20.35
	C 4.81,20.35 0.33,15.88 0.33,10.35
	  0.33,4.83 4.81,0.35 10.33,0.35
	  15.85,0.35 20.33,4.83 20.33,10.35
	  20.33,15.88 15.85,20.35 10.33,20.35 Z
	M 10.50,8.00
	C 12.99,8.00 15.00,6.88 15.00,5.50
	  15.00,4.12 12.99,3.00 10.50,3.00
	  8.01,3.00 6.00,4.12 6.00,5.50
	  6.00,6.88 8.01,8.00 10.50,8.00 Z`,
	fillOpacity: 1,
	scale: 0.75,
	strokeWeight: 0,
};

const Marker = ({ onClick, selected, ...options }) => {
	const [marker, setMarker] = useState();

	useEffect(() => {
		if (!marker) {
			setMarker(
				new window.google.maps.Marker({
					animation: window.google.maps.Animation.DROP,
					icon: { ...svgMarker, fillColor: 'black' },
				})
			);
		}

		// remove marker from map on unmount
		return () => {
			if (marker) {
				marker.setMap(null);
			}
		};
	}, [marker]);

	useEffect(() => {
		if (marker) {
			if (onClick) {
				window.google.maps.event.addListener(marker, 'click', onClick);
			}
		}
	}, [marker, onClick]);

	useEffect(() => {
		if (marker) {
			if (selected) {
				marker.setIcon({ ...svgMarker, fillColor: 'red' });
			} else {
				marker.setIcon({ ...svgMarker, fillColor: 'black' });
			}
		}
	}, [marker, selected]);

	useEffect(() => {
		if (marker) {
			marker.setOptions(options);
		}
	}, [marker, options]);

	return null;
};

export default Marker;
