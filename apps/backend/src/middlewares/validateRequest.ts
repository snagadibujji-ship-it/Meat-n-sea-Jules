import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const def = schema._def as any;
      const isNestedSchema = def.typeName === 'ZodObject' &&
                             Object.keys(def.shape ? def.shape() : {}).some(k => ['body', 'query', 'params'].includes(k));

      if (isNestedSchema) {
          await schema.parseAsync({
              body: req.body,
              query: req.query,
              params: req.params,
          });
      } else {
          await schema.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};
