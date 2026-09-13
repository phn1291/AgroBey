/**
 * AgroBey - Module Logistique & Cockpit Livreur / Transporteur
 * Gestion des courses en direct, acceptation de missions, étapes de transit et validation OTP.
 */

class AgroBeyDelivery {
  constructor() {
    this.currentSubTab = 'active'; // 'active' | 'available' | 'history'
    this.init();
  }

  init() {
    if (window.AgroBeyDB) {
      window.AgroBeyDB.subscribe(() => {
        if (window.AgroBeyApp && window.AgroBeyApp.currentTab === 'delivery') {
          this.render();
        }
      });
    }
  }

  switchSubTab(tab) {
    this.currentSubTab = tab;
    this.render();
  }

  render() {
    const container = document.getElementById('delivery-view-content');
    if (!container) return;

    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;

    // État 1 : Visiteur non connecté
    if (!currentUser) {
      container.innerHTML = this.renderGuestWelcome();
      return;
    }

    // État 2 : Connecté mais rôle différent (Client ou Vendeur)
    if (currentUser.role !== 'delivery' && currentUser.role !== 'admin' && currentUser.role !== 'it') {
      container.innerHTML = this.renderNonDriverView(currentUser);
      return;
    }

    // État 3 : Livreur en attente de validation Admin / IT
    const isApproved = window.AgroBeyAuth.isDriverApproved();
    if (!isApproved) {
      container.innerHTML = this.renderPendingApprovalView(currentUser);
      return;
    }

    // État 4 : Cockpit Livreur Opérationnel
    container.innerHTML = this.renderDriverCockpit(currentUser);
  }

  renderGuestWelcome() {
    return `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Hero Banner Transporteurs -->
        <div class="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600 text-amber-300 text-xs font-black uppercase mb-4">
            <i class="fa-solid fa-truck-fast"></i> Réseau Agro-Logistique du Sénégal
          </div>
          
          <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Devenez Transporteur Agréé <span class="text-amber-400">AgroBey Express</span>
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
            Acheminez les récoltes maraîchères, le bétail et les intrants agricoles des zones de production (Podor, Niayes, Casamance, Thiès) vers les grands marchés et restaurants de Dakar.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <button onclick="window.AgroBeyAuth.openAuthModal('register')" class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2">
              <i class="fa-solid fa-user-plus"></i>
              <span>Créer un Compte Transporteur</span>
            </button>
            <button onclick="window.AgroBeyAuth.openAuthModal('login')" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2">
              <i class="fa-solid fa-right-to-bracket"></i>
              <span>Connexion Livreur</span>
            </button>
          </div>
        </div>

        <!-- Présentation Flotte & Avantages -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold mb-3">
              <i class="fa-solid fa-motorcycle"></i>
            </div>
            <h4 class="font-bold text-gray-900 text-sm">Moto & Tricycle Urbain</h4>
            <p class="text-gray-500 mt-1">Courses express en ville, livraison de paniers maraîchers, viandes et intrants légers (jusqu'à 500 kg).</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
            <div class="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-lg font-bold mb-3">
              <i class="fa-solid fa-truck-ramp-box"></i>
            </div>
            <h4 class="font-bold text-gray-900 text-sm">Camionnette & Frigo (3.5T)</h4>
            <p class="text-gray-500 mt-1">Transport réfrigéré inter-régions : fruits de Casamance, oignons de Podor, produits laitiers frais.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg font-bold mb-3">
              <i class="fa-solid fa-truck"></i>
            </div>
            <h4 class="font-bold text-gray-900 text-sm">Poids Lourds & Bétail</h4>
            <p class="text-gray-500 mt-1">Camions plateaux 10T-30T et bétaillères aménagées pour le transport de moutons Ladoum et bovins.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderNonDriverView(user) {
    return `
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-black uppercase">
              <i class="fa-solid fa-id-card"></i> Compte Actuel : ${user.roleLabel || user.role.toUpperCase()}
            </div>
            <h3 class="text-xl sm:text-2xl font-black">Espace Logistique & Transport AgroBey</h3>
            <p class="text-xs text-slate-300 max-w-lg leading-relaxed">
              Vous êtes actuellement connecté en tant que <strong>${user.name}</strong> (${user.role === 'seller' ? 'Producteur' : 'Acheteur'}). Vous pouvez suivre vos livraisons en direct ou demander l'activation d'un profil transporteur.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button onclick="window.AgroBeyApp.switchTab('marketplace')" class="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow transition text-center">
              <i class="fa-solid fa-store mr-1"></i> Voir le Catalogue
            </button>
            <button onclick="window.AgroBeyApp.delivery.promptUpgradeToDriver()" class="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition text-center">
              <i class="fa-solid fa-truck-fast mr-1"></i> Devenir Transporteur
            </button>
          </div>
        </div>

        <!-- Suivi des colis de l'utilisateur -->
        ${this.renderUserDeliveriesTracker(user)}
      </div>
    `;
  }

  promptUpgradeToDriver() {
    const user = window.AgroBeyAuth.getCurrentUser();
    if (!user) return;

    const vehicle = prompt("Type de véhicule (Ex: Moto/Tricycle, Camionnette Frigo 3.5T, Camion Plateau 10T) :", "Camionnette Frigorifique (3.5 Tonnes)");
    if (!vehicle) return;

    const zones = prompt("Zones de couverture habituelles (Ex: Thiès, Dakar, Niayes, Saint-Louis) :", "Dakar, Thiès, Niayes");
    if (!zones) return;

    user.role = 'delivery';
    user.roleLabel = 'Livreur / Transporteur Agro-Logistique';
    user.vehicleType = vehicle;
    user.coverageZones = zones;
    user.isDriverApproved = false;
    user.driverStatus = 'pending_approval';
    user.badge = '⏳ Validation Admin/IT en cours';
    user.availability = 'offline';

    window.AgroBeyDB.saveUser(user);
    window.AgroBeyDB.addSystemLog('AUTH', 'Demande Profil Transporteur', `${user.name} a demandé l'activation de son profil transporteur (${vehicle})`, user.name);

    window.AgroBeyApp.showToast('info', 'Demande Transmise', 'Votre demande de profil transporteur a été transmise à l\'administration pour validation.');
    this.render();
  }

