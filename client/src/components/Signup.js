import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Grid, Label, Message } from 'semantic-ui-react';
import { AppContext } from '../AppContext';

const Signup = () => {
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
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const { register } = useContext(AppContext);

  const handleSubmit = (values, { setSubmitting, validateForm }) => {
    validateForm(values).then(errors => {
      if (Object.keys(errors).length > 0) {
        window.alert(Object.values(errors).join("\n"));
      } else {
        register(values);
        setSubmitting(false);
      }
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Grid centered>
      <Grid.Column mobile={16} tablet={8} computer={6}>
        {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
            <Message
              error
              header='There was some errors with your submission'
              list={Object.values(formik.errors)}
            />
          )}
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              className={formik.touched.username && formik.errors.username ? 'error' : ''}
            />
            {formik.touched.username && formik.errors.username && (
              <Label basic color='red' pointing>
                {formik.errors.username}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={formik.touched.email && formik.errors.email ? 'error' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <Label basic color='red' pointing>
                {formik.errors.email}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className={formik.touched.password && formik.errors.password ? 'error' : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <Label basic color='red' pointing>
                {formik.errors.password}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <Label basic color='red' pointing>
                {formik.errors.confirmPassword}
              </Label>
            )}
          </Form.Field>

          <Button
            type="submit"
            primary
            // disabled={!formik.isValid || formik.isSubmitting}
            className="disabled:cursor-not-allowed"
          >
            Submit
          </Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Signup;
