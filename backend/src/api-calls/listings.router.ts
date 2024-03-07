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

// Get my listings
listingsRouter.get("/my-listings/get", checkJwt, listingsController.GetMyListings);

// Add a listing
listingsRouter.post("/my-listings/insert", checkJwt, listingsController.AddListing);

// Delete a listing to my listings
listingsRouter.delete("/my-listings/delete/", checkJwt, listingsController.DeleteListing);

// Update my listing
listingsRouter.put("/my-listings/update/", checkJwt, listingsController.UpdateListing);

export {
  listingsRouter,
};
