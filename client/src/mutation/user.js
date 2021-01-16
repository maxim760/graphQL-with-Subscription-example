import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($input: UserInput) {
    user: createUser(input: $input) {
      id
      age
      username
    }
  }
  `
export const UPDATE_USER_USERNAME = gql`
  mutation updateUser($user: UsernameInput) {
    user: updateUserUsername(user: $user) {
      id
      age
      username
    }
  }
`
export const DELETE_USER = gql`
  mutation removeUser($id: ID!) {
    user: deleteUser(id: $id) {
      id
      age
      username
    }
  }
`