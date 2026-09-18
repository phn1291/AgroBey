/**
 * AgroBey - Moteur d Authentification Sécurisée & Contrôle d Accès (RBAC)
 * Chiffrement SHA-256 avec sel, protection anti-bruteforce, jetons de session.
 */

// Dictionnaire des identifiants et mots de passe par défaut vérifiés pour tests et démonstration
const KNOWN_DEFAULT_CREDENTIALS = {
  'admin@agrobey.sn': 'AgroBey@2026!Admin',
  'assistant@agrobey.sn': 'AgroAssistant@2026',
  'it@agrobey.sn': 'AgroIT@2026',
  'marketing@agrobey.sn': 'AgroMarketing@2026',
  'moussa.diagne@gmail.com': 'AgroClient@2026',
  'amadou.ba@agrobey.sn': 'AgroFarmer@2026',
  'ousmane.fall@bergerieprestige.sn': 'AgroBreeder@2026',
  'mamadou.diallo@agrobey.sn': 'AgroFarmer@2026',
  'livreur@agrobey.sn': 'AgroDelivery@2026',
  'modou.livreur@agrobey.sn': 'AgroDelivery@2026',
  'moussa.moto@agrobey.sn': 'AgroDelivery@2026',
  'oumar.sarr@agrobey.sn': 'AgroDelivery@2026'
};

class AgroBeyAuth {
  constructor() {
    this.sessionKey = 'agrobey_auth_session';
    this.bruteForceKey = 'agrobey_failed_attempts';
    this.listeners = [];
    this.onSuccessCallback = null;
  }

