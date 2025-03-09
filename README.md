<p align='center' style='display: flex; align-items: center; justify-content: center;'>
  <img src='frontend/public/Images/iHive.png' alt='iHive Logo' width='60' height='60' style='margin-right: 10px;'>
  <span style='font-size: 48px; font-weight: bold;'>iHive</span>
</p>

## 🚀 Overview

iHive is a **GitHub-inspired repository platform for ideas**, designed to connect **innovators** and **investors**. It enables users to showcase their ideas, find potential funding, and collaborate on impactful projects. With **AI-powered tag generation**, **advanced search**, and plans for **investor-idea matching**, iHive aims to revolutionize idea sharing.

🔗 **Live Demo:** [iHive on Vercel](https://ihive.vercel.app/)

## ✨ Features

- **Idea Repository** – Entrepreneurs can submit, categorize, and manage ideas.
- **Investor Matching (Planned)** – AI will suggest ideas to investors based on interests.
- **AI-Powered Tags** – ChatGPT API automatically generates relevant tags for ideas.
- **Advanced Search** – Keyword-based and AI-enhanced filtering for better idea discovery.
- **User Authentication** – Secure login/signup via **Supabase Auth**.
- **Work-in-Progress Chat Feature** – Future implementation to connect investors & innovators.
- **Responsive Frontend** – Built with **Next.js & TailwindCSS**.
- **Scalable Backend** – Developed with **Node.js (Express) & Supabase (PostgreSQL).**

## 🏗️ Tech Stack

| Component          | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Frontend**       | Next.js, React, TailwindCSS                   |
| **Backend**        | Node.js, Express.js, Supabase (PostgreSQL)    |
| **Authentication** | Supabase Auth                                 |
| **AI Integration** | OpenAI GPT API (for automatic tag generation) |
| **Deployment**     | Vercel (Frontend), Render (Backend)           |

## 🔧 Setup & Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/RizikH/iHive.git
cd iHive
```

### 2️⃣ Install Dependencies

```sh
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in both `backend/` and `frontend/` with the required API keys and database credentials. Example:

**Backend (**``**):**

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_api_key
```

**Frontend (**``**):**

```env
NEXT_PUBLIC_API_BASE_URL=your_backend_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
```

### 4️⃣ Run the Application

#### Start the Backend Server

```sh
cd backend
npm run dev
```

#### Start the Frontend

```sh
cd frontend
npm run dev
```

The frontend should now be accessible at:\
👉 [**http://localhost:3000**](http://localhost:3000)\
The backend API should be running at:\
👉 [**http://localhost:5000**](http://localhost:5000) (or your configured port)

## 🚀 Deployment

### **Frontend (Vercel)**

Deployed on Vercel for easy scalability.\
🔗 [**Live App**](https://ihive.vercel.app/)

### **Backend (Render)**

Deployed on Render with automatic builds.

## 🤖 AI-Powered Investor-Idea Matching (Planned)

We are currently exploring ways to automatically match investors with relevant ideas. Some potential methods:

- **Cosine Similarity** – A technique that calculates how similar two sets of tags or descriptions are. Investors and ideas can be represented as vectors, and their similarity can be measured.
- **OpenAI API** – Using GPT to analyze investor preferences and recommend relevant ideas.
- **Custom ML Model** – A machine learning approach that learns from investor interactions and preferences.

🛠️ We are still researching the best approach and will update this section as development progresses.

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify it.

## 📬 Contact

Have questions? Reach out to us!

- **GitHub Issues:** [Open an Issue](https://github.com/RizikH/iHive/issues)
- **Email:** [support@ihive.com](mailto\:support@ihive.com)

---

🚀 **iHive – Turning Ideas into Reality!**

