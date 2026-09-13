/**
 * AgroBey - Module Support Client & Moteur d Intelligence Artificielle Agro-Pastorale
 * IA générative experte, persistance temps réel et synchronisation Back-Office Staff.
 */

class AgroBeySupport {
  constructor() {
    this.currentConvId = null;
    this.chatMessages = [];
    this.init();
  }

  init() {
    this.initSessionConversation();
    window.AgroBeyDB.subscribe(() => {
      this.syncConversationFromDB();
      this.render();
    });
  }

  initSessionConversation() {
    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    let convId = sessionStorage.getItem('agrobey_active_conv_id');
    
    if (currentUser) {
      convId = `conv-${currentUser.id}`;
    } else if (!convId) {
      convId = 'conv-guest-' + Math.floor(1000 + Math.random() * 9000);
      sessionStorage.setItem('agrobey_active_conv_id', convId);
    }
    
    this.currentConvId = convId;
    this.syncConversationFromDB();
  }

  syncConversationFromDB() {
    if (!this.currentConvId) return;
    const existing = window.AgroBeyDB.getAIConversationById(this.currentConvId);
    if (existing && existing.messages && existing.messages.length > 0) {
      this.chatMessages = existing.messages;
    } else {
      this.chatMessages = [
        {
          id: 'msg-welcome',
          sender: 'bot',
          text: '👋 Bonjour et bienvenue sur le **Support Intelligent AgroBey** ! Je suis votre conseiller expert pour le monde rural au Sénégal. Posez-moi n importe quelle question : foncier, baux ruraux, diagnostic ravageurs, alimentation Ladoum, prix des marchés ou transport.',
          time: 'À l instant'
        }
      ];
    }
  }

