import { gql } from '@apollo/client';

export const ADD_USER_IMAGES = gql`
	mutation addUserImages($urls: [String!]!) {
		addUserImages(urls: $urls) {
			id
			images
		}
	}
`;

export const GET_SIGNED_URLS = gql`
	mutation getSignedUrls($files: [File!]!) {
		getSignedUrls(files: $files) {
			signedUrl
			url
		}
	}
`;

export const LOG_IN = gql`
	mutation logIn($email: String!, $password: String!) {
		logIn(email: $email, password: $password) {
			error
			success
			user {
				id
			}
			value
		}
	}
`;

export const UNSAVE_LISTING = gql`
	mutation unsaveListing($listingId: ID!) {
		unsaveListing(listingId: $listingId) {
			savedListings
		}
	}
`;

export const SAVE_LISTING = gql`
	mutation saveListing($listingId: ID!) {
		saveListing(listingId: $listingId) {
			savedListings
		}
	}
`;

export const UPDATE_LISTING = gql`
	mutation updateListing($listing: UpdateListingRequest!) {
		updateListing(listing: $listing) {
			id
		}
	}
`;

export const SIGN_UP = gql`
	mutation signUp(
		$firstName: String!
		$lastName: String!
		$email: String!
		$password: String!
		$birthday: String!
		$gender: String!
	) {
		signUp(
			firstName: $firstName
			lastName: $lastName
			email: $email
			password: $password
			birthday: $birthday
			gender: $gender
		) {
			error
			success
			user {
				id
			}
			value
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser($userFields: UpdateUserRequest) {
		updateUser(userFields: $userFields) {
			id
			year
			major
			bio
		}
	}
`;

export const ADD_LISTING = gql`
	mutation addListing($listing: AddListingRequest!) {
		addListing(listing: $listing) {
			id
		}
	}
`;

export const DELETE_LISTING_IMAGE = gql`
	mutation deleteListingImage($listingWithImage: DeleteListingImageRequest!) {
		deleteListingImage(listingWithImage: $listingWithImage) {
			id
			images
		}
	}
`;

export const DELETE_USER_IMAGE = gql`
	mutation deleteUserImage($url: String!) {
		deleteUserImage(url: $url) {
			id
			images
		}
	}
`;

export const DELETE_LISTING = gql`
	mutation deleteListing($listingId: ID!) {
		deleteListing(listingId: $listingId) {
			id
		}
	}
`;
