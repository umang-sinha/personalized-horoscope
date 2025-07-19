export function success<T>(code: string, message: string, data: T) {
  return {
    success: true,
    code,
    message,
    data,
  };
}

export function failure(
  code: string,
  message: string,
  errors?: Record<string, string>
) {
  return {
    success: false,
    code,
    message,
    errors,
  };
}
