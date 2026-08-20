# Hospital Appointment System (MedCare Plus)

**Course**: ITUE301 — Advanced Web Development Frameworks  
**University**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CSPIT-IT)  
**Semester**: 5th | AY 2026–27  
**Student Roll No**: `24DCE055` | **Batch**: `B`  
**Tech Stack**: React + Express.js + MongoDB (Mongoose)

---

## Project Overview

MedCare Plus is a full-stack Hospital Appointment Management application designed to handle patient records, doctor availability, and appointment scheduling.

- **Task 1 — React Component Architecture**: Reusable `AppointmentCard` component displaying patientName, doctorName, date, timeSlot, and status with dynamic CSS status badges (`confirmed`, `pending`, `cancelled`).
- **Task 2 — React Routing & State Management**: Configured React Router routes (`/`, `/doctors`, `/booking`) with client-side navigation and an appointment booking form with live state preview.
- **Task 3 — Express REST API + Middleware**: Express backend with endpoints `GET /api/v1/appointments`, `POST /api/v1/appointments`, `GET /api/v1/doctors`, custom `requestLogger` middleware (`[METHOD] [PATH] [TIMESTAMP]`), and global error handler middleware.
- **Task 4 — REST API Consumption in React**: Asynchronous data fetching in `DoctorsPage` with `useEffect()`, managing `data`, `loading`, and `error` states.
- **Task 5 — MongoDB + Mongoose Schema & Validation**: Mongoose schemas for `Patient`, `Doctor`, and `Appointment` with references (`patientId`, `doctorId`), enum validation for blood groups and appointment status, maximum length validation on reason (300 chars), and structured error responses.

---

## Submission Details

- **GitHub Repository**: `itue301-exam-24DCE055-B`
- **PDF Report**: `24DCE055_SetA_Report.pdf`

---

## 1. Environment Setup (.env)

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medcare_hospital
```

---

## 2. Backend Setup & Run Command

Navigate to the `backend/` directory:

```bash
cd backend
npm install
npm start
```
*(or run `node server.js` directly)*

The backend server starts on `http://localhost:5000`.

---

## 3. Frontend Setup & Run Command

Navigate to the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

The React frontend starts on `http://localhost:5173`.

---

## 4. MongoDB Setup

1. Ensure MongoDB server is running locally on port `27017` or provide a valid MongoDB Atlas connection URI in `.env`.
2. Set `MONGO_URI` in `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/medcare_hospital
   ```
3. When the backend starts, it automatically connects via Mongoose and seeds initial doctors if the database is empty.
4. Schema validations (missing required fields, invalid blood groups, status enums, character limits) are handled automatically by the global error middleware.

---

## REST Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/appointments` | Fetch all appointments (populated with patient & doctor info) |
| `POST` | `/api/v1/appointments` | Create a new appointment |
| `GET` | `/api/v1/doctors` | Fetch doctor directory & availability |
| `POST` | `/api/v1/test-validation` | Test Mongoose schema validations |
