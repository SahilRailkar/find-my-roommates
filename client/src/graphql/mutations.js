import { gql } from "@apollo/client";

export const ADD_USER_IMAGES = gql`
  mutation addUserIamges($urls: [String!]!) {
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
