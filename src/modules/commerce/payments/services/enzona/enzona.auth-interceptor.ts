import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { enzonaConfig } from './config/enzona.config';

export function enzonaSetBearerInterceptor(
  config: AxiosRequestConfig,
): AxiosRequestConfig {
  const token = enzonaConfig.accessToken;
  config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
}

export async function enzonaRefreshTokenInterceptorOnFulfilled(
  response: AxiosResponse,
): Promise<AxiosResponse> {
  return response;
}
