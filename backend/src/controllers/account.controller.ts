import {AccountService} from "../services/account.service.js";
import {Request, Response} from "express";
import {ListingsService} from "../services/listings.service.js";

export class AccountController {
    private accountService: AccountService
    private listingsService: ListingsService

    constructor() {
        this.accountService = new AccountService();
        this.listingsService = new ListingsService();
    }

    GetSwapRequestedNotifications = (async (req, res: Response) => {
        const userId: string = req.query.userId;

        try {
            const notifications = await this.accountService.GetSwapRequestedNotifications(userId);
            console.log("swap requested notifications received");
            console.log(notifications);
            res.send(notifications)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetSwapConfirmedNotifications = (async (req, res: Response) => {
        const userId: string = req.query.userId;

        try {
            const notifications = await this.accountService.GetSwapConfirmedNotifications(userId);
            console.log("swap confirmed notifications received");
            console.log(notifications);
            res.send(notifications)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    SendSwapRequestedNotification = (async (req: Request, res: Response) => {
        const userId = req.body.userId;
        const message = req.body.message;

        try {
            await this.accountService.SendSwapRequestedNotification(userId, message);
            console.log("swap requested notification sent");
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    SendSwapConfirmedNotification = (async (req: Request, res: Response) => {
        const userId = req.body.userId;
        const message = req.body.message;

        try {
            await this.accountService.SendSwapConfirmedNotification(userId, message);
            console.log("swap confirmed notification sent");
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    DeleteSwapRequestedNotification = (async (req: Request, res: Response) => {
        const userId = req.body.userId;
        const notificationId = req.body.notificationId;

        try {
            const listings = await this.accountService.DeleteSwapRequestedNotification(userId, notificationId);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    DeleteSwapConfirmedNotification = (async (req: Request, res: Response) => {
        const userId = req.body.userId;
        const notificationId = req.body.notificationId;

        try {
            const listings = await this.accountService.DeleteSwapConfirmedNotification(userId, notificationId);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetRequestedBooks = (async (req, res: Response) => {
        const userId: string = req.query.userId;

        try {
            const requestedBooks = await this.accountService.GetRequestedBooks(userId);
            console.log("requested books received");
            console.log(requestedBooks);
            res.send(requestedBooks)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    RequestBook = (async (req: Request, res: Response) => {
        const bookId = req.body.bookId;
        const listerId = req.body.listerId;
        const requesterId = req.body.requesterId;
        const swap = req.body.swap;
        const requesterEmail = req.body.requesterEmail;

        try {
            await this.accountService.RequestBook(bookId, listerId, requesterId, swap, requesterEmail);
            console.log(`book with id: ${bookId} requested`);
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    UpdateRequest = (async (req: Request, res: Response) => {
        const requestId = req.body.requestId;
        const status = req.body.status;
        const swappedBookId = req.body.swappedBookId;
        const listerId = req.body.listerId;

        try {
            const listings = await this.accountService.UpdateRequest(requestId, status, swappedBookId, listerId);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetBooksRequested = (async (req, res: Response) => {
        const userId = req.query.userId;

        try {
            const requestedBooks = await this.accountService.GetBooksRequested(userId);
            console.log("books others have requested from me received");
            console.log(requestedBooks);
            res.send(requestedBooks)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetClosedListings = (async (req, res: Response) => {
        const userId = req.query.userId;
        const isActive = false;

        try {
            const listings = await this.listingsService.GetMyListings(userId, isActive);
            console.log("my closed listings received");
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetBooksWon = (async (req, res: Response) => {
        const userId= req.query.userId;
        const isActive = false;

        try {
            const listings = await this.listingsService.GetMyListings(userId, isActive);
            console.log("books won received");
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetBooksLost = (async (req, res: Response) => {
        const userId = req.query.userId;
        const isActive = false;

        try {
            const listings = await this.listingsService.GetMyListings(userId, isActive);
            console.log("books lost received");
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetRequestDetails = (async (req, res: Response) => {
        const userId = req.query.userId;
        const requestId = req.params.requestId

        try {
            const listings = await this.accountService.GetRequestDetails(userId, requestId);
            console.log("request details received");
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

}