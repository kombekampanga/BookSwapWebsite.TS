import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import {NotificationDto} from "../models/NotificationDto";
import {RequestDto} from "../models/RequestDto";
import {BooksRequestedByUserDto} from "../models/BooksRequestedByUserDto";
import {BooksRequestedFromUserDto} from "../models/BooksRequestedFromUserDto";

const MyAccount = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const userId = user?.sub?.split("|")[1] ?? ""

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [swapConfirmedNotificationsList, setSwapConfirmedNotificationsList] =
        useState<NotificationDto[]>([]);
    const [swapRequestedNotificationsList, setSwapRequestedNotificationsList] =
        useState<NotificationDto[]>([]);
    const [booksIRequestedList, setBooksIRequestedList] = useState<BooksRequestedByUserDto[]>([]);
    const [booksOthersRequestedList, setBooksOthersRequestedList] = useState<BooksRequestedFromUserDto[]>([]);
    
    const [closedListings, setClosedListings] = useState([]);
    const [wonBooks, setWonBooks] = useState([]);
    const [lostBooks, setLostBooks] = useState([]);

    //console.log(user);

    const getMyAccountDetails = async () => {
        const token = await getAccessTokenSilently();

        // Populate notifications
        Axios.get<NotificationDto[]>(serverUrl + "/api/my-account/notifications/swap-confirmed/get", {
            params: { userId: userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                setSwapConfirmedNotificationsList(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });

        Axios.get<NotificationDto[]>(serverUrl + "/api/my-account/notifications/swap-requested/get", {
            params: { userId: userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                setSwapRequestedNotificationsList(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });

        // Populate books I've requested
        Axios.get<BooksRequestedByUserDto[]>(serverUrl + "/api/my-account/my-requests/get", {
            params: { userId: userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                setBooksIRequestedList(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });

        // Populate books others have requested from me
        Axios.get<BooksRequestedFromUserDto[]>(serverUrl + "/api/my-account/others-requests/get", {
            params: { userId: userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                setBooksOthersRequestedList(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });
        
        //TODO: populate closed, won and lost listings
    };

    const removeRequestNotification = async (notificationId: string) => {
        const token = await getAccessTokenSilently();
        Axios.delete(
            serverUrl + "/api/my-account/notifications/swap-requested/delete",
            {
                data: { userId: userId, notificationId: notificationId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(() => {
                console.log("notification removed");
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });
    };

    const removeConfirmNotification = async (notificationId: string) => {
        console.log("clicked");
        const token = await getAccessTokenSilently();
        Axios.delete(
            serverUrl + "/api/my-account/notifications/swap-confirmed/delete",
            {
                data: { userId: userId, notificationId: notificationId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(() => {
                console.log("notification removed");
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data);
            });
    };

    useEffect(() => {
        getMyAccountDetails();
    }, []);

    return (
        <div className="myAccount">
            <h1>{user?.email}</h1>
            <br />
            {/* {JSON.stringify(user, null, 2)} */}
            <h2>Notifications</h2>
            {swapRequestedNotificationsList.length === 0 &&
            swapConfirmedNotificationsList.length === 0 ? (
                <div className="noNotifications">
                    <div className="card">
                        <p>You have no notifications</p>
                    </div>
                </div>
            ) : (
                <div className="notifications">
                    {swapRequestedNotificationsList.map((notification) => {
                        return (
                            <div className="card">
                                <div className="notificationXBtn">
                                    <button
                                        onClick={() => {
                                            removeRequestNotification(notification.id);
                                            window.location.reload();
                                        }}
                                    >
                                        X
                                    </button>
                                </div>

                                <h4>Swap Requested Notifications</h4>
                                <p>{notification.message}</p>
                            </div>
                        );
                    })}
                    {swapConfirmedNotificationsList.map((val) => {
                        return (
                            <div className="card">
                                <div className="notificationXBtn">
                                    <button
                                        onClick={() => {
                                            removeConfirmNotification(val.id);
                                            window.location.reload();
                                        }}
                                    >
                                        X
                                    </button>
                                </div>

                                <h4>Swap Confirmed Notifications</h4>
                                <p>{val.message}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            <br />
            <h2>Books I've Requested</h2>
            {booksIRequestedList.length === 0 ? (
                <div className="booksIRequested">
                    <div className="card">
                        <p>You haven't requested any books</p>
                    </div>
                </div>
            ) : (
                <div className="booksIRequested">
                    {booksIRequestedList.map((bookRequest) => {
                        return (
                            <div className="card">
                                <h2>{bookRequest.title}</h2>
                                {bookRequest.image === "" ? (
                                    <img
                                        src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637478934/missing-picture-page-for-website_dmujoj.jpg"
                                        alt="No Image"
                                    />
                                ) : (
                                    <img src={bookRequest.image} alt="Listing Image" />
                                )}
                                <h4>By {bookRequest.author}</h4>
                                <h5>{bookRequest.genres}</h5>
                                <p>Listed by {bookRequest.listerEmail}</p>
                                <p>Requested on: {bookRequest.createdOn}</p>
                                <br />
                                {!!bookRequest.swap && <h5>You are offering a swap </h5>}
                                {!bookRequest.swap && (
                                    <h5>You are requesting this for free (no swap) </h5>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            <br />
            <h2>Books Others Are Requesting From Me</h2>
            {booksOthersRequestedList.length === 0 ? (
                <div className="booksOthersRequested">
                    <div className="card">
                        <p>No one has requested your books yet :( Maybe list some more?</p>
                    </div>
                </div>
            ) : (
                <div className="booksOthersRequested">
                    {booksOthersRequestedList.map((bookRequest) => {
                        return (
                            <div className="card">
                                <h2>{bookRequest.title}</h2>
                                {bookRequest.image === "" ? (
                                    <img
                                        src="https://res.cloudinary.com/dmxlueraz/image/upload/v1637478934/missing-picture-page-for-website_dmujoj.jpg"
                                        alt="No Image"
                                    />
                                ) : (
                                    <img src={bookRequest.image} alt="Listing Image" />
                                )}
                                <h4>By {bookRequest.author}</h4>
                                <h5>{bookRequest.genres}</h5>
                                <h6>Requested by {bookRequest.requestedBy}</h6>
                                <p>Requested on: {bookRequest.createdOn}</p>
                                <br />
                                {!!bookRequest.swap === true && (
                                    <h5>{bookRequest.requestedBy} is requesting a swap</h5>
                                )}
                                {!!bookRequest.swap === false && (
                                    <h5>
                                        {bookRequest.requestedBy} is requesting this book for free (no swap)
                                    </h5>
                                )}
                                <button
                                    onClick={() => {
                                        window.open(
                                            "http://localhost:4040/respond-to-request?bookId=" +
                                            bookRequest.bookId +
                                            "?reqId=" +
                                            bookRequest.requestId,
                                            "_self"
                                        );
                                    }}
                                >
                                    Respond to Request
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyAccount;
