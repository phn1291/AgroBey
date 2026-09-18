/**
 * AgroBey - Moteur de Données & Stockage Réactif
 * Gestion de la persistance locale (LocalStorage), Pub/Sub, Multi-Staff, Logs & IA Conversations.
 */

const STORAGE_KEYS = {
  LISTINGS: 'agrobey_listings',
  USERS: 'agrobey_users',
  ORDERS: 'agrobey_orders',
  DELIVERIES: 'agrobey_deliveries',
  TICKETS: 'agrobey_tickets',
  SETTINGS: 'agrobey_settings',
  NOTIFICATIONS: 'agrobey_notifications',
  PRICE_BAROMETER: 'agrobey_price_barometer',
  AI_CONVERSATIONS: 'agrobey_ai_conversations',
  SYSTEM_LOGS: 'agrobey_system_logs'
};

const DEFAULT_SETTINGS = {
  platformName: 'AgroBey',
  platformSuffix: 'Bey',
  slogan: 'Cultivons. Élevons. Construisons demain.',
  description: 'Plateforme digitale de référence pour l agriculture, l élevage, la location de terres et la commercialisation des récoltes au Sénégal et en Afrique de l Ouest.',
  headquarters: 'Siège social : Immeuble AgroBey, Route des Almadies, Dakar, Sénégal',
  phone: '+221 33 800 00 00',
  whatsapp: '+221 77 000 00 00',
  email: 'contact@agrobey.sn',
  currency: 'FCFA',
  topbarText: '🌿 Plateforme Nationale & Régionale du Monde Rural et Agro-Pastoral',
  filieresTitle: 'Filières & Activités',
  servicesTitle: 'Services & Sécurité',
  contactTitle: 'Contact & Assistance',
  copyrightText: '© 2026 AgroBey Technologies. Tous droits réservés.',
  filieresLinks: [
    'Vente de Récoltes & Légumes',
    'Élevage & Moutons Ladoum',
    'Location & Vente de Champs',
    'Fermes & Poulaillers Équipés',
    'Tracteurs & Forages Solaires'
  ],
  servicesLinks: [
    'Générateur de Bail Rural Conforme',
    'Baromètre Hebdomadaire des Prix',
    'Programme Producteur Vérifié KYC',
    'Réseau Transporteurs Agréés'
  ]
};

// Coordonnées GPS précises & profils de relief des localités du Sénégal pour le zonage et la cartographie
const SENEGAL_GPS_COORDINATES = {
  // Dakar & Banlieue
  'Dakar': { lat: 14.7167, lng: -17.4677, region: 'Dakar', zone: 'Urbain Dakar', relief: 'goudron', name: 'Dakar Centre' },
  'Almadies': { lat: 14.7455, lng: -17.5195, region: 'Dakar', zone: 'Dakar Ouest', relief: 'goudron', name: 'Almadies' },
  'Plateau': { lat: 14.6710, lng: -17.4320, region: 'Dakar', zone: 'Dakar Centre', relief: 'goudron', name: 'Dakar Plateau' },
  'Pikine': { lat: 14.7549, lng: -17.3986, region: 'Dakar', zone: 'Dakar Banlieue', relief: 'goudron', name: 'Pikine' },
  'Guédiawaye': { lat: 14.7730, lng: -17.3910, region: 'Dakar', zone: 'Dakar Banlieue', relief: 'goudron', name: 'Guédiawaye' },
  'Rufisque': { lat: 14.7167, lng: -17.2667, region: 'Dakar', zone: 'Dakar Est', relief: 'goudron', name: 'Rufisque' },
  'Diamniadio': { lat: 14.7290, lng: -17.1850, region: 'Dakar', zone: 'Pôle Urbain', relief: 'goudron', name: 'Diamniadio' },
  // Thiès & Zone des Niayes
  'Thiès': { lat: 14.7910, lng: -16.9256, region: 'Thiès', zone: 'Thiès Centre', relief: 'goudron', name: 'Thiès Ville' },
  'Pout': { lat: 14.7719, lng: -17.0617, region: 'Thiès', zone: 'Bassin Maraîcher', relief: 'piste_mixte', name: 'Pout' },
  'Kayar': { lat: 14.9189, lng: -17.1214, region: 'Thiès', zone: 'Niayes Maritime', relief: 'sable_niayes', name: 'Kayar (Niayes)' },
  'Mboro': { lat: 15.1408, lng: -16.9011, region: 'Thiès', zone: 'Grande Côte Niayes', relief: 'sable_niayes', name: 'Mboro (Niayes)' },
  'Notto Diobass': { lat: 14.7431, lng: -16.8900, region: 'Thiès', zone: 'Diobass Rural', relief: 'piste_laterite', name: 'Notto Diobass' },
  'Mbour': { lat: 14.4220, lng: -16.9638, region: 'Thiès', zone: 'Petite Côte', relief: 'goudron', name: 'Mbour' },
  'Tivaouane': { lat: 14.9500, lng: -16.8167, region: 'Thiès', zone: 'Nord Thiès', relief: 'goudron', name: 'Tivaouane' },
  // Vallée du Fleuve & Nord
  'Saint-Louis': { lat: 16.0326, lng: -16.4818, region: 'Saint-Louis', zone: 'Nord Delta', relief: 'goudron', name: 'Saint-Louis' },
  'Podor': { lat: 16.6528, lng: -14.9589, region: 'Saint-Louis', zone: 'Moyenne Vallée', relief: 'piste_mixte', name: 'Podor (Vallée du Fleuve)' },
  'Richard-Toll': { lat: 16.4625, lng: -15.6881, region: 'Saint-Louis', zone: 'Delta Sucrier', relief: 'goudron', name: 'Richard-Toll' },
  'Dagana': { lat: 16.5167, lng: -15.5000, region: 'Saint-Louis', zone: 'Vallée Rizicole', relief: 'piste_laterite', name: 'Dagana' },
  'Louga': { lat: 15.6186, lng: -16.2244, region: 'Louga', zone: 'Zone Sylvopastorale', relief: 'goudron', name: 'Louga' },
  'Dahra': { lat: 15.3481, lng: -15.4794, region: 'Louga', zone: 'Grand Foirail Djoloff', relief: 'sable_niayes', name: 'Dahra Djoloff' },
  'Linguère': { lat: 15.3953, lng: -15.1194, region: 'Louga', zone: 'Ferlo Pastoral', relief: 'piste_laterite', name: 'Linguère' },
  // Bassin Arachidier & Centre
  'Kaolack': { lat: 14.1500, lng: -16.0833, region: 'Kaolack', zone: 'Saloum & Arachide', relief: 'goudron', name: 'Kaolack' },
  'Fatick': { lat: 14.3333, lng: -16.4167, region: 'Fatick', zone: 'Sine Saloum', relief: 'goudron', name: 'Fatick' },
  'Touba': { lat: 14.8667, lng: -15.8833, region: 'Diourbel', zone: 'Cité Religieuse & Commerce', relief: 'goudron', name: 'Touba' },
  'Diourbel': { lat: 14.6500, lng: -16.2333, region: 'Diourbel', zone: 'Baol Central', relief: 'goudron', name: 'Diourbel' },
  // Sud & Casamance
  'Ziguinchor': { lat: 12.5833, lng: -16.2719, region: 'Ziguinchor', zone: 'Basse Casamance', relief: 'fleuve_bac', name: 'Ziguinchor' },
  'Bignona': { lat: 12.8103, lng: -16.2264, region: 'Ziguinchor', zone: 'Vergers Bio Casamance', relief: 'piste_laterite', name: 'Bignona' },
  'Kolda': { lat: 12.8833, lng: -14.9500, region: 'Kolda', zone: 'Haute Casamance', relief: 'piste_laterite', name: 'Kolda' },
  'Tambacounda': { lat: 13.7667, lng: -13.6667, region: 'Tambacounda', zone: 'Sénégal Oriental', relief: 'piste_laterite', name: 'Tambacounda' }
};

