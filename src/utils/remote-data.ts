export enum STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export interface RemoteData<T = unknown, U extends Error = Error> {
  data: T | null;
  status: STATUS | null;
  error: U | null;
}

interface PendingRemoteData<T = unknown, U extends Error = Error>
  extends RemoteData<T, U> {
  status: STATUS.PENDING;
  error: null;
}
interface SuccessRemoteData<T = unknown, U extends Error = Error>
  extends RemoteData<T, U> {
  status: STATUS.SUCCESS;
  data: T;
}
interface FailRemoteData<T = unknown, U extends Error = Error>
  extends RemoteData<T, U> {
  status: STATUS.FAIL;
  data: null;
  error: U;
}
interface UninitializedRemoteData<T = unknown, U extends Error = Error>
  extends RemoteData<T, U> {
  status: null;
  data: null;
  error: null;
}

export function makePending<T = unknown, U extends Error = Error>(
  data?: T,
): PendingRemoteData<T, U> {
  return {
    status: STATUS.PENDING,
    data: data ?? null,
    error: null,
  };
}

export function makeSuccess<T, U extends Error = Error>(
  payload: T,
): SuccessRemoteData<T, U> {
  return {
    status: STATUS.SUCCESS,
    data: payload,
    error: null,
  };
}

export function makeFail<T = unknown, U extends Error = Error>(
  error: U,
): FailRemoteData<T, U> {
  return {
    status: STATUS.FAIL,
    data: null,
    error,
  };
}

export function makeUninitialized<
  T = unknown,
  U extends Error = Error
>(): UninitializedRemoteData<T, U> {
  return {
    status: null,
    data: null,
    error: null,
  };
}

export function isPending<T, U extends Error>(
  remote: RemoteData<T, U>,
): remote is PendingRemoteData<T, U> {
  return remote.status === STATUS.PENDING;
}

export function isSuccess<T, U extends Error>(
  remote: RemoteData<T, U>,
): remote is SuccessRemoteData<T, U> {
  return remote.status === STATUS.SUCCESS;
}

export function isFail<T, U extends Error>(
  remote: RemoteData<T, U>,
): remote is FailRemoteData<T, U> {
  return remote.status === STATUS.FAIL;
}

export function isInitialized<T, U extends Error>(
  remote: RemoteData<T, U>,
): remote is UninitializedRemoteData {
  return remote.status !== null;
}
