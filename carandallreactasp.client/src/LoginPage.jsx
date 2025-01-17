import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaLock } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import './custom.css';

/**
 * LoginPage component handles user login.
 * It includes form fields for email and password and performs input checks
 * before submitting the data to the server.
 */
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    //Handles the form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        try {
            const loginResponse = await fetch("/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

            if (loginResponse.ok) {
                const userIdResponse = await fetch(`/api/Users/GetUserID?email=${email}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                if (userIdResponse.ok) {
                    const userId = await userIdResponse.text();
                    document.cookie = `userId=${userId}; path=/`;
                    setError("Successful Login.");
                    window.location.href = "/index";
                } else {
                    setError("Error fetching user ID.");
                }
            } else if (loginResponse.status === 401) {
                setError("Unauthorized: Invalid email or password.");
            } else {
                setError("Error Logging In.");
            }
        } catch (error) {
            console.error(error);
            setError("Network Error Logging in.");
        }
    };

    return (
        <div className="container w-100 h-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2 michroma-regular">Login</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center tomorrow-regular" onSubmit={
handleSubmit}>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-50 mb-2">
                        <IoMail size="2em" color="#ffffff" className="mx-2 my-1 bg-transparent"/>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            className="mx-2 my-1 w-100 bg-transparent no-outline text-white"/>
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-50 mb-2">
                        <FaLock size="2em" color="#ffffff" className="mx-2 my-1 bg-transparent"/>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"/>
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <div className="d-flex justify-content-center w-50">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-100 rounded-1">Login</Button>
                        <Button href="/signup" variant="outline-secondary" size="lg" className="btn mt-3 w-50 rounded-1">Sign Up</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;