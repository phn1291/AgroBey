/**
 * AgroBey - Espace Agriculteur, Ã‰leveur & PropriÃ©taire Terrien (Vendeur)
 * Gestion unifiÃ©e : Publication d'annonces, catalogue d'exploitation, commandes en temps rÃ©el, alertes et transport.
 */

class AgroBeySeller {
  constructor() {
    this.currentSubTab = 'listings';
    this.uploadedImages = [];
    this.init();
  }

  init() {
    window.AgroBeyDB.subscribe(() => {
      this.renderDashboard();
    });
  }

  showSubTab(tab) {
    this.currentSubTab = tab;
    this.renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderDashboard() {
    const container = document.getElementById('seller-view-content');
    if (!container) return;

    const currentUser = window.AgroBeyAuth.getCurrentUser();

    // Ã‰tat 1 : Visiteur Non ConnectÃ©
    if (!currentUser) {
      container.innerHTML = `
        <div class="max-w-md mx-auto py-16 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-20 h-20 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-tractor"></i>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Espace Producteur, Ã‰leveur & Annonces</h3>
          <p class="text-gray-500 text-xs mb-6 leading-relaxed">
            Connectez-vous ou crÃ©ez votre compte pour dÃ©poser des annonces, gÃ©rer vos rÃ©coltes, vos champs Ã  louer, vos cheptels et suivre vos commandes en direct.
          </p>
          <div class="flex flex-col gap-2.5">
            <button onclick="window.AgroBeyAuth.openAuthModal('login', 'Connectez-vous pour accÃ©der Ã  votre espace producteur.')" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
              Se Connecter Ã  mon Espace
            </button>
            <button onclick="window.AgroBeyAuth.openAuthModal('register')" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition">
              CrÃ©er un Compte Producteur
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Ã‰tat 2 : ConnectÃ© en tant que simple acheteur
    if (currentUser.role === 'client') {
      container.innerHTML = `
        <div class="max-w-lg mx-auto py-16 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-20 h-20 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-wheat-awn"></i>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Devenir Vendeur / Bailleur sur AgroBey</h3>
          <p class="text-gray-500 text-xs mb-6 leading-relaxed">
            Vous Ãªtes actuellement connectÃ© en tant qu'<strong>Acheteur (${currentUser.name})</strong>. Souhaitez-vous demander l'activation de votre profil Agriculteur / Ã‰leveur pour publier des offres ? Votre compte sera examinÃ© et validÃ© sous 24h par l'Administrateur ou l'Ã©quipe IT.
          </p>
          <button onclick="window.AgroBeyDB.updateUser('${currentUser.id}', { role: 'seller', sellerStatus: 'pending_approval', isSellerApproved: false, badge: 'â³ Validation Admin/IT en cours' }); window.AgroBeyDB.addSystemLog('AUTH', 'Demande Profil Vendeur', 'L utilisateur ${currentUser.name} a soumis une demande d'accÃ¨s vendeur', '${currentUser.name}'); window.AgroBeyApp.showToast('info', 'Demande EnvoyÃ©e', 'Votre profil vendeur est en attente d approbation par l Admin/IT.'); window.AgroBeyApp.updateUserHeaderUI(); window.AgroBeyApp.seller.renderDashboard();" class="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg transition">
            âœ“ Soumettre ma Demande de Compte Vendeur
          </button>
        </div>
      `;
      return;
    }

    const isApprovedSeller = currentUser.isSellerApproved === true || currentUser.sellerStatus === 'approved' || currentUser.role === 'admin' || currentUser.role === 'it';

    const allListings = window.AgroBeyDB.getAllListings();
    const myListings = allListings.filter(l => l.seller && (l.seller.id === currentUser.id || (l.seller.name && l.seller.name.includes(currentUser.name))));
    
    const allOrders = window.AgroBeyDB.getOrders();
    const myOrders = allOrders.filter(o => o.sellerId === currentUser.id || (o.sellerName && o.sellerName.includes(currentUser.name)));

    const myNotifs = window.AgroBeyDB.getNotifications(currentUser.id);
    const unreadNotifs = myNotifs.filter(n => !n.isRead);

    const totalRevenue = myOrders.filter(o => o.status === 'delivered' || o.status === 'confirmed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    container.innerHTML = `
      <!-- Alerte Compte en attente de validation par Admin/IT -->
      ${!isApprovedSeller ? `
        <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-300 rounded-3xl p-5 mb-6 text-emerald-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow animate-pulse">
              <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="bg-emerald-950 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Validation Admin / IT Requise</span>
                <h4 class="text-sm sm:text-base font-black text-emerald-950">Votre Compte Vendeur est en Attente de Validation</h4>
              </div>
              <p class="text-xs font-semibold text-emerald-900 mt-0.5">Le Super-Admin ou l'IngÃ©nieur IT valide votre profil sous 24h. Le dÃ©pÃ´t d'offres sera dÃ©bloquÃ© dÃ¨s approbation.</p>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto">
            <a href="https://wa.me/221770000000?text=${encodeURIComponent(`Bonjour AgroBey, je viens de crÃ©er mon compte vendeur (${currentUser.name}) et souhaite accÃ©lÃ©rer la validation.`)}" target="_blank" class="px-4 py-2.5 bg-emerald-950 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5">
              <i class="fa-brands fa-whatsapp text-emerald-400"></i> AccÃ©lÃ©rer via WhatsApp
            </a>
          </div>
        </div>
      ` : ''}

      <!-- BanniÃ¨re d'Alerte Visuelle (Nouvelle Commande ReÃ§ue) -->
      ${unreadNotifs.length > 0 ? `
        <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-300 rounded-3xl p-5 mb-6 text-emerald-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow-lg animate-bounce">
              <i class="fa-solid fa-bell"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="bg-emerald-950 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Alerte Vendeur en Direct</span>
                <h4 class="text-sm sm:text-base font-black text-emerald-950">Vous avez ${unreadNotifs.length} nouvelle(s) commande(s) reÃ§ue(s) !</h4>
              </div>
              <p class="text-xs font-semibold text-emerald-900 mt-0.5 line-clamp-1">${unreadNotifs[0].title} : ${unreadNotifs[0].message}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto">
            <button onclick="window.AgroBeyApp.seller.showSubTab('orders'); window.AgroBeyDB.markAllNotificationsAsRead('${currentUser.id}')" class="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-cart-shopping"></i> Traiter les Commandes
            </button>
            <button onclick="window.AgroBeyDB.markAllNotificationsAsRead('${currentUser.id}'); window.AgroBeyApp.seller.renderDashboard()" class="px-3 py-2.5 bg-white/70 hover:bg-white text-emerald-950 font-bold text-xs rounded-xl transition" title="Marquer comme lu">
              âœ“
            </button>
          </div>
        </div>
      ` : ''}

      <!-- En-tÃªte Espace Producteur & KPIs -->
      <div class="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              ${currentUser.name.charAt(0)}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl sm:text-2xl font-black text-gray-900">${currentUser.name}</h2>
                ${isApprovedSeller 
                  ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Vendeur ValidÃ© Admin/IT</span>' 
                  : '<span class="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><i class="fa-solid fa-hourglass-half"></i> Validation en cours</span>'}
              </div>
              <p class="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-2">
                <span><i class="fa-solid fa-location-dot text-emerald-600"></i> ${currentUser.location || 'SÃ©nÃ©gal'}</span>
                <span>â€¢</span>
                <span><i class="fa-solid fa-phone text-emerald-600"></i> ${currentUser.phone || ''}</span>
              </p>
            </div>
          </div>

          <!-- Bouton Action DÃ©poser une Nouvelle Offre -->
          ${isApprovedSeller ? `
            <button onclick="window.AgroBeyApp.seller.showSubTab('publish')" class="px-5 py-3 ${this.currentSubTab === 'publish' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold'} text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-circle-plus"></i>
              <span>DÃ©poser une Nouvelle Annonce</span>
            </button>
          ` : `
            <button onclick="window.AgroBeyApp.showToast('warning', 'Compte en Attente', 'Votre compte vendeur doit d\\'abord Ãªtre validÃ© par le Super-Admin ou l\\'Ã©quipe IT.');" class="px-5 py-3 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-lock text-amber-700"></i>
              <span>Publication VerrouillÃ©e (Validation en cours)</span>
            </button>
          `}
        </div>

        <!-- Cartes KPIs -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 cursor-pointer hover:bg-emerald-100/60 transition" onclick="window.AgroBeyApp.seller.showSubTab('listings')">
            <div class="text-emerald-700 text-xs font-bold mb-1">Annonces Actives</div>
            <div class="text-2xl font-black text-emerald-950">${myListings.length}</div>
            <div class="text-[10px] text-emerald-600 font-semibold mt-1">En ligne sur la marketplace</div>
          </div>

          <div class="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 cursor-pointer hover:bg-blue-100/60 transition" onclick="window.AgroBeyApp.seller.showSubTab('orders')">
            <div class="text-blue-700 text-xs font-bold mb-1">Commandes ReÃ§ues</div>
            <div class="text-2xl font-black text-blue-950">${myOrders.length}</div>
            <div class="text-[10px] text-blue-600 font-semibold mt-1">${myOrders.filter(o => o.status === 'pending').length} en attente de traitement</div>
          </div>

          <div class="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
            <div class="text-amber-700 text-xs font-bold mb-1">Chiffre d'Affaires</div>
            <div class="text-xl sm:text-2xl font-black text-amber-950">${new Intl.NumberFormat('fr-FR').format(totalRevenue)} <span class="text-xs">FCFA</span></div>
            <div class="text-[10px] text-amber-600 font-semibold mt-1">Commandes validÃ©es/livrÃ©es</div>
          </div>

          <div class="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 cursor-pointer hover:bg-purple-100/60 transition" onclick="window.AgroBeyApp.seller.showSubTab('notifications')">
            <div class="text-purple-700 text-xs font-bold mb-1">Alertes & Notifications</div>
            <div class="text-2xl font-black text-purple-950 flex items-center gap-1">
              ${myNotifs.length} <i class="fa-solid fa-bell text-amber-400 text-base"></i>
            </div>
            <div class="text-[10px] text-purple-600 font-semibold mt-1">${unreadNotifs.length} non lue(s)</div>
          </div>
        </div>
      </div>

      <!-- Onglets de Navigation Espace Vendeur FusionnÃ©s -->
      <div class="flex border-b border-gray-200 mb-6 gap-2 text-xs font-bold overflow-x-auto">
        <button onclick="window.AgroBeyApp.seller.showSubTab('listings')" class="py-3 px-4 rounded-t-xl transition shrink-0 flex items-center gap-2 ${this.currentSubTab === 'listings' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-boxes-stacked"></i> Mes Offres & RÃ©coltes (${myListings.length})
        </button>
        <button onclick="window.AgroBeyApp.seller.showSubTab('publish')" class="py-3 px-4 rounded-t-xl transition shrink-0 flex items-center gap-2 ${this.currentSubTab === 'publish' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-circle-plus text-amber-500"></i> âž• DÃ©poser une Annonce
        </button>
        <button onclick="window.AgroBeyApp.seller.showSubTab('orders')" class="py-3 px-4 rounded-t-xl transition shrink-0 flex items-center gap-2 ${this.currentSubTab === 'orders' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-cart-flatbed"></i> Commandes & Baux (${myOrders.length})
        </button>
        <button onclick="window.AgroBeyApp.seller.showSubTab('notifications')" class="py-3 px-4 rounded-t-xl transition shrink-0 flex items-center gap-2 ${this.currentSubTab === 'notifications' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-bell"></i> Alertes (${myNotifs.length})
        </button>
      </div>

      <!-- Contenu Selon Sous-Onglet -->
      ${this.renderSubTabContent(currentUser, myListings, myOrders, myNotifs, isApprovedSeller)}
    `;
  }

  renderSubTabContent(currentUser, myListings, myOrders, myNotifs, isApprovedSeller) {
    // SOUS-ONGLET 1 : FORMULAIRE DE PUBLICATION DIRECTE
    if (this.currentSubTab === 'publish') {
      if (!isApprovedSeller) {
        return `
          <div class="max-w-lg mx-auto py-12 text-center bg-white rounded-3xl border border-amber-300 p-8 shadow-sm">
            <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner animate-pulse">
              <i class="fa-solid fa-user-clock"></i>
            </div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase mb-2">
              Validation Admin / IT Requise
            </div>
            <h3 class="text-lg font-black text-gray-900 mb-2">Compte Vendeur en Attente d'Approbation</h3>
            <p class="text-xs text-gray-600 mb-6 leading-relaxed">
              Bonjour <strong>${currentUser.name}</strong>. ConformÃ©ment aux rÃ¨gles de sÃ©curitÃ© AgroBey, tout compte vendeur doit Ãªtre validÃ© par le Super-Admin ou l'Ã©quipe IT avant de pouvoir publier des annonces.
            </p>
            <div class="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-left text-xs space-y-2 mb-6 text-amber-950">
              <div class="font-bold flex items-center gap-2 text-amber-900">
                <i class="fa-solid fa-shield-halved text-amber-600"></i> ProcÃ©dure de validation :
              </div>
              <p class="text-[11px]">â€¢ ContrÃ´le de l'exploitation et des coordonnÃ©es sous 24h.</p>
              <p class="text-[11px]">â€¢ DÃ¨s validation, le formulaire de dÃ©pÃ´t d'offres sera accessible.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button onclick="window.AgroBeyApp.seller.showSubTab('listings')" class="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
                Consulter mon Exploitation
              </button>
              <a href="https://wa.me/221770000000?text=${encodeURIComponent(`Bonjour AgroBey, je viens de crÃ©er mon compte vendeur (${currentUser.name}) et souhaite accÃ©lÃ©rer la validation.`)}" target="_blank" class="px-6 py-3 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
                <i class="fa-brands fa-whatsapp text-emerald-600"></i> Contacter Support
              </a>
            </div>
          </div>
        `;
      }

      return `
        <div class="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-sm">
          <div class="border-b border-gray-100 pb-4 mb-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-2">
              Publication Directe
            </div>
            <h2 class="text-2xl font-black text-gray-900">DÃ©poser une Nouvelle Annonce</h2>
            <p class="text-xs text-gray-500 mt-1">Vos rÃ©coltes, cheptels, terrains ou fermes seront instantanÃ©ment visibles sur le catalogue AgroBey.</p>
          </div>

          <form id="publish-listing-form" onsubmit="window.AgroBeyApp.seller.submitNewListing(event)" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Titre clair de l'offre *</label>
              <input type="text" id="pub-title" required placeholder="Ex: Oignons sÃ©chÃ©s de Podor sac 25kg ou Champ 5 ha avec forage solaire" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">CatÃ©gorie *</label>
                <select id="pub-category" required onchange="window.AgroBeyApp.seller.handleCategoryChange(this.value)" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
                  <option value="recolte">RÃ©coltes & MaraÃ®chage</option>
                  <option value="elevage">Ã‰levage & Cheptel</option>
                  <option value="terre">Terres & Champs Agricoles</option>
                  <option value="ferme">Fermes & Poulaillers</option>
                  <option value="materiel">MatÃ©riel Agricole & Tracteurs</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-gray-700 mb-1">Type de Transaction *</label>
                <div class="flex items-center gap-4 pt-2">
                  <label class="flex items-center gap-2 cursor-pointer font-bold">
                    <input type="radio" name="pub-type" value="vente" checked class="text-emerald-600 focus:ring-emerald-500">
                    <span>Vente Directe</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-bold">
                    <input type="radio" name="pub-type" value="location" class="text-emerald-600 focus:ring-emerald-500">
                    <span>Bail Rural / Location</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Encart SpÃ©cial pour Terres & Fermes (Aucune livraison requise) -->
            <div id="pub-land-notice" class="hidden p-4 bg-gradient-to-r from-amber-50 to-amber-100/80 rounded-2xl border-2 border-amber-300 space-y-2 text-xs text-amber-950">
              <div class="flex items-center gap-2 font-black text-amber-900">
                <span class="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs"><i class="fa-solid fa-landmark-dome"></i></span>
                <span>ðŸŒ¿ Bien Foncier / Immobilier Rural</span>
              </div>
              <p class="text-[11px] text-amber-900 font-medium leading-relaxed">
                Les transactions de terres, champs et fermes sont des biens immobiliers non soumis au transport routier. Le client prendra rendez-vous pour visiter le terrain, vÃ©rifier le bornage et signer le bail rural conforme.
              </p>
              <div class="text-[10px] font-bold text-emerald-800 bg-white/80 p-2 rounded-xl border border-amber-200">
                âœ“ Aucun vÃ©hicule requis â€¢ Frais de livraison : 0 FCFA â€¢ ModÃ¨le de bail rural conforme fourni
              </div>
            </div>

            <!-- Gabarit & RÃ¨gles de Transport (Petits articles vs Gros articles/BÃ©tail) -->
            <div id="pub-logistics-section" class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <label class="block font-black text-emerald-950 text-xs flex items-center gap-1.5">
                  <i class="fa-solid fa-truck-ramp-box text-emerald-700"></i>
                  <span>Gabarit & Logistique de l'Article *</span>
                </label>
                <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">RÃ¨gles de Livraison AgroBey</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition bg-white border-emerald-400 text-emerald-950 font-bold shadow-sm" id="pub-size-small-label">
                  <input type="radio" name="pub-item-size" id="pub-size-small" value="small" checked onchange="window.AgroBeyApp.seller.toggleItemSizeUI('small')" class="mt-0.5 text-emerald-600 focus:ring-emerald-500">
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span>ðŸ›µ Petit article / MaraÃ®chage (&lt; 30 kg)</span>
                    </div>
                    <p class="text-[10px] text-gray-500 font-normal mt-0.5">Le <strong>client choisit</strong> son mode de livraison (Moto Tiak-Tiak 350-500 F/km, Tricycle, etc.).</p>
                  </div>
                </label>

                <label class="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition bg-gray-50 border-gray-200 text-gray-700" id="pub-size-large-label">
                  <input type="radio" name="pub-item-size" id="pub-size-large" value="large" onchange="window.AgroBeyApp.seller.toggleItemSizeUI('large')" class="mt-0.5 text-emerald-600 focus:ring-emerald-500">
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span>ðŸš› Gros volume / BÃ©tail / Lourd (&gt; 30 kg)</span>
                    </div>
                    <p class="text-[10px] text-gray-500 font-normal mt-0.5">Le <strong>vendeur impose</strong> le vÃ©hicule sÃ©curisÃ© adaptÃ© (Camionnette, Camion, BÃ©taillÃ¨re).</p>
                  </div>
                </label>
              </div>

              <!-- SÃ©lecteur de vÃ©hicule imposÃ© par le vendeur (affichÃ© si gros article) -->
              <div id="pub-seller-vehicle-box" class="hidden pt-2 border-t border-emerald-200/60 space-y-2">
                <label class="block font-bold text-gray-800 text-[11px]">VÃ©hicule de transport sÃ©curisÃ© requis par le vendeur :</label>
                <select id="pub-seller-vehicle" class="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl font-bold text-gray-900 outline-none text-xs">
                  <option value="camionnette">ðŸš Camionnette Frigorifique / BÃ¢chÃ©e (3.5 Tonnes)</option>
                  <option value="betaillere">ðŸ‚ Camion BÃ©taillÃ¨re / Transport BÃ©tail SpÃ©cialisÃ©</option>
                  <option value="camion">ðŸš› Camion Plateau Ridelles (10T Ã  20T)</option>
                  <option value="voiture">ðŸš— Voiture / Break Utilitaire</option>
                </select>
                <p class="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  âš ï¸ Pour la sÃ©curitÃ© de la marchandise et le bien-Ãªtre animal, la livraison Ã  deux-roues sera automatiquement bloquÃ©e pour cet article.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">Prix Unitaire (FCFA) *</label>
                <input type="number" id="pub-price" required min="100" placeholder="Ex: 9500" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold">
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">LibellÃ© du Prix *</label>
                <input type="text" id="pub-price-unit" required placeholder="Ex: le sac de 25 kg, la tÃªte, le mois" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">QuantitÃ© Disponible *</label>
                <input type="number" id="pub-quantity" required min="1" value="10" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold">
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">UnitÃ© de Mesure *</label>
                <input type="text" id="pub-unit" required placeholder="Ex: sacs, kg, tÃªtes, hectares, mois" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">RÃ©gion *</label>
                <select id="pub-region" required class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
                  <option value="ThiÃ¨s">ThiÃ¨s</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Louga">Louga</option>
                  <option value="Fatick">Fatick</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                  <option value="Kolda">Kolda</option>
                  <option value="Tambacounda">Tambacounda</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Ville / Commune / Village *</label>
                <input type="text" id="pub-city" required placeholder="Ex: Notto Diobass, Podor, Pout" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
              </div>
            </div>

            <div>
              <label class="block font-bold text-gray-700 mb-1">Description ComplÃ¨te de l'Offre *</label>
              <textarea id="pub-description" required rows="3" placeholder="DÃ©crivez l'Ã©tat, la qualitÃ©, les accÃ¨s eau/Ã©lectricitÃ©, la fraÃ®cheur..." class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs"></textarea>
            </div>

            <!-- SpÃ©cifications ClÃ©s -->
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <h4 class="font-bold text-gray-900 mb-2">CaractÃ©ristiques Techniques (Optionnel)</h4>
              <div class="grid grid-cols-2 gap-2 mb-2">
                <input type="text" id="pub-spec-k1" placeholder="Ex: VariÃ©tÃ© ou Forage" class="px-3 py-2 border rounded-xl bg-white outline-none">
                <input type="text" id="pub-spec-v1" placeholder="Ex: Violet de Galmi ou DÃ©bit 25m3/h" class="px-3 py-2 border rounded-xl bg-white outline-none">
              </div>
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="pub-spec-k2" placeholder="Ex: ClÃ´ture ou Ã‚ge" class="px-3 py-2 border rounded-xl bg-white outline-none">
                <input type="text" id="pub-spec-v2" placeholder="Ex: Grillage galvanisÃ© ou 22 mois" class="px-3 py-2 border rounded-xl bg-white outline-none">
              </div>
            </div>

            <!-- Upload Multi-Photos -->
            <div>
              <label class="block font-bold text-gray-700 mb-1">Photos de l'exploitation ou des produits</label>
              <input type="file" multiple accept="image/*" onchange="window.AgroBeyApp.seller.handleImageUpload(event)" class="w-full p-2 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-xs">
              <div id="image-previews-container" class="flex gap-2 mt-3 overflow-x-auto pb-1"></div>
            </div>

            <div class="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
              <button type="button" onclick="window.AgroBeyApp.seller.showSubTab('listings')" class="w-full sm:w-auto px-5 py-3 text-gray-600 hover:text-gray-900 font-bold text-xs rounded-xl transition">
                Annuler
              </button>
              <button type="submit" class="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-check"></i>
                <span>Publier mon Annonce ImmÃ©diatement</span>
              </button>
            </div>
          </form>
        </div>
      `;
    }

    // SOUS-ONGLET 2 : COMMANDES REÃ‡UES & BAUX
    if (this.currentSubTab === 'orders') {
      if (myOrders.length === 0) {
        return `
          <div class="bg-white rounded-3xl border border-gray-200/80 p-12 text-center text-xs text-gray-500">
            <i class="fa-solid fa-clipboard-list text-3xl text-gray-300 mb-2"></i>
            <p>Vous n'avez pas encore reÃ§u de commande.</p>
          </div>
        `;
      }

      return `
        <div class="space-y-4">
          ${myOrders.map(o => {
            const hasDelivery = o.deliveryType === 'delivery' || window.AgroBeyDB.getDeliveryByOrderId(o.id);
            return `
            <div class="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">#${o.id}</span>
                  <span class="text-xs font-bold ${o.status === 'delivered' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full'}">
                    ${o.status === 'delivered' ? 'âœ“ LivrÃ©e / ClÃ´turÃ©e' : o.status === 'confirmed' ? 'En cours de livraison' : 'En attente de traitement'}
                  </span>
                  ${hasDelivery ? `
                    <span class="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <i class="fa-solid fa-truck-fast"></i> AgroBey Express
                    </span>
                  ` : `
                    <span class="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      Retrait sur place / Foncier
                    </span>
                  `}
                  <span class="text-[11px] text-gray-400">${new Date(o.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <h4 class="font-black text-sm text-gray-900">${o.listingTitle}</h4>
                <p class="text-xs text-gray-600 mt-1">
                  Client : <strong>${o.buyerName}</strong> (${o.buyerPhone}) â€¢ QuantitÃ© : <strong>${o.quantity}</strong> â€¢ Montant : <strong class="text-emerald-800">${new Intl.NumberFormat('fr-FR').format(o.totalAmount)} FCFA</strong>
                  ${o.deliveryFee ? ` <span class="text-slate-500 font-normal">(dont transport : ${new Intl.NumberFormat('fr-FR').format(o.deliveryFee)} FCFA)</span>` : ''}
                </p>
                <p class="text-[11px] text-gray-500 mt-0.5"><i class="fa-solid fa-map-pin text-emerald-600"></i> ${o.deliveryAddress}</p>
                ${o.notes ? `<p class="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg mt-1.5 italic">Note : "${o.notes}"</p>` : ''}
              </div>

              <div class="flex items-center gap-2 shrink-0 flex-wrap">
                ${hasDelivery ? `
                  <button onclick="window.AgroBeyApp.openDeliveryTrackingModal('${o.id}')" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
                    <i class="fa-solid fa-truck-fast"></i> Suivre Colis
                  </button>
                ` : ''}

                <a href="https://wa.me/${o.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${o.buyerName}, je suis votre vendeur AgroBey pour la commande #${o.id} (${o.listingTitle}).`)}" target="_blank" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
                
                ${o.status !== 'delivered' ? `
                  <button onclick="window.AgroBeyDB.updateOrderStatus('${o.id}', 'delivered'); window.AgroBeyApp.showToast('success', 'Commande ClÃ´turÃ©e', 'La commande #${o.id} est marquÃ©e comme livrÃ©e.'); window.AgroBeyApp.seller.renderDashboard();" class="px-3.5 py-2 bg-gray-100 hover:bg-200 text-gray-800 font-bold text-xs rounded-xl transition">
                    Marquer LivrÃ©e
                  </button>
                ` : ''}
              </div>
            </div>
          `;}).join('')}
        </div>
      `;
    }

    // SOUS-ONGLET 3 : ALERTES & NOTIFICATIONS
    if (this.currentSubTab === 'notifications') {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
          <div class="flex items-center justify-between border-b pb-3 mb-4">
            <h3 class="font-bold text-sm text-gray-900">Centre d'Alertes & Notifications</h3>
            <button onclick="window.AgroBeyDB.markAllNotificationsAsRead('${currentUser.id}'); window.AgroBeyApp.seller.renderDashboard();" class="text-xs text-emerald-700 font-bold hover:underline">
              Tout marquer comme lu
            </button>
          </div>
          <div class="divide-y divide-gray-100">
            ${myNotifs.length === 0 ? '<p class="text-xs text-gray-400 py-6 text-center">Aucune notification.</p>' : myNotifs.map(n => `
              <div class="py-3.5 flex items-start justify-between gap-3 text-xs ${!n.isRead ? 'bg-emerald-50/60 -mx-6 px-6' : ''}">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full ${n.type === 'order' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center text-sm shrink-0 mt-0.5">
                    <i class="fa-solid ${n.type === 'order' ? 'fa-cart-shopping' : 'fa-bell'}"></i>
                  </div>
                  <div>
                    <h5 class="font-bold text-gray-900">${n.title}</h5>
                    <p class="text-gray-600 mt-0.5">${n.message}</p>
                    <span class="text-[10px] text-gray-400">${new Date(n.createdAt).toLocaleString('fr-FR')}</span>
                  </div>
                </div>
                ${n.buyerPhone ? `
                  <a href="https://wa.me/${n.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${n.buyerName}, suite Ã  votre commande sur AgroBey...`)}" target="_blank" class="shrink-0 px-3 py-1.5 bg-emerald-600 text-white font-bold text-[11px] rounded-lg">
                    WhatsApp
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // SOUS-ONGLET 4 (DÃ©faut) : MES OFFRES & RÃ‰COLTES
    if (myListings.length === 0) {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-12 text-center text-xs text-gray-500">
          <div class="w-16 h-16 mx-auto mb-3 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl">
            <i class="fa-solid fa-boxes-packing"></i>
          </div>
          <h4 class="font-bold text-sm text-gray-800 mb-1">Aucune annonce publiÃ©e pour le moment</h4>
          <p class="text-gray-500 text-xs mb-4">Commencez Ã  vendre vos rÃ©coltes ou louer vos terres en dÃ©posant votre premiÃ¨re annonce.</p>
          <button onclick="window.AgroBeyApp.seller.showSubTab('publish')" class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition inline-flex items-center gap-2">
            <i class="fa-solid fa-plus-circle"></i> DÃ©poser ma PremiÃ¨re Annonce
          </button>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${myListings.map(l => `
          <div class="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div class="relative h-44 bg-gray-100">
              <img src="${(l.images && l.images[0]) || 'assets/logo.jpg'}" alt="${l.title}" class="w-full h-full object-cover">
              <span class="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ${l.transactionType === 'location' ? 'Bail / Location' : 'Vente'}
              </span>
              <span class="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ${l.status === 'approved' ? 'âœ“ En Ligne' : l.status === 'pending' ? 'â³ En attente' : 'âŒ RejetÃ©e'}
              </span>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-extrabold text-sm text-gray-900 line-clamp-1 mb-1">${l.title}</h4>
                <div class="text-emerald-900 font-black text-base mb-2">
                  ${new Intl.NumberFormat('fr-FR').format(l.price)} FCFA <span class="text-xs text-gray-500 font-normal">/ ${l.priceUnit || l.unit}</span>
                </div>
                <p class="text-[11px] text-gray-500 line-clamp-2">${l.description}</p>
              </div>
              <div class="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button onclick="window.AgroBeyApp.marketplace.openDetailModal('${l.id}')" class="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                  <i class="fa-solid fa-eye"></i> Voir Fiche
                </button>
                <button onclick="if(confirm('Confirmer la suppression de cette annonce ?')) { window.AgroBeyDB.deleteListing('${l.id}'); window.AgroBeyApp.showToast('info', 'Annonce SupprimÃ©e', 'Votre offre a Ã©tÃ© retirÃ©e du catalogue.'); window.AgroBeyApp.seller.renderDashboard(); }" class="text-xs text-red-600 font-bold hover:underline flex items-center gap-1">
                  <i class="fa-solid fa-trash"></i> Supprimer
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- GESTION DU FORMULAIRE DE PUBLICATION ---
  handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImages.push(e.target.result);
        this.renderImagePreviews();
      };
      reader.readAsDataURL(file);
    }
  }

  renderImagePreviews() {
    const container = document.getElementById('image-previews-container');
    if (!container) return;

    container.innerHTML = this.uploadedImages.map((src, index) => `
      <div class="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
        <img src="${src}" class="w-full h-full object-cover">
        <button type="button" onclick="window.AgroBeyApp.seller.removeImage(${index})" class="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow">
          âœ•
        </button>
      </div>
    `).join('');
  }

  removeImage(index) {
    this.uploadedImages.splice(index, 1);
    this.renderImagePreviews();
  }

  toggleItemSizeUI(size) {
    const smallRadio = document.getElementById('pub-size-small');
    const largeRadio = document.getElementById('pub-size-large');
    const smallLabel = document.getElementById('pub-size-small-label');
    const largeLabel = document.getElementById('pub-size-large-label');
    const vehicleBox = document.getElementById('pub-seller-vehicle-box');

    if (size === 'small') {
      if (smallRadio) smallRadio.checked = true;
      if (smallLabel) smallLabel.className = 'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition bg-white border-emerald-500 text-emerald-950 font-bold shadow-sm';
      if (largeLabel) largeLabel.className = 'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition bg-gray-50 border-gray-200 text-gray-700';
      if (vehicleBox) vehicleBox.classList.add('hidden');
    } else {
      if (largeRadio) largeRadio.checked = true;
      if (largeLabel) largeLabel.className = 'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition bg-white border-emerald-500 text-emerald-950 font-bold shadow-sm';
      if (smallLabel) smallLabel.className = 'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition bg-gray-50 border-gray-200 text-gray-700';
      if (vehicleBox) vehicleBox.classList.remove('hidden');
    }
  }

  handleCategoryChange(category) {
    const logSection = document.getElementById('pub-logistics-section');
    const landNotice = document.getElementById('pub-land-notice');

    if (category === 'terre' || category === 'ferme') {
      if (logSection) logSection.classList.add('hidden');
      if (landNotice) landNotice.classList.remove('hidden');
    } else {
      if (logSection) logSection.classList.remove('hidden');
      if (landNotice) landNotice.classList.add('hidden');
      
      // PrÃ©-sÃ©lection intelligente de sÃ©curitÃ© selon la filiÃ¨re
      if (category === 'elevage') {
        this.toggleItemSizeUI('large');
        const vehSelect = document.getElementById('pub-seller-vehicle');
        if (vehSelect) vehSelect.value = 'camionnette';
      } else if (category === 'materiel') {
        this.toggleItemSizeUI('large');
        const vehSelect = document.getElementById('pub-seller-vehicle');
        if (vehSelect) vehSelect.value = 'camion';
      } else {
        this.toggleItemSizeUI('small');
      }
    }
  }

  submitNewListing(event) {
    event.preventDefault();
    const currentUser = window.AgroBeyAuth.getCurrentUser();
    if (!currentUser) return;

    const title = document.getElementById('pub-title').value.trim();
    const category = document.getElementById('pub-category').value;
    const transactionType = document.querySelector('input[name="pub-type"]:checked').value;
    const price = parseInt(document.getElementById('pub-price').value) || 0;
    const priceUnit = document.getElementById('pub-price-unit').value.trim();
    const quantity = parseInt(document.getElementById('pub-quantity').value) || 1;
    const unit = document.getElementById('pub-unit').value.trim();
    const region = document.getElementById('pub-region').value;
    const city = document.getElementById('pub-city').value.trim();
    const description = document.getElementById('pub-description').value.trim();

    // Gabarit & Logistique de livraison (Foncier vs Marchandises)
    const isLand = (category === 'terre' || category === 'ferme' || transactionType === 'location');
    const itemSize = isLand ? 'land' : (document.querySelector('input[name="pub-item-size"]:checked')?.value || 'small');
    const sellerSelectedVehicle = isLand ? null : ((itemSize === 'large') 
      ? (document.getElementById('pub-seller-vehicle')?.value || 'camionnette')
      : 'moto');

    const allowedTransportModes = isLand ? [] : ((itemSize === 'large')
      ? (sellerSelectedVehicle === 'betaillere' ? ['betaillere', 'camionnette'] : sellerSelectedVehicle === 'camion' ? ['camion'] : ['camionnette', 'camion', 'voiture'])
      : ['moto', 'tricycle', 'camionnette']);

    const transportInstructions = isLand
      ? 'Bien foncier / immobilier rural : Gestion par visite sur site et bail rural conforme (frais de livraison 0 FCFA).'
      : ((itemSize === 'large')
        ? `Article volumineux ou bÃ©tail. Acheminement sÃ©curisÃ© obligatoire en ${(sellerSelectedVehicle || 'camionnette').toUpperCase()} (moto non autorisÃ©e).`
        : `Colis lÃ©ger / petit gabarit. Acheminement flexible au choix du client (dont Moto Tiak-Tiak 350-500 FCFA/km).`);

    // SpÃ©cifications dynamiques
    const specKey1 = document.getElementById('pub-spec-k1')?.value.trim();
    const specVal1 = document.getElementById('pub-spec-v1')?.value.trim();
    const specKey2 = document.getElementById('pub-spec-k2')?.value.trim();
    const specVal2 = document.getElementById('pub-spec-v2')?.value.trim();

    const specs = {};
    if (specKey1 && specVal1) specs[specKey1] = specVal1;
    if (specKey2 && specVal2) specs[specKey2] = specVal2;
    specs['Transport RecommandÃ©'] = isLand 
      ? 'Non applicable (Visite sur site & Bail Rural)'
      : (itemSize === 'large' ? `ImposÃ© par vendeur : ${sellerSelectedVehicle}` : 'Libre au choix du client (Moto Tiak-Tiak autorisÃ©e)');

    const defaultImages = {
      recolte: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      elevage: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80',
      terre: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      ferme: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      materiel: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80'
    };

    const images = this.uploadedImages.length > 0 ? this.uploadedImages : [defaultImages[category] || 'assets/logo.jpg'];

    const newListing = {
      id: 'list-' + Date.now().toString().slice(-6),
      title,
      category,
      subCategory: category === 'recolte' ? 'RÃ©colte Locale' : category === 'elevage' ? 'Ã‰levage SÃ©lectionnÃ©' : category === 'terre' ? 'Terres & Champs' : 'Agro-Ã‰quipement',
      transactionType,
      itemSize,
      sellerSelectedVehicle,
      allowedTransportModes,
      transportInstructions,
      price,
      priceUnit,
      quantity,
      unit,
      location: { region, city, country: 'SÃ©nÃ©gal' },
      description,
      images,
      specs,
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        whatsapp: currentUser.whatsapp || currentUser.phone,
        rating: 5.0,
        reviewCount: 1,
        isVerified: currentUser.isVerified,
        badge: currentUser.badge || 'Producteur Inscrit'
      },
      status: 'approved',
      rejectionReason: null,
      isFeatured: false,
      views: 0,
      createdAt: new Date().toISOString()
    };

    window.AgroBeyDB.saveListing(newListing);
    this.uploadedImages = [];
    const formEl = document.getElementById('publish-listing-form');
    if (formEl) formEl.reset();
    this.toggleItemSizeUI('small');
    this.renderImagePreviews();

    window.AgroBeyApp.showToast('success', 'Offre PubliÃ©e !', `Votre annonce "${newListing.title}" est maintenant active sur AgroBey.`);
    // Redirection immÃ©diate vers les annonces actives du producteur
    this.showSubTab('listings');
  }
}

// Instance globale singleton
window.AgroBeySeller = AgroBeySeller;
