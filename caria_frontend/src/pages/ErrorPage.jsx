import React from 'react';
import {useLocation} from 'react-router-dom';

const ErrorPage = () => {
    const location = useLocation();
    const status = location.state?.status || 404;

    return (
        <div className="error-page">
            <h1>Error {status}</h1>
            <img src={`https://http.cat/${status}`} alt={`Error ${status}`}/>
            <p>Oops! Something went wrong.</p>
            <a href="/">Go back to homepage</a>
        </div>
    );
};

export default ErrorPage;

