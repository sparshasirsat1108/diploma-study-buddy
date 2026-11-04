# Diploma Study Buddy – DBMS Microproject

A React + Node.js + Express + MySQL version of Diploma Study Buddy for a DBMS microproject.

## Architecture
React frontend → Express/Node.js REST API → MySQL database

## Main DBMS modules
Users, Branches, Semesters, Subjects, Chapters, Notes, Videos, Quizzes, Questions, Progress, Doubts, Feedback and Notifications.

## 1. Create database
Open MySQL Workbench/phpMyAdmin and run:
`database/diploma_study_buddy.sql`

## 2. Configure backend
Copy `backend/.env.example` to `backend/.env` and set your MySQL password.

## 3. Install backend packages
```bash
cd backend
npm install
npm start
```
Backend: http://localhost:5000

## 4. Run frontend
```bash
npm install
npm run dev
```

Optional frontend environment: copy `.env.example` to `.env` if your API is not on localhost:5000.

## Demo accounts
Student: `demo@student.demo` / `demo123`
Admin: `admin@college.demo` / `admin123`

## DBMS concepts demonstrated
Primary keys, foreign keys, one-to-many relationships, normalization-ready relational design, INSERT, SELECT, JOIN, UPDATE/UPSERT, DELETE through cascading relations, CRUD, REST APIs and database-backed progress/doubts/quizzes.

## Suggested viva points
- Why MySQL? Relational DBMS and SQL support.
- Why foreign keys? Maintain referential integrity.
- Why separate subjects and chapters? Reduce redundancy and support normalization.
- How is React connected? REST API through Express.
