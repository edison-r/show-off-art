interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSlugFormat(slug: string): ValidationResult {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  if (slug.length < 3) {
    return {
      valid: false,
      error: 'El slug debe tener al menos 3 caracteres'
    };
  }
  
  if (slug.length > 100) {
    return {
      valid: false,
      error: 'El slug no puede tener más de 100 caracteres'
    };
  }
  
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: 'El slug solo puede contener letras minúsculas, números y guiones'
    };
  }
  
  const reserved = [
    'admin', 'dashboard', 'app', 'auth', 'api', 'about', 'contact',
    'terms', 'privacy', 'cookies', 'work', 'home', 'pricing', 'blog',
    'help', 'support', 'settings', 'profile', 'user', 'users',
    'portfolio', 'portfolios', 'new', 'edit', 'delete', 'create'
  ];
  
  if (reserved.includes(slug.toLowerCase())) {
    return {
      valid: false,
      error: 'Este nombre está reservado y no puede usarse'
    };
  }
  
  return { valid: true };
}