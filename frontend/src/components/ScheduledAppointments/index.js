import { useEffect, useState } from 'react';
import Header from '../Header';
import Loader from '../../components/Loader';
import './index.css';

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const response = await fetch(`https://healthcare-sozp.onrender.com/appointments/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        console.log('Fetched appointments:', data);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDateTime = (datetime) => {
    const dt = new Date(datetime);
    const date = dt.toLocaleDateString();
    const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  return (
    <>
      <Header />
      <div className="appointments-container">
        {loading ? (
          <Loader />
        ) : appointments.length > 0 ? (
          appointments.map(app => {
            const { date, time } = formatDateTime(app.datetime);
            console.log('Appointment:', app);

            return (
              <div key={app.id} className="appointment-card">
                <h3>{app.doctor_name}</h3>
                <p><strong>Specialization:</strong> {app.specialization}</p>
                <p><strong>Date:</strong> {date} at {time}</p>
                <p><strong>Diagnosis:</strong> {app.diagnosis}</p>
                <p><strong>Status:</strong> {app.status || 'Pending'}</p>
              </div>
            );
          })
        ) : (
          <p>No appointments scheduled.</p>
        )}
      </div>
    </>
  );
};

export default ScheduledAppointments;
