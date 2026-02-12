# KTU Portal Secure Login

A modern, responsive, and secure login portal designed for APJ Abdul Kalam Technological University (KTU). This application provides a unified entry point for Students, Faculty, and Administrators to access academic records, exam registrations, and other university services.

##  Features Implemented

*   **Responsive Design**: Optimized for both desktop and mobile devices. A split-layout design features a rich branding panel on larger screens and a focused login form on all devices.
*   **Role-Based Access**: distinct login flows for **Students**, **Faculty**, and **Admins**.
*   **User-Friendly Interface**:
    *   **Show/Hide Password**: Easily toggle password visibility.
    *   **"Remember Me"**: Option to persist login sessions.
    *   **Interactive Elements**: Smooth animations and focus states for better accessibility.
*   **Security Features**:
    *   **Simulated Captcha**: enhanced security that activates after failed login attempts.
    *   **Input Validation**: Real-time feedback and error handling.
*   **Support & Help**: Integrated quick links for User Manuals, Tech Support, and Contact Information.

##  Tech Stack Used in this Project

*   **Framework**: [React](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Inferred from utility classes)
*   **Icons**: [Lucide React](https://lucide.dev/)

##  Project Structure

```
ktu-portal-secure-login/
├── src/
│   ├── components/
│   │   ├── BrandingPanel.tsx  # Left-side panel with university branding and features
│   │   └── LoginForm.tsx      # Right-side login form with validation and logic
│   ├── App.tsx                # Main layout container
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles and Tailwind imports
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration
```

## How to Run This Project?

Follow these steps to set up and run the project locally.

### Prerequisites

*   **Node.js**: Ensure you have Node.js installed (v16 or higher recommended).
*   **npm**: Included with Node.js.

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd ktu-portal-secure-login
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To create a production-ready build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is for educational and demonstration purposes. All rights reserved by APJ Abdul Kalam Technological University.
