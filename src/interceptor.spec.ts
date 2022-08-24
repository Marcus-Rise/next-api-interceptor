import type { Interceptor } from "./interceptor";
import { applyInterceptors } from "./interceptor";
import type { NextApiHandler } from "next";

const int1Handler = "int1Handler";
const int2Handler = "int2Handler";
const int3Handler = "int3Handler";

describe("applyInterceptors", () => {
  it("should apply interceptors in args order", () => {
    const stack: string[] = [];
    const int1: Interceptor = (handler) => (req, res) => {
      stack.push(int1Handler);

      return handler && handler(req, res);
    };
    const int2: Interceptor = (handler) => (req, res) => {
      stack.push(int2Handler);

      return handler && handler(req, res);
    };
    const int3: Interceptor = (handler) => (req, res) => {
      stack.push(int3Handler);

      return handler && handler(req, res);
    };

    const originalHandler: NextApiHandler = jest.fn();
    const handler = applyInterceptors(originalHandler, int1, int2, int3);

    handler(Object.create({}), Object.create({}));

    expect(stack).toMatchObject([int1Handler, int2Handler, int3Handler]);
  });
});
