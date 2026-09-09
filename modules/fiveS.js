/**
 * 5S Skorlama & Chart.js Radar Grafiği Modülü
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    // 5S Soruları Veri Tabanı (Endüstriyel & Kablo Montaj / Üretim Sahası Standartları)
    const FIVES_DATA = {
        seiri: {
            title: '1S - Seiri (Ayıkla)',
            subtitle: 'Gereksiz olanı ayıkla, alandan uzaklaştır ve Kırmızı Etiketleme uygula.',
            icon: 'fa-solid fa-filter',
            questions: [
                {
                    id: 'q1',
                    code: '1S.1',
                    text: 'İş istasyonunda o anki iş emrine ait olmayan atıl kablo makaraları, boş kutular veya numuneler var mı?',
                    desc: 'Sadece aktif montaj partisine ait hammaddeler sahada bulunmalı, fazlalıklar ambara/red alanına iade edilmelidir.',
                    defaultScore: 4
                },
                {
                    id: 'q2',
                    code: '1S.2',
                    text: 'Kırmızı Etiket (Red Tag) alanı belirlenmiş ve şüpheli/hatalı terminaller net ayrıştırılmış mı?',
                    desc: 'Uygunsuz veya karantinaya alınmış komponentler izole edilmeli, karışma riski sıfırlanmalıdır.',
                    defaultScore: 3
                },
                {
                    id: 'q3',
                    code: '1S.3',
                    text: 'Çalışma masasında sadece o an ihtiyaç duyulan standart el aletleri ve teknik çizimler mi bulunuyor?',
                    desc: 'Kullanılmayan tork anahtarları, pense veya klemensler kaldırılmış olmalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q4',
                    code: '1S.4',
                    text: 'Hurda kablo uçları, sıyırma izolasyon artıkları ve krimp çapakları düzenli tahliye ediliyor mu?',
                    desc: 'Atık kutuları taşmamış olmalı, metal krimp çapakları özel kutularda toplanmalıdır.',
                    defaultScore: 3
                }
            ]
        },
        seiton: {
            title: '2S - Seiton (Düzenle)',
            subtitle: 'Her şey için bir yer, her şey yerli yerinde. Adresleme ve gölge panoları.',
            icon: 'fa-solid fa-table-cells',
            questions: [
                {
                    id: 'q5',
                    code: '2S.1',
                    text: 'Krimp penseleri, kumpaslar ve mikrometrelerin yerleri gölge panosu (Shadow board) ile tanımlı mı?',
                    desc: 'Ölçü aletlerinin kalibrasyon etiketi görünür olmalı ve tanımlı yuvalarında saklanmalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q6',
                    code: '2S.2',
                    text: 'Kablo gruplama sehpaları, soket rafları ve terminal kutuları açıkça kodlanmış ve etiketlenmiş mi?',
                    desc: 'Hammadde kodları, parça numaraları ve lot bilgileri uzaktan okunabilir olmalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q7',
                    code: '2S.3',
                    text: 'Zemin çizgileri, yürüme yolları ve yarı mamül (WIP) bekleme alanları standart sarı/beyaz çizgilerle belirlenmiş mi?',
                    desc: 'Palet ve taşıma arabaları zemin sınır çizgileri dışına taşmamalıdır.',
                    defaultScore: 3
                },
                {
                    id: 'q8',
                    code: '2S.4',
                    text: 'Acil durum ekipmanları, yangın tüpleri ve elektrik panolarının önü açık ve zemini taralı mı?',
                    desc: 'İş güvenliği ve acil erişim alanları en az 1 metre mesafe ile serbest bırakılmalıdır.',
                    defaultScore: 5
                }
            ]
        },
        seiso: {
            title: '3S - Seiso (Temizle)',
            subtitle: 'Temizlik bir denetimdir. Arızaları ve kaçakları temizlerken erken tespit et.',
            icon: 'fa-solid fa-broom',
            questions: [
                {
                    id: 'q9',
                    code: '3S.1',
                    text: 'Krimp presleri, aplikatör bıçakları ve test aparatları temiz, yağ ve çapak birikintisinden arındırılmış mı?',
                    desc: 'Aplikatör kızakları ve örs bölgesi pürüzsüz ve temiz olmalı, krimp geometrisini bozacak kir olmamalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q10',
                    code: '3S.2',
                    text: 'Günlük 5 dakikalık temizlik ve makine otonom bakım kontrol formu operatörce imzalanmış mı?',
                    desc: 'Vardiya başlangıç ve bitiş kontrolleri kayıt altına alınmalıdır.',
                    defaultScore: 3
                },
                {
                    id: 'q11',
                    code: '3S.3',
                    text: 'Çalışma masası yüzeyleri, zemin ve aydınlatma armatürleri temiz, aydınlatma montaj için yeterli mi?',
                    desc: 'İnce kablo montajı için minimum 500-750 Lux ışık seviyesi sağlanmalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q12',
                    code: '3S.4',
                    text: 'Hava basınç hortumlarında kaçak, yağ damlaması veya mekanik gevşeklik var mı?',
                    desc: 'Temizlik esnasında basınç göstergeleri ve pnömatik hortumlar gözle muayene edilmelidir.',
                    defaultScore: 4
                }
            ]
        },
        seiketsu: {
            title: '4S - Seiketsu (Standartlaştır)',
            subtitle: 'İlk 3S’i kurala bağla. Görsel fabrika, limit numuneler ve renk kodları.',
            icon: 'fa-solid fa-list-check',
            questions: [
                {
                    id: 'q13',
                    code: '4S.1',
                    text: 'İstasyon başında onaylı Hatalı/Doğru Krimp Limit Numune Panosu ve IPC-A-620 görsel kartı asılı mı?',
                    desc: 'Operatör şüpheli durumda hemen görsel limit panosundan tolerans kıyaslaması yapabilmelidir.',
                    defaultScore: 5
                },
                {
                    id: 'q14',
                    code: '4S.2',
                    text: 'Hata sepetleri (Kırmızı Kutu) ve uygun ürün kasaları standart renk kodlaması ile ayırt edilmiş mi?',
                    desc: 'Kırmızı: Hatalı/Hurda, Sarı: Şüpheli/Karantina, Mavi/Yeşil: Onaylı Ürün.',
                    defaultScore: 4
                },
                {
                    id: 'q15',
                    code: '4S.3',
                    text: 'Operatörler KKD (ESD antistatik bileklik/önlük, koruyucu gözlük, iş ayakkabısı) standartlarına uyuyor mu?',
                    desc: 'ESD testi vardiya başında yapılmış ve ESD log defterine yazılmış olmalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q16',
                    code: '4S.4',
                    text: 'İlk Parça Onayı (First Off) ve CCH/CCW çekme testi etiketleri krimp presine asılmış mı?',
                    desc: 'Vardiya veya bobin değişiminde krimp doğrulama yapılmadan seri üretime geçilmemelidir.',
                    defaultScore: 4
                }
            ]
        },
        shitsuke: {
            title: '5S - Shitsuke (Sürdür & Disiplin)',
            subtitle: 'Alışkanlık haline getir, düzenli denetle ve sürekli iyileştirme (Kaizen) sağla.',
            icon: 'fa-solid fa-arrows-spin',
            questions: [
                {
                    id: 'q17',
                    code: '5S.1',
                    text: 'Haftalık ve aylık 5S iç denetimleri planlanan takvimde yapılıyor ve sonuç skoru panoda sergileniyor mu?',
                    desc: 'Hat skorları şeffaf olarak operatörlerin görebileceği kalite panosunda yer almalıdır.',
                    defaultScore: 4
                },
                {
                    id: 'q18',
                    code: '5S.2',
                    text: 'Önceki 5S denetimlerinde açılan DÖF veya aksiyon maddeleri termin süresinde kapatılmış mı?',
                    desc: 'Geciken aksiyonlar için kök neden sorgulanmalı ve eskalasyon yapılmalıdır.',
                    defaultScore: 3
                },
                {
                    id: 'q19',
                    code: '5S.3',
                    text: 'Operatörler 5S kurallarını içselleştirmiş mi, öneri ve Kaizen sistemine aktif katılım sağlıyor mu?',
                    desc: 'Saha çalışanlarının ergonomi ve düzen iyileştirme önerileri teşvik edilmelidir.',
                    defaultScore: 4
                },
                {
                    id: 'q20',
                    code: '5S.4',
                    text: 'Yönetim ve hat liderleri haftalık Gemba yürüyüşü ile 5S sürekliliğini sahada bizzat destekliyor mu?',
                    desc: 'Üst yönetim katılımı olmadan 5S sürdürülebilirliği sağlanamaz.',
                    defaultScore: 4
                }
            ]
        }
    };

    // State
    let currentPillar = 'seiri';
    let auditScores = {};
    let auditNotes = {};
    let auditFindings = {};
    let radarChart = null;

    // LocalStorage Keys
    const STORAGE_KEY_AUDITS = 'fives_audit_history';

    // Initialize module
    function init() {
        initDefaultScores();
        renderPillarNav();
        renderQuestions();
        initRadarChart();
        updateScoreCalculations();
        renderHistoryTable();
        bindEvents();
    }

    // Load or set default scores
    function initDefaultScores() {
        Object.keys(FIVES_DATA).forEach(pillarKey => {
            FIVES_DATA[pillarKey].questions.forEach(q => {
                if (auditScores[q.id] === undefined) {
                    auditScores[q.id] = q.defaultScore;
                }
                if (!auditNotes[q.id]) {
                    auditNotes[q.id] = '';
                }
                if (!auditFindings[q.id]) {
                    auditFindings[q.id] = auditScores[q.id] >= 4 ? 'Uygun' : (auditScores[q.id] === 3 ? 'Gelişime Açık' : 'Uygunsuzluk');
                }
            });
        });
    }

    // Render 5S Pillar Stepper Tabs
    function renderPillarNav() {
        const navContainer = document.getElementById('fives-pillars-nav');
        if (!navContainer) return;

        navContainer.innerHTML = '';
        const pillars = [
            { key: 'seiri', label: '1S Ayıkla', code: 'Seiri' },
            { key: 'seiton', label: '2S Düzenle', code: 'Seiton' },
            { key: 'seiso', label: '3S Temizle', code: 'Seiso' },
            { key: 'seiketsu', label: '4S Standart', code: 'Seiketsu' },
            { key: 'shitsuke', label: '5S Sürdür', code: 'Shitsuke' }
        ];

        pillars.forEach(p => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `fives-pillar-btn ${p.key === currentPillar ? 'active' : ''}`;
            btn.setAttribute('data-pillar', p.key);
            btn.id = `pillar-btn-${p.key}`;
            
            const avg = getPillarAverage(p.key);
            btn.innerHTML = `
                <span>${p.label}</span>
                <span class="fives-pillar-score-badge" id="badge-${p.key}">${avg.toFixed(1)}/5</span>
            `;

            btn.addEventListener('click', () => {
                switchPillar(p.key);
            });

            navContainer.appendChild(btn);
        });
    }

    function switchPillar(pillarKey) {
        currentPillar = pillarKey;
        document.querySelectorAll('.fives-pillar-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-pillar') === pillarKey);
        });
        renderQuestions();
    }

    // Calculate pillar average (1-5 scale)
    function getPillarAverage(pillarKey) {
        const questions = FIVES_DATA[pillarKey].questions;
        if (!questions.length) return 0;
        let sum = 0;
        questions.forEach(q => {
            sum += (auditScores[q.id] || 0);
        });
        return sum / questions.length;
    }

    // Render Questions for Current Pillar
    function renderQuestions() {
        const container = document.getElementById('fives-questions-container');
        const bannerContainer = document.getElementById('fives-pillar-banner');
        if (!container || !bannerContainer) return;

        const pillar = FIVES_DATA[currentPillar];

        bannerContainer.innerHTML = `
            <div>
                <h4><i class="${pillar.icon}"></i> ${pillar.title}</h4>
                <p>${pillar.subtitle}</p>
            </div>
            <div style="text-align: right;">
                <span class="badge" style="background: var(--bg-card); color: var(--primary); font-weight: 700; border: 1px solid var(--border-color);">
                    Ortalama: <span id="banner-score-${currentPillar}">${getPillarAverage(currentPillar).toFixed(1)} / 5</span>
                </span>
            </div>
        `;

        container.innerHTML = '';
        pillar.questions.forEach(q => {
            const currentScore = auditScores[q.id] || 3;
            const currentNote = auditNotes[q.id] || '';
            const currentFinding = auditFindings[q.id] || 'Uygun';

            const item = document.createElement('div');
            item.className = 'fives-q-item';
            item.id = `q-item-${q.id}`;

            item.innerHTML = `
                <div class="fives-q-header">
                    <div class="fives-q-text">${q.text}</div>
                    <span class="fives-q-code">${q.code}</span>
                </div>
                <div class="fives-q-desc">${q.desc}</div>
                
                <div class="fives-rating-group" id="rating-group-${q.id}">
                    <button type="button" class="fives-rate-btn ${currentScore === 1 ? 'selected' : ''}" data-score="1" data-qid="${q.id}">
                        <span class="rate-num">1</span>
                        <span class="rate-lbl">Çok Zayıf</span>
                    </button>
                    <button type="button" class="fives-rate-btn ${currentScore === 2 ? 'selected' : ''}" data-score="2" data-qid="${q.id}">
                        <span class="rate-num">2</span>
                        <span class="rate-lbl">Geliştirilmeli</span>
                    </button>
                    <button type="button" class="fives-rate-btn ${currentScore === 3 ? 'selected' : ''}" data-score="3" data-qid="${q.id}">
                        <span class="rate-num">3</span>
                        <span class="rate-lbl">Kısmi/Orta</span>
                    </button>
                    <button type="button" class="fives-rate-btn ${currentScore === 4 ? 'selected' : ''}" data-score="4" data-qid="${q.id}">
                        <span class="rate-num">4</span>
                        <span class="rate-lbl">İyi / Standart</span>
                    </button>
                    <button type="button" class="fives-rate-btn ${currentScore === 5 ? 'selected' : ''}" data-score="5" data-qid="${q.id}">
                        <span class="rate-num">5</span>
                        <span class="rate-lbl">Mükemmel</span>
                    </button>
                </div>

                <div class="fives-q-footer">
                    <input type="text" class="fives-q-note-input" placeholder="Gözlem notu / Saha tespiti (Örn: Makara rafı etiketlenecek)" value="${escapeHtml(currentNote)}" data-qid="${q.id}">
                    <select class="fives-q-status-select" data-qid="${q.id}">
                        <option value="Uygun" ${currentFinding === 'Uygun' ? 'selected' : ''}>✓ Uygun</option>
                        <option value="Gelişime Açık" ${currentFinding === 'Gelişime Açık' ? 'selected' : ''}>▲ Gelişime Açık</option>
                        <option value="Uygunsuzluk" ${currentFinding === 'Uygunsuzluk' ? 'selected' : ''}>✕ Uygunsuzluk</option>
                    </select>
                </div>
            `;

            container.appendChild(item);
        });

        // Add event listeners to newly rendered question controls
        container.querySelectorAll('.fives-rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const qid = targetBtn.getAttribute('data-qid');
                const score = parseInt(targetBtn.getAttribute('data-score'), 10);

                auditScores[qid] = score;

                // Update UI buttons in this group
                const group = document.getElementById(`rating-group-${qid}`);
                if (group) {
                    group.querySelectorAll('.fives-rate-btn').forEach(b => b.classList.remove('selected'));
                    targetBtn.classList.add('selected');
                }

                // Auto update finding status if not customized
                const statusSelect = container.querySelector(`select[data-qid="${qid}"]`);
                if (statusSelect) {
                    if (score <= 2) {
                        statusSelect.value = 'Uygunsuzluk';
                        auditFindings[qid] = 'Uygunsuzluk';
                    } else if (score === 3) {
                        statusSelect.value = 'Gelişime Açık';
                        auditFindings[qid] = 'Gelişime Açık';
                    } else {
                        statusSelect.value = 'Uygun';
                        auditFindings[qid] = 'Uygun';
                    }
                }

                updateScoreCalculations();
            });
        });

        container.querySelectorAll('.fives-q-note-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const qid = e.target.getAttribute('data-qid');
                auditNotes[qid] = e.target.value;
                renderActionItems();
            });
        });

        container.querySelectorAll('.fives-q-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const qid = e.target.getAttribute('data-qid');
                auditFindings[qid] = e.target.value;
                renderActionItems();
            });
        });
    }

    // Chart.js Radar Chart
    function initRadarChart() {
        const canvas = document.getElementById('fives-radar-chart');
        if (!canvas) return;

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded yet');
            return;
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colors = getThemeChartColors(isDark);

        const ctx = canvas.getContext('2d');
        const data = getPillarScoresArray();

        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    '1S Ayıkla (Seiri)',
                    '2S Düzenle (Seiton)',
                    '3S Temizle (Seiso)',
                    '4S Standart (Seiketsu)',
                    '5S Sürdür (Shitsuke)'
                ],
                datasets: [
                    {
                        label: 'Mevcut Saha Skoru (%)',
                        data: data.percentages,
                        backgroundColor: 'rgba(29, 78, 137, 0.25)',
                        borderColor: '#2878b5',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#d95d39',
                        pointBorderColor: '#ffffff',
                        pointHoverBackgroundColor: '#ffffff',
                        pointHoverBorderColor: '#d95d39',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Hedef Benchmark (85%)',
                        data: [85, 85, 85, 85, 85],
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        borderColor: '#10b981',
                        borderWidth: 1.8,
                        borderDash: [5, 5],
                        pointRadius: 2,
                        pointHoverRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: colors.gridColor
                        },
                        grid: {
                            color: colors.gridColor
                        },
                        pointLabels: {
                            color: colors.textColor,
                            font: {
                                size: 11,
                                family: "'Plus Jakarta Sans', sans-serif",
                                weight: '600'
                            }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: colors.textColorMuted,
                            stepSize: 20,
                            min: 0,
                            max: 100,
                            font: {
                                size: 9
                            }
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: colors.textColor,
                            font: {
                                size: 11,
                                family: "'Plus Jakarta Sans', sans-serif"
                            },
                            boxWidth: 14,
                            padding: 14
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.dataset.label}: %${context.raw.toFixed(1)}`;
                            }
                        }
                    }
                }
            }
        });

        // Watch theme changes to re-color chart
        const themeObserver = new MutationObserver(() => {
            const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
            updateChartTheme(isDarkNow);
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    function getThemeChartColors(isDark) {
        if (isDark) {
            return {
                gridColor: 'rgba(255, 255, 255, 0.12)',
                textColor: '#f8fafc',
                textColorMuted: '#9eafbc'
            };
        }
        return {
            gridColor: 'rgba(0, 0, 0, 0.1)',
            textColor: '#0f172a',
            textColorMuted: '#657585'
        };
    }

    function updateChartTheme(isDark) {
        if (!radarChart) return;
        const colors = getThemeChartColors(isDark);
        radarChart.options.scales.r.angleLines.color = colors.gridColor;
        radarChart.options.scales.r.grid.color = colors.gridColor;
        radarChart.options.scales.r.pointLabels.color = colors.textColor;
        radarChart.options.scales.r.ticks.color = colors.textColorMuted;
        radarChart.options.plugins.legend.labels.color = colors.textColor;
        radarChart.update();
    }

    // Return averages and percentages for each pillar
    function getPillarScoresArray() {
        const pillars = ['seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'];
        const averages = pillars.map(p => getPillarAverage(p));
        const percentages = averages.map(avg => (avg / 5) * 100);
        return { pillars, averages, percentages };
    }

    // Recalculate everything and update radar chart + UI displays
    function updateScoreCalculations() {
        const { averages, percentages } = getPillarScoresArray();

        // Overall score (average of percentages)
        const overallScore = percentages.reduce((acc, curr) => acc + curr, 0) / percentages.length;
        const overallScoreElem = document.getElementById('fives-overall-score');
        if (overallScoreElem) {
            overallScoreElem.textContent = `%${Math.round(overallScore)}`;
        }

        const overallOutOfElem = document.getElementById('fives-out-of-5');
        if (overallOutOfElem) {
            const scoreOut5 = (overallScore / 20).toFixed(2);
            overallOutOfElem.textContent = `${scoreOut5} / 5.00 Puan`;
        }

        // Maturity level badge
        const levelBadgeElem = document.getElementById('fives-level-badge');
        if (levelBadgeElem) {
            let badgeClass = 'level-poor';
            let badgeText = 'Seviye 1: Başlangıç (<%50)';
            let badgeIcon = 'fa-solid fa-triangle-exclamation';

            if (overallScore >= 95) {
                badgeClass = 'level-excellent';
                badgeText = 'Seviye 5: Dünya Standardı / WCM (%95+)';
                badgeIcon = 'fa-solid fa-trophy';
            } else if (overallScore >= 85) {
                badgeClass = 'level-excellent';
                badgeText = 'Seviye 4: İleri Düzey Standart (%85-%94)';
                badgeIcon = 'fa-solid fa-circle-check';
            } else if (overallScore >= 70) {
                badgeClass = 'level-good';
                badgeText = 'Seviye 3: Standart Seviye (%70-%84)';
                badgeIcon = 'fa-solid fa-check';
            } else if (overallScore >= 50) {
                badgeClass = 'level-medium';
                badgeText = 'Seviye 2: Gelişime Açık (%50-%69)';
                badgeIcon = 'fa-solid fa-chart-line';
            }

            levelBadgeElem.className = `fives-level-badge ${badgeClass}`;
            levelBadgeElem.innerHTML = `<i class="${badgeIcon}"></i> ${badgeText}`;
        }

        // Update Pillar badges and progress bars
        const pillarKeys = ['seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'];
        pillarKeys.forEach((key, index) => {
            const badge = document.getElementById(`badge-${key}`);
            if (badge) {
                badge.textContent = `${averages[index].toFixed(1)}/5`;
            }

            const fill = document.getElementById(`fives-bar-${key}`);
            const pct = document.getElementById(`fives-pct-${key}`);
            if (fill && pct) {
                fill.style.width = `${percentages[index].toFixed(0)}%`;
                pct.textContent = `%${percentages[index].toFixed(0)}`;
            }
        });

        // Update Radar Chart dataset
        if (radarChart) {
            radarChart.data.datasets[0].data = percentages;
            radarChart.update();
        }

        // Update Hub KPI if exists
        const hub5sKpi = document.getElementById('kpi-5s-score');
        if (hub5sKpi) {
            hub5sKpi.textContent = `%${Math.round(overallScore)}`;
        }

        renderActionItems();
    }

    // Auto generate Action Items from questions scored <= 3 or marked as Uygunsuzluk
    function renderActionItems() {
        const container = document.getElementById('fives-actions-list');
        const countBadge = document.getElementById('fives-action-count');
        if (!container) return;

        const lowScoreQuestions = [];

        Object.keys(FIVES_DATA).forEach(pillarKey => {
            const pillar = FIVES_DATA[pillarKey];
            pillar.questions.forEach(q => {
                const score = auditScores[q.id] || 3;
                const status = auditFindings[q.id] || 'Uygun';
                const note = auditNotes[q.id] || '';

                if (score <= 3 || status === 'Uygunsuzluk' || status === 'Gelişime Açık') {
                    lowScoreQuestions.push({
                        ...q,
                        pillarTitle: pillar.title,
                        score,
                        status,
                        note
                    });
                }
            });
        });

        if (countBadge) {
            countBadge.textContent = lowScoreQuestions.length;
        }

        if (lowScoreQuestions.length === 0) {
            container.innerHTML = `
                <div class="fives-action-item" style="border-left-color: var(--success); background: rgba(16, 185, 129, 0.08);">
                    <div class="fives-action-icon" style="color: var(--success);"><i class="fa-solid fa-circle-check"></i></div>
                    <div class="fives-action-content">
                        <div class="fives-action-title">Kritik Uygunsuzluk Bulunmuyor</div>
                        <div class="fives-action-desc">Tüm maddeler 4 ve 5 puan standartlarında değerlendirildi. Sürekliliği korumak için periyodik denetimlere devam ediniz.</div>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        lowScoreQuestions.forEach(item => {
            const isHighPriority = item.score <= 2 || item.status === 'Uygunsuzluk';
            const actionCard = document.createElement('div');
            actionCard.className = `fives-action-item ${isHighPriority ? 'priority-high' : ''}`;

            const actionSuggestion = getSuggestedAction(item.code, item.score);
            const userNoteDisplay = item.note ? `<div style="margin-top: 4px; font-weight: 600; color: var(--text-primary); font-size: 0.8rem;"><i class="fa-solid fa-pen-to-square"></i> Not: ${escapeHtml(item.note)}</div>` : '';

            actionCard.innerHTML = `
                <div class="fives-action-icon">
                    <i class="fa-solid ${isHighPriority ? 'fa-triangle-exclamation' : 'fa-circle-exclamation'}"></i>
                </div>
                <div class="fives-action-content">
                    <div class="fives-action-title">
                        <span style="color: var(--primary); font-size: 0.8rem; margin-right: 4px;">[${item.code}]</span>
                        ${item.text}
                    </div>
                    <div class="fives-action-desc">
                        <strong>Öneri/Standart Aksiyon:</strong> ${actionSuggestion}
                        ${userNoteDisplay}
                    </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                    <span class="badge ${isHighPriority ? 'status-danger' : 'status-warning'}" style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; background: ${isHighPriority ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${isHighPriority ? 'var(--danger)' : 'var(--warning)'}; border: 1px solid ${isHighPriority ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}">
                        ${isHighPriority ? 'Yüksek Öncelik (Puan: ' + item.score + ')' : 'Orta Öncelik (Puan: ' + item.score + ')'}
                    </span>
                </div>
            `;
            container.appendChild(actionCard);
        });
    }

    function getSuggestedAction(code, score) {
        const suggestions = {
            '1S.1': 'Gereksiz bobin ve paletleri derhal Kırmızı Etiket alanına taşıyın, iş emri dışı malzemeleri ayıklayın.',
            '1S.2': 'Kırmızı Etiket (Red Tag) karantina kafesini netleştirin ve haftalık tasfiye komitesini toplayın.',
            '1S.3': 'Gereksiz el aletlerini kaldırın, sadece teknik resimde belirtilen aparatları masada tutun.',
            '1S.4': 'Atık kablo ve metal çapak kutularını vardiya sonu beklemeden %80 dolulukta boşaltın.',
            '2S.1': 'Takım gölge panosu (Shadow board) şablonunu yenileyin ve eksik el aletlerini etiketleyin.',
            '2S.2': 'Terminal makara raflarını adresleyin (Koridor-Raf-Göz formatında barkodlayın).',
            '2S.3': 'Zemin sarı sınır çizgilerini epoksi boya veya dayanıklı PVC bantla yenileyin.',
            '2S.4': 'Yangın tüpü ve pano önü tarama çizgilerini boyayın ve malzeme istiflemesini derhal kaldırın.',
            '3S.1': 'Aplikatör kızak ve bıçaklarını krimp yağı temizleyicisi ile arındırıp mikro talaşları temizleyin.',
            '3S.2': 'Otonom bakım kontrol listesini operatör panosuna asın ve hat lideri onay imzasını zorunlu kılın.',
            '3S.3': 'Tezgah aydınlatmasını lüksmetre ile ölçüp en az 600 Lux seviyesine yükseltin.',
            '3S.4': 'Pnömatik hava kaçaklarını tespit köpüğü ile inceleyin ve kelepçeleri yenileyin.',
            '4S.1': 'IPC-A-620 Krimp Kusurları Panosunu güncelleyin ve operatör görüş hizasına sabitleyin.',
            '4S.2': 'Kırmızı Hurda kasalarını kilitleyin, hatalı parçaların üretime geri dönmesini engelleyin.',
            '4S.3': 'ESD bileklik günlük test istasyonunu aktif hale getirin ve kalibrasyonu doğrulayın.',
            '4S.4': 'İlk Parça Onayı (First Piece) yapılmadan presin start almasını önleyen Poke-Yoke uygulayın.',
            '5S.1': 'Haftalık 5S denetim takvimini dijitalleştirin ve fabrika duyuru ekranına yansıtın.',
            '5S.2': 'Geciken DÖF aksiyonları için kök neden analizi (5 Neden) başlatın ve termin güncelleyin.',
            '5S.3': 'Ayın En İyi 5S İstasyonu ödül sistemini devreye sokun, saha katılımını artırın.',
            '5S.4': 'Yönetim haftalık Gemba turunu planlayın ve denetçi havuzunu rotasyonla genişletin.'
        };
        return suggestions[code] || 'Mevcut durumu standart talimata göre kontrol edip DÖF açınız.';
    }

    // Save Audit to LocalStorage
    function saveCurrentAudit() {
        const auditorName = document.getElementById('fives-auditor-name')?.value.trim() || 'Deniz Kanar';
        const department = document.getElementById('fives-department')?.value.trim() || 'Kablo Montaj Hattı';
        const line = document.getElementById('fives-line')?.value.trim() || 'Hat 03 / Krimp İstasyonu';
        const auditDate = document.getElementById('fives-date')?.value || new Date().toISOString().split('T')[0];
        const shift = document.getElementById('fives-shift')?.value || '1. Vardiya';

        const { averages, percentages } = getPillarScoresArray();
        const overallScore = percentages.reduce((a, b) => a + b, 0) / percentages.length;

        const auditRecord = {
            id: '5s_' + Date.now(),
            date: auditDate,
            auditor: auditorName,
            department: department,
            line: line,
            shift: shift,
            overallScore: Math.round(overallScore),
            pillarScores: {
                seiri: Math.round(percentages[0]),
                seiton: Math.round(percentages[1]),
                seiso: Math.round(percentages[2]),
                seiketsu: Math.round(percentages[3]),
                shitsuke: Math.round(percentages[4])
            },
            scores: { ...auditScores },
            notes: { ...auditNotes },
            findings: { ...auditFindings }
        };

        const existing = getSavedAudits();
        existing.unshift(auditRecord);
        localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(existing));

        renderHistoryTable();
        alertFeedback('success', `5S Denetimi başarıyla kaydedildi! (Genel Skor: %${auditRecord.overallScore})`);
    }

    function getSavedAudits() {
        try {
            const data = localStorage.getItem(STORAGE_KEY_AUDITS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading audits:', e);
            return [];
        }
    }

    function renderHistoryTable() {
        const tbody = document.getElementById('fives-history-tbody');
        const countSpan = document.getElementById('fives-history-count');
        if (!tbody) return;

        const audits = getSavedAudits();
        if (countSpan) countSpan.textContent = audits.length;

        if (audits.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">
                        Henüz kaydedilmiş bir 5S denetimi bulunmuyor. Formu doldurup "Denetimi Kaydet" butonuna tıklayarak ilk kaydınızı oluşturabilirsiniz.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = '';
        audits.forEach(audit => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${audit.date}</strong></td>
                <td>${escapeHtml(audit.line)}</td>
                <td>${escapeHtml(audit.auditor)}</td>
                <td>
                    <span class="badge" style="font-weight: 800; background: rgba(29, 78, 137, 0.15); color: var(--primary);">
                        %${audit.overallScore}
                    </span>
                </td>
                <td style="font-size: 0.8rem;">
                    1S: %${audit.pillarScores.seiri} | 2S: %${audit.pillarScores.seiton} | 3S: %${audit.pillarScores.seiso} | 4S: %${audit.pillarScores.seiketsu} | 5S: %${audit.pillarScores.shitsuke}
                </td>
                <td>
                    <button type="button" class="btn btn-outline btn-sm btn-load-audit" data-id="${audit.id}" title="Denetimi Yükle">
                        <i class="fa-solid fa-arrow-rotate-left"></i> Yükle
                    </button>
                    <button type="button" class="btn btn-outline btn-sm btn-delete-audit" data-id="${audit.id}" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" title="Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-load-audit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                loadAuditById(id);
            });
        });

        tbody.querySelectorAll('.btn-delete-audit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteAuditById(id);
            });
        });
    }

    function loadAuditById(id) {
        const audits = getSavedAudits();
        const found = audits.find(a => a.id === id);
        if (!found) return;

        auditScores = { ...found.scores };
        auditNotes = { ...found.notes };
        auditFindings = { ...found.findings };

        const auditorInput = document.getElementById('fives-auditor-name');
        if (auditorInput) auditorInput.value = found.auditor;

        const lineInput = document.getElementById('fives-line');
        if (lineInput) lineInput.value = found.line;

        const deptInput = document.getElementById('fives-department');
        if (deptInput) deptInput.value = found.department;

        const dateInput = document.getElementById('fives-date');
        if (dateInput) dateInput.value = found.date;

        renderPillarNav();
        renderQuestions();
        updateScoreCalculations();
        alertFeedback('success', `${found.date} tarihli ${found.line} denetimi başarıyla yüklendi.`);
    }

    function deleteAuditById(id) {
        if (!confirm('Bu 5S denetim kaydını silmek istediğinize emin misiniz?')) return;
        const audits = getSavedAudits().filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(audits));
        renderHistoryTable();
    }

    // Export to Excel (.xlsx) using SheetJS / ExportHelper
    function exportToExcel() {
        const auditor = document.getElementById('fives-auditor-name')?.value || 'Deniz Kanar';
        const line = document.getElementById('fives-line')?.value || 'Hat 03 / Krimp';
        const date = document.getElementById('fives-date')?.value || new Date().toISOString().split('T')[0];
        const department = document.getElementById('fives-department')?.value || 'Kablo Montaj';
        const { percentages } = getPillarScoresArray();
        const overallScore = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);

        const excelData = [];

        // Meta satırları
        excelData.push({
            'Kod': 'GENEL BİLGİLER',
            'Kategori / Adım': 'Firma / Alan',
            'Kriter / Soru': `${department} - ${line}`,
            'Puan (1-5)': `Skor: %${overallScore}`,
            'Durum': `Denetçi: ${auditor}`,
            'Saha Notu': `Tarih: ${date}`,
            'Önerilen Aksiyon': 'Yalın Üretim & 5S Saha Denetim Raporu'
        });

        // 5S Pillar Özetleri
        excelData.push({ 'Kod': '1S', 'Kategori / Adım': 'Seiri (Ayıkla)', 'Kriter / Soru': 'Gereksiz malzeme ve takım tasfiyesi', 'Puan (1-5)': `%${Math.round(percentages[0])}`, 'Durum': 'Özet Skor', 'Saha Notu': '', 'Önerilen Aksiyon': '' });
        excelData.push({ 'Kod': '2S', 'Kategori / Adım': 'Seiton (Düzenle)', 'Kriter / Soru': 'Yerleşim, gölge panosu ve adresleme', 'Puan (1-5)': `%${Math.round(percentages[1])}`, 'Durum': 'Özet Skor', 'Saha Notu': '', 'Önerilen Aksiyon': '' });
        excelData.push({ 'Kod': '3S', 'Kategori / Adım': 'Seiso (Temizle)', 'Kriter / Soru': 'Otonom bakım ve temizlik standardı', 'Puan (1-5)': `%${Math.round(percentages[2])}`, 'Durum': 'Özet Skor', 'Saha Notu': '', 'Önerilen Aksiyon': '' });
        excelData.push({ 'Kod': '4S', 'Kategori / Adım': 'Seiketsu (Standartlaştır)', 'Kriter / Soru': 'Görsel yönetim ve limit numuneler', 'Puan (1-5)': `%${Math.round(percentages[3])}`, 'Durum': 'Özet Skor', 'Saha Notu': '', 'Önerilen Aksiyon': '' });
        excelData.push({ 'Kod': '5S', 'Kategori / Adım': 'Shitsuke (Sürdür)', 'Kriter / Soru': 'Disiplin, denetimler ve süreklilik', 'Puan (1-5)': `%${Math.round(percentages[4])}`, 'Durum': 'Özet Skor', 'Saha Notu': '', 'Önerilen Aksiyon': '' });

        // Detaylı Sorular
        Object.keys(FIVES_DATA).forEach(pillarKey => {
            const pillar = FIVES_DATA[pillarKey];
            pillar.questions.forEach(q => {
                const score = auditScores[q.id] || 3;
                const status = auditFindings[q.id] || 'Uygun';
                const note = auditNotes[q.id] || '';
                const action = getSuggestedAction(q.code, score);
                excelData.push({
                    'Kod': q.code,
                    'Kategori / Adım': pillar.title,
                    'Kriter / Soru': q.text,
                    'Puan (1-5)': score,
                    'Durum': status,
                    'Saha Notu': note,
                    'Önerilen Aksiyon': action
                });
            });
        });

        if (window.ExportHelper) {
            window.ExportHelper.toExcel(
                `5S_Denetim_${line.replace(/[^a-zA-Z0-9]/g, '_')}_${date}`, 
                '5S Saha Denetimi', 
                excelData,
                null,
                { chartCanvasId: 'fives-radar-chart' }
            );
            alertFeedback('success', '5S Denetim Raporu Excel (.xlsx) formatında indirildi.');
        } else {
            exportToCSV();
        }
    }

    // Export to PDF (.pdf)
    function exportToPDF() {
        const line = document.getElementById('fives-line')?.value || 'Hat 03 / Krimp';
        const date = document.getElementById('fives-date')?.value || new Date().toISOString().split('T')[0];
        const fileName = `5S_Denetim_Raporu_${line.replace(/[^a-zA-Z0-9]/g, '_')}_${date}`;

        const reportEl = document.getElementById('qm-panel-fives')?.querySelector('.fives-container') || document.getElementById('qm-panel-fives');
        const feedbackEl = document.getElementById('fives-feedback-msg');
        if (feedbackEl) feedbackEl.style.display = 'none';

        if (window.ExportHelper && reportEl) {
            window.ExportHelper.toPdf(reportEl, fileName, {
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            });
        } else {
            window.print();
        }
    }

    // Export to CSV / Excel
    function exportToCSV() {
        const auditor = document.getElementById('fives-auditor-name')?.value || 'Deniz Kanar';
        const line = document.getElementById('fives-line')?.value || 'Hat 03 / Krimp';
        const date = document.getElementById('fives-date')?.value || new Date().toISOString().split('T')[0];
        const { percentages } = getPillarScoresArray();
        const overallScore = percentages.reduce((a, b) => a + b, 0) / percentages.length;

        let csv = '\uFEFF'; // UTF-8 BOM for Excel
        csv += '5S SAHA DENETİM VE SKORLAMA RAPORU\r\n';
        csv += `Firma / Tesis;denizknr.github.io Kalite Güvence Merkezi;Tarih;${date}\r\n`;
        csv += `Denetlenen Hat;${line};Denetçi;${auditor}\r\n`;
        csv += `Genel 5S Skoru;%${Math.round(overallScore)};Maturity;${(overallScore / 20).toFixed(2)} / 5.00\r\n\r\n`;

        csv += 'KATEGORİ ÖZET SKORLARI\r\n';
        csv += '1S - Seiri (Ayıkla);%' + Math.round(percentages[0]) + '\r\n';
        csv += '2S - Seiton (Düzenle);%' + Math.round(percentages[1]) + '\r\n';
        csv += '3S - Seiso (Temizle);%' + Math.round(percentages[2]) + '\r\n';
        csv += '4S - Seiketsu (Standartlaştır);%' + Math.round(percentages[3]) + '\r\n';
        csv += '5S - Shitsuke (Sürdür);%' + Math.round(percentages[4]) + '\r\n\r\n';

        csv += 'SORU BAZLI DETAYLI PUANLAMA VE SAHA TESPİTLERİ\r\n';
        csv += 'Kod;Kategori;Kriter / Soru;Puan (1-5);Durum;Saha Gözlem Notu;Önerilen Aksiyon\r\n';

        Object.keys(FIVES_DATA).forEach(pillarKey => {
            const pillar = FIVES_DATA[pillarKey];
            pillar.questions.forEach(q => {
                const score = auditScores[q.id] || 3;
                const status = auditFindings[q.id] || 'Uygun';
                const note = (auditNotes[q.id] || '').replace(/;/g, ',');
                const action = getSuggestedAction(q.code, score).replace(/;/g, ',');
                csv += `"${q.code}";"${pillar.title}";"${q.text}";"${score}";"${status}";"${note}";"${action}"\r\n`;
            });
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `5S_Denetim_Raporu_${line.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Load Sample Industry Audit (Cable Assembly & Crimping Shopfloor)
    function loadSampleAudit() {
        const sampleScores = {
            q1: 4, q2: 3, q3: 4, q4: 3, // Seiri
            q5: 5, q6: 4, q7: 3, q8: 5, // Seiton
            q9: 4, q10: 4, q11: 4, q12: 3, // Seiso
            q13: 5, q14: 4, q15: 5, q16: 4, // Seiketsu
            q17: 4, q18: 3, q19: 4, q20: 4  // Shitsuke
        };

        const sampleNotes = {
            q2: 'Kırmızı etiket alanında 2 adet tanımlanmamış terminal makarası tespit edildi.',
            q4: 'Krimp presi tablası altında sıyırma izole artıkları birikmiş, operatöre temizlik hatırlatıldı.',
            q7: 'Hat 03 sarı zemin şeridi palet sürtünmesinden aşınmış, yenileme talep edildi.',
            q12: 'Pres pnömatik hava hortumunda hafif regülatör sesi var, bakım ekibine bildirildi.',
            q18: 'Önceki denetime ait 2 nolu DÖF termin süresi geçmiş, hat lideriyle görüşüldü.'
        };

        const sampleFindings = {
            q1: 'Uygun', q2: 'Gelişime Açık', q3: 'Uygun', q4: 'Gelişime Açık',
            q5: 'Uygun', q6: 'Uygun', q7: 'Gelişime Açık', q8: 'Uygun',
            q9: 'Uygun', q10: 'Uygun', q11: 'Uygun', q12: 'Gelişime Açık',
            q13: 'Uygun', q14: 'Uygun', q15: 'Uygun', q16: 'Uygun',
            q17: 'Uygun', q18: 'Gelişime Açık', q19: 'Uygun', q20: 'Uygun'
        };

        auditScores = sampleScores;
        auditNotes = sampleNotes;
        auditFindings = sampleFindings;

        const auditorInput = document.getElementById('fives-auditor-name');
        if (auditorInput) auditorInput.value = 'Deniz Kanar (Proses Kalite Uzmanı)';

        const lineInput = document.getElementById('fives-line');
        if (lineInput) lineInput.value = 'Kablo Montaj & Krimp Hattı 03';

        const deptInput = document.getElementById('fives-department');
        if (deptInput) deptInput.value = 'Otomotiv Kablo Donanım Üretimi';

        renderPillarNav();
        renderQuestions();
        updateScoreCalculations();
        alertFeedback('success', 'Örnek Kablo Montaj & Krimp Hattı 5S Denetimi başarıyla yüklendi!');
    }

    // Reset scores
    function resetAudit() {
        if (!confirm('Tüm denetim puanlarını ve notları sıfırlamak istediğinize emin misiniz?')) return;
        Object.keys(FIVES_DATA).forEach(pillarKey => {
            FIVES_DATA[pillarKey].questions.forEach(q => {
                auditScores[q.id] = 3;
                auditNotes[q.id] = '';
                auditFindings[q.id] = 'Gelişime Açık';
            });
        });
        renderPillarNav();
        renderQuestions();
        updateScoreCalculations();
    }

    function bindEvents() {
        document.getElementById('btn-save-5s-audit')?.addEventListener('click', saveCurrentAudit);
        document.getElementById('btn-export-5s-excel')?.addEventListener('click', exportToExcel);
        document.getElementById('btn-export-5s-pdf')?.addEventListener('click', exportToPDF);
        document.getElementById('btn-export-5s-csv')?.addEventListener('click', exportToCSV);
        document.getElementById('btn-print-5s-report')?.addEventListener('click', exportToPDF);
        document.getElementById('btn-sample-5s-audit')?.addEventListener('click', loadSampleAudit);
        document.getElementById('btn-reset-5s-audit')?.addEventListener('click', resetAudit);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function alertFeedback(type, message) {
        const statusBox = document.getElementById('fives-feedback-msg');
        if (!statusBox) {
            alert(message);
            return;
        }
        statusBox.style.display = 'block';
        statusBox.className = `badge ${type === 'success' ? 'status-active' : 'status-danger'}`;
        statusBox.style.padding = '8px 16px';
        statusBox.style.marginTop = '12px';
        statusBox.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${message}`;
        setTimeout(() => {
            statusBox.style.display = 'none';
        }, 4000);
    }

    // Export module globally
    window.FiveSModule = {
        init,
        loadSampleAudit,
        saveCurrentAudit,
        exportToExcel,
        exportToPDF,
        exportToCSV,
        resetAudit,
        getPillarScoresArray
    };

    // Auto init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
