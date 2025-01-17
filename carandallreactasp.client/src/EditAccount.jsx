import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import getCookie from "./helpers/getCookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoArrowBackSharp } from "react-icons/io5";
import "./custom.css";

const EditAccount = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        const userId = getCookie("userId");
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

        if (!fullName || !email || !phoneNumber || !address || !oldPassword || !newPassword || !confirmNewPassword) {
            setError("Please fill in all fields.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
        } else if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
        } else {
            setError("");
            try {
                const userId = getCookie("userId");
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
                        oldPassword: oldPassword,
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
    };

    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const userId = getCookie("userId");
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
                    signOut();
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
        <div className="container w-100 h-auto d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="position-absolute top-0 start-0 p-3">
                <Button variant="secondary-outline" size="lg" onClick={() => navigate("/index")}><IoArrowBackSharp /></Button>
            </div>
            <div className="text-center mb-5">
                <div className="text display-4 pt-2 michroma-regular">Edit Account</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-80 d-flex flex-column justify-content-center align-items-center tomorrow-regular rounded-1" onSubmit={saveChanges}>
                    <div className="row mb-3 w-100">
                        <label htmlFor="fullName" className="col-sm-4 col-form-label text-end">Full Name</label>
                        <div className="col-sm-8">
                            <input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    <div className="row mb-3 w-100">
                        <label htmlFor="email" className="col-sm-4 col-form-label text-end">E-mail</label>
                        <div className="col-sm-8">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    <div className="row mb-3 w-100">
                        <label htmlFor="phoneNumber" className="col-sm-4 col-form-label text-end">Phone Number</label>
                        <div className="col-sm-8">
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    <div className="row mb-3 w-100">
                        <label htmlFor="address" className="col-sm-4 col-form-label text-end">Address</label>
                        <div className="col-sm-8">
                            <input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    <div className="row mb-3 w-100">
                        <label htmlFor="oldPassword" className="col-sm-4 col-form-label text-end">Old Password</label>
                        <div className="col-sm-8">
                            <input
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    <div className="row mb-3 w-100">
                        <label htmlFor="newPassword" className="col-sm-4 col-form-label text-end">New Password</label>
                        <div className="col-sm-8">
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    <div className="row mb-3 w-100">
                        <label htmlFor="confirmNewPassword" className="col-sm-4 col-form-label text-end">Confirm New Password</label>
                        <div className="col-sm-8">
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="form-control bg-secondary text-white rounded-1"
                            />
                        </div>
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <div className="d-flex justify-content-center w-100">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-50 rounded-1">Save Information</Button>
                        <Button variant="outline-danger" type="button" className="btn mt-3 w-50 rounded-1" onClick={deleteAccount}>Delete Account</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAccount;


