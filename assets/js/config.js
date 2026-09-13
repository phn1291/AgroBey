/**
 * AgroBey - Configuration Centralisée & Paramètres de Production
 * Gestion des environnements, serveurs de tuiles cartographiques, routage OSRM, sécurité et constantes métier.
 */

const AgroBeyConfig = {
  // Informations Applicatives
  APP_NAME: 'AgroBey',
  APP_VERSION: '1.3.0',
  ENV: 'production', // 'development' | 'production' | 'staging'
  BUILD_DATE: '2026-09-13',
  DEFAULT_LANGUAGE: 'fr',
  CURRENCY: 'FCFA',
  
  // Contact & Siège Social
  CONTACT: {
    HQ: 'Siège social : Immeuble AgroBey, Route des Almadies, Dakar, Sénégal',
    PHONE: '+221 33 800 00 00',
    WHATSAPP: '+221 77 000 00 00',
    WHATSAPP_CLEAN: '221770000000',
    EMAIL: 'contact@agrobey.sn',
    SUPPORT_HOURS: '7j/7 • 07h00 - 22h00 GMT'
  },

  // Configuration Cartographique Haute Performance
  MAPS: {
    DEFAULT_CENTER: [14.7167, -17.4677], // Dakar Centre
    DEFAULT_ZOOM: 11,
    MAX_ZOOM: 19,
    MIN_ZOOM: 6,
    SENEGAL_BOUNDS: [[12.0, -18.0], [17.0, -11.0]],
    
    // Serveurs de Tuiles fiables avec basculement automatique
    TILE_SERVERS: {
      STREETS: {
        URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      SATELLITE: {
        URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ATTRIBUTION: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      },
      LIGHT: {
        URL: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        ATTRIBUTION: '&copy; <a href="https://carto.com/">CARTO</a>'
      }
    },

    // Moteur de Routage Réel OSRM (Réseau routier Sénégal)
    ROUTING: {
      PRIMARY_ENDPOINT: 'https://router.project-osrm.org/route/v1/driving/',
      BACKUP_ENDPOINT: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/',
      TIMEOUT_MS: 5000,
      SINUOSITY_FALLBACK: 1.25 // Facteur multiplicateur pour calcul vol d'oiseau si coupure réseau
    }
  },

  // Paramètres de Sécurité & Session
  SECURITY: {
    SESSION_DURATION_HOURS: 168, // 7 jours de validité de jeton
    MAX_FAILED_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 5,
    MIN_PASSWORD_LENGTH: 6,
    TOKEN_ALGORITHM: 'HS256',
    SALT_ROUNDS: 16
  },

  // Règles Logistiques & Grille Tarifaire Dynamique
  LOGISTICS: {
    // Barème deux-roues dynamique encadré
    MOTO: {
      MIN_RATE_PER_KM: 350,
      MAX_RATE_PER_KM: 500,
      BASE_FARE: 1000,
      MIN_COURSE_TOTAL: 1500,
      MAX_WEIGHT_KG: 30
    },
    // Multiplicateurs de contexte
    MULTIPLIERS: {
      NIGHT: 1.30,           // 20h - 06h
      RUSH_HOUR: 1.25,       // 07h-09h30 & 17h-20h en zone urbaine
      RELIEF: {
        goudron: 1.0,
        piste_mixte: 1.15,
        sable_niayes: 1.25,
        piste_laterite: 1.35,
        fleuve_bac: 1.50
      }
    }
  },

  // Sécurité & Utilitaires Sanitize XSS
  escapeHTML: function(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Formateur de Prix FCFA
  formatCurrency: function(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
  }
};

// Exposition globale
if (typeof window !== 'undefined') {
  window.AgroBeyConfig = AgroBeyConfig;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgroBeyConfig;
}
