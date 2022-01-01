const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    birthday: String!
    gender: String!
    year: Int
    major: String
    bio: String
    images: [String!]!
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

  type Query {
    getUser: User
  }

  type Mutation {
    addUserImages(urls: [String!]!): User
    getSignedUrls(files: [File!]!): [SignedUrl!]!
    logIn(email: String!, password: String!): UserResponse
    logOut: Boolean
    signUp(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      birthday: String!
      gender: String!
      year: Int
      major: String
      bio: String
    ): UserResponse!
  }
`;

module.exports = { typeDefs };
