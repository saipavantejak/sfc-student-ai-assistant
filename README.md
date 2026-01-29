# 🐶 Terrier Helper: SFC Student AI Assistant

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Vite_|_Gemini_API-orange)

**Terrier Helper** is a purpose-built conversational interface designed to streamline the student experience at SFC. By integrating Google's Gemini Large Language Models (LLM) with a responsive frontend, this application provides students with instant, context-aware answers to questions about campus life, academic resources, and administrative procedures.

## 📖 Project Overview

Navigating university resources can often be fragmented and time-consuming. This project solves that information retrieval problem by centralizing knowledge into a natural language interface.

**Core Objectives:**
* **Accessibility:** Reduce the friction in finding campus information.
* **Responsiveness:** Provide 24/7 instant support for common student queries.
* **Scalability:** Built on a modern, modular architecture (React + Vite) allowing for easy expansion of features.

## 🚀 Key Features

* **Generative AI Integration:** Leverages the Google Gemini API for high-fidelity natural language understanding and generation.
* **Context-Aware Responses:** Tailored system instructions ensure the AI acts specifically as a helpful university assistant, minimizing generic or irrelevant outputs.
* **Modern Frontend Architecture:** Built with React and TypeScript for type safety, component modularity, and high performance.
* **Reactive UI:** Utilizes modern hooks (`useEffect`, `useState`) for seamless state management and a lag-free user experience.

## 🛠️ Technical Architecture

This project is constructed as a Single Page Application (SPA) using the following stack:

* **Frontend Framework:** [React](https://react.dev/) (v18+)
* **Build Tooling:** [Vite](https://vitejs.dev/) - Chosen for superior HMR (Hot Module Replacement) and build performance.
* **Language:** [TypeScript](https://www.typescriptlang.org/) - Ensures code reliability and maintainability.
* **AI Service:** [Google Gemini API](https://ai.google.dev/) - Handles the natural language processing workload.

## 📋 Prerequisites

To run this project locally, ensure you have the following configured:

1.  **Node.js:** Version 18.0 or higher ([Download Here](https://nodejs.org/))
2.  **API Key:** A valid Google Cloud API Key with access to Generative Language scopes.

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/saipavantejak/sfc-student-ai-assistant.git](https://github.com/saipavantejak/sfc-student-ai-assistant.git)
    cd sfc-student-ai-assistant
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory to store your credentials securely:
    ```env
    GOOGLE_API_KEY=your_actual_api_key_here
    ```
    *(Note: The `.env` file is excluded from version control via `.gitignore` to protect sensitive keys.)*

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```

5.  **Access the Application**
    Open your browser to `http://localhost:5173` (port may vary based on availability).

## 🤝 Contributing

This project is open for academic collaboration and improvement.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewFeature`)
3.  Commit your Changes (`git commit -m 'Add some NewFeature'`)
4.  Push to the Branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed by [Your Name] for [Course Name/Project Purpose].*
