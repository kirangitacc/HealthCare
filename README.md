# HealthCare Appointment Booking App

A full-stack web application that allows patients to browse doctors, view profiles, and book appointments based on availability. Built with **React**, **Node.js**, and **SQLite**, this app showcases modular architecture, secure authentication, responsive UI, and real-world API integration.

---
- vercel - https://health-care-gamma-pied.vercel.app/
---

## 🚀 Features

- 🔐 Secure user authentication using JWT
- 👨‍⚕️ Browse doctors by specialization
- 📄 View detailed doctor profiles with bios and avatars
- 🗕️ Book appointments with available doctors
- 📋 View and manage your scheduled appointments
- 📱 Mobile-first responsive design
- 🧠 Profile avatars dynamically displayed based on gender

---

## 🛠️ Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React, React Router DOM   |
| Backend  | Node.js, Express.js       |
| Database | SQLite                    |
| Auth     | JSON Web Token (JWT)      |
| Styling  | Custom CSS (mobile-first) |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── index.js
│   │   └── index.css
│   ├── Home/
│   │   ├── index.js
│   │   └── index.css
│   ├── ProtectedRoute/
│   │   ├── index.js
│   │   └── index.css
│   ├── Loader/
│   │   ├── index.js
│   │   └── index.css
│   ├── AppointmentForm/
│   │   ├── index.js
│   │   └── index.css
│   ├── ScheduledAppointments/
│   │   ├── index.js
│   │   └── index.css
│   ├── Register/
│   │   ├── index.js
│   │   └── index.css
│   ├── Profile/
│   │   ├── index.js
│   │   └── index.css
│   ├── DoctorProfile/
│   │   ├── index.js
│   │   └── index.css
│   ├── Login/
│   │   ├── index.js
│   │   └── index.css
│   └── Assets/
│       ├── man.png
│       └── woman.png
├── App.js
└── index.js

backend/
├── app.js
├── HealthCare.db
├── Sqlite3.exe
└── package.json
```

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/healthcare-app.git
cd healthcare-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the environment variables

Create a `.env` file in the root directory and add:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=./database.sqlite
```

### 4. Set up the database

Run the following SQL commands to create and seed the database:

```sql
DROP TABLE IF EXISTS doctors;

CREATE TABLE doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  available BOOLEAN NOT NULL,
  bio TEXT,
  gender TEXT CHECK(gender IN ('Male', 'Female')) NOT NULL
);

CREATE TABLE userdetails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  datetime TEXT NOT NULL,
  diagnosis TEXT,
  FOREIGN KEY (patient_id) REFERENCES userdetails(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

You can execute this using any SQLite client or seed it programmatically in your backend.

### 5. Start the backend 

```bash
node app.js # or use nodemon if installed
```

The backend will be available at: [http://localhost:3000](http://localhost:3000)

### 6. Start the frontend server

```bash
npm start
```

The frontend will be available at: [http://localhost:5173](http://localhost:5173) (or React's default)

---

## 🧪 API Endpoints

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/register`             | Register a new user         |
| POST   | `/login`                | Authenticate user           |
| GET    | `/doctors`              | Get list of all doctors     |
| GET    | `/doctor/:id`           | Get doctor by ID            |
| POST   | `/appointments`         | Book an appointment         |
| GET    | `/appointments/:userId` | Get appointments by user ID |
| GET    | `/user/:userId`         | Get user profile            |

---

## 🙌 Contributing

We welcome contributions! To contribute:

1. **Fork** the repo
2. **Create** a new feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add your message here"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** 🚀

---

## 📌 Improvements with More Time

📲 SMS/Email Reminders – Notify patients about upcoming appointments.

📊 Admin Dashboard – Interface for doctors/admins to manage schedules, appointments, and patient history.

🌈 UI/UX Enhancements – Polish the styling, add transitions, and implement better accessibility.

---

## 🧠 Challenges Faced & Solutions
## 🔧 Challenges
- Database locking issues with SQLite

- JWT handling during page refresh

- Conditional component rendering

- Cross-Origin Requests (CORS)

- Frontend-backend port conflict

## ✅ Solutions
- Used async/await carefully and ensured single-write operations at a time

- Persisted auth state using localStorage and validated tokens in API

- Created ProtectedRoute to guard authenticated routes

- Used cors middleware in Express backend

- Set up proxy in frontend and used different ports

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).\
Feel free to use, modify, and distribute it with proper attribution.

---

## 📣 Acknowledgments

Thanks to the open-source community for libraries, tools, and inspiration.\
Special shoutout to **Kiran** for full-stack implementation and UI polish.

