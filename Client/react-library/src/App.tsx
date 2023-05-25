import React from "react";
import "./App.css";
import Navbar from "./layouts/navbar-and-footer/Navbar";
import Footer from "./layouts/navbar-and-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import SearchBooksPage from "./layouts/search-books-page/SearchBooksPage";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import BookCheckoutPage from "./layouts/book-checkout-page/BookCheckoutPage";
import { oktaConfig } from "./lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, Security } from "@okta/okta-react";
import LoginWidget from "./auth/LoginWidget";

const oktaAuth = new OktaAuth(oktaConfig);

function App() {
    const history = useHistory();

    const customAuthHandler = () => {
        history.push("/login");
    };

    const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
        history.replace(
            toRelativeUrl(originalUri || "/", window.location.origin)
        );
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Security
                oktaAuth={oktaAuth}
                restoreOriginalUri={restoreOriginalUri}
                onAuthRequired={customAuthHandler}
            >
                <Navbar />

                <div className="flex-grow-1">
                    <Switch>
                        <Route
                            path={"/login"}
                            render={() => <LoginWidget config={oktaConfig} />}
                        />

                        <Route
                            path={"/login/callback"}
                            component={LoginCallback}
                        />

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
            </Security>
        </div>
    );
}

export default App;
