import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const signOut = async () => {
        //delete the userId cookie by setting it to expire in the past
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //redirect to the login page
        window.location.href = "/";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/index">CarAndAll</NavLink>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/particulierhuur">Autohuur Aanvragen</NavLink>
                    </li>

                    {/* Tijdelijk Frontoffice & Backoffice  */} 
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/uitgifte">Uitgifte Huur Aanvraag</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/inname">Inname Voertuig</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/schades">Schade meldingen Beheren</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/schadeclaims">Schade claims Beheren</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/vehiclebeheer">Voertuigen Blokkeren & Deblokkeren</NavLink>
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