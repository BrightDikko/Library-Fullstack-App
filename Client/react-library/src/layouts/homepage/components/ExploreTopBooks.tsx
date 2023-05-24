import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const ExploreTopBooks: React.FC<Props> = (props) => {
    return (
        <div className="p-5 mb-4 bg-dark header">
            <div className="container-fluid py-5 text-white d-flex justify-content-center align-items-center">
                <div className="">
                    <h1 className="display-5 fw-bold">
                        Find your next adventure
                    </h1>
                    <p className="col-md-8 fs-4">
                        Where would you like to go next?
                    </p>
                    <Link
                        type="button"
                        to={"/search"}
                        className=" btn btn-outline-light bg-dark btn-lg text-white"
                    >
                        Explore top books
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExploreTopBooks;
