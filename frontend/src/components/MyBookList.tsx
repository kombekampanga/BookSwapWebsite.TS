import React from "react";
import {BookDto} from "../models/BookDto";


const MyBookList = (props) => {
    const {bookList } = props;

    return (
        <div className="my-book-list">
            {bookList.map((book: BookDto) => {
                return (
                    <div className="card">
                        <h1>{book.title}</h1>
                        {book.image === "" ? (
                            <img
                                src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637477634/missing-picture-page-for-website_dmujoj.jpg"
                                alt="Listing Image"
                                style={{ maxWidth: "100%", maxHeight: "300px" }} // Adjust the maxHeight as needed
                            />
                        ) : (
                            <img
                                src={book.image} alt="Listing Image"
                                style={{ maxWidth: "100%", maxHeight: "300px" }} // Adjust the maxHeight as needed
                            />

                        )}
                        <h4>By {book.author}</h4>
                        <p>{book.genres}</p>
                    </div>
                );
            })}

        </div>
    )
}

export default MyBookList;