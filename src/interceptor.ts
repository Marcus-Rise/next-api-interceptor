import type { NextApiHandler } from "next";

/**
 * Reuse login in api functions
 *
 * @example
 * const interceptor: Interceptor = (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
 *   // processing some work...
 *
 *   return handler(req, res);
 * }
 */
type Interceptor<Handler extends NextApiHandler = NextApiHandler> = (handler?: Handler) => Handler;

/**
 * Apply multiply interceptors
 *
 * @param handler - original handler
 * @param interceptors - array of interceptors, applied in order of the array
 */
const applyInterceptors = <Handler extends NextApiHandler = NextApiHandler>(
  handler: Handler,
  ...interceptors: Array<Interceptor<Handler>>
): Handler =>
  interceptors
    .reverse()
    .reduce<Handler>((interceptedHandler, interceptor) => interceptor(interceptedHandler), handler);

export { applyInterceptors };
export type { Interceptor };
