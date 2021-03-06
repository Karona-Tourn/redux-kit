import { IAsyncAction, HttpPayload } from './actionKits';
import { FailResult, WatcherConfig } from './sagaWatcherKits';
import { enableES5 } from 'immer';

enableES5();

export interface IConfig {
  baseUrlSelector?:
    | ((config: WatcherConfig, state: any, action: IAsyncAction) => string)
    | null;
  httpHeaderSelector?:
    | ((
        config: WatcherConfig,
        state: any,
        action: IAsyncAction,
        http: HttpPayload
      ) => Headers)
    | null;

  /**
   * A saga function to be executed between pending status and success/fail status
   */
  middleSagaCallback?:
    | ((config: WatcherConfig, state: any, action: IAsyncAction) => any)
    | null;

  /**
   * A saga function to be executed after fail status detected
   */
  failSagaCallback?:
    | ((config: WatcherConfig, action: IAsyncAction) => any)
    | null;

  /**
   * Custom function for http request
   */
  customFetch?:
    | ((input: RequestInfo, init?: RequestInit) => Promise<any>)
    | null;

  /**
   * Provide a function for transforming http request options before passing the request
   */
  transformHttpRequestOption?:
    | ((config: WatcherConfig, state: any, init?: RequestInit) => RequestInit)
    | null;

  transformSuccessResult?: (result: any, index: number, results: any[]) => any;

  transformFailResult?:
    | ((result: any) => FailResult | null | undefined)
    | null
    | undefined;
}

var _defaultConfig: IConfig = {
  baseUrlSelector: null,
  httpHeaderSelector: null,
  middleSagaCallback: null,
  failSagaCallback: null,
  customFetch: null,
  transformHttpRequestOption: null,
  transformSuccessResult: (result: any) => result?.data,
  transformFailResult: (result: any) => {
    if (typeof result?.success === 'boolean' && !result?.success) {
      return {
        message: result.message,
      };
    }

    return null;
  },
};

var _config: IConfig = {
  ..._defaultConfig,
};

export function configure(config: IConfig): IConfig {
  _config = {
    ..._defaultConfig,
    ...config,
  };

  return _config;
}

/**
 * @ignore
 */
export function getConfig(): IConfig {
  return _config;
}
