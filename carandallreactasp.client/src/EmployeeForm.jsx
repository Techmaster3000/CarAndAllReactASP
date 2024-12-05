import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeForm = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !lastName || !email) {
            setError("Please fill in all fields.");
        } else {
            setError("");
            // Send the employee data to your backend here
            console.log({ name, lastName, email });
        }
    };

    return (
        <div className="container w-50 h-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2">Add Employee</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-50 mb-3"
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-50 mb-3"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-50 mb-3"
                    />
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <Button type="submit" size="lg" className="mt-3 w-50">Submit</Button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;




