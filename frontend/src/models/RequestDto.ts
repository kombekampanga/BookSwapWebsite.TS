export type RequestDto = {
    id: string,
    bookId: string,
    listerId: string,
    requesterId: string,
    swap: boolean,
    active: boolean,
    status: string,
    createdOn: string,
    closedOn: string | null,
    swappedBook: string | null,
    requesterEmail: string
}