const DEFAULT_USERS = [
  {
    id: 'user-client',
    name: 'Moussa Diagne',
    role: 'client',
    roleLabel: 'Acheteur Particulier & Restaurateur',
    email: 'moussa.diagne@gmail.com',
    phone: '+221 77 555 12 34',
    whatsapp: '221775551234',
    location: 'Dakar, Almadies',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    passwordHash: '98ae296b9129f5cf1e166ff567b5531d706b8d2e698fd27e743b7772e84a7078', // AgroClient@2026
    salt: 'agrobey_salt_client',
    isVerified: true,
    badge: 'Acheteur Vérifié',
    rating: 4.8,
    status: 'active',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'user-farmer',
    name: 'Amadou Ba (Domaine Ba & Fils)',
    role: 'seller',
    roleLabel: 'Agriculteur & Propriétaire Terrien',
    email: 'amadou.ba@agrobey.sn',
    phone: '+221 77 500 44 22',
    whatsapp: '221775004422',
    location: 'Thiès, Notto Diobass',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    passwordHash: '3ea46c23b6077810922a4b1d409fd10821a99df641708ad7cbea0ae89e07b035', // AgroFarmer@2026
    salt: 'agrobey_salt_farmer',
    isVerified: true,
    isSellerApproved: true,
    sellerStatus: 'approved',
    badge: 'Producteur & Bailleur Certifié',
    rating: 4.9,
    totalSales: 18450000,
    activeListings: 4,
    status: 'active',
    createdAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 'user-breeder',
    name: 'Ousmane Fall (Bergerie Prestige)',
    role: 'seller',
    roleLabel: 'Maître Éleveur Ladoum',
    email: 'ousmane.fall@bergerieprestige.sn',
    phone: '+221 78 312 88 90',
    whatsapp: '221783128890',
    location: 'Pout, Thiès',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'ea2b5bc2ff8504950e2d2a051f32e3b8d08686065f7c86fa5baffbb985428413', // AgroBreeder@2026
    salt: 'agrobey_salt_breeder',
    isVerified: true,
    isSellerApproved: true,
    sellerStatus: 'approved',
    badge: 'Éleveur d Élite',
    rating: 5.0,
    totalSales: 24500000,
    activeListings: 2,
    status: 'active',
    createdAt: '2026-08-10T12:00:00Z'
  },
  {
    id: 'user-pending-farmer',
    name: 'Mamadou Diallo (Ferme Maraîchère Diallo)',
    role: 'seller',
    roleLabel: 'Agriculteur Maraîcher & Pépiniériste',
    email: 'mamadou.diallo@agrobey.sn',
    phone: '+221 77 620 33 44',
    whatsapp: '221776203344',
    location: 'Niayes, Kayar',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    passwordHash: '3ea46c23b6077810922a4b1d409fd10821a99df641708ad7cbea0ae89e07b035', // AgroFarmer@2026
    salt: 'agrobey_salt_farmer',
    isVerified: false,
    isSellerApproved: false,
    sellerStatus: 'pending_approval',
    badge: '⏳ Validation Admin/IT en cours',
    rating: 5.0,
    totalSales: 0,
    activeListings: 0,
    status: 'active',
    createdAt: '2026-09-05T15:00:00Z'
  },
  {
    id: 'user-admin',
    name: 'Super-Admin AgroBey',
    role: 'admin',
    roleLabel: 'Super-Administrateur Général',
    department: 'Direction Générale',
    email: 'admin@agrobey.sn',
    phone: '+221 77 000 00 00',
    whatsapp: '221770000000',
    location: 'Dakar, Siège AgroBey',
    avatar: 'assets/logo.jpg',
    passwordHash: 'b8350f460853efff6d0494bb9f2973cd03c245286b2f644c693f7f8020f29fd7', // AgroBey@2026!Admin
    salt: 'agrobey_salt_admin',
    isVerified: true,
    badge: 'Direction Suprême',
    status: 'active',
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'user-assistant',
    name: 'Fatou Ndiaye',
    role: 'assistant',
    roleLabel: 'Assistante Commerciale & Support Client',
    department: 'Service Client & Transactions',
    email: 'assistant@agrobey.sn',
    phone: '+221 77 888 99 00',
    whatsapp: '221778889900',
    location: 'Dakar, Plateau',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    passwordHash: '2f8a50dd3a9d7fc55d76c88f2b2d5d229c2ef04a56db0dac57205b6218ca6fa0', // AgroAssistant@2026
    salt: 'agrobey_salt_assistant',
    isVerified: true,
    badge: 'Support Officiel',
    status: 'active',
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'user-it',
    name: 'Cheikh Kane',
    role: 'it',
    roleLabel: 'Ingénieur Système & Maintenance IT',
    department: 'Infrastructure & Cybersécurité',
    email: 'it@agrobey.sn',
    phone: '+221 77 111 22 33',
    whatsapp: '221771112233',
    location: 'Dakar, Technopole',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    passwordHash: '10576b507669c421ce0853c0516d81194d2ac6bb59679cf9b9c142d571ae2b21', // AgroIT@2026
    salt: 'agrobey_salt_it',
    isVerified: true,
    badge: 'Administrateur IT',
    status: 'active',
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'user-marketing',
    name: 'Aïssatou Sow',
    role: 'marketing',
    roleLabel: 'Responsable Marketing & Visuels Site',
    department: 'Marketing & Communication',
    email: 'marketing@agrobey.sn',
    phone: '+221 76 900 11 22',
    whatsapp: '221769001122',
    location: 'Dakar, Almadies',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    passwordHash: '12de166cb345543045c8639a42b0179a6097326fa0ae3977a859499b1005de3e', // AgroMarketing@2026
    salt: 'agrobey_salt_marketing',
    isVerified: true,
    badge: 'Marketing Lead',
    status: 'active',
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'user-driver-1',
    name: 'Ibrahima Ndiaye (AgroExpress)',
    role: 'delivery',
    roleLabel: 'Transporteur Agréé Agro-Logistique',
    email: 'livreur@agrobey.sn',
    phone: '+221 77 650 11 22',
    whatsapp: '221776501122',
    location: 'Thiès, Pout & Niayes',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'e5f9d8d1889325c2eff88e7295da5eccbad60b17e11e8f1910525935d2f9fd20', // AgroDelivery@2026
    salt: 'agrobey_salt_driver',
    isVerified: true,
    isDriverApproved: true,
    driverStatus: 'approved',
    badge: 'Transporteur Certifié AgroBey',
    vehiculeType: 'camionnette',
    vehicleType: 'Camionnette Frigorifique (3.5 Tonnes)',
    vehiculePlate: 'DK-4820-BG',
    vehiclePlate: 'DK-4820-BG',
    coverageZone: 'Thiès, Pout, Niayes, Dakar',
    coverageZones: 'Thiès, Pout, Niayes, Dakar',
    currentLat: 14.7800,
    currentLng: -16.9400,
    currentZone: 'Thiès - Pout',
    driverLicense: 'Permis B / C Poids Moyen',
    availability: 'online',
    isDriverOnline: true,
    completedDeliveries: 42,
    rating: 4.95,
    earnings: 685000,
    status: 'active',
    createdAt: '2026-08-15T08:00:00Z'
  },
  {
    id: 'user-driver-2',
    name: 'Modou Fall (Express Banlieue)',
    role: 'delivery',
    roleLabel: 'Livreur Tricycle & Moto Rapide',
    email: 'modou.livreur@agrobey.sn',
    phone: '+221 78 440 22 88',
    whatsapp: '221784402288',
    location: 'Dakar, Pikine & Rufisque',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'e5f9d8d1889325c2eff88e7295da5eccbad60b17e11e8f1910525935d2f9fd20', // AgroDelivery@2026
    salt: 'agrobey_salt_driver',
    isVerified: false,
    isDriverApproved: false,
    driverStatus: 'pending_approval',
    badge: '⏳ Validation Admin/IT en cours',
    vehiculeType: 'moto',
    vehicleType: 'Tricycle Utilitaire (500 kg)',
    vehiculePlate: 'DK-9912-AY',
    vehiclePlate: 'DK-9912-AY',
    coverageZone: 'Dakar Centre, Pikine, Guédiawaye, Rufisque',
    coverageZones: 'Dakar Centre, Pikine, Guédiawaye, Rufisque',
    currentLat: 14.7549,
    currentLng: -17.3986,
    currentZone: 'Pikine / Dakar',
    driverLicense: 'Permis A2 / A3',
    availability: 'offline',
    isDriverOnline: false,
    completedDeliveries: 0,
    rating: 5.0,
    earnings: 0,
    status: 'active',
    createdAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'user-driver-3',
    name: 'Moussa Ba (Dakar Moto Fast)',
    role: 'delivery',
    roleLabel: 'Coursier Moto Express 250cc',
    email: 'moussa.moto@agrobey.sn',
    phone: '+221 77 810 55 66',
    whatsapp: '221778105566',
    location: 'Dakar, Almadies & Plateau',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'e5f9d8d1889325c2eff88e7295da5eccbad60b17e11e8f1910525935d2f9fd20', // AgroDelivery@2026
    salt: 'agrobey_salt_driver',
    isVerified: true,
    isDriverApproved: true,
    driverStatus: 'approved',
    badge: 'Transporteur Certifié AgroBey',
    vehiculeType: 'moto',
    vehicleType: 'Moto Express avec Caisson Isotherme',
    vehiculePlate: 'DK-1044-AA',
    vehiclePlate: 'DK-1044-AA',
    coverageZone: 'Dakar Urbain, Almadies, Plateau, Yoff',
    coverageZones: 'Dakar Urbain, Almadies, Plateau, Yoff',
    currentLat: 14.7200,
    currentLng: -17.4600,
    currentZone: 'Dakar Centre / VDN',
    driverLicense: 'Permis A',
    availability: 'online',
    isDriverOnline: true,
    completedDeliveries: 28,
    rating: 4.9,
    earnings: 320000,
    status: 'active',
    createdAt: '2026-08-20T09:00:00Z'
  },
  {
    id: 'user-driver-4',
    name: 'Oumar Sarr (Trans-Vallée Poids Lourd)',
    role: 'delivery',
    roleLabel: 'Transporteur Gros Volume & Bétail',
    email: 'oumar.sarr@agrobey.sn',
    phone: '+221 77 340 77 88',
    whatsapp: '221773407788',
    location: 'Saint-Louis, Richard-Toll & Podor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'e5f9d8d1889325c2eff88e7295da5eccbad60b17e11e8f1910525935d2f9fd20', // AgroDelivery@2026
    salt: 'agrobey_salt_driver',
    isVerified: true,
    isDriverApproved: true,
    driverStatus: 'approved',
    badge: 'Transporteur Certifié Poids Lourd',
    vehiculeType: 'camion',
    vehicleType: 'Camion Plateau Ridelles (10 Tonnes)',
    vehiculePlate: 'SL-7832-B',
    vehiclePlate: 'SL-7832-B',
    coverageZone: 'Vallée du Fleuve, Saint-Louis, Podor, Louga',
    coverageZones: 'Vallée du Fleuve, Saint-Louis, Podor, Louga',
    currentLat: 16.2000,
    currentLng: -15.8000,
    currentZone: 'Delta / Richard-Toll',
    driverLicense: 'Permis C / E',
    availability: 'online',
    isDriverOnline: true,
    completedDeliveries: 65,
    rating: 4.98,
    earnings: 1850000,
    status: 'active',
    createdAt: '2026-08-10T08:00:00Z'
  }
];

