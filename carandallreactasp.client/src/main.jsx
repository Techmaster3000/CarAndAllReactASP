import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import EditAccount from './EditAccount.jsx';
import ConfirmEmail from './ConfirmEmail.jsx';
import BusinessSignUpPage from './BusinessSignUpPage.jsx';
import AddEmployeesPage from './AddEmployeesPage.jsx';
import CarManage from './CarManage.jsx';
import CreateCar from './CreateCar.jsx';
import ParticulierPage from './ParticulierPage.jsx'
import ParticulierHuur from './ParticulierHuur.jsx';
import UitgiftePage from './UitgiftePage.jsx';
import InnamePage from './InnamePage.jsx';
import SchadePage from './SchadePage.jsx';
import SchadeclaimsPage from './SchadeclaimsPage.jsx';
import VehicleBeheerPage from './VehicleBeheerPage.jsx';

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
                <Route path="/business-signup" element={<BusinessSignUpPage />} />
                <Route path="/add-employees" element={<AddEmployeesPage />} />
                <Route path="/uitgifte" element={<UitgiftePage />} />
                <Route path="/inname" element={<InnamePage />} />
                <Route path="/schades" element={<SchadePage />} />
                <Route path="/schadeclaims" element={<SchadeclaimsPage />} />
                <Route path="/vehiclebeheer" element={<VehicleBeheerPage />} />
            </Routes>
        </Router>
    </StrictMode>,
);
