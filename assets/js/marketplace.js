/**
 * AgroBey - Module Marketplace & Catalogue Public
 * Filtres multi-critères, fiche produit enrichie, commande dynamique et générateur de bail rural.
 */

class AgroBeyMarketplace {
  constructor() {
    this.currentFilters = {
      category: 'all',
      transactionType: 'all',
      region: 'all',
      search: '',
      maxPrice: null,
      isFeatured: false
    };
    this.selectedListing = null;
    this.init();
  }

  init() {
    window.AgroBeyDB.subscribe(() => {
      this.render();
    });
  }

  setCategory(category) {
    this.currentFilters.category = category;
    this.updateCategoryPillsUI();
    this.render();
  }

  setFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.render();
  }

  resetFilters() {
    this.currentFilters = {
      category: 'all',
      transactionType: 'all',
      region: 'all',
      search: '',
      maxPrice: null,
      isFeatured: false
    };
    const searchInput = document.getElementById('marketplace-search');
    const regionSelect = document.getElementById('filter-region');
    const typeSelect = document.getElementById('filter-type');
    const maxPriceInput = document.getElementById('filter-max-price');

    if (searchInput) searchInput.value = '';
    if (regionSelect) regionSelect.value = 'all';
    if (typeSelect) typeSelect.value = 'all';
    if (maxPriceInput) maxPriceInput.value = '';

    this.updateCategoryPillsUI();
    this.render();
  }

  updateCategoryPillsUI() {
    document.querySelectorAll('.cat-pill').forEach(pill => {
      const cat = pill.getAttribute('data-category');
      if (cat === this.currentFilters.category) {
        pill.classList.add('bg-emerald-700', 'text-white', 'shadow-md');
        pill.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
      } else {
        pill.classList.remove('bg-emerald-700', 'text-white', 'shadow-md');
        pill.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
      }
    });
  }

  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  getCategoryBadge(category, transactionType) {
    const isLocation = transactionType === 'location';
    const typeText = isLocation ? 'Bail / Location' : 'Vente Directe';
    
    switch (category) {
      case 'recolte':
        return `<span class="badge-category badge-recolte"><i class="fa-solid fa-wheat-awn"></i> Récolte • ${typeText}</span>`;
      case 'elevage':
        return `<span class="badge-category badge-elevage"><i class="fa-solid fa-cow"></i> Élevage • ${typeText}</span>`;
      case 'terre':
        return `<span class="badge-category badge-terre"><i class="fa-solid fa-mountain-sun"></i> Terre & Champ • ${typeText}</span>`;
      case 'ferme':
        return `<span class="badge-category badge-ferme"><i class="fa-solid fa-warehouse"></i> Ferme / Poulailler • ${typeText}</span>`;
      case 'materiel':
        return `<span class="badge-category badge-materiel"><i class="fa-solid fa-tractor"></i> Matériel • ${typeText}</span>`;
      default:
        return `<span class="badge-category badge-materiel">${typeText}</span>`;
    }
  }

  render() {
    const container = document.getElementById('listings-grid');
    const countElement = document.getElementById('results-count');
    if (!container) return;

    let listings = window.AgroBeyDB.getApprovedListings();

    // Filtre Catégorie
    if (this.currentFilters.category !== 'all') {
      listings = listings.filter(l => l.category === this.currentFilters.category);
    }

    // Filtre Type de Transaction (vente / location)
    if (this.currentFilters.transactionType !== 'all') {
      listings = listings.filter(l => l.transactionType === this.currentFilters.transactionType);
    }

    // Filtre Région
    if (this.currentFilters.region !== 'all') {
      listings = listings.filter(l => l.location && l.location.region.toLowerCase() === this.currentFilters.region.toLowerCase());
    }

    // Filtre Prix Max
    if (this.currentFilters.maxPrice && this.currentFilters.maxPrice > 0) {
      listings = listings.filter(l => l.price <= this.currentFilters.maxPrice);
    }

    // Filtre Recherche
    if (this.currentFilters.search) {
      const q = this.currentFilters.search.toLowerCase().trim();
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.subCategory && l.subCategory.toLowerCase().includes(q)) ||
        (l.location && (l.location.city.toLowerCase().includes(q) || l.location.region.toLowerCase().includes(q))) ||
        (l.seller && l.seller.name.toLowerCase().includes(q))
      );
    }

    if (countElement) {
      countElement.innerText = `${listings.length} offre(s) disponible(s)`;
    }

    if (listings.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl">
            <i class="fa-solid fa-wheat-awn-circle-exclamation"></i>
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1">Aucune offre ne correspond à votre recherche</h3>
          <p class="text-xs text-gray-500 max-w-md mx-auto mb-4">Essayez d ajuster vos filtres (catégorie, région ou budget) pour découvrir d autres récoltes et opportunités foncières.</p>
          <button onclick="window.AgroBeyApp.marketplace.resetFilters()" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow">
            Réinitialiser les Filtres
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = listings.map(l => {
      const isLandOrFarm = l.category === 'terre' || l.category === 'ferme';
      const mainImg = (l.images && l.images.length > 0) ? l.images[0] : 'assets/logo.jpg';

      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm card-hover flex flex-col justify-between group">
          <div>
            <!-- Image & Badges -->
            <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-gray-100 cursor-pointer" onclick="window.AgroBeyApp.marketplace.openDetailModal('${l.id}')">
              <img src="${mainImg}" alt="${l.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              
              <!-- Badges supérieurs -->
              <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                ${this.getCategoryBadge(l.category, l.transactionType)}
                ${l.isFeatured ? '<span class="bg-amber-500 text-slate-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow"><i class="fa-solid fa-star"></i> Vedette</span>' : ''}
              </div>

              <!-- Localisation & Stock -->
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span class="flex items-center gap-1 font-semibold drop-shadow">
                  <i class="fa-solid fa-location-dot text-amber-400"></i> ${l.location ? `${l.location.city}, ${l.location.region}` : 'Sénégal'}
                </span>
                <span class="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium border border-white/20">
                  ${l.quantity} ${l.unit} dispo.
                </span>
              </div>
            </div>

            <!-- Corps de la Carte -->
            <div class="p-5">
              <div class="flex items-center justify-between gap-2 mb-2 text-xs text-gray-500">
                <span class="font-bold text-emerald-800">${l.subCategory || 'Agro-Pastorale'}</span>
                <span class="flex items-center gap-1 text-amber-600 font-bold">
                  <i class="fa-solid fa-eye text-[10px]"></i> ${l.views || 100} vues
                </span>
              </div>

              <h3 class="font-extrabold text-gray-900 text-sm sm:text-base leading-snug mb-2 line-clamp-2 hover:text-emerald-700 transition cursor-pointer" onclick="window.AgroBeyApp.marketplace.openDetailModal('${l.id}')">
                ${l.title}
              </h3>

              <p class="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                ${l.description}
              </p>

              <!-- Prix & Unité -->
              <div class="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 mb-4">
                <div class="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider">Tarif Officiel</div>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-lg sm:text-xl font-black text-emerald-950">${this.formatPrice(l.price)}</span>
                  <span class="text-xs font-semibold text-gray-500">/ ${l.priceUnit || l.unit}</span>
                </div>
              </div>

              <!-- Profil Vendeur & Badge Vérifié -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    ${l.seller.name.charAt(0)}
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 flex items-center gap-1 line-clamp-1">
                      ${l.seller.name}
                      ${l.seller.isVerified ? '<i class="fa-solid fa-circle-check text-emerald-600 text-[11px]" title="Producteur Certifié KYC"></i>' : ''}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <i class="fa-solid fa-star"></i>
                  <span>${l.seller.rating || '5.0'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'Action Inférieurs -->
          <div class="p-5 pt-0 grid grid-cols-2 gap-2 mt-2">
            <button onclick="window.AgroBeyApp.marketplace.openDetailModal('${l.id}')" class="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-circle-info text-emerald-700"></i> Détails
            </button>
            <button onclick="window.AgroBeyApp.marketplace.openOrderModal('${l.id}')" class="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-cart-shopping"></i> ${l.transactionType === 'location' ? 'Louer' : 'Acheter'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- MODALE DÉTAIL ENRICHIE ---
  openDetailModal(listingId) {
    const listing = window.AgroBeyDB.getListingById(listingId);
    if (!listing) return;

    this.selectedListing = listing;
    window.AgroBeyDB.updateListing(listingId, { views: (listing.views || 0) + 1 });

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-modal-content');
    if (!modal || !content) return;

    const isLandOrFarm = listing.category === 'terre' || listing.category === 'ferme';
    const images = listing.images && listing.images.length > 0 ? listing.images : ['assets/logo.jpg'];
    const specsEntries = Object.entries(listing.specs || {});

    content.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <!-- Colonne Visuels (Carousel / Galerie) -->
        <div class="lg:col-span-6 space-y-4">
          <div class="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            <img id="detail-main-image" src="${images[0]}" alt="${listing.title}" class="w-full h-full object-cover">
            <div class="absolute top-3 left-3">
              ${this.getCategoryBadge(listing.category, listing.transactionType)}
            </div>
            ${listing.isFeatured ? '<span class="absolute top-3 right-3 bg-amber-500 text-slate-900 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">Vedette</span>' : ''}
          </div>

          <!-- Miniatures -->
          ${images.length > 1 ? `
            <div class="flex gap-2 overflow-x-auto pb-1">
              ${images.map((img, idx) => `
                <button onclick="document.getElementById('detail-main-image').src = '${img}'" class="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-600/40 hover:border-emerald-600 shrink-0 focus:ring-2 focus:ring-emerald-500">
                  <img src="${img}" class="w-full h-full object-cover">
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Profil Producteur / Vendeur -->
          <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200/80">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-emerald-700 text-white font-bold text-base flex items-center justify-center shadow">
                  ${listing.seller.name.charAt(0)}
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                    ${listing.seller.name}
                    ${listing.seller.isVerified ? '<i class="fa-solid fa-circle-check text-emerald-600" title="Producteur Vérifié KYC"></i>' : ''}
                  </h4>
                  <p class="text-xs text-gray-500 font-medium">${listing.seller.badge || 'Membre AgroBey'}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1 text-amber-500 font-black text-sm justify-end">
                  <i class="fa-solid fa-star"></i>
                  <span>${listing.seller.rating || '5.0'}</span>
                </div>
                <span class="text-[10px] text-gray-400 font-semibold">${listing.seller.reviewCount || 10} avis vérifiés</span>
              </div>
            </div>

            <div class="flex gap-2">
              <a href="https://wa.me/${(listing.seller.whatsapp || listing.seller.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${listing.seller.name}, je suis intéressé par votre annonce sur AgroBey : "${listing.title}"`)}" target="_blank" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                <i class="fa-brands fa-whatsapp text-sm"></i> Contacter sur WhatsApp
              </a>
              <a href="tel:${listing.seller.phone}" class="py-2.5 px-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-phone text-emerald-700"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Colonne Informations Détaillées & Commande -->
        <div class="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <span class="font-bold text-emerald-800 uppercase tracking-wide">${listing.subCategory || 'Agro-Pastorale'}</span>
              <span>•</span>
              <span class="flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-500"></i> ${listing.location ? `${listing.location.city}, ${listing.location.region}` : 'Sénégal'}</span>
            </div>

            <h2 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-3">
              ${listing.title}
            </h2>

            <!-- Tarif & Disponibilité -->
            <div class="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 mb-4">
              <div class="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <div class="text-[10px] uppercase font-black text-emerald-800 tracking-wider">Prix de Référence</div>
                  <div class="text-2xl sm:text-3xl font-black text-emerald-950">${this.formatPrice(listing.price)}</div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-gray-500">Unité :</span>
                  <span class="text-xs font-black text-emerald-900 ml-1">${listing.priceUnit || listing.unit}</span>
                  <div class="text-[11px] font-semibold text-emerald-700 mt-0.5">Dispo : <strong>${listing.quantity} ${listing.unit}</strong></div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <h4 class="font-bold text-xs text-gray-900 uppercase tracking-wide mb-1.5">Description de l Offre</h4>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                ${listing.description}
              </p>
            </div>

            <!-- Spécifications Techniques Agronomiques / Pastorales -->
            ${specsEntries.length > 0 ? `
              <div class="mb-4">
                <h4 class="font-bold text-xs text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-list-check text-emerald-600"></i> Fiche Technique & Garanties
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  ${specsEntries.map(([k, v]) => `
                    <div class="bg-gray-50 p-2.5 rounded-xl border border-gray-200/70 flex justify-between gap-2">
                      <span class="font-medium text-gray-500">${k}</span>
                      <strong class="text-gray-900 text-right">${v}</strong>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- CARTE HAUTE DÉFINITION DU TERROIR & DE LA PARCELLE (SATELLITE HD) -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-xs text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                  <i class="fa-solid fa-satellite text-cyan-600"></i> Localisation Terroir & Vue Satellite HD
                </h4>
                <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  📍 ${locationDisplay}
                </span>
              </div>
              <div id="item-terroir-map" class="h-44 sm:h-48 w-full rounded-2xl border border-gray-200 shadow-inner z-0 relative bg-slate-100"></div>
            </div>
          </div>

          <!-- Boutons de Réservation & Contrat de Bail -->
          <div class="pt-4 border-t border-gray-200 space-y-2.5">
            <button onclick="window.AgroBeyApp.marketplace.openOrderModal('${listing.id}')" class="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-800/20 transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>${listing.transactionType === 'location' ? 'Réserver / Établir le Bail Rural' : 'Passer Commande Directe'}</span>
            </button>

            ${isLandOrFarm ? `
              <button onclick="window.AgroBeyApp.marketplace.openRuralLeaseContract('${listing.id}')" class="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-file-contract text-amber-600"></i>
                <span>Générer le Modèle de Contrat de Bail Rural (PDF / Imprimable)</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Initialisation de la carte Satellite HD du Terroir
    setTimeout(() => {
      try {
        const mapContainer = document.getElementById('item-terroir-map');
        if (!mapContainer) return;

        const coords = window.AgroBeyDB.getCoordinatesForLocation(locationDisplay);
        const map = window.AgroBeyMapEngine
          ? window.AgroBeyMapEngine.createMap('item-terroir-map', {
              center: [coords.lat, coords.lng],
              zoom: 13,
              theme: 'satellite',
              allowSatellite: true,
              allowZones: true,
              allowLocate: false
            })
          : L.map('item-terroir-map').setView([coords.lat, coords.lng], 13);

        const farmIcon = L.divIcon({
          className: 'agrobey-custom-marker',
          html: `<div style="background:#15803d; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2.5px solid white; box-shadow:0 0 15px rgba(21,128,61,0.8); font-size:16px;" class="animate-pulse">🌾</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        L.marker([coords.lat, coords.lng], { icon: farmIcon })
          .addTo(map._layersGroup ? map._layersGroup.markersLayer : map)
          .bindPopup(`<b>${listing.title}</b><br>Zone: ${coords.zone || locationDisplay}<br>Relief: ${coords.relief || 'Goudron'}`)
          .openPopup();
      } catch (e) {
        console.warn('Erreur chargement carte terroir:', e);
      }
    }, 150);
  }

  closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  // --- MODALE DE COMMANDE DYNAMIQUE AVEC LOGISTIQUE INTELLIGENTE ---
  openOrderModal(listingId) {
    const listing = window.AgroBeyDB.getListingById(listingId);
    if (!listing) return;

    window.AgroBeyAuth.guardAction('client', () => {
      this.closeDetailModal();
      this.selectedListing = listing;
      const modal = document.getElementById('order-modal');
      const container = document.getElementById('order-modal-content');
      if (!modal || !container) return;

      const currentUser = window.AgroBeyAuth.getCurrentUser();
      const isLandTransaction = (listing.category === 'terre' || listing.category === 'ferme' || listing.transactionType === 'location' || listing.itemSize === 'land');
      const isLocation = listing.transactionType === 'location';

      const isLargeItem = listing.itemSize === 'large';
      const defaultVehicule = isLargeItem 
        ? (listing.sellerSelectedVehicle || 'camionnette')
        : (listing.sellerSelectedVehicle || 'moto');

      const pickupLoc = typeof listing.location === 'object' && listing.location !== null 
        ? `${listing.location.city || ''}, ${listing.location.region || ''}` 
        : (listing.location || 'Thiès');

      const userLoc = currentUser ? (currentUser.location || 'Dakar') : 'Dakar';
      const initialTariff = window.AgroBeyDB.calculateSmartDeliveryTariff(pickupLoc, userLoc, defaultVehicule, {}, listing);
      const closest = !isLandTransaction ? window.AgroBeyDB.findClosestDriver(pickupLoc, defaultVehicule) : null;

      container.innerHTML = `
        <div class="p-6 max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <span class="text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                ${isLandTransaction ? (isLocation ? 'Demande de Bail Rural Conforme' : 'Achat de Parcelle Foncière') : 'Nouvelle Commande Directe'}
              </span>
              <h3 class="text-base font-extrabold text-gray-900 line-clamp-1">${listing.title}</h3>
            </div>
            <div class="text-right shrink-0">
              <div class="text-xs text-gray-400 font-semibold">Prix Unitaire</div>
              <div class="text-sm font-black text-emerald-800">${this.formatPrice(listing.price)}</div>
            </div>
          </div>

          <form id="order-submit-form" onsubmit="window.AgroBeyApp.marketplace.submitOrder(event)" class="space-y-4 text-xs">
            <input type="hidden" id="order-listing-id" value="${listing.id}">
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">
                  ${isLocation ? 'Durée du Bail (Mois) *' : `Quantité souhaitée (${listing.unit}) *`}
                </label>
                <input type="number" id="order-quantity" min="1" max="${isLocation ? 120 : (listing.quantity || 1000)}" value="1" oninput="window.AgroBeyApp.marketplace.calculateOrderTotal()" required class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold">
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Total Estimé</label>
                <div id="order-total-preview" class="w-full px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-black text-xs flex flex-col justify-center">
                  <span>${this.formatPrice(listing.price)}</span>
                </div>
              </div>
            </div>

            ${isLandTransaction ? `
              <!-- ENCART OFFICIEL : TRANSACTION FONCIÈRE & IMMOBILIÈRE (ZÉRO LIVRAISON ROUTIÈRE) -->
              <div class="p-4 bg-gradient-to-r from-amber-50 to-amber-100/80 rounded-2xl border-2 border-amber-300 space-y-2.5 text-xs text-amber-950 shadow-sm">
                <div class="flex items-center gap-2 font-black text-amber-900 text-xs">
                  <span class="w-7 h-7 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-sm shadow-sm">
                    <i class="fa-solid fa-landmark-dome"></i>
                  </span>
                  <span>🌿 Transaction Foncière & Immobilière Rurale</span>
                </div>
                <p class="text-[11px] text-amber-900/90 leading-relaxed">
                  Ce bien immobilier rural / terrain <strong>n'est pas soumis à la livraison physique</strong> par transporteur. Votre demande déclenche la mise en relation directe avec le bailleur / propriétaire (<strong>${listing.seller.name}</strong>) pour planifier :
                </p>
                <ul class="text-[10px] space-y-1 text-amber-950 font-medium pl-2">
                  <li class="flex items-center gap-1.5"><i class="fa-solid fa-check text-emerald-700"></i> Visite technique et confirmation du bornage sur place</li>
                  <li class="flex items-center gap-1.5"><i class="fa-solid fa-check text-emerald-700"></i> Vérification du titre foncier / délibération communale</li>
                  <li class="flex items-center gap-1.5"><i class="fa-solid fa-check text-emerald-700"></i> Signature de l'acte notarié ou bail rural sécurisé AgroBey</li>
                </ul>
                <div class="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[10px] font-black text-emerald-900">
                  <span class="flex items-center gap-1"><i class="fa-solid fa-certificate text-emerald-700"></i> Accompagnement juridique garanti</span>
                  <span class="bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-full">Frais de transport : 0 FCFA</span>
                </div>
              </div>
            ` : `
              <!-- Option de Livraison Agro-Logistique pour Marchandises physiques -->
              <div class="space-y-3 pt-2 border-t border-gray-100">
                <label class="block font-bold text-gray-700">Mode d'Acheminement & Transport *</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label class="flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold" id="label-opt-delivery">
                    <input type="radio" name="order-shipping-opt" id="opt-shipping-delivery" value="delivery" checked onchange="window.AgroBeyApp.marketplace.toggleShippingMode('delivery')" class="mt-0.5 text-emerald-600 focus:ring-emerald-500">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <i class="fa-solid fa-truck-fast text-emerald-600"></i>
                        <span>AgroBey Express</span>
                      </div>
                      <div class="text-[10px] text-emerald-800/80 font-normal mt-0.5">Livreur géolocalisé le plus proche</div>
                    </div>
                  </label>

                  <label class="flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition bg-gray-50 border-gray-200 text-gray-700" id="label-opt-pickup">
                    <input type="radio" name="order-shipping-opt" id="opt-shipping-pickup" value="pickup" onchange="window.AgroBeyApp.marketplace.toggleShippingMode('pickup')" class="mt-0.5 text-emerald-600 focus:ring-emerald-500">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <i class="fa-solid fa-tractor text-gray-500"></i>
                        <span>Retrait à la Ferme</span>
                      </div>
                      <div class="text-[10px] text-gray-500 font-normal mt-0.5">Récupération directe (0 FCFA)</div>
                    </div>
                  </label>
                </div>

                <!-- Section Paramètres Transport AgroBey Express -->
                <div id="shipping-details-box" class="p-3.5 bg-slate-900 text-white rounded-2xl space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <i class="fa-solid fa-route"></i> Mode de Transport & Zonage
                    </span>
                    <span id="shipping-distance-badge" class="px-2 py-0.5 bg-slate-800 text-emerald-400 rounded-md font-mono text-[10px] font-bold">
                      ~${initialTariff.distanceKm} km
                    </span>
                  </div>

                  <!-- Badge Règles Livraison : Petit colis (libre choix client) vs Gros article (imposé vendeur) -->
                  ${isLargeItem ? `
                    <div class="p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-200 text-xs space-y-1">
                      <div class="flex items-center gap-1.5 font-black text-amber-400">
                        <i class="fa-solid fa-triangle-exclamation"></i> Transport Gros Volume / Bétail Imposé
                      </div>
                      <p class="text-[10px] text-slate-300 leading-relaxed">
                        Pour des raisons de sécurité routière et de bien-être animal, le vendeur a déterminé le type de véhicule requis. <strong>La livraison à moto deux-roues n'est pas autorisée pour cet article.</strong>
                      </p>
                    </div>
                  ` : `
                    <div class="p-2.5 bg-emerald-950/70 border border-emerald-700/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                      <i class="fa-solid fa-circle-check text-emerald-400 text-sm shrink-0"></i>
                      <div class="text-[10px] leading-tight">
                        <strong>Petit article / maraîchage (< 30 kg) :</strong> Vous choisissez librement votre mode de transport (dont livraison express deux-roues Tiak-Tiak 350-500 FCFA/km).
                      </div>
                    </div>
                  `}

                  <div>
                    <label class="block text-[10px] text-slate-400 font-bold mb-1">
                      ${isLargeItem ? 'Véhicule imposé par le vendeur :' : 'Sélectionnez votre mode de transport :'}
                    </label>
                    <select id="order-vehicle-type" onchange="window.AgroBeyApp.marketplace.calculateOrderTotal()" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none text-xs font-bold ${isLargeItem ? 'border-amber-500/50 bg-slate-850' : ''}">
                      ${!isLargeItem ? `
                        <option value="moto" ${defaultVehicule === 'moto' ? 'selected' : ''}>🛵 Moto Tiak-Tiak Express (350 à 500 FCFA / km) [Recommandé]</option>
                        <option value="tricycle" ${defaultVehicule === 'tricycle' ? 'selected' : ''}>🛺 Tricycle Utilitaire (Jusqu'à 500 kg)</option>
                        <option value="camionnette" ${defaultVehicule === 'camionnette' ? 'selected' : ''}>🚐 Camionnette Frigorifique / Bâchée (3.5 Tonnes)</option>
                        <option value="camion" ${defaultVehicule === 'camion' ? 'selected' : ''}>🚛 Camion Plateau Ridelles (10T à 20T)</option>
                      ` : `
                        <option value="${listing.sellerSelectedVehicle || 'camionnette'}" selected>
                          ${(listing.sellerSelectedVehicle === 'betaillere') ? '🐂 Camion Bétaillère / Bétail Spécialisé (Imposé)' :
                            (listing.sellerSelectedVehicle === 'camion') ? '🚛 Camion Plateau Lourd 10T-20T (Imposé)' :
                            (listing.sellerSelectedVehicle === 'voiture') ? '🚗 Voiture / Break Utilitaire (Imposé)' :
                            '🚐 Camionnette Frigorifique / Bâchée 3.5T (Imposé)'}
                        </option>
                        ${(listing.sellerSelectedVehicle !== 'camion') ? '<option value="camion">🚛 Camion Plateau Ridelles 10T-20T (Surclassement)</option>' : ''}
                      `}
                    </select>
                  </div>

                  <!-- Badge Transporteur le plus proche -->
                  <div id="closest-driver-badge-box" class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold"><i class="fa-solid fa-location-crosshairs"></i></span>
                      <div>
                        <div class="font-black text-white">${closest ? closest.bestDriver.name : 'Chauffeur Agréé AgroBey'}</div>
                        <div class="text-[10px] text-emerald-400">${closest ? `À ${closest.distanceToPickupKm} km de l'exploitation (${closest.isOnline ? '🟢 En service' : '⚪ Proche'})` : 'Zonage automatique'}</div>
                      </div>
                    </div>
                    <span class="text-[9px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-black uppercase">Plus Proche</span>
                  </div>

                  <!-- Décomposition Tarifaire Multi-Facteurs (Kilométrage, Relief, Nuit/Jour, Embouteillages, Météo) -->
                  <div id="smart-tariff-breakdown" class="pt-2 border-t border-slate-800 space-y-1.5 text-[10px] text-slate-300">
                    <!-- Rendu dynamique via calculateOrderTotal() -->
                  </div>
                </div>
              </div>
            `}

            <div>
              <label class="block font-bold text-gray-700 mb-1">Votre Nom & Prénom *</label>
              <input type="text" id="order-buyer-name" value="${currentUser ? currentUser.name : ''}" required class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
            </div>

            <div>
              <label class="block font-bold text-gray-700 mb-1">Téléphone de Contact (WhatsApp) *</label>
              <input type="tel" id="order-buyer-phone" value="${currentUser ? (currentUser.phone || '') : ''}" required class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
            </div>

            <div>
              <label class="block font-bold text-gray-700 mb-1">
                ${isLandTransaction ? 'Votre Adresse de Résidence / Localisation pour Contact *' : 'Adresse de Livraison / Destination *'}
              </label>
              <input type="text" id="order-delivery-address" value="${currentUser ? (currentUser.location || 'Dakar') : 'Dakar'}" oninput="window.AgroBeyApp.marketplace.calculateOrderTotal()" placeholder="${isLandTransaction ? 'Ex: Dakar, Almadies ou Thiès Centre' : 'Ex: Dakar Médina, Restaurant Chez Marie'}" required class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
            </div>

            <div>
              <label class="block font-bold text-gray-700 mb-1">Instructions ou Modalités Particulières</label>
              <textarea id="order-notes" rows="2" placeholder="${isLandTransaction ? 'Ex: Disponibilités pour visite du terrain ce week-end, durée envisagée...' : 'Ex: Livraison par camion frigorifique avant midi...'}" class="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs"></textarea>
            </div>

            <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <i class="fa-solid fa-shield-halved text-amber-700 mr-1"></i>
              <strong>Garantie AgroBey :</strong> Aucun paiement non sécurisé. Le propriétaire et nos conseillers vous accompagnent à chaque étape.
            </div>

            <div class="flex gap-2 pt-2">
              <button type="button" onclick="window.AgroBeyApp.marketplace.closeOrderModal()" class="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition">
                Annuler
              </button>
              <button type="submit" class="w-2/3 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5">
                <i class="fa-solid ${isLandTransaction ? 'fa-file-signature' : 'fa-paper-plane'}"></i>
                <span>${isLandTransaction ? 'Confirmer la Demande Foncière' : 'Confirmer la Commande'}</span>
              </button>
            </div>
          </form>
        </div>
      `;

      modal.classList.remove('hidden');
      this.calculateOrderTotal();
    });
  }

  toggleShippingMode(mode) {
    const deliveryRadio = document.getElementById('opt-shipping-delivery');
    const pickupRadio = document.getElementById('opt-shipping-pickup');
    const labelDelivery = document.getElementById('label-opt-delivery');
    const labelPickup = document.getElementById('label-opt-pickup');
    const detailsBox = document.getElementById('shipping-details-box');

    if (mode === 'delivery') {
      if (deliveryRadio) deliveryRadio.checked = true;
      if (labelDelivery) {
        labelDelivery.className = 'flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold';
      }
      if (labelPickup) {
        labelPickup.className = 'flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition bg-gray-50 border-gray-200 text-gray-700';
      }
      if (detailsBox) detailsBox.classList.remove('hidden');
    } else {
      if (pickupRadio) pickupRadio.checked = true;
      if (labelPickup) {
        labelPickup.className = 'flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold';
      }
      if (labelDelivery) {
        labelDelivery.className = 'flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition bg-gray-50 border-gray-200 text-gray-700';
      }
      if (detailsBox) detailsBox.classList.add('hidden');
    }

    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    if (!this.selectedListing) return;
    const qtyInput = document.getElementById('order-quantity');
    const totalPreview = document.getElementById('order-total-preview');
    const vehicleSelect = document.getElementById('order-vehicle-type');
    const addressInput = document.getElementById('order-delivery-address');
    if (!qtyInput || !totalPreview) return;

    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const subtotal = qty * this.selectedListing.price;

    const isLandTransaction = (this.selectedListing.category === 'terre' || this.selectedListing.category === 'ferme' || this.selectedListing.transactionType === 'location' || this.selectedListing.itemSize === 'land');
    const isLocation = this.selectedListing.transactionType === 'location';
    const deliveryRadio = document.getElementById('opt-shipping-delivery');
    const isDelivery = !isLandTransaction && deliveryRadio && deliveryRadio.checked;

    let deliveryFee = 0;
    let tariff = null;

    if (isDelivery) {
      const vehType = vehicleSelect ? vehicleSelect.value : (this.selectedListing.sellerSelectedVehicle || 'camionnette');
      const destAddress = addressInput ? addressInput.value.trim() : 'Dakar';
      const pickupLoc = typeof this.selectedListing.location === 'object' && this.selectedListing.location !== null 
        ? `${this.selectedListing.location.city || ''}, ${this.selectedListing.location.region || ''}` 
        : (this.selectedListing.location || 'Thiès');

      tariff = window.AgroBeyDB.calculateSmartDeliveryTariff(pickupLoc, destAddress, vehType, {}, this.selectedListing);
      deliveryFee = tariff.totalTariff;

      // Mise à jour de l'UI du devis
      const distBadge = document.getElementById('shipping-distance-badge');
      if (distBadge) distBadge.innerText = `~${tariff.distanceKm} km`;

      const breakdownBox = document.getElementById('smart-tariff-breakdown');
      if (breakdownBox) {
        if (tariff.vehiculeType === 'moto' && tariff.motoRateDetails) {
          const m = tariff.motoRateDetails;
          breakdownBox.innerHTML = `
            <div class="p-2 bg-slate-950 rounded-xl border border-emerald-600/40 space-y-1">
              <div class="flex justify-between items-center text-[11px] font-bold text-emerald-400">
                <span>⚡ Tarif Moto (350 - 500 F/km) :</span>
                <span class="font-mono font-black text-white bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/50">${m.ratePerKm} FCFA / km</span>
              </div>
              <div class="text-[9px] text-slate-400 leading-relaxed">
                Base 350 F + Relief (${m.highestRelief.replace('_', ' ')}: +${m.breakdown.relief}F) + Nuit (+${m.breakdown.night}F) + Trafic (+${m.breakdown.traffic}F) + Zone (+${m.breakdown.accessibility}F)
              </div>
            </div>
            <div class="flex justify-between"><span>Prise en charge & caisson :</span> <strong class="text-white font-mono">1 000 FCFA</strong></div>
            <div class="flex justify-between"><span>Distance (${tariff.distanceKm} km x ${m.ratePerKm} F) :</span> <strong class="text-white font-mono">${new Intl.NumberFormat('fr-FR').format(tariff.distanceKm * m.ratePerKm)} FCFA</strong></div>
            <div class="flex justify-between pt-1 border-t border-slate-800 font-bold text-xs"><span class="text-emerald-400">Total Livraison Moto :</span> <strong class="text-emerald-400 font-mono">${new Intl.NumberFormat('fr-FR').format(tariff.totalTariff)} FCFA</strong></div>
          `;
        } else {
          breakdownBox.innerHTML = `
            <div class="flex justify-between"><span>Base + Km (${tariff.distanceKm} km) :</span> <strong class="text-white font-mono">${new Intl.NumberFormat('fr-FR').format(tariff.rawBaseCost)} FCFA</strong></div>
            <div class="flex justify-between"><span>Facteur Relief (${(tariff.reliefType || 'goudron').replace('_', ' ')}) :</span> <strong class="text-amber-400">x${tariff.reliefMultiplier}</strong></div>
            <div class="flex justify-between"><span>Facteur Horaire / Nuit :</span> <strong class="text-white">${tariff.isNight ? 'x1.30 (Nuit 20h-06h)' : 'x1.0 (Jour)'}</strong></div>
            <div class="flex justify-between"><span>Facteur Trafic / Embouteillages :</span> <strong class="text-white">${tariff.isRushHour ? 'x1.25 (Pointe Urbaine)' : 'x1.0 (Fluide)'}</strong></div>
            <div class="flex justify-between pt-1 border-t border-slate-800 font-bold text-xs"><span class="text-emerald-400">Frais Livraison Calculés :</span> <strong class="text-emerald-400 font-mono">${new Intl.NumberFormat('fr-FR').format(tariff.totalTariff)} FCFA</strong></div>
          `;
        }
      }

      // Mise à jour du livreur le plus proche
      const closest = window.AgroBeyDB.findClosestDriver(pickupLoc, tariff.vehiculeType);
      const closestBox = document.getElementById('closest-driver-badge-box');
      if (closestBox && closest) {
        closestBox.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold"><i class="fa-solid fa-location-crosshairs"></i></span>
            <div>
              <div class="font-black text-white">${closest.bestDriver.name}</div>
              <div class="text-[10px] text-emerald-400">À ${closest.distanceToPickupKm} km (${closest.isOnline ? '🟢 En service' : '⚪ Proche'})</div>
            </div>
          </div>
          <span class="text-[9px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-black uppercase">Plus Proche</span>
        `;
      }
    }

    const grandTotal = subtotal + deliveryFee;

    totalPreview.innerHTML = `
      <div class="font-black text-xs text-emerald-950">${this.formatPrice(grandTotal)}</div>
      ${isLandTransaction ? `<div class="text-[9px] text-amber-800 font-bold">🌿 Foncier : Visite sur site (0 FCFA transport)</div>` : (isDelivery ? `<div class="text-[9px] text-emerald-700 font-normal">Dont ${this.formatPrice(deliveryFee)} livraison (${tariff ? tariff.distanceKm + 'km' : ''})</div>` : '')}
    `;
  }

  closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.add('hidden');
  }

  submitOrder(event) {
    event.preventDefault();
    if (!this.selectedListing) return;

    const currentUser = window.AgroBeyAuth.getCurrentUser();
    const qty = parseInt(document.getElementById('order-quantity').value) || 1;
    const buyerName = document.getElementById('order-buyer-name').value.trim();
    const buyerPhone = document.getElementById('order-buyer-phone').value.trim();
    const deliveryAddress = document.getElementById('order-delivery-address').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    const vehicleSelect = document.getElementById('order-vehicle-type');
    const vehType = vehicleSelect ? vehicleSelect.value : (this.selectedListing.sellerSelectedVehicle || 'camionnette');

    const isLandTransaction = (this.selectedListing.category === 'terre' || this.selectedListing.category === 'ferme' || this.selectedListing.transactionType === 'location' || this.selectedListing.itemSize === 'land');
    const isLocation = this.selectedListing.transactionType === 'location';
    const deliveryRadio = document.getElementById('opt-shipping-delivery');
    const hasDelivery = !isLandTransaction && deliveryRadio && deliveryRadio.checked;

    const pickupLoc = typeof this.selectedListing.location === 'object' && this.selectedListing.location !== null 
      ? `${this.selectedListing.location.city || ''}, ${this.selectedListing.location.region || ''}` 
      : (this.selectedListing.location || 'Exploitation Producteur');

    let deliveryFee = 0;
    let smartTariff = null;

    if (hasDelivery) {
      smartTariff = window.AgroBeyDB.calculateSmartDeliveryTariff(pickupLoc, deliveryAddress, vehType, {}, this.selectedListing);
      deliveryFee = smartTariff.totalTariff;
    }

    const subtotal = qty * this.selectedListing.price;
    const totalAmount = subtotal + deliveryFee;

    const orderData = {
      listingId: this.selectedListing.id,
      listingTitle: this.selectedListing.title,
      category: this.selectedListing.category,
      itemSize: isLandTransaction ? 'land' : (this.selectedListing.itemSize || 'small'),
      isLandTransaction,
      buyerId: currentUser ? currentUser.id : 'user-guest',
      buyerName,
      buyerPhone,
      buyerAddress: deliveryAddress,
      sellerId: this.selectedListing.seller.id,
      sellerName: this.selectedListing.seller.name,
      sellerPhone: this.selectedListing.seller.phone,
      quantity: qty,
      unitPrice: this.selectedListing.price,
      subtotal,
      deliveryFee,
      totalAmount,
      hasDelivery,
      vehiculeType: hasDelivery && smartTariff ? smartTariff.vehiculeType : 'aucun',
      ratePerKm: hasDelivery && smartTariff ? smartTariff.perKmRate : 0,
      motoRateDetails: hasDelivery && smartTariff ? smartTariff.motoRateDetails : null,
      orderType: this.selectedListing.transactionType,
      durationMonths: isLocation ? qty : null,
      deliveryAddress,
      notes
    };

    const newOrder = window.AgroBeyDB.createOrder(orderData);

    // Si livraison choisie (uniquement pour les articles physiques transportables), générer la mission logistique
    let newDelivery = null;
    if (hasDelivery && !isLandTransaction) {
      newDelivery = window.AgroBeyDB.createDelivery({
        orderId: newOrder.id,
        listingId: this.selectedListing.id,
        itemTitle: this.selectedListing.title,
        category: this.selectedListing.category,
        itemSize: this.selectedListing.itemSize || 'small',
        quantity: qty,
        unit: this.selectedListing.unit || 'unités',
        pickupAddress: `${pickupLoc} (${this.selectedListing.seller.name})`,
        pickupPhone: this.selectedListing.seller.phone,
        senderId: this.selectedListing.seller.id,
        senderName: this.selectedListing.seller.name,
        deliveryAddress: deliveryAddress,
        deliveryPhone: buyerPhone,
        recipientId: currentUser ? currentUser.id : 'user-guest',
        recipientName: buyerName,
        vehiculeType: smartTariff.vehiculeType,
        deliveryFee: deliveryFee,
        tariffDetails: smartTariff,
        notes: notes
      });
    }

    this.closeOrderModal();
    
    if (isLandTransaction) {
      window.AgroBeyApp.showToast('success', 'Demande Foncière Enregistrée !', `Votre demande a été transmise à ${this.selectedListing.seller.name}. Une visite sur site et la rédaction du bail conforme seront coordonnées.`);
    } else if (hasDelivery && newDelivery) {
      window.AgroBeyApp.showToast('success', 'Commande & Livraison Enregistrées !', `Votre commande #${newOrder.id} a été transmise au producteur et la mission logistique #${newDelivery.id} est ouverte.`);
      // Proposer d'ouvrir le suivi de livraison
      setTimeout(() => {
        if (confirm(`Votre commande #${newOrder.id} a été enregistrée avec succès !\nCode OTP de réception : ${newDelivery.otpCode}\n\nSouhaitez-vous afficher le suivi de livraison en direct ?`)) {
          window.AgroBeyApp.openDeliveryTrackingModal(newOrder.id);
        }
      }, 500);
    } else {
      window.AgroBeyApp.showToast('success', 'Commande Enregistrée !', `Votre commande #${newOrder.id} a été transmise directement au producteur (${this.selectedListing.seller.name}).`);
    }
  }

  // --- GÉNÉRATEUR DE CONTRAT DE BAIL RURAL CONFORME ---
  openRuralLeaseContract(listingId) {
    const listing = window.AgroBeyDB.getListingById(listingId);
    if (!listing) return;

    const modal = document.getElementById('contract-modal');
    const container = document.getElementById('contract-modal-content');
    if (!modal || !container) return;

    const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentUser = window.AgroBeyAuth.getCurrentUser() || { name: 'Moussa Diagne', phone: '+221 77 555 12 34', location: 'Dakar' };

    container.innerHTML = `
      <div class="p-6 sm:p-10 max-w-4xl mx-auto bg-white text-gray-900" id="printable-contract">
        <!-- En-tête Officiel du Contrat -->
        <div class="border-b-2 border-emerald-800 pb-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="assets/logo.jpg" alt="Logo AgroBey" class="h-16 w-16 rounded-xl border border-emerald-700/30 object-cover">
            <div>
              <h2 class="text-2xl font-black text-emerald-950">Agro<span class="text-amber-500">Bey</span> Foncier</h2>
              <p class="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Service Juridique & Baux Ruraux du Sénégal</p>
            </div>
          </div>
          <div class="text-right text-xs">
            <span class="bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full border border-emerald-300">Modèle Conforme Loi Sénégalaise</span>
            <div class="text-gray-500 font-mono mt-1">Réf : AGB-BAIL-${listing.id.toUpperCase()}-${Date.now().toString().slice(-4)}</div>
            <div class="text-gray-500">Établi le : <strong>${today}</strong></div>
          </div>
        </div>

        <div class="text-center my-6">
          <h1 class="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wide">
            CONTRAT TYPE DE BAIL RURAL D EXPLOITATION AGRICOLE ET PASTORALE
          </h1>
          <p class="text-xs text-gray-500 italic mt-1">(Régit par les dispositions du Code des Obligations Civiles et Commerciales et du Droit Foncier Rural)</p>
        </div>

        <!-- Parties Contractantes -->
        <div class="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-6 text-xs space-y-3">
          <h3 class="font-extrabold text-sm text-emerald-900 border-b pb-1.5">ENTRE LES SOUSSIGNÉS :</h3>
          <div>
            <strong class="text-gray-900">LE BAILLEUR (Propriétaire / Affectataire) :</strong><br>
            <strong>Nom / Raison Sociale :</strong> ${listing.seller.name}<br>
            <strong>Téléphone :</strong> ${listing.seller.phone} | <strong>Localisation :</strong> ${listing.location ? `${listing.location.city}, ${listing.location.region}` : 'Sénégal'}
          </div>
          <div>
            <strong class="text-gray-900">ET LE PRENEUR (Exploitant Agricole / Porteur de Projet) :</strong><br>
            <strong>Nom & Prénom :</strong> ${currentUser.name}<br>
            <strong>Téléphone :</strong> ${currentUser.phone} | <strong>Adresse :</strong> ${currentUser.location}
          </div>
        </div>

        <!-- Clauses Contractuelles -->
        <div class="space-y-4 text-xs text-gray-700 leading-relaxed">
          <div>
            <h4 class="font-bold text-gray-900 uppercase">ARTICLE 1 : OBJET DE LA LOCATION & DÉSIGNATION DU BIEN</h4>
            <p>Le Bailleur donne à bail à loyer au Preneur qui accepte, le domaine rural ci-après désigné : <strong>"${listing.title}"</strong>, situé à <strong>${listing.location ? `${listing.location.city}, Région de ${listing.location.region}` : 'Sénégal'}</strong>, d une contenance approximative de <strong>${listing.specs ? (listing.specs['Superficie'] || '5 Hectares') : '5 Hectares'}</strong>.</p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 uppercase">ARTICLE 2 : DESTINATION DE L EXPLOITATION</h4>
            <p>Le bien loué est strictement destiné aux activités agro-sylvo-pastorales : maraîchage, arboriculture fruitière, céréaliculture ou élevage d animaux autorisés. Toute modification de destination requiert l accord écrit préalable du Bailleur.</p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 uppercase">ARTICLE 3 : DURÉE DU BAIL</h4>
            <p>Le présent bail est consenti et accepté pour une durée initiale ferme de <strong>12 mois consécutifs</strong>, renouvelable par tacite reconduction sauf préavis de 3 mois notifié par écrit.</p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 uppercase">ARTICLE 4 : REDEVANCE / LOYER & MODALITÉS DE RÈGLEMENT</h4>
            <p>Le loyer mensuel est fixé à la somme de <strong>${this.formatPrice(listing.price)} (${listing.priceUnit || 'par mois'})</strong>, payable d avance le 5 de chaque mois entre les mains du Bailleur ou par virement / mobile money sécurisé.</p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 uppercase">ARTICLE 5 : EAU, FORAGE, CLÔTURE & INFRASTRUCTURES</h4>
            <p>Le Preneur jouit de l accès aux points d eau (forage solaire, puits ou réseau) mentionnés dans la fiche technique. Le Preneur s engage à maintenir en bon état les clôtures grillagées, les pompes et les installations d irrigation durant toute la période d occupation.</p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 uppercase">ARTICLE 6 : RÈGLEMENT DES DIFFÉRENDS</h4>
            <p>En cas de litige relatif à l interprétation ou à l exécution du présent contrat, les parties s engagent à rechercher une conciliation amiable avec l assistance de la médiation AgroBey ou du Chef de Village / Délégué communal avant tout recours juridictionnel.</p>
          </div>
        </div>

        <!-- Signatures des Parties -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 mt-8 border-t-2 border-gray-200 text-xs">
          <div class="text-center border p-4 rounded-xl bg-gray-50/50">
            <p class="font-black text-gray-900">Le Bailleur</p>
            <p class="text-[10px] text-gray-400 mt-0.5">("Lu et approuvé")</p>
            <div class="h-20 flex items-center justify-center font-serif text-emerald-800 italic font-bold">
              ${listing.seller.name}
            </div>
            <div class="border-t border-gray-300 pt-1 text-[10px] text-gray-500">Signature & Empreinte</div>
          </div>

          <div class="text-center border p-4 rounded-xl bg-gray-50/50">
            <p class="font-black text-gray-900">Le Preneur</p>
            <p class="text-[10px] text-gray-400 mt-0.5">("Lu et approuvé")</p>
            <div class="h-20 flex items-center justify-center font-serif text-emerald-800 italic font-bold">
              ${currentUser.name}
            </div>
            <div class="border-t border-gray-300 pt-1 text-[10px] text-gray-500">Signature & Empreinte</div>
          </div>

          <div class="col-span-2 sm:col-span-1 text-center border p-4 rounded-xl bg-gray-50/50">
            <p class="font-black text-gray-900">Témoin / Notaire / AgroBey</p>
            <p class="text-[10px] text-gray-400 mt-0.5">Visa & Cachet officiel</p>
            <div class="h-20 flex items-center justify-center text-emerald-700 font-bold text-xs">
              <span class="border-2 border-dashed border-emerald-600 px-3 py-1 rounded-lg">VISA AGROBEY OK</span>
            </div>
            <div class="border-t border-gray-300 pt-1 text-[10px] text-gray-500">Enregistrement Foncier</div>
          </div>
        </div>

        <!-- Boutons d'Action Imprimer -->
        <div class="mt-8 pt-4 border-t flex items-center justify-between no-print">
          <button onclick="window.AgroBeyApp.marketplace.closeContractModal()" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition">
            Fermer
          </button>
          <button onclick="window.print()" class="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2">
            <i class="fa-solid fa-print"></i>
            <span>Imprimer / Télécharger en PDF</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  closeContractModal() {
    const modal = document.getElementById('contract-modal');
    if (modal) modal.classList.add('hidden');
  }
}

// Instance globale singleton
window.AgroBeyMarketplace = AgroBeyMarketplace;
