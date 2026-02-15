EXPECTED_FEATURES = [
    'koi_period',
    'koi_duration',
    'koi_depth',
    'koi_impact',
    'koi_model_snr',
    'koi_num_transits',
    'koi_ror',
    'koi_prad',
    'st_teff',
    'st_logg',
    'st_met',
    'st_mass',
    'st_radius',
    'st_dens',
    'teff_err1',
    'teff_err2',
    'logg_err1',
    'logg_err2',
    'feh_err1',
    'feh_err2',
    'mass_err1',
    'mass_err2',
    'radius_err1',
    'radius_err2'
]

from fastapi import FastAPI
import joblib
import numpy as np
import os
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import pandas as pd
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware



class PredictionRequest(BaseModel):
    features: Dict[str, float]
    tasks: List[str] = Field(default_factory=lambda: ["classification"])


app = FastAPI(
    title="Kepler AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
                "http://localhost:5173",
                "https://kepler-ai-koi.vercel.app"
                ],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Resolve Absolute Path Safely ----

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "classification_pipeline.pkl")

try:
    classification_model = joblib.load(MODEL_PATH)
    print("Classification model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    classification_model = None

REGRESSION_MODEL_PATH = os.path.join(BASE_DIR, "models", "regression_pipeline.pkl")

try:
    regression_model = joblib.load(REGRESSION_MODEL_PATH)
    print("Regression model loaded successfully.")
except Exception as e:
    print(f"Error loading regression model: {e}")
    regression_model = None


@app.get("/")
def root():
    return {"message": "Kepler AI backend is running."}


@app.get("/health")
def health_check():
    return {
        "classification_model_loaded": classification_model is not None,
        "regression_model_loaded": regression_model is not None
    }


@app.post("/predict")
def predict(request: PredictionRequest):

    # ---- Validate Required Features ----
    missing_features = [f for f in EXPECTED_FEATURES if f not in request.features]
    if missing_features:
        raise HTTPException(
            status_code=400,
            detail={"error": "Missing required features.", "missing_features": missing_features}
        )

    extra_features = [f for f in request.features if f not in EXPECTED_FEATURES]
    if extra_features:
        raise HTTPException(
            status_code=400,
            detail={"error": "Unexpected features provided.", "extra_features": extra_features}
        )

    input_df = pd.DataFrame([request.features])[EXPECTED_FEATURES]

    classification_output = None
    regression_output = None

    # ---- Classification ----
    if "classification" in request.tasks:
        if classification_model is None:
            raise HTTPException(500, "Classification model not loaded.")

        prediction = classification_model.predict(input_df)[0]
        probability = classification_model.predict_proba(input_df)[0][
            list(classification_model.classes_).index(1)
        ]

        classification_output = {
            "label": "CONFIRMED" if prediction == 1 else "FALSE POSITIVE",
            "probability": float(probability)
        }

    # ---- Regression ----
    if "regression" in request.tasks:
        if regression_model is None:
            raise HTTPException(500, "Regression model not loaded.")

        reg_df = input_df.copy()
        reg_df["sqrt_koi_depth"] = np.sqrt(reg_df["koi_depth"])
        reg_df["koi_depth_x_st_radius"] = reg_df["koi_depth"] * reg_df["st_radius"]
        reg_df["koi_period_x_st_radius"] = reg_df["koi_period"] * reg_df["st_radius"]

        predicted_radius = regression_model.predict(reg_df)[0]

        regression_output = {
            "predicted_koi_prad": float(predicted_radius)
        }

    return {
        "classification": classification_output,
        "regression": regression_output,
        "metadata": {
            "model_version": "v1_dual_model",
            "timestamp": datetime.utcnow().isoformat()
        }
    }
