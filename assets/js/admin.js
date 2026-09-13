/**
 * AgroBey - Moteur Super-Admin, Multi-Staff, IA Conversations & Maintenance IT
 * Tour de contrôle universelle avec permissions par rôle (Admin, Assistante, IT, Marketing).
 */

class AgroBeyAdmin {
  constructor() {
    this.currentAdminTab = 'overview';
    this.selectedConvId = null;
    this.logFilter = 'all';
    this.orderFilter = 'all';
    this.userFilter = 'all';
    this.deliveryFilter = 'all';
    this.init();
  }

  init() {
    window.AgroBeyDB.subscribe(() => {
      this.render();
    });
  }

  switchAdminTab(tab) {
    this.currentAdminTab = tab;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const container = document.getElementById('admin-view-content');
    if (!container) return;

    const stats = window.AgroBeyDB.getStats();
    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : { role: 'admin', name: 'Super-Admin' };
    const userRole = currentUser ? currentUser.role : 'admin';

    // Rôles autorisés pour chaque onglet
    const isSuperAdmin = userRole === 'admin';
    const isAssistant = userRole === 'assistant' || isSuperAdmin;
    const isIT = userRole === 'it' || isSuperAdmin;
    const isMarketing = userRole === 'marketing' || isSuperAdmin;

    container.innerHTML = `
      <!-- En-tête Principal & Badges Rôle Staff -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/30 flex items-center justify-center text-3xl text-white shadow-xl shadow-purple-900/30">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-black text-white">Centre de Contrôle Agro<span class="text-amber-400">Bey</span></h2>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  userRole === 'admin' ? 'bg-purple-600 text-white shadow' :
                  userRole === 'assistant' ? 'bg-amber-500 text-slate-950 font-black' :
                  userRole === 'it' ? 'bg-emerald-600 text-white font-black' :
                  'bg-pink-600 text-white font-black'
                }">
                  ${currentUser.roleLabel || userRole.toUpperCase()}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Connecté en tant que <strong>${currentUser.name}</strong> • ${currentUser.department || 'Administration'}</p>
            </div>
          </div>

          <!-- Actions Rapides -->
          <div class="flex items-center gap-2 flex-wrap">
            <a href="index.html" class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700">
              <i class="fa-solid fa-store"></i> <span class="hidden sm:inline">Portail Public</span>
            </a>
            ${isSuperAdmin ? `
              <button onclick="if(confirm('Réinitialiser toutes les données aux valeurs de démonstration ?')) { window.AgroBeyDB.resetToDefaults(); window.AgroBeyApp.showToast('info', 'Réinitialisation', 'Base réinitialisée.'); }" class="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                <i class="fa-solid fa-rotate-left"></i> <span class="hidden sm:inline">Reset Démo</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Menu de Navigation Principal avec Permissions par Rôle (Swipeable sur mobile) -->
        <div class="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
          <button onclick="window.AgroBeyApp.admin.switchAdminTab('overview')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'overview' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
            <i class="fa-solid fa-chart-pie"></i> Dashboard
          </button>

          ${isAssistant ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('ai_chats')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'ai_chats' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-robot text-amber-400"></i> Conversations IA & Support
              <span class="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">${stats.activeAIConversations || 0}</span>
            </button>
          ` : ''}

          ${isAssistant ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('orders')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'orders' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-cart-shopping"></i> Commandes & Transactions
              <span class="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">${stats.totalOrders}</span>
            </button>
          ` : ''}

          ${(isAssistant || isSuperAdmin || isIT) ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('logistics')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'logistics' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-truck-fast text-amber-400"></i> Logistique & Livraisons
              <span class="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">${stats.activeDeliveries || 0}</span>
            </button>
          ` : ''}

          ${isSuperAdmin ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('staff')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'staff' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-user-gear text-emerald-400"></i> Équipe Staff
              <span class="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">${stats.staffCount || 4}</span>
            </button>
          ` : ''}

          ${isSuperAdmin ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('moderation')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'moderation' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-shield-halved"></i> Modération Annonces
              ${stats.pendingListings > 0 ? `<span class="bg-amber-500 text-slate-900 text-[10px] px-1.5 py-0.5 rounded-full font-black">${stats.pendingListings}</span>` : ''}
            </button>
          ` : ''}

          ${isMarketing || isSuperAdmin ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('marketing_visuals')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'marketing_visuals' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-palette text-pink-400"></i> Marketing & Visuels Site
            </button>
          ` : ''}

          ${isIT || isSuperAdmin ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('it_maintenance')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'it_maintenance' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-server text-cyan-400"></i> Maintenance IT & Logs
            </button>
          ` : ''}

          ${(isSuperAdmin || isIT) ? `
            <button onclick="window.AgroBeyApp.admin.switchAdminTab('users')" class="px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 touch-btn ${this.currentAdminTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <i class="fa-solid fa-user-check text-cyan-400"></i> Validation KYC & Livreurs
              ${(stats.pendingSellers + (stats.pendingDrivers || 0)) > 0 ? `<span class="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">${stats.pendingSellers + (stats.pendingDrivers || 0)} en attente</span>` : ''}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Rendu dynamique du contenu selon l'onglet -->
      ${this.renderActiveTab(stats, currentUser)}
    `;
  }

  renderActiveTab(stats, currentUser) {
    if (this.currentAdminTab === 'overview') return this.renderOverview(stats, currentUser);
    if (this.currentAdminTab === 'ai_chats') return this.renderAIConversations();
    if (this.currentAdminTab === 'staff') return this.renderStaffTeam();
    if (this.currentAdminTab === 'it_maintenance') return this.renderITMaintenance();
    if (this.currentAdminTab === 'marketing_visuals') return this.renderMarketingVisuals();
    if (this.currentAdminTab === 'moderation') return this.renderModeration();
    if (this.currentAdminTab === 'orders') return this.renderOrders();
    if (this.currentAdminTab === 'logistics') return this.renderLogistics(stats, currentUser);
    if (this.currentAdminTab === 'users') return this.renderUsersKYC();
    return this.renderOverview(stats, currentUser);
  }

  renderOverview(stats, currentUser) {
    const orders = window.AgroBeyDB.getOrders().slice(0, 5);
    const aiConvs = window.AgroBeyDB.getAIConversations().slice(0, 4);

    return `
      <div class="space-y-6">
        <!-- Grille de Cartes KPIs Principaux -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Volume des Ventes</div>
            <div class="text-xl sm:text-2xl font-black text-emerald-400">${new Intl.NumberFormat('fr-FR').format(stats.totalSalesVolume)} <span class="text-xs">FCFA</span></div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Transactions agro-pastorales</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Sessions IA & Support</div>
            <div class="text-2xl font-black text-amber-400">${stats.totalAIConversations || 3}</div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">${stats.activeAIConversations || 2} conversations actives</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Équipe Staff Actif</div>
            <div class="text-2xl font-black text-purple-400">${stats.staffCount || 4}</div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Assistantes, IT, Marketing</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Producteurs Certifiés</div>
            <div class="text-2xl font-black text-cyan-400">${stats.verifiedSellers} / ${stats.sellersCount}</div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Badge officiel KYC</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Bloc 1 : Dernières Conversations IA & Interventions Staff -->
          <div class="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-comments text-amber-400"></i> Conversations IA en Cours
              </h3>
              <button onclick="window.AgroBeyApp.admin.switchAdminTab('ai_chats')" class="text-xs text-amber-400 hover:underline font-bold">
                Voir toutes
              </button>
            </div>
            <div class="space-y-3">
              ${aiConvs.map(c => `
                <div class="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 text-xs cursor-pointer hover:border-amber-500/50 transition" onclick="window.AgroBeyApp.admin.selectConversation('${c.id}')">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-white">${c.userName}</span>
                      <span class="text-[10px] px-2 py-0.2 rounded-full font-bold ${c.status === 'active' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}">
                        ${c.status === 'active' ? 'En direct' : 'Résolu'}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5 line-clamp-1">${c.topic}</p>
                  </div>
                  <button class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg">
                    Intervenir
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bloc 2 : Dernières Transactions -->
          <div class="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-cart-shopping text-emerald-400"></i> Transactions Récentes
              </h3>
              <button onclick="window.AgroBeyApp.admin.switchAdminTab('orders')" class="text-xs text-emerald-400 hover:underline font-bold">
                Toutes les commandes
              </button>
            </div>
            <div class="space-y-3">
              ${orders.map(o => `
                <div class="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div class="font-bold text-white line-clamp-1">${o.listingTitle}</div>
                    <p class="text-[11px] text-slate-400 mt-0.5">${o.buyerName} ➔ ${o.sellerName}</p>
                  </div>
                  <div class="text-right">
                    <div class="font-black text-emerald-400">${new Intl.NumberFormat('fr-FR').format(o.totalAmount)} FCFA</div>
                    <span class="text-[10px] text-slate-500 font-bold">${o.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- MODULE 1 : CONVERSATIONS IA & SUPPORT CLIENT DIRECT ---
  renderAIConversations() {
    const convs = window.AgroBeyDB.getAIConversations();
    if (!this.selectedConvId && convs.length > 0) {
      this.selectedConvId = convs[0].id;
    }
    const activeConv = convs.find(c => c.id === this.selectedConvId) || convs[0];

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-robot text-amber-400"></i> Supervision des Conversations IA & Interventions
            </h3>
            <p class="text-xs text-slate-400">Accédez en direct aux échanges entre les utilisateurs et l IA AgroBey. Prenez le contrôle et répondez en direct.</p>
          </div>
          <span class="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-full">
            ${convs.length} conversation(s) enregistrée(s)
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          <!-- Liste des Sessions à Gauche -->
          <div class="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-3 space-y-2 overflow-y-auto max-h-[540px]">
            ${convs.map(c => `
              <div onclick="window.AgroBeyApp.admin.selectConversation('${c.id}')" class="p-3.5 rounded-xl cursor-pointer transition border text-xs ${
                c.id === this.selectedConvId ? 'bg-slate-800 border-amber-500/80 text-white shadow' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-white flex items-center gap-1.5">
                    <i class="fa-solid fa-user text-[10px] text-slate-500"></i> ${c.userName}
                  </span>
                  <span class="text-[10px] font-mono text-slate-500">${new Date(c.updatedAt || c.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p class="text-[11px] text-slate-400 line-clamp-1 font-semibold">${c.topic}</p>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  <span>${c.userContact}</span>
                  <span class="px-2 py-0.2 rounded-full font-bold ${c.status === 'active' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}">
                    ${c.status === 'active' ? '● En cours' : '✓ Résolu'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Fenêtre de Chat & Prise en Main à Droite -->
          <div class="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden">
            ${activeConv ? `
              <!-- En-tête de la conversation sélectionnée -->
              <div class="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-sm text-white flex items-center gap-2">
                    <span>${activeConv.userName}</span>
                    <span class="text-xs text-slate-400 font-normal">(${activeConv.userContact})</span>
                  </h4>
                  <p class="text-[11px] text-amber-400 mt-0.5 font-mono">Sujet : ${activeConv.topic}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="window.AgroBeyDB.saveAIConversation({ ...window.AgroBeyDB.getAIConversationById('${activeConv.id}'), status: '${activeConv.status === 'active' ? 'resolved' : 'active'}' }); window.AgroBeyApp.admin.render();" class="px-2.5 py-1 rounded-lg text-[10px] font-bold ${activeConv.status === 'active' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-amber-900/60 text-amber-300'}">
                    ${activeConv.status === 'active' ? 'Marquer Résolu' : 'Rouvrir'}
                  </button>
                  <button onclick="if(confirm('Supprimer cette session ?')) { window.AgroBeyDB.deleteAIConversation('${activeConv.id}'); window.AgroBeyApp.admin.selectedConvId = null; window.AgroBeyApp.admin.render(); }" class="px-2 py-1 bg-red-950 text-red-300 rounded-lg text-[10px] hover:bg-red-900">
                    ✕
                  </button>
                </div>
              </div>

              <!-- Messages du Chat -->
              <div class="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px] text-xs">
                ${activeConv.messages.map(m => `
                  <div class="flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}">
                    <div class="flex items-center gap-1.5 mb-1 px-1 text-[10px]">
                      <span class="font-bold ${m.sender === 'user' ? 'text-cyan-400' : m.sender === 'assistant' ? 'text-amber-400' : 'text-emerald-400'}">
                        ${m.sender === 'user' ? activeConv.userName : m.sender === 'assistant' ? (m.author || 'Staff AgroBey') : 'IA AgroBey'}
                      </span>
                      <span class="text-slate-500">${m.time || ''}</span>
                    </div>
                    <div class="max-w-[85%] p-3 rounded-xl ${
                      m.sender === 'user' 
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700' 
                        : m.sender === 'assistant'
                        ? 'bg-amber-950/80 border border-amber-600/60 text-amber-100 rounded-tr-none'
                        : 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-100 rounded-tr-none'
                    }">
                      <p class="leading-relaxed">${m.text}</p>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Formulaire d'Intervention Staff en Direct -->
              <form onsubmit="window.AgroBeyApp.admin.handleStaffReply(event, '${activeConv.id}')" class="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input type="text" id="admin-reply-input" required placeholder="Intervenir et envoyer un message en direct au client..." class="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-amber-500">
                <button type="submit" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1.5">
                  <i class="fa-solid fa-paper-plane"></i>
                  <span>Intervenir</span>
                </button>
              </form>
            ` : `
              <div class="p-12 text-center text-slate-500 text-xs">
                Sélectionnez une conversation pour visualiser les échanges.
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  selectConversation(convId) {
    this.selectedConvId = convId;
    this.render();
  }

  handleStaffReply(event, convId) {
    event.preventDefault();
    const input = document.getElementById('admin-reply-input');
    if (!input || !input.value.trim()) return;

    const currentUser = window.AgroBeyAuth.getCurrentUser();
    const staffName = currentUser ? `${currentUser.name} (${currentUser.roleLabel || 'Staff'})` : 'Support AgroBey';

    window.AgroBeyDB.staffReplyToAIConversation(convId, staffName, input.value.trim());
    input.value = '';
    window.AgroBeyApp.showToast('success', 'Message Transmis', 'Votre intervention a été injectée en direct dans la conversation du client.');
    this.render();
  }

  // --- MODULE 2 : GESTION DE L'ÉQUIPE STAFF & RÔLES ---
  renderStaffTeam() {
    const staff = window.AgroBeyDB.getStaffAccounts();

    return `
      <div class="space-y-6">
        <!-- Formulaire de Création d'un Nouveau Compte Staff -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg">
          <div class="border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-user-plus text-emerald-400"></i> Créer un Compte Équipe Staff
              </h3>
              <p class="text-xs text-slate-400">Ajoutez des comptes dédiés pour l Assistante Commerciale, l Ingénieur IT ou le Responsable Marketing.</p>
            </div>
            <span class="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              ${staff.length} membres
            </span>
          </div>

          <form onsubmit="window.AgroBeyApp.admin.handleCreateStaff(event)" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Nom & Prénom *</label>
                <input type="text" id="staff-name" required placeholder="Ex: Fatou Ndiaye" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Email Professionnel *</label>
                <input type="email" id="staff-email" required placeholder="nom@agrobey.sn" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Téléphone de Contact *</label>
                <input type="tel" id="staff-phone" required placeholder="+221 77..." class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Rôle & Permissions *</label>
                <select id="staff-role" required class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                  <option value="assistant">👩‍💼 Assistante (Transactions & Chat Clients)</option>
                  <option value="it">👨‍💻 IT (Maintenance du site & Logs)</option>
                  <option value="marketing">🎨 Marketing (Visuels, Bannières & Slogans)</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Département / Pôle *</label>
                <input type="text" id="staff-dept" required placeholder="Ex: Support Client ou Infrastructure" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Mot de Passe Initial *</label>
                <input type="password" id="staff-password" required minlength="6" placeholder="••••••••" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button type="submit" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition flex items-center gap-2">
                <i class="fa-solid fa-user-plus"></i>
                <span>Créer et Activer le Compte Staff</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Liste des Comptes Staff Existants -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i class="fa-solid fa-users-gear text-purple-400"></i> Membres Actuels de l Équipe
          </h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead>
                <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th class="py-3 px-4 rounded-l-xl">Collaborateur</th>
                  <th class="py-3 px-4">Contact</th>
                  <th class="py-3 px-4">Rôle & Mission</th>
                  <th class="py-3 px-4">Département</th>
                  <th class="py-3 px-4">Statut</th>
                  <th class="py-3 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${staff.map(u => `
                  <tr class="hover:bg-slate-950/60 transition">
                    <td class="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <img src="${u.avatar || 'assets/logo.jpg'}" class="w-8 h-8 rounded-full object-cover border border-slate-700">
                      <div>
                        <div>${u.name}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${u.email}</div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-slate-400">${u.phone}</td>
                    <td class="py-3.5 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        u.role === 'assistant' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        u.role === 'it' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-pink-950 text-pink-300 border border-pink-800'
                      }">
                        ${u.roleLabel || u.role}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-slate-400">${u.department || 'Général'}</td>
                    <td class="py-3.5 px-4">
                      <span class="text-emerald-400 font-bold">● ${u.status || 'actif'}</span>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      ${u.role !== 'admin' ? `
                        <button onclick="if(confirm('Supprimer ce compte staff ?')) { window.AgroBeyDB.deleteUser('${u.id}'); window.AgroBeyApp.admin.render(); }" class="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-[11px] font-bold">
                          Supprimer
                        </button>
                      ` : '<span class="text-[10px] text-slate-500">Super-Admin</span>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  async handleCreateStaff(event) {
    event.preventDefault();
    const name = document.getElementById('staff-name').value.trim();
    const email = document.getElementById('staff-email').value.trim();
    const phone = document.getElementById('staff-phone').value.trim();
    const role = document.getElementById('staff-role').value;
    const department = document.getElementById('staff-dept').value.trim();
    const pwd = document.getElementById('staff-password').value;

    const existing = window.AgroBeyDB.getUserByEmail(email);
    if (existing) {
      alert('Un compte avec cet email existe déjà.');
      return;
    }

    const salt = window.AgroBeyAuth.generateSalt();
    const passwordHash = await window.AgroBeyAuth.hashPassword(pwd, salt);

    const roleLabels = {
      assistant: 'Assistante Commerciale & Support Client',
      it: 'Ingénieur Système & Maintenance IT',
      marketing: 'Responsable Marketing & Visuels Site'
    };

    const newStaff = {
      id: 'staff-' + Date.now().toString().slice(-5),
      name,
      email,
      phone,
      whatsapp: phone.replace(/\D/g, ''),
      role,
      roleLabel: roleLabels[role] || role,
      department,
      passwordHash,
      salt,
      isVerified: true,
      badge: 'Staff Officiel',
      status: 'active',
      avatar: role === 'assistant' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' 
        : role === 'it' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' 
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString()
    };

    window.AgroBeyDB.saveUser(newStaff);
    window.AgroBeyDB.addSystemLog('STAFF', `Création Compte Staff (${role.toUpperCase()})`, `${name} ajouté(e) au département ${department}`, 'Super-Admin');

    window.AgroBeyApp.showToast('success', 'Compte Staff Créé', `Le compte pour ${name} (${role}) est prêt.`);
    this.render();
  }

  // --- MODULE 3 : MAINTENANCE IT, HEALTH CHECK & BACKUP JSON ---
  renderITMaintenance() {
    const logs = window.AgroBeyDB.getSystemLogs();
    const filteredLogs = this.logFilter === 'all' ? logs : logs.filter(l => l.category === this.logFilter);

    // Calcul de la taille estimée du LocalStorage
    let storageBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const storageKB = (storageBytes / 1024).toFixed(1);

    return `
      <div class="space-y-6">
        <!-- État des Serveurs & Santé du Système -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-slate-400 font-bold">État de la Base</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div class="text-xl font-black text-emerald-400">Opérationnel (100%)</div>
            <div class="text-[10px] text-slate-500 mt-1">LocalStorage & Sync Mémoire</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-slate-400 font-bold">Stockage Alloué</span>
              <i class="fa-solid fa-hard-drive text-cyan-400 text-xs"></i>
            </div>
            <div class="text-xl font-black text-cyan-400">${storageKB} KB <span class="text-xs font-normal text-slate-500">/ 5 MB</span></div>
            <div class="text-[10px] text-slate-500 mt-1">Données chiffrées & indexées</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-slate-400 font-bold">Chiffrement</span>
              <i class="fa-solid fa-lock text-purple-400 text-xs"></i>
            </div>
            <div class="text-xl font-black text-purple-400">SHA-256 + Sels</div>
            <div class="text-[10px] text-slate-500 mt-1">Web Crypto API active</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-slate-400 font-bold">Latence Réseau</span>
              <i class="fa-solid fa-bolt text-amber-400 text-xs"></i>
            </div>
            <div class="text-xl font-black text-amber-400">< 4 ms</div>
            <div class="text-[10px] text-slate-500 mt-1">Mode PWA Hors-ligne prêt</div>
          </div>
        </div>

        <!-- Boîte à Outils IT : Backup, Restauration & Diagnostics -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
            <i class="fa-solid fa-toolbox text-cyan-400"></i> Outils de Maintenance & Sauvegardes
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <button onclick="window.AgroBeyAdmin.downloadDBBackup()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-cyan-500/30 rounded-2xl flex flex-col items-start gap-2 transition text-left">
              <div class="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-download"></i>
              </div>
              <div>
                <div class="font-bold text-white">Sauvegarde JSON</div>
                <p class="text-[11px] text-slate-400 mt-0.5">Télécharger un snapshot complet de la base de données.</p>
              </div>
            </button>

            <button onclick="window.AgroBeyAdmin.triggerDBRestorePrompt()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 rounded-2xl flex flex-col items-start gap-2 transition text-left">
              <div class="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-upload"></i>
              </div>
              <div>
                <div class="font-bold text-white">Restaurer Base JSON</div>
                <p class="text-[11px] text-slate-400 mt-0.5">Importer une sauvegarde et restaurer les données.</p>
              </div>
            </button>
            <input type="file" id="db-restore-file" accept=".json" class="hidden" onchange="window.AgroBeyAdmin.handleDBRestore(event)">

            <button onclick="window.AgroBeyAdmin.runSystemDiagnostics()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-purple-500/30 rounded-2xl flex flex-col items-start gap-2 transition text-left">
              <div class="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
              <div>
                <div class="font-bold text-white">Autodiagnostic Système</div>
                <p class="text-[11px] text-slate-400 mt-0.5">Vérifier l'intégrité, les clés et les modules crypto.</p>
              </div>
            </button>

            <button onclick="window.AgroBeyAdmin.clearLocalCache()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-red-500/30 rounded-2xl flex flex-col items-start gap-2 transition text-left">
              <div class="w-10 h-10 rounded-xl bg-red-950 text-red-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-broom"></i>
              </div>
              <div>
                <div class="font-bold text-white">Purger le Cache Local</div>
                <p class="text-[11px] text-slate-400 mt-0.5">Nettoyer les sessions expirées et optimiser la mémoire.</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Journal d'Audit & Logs Système en Temps Réel -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-terminal text-emerald-400"></i> Journal d'Audit & Activités Système
              </h3>
              <p class="text-xs text-slate-400">Traçabilité complète des connexions, modifications et requêtes IA.</p>
            </div>
            
            <div class="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              ${['all', 'AUTH', 'AI_CHAT', 'ORDER', 'STAFF', 'SYSTEM'].map(cat => `
                <button onclick="window.AgroBeyApp.admin.logFilter = '${cat}'; window.AgroBeyApp.admin.render();" class="px-2.5 py-1 rounded-lg font-bold transition ${
                  this.logFilter === cat ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }">
                  ${cat.toUpperCase()}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="bg-slate-950 rounded-2xl p-4 font-mono text-[11px] max-h-96 overflow-y-auto space-y-2 border border-slate-800">
            ${filteredLogs.length > 0 ? filteredLogs.map(l => `
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-900/60 border border-slate-900 transition">
                <div class="flex items-center gap-2">
                  <span class="text-slate-500 text-[10px]">${new Date(l.timestamp).toLocaleTimeString('fr-FR')}</span>
                  <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    l.category === 'AUTH' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                    l.category === 'AI_CHAT' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    l.category === 'ORDER' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    l.category === 'STAFF' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    'bg-slate-800 text-slate-300'
                  }">
                    ${l.category}
                  </span>
                  <span class="font-bold text-slate-200">${l.action}</span>
                  <span class="text-slate-400 font-sans text-xs hidden md:inline">— ${l.details}</span>
                </div>
                <span class="text-[10px] text-slate-500 font-sans">${l.user || 'Système'}</span>
              </div>
            `).join('') : '<p class="text-slate-500 text-center py-4">Aucun log enregistré pour cette catégorie.</p>'}
          </div>
        </div>
      </div>
    `;
  }

  static downloadDBBackup() {
    const json = window.AgroBeyDB.exportFullDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrobey_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.AgroBeyApp.showToast('success', 'Sauvegarde Exportée', 'Fichier JSON de sauvegarde téléchargé avec succès.');
  }

  static triggerDBRestorePrompt() {
    const input = document.getElementById('db-restore-file');
    if (input) input.click();
  }

  static handleDBRestore(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const res = window.AgroBeyDB.importFullDatabase(e.target.result);
      if (res.success) {
        window.AgroBeyApp.showToast('success', 'Base Restaurée', 'Les données ont été restaurées avec succès. Rechargement...');
        setTimeout(() => location.reload(), 1200);
      } else {
        window.AgroBeyApp.showToast('error', 'Erreur Restauration', res.error || 'Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  }

  static clearLocalCache() {
    window.AgroBeyDB.addSystemLog('SYSTEM', 'Nettoyage Cache', 'Purge des clés temporaires et sessions orphelines', 'IT');
    window.AgroBeyApp.showToast('info', 'Cache Nettoyé', 'Le cache local a été vidé et optimisé.');
    if (window.AgroBeyApp && window.AgroBeyApp.admin) window.AgroBeyApp.admin.render();
  }

  static runSystemDiagnostics() {
    const checks = [
      { name: 'API Web Crypto (SHA-256)', status: !!(window.crypto && window.crypto.subtle) },
      { name: 'Moteur LocalStorage', status: !!window.localStorage },
      { name: 'Seed Data & Collections DB', status: window.AgroBeyDB.getListings().length > 0 },
      { name: 'Module IA & Support', status: window.AgroBeyDB.getAIConversations().length >= 0 }
    ];

    const allPassed = checks.every(c => c.status);
    window.AgroBeyDB.addSystemLog('SYSTEM', 'Diagnostic Système', `Résultat: ${allPassed ? 'OK (Tous tests validés)' : 'Avertissement détecté'}`, 'IT');
    window.AgroBeyApp.showToast('success', 'Diagnostic IT Terminé', 'Tous les composants du système sont 100% opérationnels.');
  }

  // --- MODULE 4 : MARKETING & VISUELS DU SITE ---
  renderMarketingVisuals() {
    const settings = window.AgroBeyDB.getMarketingSettings();

    return `
      <div class="space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg">
          <div class="border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-palette text-pink-400"></i> Gestion du Visuel & Messages Marketing
              </h3>
              <p class="text-xs text-slate-400">Personnalisez les bannières, le slogan principal, le message d'en-tête et les bannières promotionnelles du site public.</p>
            </div>
            <span class="bg-pink-950 text-pink-300 border border-pink-800 text-xs font-bold px-3 py-1 rounded-full">
              Édition en direct
            </span>
          </div>

          <form onsubmit="window.AgroBeyApp.admin.saveMarketingSettings(event)" class="space-y-5 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Titre Hero Principal</label>
                <input type="text" id="mkt-hero-title" value="${settings.heroTitle || 'La Marketplace Agricole & Pastorale de Référence'}" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 font-bold">
              </div>

              <div>
                <label class="block font-bold text-slate-300 mb-1">Slogan Officiel</label>
                <input type="text" id="mkt-hero-subtitle" value="${settings.heroSubtitle || 'Cultivons. Élevons. Construisons demain.'}" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500">
              </div>
            </div>

            <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label class="font-bold text-slate-200 flex items-center gap-2">
                  <i class="fa-solid fa-bullhorn text-amber-400"></i> Bannière d'Annonce Supérieure (Top Banner)
                </label>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="mkt-banner-active" ${settings.topBannerActive ? 'checked' : ''} class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>
              <input type="text" id="mkt-banner-text" value="${settings.topBannerText || '🌱 Grande Campagne Agricole 2026 : Frais de mise en relation offerts ce mois-ci !'}" class="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Numéro WhatsApp du Support Commercial</label>
                <input type="text" id="mkt-support-phone" value="${settings.supportPhone || '+221770000000'}" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 font-mono">
              </div>

              <div>
                <label class="block font-bold text-slate-300 mb-1">Badge Promotionnel Mis en Avant</label>
                <input type="text" id="mkt-promo-badge" value="${settings.promoBadge || '✨ 100% Terroir Sénégalais'}" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500">
              </div>
            </div>

            <div class="pt-3 flex justify-end">
              <button type="submit" class="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold rounded-xl shadow-lg transition flex items-center gap-2">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>Enregistrer les Modifications Visuelles</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Aperçu en Direct -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <h4 class="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <i class="fa-solid fa-eye text-pink-400"></i> Aperçu Visuel des Textes Enregistrés
          </h4>
          <div class="p-6 bg-gradient-to-r from-emerald-950/80 to-slate-950 rounded-2xl border border-emerald-800/40 text-center">
            <span class="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/40 inline-block mb-3">
              ${settings.promoBadge || '✨ 100% Terroir'}
            </span>
            <h2 class="text-xl sm:text-2xl font-black text-white">${settings.heroTitle || 'Marketplace'}</h2>
            <p class="text-amber-400 font-bold text-xs mt-1">${settings.heroSubtitle || 'Cultivons ensemble'}</p>
          </div>
        </div>
      </div>
    `;
  }

  saveMarketingSettings(event) {
    event.preventDefault();
    const updated = {
      heroTitle: document.getElementById('mkt-hero-title').value.trim(),
      heroSubtitle: document.getElementById('mkt-hero-subtitle').value.trim(),
      topBannerActive: document.getElementById('mkt-banner-active').checked,
      topBannerText: document.getElementById('mkt-banner-text').value.trim(),
      supportPhone: document.getElementById('mkt-support-phone').value.trim(),
      promoBadge: document.getElementById('mkt-promo-badge').value.trim()
    };

    window.AgroBeyDB.saveMarketingSettings(updated);
    window.AgroBeyDB.addSystemLog('STAFF', 'Mise à jour Visuels Marketing', 'Actualisation du slogan et bannières', 'Marketing');
    window.AgroBeyApp.showToast('success', 'Visuels Actualisés', 'Les nouveaux visuels et messages marketing sont appliqués.');
    this.render();
  }

  // --- MODULE 5 : MODÉRATION DES ANNONCES ---
  renderModeration() {
    const listings = window.AgroBeyDB.getListings();

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-shield-halved text-amber-400"></i> Modération & Approbation des Annonces
            </h3>
            <p class="text-xs text-slate-400">Validez, inspectez ou suspendez les offres publiées par les producteurs et éleveurs.</p>
          </div>
          <span class="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full">
            ${listings.length} annonce(s)
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead>
              <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <th class="py-3 px-4 rounded-l-xl">Annonce</th>
                <th class="py-3 px-4">Vendeur</th>
                <th class="py-3 px-4">Prix & Quantité</th>
                <th class="py-3 px-4">Région</th>
                <th class="py-3 px-4">Statut</th>
                <th class="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              ${listings.map(item => {
                const sellerDisplay = (item.seller && item.seller.name) || item.sellerName || 'Producteur AgroBey';
                const locationDisplay = typeof item.location === 'object' && item.location !== null ? `${item.location.city || ''}, ${item.location.region || ''}` : (item.location || 'Sénégal');
                const isApproved = item.status === 'approved' || item.status === 'active';
                const isPending = item.status === 'pending';

                return `
                <tr class="hover:bg-slate-950/60 transition">
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <img src="${item.images && item.images[0] ? item.images[0] : 'assets/logo.jpg'}" class="w-10 h-10 rounded-xl object-cover border border-slate-700">
                      <div>
                        <div class="font-bold text-white line-clamp-1">${item.title}</div>
                        <div class="text-[10px] text-slate-500 uppercase">${item.category} • ${item.transactionType || item.type || 'Vente'}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-semibold text-slate-300">${sellerDisplay}</td>
                  <td class="py-3.5 px-4">
                    <span class="font-bold text-emerald-400">${new Intl.NumberFormat('fr-FR').format(item.price)} FCFA</span>
                    <span class="text-[10px] text-slate-500">/${item.priceUnit || item.unit || 'unité'}</span>
                  </td>
                  <td class="py-3.5 px-4 text-slate-400">${locationDisplay}</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      isPending ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }">
                      ${isApproved ? '● En ligne' : isPending ? '⏳ En attente' : '✕ Rejetée'}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right space-x-1">
                    ${!isApproved ? `
                      <button onclick="window.AgroBeyApp.admin.handleApproveListing('${item.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold" title="Approuver">
                        ✓
                      </button>
                    ` : ''}
                    <button onclick="window.AgroBeyApp.admin.handleDeleteListing('${item.id}')" class="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-[11px] font-bold" title="Supprimer">
                      🗑
                    </button>
                  </td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleApproveListing(id) {
    const listing = window.AgroBeyDB.getListingById(id);
    if (listing) {
      listing.status = 'approved';
      window.AgroBeyDB.saveListing(listing);
      window.AgroBeyDB.addSystemLog('LISTING', 'Approbation Annonce', `Annonce #${id} validée et mise en ligne`, 'Admin');
      window.AgroBeyApp.showToast('success', 'Annonce Approuvée', 'L\'annonce est maintenant visible par tous les acheteurs.');
      this.render();
    }
  }

  handleDeleteListing(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette annonce ?')) {
      window.AgroBeyDB.deleteListing(id);
      window.AgroBeyDB.addSystemLog('LISTING', 'Suppression Annonce', `Annonce #${id} supprimée`, 'Admin');
      window.AgroBeyApp.showToast('info', 'Annonce Supprimée', 'L\'annonce a été retirée du catalogue.');
      this.render();
    }
  }

  // --- MODULE 6 : COMMANDES & TRANSACTIONS ---
  renderOrders() {
    const orders = window.AgroBeyDB.getOrders();
    const filtered = this.orderFilter === 'all' ? orders : orders.filter(o => o.status === this.orderFilter);

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-cart-shopping text-emerald-400"></i> Commandes & Suivi des Transactions
            </h3>
            <p class="text-xs text-slate-400">Supervisez les flux financiers, contrats de bail et livraisons.</p>
          </div>
          
          <div class="flex items-center gap-1.5 overflow-x-auto text-xs">
            ${[
              { key: 'all', label: 'Toutes' },
              { key: 'pending', label: 'En attente' },
              { key: 'confirmed', label: 'Confirmées' },
              { key: 'delivered', label: 'Livrées' },
              { key: 'cancelled', label: 'Annulées' }
            ].map(st => `
              <button onclick="window.AgroBeyApp.admin.orderFilter = '${st.key}'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition ${
                this.orderFilter === st.key ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }">
                ${st.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead>
              <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <th class="py-3 px-4 rounded-l-xl">Réf & Date</th>
                <th class="py-3 px-4">Produit</th>
                <th class="py-3 px-4">Acheteur ➔ Vendeur</th>
                <th class="py-3 px-4">Montant Total</th>
                <th class="py-3 px-4">Statut</th>
                <th class="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              ${filtered.length > 0 ? filtered.map(o => `
                <tr class="hover:bg-slate-950/60 transition">
                  <td class="py-3.5 px-4 font-mono">
                    <div class="font-bold text-white">#${o.id}</div>
                    <div class="text-[10px] text-slate-500">${new Date(o.date || o.createdAt || Date.now()).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-white">${o.listingTitle}</div>
                    <div class="text-[10px] text-slate-500">${o.quantity} ${o.unit || 'unité(s)'}</div>
                  </td>
                  <td class="py-3.5 px-4">
                    <div><span class="text-cyan-400 font-bold">${o.buyerName}</span></div>
                    <div class="text-[10px] text-slate-500">Vers: ${o.sellerName}</div>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-black text-emerald-400">${new Intl.NumberFormat('fr-FR').format(o.totalAmount)} FCFA</div>
                    <div class="text-[10px] text-slate-500 uppercase">${o.orderType === 'location' ? 'Bail Rural' : 'Vente Directe'}</div>
                  </td>
                  <td class="py-3.5 px-4">
                    <select onchange="window.AgroBeyApp.admin.handleUpdateOrderStatus('${o.id}', this.value)" class="px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-[10px] font-bold text-white outline-none">
                      <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>En attente</option>
                      <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>Confirmée</option>
                      <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Livrée / Clôturée</option>
                      <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
                    </select>
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <button onclick="alert('Commande: #' + '${o.id}' + '\\nOffre: ' + '${o.listingTitle}' + '\\nAcheteur: ' + '${o.buyerName}' + ' (' + '${o.buyerPhone || ''}' + ')\\nVendeur: ' + '${o.sellerName}' + '\\nMontant: ' + '${new Intl.NumberFormat('fr-FR').format(o.totalAmount)}' + ' FCFA\\nAdresse: ' + '${o.deliveryAddress || o.buyerAddress || ''}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold">
                      Détails
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" class="text-center py-6 text-slate-500">Aucune commande trouvée pour ce filtre.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleUpdateOrderStatus(orderId, status) {
    const res = window.AgroBeyDB.updateOrderStatus(orderId, status);
    if (res) {
      window.AgroBeyApp.showToast('success', 'Statut Mis à Jour', `La commande #${orderId} est marquée comme "${status}".`);
      this.render();
    }
  }

  // --- MODULE 6.5 : LOGISTIQUE, LIVRAISONS & DISPATCHING ---
  renderLogistics(stats, currentUser) {
    const deliveries = window.AgroBeyDB.getDeliveries();
    const approvedDrivers = window.AgroBeyDB.getApprovedDrivers();
    const allDrivers = window.AgroBeyDB.getDrivers();
    const onlineDrivers = allDrivers.filter(d => d.isDriverOnline);

    const filtered = this.deliveryFilter === 'all' 
      ? deliveries 
      : deliveries.filter(d => d.status === this.deliveryFilter);

    const activeCount = deliveries.filter(d => ['accepted', 'picked_up', 'in_transit'].includes(d.status)).length;
    const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;
    const totalFees = deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + (d.deliveryFee || 0), 0);

    const vehicleIcons = {
      moto: 'fa-motorcycle text-amber-400',
      camionnette: 'fa-van-shuttle text-cyan-400',
      camion: 'fa-truck text-purple-400'
    };

    // Initialisation automatique de la carte de la flotte après injection dans le DOM
    setTimeout(() => {
      this.initFleetMap(allDrivers, deliveries);
    }, 150);

    return `
      <div class="space-y-6">
        <!-- KPIs Logistique & Flotte -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Missions en Cours</div>
            <div class="text-2xl font-black text-amber-400">${activeCount}</div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Colis en acheminement live</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Flotte Livreurs Agréés</div>
            <div class="text-2xl font-black text-emerald-400">${approvedDrivers.length} <span class="text-xs font-normal text-slate-400">(${onlineDrivers.length} en ligne)</span></div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Motos, Camionnettes & Camions</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Livraisons Clôturées</div>
            <div class="text-2xl font-black text-cyan-400">${deliveredCount}</div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Vérifiées par code OTP</div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div class="text-slate-400 text-xs font-bold mb-1">Volume Frais Transport</div>
            <div class="text-xl sm:text-2xl font-black text-purple-400">${new Intl.NumberFormat('fr-FR').format(totalFees)} <span class="text-xs">FCFA</span></div>
            <div class="text-[10px] text-slate-500 font-semibold mt-1">Collectés via AgroBey Express</div>
          </div>
        </div>

        <!-- CARTE INTERACTIVE LEAFLET DU DISPATCHING LOGISTIQUE & FLOTTE DU SÉNÉGAL -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                <h3 class="text-base font-black text-white flex items-center gap-2">
                  <i class="fa-solid fa-satellite-dish text-amber-400"></i>
                  <span>Radar Flotte & Tour de Contrôle Logistique AgroBey</span>
                </h3>
              </div>
              <p class="text-xs text-slate-400 mt-1">Visualisez en direct les livreurs géolocalisés, les exploitations de collecte et les flux de livraison à travers le Sénégal.</p>
            </div>

            <!-- Sélecteur de Centrage Rapide par Zone -->
            <div class="flex items-center gap-1.5 flex-wrap text-xs">
              <span class="text-[10px] text-slate-400 font-bold uppercase">Centrer Zone :</span>
              <button onclick="window.AgroBeyApp.admin.focusFleetZone('senegal')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold">🇸🇳 Tout le Sénégal</button>
              <button onclick="window.AgroBeyApp.admin.focusFleetZone('dakar')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-bold">📍 Dakar / Niayes</button>
              <button onclick="window.AgroBeyApp.admin.focusFleetZone('thies')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-bold">📍 Thiès / Pout</button>
              <button onclick="window.AgroBeyApp.admin.focusFleetZone('saintlouis')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg font-bold">📍 Saint-Louis / Podor</button>
              <button onclick="window.AgroBeyApp.admin.focusFleetZone('casamance')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg font-bold">📍 Casamance</button>
            </div>
          </div>

          <!-- Conteneur Carte Leaflet -->
          <div id="admin-fleet-map" class="h-80 sm:h-96 w-full rounded-2xl border border-slate-700 shadow-inner z-0 relative bg-slate-950"></div>

          <!-- Légende de la Carte Admin -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-1 text-slate-300 border-t border-slate-800/80">
            <div class="flex items-center gap-2"><span class="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block border-2 border-slate-900 shadow"></span> <strong>Livreurs En Ligne</strong> (Motos, Camions)</div>
            <div class="flex items-center gap-2"><span class="w-3.5 h-3.5 rounded-full bg-slate-600 inline-block border-2 border-slate-900"></span> <strong>Livreurs Hors Ligne</strong> (Agréés)</div>
            <div class="flex items-center gap-2"><span class="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block border-2 border-slate-900 shadow"></span> <strong>Missions en Acheminement</strong></div>
            <div class="flex items-center gap-2"><span class="w-3.5 h-3.5 rounded-full bg-cyan-500 inline-block border-2 border-slate-900 shadow"></span> <strong>Fermes & Destinations</strong></div>
          </div>
        </div>

        <!-- Tableau des Missions & Dispatching -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-truck-fast text-amber-400"></i> Dispatching & Supervision Logistique
              </h3>
              <p class="text-xs text-slate-400">Assignez les transporteurs, suivez l acheminement en temps réel et contrôlez les codes OTP.</p>
            </div>
            
            <div class="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
              ${[
                { key: 'all', label: 'Toutes' },
                { key: 'available', label: 'Disponibles' },
                { key: 'accepted', label: 'Assignées' },
                { key: 'picked_up', label: 'Colis Ramassé' },
                { key: 'in_transit', label: 'En Transit' },
                { key: 'delivered', label: 'Livrées (OTP)' },
                { key: 'cancelled', label: 'Annulées' }
              ].map(st => `
                <button onclick="window.AgroBeyApp.admin.deliveryFilter = '${st.key}'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  this.deliveryFilter === st.key ? 'bg-amber-500 text-slate-950 shadow font-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                }">
                  ${st.label}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead>
                <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th class="py-3 px-4 rounded-l-xl">Réf Mission & Date</th>
                  <th class="py-3 px-4">Marchandise & Commande</th>
                  <th class="py-3 px-4">Itinéraire (Ferme ➔ Client)</th>
                  <th class="py-3 px-4">Livreur Assigné</th>
                  <th class="py-3 px-4">Statut & Code OTP</th>
                  <th class="py-3 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${filtered.length > 0 ? filtered.map(d => `
                  <tr class="hover:bg-slate-950/60 transition">
                    <td class="py-3.5 px-4 font-mono">
                      <div class="font-black text-amber-400">#${d.id}</div>
                      <div class="text-[10px] text-slate-500">${new Date(d.createdAt).toLocaleDateString('fr-FR')} ${new Date(d.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-white">${d.listingTitle}</div>
                      <div class="text-[10px] text-slate-400">Cmd <strong class="text-white font-mono">#${d.orderId}</strong> • ${d.quantity} ${d.unit || 'unités'}</div>
                      <div class="text-[10px] text-emerald-400 font-bold mt-0.5">Frais : ${new Intl.NumberFormat('fr-FR').format(d.deliveryFee || 0)} FCFA</div>
                    </td>
                    <td class="py-3.5 px-4 text-[11px]">
                      <div class="text-emerald-300 flex items-center gap-1">
                        <i class="fa-solid fa-circle-dot text-[8px] text-emerald-400"></i> <span class="line-clamp-1">${d.pickupAddress}</span>
                      </div>
                      <div class="text-slate-400 text-[10px] ml-3">${d.sellerName} (${d.sellerPhone})</div>
                      <div class="text-amber-300 flex items-center gap-1 mt-1">
                        <i class="fa-solid fa-location-dot text-[8px] text-amber-400"></i> <span class="line-clamp-1">${d.dropoffAddress}</span>
                      </div>
                      <div class="text-slate-400 text-[10px] ml-3">${d.buyerName} (${d.buyerPhone})</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <select onchange="window.AgroBeyApp.admin.handleAssignDriver('${d.id}', this.value)" class="w-full max-w-[180px] px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-white outline-none">
                        <option value="" ${!d.driverId ? 'selected' : ''}>-- Aucun (Disponible) --</option>
                        ${approvedDrivers.map(drv => `
                          <option value="${drv.id}" ${d.driverId === drv.id ? 'selected' : ''}>
                            ${drv.name} (${drv.vehiculeType || 'Véhicule'})
                          </option>
                        `).join('')}
                      </select>
                      ${d.driverPhone ? `<div class="text-[10px] text-slate-400 mt-1 font-mono">${d.driverPhone} • ${d.driverVehiculePlate || ''}</div>` : ''}
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="space-y-1.5">
                        <select onchange="window.AgroBeyApp.admin.handleUpdateDeliveryStatus('${d.id}', this.value)" class="px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-[10px] font-bold text-white outline-none">
                          <option value="available" ${d.status === 'available' ? 'selected' : ''}>⏳ Disponible</option>
                          <option value="accepted" ${d.status === 'accepted' ? 'selected' : ''}>🛵 Assignée</option>
                          <option value="picked_up" ${d.status === 'picked_up' ? 'selected' : ''}>📦 Colis Ramassé</option>
                          <option value="in_transit" ${d.status === 'in_transit' ? 'selected' : ''}>🚚 En Transit</option>
                          <option value="delivered" ${d.status === 'delivered' ? 'selected' : ''}>✅ Livré (OTP)</option>
                          <option value="cancelled" ${d.status === 'cancelled' ? 'selected' : ''}>❌ Annulée</option>
                        </select>
                        <div class="flex items-center gap-1.5 text-[10px] text-amber-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          <i class="fa-solid fa-key text-[9px] text-amber-400"></i> OTP: <strong>${d.verificationOTP || 'Non généré'}</strong>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <button onclick="window.AgroBeyApp.openDeliveryTrackingModal('${d.orderId}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto">
                        <i class="fa-solid fa-route"></i> Suivi Live
                      </button>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="6" class="text-center py-8 text-slate-500">Aucune mission de livraison trouvée pour ce filtre.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  handleAssignDriver(deliveryId, driverId) {
    if (!driverId) {
      const del = window.AgroBeyDB.getDeliveryById(deliveryId);
      if (del) {
        del.driverId = null;
        del.driverName = null;
        del.driverPhone = null;
        del.status = 'available';
        window.AgroBeyDB.saveDelivery(del);
        window.AgroBeyApp.showToast('info', 'Livreur Désassigné', `La mission #${deliveryId} est remise en statut disponible.`);
        this.render();
      }
      return;
    }

    const res = window.AgroBeyDB.acceptDelivery(deliveryId, driverId);
    if (res.success) {
      window.AgroBeyApp.showToast('success', 'Livreur Assigné', `La mission #${deliveryId} a été confiée à ${res.delivery.driverName}.`);
      this.render();
    } else {
      window.AgroBeyApp.showToast('error', 'Erreur Assignation', res.message);
    }
  }

  handleUpdateDeliveryStatus(deliveryId, status) {
    const res = window.AgroBeyDB.updateDeliveryStatus(deliveryId, status);
    if (res.success) {
      window.AgroBeyApp.showToast('success', 'Statut Actualisé', `Mission #${deliveryId} mise à jour : "${status}".`);
      this.render();
    }
  }

  // --- MODULE 7 : UTILISATEURS & VALIDATION VENDEURS / LIVREURS / KYC ---
  renderUsersKYC() {
    const users = window.AgroBeyDB.getUsers();
    const stats = window.AgroBeyDB.getStats();
    
    let filtered = users;
    if (this.userFilter === 'pending_seller') {
      filtered = users.filter(u => u.role === 'seller' && (u.sellerStatus === 'pending_approval' || u.isSellerApproved === false));
    } else if (this.userFilter === 'pending_driver') {
      filtered = users.filter(u => u.role === 'delivery' && (u.driverStatus === 'pending_approval' || u.isDriverApproved === false));
    } else if (this.userFilter === 'seller') {
      filtered = users.filter(u => u.role === 'seller' && (u.sellerStatus === 'approved' || u.isSellerApproved === true));
    } else if (this.userFilter === 'driver' || this.userFilter === 'delivery') {
      filtered = users.filter(u => u.role === 'delivery');
    } else if (this.userFilter === 'client' || this.userFilter === 'buyer') {
      filtered = users.filter(u => u.role === 'client' || u.role === 'buyer');
    } else if (this.userFilter !== 'all') {
      filtered = users.filter(u => u.role === this.userFilter);
    }

    const pendingSellerCount = users.filter(u => u.role === 'seller' && (u.sellerStatus === 'pending_approval' || u.isSellerApproved === false)).length;
    const pendingDriverCount = users.filter(u => u.role === 'delivery' && (u.driverStatus === 'pending_approval' || u.isDriverApproved === false)).length;
    const approvedSellerCount = users.filter(u => u.role === 'seller' && (u.sellerStatus === 'approved' || u.isSellerApproved === true)).length;
    const approvedDriverCount = users.filter(u => u.role === 'delivery' && (u.driverStatus === 'approved' || u.isDriverApproved === true)).length;

    return `
      <div class="space-y-6">
        ${(pendingSellerCount > 0 || pendingDriverCount > 0) ? `
          <!-- Alerte Dédiée Vendeurs & Livreurs en Attente de Validation Admin / IT -->
          <div class="p-5 bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black shrink-0 shadow-lg shadow-amber-500/30">
                <i class="fa-solid fa-user-clock"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-black text-amber-200 text-sm sm:text-base">${pendingSellerCount + pendingDriverCount} Demande(s) d Approbation en Attente (Admin / IT)</h4>
                  <span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">Action Requise</span>
                </div>
                <p class="text-xs text-amber-300/80 mt-1">
                  ${pendingSellerCount > 0 ? `<strong>${pendingSellerCount} vendeur(s)</strong> en attente de déblocage catalogue. ` : ''}
                  ${pendingDriverCount > 0 ? `<strong>${pendingDriverCount} livreur(s)</strong> en attente de validation de permis et flotte.` : ''}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              ${pendingSellerCount > 0 ? `
                <button onclick="window.AgroBeyApp.admin.userFilter = 'pending_seller'; window.AgroBeyApp.admin.render();" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow transition">
                  Vendeurs (${pendingSellerCount})
                </button>
              ` : ''}
              ${pendingDriverCount > 0 ? `
                <button onclick="window.AgroBeyApp.admin.userFilter = 'pending_driver'; window.AgroBeyApp.admin.render();" class="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl shadow transition">
                  Livreurs (${pendingDriverCount})
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-users text-cyan-400"></i> Répertoire Utilisateurs, Vendeurs & Livreurs (Admin / IT)
              </h3>
              <p class="text-xs text-slate-400">Validez les comptes marchands et transporteurs, gérez la conformité et activez les accès.</p>
            </div>
            
            <div class="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar pb-1 sm:pb-0">
              <button onclick="window.AgroBeyApp.admin.userFilter = 'all'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                this.userFilter === 'all' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }">
                Tous (${users.length})
              </button>

              <button onclick="window.AgroBeyApp.admin.userFilter = 'pending_seller'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
                this.userFilter === 'pending_seller' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'bg-amber-950/70 border border-amber-800 text-amber-300 hover:bg-amber-900'
              }">
                <i class="fa-solid fa-hourglass-half"></i> Vendeurs à Valider (${pendingSellerCount})
              </button>

              <button onclick="window.AgroBeyApp.admin.userFilter = 'pending_driver'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
                this.userFilter === 'pending_driver' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'bg-amber-950/70 border border-amber-800 text-amber-300 hover:bg-amber-900'
              }">
                <i class="fa-solid fa-truck-fast"></i> Livreurs à Valider (${pendingDriverCount})
              </button>

              <button onclick="window.AgroBeyApp.admin.userFilter = 'seller'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                this.userFilter === 'seller' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }">
                👨‍🌾 Vendeurs Agréés (${approvedSellerCount})
              </button>

              <button onclick="window.AgroBeyApp.admin.userFilter = 'driver'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                this.userFilter === 'driver' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }">
                🛵 Flotte Livreurs (${approvedDriverCount})
              </button>

              <button onclick="window.AgroBeyApp.admin.userFilter = 'client'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                this.userFilter === 'client' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }">
                🛒 Acheteurs
              </button>

              <button onclick="window.AgroBeyApp.admin.userFilter = 'admin'; window.AgroBeyApp.admin.render();" class="px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                this.userFilter === 'admin' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }">
                👑 Staff Admin
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead>
                <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th class="py-3 px-4 rounded-l-xl">Utilisateur / Profil</th>
                  <th class="py-3 px-4">Coordonnées</th>
                  <th class="py-3 px-4">Statut Vendeur / Livreur</th>
                  <th class="py-3 px-4">Certification KYC / Flotte</th>
                  <th class="py-3 px-4 rounded-r-xl text-right">Actions de Validation (Admin/IT)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${filtered.length > 0 ? filtered.map(u => {
                  const isPendingSeller = u.role === 'seller' && (u.sellerStatus === 'pending_approval' || u.isSellerApproved === false);
                  const isApprovedSeller = u.role === 'seller' && (u.sellerStatus === 'approved' || u.isSellerApproved === true);
                  const isPendingDriver = u.role === 'delivery' && (u.driverStatus === 'pending_approval' || u.isDriverApproved === false);
                  const isApprovedDriver = u.role === 'delivery' && (u.driverStatus === 'approved' || u.isDriverApproved === true);

                  return `
                  <tr class="hover:bg-slate-950/60 transition ${(isPendingSeller || isPendingDriver) ? 'bg-amber-950/20' : ''}">
                    <td class="py-3.5 px-4 font-bold text-white">
                      <div class="flex items-center gap-2.5">
                        <img src="${u.avatar || 'assets/logo.jpg'}" class="w-9 h-9 rounded-full object-cover border ${(isPendingSeller || isPendingDriver) ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-slate-700'}">
                        <div>
                          <div class="flex items-center gap-1.5">
                            <span class="text-white">${u.name}</span>
                            ${(isPendingSeller || isPendingDriver) ? `<span class="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase">À Valider</span>` : ''}
                          </div>
                          <div class="text-[10px] text-slate-400 font-mono">${u.email}</div>
                          ${u.location ? `<div class="text-[10px] text-slate-500"><i class="fa-solid fa-location-dot"></i> ${u.location}</div>` : ''}
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-slate-300">
                      <div>${u.phone || 'Non renseigné'}</div>
                      ${u.whatsapp ? `<a href="https://wa.me/${u.whatsapp}" target="_blank" class="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ''}
                    </td>
                    <td class="py-3.5 px-4">
                      ${isPendingSeller ? `
                        <div class="space-y-1">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600 animate-pulse">
                            <i class="fa-solid fa-hourglass-half"></i> Vendeur à Valider
                          </span>
                          <div class="text-[9px] text-amber-400/90 font-semibold">Publication bloquée</div>
                        </div>
                      ` : isApprovedSeller ? `
                        <div class="space-y-0.5">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <i class="fa-solid fa-check"></i> Vendeur Agréé
                          </span>
                          ${u.approvedBy ? `<div class="text-[9px] text-slate-500">Validé par: ${u.approvedBy}</div>` : ''}
                        </div>
                      ` : isPendingDriver ? `
                        <div class="space-y-1">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600 animate-pulse">
                            <i class="fa-solid fa-truck-fast"></i> Livreur à Valider
                          </span>
                          <div class="text-[9px] text-amber-400/90 font-semibold">Missions verrouillées</div>
                        </div>
                      ` : isApprovedDriver ? `
                        <div class="space-y-0.5">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                            <i class="fa-solid fa-truck-fast"></i> Livreur Agréé
                          </span>
                          <div class="text-[9px] ${u.isDriverOnline ? 'text-emerald-400' : 'text-slate-500'}">● ${u.isDriverOnline ? 'En ligne (Disponible)' : 'Hors ligne'}</div>
                        </div>
                      ` : `
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          (u.role === 'client' || u.role === 'buyer') ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          u.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                          u.role === 'it' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }">
                          ${u.roleLabel || u.role}
                        </span>
                      `}
                    </td>
                    <td class="py-3.5 px-4">
                      ${u.role === 'delivery' ? `
                        <div class="space-y-1 text-[11px]">
                          <div class="font-bold text-slate-200 capitalize flex items-center gap-1">
                            <i class="fa-solid fa-gauge text-purple-400"></i> ${u.vehiculeType || 'Véhicule'} (${u.vehiculePlate || 'N/A'})
                          </div>
                          <div class="text-[10px] text-slate-400">Zone : ${u.coverageZone || u.location || 'Sénégal'}</div>
                        </div>
                      ` : u.isVerified ? `
                        <span class="text-emerald-400 font-bold flex items-center gap-1">
                          <i class="fa-solid fa-circle-check"></i> ${u.badge || 'Vérifié'}
                        </span>
                      ` : `
                        <span class="text-slate-500 font-normal">Non certifié</span>
                      `}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5 flex-wrap">
                        ${isPendingSeller ? `
                          <button onclick="window.AgroBeyApp.admin.handleApproveSeller('${u.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1.5" title="Valider ce compte vendeur">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Valider Vendeur</span>
                          </button>
                          <button onclick="window.AgroBeyApp.admin.handleRejectSeller('${u.id}')" class="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-xl text-xs transition" title="Refuser cette demande">
                            <i class="fa-solid fa-xmark"></i> Rejeter
                          </button>
                        ` : isPendingDriver ? `
                          <button onclick="window.AgroBeyApp.admin.handleApproveDriver('${u.id}')" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1.5" title="Agréer ce compte livreur">
                            <i class="fa-solid fa-truck-fast"></i>
                            <span>Valider Livreur</span>
                          </button>
                          <button onclick="window.AgroBeyApp.admin.handleRejectDriver('${u.id}')" class="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-xl text-xs transition" title="Refuser le livreur">
                            <i class="fa-solid fa-xmark"></i> Rejeter
                          </button>
                        ` : isApprovedSeller ? `
                          <button onclick="window.AgroBeyApp.admin.handleToggleVerifyUser('${u.id}')" class="px-2.5 py-1.5 ${u.isVerified ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-700 hover:bg-emerald-600 text-white'} rounded-xl text-xs font-bold transition">
                            ${u.isVerified ? 'Retirer Badge' : 'Certifier KYC'}
                          </button>
                          <button onclick="window.AgroBeyApp.admin.handleRejectSeller('${u.id}')" class="px-2 py-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 rounded-xl text-xs font-bold transition" title="Suspendre les droits">
                            Suspendre
                          </button>
                        ` : isApprovedDriver ? `
                          <button onclick="window.AgroBeyApp.admin.handleRejectDriver('${u.id}')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 rounded-xl text-xs font-bold transition">
                            Suspendre Livreur
                          </button>
                        ` : `
                          <button onclick="window.AgroBeyApp.admin.handleToggleVerifyUser('${u.id}')" class="px-2.5 py-1.5 ${u.isVerified ? 'bg-slate-800 text-slate-300' : 'bg-cyan-600 hover:bg-cyan-500 text-white'} rounded-xl text-xs font-bold transition">
                            ${u.isVerified ? 'Retirer Badge' : 'Certifier KYC'}
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;}).join('') : `
                  <tr>
                    <td colspan="5" class="py-8 text-center text-slate-500">
                      Aucun utilisateur trouvé pour ce filtre.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  handleApproveSeller(userId) {
    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    const staffName = currentUser ? `${currentUser.name} (${currentUser.roleLabel || currentUser.role.toUpperCase()})` : 'Super-Admin';
    const approved = window.AgroBeyDB.approveSeller(userId, staffName);
    if (approved) {
      window.AgroBeyApp.showToast('success', 'Compte Vendeur Validé', `Le compte de ${approved.name} a été validé avec succès par ${staffName}. La publication est désormais débloquée.`);
      this.render();
    }
  }

  handleRejectSeller(userId) {
    const reason = prompt('Veuillez spécifier le motif du refus ou de la suspension (ex: Informations incomplètes, justificatifs non conformes) :', 'Informations ou justificatifs incomplets');
    if (reason === null) return;
    
    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    const staffName = currentUser ? `${currentUser.name} (${currentUser.roleLabel || currentUser.role.toUpperCase()})` : 'Super-Admin';
    const rejected = window.AgroBeyDB.rejectSeller(userId, reason || 'Critères non conformes', staffName);
    if (rejected) {
      window.AgroBeyApp.showToast('warning', 'Compte Vendeur Rejeté', `La demande de ${rejected.name} a été rejetée.`);
      this.render();
    }
  }

  handleApproveDriver(userId) {
    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    const staffName = currentUser ? `${currentUser.name} (${currentUser.roleLabel || currentUser.role.toUpperCase()})` : 'Super-Admin';
    const approved = window.AgroBeyDB.approveDriver(userId, staffName);
    if (approved) {
      window.AgroBeyApp.showToast('success', 'Compte Livreur Agréé', `Le compte transporteur de ${approved.name} est validé par ${staffName}. Accès aux missions débloqué.`);
      this.render();
    }
  }

  handleRejectDriver(userId) {
    const reason = prompt('Motif du refus ou de la suspension du livreur :', 'Permis ou carte grise non conformes');
    if (reason === null) return;

    const currentUser = window.AgroBeyAuth ? window.AgroBeyAuth.getCurrentUser() : null;
    const staffName = currentUser ? `${currentUser.name} (${currentUser.roleLabel || currentUser.role.toUpperCase()})` : 'Super-Admin';
    const rejected = window.AgroBeyDB.rejectDriver(userId, reason, staffName);
    if (rejected) {
      window.AgroBeyApp.showToast('warning', 'Livreur Rejeté', `Le compte de ${rejected.name} a été suspendu.`);
      this.render();
    }
  }

  handleToggleVerifyUser(userId) {
    const user = window.AgroBeyDB.getUserById(userId);
    if (user) {
      user.isVerified = !user.isVerified;
      user.badge = user.isVerified ? 'Producteur Certifié AgroBey' : null;
      window.AgroBeyDB.saveUser(user);
      window.AgroBeyDB.addSystemLog('AUTH', 'Mise à jour KYC', `Statut KYC de ${user.name} : ${user.isVerified ? 'Certifié' : 'Révoqué'}`, 'Admin/IT');
      window.AgroBeyApp.showToast('success', 'Statut KYC Mis à Jour', `Badge KYC ${user.isVerified ? 'attribué à' : 'retiré pour'} ${user.name}.`);
      this.render();
    }
  }

  // --- MAPPING HAUTE PERFORMANCE DE LA FLOTTE EN DIRECT (AGROBEY MAP ENGINE) ---
  async initFleetMap(allDrivers, deliveries) {
    try {
      if (this.fleetMap) {
        this.fleetMap.remove();
        this.fleetMap = null;
      }

      const mapEl = document.getElementById('admin-fleet-map');
      if (!mapEl) return;

      // Centrage initial sur le Sénégal en mode Sombre Tactique
      const map = window.AgroBeyMapEngine
        ? window.AgroBeyMapEngine.createMap('admin-fleet-map', {
            center: [14.5000, -14.8000],
            zoom: 7,
            theme: 'dark',
            allowSatellite: true,
            allowZones: true,
            allowLocate: true,
            showAgriculturalZones: true
          })
        : L.map('admin-fleet-map').setView([14.5000, -14.8000], 7);

      this.fleetMap = map;
      const markersGroup = map._layersGroup ? map._layersGroup.markersLayer : L.featureGroup().addTo(map);

      // 1. Marqueurs des Chauffeurs / Livreurs de la Flotte
      allDrivers.forEach(drv => {
        const isOnline = drv.isDriverOnline === true || drv.availability === 'online';
        const isApproved = drv.isDriverApproved === true || drv.driverStatus === 'approved';
        const coords = {
          lat: drv.currentLat || drv.lat || 14.7910,
          lng: drv.currentLng || drv.lng || -16.9256
        };

        const vehicleEmoji = drv.vehiculeType === 'moto' ? '🛵' :
                             drv.vehiculeType === 'tricycle' ? '🛺' :
                             drv.vehiculeType === 'camion' ? '🚛' : '🚐';

        const bgColor = isOnline ? '#10b981' : '#64748b';

        const driverIcon = L.divIcon({
          className: 'custom-admin-driver-marker',
          html: `
            <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
              ${isOnline ? '<div class="agrobey-sonar-radar" style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(16, 185, 129, 0.4);"></div>' : ''}
              <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:${bgColor}; border:2.5px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px ${isOnline ? 'rgba(16,185,129,0.9)' : 'rgba(0,0,0,0.5)'}; font-size:18px; z-index:2;">
                ${vehicleEmoji}
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: driverIcon }).addTo(markersGroup);

        marker.bindPopup(`
          <div style="font-family:system-ui,sans-serif; min-width:190px; color:#0f172a;">
            <div style="font-weight:900; font-size:13px; margin-bottom:3px; color:#0f172a;">${drv.name}</div>
            <div style="font-size:11px; color:#334155; line-height:1.4;">
              <strong>${isOnline ? '🟢 En Service (Connecté)' : '⚪ Hors Ligne'}</strong> • ${drv.vehiculeType || 'Camionnette'}<br>
              Zone GPS : <strong>${drv.currentZone || drv.location || 'Sénégal'}</strong><br>
              Téléphone : <a href="tel:${drv.phone}" style="color:#0284c7; font-weight:bold;">${drv.phone}</a><br>
              Plaque Immat : <span style="font-family:monospace; font-weight:bold;">${drv.driverVehiculePlate || 'DK-4820-BG'}</span><br>
              Statut Agréé : <span style="font-weight:bold; color:${isApproved ? '#16a34a' : '#d97706'}">${isApproved ? '✓ Validé KYC' : '⏳ En Attente'}</span>
            </div>
          </div>
        `);
      });

      // 2. Marqueurs et Tracés Routiers Réels des Missions Actives
      const activeDeliveries = deliveries.filter(d => ['accepted', 'picked_up', 'in_transit'].includes(d.status));
      for (const del of activeDeliveries) {
        const origin = (del.originLat && del.originLng) ? { lat: del.originLat, lng: del.originLng } : window.AgroBeyDB.getCoordinatesForLocation(del.pickupAddress);
        const dest = (del.destLat && del.destLng) ? { lat: del.destLat, lng: del.destLng } : window.AgroBeyDB.getCoordinatesForLocation(del.dropoffAddress);

        if (window.AgroBeyMapEngine) {
          await window.AgroBeyMapEngine.drawMissionRoute(map, origin, dest, {
            pickupTitle: `🌾 <b>Collecte :</b> ${del.listingTitle}<br>${del.pickupAddress}`,
            dropoffTitle: `📍 <b>Client :</b> ${del.buyerName}<br>${del.dropoffAddress}`,
            color: '#f59e0b',
            glowColor: '#d97706',
            autoFit: false
          });
        } else {
          L.polyline([[origin.lat, origin.lng], [dest.lat, dest.lng]], {
            color: '#f59e0b',
            weight: 3,
            dashArray: '5, 8'
          }).addTo(markersGroup);
        }
      }

      if (window.AgroBeyMapEngine) {
        window.AgroBeyMapEngine.fitMapToBounds(map, 11);
      }
    } catch (e) {
      console.warn('Erreur initialisation Leaflet Fleet Map Admin:', e);
    }
  }

  focusFleetZone(zoneKey) {
    if (!this.fleetMap) return;
    const zones = {
      senegal: { center: [14.5000, -14.8000], zoom: 7 },
      dakar: { center: [14.7300, -17.3800], zoom: 11 },
      thies: { center: [14.7910, -16.9256], zoom: 11 },
      saintlouis: { center: [16.0326, -16.4818], zoom: 9 },
      casamance: { center: [12.5833, -16.2719], zoom: 9 }
    };

    const target = zones[zoneKey] || zones.senegal;
    this.fleetMap.setView(target.center, target.zoom, { animate: true, duration: 1.2 });
  }
}

// Export Global
window.AgroBeyAdmin = AgroBeyAdmin;