const DEFAULT_LISTINGS = [
  {
    id: 'list-1',
    title: 'Oignons Locaux Séchés de Podor (Qualité Supérieure)',
    category: 'recolte',
    subCategory: 'Légumes & Bulbes',
    transactionType: 'vente',
    itemSize: 'large', // Gros volume (>30kg)
    sellerSelectedVehicle: 'camionnette',
    allowedTransportModes: ['camionnette', 'camion'],
    transportInstructions: 'Conditionnement en sacs de 25 kg. Volume commercial nécessitant camionnette ou camion plateau.',
    price: 9500,
    priceUnit: 'le sac de 25 kg',
    quantity: 450,
    unit: 'sacs',
    location: { region: 'Saint-Louis', city: 'Podor', country: 'Sénégal' },
    description: 'Récolte fraîchement séchée de la vallée du fleuve Sénégal. Oignons fermes, peau dorée, longue conservation garantie sans pourriture. Idéal pour grossistes, marchés de Dakar et restaurateurs.',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Variété': 'Violet de Galmi',
      'Période de récolte': 'Août 2026',
      'Conditionnement': 'Sacs aérés de 25 kg',
      'Transport Requis': 'Camionnette ou Camion Plateau (interdit à moto)',
      'Qualité': 'Triés, calibrés et séchés sous hangar'
    },
    seller: {
      id: 'user-farmer',
      name: 'Domaine Ba & Fils',
      phone: '+221 77 500 44 22',
      whatsapp: '221775004422',
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      badge: 'Producteur Certifié'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 1420,
    createdAt: '2026-08-25T10:00:00Z'
  },
  {
    id: 'list-2',
    title: 'Bélier Ladoum Pur Sang (Géniteur de Race Supérieure)',
    category: 'elevage',
    subCategory: 'Ovins & Béliers',
    transactionType: 'vente',
    itemSize: 'large', // Bétail vivant volumineux
    sellerSelectedVehicle: 'camionnette',
    allowedTransportModes: ['camionnette', 'camion'],
    transportInstructions: 'Animal vivant de race prestige (115 kg). Acheminement obligatoire en véhicule sécurisé et aéré avec paille fraîche. Moto strictement interdite.',
    price: 850000,
    priceUnit: 'la tête',
    quantity: 3,
    unit: 'têtes',
    location: { region: 'Thiès', city: 'Pout', country: 'Sénégal' },
    description: 'Magnifique bélier Ladoum issu d une lignée reconnue. Hauteur au garrot 98 cm, longueur 112 cm, tour de poitrine impressionnant. Carnet de vaccination complet et suivi vétérinaire à jour.',
    images: [
      'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Âge': '22 mois',
      'Poids estimé': '115 kg',
      'Transport Sécurisé': 'Camionnette ou Bétaillère spécialisée',
      'Lignée': 'Descendant direct Lignée Roi de Pout',
      'Garantie': 'Certificat sanitaire vétérinaire officiel'
    },
    seller: {
      id: 'user-breeder',
      name: 'Bergerie Prestige Thiès',
      phone: '+221 78 312 88 90',
      whatsapp: '221783128890',
      rating: 5.0,
      reviewCount: 19,
      isVerified: true,
      badge: 'Éleveur d Élite'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 2150,
    createdAt: '2026-08-24T14:30:00Z'
  },
  {
    id: 'list-3',
    title: 'Domaine Agricole 5 Hectares Clôturé avec Forage Solaire',
    category: 'terre',
    subCategory: 'Terres & Champs',
    transactionType: 'location',
    itemSize: 'land',
    sellerSelectedVehicle: null,
    allowedTransportModes: [],
    transportInstructions: 'Transaction foncière officielle : Visite sur site, bornage et acte notarié / bail rural conforme (frais de livraison 0 FCFA).',
    price: 350000,
    priceUnit: 'le mois (Bail renouvelable)',
    quantity: 1,
    unit: 'domaine (5 ha)',
    location: { region: 'Thiès', city: 'Notto Diobass', country: 'Sénégal' },
    description: 'Terrain plat, sol Dior très fertile adapté au maraîchage (papaye, piment, oignon, gombo) et à l arboriculture. Équipé d un forage solaire débit 25 m3/h, château d\'eau de 15 000 L, réseau goutte-à-goutte installé et maison de gardien.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Superficie': '50 000 m² (5 Hectares)',
      'Accès Eau': 'Forage solaire 25 m³/h + Château 15m³',
      'Clôture': 'Grillage galvanisé 2m + Poteaux béton',
      'Type de sol': 'Sableux-argileux (Dior/Deck)',
      'Énergie': 'Kit Solaire 5.5 kVA autonome',
      'Durée de bail': '1 an à 10 ans avec acte notarié'
    },
    seller: {
      id: 'user-farmer',
      name: 'Domaine Ba & Fils',
      phone: '+221 77 500 44 22',
      whatsapp: '221775004422',
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      badge: 'Bailleur Certifié'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 3120,
    createdAt: '2026-08-20T09:15:00Z'
  },
  {
    id: 'list-4',
    title: 'Ferme Avicole Moderne Équipée (Capacité 5 000 Sujets)',
    category: 'ferme',
    subCategory: 'Fermes & Bâtiments',
    transactionType: 'location',
    itemSize: 'land',
    sellerSelectedVehicle: null,
    allowedTransportModes: [],
    transportInstructions: 'Immobilier agro-pastoral : Visite technique sur site et bail d exploitation (frais de livraison 0 FCFA).',
    price: 450000,
    priceUnit: 'le mois',
    quantity: 1,
    unit: 'complexe avicole',
    location: { region: 'Dakar', city: 'Sébikotane', country: 'Sénégal' },
    description: 'Bâtiment avicole professionnel isolé thermiquement, 2 grands poulaillers automatisés, abreuvoirs à pipettes, mangeoires linéaires, groupe électrogène de secours et logement pour 2 ouvriers.',
    images: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Capacité': '5 000 poulets de chair / 3 500 pondeuses',
      'Bâtiments': '2 hangars de 400 m² chacun',
      'Électricité': 'Senelec + Groupe 15 kVA automatique',
      'Sécurité': 'Site gardé 24h/24, caméra solaire',
      'Accès routier': 'Piste carrossable à 800m de la RN1'
    },
    seller: {
      id: 'user-breeder',
      name: 'Bergerie Prestige Thiès',
      phone: '+221 78 312 88 90',
      whatsapp: '221783128890',
      rating: 5.0,
      reviewCount: 19,
      isVerified: true,
      badge: 'Propriétaire Certifié'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 1890,
    createdAt: '2026-08-22T16:00:00Z'
  },
  {
    id: 'list-5',
    title: 'Mangues Kent Fraîches de Casamance (Calibre Export)',
    category: 'recolte',
    subCategory: 'Fruits & Vergers',
    transactionType: 'vente',
    itemSize: 'large',
    sellerSelectedVehicle: 'camionnette',
    allowedTransportModes: ['camionnette', 'camion'],
    transportInstructions: 'Cagettes aérées sur palettes. Transport frigorifique ou bâché pour préserver la fraîcheur.',
    price: 450,
    priceUnit: 'le kg (par palette de 500 kg)',
    quantity: 8000,
    unit: 'kg',
    location: { region: 'Ziguinchor', city: 'Bignona', country: 'Sénégal' },
    description: 'Mangues Kent sans fibres, récoltées à maturité optimale dans nos vergers biologiques de Casamance. Parfum exquis, peau lisse, zéro traitement chimique lourd. Idéal pour exportation et usines de jus.',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Variété': 'Kent & Keitt',
      'Calibre': 'A (350g - 500g)',
      'Conditionnement': 'Cartons aérés de 4 kg ou caisses de 20 kg',
      'Certification': 'Culture Biologique Traditionnelle',
      'Disponibilité': 'Expédition quotidienne vers Dakar'
    },
    seller: {
      id: 'user-farmer',
      name: 'Domaine Ba & Fils',
      phone: '+221 77 500 44 22',
      whatsapp: '221775004422',
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      badge: 'Producteur Certifié'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 980,
    createdAt: '2026-08-26T11:20:00Z'
  },
  {
    id: 'list-6',
    title: 'Tracteur Agricole Massey Ferguson 75 CV avec Charrue 3 Disques',
    category: 'materiel',
    subCategory: 'Tracteurs & Outillage',
    transactionType: 'vente',
    itemSize: 'large',
    sellerSelectedVehicle: 'camion',
    allowedTransportModes: ['camion'],
    transportInstructions: 'Engin lourd de 3.8 Tonnes. Acheminement exclusif par camion plateau ou remorque porte-engin.',
    price: 9800000,
    priceUnit: 'l unité complète',
    quantity: 1,
    unit: 'tracteur',
    location: { region: 'Kaolack', city: 'Kaolack', country: 'Sénégal' },
    description: 'Tracteur 4x4 en parfait état de fonctionnement, moteur révisé, pneumatiques neufs. Équipé d une charrue 3 disques réversible et d une herse rotative.',
    images: [
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Puissance': '75 Chevaux (CV)',
      'Transmission': '4 Roues Motrices (4WD)',
      'Heures de service': '1 250 heures',
      'Accessoires': 'Charrue 3 disques + Rotavator',
      'Papiers': 'Carte grise et dédouanement complets'
    },
    seller: {
      id: 'user-farmer',
      name: 'Domaine Ba & Fils',
      phone: '+221 77 500 44 22',
      whatsapp: '221775004422',
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      badge: 'Vendeur Agréé'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: false,
    views: 1640,
    createdAt: '2026-08-18T08:00:00Z'
  },
  {
    id: 'list-7',
    title: 'Panier Maraîcher Bio Frais du Terroir (Légumes & Aromates 8 kg)',
    category: 'recolte',
    subCategory: 'Légumes & Maraîchage',
    transactionType: 'vente',
    itemSize: 'small', // Petit article -> client choisit son mode (ex: Moto Tiak-Tiak)
    sellerSelectedVehicle: 'moto',
    allowedTransportModes: ['moto', 'tricycle', 'camionnette'],
    transportInstructions: 'Panier léger et frais (8 kg). Parfaitement transportable en caisson moto isotherme (Tiak-Tiak) ou tricycle.',
    price: 7500,
    priceUnit: 'le panier de 8 kg',
    quantity: 60,
    unit: 'paniers',
    location: { region: 'Thiès', city: 'Kayar', country: 'Sénégal' },
    description: 'Composition 100% biologique cueillie le matin même dans les Niayes : tomates cerises, concombres croquants, menthe fraîche, piments doux, aubergines et gombos.',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Poids': '8 kg par panier',
      'Transport Libre': 'Livraison express à Moto Tiak-Tiak recommandée (350-500 FCFA/km)',
      'Fraîcheur': 'Récolté à J-0 au lever du soleil',
      'Emballage': 'Cagette en bois biodégradable et feuilles de bananier'
    },
    seller: {
      id: 'user-farmer',
      name: 'Domaine Ba & Fils',
      phone: '+221 77 500 44 22',
      whatsapp: '221775004422',
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      badge: 'Producteur Certifié'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 890,
    createdAt: '2026-08-28T09:00:00Z'
  },
  {
    id: 'list-8',
    title: 'Miel Pur d Acacia Sauvage & Fleurs de Casamance (Pot 1 Litre / 1.4 kg)',
    category: 'recolte',
    subCategory: 'Apiculture & Miel',
    transactionType: 'vente',
    itemSize: 'small', // Petit article -> client choisit
    sellerSelectedVehicle: 'moto',
    allowedTransportModes: ['moto', 'tricycle', 'camionnette'],
    transportInstructions: 'Bocal en verre sécurisé avec film protecteur. Transport ultra-rapide à moto Tiak-Tiak.',
    price: 6000,
    priceUnit: 'le bocal de 1L (1.4 kg)',
    quantity: 120,
    unit: 'bocaux',
    location: { region: 'Ziguinchor', city: 'Bignona', country: 'Sénégal' },
    description: 'Miel biologique ambré extrait à froid dans les forêts préservées de Casamance. Arômes floraux intenses, non pasteurisé, riche en vertus thérapeutiques et antioxydantes.',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Volume': '1 Litre (Poids net 1.4 kg)',
      'Transport Libre': 'Livraison deux-roues / Moto Tiak-Tiak express autorisée',
      'Extraction': 'Pressage traditionnel à froid',
      'Conservation': 'Longue durée garantie (2 ans+)'
    },
    seller: {
      id: 'user-farmer',
      name: 'Domaine Ba & Fils',
      phone: '+221 77 500 44 22',
      whatsapp: '221775004422',
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      badge: 'Producteur Certifié'
    },
    status: 'approved',
    rejectionReason: null,
    isFeatured: true,
    views: 1150,
    createdAt: '2026-08-30T10:00:00Z'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ord-1001',
    listingId: 'list-1',
    listingTitle: 'Oignons Locaux Séchés de Podor',
    category: 'recolte',
    buyerId: 'user-client',
    buyerName: 'Moussa Diagne (Restaurant Le Teranga)',
    buyerPhone: '+221 77 555 12 34',
    buyerAddress: 'Dakar, Almadies, en face Pharmacie du Golf',
    sellerId: 'user-farmer',
    sellerName: 'Domaine Ba & Fils',
    sellerPhone: '+221 77 500 44 22',
    quantity: 40,
    unitPrice: 9500,
    totalAmount: 380000,
    orderType: 'vente',
    durationMonths: null,
    deliveryAddress: 'Dakar, Almadies, Restaurant Le Teranga',
    notes: 'Livraison souhaitée avant vendredi matin par camionette bâchée.',
    status: 'confirmed',
    date: '2026-08-29T11:30:00Z'
  },
  {
    id: 'ord-1002',
    listingId: 'list-3',
    listingTitle: 'Domaine Agricole 5 Ha Clôturé avec Forage Solaire',
    category: 'terre',
    buyerId: 'user-client',
    buyerName: 'Moussa Diagne',
    buyerPhone: '+221 77 555 12 34',
    buyerAddress: 'Dakar, Almadies',
    sellerId: 'user-farmer',
    sellerName: 'Domaine Ba & Fils',
    sellerPhone: '+221 77 500 44 22',
    quantity: 1,
    unitPrice: 350000,
    totalAmount: 4200000,
    orderType: 'location',
    durationMonths: 12,
    deliveryAddress: 'Thiès, Notto Diobass',
    notes: 'Contrat de bail rural d un an renouvelable pour projet maraîcher biologique.',
    status: 'pending',
    date: '2026-08-30T15:45:00Z'
  }
];

const DEFAULT_PRICE_BAROMETER = [
  { product: 'Oignon Local Séché', unit: 'Sac 25 kg', min: 8500, max: 11000, avg: 9750, trend: 'down', market: 'Marché Castors Dakar & Podor' },
  { product: 'Pomme de Terre Locale (Sahel)', unit: 'Sac 25 kg', min: 10000, max: 12500, avg: 11200, trend: 'stable', market: 'Marché Thiaroye & Saint-Louis' },
  { product: 'Riz Blanc de la Vallée (Parfumé)', unit: 'Sac 50 kg', min: 17500, max: 19500, avg: 18400, trend: 'stable', market: 'Ross Béthio & Touba' },
  { product: 'Maïs Jaune Local en Grains', unit: 'Sac 50 kg', min: 13000, max: 15500, avg: 14200, trend: 'up', market: 'Kébémer & Kaolack' },
  { product: 'Mangue Kent (Calibre Export)', unit: 'Kilogramme (kg)', min: 380, max: 550, avg: 460, trend: 'down', market: 'Ziguinchor & Rungis Dakar' },
  { product: 'Bélier Ladoum Géniteur Sélectionné', unit: 'Tête', min: 500000, max: 1500000, avg: 850000, trend: 'up', market: 'Thiès Pout & Foirail Dakar' },
  { product: 'Génisse Guzera Gestante Pure Race', unit: 'Tête', min: 1200000, max: 1800000, avg: 1550000, trend: 'stable', market: 'Dahra Djoloff & Fatick' },
  { product: 'Location Champ Maraîcher avec Forage', unit: 'Hectare / Mois', min: 50000, max: 90000, avg: 70000, trend: 'up', market: 'Niayes & Notto Diobass' }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipientId: 'user-farmer',
    title: 'Nouvelle Commande Reçue !',
    message: 'Moussa Diagne a commandé 40 sacs d Oignons de Podor pour un total de 380 000 FCFA.',
    type: 'order',
    orderId: 'ord-1001',
    buyerName: 'Moussa Diagne',
    buyerPhone: '+221 77 555 12 34',
    isRead: false,
    createdAt: '2026-08-29T11:30:00Z'
  },
  {
    id: 'notif-2',
    recipientId: 'user-farmer',
    title: 'Demande de Bail Rural Reçue',
    message: 'Moussa Diagne souhaite louer votre domaine de 5 Ha à Notto Diobass pour 12 mois (4 200 000 FCFA).',
    type: 'order',
    orderId: 'ord-1002',
    buyerName: 'Moussa Diagne',
    buyerPhone: '+221 77 555 12 34',
    isRead: false,
    createdAt: '2026-08-30T15:45:00Z'
  }
];

