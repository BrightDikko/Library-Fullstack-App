import React from "react";

type Props = {
    prompt: string;
};

const LoadingSpinner: React.FC<Props> = (props) => {
    const prompt = props.prompt;
    return (
        <div
            className="container mt-5 d-flex justify-content-center align-items-center"
            style={{ height: 550 }}
        >
            <button
                className="btn btn-dark d-flex flex-direction-row justify-content-center align-items-center "
                style={{ height: 50, padding: 30 }}
            >
                <span className="spinner-border spinner-border-md " />
                <p className="mt-3" style={{ marginLeft: 10 }}>
                    {prompt}
                </p>
            </button>
        </div>
    );
};

export default LoadingSpinner;
