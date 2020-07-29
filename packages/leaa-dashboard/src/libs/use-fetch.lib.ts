import useSWR, { ConfigInterface, responseInterface } from 'swr';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ICrudListQueryParams } from '@leaa/dashboard/src/interfaces';

import { fetcher } from './fetcher.lib';

// extends axios
interface IAxiosRequestConfig extends AxiosRequestConfig {
  crudQuery?: ICrudListQueryParams;
}

interface IAxiosResponse<T = any> extends AxiosResponse {
  config: IAxiosRequestConfig;
}

interface IReturn<Data, Error>
  extends Pick<
    responseInterface<IAxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'revalidate' | 'error' | 'mutate'
  > {
  data: Data | undefined;
  loading?: boolean;
  response?: IAxiosResponse<Data> | undefined;
}

export interface IConfig<Data = unknown, Error = unknown>
  extends Omit<ConfigInterface<IAxiosResponse<Data>, AxiosError<Error>>, 'initialData'> {
  initialData?: Data;
}

export function useFetch<Data = unknown, Error = unknown>(
  request: IAxiosRequestConfig | null,
  { initialData, ...config }: IConfig<Data, Error> = {},
): IReturn<Data, Error> {
  const { data: response, error, isValidating, revalidate, mutate } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request?.url ? JSON.stringify(request) : null,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (): any => fetcher(request!),
    {
      revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config: request!,
        headers: {},
        data: initialData,
      },
      ...config,
    },
  );

  return {
    data: response?.data,
    // response,
    error,
    isValidating,
    loading: isValidating,
    revalidate,
    mutate,
  };
}
