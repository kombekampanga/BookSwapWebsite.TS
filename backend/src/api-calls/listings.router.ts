import express, {Request, Response} from "express";
import { checkJwt } from "../authz/check-jwt.js";
import {ListingsController} from "../controllers/listings.controller.js";

const listingsRouter = express.Router();
const listingsController = new ListingsController();
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.SQL_PASS,
  database: "bookswap",
});

import  mysql from "mysql2";
import { BookDto } from "../models/BookDto.js";

// Get all Listings
listingsRouter.get("/get", checkJwt, listingsController.GetAllListings)

// Get all of particular user's listings
listingsRouter.get("/get/userId=:userId", listingsController.GetUserListings);

// Get listings filtered by genre
listingsRouter.get("/filtered/get", listingsController.GetFilteredGenreListings);

// Get my listings
listingsRouter.get("/my-listings/get", checkJwt, listingsController.GetMyListings);

// Add a listing
listingsRouter.post("/my-listings/insert", checkJwt, listingsController.AddListing);

// Delete a listing to my listings
listingsRouter.delete("/my-listings/delete/", checkJwt, listingsController.DeleteListing);

// Update my listing
listingsRouter.put("/my-listings/update/", checkJwt, listingsController.UpdateListing);

// Get a specific book Listing
listingsRouter.get("/get/bookId=:bookId", listingsController.GetBook);

// Get genres for genre filtering
listingsRouter.get("/genres/get", checkJwt, listingsController.GetGenres)

// update a listing when request is approved (make inactive)
listingsRouter.put("/my-listings/update/request-approved", checkJwt,listingsController.UpdateListingFromApprovedRequest)

// update when a request is made (increment no of requests and set requested as true)
listingsRouter.put("/my-listings/update/request-sent", checkJwt, listingsController.UpdateListingWhenRequested)

// update a listing when request is declined (decrement no of requests and set requested as false if numberOfRequests = 0)
//TODO
listingsRouter.put("/my-listings/update/request-declined", checkJwt, listingsController.UpdateListingFromDeclinedRequest)
export {
  listingsRouter,
};
