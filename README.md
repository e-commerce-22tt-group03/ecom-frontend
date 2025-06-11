# 🌸 LazaHoa - Online Flower Shop (Frontend)

This is the official **frontend repository** for the LazaHoa course project. This application is the client-facing user interfact built with React, responsible for all visuals, user interactions, and communication with our backend API.

---

### **Table of Contents**

1. [Project Overview](#1-project-overview)
2. [Live Demo](#2-live-demo)
3. [Key Features](#3-key-features)
4. [Technology Stack](#4-technology-stack)
5. [Getting Started: Local Setup from Scratch](#5-getting-started-local-setup-from-scratch)
6. [Project Structure Explained](#6-project-structure-explained)
7. [Available Scripts](#7-available-scripts)
8. [Environment Variables](#8-environment-variables)
9. [Team & Contribution](#9-team--contribution)

---

## **1. Project Overview**

LazaHoa is a modern e-commerce platform designed for an online flower shop. It provides a seamless shopping experience, from browsing products (flowers) with dynamic pricing to a secure checkout process. This repository contains the complete source code for the frontend application. The backend is maintained in a [separate repository](https://github.com/e-commerce-22tt-group03/ecom-backend)

## **2. Live Demo**

**(This section will be update upon development)**

- **Production:** `[Link to be added]`
- **Staging/Dev:** `[Link to be added]`

## **3. Key Features**

- **Dynamic Product Catalog:** Browse, search, filter, and sort flower products.
- **Real-Time Dynamic Pricing:** Prices adjust based on time, product condition, and special events.
- **E-commerce Flow:** Shopping cart, multi-step checkout, and order management.
- **User Authentication:** Secure login, registration, and profile management.
- **Admin Dashboard:** Comprehensive control panel for managing products, users, and orders.
- **Responsive Design:** Smooth experiences across desktop, tablet, and mobile devices.

## **4. Technology Stack**

This project is built with a modern, robust, and scalable technology stack to ensure a high-quality development and user experience.

| Category               | Technology                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Core Framework**     | [React 19](https://reactjs.org/) (with [Vite](https://vitejs.dev/))                                          |
| **State Management**   | [Redux Toolkit](https://redux-toolkit.js.org/)                                                               |
| **Routing**            | [React Router v7](https://reactrouter.com/)                                                                  |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) (for pre-built component classes) |
| **API Communication**  | [Axios](https://axios-http.com/)                                                                             |
| **Linting/Formatting** | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)                                             |
| **Icons**              | [Lucide React](https://lucide.dev/)                                                                          |

## **5. Getting Started: Local Setup from Scratch**

To get this project running on your local machine, you need to have `Git` and `Node.js` installed.

### **Prerequisites:**

- **Git:** [Download & Install Git](https://git-scm.com/downloads)
- **Node.js:** We recommend using a Node Version Manager (**nvm**)
  - For Mac/Linux: [nvm](https://github.com/nvm-sh/nvm)
  - For Windows: [nvm-for-windows](https://github.com/coreybutler/nvm-windows)
  - **Recommended version:** `nvm install 22` and `nvm use 22`.
  - **Alternative versions:** Node.js 20.x or 18.x also work.

### **Installation Steps:**

1.  **Clone the repository:** Open your terminal or command prompt and run:

    ```bash
    git clone https://github.com/e-commerce-22tt-group03/ecom-frontend
    cd ecom-frontend
    ```

2.  **Install dependencies:** Install all the necessary libraries:

    ```bash
    npm install
    ```

    _(This may take a few moments)_

3.  **Set up environment variables:** Create a new file named `.env` in the root of the project folder. Copy the contents of `.env.example` into it.
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and set the backend API URL.
    ```env
    # This is the local address of our backend server
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
4.  **Run the development server:**

    ```bash
    npm run dev
    ```

🎉 **You're all set!** The application should now be
running and accessible at **http://localhost:5173**. The page will automatically reload if you make any changes to the source code.

## **6. Project Structure Explained**

Our folder structure is designed for scalability and separation of concerns.

- `public/`: Static assets that are not processed by Vite (e.g., `favicon.ico`).
- `src/`: Contains all our application's source code.
  - `api/`: Axios instance setup and API endpoint definitions.
  - `app/`: Redux store configuration.
  - `assets/`: Images, logos, and other static assets that will be bundled.
  - `components/`: Shared, reusable UI components (e.g., `Button.jsx`, `Modal.jsx`).
  - `features/`: "Smart" components and Redux logic, grouped by application feature (e.g., `auth`, `products`).
  - `hooks/`: Custom React hooks.
  - `pages/`: Top-level components that correspond to a specific page/route.
  - `routes/`: Main application routing configuration.
  - `utils/`: Helper functions.

## **7. Available Scripts**

- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles and bundles the app for production into the `dist/` folder.
- `npm run lint`: Runs ESLint to find and fix problems in the code.
- `npm run preview`: Serves the production build locally to test it before deployment.

## **8. Environment Variables**

All environment variables used in the frontend must be prefixed with `VITE_`. They are defined in the `.env` file and accessible in the code via `import.meta.env.VITE_VARIABLE_NAME`.

## **9. Team & Contribution**

- **Group:** 03
- **Team Members:**
  - Lê Quốc Huy.
  - Nguyễn Vĩnh Khang.
  - Huỳnh Đăng Khoa.
  - Trương Chí Nhân.
  - Võ Trường Thịnh.
- For development guidelines, coding conventions, and the current task board, please see our **[CONTRIBUTING.md](CONTRIBUTING.md)** file.
