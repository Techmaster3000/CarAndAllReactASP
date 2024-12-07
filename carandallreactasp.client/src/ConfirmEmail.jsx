import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

const ConfirmEmail = () => {
    const [message, setMessage] = useState('');

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();

    useEffect(() => {
        const userId = query.get('userId');
        const code = query.get('code');
        console.log(userId);
        console.log(code);
        setMessage("loading....");

        const confirmEmail = async () => {
            try {
                const response = await fetch(`/confirmEmail?userId=${userId}&code=${code}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },

                });

                if (response.ok) {
                    setMessage("Email confirmed successfully!");
                } else {
                    setMessage("Error confirming email.");
                }
            } catch (error) {
                console.error(error);
                setMessage("Error confirming email.");
            }
        };
        const reloadOnce = () => {
            if (!sessionStorage.getItem('refreshed')) {
                sessionStorage.setItem('refreshed', 'true');
                window.location.reload();
            }
        }

        if (userId && code) {
            confirmEmail();
        } else {
            setMessage("Invalid confirmation link.");
        }
        reloadOnce();

    }, []);
    const reloadOnce = () => {
        if (!sessionStorage.getItem('refreshed')) {
            sessionStorage.setItem('refreshed', 'true');
            window.location.reload();
        }
    }

    return (
        <div className="container">
            <div className="text-light">
                <h1>Confirm Email</h1>
                <p>{message}</p>
                {message !== "Email confirmed successfully!" && (
                    <button onClick={() => window.location.reload()}>Retry</button>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmail;
