import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';


const Signup = () => {
    const history = useHistory();
    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        })
        .then((response) => {
            if (response.ok) {
            console.log('Registration successful');
            // Registration successful
            // Redirect the user or perform other actions

            history.push('/dashboard');
            } else {
            // Registration failed
            // Handle error case
            console.log('Registration failed');
            }
        })
        .catch((error) => {
            console.log('Error registering:', error);
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label>Username</label>
                <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} />
                {formik.errors.username && formik.touched.username && <p>{formik.errors.username}</p>}
            </div>

            <div>
                <label>Email</label>
                <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} />
                {formik.errors.email && formik.touched.email && <p>{formik.errors.email}</p>}
            </div>

            <div>
                <label>Password</label>
                <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} />
                {formik.errors.password && formik.touched.password && <p>{formik.errors.password}</p>}
            </div>

            <div>
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} />
                {formik.errors.confirmPassword && formik.touched.confirmPassword && <p>{formik.errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit</button>
        </form>
    );
}

export default Signup;