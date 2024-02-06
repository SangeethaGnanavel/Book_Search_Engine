import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const [removeBook, { err }] = useMutation(REMOVE_BOOK, {
    refetchQueries: [GET_ME, "me"],
  });

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  const { loading, error, data } = useQuery(GET_ME, {
    skip: !token, // Skip the query if there's no token
  });
  if (loading) {
    // Handle loading state if necessary
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    // Handle error state if necessary
    return <p>Error fetching user data</p>;
  }
  const userData = data?.me;
  console.log(userData);
  // create function that accepts the book's mongo _id value as param and deletes the book from the database

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({ variables: { bookId: bookId } });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>

        {userData.savedBooks.map((book) => {
          return (
            <Row key={book.bookId}>
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          );
        })}
      </Container>
    </>
  );
};

export default SavedBooks;
