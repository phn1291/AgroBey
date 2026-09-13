/**
 * AgroBey - Application Master Controller & Routeur
 * Orchestration générale, routage, modales, toasts, cloche de notifications et synchronisation live.
 */

class AgroBeyApplication {
  constructor() {
    this.currentTab = 'marketplace';
    this.marketplace = null;
    this.seller = null;
    this.support = null;
    this.admin = null;
    this.delivery = null;
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    // Enregistrement du Service Worker PWA pour mode hors-ligne et installation mobile
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('AgroBey PWA: Service Worker actif (Scope:', reg.scope, ')'))
          .catch(err => console.warn('AgroBey PWA: Enregistrement SW ignoré:', err));
      });
    }

    // Écoute de l'événement d'installation PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.classList.remove('hidden');
    });

    document.addEventListener('DOMContentLoaded', () => {
      this.marketplace = new window.AgroBeyMarketplace();
      this.seller = new window.AgroBeySeller();
      this.support = new window.AgroBeySupport();
      this.admin = new window.AgroBeyAdmin();
      this.delivery = new window.AgroBeyDelivery();

      this.bindEvents();
      this.updateUserHeaderUI();
      this.applyDynamicSettings();
      this.switchTab('marketplace');

      // Réactivité Auth
      window.AgroBeyAuth.subscribe(() => {
        this.updateUserHeaderUI();
        if (this.currentTab === 'seller') this.seller.renderDashboard();
        if (this.currentTab === 'publish') this.renderPublishGuard();
        if (this.currentTab === 'delivery') this.delivery.render();
      });

      // Réactivité DB
      window.AgroBeyDB.subscribe(() => {
        this.applyDynamicSettings();
        this.updateHeaderNotifications();
        if (this.currentTab === 'seller') this.seller.renderDashboard();
        if (this.currentTab === 'delivery') this.delivery.render();
      });

      // Fermeture des popups au clic extérieur
      document.addEventListener('click', (e) => {
        const notifContainer = document.getElementById('header-notif-container');
        const notifDropdown = document.getElementById('header-notif-dropdown');
        if (notifContainer && notifDropdown && !notifContainer.contains(e.target)) {
          notifDropdown.classList.add('hidden');
        }
      });
    });
  }

  bindEvents() {
    // Formulaire de connexion public
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('login-email').value.trim();
        const pwd = document.getElementById('login-password').value;
        const errBox = document.getElementById('auth-error-box');

        const res = await window.AgroBeyAuth.login(id, pwd, true);
        if (res.success) {
          window.AgroBeyAuth.closeAuthModal();
          this.showToast('success', 'Connexion Réussie', `Bienvenue sur AgroBey, ${res.user.name} !`);
        } else {
          if (errBox) {
            errBox.innerText = res.message;
            errBox.classList.remove('hidden');
          }
        }
      });
    }

    // Formulaire d'inscription public
    const regForm = document.getElementById('auth-register-form');
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const role = document.querySelector('input[name="reg-role"]:checked').value;
        const pwd = document.getElementById('reg-password').value;
        const location = document.getElementById('reg-location').value.trim();
        const errBox = document.getElementById('auth-error-box');

        const res = await window.AgroBeyAuth.register({ name, email, phone, role, password: pwd, location });
        if (res.success) {
          window.AgroBeyAuth.closeAuthModal();
          this.showToast('success', 'Compte Créé', `Bienvenue parmi nous, ${name} !`);
        } else {
          if (errBox) {
            errBox.innerText = res.message;
            errBox.classList.remove('hidden');
          }
        }
      });
    }
  }

  switchTab(tab) {
    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    
    // Règle d'accès stricte : Les comptes livreurs ont un accès exclusif à la page livreur
    if (currentUser && currentUser.role === 'delivery') {
      if (tab !== 'delivery') {
        this.showToast('info', 'Espace Réservé Livreur', 'Votre compte est configuré en mode Transporteur / Livreur. Vous avez accès exclusif à votre Cockpit Logistique.');
        tab = 'delivery';
      }
    }

    this.currentTab = tab;

    // Mise à jour des boutons de navigation desktop et mobile
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('text-emerald-700', 'bg-emerald-50');
        btn.classList.remove('text-gray-600', 'hover:text-emerald-700');
      } else {
        btn.classList.remove('text-emerald-700', 'bg-emerald-50');
        btn.classList.add('text-gray-600', 'hover:text-emerald-700');
      }
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('text-emerald-700', 'font-black');
        btn.classList.remove('text-gray-500');
      } else {
        btn.classList.remove('text-emerald-700', 'font-black');
        btn.classList.add('text-gray-500');
      }
    });

    // Affichage des vues
    const views = ['marketplace', 'publish', 'seller', 'support', 'delivery'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === tab) {
          el.classList.remove('hidden');
          el.classList.add('fade-in');
        } else {
          el.classList.add('hidden');
          el.classList.remove('fade-in');
        }
      }
    });

    if (tab === 'marketplace' && this.marketplace) this.marketplace.render();
    if (tab === 'publish') {
      const user = window.AgroBeyAuth.getCurrentUser();
      if (!user) {
        window.AgroBeyAuth.guardAction('seller', () => {
          this.switchTab('publish');
        });
        return;
      }
      this.renderPublishGuard();
    }
    if (tab === 'seller' && this.seller) this.seller.renderDashboard();
    if (tab === 'support' && this.support) this.support.render();
    if (tab === 'delivery' && this.delivery) this.delivery.render();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderPublishGuard() {
    const pubContent = document.getElementById('publish-guard-container');
    const pubForm = document.getElementById('publish-form-actual');
    if (!pubContent || !pubForm) return;

    const user = window.AgroBeyAuth.getCurrentUser();

    if (!user) {
      pubContent.classList.remove('hidden');
      pubForm.classList.add('hidden');
      pubContent.innerHTML = `
        <div class="max-w-md mx-auto py-12 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-lock text-emerald-700"></i>
          </div>
          <h3 class="text-lg font-black text-gray-900 mb-2">Espace Réservé aux Vendeurs</h3>
          <p class="text-xs text-gray-500 mb-6 leading-relaxed">
            La publication d'annonces est exclusivement réservée aux comptes <strong>Agriculteurs, Éleveurs et Bailleurs</strong>. Connectez-vous avec un compte vendeur pour continuer.
          </p>
          <div class="flex flex-col gap-2.5">
            <button onclick="window.AgroBeyAuth.openAuthModal('login', 'Connectez-vous avec un compte vendeur pour publier.')" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
              Se Connecter (Compte Vendeur)
            </button>
            <button onclick="window.AgroBeyAuth.openAuthModal('register')" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition">
              Créer un Compte Producteur
            </button>
          </div>
        </div>
      `;
    } else if (user.role === 'client') {
      pubContent.classList.remove('hidden');
      pubForm.classList.add('hidden');
      pubContent.innerHTML = `
        <div class="max-w-lg mx-auto py-12 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-wheat-awn"></i>
          </div>
          <h3 class="text-lg font-black text-gray-900 mb-2">Compte Acheteur Détecté</h3>
          <p class="text-xs text-gray-500 mb-6 leading-relaxed">
            Vous êtes actuellement connecté en tant qu'<strong>Acheteur (${user.name})</strong>. Pour pouvoir déposer des annonces et commercialiser vos récoltes ou terres, demandez l'activation de votre profil Vendeur (validation sous 24h par l'Admin ou l'IT).
          </p>
          <div class="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button onclick="window.AgroBeyDB.updateUser('${user.id}', { role: 'seller', sellerStatus: 'pending_approval', isSellerApproved: false, badge: '⏳ Validation Admin/IT en cours' }); window.AgroBeyDB.addSystemLog('AUTH', 'Demande Activation Vendeur', 'L utilisateur ${user.name} a demandé l activation de son profil vendeur.', '${user.name}'); window.AgroBeyApp.showToast('info', 'Demande Transmise', 'Votre demande de profil vendeur est en attente de validation par l\\'Admin ou l\\'IT.'); window.AgroBeyApp.updateUserHeaderUI(); window.AgroBeyApp.renderPublishGuard();" class="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg transition">
              ✓ Demander l'Activation Vendeur
            </button>
            <button onclick="window.AgroBeyApp.switchTab('marketplace')" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition">
              Retour au Catalogue
            </button>
          </div>
        </div>
      `;
    } else if (user.role === 'seller' && !user.isSellerApproved && user.sellerStatus !== 'approved') {
      pubContent.classList.remove('hidden');
      pubForm.classList.add('hidden');
      pubContent.innerHTML = `
        <div class="max-w-lg mx-auto py-12 text-center bg-white rounded-3xl border border-amber-300 p-8 shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner animate-pulse">
            <i class="fa-solid fa-user-clock"></i>
          </div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase mb-2">
            Validation Admin / IT en cours
          </div>
          <h3 class="text-lg font-black text-gray-900 mb-2">Compte Vendeur en Attente d'Approbation</h3>
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Bonjour <strong>${user.name}</strong>. Conformément aux règles de sécurité AgroBey, tout compte vendeur (agriculteur, éleveur, propriétaire terrien) doit d'abord être vérifié et validé par le <strong>Super-Admin</strong> ou l'<strong>Ingénieur IT</strong> avant de pouvoir publier des annonces sur la plateforme.
          </p>
          <div class="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-left text-xs space-y-2 mb-6 text-amber-950">
            <div class="font-bold flex items-center gap-2 text-amber-900">
              <i class="fa-solid fa-shield-halved text-amber-600"></i> Procédure de validation officielle :
            </div>
            <p class="text-[11px]">• Contrôle de l'identité et des coordonnées par l'équipe administrative.</p>
            <p class="text-[11px]">• Validation rapide sous 24h par l'équipe Admin ou IT.</p>
            <p class="text-[11px]">• Dès validation, le bouton de publication sera automatiquement débloqué.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button onclick="window.AgroBeyApp.switchTab('seller')" class="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
              Accéder à mon Espace Producteur
            </button>
            <a href="https://wa.me/221770000000?text=${encodeURIComponent(`Bonjour AgroBey, je viens de créer mon compte vendeur (${user.name}) et souhaite accélérer la validation.`)}" target="_blank" class="px-6 py-3 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
              <i class="fa-brands fa-whatsapp text-emerald-600"></i> Contacter Support
            </a>
          </div>
        </div>
      `;
    } else {
      pubContent.classList.add('hidden');
      pubForm.classList.remove('hidden');
    }
  }

  updateUserHeaderUI() {
    const user = window.AgroBeyAuth.getCurrentUser();
    const guestBox = document.getElementById('header-auth-guest');
    const userBox = document.getElementById('header-auth-user');
    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const avatarEl = document.getElementById('header-user-avatar');
    const desktopPublishBtn = document.getElementById('nav-btn-publish');
    const mobilePublishBtn = document.getElementById('mobile-nav-btn-publish');
    const mobileDrawerPublishBtn = document.getElementById('mobile-drawer-btn-publish');
    const mobileDrawerUserInfo = document.getElementById('mobile-drawer-user-info');

    // Visibilité du bouton "Déposer une annonce" : EXCLUSIVEMENT POUR LES COMPTES VENDEURS VALIDÉS & ADMINS
    const isSeller = user && (user.role === 'admin' || user.role === 'it' || (user.role === 'seller' && (user.isSellerApproved === true || user.sellerStatus === 'approved')));
    if (desktopPublishBtn) {
      if (isSeller) {
        desktopPublishBtn.classList.remove('hidden');
      } else {
        desktopPublishBtn.classList.add('hidden');
      }
    }
    if (mobilePublishBtn) {
      if (isSeller) {
        mobilePublishBtn.classList.remove('hidden');
        mobilePublishBtn.classList.add('flex');
      } else {
        mobilePublishBtn.classList.add('hidden');
        mobilePublishBtn.classList.remove('flex');
      }
    }
    if (mobileDrawerPublishBtn) {
      if (isSeller) {
        mobileDrawerPublishBtn.classList.remove('hidden');
      } else {
        mobileDrawerPublishBtn.classList.add('hidden');
      }
    }

    // Mise à jour du tiroir latéral mobile (Drawer)
    if (mobileDrawerUserInfo) {
      if (user) {
        mobileDrawerUserInfo.innerHTML = `
          <div class="flex items-center gap-3">
            <img src="${user.avatar || 'assets/logo.jpg'}" class="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow">
            <div class="flex-1">
              <div class="font-extrabold text-white text-sm line-clamp-1">${user.name}</div>
              <div class="text-[11px] text-emerald-400 font-bold">${user.roleLabel || user.role}</div>
              <div class="text-[10px] text-slate-400 font-mono">${user.phone || user.email}</div>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400">Statut:</span>
            <span class="text-[10px] font-bold ${user.isVerified ? 'text-emerald-400' : 'text-amber-400'}">
              ${user.isVerified ? '✓ Compte Vérifié KYC' : '● Actif'}
            </span>
          </div>
        `;
      } else {
        mobileDrawerUserInfo.innerHTML = `
          <div class="text-center py-2 space-y-2.5">
            <p class="text-xs text-slate-400">Connectez-vous pour gérer vos commandes et contacter les producteurs.</p>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="window.AgroBeyApp.closeMobileDrawer(); window.AgroBeyAuth.openAuthModal('login')" class="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">
                Connexion
              </button>
              <button onclick="window.AgroBeyApp.closeMobileDrawer(); window.AgroBeyAuth.openAuthModal('register')" class="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition">
                S'inscrire
              </button>
            </div>
          </div>
        `;
      }
    }

    if (!guestBox || !userBox) return;

    if (user) {
      guestBox.classList.add('hidden');
      userBox.classList.remove('hidden');
      userBox.classList.add('flex');

      if (nameEl) nameEl.innerText = user.name;
      if (roleEl) roleEl.innerText = user.roleLabel || user.role;
      if (avatarEl) {
        avatarEl.src = user.avatar || 'assets/logo.jpg';
      }

      this.updateHeaderNotifications();
    } else {
      guestBox.classList.remove('hidden');
      guestBox.classList.add('flex');
      userBox.classList.add('hidden');
      userBox.classList.remove('flex');
    }
  }

  // --- CONTRÔLEURS MOBILE : TIROIR LATÉRAL & FILTRES BOTTOM SHEET ---
  toggleMobileDrawer() {
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (overlay) {
      if (overlay.classList.contains('hidden')) {
        this.openMobileDrawer();
      } else {
        this.closeMobileDrawer();
      }
    }
  }

  openMobileDrawer() {
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeMobileDrawer() {
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  openMobileFilters() {
    const modal = document.getElementById('mobile-filter-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeMobileFilters() {
    const modal = document.getElementById('mobile-filter-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  promptPWAInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('success', 'Application Installée', 'AgroBey a été ajouté à votre écran d\'accueil !');
        }
        this.deferredPrompt = null;
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.add('hidden');
      });
    } else {
      alert('📱 Pour installer l\'application AgroBey sur votre mobile :\n\n• Sur iPhone (Safari) : Appuyez sur le bouton Partager 📤 en bas puis sur "Sur l\'écran d\'accueil" ➕.\n• Sur Android (Chrome) : Appuyez sur le menu ⋮ en haut à droite puis sur "Installer l\'application" ou "Ajouter à l\'écran d\'accueil".');
    }
  }

  updateHeaderNotifications() {
    const user = window.AgroBeyAuth.getCurrentUser();
    if (!user) return;

    const notifs = window.AgroBeyDB.getNotifications(user.id);
    const unread = notifs.filter(n => !n.isRead);

    const badge = document.getElementById('header-notif-badge');
    const countLabel = document.getElementById('header-notif-count-label');
    const list = document.getElementById('header-notif-list');

    if (badge) {
      if (unread.length > 0) {
        badge.innerText = unread.length;
        badge.classList.remove('hidden');
        badge.classList.add('flex');
      } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
      }
    }

    if (countLabel) countLabel.innerText = unread.length;

    if (list) {
      if (notifs.length === 0) {
        list.innerHTML = `<div class="p-4 text-center text-xs text-gray-400">Aucune notification.</div>`;
      } else {
        list.innerHTML = notifs.slice(0, 5).map(n => `
          <div class="p-3 hover:bg-gray-50 transition cursor-pointer text-xs ${!n.isRead ? 'bg-emerald-50/70 font-semibold' : 'text-gray-600'}" onclick="window.AgroBeyDB.markNotificationAsRead('${n.id}'); window.AgroBeyApp.switchTab('seller');">
            <div class="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
              <span>${n.title}</span>
              <span>${new Date(n.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="text-gray-900">${n.message}</div>
          </div>
        `).join('');
      }
    }
  }

  toggleNotificationsDropdown() {
    const dropdown = document.getElementById('header-notif-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  markAllNotificationsRead() {
    const user = window.AgroBeyAuth.getCurrentUser();
    if (user) {
      window.AgroBeyDB.markAllNotificationsAsRead(user.id);
      this.updateHeaderNotifications();
    }
  }

  applyDynamicSettings() {
    const s = window.AgroBeyDB.getSettings();
    if (!s) return;

    const topText = document.getElementById('topbar-announcement-text');
    if (topText && s.topbarText) topText.innerText = s.topbarText;

    const topPhone = document.getElementById('topbar-phone-number');
    if (topPhone && s.phone) topPhone.innerText = s.phone;

    const footerName = document.getElementById('footer-platform-name');
    if (footerName && s.platformName) {
      footerName.innerHTML = `Agro<span class="text-amber-500">Bey</span>`;
    }

    const footerDesc = document.getElementById('footer-description');
    if (footerDesc && s.description) footerDesc.innerText = s.description;

    const footerSlogan = document.getElementById('footer-slogan');
    if (footerSlogan && s.slogan) footerSlogan.innerText = `"${s.slogan}"`;

    const filieresTitle = document.getElementById('footer-filieres-title');
    if (filieresTitle && s.filieresTitle) filieresTitle.innerText = s.filieresTitle;

    const filieresList = document.getElementById('footer-filieres-list');
    if (filieresList && s.filieresLinks) {
      filieresList.innerHTML = s.filieresLinks.map(link => `
        <li><a href="javascript:void(0)" onclick="window.AgroBeyApp.marketplace.setCategory('all')" class="hover:text-emerald-400 transition">${link}</a></li>
      `).join('');
    }

    const servicesTitle = document.getElementById('footer-services-title');
    if (servicesTitle && s.servicesTitle) servicesTitle.innerText = s.servicesTitle;

    const servicesList = document.getElementById('footer-services-list');
    if (servicesList && s.servicesLinks) {
      servicesList.innerHTML = s.servicesLinks.map(link => `
        <li><a href="javascript:void(0)" onclick="window.AgroBeyApp.switchTab('support')" class="hover:text-emerald-400 transition">${link}</a></li>
      `).join('');
    }

    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone && s.phone) footerPhone.innerText = s.phone;

    const footerWhatsapp = document.getElementById('footer-whatsapp');
    if (footerWhatsapp && s.whatsapp) footerWhatsapp.innerText = s.whatsapp;

    const footerEmail = document.getElementById('footer-email');
    if (footerEmail && s.email) footerEmail.innerText = s.email;

    const footerHQ = document.getElementById('footer-hq');
    if (footerHQ && s.headquarters) footerHQ.innerText = s.headquarters;
  }

  openClientOrdersModal() {
    const user = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    if (!user) {
      if (window.AgroBeyAuth) {
        window.AgroBeyAuth.openAuthModal('login', 'Connectez-vous pour consulter vos commandes et contrats de baux ruraux.');
      }
      return;
    }

    const modal = document.getElementById('tracking-modal');
    const content = document.getElementById('tracking-modal-content');
    if (!modal || !content) return;

    const allOrders = window.AgroBeyDB.getOrders();
    const myOrders = allOrders.filter(o => o.buyerId === user.id || (o.buyerPhone && user.phone && o.buyerPhone.replace(/\D/g, '') === user.phone.replace(/\D/g, '')) || (o.buyerName && o.buyerName.includes(user.name)));

    content.innerHTML = `
      <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100 text-[10px] font-black uppercase">Espace Client</span>
            <span class="text-xs text-emerald-300 font-mono">${user.name}</span>
          </div>
          <button onclick="document.getElementById('tracking-modal').classList.add('hidden')" class="text-white/70 hover:text-white text-base">✕</button>
        </div>
        <h3 class="text-xl font-black text-white mt-2">Mes Commandes & Baux Ruraux</h3>
        <p class="text-xs text-emerald-200 mt-0.5">Historique de vos achats, locations foncières et suivis logistiques.</p>
      </div>

      <div class="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
        ${myOrders.length === 0 ? `
          <div class="text-center py-10 space-y-3">
            <div class="w-14 h-14 mx-auto bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-2xl">
              <i class="fa-solid fa-basket-shopping"></i>
            </div>
            <h4 class="font-bold text-gray-900 text-sm">Aucune commande enregistrée</h4>
            <p class="text-xs text-gray-500 max-w-xs mx-auto">Parcourez notre catalogue pour acheter des récoltes maraîchères ou réserver des parcelles agricoles.</p>
            <button onclick="document.getElementById('tracking-modal').classList.add('hidden'); window.AgroBeyApp.switchTab('marketplace');" class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition">
              Découvrir le Catalogue
            </button>
          </div>
        ` : `
          <div class="space-y-3">
            ${myOrders.map(o => {
              const isLand = o.isLandTransaction || o.category === 'terre' || o.category === 'ferme' || o.orderType === 'location';
              const delivery = !isLand ? window.AgroBeyDB.getDeliveryByOrderId(o.id) : null;
              return `
                <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2.5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-[10px] font-bold text-gray-400">#${o.id}</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        isLand ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        o.hasDelivery ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        'bg-gray-100 text-gray-700'
                      }">
                        ${isLand ? '🌿 Foncier / Bail' : (o.hasDelivery ? '🚚 Livraison Express' : '🚜 Retrait Direct')}
                      </span>
                    </div>
                    <span class="text-[10px] text-gray-400">${new Date(o.date).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h4 class="font-extrabold text-sm text-gray-900">${o.listingTitle}</h4>
                      <p class="text-[11px] text-gray-500">Vendeur : <strong>${o.sellerName}</strong> (${o.sellerPhone})</p>
                      <p class="text-[11px] text-gray-500">Quantité : <strong>${o.quantity} unité(s)</strong></p>
                    </div>
                    <div class="text-right">
                      <div class="font-black text-sm text-emerald-900">${new Intl.NumberFormat('fr-FR').format(o.totalAmount)} FCFA</div>
                      <div class="text-[10px] text-gray-400">${isLand ? '0 F transport' : (o.deliveryFee > 0 ? `Dont ${new Intl.NumberFormat('fr-FR').format(o.deliveryFee)} F livraison` : 'Retrait 0 F')}</div>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    ${isLand ? `
                      <button onclick="window.AgroBeyApp.marketplace.openRuralLeaseContract('${o.listingId}')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg border border-amber-300 flex items-center gap-1.5 transition">
                        <i class="fa-solid fa-file-contract text-amber-600"></i> Voir Contrat de Bail
                      </button>
                    ` : (delivery ? `
                      <button onclick="window.AgroBeyApp.openDeliveryTrackingModal('${o.id}')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-lg border border-emerald-300 flex items-center gap-1.5 transition">
                        <i class="fa-solid fa-route text-emerald-600"></i> Suivi Livraison Live
                      </button>
                    ` : `
                      <span class="text-[10px] text-gray-500">Retrait convenu directement avec le producteur.</span>
                    `)}

                    <a href="https://wa.me/${(o.sellerPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${o.sellerName}, je vous contacte concernant ma commande #${o.id} (${o.listingTitle}) sur AgroBey.`)}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 transition">
                      <i class="fa-brands fa-whatsapp"></i> Contacter
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <button onclick="document.getElementById('tracking-modal').classList.add('hidden')" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
          Fermer
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openDeliveryTrackingModal(orderId) {
    const modal = document.getElementById('tracking-modal');
    const content = document.getElementById('tracking-modal-content');
    if (!modal || !content) return;

    const delivery = window.AgroBeyDB.getDeliveryByOrderId(orderId) || window.AgroBeyDB.getDeliveryById(orderId);
    const order = window.AgroBeyDB.getOrderById(orderId) || (delivery ? window.AgroBeyDB.getOrderById(delivery.orderId) : null);

    if (!delivery) {
      content.innerHTML = `
        <div class="p-8 text-center space-y-4">
          <div class="w-16 h-16 mx-auto bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-truck"></i>
          </div>
          <h3 class="text-lg font-black text-gray-900">Aucune Livraison AgroBey Express Trouvée</h3>
          <p class="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            Cette commande (${orderId}) a été enregistrée avec l'option <strong>"Retrait direct à la ferme"</strong> ou n'a pas encore de mission logistique assignée.
          </p>
          <button onclick="document.getElementById('tracking-modal').classList.add('hidden')" class="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
            Fermer
          </button>
        </div>
      `;
      modal.classList.remove('hidden');
      return;
    }

    const steps = [
      { key: 'accepted', title: 'Mission Assignée', desc: 'Livreur en route vers la ferme', icon: 'fa-truck-ramp-box' },
      { key: 'picked_up', title: 'Colis Collecté', desc: 'Prise en charge effectuée', icon: 'fa-box-open' },
      { key: 'in_transit', title: 'En Transit', desc: 'Acheminement vers l\'adresse', icon: 'fa-truck-fast' },
      { key: 'delivered', title: 'Colis Livré', desc: 'Réception validée par code OTP', icon: 'fa-circle-check' }
    ];

    const statusIndexMap = {
      'available': -1,
      'accepted': 0,
      'picked_up': 1,
      'in_transit': 2,
      'delivered': 3,
      'cancelled': -1
    };

    const currentStepIndex = statusIndexMap[delivery.status] !== undefined ? statusIndexMap[delivery.status] : 0;
    const isDelivered = delivery.status === 'delivered';

    const originCoords = {
      lat: delivery.originLat || (window.AgroBeyDB.getCoordinatesForLocation(delivery.pickupAddress)).lat,
      lng: delivery.originLng || (window.AgroBeyDB.getCoordinatesForLocation(delivery.pickupAddress)).lng
    };

    const destCoords = {
      lat: delivery.destLat || (window.AgroBeyDB.getCoordinatesForLocation(delivery.deliveryAddress)).lat,
      lng: delivery.destLng || (window.AgroBeyDB.getCoordinatesForLocation(delivery.deliveryAddress)).lng
    };

    const tariff = delivery.tariffDetails || window.AgroBeyDB.calculateSmartDeliveryTariff(delivery.pickupAddress, delivery.deliveryAddress, delivery.vehiculeType || 'camionnette');

    const vehicleIcons = {
      moto: 'fa-motorcycle',
      tricycle: 'fa-motorcycle',
      camionnette: 'fa-truck-ramp-box',
      camion: 'fa-truck'
    };

    content.innerHTML = `
      <!-- En-tête Modale Suivi -->
      <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-black uppercase">AgroBey Express Live</span>
            <span class="text-xs text-emerald-200 font-mono">#${delivery.id}</span>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            delivery.status === 'delivered' ? 'bg-emerald-600 text-white' :
            delivery.status === 'in_transit' ? 'bg-amber-500 text-slate-950 animate-pulse' :
            delivery.status === 'picked_up' ? 'bg-cyan-600 text-white' :
            'bg-slate-700 text-slate-200'
          }">
            ${delivery.status === 'delivered' ? '✓ Livré avec succès' :
              delivery.status === 'in_transit' ? '🚚 En cours d acheminement' :
              delivery.status === 'picked_up' ? '📦 Marchandise chargée' :
              delivery.status === 'accepted' ? '⏳ Chauffeur assigné' : '⚡ En attente d affectation'}
          </span>
        </div>
        <h3 class="text-xl font-black text-white mt-2">${delivery.itemTitle}</h3>
        <p class="text-xs text-emerald-200 mt-0.5 flex items-center gap-2">
          <span>Commande : <strong class="text-white">#${delivery.orderId || 'Direct'}</strong></span>
          <span>•</span>
          <span>Quantité : <strong class="text-white">${delivery.quantity} ${delivery.unit || 'unités'}</strong></span>
          <span>•</span>
          <span>Distance : <strong class="text-white">${tariff.distanceKm} km</strong></span>
        </p>
      </div>

      <div class="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
        
        <!-- CARTE INTERACTIVE LEAFLET EN DIRECT -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-gray-700">
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-map-location-dot text-emerald-700"></i> Cartographie en Temps Réel (Tracé Sénégal)</span>
            <span class="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <i class="fa-solid fa-satellite-dish text-emerald-600 animate-pulse"></i> GPS Actif
            </span>
          </div>
          
          <div id="tracking-live-map" class="h-60 w-full rounded-2xl border border-gray-300 shadow-inner z-0 relative bg-slate-100"></div>
          
          <div class="flex items-center justify-between text-[10px] text-gray-500 px-1">
            <span><i class="fa-solid fa-wheat-awn text-emerald-700"></i> <strong>Collecte:</strong> ${delivery.pickupAddress}</span>
            <span><i class="fa-solid fa-location-dot text-red-600"></i> <strong>Arrivée:</strong> ${delivery.deliveryAddress}</span>
          </div>
        </div>

        <!-- Stepper Visuel de Suivi en Direct -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
          <h4 class="font-extrabold text-xs text-gray-900 mb-4 flex items-center justify-between">
            <span class="flex items-center gap-2"><i class="fa-solid fa-route text-emerald-700"></i> Échelons de Progression</span>
            <span class="text-[10px] font-bold text-gray-500">${delivery.trackingHistory ? delivery.trackingHistory.length : 1} étape(s) enregistrée(s)</span>
          </h4>

          <div class="relative flex items-center justify-between">
            <div class="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0"></div>
            <div class="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 -z-0" style="width: ${Math.max(0, Math.min(100, (currentStepIndex / (steps.length - 1)) * 100))}%;"></div>

            ${steps.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return `
                <div class="relative z-10 flex flex-col items-center text-center">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow transition ${
                    isCurrent ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-bounce' :
                    isPast ? 'bg-emerald-700 text-white' :
                    'bg-white text-gray-400 border border-gray-300'
                  }">
                    <i class="fa-solid ${step.icon}"></i>
                  </div>
                  <div class="mt-2 text-[10px] font-black ${isCurrent ? 'text-amber-700' : isPast ? 'text-gray-900' : 'text-gray-400'}">
                    ${step.title}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Code OTP Confidentiel pour le Destinataire -->
        ${!isDelivered ? `
          <div class="bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 border-2 border-amber-400 rounded-2xl p-4 text-center">
            <div class="flex items-center justify-center gap-1.5 text-amber-900 text-xs font-black uppercase">
              <i class="fa-solid fa-shield-halved text-amber-600"></i> Code Secret de Réception (OTP)
            </div>
            <div class="text-3xl font-black font-mono tracking-widest text-emerald-950 my-2 bg-white/80 py-1.5 px-4 rounded-xl inline-block shadow-inner border border-amber-300">
              ${delivery.otpCode || '4892'}
            </div>
            <p class="text-[11px] text-amber-900 font-semibold leading-relaxed">
              ⚠️ Communiquez ce code à 4 chiffres à votre livreur <strong>UNIQUEMENT</strong> après avoir vérifié et réceptionné votre commande.
            </p>
          </div>
        ` : `
          <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-emerald-900">
            <div class="text-2xl text-emerald-600 mb-1"><i class="fa-solid fa-circle-check"></i></div>
            <h5 class="font-black text-xs">Livraison Effectuée & Clôturée</h5>
            <p class="text-[11px] text-emerald-700 mt-0.5">Le code secret OTP a été validé avec succès.</p>
          </div>
        `}

        <!-- Carte Transporteur Assigné -->
        <div class="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm">
          <h4 class="font-bold text-gray-900 text-xs mb-3 flex items-center gap-2">
            <i class="fa-solid fa-id-badge text-emerald-700"></i> Transporteur AgroBey Agréé
          </h4>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow">
                <i class="fa-solid ${vehicleIcons[delivery.vehiculeType] || 'fa-truck-fast'}"></i>
              </div>
              <div>
                <div class="font-black text-gray-900 text-sm flex items-center gap-2">
                  <span>${delivery.driverName || 'Affectation automatique en cours'}</span>
                  <span class="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">✓ Transporteur Vérifié</span>
                </div>
                <div class="text-[11px] text-gray-500 font-medium mt-0.5">
                  Véhicule : <strong class="text-gray-700">${delivery.vehicleType || 'Camionnette Frigorifique'}</strong>
                </div>
              </div>
            </div>

            ${delivery.driverPhone ? `
              <div class="flex items-center gap-2">
                <a href="tel:${delivery.driverPhone}" class="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5">
                  <i class="fa-solid fa-phone text-emerald-700"></i> Appeler
                </a>
                <a href="https://wa.me/${delivery.driverPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${delivery.driverName}, je suis le destinataire de la course #${delivery.id} (${delivery.itemTitle}).`)}" target="_blank" class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- DÉTAILS TARIFICATION DYNAMIQUE MULTI-FACTEURS -->
        <div class="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div class="font-black text-xs text-amber-400 flex items-center gap-2">
              <i class="fa-solid fa-calculator"></i>
              <span>${delivery.vehiculeType === 'moto' ? 'Tarification Deux-Roues (350 - 500 F/km)' : 'Grille Tarifaire Dynamique Multi-Facteurs'}</span>
            </div>
            <div class="text-sm font-black text-emerald-400">
              ${new Intl.NumberFormat('fr-FR').format(delivery.deliveryFee || tariff.totalTariff)} FCFA
            </div>
          </div>

          ${delivery.vehiculeType === 'moto' && (delivery.tariffDetails?.motoRateDetails || tariff.motoRateDetails) ? `
            <div class="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2 text-[10px]">
              <div class="flex items-center justify-between">
                <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-motorcycle"></i> Tarif Kilométrique Appliqué :
                </span>
                <span class="font-mono font-black text-white bg-emerald-900/80 px-2.5 py-0.5 rounded border border-emerald-500/50">
                  ${delivery.tariffDetails?.perKmRate || tariff.perKmRate || 350} FCFA / km
                </span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800">
                <div><span class="text-slate-400">Distance :</span> <strong class="text-white">${tariff.distanceKm} km</strong></div>
                <div><span class="text-slate-400">Relief :</span> <strong class="text-amber-400 capitalize">${(tariff.reliefType || 'goudron').replace('_', ' ')}</strong></div>
                <div><span class="text-slate-400">Période :</span> <strong class="text-white">${tariff.isNight ? 'Nuit' : 'Jour'}</strong></div>
                <div><span class="text-slate-400">Trafic :</span> <strong class="text-white">${tariff.isRushHour ? 'Pointe' : 'Fluide'}</strong></div>
              </div>
            </div>
          ` : `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <span class="text-slate-400 block font-bold">📏 Kilométrage</span>
                <span class="font-extrabold text-white text-xs">${tariff.distanceKm} km</span>
              </div>
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <span class="text-slate-400 block font-bold">🚜 Relief / Terrain</span>
                <span class="font-extrabold text-white text-xs capitalize">${(tariff.reliefType || 'goudron').replace('_', ' ')} (x${tariff.reliefMultiplier || 1.0})</span>
              </div>
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <span class="text-slate-400 block font-bold">🌙 Période</span>
                <span class="font-extrabold text-white text-xs">${tariff.isNight ? 'Nuit 20h-06h (x1.30)' : 'Jour (x1.0)'}</span>
              </div>
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <span class="text-slate-400 block font-bold">🚦 Trafic / Heure</span>
                <span class="font-extrabold text-white text-xs">${tariff.isRushHour ? 'Pointe Urbaine (x1.25)' : 'Fluide (x1.0)'}</span>
              </div>
            </div>
          `}
        </div>

        <div class="flex justify-end pt-2">
          <button onclick="document.getElementById('tracking-modal').classList.add('hidden')" class="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow transition">
            Fermer le Suivi
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Initialisation de la carte Haute Performance AgroBeyMapEngine
    setTimeout(async () => {
      try {
        if (window._trackingMap) {
          window._trackingMap.remove();
          window._trackingMap = null;
        }

        const mapContainer = document.getElementById('tracking-live-map');
        if (!mapContainer) return;

        const map = window.AgroBeyMapEngine 
          ? window.AgroBeyMapEngine.createMap('tracking-live-map', {
              center: [originCoords.lat, originCoords.lng],
              zoom: 10,
              theme: 'streets',
              allowSatellite: true,
              allowZones: true,
              allowLocate: true
            })
          : L.map('tracking-live-map').setView([originCoords.lat, originCoords.lng], 10);

        window._trackingMap = map;

        // 1. Tracé de l'itinéraire routier réel OSRM
        if (window.AgroBeyMapEngine) {
          const routeResult = await window.AgroBeyMapEngine.drawMissionRoute(map, originCoords, destCoords, {
            pickupTitle: `🌾 <b>Exploitation :</b> ${delivery.pickupAddress}`,
            dropoffTitle: `📍 <b>Livraison :</b> ${delivery.deliveryAddress}`,
            color: '#15803d',
            glowColor: '#22c55e'
          });

          // 2. Si la course est en transit, démarrer l'animation fluide 60 FPS du véhicule
          if (routeResult && routeResult.routeData && routeResult.routeData.coordinates && ['accepted', 'picked_up', 'in_transit'].includes(delivery.status)) {
            window.AgroBeyMapEngine.startVehicleLiveSimulation(map, routeResult.routeData.coordinates, {
              vehicleType: delivery.vehiculeType || 'camionnette',
              speedMs: 320
            });
          }
        } else {
          // Fallback
          L.polyline([[originCoords.lat, originCoords.lng], [destCoords.lat, destCoords.lng]], {
            color: '#15803d',
            weight: 4,
            dashArray: '6, 6'
          }).addTo(map);
        }
      } catch (err) {
        console.warn('Erreur initialisation Leaflet Modal Tracking:', err);
      }
    }, 200);
  }

  showToast(type = 'success', title = '', message = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl shadow-xl border text-xs flex items-start gap-3 transition-all duration-300 transform translate-y-2 opacity-0 fade-in ${
      type === 'success' ? 'bg-emerald-900 border-emerald-700 text-white' :
      type === 'warning' ? 'bg-amber-900 border-amber-700 text-white' :
      type === 'error' ? 'bg-red-900 border-red-700 text-white' :
      'bg-slate-900 border-slate-700 text-white'
    }`;

    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' :
                 type === 'warning' ? 'fa-triangle-exclamation text-amber-400' :
                 type === 'error' ? 'fa-circle-xmark text-red-400' :
                 'fa-circle-info text-blue-400';

    toast.innerHTML = `
      <div class="text-base shrink-0 mt-0.5"><i class="fa-solid ${icon}"></i></div>
      <div class="flex-1">
        ${title ? `<h5 class="font-extrabold text-xs mb-0.5">${title}</h5>` : ''}
        <p class="leading-relaxed opacity-90">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-white/60 hover:text-white text-xs">✕</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Initialisation globale
window.AgroBeyApp = new AgroBeyApplication();
