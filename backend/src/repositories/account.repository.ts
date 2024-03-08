import {DbRepository} from "./db.repository";
import {NotificationDto} from "../models/NotificationDto";
import {BooksRequestedByUserDto} from "../models/BooksRequestedByUserDto";
import {BooksRequestedFromUserDto} from "../models/BooksRequestedFromUserDto";
import {RequestDto} from "../models/RequestDto";
import {BookEntity} from "../models/BookEntity";
import {BookDto} from "../models/BookDto";

export class AccountRepository {
    private dbRepository : DbRepository;

    constructor() {
        this.dbRepository = new DbRepository();
    }

    GetSwapRequestedNotifications = (async (userId: string): Promise<NotificationDto[]> => {
        console.log("listings.repository.GetSwapRequestedNotifications called")
        const sqlSelect = "SELECT * FROM swap_requested_notification WHERE userId = ?";
        return await this.dbRepository.executeQueryWithParameter<NotificationDto>(sqlSelect, userId)
    })

    GetSwapConfirmedNotifications = (async (userId: string): Promise<NotificationDto[]> => {
        console.log("listings.repository.GetSwapConfirmedNotifications called")
        const sqlSelect = "SELECT * FROM swap_confirmed_notification WHERE userId = ?";
        return await this.dbRepository.executeQueryWithParameter<NotificationDto>(sqlSelect, userId)
    })

    SendSwapRequestedNotification = (async (userId: string, message: string): Promise<NotificationDto[]> => {
        const sqlInsert =
            "INSERT INTO swap_requested_notification (userId, message) VALUES (?,?)";

        return await this.dbRepository.executeQueryWithParameters(sqlInsert, [userId, message])
    })

    SendSwapConfirmedNotification = (async (userId: string, message: string): Promise<NotificationDto[]> => {
        const sqlInsert =
            "INSERT INTO swap_confirmed_notification (userId, message) VALUES (?,?)";

        return await this.dbRepository.executeQueryWithParameters<NotificationDto>(sqlInsert, [userId, message])
    })

    DeleteSwapRequestedNotification = (async (userId: string, notificationId: string): Promise<NotificationDto[]> => {
        const sqlDelete = "DELETE FROM swap_requested_notification WHERE userId = ? AND id = ?";
        return await this.dbRepository.executeQueryWithParameters<NotificationDto>(sqlDelete, [userId, notificationId])
    })

    DeleteSwapConfirmedNotification = (async (userId: string, notificationId: string): Promise<NotificationDto[]> => {
        const sqlDelete = "DELETE FROM swap_confirmed_notification WHERE userId = ? AND id = ?";
        return await this.dbRepository.executeQueryWithParameters<NotificationDto>(sqlDelete, [userId, notificationId])
    })

    GetRequestedBooks = (async (userId: string): Promise<BooksRequestedByUserDto[]> => {
        console.log("listings.repository.GetRequestedBooks called")
        const sqlSelect =
            "SELECT requests.swap, requests.createdOn, requestedBook.title, requestedBook.author, requestedBook.genres, requestedBook.userEmail AS listerEmail, requestedBook.image, bookImSwapping.title AS bookImSwappingTitle, bookImSwapping.author AS bookImSwappingAuthor, bookImSwapping.genres AS bookImSwappingGenre, bookImSwapping.image AS bookImSwappingImage FROM requests JOIN books requestedBook ON requests.bookId = requestedBook.id LEFT JOIN books bookImSwapping ON requests.swappedBook = bookImSwapping.id WHERE requesterId = ? AND requests.active = TRUE";
        return await this.dbRepository.executeQueryWithParameter<BooksRequestedByUserDto>(sqlSelect, userId)
    })

    RequestBook = (async (bookId: string, listerId: number, requesterId: number, swap: boolean, requesterEmail: string): Promise<any[]> => {
        const sqlInsert =
            "INSERT INTO requests (bookId, listerId, requesterId, requesterEmail, swap, active, status) VALUES (?,?,?,?,?,TRUE,'open')";

        return await this.dbRepository.executeQueryWithParameters(sqlInsert, [bookId, listerId, requesterId, requesterEmail, swap])
    })

    UpdateRequest = (async (requestId: number, status: string, swappedBookId: number, listerId: number): Promise<RequestDto[]> => {
        const sqlUpdate =
            "UPDATE requests SET active = false, status = ?, closedOn = CURRENT_TIMESTAMP, swappedBook = ? WHERE id = ? AND listerId = ?";
        return await this.dbRepository.executeQueryWithParameters<RequestDto>(sqlUpdate, [status, swappedBookId, requestId, listerId])
    })

    GetBooksRequested = (async (userId: string): Promise<BooksRequestedFromUserDto[]> => {
        console.log("listings.repository.GetBooksRequested called")
        const sqlSelect =
            "SELECT requests.id AS requestId, requests.bookId, requests.swap, requests.createdOn, users.email AS requestedBy, requestedBook.title, requestedBook.author, requestedBook.genres, requestedBook.image, bookOfferedForSwapping.title AS bookOfferedForSwappingTitle, bookOfferedForSwapping.author AS bookOfferedForSwappingAuthor, bookOfferedForSwapping.genres AS bookOfferedForSwappingGenre, bookOfferedForSwapping.image AS bookOfferedForSwappingImage FROM requests JOIN books requestedBook ON requests.bookId = requestedBook.id JOIN users ON requests.requesterId = users.userId LEFT JOIN books bookOfferedForSwapping ON requests.swappedBook = bookOfferedForSwapping.id WHERE listerId = ? AND requests.active = TRUE";
        return await this.dbRepository.executeQueryWithParameter<BooksRequestedFromUserDto>(sqlSelect, userId)
    })

    GetRequestDetails = (async (userId: string, requestId: string): Promise<RequestDto[]> => {
        console.log("listings.repository.GetBooksRequested called")
        const sqlSelect = "SELECT * FROM requests WHERE listerId = ? AND id = ?";
        return await this.dbRepository.executeQueryWithParameters<RequestDto>(sqlSelect, [userId, requestId])
    })

}