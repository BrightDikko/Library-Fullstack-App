import React, { useEffect, useState } from "react";
import ReturnBook from "./ReturnBook";
import BookModel from "../../../models/BookModel";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { Link } from "react-router-dom";

type Props = {};

const Carousel: React.FC<Props> = (props) => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseURL = "http://localhost:8080/api/books";
            const getBooksURL = `${baseURL}?page=0&size=9`;

            const response = await fetch(getBooksURL);

            if (!response.ok) {
                throw new Error(
                    "Response not ok: an error occured in fetchBooks"
                );
            }

            const responseJson = await response.json();
            const responseData = responseJson["_embedded"]["books"];

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                const bookData = {
                    id: responseData[key]["id"],
                    title: responseData[key]["title"],
                    author: responseData[key]["author"],
                    description: responseData[key]["description"],
                    copies: responseData[key]["copies"],
                    copiesAvailable: responseData[key]["copiesAvailable"],
                    category: responseData[key]["category"],
                    image: responseData[key]["image"],
                };

                loadedBooks.push(bookData);
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            setHttpError(error.message);
            setIsLoading(false);
        });

        return () => {};
    }, []);

    if (isLoading) {
        return <LoadingSpinner prompt={"Loading Carousel..."} />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>

            {/* Desktop */}
            <div
                id="carouselExampleControls"
                className="carousel carousel-dark slide mt-5 
                d-none d-lg-block"
                data-bs-interval="false"
            >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(0, 3).map((book) => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(3, 6).map((book) => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(6, 9).map((book) => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleControls"
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleControls"
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <img
                            src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
                            width="151"
                            height="233"
                            alt="book"
                        />
                        <h6 className="mt-2">Book</h6>
                        <p>Dev by Dikko</p>
                        <a className="btn bg-primary text-white" href="#">
                            Reserve
                        </a>
                    </div>
                </div>
            </div>
            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-dark btn-lg" to={"/search"}>
                    View More
                </Link>
            </div>
        </div>
    );
};
export default Carousel;
