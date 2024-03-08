export type RequestDto = {
    id: number,
    bookId: number,
    listerId: number,
    requesterId: number,
    swap: boolean,
    active: boolean,
    status: string,
    createdOn: string,
    closedOn: string | null,
    swappedBook: number | null,
    requesterEmail: string
}