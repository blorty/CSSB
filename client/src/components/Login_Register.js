import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login_Register = ({ setIsLoggedIn }) => {
    const history = useHistory();
    const [loginValues, setLoginValues] = useState({ email: "", password: "" });
    const [registerValues, setRegisterValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginValues({ ...loginValues, [name]: value });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterValues({ ...registerValues, [name]: value });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErrors(validateForm(loginValues));
        setIsSubmitting(true);

        if (Object.keys(errors).length === 0) {
            loginUser();
        } else {
            console.log("Form validation errors:", errors);
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setErrors(validateForm(registerValues));
        setIsSubmitting(true);

        if (Object.keys(errors).length === 0) {
            registerUser();
        } else {
            console.log("Form registration errors:", errors);
        }
    };

    const validateForm = (values) => {
        let errors = {};
        if (!values.email) {
        errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
        }
        if (!values.password) {
        errors.password = "Password is required";
        }
        return errors;
    };

    const loginUser = () => {
        console.log("Submitting login request with values:", loginValues);
        fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginValues),
        })
        .then((response) => {
            console.log("Received response:", response);
            if (response.ok) {
            console.log("Login successful");
            setIsLoggedIn(true); // Update login status to true
            history.push("/dashboard");
            } else {
            console.log("Login failed");
            // Authentication failed
            // Handle error case
            }
        })
        .catch((error) => {
            console.log("Error logging in:", error);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    }

    const registerUser = () => {
        console.log("Submitting registration request with values:", registerValues);
        fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerValues),
        })
        .then((response) => {
            console.log("Received response:", response);
            if (response.ok) {
            console.log("Registration successful");
            setIsLoggedIn(true); // Update login status to true
            history.push("/dashboard");
            } else {
            console.log("Registration failed");
            // Registration failed
            // Handle error case
            }
        })
        .catch((error) => {
            console.log("Error registering:", error);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <div>
            {/* Login form here */}
            <form onSubmit={handleLoginSubmit}>
                <label>
                Email:
                <input 
                    type="email" 
                    name="email" 
                    value={loginValues.email} 
                    onChange={handleLoginChange} />
                </label>
                <label>
                Password:
                <input 
                    type="password" 
                    name="password" 
                    value={loginValues.password} 
                    onChange={handleLoginChange} />
                </label>
                <button type="submit" disabled={isSubmitting}>Login</button>
            </form>
        
            {/* Registration form here */}
            <form onSubmit={handleRegisterSubmit}>
                <label>
                Email:
                <input 
                    type="email" 
                    name="email" 
                    value={registerValues.email} 
                    onChange={handleRegisterChange} />
                </label>
                <label>
                Password:
                <input 
                    type="password" 
                    name="password" 
                    value={registerValues.password} 
                    onChange={handleRegisterChange} />
                </label>
                <button type="submit" disabled={isSubmitting}>Register</button>
            </form>
            </div>
        );
    };

export default Login_Register;
