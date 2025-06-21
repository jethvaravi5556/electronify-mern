# ⚡ MERN Ecommerce App – Electronify

This is a full-stack **MERN (MongoDB, Express, React, Node.js)** ecommerce application with product upload, payments, and **AI integration** including image-based search and a smart chatbot.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT + Google OAuth)
- 🖼️ **Product Upload with Cloudinary**
- 💳 **Stripe Payments Integration**
- ⚙️ **Admin Panel** for product & order management
- 🧠 **CLIP-based Image Search** (HuggingFace + FastAPI)
- 🤖 **GPT-powered Chatbot Assistant**
- 📧 **Email Notifications** (Order Confirmation, OTP, etc.)
- 🔁 **OTP-based Forgot Password** (with WebOTP support)
- 🔊 **Sound Demo Feature** for audio-based products
- 📱 **Responsive UI** with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer         | Tech                                  |
|---------------|----------------------------------------|
| Frontend      | React, Vite, Tailwind CSS              |
| Backend       | Node.js, Express, MongoDB (Mongoose)   |
| AI Services   | HuggingFace CLIP (FastAPI), OpenAI GPT |
| Auth & Email  | Google OAuth, JWT, Nodemailer          |
| Media & Pay   | Cloudinary, Stripe                     |

---

## 📁 Folder Structure

MERN/
├── backend/ # Node.js API
│ ├── config/
│ ├── controller/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── utils/
├── clip-embedder-service/ # FastAPI + CLIP model
│ ├── clip_embedder.py
│ └── requirements.txt
├── frontend/ # React + Vite
│ ├── public/
│ └── src/

---

## 🧪 Run Locally

✅ 1. Clone the Repository
    git clone https://github.com/yourusername/mern-ecommerce-app.git
    cd mern-ecommerce-app

📦 2. Install Dependencies
🔧 Backend
    cd backend
    npm install
    cp .env.example .env  # Add your real credentials in .env
💻 Frontend
    cd ../frontend
    npm install
    cp .env.example .env  # Add your frontend env variables
🧠 Python CLIP Embedder (FastAPI)
    cd ../clip-embedder-service
    pip install -r requirements.txt
🚀 3. Run the App
▶️ Start Backend (Node.js)
    cd backend
    nodemon index.js
▶️ Start Frontend (Vite React)
    cd ../frontend
    npm run dev
▶️ Start CLIP Embedding Service
    cd ../clip-embedder-service
    uvicorn main:app --reload --port 5000
    
☁️ Deployment
You can deploy each part as follows:

Layer	Recommended Platform
  Frontend	Vercel / Netlify
  Backend	Render / Railway / Heroku
  Database	MongoDB Atlas
  AI Server	PythonAnywhere / Render

🔐 Environment Variables
Actual .env files are not committed to GitHub.

Use provided .env.example files to set up your environment securely.
## 🖼️ Screenshots

### 🏠 Homepage  
![Homepage](https://github.com/user-attachments/assets/4def1fb8-acb3-405f-8910-a329b7688732)

![Featured Section](https://github.com/user-attachments/assets/c07910b9-72e9-4465-8637-362a70ed0cb2)

---

### 🛒 Cart Page 🛍️  
![Cart Page](https://github.com/user-attachments/assets/d8b6cbf0-3591-41a7-9cd5-b3c2d69c2e71)

---

### 📦 Order Page  
![Order Page](https://github.com/user-attachments/assets/47887533-d6c5-4d34-958f-575cc0884e3b)

---

### 🔊 Sound Demo Page  
![Sound Demo](https://github.com/user-attachments/assets/23d72369-eb6f-44f3-be9b-2682fc95c937)

---

### 🛠️ Admin Dashboard  
![Admin Page](https://github.com/user-attachments/assets/814e3259-cd78-463a-8181-88f024c2bc4d)


👤 Author
Made with ❤️ by **Ravi Jethva**
Open to collaborations, full-stack freelance gigs, and learning opportunities!

📄 License
MIT License – use it freely for personal or commercial projects

Would you like me to:
- Include Markdown badges (build, tech logos)?
- Add collapsible sections?
- Provide a sample `.env.example` for frontend/backend?

Let me know if you'd like this saved as an actual `.md` file to download.








