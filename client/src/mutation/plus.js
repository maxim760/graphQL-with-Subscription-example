import { gql } from "@apollo/client";

export const ADD_PLUS = gql`
  mutation add {
    addPlus {
      pluses
    }
  }
`;
