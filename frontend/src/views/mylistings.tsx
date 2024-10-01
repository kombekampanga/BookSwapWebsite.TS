import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import Modal from "react-modal";
import "./editListingModal.css";
import {ListingsDto} from "../models/ListingsDto";
import {BookDto} from "../models/BookDto";
import {GenreDto} from "../models/GenreDto";
import {UpdateListingRequestDto} from "../models/UpdateListingRequestDto";
import MyEditableBookList from "../components/MyEditableBookList";


Modal.setAppElement("#root");

const MyListings = () => {
  const { user, getAccessTokenSilently } = useAuth0();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const userId = user?.sub?.split("|")[1] ?? ""

    const [bookList, setBookList] = useState<ListingsDto>([]);
    const [editIsOpen, setEditIsOpen] = useState(false);


    const [updatedBookTitle, setUpdatedBookTitle] = useState("");
    const [updatedBookAuthor, setUpdatedBookAuthor] = useState("");
    const [updatedBookGenres, setUpdatedBookGenres] = useState<string[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookDto>();
    const [updatedBookDescription, setUpdatedBookDescription] = useState("");
    const [updatedBookImageUrl, setUpdatedBookImageUrl] = useState("");
    const [imageHasChanged, setImageHasChanged] = useState(false);
    const [uploadedBookImage, setUploadedBookImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [updatedAvailableForSwap, setUpdatedAvailableForSwap] = useState<boolean>(false);
    const [updatedAvailableToGiveAway, setUpdatedAvailableToGiveAway] =
        useState<boolean>(false);
    const [genreList, setGenreList] = useState<GenreDto[]>([]);

    const getMyListings = async () => {
        const token = await getAccessTokenSilently();

        Axios.get<ListingsDto>(serverUrl + "/api/listings/my-listings/get", {
            params: { userId: userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Response:', response.data);
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

    const deleteListing = async (bookId: string) => {
      const token = await getAccessTokenSilently();
      console.log(bookId);
      Axios.delete(serverUrl + "/api/listings/my-listings/delete/", {
        data: { userId: userId, bookId: bookId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          setEditIsOpen(false);
          setSelectedBook(undefined);
          alert("Listing Deleted");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response);
          alert(err.response.data);
        });
    };

    const editEventHandler = (book: BookDto) => {
        setSelectedBook(book);
        setEditIsOpen(true);
        setUpdatedBookTitle(book.title);
        setUpdatedBookAuthor(book.author);
        if (book.genres !== null) {
            setUpdatedBookGenres(book.genres.split(","));
        }
        setUpdatedBookDescription(book.description);
        setUpdatedBookImageUrl(book.image);
        setImageHasChanged(false);
        // !! to turn integer into boolean
        setUpdatedAvailableForSwap(!!book.swap);
        setUpdatedAvailableToGiveAway(!!book.giveAway);
    };

    const finishEditEventHandler = () => {
        setSelectedBook(undefined);
        setEditIsOpen(false);
        setUpdatedBookTitle("");
        setUpdatedBookAuthor("");
        setUpdatedBookGenres([]);
        setUpdatedBookDescription("");
        setUpdatedBookImageUrl("");
        setImageHasChanged(false);
        setImageHasChanged(false);
        setUpdatedAvailableForSwap(false);
        setUpdatedAvailableToGiveAway(false);
    };

    const updateListing = async (bookId: string) => {
        const token = await getAccessTokenSilently();

        // Add to database
        const addListingToDatabase = (imageUrl: string) => {
            Axios.put(
                serverUrl + "/api/listings/my-listings/update",
                {
                    userId: userId,
                    bookId: bookId,
                    bookTitle: updatedBookTitle,
                    bookAuthor: updatedBookAuthor,
                    bookGenres: updatedBookGenres.toString(),
                    bookDescription: updatedBookDescription,
                    bookImageUrl: imageUrl,
                    availableForSwap: updatedAvailableForSwap,
                    availableToGiveAway: updatedAvailableToGiveAway,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
                .then((response) => {
                    setSaving(false);
                    alert(updatedBookTitle + " listing updated");
                    console.log(response);
                    finishEditEventHandler();
                    window.location.reload();
                })
                .catch((err) => {
                    setSaving(false);
                    console.log(err.response);
                    alert(err.response.statusText);
                });
        };

        // If new image has been added, upload the image to cloudinary
        if (imageHasChanged && uploadedBookImage !== null) {
            const formData = new FormData();
            formData.append("file", uploadedBookImage);
            formData.append("upload_preset", "ju4duels");

            Axios.post(
                "https://api.cloudinary.com/v1_1/dmxlueraz/image/upload",
                formData
            )
                .then((response) => {
                    console.log(response.data.url);
                    setUpdatedBookImageUrl(response.data.url);
                    addListingToDatabase(response.data.url);
                })
                .catch((err) => {
                    setSaving(false);
                    console.log(err.response);
                    alert(err.response.data);
                });
        } else {
            addListingToDatabase(updatedBookImageUrl);
            setSaving(false);
            alert(updatedBookTitle + " listing updated");
            finishEditEventHandler();
            window.location.reload();
        }
    };

    return (
      <div className="myListings">
          <MyEditableBookList bookList={bookList} finishEditEventHandler={finishEditEventHandler} editEventHandler={editEventHandler} deleteListing={deleteListing}/>
          {editIsOpen && (
          <div className="modalBackground">
              <Modal
                  isOpen={editIsOpen}
                  contentLabel="My dialog"
                  className="mymodal"
                  overlayClassName="myoverlay"
              >
                  <div className="xModalBtn">
                      <button
                          onClick={() => {
                              setEditIsOpen(false);
                              setSelectedBook(undefined);
                          }}
                      >
                          X
                      </button>
                  </div>

                  <div className="modalTitle">
                      <h1>Edit Your Listing</h1>
                  </div>
                  <div className="modalBody">
                      <div>
                          <label>Title:</label>
                          <input
                              type="text"
                              name="Title"
                              defaultValue={selectedBook?.title}
                              onChange={(e) => {
                                  setUpdatedBookTitle(e.target.value);
                              }}
                          />
                      </div>
                      <div>
                          <label>Author:</label>
                          <input
                              type="text"
                              name="Author"
                              defaultValue={selectedBook?.author}
                              onChange={(e) => {
                                  setUpdatedBookAuthor(e.target.value);
                              }}
                          />
                      </div>
                      <div>
                          <label>Genre:</label>
                          <input
                              type="text"
                              name="Genre"
                              defaultValue={selectedBook?.genres}
                              onChange={(e) => {
                                  setUpdatedBookGenres([e.target.value]);
                              }}
                          />
                      </div>
                      <div>
                          <label>Upload new image:</label>

                          <input
                              type="file"
                              name="Picture"
                              onChange={(e) => {
                                  if (e.target.files && e.target.files.length !== 0) {
                                      setUploadedBookImage(e.target.files[0]);
                                      const imageElement = document.getElementById("updateListingImage") as HTMLImageElement;
                                      if (imageElement) {
                                          imageElement.src = window.URL.createObjectURL(e.target.files[0]);
                                      }
                                  }
                              }}
                          />
                          <img
                              id="updateListingImage"
                              src={selectedBook?.image !== "" ? updatedBookImageUrl : "https://res.cloudinary.com/dmxlueraz/image/upload/v1637477634/missing-picture-page-for-website_dmujoj.jpg"}
                              alt="Listing Image"
                              style={{maxWidth: "100%", maxHeight: "300px"}} // Adjust the maxHeight as needed
                          />
                      </div>
                  </div>
                  <div className="modalFooter">
                      <button
                          onClick={() => {
                              setEditIsOpen(false);
                              setSelectedBook(undefined);
                          }}
                      >
                          Cancel
                      </button>
                      <button
                          onClick={() => {
                              if (selectedBook == undefined) {
                                  finishEditEventHandler()
                              } else {
                                  updateListing(selectedBook?.id);
                              }
                          }}
                      >
                          Save
                      </button>
                      <button
                          id="deleteBtn"
                          onClick={() => {
                              const deleteConfirmed = window.confirm(
                                  "Are you sure you want to delete this listing for " +
                                  selectedBook?.title +
                                  "?"
                              );
                              if (deleteConfirmed && selectedBook?.id !== undefined) {
                                  console.log("Confirmed deletion");
                                  deleteListing(selectedBook?.id);
                              } else {
                                  console.log("pressed cancel");
                              }
                          }}
                      >
                          Delete Listing
                      </button>
                  </div>
              </Modal>
          </div>
          )}
      </div>
    );
};

export {MyListings};
