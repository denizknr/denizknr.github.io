document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. Theme Toggle (Dark / Light Mode)
    // =========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const requestedTheme = new URLSearchParams(window.location.search).get('theme');
    const initialTheme = requestedTheme === 'light' || requestedTheme === 'dark'
        ? requestedTheme
        : (savedTheme || 'dark');
    
    setTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // =========================================================================
    // 2. Mobile Menu Toggle
    // =========================================================================
    const menuToggleBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuIcon = menuToggleBtn.querySelector('i');

    menuToggleBtn.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        menuIcon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuIcon.className = 'fa-solid fa-bars';
            }
        });
    });

    // =========================================================================
    // 3. Smooth Scrolling & Active Nav Highlighting
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project cards start compact and reveal their details on demand.
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const title = card.querySelector('.project-title');
        const links = card.querySelector('.project-links');
        if (!title || !links) return;

        links.querySelectorAll('a').forEach(link => {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', link.getAttribute('title') || 'Proje bağlantısı');
            }
        });

        card.classList.add('is-collapsed');
        title.setAttribute('tabindex', '0');
        title.setAttribute('role', 'button');
        title.setAttribute('aria-expanded', 'false');

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'project-toggle';
        toggle.innerHTML = '<i class="fa-solid fa-chevron-down"></i><span>Detayları Aç</span>';
        toggle.setAttribute('aria-controls', `project-details-${index}`);
        links.appendChild(toggle);

        const description = card.querySelector('.project-desc');
        const technologies = card.querySelector('.project-techs');
        if (description && technologies) {
            const details = document.createElement('div');
            details.id = `project-details-${index}`;
            details.className = 'project-details';
            description.parentNode.insertBefore(details, description);
            details.append(description, technologies);
        }

        const setExpanded = expanded => {
            card.classList.toggle('is-collapsed', !expanded);
            title.setAttribute('aria-expanded', String(expanded));
            toggle.innerHTML = expanded
                ? '<i class="fa-solid fa-chevron-up"></i><span>Detayları Kapat</span>'
                : '<i class="fa-solid fa-chevron-down"></i><span>Detayları Aç</span>';
        };

        const toggleDetails = () => setExpanded(card.classList.contains('is-collapsed'));
        toggle.addEventListener('click', toggleDetails);
        title.addEventListener('click', toggleDetails);
        title.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDetails();
            }
        });
    });

    // Highlight active menu on scroll
    const sections = document.querySelectorAll('header, section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // =========================================================================
    // 4. Scroll to Top Button
    // =========================================================================
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const processChecks = [
        'Doğru ürün, proje ve revizyon bilgisi kullanılıyor mu?',
        'Kablo kesiti teknik dokümana uygun mu?',
        'Terminal numarası ve terminal yönü doğru mu?',
        'Kablo izolasyonu krimp bölgesine doğru mesafede mi?',
        'İletken krimp yüksekliği ve genişliği tolerans içinde mi?',
        'İzolasyon krimpi kabloyu yeterli şekilde kavrıyor mu?',
        'Krimp bölgesinde çatlak, deformasyon veya gevşeklik var mı?',
        'Kablo rengi ve soket pozisyonu teknik resme uygun mu?',
        'Soket kilitleme ve terminal oturma kontrolü tamam mı?',
        'Poke-Yoke ve hata önleme mekanizması doğru çalışıyor mu?',
        'Ürün üzerinde hasar, yabancı parça veya eksik işlem var mı?',
        'Etiket, izlenebilirlik ve son görsel kontrol tamam mı?'
    ];

    const processChecklist = document.getElementById('process-checklist');
    const processState = processChecks.map(() => ({ status: '', note: '' }));
    const processScore = document.getElementById('process-score');
    const processCount = document.getElementById('process-count');
    const processOkCount = document.getElementById('process-ok-count');
    const processConditionalCount = document.getElementById('process-conditional-count');
    const processNokCount = document.getElementById('process-nok-count');
    const processDecision = document.getElementById('process-decision');
    const processStatus = document.getElementById('process-status');
    const processStandardOptions = document.getElementById('process-standard-options');
    const processStandardCount = document.getElementById('process-standard-count');

    function getSelectedProcessStandards() {
        return processStandardOptions
            ? [...processStandardOptions.querySelectorAll('input:checked')].map(input => input.value)
            : [];
    }

    function updateProcessStandardCount() {
        const count = getSelectedProcessStandards().length;
        if (processStandardCount) processStandardCount.textContent = `${count} standart seçildi`;
    }

    processStandardOptions?.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', updateProcessStandardCount);
    });

    function renderProcessChecklist() {
        if (!processChecklist) return;
        processChecklist.innerHTML = processChecks.map((label, index) => {
            const item = processState[index];
            return `
                <div class="process-check-item">
                    <span class="process-check-number">${index + 1}</span>
                    <span class="process-check-text">${label}</span>
                    <div class="process-choice-group">
                        <button type="button" class="process-choice ${item.status === 'ok' ? 'active-ok' : ''}" data-process-index="${index}" data-process-status="ok">Uygun</button>
                        <button type="button" class="process-choice ${item.status === 'conditional' ? 'active-conditional' : ''}" data-process-index="${index}" data-process-status="conditional">Şartlı</button>
                        <button type="button" class="process-choice ${item.status === 'nok' ? 'active-nok' : ''}" data-process-index="${index}" data-process-status="nok">Uygunsuz</button>
                    </div>
                    <textarea class="process-check-note" data-process-note="${index}" placeholder="Gerekirse kontrol notu veya aksiyon yazın...">${item.note}</textarea>
                </div>
            `;
        }).join('');

        processChecklist.querySelectorAll('.process-choice').forEach(button => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.processIndex);
                processState[index].status = button.dataset.processStatus;
                renderProcessChecklist();
                updateProcessResult();
            });
        });

        processChecklist.querySelectorAll('.process-check-note').forEach(note => {
            note.addEventListener('input', () => {
                processState[Number(note.dataset.processNote)].note = note.value;
            });
        });
    }

    function updateProcessResult() {
        const completed = processState.filter(item => item.status).length;
        const ok = processState.filter(item => item.status === 'ok').length;
        const conditional = processState.filter(item => item.status === 'conditional').length;
        const nok = processState.filter(item => item.status === 'nok').length;
        const score = Math.round(((ok + conditional * 0.5) / processState.length) * 100);

        if (processCount) processCount.textContent = `${completed} / ${processState.length} tamamlandı`;
        if (processScore) processScore.textContent = `${score}%`;
        if (processOkCount) processOkCount.textContent = ok;
        if (processConditionalCount) processConditionalCount.textContent = conditional;
        if (processNokCount) processNokCount.textContent = nok;
        if (!processDecision) return;

        processDecision.className = 'process-decision';
        if (completed < processState.length) {
            processDecision.textContent = 'Kontrol bekleniyor';
        } else if (nok > 0) {
            processDecision.textContent = 'Düzeltme gerekli';
            processDecision.classList.add('rejected');
        } else if (conditional > 0) {
            processDecision.textContent = 'Şartlı onay';
            processDecision.classList.add('conditional');
        } else {
            processDecision.textContent = 'Proses uygun';
            processDecision.classList.add('approved');
        }
    }

    function getProcessReport() {
        const product = document.getElementById('process-product')?.value.trim() || '-';
        const order = document.getElementById('process-order')?.value.trim() || '-';
        const station = document.getElementById('process-station')?.value.trim() || '-';
        const department = document.getElementById('process-department')?.value.trim() || '-';
        const operator = document.getElementById('process-operator')?.value.trim() || '-';
        const inspector = document.getElementById('process-inspector')?.value.trim() || '-';
        const standards = getSelectedProcessStandards();
        const score = processScore?.textContent || '0%';
        const decision = processDecision?.textContent || 'Kontrol bekleniyor';
        return { product, order, station, department, operator, inspector, standards, score, decision };
    }

    document.getElementById('process-save')?.addEventListener('click', () => {
        const incomplete = processState.some(item => !item.status);
        if (incomplete) {
            if (processStatus) processStatus.textContent = 'Kaydetmeden önce tüm kontrol maddelerini değerlendirin.';
            return;
        }
        const report = getProcessReport();
        if (processStatus) processStatus.textContent = `${report.product} için ${report.department} bölümündeki kontrol kaydedildi (${report.score} - ${report.decision}).`;
    });

    document.getElementById('process-export')?.addEventListener('click', () => {
        const incomplete = processState.some(item => !item.status);
        if (incomplete) {
            if (processStatus) processStatus.textContent = 'CSV raporu için tüm kontrol maddelerini değerlendirin.';
            return;
        }
        const report = getProcessReport();
        const rows = [
            ['Ürün / Proje No', report.product],
            ['İş Emri No', report.order],
            ['İstasyon', report.station],
            ['Bölüm', report.department],
            ['Çalışan / Operatör', report.operator],
            ['Kontrol Eden', report.inspector],
            ['Kontrol Edilen Standartlar', report.standards.length ? report.standards.join(' | ') : '-'],
            ['Uygunluk Skoru', report.score],
            ['Nihai Karar', report.decision],
            [],
            ['No', 'Kontrol Maddesi', 'Durum', 'Not / Aksiyon'],
            ...processChecks.map((label, index) => [index + 1, label, processState[index].status, processState[index].note || '-'])
        ];
        const csv = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
        const link = document.createElement('a');
        link.href = encodeURI(csv);
        link.download = `proses_kontrol_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    });

    document.getElementById('process-reset')?.addEventListener('click', () => {
        processState.forEach(item => { item.status = ''; item.note = ''; });
        ['process-product', 'process-order', 'process-station', 'process-department', 'process-operator', 'process-inspector'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        processStandardOptions?.querySelectorAll('input').forEach(input => { input.checked = false; });
        updateProcessStandardCount();
        if (processStatus) processStatus.textContent = '';
        renderProcessChecklist();
        updateProcessResult();
    });

    renderProcessChecklist();
    updateProcessResult();

    // =========================================================================
    // 5. PTR-KT-006-28 Krimp Yükseklik & Tolerans Sorgulama Logic (1.548 Kayıt)
    // =========================================================================
    const DATA = (window.KRIMP_DATA && Array.isArray(window.KRIMP_DATA)) ? window.KRIMP_DATA : [];
    const allKontaklar = [...new Set(DATA.map(d => d.kontak))].sort();

    let selectedKontak = null;
    let currentSelectedRow = null;
    let lastAnalysisResult = null;
    const measurementLogs = [];

    // Tab buttons & panels
    const tabDbBtn = document.getElementById('tab-database');
    const tabCatalogBtn = document.getElementById('tab-catalog');
    const tabManualBtn = document.getElementById('tab-manual');
    const dbView = document.getElementById('krimp-db-view');
    const catalogView = document.getElementById('krimp-catalog-view');
    const manualView = document.getElementById('krimp-manual-view');

    // Database lookup DOM elements
    const kontakInput = document.getElementById('kontakInput');
    const clearKontakBtn = document.getElementById('clearKontak');
    const kontakDropdown = document.getElementById('kontakDropdown');
    const kesitSelect = document.getElementById('kesitSelect');
    const hintState = document.getElementById('hintState');
    const resultPanel = document.getElementById('resultPanel');
    const resultLabel = document.getElementById('resultLabel');
    const resultContent = document.getElementById('resultContent');

    // Measurement & Tolerance DOM
    const measuredInput = document.getElementById('measured-height');
    const btnAnalyze = document.getElementById('btn-analyze');
    const resultBadge = document.getElementById('result-badge');
    const resultStatusText = document.getElementById('result-status-text');
    const resultDelta = document.getElementById('result-delta');
    const tolMinLabel = document.getElementById('tol-min-label');
    const tolNomLabel = document.getElementById('tol-nom-label');
    const tolMaxLabel = document.getElementById('tol-max-label');
    const tolerancePointer = document.getElementById('tolerance-pointer');
    const pointerValText = document.getElementById('pointer-val-text');
    const btnSaveLog = document.getElementById('btn-save-log');
    const btnResetSingle = document.getElementById('btn-reset-single');

    // Catalog search & pagination DOM
    const catalogSearchInput = document.getElementById('catalog-search-input');
    const catalogFilteredCount = document.getElementById('catalog-filtered-count');
    const catalogTbody = document.getElementById('catalog-tbody');
    const catalogPrevBtn = document.getElementById('catalog-prev-page');
    const catalogNextBtn = document.getElementById('catalog-next-page');
    const catalogPageIndicator = document.getElementById('catalog-page-indicator');
    let catalogFilteredData = [...DATA];
    let catalogCurrentPage = 1;
    const catalogPageSize = 50;

    // Manual mode DOM
    const manualNominalInput = document.getElementById('manual-nominal');
    const manualTolInput = document.getElementById('manual-tolerance');
    const manualPullInput = document.getElementById('manual-pull');
    const manualCcwInput = document.getElementById('manual-ccw');
    const manualMeasuredInput = document.getElementById('manual-measured-height');
    const btnAnalyzeManual = document.getElementById('btn-analyze-manual');
    const manualResultBadge = document.getElementById('manual-result-badge');
    const manualResultDelta = document.getElementById('manual-result-delta');
    const manualTolMinLabel = document.getElementById('manual-tol-min-label');
    const manualTolNomLabel = document.getElementById('manual-tol-nom-label');
    const manualTolMaxLabel = document.getElementById('manual-tol-max-label');
    const manualTolerancePointer = document.getElementById('manual-tolerance-pointer');
    const manualPointerValText = document.getElementById('manual-pointer-val-text');
    const btnSaveManualLog = document.getElementById('btn-save-manual-log');

    // Log & CSV DOM
    const logTbody = document.getElementById('krimp-log-tbody');
    const logCountSpan = document.getElementById('log-count');
    const btnExportLog = document.getElementById('btn-export-log');
    const btnClearLog = document.getElementById('btn-clear-log');

    // Tab Switch Handlers
    function switchTab(mode) {
        [tabDbBtn, tabCatalogBtn, tabManualBtn].forEach(b => b && b.classList.remove('active'));
        [dbView, catalogView, manualView].forEach(v => v && v.classList.remove('active'));

        if (mode === 'database') {
            tabDbBtn.classList.add('active');
            dbView.classList.add('active');
        } else if (mode === 'catalog') {
            tabCatalogBtn.classList.add('active');
            catalogView.classList.add('active');
            renderCatalogTable();
        } else if (mode === 'manual') {
            tabManualBtn.classList.add('active');
            manualView.classList.add('active');
            updateManualLabels();
        }
    }

    if (tabDbBtn) tabDbBtn.addEventListener('click', () => switchTab('database'));
    if (tabCatalogBtn) tabCatalogBtn.addEventListener('click', () => switchTab('catalog'));
    if (tabManualBtn) tabManualBtn.addEventListener('click', () => switchTab('manual'));

    // ── KONTAK INPUT & AUTOCOMPLETE ──
    function onKontakInput() {
        const val = kontakInput.value.trim();
        clearKontakBtn.style.display = val ? 'block' : 'none';
        showKontakDropdown(val);
        selectedKontak = null;
        resetKesit();
        showHint();
    }

    function onKontakFocus() {
        const val = kontakInput.value.trim();
        showKontakDropdown(val);
    }

    function showKontakDropdown(query) {
        if (!kontakDropdown) return;
        const qUpper = query.toUpperCase();
        const filtered = query
            ? allKontaklar.filter(k => k.toUpperCase().includes(qUpper))
            : allKontaklar.slice(0, 60);

        if (filtered.length === 0) {
            kontakDropdown.innerHTML = '<div class="dropdown-no-result">Eşleşen kontak bulunamadı</div>';
        } else {
            kontakDropdown.innerHTML = filtered.map(k => {
                const kesitCount = [...new Set(DATA.filter(d => d.kontak === k).map(d => d.kesit))].length;
                const doppelCount = DATA.filter(d => d.kontak === k && d.kesit.startsWith('DOPPEL:')).length;
                const normalCount = kesitCount - doppelCount;

                const badge = doppelCount > 0
                    ? `<span class="count-badge">${normalCount} kesit</span> <span class="doppel-badge">+${doppelCount} doppel</span>`
                    : `<span class="count-badge">${kesitCount} kesit</span>`;
                return `<div class="dropdown-item" data-kontak="${k}">${k} ${badge}</div>`;
            }).join('');

            kontakDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    const k = item.getAttribute('data-kontak');
                    selectKontak(k);
                });
            });
        }

        kontakDropdown.classList.add('open');
    }

    function selectKontak(k, autoSelectKesit = null) {
        selectedKontak = k;
        if (kontakInput) {
            kontakInput.value = k;
            clearKontakBtn.style.display = 'block';
        }
        if (kontakDropdown) kontakDropdown.classList.remove('open');
        populateKesit(k, autoSelectKesit);
    }

    function clearKontak() {
        if (kontakInput) kontakInput.value = '';
        if (clearKontakBtn) clearKontakBtn.style.display = 'none';
        selectedKontak = null;
        resetKesit();
        showHint();
    }

    if (kontakInput) {
        kontakInput.addEventListener('input', onKontakInput);
        kontakInput.addEventListener('focus', onKontakFocus);
    }
    if (clearKontakBtn) {
        clearKontakBtn.addEventListener('click', clearKontak);
    }

    document.addEventListener('click', e => {
        if (!e.target.closest('.kontak-input-wrap')) {
            if (kontakDropdown) kontakDropdown.classList.remove('open');
        }
    });

    // ── KESİT SEÇİMİ ──
    function populateKesit(kontak, preselectKesit = null) {
        if (!kesitSelect) return;
        const rows = DATA.filter(d => d.kontak === kontak);
        const kesitler = [...new Set(rows.map(d => d.kesit))];

        kesitSelect.innerHTML = '<option value="">Kesit seçiniz...</option>';

        const normal = kesitler.filter(k => !k.startsWith('DOPPEL:'));
        const doppel = kesitler.filter(k => k.startsWith('DOPPEL:'));

        if (normal.length > 0) {
            const grp = document.createElement('optgroup');
            grp.label = '── Tek Kesitler ──';
            normal.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = k;
                grp.appendChild(opt);
            });
            kesitSelect.appendChild(grp);
        }

        if (doppel.length > 0) {
            const grp = document.createElement('optgroup');
            grp.label = '── DOPPEL (Karma Kesitler) ──';
            doppel.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = k.replace('DOPPEL: ', '');
                grp.appendChild(opt);
            });
            kesitSelect.appendChild(grp);
        }

        kesitSelect.disabled = false;

        if (preselectKesit && kesitler.includes(preselectKesit)) {
            kesitSelect.value = preselectKesit;
            onKesitChange();
        } else if (kesitler.length === 1) {
            kesitSelect.value = kesitler[0];
            onKesitChange();
        } else {
            showHint();
        }
    }

    function resetKesit() {
        if (!kesitSelect) return;
        kesitSelect.innerHTML = '<option value="">Önce kontak seçiniz...</option>';
        kesitSelect.disabled = true;
    }

    function onKesitChange() {
        const kesit = kesitSelect.value;
        if (!selectedKontak || !kesit) {
            showHint();
            return;
        }
        const rows = DATA.filter(d => d.kontak === selectedKontak && d.kesit === kesit);
        showResult(rows, selectedKontak, kesit);
    }

    if (kesitSelect) {
        kesitSelect.addEventListener('change', onKesitChange);
    }

    // ── RESULT RENDER & SPEC BINDING ──
    function showHint() {
        if (hintState) hintState.style.display = 'block';
        if (resultPanel) resultPanel.style.display = 'none';
        currentSelectedRow = null;
    }

    function parseNumeric(valStr) {
        if (!valStr || valStr === '-' || valStr === '—') return null;
        const cleaned = valStr.toString().replace(',', '.').replace(/[^0-9.]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }

    function showResult(rows, kontak, kesit) {
        if (hintState) hintState.style.display = 'none';
        if (resultPanel) resultPanel.style.display = 'block';

        const kesitLabel = kesit.startsWith('DOPPEL: ') ? '🔀 DOPPEL: ' + kesit.replace('DOPPEL: ', '') : kesit;
        if (resultLabel) {
            resultLabel.innerHTML = `<i class="fa-solid fa-list-check"></i> Terminal: <strong>${kontak}</strong> · Kesit: <strong>${kesitLabel}</strong>`;
        }

        if (rows.length === 0) {
            resultContent.innerHTML = '<div class="hint-state"><p>Bu kombinasyon için kayıt bulunamadı.</p></div>';
            currentSelectedRow = null;
            return;
        }

        if (rows.length === 1) {
            const r = rows[0];
            currentSelectedRow = r;
            resultContent.innerHTML = `
                <div class="result-single">
                    <div class="result-main">
                        <div class="result-cell">
                            <div class="result-cell-label">Nominal Krimp Yükseklik (CCH)</div>
                            <div class="result-cell-value krimp">${r.krimp} mm</div>
                        </div>
                        <div class="result-cell">
                            <div class="result-cell-label">Krimp Genişliği (CCW)</div>
                            <div class="result-cell-value" style="color:var(--accent);">${r.krimp_gen && r.krimp_gen !== '-' ? r.krimp_gen + ' mm' : '—'}</div>
                        </div>
                        <div class="result-cell">
                            <div class="result-cell-label">İzokrimp Yükseklik (ICH)</div>
                            <div class="result-cell-value izokrimp">${r.izok && r.izok !== '-' ? r.izok + ' mm' : '—'}</div>
                        </div>
                        <div class="result-cell">
                            <div class="result-cell-label">Kalıp / Aplikatör No</div>
                            <div class="result-cell-value kalip">${r.kalip || '—'}</div>
                        </div>
                        <div class="result-cell">
                            <div class="result-cell-label">Min. Çekme Kuvveti</div>
                            <div class="result-cell-value cekme">${r.cekme && r.cekme !== '-' ? '≥ ' + r.cekme + ' N' : '—'}</div>
                        </div>
                        <div class="result-cell">
                            <div class="result-cell-label">Tolerans / Standart</div>
                            <div class="result-cell-value" style="font-size:0.85rem;color:var(--text-secondary);">± 0,05 mm (DIN/EN 60352-2)</div>
                        </div>
                    </div>
                    <div class="tolerance-hint">
                        ${kesit.startsWith('DOPPEL: ') ? '<i class="fa-solid fa-shuffle"></i> DOPPEL / Karma Kesit &nbsp;·&nbsp; ' : ''}
                        <i class="fa-solid fa-shield-halved"></i> PTR-KT-006-28 Krimp Kontrol Talimatı Uygunluk Standardı
                    </div>
                </div>
                ${r.not ? `<div class="result-note"><i class="fa-solid fa-triangle-exclamation"></i> <span>${r.not}</span></div>` : ''}
            `;
            updateToleranceLabelsFromRow(r);
        } else {
            // Multiple rows (different molds for same kontak & kesit)
            currentSelectedRow = rows[0];
            const rowsHtml = rows.map((r, i) => `
                <div class="result-multi-row ${i === 0 ? 'selected' : ''}" data-index="${i}">
                    <span class="val-kalip">${r.kalip}</span>
                    <span class="val-krimp">${r.krimp} mm</span>
                    <span>${r.krimp_gen && r.krimp_gen !== '-' ? r.krimp_gen + ' mm' : '<span class="val-empty">—</span>'}</span>
                    <span class="val-izok">${r.izok && r.izok !== '-' ? r.izok + ' mm' : '<span class="val-empty">—</span>'}</span>
                    <span class="val-cekme">${r.cekme && r.cekme !== '-' ? r.cekme + ' N' : '<span class="val-empty">—</span>'}</span>
                    <span style="font-size:0.75rem;color:#f87171;">${r.not || '—'}</span>
                </div>
            `).join('');

            resultContent.innerHTML = `
                <div class="result-multi">
                    <div class="result-multi-header">
                        <span>Kalıp No</span>
                        <span>Krimp (CCH)</span>
                        <span>Genişlik (CCW)</span>
                        <span>İzokrimp (ICH)</span>
                        <span>Min Çekme</span>
                        <span>Not / Açıklama</span>
                    </div>
                    ${rowsHtml}
                </div>
                <div class="field-hint" style="margin-top:6px;"><i class="fa-solid fa-circle-info"></i> Birden fazla kalıp mevcuttur. Test etmek istediğiniz kalıp satırına tıklayabilirsiniz.</div>
            `;

            updateToleranceLabelsFromRow(rows[0]);

            resultContent.querySelectorAll('.result-multi-row').forEach(rowEl => {
                rowEl.addEventListener('click', () => {
                    resultContent.querySelectorAll('.result-multi-row').forEach(r => r.classList.remove('selected'));
                    rowEl.classList.add('selected');
                    const idx = parseInt(rowEl.getAttribute('data-index'), 10);
                    currentSelectedRow = rows[idx];
                    updateToleranceLabelsFromRow(currentSelectedRow);
                });
            });
        }
    }

    function updateToleranceLabelsFromRow(row) {
        const nom = parseNumeric(row.krimp);
        if (nom !== null) {
            const min = parseFloat((nom - 0.05).toFixed(3));
            const max = parseFloat((nom + 0.05).toFixed(3));
            if (tolMinLabel) tolMinLabel.textContent = `Min: ${min.toFixed(2)}`;
            if (tolNomLabel) tolNomLabel.textContent = `Nominal: ${nom.toFixed(2)}`;
            if (tolMaxLabel) tolMaxLabel.textContent = `Max: ${max.toFixed(2)}`;
        }
    }

    // ── MEASUREMENT TOLERANCE ANALYSIS ──
    function runDatabaseAnalysis() {
        if (!currentSelectedRow) {
            alert('Lütfen önce bir kontak ve kesit seçiniz.');
            return;
        }

        const nom = parseNumeric(currentSelectedRow.krimp);
        if (nom === null) {
            alert('Seçili kayıtta sayısal krimp nominal değeri bulunamadı.');
            return;
        }

        const measured = parseFloat(measuredInput.value);
        if (isNaN(measured)) {
            alert('Lütfen geçerli bir ölçüm değeri giriniz (örn: 1.22).');
            return;
        }

        const tol = 0.05;
        const min = parseFloat((nom - tol).toFixed(3));
        const max = parseFloat((nom + tol).toFixed(3));
        const delta = parseFloat((measured - nom).toFixed(3));
        const deltaSign = delta > 0 ? `+${delta}` : `${delta}`;

        let status = '';
        let isOk = false;

        if (measured >= min && measured <= max) {
            status = 'UYGUN (OK)';
            isOk = true;
            resultBadge.className = 'result-badge badge-ok';
            resultBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>UYGUN (OK)</span>';
        } else if (measured < min) {
            status = 'TOLERANS ALTI (NOK)';
            isOk = false;
            resultBadge.className = 'result-badge badge-nok';
            resultBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <span>TOLERANS ALTI (NOK)</span>';
        } else {
            status = 'TOLERANS ÜSTÜ (NOK)';
            isOk = false;
            resultBadge.className = 'result-badge badge-nok';
            resultBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <span>TOLERANS ÜSTÜ (NOK)</span>';
        }

        resultDelta.textContent = `Sapma: ${deltaSign} mm`;
        pointerValText.textContent = `Ölçülen: ${measured.toFixed(3)} mm (${deltaSign} mm)`;

        // Calculate needle position 0% - 100%
        let percent = 50;
        const span = max - min; // 0.10
        if (measured === nom) {
            percent = 50;
        } else if (measured >= min && measured <= max) {
            const ratio = (measured - min) / span;
            percent = 25 + (ratio * 50);
        } else if (measured < min) {
            const underDiff = min - measured;
            const ratio = Math.min(underDiff / span, 1);
            percent = Math.max(2, 25 - (ratio * 23));
        } else {
            const overDiff = measured - max;
            const ratio = Math.min(overDiff / span, 1);
            percent = Math.min(98, 75 + (ratio * 23));
        }

        tolerancePointer.style.left = `${percent}%`;

        lastAnalysisResult = {
            id: measurementLogs.length + 1,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            terminal: `Terminal ${currentSelectedRow.kontak} (${currentSelectedRow.kalip ? 'Kalıp ' + currentSelectedRow.kalip : ''})`,
            kesit: currentSelectedRow.kesit,
            nominal: `${nom.toFixed(2)} mm`,
            measured: `${measured.toFixed(3)} mm`,
            delta: `${deltaSign} mm`,
            status: status,
            isOk: isOk
        };
    }

    if (btnAnalyze) {
        btnAnalyze.addEventListener('click', runDatabaseAnalysis);
        measuredInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runDatabaseAnalysis();
            }
        });
    }

    if (btnSaveLog) {
        btnSaveLog.addEventListener('click', () => {
            if (!lastAnalysisResult) {
                if (measuredInput.value) {
                    runDatabaseAnalysis();
                } else {
                    alert('Lütfen önce bir ölçüm değeri girip test ediniz.');
                    return;
                }
            }
            if (lastAnalysisResult) {
                measurementLogs.unshift(lastAnalysisResult);
                renderLogs();
                lastAnalysisResult = null;
                measuredInput.value = '';
                measuredInput.focus();
            }
        });
    }

    if (btnResetSingle) {
        btnResetSingle.addEventListener('click', () => {
            measuredInput.value = '';
            resultBadge.className = 'result-badge badge-waiting';
            resultBadge.innerHTML = '<i class="fa-solid fa-circle-question"></i> <span>Ölçüm Bekleniyor</span>';
            resultDelta.textContent = 'Sapma: -- mm';
            tolerancePointer.style.left = '50%';
            pointerValText.textContent = 'Ölçülen: -- mm';
        });
    }

    // ── MANUAL MODE ──
    function updateManualLabels() {
        const nom = parseFloat(manualNominalInput.value) || 1.20;
        const tol = parseFloat(manualTolInput.value) || 0.05;
        const min = parseFloat((nom - tol).toFixed(3));
        const max = parseFloat((nom + tol).toFixed(3));

        if (manualTolMinLabel) manualTolMinLabel.textContent = `Min: ${min.toFixed(2)}`;
        if (manualTolNomLabel) manualTolNomLabel.textContent = `Nominal: ${nom.toFixed(2)}`;
        if (manualTolMaxLabel) manualTolMaxLabel.textContent = `Max: ${max.toFixed(2)}`;
    }

    [manualNominalInput, manualTolInput, manualPullInput, manualCcwInput].forEach(inp => {
        if (inp) inp.addEventListener('input', updateManualLabels);
    });

    function runManualAnalysis() {
        const nom = parseFloat(manualNominalInput.value) || 1.20;
        const tol = parseFloat(manualTolInput.value) || 0.05;
        const measured = parseFloat(manualMeasuredInput.value);

        if (isNaN(measured)) {
            alert('Lütfen geçerli bir ölçüm değeri giriniz.');
            return;
        }

        const min = parseFloat((nom - tol).toFixed(3));
        const max = parseFloat((nom + tol).toFixed(3));
        const delta = parseFloat((measured - nom).toFixed(3));
        const deltaSign = delta > 0 ? `+${delta}` : `${delta}`;

        let status = '';
        let isOk = false;

        if (measured >= min && measured <= max) {
            status = 'UYGUN (OK)';
            isOk = true;
            manualResultBadge.className = 'result-badge badge-ok';
            manualResultBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>UYGUN (OK)</span>';
        } else if (measured < min) {
            status = 'TOLERANS ALTI (NOK)';
            isOk = false;
            manualResultBadge.className = 'result-badge badge-nok';
            manualResultBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <span>TOLERANS ALTI (NOK)</span>';
        } else {
            status = 'TOLERANS ÜSTÜ (NOK)';
            isOk = false;
            manualResultBadge.className = 'result-badge badge-nok';
            manualResultBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <span>TOLERANS ÜSTÜ (NOK)</span>';
        }

        manualResultDelta.textContent = `Sapma: ${deltaSign} mm`;
        manualPointerValText.textContent = `Ölçülen: ${measured.toFixed(3)} mm (${deltaSign} mm)`;

        let percent = 50;
        const span = max - min;
        if (measured === nom) {
            percent = 50;
        } else if (measured >= min && measured <= max) {
            percent = 25 + (((measured - min) / span) * 50);
        } else if (measured < min) {
            percent = Math.max(2, 25 - (((min - measured) / span) * 23));
        } else {
            percent = Math.min(98, 75 + (((measured - max) / span) * 23));
        }

        manualTolerancePointer.style.left = `${percent}%`;

        lastAnalysisResult = {
            id: measurementLogs.length + 1,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            terminal: 'Özel / Manuel Giriş',
            kesit: 'Manuel Kesit',
            nominal: `${nom.toFixed(2)} mm`,
            measured: `${measured.toFixed(3)} mm`,
            delta: `${deltaSign} mm`,
            status: status,
            isOk: isOk
        };
    }

    if (btnAnalyzeManual) {
        btnAnalyzeManual.addEventListener('click', runManualAnalysis);
        manualMeasuredInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runManualAnalysis();
            }
        });
    }

    if (btnSaveManualLog) {
        btnSaveManualLog.addEventListener('click', () => {
            if (!lastAnalysisResult) {
                if (manualMeasuredInput.value) {
                    runManualAnalysis();
                } else {
                    alert('Lütfen önce bir ölçüm değeri girip test ediniz.');
                    return;
                }
            }
            if (lastAnalysisResult) {
                measurementLogs.unshift(lastAnalysisResult);
                renderLogs();
                lastAnalysisResult = null;
                manualMeasuredInput.value = '';
                manualMeasuredInput.focus();
            }
        });
    }

    // ── CATALOG TABLE SEARCH & PAGINATION ──
    function filterCatalog() {
        const q = (catalogSearchInput ? catalogSearchInput.value : '').trim().toLowerCase();
        if (!q) {
            catalogFilteredData = [...DATA];
        } else {
            catalogFilteredData = DATA.filter(d => {
                return (d.kontak && d.kontak.toLowerCase().includes(q)) ||
                    (d.kesit && d.kesit.toLowerCase().includes(q)) ||
                    (d.kalip && d.kalip.toLowerCase().includes(q)) ||
                    (d.krimp && d.krimp.toLowerCase().includes(q)) ||
                    (d.not && d.not.toLowerCase().includes(q));
            });
        }
        catalogCurrentPage = 1;
        renderCatalogTable();
    }

    function renderCatalogTable() {
        if (!catalogTbody) return;
        const totalItems = catalogFilteredData.length;
        if (catalogFilteredCount) {
            catalogFilteredCount.textContent = totalItems.toLocaleString('tr-TR');
        }

        const totalPages = Math.max(1, Math.ceil(totalItems / catalogPageSize));
        if (catalogCurrentPage > totalPages) catalogCurrentPage = totalPages;

        if (catalogPageIndicator) {
            catalogPageIndicator.textContent = `Sayfa ${catalogCurrentPage} / ${totalPages}`;
        }
        if (catalogPrevBtn) catalogPrevBtn.disabled = catalogCurrentPage === 1;
        if (catalogNextBtn) catalogNextBtn.disabled = catalogCurrentPage === totalPages;

        if (totalItems === 0) {
            catalogTbody.innerHTML = '<tr class="empty-row"><td colspan="9">Arama kriterine uygun kayıt bulunamadı.</td></tr>';
            return;
        }

        const startIndex = (catalogCurrentPage - 1) * catalogPageSize;
        const pageData = catalogFilteredData.slice(startIndex, startIndex + catalogPageSize);

        catalogTbody.innerHTML = pageData.map(d => `
            <tr>
                <td><strong>${d.kontak}</strong></td>
                <td>${d.kesit.startsWith('DOPPEL:') ? `<span class="doppel-badge">${d.kesit}</span>` : d.kesit}</td>
                <td><span class="val-kalip">${d.kalip || '—'}</span></td>
                <td><strong class="val-krimp">${d.krimp}</strong></td>
                <td>${d.krimp_gen && d.krimp_gen !== '-' ? d.krimp_gen : '—'}</td>
                <td>${d.izok && d.izok !== '-' ? d.izok : '—'}</td>
                <td>${d.cekme && d.cekme !== '-' ? d.cekme : '—'}</td>
                <td style="font-size:0.75rem;color:#f87171;">${d.not || '—'}</td>
                <td>
                    <button type="button" class="btn btn-outline btn-sm btn-select-catalog" data-kontak="${d.kontak}" data-kesit="${d.kesit}">
                        <i class="fa-solid fa-play"></i> Seç
                    </button>
                </td>
            </tr>
        `).join('');

        catalogTbody.querySelectorAll('.btn-select-catalog').forEach(btn => {
            btn.addEventListener('click', () => {
                const k = btn.getAttribute('data-kontak');
                const kesit = btn.getAttribute('data-kesit');
                switchTab('database');
                selectKontak(k, kesit);
            });
        });
    }

    if (catalogSearchInput) {
        catalogSearchInput.addEventListener('input', filterCatalog);
    }
    if (catalogPrevBtn) {
        catalogPrevBtn.addEventListener('click', () => {
            if (catalogCurrentPage > 1) {
                catalogCurrentPage--;
                renderCatalogTable();
            }
        });
    }
    if (catalogNextBtn) {
        catalogNextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(catalogFilteredData.length / catalogPageSize);
            if (catalogCurrentPage < totalPages) {
                catalogCurrentPage++;
                renderCatalogTable();
            }
        });
    }

    // ── UNIVERSAL MEASUREMENT LOG & CSV EXPORT ──
    function renderLogs() {
        if (!logTbody) return;
        if (logCountSpan) logCountSpan.textContent = measurementLogs.length;

        if (measurementLogs.length === 0) {
            logTbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="8">Henüz kaydedilmiş bir ölçüm bulunmuyor. Terminal veya manuel sorgulama yaparak listeye ekleyebilirsiniz.</td>
                </tr>
            `;
            return;
        }

        logTbody.innerHTML = measurementLogs.map((log, index) => `
            <tr>
                <td><strong>#${measurementLogs.length - index}</strong></td>
                <td>${log.time}</td>
                <td>${log.terminal}</td>
                <td>${log.kesit || '—'}</td>
                <td>${log.nominal}</td>
                <td><strong>${log.measured}</strong></td>
                <td>${log.delta}</td>
                <td>
                    <span class="${log.isOk ? 'badge-table-ok' : 'badge-table-nok'}">
                        ${log.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    if (btnClearLog) {
        btnClearLog.addEventListener('click', () => {
            if (measurementLogs.length === 0) return;
            if (confirm('Tüm ölçüm geçmişini temizlemek istediğinize emin misiniz?')) {
                measurementLogs.length = 0;
                renderLogs();
            }
        });
    }

    if (btnExportLog) {
        btnExportLog.addEventListener('click', () => {
            if (measurementLogs.length === 0) {
                alert('İndirilecek kayıtlı ölçüm bulunmuyor.');
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
            csvContent += "No,Zaman,Terminal,Kablo Kesiti,Nominal CCH (mm),Olculen CCH (mm),Sapma (mm),Durum\n";

            measurementLogs.forEach((log, index) => {
                const row = [
                    index + 1,
                    `"${log.time}"`,
                    `"${log.terminal}"`,
                    `"${log.kesit || '-'}"`,
                    `"${log.nominal}"`,
                    `"${log.measured}"`,
                    `"${log.delta}"`,
                    `"${log.status}"`
                ].join(",");
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `PTR_KT_006_28_Krimp_Raporu_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Default: select first popular kontak if available
    if (allKontaklar.length > 0) {
        const defaultKontak = allKontaklar.includes("10000512") ? "10000512" : allKontaklar[0];
        selectKontak(defaultKontak);
    }

    // =========================================================================
    // 6. Test Masası Aparat Doğrulama Formu Logic (PTR 07/222-02)
    // =========================================================================
    const initialBaglantiParametreleri = [
        { id: "kilit", label: "Kilit Sistemi", status: "Görüyor", note: "Kilit mekanizması ve algılama switchi aktif", isDefault: true },
        { id: "uc_sayisi", label: "Uç Sayısı", status: "Görüyor", note: "Tüm pin ve uç kontakları eksiksiz", isDefault: true },
        { id: "poke_yoke", label: "Poke-Yoke", status: "Görüyor", note: "Ters takılmayı engelleyen mekanik bariyer mevcut", isDefault: true },
        { id: "board_gorsel", label: "Board Görsel", status: "Görüyor", note: "Görsel etiketler ve yönlendirmeler mevcut", isDefault: true },
        { id: "board_cizim", label: "Board Çizim", status: "Görüyor", note: "Teknik çizim ve pin dizilimi uyumlu", isDefault: true }
    ];

    let baglantiParametreleri = JSON.parse(JSON.stringify(initialBaglantiParametreleri));

    const degerlendirmeSorulari = [
        "1. Test masası elektriksel bağlantıları uygun mu?",
        "2. Test masası üstünde, işin doğru ve çabuk yapılabilmesi için anlaşılabilir işaretler ve uyarıcı yazılar kullanılmış mı?",
        "3. Test masası üzerinde test masası numarası var mı?",
        "4. Yapılan işaretler ve yazılar anlaşılır ve okunaklı mı?",
        "5. Tüm Soket ve Komponentler için gerekli 3D yazıcıyla POKE-YOKE ler yapılmış mı?",
        "6. Varlık kontrollü var mı ve switchler yaylı pim olarak mevcut mu?",
        "7. Soket ve komponentlerin takılacağı yuva ve pimler sağlam bir şekilde monte edilmiş ve işin yapılması sırasında gevşememesi sağlanmış mı?",
        "8. Test masasında kullanılan pimlerin kablo, kontak ve soket gibi üründe kullanılan parçalara zarar vermeyecek şekilde olmasına dikkat edilmiş mi?",
        "9. Test masası üzerinde hedef noktalarda kablo renkleri belirtilmiş mi?",
        "10. Renk kodlamaları ve etiketler doğru mu?",
        "11. Test masası üzerinde hedef noktalar birbirinden farklı olarak numaralandırılmış mı?",
        "12. Test masasındaki yazılı tanımlandırmaların, uygulama ve uyarı şekillerinin üstü kullanım sırasında yıpranmaya karşı şeffaf bir bant ile korunmaya alınmış mı?"
    ];

    const kriterDurumlari = degerlendirmeSorulari.map((q, idx) => ({
        id: idx + 1,
        question: q,
        status: "Evet", // "Evet", "Hayır", "Şartlı"
        note: ""
    }));

    const dogrulamaLogs = [];

    // DOM Elements for Dogrulama
    const baglantiTbody = document.getElementById('baglanti-tbody');
    const baglantiCountBadge = document.getElementById('baglanti-count-badge');
    const newParamNameInput = document.getElementById('new-param-name');
    const btnAddCustomParam = document.getElementById('btn-add-custom-param');

    const kriterlerList = document.getElementById('kriterler-list');
    const scoreCircle = document.getElementById('score-circle');
    const scorePercentage = document.getElementById('score-percentage');
    const statTotalKriter = document.getElementById('stat-total-kriter');
    const statYesCount = document.getElementById('stat-yes-count');
    const statNoCount = document.getElementById('stat-no-count');
    const statCondCount = document.getElementById('stat-cond-count');
    const decisionBadge = document.getElementById('decision-badge');
    const decisionText = document.getElementById('decision-text');
    const decisionDesc = document.getElementById('decision-desc');
    const tmLogTbody = document.getElementById('tm-log-tbody');
    const tmLogCount = document.getElementById('tm-log-count');
    const btnSaveDogrulama = document.getElementById('btn-save-dogrulama');
    const btnPrintDogrulama = document.getElementById('btn-print-dogrulama');
    const btnResetDogrulama = document.getElementById('btn-reset-dogrulama');
    const btnExportTmCsv = document.getElementById('btn-export-tm-csv');
    const btnClearTmLogs = document.getElementById('btn-clear-tm-logs');

    // Set today date
    const currentDocDate = document.getElementById('current-doc-date');
    if (currentDocDate) {
        const todayStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        currentDocDate.textContent = `Tarih: ${todayStr}`;
    }

    // Render Connection Points Table (1-5 Fixed + Custom dynamic rows)
    function renderBaglantiTable() {
        if (!baglantiTbody) return;
        if (baglantiCountBadge) {
            baglantiCountBadge.textContent = `${baglantiParametreleri.length} Parametre`;
        }

        baglantiTbody.innerHTML = baglantiParametreleri.map((param, index) => `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>
                    <strong>${param.label}</strong>
                    ${!param.isDefault ? '<span class="custom-param-badge">Özel Nokta</span>' : ''}
                </td>
                <td>
                    <div class="choice-btn-group">
                        <button type="button" class="choice-btn ${param.status === 'Görüyor' ? 'active-yes' : ''}" data-type="baglanti" data-id="${param.id}" data-val="Görüyor">
                            <i class="fa-solid fa-check"></i> Görüyor
                        </button>
                        <button type="button" class="choice-btn ${param.status === 'Görmüyor' ? 'active-no' : ''}" data-type="baglanti" data-id="${param.id}" data-val="Görmüyor">
                            <i class="fa-solid fa-xmark"></i> Görmüyor
                        </button>
                    </div>
                </td>
                <td>
                    <input type="text" class="form-control-sm baglanti-note-input" data-id="${param.id}" value="${param.note}" placeholder="Not veya açıklama ekleyin..." style="width:100%;padding:6px 10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:6px;color:var(--text-primary);">
                </td>
                <td style="text-align: center;">
                    ${!param.isDefault ? `
                        <button type="button" class="btn-delete-row" data-id="${param.id}" title="Bu satırı sil">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    ` : '<span style="color:var(--text-muted);font-size:0.75rem;">Sabit</span>'}
                </td>
            </tr>
        `).join('');

        baglantiTbody.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const val = btn.getAttribute('data-val');
                const item = baglantiParametreleri.find(p => p.id === id);
                if (item) {
                    item.status = val;
                    renderBaglantiTable();
                    recalculateDogrulamaScore();
                }
            });
        });

        baglantiTbody.querySelectorAll('.baglanti-note-input').forEach(input => {
            input.addEventListener('input', () => {
                const id = input.getAttribute('data-id');
                const item = baglantiParametreleri.find(p => p.id === id);
                if (item) item.note = input.value;
            });
        });

        baglantiTbody.querySelectorAll('.btn-delete-row').forEach(delBtn => {
            delBtn.addEventListener('click', () => {
                const id = delBtn.getAttribute('data-id');
                baglantiParametreleri = baglantiParametreleri.filter(p => p.id !== id);
                renderBaglantiTable();
                recalculateDogrulamaScore();
            });
        });
    }

    // Handle Manual Add Connection Point
    function addCustomParam() {
        if (!newParamNameInput) return;
        const name = newParamNameInput.value.trim();
        if (!name) {
            alert('Lütfen eklenecek bağlantı noktası veya parametre adını giriniz.');
            newParamNameInput.focus();
            return;
        }

        const newId = 'custom_' + Date.now();
        baglantiParametreleri.push({
            id: newId,
            label: name,
            status: "Görüyor",
            note: "Manuel olarak eklendi",
            isDefault: false
        });

        newParamNameInput.value = '';
        renderBaglantiTable();
        recalculateDogrulamaScore();
    }

    if (btnAddCustomParam) {
        btnAddCustomParam.addEventListener('click', addCustomParam);
    }
    if (newParamNameInput) {
        newParamNameInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCustomParam();
            }
        });
    }

    // Render 12 Evaluation Criteria
    function renderKriterlerList() {
        if (!kriterlerList) return;
        kriterlerList.innerHTML = kriterDurumlari.map(k => `
            <div class="kriter-item">
                <div class="kriter-no">${k.id}</div>
                <div class="kriter-text">${k.question}</div>
                <div class="kriter-actions">
                    <div class="choice-btn-group">
                        <button type="button" class="choice-btn ${k.status === 'Evet' ? 'active-yes' : ''}" data-id="${k.id}" data-val="Evet">
                            <i class="fa-solid fa-check"></i> Evet
                        </button>
                        <button type="button" class="choice-btn ${k.status === 'Hayır' ? 'active-no' : ''}" data-id="${k.id}" data-val="Hayır">
                            <i class="fa-solid fa-xmark"></i> Hayır
                        </button>
                        <button type="button" class="choice-btn ${k.status === 'Şartlı' ? 'active-cond' : ''}" data-id="${k.id}" data-val="Şartlı">
                            <i class="fa-solid fa-triangle-exclamation"></i> Şartlı
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        kriterlerList.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const val = btn.getAttribute('data-val');
                const item = kriterDurumlari.find(k => k.id === id);
                if (item) {
                    item.status = val;
                    renderKriterlerList();
                    recalculateDogrulamaScore();
                }
            });
        });
    }

    // Recalculate Final Score & Decision
    function recalculateDogrulamaScore() {
        const totalItems = baglantiParametreleri.length + kriterDurumlari.length; // 5 + 12 = 17
        let yesCount = 0;
        let noCount = 0;
        let condCount = 0;

        baglantiParametreleri.forEach(p => {
            if (p.status === 'Görüyor') yesCount++;
            else noCount++;
        });

        kriterDurumlari.forEach(k => {
            if (k.status === 'Evet') yesCount++;
            else if (k.status === 'Hayır') noCount++;
            else if (k.status === 'Şartlı') condCount++;
        });

        const percent = Math.round(((yesCount + (condCount * 0.5)) / totalItems) * 100);

        if (scorePercentage) scorePercentage.textContent = `${percent}%`;
        if (statTotalKriter) statTotalKriter.textContent = `${totalItems} Kontrol`;
        if (statYesCount) statYesCount.textContent = `${yesCount}`;
        if (statNoCount) statNoCount.textContent = `${noCount}`;
        if (statCondCount) statCondCount.textContent = `${condCount}`;

        // Color circle
        if (scoreCircle) {
            let color = 'var(--success)';
            if (noCount > 0 || percent < 75) color = 'var(--danger)';
            else if (condCount > 0 || percent < 95) color = '#f59e0b';
            scoreCircle.style.background = `conic-gradient(${color} ${percent}%, var(--border-color) 0)`;
        }

        // Decision logic
        if (noCount === 0 && condCount === 0) {
            decisionBadge.className = 'decision-badge decision-approved';
            decisionBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>APARAT DOĞRULANDI (ONAYLANDI)</span>';
            decisionDesc.textContent = 'Test masası tüm elektriksel ve Poke-Yoke gereksinimlerini eksiksiz karşılamaktadır. Üretime verilebilir.';
        } else if (noCount === 0 && condCount > 0) {
            decisionBadge.className = 'decision-badge decision-conditional';
            decisionBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span>ŞARTLI ONAYLANDI</span>';
            decisionDesc.textContent = `${condCount} adet şartlı madde bulunmaktadır. Belirtilen aksiyonlar tamamlanana kadar gözetim altında kullanılmalıdır.`;
        } else {
            decisionBadge.className = 'decision-badge decision-rejected';
            decisionBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <span>REDDEDİLDİ (DÜZELTME GEREKLİ)</span>';
            decisionDesc.textContent = `Toplam ${noCount} adet uygunsuzluk tespit edilmiştir. Düzeltici faaliyetler tamamlanmadan test masası üretime verilemez!`;
        }
    }

    // Save Dogrulama Log
    if (btnSaveDogrulama) {
        btnSaveDogrulama.addEventListener('click', () => {
            const tmNo = (document.getElementById('tm-no') || {}).value || 'TM-01';
            const urunNo = (document.getElementById('tm-urun-no') || {}).value || '—';
            const neden = (document.getElementById('tm-neden') || {}).value || 'Proses Doğrulama';
            const kontrolEden = (document.getElementById('tm-kontrol-eden') || {}).value || 'Deniz Knr';
            const percent = scorePercentage ? scorePercentage.textContent : '100%';
            const decision = decisionText ? decisionText.textContent : 'ONAYLANDI';
            const isOk = !decisionBadge.classList.contains('decision-rejected');

            const newLog = {
                id: dogrulamaLogs.length + 1,
                date: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                tmNo: tmNo,
                urunNo: urunNo,
                neden: neden,
                kontrolEden: kontrolEden,
                score: percent,
                decision: decision,
                isOk: isOk
            };

            dogrulamaLogs.unshift(newLog);
            renderDogrulamaLogs();

            alert(`✅ ${tmNo} numaralı Test Masası Doğrulama Tutanağı başarıyla kaydedildi!`);
        });
    }

    function renderDogrulamaLogs() {
        if (!tmLogTbody) return;
        if (tmLogCount) tmLogCount.textContent = dogrulamaLogs.length;

        if (dogrulamaLogs.length === 0) {
            tmLogTbody.innerHTML = '<tr class="empty-row"><td colspan="8">Henüz kaydedilmiş bir doğrulama tutanağı bulunmuyor. Yukarıdaki formu doldurarak tutanağı kaydedebilirsiniz.</td></tr>';
            return;
        }

        tmLogTbody.innerHTML = dogrulamaLogs.map(log => `
            <tr>
                <td>${log.date}</td>
                <td><strong>${log.tmNo}</strong></td>
                <td>${log.urunNo}</td>
                <td>${log.neden}</td>
                <td>${log.kontrolEden}</td>
                <td><strong>${log.score}</strong></td>
                <td>
                    <span class="${log.isOk ? 'badge-table-ok' : 'badge-table-nok'}">
                        ${log.decision}
                    </span>
                </td>
                <td>
                    <button type="button" class="btn btn-outline btn-sm btn-print-row" onclick="window.print()">
                        <i class="fa-solid fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    if (btnPrintDogrulama) {
        btnPrintDogrulama.addEventListener('click', () => {
            window.print();
        });
    }

    if (btnResetDogrulama) {
        btnResetDogrulama.addEventListener('click', () => {
            if (confirm('Tüm form seçimlerini ve eklenen özel noktaları sıfırlamak istiyor musunuz?')) {
                baglantiParametreleri = JSON.parse(JSON.stringify(initialBaglantiParametreleri));
                kriterDurumlari.forEach(k => { k.status = 'Evet'; k.note = ''; });
                if (newParamNameInput) newParamNameInput.value = '';
                renderBaglantiTable();
                renderKriterlerList();
                recalculateDogrulamaScore();
            }
        });
    }

    if (btnClearTmLogs) {
        btnClearTmLogs.addEventListener('click', () => {
            if (dogrulamaLogs.length === 0) return;
            if (confirm('Tüm doğrulama geçmişini temizlemek istediğinize emin misiniz?')) {
                dogrulamaLogs.length = 0;
                renderDogrulamaLogs();
            }
        });
    }

    if (btnExportTmCsv) {
        btnExportTmCsv.addEventListener('click', () => {
            if (dogrulamaLogs.length === 0) {
                alert('İndirilecek kayıtlı doğrulama tutanağı bulunmuyor.');
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
            csvContent += "No,Tarih,Test Masasi No,Urun No,Dogrulama Nedeni,Kontrol Eden,Uygunluk Skoru,Nihai Karar\n";

            dogrulamaLogs.forEach((log, index) => {
                const row = [
                    index + 1,
                    `"${log.date}"`,
                    `"${log.tmNo}"`,
                    `"${log.urunNo}"`,
                    `"${log.neden}"`,
                    `"${log.kontrolEden}"`,
                    `"${log.score}"`,
                    `"${log.decision}"`
                ].join(",");
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `PTR_07_222_02_Dogrulama_Tutanaklari_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Initialize Dogrulama Form
    renderBaglantiTable();
    renderKriterlerList();
    recalculateDogrulamaScore();

    // =========================================================================
    // 7. Contact Form Handler (Interactive feedback)
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Show success state
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağım.';

                contactForm.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1000);
        });
    }
});