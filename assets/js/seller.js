/**
 * AgroBey - Espace Agriculteur, Éleveur & Propriétaire Terrien (Vendeur)
 * Gestion des offres, commandes en temps réel, alertes et publication multi-photos.
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
  }

  renderDashboard() {
    const container = document.getElementById('seller-view-content');
    if (!container) return;

    const currentUser = window.AgroBeyAuth.getCurrentUser();

    // Si non connecté
    if (!currentUser) {
      container.innerHTML = `
        <div class="max-w-md mx-auto py-16 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-20 h-20 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-tractor"></i>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Espace Producteur & Éleveur</h3>
          <p class="text-gray-500 text-xs mb-6 leading-relaxed">
            Connectez-vous ou créez votre compte pour gérer vos récoltes, vos champs à louer, vos cheptels et suivre vos commandes en direct.
          </p>
          <div class="flex flex-col gap-2.5">
            <button onclick="window.AgroBeyAuth.openAuthModal('login')" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
              Se Connecter à mon Espace
            </button>
            <button onclick="window.AgroBeyAuth.openAuthModal('register')" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition">
              Créer un Compte Producteur
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Si l'utilisateur est un simple acheteur
    if (currentUser.role === 'client') {
      container.innerHTML = `
        <div class="max-w-lg mx-auto py-16 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-20 h-20 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            <i class="fa-solid fa-wheat-awn"></i>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Devenir Vendeur / Bailleur sur AgroBey</h3>
          <p class="text-gray-500 text-xs mb-6 leading-relaxed">
            Vous êtes actuellement connecté en tant qu'<strong>Acheteur (${currentUser.name})</strong>. Souhaitez-vous demander l'activation de votre profil Agriculteur / Éleveur ? Votre compte sera examiné et validé sous 24h par l'Administrateur ou l'équipe IT.
          </p>
          <button onclick="window.AgroBeyDB.updateUser('${currentUser.id}', { role: 'seller', sellerStatus: 'pending_approval', isSellerApproved: false, badge: '⏳ Validation Admin/IT en cours' }); window.AgroBeyDB.addSystemLog('AUTH', 'Demande Profil Vendeur', 'L utilisateur ${currentUser.name} a soumis une demande d accès vendeur', '${currentUser.name}'); window.AgroBeyApp.showToast('info', 'Demande Envoyée', 'Votre profil vendeur est en attente d approbation par l Admin/IT.'); window.AgroBeyApp.updateUserHeaderUI(); window.AgroBeyApp.seller.renderDashboard();" class="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg transition">
            ✓ Soumettre ma Demande de Compte Vendeur
          </button>
        </div>
      `;
      return;
    }

    const isApprovedSeller = currentUser.isSellerApproved === true || currentUser.sellerStatus === 'approved';

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
              <p class="text-xs font-semibold text-emerald-900 mt-0.5">Le Super-Admin ou l'Ingénieur IT valide votre profil sous 24h. Le dépôt d'offres sera débloqué dès approbation.</p>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto">
            <a href="https://wa.me/221770000000" target="_blank" class="px-4 py-2.5 bg-emerald-950 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5">
              <i class="fa-brands fa-whatsapp text-emerald-400"></i> Accélérer via WhatsApp
            </a>
          </div>
        </div>
      ` : ''}

      <!-- Bannière d'Alerte Visuelle Dorée (Nouvelle Commande Reçue) -->
      ${unreadNotifs.length > 0 ? `
        <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-300 rounded-3xl p-5 mb-6 text-emerald-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow-lg animate-bounce">
              <i class="fa-solid fa-bell"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="bg-emerald-950 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Alerte Vendeur en Direct</span>
                <h4 class="text-sm sm:text-base font-black text-emerald-950">Vous avez ${unreadNotifs.length} nouvelle(s) commande(s) reçue(s) !</h4>
              </div>
              <p class="text-xs font-semibold text-emerald-900 mt-0.5 line-clamp-1">${unreadNotifs[0].title} : ${unreadNotifs[0].message}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto">
            <button onclick="window.AgroBeyApp.seller.showSubTab('orders'); window.AgroBeyDB.markAllNotificationsAsRead('${currentUser.id}')" class="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-cart-shopping"></i> Traiter les Commandes
            </button>
            <button onclick="window.AgroBeyDB.markAllNotificationsAsRead('${currentUser.id}'); window.AgroBeyApp.seller.renderDashboard()" class="px-3 py-2.5 bg-white/70 hover:bg-white text-emerald-950 font-bold text-xs rounded-xl transition" title="Marquer comme lu">
              ✓
            </button>
          </div>
        </div>
      ` : ''}

      <!-- En-tête Espace Producteur & KPIs -->
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
                  ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Vendeur Validé Admin/IT</span>' 
                  : '<span class="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><i class="fa-solid fa-hourglass-half"></i> Validation en cours</span>'}
              </div>
              <p class="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-2">
                <span><i class="fa-solid fa-location-dot text-emerald-600"></i> ${currentUser.location}</span>
                <span>•</span>
                <span><i class="fa-solid fa-phone text-emerald-600"></i> ${currentUser.phone}</span>
              </p>
            </div>
          </div>

          ${isApprovedSeller ? `
            <button onclick="window.AgroBeyApp.switchTab('publish')" class="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-plus-circle"></i>
              <span>Déposer une Nouvelle Offre</span>
            </button>
          ` : `
            <button onclick="window.AgroBeyApp.showToast('warning', 'Compte en Attente', 'Votre compte vendeur doit d\\'abord être validé par le Super-Admin ou l\\'équipe IT.');" class="px-5 py-3 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-lock text-amber-700"></i>
              <span>Publication Verrouillée (Validation en cours)</span>
            </button>
          `}
        </div>

        <!-- Cartes KPIs -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
            <div class="text-emerald-700 text-xs font-bold mb-1">Annonces Actives</div>
            <div class="text-2xl font-black text-emerald-950">${myListings.length}</div>
            <div class="text-[10px] text-emerald-600 font-semibold mt-1">En ligne sur la marketplace</div>
          </div>

          <div class="bg-blue-50/70 border border-blue-100 rounded-2xl p-4">
            <div class="text-blue-700 text-xs font-bold mb-1">Commandes Reçues</div>
            <div class="text-2xl font-black text-blue-950">${myOrders.length}</div>
            <div class="text-[10px] text-blue-600 font-semibold mt-1">${myOrders.filter(o => o.status === 'pending').length} en attente de traitement</div>
          </div>

          <div class="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
            <div class="text-amber-700 text-xs font-bold mb-1">Chiffre d Affaires</div>
            <div class="text-xl sm:text-2xl font-black text-amber-950">${new Intl.NumberFormat('fr-FR').format(totalRevenue)} <span class="text-xs">FCFA</span></div>
            <div class="text-[10px] text-amber-600 font-semibold mt-1">Commandes validées/livrées</div>
          </div>

          <div class="bg-purple-50/70 border border-purple-100 rounded-2xl p-4">
            <div class="text-purple-700 text-xs font-bold mb-1">Note de Confiance</div>
            <div class="text-2xl font-black text-purple-950 flex items-center gap-1">
              4.9 <i class="fa-solid fa-star text-amber-400 text-base"></i>
            </div>
            <div class="text-[10px] text-purple-600 font-semibold mt-1">Score vendeur certifié</div>
          </div>
        </div>
      </div>

      <!-- Onglets de Navigation Espace Vendeur -->
      <div class="flex border-b border-gray-200 mb-6 gap-2 text-xs font-bold">
        <button onclick="window.AgroBeyApp.seller.showSubTab('listings')" class="py-3 px-4 rounded-t-xl transition flex items-center gap-2 ${this.currentSubTab === 'listings' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-boxes-stacked"></i> Mes Offres & Récoltes (${myListings.length})
        </button>
        <button onclick="window.AgroBeyApp.seller.showSubTab('orders')" class="py-3 px-4 rounded-t-xl transition flex items-center gap-2 ${this.currentSubTab === 'orders' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-cart-flatbed"></i> Commandes & Baux (${myOrders.length})
        </button>
        <button onclick="window.AgroBeyApp.seller.showSubTab('notifications')" class="py-3 px-4 rounded-t-xl transition flex items-center gap-2 ${this.currentSubTab === 'notifications' ? 'bg-white border-t-2 border-l border-r border-emerald-700 text-emerald-800' : 'text-gray-500 hover:text-emerald-700'}">
          <i class="fa-solid fa-bell"></i> Alertes (${myNotifs.length})
        </button>
      </div>

      <!-- Contenu Selon Sous-Onglet -->
      ${this.renderSubTabContent(currentUser, myListings, myOrders, myNotifs)}
    `;
  }

  renderSubTabContent(currentUser, myListings, myOrders, myNotifs) {
    if (this.currentSubTab === 'orders') {
      if (myOrders.length === 0) {
        return `
          <div class="bg-white rounded-3xl border border-gray-200/80 p-12 text-center text-xs text-gray-500">
            <i class="fa-solid fa-clipboard-list text-3xl text-gray-300 mb-2"></i>
            <p>Vous n avez pas encore reçu de commande.</p>
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
                    ${o.status === 'delivered' ? '✓ Livrée / Clôturée' : o.status === 'confirmed' ? 'En cours de livraison' : 'En attente de traitement'}
                  </span>
                  ${hasDelivery ? `
                    <span class="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <i class="fa-solid fa-truck-fast"></i> AgroBey Express
                    </span>
                  ` : `
                    <span class="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      Retrait sur place
                    </span>
                  `}
                  <span class="text-[11px] text-gray-400">${new Date(o.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <h4 class="font-black text-sm text-gray-900">${o.listingTitle}</h4>
                <p class="text-xs text-gray-600 mt-1">
                  Client : <strong>${o.buyerName}</strong> (${o.buyerPhone}) • Quantité : <strong>${o.quantity}</strong> • Montant : <strong class="text-emerald-800">${new Intl.NumberFormat('fr-FR').format(o.totalAmount)} FCFA</strong>
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
                  <button onclick="window.AgroBeyDB.updateOrderStatus('${o.id}', 'delivered'); window.AgroBeyApp.showToast('success', 'Commande Clôturée', 'La commande #${o.id} est marquée comme livrée.'); window.AgroBeyApp.seller.renderDashboard();" class="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition">
                    Marquer Livrée
                  </button>
                ` : ''}
              </div>
            </div>
          `;}).join('')}
        </div>
      `;
    }

    if (this.currentSubTab === 'notifications') {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
          <div class="flex items-center justify-between border-b pb-3 mb-4">
            <h3 class="font-bold text-sm text-gray-900">Centre d Alertes & Notifications</h3>
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
                  <a href="https://wa.me/${n.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${n.buyerName}, suite à votre commande sur AgroBey...`)}" target="_blank" class="shrink-0 px-3 py-1.5 bg-emerald-600 text-white font-bold text-[11px] rounded-lg">
                    WhatsApp
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Subtab 'listings'
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${myListings.map(l => `
          <div class="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
            <div class="relative h-44 bg-gray-100">
              <img src="${(l.images && l.images[0]) || 'assets/logo.jpg'}" alt="${l.title}" class="w-full h-full object-cover">
              <span class="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ${l.transactionType === 'location' ? 'Bail / Location' : 'Vente'}
              </span>
              <span class="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ${l.status === 'approved' ? '✓ En Ligne' : l.status === 'pending' ? '⏳ En attente' : '❌ Rejetée'}
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
                <button onclick="window.AgroBeyApp.marketplace.openDetailModal('${l.id}')" class="text-xs text-emerald-700 font-bold hover:underline">
                  Voir Fiche
                </button>
                <button onclick="if(confirm('Confirmer la suppression de cette annonce ?')) { window.AgroBeyDB.deleteListing('${l.id}'); window.AgroBeyApp.showToast('info', 'Annonce Supprimée', 'Votre offre a été retirée du catalogue.'); }" class="text-xs text-red-600 font-bold hover:underline">
                  Supprimer
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
          ✕
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
      
      // Pré-sélection intelligente de sécurité selon la filière
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
        ? `Article volumineux ou bétail. Acheminement sécurisé obligatoire en ${(sellerSelectedVehicle || 'camionnette').toUpperCase()} (moto non autorisée).`
        : `Colis léger / petit gabarit. Acheminement flexible au choix du client (dont Moto Tiak-Tiak 350-500 FCFA/km).`);

    // Spécifications dynamiques
    const specKey1 = document.getElementById('pub-spec-k1')?.value.trim();
    const specVal1 = document.getElementById('pub-spec-v1')?.value.trim();
    const specKey2 = document.getElementById('pub-spec-k2')?.value.trim();
    const specVal2 = document.getElementById('pub-spec-v2')?.value.trim();

    const specs = {};
    if (specKey1 && specVal1) specs[specKey1] = specVal1;
    if (specKey2 && specVal2) specs[specKey2] = specVal2;
    specs['Transport Recommandé'] = isLand 
      ? 'Non applicable (Visite sur site & Bail Rural)'
      : (itemSize === 'large' ? `Imposé par vendeur : ${sellerSelectedVehicle}` : 'Libre au choix du client (Moto Tiak-Tiak autorisée)');

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
      subCategory: category === 'recolte' ? 'Récolte Locale' : category === 'elevage' ? 'Élevage Sélectionné' : category === 'terre' ? 'Terres & Champs' : 'Agro-Équipement',
      transactionType,
      itemSize,
      sellerSelectedVehicle,
      allowedTransportModes,
      transportInstructions,
      price,
      priceUnit,
      quantity,
      unit,
      location: { region, city, country: 'Sénégal' },
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
    document.getElementById('publish-listing-form').reset();
    this.toggleItemSizeUI('small');
    this.renderImagePreviews();

    window.AgroBeyApp.showToast('success', 'Offre Publiée !', `Votre annonce "${newListing.title}" est maintenant active sur AgroBey.`);
    window.AgroBeyApp.switchTab('marketplace');
  }
}

// Instance globale singleton
window.AgroBeySeller = AgroBeySeller;
