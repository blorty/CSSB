import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom'; // Import useHistory
import { AppContext } from '../AppContext';

const LoginForm = () => {
    const { login } = useContext(AppContext);
    const history = useHistory();

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
        username: '',
        password: ''
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            let isMounted = true; // Add this line
            login(values, history)
            .then(() => {
                if (isMounted) { // Check if the component is still mounted
                    setSubmitting(false);
                }
            })
            .catch(err => {
                if (isMounted) { // Check if the component is still mounted
                    setErrors({submit: 'Invalid username or password'});
                    setSubmitting(false);
                }
            });
            return () => {
                isMounted = false; // Set the flag to false when the component unmounts
            }
        },
        
    });

    return (
        <div className="flex justify-center">
        <div className="w-full max-w-md">
            <h1 className="text-center text-2xl pt-5 text-white font-bold my-5">Login</h1>
            <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.username && formik.errors.username ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.username && formik.errors.username && (
                    <p className="text-red-500 text-xs italic">{formik.errors.username}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs italic">{formik.errors.password}</p>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={!formik.isValid || formik.isSubmitting}
                    >
                    Login
                    </button>
                </div>
                {formik.errors.submit && <p className="text-red-500 text-xs italic">{formik.errors.submit}</p>}
            </form>
        </div>
        </div>
    );
};

export default LoginForm;
