import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import Modal from "react-modal";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import {BookDto} from "../models/BookDto";
import {GenreDto} from "../models/GenreDto";
import {AddListingRequestDto} from "../models/AddListingRequestDto";

const ListABook = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const email = user?.email ?? ""
  const userId = user?.sub?.split("|")[1] ?? ""

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  //const [bookGenre, setBookGenre] = useState("");
  const [bookList, setBookList] = useState<BookDto[]>([]);
  const [bookDescription, setBookDescription] = useState("");
  const [genreList, setGenreList] = useState<GenreDto[]>([]);
  const [imageSelected, setImageSelected] = useState<File | null>(null)
  const [newListingImageUrl, setNewListingImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [availableForSwap, setAvailableForSwap] = useState(false);
  const [availableToGiveAway, setAvailableToGiveAway] = useState(false);
  const [bookGenres, setBookGenres] = useState<string[]>([]);

  const getMyListings = async () => {
    const token = await getAccessTokenSilently();

    Axios.get<BookDto[]>(serverUrl + "/api/listings/my-listings/get", {
      params: { userId: userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .then((response) => {
          setBookList(response.data);
        })
        .catch((err) => {
          console.log(err.response);
          alert(err.response.data);
        });
  };

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

    useEffect(() => {
      getMyListings();
      getGenres();
    }, [serverUrl, userId]);

    const addListing = async () => {
      const token = await getAccessTokenSilently();
      console.log(imageSelected?.name);
      if (imageSelected === null) {
        setSubmitting(false);
        alert("Please upload a photo");
        return;
      }
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "ju4duels");

      // Upload the image to cloudinary
      Axios.post(
          "https://api.cloudinary.com/v1_1/dmxlueraz/image/upload",
          formData
      )
          .then((response) => {
            console.log(response.data.url);
            setNewListingImageUrl(response.data.url);

            //format genres list into ("<genre 1>,<genre 2>,<genre 3>,...")
            let genreString = "";
            bookGenres.map((genre) => {
              genreString += genre + ",";
            });
            // remove trailing commas
            genreString = genreString.replace(/(^,)|(,$)/g, "");
            console.log(genreString);
            console.log([genreString]);
            console.log(new Set([genreString]));

            const addListingsRequest: AddListingRequestDto = {
                imageUrl: response.data.url,
                userId: userId,
                userEmail: email,
                bookTitle: bookTitle,
                bookAuthor: bookAuthor,
                bookGenres: genreString,
                bookDescription: bookDescription,
                availableForSwap: availableForSwap,
                availableToGiveAway: availableToGiveAway,
            }

            // Add to database
            Axios.post(
                serverUrl + "/api/listings/my-listings/insert",
               {
                   addListingRequest: addListingsRequest
               },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
            ).then(() => {
              setSubmitting(false);
              alert("Listing Added");
              window.location.reload();
              // Array.from(document.querySelectorAll("input")).forEach(
              //   (input) => (input.value = "")
              //);
            });
          })
          .catch((err) => {
            setSubmitting(false);
            console.log(err.response);
            alert(err.response.data);
          });
    };

    const addSelectedGenres = () => {
        const genres = Array.from(
            document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        )
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        setBookGenres(genres);
    };

    const myFunction = () => {
        document.getElementById("myDropdown")?.classList.toggle("show");
    }

    const filterFunction = () => {
        const input = document.getElementById("myInput") as HTMLInputElement;
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

    return (
      <div className="listabook">
        <h1>List a Book</h1>
        <div className="form">
          <label>Title:</label>
          <input
            type="text"
            name="Title"
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <label>Author:</label>
          <input
            type="text"
            name="Author"
            onChange={(e) => setBookAuthor(e.target.value)}
          />

          <label>Genres:</label>
          <ul style={{ textAlign: "left" }}>
            {bookGenres.map((genre) => {
              return (
                <span>
                  <li>{genre}</li>
                </span>
              );

            })}
            </ul>
            <div className="dropdown">
              <button
                onClick={(e) => {
                  myFunction();
                }}
                className="dropbtn"
              >
                Search genres
              </button>
              <div id="myDropdown" className="dropdown-content">
                <input
                  type="text"
                  placeholder="Search.."
                  id="myInput"
                  onKeyUp={(e) => {
                    filterFunction();
                  }}
                />
                {genreList.map((genres) => {
                  return (
                    <span>
                      <input
                        style={{ width: "20px", height: "20px" }}
                        type="checkbox"
                        id={genres.genre}
                        name={genres.genre}
                        value={genres.genre}
                        onClick={(e) => {
                          addSelectedGenres();
                        }}
                      />
                      <label htmlFor={genres.genre}>{genres.genre}</label>
                      <br></br>
                    </span>
                  );
                })}
              </div>
            </div>
            <br />
            <br />

                {/* <input
              type="text"
              name="Genre"
              onChange={(e) => setBookGenre(e.target.value)}
            /> */}

            <label>Description:</label>
            <textarea
                className="description"
                name="Description"
                maxLength={1500}
                onChange={(e) => setBookDescription(e.target.value)}
            />

            <label>Upload an Image:</label>

            <input
                type="file"
                name="Picture"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length !== 0) {
                        setImageSelected(e.target.files[0]);
                        const imageElement = document.getElementById("newListingImage") as HTMLImageElement;
                        if (imageElement) {
                            imageElement.src = window.URL.createObjectURL(e.target.files[0]);
                        }
                    }
                }}
            />
            <img
                id="newListingImage"
                src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637477634/missing-picture-page-for-website_dmujoj.jpg"
                alt="Listing Image"
            />
            <br />

            <label>Swap/ Give away settings:</label>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={availableForSwap}
                  onChange={() => {
                    setAvailableForSwap(!availableForSwap);
                  }}
                  name="availableForSwap"
                />
              }
              label="Available for swap"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        color="primary"
                        checked={availableToGiveAway}
                        onChange={() => {
                            setAvailableToGiveAway(!availableToGiveAway);
                        }}
                        name="availableForSwap"
                    />
                }
                label="Available to give away"
            />
            <br />

            <button
                onClick={() => {
                    setSubmitting(true);
                    addListing();
                }}
            >
                Submit
            </button>

            {/* Submitting Modal */}

            {submitting && (
              <div className="modalBackground">
                <Modal
                  isOpen={submitting}
                    contentLabel="My dialog"
                    className="mymodal"
                    overlayClassName="myoverlay"
                >
                  <h1>Submitting Listing...</h1>
                </Modal>
              </div>
          )}

          <br />
          <br />
          <br />

          <h1>My Listings</h1>
          <br />
          {bookList.map((book) => {
            return (
              <div className="card">
                <h1>{book.title}</h1>
                {book.image === "" ? (
                <img
                  src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637477634/missing-picture-page-for-website_dmujoj.jpg"
                  alt="Listing Image"
                />
                ) : (
                  <img src={book.image} alt="Listing Image" />
                )}
                <h4>By {book.author}</h4>
                <p>{book.genres}</p>
              </div>
            );
          })}
        </div>
      </div>
    )
};

export {ListABook};