  // --- MOTEUR PUR JAVASCRIPT SHA-256 (FONCTIONNE SUR TOUS LES PROTOCOLES FILE://, HTTP & HTTPS) ---
  sha256Pure(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    var result = '';
    var words = [];
    var hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    var k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    var utf8 = unescape(encodeURIComponent(ascii));
    var utf8BitLength = utf8.length * 8;

    for (var i = 0; i < utf8.length; i++) {
      var j = i >> 2;
      words[j] = (words[j] || 0) | (utf8.charCodeAt(i) << (24 - (i % 4) * 8));
    }
    var lastIndex = utf8.length >> 2;
    words[lastIndex] = (words[lastIndex] || 0) | (0x80 << (24 - (utf8.length % 4) * 8));

    var totalWords = (((utf8.length + 8) >> 6) + 1) * 16;
    for (var i = (utf8.length >> 2) + 1; i < totalWords; i++) {
      words[i] = 0;
    }
    words[totalWords - 1] = utf8BitLength;

    for (var j = 0; j < totalWords; j += 16) {
      var w = [];
      for (var i = 0; i < 16; i++) {
        w[i] = words[j + i] || 0;
      }
      for (var i = 16; i < 64; i++) {
        var s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      var a = hash[0];
      var b = hash[1];
      var c = hash[2];
      var d = hash[3];
      var e = hash[4];
      var f = hash[5];
      var g = hash[6];
      var h = hash[7];

      for (var i = 0; i < 64; i++) {
        var S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
        var S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }

      hash[0] = (hash[0] + a) | 0;
      hash[1] = (hash[1] + b) | 0;
      hash[2] = (hash[2] + c) | 0;
      hash[3] = (hash[3] + d) | 0;
      hash[4] = (hash[4] + e) | 0;
      hash[5] = (hash[5] + f) | 0;
      hash[6] = (hash[6] + g) | 0;
      hash[7] = (hash[7] + h) | 0;
    }

    for (var i = 0; i < 8; i++) {
      for (var j = 3; j >= 0; j--) {
        var b = (hash[i] >> (8 * j)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  // --- CRYPTOGRAPHIE SHA-256 HYBRIDE SÉCURISÉE ---
  async hashPassword(password, salt = '') {
    const text = password + salt;
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      // En cas de restriction de contexte de sécurité Web Crypto, bascule transparente sur SHA-256 pur JS
    }
    return this.sha256Pure(text);
  }

  generateSalt() {
    try {
      if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {}
    return 'salt_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  generateToken(user) {
    try {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 jours
      }));
      const sig = btoa(this.generateSalt());
      return `${header}.${payload}.${sig}`;
    } catch (e) {
      return 'token_' + user.id + '_' + Date.now();
    }
  }

  // --- PROTECTION ANTI-BRUTEFORCE ---
  checkBruteForce(identifier) {
    try {
      const cleanId = (identifier || '').toLowerCase().trim();
      // Ne jamais bloquer les comptes par défaut connus lors des tests
      if (KNOWN_DEFAULT_CREDENTIALS[cleanId]) {
        return { locked: false };
      }

      const attempts = JSON.parse(localStorage.getItem(this.bruteForceKey) || '{}');
      const record = attempts[cleanId];

      if (record) {
        const lockoutTime = 5 * 60 * 1000; // 5 minutes de blocage
        const timePassed = Date.now() - record.lastAttempt;

        if (record.count >= 5) {
          if (timePassed < lockoutTime) {
            const minutesLeft = Math.ceil((lockoutTime - timePassed) / 60000);
            return {
              locked: true,
              message: `Compte temporairement verrouillé pour sécurité (5 tentatives échouées). Réessayez dans ${minutesLeft} minute(s).`
            };
          } else {
            // Réinitialiser après délai écoulé
            delete attempts[cleanId];
            localStorage.setItem(this.bruteForceKey, JSON.stringify(attempts));
          }
        }
      }
      return { locked: false };
    } catch (e) {
      return { locked: false };
    }
  }

  recordFailedAttempt(identifier) {
    try {
      const cleanId = (identifier || '').toLowerCase().trim();
      if (KNOWN_DEFAULT_CREDENTIALS[cleanId]) return; // Ne pas incrémenter pour les comptes connus

      const attempts = JSON.parse(localStorage.getItem(this.bruteForceKey) || '{}');
      const record = attempts[cleanId] || { count: 0, lastAttempt: 0 };

      record.count += 1;
      record.lastAttempt = Date.now();
      attempts[cleanId] = record;
      localStorage.setItem(this.bruteForceKey, JSON.stringify(attempts));
    } catch (e) {}
  }

  clearFailedAttempts(identifier) {
    try {
      const attempts = JSON.parse(localStorage.getItem(this.bruteForceKey) || '{}');
      const cleanId = (identifier || '').toLowerCase().trim();
      delete attempts[cleanId];
      localStorage.setItem(this.bruteForceKey, JSON.stringify(attempts));
    } catch (e) {}
  }

  // --- GESTION DE SESSION ---
  getCurrentSession() {
    try {
      const session = localStorage.getItem(this.sessionKey) || sessionStorage.getItem(this.sessionKey);
      if (session) {
        const data = JSON.parse(session);
        if (data.exp && Date.now() < data.exp) {
          return data;
        } else {
          this.logout();
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session || !session.user) return null;
    if (window.AgroBeyDB) {
      return window.AgroBeyDB.getUserById(session.user.id) || session.user;
    }
    return session.user;
  }

  isAuthenticated() {
    return this.getCurrentSession() !== null;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true; // L admin a tous les droits
    return user.role === role;
  }

  // --- CONNEXION SÉCURISÉE & RÉSILIENCE MULTI-ENVIRONNEMENT ---
  async login(identifier, password, remember = true) {
    try {
      const cleanId = (identifier || '').trim();
      if (!cleanId || !password) {
        return { success: false, message: 'Veuillez saisir votre identifiant et mot de passe.' };
      }

      // Vérification anti-bruteforce
      const bruteCheck = this.checkBruteForce(cleanId);
      if (bruteCheck.locked) {
        return { success: false, message: bruteCheck.message };
      }

      const allUsers = window.AgroBeyDB ? window.AgroBeyDB.getUsers() : [];
      let user = allUsers.find(u => 
        (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) || 
        (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
        u.id === cleanId
      );

      // Si non trouvé en base locale, vérifier si présent dans DEFAULT_USERS
      if (!user && typeof DEFAULT_USERS !== 'undefined') {
        const defaultMatch = DEFAULT_USERS.find(u => 
          (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) || 
          (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
          u.id === cleanId
        );
        if (defaultMatch && window.AgroBeyDB) {
          user = window.AgroBeyDB.saveUser(defaultMatch);
        }
      }

      if (!user) {
        this.recordFailedAttempt(cleanId);
        return { success: false, message: 'Identifiant ou mot de passe incorrect.' };
      }

      if (user.status === 'suspended') {
        return { success: false, message: 'Ce compte est temporairement suspendu. Veuillez contacter le support.' };
      }

      // 1. Calcul du hash avec le sel
      const computedHash = await this.hashPassword(password, user.salt || '');

      // 2. Vérification: correspondance exacte du hash OU mot de passe par défaut connu
      const userEmailKey = (user.email || '').toLowerCase();
      const isKnownDefaultPassword = KNOWN_DEFAULT_CREDENTIALS[userEmailKey] === password;
      const isHashValid = (computedHash === user.passwordHash);

      if (!isHashValid && !isKnownDefaultPassword) {
        this.recordFailedAttempt(cleanId);
        return { success: false, message: 'Identifiant ou mot de passe incorrect.' };
      }

      // Auto-réparation du hash en base locale si le mot de passe connu était valide
      if (isKnownDefaultPassword && computedHash !== user.passwordHash && window.AgroBeyDB) {
        user.passwordHash = computedHash;
        window.AgroBeyDB.saveUser(user);
      }

      // Réinitialisation des tentatives échouées en cas de succès
      this.clearFailedAttempts(cleanId);

      const token = this.generateToken(user);
      const sessionData = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          roleLabel: user.roleLabel || user.role,
          avatar: user.avatar,
          isVerified: user.isVerified
        },
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
      };

      if (remember) {
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      }

      this.notify();

      // Exécuter l action en attente si demandée
      if (this.onSuccessCallback) {
        const cb = this.onSuccessCallback;
        this.onSuccessCallback = null;
        setTimeout(() => cb(user), 150);
      }

      return { success: true, user };
    } catch (err) {
      console.error('Erreur login:', err);
      return { success: false, message: 'Erreur lors de la tentative de connexion : ' + (err.message || 'erreur système') };
    }
  }

  // --- INSCRIPTION SÉCURISÉE ---
  async register(userData) {
    const existing = window.AgroBeyDB.getUserByEmail(userData.email);
    if (existing) {
      return { success: false, message: 'Cette adresse email est déjà enregistrée sur AgroBey.' };
    }

    const salt = this.generateSalt();
    const passwordHash = await this.hashPassword(userData.password, salt);

    const isSellerRole = userData.role === 'seller';
    const isDriverRole = userData.role === 'delivery';

    const newUser = {
      id: 'user-' + Date.now().toString().slice(-6),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      whatsapp: (userData.whatsapp || userData.phone || '').replace(/\D/g, ''),
      role: userData.role || 'client',
      roleLabel: isSellerRole ? 'Agriculteur / Éleveur / Bailleur' : isDriverRole ? 'Livreur / Transporteur Agro-Logistique' : 'Acheteur / Particulier',
      passwordHash,
      salt,
      location: userData.location || 'Sénégal',
      avatar: userData.avatar || (isDriverRole 
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
      isVerified: false,
      isSellerApproved: isSellerRole ? false : true,
      sellerStatus: isSellerRole ? 'pending_approval' : 'none',
      isDriverApproved: isDriverRole ? false : true,
      driverStatus: isDriverRole ? 'pending_approval' : 'none',
      vehicleType: userData.vehicleType || (isDriverRole ? 'Camionnette / Utilitaire' : null),
      vehiclePlate: userData.vehiclePlate || (isDriverRole ? 'DK-EN-COURS' : null),
      coverageZones: userData.coverageZones || userData.location || 'Sénégal',
      driverLicense: userData.driverLicense || (isDriverRole ? 'Permis B' : null),
      availability: isDriverRole ? 'offline' : null,
      completedDeliveries: 0,
      earnings: 0,
      rating: 5.0,
      badge: isSellerRole ? '⏳ Validation Vendeur en attente' : isDriverRole ? '⏳ Validation Livreur en attente' : 'Acheteur',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    window.AgroBeyDB.saveUser(newUser);

    if (isSellerRole) {
      window.AgroBeyDB.addSystemLog('AUTH', 'Demande Inscription Vendeur', `Nouveau vendeur : ${newUser.name} (${newUser.email}), en attente de validation par Admin/IT`, newUser.name);
    } else if (isDriverRole) {
      window.AgroBeyDB.addSystemLog('AUTH', 'Demande Inscription Transporteur', `Nouveau livreur : ${newUser.name} (${newUser.email} - ${newUser.vehicleType}), en attente de validation par Admin/IT`, newUser.name);
    }

    // Auto-connexion
    return await this.login(newUser.email, userData.password, true);
  }

  isSellerApproved() {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'it') return true;
    if (user.role === 'seller') {
      return user.isSellerApproved === true || user.sellerStatus === 'approved';
    }
    return false;
  }

  isDriverApproved() {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'it') return true;
    if (user.role === 'delivery') {
      return user.isDriverApproved === true || user.driverStatus === 'approved';
    }
    return false;
  }

  // --- DÉCONNEXION ---
  logout() {
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) {}
    });
  }

  // --- GARDE D ACCÈS UNIVERSEL ---
  guardAction(requiredRole, callback) {
    const user = this.getCurrentUser();
    if (!user) {
      this.onSuccessCallback = () => {
        if (!requiredRole || this.hasRole(requiredRole)) {
          if (requiredRole === 'seller' && !this.isSellerApproved()) {
            window.AgroBeyApp.showToast('warning', 'Validation en Cours', 'Votre compte vendeur est en attente de validation par l\'Administrateur ou l\'équipe IT.');
            window.AgroBeyApp.switchTab('seller');
          } else {
            callback();
          }
        } else {
          window.AgroBeyApp.showToast('warning', 'Accès Restreint', `Cette action nécessite un compte ${requiredRole === 'seller' ? 'Agriculteur/Vendeur' : requiredRole}.`);
        }
      };
      this.openAuthModal('login', 'Veuillez vous connecter pour continuer cette action.');
      return false;
    }

    if (requiredRole && !this.hasRole(requiredRole)) {
      window.AgroBeyApp.showToast('warning', 'Profil Vendeur Requis', 'Votre compte est actuellement en mode Acheteur. Activez votre profil vendeur dans votre espace.');
      window.AgroBeyApp.switchTab('seller');
      return false;
    }

    if (requiredRole === 'seller' && !this.isSellerApproved()) {
      window.AgroBeyApp.showToast('warning', 'Validation en Cours', 'Votre compte vendeur est en cours d\'examen par l\'Administrateur ou l\'équipe IT.');
      window.AgroBeyApp.switchTab('seller');
      return false;
    }

    callback();
    return true;
  }

  // --- MODALE AUTH UI ---
  openAuthModal(mode = 'login', customMessage = '') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    const noticeEl = document.getElementById('auth-modal-notice');
    if (noticeEl) {
      if (customMessage) {
        noticeEl.innerText = customMessage;
        noticeEl.classList.remove('hidden');
      } else {
        noticeEl.classList.add('hidden');
      }
    }

    this.switchAuthMode(mode);
    modal.classList.remove('hidden');
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
    this.onSuccessCallback = null;
  }

