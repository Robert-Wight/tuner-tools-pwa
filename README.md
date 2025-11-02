# 🚀 Tuner Tools Pro

This is a Progressive Web App (PWA) built to provide specialized calculators, data repositories, and technical manuals for professional loom tuners. It's built with modern web technologies (React, Vite, Tailwind CSS) to be fast, reliable, and usable offline.

---

## 🛠️ Features Implemented

This app is a collection of single-page tools, all accessible from a central main menu.

* **Main Menu:** A responsive, grid-based navigation system to access all tools.
* **Reed Length Calculator:** Calculates reed width based on ends in reed, reed number, and ends in split.
* **Cast Out Calculator:** A complex calculator with two modes (Simple Sum & Pattern) to map a cast out, including support for alignment rules and 'x'/'o' hook patterns.
* **Jacquard Hook Locator:** A data-driven tool to find the absolute harness hook number based on its physical location (Loom, Comber Board, Row, and Position).
* **Loom Timing Diagram:** An interactive SVG-based diagram that shows loom timing events at specific degrees, with clickable pop-up details.
* **Loom Data Repository:** A two-screen data viewer to select any loom configuration and see its detailed technical specifications.
* **Manual Library:** A simple list that links to technical PDF manuals, opening them in a new tab.
* **Glossary of Terms:** An interactive accordion list of common industry terms and their definitions.

---

## 💡 Tech Stack

* **Framework:** [React](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS)
* **Version Control:** [Git](https://git-scm.com/) & [GitHub](https://github.com)

---

## ⚙️ How to Run This Project Locally

1.  **Clone the repository** (or ensure you are in the project folder):
    ```bash
    git clone [https://github.com/your-username/tuner-tools-pwa.git](https://github.com/your-username/tuner-tools-pwa.git)
    cd tuner-tools-pwa
    ```

2.  **Install all packages:**
    (If you get an error, you may be in a nested folder. Make sure you are in the folder with `package.json` in it.)
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will now be running on [http://localhost:5173](http://localhost:5173).
