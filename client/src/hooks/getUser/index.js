import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';

import { GET_USER } from '../../graphql/queries';

const useGetUser = () => {
	const [user, setUser] = useState();
	const { data, refetch } = useQuery(GET_USER);

	useEffect(() => {
		if (data && data.getUser) {
			setUser(data.getUser);
		}
	}, [data]);

	return { user, refetch };
};

export default useGetUser;
