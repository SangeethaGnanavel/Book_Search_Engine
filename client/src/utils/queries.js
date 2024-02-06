import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      bookCount
      email
      username
      savedBooks {
        authors
        bookId
        description
        image
        title
      }
    }
  }
`;
