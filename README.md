# SkillXchange ⚡
### A Cloud-Based Student Skill Exchange Platform

> **Learn from peers. Teach what you know. No fees. No barriers.**

SkillXchange is a full-stack web application where students connect with each other based on complementary skills — if you know Java and want to learn Design, the platform finds someone who knows Design and wants to learn Java. You exchange, you grow.

---

## 🚀 Live Demo

🌐 **Frontend:** [skill-exchange-n717.vercel.app](https://skill-exchange-n717.vercel.app)  
🖥️ **Backend:** AWS EC2 — `13.235.70.78` (Asia Pacific, Mumbai)

---

## 👥 Team

| Name | Roll No | Contribution |
|------|---------|-------------|
| **Himanshu Yadav** | 26073 | Full-Stack Development — Frontend (React.js), Backend (Node.js + Express), Skill Matching Algorithm, Real-Time Chat (Socket.IO), Database Design (MongoDB) |
| **Lavanya Rana** | 26093 | Cloud Infrastructure & Deployment — AWS EC2, Nginx, PM2, MongoDB Atlas, Vercel, DuckDNS, Security Groups |


---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login & registration with bcrypt password encryption
- 🎯 **Smart Skill Matching** — Automatically finds users with complementary skills
- 💬 **Real-Time Chat** — Instant messaging via Socket.IO (sent/delivered/seen status)
- 👤 **User Profiles** — List skills you can teach and skills you want to learn
- ☁️ **Cloud Deployed** — Production-ready deployment on AWS EC2 + Vercel
- 📱 **Responsive UI** — Clean, modern interface built with React.js

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

### Database & Cloud
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🏗️ System Architecture

```
React Frontend (Vercel)
        ↓
Node.js + Express Backend (AWS EC2)
        ↓
MongoDB Atlas (Cloud Database)
        ↓
Socket.IO (Real-Time Communication)
```

**Cloud Setup:**
- Backend hosted on **AWS EC2** (t2.micro, ap-south-1b)
- Nginx configured as **reverse proxy**
- **PM2** for process management & auto-restart
- Frontend deployed on **Vercel** with global CDN
- Domain mapped via **DuckDNS**
- Security managed via **AWS Security Groups**

---

## 📁 Project Structure

```
skill-exchange/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Chat.jsx
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── config/
│   │   └── db.js
│   └── server.js
│
└── README.md
```

---

## ⚙️ How It Works

1. **Register/Login** — User creates an account and logs in securely
2. **Add Skills** — User lists skills they can teach and skills they want to learn
3. **Get Matched** — System automatically finds users with complementary skills
4. **Send Request** — User sends a skill exchange request to a match
5. **Chat in Real Time** — Once accepted, both users can chat instantly via Socket.IO
6. **Exchange & Grow** — Learning happens peer-to-peer, completely free

---

## 🚀 Local Setup

```bash
# Clone the repository
git clone https://github.com/Lavanyarana/skill-exchange.git
cd skill-exchange

# Setup Backend
cd backend
npm install
npm start

# Setup Frontend (new terminal)
cd frontend
npm install
npm start
```

Create a `.env` file in the backend folder:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📊 Results

| Module | Status |
|--------|--------|
| User Registration & Login | ✅ Working |
| Skill Matching Engine | ✅ Working |
| Real-Time Chat (Socket.IO) | ✅ Working |
| Profile Management | ✅ Working |
| AWS EC2 Deployment | ✅ Running |
| Vercel Frontend Deployment | ✅ Live |
| MongoDB Atlas Cloud DB | ✅ Connected |

---

## 🔮 Future Scope

- CI/CD pipeline using GitHub Actions
- Docker containerization
- AI-based intelligent skill recommendations
- Video call integration for live sessions
- Mobile application (Android & iOS)
- AWS Load Balancer for scaling

---

## 📄 License

Developed as part of an academic project at Dronacharya College of Engineering.

---

<p align="center">Made with ❤️ by Himanshu Yadav & Lavanya Rana</p>
