import { ZodError } from "zod";

export const validateSchema = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    if (!(err instanceof ZodError)) return next(err);

    next({
      status: 422,
      message: "Please fill the inputs properly",
      extraDetails: err.issues[0].message,
    });
  }
};
