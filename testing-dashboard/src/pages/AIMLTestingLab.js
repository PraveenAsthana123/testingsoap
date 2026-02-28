import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'ModelTesting', label:'Model Testing' },
  { key:'DataQualityML', label:'Data Quality' },
  { key:'ModelValidation', label:'Model Validation' },
  { key:'MLOpsPipeline', label:'MLOps Pipeline' },
  { key:'AIChatbot', label:'AI Chatbot' },
  { key:'AISecurityEthics', label:'AI Security' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { ModelTesting:'#e74c3c', DataQualityML:'#3498db', ModelValidation:'#9b59b6', MLOpsPipeline:'#2ecc71', AIChatbot:'#e67e22', AISecurityEthics:'#1abc9c' };

const S = [
  {id:'ML-001',title:'Credit Scoring Model Test',layer:'ModelTesting',framework:'pytest / scikit-learn',language:'Python',difficulty:'Intermediate',
   description:'Validates a credit scoring model by testing prediction accuracy, feature importance ranking, score distribution, and threshold calibration against a holdout dataset of banking customers.',
   prerequisites:'scikit-learn 1.3+, pandas, numpy, trained credit scoring model (pickle), holdout test dataset (CSV)',
   config:'MODEL_PATH=/models/credit_score_v2.pkl\nTEST_DATA=/data/holdout_test.csv\nSCORE_THRESHOLD=0.65\nMIN_AUC=0.78\nMIN_KS=0.35\nDECILE_COUNT=10',
   code:`import pytest
import pandas as pd
import numpy as np
from sklearn.metrics import roc_auc_score, classification_report
import joblib

class TestCreditScoringModel:
    MODEL_PATH = "/models/credit_score_v2.pkl"
    TEST_DATA = "/data/holdout_test.csv"
    THRESHOLD = 0.65

    @pytest.fixture(autouse=True)
    def setup(self):
        self.model = joblib.load(self.MODEL_PATH)
        self.df = pd.read_csv(self.TEST_DATA)
        self.X = self.df.drop(columns=["default_flag"])
        self.y = self.df["default_flag"]
        self.proba = self.model.predict_proba(self.X)[:, 1]

    def test_auc_above_threshold(self):
        auc = roc_auc_score(self.y, self.proba)
        assert auc >= 0.78, f"AUC {auc:.4f} below minimum 0.78"

    def test_ks_statistic(self):
        pos = np.sort(self.proba[self.y == 1])
        neg = np.sort(self.proba[self.y == 0])
        ks = np.max(np.abs(np.linspace(0, 1, len(pos)) -
            np.searchsorted(neg, pos) / len(neg)))
        assert ks >= 0.35, f"KS {ks:.4f} below minimum 0.35"

    def test_score_distribution(self):
        deciles = pd.qcut(self.proba, 10, labels=False)
        rates = self.y.groupby(deciles).mean()
        assert rates.iloc[0] < rates.iloc[-1], "Decile ordering invalid"
        assert rates.iloc[-1] >= 0.3, "Top decile capture rate too low"

    def test_feature_importance_top5(self):
        imp = self.model.feature_importances_
        features = self.X.columns
        top5 = features[np.argsort(imp)[-5:]]
        required = ["credit_utilization", "payment_history"]
        for feat in required:
            assert feat in top5, f"{feat} not in top 5 features"`,
   expectedOutput:`[TEST] ML-001: Credit Scoring Model Test
[INFO] Loading model: /models/credit_score_v2.pkl
[INFO] Test dataset: 15,000 records loaded
[PASS] AUC score: 0.8234 (threshold: 0.78)
[PASS] KS statistic: 0.4102 (threshold: 0.35)
[PASS] Score distribution: monotonic decile ordering confirmed
[INFO] Top decile default rate: 42.3%
[PASS] Feature importance: credit_utilization (0.18), payment_history (0.15)
[INFO] Top 5 features validated against domain expectations
[PASS] All model performance metrics within acceptable range
[INFO] Model version: v2.0, trained: 2026-01-15
───────────────────────────────────
ML-001: Credit Scoring — 4 passed, 0 failed`},

  {id:'ML-002',title:'Fraud Detection Model Validation',layer:'ModelTesting',framework:'pytest / TensorFlow',language:'Python',difficulty:'Advanced',
   description:'Validates a real-time fraud detection model by testing precision-recall tradeoff, false positive rates, latency requirements, and performance on known fraud patterns in transaction data.',
   prerequisites:'TensorFlow 2.15+, pandas, numpy, trained fraud detection model (SavedModel), labeled transaction dataset',
   config:'MODEL_DIR=/models/fraud_detect_v3\nTEST_DATA=/data/fraud_test_transactions.csv\nMAX_FPR=0.02\nMIN_RECALL=0.85\nLATENCY_MS=50\nBATCH_SIZE=1000',
   code:`import pytest
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.metrics import precision_recall_curve, confusion_matrix
import time

class TestFraudDetectionModel:
    MODEL_DIR = "/models/fraud_detect_v3"
    MAX_FPR = 0.02
    MIN_RECALL = 0.85

    @pytest.fixture(autouse=True)
    def setup(self):
        self.model = tf.saved_model.load(self.MODEL_DIR)
        self.df = pd.read_csv("/data/fraud_test_transactions.csv")
        self.X = self.df.drop(columns=["is_fraud"]).values
        self.y = self.df["is_fraud"].values
        self.preds = self.model(tf.constant(self.X, dtype=tf.float32))

    def test_recall_above_threshold(self):
        scores = self.preds.numpy().flatten()
        precision, recall, thresholds = precision_recall_curve(self.y, scores)
        best_idx = np.argmax(recall >= self.MIN_RECALL)
        assert recall[best_idx] >= self.MIN_RECALL, "Recall below 0.85"

    def test_false_positive_rate(self):
        scores = self.preds.numpy().flatten()
        y_pred = (scores >= 0.5).astype(int)
        tn, fp, fn, tp = confusion_matrix(self.y, y_pred).ravel()
        fpr = fp / (fp + tn)
        assert fpr <= self.MAX_FPR, f"FPR {fpr:.4f} exceeds {self.MAX_FPR}"

    def test_inference_latency(self):
        single = tf.constant(self.X[:1], dtype=tf.float32)
        start = time.perf_counter()
        for _ in range(100):
            self.model(single)
        avg_ms = ((time.perf_counter() - start) / 100) * 1000
        assert avg_ms <= 50, f"Latency {avg_ms:.1f}ms exceeds 50ms"

    def test_known_fraud_patterns(self):
        patterns = self.df[self.df["is_fraud"] == 1]
        high_risk = patterns[patterns["amount"] > 10000]
        scores = self.model(tf.constant(high_risk.drop(
            columns=["is_fraud"]).values, dtype=tf.float32))
        detection_rate = (scores.numpy().flatten() >= 0.5).mean()
        assert detection_rate >= 0.92, "High-value fraud detection below 92%"`,
   expectedOutput:`[TEST] ML-002: Fraud Detection Model Validation
[INFO] Loading model: /models/fraud_detect_v3
[INFO] Test transactions: 50,000 records (1.8% fraud rate)
[PASS] Recall: 0.8912 (threshold: 0.85)
[PASS] False positive rate: 0.0148 (max allowed: 0.02)
[INFO] Confusion matrix: TP=802, FP=723, FN=98, TN=48377
[PASS] Inference latency: 3.2ms avg (limit: 50ms)
[INFO] Throughput: 312 predictions/second
[PASS] High-value fraud detection: 94.6% (threshold: 92%)
[INFO] Patterns tested: card-not-present, velocity, geo-anomaly
[PASS] All fraud detection metrics within acceptable range
───────────────────────────────────
ML-002: Fraud Detection — 4 passed, 0 failed`},

  {id:'ML-003',title:'Training Data Quality Assessment',layer:'DataQualityML',framework:'pytest / great_expectations',language:'Python',difficulty:'Intermediate',
   description:'Validates training data quality by checking for missing values, outlier detection, class imbalance, feature distributions, and data leakage across train/test splits.',
   prerequisites:'great_expectations 0.18+, pandas, numpy, training dataset (CSV), schema definition (YAML)',
   config:'TRAIN_DATA=/data/train_dataset.csv\nTEST_DATA=/data/test_dataset.csv\nSCHEMA=/config/data_schema.yaml\nMAX_MISSING_PCT=5.0\nMAX_IMBALANCE_RATIO=10\nOUTLIER_STD=4.0',
   code:`import pytest
import pandas as pd
import numpy as np
import yaml

class TestTrainingDataQuality:
    TRAIN_PATH = "/data/train_dataset.csv"
    TEST_PATH = "/data/test_dataset.csv"
    MAX_MISSING_PCT = 5.0

    @pytest.fixture(autouse=True)
    def setup(self):
        self.train = pd.read_csv(self.TRAIN_PATH)
        self.test = pd.read_csv(self.TEST_PATH)
        with open("/config/data_schema.yaml") as f:
            self.schema = yaml.safe_load(f)

    def test_missing_values(self):
        for col in self.train.columns:
            pct = self.train[col].isna().mean() * 100
            assert pct <= self.MAX_MISSING_PCT, (
                f"Column {col}: {pct:.1f}% missing exceeds {self.MAX_MISSING_PCT}%")

    def test_class_imbalance(self):
        target = self.schema["target_column"]
        counts = self.train[target].value_counts()
        ratio = counts.max() / counts.min()
        assert ratio <= 10, f"Imbalance ratio {ratio:.1f} exceeds 10:1"

    def test_no_data_leakage(self):
        train_ids = set(self.train["customer_id"])
        test_ids = set(self.test["customer_id"])
        overlap = train_ids & test_ids
        assert len(overlap) == 0, f"Data leakage: {len(overlap)} IDs overlap"

    def test_feature_distributions(self):
        numeric_cols = self.train.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            train_mean = self.train[col].mean()
            test_mean = self.test[col].mean()
            drift = abs(train_mean - test_mean) / (train_mean + 1e-8)
            assert drift < 0.25, f"Column {col}: distribution drift {drift:.2f}"

    def test_outlier_detection(self):
        numeric_cols = self.train.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            std = self.train[col].std()
            mean = self.train[col].mean()
            outliers = ((self.train[col] - mean).abs() > 4.0 * std).sum()
            pct = outliers / len(self.train) * 100
            assert pct < 1.0, f"Column {col}: {pct:.2f}% outliers"`,
   expectedOutput:`[TEST] ML-003: Training Data Quality Assessment
[INFO] Train dataset: 120,000 records, 45 features
[INFO] Test dataset: 30,000 records, 45 features
[PASS] Missing values: all columns below 5.0% threshold
[INFO] Max missing: income (3.2%), employment_length (2.8%)
[PASS] Class imbalance: ratio 4.2:1 (max allowed 10:1)
[PASS] No data leakage: 0 overlapping customer IDs
[PASS] Feature distributions: train/test drift within 25% tolerance
[INFO] Max drift: annual_income (8.3%), credit_age (5.1%)
[PASS] Outlier detection: all columns below 1.0% threshold
[INFO] Schema validation: 45/45 columns conform to spec
───────────────────────────────────
ML-003: Data Quality — 5 passed, 0 failed`},

  {id:'ML-004',title:'Bias Detection in Training Data',layer:'DataQualityML',framework:'pytest / fairlearn',language:'Python',difficulty:'Advanced',
   description:'Detects and quantifies bias in training data across protected attributes (gender, age, ethnicity) by measuring disparate impact, statistical parity, and representation ratios for credit decisioning.',
   prerequisites:'fairlearn 0.10+, pandas, numpy, aif360 (optional), labeled training data with demographic attributes',
   config:'TRAIN_DATA=/data/credit_training.csv\nPROTECTED_ATTRS=gender,age_group,ethnicity\nTARGET=approved\nDISPARATE_IMPACT_MIN=0.80\nSTAT_PARITY_MAX=0.10',
   code:`import pytest
import pandas as pd
import numpy as np
from fairlearn.metrics import (
    demographic_parity_difference,
    equalized_odds_difference
)

class TestBiasDetection:
    TRAIN_PATH = "/data/credit_training.csv"
    DISPARATE_IMPACT_MIN = 0.80
    STAT_PARITY_MAX = 0.10

    @pytest.fixture(autouse=True)
    def setup(self):
        self.df = pd.read_csv(self.TRAIN_PATH)
        self.target = self.df["approved"]

    def test_gender_disparate_impact(self):
        male_rate = self.df[self.df["gender"] == "M"]["approved"].mean()
        female_rate = self.df[self.df["gender"] == "F"]["approved"].mean()
        di = min(male_rate, female_rate) / max(male_rate, female_rate)
        assert di >= self.DISPARATE_IMPACT_MIN, (
            f"Gender disparate impact {di:.3f} below {self.DISPARATE_IMPACT_MIN}")

    def test_age_group_parity(self):
        dpd = demographic_parity_difference(
            self.target,
            self.df["approved"],
            sensitive_features=self.df["age_group"])
        assert abs(dpd) <= self.STAT_PARITY_MAX, (
            f"Age group parity diff {dpd:.3f} exceeds {self.STAT_PARITY_MAX}")

    def test_ethnicity_representation(self):
        pop_dist = {"group_a": 0.60, "group_b": 0.25, "group_c": 0.15}
        for group, expected in pop_dist.items():
            actual = (self.df["ethnicity"] == group).mean()
            ratio = actual / expected
            assert 0.8 <= ratio <= 1.2, (
                f"Ethnicity {group}: representation ratio {ratio:.2f}")

    def test_equalized_odds(self):
        y_pred = self.df["model_prediction"]
        eod = equalized_odds_difference(
            self.target, y_pred,
            sensitive_features=self.df["gender"])
        assert abs(eod) <= 0.10, (
            f"Equalized odds diff {eod:.3f} exceeds 0.10")

    def test_label_consistency(self):
        groups = self.df.groupby("gender")
        for name, group in groups:
            similar = group[group["credit_score"].between(700, 750)]
            approval_var = similar["approved"].std()
            assert approval_var < 0.35, (
                f"Label inconsistency in {name}: std={approval_var:.3f}")`,
   expectedOutput:`[TEST] ML-004: Bias Detection in Training Data
[INFO] Dataset: 120,000 records with demographic attributes
[PASS] Gender disparate impact: 0.873 (min: 0.80)
[INFO] Male approval rate: 68.2%, Female approval rate: 59.6%
[PASS] Age group parity difference: 0.067 (max: 0.10)
[INFO] Age groups tested: 18-25, 26-35, 36-50, 51-65, 65+
[PASS] Ethnicity representation: all groups within 80-120% of population
[INFO] group_a: 1.02x, group_b: 0.96x, group_c: 0.88x
[PASS] Equalized odds difference: 0.054 (max: 0.10)
[PASS] Label consistency: approval variance within tolerance
[INFO] Bias audit complete — no critical disparities found
───────────────────────────────────
ML-004: Bias Detection — 5 passed, 0 failed`},

  {id:'ML-005',title:'K-Fold Cross-Validation Stability',layer:'ModelValidation',framework:'pytest / scikit-learn',language:'Python',difficulty:'Intermediate',
   description:'Performs stratified k-fold cross-validation on a credit risk model to assess stability, variance across folds, and consistency of feature importance rankings.',
   prerequisites:'scikit-learn 1.3+, pandas, numpy, feature-engineered training dataset, model hyperparameters (JSON)',
   config:'TRAIN_DATA=/data/credit_features.csv\nN_FOLDS=5\nMIN_AUC=0.75\nMAX_AUC_STD=0.03\nMODEL_TYPE=GradientBoosting\nRANDOM_STATE=42',
   code:`import pytest
import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score

class TestCrossValidationStability:
    N_FOLDS = 5
    MIN_AUC = 0.75
    MAX_AUC_STD = 0.03

    @pytest.fixture(autouse=True)
    def setup(self):
        self.df = pd.read_csv("/data/credit_features.csv")
        self.X = self.df.drop(columns=["default_flag"])
        self.y = self.df["default_flag"]
        self.model = GradientBoostingClassifier(
            n_estimators=200, max_depth=5, random_state=42)

    def test_kfold_auc_stability(self):
        skf = StratifiedKFold(n_splits=self.N_FOLDS, shuffle=True,
            random_state=42)
        aucs = []
        for train_idx, val_idx in skf.split(self.X, self.y):
            self.model.fit(self.X.iloc[train_idx], self.y.iloc[train_idx])
            proba = self.model.predict_proba(self.X.iloc[val_idx])[:, 1]
            aucs.append(roc_auc_score(self.y.iloc[val_idx], proba))
        mean_auc = np.mean(aucs)
        std_auc = np.std(aucs)
        assert mean_auc >= self.MIN_AUC, f"Mean AUC {mean_auc:.4f} < 0.75"
        assert std_auc <= self.MAX_AUC_STD, f"AUC std {std_auc:.4f} > 0.03"

    def test_feature_importance_consistency(self):
        skf = StratifiedKFold(n_splits=self.N_FOLDS, shuffle=True,
            random_state=42)
        top_features_per_fold = []
        for train_idx, val_idx in skf.split(self.X, self.y):
            self.model.fit(self.X.iloc[train_idx], self.y.iloc[train_idx])
            imp = self.model.feature_importances_
            top5 = set(self.X.columns[np.argsort(imp)[-5:]])
            top_features_per_fold.append(top5)
        common = set.intersection(*top_features_per_fold)
        assert len(common) >= 3, f"Only {len(common)} common top-5 features"

    def test_no_overfitting(self):
        skf = StratifiedKFold(n_splits=self.N_FOLDS, shuffle=True,
            random_state=42)
        for train_idx, val_idx in skf.split(self.X, self.y):
            self.model.fit(self.X.iloc[train_idx], self.y.iloc[train_idx])
            train_auc = roc_auc_score(self.y.iloc[train_idx],
                self.model.predict_proba(self.X.iloc[train_idx])[:, 1])
            val_auc = roc_auc_score(self.y.iloc[val_idx],
                self.model.predict_proba(self.X.iloc[val_idx])[:, 1])
            gap = train_auc - val_auc
            assert gap < 0.10, f"Overfit gap {gap:.4f} exceeds 0.10"`,
   expectedOutput:`[TEST] ML-005: K-Fold Cross-Validation Stability
[INFO] Model: GradientBoosting (200 trees, depth=5)
[INFO] Dataset: 120,000 records, 5-fold stratified CV
[PASS] Fold 1 AUC: 0.8145 | Fold 2: 0.8023 | Fold 3: 0.8198
[INFO] Fold 4 AUC: 0.8067 | Fold 5: 0.8112
[PASS] Mean AUC: 0.8109 +/- 0.0062 (std < 0.03)
[PASS] Feature consistency: 4/5 common top features across folds
[INFO] Stable features: credit_utilization, payment_history, debt_ratio, credit_age
[PASS] No overfitting: max train-val gap 0.042 (limit: 0.10)
[INFO] Cross-validation completed in 45.3 seconds
───────────────────────────────────
ML-005: Cross-Validation — 3 passed, 0 failed`},

  {id:'ML-006',title:'Champion-Challenger Model Comparison',layer:'ModelValidation',framework:'pytest / scikit-learn',language:'Python',difficulty:'Advanced',
   description:'Performs champion-challenger comparison between the current production model and a newly trained candidate model using statistical significance tests on key metrics.',
   prerequisites:'scikit-learn 1.3+, scipy, pandas, numpy, champion model (pickle), challenger model (pickle), validation dataset',
   config:'CHAMPION_PATH=/models/champion_v2.pkl\nCHALLENGER_PATH=/models/challenger_v3.pkl\nVAL_DATA=/data/validation_set.csv\nSIG_LEVEL=0.05\nMIN_LIFT=0.02\nPSI_THRESHOLD=0.10',
   code:`import pytest
import pandas as pd
import numpy as np
from scipy import stats
from sklearn.metrics import roc_auc_score, log_loss
import joblib

class TestChampionChallenger:
    SIG_LEVEL = 0.05
    MIN_LIFT = 0.02
    PSI_THRESHOLD = 0.10

    @pytest.fixture(autouse=True)
    def setup(self):
        self.champion = joblib.load("/models/champion_v2.pkl")
        self.challenger = joblib.load("/models/challenger_v3.pkl")
        self.df = pd.read_csv("/data/validation_set.csv")
        self.X = self.df.drop(columns=["default_flag"])
        self.y = self.df["default_flag"]

    def test_challenger_auc_improvement(self):
        champ_auc = roc_auc_score(self.y,
            self.champion.predict_proba(self.X)[:, 1])
        chall_auc = roc_auc_score(self.y,
            self.challenger.predict_proba(self.X)[:, 1])
        lift = chall_auc - champ_auc
        assert lift >= self.MIN_LIFT, (
            f"AUC lift {lift:.4f} below minimum {self.MIN_LIFT}")

    def test_statistical_significance(self):
        champ_scores = self.champion.predict_proba(self.X)[:, 1]
        chall_scores = self.challenger.predict_proba(self.X)[:, 1]
        t_stat, p_value = stats.ttest_rel(chall_scores, champ_scores)
        assert p_value < self.SIG_LEVEL, (
            f"p-value {p_value:.4f} not significant at {self.SIG_LEVEL}")

    def test_population_stability_index(self):
        champ_scores = self.champion.predict_proba(self.X)[:, 1]
        chall_scores = self.challenger.predict_proba(self.X)[:, 1]
        bins = np.linspace(0, 1, 11)
        champ_dist = np.histogram(champ_scores, bins=bins)[0] / len(champ_scores)
        chall_dist = np.histogram(chall_scores, bins=bins)[0] / len(chall_scores)
        champ_dist = np.clip(champ_dist, 1e-6, None)
        chall_dist = np.clip(chall_dist, 1e-6, None)
        psi = np.sum((chall_dist - champ_dist) * np.log(chall_dist / champ_dist))
        assert psi < self.PSI_THRESHOLD, f"PSI {psi:.4f} exceeds {self.PSI_THRESHOLD}"

    def test_challenger_log_loss(self):
        champ_ll = log_loss(self.y, self.champion.predict_proba(self.X))
        chall_ll = log_loss(self.y, self.challenger.predict_proba(self.X))
        assert chall_ll <= champ_ll, (
            f"Challenger log_loss {chall_ll:.4f} > champion {champ_ll:.4f}")`,
   expectedOutput:`[TEST] ML-006: Champion-Challenger Model Comparison
[INFO] Champion: v2.0 (GBM, 150 trees) | Challenger: v3.0 (XGBoost, 300 trees)
[INFO] Validation set: 30,000 records
[PASS] AUC lift: +0.034 (champion: 0.8109, challenger: 0.8449)
[PASS] Statistical significance: p-value=0.0012 (threshold: 0.05)
[INFO] Paired t-test: t-stat=3.24, df=29999
[PASS] Population stability index: 0.037 (threshold: 0.10)
[INFO] Score distribution shift: minimal
[PASS] Log loss improvement: 0.3821 vs 0.4102 (lower is better)
[INFO] Recommendation: PROMOTE challenger v3.0 to champion
───────────────────────────────────
ML-006: Champion-Challenger — 4 passed, 0 failed`},

  {id:'ML-007',title:'Model Deployment Pipeline Test',layer:'MLOpsPipeline',framework:'pytest / MLflow',language:'Python',difficulty:'Intermediate',
   description:'Tests the end-to-end model deployment pipeline including model registration, staging validation, production promotion, and health check verification in a banking ML platform.',
   prerequisites:'MLflow 2.10+, requests, Docker runtime, model registry access, deployment target endpoint',
   config:'MLFLOW_URI=http://mlflow.bank.local:5000\nMODEL_NAME=credit_scoring\nDEPLOY_TARGET=http://ml-serve.bank.local:8080\nSTAGING_ENV=staging\nHEALTH_TIMEOUT=30',
   code:`import pytest
import requests
import time
import mlflow
from mlflow.tracking import MlflowClient

class TestModelDeploymentPipeline:
    MLFLOW_URI = "http://mlflow.bank.local:5000"
    MODEL_NAME = "credit_scoring"
    DEPLOY_TARGET = "http://ml-serve.bank.local:8080"

    @pytest.fixture(autouse=True)
    def setup(self):
        mlflow.set_tracking_uri(self.MLFLOW_URI)
        self.client = MlflowClient()

    def test_model_registration(self):
        versions = self.client.search_model_versions(
            f"name='{self.MODEL_NAME}'")
        assert len(versions) > 0, "No model versions registered"
        latest = max(versions, key=lambda v: int(v.version))
        assert latest.current_stage in ["Staging", "Production"]
        assert latest.run_id is not None

    def test_staging_validation(self):
        resp = requests.post(
            f"{self.DEPLOY_TARGET}/staging/predict",
            json={"features": [0.5, 300, 45000, 0.3, 12, 2, 0.1, 0.8]},
            timeout=10)
        assert resp.status_code == 200
        result = resp.json()
        assert "prediction" in result
        assert 0.0 <= result["prediction"] <= 1.0

    def test_production_promotion(self):
        versions = self.client.search_model_versions(
            f"name='{self.MODEL_NAME}'")
        staging = [v for v in versions if v.current_stage == "Staging"]
        assert len(staging) > 0, "No staging model to promote"
        version = staging[0].version
        self.client.transition_model_version_stage(
            self.MODEL_NAME, version, "Production")
        updated = self.client.get_model_version(self.MODEL_NAME, version)
        assert updated.current_stage == "Production"

    def test_deployment_health_check(self):
        for attempt in range(6):
            try:
                resp = requests.get(
                    f"{self.DEPLOY_TARGET}/health", timeout=5)
                if resp.status_code == 200:
                    health = resp.json()
                    assert health["status"] == "healthy"
                    assert health["model_loaded"] is True
                    return
            except requests.ConnectionError:
                pass
            time.sleep(5)
        pytest.fail("Health check failed after 30 seconds")`,
   expectedOutput:`[TEST] ML-007: Model Deployment Pipeline Test
[INFO] MLflow tracking URI: http://mlflow.bank.local:5000
[PASS] Model registration: credit_scoring v7 found (stage: Staging)
[INFO] Run ID: abc123def456, Experiment: credit_risk_prod
[PASS] Staging validation: prediction=0.342 (valid range 0-1)
[INFO] Inference endpoint responded in 12ms
[PASS] Production promotion: v7 transitioned Staging -> Production
[INFO] Previous production version v6 archived
[PASS] Health check: status=healthy, model_loaded=true
[INFO] Model serving latency: p50=8ms, p95=23ms, p99=45ms
[INFO] Pipeline completed: register -> stage -> validate -> promote
───────────────────────────────────
ML-007: Model Deployment — 4 passed, 0 failed`},

  {id:'ML-008',title:'Model Versioning & Lineage Tracking',layer:'MLOpsPipeline',framework:'pytest / MLflow',language:'Python',difficulty:'Advanced',
   description:'Validates model versioning, artifact lineage tracking, experiment reproducibility, and metadata integrity across the model lifecycle in the banking ML platform.',
   prerequisites:'MLflow 2.10+, pandas, Git integration, model artifact storage (S3/MinIO), experiment database',
   config:'MLFLOW_URI=http://mlflow.bank.local:5000\nARTIFACT_STORE=s3://ml-artifacts/models\nMODEL_NAME=credit_scoring\nMIN_VERSIONS=3\nREQUIRED_TAGS=team,owner,dataset_hash',
   code:`import pytest
import mlflow
from mlflow.tracking import MlflowClient
import hashlib
import json

class TestModelVersioningLineage:
    MLFLOW_URI = "http://mlflow.bank.local:5000"
    MODEL_NAME = "credit_scoring"
    REQUIRED_TAGS = ["team", "owner", "dataset_hash"]

    @pytest.fixture(autouse=True)
    def setup(self):
        mlflow.set_tracking_uri(self.MLFLOW_URI)
        self.client = MlflowClient()

    def test_version_metadata_completeness(self):
        versions = self.client.search_model_versions(
            f"name='{self.MODEL_NAME}'")
        for v in versions:
            run = self.client.get_run(v.run_id)
            for tag in self.REQUIRED_TAGS:
                assert tag in run.data.tags, (
                    f"Version {v.version} missing tag: {tag}")
            assert "auc" in run.data.metrics
            assert "ks_statistic" in run.data.metrics

    def test_artifact_integrity(self):
        versions = self.client.search_model_versions(
            f"name='{self.MODEL_NAME}'")
        latest = max(versions, key=lambda v: int(v.version))
        run = self.client.get_run(latest.run_id)
        artifacts = self.client.list_artifacts(latest.run_id)
        artifact_names = [a.path for a in artifacts]
        assert "model" in artifact_names or "model/model.pkl" in str(artifact_names)
        assert run.data.params.get("model_type") is not None

    def test_experiment_reproducibility(self):
        versions = self.client.search_model_versions(
            f"name='{self.MODEL_NAME}'")
        latest = max(versions, key=lambda v: int(v.version))
        run = self.client.get_run(latest.run_id)
        params = run.data.params
        assert "random_state" in params, "No random seed recorded"
        assert "n_estimators" in params, "Hyperparams not logged"
        assert "max_depth" in params, "Hyperparams not logged"
        source = run.data.tags.get("mlflow.source.git.commit")
        assert source is not None, "Git commit hash not recorded"

    def test_version_lineage_chain(self):
        versions = self.client.search_model_versions(
            f"name='{self.MODEL_NAME}'")
        assert len(versions) >= 3, "Fewer than 3 model versions"
        sorted_v = sorted(versions, key=lambda v: int(v.version))
        for i in range(1, len(sorted_v)):
            curr_run = self.client.get_run(sorted_v[i].run_id)
            prev_run = self.client.get_run(sorted_v[i - 1].run_id)
            curr_hash = curr_run.data.tags.get("dataset_hash", "")
            prev_hash = prev_run.data.tags.get("dataset_hash", "")
            assert curr_hash != "" and prev_hash != ""`,
   expectedOutput:`[TEST] ML-008: Model Versioning & Lineage Tracking
[INFO] MLflow registry: credit_scoring (7 versions)
[PASS] Metadata completeness: all versions have required tags
[INFO] Tags validated: team, owner, dataset_hash across 7 versions
[PASS] Artifact integrity: model artifacts present and valid
[INFO] Latest: v7, model.pkl (245MB), run_id: abc123def456
[PASS] Experiment reproducibility: random_state, hyperparams, git commit logged
[INFO] Git commit: e4f5a6b, random_state: 42, n_estimators: 300
[PASS] Version lineage: 7 versions with dataset hash chain
[INFO] Dataset hashes: unique per version, traceable to source
[INFO] Lineage: data_v1 -> features_v3 -> model_v7
───────────────────────────────────
ML-008: Model Versioning — 4 passed, 0 failed`},

  {id:'ML-009',title:'AI Chatbot Intent Classification Test',layer:'AIChatbot',framework:'pytest / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests an AI banking chatbot by validating intent classification accuracy, entity extraction, confidence thresholds, and fallback handling for customer service interactions.',
   prerequisites:'Chatbot NLU service endpoint, test utterance dataset (JSON), intent taxonomy document',
   config:'CHATBOT_URL=http://chatbot.bank.local:8080/api/v1\nCONFIDENCE_THRESHOLD=0.75\nFALLBACK_INTENT=handoff_to_agent\nMAX_RESPONSE_TIME_MS=500\nTEST_UTTERANCES=/data/test_utterances.json',
   code:`import pytest
import requests
import json
import time

class TestChatbotIntentClassification:
    CHATBOT_URL = "http://chatbot.bank.local:8080/api/v1"
    CONFIDENCE_THRESHOLD = 0.75

    @pytest.fixture(autouse=True)
    def setup(self):
        with open("/data/test_utterances.json") as f:
            self.utterances = json.load(f)

    def test_intent_accuracy(self):
        correct = 0
        total = len(self.utterances)
        for item in self.utterances:
            resp = requests.post(f"{self.CHATBOT_URL}/classify",
                json={"text": item["text"], "session_id": "test_001"},
                timeout=5)
            assert resp.status_code == 200
            predicted = resp.json()["intent"]
            if predicted == item["expected_intent"]:
                correct += 1
        accuracy = correct / total
        assert accuracy >= 0.85, f"Intent accuracy {accuracy:.2%} below 85%"

    def test_entity_extraction(self):
        resp = requests.post(f"{self.CHATBOT_URL}/classify", json={
            "text": "Transfer 5000 rupees to account 1234567890",
            "session_id": "test_002"}, timeout=5)
        entities = resp.json()["entities"]
        assert any(e["type"] == "amount" and e["value"] == "5000"
            for e in entities)
        assert any(e["type"] == "account_number"
            and e["value"] == "1234567890" for e in entities)

    def test_confidence_threshold(self):
        resp = requests.post(f"{self.CHATBOT_URL}/classify", json={
            "text": "asdfjkl random gibberish xyz",
            "session_id": "test_003"}, timeout=5)
        result = resp.json()
        assert result["confidence"] < self.CONFIDENCE_THRESHOLD
        assert result["intent"] == "handoff_to_agent"

    def test_response_latency(self):
        start = time.perf_counter()
        resp = requests.post(f"{self.CHATBOT_URL}/classify", json={
            "text": "What is my account balance?",
            "session_id": "test_004"}, timeout=5)
        elapsed_ms = (time.perf_counter() - start) * 1000
        assert resp.status_code == 200
        assert elapsed_ms <= 500, f"Latency {elapsed_ms:.0f}ms exceeds 500ms"`,
   expectedOutput:`[TEST] ML-009: AI Chatbot Intent Classification Test
[INFO] Test utterances loaded: 200 samples across 15 intents
[PASS] Intent accuracy: 91.5% (threshold: 85%)
[INFO] Misclassified: 17/200 (mostly balance_inquiry vs account_status)
[PASS] Entity extraction: amount=5000, account=1234567890
[INFO] Entities detected: amount, account_number, currency
[PASS] Low confidence fallback: gibberish -> handoff_to_agent (conf: 0.23)
[INFO] Confidence threshold: 0.75, fallback correctly triggered
[PASS] Response latency: 82ms (limit: 500ms)
[INFO] p50: 65ms, p95: 145ms, p99: 312ms
───────────────────────────────────
ML-009: Chatbot Intent — 4 passed, 0 failed`},

  {id:'ML-010',title:'Conversational Flow & Context Test',layer:'AIChatbot',framework:'pytest / requests',language:'Python',difficulty:'Advanced',
   description:'Tests multi-turn conversational flow including context retention, slot filling, dialogue state management, and graceful error recovery in a banking AI chatbot.',
   prerequisites:'Chatbot dialogue service endpoint, conversation state store (Redis), test dialogue scripts (JSON)',
   config:'CHATBOT_URL=http://chatbot.bank.local:8080/api/v1\nCONTEXT_TTL=300\nMAX_TURNS=20\nSLOT_FILL_TIMEOUT=60\nDIALOGUE_SCRIPTS=/data/test_dialogues.json',
   code:`import pytest
import requests
import uuid

class TestConversationalFlow:
    CHATBOT_URL = "http://chatbot.bank.local:8080/api/v1"

    def new_session(self):
        return str(uuid.uuid4())

    def send_message(self, session_id, text):
        resp = requests.post(f"{self.CHATBOT_URL}/chat",
            json={"text": text, "session_id": session_id}, timeout=5)
        assert resp.status_code == 200
        return resp.json()

    def test_multi_turn_context_retention(self):
        sid = self.new_session()
        r1 = self.send_message(sid, "I want to check my savings account")
        assert r1["context"]["account_type"] == "savings"
        r2 = self.send_message(sid, "What is the balance?")
        assert r2["context"]["account_type"] == "savings"
        assert r2["intent"] == "check_balance"
        r3 = self.send_message(sid, "And the last 5 transactions")
        assert r3["context"]["account_type"] == "savings"
        assert r3["intent"] == "transaction_history"
        assert r3["context"]["transaction_count"] == 5

    def test_slot_filling_flow(self):
        sid = self.new_session()
        r1 = self.send_message(sid, "I want to transfer money")
        assert r1["action"] == "ask_slot"
        assert "amount" in r1["missing_slots"]
        r2 = self.send_message(sid, "5000 rupees")
        assert "to_account" in r2["missing_slots"]
        r3 = self.send_message(sid, "To account 9876543210")
        assert len(r3["missing_slots"]) == 0
        assert r3["action"] == "confirm_transfer"
        assert r3["context"]["amount"] == 5000

    def test_context_switch_handling(self):
        sid = self.new_session()
        r1 = self.send_message(sid, "Check my loan status")
        assert r1["intent"] == "loan_status"
        r2 = self.send_message(sid, "Actually, show my credit card bill")
        assert r2["intent"] == "credit_card_bill"
        assert r2["context"]["topic_switch"] is True

    def test_error_recovery(self):
        sid = self.new_session()
        r1 = self.send_message(sid, "Transfer money")
        r2 = self.send_message(sid, "all of it")
        assert r2["action"] == "clarify"
        assert "amount" in r2["clarification_needed"]
        r3 = self.send_message(sid, "Sorry, 10000 rupees")
        assert r3["context"]["amount"] == 10000`,
   expectedOutput:`[TEST] ML-010: Conversational Flow & Context Test
[INFO] Chatbot endpoint: http://chatbot.bank.local:8080/api/v1
[PASS] Multi-turn context: account_type=savings retained across 3 turns
[INFO] Context chain: account_select -> balance_check -> transaction_history
[PASS] Slot filling: 3-turn flow completed (amount -> to_account -> confirm)
[INFO] Slots filled: amount=5000, to_account=9876543210, currency=INR
[PASS] Context switch: loan_status -> credit_card_bill (topic_switch=true)
[INFO] Previous context preserved in conversation stack
[PASS] Error recovery: ambiguous input -> clarification -> resolved
[INFO] Clarification triggered for: "all of it" (invalid amount)
[INFO] Dialogue state machine: 4 flows tested, all transitions valid
───────────────────────────────────
ML-010: Conversational Flow — 4 passed, 0 failed`},

  {id:'ML-011',title:'Adversarial Attack Testing',layer:'AISecurityEthics',framework:'pytest / adversarial-robustness-toolbox',language:'Python',difficulty:'Advanced',
   description:'Tests model robustness against adversarial attacks including feature perturbation, evasion attacks, data poisoning detection, and model extraction attempts on a banking ML model.',
   prerequisites:'adversarial-robustness-toolbox 1.16+, scikit-learn, numpy, trained production model, adversarial test suite',
   config:'MODEL_PATH=/models/credit_score_v2.pkl\nTEST_DATA=/data/adversarial_test.csv\nPERTURB_EPSILON=0.1\nMAX_FLIP_RATE=0.05\nEXTRACTION_QUERY_LIMIT=1000',
   code:`import pytest
import numpy as np
import joblib
from sklearn.metrics import accuracy_score
from art.attacks.evasion import FastGradientMethod
from art.estimators.classification import SklearnClassifier

class TestAdversarialRobustness:
    EPSILON = 0.1
    MAX_FLIP_RATE = 0.05

    @pytest.fixture(autouse=True)
    def setup(self):
        self.model = joblib.load("/models/credit_score_v2.pkl")
        import pandas as pd
        df = pd.read_csv("/data/adversarial_test.csv")
        self.X = df.drop(columns=["default_flag"]).values.astype(np.float32)
        self.y = df["default_flag"].values

    def test_feature_perturbation_robustness(self):
        original_preds = self.model.predict(self.X)
        perturbed_X = self.X + np.random.uniform(
            -self.EPSILON, self.EPSILON, self.X.shape)
        perturbed_preds = self.model.predict(perturbed_X)
        flip_rate = (original_preds != perturbed_preds).mean()
        assert flip_rate <= self.MAX_FLIP_RATE, (
            f"Flip rate {flip_rate:.3f} exceeds {self.MAX_FLIP_RATE}")

    def test_evasion_attack_resistance(self):
        classifier = SklearnClassifier(model=self.model)
        attack = FastGradientMethod(estimator=classifier, eps=0.2)
        X_adv = attack.generate(x=self.X[:500])
        clean_acc = accuracy_score(self.y[:500], self.model.predict(self.X[:500]))
        adv_acc = accuracy_score(self.y[:500], self.model.predict(X_adv))
        drop = clean_acc - adv_acc
        assert drop < 0.15, f"Accuracy drop {drop:.3f} under attack exceeds 15%"

    def test_input_validation_boundaries(self):
        extreme_inputs = np.full_like(self.X[:1], 1e10)
        try:
            pred = self.model.predict_proba(extreme_inputs)
            assert 0.0 <= pred[0][1] <= 1.0, "Unbounded prediction on extreme input"
        except (ValueError, OverflowError):
            pass  # Model correctly rejects extreme inputs

    def test_model_extraction_detection(self):
        query_count = 0
        predictions = []
        for i in range(1000):
            synthetic = np.random.uniform(0, 1, self.X.shape[1]).reshape(1, -1)
            pred = self.model.predict_proba(synthetic.astype(np.float32))
            predictions.append(pred[0][1])
            query_count += 1
        unique_ratio = len(set(np.round(predictions, 4))) / len(predictions)
        assert unique_ratio > 0.1, "Model outputs too uniform (extraction risk)"`,
   expectedOutput:`[TEST] ML-011: Adversarial Attack Testing
[INFO] Model: credit_score_v2.pkl loaded (GBM, 200 trees)
[PASS] Feature perturbation: flip rate 0.023 (epsilon=0.1, max=0.05)
[INFO] Perturbed 10,000 samples with uniform noise
[PASS] Evasion attack (FGSM): accuracy drop 8.2% (limit: 15%)
[INFO] Clean accuracy: 87.4%, Adversarial accuracy: 79.2%
[PASS] Input boundary validation: extreme inputs handled safely
[INFO] Extreme values (1e10) produced bounded predictions
[PASS] Model extraction: output diversity 0.67 (min: 0.10)
[INFO] 1000 synthetic queries analyzed for extraction patterns
[FAIL] Warning: consider rate limiting prediction API endpoint
───────────────────────────────────
ML-011: Adversarial Testing — 4 passed, 0 failed`},

  {id:'ML-012',title:'Fairness & Explainability Audit',layer:'AISecurityEthics',framework:'pytest / shap / fairlearn',language:'Python',difficulty:'Advanced',
   description:'Conducts a comprehensive fairness and explainability audit on a credit decision model including SHAP explanations, fairness metrics across demographics, and regulatory compliance checks.',
   prerequisites:'shap 0.44+, fairlearn 0.10+, lime 0.2+, pandas, numpy, trained model, audit dataset with demographics',
   config:'MODEL_PATH=/models/credit_score_v2.pkl\nAUDIT_DATA=/data/fairness_audit.csv\nPROTECTED_ATTRS=gender,age_group\nEXPLAIN_SAMPLES=500\nSHAP_BACKGROUND=100\nMAX_DISPARITY=0.10',
   code:`import pytest
import pandas as pd
import numpy as np
import shap
import joblib
from fairlearn.metrics import MetricFrame
from sklearn.metrics import accuracy_score, recall_score

class TestFairnessExplainability:
    MAX_DISPARITY = 0.10

    @pytest.fixture(autouse=True)
    def setup(self):
        self.model = joblib.load("/models/credit_score_v2.pkl")
        self.df = pd.read_csv("/data/fairness_audit.csv")
        self.X = self.df.drop(columns=["default_flag", "gender", "age_group"])
        self.y = self.df["default_flag"]
        self.preds = self.model.predict(self.X)

    def test_shap_explanations_valid(self):
        explainer = shap.TreeExplainer(self.model)
        shap_values = explainer.shap_values(self.X[:500])
        assert shap_values is not None
        assert shap_values.shape == self.X[:500].shape
        feature_imp = np.abs(shap_values).mean(axis=0)
        top_feature_idx = np.argmax(feature_imp)
        assert feature_imp[top_feature_idx] > 0, "No feature has positive SHAP"

    def test_gender_fairness_metrics(self):
        mf = MetricFrame(
            metrics={"accuracy": accuracy_score, "recall": recall_score},
            y_true=self.y, y_pred=self.preds,
            sensitive_features=self.df["gender"])
        disparity = mf.difference()
        assert disparity["accuracy"] <= self.MAX_DISPARITY, (
            f"Gender accuracy disparity {disparity['accuracy']:.3f}")
        assert disparity["recall"] <= self.MAX_DISPARITY, (
            f"Gender recall disparity {disparity['recall']:.3f}")

    def test_age_group_fairness(self):
        mf = MetricFrame(
            metrics={"accuracy": accuracy_score},
            y_true=self.y, y_pred=self.preds,
            sensitive_features=self.df["age_group"])
        group_metrics = mf.by_group
        min_acc = group_metrics["accuracy"].min()
        max_acc = group_metrics["accuracy"].max()
        assert (max_acc - min_acc) <= 0.12, (
            f"Age group accuracy gap {max_acc - min_acc:.3f} exceeds 0.12")

    def test_explanation_consistency(self):
        explainer = shap.TreeExplainer(self.model)
        sample_a = self.X.iloc[0:1]
        sample_b = self.X.iloc[0:1].copy()
        shap_a = explainer.shap_values(sample_a)
        shap_b = explainer.shap_values(sample_b)
        assert np.allclose(shap_a, shap_b, atol=1e-6), (
            "SHAP values inconsistent for identical inputs")

    def test_regulatory_adverse_action(self):
        explainer = shap.TreeExplainer(self.model)
        denied = self.X[self.preds == 1][:50]
        shap_values = explainer.shap_values(denied)
        for i in range(len(denied)):
            top_reasons = np.argsort(np.abs(shap_values[i]))[-3:]
            assert len(top_reasons) >= 3, (
                f"Cannot generate 3 adverse action reasons for sample {i}")`,
   expectedOutput:`[TEST] ML-012: Fairness & Explainability Audit
[INFO] Model: credit_score_v2.pkl | Audit dataset: 50,000 records
[PASS] SHAP explanations: valid for 500 samples
[INFO] Top SHAP features: credit_utilization (0.18), payment_history (0.14), debt_ratio (0.11)
[PASS] Gender fairness: accuracy disparity 0.034, recall disparity 0.048
[INFO] Male accuracy: 86.2%, Female accuracy: 85.8%
[PASS] Age group fairness: max accuracy gap 0.089 (limit: 0.12)
[INFO] Age groups: 18-25 (83.1%), 26-35 (86.4%), 36-50 (87.2%), 51+ (85.5%)
[PASS] Explanation consistency: SHAP values deterministic for identical inputs
[PASS] Adverse action reasons: top 3 reasons generated for all 50 denied applicants
[INFO] Regulatory compliance: ECOA adverse action notice requirements met
───────────────────────────────────
ML-012: Fairness & Explainability — 5 passed, 0 failed`},
];

export default function AIMLTestingLab() {
  const [tab, setTab] = useState('ModelTesting');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
    if (s.layer !== tab) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) { setOutput(prev => prev + (prev ? '\n' : '') + lines[i]); setProgress(Math.round(((i + 1) / lines.length) * 100)); i++; }
      else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = S.filter(s => s.layer === tab).length;
  const passedTab = S.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page:{minHeight:'100vh',background:`linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`,color:C.text,fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",padding:'18px 22px 40px'},
    h1:{fontSize:28,fontWeight:800,margin:0,background:`linear-gradient(90deg,${C.accent},#3498db)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sub:{fontSize:13,color:C.muted,marginTop:4},
    statsBar:{display:'flex',justifyContent:'center',gap:24,marginBottom:14,flexWrap:'wrap'},
    stat:{background:C.card,borderRadius:8,padding:'6px 18px',fontSize:13,border:`1px solid ${C.border}`},
    split:{display:'flex',gap:16,height:'calc(100vh - 160px)',minHeight:500},
    left:{width:'38%',minWidth:320,display:'flex',flexDirection:'column',gap:10},
    right:{flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'},
    tabBar:{display:'flex',gap:4,flexWrap:'wrap'},
    tabBtn:(a)=>({padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:a?C.accent:C.card,color:a?'#0a0a1a':C.text}),
    input:{flex:1,padding:'7px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:13,outline:'none',minWidth:120},
    select:{padding:'6px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:12,outline:'none'},
    list:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,paddingRight:4},
    card:(a)=>({padding:'10px 14px',borderRadius:8,background:a?C.cardHover:C.card,border:`1px solid ${a?C.accent:C.border}`,cursor:'pointer'}),
    badge:(c)=>({display:'inline-block',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700,background:c+'22',color:c,marginRight:4}),
    dot:(st)=>({display:'inline-block',width:8,height:8,borderRadius:'50%',background:st==='passed'?C.accent:C.muted,marginRight:6}),
    panel:{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,overflowY:'auto'},
    editor:{width:'100%',minHeight:200,maxHeight:280,padding:12,borderRadius:8,border:`1px solid ${C.border}`,background:C.editorBg,color:C.editorText,fontFamily:"'Fira Code','Consolas',monospace",fontSize:12,lineHeight:1.6,resize:'vertical',outline:'none',whiteSpace:'pre',overflowX:'auto'},
    btn:(bg)=>({padding:'7px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:bg||C.accent,color:(bg===C.danger||bg==='#555')?'#fff':'#0a0a1a'}),
    outBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,fontFamily:"'Fira Code','Consolas',monospace",fontSize:11,color:C.accent,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:60,maxHeight:180,overflowY:'auto'},
    progBar:{height:4,borderRadius:2,background:'#0a2744',marginTop:6},
    progFill:(p)=>({height:'100%',borderRadius:2,width:p+'%',background:p===100?C.accent:'#3498db',transition:'width 0.3s'}),
    progO:{height:6,borderRadius:3,background:'#0a2744',marginBottom:8},
    progOF:(p)=>({height:'100%',borderRadius:3,width:p+'%',background:`linear-gradient(90deg,${C.accent},#3498db)`,transition:'width 0.4s'}),
    cfgBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,marginTop:8,fontSize:12,lineHeight:1.6,color:C.warn,fontFamily:"'Fira Code','Consolas',monospace",whiteSpace:'pre-wrap'},
  };

  return (
    <div style={sty.page}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 style={sty.h1}>AI/ML Model Testing Lab</h1>
        <div style={sty.sub}>Model Testing, Data Quality, Validation, MLOps, Chatbot & AI Security — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll>0?Math.round((passedAll/totalAll)*100):0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>{TABS.map(t=><button key={t.key} style={sty.tabBtn(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input style={sty.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e=>setDiffF(e.target.value)}>{['All',...DIFF].map(d=><option key={d} value={d}>{d==='All'?'Difficulty':d}</option>)}</select>
          </div>
          <div style={sty.progO}><div style={sty.progOF(totalTab>0?Math.round((passedTab/totalTab)*100):0)}/></div>
          <div style={sty.list}>
            {filtered.length===0&&<div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s=>(
              <div key={s.id} style={sty.card(sel.id===s.id)} onClick={()=>pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])}/><span style={{fontSize:11,color:C.accent,marginRight:8}}>{s.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.header}}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TC[s.layer]||C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DC[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel,flex:'0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div><span style={sty.badge(TC[sel.layer]||C.accent)}>{sel.layer}</span><span style={sty.badge(DC[sel.difficulty])}>{sel.difficulty}</span><span style={sty.badge('#f1c40f')}>{sel.language}</span></div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel,flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}><button style={sty.btn()} onClick={copy}>Copy</button><button style={sty.btn('#555')} onClick={reset}>Reset</button></div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running?'#555':C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running?'Running...':'Run Test'}</button>
              {statuses[sel.id]==='passed'&&<span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress>0&&progress<100&&<span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={()=>setShowConfig(!showConfig)}>{showConfig?'Hide':'Show'} Config</button>
            </div>
            {(running||output)&&(<div><div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div><div style={sty.outBox}>{output||'Starting...'}</div><div style={sty.progBar}><div style={sty.progFill(progress)}/></div></div>)}
            {showConfig&&<div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
