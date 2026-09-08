/**
 * 5 Neden & Balık Kılçığı (Ishikawa - 6M) Görselleştirici Modülü
 * IPC-A-620 ve Otomotiv Kalite Standartlarına Uygun Kök Neden Analiz Aracı
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    // 6M Kategorileri Tanımı
    const CATEGORIES = [
        { id: 'man', label: 'İnsan (Man)', icon: 'fa-user-gear', color: '#1d4ed8' },
        { id: 'machine', label: 'Makine (Machine)', icon: 'fa-gears', color: '#0ea5e9' },
        { id: 'material', label: 'Malzeme (Material)', icon: 'fa-cubes', color: '#10b981' },
        { id: 'method', label: 'Metot (Method)', icon: 'fa-clipboard-list', color: '#f59e0b' },
        { id: 'milieu', label: 'Ortam (Environment)', icon: 'fa-temperature-half', color: '#8b5cf6' },
        { id: 'measurement', label: 'Ölçüm (Measurement)', icon: 'fa-ruler-combined', color: '#ec4899' }
    ];

    // Varsayılan / Aktif Veri Durumu
    let currentData = {
        problem: 'Kablo Donanım Hattı 03 - Krimp Çekme Testi (Pull-Force) Spesifikasyon Altında (< 60 N)',
        line: 'Hat 03 / Yarı Otomatik Pres',
        date: new Date().toISOString().split('T')[0],
        leader: 'Deniz Kanar (Proses Kalite)',
        causes: {
            man: [
                'Yeni operatörün tel yerleşim açısı oryantasyonu eksik',
                'Vardiya değişiminde krimp yüksekliği ilk parça onayı yapılmadı'
            ],
            machine: [
                'Aplikatör krimp bıçağında mikro aşınma ve çapak',
                'Pnömatik pres besleme havası basınç dalgalanması (4.5 bar düşüşü)'
            ],
            material: [
                'Terminal şeridinde ham madde et kalınlığı tolerans sapması (C2600 pirinç)',
                'Kablo iletken tel demetinde (strand) oksitlenme şüphesi'
            ],
            method: [
                'Sıyırma boyu talimatı 3.5mm iken sahada 4.2mm sıyrılmış (arka kanatta yetersiz tel)',
                'Aplikatör mikrometre ayar kartelası güncel değil'
            ],
            milieu: [
                'Saha bağıl nem oranı %65 üzerinde (izolasyon kayganlığı)',
                'İstasyon aydınlatması 400 Lux seviyesinde (görsel denetim zorluğu)'
            ],
            measurement: [
                'Dijital çekme cihazının kalibrasyon tarihi 1 gün geçmiş',
                'Krimp kumpasının çene paralelliğinde 0.03mm sapma'
            ]
        },
        fiveWhy: [
            { step: 1, question: 'Krimp çekme kuvveti neden 42 N (alt limit: 60 N) çıktı?', answer: 'İletken krimp kanadı teli yeterli basma kuvvetiyle kavramadı.' },
            { step: 2, question: 'İletken krimp kanadı neden yeterince basmadı?', answer: 'Krimp yüksekliği (CH) kumpasla ölçüldüğünde standart olan 1.25 mm yerine 1.34 mm bulundu.' },
            { step: 3, question: 'Krimp yüksekliği neden 1.34 mm olarak ayarlandı?', answer: 'Aplikatör kadran diski (dial) yeni partide ince ayar yapılmadan üretime verildi.' },
            { step: 4, question: 'Yeni parti terminal takıldığında neden ayar ve ilk parça yapılmadı?', answer: 'Operatör terminal parti numarasının (Lot No) değiştiğini fark etmedi.' },
            { step: 5, question: 'Operatör lot değişimini neden fark etmedi? (KÖK NEDEN)', answer: 'Makara askısında Lot Değişim Görsel Uyarı Kartı (Kamban) bulunmuyordu ve İlk Parça Onayı (First Off) zorunlu kilit sistemi pres üzerinde aktif değildi.' }
        ],
        rootCause: 'Lot değişiminde operatörü uyaran görsel yönetim eksikliği ve İlk Parça Onayı (First Piece) yapılmadan presin çalışmasını engelleyen Poka-Yoke / kilitleme mekanizmasının bulunmaması.',
        correctiveAction: '1) Krimp presine Lot Değişimi Barkod Okutma ve Otomatik Pres Kilitleme Poke-Yoke sistemi entegre edilecek. 2) İlk parça çekme testi sonucu sisteme girilmeden pres çalışmayacak.'
    };

    function init() {
        bindEvents();
        renderProblemInfo();
        renderCausesList();
        renderSvgFishbone();
        renderFiveWhy();
    }

    function bindEvents() {
        const themeObserver = new MutationObserver(() => {
            renderSvgFishbone();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Problem alanı güncellemeleri
        const probInput = document.getElementById('fishbone-problem-input');
        if (probInput) {
            probInput.addEventListener('input', (e) => {
                currentData.problem = e.target.value.trim() || 'Tanımsız Problem';
                renderSvgFishbone();
            });
        }

        // Örnek Vakalar
        document.getElementById('btn-fishbone-sample-1')?.addEventListener('click', () => loadPreset('crimp_pull'));
        document.getElementById('btn-fishbone-sample-2')?.addEventListener('click', () => loadPreset('strip_defect'));
        document.getElementById('btn-fishbone-sample-3')?.addEventListener('click', () => loadPreset('terminal_bend'));

        // Neden Ekleme Modalı / Butonu
        document.getElementById('btn-fishbone-add-cause')?.addEventListener('click', addCauseFromInput);

        // Excel ve PDF Butonları
        document.getElementById('btn-fishbone-export-excel')?.addEventListener('click', exportToExcel);
        document.getElementById('btn-fishbone-export-pdf')?.addEventListener('click', exportToPdf);

        // 5 Why Yeni Adım
        document.getElementById('btn-fishbone-add-why')?.addEventListener('click', addFiveWhyStep);

        // DÖF'e Aktar
        document.getElementById('btn-fishbone-to-dof')?.addEventListener('click', transferToDof);
    }

    function renderProblemInfo() {
        const probInput = document.getElementById('fishbone-problem-input');
        if (probInput) probInput.value = currentData.problem;

        const lineInput = document.getElementById('fishbone-line-input');
        if (lineInput) lineInput.value = currentData.line;

        const dateInput = document.getElementById('fishbone-date-input');
        if (dateInput) dateInput.value = currentData.date;

        const leaderInput = document.getElementById('fishbone-leader-input');
        if (leaderInput) leaderInput.value = currentData.leader;
    }

    function renderCausesList() {
        const container = document.getElementById('fishbone-categories-container');
        if (!container) return;

        container.innerHTML = '';
        CATEGORIES.forEach(cat => {
            const causes = currentData.causes[cat.id] || [];
            const card = document.createElement('div');
            card.className = 'fishbone-cat-box';
            card.style.borderTop = `3px solid ${cat.color}`;

            let itemsHtml = '';
            causes.forEach((item, idx) => {
                itemsHtml += `
                    <li class="fishbone-cause-item">
                        <span><i class="fa-solid fa-angle-right" style="color: ${cat.color}; font-size: 0.75rem;"></i> ${escapeHtml(item)}</span>
                        <button type="button" class="btn-remove-cause" data-cat="${cat.id}" data-idx="${idx}" title="Nedeni Kaldır">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </li>
                `;
            });

            card.innerHTML = `
                <div class="fishbone-cat-header">
                    <span style="color: ${cat.color}; font-weight: 700; font-size: 0.88rem;">
                        <i class="fa-solid ${cat.icon}"></i> ${cat.label}
                    </span>
                    <span class="badge" style="font-size: 0.72rem; background: var(--bg-secondary); border: 1px solid var(--border-color);">${causes.length}</span>
                </div>
                <ul class="fishbone-causes-ul">
                    ${itemsHtml || '<li style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Henüz neden eklenmedi.</li>'}
                </ul>
            `;
            container.appendChild(card);
        });

        // Silme butonlarını bağla
        container.querySelectorAll('.btn-remove-cause').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const catId = e.currentTarget.getAttribute('data-cat');
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                if (currentData.causes[catId]) {
                    currentData.causes[catId].splice(idx, 1);
                    renderCausesList();
                    renderSvgFishbone();
                }
            });
        });
    }

    function addCauseFromInput() {
        const catSelect = document.getElementById('fishbone-new-cat');
        const textInput = document.getElementById('fishbone-new-cause-text');
        if (!catSelect || !textInput) return;

        const cat = catSelect.value;
        const text = textInput.value.trim();
        if (!text) {
            alert('Lütfen eklenecek nedeni yazınız.');
            return;
        }

        if (!currentData.causes[cat]) {
            currentData.causes[cat] = [];
        }
        currentData.causes[cat].push(text);
        textInput.value = '';
        renderCausesList();
        renderSvgFishbone();
    }

    // Dinamik SVG Balık Kılçığı Çizimi (6M Ishikawa Diagramı)
    function renderSvgFishbone() {
        const svg = document.getElementById('fishbone-svg');
        if (!svg) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const strokeColor = isDark ? '#94a3b8' : '#334155';
        const spineColor = '#e11d48';
        const textColor = isDark ? '#f1f5f9' : '#0f172a';
        const subTextColor = isDark ? '#94a3b8' : '#475569';
        const boxBg = isDark ? '#1e293b' : '#ffffff';
        const boxBorder = isDark ? '#334155' : '#cbd5e1';

        // SVG Boyutları
        const width = 1000;
        const height = 520;
        const spineY = 260;
        const spineStartX = 40;
        const spineEndX = 780;

        // Üst 3 dal X pozisyonları: İnsan (200), Makine (400), Malzeme (600)
        // Alt 3 dal X pozisyonları: Metot (200), Ortam (400), Ölçüm (600)
        const branchCoords = [
            { id: 'man', xBottom: 220, xTop: 150, yTop: 50, isTop: true },
            { id: 'machine', xBottom: 420, xTop: 350, yTop: 50, isTop: true },
            { id: 'material', xBottom: 620, xTop: 550, yTop: 50, isTop: true },
            { id: 'method', xBottom: 220, xTop: 150, yTop: 470, isTop: false },
            { id: 'milieu', xBottom: 420, xTop: 350, yTop: 470, isTop: false },
            { id: 'measurement', xBottom: 620, xTop: 550, yTop: 470, isTop: false }
        ];

        let svgHtml = `
            <defs>
                <marker id="spine-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="${spineColor}" />
                </marker>
                <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="115%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.15" />
                </filter>
            </defs>
        `;

        // 1. Ana Omurga (Spine)
        svgHtml += `
            <line x1="${spineStartX}" y1="${spineY}" x2="${spineEndX}" y2="${spineY}" 
                  stroke="${spineColor}" stroke-width="5" stroke-linecap="round" marker-end="url(#spine-arrow)" />
        `;

        // 2. Problem Başı (Head Box)
        const probText = currentData.problem;
        svgHtml += `
            <g transform="translate(790, ${spineY - 55})">
                <rect width="195" height="110" rx="8" fill="${boxBg}" stroke="${spineColor}" stroke-width="2.5" filter="url(#card-shadow)" />
                <rect width="195" height="26" rx="8" fill="${spineColor}" />
                <text x="97" y="18" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="0.5">PROBLEM / ETKİ</text>
                <foreignObject x="10" y="32" width="175" height="72">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 11px; font-weight: 600; color: ${textColor}; line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; text-align: center; font-family: inherit;">
                        ${escapeHtml(probText)}
                    </div>
                </foreignObject>
            </g>
        `;

        // 3. 6M Kemikleri ve Nedenler
        branchCoords.forEach(b => {
            const cat = CATEGORIES.find(c => c.id === b.id);
            const causes = currentData.causes[b.id] || [];

            // Ana Kemik Çizgisi
            svgHtml += `
                <line x1="${b.xBottom}" y1="${spineY}" x2="${b.xTop}" y2="${b.yTop}" 
                      stroke="${cat.color}" stroke-width="3" stroke-linecap="round" />
            `;

            // Kategori Başlık Rozeti
            const badgeY = b.isTop ? b.yTop - 18 : b.yTop + 6;
            svgHtml += `
                <g transform="translate(${b.xTop - 65}, ${badgeY})">
                    <rect width="130" height="26" rx="13" fill="${boxBg}" stroke="${cat.color}" stroke-width="1.8" filter="url(#card-shadow)" />
                    <text x="65" y="17" fill="${cat.color}" font-size="11" font-weight="700" text-anchor="middle">
                        ${cat.label}
                    </text>
                </g>
            `;

            // Alt Nedenler (Riblets)
            const count = causes.length;
            if (count > 0) {
                const step = (spineY - b.yTop) / (count + 1);
                causes.forEach((cause, idx) => {
                    const frac = (idx + 1) / (count + 1);
                    const currY = b.isTop ? (spineY - step * (idx + 1)) : (spineY + step * (idx + 1));
                    const currX = b.xBottom - (b.xBottom - b.xTop) * frac;
                    const ribLength = 110;
                    const ribEndX = currX - ribLength;

                    // Yatay Kılçık
                    svgHtml += `
                        <line x1="${currX}" y1="${currY}" x2="${ribEndX}" y2="${currY}" 
                              stroke="${cat.color}" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.8" />
                        <circle cx="${currX}" cy="${currY}" r="3" fill="${cat.color}" />
                    `;

                    // Neden Metni
                    const textY = currY - 4;
                    const truncated = cause.length > 28 ? cause.substring(0, 26) + '...' : cause;
                    svgHtml += `
                        <text x="${ribEndX - 6}" y="${textY + 4}" fill="${textColor}" font-size="10" font-weight="500" text-anchor="end">
                            ${escapeHtml(truncated)}
                        </text>
                    `;
                });
            }
        });

        svg.innerHTML = svgHtml;
    }

    function renderFiveWhy() {
        const container = document.getElementById('fishbone-five-why-steps');
        if (!container) return;

        container.innerHTML = '';
        currentData.fiveWhy.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'five-why-row';
            const isLast = idx === currentData.fiveWhy.length - 1;

            row.innerHTML = `
                <div class="why-badge ${isLast ? 'badge-root' : ''}">
                    ${isLast ? '<i class="fa-solid fa-crosshairs"></i> Kök Neden' : (idx + 1) + '. Neden'}
                </div>
                <div class="why-inputs">
                    <div class="why-q-box">
                        <label>Soru (${idx + 1}. Neden):</label>
                        <input type="text" class="five-why-q" data-idx="${idx}" value="${escapeHtml(item.question)}" placeholder="Neden oldu?">
                    </div>
                    <div class="why-a-box">
                        <label>Cevap & Bulgular:</label>
                        <input type="text" class="five-why-a" data-idx="${idx}" value="${escapeHtml(item.answer)}" placeholder="Çünkü...">
                    </div>
                </div>
                ${idx > 1 ? `
                    <button type="button" class="btn-del-why" data-idx="${idx}" title="Adımı Kaldır">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                ` : ''}
            `;
            container.appendChild(row);
        });

        // Input dinleyicileri
        container.querySelectorAll('.five-why-q').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'), 10);
                if (currentData.fiveWhy[idx]) currentData.fiveWhy[idx].question = e.target.value;
            });
        });

        container.querySelectorAll('.five-why-a').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'), 10);
                if (currentData.fiveWhy[idx]) currentData.fiveWhy[idx].answer = e.target.value;
            });
        });

        container.querySelectorAll('.btn-del-why').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                currentData.fiveWhy.splice(idx, 1);
                renderFiveWhy();
            });
        });

        // Kök Neden ve Düzeltici Faaliyet Alanları
        const rootInput = document.getElementById('fishbone-root-cause');
        if (rootInput) rootInput.value = currentData.rootCause;

        const actionInput = document.getElementById('fishbone-corrective-action');
        if (actionInput) actionInput.value = currentData.correctiveAction;
    }

    function addFiveWhyStep() {
        const nextNum = currentData.fiveWhy.length + 1;
        currentData.fiveWhy.push({
            step: nextNum,
            question: `${nextNum}. Neden oldu?`,
            answer: ''
        });
        renderFiveWhy();
    }

    function loadPreset(type) {
        if (type === 'crimp_pull') {
            currentData.problem = 'Kablo Donanım Hattı 03 - Krimp Çekme Testi (Pull-Force) Spesifikasyon Altında (< 60 N)';
            currentData.causes.man = ['Operatörün krimp presi tel dayama derinliğini gözle kontrol etmemesi', 'Vardiya devrinde ilk parça çekme numunesi alınmaması'];
            currentData.causes.machine = ['Aplikatör alt krimp örsünde (anvil) mikro çapak birikimi', 'Pres vuruş strok yüksekliğinde 0.05 mm gevşeme'];
            currentData.causes.material = ['Terminal pirinç alaşımında sertlik dalgalanması (Lot #2026-B)', 'Kablo iletken bakır tellerinde eksik damar (strand) tespiti'];
            currentData.causes.method = ['Sıyırma boyu görsel talimata aykırı (3.2mm yerine 4.1mm)', 'İki farklı kesitte kablo için aynı aplikatörün kullanılması'];
            currentData.causes.milieu = ['Hattın aşırı vibrasyonlu konveyör yakınında bulunması', 'Yetersiz tezgah aydınlatması'];
            currentData.causes.measurement = ['Çekme test cihazı çenelerinde kayma', 'Mikrometre sıfırlama hatası'];
            currentData.rootCause = 'Aplikatör mikrometre ayar diskinde vida gevşemesi ve İlk Parça Onayı (First Piece) yapılmadan presin start alması.';
            currentData.correctiveAction = 'Aplikatör diski torklu vidayla sabitlendi, Pres startına dijital İlk Parça Onay Poka-Yoke kilidi entegre edildi.';
        } else if (type === 'strip_defect') {
            currentData.problem = 'Otomatik Kesme & Sıyırma Makinesinde İletken Bakır Tellerinde Kesik & Ezilme';
            currentData.causes.man = ['Operatörün bıçak değişimi sonrası kalibrasyon doğrulaması yapmaması'];
            currentData.causes.machine = ['V-şekilli sıyırma bıçağında körelme ve mikro çentik'];
            currentData.causes.material = ['Kablo izolasyon et kalınlığında (Wall Thickness) eksantriklik'];
            currentData.causes.method = ['Reçete parametresinde sıyırma yarıçapının 0.15mm küçük girilmesi'];
            currentData.causes.milieu = ['Kablo makarasının soğuk depodan hatta beklemeden alınması (sert PVC)'];
            currentData.causes.measurement = ['Mikroskop altında iletken kontrol periyodunun atlanması'];
            currentData.rootCause = 'Soğuk ortamdan gelen kablo reçetesinde sıcaklık faktörü gözetilmeden standart bıçak yarıçapı uygulanması.';
            currentData.correctiveAction = 'Hammadde sıcaklık dengeleme prosedürü devreye alındı, bıçak bileme periyodu 250.000 vuruşa çekildi.';
        } else if (type === 'terminal_bend') {
            currentData.problem = 'Konnektör Montajı Sırasında Terminal Geçme Kuvvetinin Yüksek Olması & Pinin Eğrilmesi';
            currentData.causes.man = ['Operatörün konnektöre terminal takarken açılı (eğik) itmesi'];
            currentData.causes.machine = ['Aplikatör terminal taşıyıcı şerit (carrier strip) kesme bıçağında uzun çapak kalması'];
            currentData.causes.material = ['Konnektör kilit tırnağında enjeksiyon çapağı'];
            currentData.causes.method = ['Montaj kasetinde yönlendirme yuvası (Poka-Yoke) bulunmaması'];
            currentData.causes.milieu = ['ESD montaj masasında statik elektrik yüklenmesi'];
            currentData.causes.measurement = ['Geçme kuvveti fikstürünün aşınmış olması'];
            currentData.rootCause = 'Aplikatörün taşıyıcı şerit çapağını 0.08mm uzun bırakması sebebiyle terminalin konnektör yuvasına sürtünmesi.';
            currentData.correctiveAction = 'Aplikatör taşıyıcı kesme bıçağı yenilendi, konnektör montaj masasına 90 derece dik giriş aparatı eklendi.';
        }

        renderProblemInfo();
        renderCausesList();
        renderSvgFishbone();
        renderFiveWhy();
    }

    // DÖF / CAPA Modülüne Otomatik Aktar
    function transferToDof() {
        const rootInput = document.getElementById('fishbone-root-cause');
        const actionInput = document.getElementById('fishbone-corrective-action');
        const rootText = rootInput ? rootInput.value : currentData.rootCause;
        const actionText = actionInput ? actionInput.value : currentData.correctiveAction;

        if (window.DofCapaModule && window.DofCapaModule.addNewDofDirect) {
            const newId = window.DofCapaModule.addNewDofDirect({
                title: currentData.problem,
                source: '5 Neden & Balık Kılçığı Analizi',
                department: currentData.line || 'Kablo & Krimp Hattı',
                assignedTo: currentData.leader || 'Deniz Kanar',
                rootCause: rootText,
                action: actionText,
                priority: 'Yüksek'
            });

            if (window.QualityHub && window.QualityHub.switchToModule) {
                window.QualityHub.switchToModule('dof');
            }
            alert(`Bu kök neden analizi DÖF/CAPA modülüne aktarıldı! (Kayıt No: ${newId})`);
        } else {
            alert('DÖF/CAPA modülü henüz hazır değil veya veri aktarılamadı.');
        }
    }

    // Excel (.xlsx) Dışa Aktar
    function exportToExcel() {
        const excelData = [];
        excelData.push({
            'Kategori': 'GENEL BİLGİLER',
            'Soru / Adım': 'Problem Tanımı',
            'Neden / Bulgular': currentData.problem,
            'Sorumlu & Alan': `${currentData.leader} - ${currentData.line}`,
            'Tarih': currentData.date
        });

        // 6M Nedenleri
        CATEGORIES.forEach(cat => {
            const causes = currentData.causes[cat.id] || [];
            causes.forEach((cause, idx) => {
                excelData.push({
                    'Kategori': cat.label,
                    'Soru / Adım': `${cat.label} #${idx + 1}`,
                    'Neden / Bulgular': cause,
                    'Sorumlu & Alan': currentData.line,
                    'Tarih': currentData.date
                });
            });
        });

        // 5 Why Adımları
        currentData.fiveWhy.forEach((fw, idx) => {
            excelData.push({
                'Kategori': `5 Neden (Why #${idx + 1})`,
                'Soru / Adım': fw.question,
                'Neden / Bulgular': fw.answer,
                'Sorumlu & Alan': 'Kök Neden Araştırması',
                'Tarih': currentData.date
            });
        });

        const rootInput = document.getElementById('fishbone-root-cause')?.value || currentData.rootCause;
        const actionInput = document.getElementById('fishbone-corrective-action')?.value || currentData.correctiveAction;

        excelData.push({
            'Kategori': 'SONUÇ & AKSİYON',
            'Soru / Adım': 'Kesin Kök Neden (Root Cause)',
            'Neden / Bulgular': rootInput,
            'Sorumlu & Alan': currentData.leader,
            'Tarih': currentData.date
        });

        excelData.push({
            'Kategori': 'SONUÇ & AKSİYON',
            'Soru / Adım': 'Kalıcı Düzeltici Önleyici Faaliyet',
            'Neden / Bulgular': actionInput,
            'Sorumlu & Alan': currentData.leader,
            'Tarih': currentData.date
        });

        if (window.ExportHelper) {
            window.ExportHelper.toExcel('Ishikawa_5Neden_Kok_Neden_Raporu', 'Balık Kılçığı & 5 Neden', excelData);
        }
    }

    // PDF (.pdf) Dışa Aktar
    function exportToPdf() {
        const reportEl = document.getElementById('qm-panel-ishikawa');
        if (window.ExportHelper && reportEl) {
            window.ExportHelper.toPdf(reportEl, 'Ishikawa_Balik_Kilcigi_Raporu', {
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            });
        } else {
            window.print();
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    window.FishboneModule = {
        init,
        loadPreset,
        exportToExcel,
        exportToPdf
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
