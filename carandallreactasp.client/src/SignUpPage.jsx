import React from 'react';
import { Link } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

const SignUpPage = () => {
    return (
        <div className="container w-100 h-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2">Sign Up</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                        <input type="text" placeholder="Full Name" className="mx-2 my-1 bg-transparent no-outline text-white" />
                    </div>
                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
   
                        <input type="email" placeholder="E-mail" className="mx-2 my-1 bg-transparent no-outline text-white" />
                    </div>

                    <div className="d-flex align-items-center bg-secondary p-2 rounded-1 w-25 mb-2">
                      
                        <input type="password" placeholder="Password" className="mx-2 w-100 my-1 bg-transparent no-outline text-white" />
                    </div>
                    <div className="d-flex justify-content-center w-25">
                        <Button variant="primary" type="submit" size="lg" className="btn mt-3 me-2 w-100">Sign Up</Button>
                        <Button href="/login" variant="outline-secondary" size="lg" className="btn mt-3 w-100">Login</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignUpPage;
