import axios from "axios";
import type { AxiosInstance } from "axios";
import type { XRequestConfig, XRAxiosRequestConfig } from "./types";
const CancelToken = axios.CancelToken;
export default class XRequest {
  instacne: AxiosInstance;
  interceptors?: XRAxiosRequestConfig;
  loading?: boolean;
  pending: any;
  constructor(config: XRequestConfig) {
    this.instacne = axios.create(config);
    this.interceptors = config.interceptors;
    this.loading = config.loading ?? false;
    this.pending = {};
    // 默认拦截器
    this.instacne.interceptors.request.use(
      (req) => {
        const key = req.url + "&" + req.method;
        this.removePending(key, true);
        req.cancelToken = new CancelToken((c) => {
          this.pending[key] = c;
        });
        if (this.loading) {
          // TODO：loading 开启
        }
        return req;
      },
      (err) => {
        return err;
      }
    );
    this.instacne.interceptors.response.use(
      (res) => {
        // TODO：loading 关闭
        const key = res.config.url + "&" + res.config.method;
        this.removePending(key);
        return res.data;
      },
      (err) => {
        if (err.response) {
          return Promise.resolve(err.response.data);
        } else {
          return Promise.resolve({ code: 500, msg: "网络请求错误" });
        }
      }
    );

    // 用户实例化时的拦截器
    const reqF = this.interceptors?.requestInterceptors;
    const reqFE = this.interceptors?.requestInterCeptorsErr;
    const resF = this.interceptors?.responseInterceptors;
    const resFE = this.interceptors?.responseInterceptorsErr;
    this.instacne.interceptors.request.use(reqF, reqFE);
    this.instacne.interceptors.response.use(resF, resFE);
  }
  removePending(key: string, bol: boolean = false) {
    if (this.pending[key] && bol) {
      this.pending[key]("取消了请求");
    }
    delete this.pending[key];
  }
  request<T = any>(config: XRequestConfig<T> | any): Promise<T> {
    return new Promise((resolve, reject) => {
      // 判断用户在单独调用某个请求时是否传入了拦截器
      if (config.interceptors?.requestInterceptors) {
        if (this.loading) {
        }
        config = config.interceptors.requestInterceptors(config);
      }
      this.instacne
        .request<any, T>(config)
        .then((v) => {
          // 判断用户在单独调用某个请求时是否传入了响应拦截器
          if (config.interceptors?.responseInterceptors) {
            if (this.loading) {
            }
            v = config.interceptors?.responseInterceptors(v);
          }
          resolve(v);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  get<T = any>(config: XRequestConfig<T>) {
    return this.request<T>({ method: "GET", ...config });
  }
  post<T = any>(config: XRequestConfig<T>) {
    return this.request<T>({ method: "POST", ...config });
  }
  put<T = any>(config: XRequestConfig<T>) {
    return this.request<T>({ method: "PUT", ...config });
  }
  delete<T = any>(config: XRequestConfig<T>) {
    return this.request<T>({ method: "DELETE", ...config });
  }
  patch<T = any>(config: XRequestConfig<T>) {
    return this.request<T>({ method: "PATCH", ...config });
  }
}
