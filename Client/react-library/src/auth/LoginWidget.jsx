import { useOktaAuth } from "@okta/okta-react";
import LoadingSpinner from "../layouts/utils/LoadingSpinner";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log("Sign in error: ", err);
    };

    if (!authState) {
        return <LoadingSpinner />;
    }

    return authState.isAuthenticated ? (
        <Redirect to={{ pathname: "/login" }} />
    ) : (
        <div>
            <OktaSignInWidget
                config={config}
                onSuccess={onSuccess}
                onError={onError}
            />
        </div>
    );
};

export default LoginWidget;
