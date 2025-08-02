import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'HealthCare.db');

let db = null;
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  } catch (e) {
    console.error(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();



const tokenAuthentication = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers['authorization'];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1];
  }
  if (jwtToken === undefined) {
    response.status(401).send('Invalid JWT Token');
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401).send('Invalid JWT Token');
      } else {
        next();
      }
    });
  }
};

app.get('/user/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  console.log('Fetching user data...'+id);
  try {
    const query = 'SELECT * FROM userdetails WHERE id = ?';
    const user = await db.get(query, [id]);
    console.log('profile'+user);  // Added for debugging

    if (user) {
      response.json(user);
    } else {
      response.status(404).send('User not found');
    }
  } catch (error) {
    response.status(500).send('Error fetching user data');
  }
});

app.post('/register', async (request, response) => {
  const { username, email, password, gender, phone, address } = request.body;
  console.log(username, email, password, gender, phone, address);

  if (!username || !email || !password || !gender || !phone || !address) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return response.status(400).json({ message: 'Password is too short' });
  }

  try {
    const userDetails = await db.get(
      `SELECT * FROM userdetails WHERE username = ? OR email = ?`,
      [username, email]
    );
    console.log('User Details:', userDetails);

    if (userDetails === undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);

      const addUserQuery = `
        INSERT INTO userdetails (username, email, password, gender, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.run(addUserQuery, [username, email, hashedPassword, gender, phone, address]);
      response.json({ message: 'User Registered successfully' });
    } else {
      console.log('User already exists:', userDetails);
      response.status(400).json({ message: 'User already exists' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/login', async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await db.get(`SELECT * FROM userdetails WHERE email = ?`, [email]);
    console.log('User:', user);


    if (!user) {
      response.status(400).send('Invalid user');
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const payload = { username: user.username };
        const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
        response.send({ jwtToken,userId:user.id});
      } else {
        response.status(400).send('Invalid password');
      }
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.get('/doctor/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  try {
    const query = 'SELECT * FROM doctors WHERE id = ?';
    const doctor = await db.get(query, [id]);
    if (doctor) {
      response.json(doctor);
    } else {
      response.status(404).send('Doctor not found');
    }
  } catch (error) {
    response.status(500).send('Error fetching doctor');
  }
});

app.post('/appointments', tokenAuthentication, async (request, response) => {
  const { patientId, doctorId, patientName, email, datetime, diagnosis } = request.body;
    console.log('Booking appointment:', request.body);

  if (!patientId || !doctorId || !patientName || !email || !datetime) {
    return response.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, patient_name, email, datetime, diagnosis)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.run(query, [patientId, doctorId, patientName, email, datetime, diagnosis || '']);
    response.json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    response.status(500).send({ error: 'Internal server error while booking appointment' });
  }
});

app.get('/appointments/:userId', tokenAuthentication, async (request, response) => {
  const { userId } = request.params;
  try {
    const query = `
      SELECT a.id, a.datetime, a.diagnosis, d.name AS doctor_name, d.specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
      ORDER BY a.datetime DESC
    `;
    const appointments = await db.all(query, [userId]);
    console.log('Fetched appointments:', appointments); // Debugging log
    response.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    response.status(500).send('Internal server error');
  }
});

app.get('/doctors', tokenAuthentication, async (request, response) => {
  try {
    const query = 'SELECT * FROM doctors';
    const doctors = await db.all(query);
    response.json(doctors);
  } catch (error) {
    response.status(500).send('Error fetching doctors');
  }
});



export default app;
