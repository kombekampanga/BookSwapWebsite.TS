import React, { useState, useEffect } from "react";
import Axios from "axios";
import {ListingsDto} from "../models/ListingsDto";
import { useAuth0 } from "@auth0/auth0-react";


const Listings = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [bookList, setBookList] = useState<ListingsDto>([]);
  const { getAccessTokenSilently } = useAuth0();


  useEffect( () => {
      getAccessTokenSilently()
        .then((token: string) => {
          return Axios.get<ListingsDto>(serverUrl + '/api/listings/get', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
          .then(response => {
            console.log('Response:', response.data);
            setBookList(response.data);
          })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [serverUrl, getAccessTokenSilently]);

  return (
    <div>
      {/* {JSON.stringify(user, null, 2)} */}
      {bookList.map((book) => {
        return (
          <div className="card">
            <h1>{book.title}</h1>
            <h4>By {book.author}</h4>
            <h5>{book.genres}</h5>
            <p>Listed by {book.userEmail}</p>
          </div>
        );
      })}
    </div>
  );
};

export {Listings};
