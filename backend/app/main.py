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
import os
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime
import pandas as pd
from fastapi import HTTPException


class PredictionRequest(BaseModel):
    features: Dict[str, float]
    tasks: Optional[List[str]] = ["classification"]


app = FastAPI(
    title="Stellar Analytics API",
    version="1.0.0"
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


@app.get("/")
def root():
    return {"message": "Stellar Analytics backend is running."}


@app.get("/health")
def health_check():
    return {
        "model_loaded": classification_model is not None
    }

@app.post("/predict")
def predict(request: PredictionRequest):

    if classification_model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    # ---- Validate Required Features ----
    missing_features = [f for f in EXPECTED_FEATURES if f not in request.features]
    if missing_features:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Missing required features.",
                "missing_features": missing_features
            }
        )

    # ---- Reject Unexpected Features ----
    extra_features = [f for f in request.features if f not in EXPECTED_FEATURES]
    if extra_features:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Unexpected features provided.",
                "extra_features": extra_features
            }
        )

    # ---- Create DataFrame ----
    try:
        input_df = pd.DataFrame([request.features])
        input_df = input_df[EXPECTED_FEATURES]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input structure: {str(e)}")

    # ---- Run Classification ----
    try:
        prediction = classification_model.predict(input_df)[0]
        probability = classification_model.predict_proba(input_df)[0][1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

    label = "CONFIRMED" if prediction == 1 else "FALSE POSITIVE"

    return {
        "classification": {
            "label": label,
            "probability": float(probability)
        },
        "regression": None,
        "metadata": {
            "model_version": "classification_v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    }

def predict(request: PredictionRequest):

    if classification_model is None:
        return {"error": "Model not loaded."}

    # Validate feature presence
    missing_features = [f for f in EXPECTED_FEATURES if f not in request.features]
    if missing_features:
        return {
            "error": "Missing required features.",
            "missing_features": missing_features
        }

    # Create DataFrame with correct ordering
    input_df = pd.DataFrame([request.features])
    input_df = input_df[EXPECTED_FEATURES]

    # Classification inference
    prediction = classification_model.predict(input_df)[0]
    probability = classification_model.predict_proba(input_df)[0][1]

    label = "CONFIRMED" if prediction == 1 else "FALSE POSITIVE"

    return {
        "classification": {
            "label": label,
            "probability": float(probability)
        },
        "regression": None,
        "metadata": {
            "model_version": "classification_v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    }
