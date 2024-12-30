type SuccessCodes = 200 | 201 | 202 | 203 | 204 | 205 | 206;
type ErrorCodes =
  | 300
  | 301
  | 302
  | 304
  | 400
  | 401
  | 403
  | 404
  | 500
  | 501
  | 502
  | 503;

function isSuccessCode(code: number): code is SuccessCodes {
  return code >= 200 && code <= 299;
}

export type { ErrorCodes, SuccessCodes };
export { isSuccessCode };
