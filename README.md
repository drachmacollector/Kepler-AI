# 🌌 Kepler AI

An end-to-end, data-driven intelligence system designed to process raw astronomical observations from the Kepler space telescope. Kepler AI separates genuine exoplanets from false positive signals and accurately estimates their physical sizes.

This project was built to tackle the **Stellar Analytics** predictive challenge, providing a fully integrated machine learning pipeline, a high-performance FastAPI backend, and an interactive React frontend.

---

## 🎯 The Predictive Tasks

The universe is incredibly noisy. Binary stars, stellar noise, and instrumental errors often mimic planetary transits. Kepler AI solves two core astrophysical problems:

* **Task A (Classification):** Distinguishes `CONFIRMED` exoplanets from `FALSE POSITIVE` transit signals using a mathematically calibrated **Random Forest Classifier**.
* **Task B (Regression):** Predicts the true physical size of confirmed planets (Planetary Radius, `koi_prad`, in Earth radii) using a **Gradient Boosting Regressor** wrapped in a log-transformation pipeline to handle extreme cosmic variance.

---

## 🔬 Scientific Approach & Data Integrity

To ensure the AI learned genuine astrophysics rather than memorizing dataset shortcuts, we enforced strict data governance:
* **Target Leakage Prevention:** Highly calculated features like `koi_ror` (Planet-to-Star Radius Ratio) were strictly excluded from the training data.
* **Noise Filtration:** Instrumental measurement uncertainties (`_err1`, `_err2`) were stripped out so the models would evaluate planetary geometry rather than telescope hardware limitations.
* **"Ground Truth" Verification:** Unresolved `"CANDIDATE"` signals were entirely dropped to ensure the models trained exclusively on 100% verified astronomical data.
* **Dynamic Feature Engineering:** Physical interaction terms (e.g., `koi_depth * st_radius`) and variance stabilizers (`sqrt(koi_depth)`) are computed dynamically inside the backend API to guarantee pipeline reproducibility during live inference.

---

## 🛠️ Tech Stack & Architecture

**Frontend:**
* React 18 + TypeScript
* Vite (Build Tool)
* TailwindCSS (Styling)

**Backend:**
* FastAPI (Python REST API)
* Uvicorn (ASGI Server)
* Pydantic (Strict Data Validation)

**Machine Learning:**
* Scikit-Learn (Pipelines, Imputation, Scaling)
* XGBoost / Gradient Boosting / Random Forest
* Pandas & NumPy
* Seaborn & Matplotlib (EDA & Visualizations)

---

## 📁 Repository Structure

```text
kepler-ai/
│
├── backend/                  # FastAPI server and ML inference logic
│   ├── app/
│   │   └── main.py           # Core API endpoints (/predict, /health)
│   ├── models/               # Serialized joblib pipelines (.pkl)
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React UI for interactive predictions
│   ├── src/                  # React components and API services
│   ├── public/               # UI assets and background images
│   └── package.json          # Node dependencies
│
├── notebooks/                # Jupyter Notebooks containing the data science workflow
│   ├── EDA.ipynb             # Exploratory Data Analysis, Clustering, & PCA
│   ├── Classification.ipynb  # Task A Pipeline generation
│   └── Regression.ipynb      # Task B Pipeline generation
│
└── supernova_dataset.csv     # Filtered Kepler observational dataset

```

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/kepler-ai.git](https://github.com/your-username/kepler-ai.git)
cd kepler-ai

```

### 2. Start the Backend (FastAPI)

The backend manages real-time feature engineering and routes data through the serialized ML models.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000

```

*The API will be available at `http://localhost:8000`. You can view the interactive documentation at `http://localhost:8000/docs`.*

### 3. Start the Frontend (React/Vite)

The frontend provides a clean interface for users to input raw stellar observations.

```bash
cd ../frontend
npm install

# Run the development server
npm run dev

```

*The web app will be available at `http://localhost:5173`.*

---

## 📡 API Reference

### `POST /predict`

Accepts raw transit observables and stellar physical properties, returning classification probabilities and regression estimates.

**Request Payload:**

```json
{
  "tasks": ["classification", "regression"],
  "features": {
    "koi_period": 9.488,
    "koi_duration": 2.957,
    "koi_depth": 615.8,
    "koi_impact": 0.146,
    "koi_model_snr": 35.8,
    "koi_num_transits": 142.0,
    "st_teff": 5762.0,
    "st_logg": 4.426,
    "st_met": 0.14,
    "st_mass": 0.985,
    "st_radius": 0.989
  }
}

```

**Response Payload:**

```json
{
  "classification": {
    "label": "CONFIRMED",
    "probability": 0.924
  },
  "regression": {
    "predicted_planetary_radius_earth_radii": 2.21
  },
  "metadata": {
    "model_version": "v1.1_production",
    "timestamp": "2026-02-22T..."
  }
}

```

```