  renderPendingApprovalView(user) {
    return `
      <div class="max-w-2xl mx-auto bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-10 text-white shadow-2xl text-center space-y-5">
        <div class="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
          <i class="fa-solid fa-hourglass-half"></i>
        </div>

        <div>
          <div class="inline-block px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-black uppercase tracking-wider mb-2">
            Vérification Transporteur en Cours
          </div>
          <h2 class="text-2xl font-black text-white">Compte Livreur en Attente de Validation</h2>
          <p class="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            Bienvenue <strong>${user.name}</strong> ! Votre profil de transporteur (${user.vehicleType || 'Véhicule'}) est en cours d'examen par le <strong>Super-Admin ou l'ingénieur IT</strong>.
          </p>
        </div>

        <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
          <div class="flex justify-between"><span class="text-slate-500">Véhicule déclaré :</span> <strong class="text-white">${user.vehicleType || 'Non renseigné'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500">Zones couvertes :</span> <strong class="text-white">${user.coverageZones || 'Sénégal'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500">Statut actuel :</span> <span class="text-amber-400 font-bold">⏳ Examen Admin / IT</span></div>
        </div>

        <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="https://wa.me/221770000000" target="_blank" class="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
            <i class="fa-brands fa-whatsapp text-sm"></i>
            <span>Contacter le Support Logistique</span>
          </a>
          <button onclick="window.AgroBeyApp.switchTab('marketplace')" class="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition">
            Parcourir les Offres
          </button>
        </div>
      </div>
    `;
  }

