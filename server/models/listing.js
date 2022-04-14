const mongoose = require('mongoose');

const Listing = new mongoose.Schema({
	address: {
		streetNumber: {
			type: String,
			required: true,
		},
		streetName: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zipCode: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
	formattedAddress: { type: String, required: true },
	lat: { type: Number, required: true },
	lng: { type: Number, required: true },
	placeId: { type: String, required: true },
	numBedrooms: { type: Number, required: true },
	numBathrooms: { type: Number, required: true },
	bedroomType: { type: String },
	bathroomType: { type: String },
	maxOccupancy: { type: Number, required: true },
	squareFootage: { type: Number },
	leaseTerm: { type: Number, required: true },
	dateAvailable: { type: String, required: true },
	price: { type: Number, required: true },
	notes: { type: String },
	listingType: { type: String, required: true },
	images: { type: [String] },
	lister: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

module.exports = mongoose.model('listings', Listing);
