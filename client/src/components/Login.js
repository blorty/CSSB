import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
    const history = useHistory();

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
            .then((response) => {
                if (response.ok) {
                    console.log("Login successful");
                    setIsLoggedIn(true);
                    history.push("/dashboard");
                } else {
                    console.log("Login failed");
                }
            })
            .catch((error) => {
                console.log("Error logging in:", error);
            })
            .finally(() => {
                setSubmitting(false);
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label>Username</label>
                <input 
                    type="text" 
                    name="username" 
                    value={formik.values.username} 
                    onChange={formik.handleChange} />
                {formik.errors.username && formik.touched.username && <p>{formik.errors.username}</p>}
            </div>

            <div>
                <label>Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={formik.values.password} 
                    onChange={formik.handleChange} />
                {formik.errors.password && formik.touched.password && <p>{formik.errors.password}</p>}
            </div>

            <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Login</button>
        </form>
    );
};

export default Login;
