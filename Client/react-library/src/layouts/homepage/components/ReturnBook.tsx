import React from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";

type Props = {
    book: BookModel;
};

const ReturnBook: React.FC<Props> = (props) => {
    const author = props.book.author;
    const title = props.book.title;
    const imageURL = props.book.image;

    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {imageURL ? (
                    <img src={imageURL} width="151" height="233" alt="book" />
                ) : (
                    <img
                        src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="151"
                        height="233"
                        alt="book"
                    />
                )}
                <h6 className="mt-2">{title}</h6>
                <p>{author}</p>
                <Link
                    className="btn bg-primary text-white"
                    to={`/checkout/${props.book.id}`}
                >
                    Reserve
                </Link>
            </div>
        </div>
    );
};

export default ReturnBook;