  // --- COCKPIT LIVREUR OPÉRATIONNEL ---
  renderDriverCockpit(user) {
    const isOnline = user.availability === 'online' || user.isDriverOnline === true;
    const allDeliveries = window.AgroBeyDB.getDeliveries();
    
    const myDeliveries = allDeliveries.filter(d => d.driverId === user.id);
    const activeMissions = myDeliveries.filter(d => ['accepted', 'picked_up', 'in_transit'].includes(d.status));
    const completedMissions = myDeliveries.filter(d => d.status === 'delivered');
    const availableMissions = allDeliveries.filter(d => d.status === 'available');

    // Déclenchement de l'initialisation de la carte Leaflet après injection du DOM
    setTimeout(() => {
      this.initDriverLiveMap(user, activeMissions, availableMissions);
    }, 150);

    return `
      <div class="space-y-6">
        <!-- Top Bar Cockpit & Switch En Service -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div class="flex items-center gap-4">
              <img src="${user.avatar || 'assets/logo.jpg'}" class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 ${isOnline ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-slate-700'}">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-xl sm:text-2xl font-black text-white">${user.name}</h2>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${isOnline ? 'bg-emerald-600 text-white shadow animate-pulse' : 'bg-slate-800 text-slate-400'}">
                    ${isOnline ? '🟢 En Service & Géolocalisé' : '🔴 Hors Ligne'}
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">
                  <i class="fa-solid fa-truck-moving text-cyan-400"></i> ${user.vehicleType || 'Camionnette'} • 
                  <i class="fa-solid fa-location-dot text-amber-400 ml-1"></i> <strong class="text-slate-200">${user.currentZone || user.location || 'Thiès'}</strong>
                </p>
              </div>
            </div>

            <!-- Boutons Disponibilité & Reconnexion -->
            <div class="flex items-center gap-2 flex-wrap">
              <button onclick="window.AgroBeyApp.delivery.toggleAvailability('${user.id}')" class="px-5 py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center gap-2 ${
                isOnline 
                  ? 'bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }">
                <i class="fa-solid ${isOnline ? 'fa-power-off' : 'fa-bolt'}"></i>
                <span>${isOnline ? 'Passer Hors Ligne' : 'Passer En Service'}</span>
              </button>
            </div>
          </div>

          <!-- Métriques & Gains du Chauffeur -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
            <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span class="text-[10px] text-slate-500 font-bold block">Gains Cumulés</span>
              <span class="text-base sm:text-lg font-black text-emerald-400">${new Intl.NumberFormat('fr-FR').format(user.earnings || 0)} FCFA</span>
            </div>
            <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span class="text-[10px] text-slate-500 font-bold block">Missions Effectuées</span>
              <span class="text-base sm:text-lg font-black text-cyan-400">${user.completedDeliveries || 0}</span>
            </div>
            <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span class="text-[10px] text-slate-500 font-bold block">Courses Disponibles</span>
              <span class="text-base sm:text-lg font-black text-amber-400">${availableMissions.length}</span>
            </div>
            <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span class="text-[10px] text-slate-500 font-bold block">Note Qualité</span>
              <span class="text-base sm:text-lg font-black text-purple-400">★ ${(user.rating || 4.9).toFixed(1)} / 5</span>
            </div>
          </div>
        </div>

        <!-- CARTE INTERACTIVE HAUTE PERFORMANCE DU COCKPIT LIVREUR (AGROBEY MAP ENGINE) -->
        <div class="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                <h3 class="text-base font-black text-gray-900 flex items-center gap-2">
                  <i class="fa-solid fa-map-location-dot text-emerald-700"></i>
                  <span>Radar Cockpit & Navigation Routière Réelle (OSRM)</span>
                </h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">Suivi temps réel haute définition avec calcul des virages, distances routières et vue satellite des parcelles.</p>
            </div>

            <!-- Simulateur / Sélecteur de Position GPS -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Zone GPS :</span>
              <select onchange="window.AgroBeyApp.delivery.changeDriverZone('${user.id}', this.value)" class="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 outline-none">
                <option value="Thiès" ${user.currentZone === 'Thiès' ? 'selected' : ''}>📍 Thiès Ville</option>
                <option value="Pout" ${user.currentZone === 'Pout' ? 'selected' : ''}>📍 Pout (Bassin Maraîcher)</option>
                <option value="Kayar" ${user.currentZone === 'Kayar' ? 'selected' : ''}>📍 Kayar / Niayes</option>
                <option value="Dakar" ${user.currentZone === 'Dakar' ? 'selected' : ''}>📍 Dakar Centre</option>
                <option value="Pikine" ${user.currentZone === 'Pikine' ? 'selected' : ''}>📍 Pikine / Banlieue</option>
                <option value="Saint-Louis" ${user.currentZone === 'Saint-Louis' ? 'selected' : ''}>📍 Saint-Louis</option>
                <option value="Podor" ${user.currentZone === 'Podor' ? 'selected' : ''}>📍 Podor (Vallée)</option>
                <option value="Kaolack" ${user.currentZone === 'Kaolack' ? 'selected' : ''}>📍 Kaolack (Bassin Arachidier)</option>
                <option value="Ziguinchor" ${user.currentZone === 'Ziguinchor' ? 'selected' : ''}>📍 Ziguinchor (Casamance)</option>
              </select>

              <button onclick="window.AgroBeyApp.delivery.simulateLiveMovement('${user.id}')" class="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5" title="Simuler un déplacement 60 FPS sur l'axe routier">
                <i class="fa-solid fa-play text-[10px]"></i> <span>Simuler Trajet Routier (OSRM)</span>
              </button>
            </div>
          </div>

          <!-- Télémétrie HUD Cockpit -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800">
            <div>
              <span class="text-[10px] text-slate-400 font-bold block">Vitesse GPS</span>
              <span id="driver-hud-speed" class="text-sm font-black text-emerald-400">0 km/h</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-bold block">Mode Navigation</span>
              <span id="driver-hud-status" class="text-sm font-black text-cyan-400">En Stationnement</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-bold block">Cap / Direction</span>
              <span id="driver-hud-heading" class="text-sm font-black text-amber-400">Nord-Ouest</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-bold block">Couverture Réseau</span>
              <span class="text-sm font-black text-purple-400">● 4G / GPS Live</span>
            </div>
          </div>

          <!-- Conteneur Carte Haute Performance -->
          <div id="driver-cockpit-map" class="h-80 sm:h-96 w-full rounded-2xl border border-gray-300 shadow-inner z-0 relative bg-slate-100"></div>

          <!-- Légende interactive & Outils -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-[11px] pt-1 text-gray-600 border-t border-gray-100">
            <div class="flex items-center gap-3 flex-wrap">
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-cyan-600 inline-block"></span> <strong>Votre Véhicule</strong> (Radar Live)</div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span> <strong>Collectes</strong> (Fermes)</div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-red-600 inline-block"></span> <strong>Destinations</strong> (Acheteurs)</div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> <strong>Bourse</strong> (Courses disponibles)</div>
            </div>
            <div class="text-[10px] text-gray-400 font-medium">
              💡 Utilisez l'icône <i class="fa-solid fa-satellite text-cyan-600"></i> en haut à droite pour basculer en <strong>Satellite HD</strong>
            </div>
          </div>
        </div>

        <!-- Navigation par Sous-Onglets -->
        <div class="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-extrabold overflow-x-auto no-scrollbar">
          <button onclick="window.AgroBeyApp.delivery.switchSubTab('active')" class="px-4 py-2.5 rounded-2xl transition flex items-center gap-2 shrink-0 ${
            this.currentSubTab === 'active' 
              ? 'bg-emerald-700 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }">
            <i class="fa-solid fa-route"></i> Mes Missions en Cours (${activeMissions.length})
          </button>

          <button onclick="window.AgroBeyApp.delivery.switchSubTab('available')" class="px-4 py-2.5 rounded-2xl transition flex items-center gap-2 shrink-0 ${
            this.currentSubTab === 'available' 
              ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }">
            <i class="fa-solid fa-bolt"></i> Bourse des Courses (${availableMissions.length})
          </button>

          <button onclick="window.AgroBeyApp.delivery.switchSubTab('history')" class="px-4 py-2.5 rounded-2xl transition flex items-center gap-2 shrink-0 ${
            this.currentSubTab === 'history' 
              ? 'bg-slate-800 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }">
            <i class="fa-solid fa-clock-rotate-left"></i> Historique Trajets (${completedMissions.length})
          </button>
        </div>

        <!-- Contenu Dynamique selon le sous-onglet -->
        ${this.currentSubTab === 'active' ? this.renderActiveMissions(activeMissions, user) : ''}
        ${this.currentSubTab === 'available' ? this.renderAvailableMissions(availableMissions, user) : ''}
        ${this.currentSubTab === 'history' ? this.renderHistoryMissions(completedMissions) : ''}
      </div>
    `;
  }

