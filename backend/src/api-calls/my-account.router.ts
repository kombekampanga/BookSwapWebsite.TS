import express, {Request, Response} from "express";
import { checkJwt } from "../authz/check-jwt.js";
import {AccountController} from "../controllers/account.controller.js";

const accountRouter = express.Router();
const accountController = new AccountController();

// Get my notifications
accountRouter.get("/notifications/swap-confirmed/get", checkJwt, accountController.GetSwapConfirmedNotifications);

accountRouter.get("/notifications/swap-requested/get", checkJwt, accountController.GetSwapRequestedNotifications)

// send swap requested notification
accountRouter.post("/notifications/swap-requested/insert", checkJwt, accountController.SendSwapRequestedNotification)

// send swap confirmed notification
accountRouter.post("/notifications/swap-confirmed/insert", checkJwt, accountController.SendSwapConfirmedNotification)

// delete swap requested notification
accountRouter.delete("/notifications/swap-requested/delete", checkJwt, accountController.DeleteSwapRequestedNotification)

// delete swap confirmed notification
accountRouter.delete("/notifications/swap-confirmed/delete", checkJwt, accountController.DeleteSwapConfirmedNotification)

// Get books i've requested
accountRouter.get("/my-requests/get", checkJwt, accountController.GetRequestedBooks)

// Post a request
accountRouter.post("/my-requests/insert", checkJwt, accountController.RequestBook);

// Update a request when accepted
accountRouter.put("/my-requests/update/accepted", checkJwt, accountController.UpdateRequest)

// Update a request when declined
accountRouter.put("/my-requests/update/declined", checkJwt, accountController.UpdateRequest)

// Get books others have requested from me
accountRouter.get("/others-requests/get", checkJwt, accountController.GetBooksRequested)

// Get closed listings
accountRouter.get("/closed-listings/get", checkJwt, accountController.GetClosedListings)

// Get books i've won
//TODO: FIX Query
accountRouter.get("/won/get", checkJwt, accountController.GetBooksWon)

// Get books i've lost
//TODO: FIX Query
accountRouter.get("/lost/get", checkJwt, accountController.GetBooksLost)

// Get specific request info for books requested from me
accountRouter.get("/others-requests/get/:requestId", checkJwt, accountController.GetRequestDetails)