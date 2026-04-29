export const isValidEmail = (value) => {
  if (!value) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
};

export const isValidMonth = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(String(value || "").trim());

export const isEmpty = (value) => value === undefined || value === null || String(value).trim() === "";