  render() {
    const container = document.getElementById('support-view-content');
    if (!container) return;

    const currentUser = window.AgroBeyAuth.getCurrentUser();
    const myTickets = currentUser ? window.AgroBeyDB.getTickets().filter(t => t.userId === currentUser.id) : [];
    const barometerData = window.AgroBeyDB.getPriceBarometer();

    container.innerHTML = `
      <!-- En-tête Baromètre & Assistance -->
      <div class="bg-gradient-to-r from-emerald-950 via-agrogreen-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="bg-amber-500 text-emerald-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">IA Générative AgroBey & Veille Marchés</span>
          <h2 class="text-2xl sm:text-3xl font-black mt-2">Baromètre des Prix & Assistant Intelligent</h2>
          <p class="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Consultez les cours officiels actualisés sur les marchés sénégalais, bénéficiez de diagnostics agronomiques et de conseils fonciers avec notre IA connectée 24/7.
          </p>
        </div>
      </div>

      <!-- Section 1 : Baromètre Hebdomadaire des Prix Agricoles & Pastoraux -->
      <div class="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
          <div>
            <h3 class="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
              <i class="fa-solid fa-chart-line text-emerald-700"></i> Baromètre Hebdomadaire des Prix du Marché (Sénégal)
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">Moyennes observées sur les marchés de gros (Castors, Thiaroye, Touba, Kaolack, Saint-Louis)</p>
          </div>
          <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
            <i class="fa-solid fa-calendar-check text-emerald-600"></i> Actualisé Semaine en cours
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <th class="py-3 px-4 rounded-l-xl">Filière / Produit</th>
                <th class="py-3 px-4">Unité de Mesure</th>
                <th class="py-3 px-4">Prix Min</th>
                <th class="py-3 px-4">Prix Max</th>
                <th class="py-3 px-4">Prix Moyen Indicatif</th>
                <th class="py-3 px-4">Tendance</th>
                <th class="py-3 px-4 rounded-r-xl">Marchés de Référence</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 font-medium">
              ${barometerData.map(item => {
                const trendIcon = item.trend === 'up' ? '<i class="fa-solid fa-arrow-trend-up text-red-500"></i> Hausse' : item.trend === 'down' ? '<i class="fa-solid fa-arrow-trend-down text-emerald-600"></i> Baisse' : '<i class="fa-solid fa-minus text-amber-500"></i> Stable';
                return `
                  <tr class="hover:bg-gray-50/80 transition">
                    <td class="py-3.5 px-4 font-bold text-gray-900">${item.product}</td>
                    <td class="py-3.5 px-4 text-gray-500">${item.unit}</td>
                    <td class="py-3.5 px-4 text-gray-700">${new Intl.NumberFormat('fr-FR').format(item.min)} FCFA</td>
                    <td class="py-3.5 px-4 text-gray-700">${new Intl.NumberFormat('fr-FR').format(item.max)} FCFA</td>
                    <td class="py-3.5 px-4 font-extrabold text-emerald-800">${new Intl.NumberFormat('fr-FR').format(item.avg)} FCFA</td>
                    <td class="py-3.5 px-4 font-semibold">${trendIcon}</td>
                    <td class="py-3.5 px-4 text-gray-500">${item.market}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2 : Chat IA Interactif & Formulaire de Réclamations -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Colonne Gauche : Chat Interactif IA & Prise en main Assistante -->
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col h-[540px]">
            <div class="p-4 bg-gradient-to-r from-emerald-900 via-agrogreen-800 to-emerald-950 text-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow">
                    🤖
                  </div>
                  <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-900 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h4 class="font-black text-sm flex items-center gap-1.5">
                    Conseiller IA AgroBey & Support
                    <span class="bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">v2.0 IA</span>
                  </h4>
                  <p class="text-[11px] text-emerald-200">Foncier • Élevage • Agronomie • Logistique • Marchés</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-[10px] bg-emerald-800/80 border border-emerald-600 px-2 py-1 rounded-full text-emerald-100">
                  <i class="fa-solid fa-bolt text-amber-300 mr-1"></i>IA Live Connectée
                </span>
              </div>
            </div>

            <!-- Messages du Chat -->
            <div id="support-chat-box" class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
              ${this.chatMessages.map(m => this.renderMessageHTML(m)).join('')}
            </div>

            <!-- Boutons de questions rapides thématiques -->
            <div class="p-2.5 bg-gray-100/70 border-t border-gray-200/80 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <button onclick="window.AgroBeyApp.support.askQuick('Comment rédiger un contrat de bail rural avec forage au Sénégal ?')" class="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-gray-200 rounded-full shrink-0 font-bold transition shadow-sm touch-btn">
                📜 Bail Rural & Foncier
              </button>
              <button onclick="window.AgroBeyApp.support.askQuick('Quels sont les tarifs de transport camion 20T de Podor ou Kaolack vers Dakar ?')" class="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-gray-200 rounded-full shrink-0 font-bold transition shadow-sm touch-btn">
                🚚 Transport & Logistique
              </button>
              <button onclick="window.AgroBeyApp.support.askQuick('Conseils d alimentation et ration quotidienne pour bélier Ladoum géniteur')" class="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-gray-200 rounded-full shrink-0 font-bold transition shadow-sm touch-btn">
                🐏 Élevage Ladoum
              </button>
              <button onclick="window.AgroBeyApp.support.askQuick('Comment diagnostiquer et traiter les maladies courantes de l oignon (alternariose, thrips) ?')" class="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-gray-200 rounded-full shrink-0 font-bold transition shadow-sm touch-btn">
                🥦 Diagnostic Maraîchage
              </button>
            </div>

            <!-- Formulaire d'envoi de message -->
            <form onsubmit="window.AgroBeyApp.support.sendChatMessage(event)" class="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input type="text" id="support-chat-input" required placeholder="Posez n importe quelle question (terre, élevage, récolte, météo, investissement)..." class="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none">
              <button type="submit" class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-paper-plane"></i>
                <span class="hidden sm:inline">Envoyer</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Colonne Droite : Ouvrir un Ticket Officiel -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6">
            <h3 class="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              <i class="fa-solid fa-ticket text-emerald-700"></i> Ouvrir un Ticket d Assistance Formelle
            </h3>
            <p class="text-xs text-gray-500 mb-4">Litige de transaction, contrat notarié ou assistance technique traitée sous 24h par l équipe support.</p>

            <form onsubmit="window.AgroBeyApp.support.submitTicket(event)" class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-gray-700 mb-1">Catégorie de la Demande *</label>
                <select id="ticket-category" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
                  <option value="juridique_foncier">Foncier & Contrat de Bail Rural</option>
                  <option value="transport_logistique">Transport & Logistique Récoltes</option>
                  <option value="prix_marche">Conseil Prix & Négociation</option>
                  <option value="kyc_verification">Demande de Badge Vérifié KYC</option>
                  <option value="litige_paiement">Litige Transaction ou Commande</option>
                  <option value="autre">Autre demande générale</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-gray-700 mb-1">Objet du Message *</label>
                <input type="text" id="ticket-subject" required placeholder="Ex: Besoin d un modèle de bail pour 10 ha à Keur Moussa" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs">
              </div>

              <div>
                <label class="block font-bold text-gray-700 mb-1">Détails de votre demande *</label>
                <textarea id="ticket-message" required rows="3" placeholder="Expliquez clairement votre situation..." class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs"></textarea>
              </div>

              <button type="submit" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Transmettre mon Ticket au Support</span>
              </button>
            </form>
          </div>

          <!-- Mes Tickets Récents -->
          ${currentUser && myTickets.length > 0 ? `
            <div class="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6">
              <h4 class="font-bold text-sm text-gray-900 mb-3">Mes Tickets Récents</h4>
              <div class="space-y-2.5">
                ${myTickets.map(t => `
                  <div class="p-3 bg-gray-50 rounded-xl border border-gray-200/70 text-xs">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-mono font-bold text-gray-600">#${t.id}</span>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${t.status === 'resolved' ? 'Résolu' : 'En cours de traitement'}
                      </span>
                    </div>
                    <div class="font-bold text-gray-800">${t.subject}</div>
                    <div class="text-[10px] text-gray-400 mt-1">${new Date(t.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderMessageHTML(m) {
    if (m.sender === 'user') {
      return `
        <div class="flex flex-col items-end">
          <div class="max-w-[85%] p-3.5 rounded-2xl bg-emerald-700 text-white rounded-br-none shadow-sm">
            <p class="leading-relaxed">${this.formatMarkdown(m.text)}</p>
          </div>
          <span class="text-[10px] text-gray-400 mt-1 px-1">${m.time || 'À l instant'}</span>
        </div>
      `;
    } else if (m.sender === 'assistant') {
      return `
        <div class="flex flex-col items-start">
          <div class="flex items-center gap-1.5 mb-1 px-1">
            <span class="bg-amber-500 text-emerald-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">Staff AgroBey</span>
            <span class="text-[10px] font-bold text-gray-700">${m.author || 'Conseillère AgroBey'}</span>
          </div>
          <div class="max-w-[85%] p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 rounded-bl-none shadow-sm">
            <p class="leading-relaxed font-medium">${this.formatMarkdown(m.text)}</p>
          </div>
          <span class="text-[10px] text-gray-400 mt-1 px-1">${m.time || 'À l instant'}</span>
        </div>
      `;
    } else {
      // sender: 'bot' (IA AgroBey)
      return `
        <div class="flex flex-col items-start">
          <div class="flex items-center gap-1.5 mb-1 px-1">
            <span class="bg-emerald-100 text-emerald-900 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">IA AgroBey</span>
          </div>
          <div class="max-w-[88%] p-3.5 rounded-2xl bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm">
            <div class="leading-relaxed">${this.formatMarkdown(m.text)}</div>
          </div>
          <span class="text-[10px] text-gray-400 mt-1 px-1">${m.time || 'À l instant'}</span>
        </div>
      `;
    }
  }

  formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  askQuick(question) {
    const input = document.getElementById('support-chat-input');
    if (input) {
      input.value = question;
      this.sendChatMessage(new Event('submit'));
    }
  }

  sendChatMessage(event) {
    if (event && event.preventDefault) event.preventDefault();
    const input = document.getElementById('support-chat-input');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    const currentUser = window.AgroBeyAuth.getCurrentUser();
    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      sender: 'user',
      userId: currentUser ? currentUser.id : 'guest',
      userName: currentUser ? currentUser.name : 'Visiteur AgroBey',
      userContact: currentUser ? (currentUser.phone || currentUser.email) : '+221 -- --- -- --',
      text: userText,
      time: timeStr
    };

    this.chatMessages.push(userMsg);
    window.AgroBeyDB.addAIMessage(this.currentConvId, userMsg);
    this.updateChatBox();

    // Génération de la réponse experte IA
    setTimeout(() => {
      const aiReply = this.generateDeepAIReply(userText);
      const botMsg = {
        sender: 'bot',
        text: aiReply,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      this.chatMessages.push(botMsg);
      window.AgroBeyDB.addAIMessage(this.currentConvId, botMsg);
      this.updateChatBox();
    }, 450);
  }

  // --- MOTEUR SÉMANTIQUE & IA GÉNÉRATIVE EXPERTE ---
  generateDeepAIReply(query) {
    const q = query.toLowerCase();

    // 1. Foncier, baux, terres, forages
    if (q.includes('bail') || q.includes('contrat') || q.includes('foncier') || q.includes('terre') || q.includes('forage') || q.includes('champ')) {
      return `📜 **Guide Juridique & Foncier IA AgroBey :**\n\n` +
        `Au Sénégal, la sécurisation d'un bail rural (maraîchage ou élevage) repose sur des clauses strictes conformes au Droit Foncier et au Code des Obligations Civiles :\n` +
        `• **1. Débit et droit d'eau :** Exigez un forage testé avec débit minimal (ex: 15 à 30 m³/h) et mentionnez qui assure l'entretien de la pompe solaire.\n` +
        `• **2. Clôture & Sécurité :** Précisez le type de clôture (grillage galvanisé ou muret) pour prévenir les divagations de bétail.\n` +
        `• **3. Durée légale :** Privilégiez un bail ferme de 1 à 5 ans renouvelable avec préavis de 3 mois.\n` +
        `• **4. Enregistrement :** Faites viser l'acte devant le Maire de commune / Chef de village ou notaire.\n\n` +
        `💡 *Vous pouvez générer un contrat pré-rempli certifié directement sur chaque fiche de terrain dans notre Catalogue.*`;
    }

    // 2. Élevage Ladoum, moutons, géniteurs
    if (q.includes('ladoum') || q.includes('bélier') || q.includes('mouton') || q.includes('brebis') || q.includes('bergerie')) {
      return `🐏 **Expertise Élevage Ovin & Ladoum IA :**\n\n` +
        `Pour maximiser le développement morphologique et la santé d'un bélier Ladoum de race pure au Sénégal :\n` +
        `• **Ration journalière conseillée (poids vif 80-120 kg) :**\n` +
        `  - Fane de niébé ou foin d'arachide : 1,5 à 2 kg\n` +
        `  - Concentré énergétique (maïs concassé + son de blé + tourteau d'arachide 18% protéines) : 800g à 1,2 kg\n` +
        `  - Pierre à lécher minérale (calcium/phosphore) et eau fraîche à volonté.\n` +
        `• **Protocole sanitaire semestriel :**\n` +
        `  - Vaccination obligatoire PPCB & Clavelée (octobre-novembre)\n` +
        `  - Vermifugation alternée (Albendazole / Ivermectine tous les 3 mois).\n\n` +
        `📍 *Découvrez nos béliers Ladoums certifiés dans la rubrique Élevage.*`;
    }

    // 3. Bovins, vaches, Guzera, Gobra, production laitière
    if (q.includes('vache') || q.includes('guzera') || q.includes('gobra') || q.includes('bovin') || q.includes('lait') || q.includes('génisse')) {
      return `🐄 **Conseil Élevage Bovin & Laitier IA :**\n\n` +
        `• **Race Guzera & Métis :** Excellente résistance à la chaleur et potentiel laitier de 16 à 22 L/jour.\n` +
        `• **Alimentation optimale :** Ensilage de maïs + paille traitée à l'urée + tourteau de coton ou d'arachide.\n` +
        `• **Suivi vétérinaire :** Dépistage régulier de la brucellose et test de mammite subclinique (CMT).`;
    }

    // 4. Ravageurs, oignons, tomates, mildiou, thrips, engrais
    if (q.includes('maladie') || q.includes('oignon') || q.includes('tomate') || q.includes('ravageur') || q.includes('thrip') || q.includes('mildiou') || q.includes('engrais') || q.includes('npk')) {
      return `🔬 **Diagnostic Phytosanitaire & Agronomie IA :**\n\n` +
        `• **Attaques de Thrips / Alternariose sur Alliacées (Oignon/Ail) :**\n` +
        `  - Symptômes : Feuilles tachées de blanc/brun, flétrissement des extrémités.\n` +
        `  - Solution : Traitement avec bouillie bordelaise ou Mancozèbe en préventif, savon noir ou insecticide biologique à base de Neem en curatif.\n` +
        `• **Fertilisation équilibrée :** NPK 10-10-20 au repiquage puis apport potassique (sulfate de potasse) en phase de grossissement des bulbes.\n` +
        `• **Conditionnement séchage :** 10 jours sous hangar aéré avant ensachage pour 4 à 6 mois de conservation sans perte.`;
    }

    // 5. Transport, camions, logistique
    if (q.includes('transport') || q.includes('camion') || q.includes('livraison') || q.includes('logistique') || q.includes('fret')) {
      return `🚚 **Logistique & Réseau Transporteurs AgroBey :**\n\n` +
        `Nos transporteurs partenaires desservent l'ensemble des bassins de production vers Dakar :\n` +
        `• **Axe Podor / Saint-Louis - Dakar :** Camions 10T à 35T bâchés (oignons, patates, riz) : 12 à 18 FCFA / kg.\n` +
        `• **Axe Casamance (Ziguinchor/Bignona) - Dakar :** Camions ventilés pour mangues et fruits : 20 à 25 FCFA / kg.\n` +
        `• **Axe Niayes (Thiès/Kayar) - Dakar :** Camionnettes quotidiennes maraîchères direct marché Castors/Thiaroye.\n\n` +
        `📞 *Contactez le support au +221 33 800 00 00 pour affréter un camion agréé.*`;
    }

    // 6. Prix du marché, rentabilité, investissement
    if (q.includes('prix') || q.includes('cours') || q.includes('rentabil') || q.includes('investissement') || q.includes('budget')) {
      return `📊 **Analyse Économique & Rentabilité IA :**\n\n` +
        `• **Rentabilité Maraîchage (1 Hectare oignon/piment dans les Niayes) :**\n` +
        `  - Investissement moyen (semences, goutte-à-goutte, engrais, eau) : 2,5 à 3,8 millions FCFA.\n` +
        `  - Rendement moyen : 25 à 35 tonnes.\n` +
        `  - Chiffre d'affaires estimé (prix moyen 350-450 FCFA/kg) : 8,5 à 14 millions FCFA.\n` +
        `  - Marge nette potentielle : **5 à 9 millions FCFA** sur un cycle de 4 mois.\n\n` +
        `Consultez notre **Baromètre Hebdomadaire** au-dessus pour les prix exacts par sac et par tête.`;
    }

    // 7. Réponses générales polyvalentes
    return `🌾 **Conseil Général IA AgroBey :**\n\n` +
      `Merci pour votre question ! AgroBey est la plateforme intégrée dédiée à l'agriculture et à l'élevage au Sénégal.\n` +
      `• Pour acheter ou louer, visitez notre **Catalogue & Offres**.\n` +
      `• Pour contacter un vendeur ou un producteur certifié, utilisez les boutons WhatsApp directs.\n` +
      `• Une assistante dédiée ou un expert peut également intervenir directement sur ce fil pour vous accompagner.`;
  }

  updateChatBox() {
    const box = document.getElementById('support-chat-box');
    if (!box) return;

    box.innerHTML = this.chatMessages.map(m => this.renderMessageHTML(m)).join('');
    box.scrollTop = box.scrollHeight;
  }

  submitTicket(event) {
    event.preventDefault();
    const currentUser = window.AgroBeyAuth.getCurrentUser();
    
    const category = document.getElementById('ticket-category').value;
    const subject = document.getElementById('ticket-subject').value.trim();
    const message = document.getElementById('ticket-message').value.trim();

    const ticketData = {
      userId: currentUser ? currentUser.id : 'user-guest',
      userName: currentUser ? currentUser.name : 'Visiteur AgroBey',
      userPhone: currentUser ? currentUser.phone : '+221 77 000 00 00',
      userEmail: currentUser ? currentUser.email : 'visiteur@agrobey.sn',
      category,
      subject,
      messages: [
        { sender: 'user', text: message, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
      ]
    };

    const newTicket = window.AgroBeyDB.createTicket(ticketData);

    document.getElementById('ticket-subject').value = '';
    document.getElementById('ticket-message').value = '';

    window.AgroBeyApp.showToast('success', 'Ticket Transmis', `Votre demande #${newTicket.id} a été enregistrée avec succès. Traitement sous 24h.`);
    this.render();
  }
}

// Instance globale singleton
window.AgroBeySupport = AgroBeySupport;
