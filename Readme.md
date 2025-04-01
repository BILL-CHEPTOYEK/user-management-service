# 🛠️ User Management Service  

## 📜 Overview  
User Management Service is a **Node.js + Express** API that provides essential features like **user authentication, profile management, moderation controls, advanced search, filtering, pagination, and rate limiting**. It uses **PostgreSQL with Sequelize** ORM for database interactions.

---

## 🚀 Features  
✅ **User Authentication** (Signup, Login, Logout)  
✅ **JWT-based Authentication & Authorization**  
✅ **Profile Management** (View, Update, Delete Profile)  
✅ **Moderator Controls** (View & Suspend/Delete Users)  
✅ **Advanced Search & Filtering** (By username, email, role)  
✅ **Pagination** (For efficient user listing)  
✅ **Rate Limiting** (Prevents abuse on authentication routes)  

---

## 🏗️ Tech Stack  
| Technology  | Description |
|-------------|------------|
| **Node.js** | Backend runtime |
| **Express.js** | Web framework |
| **PostgreSQL** | Database |
| **Sequelize** | ORM for PostgreSQL |
| **JWT (jsonwebtoken)** | Authentication & security |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variable management |
| **express-rate-limit** | Rate limiting middleware |
| **nodemon** | Development server auto-restart |

---

## ⚙️ Installation & Setup  

### 1️⃣ **Clone the repository**  
```bash
git clone https://github.com/YOUR-USERNAME/user-management-service.git
cd user-management-service
```
---

## 2️⃣ Install Dependencies
```bash
npm install
```
---

## 3️⃣ Setup Environment Variables
Create a .env file in the root directory and add:
# PostgreSQL Credentials

```ini
PG_USER=news_user
PG_HOST=localhost
PG_DATABASE=user_management_db
PG_PASSWORD=news_password
PG_PORT=5432

# Server Port
PORT=5000
# JWT Secret
JWT_SECRET=.....
```
---
## 4️⃣ Setup PostgreSQL Database
```bash
sudo -u postgres psql
CREATE DATABASE user_management_db;
Start PostgreSQL:
sudo systemctl start postgresql
```
Exit PostgreSQL:
```sql
\q
```
## 6️⃣ Start the Server
npm run dev  # Runs in development mode (nodemon)
npm start    # Runs in production mode

By default, the API will be available at:
http://localhost:5000/

## 7 Development & Contribution

Want to contribute? Follow these steps:

    Fork the repository

    Clone it to your local machine

    Create a new branch: git checkout -b feature-name

    Make your changes & commit: git commit -m "Added new feature"

    Push to GitHub: git push origin feature-name

    Open a Pull Request

📜 License

This project is licensed under the MIT License.