const DEFAULT_TICKETS = [
  {
    id: 'tick-201',
    userId: 'user-farmer',
    userName: 'Amadou Ba',
    userPhone: '+221 77 500 44 22',
    userEmail: 'amadou.ba@agrobey.sn',
    subject: 'Assistance validation contrat notarié pour bail rural 5 Ha',
    category: 'juridique_foncier',
    status: 'in_progress',
    messages: [
      { sender: 'user', text: 'Bonjour, j ai un preneur pour mon terrain de Notto Diobass. Quel notaire partenaire AgroBey à Thiès peut certifier l acte ?', time: 'Hier 14:00' },
      { sender: 'agent', text: 'Bonjour M. Ba. Notre cabinet notarial partenaire à Thiès (Me Ndiaye) a été notifié. Un modèle pré-rempli lui a été transmis.', time: 'Hier 14:45' }
    ],
    createdAt: '2026-08-30T14:00:00Z'
  }
];

const DEFAULT_AI_CONVERSATIONS = [
  {
    id: 'conv-101',
    userId: 'user-client',
    userName: 'Moussa Diagne',
    userContact: '+221 77 555 12 34',
    status: 'active',
    topic: 'Bail Rural Foncier & Eau Forage',
    unreadForStaff: false,
    createdAt: '2026-09-02T10:15:00Z',
    updatedAt: '2026-09-02T10:25:00Z',
    messages: [
      { id: 'msg-1', sender: 'user', text: 'Bonjour, je souhaite louer un terrain de 5 hectares pour du maraîchage. Quelles clauses dois-je exiger pour le forage solaire ?', time: '10:15' },
      { id: 'msg-2', sender: 'bot', text: '🌱 **Conseil IA AgroBey :** Pour un bail rural sécurisé au Sénégal, vérifiez obligatoirement : 1) Le débit minimal du forage (ex: 20 à 25 m³/h), 2) La prise en charge de la maintenance de la pompe solaire par le bailleur, 3) L autorisation formelle de poser un réseau goutte-à-goutte, 4) Une clause d indemnité sur les investissements en cas de non-renouvellement. Vous pouvez générer ce contrat directement sur la fiche du terrain dans notre catalogue !', time: '10:16' },
      { id: 'msg-3', sender: 'user', text: 'Super clair merci ! Et quel notaire à Thiès peut viser le contrat ?', time: '10:18' },
      { id: 'msg-4', sender: 'assistant', author: 'Fatou Ndiaye (Assistante AgroBey)', text: 'Bonjour M. Diagne ! Notre cabinet notarial partenaire Me Ndiaye à Thiès est disponible. Souhaitez-vous que je lui transmette votre dossier pour pré-validation ?', time: '10:25' }
    ]
  },
  {
    id: 'conv-102',
    userId: 'user-farmer',
    userName: 'Amadou Ba',
    userContact: '+221 77 500 44 22',
    status: 'resolved',
    topic: 'Diagnostic Maladie Oignon & Séchage',
    unreadForStaff: false,
    createdAt: '2026-09-03T14:20:00Z',
    updatedAt: '2026-09-03T14:35:00Z',
    messages: [
      { id: 'msg-1', sender: 'user', text: 'Mes oignons de Podor présentent des petites taches blanchâtres sur les feuilles. Est-ce l alternariose ou des thrips ?', time: '14:20' },
      { id: 'msg-2', sender: 'bot', text: '🔬 **Diagnostic Agronomique IA :** Les taches blanchâtres allongées en période humide évoquent l alternariose (Alternaria porri) ou une attaque de thrips. **Actions immédiates recommandées :** 1) Diminuer les arrosages foliaires tardifs, 2) Traiter avec un fongicide à base de cuivre ou Mancozèbe, 3) Assurer un séchage de 10 jours sous claies aérées avant ensachage pour éviter la pourriture au stockage.', time: '14:22' },
      { id: 'msg-3', sender: 'user', text: 'Parfait, le traitement au cuivre a stoppé la progression. Merci pour la réactivité !', time: '14:35' }
    ]
  },
  {
    id: 'conv-103',
    userId: 'guest-904',
    userName: 'Visiteur (Kaolack)',
    userContact: '+221 78 120 40 50',
    status: 'active',
    topic: 'Estimation Coût Transport Kaolack-Dakar',
    unreadForStaff: true,
    createdAt: '2026-09-04T09:00:00Z',
    updatedAt: '2026-09-04T09:05:00Z',
    messages: [
      { id: 'msg-1', sender: 'user', text: 'Quel est le prix moyen d un camion de 20 tonnes de maïs de Kaolack jusqu au port de Dakar ?', time: '09:00' },
      { id: 'msg-2', sender: 'bot', text: '🚚 **Logistique & Transport IA :** Pour le trajet Kaolack - Dakar (environ 190 km) en camion plateau ou semi-remorque 20T, le tarif moyen négocié par nos transporteurs partenaires est de **250 000 à 320 000 FCFA** (soit environ 12,5 à 16 FCFA/kg), incluant le carburant et le péage. Une assistante AgroBey peut vous assigner un transporteur agréé si vous le souhaitez.', time: '09:02' }
    ]
  }
];

const DEFAULT_DELIVERIES = [
  {
    id: 'del-5001',
    orderId: 'ord-1001',
    listingId: 'list-1',
    itemTitle: 'Oignons Locaux Séchés de Podor',
    category: 'recolte',
    quantity: 40,
    unit: 'sacs (1 000 kg)',
    pickupAddress: 'Podor, Vallée du Fleuve (Domaine Ba & Fils)',
    pickupPhone: '+221 77 500 44 22',
    senderId: 'user-farmer',
    senderName: 'Amadou Ba (Domaine Ba)',
    originLat: 16.6528,
    originLng: -14.9589,
    originZone: 'Moyenne Vallée (Podor)',
    deliveryAddress: 'Dakar, Almadies, Restaurant Le Teranga',
    deliveryPhone: '+221 77 555 12 34',
    recipientId: 'user-client',
    recipientName: 'Moussa Diagne (Restaurant Le Teranga)',
    destLat: 14.7455,
    destLng: -17.5195,
    destZone: 'Dakar Ouest (Almadies)',
    driverId: 'user-driver-1',
    driverName: 'Ibrahima Ndiaye (AgroExpress)',
    driverPhone: '+221 77 650 11 22',
    vehicleType: 'Camionnette Frigorifique (3.5 Tonnes)',
    vehiculeType: 'camionnette',
    distanceKm: 425.0,
    deliveryFee: 185000,
    tariffDetails: {
      distanceKm: 425.0,
      vehiculeType: 'camionnette',
      baseFare: 7500,
      perKmRate: 350,
      reliefMultiplier: 1.15,
      reliefType: 'piste_mixte',
      nightMultiplier: 1.0,
      trafficMultiplier: 1.0,
      totalTariff: 185000
    },
    status: 'in_transit', // available | accepted | picked_up | in_transit | delivered | cancelled
    otpCode: '4892',
    notes: 'Récolte fraîchement ensachée. Livraison demandée avant 11h.',
    trackingHistory: [
      { status: 'created', time: '2026-08-29T11:35:00Z', note: 'Demande de transport générée avec succès.', actor: 'Système' },
      { status: 'accepted', time: '2026-08-29T12:00:00Z', note: 'Course prise en charge par Ibrahima Ndiaye (AgroExpress).', actor: 'Ibrahima Ndiaye' },
      { status: 'picked_up', time: '2026-08-29T14:30:00Z', note: 'Chargement de 40 sacs effectué au domaine à Podor.', actor: 'Ibrahima Ndiaye' },
      { status: 'in_transit', time: '2026-08-29T16:00:00Z', note: 'En route vers Dakar (axe RN2 / Péage).', actor: 'Ibrahima Ndiaye' }
    ],
    createdAt: '2026-08-29T11:35:00Z',
    updatedAt: '2026-08-29T16:00:00Z'
  },
  {
    id: 'del-5002',
    orderId: 'ord-1003',
    listingId: 'list-5',
    itemTitle: 'Mangues Kent Fraîches de Casamance',
    category: 'recolte',
    quantity: 500,
    unit: 'kg (Cartons aérés)',
    pickupAddress: 'Bignona, Casamance (Vergers Bio Sud)',
    pickupPhone: '+221 77 500 44 22',
    senderId: 'user-farmer',
    senderName: 'Amadou Ba (Domaine Ba)',
    originLat: 12.8103,
    originLng: -16.2264,
    originZone: 'Vergers Bio Casamance (Bignona)',
    deliveryAddress: 'Marché Castors, Dakar',
    deliveryPhone: '+221 78 200 90 90',
    recipientId: 'user-client',
    recipientName: 'Grossiste Maraîcher Dakar',
    destLat: 14.7167,
    destLng: -17.4677,
    destZone: 'Dakar Centre (Castors)',
    driverId: null,
    driverName: null,
    driverPhone: null,
    vehicleType: 'Camionnette Frigorifique (3.5 Tonnes)',
    vehiculeType: 'camionnette',
    distanceKm: 460.0,
    deliveryFee: 228000,
    tariffDetails: {
      distanceKm: 460.0,
      vehiculeType: 'camionnette',
      baseFare: 7500,
      perKmRate: 350,
      reliefMultiplier: 1.35,
      reliefType: 'piste_laterite',
      nightMultiplier: 1.0,
      trafficMultiplier: 1.0,
      totalTariff: 228000
    },
    status: 'available',
    otpCode: '7319',
    notes: 'Fruits frais fragiles à transporter sous bâche aérée.',
    trackingHistory: [
      { status: 'created', time: '2026-09-04T08:30:00Z', note: 'Demande de transport déposée. En attente d affectation.', actor: 'Système' }
    ],
    createdAt: '2026-09-04T08:30:00Z',
    updatedAt: '2026-09-04T08:30:00Z'
  },
  {
    id: 'del-5003',
    orderId: 'ord-1004',
    listingId: 'list-2',
    itemTitle: 'Bélier Ladoum Royal (Géniteur 18 Mois)',
    category: 'elevage',
    quantity: 1,
    unit: 'tête (Bélier)',
    pickupAddress: 'Pout, Thiès (Bergerie Prestige)',
    pickupPhone: '+221 78 312 88 90',
    senderId: 'user-breeder',
    senderName: 'Ousmane Fall (Bergerie Prestige)',
    originLat: 14.7719,
    originLng: -17.0617,
    originZone: 'Bassin Maraîcher (Pout)',
    deliveryAddress: 'Dakar, Almadies',
    deliveryPhone: '+221 77 555 12 34',
    recipientId: 'user-client',
    recipientName: 'Moussa Diagne',
    destLat: 14.7455,
    destLng: -17.5195,
    destZone: 'Dakar Ouest (Almadies)',
    driverId: 'user-driver-1',
    driverName: 'Ibrahima Ndiaye (AgroExpress)',
    driverPhone: '+221 77 650 11 22',
    vehicleType: 'Camionnette Frigorifique (3.5 Tonnes)',
    vehiculeType: 'camionnette',
    distanceKm: 65.0,
    deliveryFee: 35000,
    tariffDetails: {
      distanceKm: 65.0,
      vehiculeType: 'camionnette',
      baseFare: 7500,
      perKmRate: 350,
      reliefMultiplier: 1.15,
      reliefType: 'piste_mixte',
      nightMultiplier: 1.0,
      trafficMultiplier: 1.0,
      totalTariff: 35000
    },
    status: 'delivered',
    otpCode: '8124',
    notes: 'Transport délicat d animal vivant. Eau fraîche fournie.',
    trackingHistory: [
      { status: 'created', time: '2026-09-01T09:00:00Z', note: 'Demande de transport créée.', actor: 'Système' },
      { status: 'accepted', time: '2026-09-01T09:15:00Z', note: 'Course acceptée par Ibrahima Ndiaye.', actor: 'Ibrahima Ndiaye' },
      { status: 'picked_up', time: '2026-09-01T10:30:00Z', note: 'Bélier embarqué à la bergerie de Pout.', actor: 'Ibrahima Ndiaye' },
      { status: 'in_transit', time: '2026-09-01T11:00:00Z', note: 'Axe autoroutier Thiès-Dakar.', actor: 'Ibrahima Ndiaye' },
      { status: 'delivered', time: '2026-09-01T12:15:00Z', note: 'Livré aux Almadies. Code OTP 8124 validé.', actor: 'Ibrahima Ndiaye' }
    ],
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-01T12:15:00Z'
  }
];