  async initDriverLiveMap(user, activeMissions, availableMissions) {
    try {
      if (this.driverMap) {
        this.driverMap.remove();
        this.driverMap = null;
      }

      const mapEl = document.getElementById('driver-cockpit-map');
      if (!mapEl) return;

      const driverCoords = {
        lat: user.currentLat || 14.7910,
        lng: user.currentLng || -16.9256
      };

      // Instanciation via le moteur AgroBeyMapEngine
      const map = window.AgroBeyMapEngine 
        ? window.AgroBeyMapEngine.createMap('driver-cockpit-map', {
            center: [driverCoords.lat, driverCoords.lng],
            zoom: 10,
            theme: 'streets',
            allowSatellite: true,
            allowZones: true,
            allowLocate: true
          })
        : L.map('driver-cockpit-map').setView([driverCoords.lat, driverCoords.lng], 10);

      this.driverMap = map;
      const markersGroup = map._layersGroup ? map._layersGroup.markersLayer : L.featureGroup().addTo(map);

      // 1. Marqueur Véhicule Chauffeur avec Sonar Radar
      const vehicleEmoji = user.vehiculeType === 'moto' ? '🛵' :
                           user.vehiculeType === 'tricycle' ? '🛺' :
                           user.vehiculeType === 'camion' ? '🚛' : '🚐';

      const driverVehicleIcon = L.divIcon({
        className: 'agrobey-custom-driver-marker',
        html: `
          <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <div class="agrobey-sonar-radar" style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(2, 132, 199, 0.4);"></div>
            <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:#0284c7; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(2,132,199,0.9); font-size:18px; z-index:2;">
              ${vehicleEmoji}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const driverMarker = L.marker([driverCoords.lat, driverCoords.lng], { icon: driverVehicleIcon })
        .addTo(markersGroup)
        .bindPopup(`<b>Votre Position GPS</b><br>Zone : ${user.currentZone || 'Thiès'}<br>Véhicule : ${user.vehicleType || 'Camionnette'}`);
      this.driverMarker = driverMarker;

      // 2. Traçage des Missions Actives avec Routage Routier Réel OSRM
      for (const m of activeMissions) {
        const origin = window.AgroBeyDB.getCoordinatesForLocation(m.pickupAddress);
        const dest = window.AgroBeyDB.getCoordinatesForLocation(m.deliveryAddress);

        if (window.AgroBeyMapEngine) {
          const routeResult = await window.AgroBeyMapEngine.drawMissionRoute(map, origin, dest, {
            pickupTitle: `${m.itemTitle}<br>${m.pickupAddress}`,
            dropoffTitle: `${m.recipientName || 'Acheteur'}<br>${m.deliveryAddress}`,
            color: '#16a34a',
            glowColor: '#22c55e',
            autoFit: false
          });
          this._currentActiveRouteData = routeResult ? routeResult.routeData : null;
        } else {
          // Fallback standard
          L.polyline([[origin.lat, origin.lng], [dest.lat, dest.lng]], { color: '#16a34a', weight: 4 }).addTo(markersGroup);
        }
      }

      // 3. Marqueurs des Courses Disponibles sur la Bourse
      availableMissions.forEach(m => {
        const origin = window.AgroBeyDB.getCoordinatesForLocation(m.pickupAddress);
        const availIcon = L.divIcon({
          className: 'agrobey-custom-marker',
          html: `<div style="background-color:#d97706; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 4px 10px rgba(217,119,6,0.6); font-size:14px;" class="animate-bounce">⚡</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([origin.lat, origin.lng], { icon: availIcon })
          .addTo(markersGroup)
          .bindPopup(`
            <div style="font-family:system-ui,sans-serif; min-width:180px;">
              <div style="font-weight:bold; font-size:12px; color:#d97706;">⚡ Course Disponible #${m.id}</div>
              <strong style="color:#0f172a; font-size:13px;">${m.itemTitle}</strong><br>
              <span style="font-size:11px; color:#15803d; font-weight:bold;">${new Intl.NumberFormat('fr-FR').format(m.deliveryFee)} FCFA</span><br>
              <span style="font-size:10px; color:#64748b;">Collecte : ${m.pickupAddress}</span><br>
              <span style="font-size:10px; color:#64748b;">Destination : ${m.deliveryAddress}</span><br>
              <button onclick="window.AgroBeyApp.delivery.acceptMission('${m.id}', '${user.id}')" style="margin-top:8px; width:100%; background:#15803d; color:white; padding:6px; border-radius:8px; font-weight:bold; font-size:11px; border:none; cursor:pointer;">Prendre en charge</button>
            </div>
          `);
      });

      if (window.AgroBeyMapEngine) {
        window.AgroBeyMapEngine.fitMapToBounds(map);
      }
    } catch (err) {
      console.warn('Erreur initialisation Leaflet Cockpit Livreur:', err);
    }
  }

