/**
 * FMEA Risk Matrisi & Otomatik RPN Hesaplayıcı Modülü
 * AIAG & VDA Uyumlu Proses FMEA (PFMEA) Değerlendirme Aracı
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'fmea_records_v1';

    const DEFAULT_FMEA_ROWS = [
        {
            id: 'FMEA-01',
            step: 'Kablo Kesme & Sıyırma',
            failureMode: 'İletken tellerde (strand) sıyırma bıçağı kesis veya kopuk damar',
            failureEffect: 'Kablo kesiti küçülür, akım taşıma kapasitesi düşer, hatta aşırı ısınma',
            severity: 8,
            cause: 'Sıyırma bıçağı yarıçapı aşınması veya yanlış reçete seçimi',
            occurrence: 4,
            controls: 'Vardiya başı 10x büyüteç/mikroskop altında görsel kontrol',
            detection: 5,
            action: 'Otomatik kesme makinesine optik lazer damar sayacı ve bıçak çevrim sayacı entegrasyonu',
            responsible: 'Deniz Kanar & Bakım',
            dueDate: '2026-09-20',
            revSeverity: 8,
            revOccurrence: 1,
            revDetection: 2
        },
        {
            id: 'FMEA-02',
            step: 'Krimp Çakma (İletken Krimp)',
            failureMode: 'Krimp yüksekliğinin (CH) tolerans dışı çıkması (Gevşek krimp)',
            failureEffect: 'Yetersiz çekme kuvveti, araç titreşiminde terminalden kablonun çıkması',
            severity: 9,
            cause: 'Aplikatör mikrometre disk ayar vidasının titreşimle gevşemesi',
            occurrence: 5,
            controls: 'Her 4 saatte bir 5 numunede kumpas ölçümü ve çekme testi',
            detection: 4,
            action: 'Prese entegre CFM (Crimp Force Monitor - Çevrimiçi Krimp Kuvvet İzleme) sensörü',
            responsible: 'Murat Demir (Proses)',
            dueDate: '2026-09-15',
            revSeverity: 9,
            revOccurrence: 2,
            revDetection: 1
        },
        {
            id: 'FMEA-03',
            step: 'İzolasyon Krimp Kanadı',
            failureMode: 'İzolasyon kanadının PVC kılıfı delmesi veya kavramaması',
            failureEffect: 'Kablo girişinde bükülme kırılması, su sızdırmazlık kaybı (IP koruma riski)',
            severity: 6,
            cause: 'Farklı dış çaplı kablo için aynı aplikatör arka örsünün kullanılması',
            occurrence: 4,
            controls: 'Operatör ilk parça görsel kontrolü',
            detection: 5,
            action: 'Kablo dış çapına göre otomatik kaset seçen Poka-Yoke barkod doğrulaması',
            responsible: 'Deniz Kanar',
            dueDate: '2026-09-30',
            revSeverity: 6,
            revOccurrence: 2,
            revDetection: 2
        },
        {
            id: 'FMEA-04',
            step: 'Konnektör Takma (Terminal Pin Montajı)',
            failureMode: 'Terminalin konnektör kilidine tam oturmaması (Geriye kaçma)',
            failureEffect: 'Saha montajında temas kesikliği veya devreye enerji gitmemesi',
            severity: 8,
            cause: 'Operatörün "Tık" sesini ve geri çekme (Push-Click-Pull) testini atlaması',
            occurrence: 5,
            controls: 'Manuel operatör el kontrolü',
            detection: 6,
            action: 'Elektriksel test masasında sekonder kilit doğrulama pinleri ve geri çekme pnömatik testi',
            responsible: 'Ali Vural (Test Ekibi)',
            dueDate: '2026-09-18',
            revSeverity: 8,
            revOccurrence: 1,
            revDetection: 2
        },
        {
            id: 'FMEA-05',
            step: 'Elektriksel Süreklilik Testi',
            failureMode: 'Kısa devre veya çapraz pin bağlantısının testte kaçması',
            failureEffect: 'Müşteri montaj hattında sigorta atması veya araç elektronik arızası',
            severity: 9,
            cause: 'Test fikstür yaylı pinlerinde (pogo pin) temassızlık veya yanlış adaptör takılması',
            occurrence: 2,
            controls: 'Günlük Altın Numune (Golden Sample) ile test masası doğrulaması',
            detection: 3,
            action: 'Test masası yazılımına 4-telli Kelvin direnç ölçümü ve periyodik pin direnç loglaması',
            responsible: 'Selin Erdem (Kalite)',
            dueDate: '2026-10-05',
            revSeverity: 9,
            revOccurrence: 1,
            revDetection: 1
        }
    ];

    let fmeaList = [];
    let filterCriticalOnly = false;

    function init() {
        loadData();
        bindEvents();
        renderTable();
        updateKpis();
    }

    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                fmeaList = JSON.parse(saved);
            } else {
                fmeaList = [...DEFAULT_FMEA_ROWS];
                saveData();
            }
        } catch (e) {
            console.error('FMEA yükleme hatası:', e);
            fmeaList = [...DEFAULT_FMEA_ROWS];
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fmeaList));
            updateKpis();
        } catch (e) {
            console.error('FMEA kaydetme hatası:', e);
        }
    }

    function bindEvents() {
        // Yeni Satır Ekle
        document.getElementById('btn-add-fmea-row')?.addEventListener('click', addNewRow);

        // Kritik Filtre Toggle
        const critBtn = document.getElementById('btn-filter-critical-fmea');
        if (critBtn) {
            critBtn.addEventListener('click', () => {
                filterCriticalOnly = !filterCriticalOnly;
                critBtn.classList.toggle('active', filterCriticalOnly);
                critBtn.innerHTML = filterCriticalOnly
                    ? '<i class="fa-solid fa-filter"></i> Tüm Riskleri Göster'
                    : '<i class="fa-solid fa-triangle-exclamation"></i> Sadece Kritik Riskler (RPN &gt; 100)';
                renderTable();
            });
        }

        // Örnek Veriye Dön
        document.getElementById('btn-reset-fmea-data')?.addEventListener('click', () => {
            if (confirm('FMEA tablosu varsayılan verilere sıfırlansın mı?')) {
                fmeaList = [...DEFAULT_FMEA_ROWS];
                saveData();
                renderTable();
            }
        });

        // Excel ve PDF Dışa Aktar
        document.getElementById('btn-fmea-export-excel')?.addEventListener('click', exportToExcel);
        document.getElementById('btn-fmea-export-pdf')?.addEventListener('click', exportToPdf);
    }

    function renderTable() {
        const tbody = document.getElementById('fmea-table-tbody');
        if (!tbody) return;

        const filtered = fmeaList.filter(row => {
            if (filterCriticalOnly) {
                const rpn = (row.severity || 1) * (row.occurrence || 1) * (row.detection || 1);
                return rpn >= 100;
            }
            return true;
        });

        if (!filtered.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="15" style="text-align: center; padding: 32px; color: var(--text-muted);">
                        Kriterlere uyan FMEA satırı bulunamadı.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = '';
        filtered.forEach(row => {
            const tr = document.createElement('tr');
            const rpn = (row.severity || 1) * (row.occurrence || 1) * (row.detection || 1);
            const rpnBadge = getRpnBadge(rpn);

            const revRpn = row.revSeverity && row.revOccurrence && row.revDetection
                ? row.revSeverity * row.revOccurrence * row.revDetection
                : null;
            const revBadge = revRpn !== null ? getRpnBadge(revRpn) : '<span style="color: var(--text-muted);">-</span>';

            tr.innerHTML = `
                <td style="font-weight: 700; color: var(--primary); font-family: monospace;">${escapeHtml(row.id)}</td>
                <td style="font-weight: 600;">${escapeHtml(row.step)}</td>
                <td style="color: var(--text-primary);">${escapeHtml(row.failureMode)}</td>
                <td style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(row.failureEffect)}</td>
                <td style="text-align: center;">
                    <input type="number" min="1" max="10" class="fmea-num-input fmea-s" data-id="${row.id}" value="${row.severity}">
                </td>
                <td style="font-size: 0.8rem;">${escapeHtml(row.cause)}</td>
                <td style="text-align: center;">
                    <input type="number" min="1" max="10" class="fmea-num-input fmea-o" data-id="${row.id}" value="${row.occurrence}">
                </td>
                <td style="font-size: 0.8rem;">${escapeHtml(row.controls)}</td>
                <td style="text-align: center;">
                    <input type="number" min="1" max="10" class="fmea-num-input fmea-d" data-id="${row.id}" value="${row.detection}">
                </td>
                <td style="text-align: center;">${rpnBadge}</td>
                <td style="font-size: 0.8rem; max-width: 180px;">
                    <div style="font-weight: 500;">${escapeHtml(row.action)}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                        <i class="fa-solid fa-user"></i> ${escapeHtml(row.responsible || '-')} | <i class="fa-solid fa-calendar"></i> ${escapeHtml(row.dueDate || '-')}
                    </div>
                </td>
                <td style="text-align: center;">
                    <input type="number" min="1" max="10" class="fmea-num-input fmea-rev-s" data-id="${row.id}" value="${row.revSeverity || ''}">
                </td>
                <td style="text-align: center;">
                    <input type="number" min="1" max="10" class="fmea-num-input fmea-rev-o" data-id="${row.id}" value="${row.revOccurrence || ''}">
                </td>
                <td style="text-align: center;">
                    <input type="number" min="1" max="10" class="fmea-num-input fmea-rev-d" data-id="${row.id}" value="${row.revDetection || ''}">
                </td>
                <td style="text-align: center;">${revBadge}</td>
                <td style="text-align: right;">
                    <button type="button" class="btn btn-outline btn-sm btn-del-fmea" data-id="${row.id}" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" title="Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Sayısal Değişim Dinleyicileri (Canlı RPN Güncelleme)
        tbody.querySelectorAll('.fmea-num-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const id = e.target.getAttribute('data-id');
                const row = fmeaList.find(r => r.id === id);
                if (!row) return;

                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = 1;
                if (val < 1) val = 1;
                if (val > 10) val = 10;

                if (e.target.classList.contains('fmea-s')) row.severity = val;
                if (e.target.classList.contains('fmea-o')) row.occurrence = val;
                if (e.target.classList.contains('fmea-d')) row.detection = val;
                if (e.target.classList.contains('fmea-rev-s')) row.revSeverity = val;
                if (e.target.classList.contains('fmea-rev-o')) row.revOccurrence = val;
                if (e.target.classList.contains('fmea-rev-d')) row.revDetection = val;

                saveData();
                renderTable();
            });
        });

        tbody.querySelectorAll('.btn-del-fmea').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm(`${id} satırını silmek istediğinize emin misiniz?`)) {
                    fmeaList = fmeaList.filter(r => r.id !== id);
                    saveData();
                    renderTable();
                }
            });
        });
    }

    function getRpnBadge(rpn) {
        if (rpn >= 200) {
            return `<span class="badge status-danger" style="font-weight: 800; font-size: 0.85rem;" title="Kritik Risk! Derhal Aksiyon Planlayın">${rpn}</span>`;
        } else if (rpn >= 100) {
            return `<span class="badge status-warning" style="font-weight: 700; font-size: 0.85rem;" title="Yüksek Risk">${rpn}</span>`;
        } else if (rpn >= 40) {
            return `<span class="badge" style="background: rgba(234, 179, 8, 0.15); color: #ca8a04; border: 1px solid rgba(234, 179, 8, 0.3); font-weight: 600;">${rpn}</span>`;
        }
        return `<span class="badge status-active" style="font-weight: 600;">${rpn}</span>`;
    }

    function addNewRow() {
        const step = prompt('Proses Adımı / İstasyon:', 'Kablo Montaj');
        if (!step) return;

        const failureMode = prompt('Potansiyel Hata Türü:', 'Krimp eksen kaçıklığı');
        const nextId = `FMEA-0${fmeaList.length + 1}`;

        fmeaList.push({
            id: nextId,
            step,
            failureMode: failureMode || 'Belirtilmedi',
            failureEffect: 'Montaj zorluğu / elektrik hatası',
            severity: 7,
            cause: 'Fikstür boşluğu',
            occurrence: 4,
            controls: 'Görsel kontrol',
            detection: 4,
            action: 'Fikstür revizyonu',
            responsible: 'Deniz Kanar',
            dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            revSeverity: 7,
            revOccurrence: 2,
            revDetection: 2
        });

        saveData();
        renderTable();
    }

    function updateKpis() {
        const total = fmeaList.length;
        let criticalCount = 0;
        let totalRpn = 0;
        let totalRevRpn = 0;
        let revCount = 0;

        fmeaList.forEach(r => {
            const rpn = (r.severity || 1) * (r.occurrence || 1) * (r.detection || 1);
            totalRpn += rpn;
            if (rpn >= 100) criticalCount++;

            if (r.revSeverity && r.revOccurrence && r.revDetection) {
                totalRevRpn += (r.revSeverity * r.revOccurrence * r.revDetection);
                revCount++;
            }
        });

        const avgRpn = total ? Math.round(totalRpn / total) : 0;
        const avgRevRpn = revCount ? Math.round(totalRevRpn / revCount) : 0;
        const reductionPct = avgRpn ? Math.round(((avgRpn - avgRevRpn) / avgRpn) * 100) : 0;

        const totalEl = document.getElementById('fmea-kpi-total');
        if (totalEl) totalEl.textContent = total;

        const critEl = document.getElementById('fmea-kpi-critical');
        if (critEl) critEl.textContent = criticalCount;

        const avgEl = document.getElementById('fmea-kpi-avg-rpn');
        if (avgEl) avgEl.textContent = avgRpn;

        const redEl = document.getElementById('fmea-kpi-reduction');
        if (redEl) redEl.textContent = `%${reductionPct}`;
    }

    function exportToExcel() {
        const excelData = fmeaList.map(r => {
            const rpn = (r.severity || 1) * (r.occurrence || 1) * (r.detection || 1);
            const revRpn = r.revSeverity && r.revOccurrence && r.revDetection
                ? r.revSeverity * r.revOccurrence * r.revDetection
                : '';
            return {
                'Satır No': r.id,
                'Proses Adımı': r.step,
                'Hata Türü': r.failureMode,
                'Hatanın Etkisi': r.failureEffect,
                'Şiddet (S)': r.severity,
                'Potansiyel Neden': r.cause,
                'Olasılık (O)': r.occurrence,
                'Mevcut Kontroller': r.controls,
                'Saptanabilirlik (D)': r.detection,
                'Başlangıç RPN': rpn,
                'Risk Düzeyi': rpn >= 200 ? 'KRİTİK' : (rpn >= 100 ? 'YÜKSEK' : (rpn >= 40 ? 'ORTA' : 'DÜŞÜK')),
                'Önleyici Aksiyon': r.action,
                'Sorumlu': r.responsible || '-',
                'Termin': r.dueDate || '-',
                'Revize S': r.revSeverity || '',
                'Revize O': r.revOccurrence || '',
                'Revize D': r.revDetection || '',
                'Revize RPN': revRpn
            };
        });

        if (window.ExportHelper) {
            window.ExportHelper.toExcel(`PFMEA_Risk_Matrisi_${new Date().toISOString().split('T')[0]}`, 'FMEA Risk Analizi', excelData);
        }
    }

    function exportToPdf() {
        const reportEl = document.getElementById('qm-panel-fmea');
        if (window.ExportHelper && reportEl) {
            window.ExportHelper.toPdf(reportEl, `FMEA_Risk_Raporu_${new Date().toISOString().split('T')[0]}`, {
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

    window.FmeaModule = {
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
