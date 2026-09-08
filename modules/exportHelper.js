/**
 * Kalite Yönetim Merkezi - Excel (.xlsx) ve PDF (.pdf) Dışa Aktarma Yardımcısı
 * SheetJS (xlsx) ve html2pdf.js entegrasyonu ile Türkçe karakter ve tablo desteği
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    const ExportHelper = {
        /**
         * Verileri stilize gerçek Excel (.xlsx) dosyası olarak dışa aktarır.
         * @param {string} fileName - Dosya adı (örn: '5S_Denetim_Raporu')
         * @param {string} sheetName - Sayfa sekmesi adı (örn: '5S Skorlari')
         * @param {Array<Object>} data - Dışa aktarılacak nesne dizisi
         * @param {Array<string>} headers - İsteğe bağlı özel başlık isimleri dizisi
         */
        toExcel: function (fileName, sheetName, data, headers = null) {
            try {
                if (typeof XLSX === 'undefined') {
                    alert('Excel kütüphanesi (SheetJS) yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
                    return;
                }

                if (!data || !data.length) {
                    alert('Dışa aktarılacak veri bulunamadı.');
                    return;
                }

                const ws = XLSX.utils.json_to_sheet(data, { header: headers || undefined });

                // Sütun genişliklerini otomatik hesapla
                const colWidths = [];
                const keys = headers || Object.keys(data[0]);
                keys.forEach(key => {
                    let maxLen = String(key).length;
                    data.forEach(row => {
                        const cellVal = row[key] ? String(row[key]) : '';
                        if (cellVal.length > maxLen) {
                            maxLen = Math.min(cellVal.length, 50);
                        }
                    });
                    colWidths.push({ wch: Math.max(maxLen + 4, 12) });
                });
                ws['!cols'] = colWidths;

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, (sheetName || 'Rapor').substring(0, 31));

                const finalName = (fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
                XLSX.writeFile(wb, finalName);
            } catch (err) {
                console.error('Excel Export Error:', err);
                alert('Excel dosyası oluşturulurken bir hata oluştu: ' + err.message);
            }
        },

        /**
         * HTML tablosunu doğrudan Excel (.xlsx) olarak dışa aktarır.
         * @param {string} tableId - Tablo elementi id'si
         * @param {string} fileName - Dosya adı
         * @param {string} sheetName - Sayfa sekmesi adı
         */
        tableToExcel: function (tableId, fileName, sheetName) {
            try {
                if (typeof XLSX === 'undefined') {
                    alert('Excel kütüphanesi yüklenemedi.');
                    return;
                }
                const tableElem = document.getElementById(tableId);
                if (!tableElem) {
                    alert('Tablo bulunamadı: ' + tableId);
                    return;
                }
                const wb = XLSX.utils.table_to_book(tableElem, { sheet: (sheetName || 'Sayfa1').substring(0, 31) });
                const finalName = (fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
                XLSX.writeFile(wb, finalName);
            } catch (err) {
                console.error('Table to Excel Error:', err);
                alert('Excel dışa aktarımı başarısız: ' + err.message);
            }
        },

        /**
         * Belirtilen DOM elementini A4 formatında vektörel/temiz PDF olarak indirir.
         * html2pdf yüklü değilse temiz bir yazdırma penceresi (Print fallback) açar.
         * @param {string|HTMLElement} elementOrId - Yazdırılacak element veya ID
         * @param {string} fileName - Dosya adı (örn: '5S_Raporu.pdf')
         * @param {Object} customOptions - Ek html2pdf ayarları
         */
        toPdf: function (elementOrId, fileName, customOptions = {}) {
            try {
                const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
                if (!element) {
                    alert('Yazdırılacak alan bulunamadı.');
                    return;
                }

                const finalName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

                if (typeof html2pdf !== 'undefined') {
                    // html2pdf kullanarak doğrudan .pdf dosyası indir
                    const opt = Object.assign({
                        margin: [10, 10, 10, 10],
                        filename: finalName,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, logging: false },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    }, customOptions);

                    // Geçici yükleme göstergesi
                    const originalCursor = document.body.style.cursor;
                    document.body.style.cursor = 'wait';

                    html2pdf().set(opt).from(element).save().then(() => {
                        document.body.style.cursor = originalCursor;
                    }).catch(err => {
                        document.body.style.cursor = originalCursor;
                        console.warn('html2pdf hata verdi, print fallback kullanılıyor:', err);
                        window.print();
                    });
                } else {
                    // Fallback to print
                    window.print();
                }
            } catch (err) {
                console.error('PDF Export Error:', err);
                window.print();
            }
        }
    };

    window.ExportHelper = ExportHelper;
})();
