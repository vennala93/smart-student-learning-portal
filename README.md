# Smart Student Learning Portal

A full-stack Java (Spring Boot) + React.js learning management system.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Spring Boot 3.2, Java 17          |
| Security   | Spring Security + JWT             |
| ORM        | Spring Data JPA + Hibernate       |
| Database   | MySQL 8                           |
| Frontend   | React 18 + React Router v6        |
| HTTP       | Axios                             |
| Build      | Maven (backend), npm (frontend)   |

---

## Features

- **JWT Authentication** — register, login, role-based access
- **Three roles** — STUDENT, INSTRUCTOR, ADMIN
- **Course Management** — CRUD, search, categories
- **Enrollment System** — enroll, track progress %
- **Quiz Engine** — MCQ quizzes, auto-grading, result history
- **Student Dashboard** — enrolled courses, progress, quiz scores
- **Instructor Panel** — create/delete courses, add quizzes
- **Admin Panel** — manage all users

---

## Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8
- Node.js 18+ & npm

---

### 1. Database Setup

```sql
CREATE DATABASE learning_portal;
```

---

### 2. Backend Setup

```bash
cd backend

# Edit src/main/resources/application.properties
# Set your MySQL username and password:
#   spring.datasource.username=root
#   spring.datasource.password=your_password

mvn clean install
mvn spring-boot:run
```

Backend runs on **http://localhost:8080**

Tables are auto-created by Hibernate (ddl-auto=update).

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint             | Access |
|--------|----------------------|--------|
| POST   | /api/auth/register   | Public |
| POST   | /api/auth/login      | Public |

### Courses
| Method | Endpoint                        | Access            |
|--------|---------------------------------|-------------------|
| GET    | /api/courses                    | Authenticated     |
| GET    | /api/courses/{id}               | Authenticated     |
| GET    | /api/courses/search?keyword=X   | Authenticated     |
| POST   | /api/courses                    | INSTRUCTOR, ADMIN |
| PUT    | /api/courses/{id}               | INSTRUCTOR, ADMIN |
| DELETE | /api/courses/{id}               | INSTRUCTOR, ADMIN |
| POST   | /api/courses/{id}/enroll        | STUDENT           |
| GET    | /api/courses/my-enrollments     | STUDENT           |
| PUT    | /api/courses/{id}/progress      | STUDENT           |

### Quizzes
| Method | Endpoint                          | Access            |
|--------|-----------------------------------|-------------------|
| GET    | /api/courses/{id}/quizzes         | Authenticated     |
| POST   | /api/courses/{id}/quizzes         | INSTRUCTOR, ADMIN |
| GET    | /api/quizzes/{quizId}             | Authenticated     |
| POST   | /api/quizzes/{quizId}/submit      | STUDENT           |
| GET    | /api/quiz-results/my              | STUDENT           |

### Admin
| Method | Endpoint             | Access |
|--------|----------------------|--------|
| GET    | /api/admin/users     | ADMIN  |
| DELETE | /api/admin/users/{id}| ADMIN  |

---

## Project Structure

```
smart-learning-portal/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/portal/
│       ├── SmartLearningPortalApplication.java
│       ├── config/         SecurityConfig.java
│       ├── controller/     AuthController, CourseController, QuizController, AdminController
│       ├── service/        AuthService, CourseService, QuizService
│       ├── repository/     Repositories.java
│       ├── model/          User, Course, Enrollment, Quiz, Question, QuizResult
│       ├── dto/            AuthDTOs.java, CourseDTOs.java
│       └── security/       JwtUtil.java, JwtAuthFilter.java
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.js
        ├── index.js
        ├── api/            api.js
        ├── context/        AuthContext.js
        ├── components/     Navbar.js
        └── pages/          Login, Register, Dashboard, Courses,
                            CourseDetail, InstructorPage, AdminPage
```

---

## Default Test Users (register via API or UI)

Create users through the `/register` endpoint with these roles:
- `STUDENT` — default role for learners
- `INSTRUCTOR` — can create courses and quizzes
- `ADMIN` — full access including user management
