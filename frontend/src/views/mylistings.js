import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import Modal from "react-modal";
import "./editListingModal.css";

Modal.setAppElement("#root");

const MyListings = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const userId = user.sub.split("|")[1];

  const { name, picture, email } = user;

  const [bookList, setBookList] = useState([]);
  const [editIsOpen, setEditIsOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState({});

  const [updatedBookTitle, setUpdatedBookTitle] = useState("");
  const [updatedBookAuthor, setUpdatedBookAuthor] = useState("");
  const [updatedBookGenre, setUpdatedBookGenre] = useState("");
  const [updatedBookImageUrl, setUpdatedBookImageUrl] = useState("");
  const [imageHasChanged, setImageHasChanged] = useState(false);
  const [uploadedBookImage, setUploadedBookImage] = useState({});

  const getMyListings = async () => {
    const token = await getAccessTokenSilently();

    Axios.get(serverUrl + "/api/listings/my-listings/get", {
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

  useEffect(() => {
    getMyListings();
  }, []);

  const deleteListing = async (bookId) => {
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
        setSelectedBook({});
        alert("Listing Deleted");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response.data);
      });
  };

  const editEventHandler = (val) => {
    setSelectedBook(val);
    setEditIsOpen(true);
    setUpdatedBookTitle(val.title);
    setUpdatedBookAuthor(val.author);
    setUpdatedBookGenre(val.genre);
    setUpdatedBookImageUrl(val.image);
    setImageHasChanged(false);
  };

  const finishEditEventHandler = () => {
    setSelectedBook({});
    setEditIsOpen(false);
    setUpdatedBookTitle("");
    setUpdatedBookAuthor("");
    setUpdatedBookGenre("");
    setUpdatedBookImageUrl("");
    setImageHasChanged(false);
  };

  const updateListing = async (bookId) => {
    const token = await getAccessTokenSilently();
    const formData = new FormData();
    formData.append("file", uploadedBookImage);
    formData.append("upload_preset", "ju4duels");

    // Upload the image to cloudinary
    if (imageHasChanged) {
      Axios.post(
        "https://api.cloudinary.com/v1_1/dmxlueraz/image/upload",
        formData
      )
        .then((response) => {
          console.log(response.data.url);
          setUpdatedBookImageUrl(response.data.url);
        })
        .catch((err) => {
          console.log(err.response);
          alert(err.response.data);
          return;
        });
    }

    // Add to database

    Axios.put(
      serverUrl + "/api/listings/my-listings/update",
      {
        userId: userId,
        bookId: bookId,
        bookTitle: updatedBookTitle,
        bookAuthor: updatedBookAuthor,
        bookGenre: updatedBookGenre,
        bookImageUrl: updatedBookImageUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        alert(updatedBookTitle + " listing updated");
        finishEditEventHandler();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response.data);
      });
  };

  return (
    <div className="myListings">
      {bookList.map((val) => {
        return (
          <div className="card">
            <h1>{val.title}</h1>
            {val.image === "" ? (
              <img
                src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637477634/missing-picture-page-for-website_dmujoj.jpg"
                alt="Listing Image"
              />
            ) : (
              <img src={val.image} alt="Listing Image" />
            )}

            <h4>By {val.author}</h4>
            <p>{val.genre}</p>

            <div id="editListing">
              <button
                onClick={() => {
                  editEventHandler(val);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  const deleteConfirmed = window.confirm(
                    "Are you sure you want to delete this listing for " +
                      val.title +
                      "?"
                  );
                  if (deleteConfirmed) {
                    console.log("Confirmed deletion");
                    deleteListing(val.id);
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

      {/* Edit Listing Modal */}
      {editIsOpen && (
        <div className="modalBackground">
          <Modal
            isOpen={editIsOpen}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
          >
            <div className="xModalBtn">
              <button onClick={() => finishEditEventHandler()}>X</button>
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
                  defaultValue={selectedBook.title}
                  onChange={(e) => {
                    setUpdatedBookTitle(e.target.value);
                  }}
                />
              </div>
              <div>
                <label>Image:</label>
                {selectedBook.image === "" ? (
                  <img
                    id="editListingImage"
                    src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637477634/missing-picture-page-for-website_dmujoj.jpg"
                    alt="Listing Image"
                  />
                ) : (
                  <img
                    id="editListingImage"
                    src={selectedBook.image}
                    alt="Listing Image"
                  />
                )}
                <label>Upload New Image:</label>
                <input
                  accept="image/*"
                  type="file"
                  name="Picture"
                  onChange={(e) => {
                    document.getElementById("editListingImage").src =
                      window.URL.createObjectURL(e.target.files[0]);
                    setUploadedBookImage(e.target.files[0]);
                    setImageHasChanged(true);
                    console.log(e.target.files[0]);
                  }}
                />
              </div>
              <div>
                <label>Author:</label>
                <input
                  type="text"
                  name="Author"
                  defaultValue={selectedBook.author}
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
                  defaultValue={selectedBook.genre}
                  onChange={(e) => {
                    setUpdatedBookGenre(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="modalFooter">
              <button onClick={() => finishEditEventHandler()}>Cancel</button>
              <button
                onClick={() => {
                  updateListing(selectedBook.id);
                }}
              >
                Save
              </button>
              <button
                id="deleteBtn"
                onClick={() => {
                  const deleteConfirmed = window.confirm(
                    "Are you sure you want to delete this listing for " +
                      selectedBook.title +
                      "?"
                  );
                  if (deleteConfirmed) {
                    console.log("Confirmed deletion");
                    deleteListing(selectedBook.id);
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

export default MyListings;
