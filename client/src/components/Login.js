import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Label } from 'semantic-ui-react';
import { AppContext } from '../AppContext';

const Login = () => {
    const { login } = useContext(AppContext);

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
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await login(values);
                setSubmitting(false);
                } catch (err) {
                setErrors({submit: err.message});
                setSubmitting(false);
                }
            },
    });

    return (
        <div className="ui container">
        <div className="ui middle aligned center aligned grid">
            <div className="column">
            <h1 className="ui header">Login</h1>
            <Form onSubmit={formik.handleSubmit} loading={formik.isSubmitting}>
                <div className="ui segment">
                <Form.Field error={formik.touched.username && !!formik.errors.username}>
                    <label htmlFor="username">Username</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    />
                    {formik.errors.username && formik.touched.username && (
                    <Label basic color='red' pointing>
                        {formik.errors.username}
                    </Label>
                    )}
                </Form.Field>

                <Form.Field error={formik.touched.password && !!formik.errors.password}>
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    />
                    {formik.errors.password && formik.touched.password && (
                    <Label basic color='red' pointing>
                        {formik.errors.password}
                    </Label>
                    )}
                </Form.Field>

                <Button
                    type="submit"
                    primary
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    Login
                </Button>
                </div>
                <Label basic color='red' pointing>
                    {formik.errors.submit && <p>{formik.errors.submit}</p>}
                </Label>
            </Form>
            </div>
        </div>
        </div>
    );
};

export default Login;
