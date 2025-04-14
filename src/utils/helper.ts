import DOMPurify from "dompurify";

export const sanitizeToken = (token: string): string => {
  return DOMPurify.sanitize(token, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    FORBID_CONTENTS: ["script", "style", "iframe"],
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed"],
    RETURN_DOM: false,
    RETURN_TRUSTED_TYPE: false,
  });
};

export const hashString = (str: string): number => {
  let hash = 0;
  const safeStr = str || "";

  if (window.crypto?.subtle) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  }

  for (let i = 0; i < safeStr.length; i++) {
    hash = (hash << 5) - hash + safeStr.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % 10000;
};
