import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import EditAccount from './EditAccount.jsx';
import ConfirmEmail from './ConfirmEmail.jsx';
import CarManage from './CarManage.jsx';
import CreateCar from './CreateCar.jsx';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                {/*set to managecars for testing*/}
                <Route path="/" element={<Navigate to="/managecars" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/editaccount" element={<EditAccount />} />
                <Route path="/emailConfirm" element={<ConfirmEmail />} />
                <Route path="/managecars" element={<CarManage />} />
                <Route path="/createcar" element={<CreateCar />} />
            </Routes>
        </Router>
    </StrictMode>,
);
