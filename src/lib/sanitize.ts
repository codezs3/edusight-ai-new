import DOMPurify from 'isomorphic-dompurify';

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripHtml?: boolean;
  maxLength?: number;
}

export function sanitizeInput(input: string, options: SanitizeOptions = {}): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const {
    allowedTags = [],
    allowedAttributes = [],
    stripHtml = true,
    maxLength = 1000
  } = options;

  let sanitized = input;

  // Trim whitespace
  sanitized = sanitized.trim();

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  if (stripHtml) {
    // Remove all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else {
    // Use DOMPurify for HTML sanitization
    const config = {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      KEEP_CONTENT: true,
    };
    sanitized = DOMPurify.sanitize(sanitized, config);
  }

  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove remaining < >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers

  return sanitized;
}

export function sanitizeEmail(email: string): string {
  return sanitizeInput(email, { 
    stripHtml: true, 
    maxLength: 254,
    allowedTags: [],
    allowedAttributes: []
  }).toLowerCase();
}

export function sanitizeName(name: string): string {
  return sanitizeInput(name, { 
    stripHtml: true, 
    maxLength: 100,
    allowedTags: [],
    allowedAttributes: []
  });
}

export function sanitizeText(text: string, maxLength: number = 1000): string {
  return sanitizeInput(text, { 
    stripHtml: true, 
    maxLength,
    allowedTags: [],
    allowedAttributes: []
  });
}

export function sanitizeHtml(html: string, allowedTags: string[] = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li']): string {
  return sanitizeInput(html, { 
    stripHtml: false, 
    maxLength: 5000,
    allowedTags,
    allowedAttributes: ['class', 'id']
  });
}
