import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import LoadingSpinner from "../utils/LoadingSpinner";
import { StarsReview } from "./StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";

type Props = {};

const BookCheckoutPage: React.FC<Props> = (props) => {
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const bookId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseURL = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(baseURL);

            if (!response.ok) {
                throw new Error(
                    "Response not ok: an error occured in fetchBooks"
                );
            }

            const responseJson = await response.json();

            const bookData = {
                id: responseJson["id"],
                title: responseJson["title"],
                author: responseJson["author"],
                description: responseJson["description"],
                copies: responseJson["copies"],
                copiesAvailable: responseJson["copiesAvailable"],
                category: responseJson["category"],
                image: responseJson["image"],
            };

            setBook(bookData);
            setIsLoading(false);
        };

        fetchBook().catch((error: any) => {
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
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.image ? (
                            <img
                                src={book?.image}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        )}
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={5} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>

                <hr />
            </div>

            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.image ? (
                        <img
                            src={book?.image}
                            width="226"
                            height="349"
                            alt="Book"
                        />
                    ) : (
                        <img
                            src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                            width="226"
                            height="349"
                            alt="Book"
                        />
                    )}
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={5} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
            </div>
        </div>
    );
};

export default BookCheckoutPage;
