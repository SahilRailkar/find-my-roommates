import { gql } from '@apollo/client';

export const GET_USER = gql`
	query {
		getUser {
			firstName
			lastName
			birthday
			gender
			images
		}
	}
`;
