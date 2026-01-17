// Industrial Grade Validation Middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      details: error.details.map(d => d.message)
    });
  }
  next();
};

// Schema Definitions (Joi-like interface)
const Joi = {
  object: (schema) => ({
    validate: (data) => {
      const errors = [];
      for (const key in schema) {
        const rule = schema[key];
        const value = data[key];
        
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push({ message: `${key} is required` });
        }
        if (value && rule.min && value.length < rule.min) {
          errors.push({ message: `${key} must be at least ${rule.min} characters` });
        }
        if (value && rule.email && !/^\S+@\S+\.\S+$/.test(value)) {
          errors.push({ message: `${key} must be a valid email` });
        }
      }
      return { error: errors.length > 0 ? { details: errors } : null };
    }
  }),
  string: () => ({
    required: false,
    min: 0,
    email: false,
    isRequired() { this.required = true; return this; },
    minLen(n) { this.min = n; return this; },
    isEmail() { this.email = true; return this; }
  })
};

module.exports = { validate, Joi };
