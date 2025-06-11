# Contributing to the LazaHoa Frontend

Welcome, team! This document outlines our development process, coding conventions, and current focus areas. Please read it before you start coding to ensure we all work together smoothly.

---

### **Table of Contents**

1.  [Current Project Status & Roadmap](#1-current-project-status--roadmap)
2.  [How to Contribute (Git Workflow)](#2-how-to-contribute-git-workflow)
3.  [Coding Conventions](#3-coding-conventions)
4.  [Technology-Specific Guidelines](#4-technology-specific-guidelines)
5.  [Key Contacts](#5-key-contacts)

---

### **1. Current Project Status & Roadmap**

**(This is the most important section. Update it regularly!)**

**Last Updated:** 2025-Jun-10

**Current Focus: Phase 1 - Foundational UI & Product Display**

Our immediate goal is to build the core visual components and the product browsing experience. The backend team is working on the initial product and auth endpoints. We will be building the UI in parallel, using mock data for now.

**Tasks In Progress:**

- **Võ Trường Thịnh:**
  - Implementing the main `ProductList` and `ProductCard` components.
  - Setting up the Redux slice (`productsSlice`) to handle product data (currently with mock data).
  - Building the `ProductFilter` sidebar UI.

**Upcoming Tasks (Ready for Pickup):**

- **Task:** Build the `HomePage.jsx` layout, including sections for featured products and promotional banners.
  - **Contact:** Võ Trường Thịnh
  - **Notes:** All components should be responsive. Use placeholder images from `/src/assets/`.
- **Task:** Implement the detailed UI for the `ProductDetailPage.jsx`.
  - **Contact:** Võ Trường Thịnh
  - **Notes:** This page should display multiple images, product description, dynamic price, and an "Add to Cart" button. It does not need to be functional yet.
- **Task:** Create the initial `authSlice.js` and build the UI for `LoginPage.jsx` and `RegisterPage.jsx`.
  - **Contact:** Võ Trường Thịnh
  - **Notes:** Focus on the form layout and validation. No API calls are needed yet.

**Future Phases:**

- **Phase 2:** Connect UI to live backend API, implement cart functionality (Maybe at the end of the **Global Phase 2**).
- **Phase 3:** Checkout flow, payment integration, and user profile pages.
- **Phase 4:** Admin dashboard development.

### **2. How to Contribute (Git Workflow)**

To avoid merge conflicts, we will follow the **Feature Branch Workflow**.

1.  **Never push directly to `main`!**
2.  **Pull the latest changes:** Before starting any work, make sure your local `main` branch is up-to-date.
    ```bash
    git checkout main
    git pull origin main
    ```
3.  **Create a new branch:** Name your branch descriptively.
    - **Format:** `feature/your-name/brief-description`
    - **Example:** `feature/khoa/build-login-page-ui`
    ```bash
    git checkout -b feature/khoa/build-login-page-ui
    ```
4.  **Commit your work:** Make small, frequent commits with clear messages.
    - **Example:** `feat: create login form layout` or `fix: correct button alignment on product card`
5.  **Push your branch:**
    ```bash
    git push origin feature/khoa/build-login-page-ui
    ```
6.  **Create a Pull Request (PR):** Go to the GitHub repository and open a Pull Request from your branch to the `main` branch. Assign at least one other team member to review your code.

### **3. Coding Conventions**

- **Language:** JavaScript (ES6+).
- **Component Naming:** PascalCase for component files and functions (e.g., `ProductCard.jsx`).
- **Function Naming:** camelCase for regular functions (e.g., `handleAddToCart`).
- **Formatting:** We use Prettier for automatic code formatting. Please configure your code editor to "format on save."

### **4. Technology-Specific Guidelines**

- **React:**
  - Use functional components with hooks. Avoid class components.
  - Destructure props for clarity: `const ProductCard = ({ product }) => { ... }`.
- **Redux Toolkit:**
  - All async logic (API calls) must be done using `createAsyncThunk`.
  - Use the `features` directory structure. Each feature has its own slice.
  - Select data from the store in components using `useSelector`.
- **Tailwind CSS / DaisyUI:**
  - Use DaisyUI component classes (`btn`, `card`, `alert`) first.
  - Apply Tailwind utility classes (`mt-4`, `flex`, `text-xl`) for custom tweaks.
  - Avoid writing custom CSS files whenever possible.

### **5. Key Contacts**

- **Frontend Lead / Questions:** Võ Trường Thịnh
- **Backend Lead / API Questions:** Huỳnh Đăng Khoa
- **Backend API Documentation:** `[Link to Postman/Swagger docs - to be added]`
