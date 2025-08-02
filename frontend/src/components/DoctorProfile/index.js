import { useEffect, useState } from 'react';
import { useLocation,useNavigate} from 'react-router-dom';
import Header from '../Header'; 
import Loader from '../Loader'; 
import manLogo from '../Assets/man.png';
import womanLogo from '../Assets/woman.png';
import './index.css';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const doctorId = queryParams.get('id');
    const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/doctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor profile');
        }

        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    } else {
      setLoading(false);
    }
  }, [doctorId]);

  return (
  <>
    <Header />
    <div className="profile-container">
      {loading ? (
        <Loader />
      ) : doctor ? (
      <div className="profile-card">
        <img src={doctor.gender==='Male'?manLogo:womanLogo} alt={doctor.name} />
        <h2>{doctor.name}</h2>
        <p>{doctor.specialization}</p>
        <p>{doctor.bio}</p>
        <span className={doctor.available ? 'available' : 'unavailable'}>
          {doctor.available === 1 ? '✅ Available' : '❌ Unavailable'}
        </span>

      {doctor.available && (
        <div style={{ marginTop: '10px' }}>
          <button className="book-button" onClick={() => navigate(`/appointment?id=${doctor.id}`)}>
            Book Appointment
          </button>
        </div>
      )}
    </div>
      ) : (
        <p>Doctor not found.</p>
      )}
    </div>
  </>
);

};

export default DoctorProfile;
