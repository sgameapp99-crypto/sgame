/**
 * 預測相關 API
 */

import { api } from './index';
import type {
  Prediction,
  PredictionsResponse,
  PredictionsQueryParams,
  CreatePredictionRequest,
  CreatePredictionResponse,
  UpdatePredictionRequest,
  PurchasePredictionResponse,
  PurchaseStatusResponse,
  PredictionSettingsResponse,
  UpdatePredictionSettingsRequest,
} from '../types/prediction';

/**
 * 建立預測
 */
export async function createPrediction(data: CreatePredictionRequest): Promise<CreatePredictionResponse> {
  const response = await api.post<CreatePredictionResponse>('/predictions', data);
  return response.data;
}

/**
 * 獲取預測列表
 */
export async function getPredictions(params?: PredictionsQueryParams): Promise<PredictionsResponse> {
  const response = await api.get<PredictionsResponse>('/predictions', { params });
  return response.data;
}

/**
 * 獲取單一預測詳情
 */
export async function getPrediction(id: number): Promise<{ success: boolean; data: Prediction }> {
  const response = await api.get<{ success: boolean; data: Prediction }>(`/predictions/${id}`);
  return response.data;
}

/**
 * 更新預測
 */
export async function updatePrediction(id: number, data: UpdatePredictionRequest): Promise<{ success: boolean; message: string }> {
  const response = await api.patch<{ success: boolean; message: string }>(`/predictions/${id}`, data);
  return response.data;
}

/**
 * 刪除預測
 */
export async function deletePrediction(id: number): Promise<{ success: boolean; message: string }> {
  const response = await api.delete<{ success: boolean; message: string }>(`/predictions/${id}`);
  return response.data;
}

/**
 * 購買預測
 */
export async function purchasePrediction(id: number): Promise<PurchasePredictionResponse> {
  const response = await api.post<PurchasePredictionResponse>(`/predictions/${id}/purchase`);
  return response.data;
}

/**
 * 檢查預測購買狀態
 */
export async function getPurchaseStatus(id: number): Promise<PurchaseStatusResponse> {
  const response = await api.get<PurchaseStatusResponse>(`/predictions/${id}/purchase-status`);
  return response.data;
}

/**
 * 獲取預測設定
 */
export async function getPredictionSettings(): Promise<PredictionSettingsResponse> {
  const response = await api.get<PredictionSettingsResponse>('/me/prediction-settings');
  return response.data;
}

/**
 * 更新預測設定
 */
export async function updatePredictionSettings(data: UpdatePredictionSettingsRequest): Promise<PredictionSettingsResponse> {
  const response = await api.patch<PredictionSettingsResponse>('/me/prediction-settings', data);
  return response.data;
}

export const predictionsAPI = {
  createPrediction,
  getPredictions,
  getPrediction,
  updatePrediction,
  deletePrediction,
  purchasePrediction,
  getPurchaseStatus,
  getPredictionSettings,
  updatePredictionSettings,
};

