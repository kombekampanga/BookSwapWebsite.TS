export type AddListingRequestDto = {
    imageUrl: string;
    userId: string;
    userEmail: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenres: string;
    availableForSwap: boolean
    availableToGiveAway: boolean;
    bookDescription: string;
}