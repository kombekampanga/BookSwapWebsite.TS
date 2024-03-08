export type UpdateListingRequestDto = {
    bookImageUrl: string;
    userId: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenres: string;
    availableForSwap: boolean
    availableToGiveAway: boolean;
    bookDescription: string;
    bookId: string;
}