import React, { useEffect, useRef, useState } from 'react';

import { createCustomEqual } from 'fast-equals';

export default function Map({ onClick, onIdle, children, style, ...options }) {
	const [map, setMap] = useState();
	const ref = useRef(null);

	useEffect(() => {
		if (ref.current && !map) {
			setMap(
				new window.google.maps.Map(ref.current, {
					mapId: '965154fc2b93cb83',
					fullscreenControl: false,
					mapTypeControl: false,
					streetViewControl: false,
				})
			);
		}
	}, [ref, map]);

	useDeepCompareEffectForMaps(() => {
		if (map) {
			map.setOptions(options);
		}
	}, [map, options]);

	useEffect(() => {
		if (map) {
			['click', 'idle'].forEach((eventName) =>
				window.google.maps.event.clearListeners(map, eventName)
			);

			if (onClick) {
				map.addListener('click', onClick);
			}

			if (onIdle) {
				map.addListener('idle', () => onIdle(map));
			}
		}
	}, [map, onClick, onIdle]);

	return (
		<>
			<div ref={ref} style={style} />
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					// set the map prop on the child component
					return React.cloneElement(child, { map });
				}
			})}
		</>
	);
}

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
	if (
		a instanceof window.google.maps.LatLng ||
		b instanceof window.google.maps.LatLng
	) {
		return new window.google.maps.LatLng(a).equals(
			new window.google.maps.LatLng(b)
		);
	}

	// TODO extend to other types

	// use fast-equals for other objects
	return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
	const ref = React.useRef();

	if (!deepCompareEqualsForMaps(value, ref.current)) {
		ref.current = value;
	}

	return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
	React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
