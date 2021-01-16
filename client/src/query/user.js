import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query {
    users: getAllUsers {
      id
      age
      username
    }
  }
`
export const GET_USER = gql`
  query getUser($id:ID!) {
    user: getUser(id:$id) {
      id
      age
      username
    }
  }
`