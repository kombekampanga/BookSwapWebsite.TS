import React from "react";


const BookList = (props) => {
    const {bookList, userId } = props;

    return (
        <div className={"book-list"}>
            {bookList.map((book) => {
                return (
                    <div className="card">
                        <h1>{book.title}</h1>
                        {book.image === "" ? (
                            <img
                                src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637478934/missing-picture-page-for-website_dmujoj.jpg"
                                alt="No Image"
                            />
                        ) : (
                            <img
                                src={book.image} alt="Listing Image"
                                style={{ maxWidth: "100%", maxHeight: "200px" }} // Adjust the maxHeight as needed
                            />

                        )}
                        <h4>By {book.author}</h4>
                        {book.genres !== null && (
                            <h5> {book.genres.replaceAll(",", ", ")}</h5>
                        )}
                        <p>Listed by {book.userEmail}</p>
                        <h4>Description:</h4>
                        {book.description === null ? (
                            <p>No description</p>
                        ) : (
                            <p>{book.description}</p>
                        )}

                        {!!book.swap && <h4>Available for swap</h4>}
                        {!!book.giveAway && <h4>Available for free (no swap)</h4>}
                        {book.userId !== userId && (
                            <button
                                id="requestThisBook"
                                onClick={() => {
                                    window.open(
                                        "http://localhost:4040/request-a-book?bookId=" + book.id,
                                        "_self"
                                    );
                                }}
                            >
                                Request This Book
                            </button>
                        )}
                    </div>
                );
            })}

        </div>
    )
}

export default BookList;