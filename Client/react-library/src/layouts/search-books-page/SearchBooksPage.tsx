import React, { useEffect, useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import BookModel from "../../models/BookModel";
import SearchBook from "./SearchBook";
import { Pagination } from "../utils/Pagination";

type Props = {};

const SearchBooksPage: React.FC<Props> = (props) => {
    // States for fetching books
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    // States for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // States for books search
    const [search, setSearch] = useState("");
    const [searchURL, setSearchURL] = useState("");
    const [categorySelection, setCategorySelection] = useState("Book category");

    useEffect(() => {
        const fetchBooks = async () => {
            const baseURL = "http://localhost:8080/api/books";
            let getBooksURL = "";

            if (searchURL === "") {
                getBooksURL = `${baseURL}?page=${
                    currentPage - 1
                }&size=${booksPerPage}`;
            } else {
                let searchWithPageURL = searchURL.replace(
                    `<pageNumber>`,
                    `${currentPage - 1}`
                );
                getBooksURL = baseURL + searchWithPageURL;
            }

            const response = await fetch(getBooksURL);

            if (!response.ok) {
                throw new Error(
                    "Response not ok: an error occured in fetchBooks"
                );
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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

        return () => {
            // Scroll to the top everytime new books are fetched
            window.scrollTo(0, 0);
        };
    }, [currentPage, searchURL]);

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

    // Number of first and last book, within range 1 to totalAmountOfBooks
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage + 1;

    let lastItem =
        currentPage * booksPerPage <= totalAmountOfBooks
            ? currentPage * booksPerPage
            : totalAmountOfBooks;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Functions to update search input state and handle book search
    const updateSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const searchHandleChange = () => {
        console.log("Current search: ", search);

        if (search == "") {
            setSearchURL("");
        } else {
            setSearchURL(
                `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`
            );
        }

        // setCurrentPage(1);
        // setCategorySelection("Book category");
    };

    const updateCategoryField = (value: string) => {
        setCurrentPage(1);

        if (
            value.toLowerCase() === "fe" ||
            value.toLowerCase() === "be" ||
            value.toLowerCase() === "data" ||
            value.toLowerCase() === "devops"
        ) {
            setCategorySelection(
                value === "FE"
                    ? "Front End"
                    : value === "BE"
                    ? "Back End"
                    : value
            );

            setSearchURL(
                `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`
            );
        } else {
            setCategorySelection("All");
            setSearchURL(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    };

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-labelledby="Search"
                                    onChange={updateSearchInput}
                                />
                                <button
                                    className="btn btn-outline-success"
                                    onClick={searchHandleChange}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {categorySelection}
                                </button>
                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton1"
                                >
                                    <li
                                        onClick={updateCategoryField.bind(
                                            this,
                                            "All"
                                        )}
                                    >
                                        <a className="dropdown-item" href="#">
                                            All
                                        </a>
                                    </li>
                                    <li
                                        onClick={updateCategoryField.bind(
                                            this,
                                            "FE"
                                        )}
                                    >
                                        <a className="dropdown-item" href="#">
                                            Front End
                                        </a>
                                    </li>
                                    <li
                                        onClick={updateCategoryField.bind(
                                            this,
                                            "BE"
                                        )}
                                    >
                                        <a className="dropdown-item" href="#">
                                            Back End
                                        </a>
                                    </li>
                                    <li
                                        onClick={updateCategoryField.bind(
                                            this,
                                            "Data"
                                        )}
                                    >
                                        <a className="dropdown-item" href="#">
                                            Data
                                        </a>
                                    </li>
                                    <li
                                        onClick={updateCategoryField.bind(
                                            this,
                                            "DevOps"
                                        )}
                                    >
                                        <a className="dropdown-item" href="#">
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {!!totalAmountOfBooks ? (
                        <>
                            <div className="mt-3">
                                <h5>
                                    Number of results: ({totalAmountOfBooks})
                                </h5>
                            </div>

                            <p>
                                {indexOfFirstBook} to {lastItem} of{" "}
                                {totalAmountOfBooks} items:
                            </p>

                            {books.map((book) => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                    ) : (
                        <div className="my-5">
                            <h3>Can't find what you are looking for? </h3>
                            <a
                                type="button"
                                href="#"
                                className="btn bg-primary btn-md px-4 mt-3 me-md-2 fw-bold text-white"
                            >
                                Library Services
                            </a>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBooksPage;
