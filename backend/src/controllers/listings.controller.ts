import {ListingsService} from '../services/listings.service.js';
import {Request, Response} from 'express'

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
        const userId = req.body.userId;
        const userEmail = req.body.userEmail;
        const bookTitle = req.body.bookTitle;
        const bookAuthor = req.body.bookAuthor;
        const bookGenre = req.body.bookGenre;

        try {
            const listings = await this.listingsService.AddListing(userId, userEmail, bookTitle, bookAuthor, bookGenre);
            res.send(listings)
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

    UpdateListing = (async (req: Request, res: Response) => {
        const userId = req.body.userId;
        const bookId = req.body.bookId;
        const bookTitle = req.body.bookTitle;
        const bookAuthor = req.body.bookAuthor;
        const bookGenre = req.body.bookGenre;

        try {
            const listings = await this.listingsService.UpdateListing(userId, bookId, bookTitle, bookAuthor, bookGenre);
            res.status(200)
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })
}

