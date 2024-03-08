export type BooksRequestedFromUserDto = {
    requestId: string,
    bookId: string,
    swap: string,
    createdOn: string,
    requestedBy: string, //email
    title: string,
    author: string,
    genres: string,
    image: string,
    bookOfferedForSwappingTitle: string,
    bookOfferedForSwappingAuthor: string,
    bookOfferedForSwappingGenre: string,
    bookOfferedForSwappingImage: string,
}