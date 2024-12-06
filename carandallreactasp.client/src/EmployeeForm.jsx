import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeForm.css';




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
       <div className="form-container">
            <div className="text-center">
               <h1 className="display-4">Add Employee</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Name"
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                />
                <input
                   type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                {error && <div className="text-danger mt-2">{error}</div>}
                <Button type="submit" variant="primary" size="lg" className="mt-3 w-50">
                    Submit
                </Button>
            </form>
      </div>
    );
}
    

export default EmployeeForm;




