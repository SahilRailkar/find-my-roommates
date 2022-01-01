const bcrypt = require("bcrypt");
const passport = require("passport");
const S3 = require("aws-sdk/clients/s3");

const User = require("./models/user");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

const resolvers = {
  Query: {
    getUser: (_, __, ctx) => {
      return ctx.isAuthenticated() ? ctx.user : null;
    },
  },
  Mutation: {
    addUserImages: (_, { urls }, ctx) => {
      if (ctx.isAuthenticated()) {
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
      } else {
        return null;
      }
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
        };

        const signedUrl = await s3.getSignedUrl("putObject", params);
        const url = `https://${bucketName}.s3.amazonaws.com/${key}`;

        res.push({
          signedUrl,
          url,
        });
      }

      console.log(res);
      return res;
    },
    logIn: (_, args, ctx) => {
      passport.authenticate("local", (err, user, info) => {
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
              "There is already a Rümer account associated with this email",
            success: false,
            user: null,
            value: "email",
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
                error: "User not created",
                success: false,
                user: null,
                value: "password",
              };
            });
        }
      });
    },
  },
};

module.exports = { resolvers };
