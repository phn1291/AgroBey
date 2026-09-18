/**
 * AgroBey - Moteur Multilingue & Internationalisation (i18n)
 * Support 100% propre du Francais (FR), du Wolof (WO) et de l'Anglais (EN).
 * S??quences Unicode s??curis??es pour garantir un affichage parfait sur tous les navigateurs.
 */

const AgroBeyI18n = {
  currentLang: 'fr',
  availableLanguages: [
    { code: 'fr', label: 'Fran\u00E7ais', flag: '\uD83C\uDDEB\uD83C\uDDF7', shortLabel: 'FR', badge: 'FR' },
    { code: 'wo', label: 'Wolof', flag: '\uD83C\uDDF8\uD83C\uDDF3', shortLabel: 'WO', badge: 'WO' },
    { code: 'en', label: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7', shortLabel: 'EN', badge: 'EN' }
  ],

  translations: {
    fr: {
      // Topbar & Global
      official_badge: "Officiel",
      topbar_announcement: "\uD83C\uDF3F Plateforme Nationale & R\u00E9gionale du Monde Rural et Agro-Pastoral",
      transport_certified: "Transport & Logistique certifi\u00E9s",
      support_label: "Support",
      tagline_sub: "Agriculture \u2022 \u00C9levage \u2022 Terres \u2022 Fermes",
      pwa_banner_title: "Installer l'Application Mobile AgroBey",
      pwa_banner_desc: "Acc\u00E8s direct en 1 clic, alertes instantan\u00E9es & mode hors-ligne",
      pwa_install_btn: "Installer",
      whatsapp_support: "Support WhatsApp",
      official_mobile_app: "Application Mobile Officielle",

      // Navigation
      nav_marketplace: "Catalogue & Offres",
      nav_seller: "Espace Agriculteur & Annonces",
      nav_delivery: "Espace Livreur",
      nav_support: "Barom\u00E8tre & Support",
      nav_orders: "Mes Commandes & Baux",
      nav_my_account: "Mon Compte",
      nav_login: "Connexion",
      nav_register: "S'inscrire",
      nav_logout: "Se d\u00E9connecter",
      nav_courier_short: "Livreur",
      nav_farmer_short: "Agriculteur",
      nav_catalogue_short: "Catalogue",
      nav_ai_short: "Assistant IA",

      // Hero & Marketplace
      hero_badge: "100% Direct Producteur \u2022 Sans Interm\u00E9diaires Abusifs",
      hero_title_1: "Cultivons. \u00C9levons.",
      hero_title_2: "Construisons demain.",
      hero_desc: "La marketplace digitale de r\u00E9f\u00E9rence d\u00E9di\u00E9e aux r\u00E9coltes mara\u00EEch\u00E8res, \u00E0 l'\u00E9levage d'\u00E9lite (Ladoum, Guz\u00E9ra) et \u00E0 la location ou l'achat de terres et fermes agricoles au S\u00E9n\u00E9gal et en Afrique de l'Ouest.",
      search_placeholder: "Rechercher oignons de Podor, b\u00E9liers Ladoum, champs \u00E0 louer...",
      search_btn: "Filtrer",
      mobile_filters_btn: "Filtres & R\u00E9gions du S\u00E9n\u00E9gal",
      filter_all_regions: "Toutes les r\u00E9gions",
      filter_category_label: "Fili\u00E8re / Cat\u00E9gorie",
      filter_region_label: "R\u00E9gion du S\u00E9n\u00E9gal",
      filter_type_label: "Type d'Offre",
      filter_type_buy: "Achat Direct",
      filter_type_rent: "Bail / Location",
      filter_reset: "R\u00E9initialiser",
      filter_apply: "Appliquer",

      // Categories
      cat_all: "\uD83C\uDF3E Toutes les Offres",
      cat_recolte: "\uD83E\uDD66 R\u00E9coltes & Mara\u00EEchage",
      cat_elevage: "\uD83D\uDC0F \u00C9levage & Cheptel",
      cat_terre: "\uD83C\uDFDE\uFE0F Terres & Champs",
      cat_ferme: "\uD83C\uDFE1 Fermes \u00C9quip\u00E9es",
      cat_materiel: "\uD83D\uDE9C Mat\u00E9riel Agricole",

      // Listing Card & Details
      certified_seller: "Producteur Certifi\u00E9",
      negotiable: "Prix N\u00E9gociable",
      firm_price: "Prix Ferme",
      available_stock: "Stock disponible :",
      view_details_btn: "Voir l'offre & Commander",
      buy_now_btn: "Commander / R\u00E9server",
      contact_seller_btn: "Contacter le Vendeur",
      seller_contact: "Coordonn\u00E9es du Vendeur",
      location_label: "Localisation",
      category_label: "Cat\u00E9gorie",
      price_label: "Prix unitaire",
      surface_label: "Superficie",
      delivery_mode_label: "Mode d'Acheminement",
      delivery_included: "Livraison disponible",
      delivery_excluded_land: "Transaction Fonci\u00E8re (Sans livraison physique)",
      land_security_notice: "Protocole Notari\u00E9 & D\u00E9lib\u00E9ration Communale obligatoires pour toute transaction fonci\u00E8re.",
      simulation_moto_btn: "Simuler Course Moto Tiak-Tiak",

      // Order & Modal
      order_title: "Finaliser votre Commande",
      order_quantity: "Quantit\u00E9 souhait\u00E9e :",
      order_client_name: "Nom complet du Client :",
      order_client_phone: "Num\u00E9ro de T\u00E9l\u00E9phone (Orange Money / Wave) :",
      order_destination: "Lieu pr\u00E9cis de Livraison / Commune :",
      order_has_delivery: "Inclure la Livraison \u00E0 Domicile / D\u00E9p\u00F4t",
      order_summary: "R\u00E9capitulatif Financier",
      order_subtotal: "Sous-total articles :",
      order_delivery_fee: "Frais de livraison :",
      order_total: "Total Net \u00E0 Payer :",
      order_confirm_btn: "Confirmer la Commande & Payer",
      order_success: "Votre commande a \u00E9t\u00E9 enregistr\u00E9e avec succ\u00E8s !",

      // Seller Dashboard
      seller_dashboard_title: "Espace Producteur & Agriculteur",
      seller_dashboard_sub: "G\u00E9rez vos r\u00E9coltes, publiez de nouvelles annonces et suivez vos commandes en direct.",
      seller_stats_sales: "Ventes Totales",
      seller_stats_active: "Offres en Ligne",
      seller_stats_pending: "Commandes en Cours",
      seller_stats_rating: "Note Producteur",
      seller_tab_listings: "Mes Offres & R\u00E9coltes",
      seller_tab_publish: "D\u00E9poser une Annonce",
      seller_tab_orders: "Commandes & Baux Ruraux",
      seller_tab_notifs: "Alertes & Messages",
      seller_btn_publish_cta: "\u2795 D\u00E9poser une Nouvelle Annonce",
      seller_no_listings: "Vous n'avez pas encore publi\u00E9 d'offres.",
      seller_delete_confirm: "\u00CAtes-vous s\u00FBr de vouloir retirer cette offre ?",
      seller_pending_approval: "Compte en attente de v\u00E9rification d'identit\u00E9 par l'administration AgroBey.",

      // Publish Listing Form
      pub_title: "D\u00E9poser une Annonce Agricole ou Pastorale",
      pub_desc: "Renseignez les caract\u00E9ristiques pr\u00E9cises de vos produits ou terres pour toucher des milliers d'acheteurs au S\u00E9n\u00E9gal.",
      pub_field_title: "Titre de l'Offre :",
      pub_field_title_ph: "Ex : 5 Tonnes d'Oignons Frais de Podor - R\u00E9colte 2026",
      pub_field_cat: "Fili\u00E8re / Cat\u00E9gorie :",
      pub_field_type: "Type de Transaction :",
      pub_type_sale: "Vente Directe",
      pub_type_rent: "Location / Bail Rural",
      pub_field_price: "Prix Unitaire (FCFA) :",
      pub_field_unit: "Unit\u00E9 de Vente :",
      pub_field_quantity: "Quantit\u00E9 / Stock Disponible :",
      pub_field_region: "R\u00E9gion / Localisation :",
      pub_field_size: "Gabarit Logistique & Transport :",
      pub_size_small: "\uD83D\uDCE6 Petit Article (Transportable \u00E0 Moto / Tiak-Tiak)",
      pub_size_large: "\uD83D\uDE9A Gros Article / Volume (Transport en V\u00E9hicule D\u00E9di\u00E9)",
      pub_field_vehicles: "V\u00E9hicules autoris\u00E9s par le vendeur :",
      pub_field_images: "Photos de l'Article (jusqu'\u00E0 4 photos r\u00E9elles) :",
      pub_field_desc: "Description D\u00E9taill\u00E9e & Conditions :",
      pub_field_desc_ph: "D\u00E9crivez la qualit\u00E9, le conditionnement, le mode de conservation, les acc\u00E8s routiers...",
      pub_submit_btn: "Publier l'Annonce Directement",
      pub_success_toast: "Votre annonce a \u00E9t\u00E9 publi\u00E9e avec succ\u00E8s !",

      // Delivery Module
      delivery_title: "Espace Transport & Missions Logistiques",
      delivery_sub: "Consultez les missions de livraison disponibles, calculez vos trajets et suivez vos courses en temps r\u00E9el.",
      delivery_sim_title: "Simulateur Tarifaire Moto Tiak-Tiak (350 - 500 FCFA / km)",
      delivery_origin: "Lieu de Retrait (Producteur) :",
      delivery_dest: "Lieu de Livraison (Client) :",
      delivery_calc_btn: "Calculer Itin\u00E9raire & Tarif",
      delivery_est_distance: "Distance estim\u00E9e :",
      delivery_est_tariff: "Tarif estim\u00E9 :",
      delivery_available_missions: "Missions Disponibles au S\u00E9n\u00E9gal",
      delivery_accept_mission: "Accepter la Mission de Transport",
      delivery_status_pending: "En attente de transporteur",
      delivery_status_transit: "En cours d'acheminement",
      delivery_status_delivered: "Livr\u00E9 avec succ\u00E8s",

      // Support & AI Assistant
      support_title: "Assistant IA & Barom\u00E8tre des Prix du March\u00E9",
      support_sub: "Conseils agronomiques intelligents, tendances m\u00E9t\u00E9o et cours officiels des denr\u00E9es au S\u00E9n\u00E9gal.",
      ai_chat_title: "Conseiller Agro-Pastoral Intelligent",
      ai_chat_placeholder: "Posez votre question (ex: Pr\u00E9vention des maladies de la tomate, cours du mil \u00E0 Kaolack...)",
      ai_chat_send: "Envoyer",
      barometer_title: "Barom\u00E8tre Officiel des Prix Agricoles (SIM/S\u00E9n\u00E9gal)",
      barometer_last_update: "Mis \u00E0 jour aujourd'hui \u00E0 08h00 GMT",

      // Auth Modals
      auth_login_title: "Connexion \u00E0 votre Espace AgroBey",
      auth_register_title: "Cr\u00E9er un Compte AgroBey",
      auth_email_or_phone: "T\u00E9l\u00E9phone ou Adresse E-mail :",
      auth_password: "Mot de passe s\u00E9curis\u00E9 :",
      auth_name: "Nom complet & Pr\u00E9nom :",
      auth_role_label: "Votre R\u00F4le Principal :",
      auth_role_buyer: "\uD83D\uDED2 Acheteur / Commer\u00E7ant",
      auth_role_seller: "\uD83C\uDF3E Agriculteur / \u00C9leveur",
      auth_role_courier: "\uD83D\uDEF5 Livreur / Transporteur",
      auth_submit_login: "Se Connecter",
      auth_submit_register: "Cr\u00E9er mon Compte",
      auth_no_account: "Pas encore de compte ? S'inscrire",
      auth_have_account: "D\u00E9j\u00E0 inscrit ? Se connecter",

      // Common Toasts & Actions
      toast_copied: "Lien copi\u00E9 dans le presse-papiers !",
      toast_error: "Une erreur est survenue. Veuillez r\u00E9essayer.",
      toast_auth_required: "Veuillez vous connecter pour effectuer cette action.",
      toast_lang_changed: "Langue mise \u00E0 jour : Fran\u00E7ais \uD83C\uDDEB\uD83C\uDDF7"
    },

    wo: {
      // Topbar & Global
      official_badge: "Magget bu w\u00E9r",
      topbar_announcement: "\uD83C\uDF3F Dalal jamm ci AgroBey : Jaay ak J\u00EBnd ci mbayum S\u00E9n\u00E9gal ak yarum jur yi",
      transport_certified: "Y\u00F3bbale ak Dawalkat yu w\u00F3or",
      support_label: "Ndimbal",
      tagline_sub: "Mbay \u2022 Yar \u2022 Suuf \u2022 Tool yu am ndox",
      pwa_banner_title: "Sampal AgroBey ci sa Telefon",
      pwa_banner_desc: "Dugg ci 1 klig, jot xibaar ci s\u00E0as si te du la laaj internet bu bare",
      pwa_install_btn: "Sampal",
      whatsapp_support: "Ligg\u00E9ey ci WhatsApp",
      official_mobile_app: "App Mobayl bu W\u00F3or",

      // Navigation
      nav_marketplace: "Njulaay & Jaayukaay",
      nav_seller: "B\u00E9r\u00E9bu Baykat yi & Y\u00E9gle",
      nav_delivery: "B\u00E9r\u00E9bu Dawalkat yi",
      nav_support: "Nattukaay & Ndimbal",
      nav_orders: "Sama Komaand yi",
      nav_my_account: "Sama K\u00F3nt",
      nav_login: "Dugg",
      nav_register: "Bindu",
      nav_logout: "G\u00E9nn",
      nav_courier_short: "Dawalkat",
      nav_farmer_short: "Baykat",
      nav_catalogue_short: "Jaayukaay",
      nav_ai_short: "Ndimbalu IA",

      // Hero & Marketplace
      hero_badge: "100% Baykat bu w\u00F3or \u2022 Amul way-dajal\u00E9 yuy jaay\u00E9 cher",
      hero_title_1: "Bay leen. Yar leen.",
      hero_title_2: "Tabax \u00EBll\u00EBg.",
      hero_desc: "Jaayukaay bu g\u00EBn ci S\u00E9n\u00E9gal ngir njulaayu soble, ceeb, xar yii (Ladoum) ak suufi mbay yuy luwaas mbaa jaay ci r\u00E9ew mi y\u00E9pp.",
      search_placeholder: "W\u00EBr soble Podor, xaru Ladoum, tool buy luwaas...",
      search_btn: "W\u00EBr",
      mobile_filters_btn: "T\u00E0nn R\u00E9ew ak Diiwaan",
      filter_all_regions: "Diiwaan y\u00E9pp ci S\u00E9n\u00E9gal",
      filter_category_label: "X\u00E9etu Ligg\u00E9ey",
      filter_region_label: "Diiwaanu S\u00E9n\u00E9gal",
      filter_type_label: "X\u00E9etu Jaay",
      filter_type_buy: "J\u00EBnd ci s\u00E0as si",
      filter_type_rent: "Luwaas / Aluwa",
      filter_reset: "Delloo ci xel",
      filter_apply: "Wone leen",

      // Categories
      cat_all: "\uD83C\uDF3E Mars\u00E9 bi Y\u00E9pp",
      cat_recolte: "\uD83E\uDD66 G\u00F3ob & Maraasaas",
      cat_elevage: "\uD83D\uDC0F Yar & Jur yi",
      cat_terre: "\uD83C\uDFDE\uFE0F Suuf & Tool yi",
      cat_ferme: "\uD83C\uDFE1 Tool yu am Ndox",
      cat_materiel: "\uD83D\uDE9C Jumtukaayi Mbay",

      // Listing Card & Details
      certified_seller: "Baykat bu\u00F1u W\u00F3oral",
      negotiable: "M\u00EBn na\u00F1u Waxaale",
      firm_price: "Nj\u00E9g bu Taxaw",
      available_stock: "Li fi nekk :",
      view_details_btn: "Xool & Komaand\u00E9",
      buy_now_btn: "Komaand\u00E9 / Denc",
      contact_seller_btn: "Wootel Baykat bi",
      seller_contact: "K\u00F3ll\u00EBr\u00E9 Baykat bi",
      location_label: "B\u00E9r\u00E9b bi",
      category_label: "X\u00E9et bi",
      price_label: "Nj\u00E9gu benn",
      surface_label: "Yaatuwaay",
      delivery_mode_label: "Ni \u00F1uy y\u00F3bbale",
      delivery_included: "Y\u00F3bbale am na",
      delivery_excluded_land: "Njulaayu Suuf (Amul y\u00F3bbale moto)",
      land_security_notice: "Kaye not\u00E9er ak d\u00E9lib\u00E9rasiyo\u014B m\u00E9ri dafa am solo ci suuf ak tool.",
      simulation_moto_btn: "Natat y\u00F3bbale ci Moto Tiak-Tiak",

      // Order & Modal
      order_title: "Mottal sa Komaand",
      order_quantity: "Lim bi nga b\u00EBgg :",
      order_client_name: "Sa Tur ak Sa Sant :",
      order_client_phone: "Sa Nimero Telefon (Wave / Orange Money) :",
      order_destination: "Fii \u00F1u la wara y\u00F3bbil :",
      order_has_delivery: "Y\u00F3bbil ma ko ba sama k\u00EBr",
      order_summary: "Kalkil xaalis bi",
      order_subtotal: "Nj\u00E9gu lii nga j\u00EBnd :",
      order_delivery_fee: "Nj\u00E9gu y\u00F3bbale :",
      order_total: "Li nga wara fey y\u00E9pp :",
      order_confirm_btn: "G\u00EBmmal Komaand bi & Fey",
      order_success: "Sa komaand duggal na\u00F1u ko ci jam !",

      // Seller Dashboard
      seller_dashboard_title: "B\u00E9r\u00E9bu Baykat ak Samakat",
      seller_dashboard_sub: "Saytul sa g\u00F3ob, y\u00E9glel sa njulaay te topp say komaand ci s\u00E0as si.",
      seller_stats_sales: "Li nga Jaay Y\u00E9pp",
      seller_stats_active: "Y\u00E9gle yu Nekk ci Koor",
      seller_stats_pending: "Komaand yuy Xaar",
      seller_stats_rating: "Cosaanu Baykat",
      seller_tab_listings: "Sama Jaayukaay",
      seller_tab_publish: "Y\u00E9gle ab Ligg\u00E9ey",
      seller_tab_orders: "Komaand ak Suuf",
      seller_tab_notifs: "Xibaar yi",
      seller_btn_publish_cta: "\u2795 Y\u00E9glel Sa Mars\u00E9 L\u00E9egi",
      seller_no_listings: "Y\u00E9gle gulo dara fi tay.",
      seller_delete_confirm: "Ndax danga b\u00EBgg dindi y\u00E9gle bi ?",
      seller_pending_approval: "Sa k\u00F3nt mi ngi ci loxol njiiti AgroBey ngir w\u00F3oral ko.",

      // Publish Listing Form
      pub_title: "Y\u00E9glel sa G\u00F3ob, sa Jur mbaa sa Tool",
      pub_desc: "Bindal bu baax li ngay jaay ngir j\u00EBndkat yu bare giss ko ci r\u00E9ew mi y\u00E9pp.",
      pub_field_title: "Turu lii ngay Jaay :",
      pub_field_title_ph: "Misaal : 5 Tonu Soble Podor bu bees - G\u00F3ob 2026",
      pub_field_cat: "X\u00E9etu Ligg\u00E9ey :",
      pub_field_type: "Ni ngay Jaay\u00E9 :",
      pub_type_sale: "Jaay ci s\u00E0as si",
      pub_type_rent: "Luwaas / Aluwa",
      pub_field_price: "Nj\u00E9g bi (FCFA) :",
      pub_field_unit: "Misaalu natt :",
      pub_field_quantity: "Lim bi fi nekk :",
      pub_field_region: "Diiwaan bi mu nekk :",
      pub_field_size: "Ni \u00F1u koy y\u00F3bboo :",
      pub_size_small: "\uD83D\uDCE6 Lu Tuuti (M\u00EBn na dem ci Moto / Tiak-Tiak)",
      pub_size_large: "\uD83D\uDE9A Lu R\u00EBy / Bare (Wara dem ci Woto mbaa Kamyon)",
      pub_field_vehicles: "Woto yi baykat bi nangu :",
      pub_field_images: "Nataalu lii ngay jaay (ba 4 nataal) :",
      pub_field_desc: "Faramfasal li ngay jaay :",
      pub_field_desc_ph: "Waxal baxu g\u00F3ob bi, ni \u00F1u ko denc\u00E9 ak yoon yu fay dem...",
      pub_submit_btn: "Y\u00E9glel ko ci Mars\u00E9 bi",
      pub_success_toast: "Sa y\u00E9gle dug na ci jam !",

      // Delivery Module
      delivery_title: "B\u00E9r\u00E9bu Dawalkat yi & Y\u00F3bbale",
      delivery_sub: "Gissal ligg\u00E9eyi y\u00F3bbale yi fi nekk, natt sa yoon te topp say woto.",
      delivery_sim_title: "Nattukaay Moto Tiak-Tiak (350 - 500 FCFA / km)",
      delivery_origin: "Fu\u00F1 koy j\u00EBl\u00E9 (Baykat) :",
      delivery_dest: "Fu\u00F1 koy y\u00F3bbu (J\u00EBndkat) :",
      delivery_calc_btn: "Natt Yoon bi & Nj\u00E9g bi",
      delivery_est_distance: "Guddaayu yoon bi :",
      delivery_est_tariff: "Nj\u00E9gu y\u00F3bbale bi :",
      delivery_available_missions: "Ligg\u00E9eyi y\u00F3bbale yu fi nekk ci S\u00E9n\u00E9gal",
      delivery_accept_mission: "Nangu Ligg\u00E9ey bi",
      delivery_status_pending: "Mi ngi xaar dawalkat",
      delivery_status_transit: "Mi ngi ci yoon bi",
      delivery_status_delivered: "Y\u00F3bbu na\u00F1u ko ci jam",

      // Support & AI Assistant
      support_title: "Ndimbalu IA & Nattukaay Nj\u00E9gu Mars\u00E9",
      support_sub: "Xam-xamu mbay mu xara\u00F1, asamaan ak nj\u00E9gu mars\u00E9 ci S\u00E9n\u00E9gal.",
      ai_chat_title: "Kans\u00E9y\u00E9 Mbay bu Xara\u00F1 (IA)",
      ai_chat_placeholder: "Laajal sa laaj (misaal: pajum timaat, nj\u00E9gu dugub Kaolack...)",
      ai_chat_send: "Y\u00F3nnee",
      barometer_title: "Nj\u00E9gu Mars\u00E9 bu W\u00E9r (SIM S\u00E9n\u00E9gal)",
      barometer_last_update: "Yeesal na\u00F1u ko tay ci 08h00 GMT",

      // Auth Modals
      auth_login_title: "Dugg ci sa K\u00F3nt AgroBey",
      auth_register_title: "Sos K\u00F3nt bu Bees ci AgroBey",
      auth_email_or_phone: "Sa Telefon mbaa sa E-mail :",
      auth_password: "Sa Kaas\u00E9 bi la w\u00F3or :",
      auth_name: "Sa Tur ak Sa Sant :",
      auth_role_label: "Ban ligg\u00E9ey nga fi b\u00EBgg def :",
      auth_role_buyer: "\uD83D\uDED2 J\u00EBndkat / K\u00EBrye",
      auth_role_seller: "\uD83C\uDF3E Baykat / Samakat",
      auth_role_courier: "\uD83D\uDEF5 Dawalkat / Y\u00F3bbalekat",
      auth_submit_login: "Dugg ci K\u00F3nt bi",
      auth_submit_register: "Sos Sama K\u00F3nt",
      auth_no_account: "Amagulo k\u00F3nt ? Bindu fi",
      auth_have_account: "Am nga k\u00F3nt ba noppi ? Dugg",

      // Common Toasts & Actions
      toast_copied: "Duplicat\u00E9 na\u00F1u liyen bi !",
      toast_error: "Am na njuumte. J\u00E9emalaat.",
      toast_auth_required: "Dafa laaj nga dugg ci sa k\u00F3nt bala ngay def lii.",
      toast_lang_changed: "L\u00E0kk bi soppi na\u00F1u ko : Wolof \uD83C\uDDF8\uD83C\uDDF3"
    },

    en: {
      // Topbar & Global
      official_badge: "Official",
      topbar_announcement: "\uD83C\uDF3F National & Regional Rural & Agro-Pastoral Platform",
      transport_certified: "Certified Transport & Logistics",
      support_label: "Support",
      tagline_sub: "Agriculture \u2022 Livestock \u2022 Farmland \u2022 Equipped Farms",
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
      hero_badge: "100% Direct from Farmers \u2022 No Middlemen Margins",
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
      cat_all: "\uD83C\uDF3E All Offers",
      cat_recolte: "\uD83E\uDD66 Harvests & Vegetables",
      cat_elevage: "\uD83D\uDC0F Livestock & Cattle",
      cat_terre: "\uD83C\uDFDE\uFE0F Land & Fields",
      cat_ferme: "\uD83C\uDFE1 Equipped Farms",
      cat_materiel: "\uD83D\uDE9C Farm Equipment",

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
      seller_btn_publish_cta: "\u2795 Post a New Listing",
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
      pub_size_small: "\uD83D\uDCE6 Small Package (Transportable via Motorcycle / Tiak-Tiak)",
      pub_size_large: "\uD83D\uDE9A Large Volume / Bulky (Requires Dedicated Vehicle)",
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
      auth_role_buyer: "\uD83D\uDED2 Buyer / Merchant",
      auth_role_seller: "\uD83C\uDF3E Farmer / Livestock Breeder",
      auth_role_courier: "\uD83D\uDEF5 Courier / Transporter",
      auth_submit_login: "Sign In",
      auth_submit_register: "Create Account",
      auth_no_account: "Don't have an account? Sign up",
      auth_have_account: "Already registered? Sign in",

      // Common Toasts & Actions
      toast_copied: "Link copied to clipboard!",
      toast_error: "An error occurred. Please try again.",
      toast_auth_required: "Please log in to perform this action.",
      toast_lang_changed: "Language updated: English \uD83C\uDDEC\uD83C\uDDE7"
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

    // Rafra??chir les composants actifs de l'application
    if (window.AgroBeyApp) {
      if (typeof window.AgroBeyApp.renderCurrentView === 'function') {
        window.AgroBeyApp.renderCurrentView();
      }

      if (typeof window.AgroBeyApp.showToast === 'function') {
        const toastMsg = this.t('toast_lang_changed');
        window.AgroBeyApp.showToast('success', 'Langue / L\u00E0kk / Language', toastMsg);
      }
    }
  },

  /**
   * Traduire une cl?? avec interpolation
   */
  t: function(key, params) {
    const langDict = this.translations[this.currentLang] || this.translations['fr'];
    let str = langDict[key] || (this.translations['fr'] && this.translations['fr'][key]) || key;

    if (params && typeof params === 'object') {
      Object.keys(params).forEach(function(paramKey) {
        str = str.replace(new RegExp('\\{' + paramKey + '\\}', 'g'), params[paramKey]);
      });
    }
    return str;
  },

  /**
   * Appliquer les traductions ?? tous les ??l??ments marqu??s dans le DOM
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
   * Rendu des s??lecteurs de langue interactifs, ??l??gants et 100% lisibles
   */
  renderLanguageSwitchers: function() {
    const containers = document.querySelectorAll('.lang-switcher-container');
    if (!containers || containers.length === 0) return;

    containers.forEach((container) => {
      const isCompact = container.classList.contains('lang-switcher-compact');
      const isDrawer = container.classList.contains('lang-switcher-drawer');

      if (isDrawer) {
        container.innerHTML = `
          <div class="flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
            <span class="text-[11px] font-bold text-slate-400 pl-1">Langue :</span>
            <div class="flex items-center gap-1.5">
              ${this.availableLanguages.map(l => `
                <button type="button" onclick="window.AgroBeyI18n.setLanguage('${l.code}')" class="px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${this.currentLang === l.code ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'}">
                  <span class="px-1 py-0.2 rounded text-[10px] ${this.currentLang === l.code ? 'bg-slate-950 text-amber-400 font-extrabold' : 'bg-slate-900 text-slate-400'}">${l.badge}</span>
                  <span>${l.label}</span>
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
                <span class="text-[10px] font-extrabold tracking-wide">${l.badge}</span>
              </button>
            `).join('')}
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="inline-flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 text-xs font-bold shadow-xs">
            ${this.availableLanguages.map(l => `
              <button type="button" onclick="window.AgroBeyI18n.setLanguage('${l.code}')" class="px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${this.currentLang === l.code ? 'bg-emerald-700 text-white shadow-sm font-black' : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-200'}" title="${l.label}">
                <span class="px-1.5 py-0.5 rounded text-[9px] ${this.currentLang === l.code ? 'bg-emerald-900 text-emerald-100' : 'bg-gray-200 text-gray-700'}">${l.badge}</span>
                <span class="text-[11px] font-extrabold">${l.label}</span>
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