import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields.");
        } else {
            setError("");
            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });

                if (response.ok) {
                    setError("Successful Login.");
                } else if (response.status === 401) {
                    setError("Unauthorized: Invalid email or password.");
                } else {
                    setError("Error Logging In.");
                }
            } catch (error) {
                console.error(error);
                setError("Network Error Logging in.");
            }
        }
    };

    const handleEmployeeFormClick = () => {
        console.log("Navigating to Add Employee");
        navigate("/add-employee"); 
    };

    const handleEmployeeListClick = () => {
        console.log("Navigating to Employee List");
        navigate("/employee-list");  
    };

    return (
        <div className="container w-100 h-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2">Login</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <IoMail size="2em" color="#ffffff" className="mx-2 my-1 bg-transparent" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            className="mx-2 my-1 bg-transparent no-outline text-white"
                        />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <FaLock size="2em" color="#ffffff" className="mx-2 my-1 bg-transparent" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"
                        />
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <div className="d-flex justify-content-center w-25">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-100">Login</Button>
                        <Button href="/signup" variant="outline-secondary" size="lg" className="btn mt-3 w-100">Sign Up</Button>
                    </div>
                    </form>
                    <Button onClick={handleEmployeeFormClick} variant="outline-info" className="mt-3">Add Employee</Button>
                    <Button onClick={handleEmployeeListClick} variant="outline-info" className="mt-3 ms-2">Employee List</Button> 

            </div>
        </div>
    );
};

export default LoginPage;