  changeDriverZone(driverId, zoneKey) {
    const coords = SENEGAL_GPS_COORDINATES[zoneKey] || SENEGAL_GPS_COORDINATES['Thiès'];
    window.AgroBeyDB.setDriverLocationAndStatus(driverId, coords.lat, coords.lng, zoneKey, true);
    window.AgroBeyApp.showToast('success', 'Zone GPS Actualisée', `Votre véhicule est désormais positionné à ${zoneKey}. Les distances des courses ont été recalculées.`);
    this.render();
  }

  async simulateLiveMovement(driverId) {
    const user = window.AgroBeyDB.getUserById(driverId);
    if (!user || !this.driverMap) return;

    window.AgroBeyApp.showToast('info', 'Simulation Trajet 60 FPS', 'Déplacement du véhicule en direct sur l\'itinéraire routier réel OSRM...');

    const startCoords = {
      lat: user.currentLat || 14.7910,
      lng: user.currentLng || -16.9256
    };
    const targetCoords = SENEGAL_GPS_COORDINATES['Dakar'];

    // 1. Récupération de l'itinéraire routier réel
    const route = await window.AgroBeyMapEngine.fetchRealRoadRoute(startCoords, targetCoords);
    if (!route || !route.coordinates || route.coordinates.length < 2) return;

    // 2. Lancement de la simulation fluide 60 FPS
    const sim = window.AgroBeyMapEngine.startVehicleLiveSimulation(this.driverMap, route.coordinates, {
      vehicleType: user.vehiculeType || 'camionnette',
      speedMs: 280,
      onProgress: (data) => {
        const speedEl = document.getElementById('driver-hud-speed');
        const statusEl = document.getElementById('driver-hud-status');
        const headingEl = document.getElementById('driver-hud-heading');

        if (speedEl) speedEl.innerText = `${data.speedKmH} km/h`;
        if (statusEl) statusEl.innerText = `En Acheminement (${data.percent}%)`;
        if (headingEl) headingEl.innerText = `${data.bearing}° (${data.bearing > 180 ? 'Sud/Ouest' : 'Nord/Est'})`;

        // Mise à jour de la position dans la base de données
        user.currentLat = data.currentLat;
        user.currentLng = data.currentLng;
        window.AgroBeyDB.saveUser(user);
      }
    });

    this._activeSimulation = sim;
  }

  toggleAvailability(userId) {
    const user = window.AgroBeyDB.getUserById(userId);
    if (!user) return;

    const newStatus = (user.availability === 'online' || user.isDriverOnline === true) ? 'offline' : 'online';
    user.availability = newStatus;
    user.isDriverOnline = (newStatus === 'online');
    window.AgroBeyDB.saveUser(user);
    window.AgroBeyApp.showToast('info', 'Disponibilité Actualisée', `Vous êtes désormais ${newStatus === 'online' ? '🟢 En service' : '🔴 Hors ligne'}.`);
    this.render();
  }

