import React, { useState, useEffect } from "react";
import Axios from "axios";
import {ListingsDto} from "../models/ListingsDto";
import { useAuth0 } from "@auth0/auth0-react";
import {BookDto} from "../models/BookDto";
import {GenreDto} from "../models/GenreDto";
import qs from "qs";
import BookList from "../components/BookList";


const Listings = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const userId = user?.sub?.split("|")[1] ?? ""
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [bookList, setBookList] = useState<BookDto[]>([]);
    const [genreList, setGenreList] = useState<GenreDto[]>([]);
    const [filteredBookList, setFilteredBookList] = useState<BookDto[]>([]);
    const [allBooksList, setAllBooksList] = useState<BookDto[]>([]);

    const getGenres = async () => {
        const token = await getAccessTokenSilently();

        Axios.get<GenreDto[]>(serverUrl + "/api/listings/genres/get", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setGenreList(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });
    };

    useEffect( () => {
        Axios.get<ListingsDto>(serverUrl + '/api/listings/get')
            .then(response => {
                console.log('Response:', response.data);
                setBookList(response.data);
                setAllBooksList(response.data);
            })
            .catch(error => {
                console.error(error.response);
                alert(error.response.data);
            });
        getGenres();
    }, [serverUrl]);

    const filterFunction = () => {
        const input = document.getElementById("myInput")as HTMLInputElement;
        const filter = input?.value.toUpperCase();
        const div = document.getElementById("myDropdown");
        let a = div?.getElementsByTagName("span");
        if (a !== undefined){
            for (let i = 0; i < a.length; i++) {
                const txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    a[i].style.display = "";
                } else {
                    a[i].style.display = "none";
                }
            }
        }
    }

    const myFunction = () => {
        const dropdownElement = document.getElementById("myDropdown");

        if (dropdownElement) { // Check if dropdownElement is not null
            const currentDisplay = dropdownElement.style.display;

            if (currentDisplay === "none") {
                dropdownElement.style.display = "inline";
            } else {
                dropdownElement.style.display = "none";
            }
        }
    }

    const filterByGenres = () => {
        const genres = Array.from(
            document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        )
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        console.log(genres);
        if (genres.length > 0) {
            // find books with those genres
            Axios.get(serverUrl + "/api/listings/filtered/get", {
                params: {
                    genres: [genres],
                },
                paramsSerializer: (params) => {
                    return qs.stringify(params);
                },

                // then update the booklist
            })
                .then((response) => {
                    setFilteredBookList(response.data);
                    setBookList(response.data);
            });
        } else {
            setBookList(allBooksList);
        }
    };

    return (
        <div className="allListings">
            <span>
                <input
                    style={{
                        border: "3px solid #555",
                        borderRadius: "5px",
                        marginRight: "10px",
                        padding: "12px 20px",
                    }}
                    type="search"
                    placeholder="Search.."
                    id="searchForBook"
                    onKeyUp={(e) => {
                        console.log("hello");
                    }}
                />
                <div className="dropdown">
                    <button
                        onClick={(e) => {
                            myFunction();
                        }}
                        className="dropbtn"
                    >
                        Search by genre
                    </button>
                    <div
                        style={{
                            overflow: "scroll",
                            maxHeight: "500px",
                        }}
                        id="myDropdown"
                        className="dropdown-content"
                    >
                        <input
                            type="text"
                            placeholder="Search.."
                            id="myInput"
                            onKeyUp={(e) => {
                                filterFunction();
                            }}
                        />
                        {genreList.map((genre) => {
                            return (
                                <span>
                                    <input
                                        style={{ width: "20px", height: "20px" }}
                                        type="checkbox"
                                        id={genre.genre}
                                        name={genre.genre}
                                        value={genre.genre}
                                        onClick={(e) => {
                                            filterByGenres();
                                        }}
                                    />
                                    <label htmlFor={genre.genre}>{genre.genre}</label>
                                    <br></br>
                                </span>
                            );
                        })}
                    </div>
                </div>
            </span>
            <BookList bookList={bookList} userId={userId}/>
        </div>
    );
};

export {Listings};
