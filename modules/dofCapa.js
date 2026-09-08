/**
 * DÖF / CAPA (Düzeltici ve Önleyici Faaliyet) Takip Tablosu Modülü
 * ISO 9001 & IATF 16949 Uyumlu Dijital Aksiyon Takip Sistemi
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'dof_capa_records_v1';

    // Başlangıç / Örnek DÖF Verileri
    const DEFAULT_DOFS = [
        {
            id: 'DOF-2026-001',
            title: 'Kablo Montaj Hat 03 Krimp Çekme Kuvveti Düşüklüğü (<60N)',
            source: 'Proses Kontrol',
            department: 'Kablo Montaj / Krimp Hattı',
            assignedTo: 'Deniz Kanar (Proses Kalite)',
            openDate: '2026-09-01',
            dueDate: '2026-09-12',
            closeDate: '',
            priority: 'Yüksek',
            status: 'Aksiyon Aşamasında',
            rootCause: 'Aplikatör mikrometre ayar diskinde 0.08mm tolerans sapması ve Lot değişiminde ilk parça kontrolünün pres kilidiyle zorunlu kılınmaması.',
            action: 'Aplikatör bakım kılavuzu revize edildi. Prese ilk parça çekme testi doğrulanmadan çalışma izni vermeyen PLC kilidi bağlandı.',
            verification: 'İlk 500 adetlik seride çekme kuvveti ortalaması 78.4 N ölçüldü (min spec: 60 N). Doğrulama devam ediyor.'
        },
        {
            id: 'DOF-2026-002',
            title: 'Konnektör Takma İstasyonunda Yanlış Pin Yuvasına Giriş (Görsel Kusur)',
            source: '5S Denetimi',
            department: 'Montaj & Bağlantı',
            assignedTo: 'Ahmet Yılmaz (Üretim Hat Lideri)',
            openDate: '2026-08-20',
            dueDate: '2026-08-28',
            closeDate: '2026-08-27',
            priority: 'Yüksek',
            status: 'Kapatıldı',
            rootCause: 'Konnektör gövdesinde simetrik pin yuvalarının bulunması ve operatör yorgunluğu.',
            action: 'Konnektör montaj fikstürüne LED destekli optik yönlendirme (Pick-to-Light) Poka-Yoke sistemi kuruldu.',
            verification: '27 Ağustos tarihli 10.000 parça üretiminde 0 pin hatası ile kapatıldı.'
        },
        {
            id: 'DOF-2026-003',
            title: 'Otomatik Kesim Makinesinde İzolasyon Soyma Boyunun Kısa Kalması',
            source: 'Müşteri Şikayeti',
            department: 'Kesme & Sıyırma',
            assignedTo: 'Murat Demir (Bakım & Metot)',
            openDate: '2026-09-03',
            dueDate: '2026-09-15',
            closeDate: '',
            priority: 'Orta',
            status: 'İnceleniyor',
            rootCause: 'Kablo makarası frenleme torkunun değişkenlik göstermesi sonucu tel besleme adımında kayma.',
            action: 'Servo besleme ünitesine encoder geribildirimli senkron tansiyoner rulosu entegre edilecek.',
            verification: 'Tedarikçi firma teknik servisiyle görüşme yapılıyor.'
        },
        {
            id: 'DOF-2026-004',
            title: 'Terminal Makara Etiketlerinde QR Kod Okunamama Hatası',
            source: 'Tedarikçi',
            department: 'Girdi Kalite Kontrol',
            assignedTo: 'Selin Erdem (Kalite Mühendisi)',
            openDate: '2026-08-15',
            dueDate: '2026-08-25',
            closeDate: '2026-08-24',
            priority: 'Düşük',
            status: 'Kapatıldı',
            rootCause: 'Tedarikçi termal transfer yazıcı kafasında çizik olması sebebiyle barkod çizgisinde kopukluk.',
            action: 'Tedarikçiye 8D formu iletildi, yazıcı kafası değiştirildi ve Girdi Kalite otomatik tarayıcı eşiği sıkılaştırıldı.',
            verification: 'Son 3 sevkiyatta barkod doğrulama oranı %100.'
        }
    ];

    let dofList = [];
    let activeFilterStatus = 'all';
    let searchQuery = '';

    function init() {
        loadData();
        bindEvents();
        renderTable();
        updateSummaryKpis();
    }

    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                dofList = JSON.parse(saved);
            } else {
                dofList = [...DEFAULT_DOFS];
                saveData();
            }
        } catch (e) {
            console.error('DÖF veri yükleme hatası:', e);
            dofList = [...DEFAULT_DOFS];
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dofList));
            updateSummaryKpis();
        } catch (e) {
            console.error('DÖF kaydetme hatası:', e);
        }
    }

    function bindEvents() {
        // Filtre Butonları
        document.querySelectorAll('.dof-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dof-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilterStatus = btn.getAttribute('data-status') || 'all';
                renderTable();
            });
        });

        // Arama Kutusu
        const searchInput = document.getElementById('dof-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderTable();
            });
        }

        // Yeni DÖF Formu Toggle
        const toggleBtn = document.getElementById('btn-toggle-dof-form');
        const formContainer = document.getElementById('dof-new-form-container');
        if (toggleBtn && formContainer) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = formContainer.style.display === 'none' || !formContainer.style.display;
                formContainer.style.display = isHidden ? 'block' : 'none';
                toggleBtn.innerHTML = isHidden
                    ? '<i class="fa-solid fa-xmark"></i> Formu Gizle'
                    : '<i class="fa-solid fa-plus"></i> Yeni DÖF / CAPA Aç';
            });
        }

        // Yeni DÖF Kaydet
        document.getElementById('btn-save-new-dof')?.addEventListener('click', addNewDofFromForm);

        // Örnek Verileri Sıfırla
        document.getElementById('btn-reset-dof-data')?.addEventListener('click', () => {
            if (confirm('DÖF kayıtları varsayılan örnek kayıtlara döndürülsün mü?')) {
                dofList = [...DEFAULT_DOFS];
                saveData();
                renderTable();
            }
        });

        // Excel ve PDF Dışa Aktar
        document.getElementById('btn-dof-export-excel')?.addEventListener('click', exportToExcel);
        document.getElementById('btn-dof-export-pdf')?.addEventListener('click', exportToPdf);
    }

    function renderTable() {
        const tbody = document.getElementById('dof-table-tbody');
        if (!tbody) return;

        let filtered = dofList.filter(item => {
            if (activeFilterStatus !== 'all' && item.status !== activeFilterStatus) {
                return false;
            }
            if (searchQuery) {
                const text = `${item.id} ${item.title} ${item.department} ${item.assignedTo} ${item.rootCause} ${item.source}`.toLowerCase();
                if (!text.includes(searchQuery)) return false;
            }
            return true;
        });

        if (!filtered.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
                        <i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
                        Kayıtlı DÖF / CAPA bulunamadı.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = '';
        filtered.forEach(item => {
            const tr = document.createElement('tr');
            const statusClass = getStatusBadgeClass(item.status);
            const priorityBadge = getPriorityBadge(item.priority);

            tr.innerHTML = `
                <td style="font-family: monospace; font-weight: 700; color: var(--primary);">
                    ${escapeHtml(item.id)}
                </td>
                <td>
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                        ${escapeHtml(item.title)}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">
                        <i class="fa-solid fa-tag"></i> Kaynak: <strong>${escapeHtml(item.source)}</strong> | <i class="fa-solid fa-building"></i> ${escapeHtml(item.department)}
                    </div>
                </td>
                <td style="font-size: 0.85rem;">
                    <div><i class="fa-solid fa-user"></i> ${escapeHtml(item.assignedTo)}</div>
                </td>
                <td>${priorityBadge}</td>
                <td style="font-size: 0.82rem;">
                    <div>Açılış: ${escapeHtml(item.openDate)}</div>
                    <div style="color: ${isOverdue(item.dueDate, item.status) ? 'var(--danger)' : 'var(--text-muted)'}; font-weight: 600;">
                        Termin: ${escapeHtml(item.dueDate)} ${isOverdue(item.dueDate, item.status) ? '(!)' : ''}
                    </div>
                </td>
                <td>
                    <span class="badge ${statusClass}">
                        ${escapeHtml(item.status)}
                    </span>
                </td>
                <td style="max-width: 220px; font-size: 0.8rem; color: var(--text-secondary);">
                    <div style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" title="${escapeHtml(item.action)}">
                        ${escapeHtml(item.action)}
                    </div>
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <button type="button" class="btn btn-outline btn-sm btn-dof-status" data-id="${item.id}" title="Durumu İlerlet / Kapat">
                        <i class="fa-solid ${item.status === 'Kapatıldı' ? 'fa-rotate-left' : 'fa-check'}"></i>
                    </button>
                    <button type="button" class="btn btn-outline btn-sm btn-dof-delete" data-id="${item.id}" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" title="Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Satır Buton Dinleyicileri
        tbody.querySelectorAll('.btn-dof-status').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                advanceStatus(id);
            });
        });

        tbody.querySelectorAll('.btn-dof-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteDof(id);
            });
        });
    }

    function advanceStatus(id) {
        const dof = dofList.find(d => d.id === id);
        if (!dof) return;

        const cycle = ['Açık', 'İnceleniyor', 'Aksiyon Aşamasında', 'Doğrulama Bekliyor', 'Kapatıldı'];
        const currIdx = cycle.indexOf(dof.status);
        if (currIdx === -1 || currIdx === cycle.length - 1) {
            dof.status = 'Açık';
            dof.closeDate = '';
        } else {
            dof.status = cycle[currIdx + 1];
            if (dof.status === 'Kapatıldı') {
                dof.closeDate = new Date().toISOString().split('T')[0];
            }
        }
        saveData();
        renderTable();
    }

    function deleteDof(id) {
        if (!confirm(`${id} nolu DÖF kaydını silmek istediğinize emin misiniz?`)) return;
        dofList = dofList.filter(d => d.id !== id);
        saveData();
        renderTable();
    }

    function addNewDofFromForm() {
        const title = document.getElementById('dof-form-title')?.value.trim();
        const source = document.getElementById('dof-form-source')?.value || 'Proses Kontrol';
        const department = document.getElementById('dof-form-dept')?.value.trim() || 'Kablo Donanım';
        const assignedTo = document.getElementById('dof-form-assignee')?.value.trim() || 'Deniz Kanar';
        const priority = document.getElementById('dof-form-priority')?.value || 'Orta';
        const dueDate = document.getElementById('dof-form-due')?.value || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        const rootCause = document.getElementById('dof-form-root')?.value.trim() || 'Araştırma aşamasında.';
        const action = document.getElementById('dof-form-action')?.value.trim() || 'Aksiyon planlanıyor.';

        if (!title) {
            alert('Lütfen Uygunsuzluk / DÖF Başlığını yazınız.');
            return;
        }

        const newId = generateNextId();
        const newRecord = {
            id: newId,
            title,
            source,
            department,
            assignedTo,
            openDate: new Date().toISOString().split('T')[0],
            dueDate,
            closeDate: '',
            priority,
            status: 'Açık',
            rootCause,
            action,
            verification: ''
        };

        dofList.unshift(newRecord);
        saveData();
        renderTable();

        // Formu temizle ve gizle
        document.getElementById('dof-form-title').value = '';
        document.getElementById('dof-form-root').value = '';
        document.getElementById('dof-form-action').value = '';
        const formContainer = document.getElementById('dof-new-form-container');
        if (formContainer) formContainer.style.display = 'none';

        const toggleBtn = document.getElementById('btn-toggle-dof-form');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Yeni DÖF / CAPA Aç';

        alert(`${newId} numaralı yeni DÖF başarıyla oluşturuldu.`);
    }

    function generateNextId() {
        const year = new Date().getFullYear();
        const maxNum = dofList.reduce((max, item) => {
            const parts = item.id.split('-');
            if (parts.length === 3) {
                const num = parseInt(parts[2], 10);
                return num > max ? num : max;
            }
            return max;
        }, 0);
        const next = String(maxNum + 1).padStart(3, '0');
        return `DOF-${year}-${next}`;
    }

    // Dışarıdan doğrudan DÖF açma API'si (Örn: Fishbone veya 5S modülünden)
    function addNewDofDirect(data) {
        const newId = generateNextId();
        const newRecord = {
            id: newId,
            title: data.title || 'Uygunsuzluk Bildirimi',
            source: data.source || 'İç Tetkik',
            department: data.department || 'Proses',
            assignedTo: data.assignedTo || 'Deniz Kanar',
            openDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
            closeDate: '',
            priority: data.priority || 'Yüksek',
            status: 'Açık',
            rootCause: data.rootCause || '',
            action: data.action || '',
            verification: ''
        };
        dofList.unshift(newRecord);
        saveData();
        renderTable();
        return newId;
    }

    function updateSummaryKpis() {
        const total = dofList.length;
        const open = dofList.filter(d => d.status !== 'Kapatıldı').length;
        const closed = dofList.filter(d => d.status === 'Kapatıldı').length;
        const highPriority = dofList.filter(d => d.priority === 'Yüksek' && d.status !== 'Kapatıldı').length;

        const totalEl = document.getElementById('dof-kpi-total');
        if (totalEl) totalEl.textContent = total;

        const openEl = document.getElementById('dof-kpi-open');
        if (openEl) openEl.textContent = open;

        const closedEl = document.getElementById('dof-kpi-closed');
        if (closedEl) closedEl.textContent = closed;

        const highEl = document.getElementById('dof-kpi-high');
        if (highEl) highEl.textContent = highPriority;
    }

    function isOverdue(dueDate, status) {
        if (status === 'Kapatıldı' || !dueDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return dueDate < today;
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Kapatıldı': return 'status-active';
            case 'Açık': return 'status-danger';
            case 'Aksiyon Aşamasında': return 'status-warning';
            case 'Doğrulama Bekliyor': return 'status-ready';
            default: return 'status-neutral';
        }
    }

    function getPriorityBadge(priority) {
        if (priority === 'Yüksek') {
            return '<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3);">Yüksek</span>';
        } else if (priority === 'Orta') {
            return '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3);">Orta</span>';
        }
        return '<span class="badge" style="background: rgba(100, 116, 139, 0.15); color: var(--text-muted); border: 1px solid var(--border-color);">Düşük</span>';
    }

    function exportToExcel() {
        const excelData = dofList.map(item => ({
            'DÖF No': item.id,
            'Uygunsuzluk / Başlık': item.title,
            'Kaynak': item.source,
            'Departman / Hat': item.department,
            'Sorumlu': item.assignedTo,
            'Öncelik': item.priority,
            'Statü': item.status,
            'Açılış Tarihi': item.openDate,
            'Termin Tarihi': item.dueDate,
            'Kapanış Tarihi': item.closeDate || '-',
            'Kök Neden': item.rootCause,
            'Düzeltici Önleyici Faaliyet': item.action,
            'Doğrulama Notu': item.verification || '-'
        }));

        if (window.ExportHelper) {
            window.ExportHelper.toExcel(`DOF_CAPA_Takip_Listesi_${new Date().toISOString().split('T')[0]}`, 'DÖF CAPA Listesi', excelData);
        }
    }

    function exportToPdf() {
        const reportEl = document.getElementById('qm-panel-dof');
        if (window.ExportHelper && reportEl) {
            window.ExportHelper.toPdf(reportEl, `DOF_CAPA_Raporu_${new Date().toISOString().split('T')[0]}`, {
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

    window.DofCapaModule = {
        init,
        addNewDofDirect,
        exportToExcel,
        exportToPdf
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
