import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

/**
 * RentalRequests component handles the display and management of rental requests.
 * It allows users to approve or reject rental requests.
 */
const RentalRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch rental requests from the API
    axios.get('https://localhost:5173/api/rentalrequests')
      .then(response => setRequests(response.data))
      .catch(error => console.error('Error fetching requests:', error));
  }, []);

  /**
   * Handles the approval of a rental request.
   * @param {number} id - The ID of the rental request to approve.
   */
  const handleApprove = (id) => {
    axios.post(`https://localhost:5173/api/rentalrequests/${id}/approve`)
      .then(() => {
        alert('Request approved!');
        setRequests(requests.map(request => 
          request.id === id ? { ...request, status: 'Approved' } : request
        ));
      })
      .catch(error => console.error('Error approving request:', error));
  };

  /**
   * Handles the rejection of a rental request.
   * @param {number} id - The ID of the rental request to reject.
   * @param {string} reason - The reason for rejecting the rental request.
   */
  const handleReject = (id, reason) => {
    axios.post(`https://localhost:5173/api/rentalrequests/${id}/reject`, { reason })
      .then(() => {
        alert('Request rejected!');
        setRequests(requests.map(request => 
          request.id === id ? { ...request, status: 'Rejected', rejectionReason: reason } : request
        ));
      })
      .catch(error => console.error('Error rejecting request:', error));
  };

  return (
    <div>
      <h1>Rental Requests</h1>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Rental Item</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.customerName}</td>
              <td>{request.rentalItem}</td>
              <td>{request.status}</td>
              <td>
                {request.status === "Pending" && (
                  <>
                    <button onClick={() => handleApprove(request.id)}>Approve</button>
                    <button onClick={() => {
                      const reason = prompt('Enter reason for rejection');
                      handleReject(request.id, reason);
                    }}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalRequests;