  // --- VUE 1 : MISSIONS EN COURS & PROGRESSION DES ÉTAPES ---
  renderActiveMissions(activeMissions, driver) {
    if (activeMissions.length === 0) {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-8 text-center space-y-3">
          <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl mx-auto">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 class="text-base font-extrabold text-gray-900">Aucune mission active en cours</h3>
          <p class="text-xs text-gray-500 max-w-md mx-auto">
            Vous n'avez pas de transport actif pour le moment. Consultez la <strong>Bourse des Courses</strong> pour accepter une nouvelle mission à proximité.
          </p>
          <button onclick="window.AgroBeyApp.delivery.switchSubTab('available')" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition">
            Consulter les Courses Disponibles
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        ${activeMissions.map(m => {
          const tariff = m.tariffDetails || window.AgroBeyDB.calculateSmartDeliveryTariff(m.pickupAddress, m.deliveryAddress, m.vehiculeType || 'camionnette');
          return `
            <div class="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
              <!-- En-tête de la Mission -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black text-gray-400">#${m.id}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      m.status === 'accepted' ? 'bg-amber-100 text-amber-800' :
                      m.status === 'picked_up' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-purple-100 text-purple-800 animate-pulse'
                    }">
                      ${m.status === 'accepted' ? '⏳ Acceptée (En attente de collecte)' :
                        m.status === 'picked_up' ? '📦 Marchandise Chargée' :
                        '🚚 En cours d acheminement'}
                    </span>
                  </div>
                  <h3 class="text-base font-black text-gray-900 mt-1">${m.itemTitle}</h3>
                  <div class="text-xs text-gray-500 font-semibold">Quantité : ${m.quantity} ${m.unit || 'unités'} • Distance : <strong class="text-emerald-800">${tariff.distanceKm} km</strong></div>
                </div>

                <div class="text-right">
                  <span class="text-[10px] text-gray-400 uppercase font-bold block">Rémunération Course</span>
                  <span class="text-lg font-black text-emerald-800">${new Intl.NumberFormat('fr-FR').format(m.deliveryFee)} FCFA</span>
                </div>
              </div>

              <!-- DÉTAILS TARIF MULTI-FACTEURS (Kilométrage, Relief, Nuit/Jour, Embouteillages, Taux km) -->
              ${m.vehiculeType === 'moto' && m.tariffDetails?.motoRateDetails ? `
                <div class="p-3 bg-slate-900 text-white rounded-2xl space-y-2 text-[10px]">
                  <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span class="text-amber-400 font-bold flex items-center gap-1">
                      <i class="fa-solid fa-motorcycle"></i> Course Moto Tiak-Tiak Express
                    </span>
                    <span class="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono font-black border border-emerald-700/50 rounded">
                      ${m.tariffDetails.perKmRate} FCFA / km
                    </span>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div class="p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span class="text-slate-400 block font-bold">📏 Distance</span>
                      <span class="font-extrabold text-white text-xs">${tariff.distanceKm} km</span>
                    </div>
                    <div class="p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span class="text-slate-400 block font-bold">🚜 Relief Piste</span>
                      <span class="font-extrabold text-white text-xs capitalize">${(tariff.reliefType || 'goudron').replace('_', ' ')}</span>
                    </div>
                    <div class="p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span class="text-slate-400 block font-bold">🌙 Période</span>
                      <span class="font-extrabold text-white text-xs">${tariff.isNight ? 'Nuit' : 'Jour'}</span>
                    </div>
                    <div class="p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span class="text-slate-400 block font-bold">🚦 Trafic</span>
                      <span class="font-extrabold text-white text-xs">${tariff.isRushHour ? 'Pointe' : 'Fluide'}</span>
                    </div>
                  </div>
                </div>
              ` : `
                <div class="p-3 bg-slate-900 text-white rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span class="text-slate-400 block font-bold">📏 Distance</span>
                    <span class="font-extrabold text-white text-xs">${tariff.distanceKm} km</span>
                  </div>
                  <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span class="text-slate-400 block font-bold">🚜 Relief Route</span>
                    <span class="font-extrabold text-white text-xs capitalize">${(tariff.reliefType || 'goudron').replace('_', ' ')} (x${tariff.reliefMultiplier || 1.0})</span>
                  </div>
                  <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span class="text-slate-400 block font-bold">🌙 Facteur Nuit</span>
                    <span class="font-extrabold text-white text-xs">${tariff.isNight ? 'Nuit (x1.30)' : 'Jour (x1.0)'}</span>
                  </div>
                  <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span class="text-slate-400 block font-bold">🚦 Trafic</span>
                    <span class="font-extrabold text-white text-xs">${tariff.isRushHour ? 'Pointe (x1.25)' : 'Fluide (x1.0)'}</span>
                  </div>
                </div>
              `}

              <!-- Détails Trajet : Expéditeur ➔ Destinataire -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <!-- Point de Collecte (Producteur) -->
                <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-gray-600 flex items-center gap-1.5">
                      <i class="fa-solid fa-arrow-up-from-bracket text-emerald-600"></i> POINT DE COLLECTE
                    </span>
                    <span class="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full font-bold">Producteur</span>
                  </div>
                  <div class="font-black text-gray-900">${m.senderName}</div>
                  <div class="text-gray-600 flex items-start gap-1.5">
                    <i class="fa-solid fa-location-dot text-gray-400 mt-0.5"></i>
                    <span>${m.pickupAddress}</span>
                  </div>
                  <div class="pt-2 flex items-center gap-2">
                    <a href="tel:${m.pickupPhone}" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1">
                      <i class="fa-solid fa-phone text-xs"></i> Appeler Expéditeur
                    </a>
                    <a href="https://wa.me/${(m.pickupPhone || '').replace(/\D/g, '')}" target="_blank" class="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] flex items-center gap-1">
                      <i class="fa-brands fa-whatsapp"></i> WhatsApp
                    </a>
                  </div>
                </div>

                <!-- Point de Livraison (Client / Destinataire) -->
                <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-gray-600 flex items-center gap-1.5">
                      <i class="fa-solid fa-location-crosshairs text-cyan-600"></i> DESTINATION
                    </span>
                    <span class="text-[10px] text-cyan-800 bg-cyan-100 px-2 py-0.2 rounded-full font-bold">Destinataire</span>
                  </div>
                  <div class="font-black text-gray-900">${m.recipientName}</div>
                  <div class="text-gray-600 flex items-start gap-1.5">
                    <i class="fa-solid fa-house-chimney text-gray-400 mt-0.5"></i>
                    <span>${m.deliveryAddress}</span>
                  </div>
                  <div class="pt-2 flex items-center gap-2">
                    <a href="tel:${m.deliveryPhone}" class="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1">
                      <i class="fa-solid fa-phone text-xs"></i> Appeler Destinataire
                    </a>
                    <a href="https://wa.me/${(m.deliveryPhone || '').replace(/\D/g, '')}" target="_blank" class="px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-lg font-bold text-[11px] flex items-center gap-1">
                      <i class="fa-brands fa-whatsapp"></i> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <!-- Actions Interactives d'Étape du Chauffeur -->
              <div class="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="text-xs text-gray-500">
                  ${m.notes ? `<strong>Note :</strong> <em>${m.notes}</em>` : 'Aucune restriction spéciale.'}
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                  ${m.status === 'accepted' ? `
                    <button onclick="window.AgroBeyApp.delivery.advanceStatus('${m.id}', 'picked_up', 'Marchandise chargée et récupérée chez le producteur')" class="w-full sm:w-auto px-6 py-3 bg-cyan-700 hover:bg-cyan-800 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
                      <i class="fa-solid fa-box-open"></i>
                      <span>Confirmer Chargement Effectué</span>
                    </button>
                  ` : m.status === 'picked_up' ? `
                    <button onclick="window.AgroBeyApp.delivery.advanceStatus('${m.id}', 'in_transit', 'En route vers l adresse de livraison')" class="w-full sm:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
                      <i class="fa-solid fa-truck-moving"></i>
                      <span>Démarrer le Trajet (En Transit)</span>
                    </button>
                  ` : `
                    <button onclick="window.AgroBeyApp.delivery.promptValidateOTP('${m.id}')" class="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 animate-bounce">
                      <i class="fa-solid fa-key"></i>
                      <span>Valider la Livraison (Code OTP Client)</span>
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- VUE 2 : BOURSE DES COURSES DISPONIBLES ---
  renderAvailableMissions(availableMissions, driver) {
    if (availableMissions.length === 0) {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-8 text-center space-y-3">
          <div class="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto">
            <i class="fa-solid fa-truck-ramp-box"></i>
          </div>
          <h3 class="text-base font-extrabold text-gray-900">Aucune course en attente pour l'instant</h3>
          <p class="text-xs text-gray-500 max-w-md mx-auto">
            Dès qu'une nouvelle commande avec livraison sera validée par un acheteur, elle apparaîtra ici en temps réel avec géolocalisation automatique du plus proche.
          </p>
        </div>
      `;
    }

    const driverLat = driver.currentLat || 14.7910;
    const driverLng = driver.currentLng || -16.9256;

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${availableMissions.map(m => {
          const originCoords = window.AgroBeyDB.getCoordinatesForLocation(m.pickupAddress);
          const distToDriver = window.AgroBeyDB.calculateDistanceKm(driverLat, driverLng, originCoords.lat, originCoords.lng);
          const tariff = m.tariffDetails || window.AgroBeyDB.calculateSmartDeliveryTariff(m.pickupAddress, m.deliveryAddress, m.vehiculeType || 'camionnette');
          const isMoto = m.vehiculeType === 'moto';

          return `
            <div class="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-500 transition">
              <div class="space-y-3">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${isMoto ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} flex items-center gap-1">
                      ${isMoto ? '🛵 Moto Tiak-Tiak' : '🚛 Poids Lourd / Fret'} • À ${distToDriver} km
                    </span>
                  </div>
                  <span class="text-base font-black text-emerald-800">
                    ${new Intl.NumberFormat('fr-FR').format(m.deliveryFee)} FCFA
                  </span>
                </div>

                <div>
                  <h4 class="font-black text-gray-900 text-sm line-clamp-1">${m.itemTitle}</h4>
                  <div class="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-0.5">
                    <span>${m.quantity} ${m.unit || 'unités'}</span>
                    <span>•</span>
                    <span>Distance : <strong>${tariff.distanceKm} km</strong></span>
                    ${isMoto ? `<span class="text-emerald-700 font-bold font-mono">(${tariff.perKmRate} F/km)</span>` : ''}
                  </div>
                </div>

                <div class="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-700 border border-gray-100">
                  <div class="flex items-start gap-2">
                    <i class="fa-solid fa-circle-dot text-emerald-600 text-[10px] mt-1"></i>
                    <div><strong class="text-gray-900">Collecte :</strong> ${m.pickupAddress}</div>
                  </div>
                  <div class="flex items-start gap-2">
                    <i class="fa-solid fa-location-dot text-cyan-600 text-[10px] mt-1"></i>
                    <div><strong class="text-gray-900">Destination :</strong> ${m.deliveryAddress}</div>
                  </div>
                </div>

                <!-- Grille multi-facteurs tarifaires -->
                <div class="p-2.5 bg-slate-900 text-white rounded-xl grid grid-cols-3 gap-1.5 text-[9px]">
                  <div class="text-center p-1 bg-slate-950 rounded">
                    <span class="text-slate-400 block">Relief</span>
                    <strong class="text-amber-400 capitalize">${(tariff.reliefType || 'goudron').replace('_', ' ')}</strong>
                  </div>
                  <div class="text-center p-1 bg-slate-950 rounded">
                    <span class="text-slate-400 block">Horaire</span>
                    <strong class="text-white">${tariff.isNight ? 'Nuit' : 'Jour'}</strong>
                  </div>
                  <div class="text-center p-1 bg-slate-950 rounded">
                    <span class="text-slate-400 block">Trafic</span>
                    <strong class="text-white">${tariff.isRushHour ? 'Pointe' : 'Fluide'}</strong>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button onclick="window.AgroBeyApp.delivery.acceptMission('${m.id}', '${driver.id}')" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
                  <i class="fa-solid fa-check-double"></i>
                  <span>Prendre en Charge cette Course</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- VUE 3 : HISTORIQUE DES TRAJETS EFFECTUÉS ---
  renderHistoryMissions(completedMissions) {
    if (completedMissions.length === 0) {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-8 text-center text-xs text-gray-500">
          Vous n'avez pas encore finalisé de course.
        </div>
      `;
    }

    return `
      <div class="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm overflow-x-auto text-xs">
        <h4 class="font-black text-gray-900 text-sm mb-4">Archive de vos Transports Clôturés</h4>
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
              <th class="py-3 px-4 rounded-l-xl">Réf & Date</th>
              <th class="py-3 px-4">Marchandise</th>
              <th class="py-3 px-4">Trajet</th>
              <th class="py-3 px-4">Gains Perçus</th>
              <th class="py-3 px-4 rounded-r-xl">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${completedMissions.map(m => `
              <tr class="hover:bg-gray-50 transition">
                <td class="py-3.5 px-4 font-mono">
                  <div class="font-bold text-gray-900">#${m.id}</div>
                  <div class="text-[10px] text-gray-400">${new Date(m.updatedAt || m.createdAt).toLocaleDateString('fr-FR')}</div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-gray-900">${m.itemTitle}</div>
                  <div class="text-[10px] text-gray-500">${m.quantity} ${m.unit || 'unités'}</div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="text-emerald-800 font-semibold truncate max-w-xs">${m.pickupAddress} ➔ ${m.deliveryAddress}</div>
                </td>
                <td class="py-3.5 px-4 font-black text-emerald-800">
                  ${new Intl.NumberFormat('fr-FR').format(m.deliveryFee)} FCFA
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px]">
                    ✓ Livré
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- ACTIONS CHAUFFEUR ---
  acceptMission(deliveryId, driverId) {
    const res = window.AgroBeyDB.acceptDelivery(deliveryId, driverId);
    if (res) {
      window.AgroBeyApp.showToast('success', 'Course Acceptée !', `Vous êtes assigné à la mission #${deliveryId}. Rendez-vous au point de collecte.`);
      this.currentSubTab = 'active';
      this.render();
    }
  }

  advanceStatus(deliveryId, newStatus, note) {
    const currentUser = window.AgroBeyAuth.getCurrentUser();
    const actor = currentUser ? currentUser.name : 'Livreur';
    const res = window.AgroBeyDB.updateDeliveryStatus(deliveryId, newStatus, note, actor);
    if (res) {
      window.AgroBeyApp.showToast('success', 'Étape Validée', `Statut mis à jour : ${note}`);
      this.render();
    }
  }

  promptValidateOTP(deliveryId) {
    const otp = prompt("Veuillez saisir le Code OTP secret à 4 chiffres fourni par l'acheteur :");
    if (otp === null) return;

    const currentUser = window.AgroBeyAuth.getCurrentUser();
    const actor = currentUser ? currentUser.name : 'Livreur';
    const res = window.AgroBeyDB.verifyDeliveryOTP(deliveryId, otp, actor);

    if (res.success) {
      window.AgroBeyApp.showToast('success', 'Livraison Clôturée !', 'Code OTP vérifié avec succès. Les frais de livraison ont été crédités sur votre solde.');
      this.render();
    } else {
      window.AgroBeyApp.showToast('warning', 'Code OTP Incorrect', res.message || 'Le code saisi ne correspond pas.');
    }
  }

  // --- VUE SUIVI POUR CLIENT & PRODUCTEUR ---
  renderUserDeliveriesTracker(user) {
    const deliveries = window.AgroBeyDB.getDeliveries();
    const userDeliveries = deliveries.filter(d => d.recipientId === user.id || d.senderId === user.id);

    if (userDeliveries.length === 0) {
      return `
        <div class="bg-white rounded-3xl border border-gray-200/80 p-6 text-center text-xs text-gray-500">
          Vous n'avez aucune livraison en cours pour vos commandes ou ventes.
        </div>
      `;
    }

    return `
      <div class="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
        <h4 class="font-black text-gray-900 text-sm">Vos Livraisons & Expéditions Récentes</h4>
        <div class="space-y-3">
          ${userDeliveries.map(d => `
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-900">${d.itemTitle}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                  }">
                    ${d.status === 'delivered' ? '✓ Livré' : '🚚 En cours de livraison'}
                  </span>
                </div>
                <p class="text-gray-500 text-[11px] mt-0.5">${d.pickupAddress} ➔ ${d.deliveryAddress}</p>
                ${d.driverName ? `<p class="text-emerald-700 text-[11px] font-semibold mt-0.5"><i class="fa-solid fa-truck"></i> Chauffeur : ${d.driverName} (${d.driverPhone || ''})</p>` : ''}
              </div>

              <button onclick="window.AgroBeyApp.openDeliveryTrackingModal('${d.orderId || d.id}')" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5 justify-center">
                <i class="fa-solid fa-route"></i>
                <span>Suivre le Colis</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Export Global
window.AgroBeyDelivery = AgroBeyDelivery;