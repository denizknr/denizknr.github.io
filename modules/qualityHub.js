/**
 * Kalite Yönetim Merkezi (Quality Management Hub) Ana Yönetici Modülü
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    // Module Tabs
    const MODULES = [
        { id: 'dashboard', label: 'Genel Bakış', icon: 'fa-solid fa-gauge-high' },
        { id: 'fives', label: '5S & Radar', icon: 'fa-solid fa-chart-pie', badge: 'Aktif' },
        { id: 'ishikawa', label: '5 Neden & Balık Kılçığı', icon: 'fa-solid fa-diagram-project' },
        { id: 'dof', label: 'DÖF / CAPA Takip', icon: 'fa-solid fa-clipboard-check' },
        { id: 'eightd', label: '8D Problem Çözme', icon: 'fa-solid fa-network-wired', badge: 'Yeni' },
        { id: 'kaizen', label: 'Kaizen Aksiyonları', icon: 'fa-solid fa-arrow-trend-up' },
        { id: 'fmea', label: 'FMEA Risk Matrisi', icon: 'fa-solid fa-triangle-exclamation' },
        { id: 'pareto', label: 'Pareto (80/20)', icon: 'fa-solid fa-chart-column' }
    ];

    let currentModule = 'dashboard';

    function initHub() {
        bindTabClicks();
        bindModuleCardClicks();
        updateKpisFromStorage();
        checkUrlHash();
    }

    function bindTabClicks() {
        document.querySelectorAll('.qm-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetMod = btn.getAttribute('data-tab');
                if (targetMod) {
                    switchToModule(targetMod);
                }
            });
        });
    }

    function bindModuleCardClicks() {
        document.querySelectorAll('.btn-launch-module').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetMod = btn.getAttribute('data-target');
                if (targetMod) {
                    switchToModule(targetMod);
                    // Scroll down to active content smoothly
                    const hubNav = document.getElementById('qm-nav-bar');
                    if (hubNav) {
                        hubNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    function switchToModule(moduleId) {
        currentModule = moduleId;

        // Update nav tabs
        document.querySelectorAll('.qm-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === moduleId);
        });

        // Update tab panels
        document.querySelectorAll('.qm-tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `qm-panel-${moduleId}`);
        });

        // Module-specific initializers and chart resizers on active view
        setTimeout(() => {
            if (moduleId === 'fives') {
                window.dispatchEvent(new Event('resize'));
            } else if (moduleId === 'ishikawa' && window.FishboneModule) {
                if (typeof window.FishboneModule.render === 'function') {
                    window.FishboneModule.render();
                }
            } else if (moduleId === 'dof' && window.DofCapaModule) {
                if (typeof window.DofCapaModule.render === 'function') {
                    window.DofCapaModule.render();
                }
            } else if (moduleId === 'eightd' && window.EightDModule) {
                if (typeof window.EightDModule.render === 'function') {
                    window.EightDModule.render();
                }
            } else if (moduleId === 'kaizen' && window.KaizenModule) {
                if (typeof window.KaizenModule.render === 'function') {
                    window.KaizenModule.render();
                }
                window.dispatchEvent(new Event('resize'));
            } else if (moduleId === 'fmea' && window.FmeaModule) {
                if (typeof window.FmeaModule.render === 'function') {
                    window.FmeaModule.render();
                }
            } else if (moduleId === 'pareto' && window.ParetoModule) {
                if (typeof window.ParetoModule.render === 'function') {
                    window.ParetoModule.render();
                }
                window.dispatchEvent(new Event('resize'));
            }
        }, 60);
    }

    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#kalite-')) {
            const mod = hash.replace('#kalite-', '');
            if (MODULES.some(m => m.id === mod)) {
                switchToModule(mod);
            }
        }
    }

    function updateKpisFromStorage() {
        try {
            const savedAudits = JSON.parse(localStorage.getItem('fives_audit_history') || '[]');
            const countElem = document.getElementById('kpi-fives-count');
            if (countElem) {
                countElem.textContent = savedAudits.length || '1';
            }

            if (savedAudits.length > 0) {
                const latest = savedAudits[0];
                const scoreElem = document.getElementById('kpi-5s-score');
                if (scoreElem) {
                    scoreElem.textContent = `%${latest.overallScore}`;
                }
            }
        } catch (err) {
            console.error('KPI update error:', err);
        }
    }

    // Export module
    window.QualityHub = {
        init: initHub,
        switchToModule
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHub);
    } else {
        initHub();
    }
})();
