/**
 * Kalite Yönetim Merkezi - Excel (.xlsx) ve PDF (.pdf) Dışa Aktarma Yardımcısı
 * ExcelJS entegrasyonu ile profesyonel kurumsal stil (renk, kalınlaştırma, kenarlık)
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 */

(function () {
    'use strict';

    const ExportHelper = {
        /**
         * Verileri profesyonel ve stilize edilmiş gerçek Excel (.xlsx) dosyası olarak dışa aktarır.
         * @param {string} fileName - Dosya adı (örn: '5S_Denetim_Raporu')
         * @param {string} sheetName - Sayfa sekmesi adı (örn: '5S Skorlari')
         * @param {Array<Object>} data - Dışa aktarılacak nesne dizisi
         * @param {Array<string>} headers - İsteğe bağlı özel başlık isimleri dizisi
         * @param {Object} options - Ekstra seçenekler (grafik ekleme vb.)
         */
        toExcel: async function (fileName, sheetName, data, headers = null, options = {}) {
            try {
                if (typeof ExcelJS === 'undefined') {
                    alert('ExcelJS kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
                    return;
                }

                if (!data || !data.length) {
                    alert('Dışa aktarılacak veri bulunamadı.');
                    return;
                }

                const workbook = new ExcelJS.Workbook();
                workbook.creator = 'Deniz Kanar - Kalite Yönetim Merkezi';
                workbook.created = new Date();
                
                const worksheet = workbook.addWorksheet((sheetName || 'Rapor').substring(0, 31));

                // 1. Üst Başlık (Kurumsal Rapor Başlığı)
                worksheet.mergeCells('A1:F2');
                const titleCell = worksheet.getCell('A1');
                titleCell.value = (sheetName || 'Kalite Raporu').toUpperCase();
                titleCell.font = { name: 'Calibri', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
                titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
                titleCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0F172A' } // Tailwind slate-900 (Daha koyu, kurumsal lacivert)
                };

                // Tarih Bilgisi
                worksheet.mergeCells('A3:F3');
                const dateCell = worksheet.getCell('A3');
                dateCell.value = `Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}`;
                dateCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FF475569' } };
                dateCell.alignment = { vertical: 'middle', horizontal: 'right' };

                // Boş satır bırak
                worksheet.addRow([]);

                // --- 2. GRAFİK (CHART) EKLENTİSİ ---
                if (options.chartCanvasId) {
                    const canvas = document.getElementById(options.chartCanvasId);
                    if (canvas) {
                        try {
                            const base64Image = canvas.toDataURL('image/png');
                            const imageId = workbook.addImage({
                                base64: base64Image,
                                extension: 'png',
                            });

                            // Grafiğin sığması için boş satırlar ekle
                            for (let i = 0; i < 20; i++) {
                                worksheet.addRow([]);
                            }

                            // Grafiği B5 hücresinden başlayarak yerleştir
                            worksheet.addImage(imageId, {
                                tl: { col: 1, row: 4 },
                                ext: { width: 450, height: 350 }
                            });
                            
                            // Grafik altı boşluk
                            worksheet.addRow([]);
                        } catch (err) {
                            console.warn("Grafik Excel'e eklenirken hata oluştu: ", err);
                        }
                    }
                }

                // 3. Tablo Başlıkları (Headers)
                const keys = headers || Object.keys(data[0]);
                const headerRow = worksheet.addRow(keys);
                
                headerRow.eachCell((cell, colNumber) => {
                    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF334155' } // Tailwind slate-700
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    cell.border = {
                        top: { style: 'medium', color: { argb: 'FF0F172A' } },
                        left: { style: 'thin', color: { argb: 'FF94A3B8' } },
                        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
                        right: { style: 'thin', color: { argb: 'FF94A3B8' } }
                    };
                });
                headerRow.height = 30;

                // 3. Tablo Verileri (Data Rows)
                data.forEach((rowData, index) => {
                    const rowValues = keys.map(key => {
                        if (headers && headers.length === Object.keys(rowData).length) {
                            return Object.values(rowData)[keys.indexOf(key)];
                        }
                        return rowData[key];
                    });
                    
                    const row = worksheet.addRow(rowValues);
                    
                    // Zebra stili renklendirme ve hücre kenarlıkları
                    const isEven = index % 2 === 0;
                    row.eachCell((cell) => {
                        cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF0F172A' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                            bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
                        };
                        
                        // Alternating row colors
                        if (!isEven) {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFF8FAFC' } // Tailwind slate-50
                            };
                        }
                    });
                    row.height = 22; // Satır yüksekliğini biraz artır
                });

                // 4. Sütun Genişliklerini Ayarlama
                worksheet.columns.forEach((column, i) => {
                    let maxLength = 0;
                    column.eachCell({ includeEmpty: true }, (cell) => {
                        const columnLength = cell.value ? cell.value.toString().length : 0;
                        if (columnLength > maxLength) {
                            maxLength = columnLength;
                        }
                    });
                    column.width = Math.min(maxLength < 12 ? 12 : maxLength + 4, 60); // min 12, max 60 width
                });

                // 5. Dosyayı Oluştur ve İndir
                const buffer = await workbook.xlsx.writeBuffer();
                const finalName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
                
                if (typeof saveAs !== 'undefined') {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), finalName);
                } else {
                    // Fallback for download
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = finalName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            } catch (err) {
                console.error('Excel Export Error:', err);
                alert('Excel dosyası oluşturulurken bir hata oluştu: ' + err.message);
            }
        },

        /**
         * HTML tablosunu doğrudan Excel (.xlsx) olarak dışa aktarır. (Kullanılmıyor, geriye dönük uyumluluk)
         */
        tableToExcel: function (tableId, fileName, sheetName) {
            alert("Bu fonksiyon ExcelJS geçişi nedeniyle devre dışıdır. Lütfen veriyi toExcel metoduna obje dizisi olarak gönderin.");
        },

        /**
         * Belirtilen DOM elementini A4 formatında vektörel/temiz PDF olarak indirir.
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
                    // Create loading overlay to hide the flash
                    const overlay = document.createElement('div');
                    overlay.id = 'pdf-loading-overlay';
                    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg-primary); z-index: 999999; display: flex; align-items: center; justify-content: center; flex-direction: column; color: var(--text-primary); font-family: inherit; transition: opacity 0.3s;';
                    overlay.innerHTML = '<i class="fa-solid fa-file-pdf fa-3x" style="color: var(--primary); margin-bottom: 15px;"></i><h2 style="margin:0; font-size: 1.5rem; font-weight: 800;">PDF Hazırlanıyor...</h2><p style="margin-top: 10px; font-weight: 500; color: var(--text-secondary);">Lütfen bekleyin, yüksek kaliteli belge oluşturuluyor.</p>';
                    document.body.appendChild(overlay);

                    const originalCursor = document.body.style.cursor;
                    document.body.style.cursor = 'wait';

                    // Force Light Theme on actual DOM so charts and SVGs natively update
                    const originalTheme = document.documentElement.getAttribute('data-theme');
                    document.documentElement.setAttribute('data-theme', 'light');
                    const originalBg = element.style.backgroundColor;
                    element.style.backgroundColor = '#ffffff';

                    const opt = Object.assign({
                        margin: [10, 10, 10, 10],
                        filename: finalName,
                        image: { type: 'jpeg', quality: 1.0 },
                        pagebreak: { mode: ['css', 'legacy'], avoid: ['svg', '.fishbone-cat-box', '.five-why-row', '.eightd-discipline-card', '.fives-meta-grid', '.card', '.kriter-row', '.fives-q-item', '.fives-rating-group', '.fives-action-item'] },
                        html2canvas: { 
                            scale: 2, 
                            useCORS: true, 
                            logging: false,
                            scrollY: 0
                        },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    }, customOptions);

                    // Wait 400ms for charts and SVGs to re-render in light mode
                    setTimeout(() => {
                        html2pdf().set(opt).from(element).outputPdf('blob').then(function(blob) {
                            if (typeof saveAs !== 'undefined') {
                                saveAs(blob, finalName);
                            } else {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = finalName;
                                a.click();
                                URL.revokeObjectURL(url);
                            }
                            
                            // Restore original theme and remove overlay
                            if (originalTheme) {
                                document.documentElement.setAttribute('data-theme', originalTheme);
                            } else {
                                document.documentElement.removeAttribute('data-theme');
                            }
                            element.style.backgroundColor = originalBg;
                            document.body.style.cursor = originalCursor;
                            
                            setTimeout(() => {
                                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                            }, 300);

                        }).catch(err => {
                            if (originalTheme) {
                                document.documentElement.setAttribute('data-theme', originalTheme);
                            } else {
                                document.documentElement.removeAttribute('data-theme');
                            }
                            element.style.backgroundColor = originalBg;
                            document.body.style.cursor = originalCursor;
                            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);

                            console.error('html2pdf hata verdi:', err);
                            alert('PDF oluşturulurken bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
                        });
                    }, 400);
                } else {
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
