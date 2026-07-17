"""Generates a synthetic wellness dataset with intentional, realistic correlations
between lifestyle factors and stress/anxiety/depression scores.

The dataset originally shipped with this repo (mental_health_dataset.csv, project root)
turned out to be pure random noise — every feature had ~0 correlation with the target
scores, so training on it would produce a model that just guesses the mean. This script
regenerates a same-shaped dataset where the targets are actually a function of the
inputs (plus noise), so a model trained on it has something real to learn. It's
synthetic data, not real patient data — documented as such wherever it's used.
"""

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)
N = 4000


def clip_round(values, lo=0, hi=10):
    return np.clip(np.round(values), lo, hi).astype(int)


def generate():
    age = RNG.integers(18, 65, N)
    gender = RNG.choice(["Male", "Female", "Other"], N, p=[0.48, 0.48, 0.04])
    region = RNG.choice(["North America", "Europe", "Asia", "Africa", "South America"], N)

    sleep_duration = np.clip(RNG.normal(6.5, 1.3, N), 3, 10)
    exercise_frequency = RNG.integers(0, 8, N)  # sessions per week
    social_media_usage = np.clip(RNG.normal(3.0, 1.8, N), 0, 10)  # hours/day
    work_hours = np.clip(RNG.normal(45, 12, N), 20, 80)
    financial_stress = RNG.choice(["Yes", "No"], N, p=[0.4, 0.6])
    relationship_issues = RNG.choice(["Yes", "No"], N, p=[0.35, 0.65])
    support_system = RNG.integers(1, 11, N)  # self-rated 1-10
    self_care_activities = RNG.integers(0, 7, N)  # activities per week

    fin_stress_num = (financial_stress == "Yes").astype(float)
    relationship_num = (relationship_issues == "Yes").astype(float)

    stress = (
        4.0
        + 0.045 * (work_hours - 45)
        - 0.55 * (sleep_duration - 6.5)
        + 1.8 * fin_stress_num
        - 0.25 * exercise_frequency
        - 0.2 * self_care_activities
        + 0.15 * social_media_usage
        - 0.1 * support_system
        + RNG.normal(0, 1.1, N)
    )

    anxiety = (
        4.0
        + 2.0 * fin_stress_num
        + 1.6 * relationship_num
        - 0.45 * (sleep_duration - 6.5)
        + 0.25 * social_media_usage
        - 0.35 * support_system / 2
        + RNG.normal(0, 1.2, N)
    )

    depression = (
        6.0
        - 0.35 * support_system
        - 0.3 * self_care_activities
        - 0.15 * exercise_frequency
        + 1.5 * relationship_num
        - 0.25 * (sleep_duration - 6.5)
        + RNG.normal(0, 1.2, N)
    )

    therapy_or_medication = RNG.choice(["Yes", "No"], N, p=[0.3, 0.7])

    df = pd.DataFrame(
        {
            "Age": age,
            "Gender": gender,
            "Region": region,
            "Stress_Level": clip_round(stress),
            "Anxiety_Level": clip_round(anxiety),
            "Depression_Level": clip_round(depression),
            "Sleep_Duration": np.round(sleep_duration, 1),
            "Exercise_Frequency": exercise_frequency,
            "Social_Media_Usage": np.round(social_media_usage, 1),
            "Work_Hours": np.round(work_hours).astype(int),
            "Financial_Stress": financial_stress,
            "Relationship_Issues": relationship_issues,
            "Therapy_or_Medication": therapy_or_medication,
            "Support_System": support_system,
            "Self_Care_Activities": self_care_activities,
        }
    )
    return df


if __name__ == "__main__":
    df = generate()
    out_path = "data/synthetic_wellness_dataset.csv"
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df)} rows to {out_path}")
    print(df[["Stress_Level", "Anxiety_Level", "Depression_Level"]].describe())
