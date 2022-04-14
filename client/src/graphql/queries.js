import { gql } from '@apollo/client';

export const GET_LISTING = gql`
	query getListing($listingId: ID!) {
		getListing(listingId: $listingId) {
			id
			address {
				streetNumber
				streetName
				city
				state
				zipCode
				country
			}
			formattedAddress
			lat
			lng
			placeId
			numBedrooms
			numBathrooms
			bedroomType
			bathroomType
			maxOccupancy
			squareFootage
			leaseTerm
			dateAvailable
			price
			notes
			listingType
			images
			lister
		}
	}
`;

export const GET_LISTINGS = gql`
	query {
		getListings {
			id
			address {
				streetNumber
				streetName
				city
				state
				zipCode
				country
			}
			formattedAddress
			lat
			lng
			placeId
			numBedrooms
			numBathrooms
			bedroomType
			bathroomType
			maxOccupancy
			squareFootage
			leaseTerm
			dateAvailable
			price
			notes
			listingType
			images
			lister
		}
	}
`;

export const GET_SAVED_LISTINGS = gql`
	query {
		getSavedListings {
			id
			address {
				streetNumber
				streetName
				city
				state
				zipCode
				country
			}
			formattedAddress
			lat
			lng
			placeId
			numBedrooms
			numBathrooms
			bedroomType
			bathroomType
			maxOccupancy
			squareFootage
			leaseTerm
			dateAvailable
			price
			notes
			listingType
			images
			lister
		}
	}
`;

export const GET_USER = gql`
	query getUser($userId: ID) {
		getUser(userId: $userId) {
			id
			firstName
			lastName
			birthday
			gender
			hobbies
			year
			major
			bio
			images
			savedListings
		}
	}
`;

export const GET_USER_LISTINGS = gql`
	query {
		getUserListings {
			id
			address {
				streetNumber
				streetName
				city
				state
				zipCode
				country
			}
			formattedAddress
			lat
			lng
			placeId
			numBedrooms
			numBathrooms
			bedroomType
			bathroomType
			maxOccupancy
			squareFootage
			leaseTerm
			dateAvailable
			price
			notes
			listingType
			images
			lister
		}
	}
`;

export const GET_USER_BY_ID = gql`
	query getUserById($userId: ID!) {
		getUserById(userId: $userId) {
			id
			firstName
			lastName
			images
		}
	}
`;
