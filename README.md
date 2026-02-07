# Typing Nexus

![Typing Nexus Banner](https://via.placeholder.com/1200x400.png?text=Typing+Nexus+Platform)

**Typing Nexus** is a modern, gamified typing practice platform designed to help users improve their typing speed (WPM) and accuracy. Built with a futuristic "Cyberpunk/Nexus" aesthetic, it features real-time analytics, competitive leaderboards, and secure certification.

## 🚀 Key Features

-   **Advanced Typing Tests**: Real-time WPM & accuracy tracking with dynamic text generation.
-   **User Authentication**:
    -   Secure Email & Password Login.
    -   Google Sign-In integration.
    -   *Note: Phone authentication has been deprecated for security streamlining.*
-   **Admin Panel**:
    -   Manage users, exams, and system settings.
    -   Special "Mahijeet" admin access with auto-creation.
    -   Role-based access control.
-   **Gamification**: Leaderboards, achievement badges, and progress tracking.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

-   **Frontend**: React (TypeScript), Vite
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **Backend / Auth**: Supabase (PostgreSQL, Auth)
-   **State Management**: React Context API, Zustand (if applicable)
-   **Deployment**: Hostinger (Manual/FTP), Vercel (Optional)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/typing-nexus.git
    cd typing-nexus
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 🔐 Admin Access

To access the admin panel:
-   Navigate to `/admin-login`.
-   Use designated admin credentials or the system owner account (e.g., `mahijeet@typingnexus.in`).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

---

*Built with ❤️ by the Typing Nexus Team*
