// Valores por defecto
const DEFAULT_SESSION_CONFIG = {
  secret: 'defaultSecret123',      // Obligatorio para cookies
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000                // 1 hora
  }
};

// Función que construye la configuración final
function getSessionConfig(config) {
  const finalConfig = { ...DEFAULT_SESSION_CONFIG };

  if (config) {
    if (config.secret) {
      finalConfig.secret = config.secret;
    } else {
      console.warn("[SESSION] No se encontró session.secret, usando valor por defecto.");
    }

    finalConfig.resave = config.resave ?? DEFAULT_SESSION_CONFIG.resave;
    finalConfig.saveUninitialized = config.saveUninitialized ?? DEFAULT_SESSION_CONFIG.saveUninitialized;

    finalConfig.cookie = {
      maxAge: config.cookie?.maxAge ?? DEFAULT_SESSION_CONFIG.cookie.maxAge
    };

    if (!config.cookie?.maxAge) {
      console.warn("[SESSION] No se encontró session.cookie.maxAge, usando valor por defecto.");
    }
  } else {
    console.warn("[SESSION] No se encontró configuración de sesión, usando todos los valores por defecto.");
  }

  return finalConfig;
}

module.exports = { getSessionConfig };
