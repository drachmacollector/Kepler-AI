export type FeatureKey =
    | 'koi_period'
    | 'koi_duration'
    | 'koi_depth'
    | 'koi_impact'
    | 'koi_model_snr'
    | 'koi_num_transits'
    | 'koi_ror'
    | 'koi_prad'
    | 'st_teff'
    | 'st_logg'
    | 'st_met'
    | 'st_mass'
    | 'st_radius'
    | 'st_dens'
    | 'teff_err1'
    | 'teff_err2'
    | 'logg_err1'
    | 'logg_err2'
    | 'feh_err1'
    | 'feh_err2'
    | 'mass_err1'
    | 'mass_err2'
    | 'radius_err1'
    | 'radius_err2';

export interface FeatureConfig {
    id: FeatureKey;
    label: string;
    description: string;
    min: number;
    max: number;
    required: boolean;
    category: 'core' | 'advanced';
}

export interface PredictionFeatures extends Record<string, number> { }

export interface PredictionRequest {
    features: PredictionFeatures;
    tasks: string[];
}

export interface PredictionResponse {
    label: string;
    probability: number;
    probabilities: Record<string, number>;
    radius?: number;
    timestamp: string;
}
