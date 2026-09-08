/**
 * Pareto Analizi Grafiği (80/20 Kuralı) Modülü
 * Çift Eksenli Chart.js Frekans & Kümülatif Yüzde Görselleştiricisi
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'pareto_data_v1';

    // Örnek Senaryo: Kablo Montaj & Krimp Saha Hata Dağılımı (Aylık 1.250 Red Parça)
    const PRESET_CRIMP = [
        { defect: 'Krimp Yüksekliği Tolerans Dışı (CH Sapması)', count: 485, cost: '12.125 ₺' },
        { defect: 'Kablo Sıyırma Hatası (Eksik/Kesik Damar)', count: 290, cost: '8.700 ₺' },
        { defect: 'Terminal İzolasyon Krimp Açıklığı', count: 180, cost: '4.500 ₺' },
        { defect: 'Konnektör Pin Eğrilmesi / Geri Kaçma', count: 125, cost: '6.250 ₺' },
        { defect: 'Eksik Parça / Hatalı Grommet-Seal', count: 70, cost: '2.100 ₺' },
        { defect: 'Hatalı veya Okunamayan Barkod Etiketi', count: 55, cost: '1.100 ₺' },
        { defect: 'Kablo Boyu Tolerans Dışı (Kısa Kablo)', count: 30, cost: '1.500 ₺' },
        { defect: 'Bantlama / Spiral Hortum Sarım Hatası', count: 15, cost: '450 ₺' }
    ];

    const PRESET_CONNECTOR = [
        { defect: 'Terminal Kilide Oturmadı (Secondary Lock Açık)', count: 320, cost: '9.600 ₺' },
        { defect: 'Ters Pin Dizilimi (Pin-Out Çaprazlama)', count: 210, cost: '8.400 ₺' },
        { defect: 'Konnektör Gövdesinde Çatlak / Kırık Tırnak', count: 140, cost: '7.000 ₺' },
        { defect: 'Su Sızdırmazlık Contası (Silicon Seal) Yırtık', count: 95, cost: '3.800 ₺' },
        { defect: 'Kablo Giriş Açısı Aşırı Bükülmüş', count: 45, cost: '1.350 ₺' },
        { defect: 'Konnektör Etiket Yapışmama Hatası', count: 20, cost: '400 ₺' }
    ];

    const PRESET_ELECTRICAL = [
        { defect: 'Açık Devre (Open Circuit - Temassızlık)', count: 410, cost: '14.350 ₺' },
        { defect: 'Kısa Devre (Short Circuit - Tel Teması)', count: 260, cost: '10.400 ₺' },
        { defect: 'Geçiş Direnci Yüksek (> 50 mΩ)', count: 185, cost: '9.250 ₺' },
        { defect: 'İzolasyon Direnci Düşük (< 100 MΩ)', count: 80, cost: '4.000 ₺' },
        { defect: 'Yanlış Direnç Değeri (Diyot / Direnç Uygunsuz)', count: 35, cost: '1.750 ₺' }
    ];

    let defectList = [];
    let paretoChart = null;

    function init() {
        loadData();
        bindEvents();
        calculateAndRender();
    }

    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                defectList = JSON.parse(saved);
            } else {
                defectList = [...PRESET_CRIMP];
                saveData();
            }
        } catch (e) {
            console.error('Pareto veri hatası:', e);
            defectList = [...PRESET_CRIMP];
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defectList));
        } catch (e) {
            console.error('Pareto kaydetme hatası:', e);
        }
    }

    function bindEvents() {
        // Senaryo Butonları
        document.getElementById('btn-pareto-preset-crimp')?.addEventListener('click', () => loadPreset(PRESET_CRIMP));
        document.getElementById('btn-pareto-preset-connector')?.addEventListener('click', () => loadPreset(PRESET_CONNECTOR));
        document.getElementById('btn-pareto-preset-elec')?.addEventListener('click', () => loadPreset(PRESET_ELECTRICAL));

        // Yeni Hata Ekleme
        document.getElementById('btn-pareto-add-defect')?.addEventListener('click', addNewDefect);

        // Excel ve PDF Butonları
        document.getElementById('btn-pareto-export-excel')?.addEventListener('click', exportToExcel);
        document.getElementById('btn-pareto-export-pdf')?.addEventListener('click', exportToPdf);

        // Sıfırla
        document.getElementById('btn-reset-pareto-data')?.addEventListener('click', () => {
            if (confirm('Pareto verileri başlangıç krimp analizine döndürülsün mü?')) {
                loadPreset(PRESET_CRIMP);
            }
        });
    }

    function loadPreset(presetData) {
        defectList = JSON.parse(JSON.stringify(presetData));
        saveData();
        calculateAndRender();
    }

    function calculateAndRender() {
        // 1. Azalan sırayla diz (Büyükten küçüğe)
        defectList.sort((a, b) => b.count - a.count);

        const totalCount = defectList.reduce((sum, item) => sum + item.count, 0);

        let cumulative = 0;
        const processed = defectList.map(item => {
            cumulative += item.count;
            const percentage = totalCount ? (item.count / totalCount) * 100 : 0;
            const cumPercentage = totalCount ? (cumulative / totalCount) * 100 : 0;
            const isVital = cumPercentage <= 80 || (cumPercentage - percentage < 80);
            return {
                ...item,
                percentage,
                cumPercentage,
                isVital
            };
        });

        renderTable(processed, totalCount);
        renderChart(processed);
        updateKpis(processed, totalCount);
    }

    function renderTable(data, total) {
        const tbody = document.getElementById('pareto-table-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        data.forEach((row, idx) => {
            const tr = document.createElement('tr');
            if (row.isVital) {
                tr.style.background = 'rgba(239, 68, 68, 0.04)';
            }

            tr.innerHTML = `
                <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
                <td style="font-weight: 600;">
                    ${escapeHtml(row.defect)}
                    ${row.isVital ? '<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: var(--danger); font-size: 0.7rem; margin-left: 6px;">%80 Vital Few</span>' : ''}
                </td>
                <td style="text-align: center;">
                    <input type="number" min="0" class="pareto-count-input" data-idx="${idx}" value="${row.count}" style="width: 85px; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); text-align: center; font-weight: 700;">
                </td>
                <td style="text-align: right; font-weight: 600;">%${row.percentage.toFixed(1)}</td>
                <td style="text-align: right; font-weight: 700; color: ${row.cumPercentage <= 80 ? 'var(--danger)' : 'var(--success)'};">
                    %${row.cumPercentage.toFixed(1)}
                </td>
                <td style="text-align: right; color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(row.cost || '-')}</td>
                <td style="text-align: right;">
                    <button type="button" class="btn btn-outline btn-sm btn-del-defect" data-idx="${idx}" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" title="Hata Türünü Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Sayı değişim dinleyicileri
        tbody.querySelectorAll('.pareto-count-input').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'), 10);
                const val = parseInt(e.target.value, 10) || 0;
                defectList[idx].count = val;
                saveData();
                calculateAndRender();
            });
        });

        tbody.querySelectorAll('.btn-del-defect').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                defectList.splice(idx, 1);
                saveData();
                calculateAndRender();
            });
        });
    }

    function renderChart(data) {
        const canvas = document.getElementById('pareto-chart-canvas');
        if (!canvas) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
        const textColor = isDark ? '#94a3b8' : '#475569';

        const labels = data.map(d => {
            return d.defect.length > 20 ? d.defect.substring(0, 18) + '...' : d.defect;
        });
        const counts = data.map(d => d.count);
        const cumPcts = data.map(d => Math.round(d.cumPercentage * 10) / 10);

        // Çubuk renkleri (%80'e kadar kırmızı/turuncu, sonrası mavi/gri)
        const barColors = data.map(d => d.isVital ? 'rgba(225, 29, 72, 0.85)' : 'rgba(100, 116, 139, 0.65)');
        const barBorders = data.map(d => d.isVital ? '#e11d48' : '#64748b');

        if (paretoChart) {
            paretoChart.destroy();
        }

        const ctx = canvas.getContext('2d');
        paretoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Kümülatif % (Kural 80/20)',
                        type: 'line',
                        data: cumPcts,
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointBackgroundColor: '#10b981',
                        pointRadius: 4,
                        yAxisID: 'yCum',
                        tension: 0.25,
                        order: 1
                    },
                    {
                        label: 'Hata Adedi (Frekans)',
                        type: 'bar',
                        data: counts,
                        backgroundColor: barColors,
                        borderColor: barBorders,
                        borderWidth: 1.5,
                        borderRadius: 4,
                        yAxisID: 'yCount',
                        order: 2
                    }
                ]
            },
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
                                if (ctx.dataset.type === 'line') {
                                    return ` Kümülatif: %${ctx.raw}`;
                                }
                                return ` Adet: ${ctx.raw} parça`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, maxRotation: 35, minRotation: 0 }
                    },
                    yCount: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'Hata Frekansı (Adet)', color: textColor },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    yCum: {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        max: 100,
                        title: { display: true, text: 'Kümülatif Yüzde (%)', color: '#10b981' },
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: '#10b981',
                            callback: function (val) { return `%${val}`; }
                        }
                    }
                }
            }
        });
    }

    function addNewDefect() {
        const name = prompt('Yeni Hata / Red Sebebi:');
        if (!name) return;

        const countStr = prompt('Hata Adedi (Aylık):', '25');
        const count = parseInt(countStr, 10) || 0;

        defectList.push({
            defect: name,
            count: count,
            cost: `${(count * 25).toLocaleString('tr-TR')} ₺`
        });

        saveData();
        calculateAndRender();
    }

    function updateKpis(data, total) {
        const totalCountEl = document.getElementById('pareto-kpi-total-defects');
        if (totalCountEl) totalCountEl.textContent = total.toLocaleString('tr-TR');

        const vitalCount = data.filter(d => d.isVital).length;
        const vitalCountEl = document.getElementById('pareto-kpi-vital-count');
        if (vitalCountEl) vitalCountEl.textContent = `${vitalCount} / ${data.length}`;

        const vitalPct = total ? (data.filter(d => d.isVital).reduce((s, d) => s + d.count, 0) / total) * 100 : 0;
        const vitalPctEl = document.getElementById('pareto-kpi-vital-pct');
        if (vitalPctEl) vitalPctEl.textContent = `%${Math.round(vitalPct)}`;
    }

    function exportToExcel() {
        const totalCount = defectList.reduce((sum, item) => sum + item.count, 0);
        let cum = 0;
        const excelData = defectList.map((item, idx) => {
            cum += item.count;
            const pct = totalCount ? (item.count / totalCount) * 100 : 0;
            const cumPct = totalCount ? (cum / totalCount) * 100 : 0;
            return {
                'Sıra': idx + 1,
                'Hata Türü / Kusur': item.defect,
                'Hata Adedi (Frekans)': item.count,
                'Yüzde Pay (%)': `%${pct.toFixed(2)}`,
                'Kümülatif Pay (%)': `%${cumPct.toFixed(2)}`,
                'Pareto Sınıfı': cumPct <= 80 ? 'A - Vital Few (Hayati %20)' : 'B/C - Genel Dağılım',
                'Tahmini Maliyet': item.cost || '-'
            };
        });

        if (window.ExportHelper) {
            window.ExportHelper.toExcel(
                `Pareto_Analiz_Raporu_${new Date().toISOString().split('T')[0]}`, 
                'Pareto 80-20 Analizi', 
                excelData,
                null,
                { chartCanvasId: 'pareto-chart-canvas' }
            );
        }
    }

    function exportToPdf() {
        const reportEl = document.getElementById('qm-panel-pareto');
        if (window.ExportHelper && reportEl) {
            window.ExportHelper.toPdf(reportEl, `Pareto_Analiz_Raporu_${new Date().toISOString().split('T')[0]}`, {
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

    window.ParetoModule = {
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
