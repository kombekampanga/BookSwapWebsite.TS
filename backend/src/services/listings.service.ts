import {ListingsRepository} from "../repositories/listings.respository.js";
import {ListingsDto} from "../models/ListingsDto.js";
import {BookEntity} from "../models/BookEntity.js";
import {MapToBookDto} from "../helpers/book.mapper.js";
import {AddListingRequestDto} from "../models/AddListingRequestDto";
import {UpdateListingRequestDto} from "../models/UpdateListingRequestDto";

export class ListingsService{
    private listingsRepository: ListingsRepository;
    constructor() {
        this.listingsRepository = new ListingsRepository();
    }

    GetAllListings = async () => {
        console.log("listings.service.GetAllListings called")
        try {
            const allListings = await this.listingsRepository.GetAllListings();
            const listingsDto: ListingsDto = allListings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            console.log(e);
            throw(e);
        }
    }

    GetUserListings = async (userId: string)=> {
        try {
            console.log("listings.service.GetUserListings called")
            const userListings = await this.listingsRepository.GetUserListings(userId);
            const listingsDto: ListingsDto = userListings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            throw(e);
        }
    }

    GetFilteredGenreListings = async (genres: string[])=> {
        try {
            console.log("listings.service.GetFilteredGenreListings called")
            const Listings = await this.listingsRepository.GetFilteredGenreListings(genres);
            const listingsDto: ListingsDto = Listings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            throw(e);
        }
    }

    GetMyListings = async (userId: string, isActive: boolean)=> {
        try {
            console.log("listings.service.GetMyListings called")
            const myListings = await this.listingsRepository.GetMyListings(userId, isActive);
            const listingsDto: ListingsDto = myListings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            throw(e);
        }
    }

    AddListing = async (addListingsRequestDto: AddListingRequestDto)=> {
        try {
            console.log("listings.service.AddListing called")
            await this.listingsRepository.AddListing(addListingsRequestDto);


        } catch (e) {
            throw(e);
        }
    }

    UpdateListing = async (updateListingsRequestDto: UpdateListingRequestDto)=> {
        try {
            console.log("listings.service.UpdateListing called")
            await this.listingsRepository.UpdateListing(updateListingsRequestDto);

        } catch (e) {
            throw(e);
        }
    }

    UpdateListingFromApprovedRequest = async (bookId: string, userId: string, status: string)=> {
        try {
            console.log("listings.service.UpdateListingFromApprovedRequest called")
            await this.listingsRepository.UpdateListingFromApprovedRequest(bookId, userId, status);
        } catch (e) {
            throw(e);
        }
    }

    UpdateListingFromDeclinedRequest = async (bookId: string, userId: string)=> {
        try {
            console.log("listings.service.UpdateListingFromDeclinedRequest called")
            await this.listingsRepository.UpdateListingFromDeclinedRequest(bookId, userId);
        } catch (e) {
            throw(e);
        }
    }

    UpdateListingWhenRequested = async (bookId: string, userId: string)=> {
        try {
            console.log("listings.service.UpdateListingWhenRequested called")
            await this.listingsRepository.UpdateListingWhenRequested(bookId, userId);
        } catch (e) {
            throw(e);
        }
    }

    DeleteListing = async (bookId: string,userId: string)=> {
        try {
            console.log("listings.service.DeleteListing called")

            return await this.listingsRepository.DeleteListing(bookId, userId);

        } catch (e) {
            throw(e);
        }
    }

    GetBook = async (bookId: string)=> {
        try {
            console.log("listings.service.GetBook called")
            const responseList = await this.listingsRepository.GetBook(bookId)
            const bookEntity = responseList[0];
            return MapToBookDto(bookEntity)

        } catch (e) {
            throw(e);
        }
    }

    GetGenres = async () => {
        console.log("listings.service.GetGenres called")
        try {
            return await this.listingsRepository.GetGenres()

        } catch (e) {
            console.log(e);
            throw(e);
        }
    }

}