export const errorHandler = (statusCode, error) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = error;
  return error;
};
