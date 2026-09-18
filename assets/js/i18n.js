/**
 * AgroBey - Moteur Multilingue & Internationalisation (i18n)
 * Support complet du FranÃ§ais ðŸ‡«ðŸ‡·, du Wolof ðŸ‡¸ðŸ‡³ et de l'Anglais ðŸ‡¬ðŸ‡§.
 * Gestion rÃ©active du DOM, sÃ©lecteurs interactifs et persistance locale.
 */

const AgroBeyI18n = {
  currentLang: 'fr',
  availableLanguages: [
    { code: 'fr', label: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·', shortLabel: 'FR' },
    { code: 'wo', label: 'Wolof', flag: 'ðŸ‡¸ðŸ‡³', shortLabel: 'WO' },
    { code: 'en', label: 'English', flag: 'ðŸ‡¬ðŸ‡§', shortLabel: 'EN' }
  ],

  translations: {
    fr: {
      // Topbar & Global
      official_badge: "Officiel",
      topbar_announcement: "ðŸŒ¿ Plateforme Nationale & RÃ©gionale du Monde Rural et Agro-Pastoral",
      transport_certified: "Transport & Logistique certifiÃ©s",
      support_label: "Support",
      tagline_sub: "Agriculture â€¢ Ã‰levage â€¢ Terres â€¢ Fermes",
      pwa_banner_title: "Installer l'Application Mobile AgroBey",
      pwa_banner_desc: "AccÃ¨s direct en 1 clic, alertes instantanÃ©es & mode hors-ligne",
      pwa_install_btn: "Installer",
      whatsapp_support: "Support WhatsApp",
      official_mobile_app: "Application Mobile Officielle",

      // Navigation
      nav_marketplace: "Catalogue & Offres",
      nav_seller: "Espace Agriculteur & Annonces",
      nav_delivery: "Espace Livreur",
      nav_support: "BaromÃ¨tre & Support",
      nav_orders: "Mes Commandes & Baux",
      nav_my_account: "Mon Compte",
      nav_login: "Connexion",
      nav_register: "S'inscrire",
      nav_logout: "Se dÃ©connecter",
      nav_courier_short: "Livreur",
      nav_farmer_short: "Agriculteur",
      nav_catalogue_short: "Catalogue",
      nav_ai_short: "Assistant IA",

      // Hero & Marketplace
      hero_badge: "100% Direct Producteur â€¢ Sans IntermÃ©diaires Abusifs",
      hero_title_1: "Cultivons. Ã‰levons.",
      hero_title_2: "Construisons demain.",
      hero_desc: "La marketplace digitale de rÃ©fÃ©rence dÃ©diÃ©e aux rÃ©coltes maraÃ®chÃ¨res, Ã  l'Ã©levage d'Ã©lite (Ladoum, GuzÃ©ra) et Ã  la location ou l'achat de terres et fermes agricoles au SÃ©nÃ©gal et en Afrique de l'Ouest.",
      search_placeholder: "Rechercher oignons de Podor, bÃ©liers Ladoum, champs Ã  louer...",
      search_btn: "Filtrer",
      mobile_filters_btn: "Filtres & RÃ©gions du SÃ©nÃ©gal",
      filter_all_regions: "Toutes les rÃ©gions",
      filter_category_label: "FiliÃ¨re / CatÃ©gorie",
      filter_region_label: "RÃ©gion du SÃ©nÃ©gal",
      filter_type_label: "Type d'Offre",
      filter_type_buy: "Achat Direct",
      filter_type_rent: "Bail / Location",
      filter_reset: "RÃ©initialiser",
      filter_apply: "Appliquer",

      // Categories
      cat_all: "ðŸŒ¾ Toutes les Offres",
      cat_recolte: "ðŸ¥¦ RÃ©coltes & MaraÃ®chage",
      cat_elevage: "ðŸ Ã‰levage & Cheptel",
      cat_terre: "ðŸŒ„ Terres & Champs",
      cat_ferme: "ðŸ¡ Fermes Ã‰quipÃ©es",
      cat_materiel: "ðŸšœ MatÃ©riel Agricole",

      // Listing Card & Details
      certified_seller: "Producteur CertifiÃ©",
      negotiable: "Prix NÃ©gociable",
      firm_price: "Prix Ferme",
      available_stock: "Stock disponible :",
      view_details_btn: "Voir l'offre & Commander",
      buy_now_btn: "Commander / RÃ©server",
      contact_seller_btn: "Contacter le Vendeur",
      seller_contact: "CoordonnÃ©es du Vendeur",
      location_label: "Localisation",
      category_label: "CatÃ©gorie",
      price_label: "Prix unitaire",
      surface_label: "Superficie",
      delivery_mode_label: "Mode d'Acheminement",
      delivery_included: "Livraison disponible",
      delivery_excluded_land: "Transaction FonciÃ¨re (Sans livraison physique)",
      land_security_notice: "Protocole NotariÃ© & DÃ©libÃ©ration Communale obligatoires pour toute transaction fonciÃ¨re.",
      simulation_moto_btn: "Simuler Course Moto Tiak-Tiak",

      // Order & Modal
      order_title: "Finaliser votre Commande",
      order_quantity: "QuantitÃ© souhaitÃ©e :",
      order_client_name: "Nom complet du Client :",
      order_client_phone: "NumÃ©ro de TÃ©lÃ©phone (Orange Money / Wave) :",
      order_destination: "Lieu prÃ©cis de Livraison / Commune :",
      order_has_delivery: "Inclure la Livraison Ã  Domicile / DÃ©pÃ´t",
      order_summary: "RÃ©capitulatif Financier",
      order_subtotal: "Sous-total articles :",
      order_delivery_fee: "Frais de livraison :",
      order_total: "Total Net Ã  Payer :",
      order_confirm_btn: "Confirmer la Commande & Payer",
      order_success: "Votre commande a Ã©tÃ© enregistrÃ©e avec succÃ¨s !",

      // Seller Dashboard
      seller_dashboard_title: "Espace Producteur & Agriculteur",
      seller_dashboard_sub: "GÃ©rez vos rÃ©coltes, publiez de nouvelles annonces et suivez vos commandes en direct.",
      seller_stats_sales: "Ventes Totales",
      seller_stats_active: "Offres en Ligne",
      seller_stats_pending: "Commandes en Cours",
      seller_stats_rating: "Note Producteur",
      seller_tab_listings: "Mes Offres & RÃ©coltes",
      seller_tab_publish: "DÃ©poser une Annonce",
      seller_tab_orders: "Commandes & Baux Ruraux",
      seller_tab_notifs: "Alertes & Messages",
      seller_btn_publish_cta: "âž• DÃ©poser une Nouvelle Annonce",
      seller_no_listings: "Vous n'avez pas encore publiÃ© d'offres.",
      seller_delete_confirm: "ÃŠtes-vous sÃ»r de vouloir retirer cette offre ?",
      seller_pending_approval: "Compte en attente de vÃ©rification d'identitÃ© par l'administration AgroBey.",

      // Publish Listing Form
      pub_title: "DÃ©poser une Annonce Agricole ou Pastorale",
      pub_desc: "Renseignez les caractÃ©ristiques prÃ©cises de vos produits ou terres pour toucher des milliers d'acheteurs au SÃ©nÃ©gal.",
      pub_field_title: "Titre de l'Offre :",
      pub_field_title_ph: "Ex : 5 Tonnes d'Oignons Frais de Podor - RÃ©colte 2026",
      pub_field_cat: "FiliÃ¨re / CatÃ©gorie :",
      pub_field_type: "Type de Transaction :",
      pub_type_sale: "Vente Directe",
      pub_type_rent: "Location / Bail Rural",
      pub_field_price: "Prix Unitaire (FCFA) :",
      pub_field_unit: "UnitÃ© de Vente :",
      pub_field_quantity: "QuantitÃ© / Stock Disponible :",
      pub_field_region: "RÃ©gion / Localisation :",
      pub_field_size: "Gabarit Logistique & Transport :",
      pub_size_small: "ðŸ“¦ Petit Article (Transportable Ã  Moto / Tiak-Tiak)",
      pub_size_large: "ðŸšš Gros Article / Volume (Transport en VÃ©hicule DÃ©diÃ©)",
      pub_field_vehicles: "VÃ©hicules autorisÃ©s par le vendeur :",
      pub_field_images: "Photos de l'Article (jusqu'Ã  4 photos rÃ©elles) :",
      pub_field_desc: "Description DÃ©taillÃ©e & Conditions :",
      pub_field_desc_ph: "DÃ©crivez la qualitÃ©, le conditionnement, le mode de conservation, les accÃ¨s routiers...",
      pub_submit_btn: "Publier l'Annonce Directement",
      pub_success_toast: "Votre annonce a Ã©tÃ© publiÃ©e avec succÃ¨s !",

      // Delivery Module
      delivery_title: "Espace Transport & Missions Logistiques",
      delivery_sub: "Consultez les missions de livraison disponibles, calculez vos trajets et suivez vos courses en temps rÃ©el.",
      delivery_sim_title: "Simulateur Tarifaire Moto Tiak-Tiak (350 - 500 FCFA / km)",
      delivery_origin: "Lieu de Retrait (Producteur) :",
      delivery_dest: "Lieu de Livraison (Client) :",
      delivery_calc_btn: "Calculer ItinÃ©raire & Tarif",
      delivery_est_distance: "Distance estimÃ©e :",
      delivery_est_tariff: "Tarif estimÃ© :",
      delivery_available_missions: "Missions Disponibles au SÃ©nÃ©gal",
      delivery_accept_mission: "Accepter la Mission de Transport",
      delivery_status_pending: "En attente de transporteur",
      delivery_status_transit: "En cours d'acheminement",
      delivery_status_delivered: "LivrÃ© avec succÃ¨s",

      // Support & AI Assistant
      support_title: "Assistant IA & BaromÃ¨tre des Prix du MarchÃ©",
      support_sub: "Conseils agronomiques intelligents, tendances mÃ©tÃ©o et cours officiels des denrÃ©es au SÃ©nÃ©gal.",
      ai_chat_title: "Conseiller Agro-Pastoral Intelligent",
      ai_chat_placeholder: "Posez votre question (ex: PrÃ©vention des maladies de la tomate, cours du mil Ã  Kaolack...)",
      ai_chat_send: "Envoyer",
      barometer_title: "BaromÃ¨tre Officiel des Prix Agricoles (SIM/SÃ©nÃ©gal)",
      barometer_last_update: "Mis Ã  jour aujourd'hui Ã  08h00 GMT",

      // Auth Modals
      auth_login_title: "Connexion Ã  votre Espace AgroBey",
      auth_register_title: "CrÃ©er un Compte AgroBey",
      auth_email_or_phone: "TÃ©lÃ©phone ou Adresse E-mail :",
      auth_password: "Mot de passe sÃ©curisÃ© :",
      auth_name: "Nom complet & PrÃ©nom :",
      auth_role_label: "Votre RÃ´le Principal :",
      auth_role_buyer: "ðŸ›’ Acheteur / CommerÃ§ant",
      auth_role_seller: "ðŸŒ¾ Agriculteur / Ã‰leveur",
      auth_role_courier: "ðŸ›µ Livreur / Transporteur",
      auth_submit_login: "Se Connecter",
      auth_submit_register: "CrÃ©er mon Compte",
      auth_no_account: "Pas encore de compte ? S'inscrire",
      auth_have_account: "DÃ©jÃ  inscrit ? Se connecter",

      // Common Toasts & Actions
      toast_copied: "Lien copiÃ© dans le presse-papiers !",
      toast_error: "Une erreur est survenue. Veuillez rÃ©essayer.",
      toast_auth_required: "Veuillez vous connecter pour effectuer cette action.",
      toast_lang_changed: "Langue mise Ã  jour : FranÃ§ais ðŸ‡«ðŸ‡·"
    },

    wo: {
      // Topbar & Global
      official_badge: "Magget bu wÃ©r",
      topbar_announcement: "ðŸŒ¿ Dalal jamm ci AgroBey : Jaay ak JÃ«nd ci mbayum SÃ©nÃ©gal ak yarum jur yi",
      transport_certified: "YÃ³bbale ak Dawalkat yu wÃ³or",
      support_label: "Ndimbal",
      tagline_sub: "Mbay â€¢ Yar â€¢ Suuf â€¢ Tool yu am ndox",
      pwa_banner_title: "Sampal AgroBey ci sa Telefon",
      pwa_banner_desc: "Dugg ci 1 klig, jot xibaar ci sÃ as si te du la laaj internet bu bare",
      pwa_install_btn: "Sampal",
      whatsapp_support: "LiggÃ©ey ci WhatsApp",
      official_mobile_app: "App Mobayl bu WÃ³or",

      // Navigation
      nav_marketplace: "Njulaay & Jaayukaay",
      nav_seller: "BÃ©rÃ©bu Baykat yi & YÃ©gle",
      nav_delivery: "BÃ©rÃ©bu Dawalkat yi",
      nav_support: "Nattukaay & Ndimbal",
      nav_orders: "Sama Komaand yi",
      nav_my_account: "Sama KÃ³nt",
      nav_login: "Dugg",
      nav_register: "Bindu",
      nav_logout: "GÃ©nn",
      nav_courier_short: "Dawalkat",
      nav_farmer_short: "Baykat",
      nav_catalogue_short: "Jaayukaay",
      nav_ai_short: "Ndimbalu IA",

      // Hero & Marketplace
      hero_badge: "100% Baykat bu wÃ³or â€¢ Amul way-dajalÃ© yuy jaayÃ© cher",
      hero_title_1: "Bay leen. Yar leen.",
      hero_title_2: "Tabax Ã«llÃ«g.",
      hero_desc: "Jaayukaay bu gÃ«n ci SÃ©nÃ©gal ngir njulaayu soble, ceeb, xar yii (Ladoum) ak suufi mbay yuy luwaas mbaa jaay ci rÃ©ew mi yÃ©pp.",
      search_placeholder: "WÃ«r soble Podor, xaru Ladoum, tool buy luwaas...",
      search_btn: "WÃ«r",
      mobile_filters_btn: "TÃ nn RÃ©ew ak Diiwaan",
      filter_all_regions: "Diiwaan yÃ©pp ci SÃ©nÃ©gal",
      filter_category_label: "XÃ©etu LiggÃ©ey",
      filter_region_label: "Diiwaanu SÃ©nÃ©gal",
      filter_type_label: "XÃ©etu Jaay",
      filter_type_buy: "JÃ«nd ci sÃ as si",
      filter_type_rent: "Luwaas / Aluwa",
      filter_reset: "Delloo ci xel",
      filter_apply: "Wone leen",

      // Categories
      cat_all: "ðŸŒ¾ MarsÃ© bi YÃ©pp",
      cat_recolte: "ðŸ¥¦ GÃ³ob & Maraasaas",
      cat_elevage: "ðŸ Yar & Jur yi",
      cat_terre: "ðŸŒ„ Suuf & Tool yi",
      cat_ferme: "ðŸ¡ Tool yu am Ndox",
      cat_materiel: "ðŸšœ Jumtukaayi Mbay",

      // Listing Card & Details
      certified_seller: "Baykat buÃ±u WÃ³oral",
      negotiable: "MÃ«n naÃ±u Waxaale",
      firm_price: "NjÃ©g bu Taxaw",
      available_stock: "Li fi nekk :",
      view_details_btn: "Xool & KomaandÃ©",
      buy_now_btn: "KomaandÃ© / Denc",
      contact_seller_btn: "Wootel Baykat bi",
      seller_contact: "KÃ³llÃ«rÃ© Baykat bi",
      location_label: "BÃ©rÃ©b bi",
      category_label: "XÃ©et bi",
      price_label: "NjÃ©gu benn",
      surface_label: "Yaatuwaay",
      delivery_mode_label: "Ni Ã±uy yÃ³bbale",
      delivery_included: "YÃ³bbale am na",
      delivery_excluded_land: "Njulaayu Suuf (Amul yÃ³bbale moto)",
      land_security_notice: "Kaye notÃ©er ak dÃ©libÃ©rasiyoÅ‹ mÃ©ri dafa am solo ci suuf ak tool.",
      simulation_moto_btn: "Natat yÃ³bbale ci Moto Tiak-Tiak",

      // Order & Modal
      order_title: "Mottal sa Komaand",
      order_quantity: "Lim bi nga bÃ«gg :",
      order_client_name: "Sa Tur ak Sa Sant :",
      order_client_phone: "Sa Nimero Telefon (Wave / Orange Money) :",
      order_destination: "Fii Ã±u la wara yÃ³bbil :",
      order_has_delivery: "YÃ³bbil ma ko ba sama kÃ«r",
      order_summary: "Kalkil xaalis bi",
      order_subtotal: "NjÃ©gu lii nga jÃ«nd :",
      order_delivery_fee: "NjÃ©gu yÃ³bbale :",
      order_total: "Li nga wara fey yÃ©pp :",
      order_confirm_btn: "GÃ«mmal Komaand bi & Fey",
      order_success: "Sa komaand duggal naÃ±u ko ci jam !",

      // Seller Dashboard
      seller_dashboard_title: "BÃ©rÃ©bu Baykat ak Samakat",
      seller_dashboard_sub: "Saytul sa gÃ³ob, yÃ©glel sa njulaay te topp say komaand ci sÃ as si.",
      seller_stats_sales: "Li nga Jaay YÃ©pp",
      seller_stats_active: "YÃ©gle yu Nekk ci Koor",
      seller_stats_pending: "Komaand yuy Xaar",
      seller_stats_rating: "Cosaanu Baykat",
      seller_tab_listings: "Sama Jaayukaay",
      seller_tab_publish: "YÃ©gle ab LiggÃ©ey",
      seller_tab_orders: "Komaand ak Suuf",
      seller_tab_notifs: "Xibaar yi",
      seller_btn_publish_cta: "âž• YÃ©glel Sa MarsÃ© LÃ©egi",
      seller_no_listings: "YÃ©gle gulo dara fi tay.",
      seller_delete_confirm: "Ndax danga bÃ«gg dindi yÃ©gle bi ?",
      seller_pending_approval: "Sa kÃ³nt mi ngi ci loxol njiiti AgroBey ngir wÃ³oral ko.",

      // Publish Listing Form
      pub_title: "YÃ©glel sa GÃ³ob, sa Jur mbaa sa Tool",
      pub_desc: "Bindal bu baax li ngay jaay ngir jÃ«ndkat yu bare giss ko ci rÃ©ew mi yÃ©pp.",
      pub_field_title: "Turu lii ngay Jaay :",
      pub_field_title_ph: "Misaal : 5 Tonu Soble Podor bu bees - GÃ³ob 2026",
      pub_field_cat: "XÃ©etu LiggÃ©ey :",
      pub_field_type: "Ni ngay JaayÃ© :",
      pub_type_sale: "Jaay ci sÃ as si",
      pub_type_rent: "Luwaas / Aluwa",
      pub_field_price: "NjÃ©g bi (FCFA) :",
      pub_field_unit: "Misaalu natt :",
      pub_field_quantity: "Lim bi fi nekk :",
      pub_field_region: "Diiwaan bi mu nekk :",
      pub_field_size: "Ni Ã±u koy yÃ³bboo :",
      pub_size_small: "ðŸ“¦ Lu Tuuti (MÃ«n na dem ci Moto / Tiak-Tiak)",
      pub_size_large: "ðŸšš Lu RÃ«y / Bare (Wara dem ci Woto mbaa Kamyon)",
      pub_field_vehicles: "Woto yi baykat bi nangu :",
      pub_field_images: "Nataalu lii ngay jaay (ba 4 nataal) :",
      pub_field_desc: "Faramfasal li ngay jaay :",
      pub_field_desc_ph: "Waxal baxu gÃ³ob bi, ni Ã±u ko dencÃ© ak yoon yu fay dem...",
      pub_submit_btn: "YÃ©glel ko ci MarsÃ© bi",
      pub_success_toast: "Sa yÃ©gle dug na ci jam !",

      // Delivery Module
      delivery_title: "BÃ©rÃ©bu Dawalkat yi & YÃ³bbale",
      delivery_sub: "Gissal liggÃ©eyi yÃ³bbale yi fi nekk, natt sa yoon te topp say woto.",
      delivery_sim_title: "Nattukaay Moto Tiak-Tiak (350 - 500 FCFA / km)",
      delivery_origin: "FuÃ± koy jÃ«lÃ© (Baykat) :",
      delivery_dest: "FuÃ± koy yÃ³bbu (JÃ«ndkat) :",
      delivery_calc_btn: "Natt Yoon bi & NjÃ©g bi",
      delivery_est_distance: "Guddaayu yoon bi :",
      delivery_est_tariff: "NjÃ©gu yÃ³bbale bi :",
      delivery_available_missions: "LiggÃ©eyi yÃ³bbale yu fi nekk ci SÃ©nÃ©gal",
      delivery_accept_mission: "Nangu LiggÃ©ey bi",
      delivery_status_pending: "Mi ngi xaar dawalkat",
      delivery_status_transit: "Mi ngi ci yoon bi",
      delivery_status_delivered: "YÃ³bbu naÃ±u ko ci jam",

      // Support & AI Assistant
      support_title: "Ndimbalu IA & Nattukaay NjÃ©gu MarsÃ©",
      support_sub: "Xam-xamu mbay mu xaraÃ±, asamaan ak njÃ©gu marsÃ© ci SÃ©nÃ©gal.",
      ai_chat_title: "KansÃ©yÃ© Mbay bu XaraÃ± (IA)",
      ai_chat_placeholder: "Laajal sa laaj (misaal: pajum timaat, njÃ©gu dugub Kaolack...)",
      ai_chat_send: "YÃ³nnee",
      barometer_title: "NjÃ©gu MarsÃ© bu WÃ©r (SIM SÃ©nÃ©gal)",
      barometer_last_update: "Yeesal naÃ±u ko tay ci 08h00 GMT",

      // Auth Modals
      auth_login_title: "Dugg ci sa KÃ³nt AgroBey",
      auth_register_title: "Sos KÃ³nt bu Bees ci AgroBey",
      auth_email_or_phone: "Sa Telefon mbaa sa E-mail :",
      auth_password: "Sa KaasÃ© bi la wÃ³or :",
      auth_name: "Sa Tur ak Sa Sant :",
      auth_role_label: "Ban liggÃ©ey nga fi bÃ«gg def :",
      auth_role_buyer: "ðŸ›’ JÃ«ndkat / KÃ«rye",
      auth_role_seller: "ðŸŒ¾ Baykat / Samakat",
      auth_role_courier: "ðŸ›µ Dawalkat / YÃ³bbalekat",
      auth_submit_login: "Dugg ci KÃ³nt bi",
      auth_submit_register: "Sos Sama KÃ³nt",
      auth_no_account: "Amagulo kÃ³nt ? Bindu fi",
      auth_have_account: "Am nga kÃ³nt ba noppi ? Dugg",

      // Common Toasts & Actions
      toast_copied: "DuplicatÃ© naÃ±u liyen bi !",
      toast_error: "Am na njuumte. JÃ©emalaat.",
      toast_auth_required: "Dafa laaj nga dugg ci sa kÃ³nt bala ngay def lii.",
      toast_lang_changed: "LÃ kk bi soppi naÃ±u ko : Wolof ðŸ‡¸ðŸ‡³"
    },

    en: {
      // Topbar & Global
      official_badge: "Official",
      topbar_announcement: "ðŸŒ¿ National & Regional Rural & Agro-Pastoral Platform",
      transport_certified: "Certified Transport & Logistics",
      support_label: "Support",
      tagline_sub: "Agriculture â€¢ Livestock â€¢ Farmland â€¢ Equipped Farms",
      pwa_banner_title: "Install the AgroBey Mobile App",
      pwa_banner_desc: "1-click instant access, real-time alerts & offline capabilities",
      pwa_install_btn: "Install",
      whatsapp_support: "WhatsApp Support",
      official_mobile_app: "Official Mobile Application",

      // Navigation
      nav_marketplace: "Marketplace & Offers",
      nav_seller: "Farmer Space & Listings",
      nav_delivery: "Couriers & Delivery",
      nav_support: "Price Index & Support",
      nav_orders: "My Orders & Leases",
      nav_my_account: "My Account",
      nav_login: "Sign In",
      nav_register: "Register",
      nav_logout: "Log Out",
      nav_courier_short: "Courier",
      nav_farmer_short: "Farmer",
      nav_catalogue_short: "Catalogue",
      nav_ai_short: "AI Assistant",

      // Hero & Marketplace
      hero_badge: "100% Direct from Farmers â€¢ No Middlemen Margins",
      hero_title_1: "Cultivate. Breed.",
      hero_title_2: "Build Tomorrow.",
      hero_desc: "The leading digital marketplace for vegetable harvests, elite livestock (Ladoum, Guzera), and agricultural farmland sales or leases across Senegal and West Africa.",
      search_placeholder: "Search Podor onions, Ladoum rams, farmland for lease...",
      search_btn: "Filter",
      mobile_filters_btn: "Filters & Senegal Regions",
      filter_all_regions: "All Senegal Regions",
      filter_category_label: "Sector / Category",
      filter_region_label: "Senegal Region",
      filter_type_label: "Offer Type",
      filter_type_buy: "Direct Purchase",
      filter_type_rent: "Lease / Rental",
      filter_reset: "Reset",
      filter_apply: "Apply",

      // Categories
      cat_all: "ðŸŒ¾ All Offers",
      cat_recolte: "ðŸ¥¦ Harvests & Vegetables",
      cat_elevage: "ðŸ Livestock & Cattle",
      cat_terre: "ðŸŒ„ Land & Fields",
      cat_ferme: "ðŸ¡ Equipped Farms",
      cat_materiel: "ðŸšœ Farm Equipment",

      // Listing Card & Details
      certified_seller: "Certified Producer",
      negotiable: "Negotiable Price",
      firm_price: "Fixed Price",
      available_stock: "Available stock:",
      view_details_btn: "View Details & Order",
      buy_now_btn: "Order / Book",
      contact_seller_btn: "Contact Farmer",
      seller_contact: "Seller Contact Details",
      location_label: "Location",
      category_label: "Category",
      price_label: "Unit Price",
      surface_label: "Area / Size",
      delivery_mode_label: "Delivery Method",
      delivery_included: "Delivery Available",
      delivery_excluded_land: "Land Transaction (No physical shipping)",
      land_security_notice: "Notarial protocol and communal resolution are mandatory for any farmland transaction.",
      simulation_moto_btn: "Simulate Motorcycle Courier Fare",

      // Order & Modal
      order_title: "Complete Your Order",
      order_quantity: "Requested Quantity:",
      order_client_name: "Customer Full Name:",
      order_client_phone: "Phone Number (Orange Money / Wave):",
      order_destination: "Delivery Location / Municipality:",
      order_has_delivery: "Include Home / Farm Delivery",
      order_summary: "Financial Summary",
      order_subtotal: "Item subtotal:",
      order_delivery_fee: "Delivery fee:",
      order_total: "Net Total to Pay:",
      order_confirm_btn: "Confirm Order & Pay",
      order_success: "Your order has been registered successfully!",

      // Seller Dashboard
      seller_dashboard_title: "Farmer & Producer Portal",
      seller_dashboard_sub: "Manage your crops, publish new listings, and track your incoming orders in real time.",
      seller_stats_sales: "Total Sales",
      seller_stats_active: "Active Listings",
      seller_stats_pending: "Pending Orders",
      seller_stats_rating: "Farmer Rating",
      seller_tab_listings: "My Offers & Harvests",
      seller_tab_publish: "Post a Listing",
      seller_tab_orders: "Orders & Rural Leases",
      seller_tab_notifs: "Alerts & Messages",
      seller_btn_publish_cta: "âž• Post a New Listing",
      seller_no_listings: "You haven't posted any listings yet.",
      seller_delete_confirm: "Are you sure you want to remove this listing?",
      seller_pending_approval: "Account awaiting identity certification by AgroBey administration.",

      // Publish Listing Form
      pub_title: "Post an Agricultural or Livestock Listing",
      pub_desc: "Specify exact specifications for your produce or land to reach thousands of buyers across Senegal.",
      pub_field_title: "Offer Title:",
      pub_field_title_ph: "E.g.: 5 Tons of Fresh Podor Onions - 2026 Harvest",
      pub_field_cat: "Sector / Category:",
      pub_field_type: "Transaction Type:",
      pub_type_sale: "Direct Sale",
      pub_type_rent: "Lease / Rural Rental",
      pub_field_price: "Unit Price (FCFA):",
      pub_field_unit: "Selling Unit:",
      pub_field_quantity: "Available Stock / Quantity:",
      pub_field_region: "Region / Location:",
      pub_field_size: "Logistics & Transport Size:",
      pub_size_small: "ðŸ“¦ Small Package (Transportable via Motorcycle / Tiak-Tiak)",
      pub_size_large: "ðŸšš Large Volume / Bulky (Requires Dedicated Vehicle)",
      pub_field_vehicles: "Vehicles permitted by seller:",
      pub_field_images: "Product Photos (up to 4 real photos):",
      pub_field_desc: "Detailed Description & Terms:",
      pub_field_desc_ph: "Describe quality, packaging, preservation, road access...",
      pub_submit_btn: "Publish Listing Directly",
      pub_success_toast: "Your listing has been successfully published!",

      // Delivery Module
      delivery_title: "Transport & Courier Missions Portal",
      delivery_sub: "Browse available dispatch missions, compute routes, and track live trips.",
      delivery_sim_title: "Motorcycle Tiak-Tiak Fare Estimator (350 - 500 FCFA / km)",
      delivery_origin: "Pickup Location (Farmer):",
      delivery_dest: "Delivery Destination (Client):",
      delivery_calc_btn: "Calculate Route & Fare",
      delivery_est_distance: "Estimated Distance:",
      delivery_est_tariff: "Estimated Fare:",
      delivery_available_missions: "Available Delivery Missions in Senegal",
      delivery_accept_mission: "Accept Courier Mission",
      delivery_status_pending: "Awaiting courier pickup",
      delivery_status_transit: "In transit",
      delivery_status_delivered: "Successfully delivered",

      // Support & AI Assistant
      support_title: "AI Agronomy Assistant & Market Price Barometer",
      support_sub: "Intelligent agricultural advice, weather trends, and official agricultural market rates in Senegal.",
      ai_chat_title: "Intelligent Agro-Pastoral Advisor",
      ai_chat_placeholder: "Ask your question (e.g. Tomato blight prevention, average millet price in Kaolack...)",
      ai_chat_send: "Send",
      barometer_title: "Official Agricultural Price Index (Senegal SIM)",
      barometer_last_update: "Updated today at 08:00 AM GMT",

      // Auth Modals
      auth_login_title: "Sign in to AgroBey",
      auth_register_title: "Create an AgroBey Account",
      auth_email_or_phone: "Phone Number or Email Address:",
      auth_password: "Secure Password:",
      auth_name: "Full Name:",
      auth_role_label: "Your Primary Role:",
      auth_role_buyer: "ðŸ›’ Buyer / Merchant",
      auth_role_seller: "ðŸŒ¾ Farmer / Livestock Breeder",
      auth_role_courier: "ðŸ›µ Courier / Transporter",
      auth_submit_login: "Sign In",
      auth_submit_register: "Create Account",
      auth_no_account: "Don't have an account? Sign up",
      auth_have_account: "Already registered? Sign in",

      // Common Toasts & Actions
      toast_copied: "Link copied to clipboard!",
      toast_error: "An error occurred. Please try again.",
      toast_auth_required: "Please log in to perform this action.",
      toast_lang_changed: "Language updated: English ðŸ‡¬ðŸ‡§"
    }
  },

  /**
   * Initialisation du moteur i18n
   */
  init: function() {
    try {
      const savedLang = localStorage.getItem('agrobey_lang');
      if (savedLang && this.translations[savedLang]) {
        this.currentLang = savedLang;
      } else {
        const browserLang = (navigator.language || 'fr').toLowerCase();
        if (browserLang.startsWith('en')) {
          this.currentLang = 'en';
        } else {
          this.currentLang = 'fr';
        }
      }
    } catch (e) {
      this.currentLang = 'fr';
    }

    this.applyLanguageToDOM();
    this.renderLanguageSwitchers();
  },

  /**
   * Changement de langue
   * @param {string} langCode - 'fr' | 'wo' | 'en'
   */
  setLanguage: function(langCode) {
    if (!this.translations[langCode]) return;
    this.currentLang = langCode;
    try {
      localStorage.setItem('agrobey_lang', langCode);
    } catch (e) {
      console.warn('LocalStorage unavailable for i18n', e);
    }

    document.documentElement.lang = langCode;
    this.applyLanguageToDOM();
    this.renderLanguageSwitchers();

    // RafraÃ®chir les composants actifs de l'application
    if (window.AgroBeyApp) {
      if (typeof window.AgroBeyApp.renderCurrentView === 'function') {
        window.AgroBeyApp.renderCurrentView();
      } else {
        if (window.AgroBeyApp.marketplace && typeof window.AgroBeyApp.marketplace.render === 'function') {
          window.AgroBeyApp.marketplace.render();
        }
        if (window.AgroBeyApp.seller && typeof window.AgroBeyApp.seller.render === 'function') {
          window.AgroBeyApp.seller.render();
        }
        if (window.AgroBeyApp.delivery && typeof window.AgroBeyApp.delivery.render === 'function') {
          window.AgroBeyApp.delivery.render();
        }
        if (window.AgroBeyApp.support && typeof window.AgroBeyApp.support.render === 'function') {
          window.AgroBeyApp.support.render();
        }
      }

      if (typeof window.AgroBeyApp.showToast === 'function') {
        const toastMsg = this.t('toast_lang_changed');
        window.AgroBeyApp.showToast(toastMsg, 'success');
      }
    }
  },

  /**
   * Traduire une clÃ© avec interpolation
   * @param {string} key 
   * @param {object|string} [params]
   * @returns {string}
   */
  t: function(key, params) {
    const langDict = this.translations[this.currentLang] || this.translations['fr'];
    let str = langDict[key] || (this.translations['fr'] && this.translations['fr'][key]) || key;

    if (params && typeof params === 'object') {
      Object.keys(params).forEach(function(paramKey) {
        str = str.replace(new RegExp('\{' + paramKey + '\}', 'g'), params[paramKey]);
      });
    }
    return str;
  },

  /**
   * Appliquer les traductions Ã  tous les Ã©lÃ©ments marquÃ©s dans le DOM
   */
  applyLanguageToDOM: function() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = this.t(key);
      }
    });

    const titles = document.querySelectorAll('[data-i18n-title]');
    titles.forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = this.t(key);
      }
    });
  },

  /**
   * Rendu des sÃ©lecteurs de langue interactifs dans les conteneurs dÃ©diÃ©s
   */
  renderLanguageSwitchers: function() {
    const containers = document.querySelectorAll('.lang-switcher-container');
    if (!containers || containers.length === 0) return;

    containers.forEach((container) => {
      const isCompact = container.classList.contains('lang-switcher-compact');
      const isDrawer = container.classList.contains('lang-switcher-drawer');

      if (isDrawer) {
        container.innerHTML = `
          <div class="flex items-center justify-between gap-2 p-2 bg-slate-950 rounded-2xl border border-slate-800">
            <span class="text-[11px] font-bold text-slate-400 pl-2">Langue / LÃ kk / Lang :</span>
            <div class="flex items-center gap-1">
              ${this.availableLanguages.map(l => `
                <button type="button" onclick="window.AgroBeyI18n.setLanguage('${l.code}')" class="px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${this.currentLang === l.code ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'}">
                  <span>${l.flag}</span>
                  <span class="text-[10px]">${l.shortLabel}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;
      } else if (isCompact) {
        container.innerHTML = `
          <div class="inline-flex items-center bg-white/20 backdrop-blur-md rounded-xl p-0.5 border border-white/30 text-[11px] font-bold">
            ${this.availableLanguages.map(l => `
              <button type="button" onclick="window.AgroBeyI18n.setLanguage('${l.code}')" class="px-2 py-0.5 rounded-lg transition flex items-center gap-1 ${this.currentLang === l.code ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-emerald-100 hover:text-white hover:bg-white/10'}" title="${l.label}">
                <span>${l.flag}</span>
                <span class="text-[10px] font-extrabold">${l.shortLabel}</span>
              </button>
            `).join('')}
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="inline-flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 text-xs font-bold shadow-xs">
            ${this.availableLanguages.map(l => `
              <button type="button" onclick="window.AgroBeyI18n.setLanguage('${l.code}')" class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${this.currentLang === l.code ? 'bg-emerald-700 text-white shadow-sm font-black' : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-200'}" title="${l.label}">
                <span>${l.flag}</span>
                <span class="text-[11px] font-extrabold">${l.shortLabel}</span>
              </button>
            `).join('')}
          </div>
        `;
      }
    });
  }
};

// Exposition globale & raccourci de traduction
if (typeof window !== 'undefined') {
  window.AgroBeyI18n = AgroBeyI18n;
  window.t = AgroBeyI18n.t.bind(AgroBeyI18n);
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgroBeyI18n;
}