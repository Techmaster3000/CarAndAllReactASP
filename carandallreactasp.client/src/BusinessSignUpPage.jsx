import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

const BusinessSignUpPage = () => {
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [kvkNumber, setKvkNumber] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!companyName || !address || !kvkNumber) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/Users/createbusinessuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: email,
                    email: email,
                    adres: address,
                    naam: companyName,
                    phoneNumber: phoneNumber,
                    passwordHash: password,
                    normalizedEmail: email.toUpperCase(),
                    normalizedUserName: email.toUpperCase(),
                    IsBusiness: true,
                    CompanyName: companyName,
                    KvkNumber: kvkNumber
                })
            });

            if (response.ok) {
                window.alert("Business account registered successfully. Please check your email for confirmation.");
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.message || "Error registering business. ELse catch");
            }
        } catch (error) {
            console.error(error);
            setError("Error registering business. Caught");
        }
    };

    return (
        <div className="container w-100 h-75 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2">Registreren als Zakelijke Klant</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit}>
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
                            type="password"
                            placeholder="Password"
                            className="mx-2 w-100 my-1 bg-transparent no-outline text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                    <input
                        type="text"
                        placeholder="Bedrijfsnaam"
                        className="mx-2 my-1 bg-transparent no-outline text-dark"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
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
                            type="text"
                            placeholder="KVK-nummer"
                            className="mx-2 my-1 bg-transparent no-outline text-white"
                            value={kvkNumber}
                            onChange={(e) => setKvkNumber(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <div className="d-flex justify-content-center w-25">
                    <Button variant="primary" type="submit" size="lg" className="btn mt-3 w-100">Registreren</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessSignUpPage;