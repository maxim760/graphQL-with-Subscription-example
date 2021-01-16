import { gql } from "@apollo/client";

export const PLUSES = gql`
  subscription pluses {
    pluses {
      pluses
    }
  }
`;
