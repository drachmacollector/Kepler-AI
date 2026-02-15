import axios from 'axios';
import { PredictionRequest, PredictionResponse } from '@/types/prediction';

const API_create = axios.create({
    baseURL: 'https://stellar-analytics.onrender.com',
    timeout: 10000,
});

export const predict = async (
    features: Record<string, number>
): Promise<PredictionResponse> => {
    try {
        const payload: PredictionRequest = {
            features,
            tasks: ['classification', 'regression'],
        };

        // Simulate slight delay for loading effect if response is instant
        // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        // await delay(800);

        const response = await API_create.post('/predict', payload);

        // Transform backend response to match frontend PredictionResponse interface
        const { classification, metadata } = response.data;
        const probConfirmed = classification.probability;
        const probFalsePositive = 1 - probConfirmed;

        return {
            label: classification.label,
            probability: classification.probability,
            probabilities: {
                'CONFIRMED': probConfirmed,
                'FALSE POSITIVE': probFalsePositive,
                'CANDIDATE': 0 // Backend is binary class only
            },
            radius: response.data.regression?.predicted_koi_prad,
            timestamp: metadata.timestamp
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.detail || error.message || 'Failed to fetch prediction'
            );
        }
        throw new Error('An unexpected error occurred');
    }
};
