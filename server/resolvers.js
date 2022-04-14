const bcrypt = require('bcrypt');
const passport = require('passport');
const S3 = require('aws-sdk/clients/s3');

const Listing = require('./models/listing');
const User = require('./models/user');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
};

const resolvers = {
	Query: {
		getListing: async (_, { listingId }, ctx) => {
			if (ctx.user) {
				const listing = await Listing.findById(listingId);
				return listing;
			} else {
				return null;
			}
		},
		getListings: async (_, __, ctx) => {
			if (ctx.user) {
				const listings = await Listing.find({
					lister: {
						$ne: ctx.user._id,
					},
				});
				return listings;
			} else {
				return null;
			}
		},
		getSavedListings: async (_, __, ctx) => {
			if (ctx.user) {
				const listings = await Listing.find({ _id: ctx.user.savedListings });
				return listings;
			}
			return null;
		},
		getUser: async (_, { userId }, ctx) => {
			if (ctx.user) {
				if (userId) {
					const user = await User.findById(userId);
					return user;
				}
				return ctx.user;
			}
			return null;
		},
		getUserById: async (_, { userId }, ctx) => {
			if (ctx.user) {
				const user = await User.findById(userId);
				return user;
			}
			return null;
		},
		getUserListings: async (_, __, ctx) => {
			if (ctx.user) {
				const listings = await Listing.find({ lister: ctx.user._id });
				return listings;
			} else {
				return null;
			}
		},
	},
	Mutation: {
		addListing: (_, { listing }, ctx) => {
			if (ctx.user) {
				const newListing = new Listing({
					...listing,
					lister: ctx.user._id,
				});
				newListing
					.save()
					.then(() => {
						const s3 = new S3({
							region,
							credentials,
						});
						const keys = listing.images.map((url) => {
							return 'images/' + url.substring(url.lastIndexOf('/') + 1);
						});
						keys.forEach((key) => {
							const params = {
								Bucket: bucketName,
								Key: key,
								Tagging: {
									TagSet: [
										{
											Key: 'expires',
											Value: 'false',
										},
									],
								},
							};
							s3.putObjectTagging(params, (err, data) => {
								if (err) {
									console.log(err);
								}
							});
						});
					})
					.catch((err) => {
						console.log('error', err);
						return null;
					});
				return newListing;
			} else {
				return null;
			}
		},
		addUserImages: (_, { urls }, ctx) => {
			if (ctx.user) {
				User.updateOne(
					{ _id: ctx.user._id },
					{ $push: { images: { $each: urls } } },
					{ new: true },
					(err, doc) => {
						if (err) {
							return null;
						}
						return doc;
					}
				);

				const s3 = new S3({
					region,
					credentials,
				});
				const keys = urls.map((url) => {
					return 'images/' + url.substring(url.lastIndexOf('/') + 1);
				});
				keys.forEach((key) => {
					const params = {
						Bucket: bucketName,
						Key: key,
						Tagging: {
							TagSet: [
								{
									Key: 'expires',
									Value: 'false',
								},
							],
						},
					};
					s3.putObjectTagging(params, (err, data) => {
						if (err) {
							console.log(err);
						}
					});
				});
			} else {
				return null;
			}
		},
		deleteListing: async (_, { listingId }, ctx) => {
			if (ctx.user) {
				const listing = await Listing.findOne({ _id: listingId });

				const s3 = new S3({
					region,
					credentials,
				});
				const keys = listing.images.map((url) => {
					return 'images/' + url.substring(url.lastIndexOf('/') + 1);
				});
				keys.forEach((key) => {
					const params = {
						Bucket: bucketName,
						Key: key,
					};
					s3.deleteObject(params, (err, data) => {
						if (err) {
							console.log(err);
							return null;
						}
					});
				});

				const { deletedCount } = await Listing.deleteOne({ _id: listingId });
				if (deletedCount === 1) {
					return listing;
				}
				return null;
			}
			return null;
		},
		deleteListingImage: (_, { listingWithImage }, ctx) => {
			if (ctx.user) {
				const { listingId, imageUrl } = listingWithImage;
				const s3 = new S3({
					region,
					credentials,
				});

				let res = null;
				if (listingId) {
					Listing.updateOne(
						{ _id: listingId },
						{ $pull: { images: imageUrl } },
						{ new: true },
						(err, doc) => {
							if (err) {
								console.log(err);
								return null;
							}
							res = doc;
						}
					);
				}

				const key = imageUrl.slice(imageUrl.indexOf('images'));
				const params = {
					Bucket: bucketName,
					Key: key,
				};
				s3.deleteObject(params, (err, data) => {
					if (err) {
						console.log(err);
						return null;
					}
				});

				return res;
			}
			return null;
		},
		deleteUserImage: (_, { url }, ctx) => {
			if (ctx.user) {
				const s3 = new S3({
					region,
					credentials,
				});

				let res;
				User.updateOne(
					{ _id: ctx.user._id },
					{ $pull: { images: url } },
					{ new: true },
					(err, doc) => {
						if (err) {
							return null;
						}
						res = doc;
					}
				);

				const key = url.slice(url.indexOf('images'));
				const params = {
					Bucket: bucketName,
					Key: key,
				};
				s3.deleteObject(params, (err, data) => {
					if (err) {
						console.log(err);
						return null;
					}
				});

				return res;
			}
			return null;
		},
		getSignedUrls: async (_, { files }) => {
			const s3 = new S3({
				region,
				credentials,
			});

			const res = [];
			for (let i = 0; i < files.length; ++i) {
				let { key, contentType } = files[i];
				const params = {
					Bucket: bucketName,
					Key: key,
					ContentType: contentType,
					Tagging: 'expires=true',
				};

				const signedUrl = await s3.getSignedUrl('putObject', params);
				const url = `https://${bucketName}.s3.amazonaws.com/${key}`;

				res.push({
					signedUrl,
					url,
				});
			}

			return res;
		},
		logIn: (_, args, ctx) => {
			passport.authenticate('local', (err, user, info) => {
				if (err) throw err;
				if (!user) {
					return {
						error,
						success: false,
						user: null,
						value,
					};
				} else {
					ctx.req.logIn(user, (err) => {
						if (err) throw err;
						return {
							error: null,
							success: true,
							user,
							value: null,
						};
					});
				}
			})({ query: args });
		},
		logOut: (_, __, ctx) => {
			ctx.req.logOut();
			return true;
		},
		unsaveListing: (_, { listingId }, ctx) => {
			if (ctx.user) {
				User.updateOne(
					{ _id: ctx.user._id },
					{ $pull: { savedListings: listingId } },
					{ new: true },
					(err, doc) => {
						if (err) {
							return null;
						}
						return doc;
					}
				);
			}
			return null;
		},
		saveListing: (_, { listingId }, ctx) => {
			if (ctx.user) {
				User.updateOne(
					{ _id: ctx.user._id },
					{ $push: { savedListings: listingId } },
					{ new: true },
					(err, doc) => {
						if (err) {
							return null;
						}
						return doc;
					}
				);
			}
			return null;
		},
		signUp: async (
			_,
			{
				firstName,
				lastName,
				email,
				password,
				birthday,
				gender,
				year,
				major,
				bio,
			}
		) => {
			const hash = await bcrypt.hash(password, 10);
			const user = new User({
				firstName,
				lastName,
				email,
				hash,
				birthday,
				gender,
				year,
				major,
				bio,
			});

			User.findOne({ email }, (err, doc) => {
				if (err) throw err;
				if (doc) {
					return {
						error:
							'There is already a Rümer account associated with this email',
						success: false,
						user: null,
						value: 'email',
					};
				} else {
					user
						.save()
						.then(() => {
							return {
								error: null,
								success: true,
								user,
								value: null,
							};
						})
						.catch((err) => {
							return {
								error: 'User not created',
								success: false,
								user: null,
								value: 'password',
							};
						});
				}
			});
		},
		updateListing: (_, { listing }, ctx) => {
			if (ctx.user) {
				if (listing) {
					const s3 = new S3({
						region,
						credentials,
					});
					const keys = listing.images.map((url) => {
						return url.slice(url.indexOf('images'));
					});
					keys.forEach((key) => {
						const params = {
							Bucket: bucketName,
							Key: key,
							Tagging: {
								TagSet: [
									{
										Key: 'expires',
										Value: 'false',
									},
								],
							},
						};
						s3.putObjectTagging(params, (err, data) => {
							if (err) {
								console.log(err);
							}
						});
					});

					const { id, ...listingFields } = listing;
					Listing.updateOne(
						{ _id: id },
						listingFields,
						{ new: true },
						(err, doc) => {
							if (err) {
								console.log(err);
								return null;
							}
							return doc;
						}
					);
				}
			}
			return null;
		},
		updateUser: (_, { userFields }, ctx) => {
			const { year = '', major = '', hobbies = '', bio = '' } = userFields;
			const { user } = ctx;
			if (user) {
				User.updateOne(
					{ _id: user._id },
					{
						...(year && { year }),
						...(major && { major }),
						...(hobbies && { hobbies }),
						...(bio && { bio }),
					},
					{ new: true },
					(err, doc) => {
						if (err) {
							console.log(err);
							return null;
						}
						return doc;
					}
				);
			}
			return null;
		},
	},
};

module.exports = { resolvers };
