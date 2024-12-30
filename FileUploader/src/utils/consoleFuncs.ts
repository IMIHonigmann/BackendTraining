import {
  ErrorCodes,
  isSuccessCode,
  SuccessCodes,
} from '../types/statusCodeUtils.ts';
import * as ANSI from './ANSIColors.ts';

export default function notifyBoth(
  message: string | JSON,
  res: Response,
  statusCode: SuccessCodes | ErrorCodes,
) {
  if (isSuccessCode(statusCode)) {
    console.log(ANSI.colors.green, message, ANSI.colors.reset);
  } else {
    console.error(ANSI.colors.red, message, ANSI.colors.reset);
  }
  res.status(statusCode).send(message);
}
