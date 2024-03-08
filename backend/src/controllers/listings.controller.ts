import {ListingsService} from '../services/listings.service.js';
import {Request, Response} from 'express'
import {AddListingRequestDto} from "../models/AddListingRequestDto";
import {UpdateListingRequestDto} from "../models/UpdateListingRequestDto";

export class ListingsController {
    private listingsService: ListingsService

    constructor() {
        this.listingsService = new ListingsService();
    }

    GetAllListings = (async (_, res: Response) => {
        try {
            const listings = await this.listingsService.GetAllListings();
            console.log("listings received");
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetUserListings = (async (req: Request, res: Response) => {
        const userId: string = req.params.userId;

        try {
            const listings = await this.listingsService.GetUserListings(userId);
            console.log(`listings received for user with id: ${userId}`);
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetFilteredGenreListings = (async (req, res: Response) => {
        const genres: string[] = req.query.genres[0];

        try {
            const listings = await this.listingsService.GetFilteredGenreListings(genres);
            console.log(`my listings received filtered by genres: ${genres}`);
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })


    GetMyListings = (async (req, res: Response) => {
        const userId: string = req.query.userId;

        try {
            const listings = await this.listingsService.GetMyListings(userId);
            console.log("my listings received");
            console.log(listings);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    AddListing = (async (req: Request, res: Response) => {
        const addListingsRequest: AddListingRequestDto = {
            imageUrl: req.body.imageUrl,
            userId: req.body.userId,
            userEmail: req.body.userEmail,
            bookTitle: req.body.bookTitle,
            bookAuthor: req.body.bookAuthor,
            bookGenres: req.body.bookGenres,
            availableForSwap: req.body.availableForSwap,
            availableToGiveAway: req.body.availableToGiveAway,
            bookDescription: req.body.bookDescription
        }

        try {
            const listings = await this.listingsService.AddListing(addListingsRequest);
            res.send(listings)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    UpdateListing = (async (req: Request, res: Response) => {
        const updateListingsRequest: UpdateListingRequestDto = {
            bookImageUrl: req.body.imageUrl,
            userId: req.body.userId,
            userEmail: req.body.userEmail,
            bookTitle: req.body.bookTitle,
            bookAuthor: req.body.bookAuthor,
            bookGenres: req.body.bookGenres,
            availableForSwap: req.body.availableForSwap,
            availableToGiveAway: req.body.availableToGiveAway,
            bookDescription: req.body.bookDescription,
            bookId: req.body.bookId
        }

        try {
            const listings = await this.listingsService.UpdateListing(updateListingsRequest);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    UpdateListingFromApprovedRequest = (async (req: Request, res: Response) => {
        const bookId = req.body.bookId;
        const userId = req.body.userId;
        const status = req.body.status;

        try {
            const listings = await this.listingsService.UpdateListingFromApprovedRequest(bookId, userId, status);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    UpdateListingFromDeclinedRequest = (async (req: Request, res: Response) => {
        const bookId = req.body.bookId;
        const userId = req.body.userId;

        try {
            const listings = await this.listingsService.UpdateListingFromDeclinedRequest(bookId, userId);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    UpdateListingWhenRequested = (async (req: Request, res: Response) => {
        const bookId = req.body.bookId;
        const userId = req.body.userId;

        try {
            const listings = await this.listingsService.UpdateListingWhenRequested(bookId, userId);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    DeleteListing = (async (req: Request, res: Response) => {
        const bookId = req.body.bookId;
        const userId = req.body.userId;

        try {
            const listings = await this.listingsService.DeleteListing(bookId, userId);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetBook = (async (req: Request, res: Response) => {
        const bookId = req.params.bookId;

        try {
            const bookDto = await this.listingsService.GetBook(bookId);
            console.log(`book with id: ${bookId} received`);
            console.log(bookDto);
            res.send(bookDto)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })

    GetGenres = (async (_, res: Response) => {
        try {
            const genres = await this.listingsService.GetGenres();
            console.log("genres received");
            console.log(genres);
            res.send(genres)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })
}

