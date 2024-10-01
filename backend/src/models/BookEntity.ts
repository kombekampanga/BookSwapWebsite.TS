export type BookEntity = {
    id: string;
    title: string;
    author: string;
    genres: string;
    userId: string;
    userEmail: string;
    image: string;
    requested: number;
    numberOfRequests: number;
    active: number;
    swap: number;
    giveAway: number;
    status: string | null;
    createdOn: string | null;
    closedOn: string | null;
    modifiedOn: string | null;
    description: string | null;
}