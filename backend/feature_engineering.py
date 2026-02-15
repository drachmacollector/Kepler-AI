import numpy as np
import pandas as pd

def feature_engineering_function(X):
    X_copy = X.copy()

    if 'koi_depth' in X_copy.columns:
        X_copy['sqrt_koi_depth'] = np.sqrt(X_copy['koi_depth'].fillna(0))
    else:
        X_copy['sqrt_koi_depth'] = 0

    if 'koi_depth' in X_copy.columns and 'st_radius' in X_copy.columns:
        X_copy['koi_depth_x_st_radius'] = (X_copy['koi_depth'] * X_copy['st_radius']).fillna(0)
    else:
        X_copy['koi_depth_x_st_radius'] = 0

    if 'koi_period' in X_copy.columns and 'st_radius' in X_copy.columns:
        X_copy['koi_period_x_st_radius'] = (X_copy['koi_period'] * X_copy['st_radius']).fillna(0)
    else:
        X_copy['koi_period_x_st_radius'] = 0

    return X_copy
