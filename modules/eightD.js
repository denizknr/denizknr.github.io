/**
 * 8D Problem Çözme Raporu (Global 8D / VDA & AIAG Metodolojisi)
 * Deniz Kanar - Kalite Güvence & Proses Kalite Portfolyosu
 * Otomotiv ve Kablo Donanım Süreçleri İçin Tam Kapsamlı D1 - D8 Modülü
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'eightd_report_data';

    // 8D Örnek Senaryo Verileri (Kablo Donanımı & Otomotiv Vaka Çalışmaları)
    const SAMPLE_SCENARIOS = {
        sample1: {
            title: 'Müşteri Montajında Ters Pin / Yanlış Konnektör Yerleşimi (Otomotiv Müşteri Şikayeti)',
            meta: {
                reportNo: '8D-2026-084',
                customer: 'Ford Otosan / Gölcük Fabrikası',
                partNo: 'WB-2026-F150',
                partName: 'Motor Bölmesi Ana Kablo Demeti',
                station: 'Hat 03 / Final Montaj & Elektriksel Test',
                openDate: '2026-03-02',
                targetCloseDate: '2026-03-16',
                status: 'D6 Doğrulama Aşamasında',
                priority: 'Yüksek (Müşteri Şikayeti)'
            },
            d1: {
                champion: 'Murat Yılmaz (Fabrika Müdürü)',
                leader: 'Deniz Kanar (Proses Kalite Mühendisi)',
                qualityEng: 'Cemre Aydın (Müşteri Kalite Mühendisi)',
                processEng: 'Burak Demir (Üretim & Proses Mühendisi)',
                maintenance: 'Serkan Kurt (Bakım Lideri)',
                operator: 'Hüseyin Kaya (Hat 03 Hat Operatörü)'
            },
            d2: {
                what: 'Kablo demeti 12 pinli gri konnektörde Pin 4 (CAN-High) ile Pin 5 (CAN-Low) kablolarının yer değiştirmiş (ters) takıldığı tespit edildi.',
                where: 'Müşteri araç montaj hattı (Trim & Chassis istasyonu)',
                when: '02.03.2026 - Vardiya 1 (Saat 10:15)',
                who: 'Müşteri son kontrol operatörü',
                why: 'Konnektör kilit yuvası renk kodlaması benzer kablo renkleriyle karışmış, montaj talimatındaki renk şeması yeterince net görülmemiştir.',
                how: 'Araç diyagnostik test cihazında CAN haberleşme hatası vermesi üzerine kablo pin dizilimi kontrol edilmiştir.',
                howMany: '3 araçta hata tespit edildi (0.6% parti hatası / 450 PPM etkisi).'
            },
            d3: {
                customerStock: 'Müşteri deposunda 48 adet incelendi, 2 adet hatalı bulundu ve yerinde ayrıldı.',
                transitStock: 'Yoldaki sevkiyatta (24 adet) nakliye aracı durduruldu, müşteri alanında %100 kontrol edildi, 0 hata.',
                fgStock: 'Fabrika bitmiş ürün ambarındaki 120 adet incelendi, 1 adet hatalı tespit edildi, izole edildi.',
                wipStock: 'Hat başındaki 35 adet yarı mamul %100 kontrol edildi, hata görülmedi.',
                cleanPoint: 'Temiz nokta sevkiyatı İrsaliye No: 2026-98144 (Özel Yeşil Nokta Etiketli ve Kalite Müh. Islak İmzalı).'
            },
            d4: {
                occurrence: 'Oluşum Kök Nedeni: Montaj fikstüründe pin yuvaları serbest elle dizilmektedir. Beyaz ve gri çizgili benzer renkli damarlar operatör dikkat dağınıklığı sırasında çapraz pin yuvalarına takılmıştır (İnsan Faktörü & Görsel Ayrım Yetersizliği).',
                escape: 'Kaçış Kök Nedeni: Mevcut elektriksel test cihazı (E-Test) sadece pinler arası kısa devre ve açık devre kontrolü yapıyordu; CAN-High ve CAN-Low hatları aynı direnç değerine sahip olduğu için pin yer değişimini fonksiyonel olarak ayırt edemiyordu.',
                simulation: 'Canlandırma Testi: E-Test cihazında Pin 4 ve 5 kasıtlı ters takılarak test edildiğinde cihaz "PASS" sinyali verdi. Kaçış kök nedeni laboratuvar ortamında %100 doğrulandı.'
            },
            d5: {
                pcaOccurrence: 'Konnektör dizim masasına kamera destekli optik pin doğrulama sistemi (Poka-Yoke) entegre edilecek. Yanlış renk takıldığında konnektör kilit pimi açılmayacak.',
                pcaEscape: 'Elektriksel test programı güncellendi; CAN bus hattı özel mikrokontrolör protokol sinyali ile ID doğrulama moduna geçirildi (Ters pin durumunda test FAIL verecek).'
            },
            d6: {
                implementationDate: '06.03.2026',
                validationResult: 'Güncellenen E-Test programı ile 1.500 adet kablo demeti 0 hata ile üretildi ve test edildi. Kamera doğrulamalı dizim sistemi Hat 03\'e kuruldu ve devreye alındı. 3 ardışık parti müşteriye hatasız teslim edildi.'
            },
            d7: {
                fmeaUpdated: 'PFMEA revize edildi: Hata türü "Pin Çapraz Dizilimi", Olasılık 6\'dan 2\'ye, Saptama 7\'den 2\'ye düştü (RPN 294\'ten 32\'ye geriledi).',
                controlPlanUpdated: 'Kontrol Planı Rev. 04 ve Kablo Montaj Talimatı (SOP-03-88) güncellendi. Operatörlere tazeleme eğitimi verildi (Kayıt No: TR-2026-11).',
                lessonsLearned: 'Aynı konnektör tipini kullanan Hat 01 ve Hat 05 için de benzer kamera Poka-Yoke ve E-Test yazılım güncellemesi planlandı.'
            },
            d8: {
                closeDate: '12.03.2026',
                managerSign: 'Onaylandı - Selim Tan (Kalite Müdürü)',
                customerApproval: 'Ford Müşteri Kalite Temsilcisi (H. Demir) tarafından kapatma raporu kabul edildi.',
                teamCongrat: 'Ekip üyelerine hızlı kök neden tespiti ve kalıcı Poka-Yoke çözümü için şirket içi Kalite Teşekkür Belgesi takdim edildi.'
            }
        },
        sample2: {
            title: 'Krimp Presinde Düşük Çekme Kuvveti & Eksik İzolasyon Krimp (IPC-A-620 Hat Duruşu)',
            meta: {
                reportNo: '8D-2026-062',
                customer: 'İç Proses / Krimp Atölyesi',
                partNo: 'TM-075-FLRY',
                partName: '0.75 mm² FLRY-B Erkek Terminal Krimp',
                station: 'Hat 02 / Komax Otomatik Kesme & Krimp Presi',
                openDate: '2026-02-18',
                targetCloseDate: '2026-02-28',
                status: 'Kapatıldı',
                priority: 'Kritik (Güvenlik & Fonksiyon)'
            },
            d1: {
                champion: 'Deniz Kanar (Proses Kalite Lideri)',
                leader: 'Ayhan Şen (Krimp Uzmanı)',
                qualityEng: 'Deniz Kanar',
                processEng: 'Caner Öz (Metot Mühendisi)',
                maintenance: 'İsmail Koç (Kalıphane & Pres Bakım)',
                operator: 'Ali Vural (Krimp Pres Operatörü)'
            },
            d2: {
                what: '0.75 mm² kablo terminal krimpinde çekme testi değeri spesifikasyon altı ölçüldü (Şartname: min 90 N, Ölçülen: 54 N). Krimp çapağı ve eksik izolasyon tutuşu görüldü.',
                where: 'Krimp Presi #4 - Aplikatör No: AP-441',
                when: '18.02.2026 Saat 14:00 - Saatlik periyodik numune kontrolü',
                who: 'Hat Kalite Denetçisi',
                why: 'Krimp çekme kuvvetinin düşük olması araçta titreşim kaynaklı temassızlık ve yangın riski oluşturur (Kritik IPC Sınıf 3 Kusuru).',
                how: 'Dijital çekme kuvveti cihazında (Pull-tester) yapılan tahribatlı mekanik test sonucunda tespit edildi.',
                howMany: 'Son 1 saatlik üretim partisi olan 320 adet krimp izole edildi.'
            },
            d3: {
                customerStock: 'Müşteriye sevk edilmedi, sevk stoğunda bu parti bulunmuyor.',
                transitStock: 'Yolda ürün yok.',
                fgStock: 'Depodaki önceki partiden 5 koli çekilerek 50 adet çekme testi yapıldı, hepsi >110 N (Uygun).',
                wipStock: 'Son 1 saatte üretilen 320 adet kordon izole edilerek kırmızı etiketlendi ve hurdaya ayrıldı.',
                cleanPoint: 'Aplikatör ayarı ve bıçak değişimi sonrası üretilen seri parti özel sarı etiketle işaretlendi.'
            },
            d4: {
                occurrence: 'Oluşum Kök Nedeni: Aplikatör krimp bıçağında (conductor punch) mikro kırık ve aşınma meydana gelmiş. Krimp yüksekliği ayar kadranı (micrometer dial) gevşeyerek 0.08 mm yukarı kaymış.',
                escape: 'Kaçış Kök Nedeni: Pres üzerindeki entegre Krimp Kuvveti İzleme (CFM - Crimp Force Monitor) cihazının tolerans bandı operatör tarafından genişletilmiş, sistem alarm üretmemiştir.',
                simulation: 'Canlandırma Testi: Aşınmış bıçak ve gevşek ayarla basılan 10 numunenin 8\'i spesifikasyon altında kaldı. CFM toleransı fabrika standartlarına çekilince anında hata alarmı verdi.'
            },
            d5: {
                pcaOccurrence: 'Kalıphane krimp bıçakları titanyum kaplamalı yüksek dayanımlı alaşım ile değiştirildi. Krimp yüksekliği mikrometresine çift kontra somunlu mekanik kilitleme eklendi.',
                pcaEscape: 'CFM cihazı menüsüne şifre koruması konuldu; tolerans bandı sadece yetkili Kalite Şefi şifresi ile değiştirilebilir hale getirildi.'
            },
            d6: {
                implementationDate: '21.02.2026',
                validationResult: 'Yeni bıçak ve kilitli sistemle 50 numune basıldı. Ortalama çekme kuvveti: 124 N (Min: 112 N, Cpk: 1.84). 5 gün boyunca saatlik kontrollerde 0 sapma.'
            },
            d7: {
                fmeaUpdated: 'PFMEA krimp adımında Saptama 5\'ten 1\'e indirildi. Yeni RPN: 24.',
                controlPlanUpdated: 'Krimp Bıçak Ömrü Takip Kartı (Max 250.000 vuruş) devreye alındı. Günlük vardiya başında mikrometre kalibrasyon doğrulama adımı eklendi.',
                lessonsLearned: 'Tüm krimp preslerindeki (Pres 1-8) CFM cihazlarına aynı şifreli koruma protokolü uygulandı.'
            },
            d8: {
                closeDate: '26.02.2026',
                managerSign: 'Onaylandı - Selim Tan (Kalite Müdürü)',
                customerApproval: 'İç DÖF / 8D olarak başarıyla kapatıldı.',
                teamCongrat: 'Aplikatör bakım ekibine ve kalite denetçisine hassas tespiti için teşekkür edildi.'
            }
        },
        sample3: {
            title: 'Elektriksel Testte Kısa Devre & İzolasyon Hasarı (Gövde Demeti)',
            meta: {
                reportNo: '8D-2026-031',
                customer: 'Otomotiv OEM / Elektrikli Araç Platformu',
                partNo: 'BD-8840-EV',
                partName: 'Ana Gövde & Batarya Yönetim Kablo Tesisatı',
                station: 'Hat 01 / Kablo Bantlama & E-Test Masası',
                openDate: '2026-01-14',
                targetCloseDate: '2026-01-28',
                status: 'Kapatıldı',
                priority: 'Yüksek'
            },
            d1: {
                champion: 'Murat Yılmaz (Fabrika Müdürü)',
                leader: 'Deniz Kanar (Proses Kalite)',
                qualityEng: 'Cemre Aydın',
                processEng: 'Burak Demir',
                maintenance: 'Serkan Kurt',
                operator: 'Fatma Şahin'
            },
            d2: {
                what: 'Otomatik elektriksel test sırasında 12V yardımcı hat ile şasi hattı arasında 400 mA kaçak akım / kısa devre tespit edildi.',
                where: 'Hat 01 Final Test İstasyonu',
                when: '14.01.2026 Saat 11:30',
                who: 'E-Test Operatörü',
                why: 'Metal gövde geçiş klipsi montajı sırasında kablo izolasyonunun ezildiği ve bakır damarın metale temas ettiği görüldü.',
                how: 'Yüksek gerilim / yalıtım direnci testinde (Hipot Testi - 1000V DC) izolasyon direnci < 5 MΩ ölçüldü.',
                howMany: 'İlgili lot içerisindeki 140 üründen 2 adedinde izolasyon hasarı saptandı.'
            },
            d3: {
                customerStock: 'Müşterideki mevcut 60 adet kontrol edildi, hata yok.',
                transitStock: 'Yolda sevkiyat bulunmuyor.',
                fgStock: 'Ambarda bekleyen 90 adet Hipot testine sokuldu, 1 adet izole edildi.',
                wipStock: 'Bantlama istasyonundaki 20 adet yarı mamul kontrol edildi.',
                cleanPoint: 'Yeni koruyucu fitil takılan ürünler yeşil etiketlendi.'
            },
            d4: {
                occurrence: 'Oluşum Kök Nedeni: Metal saç klipsi köşeleri çapaklıydı ve klips takılırken kablo demeti keskin kenara sürtünüyordu.',
                escape: 'Kaçış Kök Nedeni: Standart alçak gerilim iletkenlik testi mikro ezilmeleri algılayamıyordu; hata ancak Hipot yüksek gerilim altında atlama yaparak yakalanabiliyordu.',
                simulation: 'Canlandırma Testi: Çapaklı klipsle montaj yapıldığında 5 numuneden 2\'sinde yalıtım direnci düştü.'
            },
            d5: {
                pcaOccurrence: 'Klips montaj bölgesine kendiliğinden yapışkanlı aşınmaya dayanıklı bez bant (Tesa 51036) sarımı eklendi ve plastik koruma kanalı uygulandı.',
                pcaEscape: 'Hipot yüksek gerilim yalıtım testi %100 standart proses adımı haline getirildi.'
            },
            d6: {
                implementationDate: '18.01.2026',
                validationResult: '2.000 adet kablo demetinde sıfır izolasyon hatası. Hipot testi istatistiksel olarak Cpk > 2.10 sağladı.'
            },
            d7: {
                fmeaUpdated: 'PFMEA yalıtım hasarı riski güncellendi, RPN 310\'dan 28\'e düşürüldü.',
                controlPlanUpdated: 'Gövde demeti kontrol planına Tesa bez bant kontrolü ve Hipot testi parametreleri eklendi.',
                lessonsLearned: 'Tüm metal klips kullanılan kablo geçiş noktalarında plastik kılıf kuralı tasarım rehberine yazıldı.'
            },
            d8: {
                closeDate: '24.01.2026',
                managerSign: 'Onaylandı - Selim Tan (Kalite Müdürü)',
                customerApproval: 'OEM Kalite Mühendisi Raporu onayladı ve kapattı.',
                teamCongrat: 'Proses iyileştirme ekibine başarılı Hipot validasyonu için teşekkür edildi.'
            }
        }
    };

    let currentReport = null;

    function initEightDModule() {
        loadReport();
        bindEvents();
        updateCompletionProgress();
    }

    function getDefaultReport() {
        return JSON.parse(JSON.stringify(SAMPLE_SCENARIOS.sample1));
    }

    function loadReport() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                currentReport = JSON.parse(saved);
            } else {
                currentReport = getDefaultReport();
            }
        } catch (e) {
            console.error('Error loading 8D report:', e);
            currentReport = getDefaultReport();
        }
        renderReport();
    }

    function saveReport() {
        if (!currentReport) return;
        collectFormData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentReport));
        updateCompletionProgress();
        showNotification('8D Raporu başarıyla tarayıcıya (LocalStorage) kaydedildi.');
    }

    function resetReport() {
        if (confirm('8D formunu varsayılan örnek vaka verilerine sıfırlamak istiyor musunuz?')) {
            currentReport = getDefaultReport();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentReport));
            renderReport();
            updateCompletionProgress();
            showNotification('8D formu varsayılan vaka verilerine sıfırlandı.');
        }
    }

    function loadSample(key) {
        if (SAMPLE_SCENARIOS[key]) {
            currentReport = JSON.parse(JSON.stringify(SAMPLE_SCENARIOS[key]));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentReport));
            renderReport();
            updateCompletionProgress();
            showNotification(`"${currentReport.title}" vakası başarıyla yüklendi.`);
        }
    }

    function renderReport() {
        if (!currentReport) return;

        // Meta
        setVal('eightd-report-no', currentReport.meta.reportNo);
        setVal('eightd-customer', currentReport.meta.customer);
        setVal('eightd-part-no', currentReport.meta.partNo);
        setVal('eightd-part-name', currentReport.meta.partName);
        setVal('eightd-station', currentReport.meta.station);
        setVal('eightd-open-date', currentReport.meta.openDate);
        setVal('eightd-target-date', currentReport.meta.targetCloseDate);
        setVal('eightd-status', currentReport.meta.status);
        setVal('eightd-priority', currentReport.meta.priority);

        // Header Title display
        const titleEl = document.getElementById('eightd-display-title');
        if (titleEl) {
            titleEl.textContent = currentReport.title || '8D Problem Çözme Raporu';
        }

        // D1 Team
        setVal('eightd-d1-champion', currentReport.d1.champion);
        setVal('eightd-d1-leader', currentReport.d1.leader);
        setVal('eightd-d1-quality', currentReport.d1.qualityEng);
        setVal('eightd-d1-process', currentReport.d1.processEng);
        setVal('eightd-d1-maint', currentReport.d1.maintenance);
        setVal('eightd-d1-operator', currentReport.d1.operator);

        // D2 Problem (5W2H)
        setVal('eightd-d2-what', currentReport.d2.what);
        setVal('eightd-d2-where', currentReport.d2.where);
        setVal('eightd-d2-when', currentReport.d2.when);
        setVal('eightd-d2-who', currentReport.d2.who);
        setVal('eightd-d2-why', currentReport.d2.why);
        setVal('eightd-d2-how', currentReport.d2.how);
        setVal('eightd-d2-howmany', currentReport.d2.howMany);

        // D3 Containment
        setVal('eightd-d3-customer', currentReport.d3.customerStock);
        setVal('eightd-d3-transit', currentReport.d3.transitStock);
        setVal('eightd-d3-fg', currentReport.d3.fgStock);
        setVal('eightd-d3-wip', currentReport.d3.wipStock);
        setVal('eightd-d3-cleanpoint', currentReport.d3.cleanPoint);

        // D4 Root Cause
        setVal('eightd-d4-occurrence', currentReport.d4.occurrence);
        setVal('eightd-d4-escape', currentReport.d4.escape);
        setVal('eightd-d4-simulation', currentReport.d4.simulation);

        // D5 PCA
        setVal('eightd-d5-pca-occ', currentReport.d5.pcaOccurrence);
        setVal('eightd-d5-pca-esc', currentReport.d5.pcaEscape);

        // D6 Implementation
        setVal('eightd-d6-date', currentReport.d6.implementationDate);
        setVal('eightd-d6-validation', currentReport.d6.validationResult);

        // D7 Prevent Recurrence
        setVal('eightd-d7-fmea', currentReport.d7.fmeaUpdated);
        setVal('eightd-d7-controlplan', currentReport.d7.controlPlanUpdated);
        setVal('eightd-d7-lessons', currentReport.d7.lessonsLearned);

        // D8 Congratulate & Close
        setVal('eightd-d8-date', currentReport.d8.closeDate);
        setVal('eightd-d8-manager', currentReport.d8.managerSign);
        setVal('eightd-d8-customer', currentReport.d8.customerApproval);
        setVal('eightd-d8-congrat', currentReport.d8.teamCongrat);

        updateCompletionProgress();
    }

    function collectFormData() {
        if (!currentReport) currentReport = getDefaultReport();

        currentReport.meta.reportNo = getVal('eightd-report-no');
        currentReport.meta.customer = getVal('eightd-customer');
        currentReport.meta.partNo = getVal('eightd-part-no');
        currentReport.meta.partName = getVal('eightd-part-name');
        currentReport.meta.station = getVal('eightd-station');
        currentReport.meta.openDate = getVal('eightd-open-date');
        currentReport.meta.targetCloseDate = getVal('eightd-target-date');
        currentReport.meta.status = getVal('eightd-status');
        currentReport.meta.priority = getVal('eightd-priority');

        currentReport.d1.champion = getVal('eightd-d1-champion');
        currentReport.d1.leader = getVal('eightd-d1-leader');
        currentReport.d1.qualityEng = getVal('eightd-d1-quality');
        currentReport.d1.processEng = getVal('eightd-d1-process');
        currentReport.d1.maintenance = getVal('eightd-d1-maint');
        currentReport.d1.operator = getVal('eightd-d1-operator');

        currentReport.d2.what = getVal('eightd-d2-what');
        currentReport.d2.where = getVal('eightd-d2-where');
        currentReport.d2.when = getVal('eightd-d2-when');
        currentReport.d2.who = getVal('eightd-d2-who');
        currentReport.d2.why = getVal('eightd-d2-why');
        currentReport.d2.how = getVal('eightd-d2-how');
        currentReport.d2.howMany = getVal('eightd-d2-howmany');

        currentReport.d3.customerStock = getVal('eightd-d3-customer');
        currentReport.d3.transitStock = getVal('eightd-d3-transit');
        currentReport.d3.fgStock = getVal('eightd-d3-fg');
        currentReport.d3.wipStock = getVal('eightd-d3-wip');
        currentReport.d3.cleanPoint = getVal('eightd-d3-cleanpoint');

        currentReport.d4.occurrence = getVal('eightd-d4-occurrence');
        currentReport.d4.escape = getVal('eightd-d4-escape');
        currentReport.d4.simulation = getVal('eightd-d4-simulation');

        currentReport.d5.pcaOccurrence = getVal('eightd-d5-pca-occ');
        currentReport.d5.pcaEscape = getVal('eightd-d5-pca-esc');

        currentReport.d6.implementationDate = getVal('eightd-d6-date');
        currentReport.d6.validationResult = getVal('eightd-d6-validation');

        currentReport.d7.fmeaUpdated = getVal('eightd-d7-fmea');
        currentReport.d7.controlPlanUpdated = getVal('eightd-d7-controlplan');
        currentReport.d7.lessonsLearned = getVal('eightd-d7-lessons');

        currentReport.d8.closeDate = getVal('eightd-d8-date');
        currentReport.d8.managerSign = getVal('eightd-d8-manager');
        currentReport.d8.customerApproval = getVal('eightd-d8-customer');
        currentReport.d8.teamCongrat = getVal('eightd-d8-congrat');
    }

    function updateCompletionProgress() {
        // Evaluate completion of each discipline
        let completedSteps = 0;
        const totalSteps = 8;

        const checkField = (id) => {
            const el = document.getElementById(id);
            return el && el.value.trim().length > 3;
        };

        const d1Done = checkField('eightd-d1-leader') && checkField('eightd-d1-quality');
        const d2Done = checkField('eightd-d2-what') && checkField('eightd-d2-where');
        const d3Done = checkField('eightd-d3-customer') || checkField('eightd-d3-cleanpoint');
        const d4Done = checkField('eightd-d4-occurrence') && checkField('eightd-d4-escape');
        const d5Done = checkField('eightd-d5-pca-occ');
        const d6Done = checkField('eightd-d6-validation');
        const d7Done = checkField('eightd-d7-fmea') || checkField('eightd-d7-controlplan');
        const d8Done = checkField('eightd-d8-manager');

        const stepStatuses = [d1Done, d2Done, d3Done, d4Done, d5Done, d6Done, d7Done, d8Done];
        completedSteps = stepStatuses.filter(Boolean).length;

        const pct = Math.round((completedSteps / totalSteps) * 100);

        const pctEl = document.getElementById('eightd-progress-pct');
        const barEl = document.getElementById('eightd-progress-bar');
        const stepNumEl = document.getElementById('eightd-completed-steps');

        if (pctEl) pctEl.textContent = `%${pct}`;
        if (barEl) barEl.style.width = `${pct}%`;
        if (stepNumEl) stepNumEl.textContent = `${completedSteps} / ${totalSteps}`;

        // Update pills
        for (let i = 1; i <= 8; i++) {
            const pill = document.getElementById(`eightd-pill-d${i}`);
            if (pill) {
                if (stepStatuses[i - 1]) {
                    pill.classList.add('completed');
                    pill.classList.remove('pending');
                } else {
                    pill.classList.remove('completed');
                    pill.classList.add('pending');
                }
            }
        }
    }

    function exportToExcel() {
        collectFormData();
        if (typeof window.ExportHelper === 'undefined') {
            alert('ExportHelper modülü bulunamadı.');
            return;
        }

        const report = currentReport;
        const excelRows = [
            { '8D Disiplini': 'D0: Genel Bilgiler', 'Alt Başlık / Parametre': 'Rapor No', 'Detay / Açıklama': report.meta.reportNo },
            { '8D Disiplini': 'D0: Genel Bilgiler', 'Alt Başlık / Parametre': 'Müşteri / Proje', 'Detay / Açıklama': report.meta.customer },
            { '8D Disiplini': 'D0: Genel Bilgiler', 'Alt Başlık / Parametre': 'Parça No & Tanımı', 'Detay / Açıklama': `${report.meta.partNo} - ${report.meta.partName}` },
            { '8D Disiplini': 'D0: Genel Bilgiler', 'Alt Başlık / Parametre': 'İstasyon / Hat', 'Detay / Açıklama': report.meta.station },
            { '8D Disiplini': 'D0: Genel Bilgiler', 'Alt Başlık / Parametre': 'Açılış / Hedef Tarih', 'Detay / Açıklama': `${report.meta.openDate} / ${report.meta.targetCloseDate}` },
            { '8D Disiplini': 'D0: Genel Bilgiler', 'Alt Başlık / Parametre': 'Statü / Öncelik', 'Detay / Açıklama': `${report.meta.status} / ${report.meta.priority}` },

            { '8D Disiplini': 'D1: Ekip Kurulumu', 'Alt Başlık / Parametre': 'Şampiyon / Sponsor', 'Detay / Açıklama': report.d1.champion },
            { '8D Disiplini': 'D1: Ekip Kurulumu', 'Alt Başlık / Parametre': 'Takım Lideri', 'Detay / Açıklama': report.d1.leader },
            { '8D Disiplini': 'D1: Ekip Kurulumu', 'Alt Başlık / Parametre': 'Kalite Mühendisi', 'Detay / Açıklama': report.d1.qualityEng },
            { '8D Disiplini': 'D1: Ekip Kurulumu', 'Alt Başlık / Parametre': 'Proses Mühendisi', 'Detay / Açıklama': report.d1.processEng },
            { '8D Disiplini': 'D1: Ekip Kurulumu', 'Alt Başlık / Parametre': 'Bakım Sorumlusu', 'Detay / Açıklama': report.d1.maintenance },
            { '8D Disiplini': 'D1: Ekip Kurulumu', 'Alt Başlık / Parametre': 'Operatör Temsilcisi', 'Detay / Açıklama': report.d1.operator },

            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Ne Oldu? (What)', 'Detay / Açıklama': report.d2.what },
            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Nerede Oldu? (Where)', 'Detay / Açıklama': report.d2.where },
            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Ne Zaman? (When)', 'Detay / Açıklama': report.d2.when },
            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Kim Tespit Etti? (Who)', 'Detay / Açıklama': report.d2.who },
            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Neden Problem? (Why)', 'Detay / Açıklama': report.d2.why },
            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Nasıl Tespit Edildi? (How)', 'Detay / Açıklama': report.d2.how },
            { '8D Disiplini': 'D2: Problem Tanımı (5W2H)', 'Alt Başlık / Parametre': 'Kaç Adet / Etki? (How Many)', 'Detay / Açıklama': report.d2.howMany },

            { '8D Disiplini': 'D3: Acil Karantina (ICA)', 'Alt Başlık / Parametre': 'Müşteri Depo / Hat Stoğu', 'Detay / Açıklama': report.d3.customerStock },
            { '8D Disiplini': 'D3: Acil Karantina (ICA)', 'Alt Başlık / Parametre': 'Transit / Yol Stoğu', 'Detay / Açıklama': report.d3.transitStock },
            { '8D Disiplini': 'D3: Acil Karantina (ICA)', 'Alt Başlık / Parametre': 'Fabrika Bitmiş Ürün (FG)', 'Detay / Açıklama': report.d3.fgStock },
            { '8D Disiplini': 'D3: Acil Karantina (ICA)', 'Alt Başlık / Parametre': 'Hat Başı / Yarı Mamul (WIP)', 'Detay / Açıklama': report.d3.wipStock },
            { '8D Disiplini': 'D3: Acil Karantina (ICA)', 'Alt Başlık / Parametre': 'Temiz Nokta / İrsaliye', 'Detay / Açıklama': report.d3.cleanPoint },

            { '8D Disiplini': 'D4: Kök Neden Analizi (RCA)', 'Alt Başlık / Parametre': 'Oluşum Kök Nedeni (Occurrence)', 'Detay / Açıklama': report.d4.occurrence },
            { '8D Disiplini': 'D4: Kök Neden Analizi (RCA)', 'Alt Başlık / Parametre': 'Kaçış Kök Nedeni (Escape)', 'Detay / Açıklama': report.d4.escape },
            { '8D Disiplini': 'D4: Kök Neden Analizi (RCA)', 'Alt Başlık / Parametre': 'Kök Neden Canlandırma Testi', 'Detay / Açıklama': report.d4.simulation },

            { '8D Disiplini': 'D5: Kalıcı Aksiyonlar (PCA)', 'Alt Başlık / Parametre': 'Oluşum Kalıcı Çözümü', 'Detay / Açıklama': report.d5.pcaOccurrence },
            { '8D Disiplini': 'D5: Kalıcı Aksiyonlar (PCA)', 'Alt Başlık / Parametre': 'Kaçış Kalıcı Çözümü (Poka-Yoke)', 'Detay / Açıklama': report.d5.pcaEscape },

            { '8D Disiplini': 'D6: Uygulama & Doğrulama', 'Alt Başlık / Parametre': 'Uygulama Tarihi', 'Detay / Açıklama': report.d6.implementationDate },
            { '8D Disiplini': 'D6: Uygulama & Doğrulama', 'Alt Başlık / Parametre': 'Doğrulama Sonuçları (Cpk / 0 Hata)', 'Detay / Açıklama': report.d6.validationResult },

            { '8D Disiplini': 'D7: Tekrarın Önlenmesi', 'Alt Başlık / Parametre': 'PFMEA Güncellemesi', 'Detay / Açıklama': report.d7.fmeaUpdated },
            { '8D Disiplini': 'D7: Tekrarın Önlenmesi', 'Alt Başlık / Parametre': 'Kontrol Planı & Talimat', 'Detay / Açıklama': report.d7.controlPlanUpdated },
            { '8D Disiplini': 'D7: Tekrarın Önlenmesi', 'Alt Başlık / Parametre': 'Yatay Yaygınlaştırma (Lessons Learned)', 'Detay / Açıklama': report.d7.lessonsLearned },

            { '8D Disiplini': 'D8: Rapor Kapatma', 'Alt Başlık / Parametre': 'Kapatma Tarihi', 'Detay / Açıklama': report.d8.closeDate },
            { '8D Disiplini': 'D8: Rapor Kapatma', 'Alt Başlık / Parametre': 'Kalite Müdürü Onayı', 'Detay / Açıklama': report.d8.managerSign },
            { '8D Disiplini': 'D8: Rapor Kapatma', 'Alt Başlık / Parametre': 'Müşteri Onayı', 'Detay / Açıklama': report.d8.customerApproval },
            { '8D Disiplini': 'D8: Rapor Kapatma', 'Alt Başlık / Parametre': 'Ekip Tebriği', 'Detay / Açıklama': report.d8.teamCongrat }
        ];

        const fileName = `8D_Raporu_${report.meta.reportNo.replace(/[^a-zA-Z0-9]/g, '_')}`;
        window.ExportHelper.toExcel(fileName, '8D Raporu', excelRows, ['8D Disiplini', 'Alt Başlık / Parametre', 'Detay / Açıklama']);
    }

    function exportToPdf() {
        collectFormData();
        if (typeof window.ExportHelper === 'undefined') {
            alert('ExportHelper modülü bulunamadı.');
            return;
        }

        const printableContainer = document.getElementById('eightd-printable-area');
        if (!printableContainer) {
            alert('Yazdırılacak 8D alanı bulunamadı.');
            return;
        }

        const fileName = `8D_Raporu_${currentReport.meta.reportNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        window.ExportHelper.toPdf(printableContainer, fileName, {
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        });
    }

    function sendToDof() {
        collectFormData();
        try {
            const existingDofs = JSON.parse(localStorage.getItem('dof_records') || '[]');
            const newDof = {
                id: `DOF-8D-${Math.floor(1000 + Math.random() * 9000)}`,
                title: `${currentReport.meta.reportNo}: ${currentReport.d2.what.substring(0, 70)}...`,
                source: '8D Raporu / Müşteri Şikayeti',
                dept: currentReport.meta.station,
                assignee: currentReport.d1.leader,
                priority: 'Yüksek',
                openDate: currentReport.meta.openDate,
                dueDate: currentReport.meta.targetCloseDate,
                status: 'Aksiyon Aşamasında',
                rootCause: currentReport.d4.occurrence,
                correctiveAction: currentReport.d5.pcaOccurrence
            };

            existingDofs.unshift(newDof);
            localStorage.setItem('dof_records', JSON.stringify(existingDofs));
            showNotification(`8D Analizi DÖF / CAPA Takip Tablosuna (${newDof.id}) olarak aktarıldı!`);

            // DÖF modülüne geç
            const dofTabBtn = document.querySelector('.qm-tab-btn[data-tab="dof"]');
            if (dofTabBtn) {
                setTimeout(() => dofTabBtn.click(), 800);
            }
        } catch (e) {
            console.error('Error transferring 8D to DOF:', e);
            alert('DÖF kaydı aktarılırken hata oluştu: ' + e.message);
        }
    }

    function sendToFiveWhy() {
        collectFormData();
        try {
            // Ishikawa modülü alanlarını güncelle
            const probInput = document.getElementById('fishbone-problem-input');
            const lineInput = document.getElementById('fishbone-line-input');
            const leaderInput = document.getElementById('fishbone-leader-input');
            const rootInput = document.getElementById('fishbone-root-cause');
            const actionInput = document.getElementById('fishbone-corrective-action');

            if (probInput) probInput.value = `${currentReport.meta.reportNo} - ${currentReport.d2.what.substring(0, 100)}`;
            if (lineInput) lineInput.value = currentReport.meta.station;
            if (leaderInput) leaderInput.value = currentReport.d1.leader;
            if (rootInput) rootInput.value = currentReport.d4.occurrence;
            if (actionInput) actionInput.value = currentReport.d5.pcaOccurrence;

            showNotification('8D Problem ve Kök Neden verileri 5 Neden & Balık Kılçığı modülüne aktarıldı!');

            // Ishikawa sekmesine geç
            const ishikawaTabBtn = document.querySelector('.qm-tab-btn[data-tab="ishikawa"]');
            if (ishikawaTabBtn) {
                setTimeout(() => ishikawaTabBtn.click(), 800);
            }
        } catch (e) {
            console.error('Error transferring to Ishikawa:', e);
        }
    }

    function bindEvents() {
        // Presets
        const btnSample1 = document.getElementById('btn-eightd-sample-1');
        const btnSample2 = document.getElementById('btn-eightd-sample-2');
        const btnSample3 = document.getElementById('btn-eightd-sample-3');

        if (btnSample1) btnSample1.addEventListener('click', () => loadSample('sample1'));
        if (btnSample2) btnSample2.addEventListener('click', () => loadSample('sample2'));
        if (btnSample3) btnSample3.addEventListener('click', () => loadSample('sample3'));

        // Save & Reset
        const btnSave = document.getElementById('btn-eightd-save');
        const btnReset = document.getElementById('btn-eightd-reset');
        if (btnSave) btnSave.addEventListener('click', saveReport);
        if (btnReset) btnReset.addEventListener('click', resetReport);

        // Exports
        const btnExcel = document.getElementById('btn-eightd-export-excel');
        const btnPdf = document.getElementById('btn-eightd-export-pdf');
        if (btnExcel) btnExcel.addEventListener('click', exportToExcel);
        if (btnPdf) btnPdf.addEventListener('click', exportToPdf);

        // Inter-module bridges
        const btnToDof = document.getElementById('btn-eightd-to-dof');
        const btnToWhy = document.getElementById('btn-eightd-to-why');
        if (btnToDof) btnToDof.addEventListener('click', sendToDof);
        if (btnToWhy) btnToWhy.addEventListener('click', sendToFiveWhy);

        // Input change listener to update progress bar dynamically
        const printableArea = document.getElementById('eightd-printable-area');
        if (printableArea) {
            printableArea.addEventListener('input', () => {
                updateCompletionProgress();
            });
        }

        // Stepper pills click to scroll to discipline section
        document.querySelectorAll('.eightd-step-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                const step = pill.getAttribute('data-step');
                const targetSec = document.getElementById(`eightd-section-${step}`);
                if (targetSec) {
                    targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // Helper functions
    function setVal(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    }

    function getVal(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function showNotification(msg) {
        const existing = document.getElementById('eightd-toast-notice');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'eightd-toast-notice';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.background = '#0f172a';
        toast.style.color = '#ffffff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        toast.style.zIndex = '99999';
        toast.style.fontSize = '0.9rem';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';
        toast.style.border = '1px solid #38bdf8';
        toast.style.animation = 'fadeIn 0.3s ease';

        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> <span>${msg}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Export module to global scope
    window.EightDModule = {
        init: initEightDModule,
        render: renderReport,
        save: saveReport,
        exportToExcel: exportToExcel,
        exportToPdf: exportToPdf
    };

    // Auto-init on DOMContentLoaded if active
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEightDModule);
    } else {
        initEightDModule();
    }
})();
