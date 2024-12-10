import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import EditAccount from './EditAccount.jsx';
import ConfirmEmail from './ConfirmEmail.jsx';
import CarManage from './CarManage.jsx';
import CreateCar from './CreateCar.jsx';
import ParticulierPage from './ParticulierPage.jsx'
import ParticulierHuur from './ParticulierHuur.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                {/*set to managecars for testing*/}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/index" element={<ParticulierPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/editaccount" element={<EditAccount />} />
                <Route path="/emailConfirm" element={<ConfirmEmail />} />
                <Route path="/managecars" element={<CarManage />} />
                <Route path="/createcar" element={<CreateCar />} />
                <Route path="/particulierhuur" element={<ParticulierHuur />} />
            </Routes>
        </Router>
    </StrictMode>,
);
