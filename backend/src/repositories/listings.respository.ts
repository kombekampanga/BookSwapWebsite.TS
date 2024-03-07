import mysql, {RowDataPacket} from "mysql2";
import {DbRepository} from "./db.repository.js"
import {BookEntity} from "../models/BookEntity.js";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.SQL_PASS,
    database: "bookswap",
});
export class ListingsRepository {
    private dbRepository : DbRepository;

    constructor() {
    this.dbRepository = new DbRepository();
    }

    GetAllListings = (async (): Promise<BookEntity[]> => {
        console.log("listings.repository.GetAllListings called")
        const sqlSelect = "SELECT * FROM books";
        return await this.dbRepository.executeQuery<BookEntity>(sqlSelect)
    })

    GetMyListings = (async (userId: string): Promise<BookEntity[]> => {
        console.log("listings.repository.GetMyListings called")
        const sqlSelect = "SELECT * FROM books WHERE userId = ?";
        return await this.dbRepository.executeQueryWithParameter(sqlSelect, userId)
    })

    AddListing = (async (userId: string, userEmail: string, bookTitle: string, bookAuthor: string, bookGenre: string): Promise<BookEntity[]> => {
        const sqlInsert =
            "INSERT INTO books (title, author, genres, userId, userEmail) VALUES (?,?,?,?, ?)";
        return await this.dbRepository.executeQueryWithParameters(sqlInsert, [userId, userEmail, bookTitle, bookAuthor, bookGenre])
    })

    UpdateListing = (async (userId: string, bookId: string, bookTitle: string, bookAuthor: string, bookGenre: string): Promise<BookEntity[]> => {
        const sqlUpdate =
            "UPDATE books SET title = ?, author = ?, genres = ? WHERE id = ? AND userId = ?";
        return await this.dbRepository.executeQueryWithParameters(sqlUpdate, [bookTitle, bookAuthor, bookGenre, bookId, userId])
    })

    DeleteListing = (async (bookId: string, userId: string): Promise<BookEntity[]> => {
        const sqlDelete = "DELETE FROM books WHERE id = ? AND userId = ?";
        return await this.dbRepository.executeQueryWithParameters(sqlDelete, [bookId, userId])
    })
}
