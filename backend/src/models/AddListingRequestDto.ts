export type AddListingRequestDto = {
    imageUrl: string;
    userId: number;
    userEmail: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenres: string;
    availableForSwap: boolean
    availableToGiveAway: boolean;
    bookDescription: string;
}