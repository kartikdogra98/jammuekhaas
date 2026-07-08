// When a request is sent as multipart/form-data (because a file is attached),
// nested objects/arrays like `address` or `cuisine` cannot be sent as real
// objects — the frontend JSON.stringifies them into plain string fields.
// This middleware must run AFTER Multer (so req.body is populated) and
// BEFORE any validation middleware (so validators see real objects/arrays,
// not raw JSON strings).
const parseJsonFields = (...fields) => (req, res, next) => {
  fields.forEach((field) => {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (e) {
        // Not valid JSON — leave as-is; individual controllers/validators
        // fall back to sensible defaults (e.g. comma-split) if needed.
      }
    }
  });
  next();
};

module.exports = parseJsonFields;