const DEFAULT_SYSTEM_LOGS = [
  { id: 'log-1', timestamp: '2026-09-05T18:00:00Z', category: 'AUTH', action: 'Connexion Super-Admin', details: 'Authentification réussie pour admin@agrobey.sn', author: 'Super-Admin' },
  { id: 'log-2', timestamp: '2026-09-05T18:15:00Z', category: 'ORDER', action: 'Création Commande #ord-1002', details: 'Bail rural 5 Ha réservé par Moussa Diagne (4 200 000 FCFA)', author: 'Système' },
  { id: 'log-3', timestamp: '2026-09-05T19:00:00Z', category: 'SECURITY', action: 'Contrôle RBAC', details: 'Accès publication restreint aux comptes vendeurs uniquement', author: 'IT-Engine' },
  { id: 'log-4', timestamp: '2026-09-05T19:30:00Z', category: 'IA_ASSISTANT', action: 'Session IA #conv-103', details: 'Question logistique Kaolack-Dakar traitée en 120ms', author: 'AgroBey-IA' },
  { id: 'log-5', timestamp: '2026-09-05T20:00:00Z', category: 'DELIVERY', action: 'Mission #del-5001 en transit', details: 'Transport Podor -> Dakar par Ibrahima Ndiaye', author: 'AgroExpress' }
];

