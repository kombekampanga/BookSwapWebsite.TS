import {ListingsRepository} from "../repositories/listings.respository.js";
import {ListingsDto} from "../models/ListingsDto.js";
import {BookEntity} from "../models/BookEntity.js";
import {MapToBookDto} from "../helpers/book.mapper.js";
import {BookDto} from "../models/BookDto";

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

    GetMyListings = async (userId: string)=> {
        try {
            console.log("listings.service.GetMyListings called")
            const allListings = await this.listingsRepository.GetMyListings(userId);
            const listingsDto: ListingsDto = allListings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            throw(e);
        }
    }

    AddListing = async (userId: string, userEmail: string, bookTitle: string, bookAuthor: string, bookGenre: string)=> {
        try {
            console.log("listings.service.AddListing called")

            const allListings = await this.listingsRepository.AddListing(userId, userEmail, bookTitle, bookAuthor, bookGenre);
            const listingsDto: ListingsDto = allListings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            throw(e);
        }
    }

    UpdateListing = async (userId: string, bookId: string, bookTitle: string, bookAuthor: string, bookGenre: string)=> {
        try {
            console.log("listings.service.UpdateListing called")
            const allListings = await this.listingsRepository.UpdateListing(userId, bookId, bookTitle, bookAuthor, bookGenre);
            console.log(`service response: ${allListings}`)
            //const listingsDto: ListingsDto = allListings.map((book: BookEntity) => MapToBookDto(book));
            //return listingsDto

        } catch (e) {
            throw(e);
        }
    }

    DeleteListing = async (bookId: string,userId: string)=> {
        try {
            console.log("listings.service.DeleteListing called")

            const allListings = await this.listingsRepository.DeleteListing(bookId, userId);
            const listingsDto: ListingsDto = allListings.map((book: BookEntity) => MapToBookDto(book));
            return listingsDto

        } catch (e) {
            throw(e);
        }
    }

}