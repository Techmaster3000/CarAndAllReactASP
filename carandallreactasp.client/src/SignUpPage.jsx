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
        e.preventDefault();
        if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
            setError("Please fill in all fields.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
        } else if (password !== confirmPassword) {
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
                    await sendConfirmationEmail(newUser);
                    window.alert("User registered successfully. Please check your email for confirmation.");
                    navigate('/login');
                } else {
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
        <div className="container w-100 h-75 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2">Sign Up</div>                
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="mx-2 my-1 bg-transparent no-outline text-white"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="mx-2 my-1 bg-transparent no-outline text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            maxLength="12"
                            minLength="8"
                            className="mx-2 my-1 bg-transparent no-outline text-white"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input
                            type="text"
                            placeholder="Address"
                            className="mx-2 my-1 bg-transparent no-outline text-white"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-center w-25">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-100">Sign Up</Button>
                        <Button as={Link} to="/login" variant="outline-secondary" size="lg" className="btn mt-3 w-100">Login</Button>
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
