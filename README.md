# Next api interceptor

Interceptor for serverless nextjs api

## Install

using `npm`

```bash
npm install @marcus-rise/next-api-interceptor
```

or using `yarn`

```bash
yarn add @marcus-rise/next-api-interceptor
```

## Usage

You can create several interceptors and apply them in train

Interceptor is a wrapper function, that runs before a wrapped function

```tsx
// src/interceptor/method-handlers.interceptor.ts
import type {Interceptor} from "@marcus-rise/next-api-interceptor";
import type {NextApiHandler} from "next";

enum RequestMethod {
  GET = "GET",
  POST = "POST",
}

type MethodHandler<Handler extends NextApiHandler = NextApiHandler> = {
  method: RequestMethod | string;
  handler: Handler;
};

const withMethodHandlers =
  (...allowedHandlers: Array<MethodHandler>): Interceptor =>
    (handler: NextApiHandler = () => {
    }) =>
      async (req, res) => {
        const allowedHandler = allowedHandlers.find((h) => h.method === req.method)?.handler;

        if (!allowedHandler) {
          res.status(405).end();
        } else {
          await allowedHandler(req, res);
        }

        return handler(req, res);
      };

export {withMethodHandlers};
```

```ts
// pages/api/test.ts
import type {NextApiHandler} from "next";
import {withMethodHandlers} from "../../src/interceptor/method-handlers.interceptor.ts";

const TestHandler: NextApiHandler = (req, response) => {
  return response.status(res.status).json({res: "hellow"});
};

export default withMethodHandlers({
  method: "GET",
  handler: TestHandler,
})();

// or

export default applyInterceptors(
  TestHandler,
  anotherInterceptor,
  withMethodHandlers({
    method: "GET",
    handler: TestHandler,
  }),
  yetAnotherOneInterceptor,
);
```

The execution order of example described above is: anotherInterceptor, withMethodHandlers,
yetAnotherOneInterceptor, TestHandler
