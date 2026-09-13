# AgroBey - Marketplace Digitale Agricole, Pastorale & Foncière au Sénégal

> **"Cultivons. Élevons. Construisons demain."**

**AgroBey** est la plateforme web & PWA de référence dédiée à l'écosystème agro-pastoral, foncier et logistique au Sénégal et en Afrique de l'Ouest. Elle connecte directement les producteurs, éleveurs et propriétaires fonciers avec les acheteurs et restaurateurs, avec un réseau logistique intégré et une gestion stricte des baux ruraux conformes.

---

## 🌟 Filières & Métiers Couverts

- **Récoltes & Maraîchage** : Oignons séchés de Podor, Pommes de terre Sahel, Mangues Kent de Casamance, Riz de la vallée, Légumes frais des Niayes.
- **Élevage & Cheptel** : Béliers Ladoum pur sang, Génisses Guzera, Volailles et provende.
- **Terres, Domaines & Champs** : Terrains agricoles avec forages solaires, parcelles Titre Foncier, baux ruraux certifiés.
- **Fermes & Complexes Équipés** : Bâtiments avicoles automatisés (5 000 sujets), bergeries modernes.
- **Matériel & Outillage** : Tracteurs 4x4, motopompes, kits solaires, systèmes goutte-à-goutte.

---

## 🛵 AgroBey Express & Règles Logistiques

1. **Transactions Foncières & Baux Ruraux (Zéro Livraison)** :
   - Pour tout achat ou location de terres (`terre`) et fermes (`ferme`), la livraison physique par transporteur est **strictement éliminée**.
   - Accompagnement juridique garanti : Prise de rendez-vous sur site, vérification du bornage/titre et signature du bail rural conforme avec frais de transport à **0 FCFA**.

2. **Petits Articles (< 30 kg / Maraîchage)** :
   - Le **client choisit librement** son mode de transport, notamment la livraison rapide à moto deux-roues (Tiak-Tiak).
   - **Tarification dynamique deux-roues (350 à 500 FCFA / km)** calculée en temps réel selon :
     - Le kilométrage routier réel
     - Le relief du terrain (Goudron, Pistes des Niayes, Piste latéritique, Bac du fleuve)
     - La période (Majoration nocturne 20h - 06h)
     - Les embouteillages (Heures de pointe urbaines)

3. **Gros Articles (> 30 kg / Bétail vivant)** :
   - Le **vendeur détermine et impose** le véhicule sécurisé adapté (Camionnette frigorifique, Camion bétaillère bétail, Camion plateau lourd 10T-20T).
   - La livraison à deux-roues est automatiquement bloquée pour des raisons de sécurité et de bien-être animal.

4. **Cartographie Live & GPS** :
   - Carte interactive Leaflet avec vue satellite HD des parcelles.
   - Tracé d'itinéraire routier réel via moteur OSRM.
   - Affectation automatique du chauffeur-livreur géolocalisé le plus proche.
   - Code OTP secret à 4 chiffres pour validation de remise.

---

## 🔐 Identifiants des Comptes de Démonstration

| Rôle | Nom / Profil | Email / Identifiant | Mot de passe |
| :--- | :--- | :--- | :--- |
| **Super-Admin** | Direction Générale AgroBey | `admin@agrobey.sn` | `AgroBey@2026!Admin` |
| **Assistante** | Fatou Ndiaye (Support & Transactions) | `assistant@agrobey.sn` | `AgroAssistant@2026` |
| **Ingénieur IT** | Cheikh Tidiane Diop (Maintenance & Logs) | `it@agrobey.sn` | `AgroIT@2026` |
| **Marketing** | Awa Sow (Visuels, Slogans & Bannières) | `marketing@agrobey.sn` | `AgroMarketing@2026` |
| **Agriculteur / Bailleur** | Amadou Ba (Domaine Ba & Fils) | `amadou.ba@agrobey.sn` | `AgroFarmer@2026` |
| **Maître Éleveur** | Ousmane Fall (Bergerie Prestige) | `ousmane.fall@bergerieprestige.sn` | `AgroBreeder@2026` |
| **Transporteur / Livreur** | Ibrahima Ndiaye (AgroExpress) | `livreur@agrobey.sn` | `AgroDelivery@2026` |
| **Acheteur / Client** | Moussa Diagne | `moussa.diagne@gmail.com` | `AgroClient@2026` |

---

## 🚀 Déploiement en Production

### Option 1 : Déploiement Docker & Docker Compose (Recommandé sur VPS)
```bash
# Lancement en arrière-plan
docker compose up -d --build

# Vérification de l'état
docker compose ps
docker compose logs -f
```

### Option 2 : Déploiement Nginx Natif
```bash
# Copier les fichiers web vers le répertoire Nginx
sudo cp -r . /var/www/agrobey/

# Copier la configuration Nginx
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl reload nginx
```

### Option 3 : Déploiement Vercel / Netlify
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=.
```

---

## 🛡️ Sécurité & Conformité

- **Cryptographie** : Mots de passe chiffrés en SHA-256 avec sel dynamique aléatoire (Web Crypto API).
- **Anti-Bruteforce** : Verrouillage temporaire de 5 minutes après 5 échecs de connexion consécutifs.
- **XSS & Injection Protection** : Sanitisation systématique des entrées HTML via `AgroBeyConfig.escapeHTML()`.
- **En-têtes HTTP Sécurisés** : CSP, HSTS, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), Referrer-Policy.
- **Service Worker PWA v1.3.0** : Cache hors-ligne pour résilience en zone rurale.
