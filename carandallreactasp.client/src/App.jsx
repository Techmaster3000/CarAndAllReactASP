import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LoginPage from "./LoginPage";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/employee-form" element={<EmployeeForm />} />
                <Route path="/employee-list" element={<EmployeeList />} />
            </Routes>
        </Router>
    );
}

export default App;