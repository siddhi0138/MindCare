from pathlib import Path

import joblib
import pandas as pd

MODEL_PATH = Path(__file__).parent / "ml" / "models" / "wellness_predictor.joblib"
_model = joblib.load(MODEL_PATH)

FEATURE_COLUMNS = [
    "Age",
    "Sleep_Duration",
    "Exercise_Frequency",
    "Social_Media_Usage",
    "Work_Hours",
    "Support_System",
    "Self_Care_Activities",
    "Gender",
    "Region",
    "Financial_Stress",
    "Relationship_Issues",
]


def classify_level(score: float) -> str:
    if score < 4:
        return "Low"
    if score < 7:
        return "Moderate"
    return "High"


def predict(features: dict) -> dict:
    row = pd.DataFrame([features])[FEATURE_COLUMNS]
    stress, anxiety, depression = _model.predict(row)[0]
    return {
        "stress": {"score": round(float(stress), 1), "level": classify_level(stress)},
        "anxiety": {"score": round(float(anxiety), 1), "level": classify_level(anxiety)},
        "depression": {"score": round(float(depression), 1), "level": classify_level(depression)},
    }
