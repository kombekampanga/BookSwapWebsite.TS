import {DbRepository} from "./db.repository.js"
import {BookEntity} from "../models/BookEntity.js";
import {GenreDto} from "../models/GenreDto";
import {AddListingRequestDto} from "../models/AddListingRequestDto";
import {UpdateListingRequestDto} from "../models/UpdateListingRequestDto";

export class ListingsRepository {
    private dbRepository : DbRepository;

    constructor() {
    this.dbRepository = new DbRepository();
    }

    GetAllListings = (async (): Promise<BookEntity[]> => {
        console.log("listings.repository.GetAllListings called")
        const sqlSelect = "SELECT * FROM books WHERE active = true";
        return await this.dbRepository.executeQuery<BookEntity>(sqlSelect)
    })

    GetUserListings = (async (userId: string): Promise<BookEntity[]> => {
        console.log("listings.repository.GetUserListings called")
        const sqlSelect = "SELECT * FROM books WHERE userId = ? AND active = true";
        return await this.dbRepository.executeQueryWithParameter<BookEntity>(sqlSelect, userId)
    })

    GetFilteredGenreListings = (async (genres: string[]): Promise<BookEntity[]> => {
        console.log("listings.repository.GetFilteredGenreListings called")
        console.log(genres);

        let sqlSelect = `SELECT * FROM books WHERE active = true AND genres LIKE '%${genres[0]}%'`;

        if (genres.length > 1) {
            // ignore the first element since it was already included
            genres.slice(1).forEach((genre) => {
                sqlSelect += ` or genres LIKE '%${genre}%'`;
            });
        }

        console.log(sqlSelect);
        return await this.dbRepository.executeQuery<BookEntity>(sqlSelect)
    })

    GetMyListings = (async (userId: string, isActive: boolean): Promise<BookEntity[]> => {
        console.log("listings.repository.GetMyListings called")
        const sqlSelect = "SELECT * FROM books WHERE userId = ? AND active = ?";
        return await this.dbRepository.executeQueryWithParameters<BookEntity>(sqlSelect, [userId, isActive])
    })

    AddListing = (async (addListingsRequestDto: AddListingRequestDto): Promise<BookEntity[]> => {
        const imageUrl = addListingsRequestDto.imageUrl;
        const userId = addListingsRequestDto.userId;
        const userEmail = addListingsRequestDto.userEmail;
        const bookTitle = addListingsRequestDto.bookTitle;
        const bookAuthor = addListingsRequestDto.bookAuthor;
        const bookGenres = addListingsRequestDto.bookGenres;
        const availableForSwap = addListingsRequestDto.availableForSwap;
        const availableToGiveAway = addListingsRequestDto.availableToGiveAway;
        const bookDescription = addListingsRequestDto.bookDescription;

        const sqlInsert =
            "INSERT INTO books (title, author, genres, description, userId, userEmail, image, swap, giveAway, modifiedOn, active, status) VALUES (?,?,(?),?,?,?,?,?,?,CURRENT_TIMESTAMP, TRUE, 'open')";

        return await this.dbRepository.executeQueryWithParameters(
            sqlInsert,
            [
                bookTitle,
                bookAuthor,
                bookGenres,
                bookDescription,
                userId,
                userEmail,
                imageUrl,
                availableForSwap,
                availableToGiveAway,
            ])
    })

    UpdateListing = (async (updateListingsRequestDto: UpdateListingRequestDto): Promise<BookEntity[]> => {
        const userId = updateListingsRequestDto.userId;
        const bookId = updateListingsRequestDto.bookId;
        const bookTitle = updateListingsRequestDto.bookTitle;
        const bookAuthor = updateListingsRequestDto.bookAuthor;
        const bookGenre = updateListingsRequestDto.bookGenres;
        const bookDescription = updateListingsRequestDto.bookDescription;
        const bookImageUrl = updateListingsRequestDto.bookImageUrl;
        const availableForSwap = updateListingsRequestDto.availableForSwap;
        const availableToGiveAway = updateListingsRequestDto.availableToGiveAway;

        const sqlUpdate =
            "UPDATE books SET title = ?, author = ?, genres = ?, description = ?, image = ?, swap = ?, giveAway = ?, modifiedOn = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?";

        return await this.dbRepository.executeQueryWithParameters<BookEntity>(
            sqlUpdate,
            [
                bookTitle,
                bookAuthor,
                bookGenre,
                bookDescription,
                bookImageUrl,
                availableForSwap,
                availableToGiveAway,
                bookId,
                userId,
            ])
    })

    UpdateListingFromApprovedRequest = (async (bookId: string, userId: string, status: string): Promise<BookEntity[]> => {
        const sqlUpdate =
            "UPDATE books SET active = false, closedOn = CURRENT_TIMESTAMP, status = ?  WHERE id = ? AND userId = ?";
        return await this.dbRepository.executeQueryWithParameters<BookEntity>(sqlUpdate, [status, bookId, userId])
    })

    UpdateListingFromDeclinedRequest = (async (bookId: string, userId: string): Promise<BookEntity[]> => {
        const sqlUpdate =
            "UPDATE books SET requested = IF (numberOfRequests = 1, false, true), numberOfRequests = numberOfRequests-1  WHERE id = ? AND userId = ?";
        return await this.dbRepository.executeQueryWithParameters<BookEntity>(sqlUpdate, [bookId, userId])
    })

    UpdateListingWhenRequested = (async (bookId: string, userId: string): Promise<BookEntity[]> => {
        const sqlUpdate =
            "UPDATE books SET numberOfRequests = numberOfRequests+1, requested = true WHERE id = ? AND userId = ?;";
        return await this.dbRepository.executeQueryWithParameters<BookEntity>(sqlUpdate, [bookId, userId])
    })

    DeleteListing = (async (bookId: string, userId: string): Promise<BookEntity[]> => {
        const sqlDelete = "DELETE FROM books WHERE id = ? AND userId = ?";
        return await this.dbRepository.executeQueryWithParameters<BookEntity>(sqlDelete, [bookId, userId])
    })

    GetBook = (async (bookId: string): Promise<BookEntity[]> => {
        console.log("listings.repository.GetBook called")
        const sqlSelect = "SELECT * FROM books WHERE id = ? AND active = true";
        return await this.dbRepository.executeQueryWithParameter<BookEntity>(sqlSelect, bookId)
    })

    GetGenres = (async (): Promise<GenreDto[]> => {
        console.log("listings.repository.GetGenres called")
        const sqlSelect = "SELECT * FROM genres";
        return await this.dbRepository.executeQuery<GenreDto>(sqlSelect)
    })
}
