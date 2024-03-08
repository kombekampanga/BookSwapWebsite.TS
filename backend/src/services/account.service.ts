import {AccountRepository} from "../repositories/account.repository"
import {AddListingRequestDto} from "../models/AddListingRequestDto";
import {ListingsDto} from "../models/ListingsDto";
import {BookEntity} from "../models/BookEntity";
import {MapToBookDto} from "../helpers/book.mapper";

export class AccountService {
    private accountRepository: AccountRepository;

    constructor() {
        this.accountRepository = new AccountRepository();
    }


    GetSwapRequestedNotifications = async (userId: string)=> {
        console.log("account.service.GetSwapRequestedNotifications called")

        try {
            return await this.accountRepository.GetSwapRequestedNotifications(userId)

        } catch (e) {
            throw(e);
        }
    }

    GetSwapConfirmedNotifications = async (userId: string)=> {
        console.log("account.service.GetSwapConfirmedNotifications called")

        try {
            return await this.accountRepository.GetSwapConfirmedNotifications(userId)

        } catch (e) {
            throw(e);
        }
    }

    SendSwapRequestedNotification = async (userId: string, message: string)=> {
        try {
            console.log("account.service.SendSwapRequestedNotification called")
            await this.accountRepository.SendSwapRequestedNotification(userId, message);

        } catch (e) {
            throw(e);
        }
    }

    SendSwapConfirmedNotification = async (userId: string, message: string)=> {
        try {
            console.log("account.service.SendSwapConfirmedNotification called")
            await this.accountRepository.SendSwapConfirmedNotification(userId, message);

        } catch (e) {
            throw(e);
        }
    }

    DeleteSwapRequestedNotification = async (userId: string, notificationId: string)=> {
        try {
            console.log("account.service.DeleteSwapRequestedNotification called")

            await this.accountRepository.DeleteSwapRequestedNotification(userId, notificationId);

        } catch (e) {
            throw(e);
        }
    }

    DeleteSwapConfirmedNotification = async (userId: string, notificationId: string)=> {
        try {
            console.log("account.service.DeleteSwapConfirmedNotification called")

            await this.accountRepository.DeleteSwapConfirmedNotification(userId, notificationId);

        } catch (e) {
            throw(e);
        }
    }

    GetRequestedBooks = async (userId: string)=> {
        console.log("account.service.GetRequestedBooks called")

        try {
            return await this.accountRepository.GetRequestedBooks(userId)

        } catch (e) {
            throw(e);
        }
    }

    RequestBook = async (bookId: string, listerId: number, requesterId: number, swap:boolean, requesterEmail: string)=> {
        try {
            console.log("account.service.RequestBook called")
            await this.accountRepository.RequestBook(bookId, listerId, requesterId, swap, requesterEmail);

        } catch (e) {
            throw(e);
        }
    }

    UpdateRequest = async (requestId: number, status: string, swappedBookId: number, listerId: number)=> {
        try {
            console.log("account.service.UpdateRequest called")
            await this.accountRepository.UpdateRequest(requestId, status, swappedBookId, listerId);
        } catch (e) {
            throw(e);
        }
    }

    GetBooksRequested = async (userId: string)=> {
        console.log("account.service.GetBooksRequested called")

        try {
            return await this.accountRepository.GetBooksRequested(userId)

        } catch (e) {
            throw(e);
        }
    }

    GetRequestDetails = async (userId: number, requestId: number)=> {
        console.log("account.service.GetRequestDetails called")

        try {
            const requestDetailsResponse = await this.accountRepository.GetRequestDetails(userId, requestId)
            return requestDetailsResponse[0]

        } catch (e) {
            throw(e);
        }
    }
}
