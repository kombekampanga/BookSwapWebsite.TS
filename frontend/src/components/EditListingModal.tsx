import React from "react";
import Modal from "react-modal";


const EditListingModal = (props) => {
    const {editIsOpen, selectedBook, deleteListing} = props;

    return(
        <div className='edit-listing-modal'>
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
                        <label>Title:</label>
                        <input
                            type="text"
                            name="Title"
                            defaultValue={selectedBook?.title}
                            onChange={(e) => {
                                setUpdatedBookTitle(e.target.value);
                            }}
                        />
                        <label>Author:</label>
                        <input
                            type="text"
                            name="Author"
                            defaultValue={selectedBook?.author}
                            onChange={(e) => {
                                setUpdatedBookAuthor(e.target.value);
                            }}
                        />
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

        </div>
    )
}

export default EditListingModal