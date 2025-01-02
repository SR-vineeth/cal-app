# Communication Tracker

Communication Tracker is a web application designed to manage and track communication tasks with companies. It includes modules for administration, user interaction, and reporting and analytics.

## Features

- **Admin Module**: 
  - Add, edit, and delete companies.
  - Manage communication methods and periodicity.
- **User Module**: 
  - View communication schedules in a dashboard.
  - Log communications and update statuses.
  - Calendar view for past and upcoming communications.
  - Can toggle between light and dark modes
- **Reporting and Analytics Module**:
  - Visualize communication frequency, effectiveness, and overdue trends.
  - Download reports in PDF or CSV format.

## Live Demo

The application is deployed and accessible at:  
https://cal-app-six.vercel.app/

---

## Setup Instructions

### Prerequisites

- Node.js (>=14.x)
- MongoDB Atlas (or a local MongoDB instance)

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-url.git
   cd your-project

Backend Setup
1. Navigate to the server folder:
cd backend

2. Install dependencies:
npm install

3. Create a .env file and configure:
MONGO_URI=your_mongodb_connection_string

4. start backend server
node index.js

Frontend setup
1. Navigate to the client folder:
cd frontend

2. Install dependencies:
npm install

3. Start the frontend development server:
npm start

4. Access the application at:
http://localhost:3000

