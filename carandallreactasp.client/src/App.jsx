import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import CreateCompanyForm from './components/CreateCompanyForm';
import AddEmployeeForm from './components/AddEmployeeForm';

function App() {
    const [companyId, setCompanyId] = useState(null); // Bewaart het aangemaakte companyId

    const handleCompanyCreated = (id) => {
        setCompanyId(id); // Sla het gegenereerde companyId op
    };

    return (
        <Router>
            <Navbar bg="dark" expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">Zakelijke Voertuigen</Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/create-company">Bedrijf Aanmaken</Nav.Link>
                            {companyId && (
                                <Nav.Link as={Link} to={`/add-employee/${companyId}`}>
                                    Medewerkers Toevoegen
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Routes>
                    <Route
                        path="/create-company"
                        element={<CreateCompanyForm onCompanyCreated={handleCompanyCreated} />}
                    />
                    <Route
                        path="/add-employee/:companyId"
                        element={<AddEmployeeForm />}
                    />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
