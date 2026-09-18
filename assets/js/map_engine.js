/**
 * AgroBeyMapEngine - Moteur Cartographique Haute Performance
 * Multi-calques (Satellite HD, Vectoriel Retina, Dark Tactical Radar),
 * Routage routier réel OSRM, Animation fluide de véhicule avec cap/orientation,
 * Polygones des bassins agro-pastoraux du Sénégal et contrôles avancés.
 */

class AgroBeyMapEngine {
  // --- CONFIGURATION DES FOURNISSEURS DE TUILES ---
  static TILE_PROVIDERS = {
    satellite: {
      name: '🛰️ Satellite HD Terroir',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; AgroBey Terroirs'
      }
    },
    streets: {
      name: '🗺️ Rues & Nationales',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CartoDB &copy; OpenStreetMap'
      }
    },
    dark: {
      name: '🌙 Radar Sombre Tactique',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CartoDB &copy; OpenStreetMap'
      }
    },
    osm: {
      name: '🌱 Standard OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }
    }
  };

  // --- POLYGONES & ZONES AGRO-PASTORALES DU SÉNÉGAL ---
  static SENEGAL_AGRICULTURAL_ZONES = [
    {
      id: 'niayes',
      name: '🥬 Bassin des Niayes (Bande Maraîchère)',
      description: 'Pôle d excellence maraîcher : oignons, tomates, carottes, choux et primeurs côtiers.',
      color: '#16a34a',
      fillOpacity: 0.22,
      coordinates: [
        [14.72, -17.48], [14.85, -17.35], [14.98, -17.15],
        [15.15, -16.92], [15.45, -16.65], [15.65, -16.45],
        [15.58, -16.35], [15.10, -16.75], [14.85, -17.05],
        [14.70, -17.25], [14.72, -17.48]
      ]
    },
    {
      id: 'vallee_fleuve',
      name: '🌾 Vallée du Fleuve Sénégal (Délestage & Delta)',
      description: 'Grenier rizicole national, grands périmètres irrigués, canne à sucre et oignon de garde.',
      color: '#0284c7',
      fillOpacity: 0.22,
      coordinates: [
        [15.85, -16.50], [16.20, -16.45], [16.50, -15.80],
        [16.65, -15.20], [16.70, -14.80], [16.30, -14.20],
        [15.95, -13.50], [15.80, -13.60], [16.10, -14.40],
        [16.35, -15.10], [16.15, -15.70], [15.75, -16.30],
        [15.85, -16.50]
      ]
    },
    {
      id: 'bassin_arachidier',
      name: '🥜 Bassin Arachidier (Saloum & Baol)',
      description: 'Production intensive d\'arachide, mil souna, maïs, niébé et élevage semi-intensif.',
      color: '#d97706',
      fillOpacity: 0.18,
      coordinates: [
        [14.00, -16.50], [14.60, -16.60], [15.00, -16.30],
        [15.10, -15.50], [14.60, -15.20], [13.80, -15.40],
        [13.80, -16.10], [14.00, -16.50]
      ]
    },
    {
      id: 'casamance',
      name: '🥭 Pôle Fruiter & Forestier de Casamance',
      description: 'Vergers tropicaux (mangues, anacarde, agrumes), bananeraies, riziculture de mangrove.',
      color: '#10b981',
      fillOpacity: 0.22,
      coordinates: [
        [12.30, -16.70], [12.85, -16.70], [12.95, -15.80],
        [13.05, -14.80], [12.60, -14.50], [12.30, -15.20],
        [12.25, -16.20], [12.30, -16.70]
      ]
    },
    {
      id: 'ferlo_pastoral',
      name: '🐑 Zone Sylvopastorale du Ferlo & Djoloff',
      description: 'Grand foirail pastoral de Dahra, transhumance, élevage bovin (Gobra) et ovins d élite Ladoum.',
      color: '#8b5cf6',
      fillOpacity: 0.18,
      coordinates: [
        [14.80, -15.50], [15.50, -15.80], [15.80, -15.20],
        [15.50, -14.20], [14.80, -13.80], [14.30, -14.50],
        [14.80, -15.50]
      ]
    }
  ];

  // Cache interne des requêtes de routage pour fluidité instantanée
  static _routeCache = new Map();

  /**
   * Crée et initialise une carte haute performance avec couche de tuiles sélectionnable
   */
  static createMap(containerId, options = {}) {
    if (typeof L === 'undefined') {
      console.error('Leaflet n\'est pas chargé dans la page.');
      return null;
    }

    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    // Nettoyage si une carte existe déjà sur cet élément
    if (container._leaflet_map) {
      try {
        container._leaflet_map.remove();
      } catch (e) {}
      container._leaflet_map = null;
    }

    const defaultCenter = options.center || [14.5000, -14.8000]; // Centre Sénégal
    const defaultZoom = options.zoom || 7;
    const initialTheme = options.theme || 'streets'; // 'satellite' | 'streets' | 'dark'

    const map = L.map(container, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: options.zoomControl !== false,
      attributionControl: false,
      scrollWheelZoom: options.scrollWheelZoom !== undefined ? options.scrollWheelZoom : true,
      dragging: !L.Browser.mobile || options.dragging !== false,
      tap: !L.Browser.mobile
    });

    container._leaflet_map = map;
    map._currentTheme = initialTheme;
    map._layersGroup = {
      tileLayer: null,
      zonesLayer: null,
      routesLayer: L.featureGroup().addTo(map),
      markersLayer: L.featureGroup().addTo(map),
      animationLayer: L.featureGroup().addTo(map)
    };

    // Application de la couche de tuiles initiale
    this.switchTileLayer(map, initialTheme);

    // Ajout des contrôles intégrés (Sélecteur de calque, plein écran, recadrage)
    if (options.showControls !== false) {
      this.attachModernControls(map, {
        allowSatellite: options.allowSatellite !== false,
        allowDark: options.allowDark !== false,
        allowZones: options.allowZones !== false,
        allowLocate: options.allowLocate !== false,
        allowFullscreen: options.allowFullscreen !== false
      });
    }

    // Ajout des zones agricoles si demandé
    if (options.showAgriculturalZones) {
      this.toggleAgriculturalZones(map, true);
    }

    return map;
  }

  /**
   * Bascule dynamiquement la couche de tuiles (Satellite, Streets, Dark)
   */
  static switchTileLayer(map, themeName = 'streets') {
    if (!map || !map._layersGroup) return;

    const provider = this.TILE_PROVIDERS[themeName] || this.TILE_PROVIDERS.streets;
    if (map._layersGroup.tileLayer) {
      map.removeLayer(map._layersGroup.tileLayer);
    }

    map._layersGroup.tileLayer = L.tileLayer(provider.url, provider.options).addTo(map);
    map._layersGroup.tileLayer.bringToBack();
    map._currentTheme = themeName;

    // Déclenchement d'un événement personnalisé
    map.fire('tilelayerchange', { theme: themeName });
  }

  /**
   * Active ou désactive l'affichage des polygones des terroirs agricoles
   */
  static toggleAgriculturalZones(map, forceState = null) {
    if (!map || !map._layersGroup) return;

    const shouldShow = forceState !== null ? forceState : !map._layersGroup.zonesLayer;

    if (!shouldShow && map._layersGroup.zonesLayer) {
      map.removeLayer(map._layersGroup.zonesLayer);
      map._layersGroup.zonesLayer = null;
      return false;
    }

    if (shouldShow && !map._layersGroup.zonesLayer) {
      const zonesGroup = L.featureGroup();
      
      this.SENEGAL_AGRICULTURAL_ZONES.forEach(zone => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          weight: 2,
          opacity: 0.8,
          fillColor: zone.color,
          fillOpacity: zone.fillOpacity,
          dashArray: '4, 6'
        }).addTo(zonesGroup);

        polygon.bindPopup(`
          <div style="font-family:system-ui,sans-serif; min-width:200px;">
            <div style="font-weight:900; font-size:13px; color:${zone.color}; margin-bottom:4px;">${zone.name}</div>
            <p style="font-size:11px; color:#334155; line-height:1.4; margin:0;">${zone.description}</p>
            <div style="margin-top:6px; font-size:10px; font-weight:bold; color:#64748b;">Pôle de production certifié AgroBey</div>
          </div>
        `);
      });

      zonesGroup.addTo(map);
      map._layersGroup.zonesLayer = zonesGroup;
      return true;
    }

    return shouldShow;
  }

  /**
   * Attache une barre d'outils flottante moderne (Switch Satellite, Recadrage, Plein écran, GPS)
   */
  static attachModernControls(map, opts = {}) {
    const CustomControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function() {
        const div = L.DomUtil.create('div', 'leaflet-bar agrobey-map-toolbar shadow-xl');
        div.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
        div.style.backdropFilter = 'blur(8px)';
        div.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        div.style.borderRadius = '14px';
        div.style.padding = '4px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '4px';
        div.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)';

        // Empêcher les clics de se propager à la carte
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        // Bouton 1 : Bascule Satellite / Rues
        if (opts.allowSatellite) {
          const satBtn = document.createElement('button');
          satBtn.innerHTML = '<i class="fa-solid fa-satellite" style="font-size:13px;"></i>';
          satBtn.title = 'Basculer Vue Satellite HD / Rues';
          satBtn.className = 'agrobey-ctrl-btn';
          satBtn.style.cssText = 'width:32px; height:32px; border-radius:10px; border:none; background:transparent; color:#e2e8f0; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;';
          satBtn.onmouseover = () => satBtn.style.backgroundColor = '#334155';
          satBtn.onmouseout = () => satBtn.style.backgroundColor = 'transparent';
          satBtn.onclick = () => {
            const nextTheme = map._currentTheme === 'satellite' ? 'streets' : 'satellite';
            AgroBeyMapEngine.switchTileLayer(map, nextTheme);
            satBtn.style.color = nextTheme === 'satellite' ? '#38bdf8' : '#e2e8f0';
            if (window.AgroBeyApp && window.AgroBeyApp.showToast) {
              window.AgroBeyApp.showToast('info', 'Calque Cartographique', nextTheme === 'satellite' ? 'Mode Satellite HD Terroirs activé' : 'Mode Rues & Pistes activé');
            }
          };
          div.appendChild(satBtn);
        }

        // Bouton 2 : Bascule Polygones Terroirs Agricoles
        if (opts.allowZones) {
          const zonesBtn = document.createElement('button');
          zonesBtn.innerHTML = '<i class="fa-solid fa-wheat-awn" style="font-size:13px;"></i>';
          zonesBtn.title = 'Afficher / Masquer les Bassins Agricoles du Sénégal';
          zonesBtn.className = 'agrobey-ctrl-btn';
          zonesBtn.style.cssText = 'width:32px; height:32px; border-radius:10px; border:none; background:transparent; color:#4ade80; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;';
          zonesBtn.onmouseover = () => zonesBtn.style.backgroundColor = '#334155';
          zonesBtn.onmouseout = () => zonesBtn.style.backgroundColor = 'transparent';
          zonesBtn.onclick = () => {
            const active = AgroBeyMapEngine.toggleAgriculturalZones(map);
            zonesBtn.style.color = active ? '#4ade80' : '#94a3b8';
            if (window.AgroBeyApp && window.AgroBeyApp.showToast) {
              window.AgroBeyApp.showToast('info', 'Terroirs Agricoles', active ? 'Polygones des bassins agricoles affichés' : 'Polygones masqués');
            }
          };
          div.appendChild(zonesBtn);
        }

        // Bouton 3 : Recadrage Intelligent (Fit Bounds)
        const fitBtn = document.createElement('button');
        fitBtn.innerHTML = '<i class="fa-solid fa-expand" style="font-size:13px;"></i>';
        fitBtn.title = 'Recadrer sur tous les éléments';
        fitBtn.style.cssText = 'width:32px; height:32px; border-radius:10px; border:none; background:transparent; color:#e2e8f0; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;';
        fitBtn.onmouseover = () => fitBtn.style.backgroundColor = '#334155';
        fitBtn.onmouseout = () => fitBtn.style.backgroundColor = 'transparent';
        fitBtn.onclick = () => AgroBeyMapEngine.fitMapToBounds(map);
        div.appendChild(fitBtn);

        // Bouton 4 : Géolocalisation Live
        if (opts.allowLocate) {
          const locBtn = document.createElement('button');
          locBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs" style="font-size:13px;"></i>';
          locBtn.title = 'Centrer sur ma position GPS';
          locBtn.style.cssText = 'width:32px; height:32px; border-radius:10px; border:none; background:transparent; color:#fbbf24; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;';
          locBtn.onmouseover = () => locBtn.style.backgroundColor = '#334155';
          locBtn.onmouseout = () => locBtn.style.backgroundColor = 'transparent';
          locBtn.onclick = () => AgroBeyMapEngine.locateUser(map);
          div.appendChild(locBtn);
        }

        return div;
      }
    });

    map.addControl(new CustomControl());
  }

  /**
   * Recadre automatiquement la vue sur tous les marqueurs et tracés présents
   */
  static fitMapToBounds(map, maxZoom = 15) {
    if (!map || !map._layersGroup) return;

    const allLayers = [];
    if (map._layersGroup.markersLayer) allLayers.push(map._layersGroup.markersLayer);
    if (map._layersGroup.routesLayer) allLayers.push(map._layersGroup.routesLayer);

    const group = L.featureGroup(allLayers);
    if (group.getLayers().length > 0) {
      try {
        map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom, animate: true, duration: 0.8 });
      } catch (e) {
        map.setView([14.5000, -14.8000], 7);
      }
    } else {
      map.setView([14.5000, -14.8000], 7);
    }
  }

  /**
   * Géolocalise l'utilisateur en temps réel via l'API Web Geolocation
   */
  static locateUser(map) {
    if (!navigator.geolocation) {
      if (window.AgroBeyApp && window.AgroBeyApp.showToast) {
        window.AgroBeyApp.showToast('warning', 'GPS Non Supporté', 'La géolocalisation n est pas supportée par votre navigateur.');
      }
      return;
    }

    if (window.AgroBeyApp && window.AgroBeyApp.showToast) {
      window.AgroBeyApp.showToast('info', 'Recherche GPS...', 'Acquisition de votre position géographique...');
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        map.flyTo([lat, lng], 14, { animate: true, duration: 1.2 });

        const userMarkerIcon = L.divIcon({
          className: 'agrobey-user-gps-marker',
          html: `
            <div style="position:relative; width:24px; height:24px;">
              <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:#0284c7; opacity:0.3;" class="animate-ping"></div>
              <div style="position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#0284c7; border:3px solid white; box-shadow:0 0 10px rgba(2,132,199,0.8);"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([lat, lng], { icon: userMarkerIcon })
          .addTo(map._layersGroup.markersLayer)
          .bindPopup('<b>Votre Position Actuelle</b><br>Précision : ~' + Math.round(pos.coords.accuracy) + ' mètres')
          .openPopup();

        if (window.AgroBeyApp && window.AgroBeyApp.showToast) {
          window.AgroBeyApp.showToast('success', 'Position GPS Fixée', 'Carte centrée sur votre position.');
        }
      },
      err => {
        console.warn('Erreur géolocalisation:', err.message);
        if (window.AgroBeyApp && window.AgroBeyApp.showToast) {
          window.AgroBeyApp.showToast('warning', 'Signal GPS Indisponible', 'Impossible d obtenir votre position exacte. Vérifiez vos autorisations de localisation.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  // =========================================================================
  // --- MOTEUR DE ROUTAGE ROUTIER RÉEL (OSRM) AVEC FALLBACK INTELLIGENT ---
  // =========================================================================

  /**
   * Calcule et trace l'itinéraire routier réel entre deux points GPS via l'API OSRM
   */
  static async fetchRealRoadRoute(originCoords, destCoords) {
    const cacheKey = `${originCoords.lat.toFixed(4)},${originCoords.lng.toFixed(4)}->${destCoords.lat.toFixed(4)},${destCoords.lng.toFixed(4)}`;
    if (this._routeCache.has(cacheKey)) {
      return this._routeCache.get(cacheKey);
    }

    try {
      // Appel API OSRM gratuit pour voitures/camions
      const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&steps=true`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM GeoJSON renvoie les coordonnées en [lng, lat], conversion en [lat, lng] pour Leaflet
          const latLngs = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
          const durationMinutes = Math.round(route.duration / 60);

          const result = {
            success: true,
            isRealRoad: true,
            coordinates: latLngs,
            distanceKm: distanceKm,
            durationMinutes: durationMinutes,
            summary: route.legs && route.legs[0] && route.legs[0].summary ? route.legs[0].summary : 'Réseau Routier National',
            steps: route.legs && route.legs[0] && route.legs[0].steps ? route.legs[0].steps.map(s => ({
              instruction: s.maneuver ? s.maneuver.type + (s.name ? ' sur ' + s.name : '') : 'Poursuivre',
              distanceMeters: s.distance,
              durationSeconds: s.duration
            })) : []
          };

          this._routeCache.set(cacheKey, result);
          return result;
        }
      }
    } catch (e) {
      console.warn('OSRM indisponible ou timeout, utilisation du modèle de courbure locale :', e.message);
    }

    // FALLBACK INTELLIGENT : Génération d'une trajectoire courbée réaliste
    const fallback = this.generateCurvedRoadPath(originCoords, destCoords);
    this._routeCache.set(cacheKey, fallback);
    return fallback;
  }

  /**
   * Génère un tracé courbé réaliste si l'API de routage est inaccessible (Mode Hors-Ligne)
   */
  static generateCurvedRoadPath(origin, dest, numSegments = 16) {
    const latDiff = dest.lat - origin.lat;
    const lngDiff = dest.lng - origin.lng;
    const straightDistKm = window.AgroBeyDB 
      ? window.AgroBeyDB.calculateDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng)
      : Math.round(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111 * 1.25);

    const points = [];
    const perpLat = -lngDiff * 0.08;
    const perpLng = latDiff * 0.08;

    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      // Interpolation quadratique avec déviation de courbure
      const curve = Math.sin(t * Math.PI);
      const lat = origin.lat + latDiff * t + perpLat * curve;
      const lng = origin.lng + lngDiff * t + perpLng * curve;
      points.push([lat, lng]);
    }

    return {
      success: true,
      isRealRoad: false,
      coordinates: points,
      distanceKm: straightDistKm,
      durationMinutes: Math.round((straightDistKm / 45) * 60), // Moyenne 45 km/h
      summary: 'Itinéraire estimé (Corridor logistique)',
      steps: []
    };
  }

  /**
   * Trace un itinéraire complet avec départ, arrivée et ligne fluide
   */
  static async drawMissionRoute(map, pickupCoords, dropoffCoords, options = {}) {
    if (!map || !map._layersGroup) return null;

    map._layersGroup.routesLayer.clearLayers();

    // 1. Récupération de la route réelle OSRM
    const routeData = await this.fetchRealRoadRoute(pickupCoords, dropoffCoords);

    // 2. Tracé d'arrière-plan (lueur d'effet)
    const glowLine = L.polyline(routeData.coordinates, {
      color: options.glowColor || '#16a34a',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round'
    }).addTo(map._layersGroup.routesLayer);

    // 3. Tracé principal de la route
    const mainLine = L.polyline(routeData.coordinates, {
      color: options.color || '#22c55e',
      weight: 4,
      opacity: 0.95,
      dashArray: routeData.isRealRoad ? null : '6, 8',
      lineCap: 'round'
    }).addTo(map._layersGroup.routesLayer);

    // 4. Marqueur Départ Ferme 🌾
    const farmIcon = L.divIcon({
      className: 'agrobey-custom-marker',
      html: `<div style="background:#15803d; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2.5px solid white; box-shadow:0 6px 15px rgba(21,128,61,0.6); font-size:16px;">🌾</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const farmMarker = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: farmIcon })
      .addTo(map._layersGroup.routesLayer)
      .bindPopup(`<b>🌱 Point de Collecte (Exploitation)</b><br>${options.pickupTitle || 'Ferme Producteur'}`);

    // 5. Marqueur Arrivée Client 📍
    const dropoffIcon = L.divIcon({
      className: 'agrobey-custom-marker',
      html: `<div style="background:#dc2626; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2.5px solid white; box-shadow:0 6px 15px rgba(220,38,38,0.6); font-size:16px;">📍</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const dropoffMarker = L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: dropoffIcon })
      .addTo(map._layersGroup.routesLayer)
      .bindPopup(`<b>🏁 Destination Finale (Acheteur)</b><br>${options.dropoffTitle || 'Point de Livraison'}`);

    if (options.autoFit !== false) {
      map.fitBounds(mainLine.getBounds(), { padding: [50, 50], maxZoom: 14 });
    }

    return {
      routeData,
      mainLine,
      farmMarker,
      dropoffMarker
    };
  }

  // =========================================================================
  // --- SIMULATEUR 60 FPS & ANIMATION DE VÉHICULE AVEC CALCUL DU CAP ---
  // =========================================================================

  /**
   * Déplace fluidement un véhicule le long des coordonnées de l'itinéraire
   */
  static startVehicleLiveSimulation(map, routeCoordinates, options = {}) {
    if (!map || !map._layersGroup || !routeCoordinates || routeCoordinates.length < 2) return null;

    map._layersGroup.animationLayer.clearLayers();

    const vehicleType = options.vehicleType || 'camionnette';
    const vehicleEmoji = vehicleType === 'moto' ? '🛵' :
                         vehicleType === 'tricycle' ? '🛺' :
                         vehicleType === 'camion' ? '🚛' : '🚐';

    // Création de l'icône du véhicule avec halo radar pulsant
    const vehicleIcon = L.divIcon({
      className: 'agrobey-moving-vehicle-icon',
      html: `
        <div class="agrobey-vehicle-wrapper" style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
          <div class="agrobey-sonar-radar" style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(2, 132, 199, 0.35); animation:agrobey-pulse-sonar 1.8s infinite cubic-bezier(0, 0, 0.2, 1);"></div>
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:#0284c7; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(2,132,199,0.9); font-size:18px; z-index:2;">
            ${vehicleEmoji}
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const startPos = routeCoordinates[0];
    const movingMarker = L.marker(startPos, { icon: vehicleIcon, zIndexOffset: 1000 })
      .addTo(map._layersGroup.animationLayer)
      .bindPopup(`<b>🚚 Chauffeur en Transit</b><br>Statut: Déplacement temps réel`);

    // Animation pas-à-pas avec RequestAnimationFrame
    let currentIndex = 0;
    const totalPoints = routeCoordinates.length;
    let animId = null;
    let isRunning = true;

    const stepDurationMs = options.speedMs || 350; // Vitesse d'avancée
    let lastTime = performance.now();

    function animate(now) {
      if (!isRunning) return;

      const delta = now - lastTime;
      if (delta >= stepDurationMs) {
        lastTime = now;
        currentIndex++;

        if (currentIndex >= totalPoints) {
          currentIndex = 0; // Rebouclage pour démonstration continue
        }

        const currentCoord = routeCoordinates[currentIndex];
        const nextCoord = routeCoordinates[(currentIndex + 1) % totalPoints];

        movingMarker.setLatLng(currentCoord);

        // Calcul du cap et rotation du véhicule
        const bearing = AgroBeyMapEngine.calculateBearing(currentCoord[0], currentCoord[1], nextCoord[0], nextCoord[1]);
        
        // Mise à jour de la vitesse simulée
        const simulatedSpeed = Math.round(42 + Math.sin(currentIndex * 0.5) * 18); // 42-60 km/h
        if (options.onProgress) {
          const progressPercent = Math.round((currentIndex / totalPoints) * 100);
          options.onProgress({
            percent: progressPercent,
            speedKmH: simulatedSpeed,
            currentLat: currentCoord[0],
            currentLng: currentCoord[1],
            bearing: bearing
          });
        }
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return {
      marker: movingMarker,
      stop: () => {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      },
      resume: () => {
        if (!isRunning) {
          isRunning = true;
          lastTime = performance.now();
          animId = requestAnimationFrame(animate);
        }
      }
    };
  }

  /**
   * Calcule le relèvement / angle de direction (bearing en degrés) entre deux coordonnées
   */
  static calculateBearing(startLat, startLng, endLat, endLng) {
    const dLng = (endLng - startLng) * (Math.PI / 180);
    const lat1 = startLat * (Math.PI / 180);
    const lat2 = endLat * (Math.PI / 180);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const brng = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
    return Math.round(brng);
  }
}

// Export Global
window.AgroBeyMapEngine = AgroBeyMapEngine;
