import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

const SignUpPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
    const sendConfirmationEmail = async () => {
        try {
            //create the user with the submitted data and save it to the database using the API endpoint
            const response = await fetch(`/api/Users/SendConfirmationEmail?emailToFind=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error sending confirmation email. After Response.");
            }
        } catch (error) {
            console.error(error);
            setError("Error sending confirmation email.");
        }
    };

    const handleSubmit = async (e) => {
        
        //check if all the fields are entered correctly

        e.preventDefault();
        //check if all fields are filled in
        if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
            setError("Please fill in all fields.");
        }
        //check if the email is in a valid format (contains a @ and a .)
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
        }
        //check if the password is entered correctly twice
        else if (password !== confirmPassword) {
            setError("Passwords do not match.");
        } else {
            setError("");
            try {
                const response = await fetch("/api/Users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName: email,
                        email: email,
                        adres: address,
                        naam: fullName,
                        phoneNumber: phoneNumber,
                        passwordHash: password,
                        normalizedEmail: email.toUpperCase(),
                        normalizedUserName: email.toUpperCase()
                    }),
                });

                if (response.ok) {
                    const newUser = await response.json();
                    //send a confirmation email to the user after successfully registering.
                    await sendConfirmationEmail(newUser);
                    window.alert("User registered successfully. Please check your email for confirmation.");
                    navigate('/login');
                } else {
                    //give an error if there is a problem with the API response
                    const data = await response.json();
                    setError(data.message || "Error registering.");
                }
            } catch (error) {
                console.error(error);
                setError("Error registering.");
            }
        }

    };

    return (
        <div className="container w-100 h-75 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-1">
            <div className="text-center">
                <div className="display-4 pt-2 michroma-regular">Sign Up</div>   
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center tomorrow-regular" onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-75 no-outline mb-2">
                        <input
                            placeholder="Full Name"
                            className="mx-2 my-1 w-100 bg-transparent no-outline text-white"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 no-outline rounded-1 w-75 mb-2">
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="mx-2 my-1 w-100 bg-transparent no-outline text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-75 mb-2">
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            maxLength="12"
                            minLength="8"
                            className="mx-2 my-1 w-100 bg-transparent no-outline text-white"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-75 mb-2">
                        <input
                            placeholder="Address"
                            className="mx-2 my-1 w-100 bg-transparent no-outline text-white"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-75 mb-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-75 mb-2">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-center w-75">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-100 rounded-1">Sign Up</Button>
                        <Button as={Link} to="/login" variant="outline-secondary" size="lg" className="btn mt-3 w-50 rounded-1">Login</Button>
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                </form>
                <div className="d-flex justify-content-center w-75">
                <Button href="/business-signup" variant="outline-secondary" size="lg" className="btn mt-3 w-100 rounded-1 tomorrow-regular"> Business Sign Up</Button>
                </div>
                
            </div>
        </div>
    );
};

export default SignUpPage;