// --- CLASSE MOTEUR PRINCIPAL ---
class AgroBeyDatabase {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    } else {
      // Synchronisation et réparation automatique des comptes par défaut
      this.syncDefaultUsers();
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(DEFAULT_LISTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DELIVERIES)) {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(DEFAULT_DELIVERIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRICE_BAROMETER)) {
      localStorage.setItem(STORAGE_KEYS.PRICE_BAROMETER, JSON.stringify(DEFAULT_PRICE_BAROMETER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(DEFAULT_TICKETS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AI_CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(DEFAULT_AI_CONVERSATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(DEFAULT_SYSTEM_LOGS));
    }
  }

  syncDefaultUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
      let modified = false;
      DEFAULT_USERS.forEach(defUser => {
        const idx = users.findIndex(u => (u.email && u.email.toLowerCase() === defUser.email.toLowerCase()) || u.id === defUser.id);
        if (idx === -1) {
          users.push(defUser);
          modified = true;
        } else {
          // Mise à jour de sécurité des hashes & sels si obsolètes
          if (users[idx].passwordHash !== defUser.passwordHash || users[idx].salt !== defUser.salt || users[idx].role !== defUser.role) {
            users[idx].passwordHash = defUser.passwordHash;
            users[idx].salt = defUser.salt;
            users[idx].role = defUser.role;
            users[idx].roleLabel = defUser.roleLabel;
            if (defUser.department) users[idx].department = defUser.department;
            modified = true;
          }
        }
      });
      if (modified) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    } catch (e) {
      console.warn('Erreur syncDefaultUsers:', e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error('Erreur listener DB:', e); }
    });
  }

  // --- SETTINGS ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.addSystemLog('CONFIG', 'Mise à jour Paramètres Site', 'Paramètres et visuels mis à jour', 'Admin/Marketing');
    this.notify();
    return updated;
  }

  // --- USERS & STAFF ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch (e) {
      return [];
    }
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    const clean = (email || '').toLowerCase().trim();
    return this.getUsers().find(u => u.email.toLowerCase().trim() === clean) || null;
  }

  saveUser(user) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
    return user;
  }

  updateUser(id, partial) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index >= 0) {
      users[index] = { ...users[index], ...partial };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.notify();
      return users[index];
    }
    return null;
  }

  deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
    return true;
  }

  getStaffAccounts() {
    const staffRoles = ['admin', 'assistant', 'it', 'marketing'];
    return this.getUsers().filter(u => staffRoles.includes(u.role));
  }

  // --- CONVERSATIONS IA & SUPPORT CLIENT ---
  getAIConversations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AI_CONVERSATIONS)) || [];
    } catch (e) {
      return [];
    }
  }

  getAIConversationById(id) {
    return this.getAIConversations().find(c => c.id === id) || null;
  }

  saveAIConversation(conv) {
    const all = this.getAIConversations();
    const index = all.findIndex(c => c.id === conv.id);
    if (index >= 0) {
      all[index] = { ...all[index], ...conv, updatedAt: new Date().toISOString() };
    } else {
      all.unshift({ ...conv, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(all));
    this.notify();
    return conv;
  }

  addAIMessage(convId, messageObj) {
    const all = this.getAIConversations();
    let conv = all.find(c => c.id === convId);
    if (!conv) {
      conv = {
        id: convId,
        userId: messageObj.userId || 'guest',
        userName: messageObj.userName || 'Visiteur AgroBey',
        userContact: messageObj.userContact || '+221 -- --- -- --',
        status: 'active',
        topic: messageObj.text.slice(0, 40) + '...',
        unreadForStaff: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      all.unshift(conv);
    }
    conv.messages.push({
      id: 'msg-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
      ...messageObj
    });
    conv.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(all));
    this.notify();
    return conv;
  }

  staffReplyToAIConversation(convId, staffName, replyText) {
    const all = this.getAIConversations();
    const conv = all.find(c => c.id === convId);
    if (!conv) return null;

    conv.messages.push({
      id: 'msg-' + Date.now().toString().slice(-6),
      sender: 'assistant',
      author: staffName,
      text: replyText,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });
    conv.unreadForStaff = false;
    conv.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(all));
    this.addSystemLog('SUPPORT', `Intervention Staff sur IA (${conv.id})`, `Réponse envoyée par ${staffName}`, staffName);
    this.notify();
    return conv;
  }

  deleteAIConversation(convId) {
    let all = this.getAIConversations();
    all = all.filter(c => c.id !== convId);
    localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(all));
    this.notify();
    return true;
  }

  // --- SYSTEM LOGS (MAINTENANCE IT) ---
  getSystemLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_LOGS)) || [];
    } catch (e) {
      return [];
    }
  }

  addSystemLog(category, action, details, author = 'Système') {
    const logs = this.getSystemLogs();
    logs.unshift({
      id: 'log-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
      category,
      action,
      details,
      author
    });
    if (logs.length > 200) logs.pop(); // Limite à 200 logs
    localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(logs));
  }

  clearSystemLogs() {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify([]));
    this.notify();
  }

  // --- LISTINGS ---
  getAllListings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS)) || [];
    } catch (e) {
      return [];
    }
  }

  getApprovedListings() {
    return this.getAllListings().filter(l => l.status === 'approved');
  }

  getListingById(id) {
    return this.getAllListings().find(l => l.id === id) || null;
  }

  saveListing(listing) {
    const listings = this.getAllListings();
    const index = listings.findIndex(l => l.id === listing.id);
    if (index >= 0) {
      listings[index] = { ...listings[index], ...listing };
    } else {
      listings.unshift(listing);
    }
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    this.addSystemLog('CATALOGUE', 'Nouvelle Offre Déposée', `Offre: ${listing.title} (${listing.price} FCFA)`, listing.seller?.name || 'Vendeur');
    this.notify();
    return listing;
  }

  updateListing(id, partial) {
    const listings = this.getAllListings();
    const index = listings.findIndex(l => l.id === id);
    if (index >= 0) {
      listings[index] = { ...listings[index], ...partial };
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
      this.notify();
      return listings[index];
    }
    return null;
  }

  deleteListing(id) {
    let listings = this.getAllListings();
    listings = listings.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    this.addSystemLog('CATALOGUE', 'Suppression Offre', `ID Offre: ${id}`, 'Admin/Vendeur');
    this.notify();
    return true;
  }

  // --- ORDERS ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch (e) {
      return [];
    }
  }

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id) || null;
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const isLand = orderData.itemSize === 'land' || 
                   orderData.category === 'terre' || 
                   orderData.category === 'ferme' || 
                   orderData.orderType === 'location' || 
                   orderData.isLandTransaction === true;

    const normalizedOrderData = {
      ...orderData,
      isLandTransaction: isLand,
      hasDelivery: isLand ? false : (orderData.hasDelivery === true),
      deliveryFee: isLand ? 0 : (orderData.deliveryFee || 0),
      deliveryStatus: isLand ? 'not_applicable' : (orderData.deliveryStatus || 'pending')
    };

    const newOrder = {
      id: 'ord-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      status: 'pending',
      ...normalizedOrderData
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    this.createNotification({
      recipientId: newOrder.sellerId,
      title: isLand ? 'Nouvelle Demande de Bail / Transaction Foncière' : 'Nouvelle Commande Reçue !',
      message: isLand 
        ? `${newOrder.buyerName} souhaite réserver "${newOrder.listingTitle}" (${new Intl.NumberFormat('fr-FR').format(newOrder.totalAmount)} FCFA). Visite & bail rural à organiser.`
        : `${newOrder.buyerName} a commandé ${newOrder.quantity} unité(s) de "${newOrder.listingTitle}" (${new Intl.NumberFormat('fr-FR').format(newOrder.totalAmount)} FCFA).`,
      type: 'order',
      orderId: newOrder.id,
      buyerName: newOrder.buyerName,
      buyerPhone: newOrder.buyerPhone
    });

    this.addSystemLog('TRANSACTION', isLand ? 'Transaction Foncière Initiée' : 'Nouvelle Transaction', `Commande #${newOrder.id} (${newOrder.totalAmount} FCFA)`, newOrder.buyerName);
    this.notify();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.addSystemLog('TRANSACTION', `Statut Commande #${orderId}`, `Nouveau statut: ${status}`, 'Staff/Admin');
      this.notify();
      return orders[index];
    }
    return null;
  }

  // --- LIVRAISONS & MISSIONS LOGISTIQUES ---
  getDeliveries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES)) || [];
    } catch (e) {
      return [];
    }
  }

  getDeliveryById(id) {
    return this.getDeliveries().find(d => d.id === id) || null;
  }

  getDeliveryByOrderId(orderId) {
    return this.getDeliveries().find(d => d.orderId === orderId) || null;
  }

  getDeliveriesForDriver(driverId) {
    return this.getDeliveries().filter(d => d.driverId === driverId);
  }

  getAvailableDeliveries() {
    return this.getDeliveries().filter(d => d.status === 'available');
  }

  // --- MOTEUR GÉOGRAPHIQUE & TARIFICATION MULTI-FACTEURS ---
  getCoordinatesForLocation(locStr) {
    if (!locStr) return { lat: 14.7167, lng: -17.4677, region: 'Dakar', zone: 'Dakar Centre', relief: 'goudron', name: 'Dakar' };

    const lower = locStr.toLowerCase().trim();
    for (const [key, data] of Object.entries(SENEGAL_GPS_COORDINATES)) {
      if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
        return { ...data, matchedKey: key };
      }
    }

    // Recherche par mots-clés régionaux / zones
    if (lower.includes('dakar') || lower.includes('almadies') || lower.includes('vdn') || lower.includes('plateau') || lower.includes('yoff') || lower.includes('mermoz')) {
      return SENEGAL_GPS_COORDINATES['Dakar'];
    }
    if (lower.includes('thies') || lower.includes('thiès') || lower.includes('pout') || lower.includes('diobass') || lower.includes('notto')) {
      return SENEGAL_GPS_COORDINATES['Thiès'];
    }
    if (lower.includes('niayes') || lower.includes('kayar') || lower.includes('mboro')) {
      return SENEGAL_GPS_COORDINATES['Kayar'];
    }
    if (lower.includes('saint-louis') || lower.includes('podor') || lower.includes('richard') || lower.includes('dagana') || lower.includes('fleuve')) {
      return SENEGAL_GPS_COORDINATES['Saint-Louis'];
    }
    if (lower.includes('kaolack') || lower.includes('fatick') || lower.includes('saloum')) {
      return SENEGAL_GPS_COORDINATES['Kaolack'];
    }
    if (lower.includes('casamance') || lower.includes('ziguinchor') || lower.includes('bignona') || lower.includes('kolda')) {
      return SENEGAL_GPS_COORDINATES['Ziguinchor'];
    }

    // Défaut Dakar Centre
    return { lat: 14.7167, lng: -17.4677, region: 'Dakar', zone: 'Dakar Centre', relief: 'goudron', name: locStr };
  }

  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (lat1 === lat2 && lon1 === lon2) return 5.0; // Distance intra-zone min 5km

    const R = 6371; // Rayon moyen de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistance = R * c;

    // Facteur de sinuosité routière réaliste au Sénégal (pistes & réseau national ~1.25x la vol d'oiseau)
    const roadDistance = straightDistance * 1.25;
    return Math.max(5.0, Math.round(roadDistance * 10) / 10);
  }

  // --- MOTEUR DE TARIFICATION MOTO & DEUX-ROUES (350 FCFA à 500 FCFA / km) ---
  calculateMotoRatePerKm(origin, dest, distanceKm, options = {}) {
    const baseKmRate = 350; // Tarif de base goudron / beau temps / trafic fluide
    const maxKmRate = 500;  // Plafond strict imposé pour la livraison deux-roues

    let reliefInc = 0;
    let weatherInc = 0;
    let nightInc = 0;
    let trafficInc = 0;
    let accessInc = 0;
    let distanceInc = 0;
    const factors = [];

    // 1. Relief & État de la route
    const highestRelief = (origin.relief === 'fleuve_bac' || dest.relief === 'fleuve_bac') ? 'fleuve_bac' :
                          (origin.relief === 'piste_laterite' || dest.relief === 'piste_laterite') ? 'piste_laterite' :
                          (origin.relief === 'sable_niayes' || dest.relief === 'sable_niayes') ? 'sable_niayes' :
                          (origin.relief === 'piste_mixte' || dest.relief === 'piste_mixte') ? 'piste_mixte' : 'goudron';

    if (highestRelief === 'fleuve_bac') {
      reliefInc = 100;
      factors.push('Passage fleuve / bac (+100 F/km)');
    } else if (highestRelief === 'piste_laterite') {
      reliefInc = 90;
      factors.push('Piste latéritique / ornières (+90 F/km)');
    } else if (highestRelief === 'sable_niayes') {
      reliefInc = 60;
      factors.push('Pistes sableuses Niayes (+60 F/km)');
    } else if (highestRelief === 'piste_mixte') {
      reliefInc = 40;
      factors.push('Piste rurale praticable (+40 F/km)');
    } else {
      factors.push('Axe goudronné bitumé (0 F/km)');
    }

    // 2. Conditions Météorologiques (Pluie / Hivernage / Chaleur / Harmattan)
    const weather = options.weather || (options.isRaining ? 'rain' : 'clear');
    if (weather === 'rain' || weather === 'pluie' || weather === 'hivernage') {
      weatherInc = 45;
      factors.push('Météo pluvieuse / hivernage (+45 F/km)');
    } else if (weather === 'harmattan' || weather === 'canicule') {
      weatherInc = 25;
      factors.push('Forte chaleur / poussière (+25 F/km)');
    }

    // 3. Période Nocturne (20h - 06h)
    const currentHour = new Date().getHours();
    const isNight = options.isNight !== undefined ? options.isNight : (currentHour >= 20 || currentHour < 6);
    if (isNight) {
      nightInc = 35;
      factors.push('Circulation nocturne (+35 F/km)');
    }

    // 4. Trafic & Embouteillages (Heures de pointe 07h-09h30 & 17h-20h en agglomération)
    const isRushHourTime = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 20);
    const isUrbanZone = origin.region === 'Dakar' || dest.region === 'Dakar';
    const isRushHour = options.trafficCongestion ? (options.trafficCongestion === 'rush_hour') : (isRushHourTime && isUrbanZone);
    if (isRushHour) {
      trafficInc = 40;
      factors.push('Heure de pointe / Trafic dense (+40 F/km)');
    } else if (options.trafficCongestion === 'moderate') {
      trafficInc = 15;
      factors.push('Trafic modéré (+15 F/km)');
    }

    // 5. Accessibilité & Enclavement
    const isRemote = options.isRemote || origin.zone?.includes('Rural') || dest.zone?.includes('Rural') || origin.zone?.includes('Ferlo') || dest.zone?.includes('Ferlo');
    if (isRemote) {
      accessInc = 35;
      factors.push('Zone rurale enclavée (+35 F/km)');
    }

    // 6. Distance (Majorations sur longs trajets moto > 40km pour fatigue / retour)
    if (distanceKm > 40) {
      distanceInc = 30;
      factors.push('Long rayon d action > 40 km (+30 F/km)');
    }

    const rawRate = baseKmRate + reliefInc + weatherInc + nightInc + trafficInc + accessInc + distanceInc;
    // Arrondi au multiple de 25 FCFA le plus proche, strictement encadré entre 350 et 500 FCFA
    const finalRatePerKm = Math.min(maxKmRate, Math.max(baseKmRate, Math.round(rawRate / 25) * 25));

    return {
      ratePerKm: finalRatePerKm,
      baseKmRate,
      maxKmRate,
      highestRelief,
      isNight,
      isRushHour,
      weather,
      breakdown: {
        base: baseKmRate,
        relief: reliefInc,
        weather: weatherInc,
        night: nightInc,
        traffic: trafficInc,
        accessibility: accessInc,
        distance: distanceInc
      },
      factors,
      justification: `${finalRatePerKm} FCFA/km [${factors.join(' • ')}]`
    };
  }

  calculateSmartDeliveryTariff(originStr, destStr, vehiculeType = 'camionnette', options = {}, listingContext = null) {
    const origin = this.getCoordinatesForLocation(originStr);
    const dest = this.getCoordinatesForLocation(destStr);
    const distanceKm = this.calculateDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng);

    // Contexte de l'article (Règles Petits articles vs Gros articles vs Foncier/Terres)
    const itemSize = (listingContext && listingContext.itemSize) ? listingContext.itemSize : (options.itemSize || 'small');
    const sellerRequiredVehicle = (listingContext && listingContext.sellerSelectedVehicle) ? listingContext.sellerSelectedVehicle : (options.sellerSelectedVehicle || null);
    
    // RÈGLE STRICTE FONCIER & TERRES : Aucune livraison physique pour les terres, champs, fermes ou locations
    const isLand = itemSize === 'land' || 
                   (listingContext && (listingContext.category === 'terre' || listingContext.category === 'ferme' || listingContext.transactionType === 'location')) ||
                   options.category === 'terre' || options.category === 'ferme' || options.transactionType === 'location';

    if (isLand) {
      return {
        distanceKm: 0,
        origin,
        destination: dest,
        vehiculeType: 'aucun',
        requestedVehicule: 'aucun',
        isMotoAllowed: false,
        isDeliverable: false,
        isLandTransaction: true,
        safetyNotice: "🌿 Transaction foncière / immobilière rurale : Bien non livrable par transporteur. Gestion par visite sur site & bail rural conforme.",
        itemSize: 'land',
        vehicleName: 'Non applicable (Foncier Rural)',
        baseFare: 0,
        perKmRate: 0,
        motoRateDetails: null,
        rawBaseCost: 0,
        reliefMultiplier: 1.0,
        reliefType: 'goudron',
        nightMultiplier: 1.0,
        isNight: false,
        trafficMultiplier: 1.0,
        isRushHour: false,
        totalTariff: 0
      };
    }

    // Si l'article est gros/lourd ou du bétail, la moto est interdite par sécurité
    const isMotoAllowed = (itemSize !== 'large');
    let effectiveVehicule = vehiculeType;
    let safetyNotice = null;

    if (!isMotoAllowed && vehiculeType === 'moto') {
      effectiveVehicule = sellerRequiredVehicle || 'camionnette';
      safetyNotice = `⚠️ Article volumineux ou bétail : Transport moto non autorisé. Véhicule imposé par le vendeur : ${effectiveVehicule.toUpperCase()}.`;
    }

    // 1. Barème Véhicule de base
    const vehicleRates = {
      moto: { base: 1000, perKm: 350, name: 'Moto Tiak-Tiak Express (Petits colis < 30 kg)' },
      tricycle: { base: 3500, perKm: 200, name: 'Tricycle Utilitaire (Jusqu à 500 kg)' },
      voiture: { base: 5000, perKm: 250, name: 'Voiture / Break Utilitaire (Colis moyens)' },
      camionnette: { base: 7500, perKm: 350, name: 'Camionnette Frigorifique / Bâchée (3.5 Tonnes)' },
      betaillere: { base: 15000, perKm: 550, name: 'Camion Bétaillère / Bétail Spécialisé' },
      camion: { base: 25000, perKm: 850, name: 'Camion Plateau Ridelles (10T à 20T - Gros tonnage)' }
    };

    const rate = vehicleRates[effectiveVehicule] || vehicleRates.camionnette;

    // Calcul spécial pour Moto (Moteur Dynamique 350 à 500 FCFA/km)
    let motoRateDetails = null;
    let totalTariff = 0;
    let rawBaseCost = 0;
    let reliefMultiplier = 1.0;
    let nightMultiplier = 1.0;
    let trafficMultiplier = 1.0;
    let highestRelief = 'goudron';
    let isNight = false;
    let isRushHour = false;

    if (effectiveVehicule === 'moto') {
      motoRateDetails = this.calculateMotoRatePerKm(origin, dest, distanceKm, options);
      highestRelief = motoRateDetails.highestRelief;
      isNight = motoRateDetails.isNight;
      isRushHour = motoRateDetails.isRushHour;

      const baseFare = 1000; // Prise en charge initiale moto
      const distanceFare = distanceKm * motoRateDetails.ratePerKm;
      rawBaseCost = baseFare + distanceFare;

      // Minimum course moto 1 500 FCFA, arrondi aux 500 FCFA supérieurs
      totalTariff = Math.max(1500, Math.round(rawBaseCost / 500) * 500);
    } else {
      // Barème Standard Véhicules Lourds / Utilitaires
      const reliefMultipliers = {
        goudron: 1.0,
        piste_mixte: 1.15,
        sable_niayes: 1.25,
        piste_laterite: 1.35,
        fleuve_bac: 1.50
      };
      const originReliefMult = reliefMultipliers[origin.relief] || 1.0;
      const destReliefMult = reliefMultipliers[dest.relief] || 1.0;
      reliefMultiplier = Math.max(originReliefMult, destReliefMult);
      highestRelief = originReliefMult >= destReliefMult ? origin.relief : dest.relief;

      const currentHour = new Date().getHours();
      isNight = options.isNight !== undefined ? options.isNight : (currentHour >= 20 || currentHour < 6);
      nightMultiplier = isNight ? 1.30 : 1.0;

      const isRushHourTime = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 20);
      const isUrbanZone = origin.region === 'Dakar' || dest.region === 'Dakar';
      isRushHour = options.trafficCongestion ? (options.trafficCongestion === 'rush_hour') : (isRushHourTime && isUrbanZone);
      trafficMultiplier = isRushHour ? 1.25 : 1.0;

      const baseCost = rate.base + (distanceKm * rate.perKm);
      rawBaseCost = baseCost;
      const rawTotal = baseCost * reliefMultiplier * nightMultiplier * trafficMultiplier;
      totalTariff = Math.max(rate.base, Math.round(rawTotal / 500) * 500);
    }

    return {
      distanceKm,
      origin,
      destination: dest,
      vehiculeType: effectiveVehicule,
      requestedVehicule: vehiculeType,
      isMotoAllowed,
      safetyNotice,
      itemSize,
      vehicleName: rate.name,
      baseFare: effectiveVehicule === 'moto' ? 1000 : rate.base,
      perKmRate: effectiveVehicule === 'moto' ? (motoRateDetails ? motoRateDetails.ratePerKm : 350) : rate.perKm,
      motoRateDetails,
      rawBaseCost: Math.round(rawBaseCost),
      reliefMultiplier,
      reliefType: highestRelief,
      nightMultiplier,
      isNight,
      trafficMultiplier,
      isRushHour,
      totalTariff
    };
  }

  findClosestDriver(pickupLocationStr, vehiculeType = null) {
    const pickupCoords = this.getCoordinatesForLocation(pickupLocationStr);
    const drivers = this.getUsers().filter(u => u.role === 'delivery' && u.isDriverApproved);

    if (drivers.length === 0) return null;

    const evaluatedDrivers = drivers.map(driver => {
      let driverLat = driver.currentLat;
      let driverLng = driver.currentLng;
      if (!driverLat || !driverLng) {
        const coords = this.getCoordinatesForLocation(driver.location || driver.currentZone || 'Thiès');
        driverLat = coords.lat;
        driverLng = coords.lng;
      }

      const dist = this.calculateDistanceKm(driverLat, driverLng, pickupCoords.lat, pickupCoords.lng);
      const isOnline = (driver.availability === 'online' || driver.isDriverOnline === true);
      const vehicleMatch = !vehiculeType || (driver.vehiculeType === vehiculeType);

      return {
        driver,
        driverCoords: { lat: driverLat, lng: driverLng },
        distanceKm: dist,
        isOnline,
        vehicleMatch,
        score: dist + (isOnline ? 0 : 500) + (vehicleMatch ? 0 : 200) // Online et type véhicule favorisés
      };
    });

    evaluatedDrivers.sort((a, b) => a.score - b.score);
    const best = evaluatedDrivers[0];

    return {
      bestDriver: best.driver,
      distanceToPickupKm: best.distanceKm,
      isOnline: best.isOnline,
      allDrivers: evaluatedDrivers
    };
  }

  setDriverLocationAndStatus(driverId, lat, lng, zoneName = '', isOnline = true) {
    const driver = this.getUserById(driverId);
    if (!driver) return null;

    driver.currentLat = lat;
    driver.currentLng = lng;
    if (zoneName) driver.currentZone = zoneName;
    driver.availability = isOnline ? 'online' : 'offline';
    driver.isDriverOnline = isOnline;
    driver.lastLocationUpdate = new Date().toISOString();

    this.saveUser(driver);
    this.notify();
    return driver;
  }

  createDelivery(deliveryData) {
    const deliveries = this.getDeliveries();
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Récupération de l'article pour les règles de transport
    const listing = deliveryData.listingId ? this.getListingById(deliveryData.listingId) : null;
    const origin = this.getCoordinatesForLocation(deliveryData.pickupAddress);
    const dest = this.getCoordinatesForLocation(deliveryData.deliveryAddress);
    const vehType = deliveryData.vehiculeType || (listing ? listing.sellerSelectedVehicle : 'camionnette');
    const smartTariff = deliveryData.tariffDetails || this.calculateSmartDeliveryTariff(deliveryData.pickupAddress, deliveryData.deliveryAddress, vehType, {}, listing);
    const closest = this.findClosestDriver(deliveryData.pickupAddress, smartTariff.vehiculeType);

    const newDelivery = {
      id: 'del-' + Date.now().toString().slice(-5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: deliveryData.status || 'available', // available | accepted | picked_up | in_transit | delivered | cancelled
      otpCode: otp,
      itemSize: listing ? listing.itemSize : (deliveryData.itemSize || 'small'),
      originLat: origin.lat,
      originLng: origin.lng,
      originZone: origin.zone || origin.name,
      destLat: dest.lat,
      destLng: dest.lng,
      destZone: dest.zone || dest.name,
      distanceKm: smartTariff.distanceKm,
      vehiculeType: smartTariff.vehiculeType,
      ratePerKm: smartTariff.perKmRate,
      motoRateDetails: smartTariff.motoRateDetails || null,
      deliveryFee: deliveryData.deliveryFee || smartTariff.totalTariff,
      tariffDetails: smartTariff,
      closestDriverSuggested: closest ? {
        id: closest.bestDriver.id,
        name: closest.bestDriver.name,
        distanceKm: closest.distanceToPickupKm,
        isOnline: closest.isOnline
      } : null,
      trackingHistory: [
        {
          status: 'created',
          time: new Date().toISOString(),
          note: `Demande de transport créée. Distance estimée : ${smartTariff.distanceKm} km. Tarif : ${smartTariff.totalTariff.toLocaleString('fr-FR')} FCFA.`,
          actor: 'Système AgroExpress'
        }
      ],
      ...deliveryData
    };

    deliveries.unshift(newDelivery);
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));

    this.addSystemLog('DELIVERY', 'Nouvelle Mission de Transport', `Mission #${newDelivery.id} : ${newDelivery.itemTitle} (${newDelivery.pickupAddress} ➔ ${newDelivery.deliveryAddress}, ${smartTariff.distanceKm}km)`, 'AgroExpress');

    if (newDelivery.senderId) {
      this.createNotification({
        recipientId: newDelivery.senderId,
        title: '🚚 Mission de Livraison Programmée',
        message: `Une demande d'acheminement (${smartTariff.distanceKm} km - ${newDelivery.deliveryFee.toLocaleString('fr-FR')} FCFA) a été ouverte pour votre commande #${newDelivery.orderId || ''}.`,
        type: 'delivery'
      });
    }

    // Si un livreur le plus proche a été trouvé et est en ligne, le notifier immédiatement
    if (closest && closest.bestDriver && closest.isOnline) {
      this.createNotification({
        recipientId: closest.bestDriver.id,
        title: '🔔 Nouvelle Course à Proximité !',
        message: `Nouvelle mission disponible à ${closest.distanceToPickupKm} km de votre position : "${newDelivery.itemTitle}" (${newDelivery.deliveryFee.toLocaleString('fr-FR')} FCFA).`,
        type: 'delivery'
      });
    }

    this.notify();
    return newDelivery;
  }

  acceptDelivery(deliveryId, driverId) {
    const deliveries = this.getDeliveries();
    const index = deliveries.findIndex(d => d.id === deliveryId);
    if (index === -1) return null;

    const driver = this.getUserById(driverId);
    if (!driver) return null;

    deliveries[index].driverId = driver.id;
    deliveries[index].driverName = driver.name;
    deliveries[index].driverPhone = driver.phone;
    deliveries[index].vehicleType = driver.vehicleType || 'Véhicule utilitaire';
    deliveries[index].status = 'accepted';
    deliveries[index].updatedAt = new Date().toISOString();

    deliveries[index].trackingHistory.push({
      status: 'accepted',
      time: new Date().toISOString(),
      note: `Course prise en charge par ${driver.name} (${deliveries[index].vehicleType}).`,
      actor: driver.name
    });

    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));

    if (deliveries[index].recipientId) {
      this.createNotification({
        recipientId: deliveries[index].recipientId,
        title: '🚚 Transporteur Assigné à votre Colis !',
        message: `${driver.name} a accepté votre livraison. Votre code secret de réception est : ${deliveries[index].otpCode}.`,
        type: 'delivery'
      });
    }

    this.addSystemLog('DELIVERY', `Prise en charge Mission #${deliveryId}`, `Chauffeur : ${driver.name}`, driver.name);
    this.notify();
    return deliveries[index];
  }

  updateDeliveryStatus(deliveryId, newStatus, note = '', actorName = 'Livreur') {
    const deliveries = this.getDeliveries();
    const index = deliveries.findIndex(d => d.id === deliveryId);
    if (index === -1) return null;

    const delivery = deliveries[index];
    delivery.status = newStatus;
    delivery.updatedAt = new Date().toISOString();

    const statusLabels = {
      accepted: 'Course acceptée par le transporteur',
      picked_up: 'Marchandise chargée et récupérée chez le producteur',
      in_transit: 'En cours d acheminement vers le destinataire',
      delivered: 'Colis livré avec succès à destination',
      cancelled: 'Mission de livraison annulée'
    };

    delivery.trackingHistory.push({
      status: newStatus,
      time: new Date().toISOString(),
      note: note || (statusLabels[newStatus] || `Statut : ${newStatus}`),
      actor: actorName
    });

    if (newStatus === 'delivered' && delivery.orderId) {
      this.updateOrderStatus(delivery.orderId, 'delivered');
      
      if (delivery.driverId && delivery.deliveryFee) {
        const driver = this.getUserById(delivery.driverId);
        if (driver) {
          driver.completedDeliveries = (driver.completedDeliveries || 0) + 1;
          driver.earnings = (driver.earnings || 0) + Number(delivery.deliveryFee);
          this.saveUser(driver);
        }
      }

      if (delivery.recipientId) {
        this.createNotification({
          recipientId: delivery.recipientId,
          title: '✅ Livraison Terminée & Confirmée !',
          message: `Votre commande "${delivery.itemTitle}" a été livrée avec succès par ${delivery.driverName}. Merci de faire confiance à AgroBey !`,
          type: 'delivery'
        });
      }
    }

    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));
    this.addSystemLog('DELIVERY', `Mise à jour Mission #${deliveryId}`, `Statut : ${newStatus} (${note || ''})`, actorName);
    this.notify();
    return delivery;
  }

  verifyDeliveryOTP(deliveryId, otpInput, actorName = 'Livreur') {
    const delivery = this.getDeliveryById(deliveryId);
    if (!delivery) return { success: false, message: 'Livraison introuvable.' };

    const cleanInput = (otpInput || '').toString().trim();
    if (cleanInput === delivery.otpCode.toString().trim()) {
      const updated = this.updateDeliveryStatus(deliveryId, 'delivered', 'Code OTP client validé avec succès par le transporteur.', actorName);
      return { success: true, delivery: updated };
    } else {
      return { success: false, message: 'Code OTP incorrect. Veuillez demander le code à 4 chiffres à l acheteur.' };
    }
  }

  // --- VALIDATION DES COMPTES LIVREURS (ADMIN / IT) ---
  approveDriver(userId, approvedBy = 'Admin/IT') {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.role = 'delivery';
    user.isDriverApproved = true;
    user.driverStatus = 'approved';
    user.isVerified = true;
    user.badge = 'Transporteur Certifié AgroBey';
    user.availability = 'online';
    user.approvedBy = approvedBy;
    user.approvedAt = new Date().toISOString();

    this.saveUser(user);

    this.createNotification({
      recipientId: user.id,
      title: '🎉 Compte Transporteur Validé !',
      message: `Félicitations ${user.name} ! Votre compte Livreur / Transporteur AgroBey a été approuvé par ${approvedBy}. Vous pouvez désormais accepter des courses en direct.`,
      type: 'account'
    });

    this.addSystemLog('AUTH', 'Validation Compte Transporteur', `Compte de ${user.name} validé par ${approvedBy}`, approvedBy);
    this.notify();
    return user;
  }

  rejectDriver(userId, reason = 'Critères non conformes', rejectedBy = 'Admin/IT') {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.isDriverApproved = false;
    user.driverStatus = 'rejected';
    user.badge = 'Transporteur non approuvé';
    user.availability = 'offline';
    user.rejectedBy = rejectedBy;
    user.rejectionReason = reason;

    this.saveUser(user);

    this.createNotification({
      recipientId: user.id,
      title: 'Compte Transporteur non approuvé',
      message: `Votre demande de compte transporteur a été refusée par l'administration (${rejectedBy}). Motif : ${reason}.`,
      type: 'account'
    });

    this.addSystemLog('AUTH', 'Rejet Compte Transporteur', `Compte de ${user.name} rejeté par ${rejectedBy} (Motif: ${reason})`, rejectedBy);
    this.notify();
    return user;
  }

  // --- NOTIFICATIONS ---
  getNotifications(recipientId) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
      if (!recipientId) return all;
      return all.filter(n => n.recipientId === recipientId);
    } catch (e) {
      return [];
    }
  }

  createNotification(notifData) {
    const all = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notifData
    };
    all.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.notify();
    return newNotif;
  }

  markNotificationAsRead(notifId) {
    const all = this.getNotifications();
    const index = all.findIndex(n => n.id === notifId);
    if (index >= 0) {
      all[index].isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.notify();
    }
  }

  markAllNotificationsAsRead(recipientId) {
    const all = this.getNotifications();
    all.forEach(n => {
      if (!recipientId || n.recipientId === recipientId) {
        n.isRead = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.notify();
  }

  // --- PRICE BAROMETER ---
  getPriceBarometer() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_BAROMETER)) || DEFAULT_PRICE_BAROMETER;
    } catch (e) {
      return DEFAULT_PRICE_BAROMETER;
    }
  }

  updatePriceBarometer(data) {
    localStorage.setItem(STORAGE_KEYS.PRICE_BAROMETER, JSON.stringify(data));
    this.notify();
  }

  // --- TICKETS SUPPORT ---
  getTickets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    } catch (e) {
      return [];
    }
  }

  createTicket(ticketData) {
    const tickets = this.getTickets();
    const newTicket = {
      id: 'tick-' + Date.now().toString().slice(-5),
      createdAt: new Date().toISOString(),
      status: 'open',
      messages: [],
      ...ticketData
    };
    tickets.unshift(newTicket);
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    this.addSystemLog('SUPPORT', 'Nouveau Ticket Support', `Ticket #${newTicket.id} (${newTicket.category})`, newTicket.userName);
    this.notify();
    return newTicket;
  }

  // --- STATS POUR ADMIN & DASHBOARDS ---
  getStats() {
    const users = this.getUsers();
    const listings = this.getAllListings();
    const orders = this.getOrders();
    const deliveries = this.getDeliveries();
    const tickets = this.getTickets();
    const aiConvs = this.getAIConversations();

    const totalSalesVolume = orders
      .filter(o => o.status === 'delivered' || o.status === 'confirmed')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingSellers = users.filter(u => u.role === 'seller' && (u.sellerStatus === 'pending_approval' || u.isSellerApproved === false)).length;
    const approvedSellers = users.filter(u => u.role === 'seller' && (u.sellerStatus === 'approved' || u.isSellerApproved === true)).length;
    const pendingDrivers = users.filter(u => u.role === 'delivery' && (u.driverStatus === 'pending_approval' || u.isDriverApproved === false)).length;
    const approvedDrivers = users.filter(u => u.role === 'delivery' && (u.driverStatus === 'approved' || u.isDriverApproved === true)).length;

    return {
      totalUsers: users.length,
      clientsCount: users.filter(u => u.role === 'client' || u.role === 'buyer').length,
      sellersCount: users.filter(u => u.role === 'seller').length,
      driversCount: users.filter(u => u.role === 'delivery').length,
      pendingSellers: pendingSellers,
      approvedSellers: approvedSellers,
      pendingDrivers: pendingDrivers,
      approvedDrivers: approvedDrivers,
      availableDrivers: users.filter(u => u.role === 'delivery' && u.isDriverApproved && u.availability === 'online').length,
      staffCount: users.filter(u => ['admin', 'assistant', 'it', 'marketing'].includes(u.role)).length,
      verifiedSellers: users.filter(u => u.role === 'seller' && u.isVerified).length,
      totalListings: listings.length,
      approvedListings: listings.filter(l => l.status === 'approved').length,
      pendingListings: listings.filter(l => l.status === 'pending').length,
      rejectedListings: listings.filter(l => l.status === 'rejected').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      totalDeliveries: deliveries.length,
      activeDeliveries: deliveries.filter(d => ['assigned', 'accepted', 'picked_up', 'in_transit'].includes(d.status)).length,
      availableDeliveries: deliveries.filter(d => d.status === 'available').length,
      deliveredDeliveries: deliveries.filter(d => d.status === 'delivered').length,
      totalSalesVolume: totalSalesVolume,
      openTickets: tickets.filter(t => t.status !== 'resolved').length,
      totalAIConversations: aiConvs.length,
      activeAIConversations: aiConvs.filter(c => c.status === 'active').length
    };
  }

  // --- VALIDATION DES COMPTES VENDEURS PAR ADMIN / IT ---
  approveSeller(userId, approvedBy = 'Admin/IT') {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.role = 'seller';
    user.isSellerApproved = true;
    user.sellerStatus = 'approved';
    user.isVerified = true;
    user.badge = user.badge && !user.badge.includes('attente') ? user.badge : 'Producteur Certifié AgroBey';
    user.approvedBy = approvedBy;
    user.approvedAt = new Date().toISOString();

    this.saveUser(user);

    this.createNotification({
      recipientId: user.id,
      title: '🎉 Compte Vendeur Validé avec Succès !',
      message: `Félicitations ${user.name} ! Votre compte Producteur / Éleveur a été vérifié et validé par ${approvedBy}. Vous pouvez désormais publier librement vos offres sur le catalogue officiel AgroBey.`,
      type: 'account'
    });

    this.addSystemLog('AUTH', 'Validation Compte Vendeur', `Compte de ${user.name} validé par ${approvedBy}`, approvedBy);
    this.notify();
    return user;
  }

  rejectSeller(userId, reason = 'Critères non conformes', rejectedBy = 'Admin/IT') {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.isSellerApproved = false;
    user.sellerStatus = 'rejected';
    user.badge = 'Non approuvé';
    user.rejectedBy = rejectedBy;
    user.rejectionReason = reason;

    this.saveUser(user);

    this.createNotification({
      recipientId: user.id,
      title: 'Compte Vendeur non approuvé',
      message: `Votre demande de compte vendeur a été refusée par l'administration (${rejectedBy}). Motif : ${reason}. Vous pouvez contacter le support pour assistance.`,
      type: 'account'
    });

    this.addSystemLog('AUTH', 'Rejet Compte Vendeur', `Compte de ${user.name} rejeté par ${rejectedBy} (Motif: ${reason})`, rejectedBy);
    this.notify();
    return user;
  }

  // --- ALIASES ET MÉTHODES DE COMPATIBILITÉ ---
  getListings() {
    return this.getAllListings();
  }

  getMarketingSettings() {
    return this.getSettings();
  }

  saveMarketingSettings(settings) {
    return this.updateSettings(settings);
  }

  saveOrder(order) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = { ...orders[index], ...order };
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notify();
    return order;
  }

  // --- BACKUP & RESTORE JSON ---
  exportFullDatabase() {
    return JSON.stringify({
      settings: this.getSettings(),
      users: this.getUsers(),
      listings: this.getAllListings(),
      orders: this.getOrders(),
      deliveries: this.getDeliveries(),
      notifications: this.getNotifications(),
      priceBarometer: this.getPriceBarometer(),
      tickets: this.getTickets(),
      aiConversations: this.getAIConversations(),
      systemLogs: this.getSystemLogs(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importFullDatabase(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      if (data.listings) localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(data.listings));
      if (data.orders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.deliveries) localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(data.deliveries));
      if (data.notifications) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data.notifications));
      if (data.priceBarometer) localStorage.setItem(STORAGE_KEYS.PRICE_BAROMETER, JSON.stringify(data.priceBarometer));
      if (data.tickets) localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(data.tickets));
      if (data.aiConversations) localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(data.aiConversations));
      if (data.systemLogs) localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(data.systemLogs));
      this.notify();
      return { success: true };
    } catch (e) {
      console.error('Erreur import DB:', e);
      return { success: false, error: e.message || 'JSON invalide' };
    }
  }

  // --- RÉINITIALISATION D'USINE ---
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(DEFAULT_LISTINGS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(DEFAULT_DELIVERIES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.PRICE_BAROMETER, JSON.stringify(DEFAULT_PRICE_BAROMETER));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(DEFAULT_TICKETS));
    localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(DEFAULT_AI_CONVERSATIONS));
    localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(DEFAULT_SYSTEM_LOGS));
    this.notify();
  }
}

// Instance globale singleton
window.AgroBeyDB = new AgroBeyDatabase();
