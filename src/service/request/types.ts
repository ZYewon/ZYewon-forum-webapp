import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
export interface XRAxiosRequestConfig<T = AxiosResponse> {
    requestInterceptors?: (x: XRequestConfig) => XRequestConfig
    requestInterCeptorsErr?: (err: AxiosError) => AxiosError
    responseInterceptors?: (x: T) => T
    responseInterceptorsErr?: (err: AxiosError) => AxiosError
}

export interface XRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
    interceptors?: XRAxiosRequestConfig<T>
    loading?: boolean
    mock?: boolean
}
