import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const signOut = async () => {
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/index">CarAndAll</NavLink>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <NavLink className="nav-link" to="/particulierhuur">Autohuur Aanvragen</NavLink>
                        <NavLink className="nav-link" to="/uitgifte">Uitgifte Huur Aanvraag</NavLink> {/* tijdelijk hier geplaatst */}
                        <NavLink className="nav-link" to="/inname">Inname Voertuig</NavLink> {/* tijdelijk hier geplaatst */}

                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/editaccount">Edit Account</NavLink>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-danger border-2 font-" onClick={signOut}>Log Uit</button>
                        </li>
                    </ul>
            </div>
        </nav>
    );
};

export default Navbar;