import React from "react";
import BookModel from "../../models/BookModel";
import { Link } from "react-router-dom";

type Props = {
    book: BookModel;
};

const SearchBook: React.FC<Props> = (props) => {
    const imageURL = props.book.image;
    const title = props.book.title;
    const author = props.book.author;
    const description = props.book.description;

    return (
        <div className="card mt-4 shadow p-3 mb-4 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {imageURL ? (
                            <img
                                src={imageURL}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require("../../Images/BooksImages/book-luv2code-1000.png")}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>

                    <div
                        className="d-lg-none d-flex justify-content-center 
                        align-items-center"
                    >
                        {imageURL ? (
                            <img
                                src={imageURL}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        ) : (
                            <img
                                src={require("../../Images/BooksImages/book-luv2code-1000.png")}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-body" style={{ marginLeft: 10 }}>
                        <h5 className="card-title">{author}</h5>
                        <h4>{title}</h4>
                        <p className="card-text">{description}</p>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <Link
                        className="btn btn-md main-color text-white"
                        to={`/checkout/${props.book.id}`}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SearchBook;
