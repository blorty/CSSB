import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../AppContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isLoggedIn } = useContext(AppContext);

    console.log("Rendering PrivateRoute for", rest.path, "with isLoggedIn =", isLoggedIn);

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;

