import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const EditAccount = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAccount();
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchAccount = async () => {
        const userId = getCookie('userId');
        if (!userId) {
            setError("User ID not found in cookies.");
            return;
        }

        try {
            const response = await fetch(`/api/Users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFullName(data.naam);
                setEmail(data.email);
                setPhoneNumber(data.phoneNumber);
                setAddress(data.adres);
            } else {
                setError("Error fetching account.");
            }
        } catch (error) {
            console.error(error);
            setError("Error fetching account.");
        }
    };

    const saveChanges = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !phoneNumber || !address) {
            setError("Please fill in all fields.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
        } else if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
        } else {
            setError("");
            try {
                const userId = getCookie('userId');
                if (!userId) {
                    setError("User ID not found in cookies.");
                    return;
                }

                const response = await fetch(`/api/Users/ChangeUserInfo?id=${userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: userId,
                        naam: fullName,
                        email: email,
                        phoneNumber: phoneNumber,
                        adres: address,
                        passwordHash: newPassword,
                        normalizedEmail: email.toUpperCase(),
                        normalizedUserName: email.toUpperCase(),
                    }),
                });

                if (response.ok) {
                    setError("Account information updated.");
                } else {
                    const data = await response.json();
                    setError(data.message || "Error updating account.");
                }
            } catch (error) {
                console.error(error);
                setError("Error updating account.");
            }
        }
    };
    const signOut = async () => {
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";

    }

    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const userId = getCookie('userId');
                if (!userId) {
                    setError("User ID not found in cookies.");
                    return;
                }

                const response = await fetch(`/api/Users/${userId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.ok) {
                    // Delete the userId cookie
                    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    // Redirect to the login page
                    window.location.href = "/";
                } else {
                    const data = await response.json();
                    setError(data.message || "Error deleting account.");
                }
            } catch (error) {
                console.error(error);
                setError("Error deleting account.");
            }
        }
    };

    return (
        <div className="container-fluid w-100 h-75 d-flex flex-column translate-middle position-absolute top-50 start-50">
            <div className="position-fixed top-0 end-0 p-3">
                <Button variant="outline-danger" onClick={signOut}>Sign Out</Button>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form onSubmit={saveChanges}>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">Full Name:</p>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">E-mail:</p>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">Phone Number:</p>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">Address:</p>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">Old Password:</p>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">New Password:</p>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="text-light m-2">Confirm New Password:</p>
                        <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    </div>
                    <div className="d-flex justify-content-center m-2">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-100">Save Information</Button>
                        <Button variant="outline-danger" type="button" className="btn mt-3 w-50" data-bs-toggle="modal" data-bs-toggle="deleteWarning" onClick={deleteAccount}>Delete Account</Button>
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                </form>

            </div>
        </div>
    );
};

export default EditAccount;