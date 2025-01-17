import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './custom.css'; // Ensure this import is present

const Navbar = () => {
    const navigate = useNavigate();

    const signOut = async () => {
        //delete the userId cookie by setting it to expire in the past
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //redirect to the login page
        window.location.href = "/";
    }

    const handleEditAccount = () => {
        navigate("/editaccount");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand orbitron" to="/index">CarAndAll</NavLink>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item me-3">
                        <NavLink className="nav-link" to="/particulierhuur">Autohuur Aanvragen</NavLink>
                    </li>

                    {/* Tijdelijk Frontoffice & Backoffice  */}
                    <div className="dropdown me-3">
                        <li className="nav-item">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Schadebeheer
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="schadebeheerDropdown">
                                <li>
                                    <NavLink className="dropdown-item" to="/schades">Schade meldingen Beheren</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/schadeclaims">Schade claims Beheren</NavLink>
                                </li>
                            </ul>
                        </li>
                    </div>
                    <li className="nav-item me-3">
                        <NavLink className="nav-link" to="/uitgifte">Uitgifte Huur Aanvraag</NavLink>
                    </li>
                    <li className="nav-item me-3">
                        <NavLink className="nav-link" to="/inname">Inname Voertuig</NavLink>
                    </li>
                    
                    <li className="nav-item me-3">
                        <NavLink className="nav-link" to="/vehiclebeheer">Voertuigen Blokkeren & Deblokkeren</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                    <li className="nav-item me-3">
                        <button className="btn btn-outline-secondary border-2 rounded-1" onClick={handleEditAccount}>Edit Account</button>
                    </li>
                    <li className="nav-item d-flex align-items-center">
                        <button className="btn btn-outline-danger rounded-1 border-2" onClick={signOut}>Log Uit</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;