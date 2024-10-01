import {BookEntity} from "../models/BookEntity.js";
import {BookDto} from "../models/BookDto.js";

export const MapToBookDto = (book: BookEntity): BookDto => {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        genres: book.genres,
        userId: book.userId,
        userEmail: book.userEmail,
        image: book.image,
        requested: book.requested,
        numberOfRequests: book.numberOfRequests,
        active: book.active,
        swap: book.swap,
        giveAway: book.giveAway,
        status: book.status,
        createdOn: book.createdOn,
        closedOn: book.closedOn,
        modifiedOn: book.modifiedOn,
        description: book.description
    }
}
