export type ApiResponse<T, E> = {
  data: T;
  error?: E;
  message?: string;
};
function createApiResponse<T, E>(
  data: T,
  error: E,
  message?: string
): ApiResponse<T, E> {
  return {
    data,
    message,
    error,
  };
}
export function createErrorResponse<T>(
  error: T,
  message?: string
): ApiResponse<null, T> {
  return createApiResponse(null, error, message);
}

export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T, null> {
  return createApiResponse(data, null, message);
}

export function isApiSuccessWithMessage<T>(
  response: ApiResponse<T, any>
): response is ApiResponse<T, null> {
  return response.error === null;
}
