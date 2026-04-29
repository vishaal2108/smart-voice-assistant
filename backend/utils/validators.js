const mongoose = require("mongoose");

const isEmptyValue = (value) =>
  value === undefined || value === null || (typeof value === "string" && value.trim() === "");

const trimString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeEmail = (value) => trimString(value).toLowerCase();

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const isValidMonth = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(String(value || "").trim());

const requireFields = (body, fields) => {
  for (const field of fields) {
    if (isEmptyValue(body[field])) {
      return { ok: false, message: `${field} is required` };
    }
  }

  return { ok: true };
};

const requireEmailField = (value, fieldName = "email") => {
  if (isEmptyValue(value)) {
    return { ok: false, message: `${fieldName} is required` };
  }

  if (!isValidEmail(value)) {
    return { ok: false, message: `${fieldName} must be a valid email` };
  }

  return { ok: true };
};

const requireNumberField = (value, fieldName, options = {}) => {
  if (isEmptyValue(value)) {
    return { ok: false, message: `${fieldName} is required` };
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return { ok: false, message: `${fieldName} must be a number` };
  }

  if (options.min !== undefined && numericValue < options.min) {
    return { ok: false, message: `${fieldName} must be at least ${options.min}` };
  }

  if (options.max !== undefined && numericValue > options.max) {
    return { ok: false, message: `${fieldName} must be at most ${options.max}` };
  }

  return { ok: true, value: numericValue };
};

const requireObjectIdParam = (value, paramName = "id") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return { ok: false, message: `${paramName} must be a valid id` };
  }

  return { ok: true };
};

module.exports = {
  isEmptyValue,
  trimString,
  normalizeEmail,
  isValidEmail,
  isValidMonth,
  requireFields,
  requireEmailField,
  requireNumberField,
  requireObjectIdParam,
};
