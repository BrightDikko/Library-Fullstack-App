import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import LoadingSpinner from "../utils/LoadingSpinner";
import { StarsReview } from "./StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";

type Props = {};

const BookCheckoutPage: React.FC<Props> = (props) => {
    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review state
    const [reviews, setRevieiws] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
        useState(true);

    // Book Checkout State
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] =
        useState(true);

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
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error(
                    "Response not ok: an error occured in fetchBookReviews"
                );
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews["_embedded"]["reviews"];
            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key]["id"],
                    userEmail: responseData[key]["userEmail"],
                    date: responseData[key]["date"],
                    rating: responseData[key]["rating"],
                    bookId: responseData[key]["bookId"],
                    reviewDescription: responseData[key]["reviewDescription"],
                });

                weightedStarReviews =
                    weightedStarReviews + responseData[key]["rating"];
            }

            if (loadedReviews) {
                const round = (
                    Math.round(
                        (weightedStarReviews / loadedReviews.length) * 2
                    ) / 2
                ).toFixed(1);
                setTotalStars(Number(round));
            }

            setRevieiws(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchBookReviews().catch((error: any) => {
            setHttpError(error.message);
            setIsLoadingReview(false);
        });
    }, []);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/currentloans/count`;

                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                };

                const currentLoansCountResponse = await fetch(
                    url,
                    requestOptions
                );

                if (!currentLoansCountResponse.ok) {
                    throw new Error(
                        "Response not ok: an error occured in fetchUserCurrentLoansCount!"
                    );
                }

                const currentLoansCountResponseJson =
                    await currentLoansCountResponse.json();

                setCurrentLoansCount(currentLoansCountResponseJson);
            }

            setIsLoadingCurrentLoansCount(false);
        };

        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        });
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error(
                        "Response not ok: an error occured in fetchUserCheckedOutBook"
                    );
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }

            setIsLoadingBookCheckedOut(false);
        };

        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        });
    }, [authState]);

    if (
        isLoading ||
        isLoadingReview ||
        isLoadingCurrentLoansCount ||
        isLoadingBookCheckedOut
    ) {
        return <LoadingSpinner prompt={"Loading Carousel..."} />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function checkoutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;

        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json",
            },
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error("Something went wrong!");
        }

        setIsCheckedOut(true);
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
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                    />
                </div>

                <hr />

                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={false}
                />
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
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedOut={isCheckedOut}
                    checkoutBook={checkoutBook}
                />

                <hr />

                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={true}
                />
            </div>
        </div>
    );
};

export default BookCheckoutPage;