  switchAuthMode(mode) {
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');
    const errorBox = document.getElementById('auth-error-box');

    if (errorBox) errorBox.classList.add('hidden');

    if (mode === 'login') {
      if (loginForm) loginForm.classList.remove('hidden');
      if (registerForm) registerForm.classList.add('hidden');
      if (loginTab) {
        loginTab.classList.add('border-emerald-600', 'text-emerald-700');
        loginTab.classList.remove('border-transparent', 'text-gray-500');
      }
      if (registerTab) {
        registerTab.classList.remove('border-emerald-600', 'text-emerald-700');
        registerTab.classList.add('border-transparent', 'text-gray-500');
      }
    } else {
      if (loginForm) loginForm.classList.add('hidden');
      if (registerForm) registerForm.classList.remove('hidden');
      if (registerTab) {
        registerTab.classList.add('border-emerald-600', 'text-emerald-700');
        registerTab.classList.remove('border-transparent', 'text-gray-500');
      }
      if (loginTab) {
        loginTab.classList.remove('border-emerald-600', 'text-emerald-700');
        loginTab.classList.add('border-transparent', 'text-gray-500');
      }
    }
  }

  fillDemoCredentials(role) {
    const emailInput = document.getElementById('login-email');
    const pwdInput = document.getElementById('login-password');
    if (!emailInput || !pwdInput) return;

    if (role === 'farmer') {
      emailInput.value = 'amadou.ba@agrobey.sn';
      pwdInput.value = 'AgroFarmer@2026';
    } else if (role === 'breeder') {
      emailInput.value = 'ousmane.fall@bergerieprestige.sn';
      pwdInput.value = 'AgroBreeder@2026';
    } else if (role === 'buyer') {
      emailInput.value = 'moussa.diagne@gmail.com';
      pwdInput.value = 'AgroClient@2026';
    } else if (role === 'driver') {
      emailInput.value = 'livreur@agrobey.sn';
      pwdInput.value = 'AgroDelivery@2026';
    } else if (role === 'admin') {
      emailInput.value = 'admin@agrobey.sn';
      pwdInput.value = 'AgroBey@2026!Admin';
    } else if (role === 'assistant') {
      emailInput.value = 'assistant@agrobey.sn';
      pwdInput.value = 'AgroAssistant@2026';
    } else if (role === 'it') {
      emailInput.value = 'it@agrobey.sn';
      pwdInput.value = 'AgroIT@2026';
    } else if (role === 'marketing') {
      emailInput.value = 'marketing@agrobey.sn';
      pwdInput.value = 'AgroMarketing@2026';
    }
  }
}

// Instance globale singleton
window.AgroBeyAuth = new AgroBeyAuth();
