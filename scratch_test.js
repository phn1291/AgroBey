const config = require('./assets/js/config.js');
const fs = require('fs');

// Simulation environnement window / LocalStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; }
};

// Chargement db.js
const dbCode = fs.readFileSync('./assets/js/db.js', 'utf8');
eval(dbCode);

const db = new AgroBeyDB();

// 1. Test Listing list-3 (Domaine 5 Ha)
const list3 = db.getListingById('list-3');
if (!list3 || list3.itemSize !== 'land' || (list3.allowedTransportModes && list3.allowedTransportModes.length > 0)) {
  console.error('FAIL_LIST3: list-3 doit avoir itemSize = land et allowedTransportModes vide');
  process.exit(1);
}

// 2. Test Listing list-4 (Ferme avicole)
const list4 = db.getListingById('list-4');
if (!list4 || list4.itemSize !== 'land' || (list4.allowedTransportModes && list4.allowedTransportModes.length > 0)) {
  console.error('FAIL_LIST4: list-4 doit avoir itemSize = land et allowedTransportModes vide');
  process.exit(1);
}

// 3. Test calcul tarif de livraison pour terre/ferme
const landTariff = db.calculateSmartDeliveryTariff('Notto Diobass, Thiès', 'Dakar Almadies', 'moto', {}, list3);
if (landTariff.totalTariff !== 0 || landTariff.isDeliverable !== false || landTariff.isLandTransaction !== true) {
  console.error('FAIL_TARIFF_LAND: Le tarif foncier doit être 0 FCFA et isDeliverable = false', landTariff);
  process.exit(1);
}

// 4. Test création de commande foncière
const landOrder = db.createOrder({
  listingId: 'list-3',
  listingTitle: list3.title,
  category: 'terre',
  itemSize: 'land',
  buyerId: 'user-client',
  buyerName: 'Moussa Diagne',
  buyerPhone: '+221 77 555 12 34',
  quantity: 1,
  unitPrice: 350000,
  totalAmount: 350000,
  hasDelivery: false,
  orderType: 'location'
});

if (landOrder.hasDelivery !== false || landOrder.deliveryFee !== 0 || landOrder.isLandTransaction !== true) {
  console.error('FAIL_ORDER_LAND: Commande foncière doit avoir hasDelivery=false et deliveryFee=0', landOrder);
  process.exit(1);
}

// 5. Vérifier qu'aucune mission de livraison n'a été créée pour ce bail rural
const delivs = db.getDeliveries();
const missionForLand = delivs.find(d => d.orderId === landOrder.id);
if (missionForLand) {
  console.error('FAIL_DELIVERY_SPAWN: Aucune livraison ne doit être générée pour les baux ruraux !');
  process.exit(1);
}

// 6. Test tarif marchandise physique (Oignons de Podor) -> Doit fonctionner normalement
const list1 = db.getListingById('list-1');
const physTariff = db.calculateSmartDeliveryTariff('Podor', 'Dakar', 'camionnette', {}, list1);
if (physTariff.totalTariff <= 0 || physTariff.distanceKm <= 50) {
  console.error('FAIL_PHYS_TARIFF: Le tarif physique doit être calculé correctement', physTariff);
  process.exit(1);
}

// 7. Test barème deux-roues dynamique encadré (350 à 500 FCFA/km)
const motoRates = [
  db.calculateMotoRatePerKm({ lat: 14.71, lng: -17.46, relief: 'goudron' }, { lat: 14.75, lng: -17.39, relief: 'goudron' }, 10, { isNight: false, isRushHour: false }),
  db.calculateMotoRatePerKm({ lat: 14.71, lng: -17.46, relief: 'fleuve_bac' }, { lat: 14.75, lng: -17.39, relief: 'piste_laterite' }, 45, { isNight: true, isRushHour: true, isRaining: true })
];

if (motoRates[0].ratePerKm < 350 || motoRates[1].ratePerKm > 500) {
  console.error('FAIL_MOTO_RANGE: Le barème moto doit être strictement borné [350, 500] FCFA/km', motoRates);
  process.exit(1);
}

// 8. Test Sanitisation XSS
const dirty = '<script>alert("xss")</script>';
const clean = config.escapeHTML(dirty);
if (clean.includes('<script>') || !clean.includes('&lt;script&gt;')) {
  console.error('FAIL_XSS: escapeHTML ne protège pas correctement');
  process.exit(1);
}

console.log('NODE_SUCCESS');
