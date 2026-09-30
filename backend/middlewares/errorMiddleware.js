export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  const extraDetails = err.extraDetails || null;

  if (status === 500) console.error(err);

  return res.status(status).json({ success: false, message, extraDetails });
};
