/**
 * Kaizen Aksiyonları & Sürekli İyileştirme Trend Modülü
 * Yalın Üretim Önce/Sonra (Before/After) ve Kümülatif Kazanım Analizi
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'kaizen_records_v1';

    const DEFAULT_KAIZENS = [
        {
            id: 'KZ-2026-001',
            title: 'Krimp Aplikatör Model Değişiminde SMED (Tekli Dakikalarda Kalıp Değişimi)',
            type: 'Kobetsu Kaizen',
            category: 'Verimlilik / Hız',
            department: 'Hat 03 / Krimp İstasyonu',
            owner: 'Deniz Kanar & Bakım Ekibi',
            date: '2026-08-15',
            status: 'Tamamlandı',
            beforeDesc: 'Aplikatör değişiminde mekanik kovan ayarları ve mikrometre ayarları deneme-yanılma ile yapılıyor, hat duruşu 28 dakika sürüyordu.',
            actionDesc: 'Tüm aplikatörler için standart ' + 'hızlı kilit kovanı' + ' ve önceden kalibre edilmiş mikrometre disk referans blokları hazırlandı.',
            afterDesc: 'Model değişim süresi 28 dakikadan 7.5 dakikaya indi. Yılda 140 saat duruş önlendi.',
            timeSaved: '20.5 dk / ayar',
            savingAnnual: '185.000 ₺ / Yıl',
            qualityGain: '%98 İlk Parça Doğruluğu'
        },
        {
            id: 'KZ-2026-002',
            title: 'Kablo Terminal Besleme Makaralarında Otomatik Tansiyon Dengeleme',
            type: 'Standart Kaizen',
            category: 'Kalite',
            department: 'Yarı Otomatik Presler',
            owner: 'Ali Vural (Krimp Operatörü)',
            date: '2026-08-28',
            status: 'Tamamlandı',
            beforeDesc: 'Makaradaki terminal azaldıkça şeridin ağırlığı düşüyor, pres girişinde terminal takılmaları ve krimp eksen kaçıklığı yaşanıyordu.',
            actionDesc: 'Rulmanlı hafif karşı ağırlık ve yaylı kılavuz kolu monte edilerek terminal besleme açısı sabitlendi.',
            afterDesc: 'Terminal besleme kaynaklı pres duruşları ve bükülmüş pin hataları sıfırlandı.',
            timeSaved: '8 dk / vardiya',
            savingAnnual: '45.000 ₺ / Yıl',
            qualityGain: 'PPM Değeri 420\'den 35\'e düştü'
        },
        {
            id: 'KZ-2026-003',
            title: 'Kablo Sıyırma Atıklarının Vakumlu Emişle Toplanması (Ergonomi & 3S)',
            type: 'Hızlı Kaizen (Teian)',
            category: 'Ergonomi',
            department: 'Kesme & Sıyırma',
            owner: 'Merve Kaya (Hat Lideri)',
            date: '2026-09-02',
            status: 'Tamamlandı',
            beforeDesc: 'Sıyırma esnasında küçük PVC kabuk artıkları pres tablasına saçılıyor, vardiya sonunda 15 dk süpürme gerekiyordu.',
            actionDesc: 'Pres tablası altına venturi etkili pnömatik hava emiş hunisi takılarak atıklar kapalı şeffaf kutuda toplandı.',
            afterDesc: 'Tezgah sürekli temiz kaldı, atıkların aplikatör örsüne kaçma riski tamamen ortadan kalktı.',
            timeSaved: '15 dk / gün',
            savingAnnual: '28.000 ₺ / Yıl',
            qualityGain: 'Temiz Çalışma Ortamı & 5S Seiso'
        },
        {
            id: 'KZ-2026-004',
            title: 'Konnektör Kilit Mandallarında Renk Kodlu Poka-Yoke Kasetleri',
            type: 'Standart Kaizen',
            category: 'Kalite',
            department: 'Manuel Montaj Masaları',
            owner: 'Deniz Kanar (Proses Kalite)',
            date: '2026-09-05',
            status: 'Test Aşamasında',
            beforeDesc: 'Birbirine benzeyen 2 farklı 12-pin konnektör kilidi yanlışlıkla birbirinin yerine takılabiliyordu.',
            actionDesc: '3D yazıcı ile sadece doğru konnektörün oturabildiği yönlendirme tırnaklı renkli montaj yuvaları üretildi.',
            afterDesc: 'Yanlış kilit montajı fiziksel olarak imkansız hale getirildi. Test serisi devam ediyor.',
            timeSaved: '3 sn / döngü',
            savingAnnual: '35.000 ₺ / Yıl',
            qualityGain: '%100 Montaj Güvencesi'
        }
    ];

    let kaizenList = [];
    let trendChart = null;

    function init() {
        loadData();
        bindEvents();
        renderCards();
        initTrendChart();
        updateKpis();
    }

    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                kaizenList = JSON.parse(saved);
            } else {
                kaizenList = [...DEFAULT_KAIZENS];
                saveData();
            }
        } catch (e) {
            console.error('Kaizen veri hatası:', e);
            kaizenList = [...DEFAULT_KAIZENS];
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(kaizenList));
            updateKpis();
            if (trendChart) updateTrendChart();
        } catch (e) {
            console.error('Kaizen kaydetme hatası:', e);
        }
    }

    function bindEvents() {
        // Yeni Kaizen Formu Toggle
        const toggleBtn = document.getElementById('btn-toggle-kaizen-form');
        const formContainer = document.getElementById('kaizen-new-form-container');
        if (toggleBtn && formContainer) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = formContainer.style.display === 'none' || !formContainer.style.display;
                formContainer.style.display = isHidden ? 'block' : 'none';
                toggleBtn.innerHTML = isHidden
                    ? '<i class="fa-solid fa-xmark"></i> Formu Gizle'
                    : '<i class="fa-solid fa-plus"></i> Yeni Kaizen Önerisi Gir';
            });
        }

        // Kaydet Butonu
        document.getElementById('btn-save-new-kaizen')?.addEventListener('click', addNewKaizen);

        // Excel ve PDF Dışa Aktar
        document.getElementById('btn-kaizen-export-excel')?.addEventListener('click', exportToExcel);
        document.getElementById('btn-kaizen-export-pdf')?.addEventListener('click', exportToPdf);

        // Örnek Verileri Sıfırla
        document.getElementById('btn-reset-kaizen-data')?.addEventListener('click', () => {
            if (confirm('Kaizen kayıtları varsayılan listeye sıfırlansın mı?')) {
                kaizenList = [...DEFAULT_KAIZENS];
                saveData();
                renderCards();
                updateTrendChart();
            }
        });
    }

    function renderCards() {
        const container = document.getElementById('kaizen-cards-grid');
        if (!container) return;

        if (!kaizenList.length) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-lightbulb" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
                    Henüz kayıtlı Kaizen iyileştirmesi bulunmuyor.
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        kaizenList.forEach(kz => {
            const card = document.createElement('div');
            card.className = 'kaizen-card';

            const catColor = getCategoryColor(kz.category);

            card.innerHTML = `
                <div class="kaizen-card-header">
                    <div>
                        <span class="badge" style="background: rgba(29, 78, 137, 0.15); color: var(--primary); font-family: monospace; font-weight: 700;">
                            ${escapeHtml(kz.id)}
                        </span>
                        <span class="badge" style="background: ${catColor.bg}; color: ${catColor.text}; margin-left: 6px;">
                            ${escapeHtml(kz.category)}
                        </span>
                    </div>
                    <span class="badge ${kz.status === 'Tamamlandı' ? 'status-active' : 'status-warning'}">
                        <i class="fa-solid ${kz.status === 'Tamamlandı' ? 'fa-check' : 'fa-hourglass-half'}"></i> ${escapeHtml(kz.status)}
                    </span>
                </div>

                <h4 class="kaizen-card-title">${escapeHtml(kz.title)}</h4>
                
                <div class="kaizen-card-meta">
                    <span><i class="fa-solid fa-building"></i> ${escapeHtml(kz.department)}</span>
                    <span><i class="fa-solid fa-user"></i> ${escapeHtml(kz.owner)}</span>
                    <span><i class="fa-solid fa-calendar"></i> ${escapeHtml(kz.date)}</span>
                </div>

                <!-- Önce / Sonra Bölümü -->
                <div class="kaizen-ba-container">
                    <div class="kaizen-ba-box ba-before">
                        <div class="kaizen-ba-label"><i class="fa-solid fa-circle-exclamation"></i> ÖNCE (Problem & Kayıp)</div>
                        <p>${escapeHtml(kz.beforeDesc)}</p>
                    </div>
                    <div class="kaizen-ba-box ba-after">
                        <div class="kaizen-ba-label"><i class="fa-solid fa-circle-check"></i> SONRA (Kazanım & Çözüm)</div>
                        <p>${escapeHtml(kz.afterDesc)}</p>
                    </div>
                </div>

                <!-- Kazanım Rozetleri -->
                <div class="kaizen-gains-row">
                    <div class="gain-item">
                        <span class="gain-label"><i class="fa-solid fa-stopwatch"></i> Zaman Tasarrufu</span>
                        <span class="gain-val">${escapeHtml(kz.timeSaved || '-')}</span>
                    </div>
                    <div class="gain-item">
                        <span class="gain-label"><i class="fa-solid fa-coins"></i> Yıllık Getiri</span>
                        <span class="gain-val" style="color: var(--success);">${escapeHtml(kz.savingAnnual || '-')}</span>
                    </div>
                    <div class="gain-item">
                        <span class="gain-label"><i class="fa-solid fa-medal"></i> Kalite Etkisi</span>
                        <span class="gain-val">${escapeHtml(kz.qualityGain || '-')}</span>
                    </div>
                </div>

                <div class="kaizen-card-footer">
                    <span style="font-size: 0.78rem; color: var(--text-muted);">
                        <strong>Tür:</strong> ${escapeHtml(kz.type)}
                    </span>
                    <button type="button" class="btn-delete-kaizen" data-id="${kz.id}" title="Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('.btn-delete-kaizen').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm(`${id} nolu Kaizen kaydını silmek istediğinize emin misiniz?`)) {
                    kaizenList = kaizenList.filter(k => k.id !== id);
                    saveData();
                    renderCards();
                }
            });
        });
    }

    function initTrendChart() {
        const canvas = document.getElementById('kaizen-trend-chart');
        if (!canvas) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
        const textColor = isDark ? '#94a3b8' : '#475569';

        const ctx = canvas.getContext('2d');
        trendChart = new Chart(ctx, {
            type: 'line',
            data: getChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                if (ctx.datasetIndex === 0) return ` ${ctx.dataset.label}: ${ctx.raw} adet`;
                                return ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString('tr-TR')} ₺`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Tamamlanan Kaizen (Adet)', color: textColor },
                        grid: { color: gridColor },
                        ticks: { color: textColor, stepSize: 1 }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Kümülatif Tasarruf (₺)', color: '#10b981' },
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: '#10b981',
                            callback: function (val) { return `${(val / 1000).toFixed(0)}k ₺`; }
                        }
                    }
                }
            }
        });
    }

    function getChartData() {
        const months = ['Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül'];
        const completedCounts = [2, 3, 5, 4, 7, kaizenList.length];
        const cumulativeSavings = [45000, 110000, 195000, 270000, 420000, 560000];

        return {
            labels: months,
            datasets: [
                {
                    label: 'Tamamlanan Kaizen Sayısı',
                    data: completedCounts,
                    borderColor: '#1d4ed8',
                    backgroundColor: 'rgba(29, 78, 137, 0.2)',
                    fill: true,
                    tension: 0.35,
                    yAxisID: 'y',
                    pointRadius: 5
                },
                {
                    label: 'Kümülatif Yıllık Tasarruf (₺)',
                    data: cumulativeSavings,
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    borderWidth: 2.5,
                    yAxisID: 'y1',
                    pointRadius: 4
                }
            ]
        };
    }

    function updateTrendChart() {
        if (!trendChart) return;
        trendChart.data = getChartData();
        trendChart.update();
    }

    function addNewKaizen() {
        const title = document.getElementById('kaizen-form-title')?.value.trim();
        const type = document.getElementById('kaizen-form-type')?.value || 'Hızlı Kaizen';
        const category = document.getElementById('kaizen-form-category')?.value || 'Verimlilik';
        const department = document.getElementById('kaizen-form-dept')?.value.trim() || 'Kablo Montaj';
        const owner = document.getElementById('kaizen-form-owner')?.value.trim() || 'Deniz Kanar';
        const beforeDesc = document.getElementById('kaizen-form-before')?.value.trim() || 'Mevcut problem tanımlanmadı.';
        const afterDesc = document.getElementById('kaizen-form-after')?.value.trim() || 'İyileştirme tamamlandı.';
        const timeSaved = document.getElementById('kaizen-form-time')?.value.trim() || '10 dk/gün';
        const savingAnnual = document.getElementById('kaizen-form-saving')?.value.trim() || '25.000 ₺ / Yıl';

        if (!title) {
            alert('Lütfen Kaizen başlığını giriniz.');
            return;
        }

        const year = new Date().getFullYear();
        const nextNum = String(kaizenList.length + 1).padStart(3, '0');
        const newId = `KZ-${year}-${nextNum}`;

        const newKz = {
            id: newId,
            title,
            type,
            category,
            department,
            owner,
            date: new Date().toISOString().split('T')[0],
            status: 'Tamamlandı',
            beforeDesc,
            afterDesc,
            timeSaved,
            savingAnnual,
            qualityGain: 'Standartlaştırma Sağlandı'
        };

        kaizenList.unshift(newKz);
        saveData();
        renderCards();

        // Formu sıfırla ve gizle
        document.getElementById('kaizen-form-title').value = '';
        document.getElementById('kaizen-form-before').value = '';
        document.getElementById('kaizen-form-after').value = '';
        const formContainer = document.getElementById('kaizen-new-form-container');
        if (formContainer) formContainer.style.display = 'none';

        const toggleBtn = document.getElementById('btn-toggle-kaizen-form');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Yeni Kaizen Önerisi Gir';

        alert(`${newId} nolu Kaizen başarıyla kaydedildi!`);
    }

    function updateKpis() {
        const total = kaizenList.length;
        const totalEl = document.getElementById('kaizen-kpi-count');
        if (totalEl) totalEl.textContent = total;

        const savingEl = document.getElementById('kaizen-kpi-savings');
        if (savingEl) savingEl.textContent = '293.000 ₺';

        const hoursEl = document.getElementById('kaizen-kpi-hours');
        if (hoursEl) hoursEl.textContent = '175+ Saat';
    }

    function getCategoryColor(cat) {
        switch (cat) {
            case 'Kalite':
                return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
            case 'Ergonomi':
                return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' };
            case 'Verimlilik / Hız':
                return { bg: 'rgba(14, 165, 233, 0.15)', text: '#0ea5e9' };
            case 'Maliyet / Hurda':
                return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
            default:
                return { bg: 'rgba(29, 78, 137, 0.15)', text: 'var(--primary)' };
        }
    }

    function exportToExcel() {
        const excelData = kaizenList.map(kz => ({
            'Kaizen No': kz.id,
            'Başlık': kz.title,
            'Kaizen Türü': kz.type,
            'Kategori': kz.category,
            'Departman': kz.department,
            'Öneri Sahibi': kz.owner,
            'Tarih': kz.date,
            'Statü': kz.status,
            'Önceki Durum': kz.beforeDesc,
            'Sonraki Durum & Çözüm': kz.afterDesc,
            'Süre Tasarrufu': kz.timeSaved || '-',
            'Yıllık Tasarruf': kz.savingAnnual || '-',
            'Kalite Kazanımı': kz.qualityGain || '-'
        }));

        if (window.ExportHelper) {
            window.ExportHelper.toExcel(`Kaizen_Aksiyon_Raporu_${new Date().toISOString().split('T')[0]}`, 'Kaizenler', excelData);
        }
    }

    function exportToPdf() {
        const reportEl = document.getElementById('qm-panel-kaizen');
        if (window.ExportHelper && reportEl) {
            window.ExportHelper.toPdf(reportEl, `Kaizen_Aksiyon_Raporu_${new Date().toISOString().split('T')[0]}`, {
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

    window.KaizenModule = {
        init,
        exportToExcel,
        exportToPdf
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
