import { gql } from '@apollo/client';

export const GET_PLUSES = gql`
  query {
    getPluses {
      pluses
    }
  }
`