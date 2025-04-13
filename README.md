# Codecrafter - Language Agnostic Visualization Web Application

A dynamic web application that allows users to generate customized visualizations (Bar Charts, 3D Plots, Interactive Charts) by writing their own Python or R code. The backend securely executes the code in Docker containers and serves the generated visualization to the frontend for display.

---

## Objective

Enable users to:
- Select Language → Python or R
- Write custom visualization code
- Generate & view output charts directly in the browser

---

## Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Frontend     | React.js                 |
| Backend      | Flask (Python)           |
| Execution    | Docker Containers        |
| Supported Languages | Python & R        |

---

## Visualization Libraries Used

### Python
- Matplotlib → Static Visualizations
- Plotly → Interactive Visualizations
- Kaleido → Image Export for Plotly

### R
- ggplot2 → Static Visualizations
- plot3D → 3D Visualizations
- plotly → Interactive Visualizations
- webshot2 + PhantomJS → Image Export for R

---

## Features

- Language Selection Dropdown (Python / R)
- Code Editor to write Visualization Code
- Dynamic Execution in Isolated Docker Environment
- Auto Generated Chart Output Display
- Support for Static, Interactive, and 3D Visualizations
- Helpful Dynamic Guidelines per Language
- Clean & Responsive User Interface
- Error Handling & Debug Logs

---

## Folder Structure

codecrafter-language-agnostic-visualization-app/
│
├── backend/
│   ├── app.py
│   ├── Dockerfile-python
│   ├── Dockerfile-r
│   ├── output/              # Auto-generated (Ignored in git)
│   └── requirements.txt
│
├── frontend/
│   └── src/ + Other Files
│
├── .gitignore
├── README.md
└── .env.example

---

## How to Run Locally

### Backend (Flask + Docker)

cd backend/
docker build -t python-runner -f Dockerfile-python .
docker build -t r-runner -f Dockerfile-r .
python app.py

Frontend (React)
cd frontend/
npm install
npm run dev

Sample Visualizations
![Python Bar Chart Output](assets/python_bar_chart.png)
![R 3D Chart Output](assets/r_3d_chart.png)

Demo Video
<a href="assets/Working_Demo.mp4" target="_blank">Click here to View or Download Demo Video</a>

Challenges Faced & Solutions
Challenge	Solution
Flask Auto Restarting on File Save	Disabled use_reloader=False
Plotly Image Export Issues	Used Kaleido (Python) & PhantomJS (R)
Docker Volume Path & Output Management	Standardized to /app/output/visualization.png
Image Caching in Frontend	Added Timestamp based Cache Busting
Matplotlib & R Plot Saving Issues	Dynamic Frontend Guidelines for Users
Git Submodule Issue in Backend	Removed .git from backend & Clean Re-Push
Limitations
* Interactive Charts are exported as static images due to execution environment
* No Real-time interactivity (Image Based Output)
* Synchronous Execution → One request at a time
* No user code sandboxing beyond Docker isolation (Future Scope)

Author
Mohammed Pathariya

Thank You for Visiting!
Feel free to explore, try generating charts, and check out the demo video!
---
