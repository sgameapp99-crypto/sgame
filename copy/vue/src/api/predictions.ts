/**
 * 預測相關 API
 */

import api from './client';
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
  FeaturePredictionRequest,
  FeaturePredictionResponse,
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

/**
 * 設定主推
 */
export async function featurePrediction(id: number | string, data?: FeaturePredictionRequest): Promise<FeaturePredictionResponse> {
  const response = await api.post<FeaturePredictionResponse>(`/predictions/${id}/feature`, data);
  return response.data;
}

/**
 * 取消主推
 */
export async function unfeaturePrediction(id: number | string): Promise<FeaturePredictionResponse> {
  const response = await api.post<FeaturePredictionResponse>(`/predictions/${id}/unfeature`);
  return response.data;
}

/**
 * 取得可設為主推的預測列表
 */
export async function getFeatureCandidates(): Promise<PredictionsResponse> {
  const response = await api.get<PredictionsResponse>('/predictions/feature-candidates');
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
  featurePrediction,
  unfeaturePrediction,
  getFeatureCandidates,
};

