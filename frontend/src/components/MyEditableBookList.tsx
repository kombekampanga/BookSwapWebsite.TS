import React from "react";
import {BookDto} from "../models/BookDto";


const MyEditableBookList = (props) => {
    const {bookList, editEventHandler, deleteListing } = props;

    return (
        <div className="my-book-list">
            {bookList.map((book: BookDto) => {
                return (
                    <div className="card">
                        <h1>{book.title}</h1>
                        <h4>By {book.author}</h4>
                        <p>{book.genres}</p>
                        {book.image === "" ? (
                            <img
                                src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637478934/missing-picture-page-for-website_dmujoj.jpg"
                                alt="No Image"
                            />
                        ) : (
                            <img
                                src={book.image} alt="Listing Image"
                                style={{ maxWidth: "100%", maxHeight: "300px" }} // Adjust the maxHeight as needed
                            />

                        )}

                        <div id="editListing">
                            <button
                                onClick={() => {
                                    editEventHandler(book);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    const deleteConfirmed = window.confirm(
                                        "Are you sure you want to delete this listing for " +
                                        book.title +
                                        "?"
                                    );
                                    if (deleteConfirmed) {
                                        console.log("Confirmed deletion");
                                        deleteListing(book.id);
                                    } else {
                                        console.log("pressed cancel");
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default MyEditableBookList;