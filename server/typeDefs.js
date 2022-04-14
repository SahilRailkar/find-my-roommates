const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		email: String!
		password: String!
		birthday: String!
		gender: String!
		hobbies: String
		year: String
		major: String
		bio: String
		images: [String!]!
		savedListings: [ID!]
	}

	input File {
		key: String!
		contentType: String!
	}

	type SignedUrl {
		signedUrl: String!
		url: String!
	}

	type UserResponse {
		error: String
		success: Boolean!
		user: User
		value: String
	}

	input UpdateUserRequest {
		year: String
		major: String
		hobbies: String
		bio: String
	}

	type Address {
		streetNumber: String!
		streetName: String!
		city: String!
		state: String!
		zipCode: String!
		country: String!
	}

	input AddressRequest {
		streetNumber: String!
		streetName: String!
		city: String!
		state: String!
		zipCode: String!
		country: String!
	}

	type Listing {
		id: ID!
		address: Address!
		formattedAddress: String!
		lat: Float!
		lng: Float!
		placeId: String!
		numBedrooms: Int!
		numBathrooms: Float!
		bedroomType: String
		bathroomType: String
		maxOccupancy: Int!
		squareFootage: Int
		leaseTerm: Int!
		dateAvailable: String!
		price: Float!
		notes: String
		listingType: String!
		images: [String!]
		lister: ID!
	}

	input AddListingRequest {
		address: AddressRequest!
		formattedAddress: String!
		lat: Float!
		lng: Float!
		placeId: String!
		numBedrooms: Int!
		numBathrooms: Float!
		bedroomType: String
		bathroomType: String
		maxOccupancy: Int!
		squareFootage: Int
		leaseTerm: Int!
		dateAvailable: String!
		price: Float!
		notes: String
		listingType: String!
		images: [String!]
	}

	type AddListingResponse {
		id: ID!
		address: Address!
		formattedAddress: String!
		lat: Float!
		lng: Float!
		placeId: String!
		numBedrooms: Int!
		numBathrooms: Float!
		bedroomType: String
		bathroomType: String
		maxOccupancy: Int!
		squareFootage: Int
		leaseTerm: Int!
		dateAvailable: String!
		price: Float!
		notes: String
		listingType: String!
		images: [String!]
		lister: ID!
	}

	input UpdateListingRequest {
		id: ID!
		address: AddressRequest
		formattedAddress: String
		lat: Float
		lng: Float
		placeId: String
		numBedrooms: Int
		numBathrooms: Float
		bedroomType: String
		bathroomType: String
		maxOccupancy: Int
		squareFootage: Int
		leaseTerm: Int
		dateAvailable: String
		price: Float
		notes: String
		listingType: String
		images: [String!]
	}

	input DeleteListingImageRequest {
		listingId: ID
		imageUrl: String!
	}

	type Query {
		getListing(listingId: ID!): Listing!
		getListings: [Listing!]!
		getUser(userId: ID): User
		getUserById(userId: ID!): User
		getUserListings: [Listing!]
		getSavedListings: [Listing!]
	}

	type Mutation {
		addListing(listing: AddListingRequest!): AddListingResponse!
		addUserImages(urls: [String!]!): User
		deleteListing(listingId: ID!): Listing
		deleteListingImage(listingWithImage: DeleteListingImageRequest!): Listing
		deleteUserImage(url: String!): User
		getSignedUrls(files: [File!]!): [SignedUrl!]!
		logIn(email: String!, password: String!): UserResponse
		logOut: Boolean
		unsaveListing(listingId: ID!): User
		updateListing(listing: UpdateListingRequest!): Listing
		saveListing(listingId: ID!): User
		signUp(
			firstName: String!
			lastName: String!
			email: String!
			password: String!
			birthday: String!
			gender: String!
			year: String
			major: String
			bio: String
		): UserResponse!
		updateUser(userFields: UpdateUserRequest): User
	}
`;

module.exports = { typeDefs };
