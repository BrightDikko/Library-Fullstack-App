import React from "react";
import "./App.css";
import Navbar from "./layouts/navbar-and-footer/Navbar";
import Footer from "./layouts/navbar-and-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import SearchBooksPage from "./layouts/search-books-page/SearchBooksPage";
import { Redirect, Route, Switch } from "react-router-dom";
import BookCheckoutPage from "./layouts/book-checkout-page/BookCheckoutPage";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <div className="flex-grow-1">
                <Switch>
                    <Route path={"/"} exact>
                        <Redirect to={"/home"} />
                    </Route>

                    <Route path={"/home"}>
                        <HomePage />
                    </Route>

                    <Route path={"/search"}>
                        <SearchBooksPage />
                    </Route>

                    <Route path={"/checkout/:bookId"}>
                        <BookCheckoutPage />
                    </Route>
                </Switch>
            </div>

            <Footer />
        </div>
    );
}

export default App;
