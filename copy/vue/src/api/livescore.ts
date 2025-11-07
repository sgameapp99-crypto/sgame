import api from './client';
import type { LivescoreQueryParams, LivescoreResponse } from './types';

export async function getLivescore(params?: LivescoreQueryParams): Promise<LivescoreResponse> {
  const response = await api.get<LivescoreResponse>('/livescore', { params });
  return response.data;
}

export const livescoreAPI = {
  getLivescore,
};

export default livescoreAPI;

