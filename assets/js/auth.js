/**
 * AgroBey - Moteur d Authentification Sécurisée & Contrôle d Accès (RBAC)
 * Chiffrement SHA-256 avec sel, protection anti-bruteforce, jetons de session.
 */

class AgroBeyAuth {
  constructor() {
    this.sessionKey = 'agrobey_auth_session';
    this.bruteForceKey = 'agrobey_failed_attempts';
    this.listeners = [];
    this.onSuccessCallback = null;
  }

  // --- CRYPTOGRAPHIE SHA-256 WEB CRYPTO API ---
  async hashPassword(password, salt) {
    const text = password + salt;
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  generateSalt() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  generateToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 jours
    }));
    const sig = btoa(this.generateSalt());
    return `${header}.${payload}.${sig}`;
  }

  // --- PROTECTION ANTI-BRUTEFORCE ---
  checkBruteForce(identifier) {
    try {
      const attempts = JSON.parse(localStorage.getItem(this.bruteForceKey) || '{}');
      const cleanId = identifier.toLowerCase().trim();
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
      const attempts = JSON.parse(localStorage.getItem(this.bruteForceKey) || '{}');
      const cleanId = identifier.toLowerCase().trim();
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
      const cleanId = identifier.toLowerCase().trim();
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
    if (!session) return null;
    return window.AgroBeyDB.getUserById(session.user.id);
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

  // --- CONNEXION SÉCURISÉE ---
  async login(identifier, password, remember = true) {
    const cleanId = (identifier || '').trim();
    if (!cleanId || !password) {
      return { success: false, message: 'Veuillez saisir votre identifiant et mot de passe.' };
    }

    // Vérification anti-bruteforce
    const bruteCheck = this.checkBruteForce(cleanId);
    if (bruteCheck.locked) {
      return { success: false, message: bruteCheck.message };
    }

    const allUsers = window.AgroBeyDB.getUsers();
    const user = allUsers.find(u => 
      u.email.toLowerCase() === cleanId.toLowerCase() || 
      (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
      u.id === cleanId
    );

    if (!user) {
      this.recordFailedAttempt(cleanId);
      return { success: false, message: 'Identifiant ou mot de passe incorrect.' };
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'Ce compte est temporairement suspendu. Veuillez contacter le support.' };
    }

    // Calcul du hash avec le sel unique
    const computedHash = await this.hashPassword(password, user.salt);

    if (computedHash !== user.passwordHash) {
      this.recordFailedAttempt(cleanId);
      return { success: false, message: 'Identifiant ou mot de passe incorrect.' };
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
