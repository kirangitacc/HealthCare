import  { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import './index.css';

const AppointmentForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const doctorId = queryParams.get('id');

  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    date: '',
    time: '',
    diagnosis: ''
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const patientId = localStorage.getItem('user_id');
    const datetime = `${formData.date}T${formData.time}`;

    const payload = {
      patientId,
      doctorId,
      patientName: formData.patientName,
      email: formData.email,
      datetime,
      diagnosis: formData.diagnosis
    };

    try {
      const response = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setResponseMessage('✅ Appointment booked successfully!');
        setIsError(false);
        setFormData({
          patientName: '',
          email: '',
          date: '',
          time: '',
          diagnosis: ''
        });
      } else {
        const errorData = await response.json();
        setResponseMessage(`❌ Failed to book appointment: ${errorData.message || 'Unknown error'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setResponseMessage('❌ Network error. Please try again later.');
      setIsError(true);
    }
  };

  return (
    <>
      <Header />
      <div className="form-container">
        <form onSubmit={handleSubmit} className="appointment-form">
          <label>
            Doctor ID: {doctorId} &nbsp;&nbsp; Patient ID: {localStorage.getItem('user_id')}
          </label>

          <label>Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <label>Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
          />

          <button type="submit">Book Appointment</button>

          {responseMessage && (
            <p className={`response-message ${isError ? 'error' : 'success'}`}>
              {responseMessage}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
