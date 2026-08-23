// import { ZodSchema, ZodError } from "zod";
// import { Request, Response, NextFunction } from "express";

// export const validate =
//   (schema: ZodSchema) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       req.body = schema.parse(req.body);
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         return res.status(400).json({
//           success: false,
//           errors: error.issues,
//         });
//       }

//       next(error);
//     }
//   };  


import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (
    schema: ZodSchema,
    source: "body" | "params" = "body"
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(
        source === "params"
          ? req.params
          : req.body
      );

      if (source === "params") {
        Object.assign(req.params, parsedData);
      } else {
        req.body = parsedData;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.issues,
        });
      }

      next(error);
    }
  };