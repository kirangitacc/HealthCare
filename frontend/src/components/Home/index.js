import { useState, useEffect } from 'react';
import Header from '../Header';
import Loader from '../Loader';
import './index.css';
import { useNavigate } from 'react-router-dom';
import manLogo from '../Assets/man.png';
import womanLogo from '../Assets/woman.png';

const Home = () => {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://healthcare-sozp.onrender.com/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="home-container">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        {loading ? (
          <Loader />
        ) : (
          <div className="doctor-list">
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="doctor-card" onClick={() => navigate(`/doctor-profile?id=${doc.id}`)}>
                <img src={doc.gender==='Male'?manLogo:womanLogo} alt={doc.name} />
                <h3>{doc.name}</h3>
                <p>{doc.gender}</p>
                <p>{doc.specialization}</p>
                <span className={doc.available ? 'available' : 'unavailable'}>
                  {doc.available ? '✅ Available' : '❌ Unavailable'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
