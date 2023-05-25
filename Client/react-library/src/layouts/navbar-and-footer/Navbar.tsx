import { useOktaAuth } from "@okta/okta-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";

type Props = {};

const Navbar: React.FC<Props> = (props) => {
    const { oktaAuth, authState } = useOktaAuth();
    if (!authState)
        return <LoadingSpinner prompt={"Validating Credentials..."} />;

    const handleLogout = async () => oktaAuth.signOut();

    // console.log("Authstate: ", authState);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
            <div className="container-fluid">
                <NavLink to={"/home"} className="navbar-brand">
                    Library
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle Navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNavDropdown"
                >
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to={"/home"} className="nav-link">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={"/search"} className="nav-link">
                                Search Books
                            </NavLink>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {!authState.isAuthenticated ? (
                            <li className="nav-item mt-2">
                                <Link
                                    to={"/login"}
                                    className="btn btn-outline-light"
                                >
                                    Sign in
                                </Link>
                            </li>
                        ) : (
                            <li>
                                <button
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
