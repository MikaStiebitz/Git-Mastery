const levels = {
    // Level Page
    "level.gitTerminal": "Git Terminal",
    "level.currentChallenge": "Güncel Görev",
    "level.objectives": "Hedefler:",
    "level.showHints": "İpuçlarını Göster",
    "level.hideHints": "İpuçlarını Gizle",
    "level.nextLevel": "Sonraki Seviye",
    "level.filesToEdit": "Düzenlenecek Dosyalar:",
    "level.workingTreeClean": "Çalışma dizini temiz",
    "level.staged": "staged",
    "level.modified": "değiştirilmiş",
    "level.untracked": "izlenmeyen",
    "level.deleted": "silindi",
    "level.gitNotInitialized": "Git henüz başlatılmadı",
    "level.branch": "Branch",
    "level.gitStatus": "Git Durumu",
    "level.advancedOptions": "Gelişmiş Seçenekler",
    "level.hideAdvancedOptions": "Gelişmiş Seçenekleri Gizle",
    "level.resetLevel": "Seviyeyi Sıfırla",
    "level.resetAllProgress": "Tüm İlerlemeyi Sıfırla",
    "level.resetConfirm": "Tüm ilerlemeni sıfırlamak istediğine emin misin?",
    "level.resetOptions": "Sıfırlama Seçenekleri",
    "level.resetDescription": "Neyi sıfırlamak istediğini seç:",
    "level.resetAllConfirm": "TÜM ilerlemeni sıfırlamak istediğine emin misin? Bu işlem geri alınamaz!",
    "level.level": "Seviye",
    "level.levelCompleted": "Seviye tamamlandı!",
    "level.realWorldContext": "Gerçek Hayattan Bağlam",
    "level.task": "Görevin",
    "level.startCoding": "Kodlamaya Başla",
    "level.storyButton": "Hikâyeyi Göster",
    "level.advancedModeOn": "Gelişmiş Mod (Açık)",
    "level.advancedModeOff": "Gelişmiş Mod (Kapalı)",
    "level.notFound": "Seviye bulunamadı",
    "level.techModeOn": "Komutlara Odaklan (Teknik Mod)",
    "level.storyModeOn": "Hikâye Bağlamını Göster (Hikâye Modu)",
    "level.techModeDescription":
        "Teknik mod; hikâye ve bağlam olmadan doğrudan Git komutlarına odaklanır, böylece daha hızlı ve yalın bir deneyim sunar.",
    "level.storyModeDescription":
        "Hikâye modu, Git komutlarının neden ve nasıl kullanıldığını anlamana yardımcı olacak gerçek hayattan bağlam ve açıklamalar sunar.",
    "level.editFile": "Dosyayı düzenle",
    "level.deleteFile": "Dosyayı sil",
    "level.confirmDelete": "{file} dosyasını silmek istediğine emin misin?",
    "level.hints": "İpuçları",
    "level.tab.challenge": "Görev",
    "level.tab.graph": "Git Grafiği",

    // Level Visualizer (interactive commit graph)
    "visualizer.emptyTitle": "Git hikâyen burada başlıyor",
    "visualizer.emptyInitHint": "`git init` ile bir repository başlat; commit grafiğin tam burada büyümeye başlasın.",
    "visualizer.emptyCommitHint": "İlk commit'ini oluştur ve görsel yolunun burada belirişini izle.",
    "visualizer.branchFilterHint": "Bu branch'in geçmişini vurgulamak için tıkla",
    "visualizer.zoomIn": "Yakınlaştır",
    "visualizer.zoomOut": "Uzaklaştır",
    "visualizer.fit": "Ekrana sığdır",
    "visualizer.mergeCommit": "Merge",
    "visualizer.close": "Kapat",
    "visualizer.interactHint": "Ayrıntılar için bir commit'e dokun · yolunu vurgulamak için bir branch'e dokun",

    // Level Content - Intro Stage
    "intro.name": "Git'e Giriş",
    "intro.description": "Git'in temellerini öğren",

    "intro.level1.name": "Git'i Başlat",
    "intro.level1.description": "Yeni bir Git repository'si oluştur",
    "intro.level1.objective1": "Yeni bir repository başlat",
    "intro.level1.hint1": "`git init` komutunu kullan",
    "intro.level1.hint2":
        "Bu komut gizli bir .git klasörü oluşturur — o klasör repository'nin *kendisidir*; Git her sürümü orada saklar",
    "intro.level1.requirement1.description": "Bir Git repository'si başlat",
    "intro.level1.requirement1.success": "Aferin! Bir Git repository'si oluşturdun.",
    "intro.level1.story.title": "Takıma Hoş Geldin",
    "intro.level1.story.narrative":
        "TechStart'taki yeni geliştirici işine hoş geldin! Ben Alex, takım liderin.\n\nTek bir komut yazmadan önce: Git nedir ve neden her takım onda ısrar ediyor?\n\nDüşün ki bugün ikimiz de aynı dosyayı düzenliyoruz. Sen bana `login-final.js` gönderiyorsun, ben sana `login-final-v2.js` geri gönderiyorum ve cuma günü hangi sürümün çalıştığını kimse bilmiyor — ya da dosyanın, hâlâ çalıştığı pazartesi günü nasıl göründüğünü.\n\nGit bir sürüm kontrol sistemidir ve tam olarak bunu çözer. Projenin eksiksiz geçmişini tutar: her değişikliği, o değişikliği kimin yaptığını ve daha önceki herhangi bir duruma geri dönmenin bir yolunu. Ayrıca birden fazla kişinin birbirinin işini ezmeden aynı kod üzerinde çalışmasına imkân verir.\n\nGit bu geçmişi bir repository'de saklar: alışıldık proje klasörün ve her sürümün saklandığı gizli bir `.git` klasörü. Bir tane oluşturmak tek bir komuta bakar: `git init`.",
    "intro.level1.story.realWorldContext":
        'Git, sürüm kontrolünün standardıdır: neredeyse her yazılım takımı onu kullanır ve yeni bir projede kurulan ilk araç odur. Git olmadan "bunu kim, ne zaman ve neden değiştirdi?" sorusunun yanıtı yoktur.',
    "intro.level1.story.taskIntroduction": "Hadi projen için yeni bir repository oluşturalım.",

    "intro.level2.name": "Repository Durumu",
    "intro.level2.description": "Repository'nin durumunu kontrol et",
    "intro.level2.objective1": "Repository'nin durumunu görüntüle",
    "intro.level2.hint1": "`git status` komutunu kullan",
    "intro.level2.hint2": "Bu komut repository'nin güncel durumunu gösterir",
    "intro.level2.requirement1.description": "Repository durumunu göster",
    "intro.level2.requirement1.success": "Mükemmel! Artık repository'nin durumunu görebiliyorsun.",
    "intro.level2.story.title": "Repo'nda Neler Oluyor?",
    "intro.level2.story.narrative":
        "Harika! İlk Git repository'ni oluşturdun. Gizli .git dizini artık Git'in ihtiyaç duyduğu tüm bilgileri içeriyor.\n\nAlex yanına uğruyor: \"Çok iyi! Sırada repository'nde neler olup bittiğine bakmak var. `git status` ile mevcut durumu istediğin an kontrol edebilirsin.\"",
    "intro.level2.story.realWorldContext":
        "Geliştiriciler, hangi dosyaların değiştiğini ve hangilerinin bir sonraki commit'e hazır olduğunu görmek için `git status` komutunu günde defalarca çalıştırır.",
    "intro.level2.story.taskIntroduction": "Repository'nin durumunu `git status` ile kontrol et.",

    "intro.level3.name": "Repository Clone'lama",
    "intro.level3.description": "Mevcut repository'leri clone'lamayı öğren",
    "intro.level3.objective1": "Bir remote repository'yi clone'la",
    "intro.level3.objective2": "Clone'ladığın repository'nin içine gir",
    "intro.level3.hint1":
        "`git clone` komutunu gerçek bir adresle çalıştır, örneğin `git clone https://github.com/octocat/Hello-World.git`",
    "intro.level3.hint2": "Clone'ladıktan sonra repository klasörüne girmek için `cd` kullan",
    "intro.level3.hint3":
        "https://github.com/user/repo.git gibi gerçek bir adres olmalı — açılı parantez içindeki bir yer tutucu kabul edilmez",
    "intro.level3.requirement1.description": "Bir remote repository'yi clone'la",
    "intro.level3.requirement1.success": "Harika! Repository'yi clone'ladın.",
    "intro.level3.requirement2.description": "cd kullanarak clone'ladığın repository'nin içine gir",
    "intro.level3.requirement2.success": "Mükemmel! Artık clone'ladığın repository'nin içindesin.",
    "intro.level3.story.title": "Mevcut Bir Projeye Katılmak",
    "intro.level3.story.narrative":
        'TechStart\'taki ilk haftan harika geçiyor! Alex seni heyecan verici bir haberle yanına çağırıyor.\n\n"Yardımına ihtiyaç duyan bir takım projemiz var," diyor. "Kod tabanı hâlihazırda Git sunucumuzda. Üzerinde çalışmaya başlamak için onu kendi makinene clone\'laman gerekecek."\n\nAçıklıyor: "Mevcut bir projeye katıldığında sıfırdan başlamazsın. Bunun yerine remote repository\'yi clone\'larsın; bu da makinende kodun, geçmişin ve branch\'lerin tamamını içeren eksiksiz bir kopya oluşturur."\n\n"Bunu kütüphaneden kitap ödünç almak gibi düşün; üstelik kütüphanenin tüm kayıtlarını da alıyorsun! `git clone` komutunu repository adresiyle birlikte çalıştır — örneğin `git clone https://github.com/octocat/Hello-World.git`."\n\n"Bu yönergelerle ilgili bir not: açılı parantez içinde yazılan her şey bir yer tutucudur. Parantezleriyle birlikte onu değiştir — Git `<repository-url>` ifadesinin ne anlama geldiğini bilemez."\n\n"Clone\'ladıktan sonra `cd <folder-name>` ile proje klasörüne girip hemen çalışmaya başlayabilirsin. Projenin tüm geçmişi ve değişiklikleri emrinde."',
    "intro.level3.story.realWorldContext":
        "Geliştiriciler mevcut projelere clone'layarak katılır. İster açık kaynağa katkı ver, ister yeni bir takıma katıl; genellikle çalıştıracağın ilk komut git clone olur.",
    "intro.level3.story.taskIntroduction": "Bir repository'yi clone'la ve projede çalışmaya başlamak için içine gir.",

    // Level Content - Files Stage
    "files.name": "Dosya İşlemleri",
    "files.description": "Git ile dosyaları nasıl yöneteceğini öğren",

    "files.level1.name": "Değişiklikleri Staging'e Alma",
    "files.level1.description": "Dosyaları staging alanına ekle",
    "files.level1.objective1": "Tüm dosyaları staging alanına ekle",
    "files.level1.hint1": "`git add .` komutunu kullan",
    "files.level1.hint2": "Nokta, 'mevcut dizindeki tüm dosyalar' anlamına gelir",
    "files.level1.requirement1.description": "Tüm dosyaları staging alanına ekle",
    "files.level1.requirement1.success": "Harika! Tüm dosyaları staging alanına ekledin.",
    "files.level1.story.title": "Kod Değişikliklerini Hazırlamak",
    "files.level1.story.narrative":
        '"Hey!" diye sesleniyor iş arkadaşın Sarah. "Git\'in işini gerçekte nasıl kaydettiğini öğrenme vakti — çünkü bir dosyayı düzenlemek yeterli değil."\n\nBeyaz tahtaya üç kutu çiziyor:\n\n1. **Kendi klasörün** — dosyaları burada düzenlersin. Git izler, ama kendi başına hiçbir şey kaydetmez.\n2. **Staging alanı** — bir sonraki kaydına girmesini istediğin değişikliklerin listesi.\n3. **Repository** — kayıtların kalıcı geçmişi.\n\n"Bir commit yalnızca staging alanında olanı kaydeder," diyor. "Bir şeyi değiştirdikten sonra doğrudan commit atayamamanın sebebi tam olarak bu: Git, yaptığın her değişikliğin birbirine ait olduğunu varsaymaz. Buna sen karar verirsin. `git add <file>` tek bir değişikliği staging\'e alır, `git add .` ise geçerli klasördeki her şeyi alır."',
    "files.level1.story.realWorldContext":
        "Staging, yeni başlayanların atladığı, deneyimli geliştiricilerin ise bilinçle kullandığı adımdır. Birbirinden bağımsız iki şeyi mi düzelttin? Onları ayrı ayrı staging'e al ve ayrı ayrı commit'le; böylece geçmiş okunabilir kalır ve her değişiklik sonradan tek başına geri alınabilir.",
    "files.level1.story.taskIntroduction": "`git add .` ile tüm dosyaları staging alanına ekle.",

    "files.level2.name": "Değişiklikleri Commit'leme",
    "files.level2.description": "Değişikliklerinle bir commit oluştur",
    "files.level2.objective1": "Mesajlı bir commit oluştur",
    "files.level2.hint1": "`git commit -m 'Your message'` komutunu kullan",
    "files.level2.hint2": "Mesaj, yaptığın değişiklikleri anlatmalı",
    "files.level2.requirement1.description": "Mesajlı bir commit oluştur",
    "files.level2.requirement1.success": "Harika! Başarıyla bir commit oluşturdun.",
    "files.level2.story.title": "İlk Commit'in",
    "files.level2.story.narrative":
        '"Çok iyi!" diyor Alex, ilerlemeni görünce. "Değişikliklerin staging\'de. Şimdi onları kalıcı hale getir."\n\nAçıklıyor: "`git commit`, staging alanındaki her şeyi alır ve adın, zaman ve bir mesajla birlikte tek bir anlık görüntü olarak geçmişe yazar. Sonrasında staging alanı yeniden boşalır, bir sonraki grup için hazırdır."\n\n"Bilmeye değer iki şey var. Staging\'de hiçbir şey yokken atılan bir commit hiçbir şey yapmaz — Git sana commit\'lenecek bir şey olmadığını söyler ve bu neredeyse her zaman eksik bir `git add` anlamına gelir. Mesaj da bürokrasi değildir: `-m "..."`, bir sonraki kişinin — genellikle üç ay sonraki senin — bu değişikliğin neden var olduğunu öğrenme yoludur."',
    "files.level2.story.realWorldContext":
        "İyi commit mesajları geliştirme takımlarında son derece önemlidir. Herkesin, yalnızca neyin değiştiğini değil, değişikliğin neden yapıldığını da anlamasını sağlar.",
    "files.level2.story.taskIntroduction": "Anlamlı bir mesajla ilk commit'ini oluştur.",

    "files.level3.name": "Dosya Silme",
    "files.level3.description": "Git'ten dosya silmeyi öğren",
    "files.level3.objective1": "Bir dosyayı hem çalışma dizininden hem de index'ten sil",
    "files.level3.hint1": "`git rm <file>` komutunu kullan",
    "files.level3.hint2": "Bu komut dosyayı Git'ten kaldırır ve çalışma dizininden de siler",
    "files.level3.requirement1.description": "Git kullanarak bir dosya sil",
    "files.level3.requirement1.success": "Aferin! Dosyayı hem Git'ten hem de çalışma dizininden sildin.",
    "files.level3.story.title": "Temizlik Zamanı",
    "files.level3.story.narrative":
        '"Bakıyorum güzel ilerliyorsun," diyor Alex, çalışmanı incelerken. "Ama artık ihtiyacımız olmayan birtakım geçici dosyalar ve taslaklar gözüme çarptı. Repository\'yi temizlememiz lazım."\n\nAçıklıyor: "Git tarafından izlenen dosyaları silmek istediğinde, onları elle silmek yerine `git rm` kullanmalısın. Böylece Git silme işlemini düzgün şekilde takip eder."',
    "files.level3.story.realWorldContext":
        "Gereksiz dosyaları silerek repository'yi temiz tutmak iyi bir alışkanlıktır. `git rm` komutu, Git'in dosya silme işlemini takip etmesini sağlar.",
    "files.level3.story.taskIntroduction": "`git rm` kullanarak gereksiz dosyayı repository'den sil.",

    // Level Content - Branches Stage
    "branches.name": "Branch'lerle Çalışmak",
    "branches.description": "Branch'lerle (dallarla) nasıl çalışılacağını öğren",

    "branches.level1.name": "Branch'leri Görüntüle",
    "branches.level1.description": "Repository'ndeki tüm branch'leri görüntüle",
    "branches.level1.objective1": "Mevcut tüm branch'leri görüntüle",
    "branches.level1.hint1": "`git branch` komutunu kullan",
    "branches.level1.hint2": "Bu komut tüm yerel branch'leri gösterir",
    "branches.level1.requirement1.description": "Tüm branch'leri göster",
    "branches.level1.requirement1.success": "Çok iyi! Artık repository'ndeki tüm branch'leri görebiliyorsun.",
    "branches.level1.story.title": "Kod Dalları",
    "branches.level1.story.narrative":
        '"Sıra biraz daha ileri bir konuda," diyor Alex ve beyaz tahtaya dalları olan bir ağaç çiziyor. "Bu dallar tıpkı Git branch\'leri gibi. Kodunun farklı sürümleri üzerinde aynı anda çalışmanı sağlıyorlar."\n\nDevam ediyor: "Şu anda \'main\' branch\'i üzerinde çalışıyorsun. Önce hangi branch\'lerimiz olduğuna bakalım."',
    "branches.level1.story.realWorldContext":
        "Branch'ler Git'in temel kavramlarından biridir. Paralel geliştirmeye, özelliklerin birbirinden yalıtılmasına ve ana kodu etkilemeden deneysel çalışmalar yapmaya imkân verir.",
    "branches.level1.story.taskIntroduction": "git branch ile mevcut tüm branch'leri görüntüle.",

    "branches.level2.name": "Branch Oluştur ve Ona Geç",
    "branches.level2.description": "Yeni bir branch oluştur ve ona geç",
    "branches.level2.objective1": "'feature' adında yeni bir branch oluştur ve ona geç",
    "branches.level2.hint1": "`git switch -c feature` komutunu kullan",
    "branches.level2.hint2": "-c bayrağı tek adımda yeni bir branch oluşturur ve ona geçer",
    "branches.level2.requirement1.description": "git switch -c kullanarak yeni bir branch oluştur ve ona geç",
    "branches.level2.requirement1.success":
        "Harika! Modern git switch komutunu kullanarak yeni bir branch oluşturdun ve ona geçtin.",
    "branches.level2.story.title": "Modern Branch Oluşturma",
    "branches.level2.story.narrative":
        '"Mükemmel! Şimdi yeni bir özellik geliştirmek istiyoruz," diyor Alex. "Bunun için \'feature\' adında yeni bir branch oluşturacağız ki değişikliklerimiz ana kodu etkilemesin."\n\nSana modern yaklaşımı gösteriyor: "Git, branch işlemlerini daha anlaşılır kılmak için `git switch` komutunu getirdi. Yeni branch\'i tek adımda oluşturup ona geçmek için `git switch -c feature` kullan. Bu, eski `git checkout -b` yerine tercih edilen modern yoldur."',
    "branches.level2.story.realWorldContext":
        "Profesyonel geliştirme takımlarında neredeyse hiçbir zaman doğrudan ana branch üzerinde çalışılmaz. Git 2.23 ile gelen `git switch` komutu, eski checkout komutuna kıyasla branch'lerle çalışmanın daha temiz ve anlaşılır bir yolunu sunar.",
    "branches.level2.story.taskIntroduction":
        "`git switch -c` kullanarak 'feature' adında yeni bir branch oluştur ve ona geç.",

    "branches.level3.name": "Branch'ler Arasında Geçiş",
    "branches.level3.description": "Mevcut branch'ler arasında geçiş yap",
    "branches.level3.objective1": "Branch'ler arasında geçiş yap",
    "branches.level3.hint1": "`git switch <branch>` komutunu kullan",
    "branches.level3.hint2": "Bu komut mevcut bir branch'e geçiş yapar",
    "branches.level3.requirement1.description": "git switch kullanarak başka bir branch'e geç",
    "branches.level3.requirement1.success": "Çok iyi! git switch kullanarak branch'ler arasında geçiş yaptın.",
    "branches.level3.story.title": "Branch'ler Arasında Gezinmek",
    "branches.level3.story.narrative":
        '"Artık branch oluşturmayı bildiğine göre, aralarında gezinmeyi de deneyelim," diyor Sarah. "Gerçek geliştirme işinde bunu sürekli yapacaksın."\n\nAçıklıyor: "Mevcut herhangi bir branch\'e `git switch <branch-name>` ile geçebilirsin. Bu, birbirinden çok farklı işler yaptığı için kafa karıştırabilen eski `git checkout` komutundan çok daha nettir."',
    "branches.level3.story.realWorldContext":
        "Branch'ler arasında geçiş yapmak en sık kullanılan Git işlemlerinden biridir. Yalnızca bu iş için tasarlanmış `git switch` komutu niyeti netleştirir ve çok amaçlı checkout komutuna kıyasla kafa karışıklığını azaltır.",
    "branches.level3.story.taskIntroduction": "`git switch` kullanarak başka bir branch'e geçmeyi dene.",

    "branches.level4.name": "Checkout ile Branch Değiştirme",
    "branches.level4.description": "Branch değiştirmenin klasik komutunu öğren",
    "branches.level4.objective1": "Klasik komutla başka bir branch'e geç",
    "branches.level4.hint1": "`git checkout <branch-name>` komutunu kullan",
    "branches.level4.hint2": "checkout, branch değiştirmek için kullanılan eski komuttur",
    "branches.level4.requirement1.description": "git checkout kullanarak başka bir branch'e geç",
    "branches.level4.requirement1.success": "Harika! Artık branch değiştirmenin iki yolunu da biliyorsun.",
    "branches.level4.story.title": "Klasik Yaklaşım",
    "branches.level4.story.narrative":
        '"git checkout\'u bilmek de önemli," diye açıklıyor Alex. "git switch modern yol olsa da, eski projelerde, eğitimlerde ve dokümantasyonda checkout\'u sürekli göreceksin."\n\nEkliyor: "checkout pek çok iş yapabilir - branch değiştirmek, dosya geri yüklemek ve dahası. Git\'in switch ve restore komutlarını getirmesinin sebebi de bu: niyeti netleştirmek."',
    "branches.level4.story.realWorldContext":
        "git checkout, yıllarca branch işlemlerinin BAŞ komutuydu. Pek çok geliştirici ve araç hâlâ onu kullanıyor. İkisini birden bilmek, farklı proje ve takımlarda seni çok daha esnek kılar.",
    "branches.level4.story.taskIntroduction": "Klasik git checkout komutunu kullanarak başka bir branch'e geç.",

    "branches.level5.name": "Switch ile Branch Oluşturma",
    "branches.level5.description": "Tek adımda yeni bir branch oluştur ve ona geç",
    "branches.level5.objective1": "Yeni bir branch oluştur",
    "branches.level5.hint1": "`git switch -c <new-branch-name>` komutunu kullan",
    "branches.level5.hint2": "-c bayrağı, switch komutuna yeni bir branch oluşturmasını söyler",
    "branches.level5.requirement1.description": "git switch -c kullanarak yeni bir branch oluştur ve ona geç",
    "branches.level5.requirement1.success": "Mükemmel! Artık branch oluşturmanın iki yöntemine de hâkimsin.",
    "branches.level5.story.title": "Hızlı Branch Oluşturma",
    "branches.level5.story.narrative":
        "\"İşine yarayacak bir püf noktası daha,\" diyor Sarah. \"Yeni bir branch oluşturup aynı anda ona geçmek için 'git switch -c' kullanabilirsin.\"\n\nAçıklıyor: \"Bu, Git'teki modern yoldur. -c bayrağı 'create' anlamına gelir ve eski 'git checkout -b' ile tam olarak aynı işi yapar; ama daha net ve daha anlaşılırdır.\"",
    "branches.level5.story.realWorldContext":
        "switch -c kalıbı, branch oluşturup ona geçmenin modern ve önerilen yöntemidir. Git 2.23 ile, branch işlemlerini checkout'un diğer işlevlerinden ayırmak ve onları daha anlaşılır kılmak için getirildi.",
    "branches.level5.story.taskIntroduction":
        "git switch -c kullanarak yeni bir branch oluştur ve otomatik olarak ona geç.",

    // Level Content - Merge Stage
    "merge.name": "Branch'leri Merge Etmek",
    "merge.description": "Branch'leri nasıl merge edeceğini öğren",

    "merge.level1.name": "Feature Branch'ini Merge Etme",
    "merge.level1.description": "Bir feature branch'ini geliştirme branch'ine merge et",
    "merge.level1.objective1": "'feature/user-auth' branch'ini 'develop' branch'ine merge et",
    "merge.level1.hint1": "Zaten develop branch'indesin",
    "merge.level1.hint2": "Feature branch'ini entegre etmek için `git merge feature/user-auth` kullan",
    "merge.level1.requirement1.description": "Feature branch'ini merge et",
    "merge.level1.requirement1.success": "Harika! Özellik develop'a entegre edildi.",
    "merge.level1.story.title": "Kod İncelemesi ve Entegrasyon",
    "merge.level1.story.narrative":
        '"Özelliğin hazır!", diyor takım lideri Sarah. "Ama main\'e push\'lamadan önce onu develop branch\'ine merge edip test etmemiz gerek."\n\nAçıklıyor: "Profesyonel takımlarda asla doğrudan main\'e merge etmeyiz. Önce test için feature → develop, sonra üretim için develop → main."',
    "merge.level1.story.realWorldContext":
        "🔍 İyi Uygulama: Pull Request'ler\n\nGerçek projelerde şimdi GitHub/GitLab üzerinde bir Pull Request (PR) ya da Merge Request (MR) açardın:\n\n1️⃣ Feature branch'ini push'larsın\n\n2️⃣ Bir PR açarsın: feature/user-auth → develop\n\n3️⃣ Takım arkadaşların kodunu inceler\n\n4️⃣ Onaydan sonra PR merge edilir\n\nBöylece merge öncesinde kod incelemesi, tartışma ve otomatik testler mümkün olur! 🚀",
    "merge.level1.story.taskIntroduction":
        "'feature/user-auth' branch'ini 'develop' branch'ine merge et (zaten develop'tasın).",

    "merge.level2.name": "Üretime Dağıtım",
    "merge.level2.description": "Test edilmiş kodu ana branch'e merge et",
    "merge.level2.objective1": "'develop' branch'ini 'main' branch'ine merge et",
    "merge.level2.hint1": "Zaten main branch'indesin",
    "merge.level2.hint2": "Test edilmiş kodu entegre etmek için `git merge develop` kullan",
    "merge.level2.requirement1.description": "develop'ı main'e merge et",
    "merge.level2.requirement1.success": "Mükemmel! Kod artık üretimde.",
    "merge.level2.story.title": "Üretim Sürümü",
    "merge.level2.story.narrative":
        '"Şahane! Özellik develop üzerinde kusursuz çalışıyor ve tüm testler yeşil," diyor Sarah. "Artık main\'e merge edip dağıtabiliriz."\n\nVurguluyor: "main bizim üretim branch\'imiz. Buraya yalnızca test edilmiş, kararlı kod girer. Önce develop üzerinde test etmemizin sebebi de bu!"',
    "merge.level2.story.realWorldContext":
        "Git Flow İş Akışı 🌊\n\n📦 main: Üretime hazır kod\n\n🔧 develop: Entegrasyon ve test\n\n✨ feature/*: Yeni özellikler\n\nBu iş akışı, test edilmemiş kodun üretime ulaşmasını engeller. Pek çok takım ayrıca release branch'leri de kullanır!",
    "merge.level2.story.taskIntroduction": "'develop' branch'ini 'main' branch'ine merge et.",

    "merge.level3.name": "Merge Çakışmalarıyla Başa Çıkma",
    "merge.level3.description": "Çakışmalı merge'leri nasıl çözeceğini ya da iptal edeceğini öğren",
    "merge.level3.objective1": "Çakışmalı bir merge'ü iptal et",
    "merge.level3.hint1": "`git merge --abort` komutunu kullan",
    "merge.level3.hint2": "Bu komut merge işlemini durdurur ve merge başlamadan önceki duruma geri döner",
    "merge.level3.requirement1.description": "Çakışmalı bir merge'ü iptal et",
    "merge.level3.requirement1.success": "Çok iyi! Merge işlemini başarıyla iptal ettin.",
    "merge.level3.story.title": "Merge Ters Gittiğinde",
    "merge.level3.story.narrative":
        '"Bazen merge\'ler planlandığı gibi gitmez," diye uyarıyor Sarah. "Bir dosyanın aynı bölümü iki branch\'te farklı şekilde değiştirildiğinde merge çakışması ortaya çıkar."\n\nAçıklıyor: "İki seçeneğin var: Ya çakışmayı elle çözersin ya da `git merge --abort` ile merge\'ü iptal edip daha iyi hazırlanırsın."',
    "merge.level3.story.realWorldContext":
        "Merge çakışmaları, birlikte geliştirmenin sıradan bir parçasıdır. İster çözerek ister geçici olarak iptal ederek olsun, onlarla başa çıkmayı bilmek temel bir beceridir.",
    "merge.level3.story.taskIntroduction": "git merge --abort kullanarak bir merge işlemini iptal etmeyi dene.",

    // Stash Stage
    "stash.name": "Git Stash",
    "stash.description": "Değişikliklerini geçici olarak kaydetmeyi öğren",

    "stash.level1.name": "Çalışmanı Stash'le",
    "stash.level1.description": "Değişiklikleri geçici olarak kaydetmeyi ve branch'ler arasında geçmeyi öğren",
    "stash.level1.objective1": "Üzerinde çalıştığın yarım değişiklikleri kaydet",
    "stash.level1.objective2": "Acil sorunu çözmek için hotfix branch'ine geç",
    "stash.level1.objective3": "Çalışmana devam etmek için feature branch'ine dön",
    "stash.level1.objective4": "Stash'lediğin değişiklikleri geri yükle",
    "stash.level1.hint1": "Değişikliklerini geçici olarak kaydetmek için 'git stash' kullan",
    "stash.level1.hint2":
        "Branch değiştirmek için 'git switch <branch-name>' ya da 'git checkout <branch-name>' kullan",
    "stash.level1.hint3": "Değişikliklerini geri getirmek için 'git stash pop' kullan",
    "stash.level1.hint4": "Stash listesini 'git stash list' ile kontrol et",
    "stash.level1.requirement1.description": "Üzerinde çalıştığın yarım değişiklikleri stash'le",
    "stash.level1.requirement1.success": "✅ Harika! Değişikliklerin güvenle stash'lendi!",
    "stash.level1.requirement2.description": "hotfix branch'ine geç",
    "stash.level1.requirement2.success": "✅ Mükemmel! Artık hotfix branch'indesin.",
    "stash.level1.requirement3.description": "feature branch'ine dön",
    "stash.level1.requirement3.success": "✅ Güzel! feature branch'ine geri döndün.",
    "stash.level1.requirement4.description": "Stash'lediğin değişiklikleri geri yükle",
    "stash.level1.requirement4.success": "✅ Harika! Değişikliklerin geri yüklendi!",
    "stash.level1.story.title": "Acil Kesinti",
    "stash.level1.story.narrative":
        'Yeni bir özellik üzerinde çalışıyorsun, tam akışa girmişsin. Kodun yarım, testler bozuk ve birden... Slack patlıyor! 💥\n\n"ACİL: Üretim çöktü! HEMEN hotfix lazım!" 🚨\n\nBu dağınıklığı commit\'leyemezsin ama öylece de bırakamazsın. Ne yaparsın?\n\n**İşte git stash devreye giriyor** - acil durum kaydetme düğmen! 🎯\n\nBunu bir video oyununda duraklat tuşuna basmak gibi düşün. Çalışman özel bir yere kaydedilir, çalışma alanın tertemiz olur ve başka bir işe geçebilirsin. Geri döndüğünde devam tuşuna basman (git stash pop) yeterli; tam kaldığın yerden sürdürürsün!',
    "stash.level1.story.realWorldContext":
        "Gerçek geliştirme hayatında kesintiler sürekli olur. Ürün yöneticileri 'ufak bir değişiklik' ister, üretimde hatalar çıkar, takım arkadaşların acil kod incelemesine ihtiyaç duyar. Git stash, akışını kaybetmeden bağlam değiştirmeni sağlayan hayatta kalma aracındır.",
    "stash.level1.story.taskIntroduction":
        "Hadi stash iş akışını deneyelim: çalışmanı kaydet, acil durumu hallet, sonra kaldığın yerden devam et!",

    "stash.level2.name": "Çoklu Görev Jonglörlüğü",
    "stash.level2.description": "Stash ile birden fazla görev arasında geçiş yapmakta ustalaş",
    "stash.level2.objective1": "Yarım kalan mevcut çalışmanı stash'le",
    "stash.level2.objective2": "Yeni bir feature branch'i açmak için main branch'ine geç",
    "stash.level2.objective3": "Yeni bir feature branch'i oluştur",
    "stash.level2.objective4": "Eski görev branch'ine dön",
    "stash.level2.objective5": "Stash'lediğin çalışmayı geri yükle",
    "stash.level2.hint1": "Önce stash'le: git stash",
    "stash.level2.hint2": "main'e geç: git switch main (veya git checkout main)",
    "stash.level2.hint3": "Yeni branch oluştur: git switch -c feature/new-task (veya git checkout -b feature/new-task)",
    "stash.level2.hint4": "Eski göreve dön: git switch feature/old-task",
    "stash.level2.hint5": "Çalışmanı geri yükle: git stash pop",
    "stash.level2.requirement1.description": "Yarım kalan çalışmanı stash'le",
    "stash.level2.requirement1.success": "✅ Çalışma stash'lendi! Göreve geçmeye hazırsın.",
    "stash.level2.requirement2.description": "main branch'ine geç",
    "stash.level2.requirement2.success": "✅ Artık main branch'indesin.",
    "stash.level2.requirement3.description": "feature/new-task branch'ini oluştur",
    "stash.level2.requirement3.success": "✅ Yeni branch oluşturuldu!",
    "stash.level2.requirement4.description": "feature/old-task branch'ine dön",
    "stash.level2.requirement4.success": "✅ Eski görevine geri döndün.",
    "stash.level2.requirement5.description": "Stash'lediğin çalışmayı geri yükle",
    "stash.level2.requirement5.success": "✅ Mükemmel! Çalışman geri yüklendi!",
    "stash.level2.story.title": "Çoklu Görev Ustası",
    "stash.level2.story.narrative":
        '"Selam, şu yeni özellik talebine hızlıca bakabilir misin?" diye soruyor Product Owner\'ın.\n\nSen başka bir görevin tam ortasındasın. Eskiden ya her şeyi commit\'lemen ya da değişiklikleri kaybetmen gerekirdi.\n\n"Stash tam bunun için biçilmiş kaftan," diye açıklıyor kıdemli geliştirici Marc. "Mevcut çalışmanı kaydet, yeni görev için yeni bir branch aç, sonra da eski çalışmanı geri al."',
    "stash.level2.story.realWorldContext":
        "**Takım Hayatında Stash**\n\nGeliştiriciler sık sık birden fazla işi aynı anda yürütür:\n\n- Sprint planlaması öncelikleri değiştirir\n- Acil hatalar özellik geliştirmeyi böler\n- Kod incelemeleri bağlam değiştirmeyi gerektirir\n- Toplantılar akışı keser\n\n**Git Stash bağlam değiştirmeyi zahmetsiz kılar!**\n\nStash olmasaydı şunlardan birini yapmak zorunda kalırdın:\n- Yarım kodu commit'lemek (geçmiş açısından kötü)\n- Değişiklikleri atmak (emek çöpe)\n- Dağınık durumda kalmak (geçiş yapamazsın)\n\nStash ile: Kaydet, geç, çalış, dön - hepsi tertemiz! ✨",
    "stash.level2.story.taskIntroduction":
        "Çalışmanı stash'le, main'e geç, yeni bir branch oluştur, eski görevine dön ve çalışmanı geri al.",

    "stash.level3.name": "Stash'leri Yönetme",
    "stash.level3.description": "Stash kayıtlarını listelemeyi ve yönetmeyi öğren",
    "stash.level3.objective1": "Stash'lenmiş tüm değişiklikleri görüntüle",
    "stash.level3.objective2": "En son stash'i geri yükle",
    "stash.level3.hint1": "Tüm stash'leri görmek için 'git stash list' kullan",
    "stash.level3.hint2": "Stash'i 'git stash pop' ile geri al",
    "stash.level3.hint3": "Stash'ler bir yığın gibi saklanır (LIFO - son giren ilk çıkar)",
    "stash.level3.requirement1.description": "Tüm stash kayıtlarını listele",
    "stash.level3.requirement1.success": "✅ Stash'ler görüntülendi!",
    "stash.level3.requirement2.description": "En son stash'i geri al",
    "stash.level3.requirement2.success": "✅ Stash geri yüklendi!",
    "stash.level3.story.title": "Stash Düzeni",
    "stash.level3.story.narrative":
        '"Dur bakalım, o değişiklikleri nereye stash\'lemiştim?" diye düşünüyorsun.\n\n"`git stash list` kullan," diyor Lisa. "Kaydedilmiş tüm stash\'leri gösterir. `git stash pop` ile en sonuncusunu geri alır ve stash\'ten çıkarırsın."\n\nDevam ediyor: "Bir de `git stash apply` var - stash\'i uygular ama silmez. Aynı değişikliklere birden fazla kez ihtiyacın olduğunda işine yarar!"',
    "stash.level3.story.realWorldContext":
        "**Stash Yönetim Komutları**\n\n`git stash list` - Tüm stash'leri gösterir\n\n`git stash pop` - Stash'i uygular ve siler\n\n`git stash apply` - Stash'i uygular, silmeden saklar\n\n`git stash drop` - Bir stash'i siler\n\n`git stash clear` - Tüm stash'leri siler\n\n**Pro İpucu**: Stash'lerine `git stash push -m \"WIP: Feature X\"` ile isim ver - liste çok daha düzenli olur!",
    "stash.level3.story.taskIntroduction": "Stash'lerini listele ve en sonuncusunu geri al.",

    // Remote Stage
    "remote.name": "Remote Repository'ler",
    "remote.description": "Remote repository'lerle çalışmayı öğren",

    // Remote Level 1
    "remote.level1.name": "Remote Ekleme",
    "remote.level1.description": "Bir remote repository'ye bağlan",
    "remote.level1.objective1": "Bir remote repository ekle",
    "remote.level1.hint1": "`git remote add <name> <url>` komutunu kullan",
    "remote.level1.hint2": "Ana remote'una 'origin' adını vermek yaygın bir gelenektir",
    "remote.level1.requirement1.description": "Bir remote repository ekle",
    "remote.level1.requirement1.success": "Harika! Bir remote repository ekledin.",
    "remote.level1.story.title": "Repository'leri Bağlamak",
    "remote.level1.story.narrative":
        '"Buraya kadar harika gidiyorsun! Şimdi sıra yerel repository\'ni bir remote repository\'ye bağlamakta," diyor Alex. "Böylece kodunu takımla paylaşabilir ve verimli şekilde birlikte çalışabilirsin."\n\nAçıklıyor: "İlk adım, `git remote add` ile remote repository\'ye bir bağlantı eklemek. Bu komut henüz hiçbir kod aktarmaz; sadece bağlantıyı kurar."',
    "remote.level1.story.realWorldContext":
        "Remote repository'ler, birlikte geliştirme iş akışlarının merkezindedir. GitHub, GitLab ve Bitbucket gibi Git tabanlı sistemlerin çoğu, takım üyelerinin bağlandığı remote repository'leri barındırarak çalışır.",
    "remote.level1.story.taskIntroduction": "Repository'ne 'origin' adında bir remote ekle.",

    // Remote Level 2
    "remote.level2.name": "Commit'leri Remote'a Push'lama",
    "remote.level2.description": "Commit'lerini ne zaman ve nasıl yükleyeceğini öğren",
    "remote.level2.objective1": "Yerel commit'lerini remote repository'ye push'la",
    "remote.level2.objective2": "Yerel commit ile remote push arasındaki farkı kavra",
    "remote.level2.hint1": "main branch'ine push'lamak için `git push origin main` kullan",
    "remote.level2.hint2":
        "ÖNEMLİ: Push'u commit oluşturduktan SONRA yap! Push, tek tek dosyaları değil commit'lerini yükler.",
    "remote.level2.hint3": "İpucu: Hangi commit'lerin olduğunu görmek için `git log` kullan",
    "remote.level2.requirement1.description": "Commit'lerini remote'a push'la",
    "remote.level2.requirement1.success": "Mükemmel! Commit'lerin artık remote repository'de.",
    "remote.level2.story.title": "Yerelden Remote Repository'ye",
    "remote.level2.story.narrative":
        "\"Git iş akışının nasıl işlediğini göstereyim,\" diyor Alex, bir şema çizerek:\n\n1️⃣ Dosyaları değiştirirsin (Çalışma Dizini)\n2️⃣ `git add` ile staging'e alırsın (Staging Alanı)\n3️⃣ `git commit` ile commit'lersin (Yerel Repository)\n4️⃣ `git push` ile push'larsın (Remote Repository)\n\n\"Şunu iyi anla: git push tek tek dosyaları değil, COMMIT'lerini yükler! Push edebilmek için önce bir commit oluşturmalısın. Yerel commit'lerin, sen onları push'layana kadar yalnızca kendi bilgisayarında durur.\"",
    "remote.level2.story.realWorldContext":
        "Yerel ve remote repository arasındaki fark temel bir farktır: Yerel commit'ler yalnızca senin makinende bulunur. Takımının onları görebilmesi ancak git push ile mümkün olur. Yani istediğin kadar yerel commit oluşturup hepsini tek seferde push'layabilirsin!",
    "remote.level2.story.taskIntroduction":
        "Zaten bir commit oluşturdun. Şimdi bu commit'i `git push origin main` kullanarak remote repository'ye push'la.",

    "remote.level3.name": "Feature Branch'ini Push'lama",
    "remote.level3.description": "Bir feature branch'ini remote repository'ye push'la",
    "remote.level3.objective1": "Feature branch'ini tüm commit'leriyle birlikte push'la",
    "remote.level3.hint1": "`git push origin <branch-name>` kullan",
    "remote.level3.hint2": "Upstream'i ayarlamak için `git push -u origin <branch-name>` da kullanabilirsin",
    "remote.level3.requirement1.description": "Bir feature branch'ini remote'a push'la",
    "remote.level3.requirement1.success": "Harika! Feature branch'in artık remote repository'de.",
    "remote.level3.story.title": "Özellikleri Paylaşmak",
    "remote.level3.story.narrative":
        "\"Ayrı bir branch üzerinde harika bir yeni özellik geliştiriyorsun,\" diyor Sarah. \"Şimdi bu branch'i remote repository'ye push'lama zamanı; böylece diğer takım üyeleri çalışmanı görüp inceleyebilir.\"\n\nAçıklıyor: \"Bir branch'i ilk kez push'larken -u (ya da --set-upstream) seçeneğini kullanmalısın. Bu, yerel branch'ini remote branch ile ilişkilendirir ve sonraki push ile pull işlemlerini kolaylaştırır.\"",
    "remote.level3.story.realWorldContext":
        "Profesyonel takımlarda yeni özellikler genellikle ayrı branch'lerde geliştirilir ve ana kod tabanına merge edilmeden önce incelenmek üzere push'lanır. Bu, pull request iş akışının merkezindeki adımdır.",
    "remote.level3.story.taskIntroduction":
        "Başkalarının görebilmesi için feature branch'ini remote repository'ye push'la.",

    // Reset Stage
    "reset.name": "Commit'leri Geri Alma",
    "reset.description": "Commit'leri nasıl geri alacağını ve geçmişte nasıl geriye gideceğini öğren",

    "reset.level1.name": "Soft Reset - Değişiklikleri Koru",
    "reset.level1.description": "Önceki bir commit'e dön ama değişikliklerini koru",
    "reset.level1.objective1": "Değişiklikler staged kalacak şekilde son commit'i geri al",
    "reset.level1.objective2": "Kavramı anlamak için HEAD'e (mevcut commit'e) reset at",
    "reset.level1.objective3": "HEAD~n gösterimini kullanarak belirli bir önceki commit'e reset at",
    "reset.level1.hint1": "Basit başla: `git reset --soft HEAD~1` (son commit'i geri alır)",
    "reset.level1.hint2": "Önce commit geçmişine bak: `git log --oneline`",
    "reset.level1.hint3": "`git reset --soft HEAD` her şeyi olduğu gibi bırakır (hiçbir değişiklik olmaz)",
    "reset.level1.hint4": "`git reset --soft HEAD~2` 2 commit geriye gider",
    "reset.level1.hint5": "--soft reset'ten sonra dosyalar staged kalır - commit mesajlarını düzeltmek için birebir!",
    "reset.level1.hint6": "Reset'ten sonra neyin staged olduğunu görmek için `git status` kullan",
    "reset.level1.requirement1.description": "--soft kullanarak son commit'i geri al",
    "reset.level1.requirement1.success": "✅ Güzel! Commit gitti ama dosyalar hâlâ staged!",
    "reset.level1.requirement2.description": "Kavramı anlamak için HEAD'e reset at",
    "reset.level1.requirement2.success":
        "✅ Mükemmel! HEAD'e reset atmak 'olduğun yerde kal' demektir - hiçbir şey değişmez!",
    "reset.level1.requirement3.description": "HEAD~n kullanarak daha eski bir commit'e reset at",
    "reset.level1.requirement3.success": "✅ Harika! Soft reset'lerde HEAD~n gösterimine hâkim oldun!",
    "reset.level1.story.title": "git reset --soft'u Anlamak",
    "reset.level1.story.narrative": `🔄 **git reset --soft'u Anlamak**

**Durum:**
Bir özellik üzerinde çalışıyorsun ve 5 commit oluşturdun. Ama geriye dönüp bakınca fark ediyorsun ki:
- Commit 5: "Add database config" - Eyvah! Bunda hassas kimlik bilgileri var! 🔐
- Commit 4: "Update API endpoints" - Bu iyi ✅
- Commit 3: "Add authentication" - İyi ✅
- Commit 2: "Setup routing" - İyi ✅
- Commit 1: "Initial project setup" - İyi ✅

5. commit'i geri alman, düzeltmen ve düzgünce yeniden commit'lemen gerekiyor!

**git reset --soft nedir?**
Git commit'lerini üst üste dizilmiş kutular gibi düşün 📦📦📦. Her kutu bir commit.

\`git reset --soft\` yığının en üstündeki kutuları kaldırır, AMA içindeki her şeyi (değişikliklerini) hazırlık masasında bırakır; yeni bir kutuya konmaya hazır!

**git reset --soft Kullanmanın Üç Yolu:**

**1. Bir önceki commit'e dönmek (en yaygını):**
\`git reset --soft HEAD~1\`
- HEAD = "şu an bulunduğun yer" (en üstteki kutu)
- ~1 = "1 kutu geri git"
- Sonuç: Son commit kaldırılır ama değişiklikler staged kalır!

**2. HEAD'e reset atmak (öğretici - hiçbir şey yapmaz):**
\`git reset --soft HEAD\`
- Bu, "zaten bulunduğum yere reset at" demektir
- Hiçbir şey olmaz! Kavramı anlamak için iyi.

**3. Daha eski bir commit'e reset atmak:**
\`git reset --soft HEAD~3\`
- 3 commit geriye gider
- O 3 commit'teki tüm değişiklikler staged kalır
- Birden fazla commit'i tek commit'te birleştirmek için birebir!

**Görevin:**

**1. Adım:** Son commit'i (kimlik bilgilerini içereni) kaldır
\`git reset --soft HEAD~1\`
\`git status\` ile kontrol et - dosyaların hâlâ staged! ✨

**2. Adım:** HEAD'e reset atmayı dene (öğretici)
\`git reset --soft HEAD\`
Dikkat et: Hiçbir şey değişmedi! Zaten HEAD'desin.

**3. Adım:** Pratik için biraz daha geriye git
\`git reset --soft HEAD~2\`
Şimdi 2 commit'i kaldırdın ama dosyalar hâlâ staged!

**Unutma:**
- 📦 Commit'ler geçmişten kaldırılır
- ✅ Dosyalar staging alanında kalır
- 🎯 Commit mesajlarını düzeltmek veya commit'leri birleştirmek için birebir
- ⚠️  Sadece henüz push'lamadığın commit'lerde kullan!

Hadi bu üç tekniği deneyelim! 🚀`,
    "reset.level1.story.realWorldContext":
        "git reset --soft, son commit'ini yaptığın işi kaybetmeden düzeltmek istediğinde çok işe yarar. Değişiklikleri düzenleyip tekrar commit'leyebilirsin.",
    "reset.level1.story.taskIntroduction": "git reset --soft komutunu farklı hedeflerle dene: HEAD~1, HEAD ve HEAD~2.",

    "reset.level2.name": "Hard Reset - Her Şeyi At",
    "reset.level2.description": "Önceki bir commit'e dön ve tüm değişiklikleri at",
    "reset.level2.objective1": "Hatalı olan son commit'i tamamen at",
    "reset.level2.objective2": "Hiçbir şey yapmadığını görmek için HEAD'e reset at",
    "reset.level2.objective3": "Birden fazla commit geriye atla ve her şeyi at",
    "reset.level2.hint1": "⚠️  UYARI: --hard YIKICIDIR! Tüm değişiklikler kalıcı olarak kaybolur!",
    "reset.level2.hint2": "Önce neyi kaybedeceğini kontrol et: git log --oneline",
    "reset.level2.hint3": "git reset --hard HEAD~1 son commit'i VE tüm değişiklikleri kaldırır",
    "reset.level2.hint4": "git reset --hard HEAD hiçbir şey yapmaz (zaten HEAD'desin)",
    "reset.level2.hint5": "git reset --hard HEAD~3 3 commit geriye gider ve her şeyi siler",
    "reset.level2.hint6": "Kötü kodu tamamen çöpe atmak istediğinde bunu kullan",
    "reset.level2.hint7": "💡 Gerçek hayatta: --hard'ı yalnızca push'lamadığın kodda kullan!",
    "reset.level2.requirement1.description": "--hard kullanarak son commit'i at",
    "reset.level2.requirement1.success": "💥 Commit ve tüm değişiklikler yok oldu! Geri dönüş yok!",
    "reset.level2.requirement2.description": "HEAD'e reset at (öğretici - hiçbir şey yapmaz)",
    "reset.level2.requirement2.success": "✅ Hiçbir şey değişmedi - zaten HEAD'desin!",
    "reset.level2.requirement3.description": "--hard kullanarak birden fazla commit'i at",
    "reset.level2.requirement3.success": "💥 Birden fazla commit yok oldu! Çalışma alanın yine tertemiz!",
    "reset.level2.story.title": "git reset --hard'ı Anlamak - NÜKLEER SEÇENEK",
    "reset.level2.story.narrative": `⚠️  **git reset --hard'ı Anlamak - NÜKLEER SEÇENEK**

**Durum:**
Cuma akşamı. Bütün gün yeni bir özellik üzerinde deneme yaptın:
- Commit 6: "Try experimental algorithm v3" - Tamamen bozuk! 💀
- Commit 5: "Try experimental algorithm v2" - Hâlâ bozuk! 🐛
- Commit 4: "Try experimental algorithm v1" - Yok, olmadı! ❌
- Commit 3: "Add user dashboard" - Bu çalışıyordu! ✅
- Commit 2: "Add user authentication" - İyi ✅
- Commit 1: "Initial project" - İyi ✅

Şunu fark ediyorsun: Bu denemeler çöp. Onların YOK olmasını istiyorsun. Sonsuza dek. 💣

**git reset --hard nedir?**
Kutu benzetmesini hatırlıyor musun? 📦📦📦

\`git reset --soft\` kutuları kaldırıyor ama içindekileri hazırlık masasında bırakıyordu.

\`git reset --hard\` ise kutuları kaldırır VE içindeki her şeyi çöpe atar! 🗑️

**⚠️  KRİTİK: Bu işlem YIKICI ve KALICIDIR!**
- Commit'ler geçmişten silinir
- TÜM dosya değişiklikleri silinir
- Çalışma dizini temizlenir
- Staging alanı boşaltılır
- **GERİ ALMA YOKTUR!**

**git reset --hard Kullanmanın Üç Yolu:**

**1. Son commit'i yok etmek (en yaygını):**
\`git reset --hard HEAD~1\`
- Son commit'i kaldırır
- O commit'teki tüm değişiklikleri siler
- Çalışma dizini bir önceki commit'teki hâline döner
- ⚠️  Değişiklikler SONSUZA DEK GİTTİ!

**2. HEAD'e reset atmak (öğretici - hiçbir şey yapmaz):**
\`git reset --hard HEAD\`
- "Çalışma alanımı HEAD gibi yap" demektir
- Zaten HEAD'de olduğun için hiçbir şey değişmez
- Şunu anlamak için iyi: HEAD = mevcut konum

**3. Birden fazla commit'i yok etmek:**
\`git reset --hard HEAD~4\`
- 4 commit geriye gider
- 4 commit'in tamamı geçmişten SİLİNİR
- O commit'lerdeki tüm değişiklikler SİLİNİR
- Sanki hiç var olmamışlar gibi! 👻

**--hard Ne Zaman Kullanılır:**
- ✅ Deneme başarısız oldu, çöpe at
- ✅ Her şeyi bozdun, sıfırdan başlaman lazım
- ✅ Yanlışlıkla gizli anahtar/parola commit'ledin
- ❌ Zaten push'ladığın commit'lerde ASLA!
- ❌ Değişikliklere ileride ihtiyacın olabilirse ASLA!

**Görevin:**

**1. Adım:** Bozuk olan son commit'i yok et
\`git reset --hard HEAD~1\`
\`git status\` ile kontrol et - çalışma alanın tertemiz! 🧹

**2. Adım:** HEAD'e reset atmayı dene (güvenli pratik)
\`git reset --hard HEAD\`
Hiçbir şey olmaz - zaten oradasın!

**3. Adım:** Başarısız denemelerin hepsini yok et
\`git reset --hard HEAD~3\`
3 kötü commit'in hepsi gitti! Sanki o cuma hiç yaşanmamış gibi! 😅

**Unutma:**
- 💥 Bu, NÜKLEER SEÇENEKTİR
- 🗑️  Her şey silinir - hem commit'ler hem değişiklikler
- ⏪ Geri alınamaz (commit hash'i elinde yoksa)
- 🎯 Yalnızca %100 eminsen kullan
- ⚠️  Push'lanmış commit'lerde ASLA kullanma!

**Bir Bilgi:** Profesyonel geliştiriciler her şeye sıfırdan başlamak istediklerinde "buna hard reset atıyorum" derler! 🔥

Güvenli yıkım pratiği yapmaya hazır mısın? Hadi başlayalım! 💪`,
    "reset.level2.story.realWorldContext":
        "--hard reset güçlü ama tehlikeli bir araçtır. Gerçekten temiz bir sayfa açman gerektiğinde kullanılır. Takım çalışmasında push'lanmış commit'lerde reset kullanırken dikkatli ol - başkalarının kafasını karıştırabilir.",
    "reset.level2.story.taskIntroduction":
        "Nükleer seçeneği dene: commit'leri ve değişiklikleri tamamen atmak için git reset --hard kullan.",

    "reset.level3.name": "Belirli Bir Commit'e Reset",
    "reset.level3.description": "Geçmişte belirli bir commit'e geri dön",
    "reset.level3.objective1": "Commit geçmişini görüntüle ve sağlam commit'i bul",
    "reset.level3.objective2": "Hash'ini kullanarak belirli bir commit'e reset at",
    "reset.level3.hint1": "Önce commit geçmişine bak: git log --oneline",
    "reset.level3.hint2": "Her commit'in benzersiz bir hash'i vardır ('a1b2c3d' gibi)",
    "reset.level3.hint3": "git reset --soft <commit-hash> değişiklikleri staged bırakır",
    "reset.level3.hint4": "git reset --hard <commit-hash> o commit'ten sonraki her şeyi yok eder",
    "reset.level3.hint5": "Commit hash'leri kalıcı kimliklerdir - HEAD~n ise görecelidir",
    "reset.level3.hint6": "Pro ipucu: Hash'in yalnızca ilk 7 karakteri yeter!",
    "reset.level3.hint7": "'Version 2 - Good version' commit'ini bul ve hash'ini kullan",
    "reset.level3.requirement1.description": "Sağlam commit'i bulmak için commit geçmişini görüntüle",
    "reset.level3.requirement1.success": "✅ Güzel! Artık tüm commit'leri ve hash'lerini görebiliyorsun!",
    "reset.level3.requirement2.description": "Hash'ini kullanarak belirli bir commit'e reset at",
    "reset.level3.requirement2.success": "🎯 Mükemmel! Belirli commit hash'lerine reset atmayı öğrendin!",
    "reset.level3.story.title": "İleri Seviye Reset: Commit Hash'leriyle Çalışmak",
    "reset.level3.story.narrative": `🎯 **İleri Seviye Reset: Commit Hash'leriyle Çalışmak**

**Durum:**
Projen büyüdü. Şu anda 8. commit'tesin ama 3. commit'e geri dönmen gerekiyor.

5 commit geri saymak için \`HEAD~5\` kullanmak hem can sıkıcı hem de hataya açık. Ya sen çalışırken biri yeni bir commit eklerse? Sayı değişir!

**Profesyonel Çözüm: Commit Hash'leri**

Her commit'in parmak izi gibi benzersiz bir kimliği (hash) vardır:
\`a1b2c3d - "Version 2 - Good version"\`

Bu hash ASLA değişmez! Kalıcı ve benzersizdir.

**Mevcut Durum:**
- Commit 8: "Attempted fix v3" - Hâlâ bozuk! 💔
- Commit 7: "Attempted fix v2" - Yok, olmadı! 🐛
- Commit 6: "Attempted fix v1" - Başarısız! ❌
- Commit 5: "Add broken feature" - Karışıklık burada başladı 🔥
- Commit 4: "Update styling" - Kozmetik ✨
- Commit 3: "Version 2 - GOOD VERSION" - Bilinen son sağlam durum! ✅
- Commit 2: "Version 1" - İlk sürüm ✅
- Commit 1: "Initial commit" - Temel ✅

**Görevin:**

**1. Adım: Sağlam Commit'i Bul**
Şunu çalıştır: \`git log --oneline\`

Şuna benzer bir çıktı göreceksin:
\`\`\`
f7e8a9b Attempted fix v3
d6c7b8a Attempted fix v2
c5b6a7f Attempted fix v1
b4a5c6e Add broken feature
a3b4c5d Update styling
9a2b3c4 Version 2 - Good version  ← İŞTE BU!
8a1b2c3 Version 1
7a0b1c2 Initial commit
\`\`\`

**2. Adım: O Commit'e Reset At**
\`git reset --soft 9a2b3c4\`
(Ekranda gördüğün gerçek hash'i kullan!)

VEYA (daha yıkıcı):
\`git reset --hard 9a2b3c4\`

**HEAD~n ile Commit Hash Karşılaştırması:**

**Göreceli (HEAD~n):**
- \`HEAD~1\` = "bir önceki commit"
- \`HEAD~5\` = "5 commit öncesi"
- ❌ Yeni commit'ler eklenirse değişir
- ✅ Yakın commit'ler için hızlıdır

**Mutlak (Commit Hash):**
- \`git reset --soft a1b2c3d\`
- ✅ Kalıcı referans
- ✅ Asla değişmez
- ✅ Profesyonel yaklaşım
- 🎯 Bilinen sağlam durumlara dönmek için en iyisi

**Pro İpuçları:**
- İlk 7 karakter yeter: Tam hash yerine \`9a2b3c4\`
- Hash'leri \`git log\` çıktısından kopyalayabilirsin
- Hash'ler HER git komutuyla çalışır: \`git show a1b2c3d\`
- Önemli commit hash'lerini not al; geri dönmek kolay olsun!

**Gerçek Hayattan Bir Senaryo:**
"Arkadaşlar, dağıtım bozulursa 9a2b3c4 commit'ine geri dönün - bilinen son kararlı sürümümüz o!"

**CI/CD Sistemlerinde:**
Üretim dağıtımları, hassas sürüm kontrolü için sıklıkla commit hash'lerini kullanır:
\`\`\`
deploy.sh --commit=9a2b3c4
\`\`\`

Hadi profesyonel seviyede Git pratiği yapalım! 🚀`,
    "reset.level3.story.realWorldContext":
        "Commit hash'leri kullanmak, geçmişteki belirli noktalara referans vermenin profesyonel yoludur. Kalıcıdırlar, yoruma açık değildirler ve tüm takım üyelerinin repository'lerinde aynı şekilde çalışırlar.",
    "reset.level3.story.taskIntroduction":
        "Commit hash'lerini bulmak için git log kullan, ardından belirli bir hash ile git reset çalıştır.",

    // Rebase Stage
    "rebase.name": "Rebase Etmek",
    "rebase.description": "Branch'leri nasıl rebase edeceğini öğren",

    // Rebase Level 1
    "rebase.level1.name": "Temel Rebase",
    "rebase.level1.description": "Bir branch'teki commit'leri bir diğerinin üzerine uygula",
    "rebase.level1.objective1": "Mevcut branch'i başka bir branch'in üzerine rebase et",
    "rebase.level1.hint1": "feature branch'indesin - onu main üzerine rebase etmek için: git rebase main",
    "rebase.level1.hint2":
        "Bu işlem, commit'lerini main'in en son commit'lerinin üzerine uygulayarak geçmişi yeniden yazar",
    "rebase.level1.hint3": "Rebase sonrası commit geçmişini görmek için 'git log --oneline' kullan",
    "rebase.level1.requirement1.description": "Başka bir branch'in üzerine rebase et",
    "rebase.level1.requirement1.success": "Çok iyi! Branch'i başarıyla rebase ettin.",
    "rebase.level1.story.title": "Temiz Bir Geçmiş Oluşturmak",
    "rebase.level1.story.narrative":
        '"Bakıyorum merge işini kapmışsın," diyor Sarah. "Şimdi değişiklikleri birleştirmenin farklı bir yoluna bakalım: rebase."\n\nAçıklıyor: "Merge geçmişleri birleştirirken, rebase commit\'lerini başka bir branch\'in commit\'lerinden sonra gelecek şekilde taşıyarak geçmişi yeniden yazar. Böylece daha doğrusal ve daha temiz bir geçmiş oluşur."',
    "rebase.level1.story.realWorldContext":
        "Temiz ve doğrusal bir proje geçmişi korumak istediğinde genellikle rebase tercih edilir. Pek çok takım, feature branch'lerini ana branch'e merge etmeden önce entegre etmek için rebase kullanır.",
    "rebase.level1.story.taskIntroduction": "feature branch'indesin. Onu main üzerine rebase et: git rebase main",

    // Rebase Level 2
    "rebase.level2.name": "Rebase Çakışmalarıyla Başa Çıkma",
    "rebase.level2.description": "Çakışmalı rebase'leri nasıl çözeceğini ya da iptal edeceğini öğren",
    "rebase.level2.objective1": "Çakışmalı bir rebase'i iptal et",
    "rebase.level2.hint1": "`git rebase --abort` komutunu kullan",
    "rebase.level2.hint2": "Bu komut rebase işlemini durdurur ve rebase başlamadan önceki duruma geri döner",
    "rebase.level2.requirement1.description": "Çakışmalı bir rebase'i iptal et",
    "rebase.level2.requirement1.success": "Harika! Rebase işlemini başarıyla iptal ettin.",
    "rebase.level2.story.title": "Rebase İşleri Karıştırdığında",
    "rebase.level2.story.narrative":
        '"Tıpkı merge gibi, rebase de çakışmalara yol açabilir," diye belirtiyor Alex. "Ama rebase sırasında çakışmaları çözmek daha karmaşık olabilir; çünkü Git commit\'lerini tek tek uygular."\n\nDevam ediyor: "Bir rebase\'in ortasındayken işin fazla karmaşık olduğuna ya da yaklaşımını yeniden düşünmen gerektiğine karar verirsen, işlemi her zaman iptal edebilirsin."',
    "rebase.level2.story.realWorldContext":
        "Bir rebase'i ne zaman ve nasıl iptal edeceğini bilmek gerçek geliştirme işinde önemlidir. Bazen çakışmalar hemen çözülemeyecek kadar karmaşıktır ya da farklı bir stratejinin daha iyi olacağını fark edersin.",
    "rebase.level2.story.taskIntroduction": "git rebase --abort kullanarak bir rebase işlemini iptal etmeyi dene.",

    // Rebase Level 3
    "rebase.level3.name": "Etkileşimli Rebase",
    "rebase.level3.description": "Commit geçmişini değiştirmek için etkileşimli rebase'i nasıl kullanacağını öğren",
    "rebase.level3.objective1": "Etkileşimli bir rebase oturumu başlat",
    "rebase.level3.hint1": "`git rebase -i` komutunu kullan",
    "rebase.level3.hint2":
        "Etkileşimli rebase; commit'leri yeniden sıralamana, düzenlemene, squash'lamana veya silmene imkân verir",
    "rebase.level3.requirement1.description": "Etkileşimli bir rebase başlat",
    "rebase.level3.requirement1.success": "Mükemmel! Etkileşimli bir rebase oturumu başlattın.",
    "rebase.level3.story.title": "Geçmişi Derleyip Toplamak",
    "rebase.level3.story.narrative":
        '"Özelliğin iyi görünüyor," diyor Alex, kodunu incelerken. "Ama yazım hatası düzeltmelerinden ve ufak değişikliklerden oluşan bir sürü küçük commit\'in olduğunu görüyorum. Bunu main\'e merge etmeden önce commit geçmişini derleyip toplayalım."\n\nAçıklıyor: "Git, commit geçmişini değiştirmeni sağlayan etkileşimli rebase adında güçlü bir araç sunuyor. Küçük commit\'leri birleştirebilir, commit mesajlarını yeniden yazabilir, hatta commit\'leri tamamen silebilirsin."',
    "rebase.level3.story.realWorldContext":
        "Etkileşimli rebase, feature branch'lerini merge etmeden önce temiz ve tutarlı bir commit geçmişi oluşturmak için sıkça kullanılır. Bu da kod tabanının geçmişini daha okunabilir ve anlamlı kılar.",
    "rebase.level3.story.taskIntroduction": "Commit geçmişini değiştirmek için etkileşimli bir rebase oturumu başlat.",

    // Rebase Level 4
    "rebase.level4.name": "Main Üzerine Rebase",
    "rebase.level4.description":
        "Feature branch'lerini güncellenmiş main branch'i üzerine rebase etme iş akışını öğren",
    "rebase.level4.objective1": "Feature branch'ini güncellenmiş main branch'i üzerine rebase et",
    "rebase.level4.hint1": "Feature branch'indeyken `git rebase main` kullan",
    "rebase.level4.hint2":
        "Bu işlem, özellik değişikliklerini main branch'indeki en son değişikliklerin üzerine uygular",
    "rebase.level4.requirement1.description": "feature'ı main üzerine rebase et",
    "rebase.level4.requirement1.success": "Harika! Feature branch'ini en güncel main branch'i üzerine rebase ettin.",
    "rebase.level4.story.title": "Güncel Kalmak",
    "rebase.level4.story.narrative":
        "\"Görüyorum ki sen özelliğin üzerinde çalışırken bir başkası main branch'ine değişiklikler push'lamış,\" diye belirtiyor Sarah. \"Çalışmanı merge etmeden önce bu son değişiklikleri de almalısın.\"\n\nDevam ediyor: \"main'i kendi branch'ine merge edip bir merge commit'i oluşturmak yerine, branch'ini main üzerine rebase etmeni öneririm. Böylece geçmiş daha temiz kalır.\"",
    "rebase.level4.story.realWorldContext":
        "Birlikte çalışılan ortamlarda main branch'i sık sık güncellenir. Feature branch'lerini main üzerine rebase etmek; merge çakışmalarından kaçınmaya yardımcı olan ve feature branch'lerini güncel tutan yaygın bir iş akışıdır.",
    "rebase.level4.story.taskIntroduction":
        "Son değişiklikleri almak için feature branch'ini güncellenmiş main branch'i üzerine rebase et.",

    // Advanced Stage
    "advanced.name": "İleri Seviye Git Teknikleri",
    "advanced.description": "İleri seviye Git özelliklerinde ve iş akışlarında ustalaş",

    // Advanced Level 1: Git Tags
    "advanced.level1.name": "Sürüm Etiketleme",
    "advanced.level1.description": "Geçmişteki önemli noktaları tag'lerle işaretlemeyi öğren",
    "advanced.level1.objective1": "Bir sürüm için açıklamalı (annotated) tag oluştur",
    "advanced.level1.objective2": "Repository'deki tüm tag'leri listele",
    "advanced.level1.objective3": "Tag'leri remote repository'ye push'la",
    "advanced.level1.hint1": "Açıklamalı bir tag oluştur: git tag -a v1.0.1 -m 'Bug fix release'",
    "advanced.level1.hint2": "Tüm tag'leri listele: git tag",
    "advanced.level1.hint3": "Açıklamalı tag'ler yazar bilgisini ve bir mesajı da içerir",
    "advanced.level1.hint4": "Tag'ler sürüm noktalarını işaretlemek için kullanılır (v1.0, v2.0 vb.)",
    "advanced.level1.requirement1.description": "Bir sürüm tag'i oluştur",
    "advanced.level1.requirement1.success": "Harika! Bu commit'i bir sürüm noktası olarak tag'ledin.",
    "advanced.level1.requirement2.description": "Yeni tag'ini görmek için tüm tag'leri listele",
    "advanced.level1.requirement2.success": "Mükemmel! Repository'deki tüm tag'leri görebiliyorsun.",
    "advanced.level1.requirement3.description": "Tag'leri remote repository'ye push'la",
    "advanced.level1.requirement3.success": "Harika! Tag'lerin artık takımın erişimine açık.",
    "advanced.level1.story.title": "Kilometre Taşlarını İşaretlemek",
    "advanced.level1.story.narrative":
        "\"Sürüm 1.0'ı üretime almak üzereyiz,\" diye duyuruyor takım liderin. \"Bunu yapmadan önce bu commit'i tag'lememiz gerek. Tag'ler Git geçmişindeki yer imleri gibidir - sürümler gibi önemli noktaları işaretler.\"\n\nDevam ediyor: \"Yeni commit'lerle birlikte ilerleyen branch'lerin aksine tag'ler sabit kalır. Yani yıllar sonra bile v1.0'da tam olarak neyi yayınladığımıza geri dönebiliriz.\"\n\n\"Profesyonel takımlarda her üretim sürümü tag'lenir. Hata ayıklama, geri dönüşler ve değişiklik kayıtları için vazgeçilmezdir.\"",
    "advanced.level1.story.realWorldContext":
        "Tag'ler, sürümleri işaretlemede sektör standardıdır. Anlamsal sürümlemeyi (v1.0.0) mümkün kılar, geri dönüşleri güvenli hâle getirir ve takımların belirli sürümler hakkında konuşmasını kolaylaştırır.",
    "advanced.level1.story.taskIntroduction":
        "Bu sürümü işaretlemek için açıklamalı bir tag oluştur: git tag -a v1.0.1 -m 'Bug fix release'",

    // Advanced Level 2: Git Log Advanced
    "advanced.level2.name": "İleri Seviye Commit Geçmişi",
    "advanced.level2.description": "Repository geçmişini incelemenin ileri seviye tekniklerinde ustalaş",
    "advanced.level2.objective1": "Özetlenmiş commit geçmişini görüntüle",
    "advanced.level2.objective2": "Commit'leri yazara veya tarihe göre filtrele",
    "advanced.level2.objective3": "Commit mesajlarında arama yap",
    "advanced.level2.hint1": "Tek satırlık commit geçmişini gör: git log --oneline",
    "advanced.level2.hint2": "Commit geçmişini grafikle göster: git log --graph --oneline",
    "advanced.level2.hint3": "Son N commit ile sınırla: git log --oneline -n 5",
    "advanced.level2.hint4": "Commit mesajlarında ara: git log --grep='fix'",
    "advanced.level2.requirement1.description": "Derli toplu commit geçmişini görüntüle",
    "advanced.level2.requirement1.success": "Mükemmel! Commit geçmişini inceledin.",
    "advanced.level2.requirement2.description": "Commit'leri yazara göre filtrele",
    "advanced.level2.requirement2.success": "Harika! Artık belirli yazarların commit'lerini bulabilirsin.",
    "advanced.level2.requirement3.description": "Commit mesajlarında belirli bir metni ara",
    "advanced.level2.requirement3.success": "Harika! Artık commit mesajları arasında arama yapabilirsin.",
    "advanced.level2.story.title": "Geçmişi Keşfetmek",
    "advanced.level2.story.narrative":
        '"Son 50 commit\'in bir yerinde bir hata sızmış," diye iç çekiyor iş arkadaşın. "Bunu nasıl bulacağım?"\n\nKıdemli geliştiriciniz gülümsüyor: "git log senin dedektiflik aracın. Varsayılan biçim her şeyi gösterir ama bu insanı boğar. Sana asıl güçlü araçları göstereyim."\n\n"git log --oneline her commit\'i tek satırda gösterir - göz gezdirmek için birebir. Branch yapısını görmek için --graph ekle. Commit mesajlarında arama yapmak için --grep kullan. Bu beceriler seni Git kullanıcısından Git dedektifine dönüştürür."',
    "advanced.level2.story.realWorldContext":
        "git log'da ustalaşmak; hata ayıklama, kod arkeolojisi ve projenin nasıl evrildiğini anlamak için şarttır. Profesyonel geliştiriciler bu bayrakları her gün kullanır.",
    "advanced.level2.story.taskIntroduction": "Commit geçmişini incele: git log --oneline",

    // Advanced Level 3: Git Show
    "advanced.level3.name": "Commit'leri İnceleme",
    "advanced.level3.description": "Belirli commit'leri ayrıntılı incelemeyi öğren",
    "advanced.level3.objective1": "Hash'ini kullanarak belirli bir commit'i incele",
    "advanced.level3.hint1": "Önce bir commit hash'i bulmak için 'git log --oneline' kullan",
    "advanced.level3.hint2": "Belirli bir commit'i göster: git show <commit-hash>",
    "advanced.level3.hint3":
        "git show; commit mesajını, yazarı, tarihi ve dosya değişikliklerini içeren diff'i gösterir",
    "advanced.level3.requirement1.description": "Hash'ini kullanarak bir commit'i incele",
    "advanced.level3.requirement1.success": "Harika! Commit ayrıntılarını ve dosya değişikliklerini inceledin.",
    "advanced.level3.story.title": "Commit Soruşturması",
    "advanced.level3.story.narrative":
        '"Bu commit bir şeyi bozmuş ama neyin değiştiğini çıkaramıyorum," diyor takım arkadaşın.\n\n"git show kullan!" diye yanıtlıyorsun kendinden emin bir şekilde. "Bir commit hakkında her şeyi gösterir: mesajı, kimin ne zaman yaptığını ve en önemlisi - asıl kod değişikliklerini."\n\n"Commit\'ler için bir büyüteç gibidir. Kod incelemeleri, hata ayıklama ve iş arkadaşlarının neyi değiştirdiğini anlamak için vazgeçilmezdir."',
    "advanced.level3.story.realWorldContext":
        "git show, kod incelemesi ve hata ayıklama için temel bir araçtır. Pull request'lerde ve sorunları araştırırken sürekli kullanılır.",
    "advanced.level3.story.taskIntroduction": "En son commit'i incele: git show",

    // Workflow Stage
    "workflow.name": "Git İş Akışları",
    "workflow.description": "Profesyonel Git iş akışlarında ve iş birliği kalıplarında ustalaş",

    "workflow.level1.name": "Feature Branch İş Akışı",
    "workflow.level1.description":
        "Dünya çapında takımların kullandığı, sektör standardı feature branch iş akışını öğren",
    "workflow.level1.objective1": "main'den bir feature branch'i oluştur",
    "workflow.level1.objective2": "Açıklayıcı mesajlarla commit'ler oluştur",
    "workflow.level1.objective3": "Feature branch'ini remote'a push'la",
    "workflow.level1.objective4": "main branch'ine geri dön",
    "workflow.level1.objective5": "Feature branch'ini tekrar main'e merge et",
    "workflow.level1.objective6": "Feature branch iş akışını tamamla",
    "workflow.level1.hint1": "Önce bir feature branch'i oluştur: 'git switch -c feature/user-auth'",
    "workflow.level1.hint2": "auth.js dosyasını değiştir, sonra değişikliklerini staging'e almak için 'git add' kullan",
    "workflow.level1.hint3": "Commit'le: 'git commit'",
    "workflow.level1.hint4": "Remote'a push'la: 'git push origin feature/user-auth'",
    "workflow.level1.hint5": "main'e geri dön: 'git switch main'",
    "workflow.level1.hint6": "Son olarak merge et: 'git merge feature/user-auth'",
    "workflow.level1.requirement1.description": "'git switch -c <branch>' ile yeni bir feature branch'i oluştur",
    "workflow.level1.requirement1.success": "Feature branch'i başarıyla oluşturuldu!",
    "workflow.level1.requirement2.description": "Değişikliklerini staging'e al (önce bir dosyayı değiştir!)",
    "workflow.level1.requirement2.success": "Değişiklikler staging'e alındı!",
    "workflow.level1.requirement3.description": "Değişikliklerini açıklayıcı bir mesajla commit'le",
    "workflow.level1.requirement3.success": "Değişiklikler commit'lendi!",
    "workflow.level1.requirement4.description": "Feature branch'ini remote'a push'la (git push origin <your-branch>)",
    "workflow.level1.requirement4.success": "Feature branch'i remote'a push'landı!",
    "workflow.level1.requirement5.description": "'git switch main' ile main branch'ine geri dön",
    "workflow.level1.requirement5.success": "main branch'ine geçildi!",
    "workflow.level1.requirement6.description": "Feature branch'ini main'e merge et",
    "workflow.level1.requirement6.success":
        "Özellik başarıyla merge edildi! Gerçek takımlar yeni özellikleri işte böyle entegre eder.",
    "workflow.level1.story.title": "Özellik Fabrikası",
    "workflow.level1.story.narrative": `TechCorp'ta bir geliştiricisin ve takım sıkı Git iş akışlarına uyuyor. Yöneticin Sarah az önce sana yeni bir özellik verdi: kullanıcı kimlik doğrulamasını hayata geçirmek.

"Unutma," diyor Sarah, "main'e asla doğrudan commit atmayız. Her zaman feature branch kullan ve commit'lerin bir hikâye anlatsın."

**Feature Branch Nedir?**
Feature branch, yeni bir özelliği yalıtılmış şekilde geliştirdiğin ayrı bir branch'tir. Bu sayede:
- Kararlı main branch'ini etkilemeden çalışırsın
- Merge etmeden önce kodun incelenir
- Başkalarını etkilemeden çalışmandan vazgeçebilir ya da onu değiştirebilirsin

**Eksiksiz İş Akışı:**
1. main'den bir feature branch oluştur: \`git switch -c feature/user-auth\`
2. Dosyalarda değişiklik yap ve \`git add\` ile staging'e al
3. Değişiklikleri açıklayıcı mesajlarla commit'le
4. Branch'ini remote'a push'la: \`git push origin feature/user-auth\`
5. main'e geri dön: \`git switch main\`
6. Özelliği merge et: \`git merge feature/user-auth\`

**Pull Request (PR) Nedir?**
Gerçek takımlarda 4. adımdan (branch'ini push'ladıktan) sonra, doğrudan merge etmek yerine GitHub/GitLab üzerinde bir **Pull Request** açardın:

**Pull Request İş Akışı:**
1. Feature branch'ini remote repository'ye push'larsın
2. GitHub/GitLab üzerinde \`feature/user-auth\` branch'inden \`main\` branch'ine bir Pull Request açarsın
3. Takım arkadaşlarına bildirim gider
4. Kodunu inceler, yorum bırakır ve iyileştirmeler önerirler
5. Geri bildirimlere göre değişiklik yapıp tekrar push'larsın
6. Onaylandıktan sonra biri PR'ı main'e merge eder
7. Özelliğin artık ana kod tabanının bir parçası!

**Pull Request'ler Neden Önemli:**
- **Kod Kalitesi**: Birden fazla göz hataları yakalar ve iyileştirmeler önerir
- **Bilgi Paylaşımı**: Takım, değişiklikleri yayına çıkmadan önce öğrenir
- **Dokümantasyon**: PR açıklamaları değişikliklerin NEDEN yapıldığını anlatır
- **Tartışma**: Karmaşık kararlar tartışılır ve kayda geçer
- **Güvenlik**: Bozuk kodun üretime ulaşmasını engeller

Bu seviyede, Git komutlarını öğrenmen için iş akışını doğrudan push ve merge yaptırarak simüle ediyoruz. Gerçek projelerde takım çalışması için her zaman Pull Request kullanırsın!`,
    "workflow.level1.story.realWorldContext":
        "Feature branch iş akışı sektör standardıdır. Geliştiriciler yalıtılmış branch'ler oluşturur, bunları remote repo'lara (GitHub/GitLab) push'lar, kod incelemesi için Pull Request açar ve onaydan sonra merge eder. Bu ortak yaklaşım, kararsız kodun üretime ulaşmasını engeller ve akran incelemesi sayesinde kod kalitesini artırır.",
    "workflow.level1.story.taskIntroduction":
        "Eksiksiz feature branch iş akışında ustalaş: oluştur, commit'le, push'la ve merge et. Profesyonel takımlar her gün özellikleri böyle yayınlar.",

    "workflow.level2.name": "Hotfix İş Akışı",
    "workflow.level2.description": "Acil üretim düzeltmelerini hotfix iş akışıyla yönet",
    "workflow.level2.objective1": "main'den bir hotfix branch'i oluştur",
    "workflow.level2.objective2": "Düzeltmeyi staging'e al ve commit'le",
    "workflow.level2.objective3": "main'e geri dön",
    "workflow.level2.objective4": "hotfix branch'ini merge et",
    "workflow.level2.hint1": "Hotfix'ler doğrudan main/master'dan dallanır",
    "workflow.level2.hint2": "'hotfix/critical-security-patch' gibi açıklayıcı hotfix adları kullan",
    "workflow.level2.hint3": "Hotfix'ler hem main hem de develop branch'lerine geri merge edilmelidir",
    "workflow.level2.hint4": "Takip edebilmek için hotfix sürümlerini mutlaka tag'le",
    "workflow.level2.requirement1.description": "Güvenlik sorunu için bir hotfix branch'i oluştur",
    "workflow.level2.requirement1.success": "Hotfix branch'i oluşturuldu!",
    "workflow.level2.requirement2.description": "Güvenlik düzeltmelerini staging'e al",
    "workflow.level2.requirement2.success": "Güvenlik düzeltmeleri staging'e alındı!",
    "workflow.level2.requirement3.description": "Kritik güvenlik yamasını commit'le",
    "workflow.level2.requirement3.success": "Güvenlik yaması commit'lendi!",
    "workflow.level2.requirement4.description": "main branch'ine geri dön",
    "workflow.level2.requirement4.success": "main branch'ine geçildi!",
    "workflow.level2.requirement5.description": "Hotfix'i main'e merge et",
    "workflow.level2.requirement5.success": "Hotfix başarıyla merge edildi!",
    "workflow.level2.story.title": "Kırmızı Alarm: Üretimde Acil Durum",
    "workflow.level2.story.narrative": `🚨 ACİL: Üretim çöktü! 🚨

Saat 02:47'de telefonun uyarılarla titriyor. Ödeme sistemi hata veriyor ve müşteriler alışverişlerini tamamlayamıyor. Hata takip sistemi, son sürümde kritik bir güvenlik açığının ortaya çıktığını gösteriyor.

Nöbetçi geliştirici olarak şunları yapman gerekiyor:
1. Hemen bir hotfix branch'i oluştur: \`git switch -c hotfix/security-patch\`
2. Koddaki kritik güvenlik sorununu düzelt
3. Düzeltmelerini staging'e al ve commit'le
4. main'e geri dön: \`git switch main\`
5. Hotfix'i merge et: \`git merge hotfix/security-patch\`

Geçen her dakika şirkete büyük para kaybettiriyor. Junior geliştiricileri senior'lardan ayıran şey tam da bu: baskı altında soğukkanlılık ve doğru Git iş akışlarını bilmek.

Vakit nakittir. Hadi bunu düzeltelim!`,
    "workflow.level2.story.realWorldContext":
        "Üretim hotfix'leri sistem kararlılığını korumak için kritiktir ve iş akışının hızla, odaklanarak yürütülmesini gerektirir.",
    "workflow.level2.story.taskIntroduction": "Acil üretim düzeltmeleri için hotfix iş akışında ustalaş.",

    "workflow.level3.name": "Git Flow Ustalığı",
    "workflow.level3.description": "Release branch'leriyle birlikte eksiksiz Git Flow iş akışında ustalaş",
    "workflow.level3.objective1": "develop'tan bir release branch'i oluştur",
    "workflow.level3.objective2": "Sürüm değişikliklerini hazırla ve commit'le",
    "workflow.level3.objective3": "release'i main'e merge et",
    "workflow.level3.objective4": "Sürümü tag'le",
    "workflow.level3.hint1": "develop üzerinde başla ve release branch'i oluştur: 'git switch -c release/2.0.0'",
    "workflow.level3.hint2": "Son düzenlemeleri yap ve sürüm hazırlığını commit'le",
    "workflow.level3.hint3": "main'e geç: 'git switch main'",
    "workflow.level3.hint4": "Sürümü merge et: 'git merge release/2.0.0'",
    "workflow.level3.hint5": "Sürümü tag'le: 'git tag v2.0.0'",
    "workflow.level3.hint6": "Gerçek projelerde ayrıca develop'a da geri merge ederdin",
    "workflow.level3.requirement1.description": "Bir release branch'i oluştur (ör. 'release/2.0.0')",
    "workflow.level3.requirement1.success": "Release branch'i oluşturuldu!",
    "workflow.level3.requirement2.description": "Sürüm hazırlığı değişikliklerini staging'e al",
    "workflow.level3.requirement2.success": "Sürüm değişiklikleri staging'e alındı!",
    "workflow.level3.requirement3.description": "Sürüm hazırlığını net bir mesajla commit'le",
    "workflow.level3.requirement3.success": "Sürüm hazırlığı commit'lendi!",
    "workflow.level3.requirement4.description": "Sürüm merge'üne hazırlanmak için main branch'ine geç",
    "workflow.level3.requirement4.success": "main'e geçildi!",
    "workflow.level3.requirement5.description": "Release branch'ini main'e merge et",
    "workflow.level3.requirement5.success": "Sürüm main'e merge edildi!",
    "workflow.level3.requirement6.description": "Sürümü versiyon numarasıyla tag'le (ör. 'v2.0.0')",
    "workflow.level3.requirement6.success": "Sürüm tag'lendi! Sürüm 2.0.0 artık üretimde yayında!",
    "workflow.level3.story.title": "Sürüm Yöneticisi",
    "workflow.level3.story.narrative": `Tebrikler! Her iki haftada bir saat gibi düzenli yazılım yayınlayan GitFlow Inc. şirketinde Sürüm Yöneticisi olarak terfi ettin.

Görevin, 2.0 sürümünün yayınını yönetmek. Bu sürüm şunları içeriyor:
- Farklı takımlardan üç yeni özellik
- İki kritik hata düzeltmesi
- Performans iyileştirmeleri
- Güncellenmiş dokümantasyon

**Sürüm İş Akışı:**

1. **Release Branch'i Oluştur**: develop'tan başla ve bir release branch'i oluştur
   \`git switch -c release/2.0.0\`

2. **Son Hazırlıklar**: Sürüm numaralarını, CHANGELOG'u vb. güncelle
   - Gereken dosyaları düzenle
   - \`git add .\`
   - \`git commit -m "Prepare release 2.0.0"\`

3. **main'e Merge Et**: Üretime dağıt
   - \`git switch main\`
   - \`git merge release/2.0.0\`

4. **Sürümü Tag'le**: Bu sürümü geçmişte işaretle
   \`git tag v2.0.0\`

Bu, sürüm için kalıcı bir işaret oluşturur. Gerçek projelerde ayrıca şunları da yapardın:
- Senkron kalması için develop'a geri merge etmek
- Release branch'ini silmek
- Her şeyi remote'a push'lamak
- Üretime dağıtmak

Bu, kurumsal seviyede Git yönetimi. Büyükler ligine hoş geldin!`,
    "workflow.level3.story.realWorldContext":
        "Release branch'leri, Git Flow'da üretim sürümlerini hazırlamak için kullanılır. Devam eden geliştirmeyi durdurmadan son hata düzeltmelerinin ve dokümantasyon güncellemelerinin yapılmasına imkân verir. Kolay referans ve gerektiğinde geri dönüş için sürüm tag'lenir.",
    "workflow.level3.story.taskIntroduction":
        "Profesyonel sürüm iş akışını öğren: branch aç, hazırla, merge et ve tag'le. Takımlar kararlı yazılımı üretime böyle çıkarır.",

    // Teamwork Stage
    "teamwork.name": "Takım Çalışması",
    "teamwork.description": "Git iş birliği tekniklerini kullanarak takımlarla verimli çalışmayı öğren",

    "teamwork.level1.name": "Takım Çalışmasının Temelleri",
    "teamwork.level1.description": "Git kullanarak bir takımla nasıl verimli çalışılacağını öğren",
    "teamwork.level1.objective1": "Takımın en güncel kodunu remote'tan pull'la",
    "teamwork.level1.objective2": "Çalışman için yeni bir feature branch'i oluştur",
    "teamwork.level1.objective3": "team.md dosyasını düzenle ve adını takım üyeleri listesine ekle",
    "teamwork.level1.objective4": "Değişikliklerini staging'e al",
    "teamwork.level1.objective5": "Değişikliklerini commit'le",
    "teamwork.level1.objective6": "Değişikliklerini remote repository'ye push'la",
    "teamwork.level1.hint1": "Takımın en güncel kodunu almak için 'git pull origin main' kullan",
    "teamwork.level1.hint2": "'git switch -c feature/YOUR-NAME' ile yeni bir branch oluştur",
    "teamwork.level1.hint3": "Adını ve rolünü eklemek için team.md dosyasını düzenle",
    "teamwork.level1.hint4": "Tüm değişiklikleri 'git add .' ile staging'e al",
    "teamwork.level1.hint5": "Net bir mesajla commit'le: 'git commit -m \"Add my profile\"'",
    "teamwork.level1.hint6":
        "Branch'ini 'git push origin feature/YOUR-NAME' ya da 'git push --set-upstream origin feature/YOUR-NAME' ile push'la",
    "teamwork.level1.requirement1.description": "Takım repository'sindeki en son değişiklikleri pull'la",
    "teamwork.level1.requirement1.success": "En son değişiklikler başarıyla alındı!",
    "teamwork.level1.requirement2.description": "Takım profili için feature branch'ini oluştur",
    "teamwork.level1.requirement2.success": "Feature branch'i oluşturuldu!",
    "teamwork.level1.requirement3.description": "team.md dosyasını düzenle ve adını listeye ekle",
    "teamwork.level1.requirement3.success": "Dosya değiştirildi! Adın eklendi.",
    "teamwork.level1.requirement4.description": "Takım profili değişikliklerini staging'e al",
    "teamwork.level1.requirement4.success": "Değişiklikler staging'e alındı!",
    "teamwork.level1.requirement5.description": "Takım profilini açıklayıcı bir mesajla commit'le",
    "teamwork.level1.requirement5.success": "Takım profili commit'lendi!",
    "teamwork.level1.requirement6.description": "Değişikliklerini remote repository'ye push'la",
    "teamwork.level1.requirement6.success": "Değişiklikler remote'a push'landı!",
    "teamwork.level1.story.title": "Geliştirici Takımına Hoş Geldin",
    "teamwork.level1.story.narrative": `🎉 Tebrikler! Hızla büyüyen teknoloji girişimi InnovateCorp'ta geliştirici olarak işe alındın.

Takım liderin Alex sana ilk gününü anlatıyor:

"Takıma hoş geldin! Burada her şey için Git kullanıyoruz. Kod tabanı ortak çalışma alanımız ve herkes her gün ona katkı veriyor. İlk görevin basit ama önemli - takım sayfamıza kendi profilini ekle."

"Unutma," diye devam ediyor Alex, "bu projede 12 geliştirici çalışıyor. Herkesin senkron kalması gerek. Push'lamadan önce mutlaka \`git pull\` yap ve commit mesajlarının net olmasına dikkat et ki geri kalanımız neyle uğraştığını bilsin."

Görevin:
1. Takım repository'sindeki en güncel kodu al: \`git pull origin main\`
2. Feature branch'ini oluştur: \`git switch -c feature/team-profile\`
3. Geliştirici profilini takım sayfasına ekle
4. Değişiklikleri staging'e al: \`git add .\`
5. Değişiklikleri commit'le: \`git commit -m "Add my profile"\`
6. Branch'ini push'la: \`git push origin feature/team-profile\`

Gerçek hayatta takım geliştirmesi işte böyle olur. Hadi ilk katkını yapalım!`,
    "teamwork.level1.story.realWorldContext":
        "Takım çalışması yazılım geliştirmenin kalbidir. Ortak repository'lerle çalışmayı öğrenmek her geliştirici için şarttır.",
    "teamwork.level1.story.taskIntroduction":
        "Takım tabanlı Git iş akışının temellerini öğren ve ilk ortak katkını yap.",

    "teamwork.level2.name": "Takımlarda Merge Çakışmalarını Çözmek",
    "teamwork.level2.description":
        "Birden fazla geliştirici aynı dosyalar üzerinde çalıştığında oluşan merge çakışmalarını çöz",
    "teamwork.level2.objective1": "Yerel değişikliklerini staging'e al ve commit'le",
    "teamwork.level2.objective2": "Remote değişiklikleri pull'la (çakışmayı tetikler)",
    "teamwork.level2.objective3": "Merge çakışma işaretlerini çöz",
    "teamwork.level2.objective4": "Birleştirilmiş çözümü staging'e al ve commit'le",
    "teamwork.level2.hint1": "Henüz commit'lemediğin değişiklikleri görmek için 'cat /src/auth/login.js' kullan",
    "teamwork.level2.hint2": "Dosyanın değiştiğini doğrulamak için 'git status' kullan",
    "teamwork.level2.hint3": "'git add /src/auth/login.js' ardından 'git commit -m \"message\"' ile commit'le",
    "teamwork.level2.hint4": "'git pull origin main' ile pull'la - bu çakışmayı tetikleyecek!",
    "teamwork.level2.hint5": "Çakışma işaretlerini ara: <<<<<<<, =======, >>>>>>>",
    "teamwork.level2.hint6": "Hem senin hem Sarah'nın iyileştirmelerini birleştirmek için login.js dosyasını düzenle",
    "teamwork.level2.hint7":
        "En iyi çözüm İKİSİNİ de korur: Sarah'nın e-posta kontrolü VE senin daha katı uzunluk kuralların",
    "teamwork.level2.hint8": "Çözdükten sonra: 'git add .' ardından 'git commit -m \"Resolve merge conflict\"'",
    "teamwork.level2.requirement1.description": "login.js dosyasındaki yerel değişikliklerini staging'e al",
    "teamwork.level2.requirement1.success": "Yerel değişiklikler staging'e alındı!",
    "teamwork.level2.requirement2.description": "Önce yerel değişikliklerini commit'le",
    "teamwork.level2.requirement2.success": "Yerel değişiklikler commit'lendi!",
    "teamwork.level2.requirement3.description": "Çakışmayı tetiklemek için Sarah'nın değişikliklerini pull'la",
    "teamwork.level2.requirement3.success":
        "Çakışan değişiklikler alındı! login.js dosyasındaki çakışma işaretlerine bak.",
    "teamwork.level2.requirement4.description": "Çözülen çakışmayı staging'e al",
    "teamwork.level2.requirement4.success": "Çakışma çözümü staging'e alındı!",
    "teamwork.level2.requirement5.description": "Merge çözümünü commit'le",
    "teamwork.level2.requirement5.success": "Merge çakışması çözüldü!",
    "teamwork.level2.story.title": "Büyük Merge Çakışması Krizi",
    "teamwork.level2.story.narrative": `⚠️ İlk merge çakışmana hoş geldin!

**Durum:**
Bu sabah \`/src/auth/login.js\` dosyası üzerinde çalışıyordun. Parola doğrulamasını daha katı hâle getirdin (kullanıcı adı için en az 5, parola için 10 karakter). Eline sağlık!

Ama sen kod yazarken takım arkadaşın Sarah da AYNI DOSYAYA değişiklik push'lamış! E-posta doğrulama mantığı eklemiş. Şimdi ikinizin de aynı kod satırlarının farklı sürümleri var.

**Görevin:**

**1. Yerel değişikliklerini kontrol et:** SENİN iyileştirmelerini görmek için \`cat /src/auth/login.js\` çalıştır (yapıldı ama henüz commit'lenmedi!)

**2. Önce KENDİ değişikliklerini commit'le:**
\` git add /src/auth/login.js
git commit -m "Improve password validation requirements"
\`

**3. Şimdi Sarah'nın değişikliklerini pull'lamayı dene:**
\` git pull origin main \`

**4. 💥 MERGE ÇAKIŞMASI!** Sen ve Sarah aynı satırları değiştirdiğiniz için Git otomatik merge yapamıyor! Dosyada çakışma işaretlerini göreceksin:
\`<<<<<<< HEAD
(senin değişikliklerin)
=======
(Sarah'nın değişiklikleri)
>>>>>>> abc1234\`

**5. Çakışmayı çöz:**
- İki sürümün en iyi taraflarını birleştirmek için \`/src/auth/login.js\` dosyasını düzenle
- Çakışma işaretlerini kaldır (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`)
- Hem senin daha katı parola uzunluğunu HEM de Sarah'nın e-posta doğrulamasını koru!

**6. Merge'ü tamamla:**
\`git add .
git commit -m "Merge Sarah's email validation with my password improvements"\`

**Pro İpucu:** En iyi çözüm çoğu zaman her iki değişikliği de birleştirir! Bu durumda şunları koru:
- Sarah'nın e-posta doğrulama mantığı (\`username.includes('@')\`)
- Senin daha katı uzunluk kuralların (\`username.length >= 5\` ve \`password.length >= 10\`)

Bu, takım geliştirmesinde tamamen normaldir! Merge çakışmaları, birden fazla geliştirici aynı kod üzerinde çalıştığında ortaya çıkar. Önemli olan onları düşünerek çözmek.`,
    "teamwork.level2.story.realWorldContext":
        "Takım geliştirmesinde merge çakışmaları kaçınılmazdır. Onları hızlı ve doğru şekilde çözmeyi öğrenmek kritik bir beceridir.",
    "teamwork.level2.story.taskIntroduction":
        "Kendine güvenen bir takım oyuncusu olmak için merge çakışması çözmede ustalaş.",

    "teamwork.level3.name": "Kod İnceleme İş Akışı",
    "teamwork.level3.description":
        "Kod incelemelerine katılmayı ve pull request'ler üzerinden iş birliği yapmayı öğren",
    "teamwork.level3.objective1": "Yeni bir feature branch'i oluştur",
    "teamwork.level3.objective2": "Tamamladığın çalışmayı staging'e al",
    "teamwork.level3.objective3": "Net bir mesajla commit'le",
    "teamwork.level3.objective4": "Takım incelemesi için branch'ini push'la",
    "teamwork.level3.hint1": "Bir feature branch'i oluştur: git switch -c feature/password-reset",
    "teamwork.level3.hint2": "Alternatif (klasik): git checkout -b feature/password-reset",
    "teamwork.level3.hint3": "Tüm değişiklikleri staging'e al: git add .",
    "teamwork.level3.hint4": 'Açıklayıcı bir mesajla commit\'le: git commit -m "Add password reset functionality"',
    "teamwork.level3.hint5": "Remote'a push'la: git push origin feature/password-reset",
    "teamwork.level3.hint6": "Kısayolla alternatif: git push -u origin feature/password-reset",
    "teamwork.level3.hint7":
        "Not: Oluşturduğun branch adını kullan (farklı bir ad seçtiysen 'feature/password-reset' değil)",
    "teamwork.level3.requirement1.description": "Kod incelemesi denemesi için bir branch oluştur",
    "teamwork.level3.requirement1.success": "Feature branch'i oluşturuldu! ✨",
    "teamwork.level3.requirement2.description": "Kodunu inceleme için staging'e al",
    "teamwork.level3.requirement2.success": "Kod inceleme için staging'e alındı! 📦",
    "teamwork.level3.requirement3.description": "Net ve incelenebilir bir mesajla commit'le",
    "teamwork.level3.requirement3.success": "Kod net bir mesajla commit'lendi! 💬",
    "teamwork.level3.requirement4.description": "Kod incelemesi için branch'ini push'la",
    "teamwork.level3.requirement4.success":
        "Kod takım incelemesi için push'landı! 🚀 Gerçek takımlarda şimdi bir Pull Request açardın!",
    "teamwork.level3.story.title": "Kod İnceleme Kültürü",
    "teamwork.level3.story.narrative": `📝 InnovateCorp'un Kod İnceleme Sürecine hoş geldin!

**Durum:**
Parola sıfırlama özelliğini az önce tamamladın. Kod yerel testlerinde kusursuz çalışıyor! 🎉

Ama dur - InnovateCorp'ta hiçbir kod, incelemeden geçmeden üretime çıkmaz. Bu bir güven meselesi değil; kalite, bilgi paylaşımı ve hataları müşteriler görmeden yakalama meselesi.

**Kod İncelemeleri Neden Önemli:**
- **Kalite:** Sarah senin gözünden kaçan bir güvenlik sorununu yakalayabilir
- **Bilgi Paylaşımı:** Mike senin zekice çözümünden bir şeyler öğrenir
- **Daha İyi Kod:** Farklı bakış açıları daha iyi yazılım çıkarır
- **Takımın Gelişimi:** Herkes daha iyi bir geliştiriciye dönüşür

**Görevin:**
Parola sıfırlama özelliğini takım incelemesine hazırlaman gerekiyor. Profesyonel iş akışını izle:

**1. Adım: Bir Feature Branch Oluştur**
Asla doğrudan \`main\` üzerinde çalışma! Özelliğin için ayrı bir branch aç.

**2. Adım: Çalışmanı Staging'e Al**
Tamamladığın dosyaları staging alanına ekle.

**3. Adım: Net Bir Mesajla Commit'le**
Ne yaptığını anlatan bir commit mesajı yaz. Takım arkadaşların, kodun her satırını okumadan değişikliklerini anlayabilmeli.

**4. Adım: Remote'a Push'la**
Takımının inceleyebilmesi için feature branch'ini yükle. Gerçek takımlarda bunun ardından GitHub/GitLab üzerinde bir Pull Request açardın.

**Unutma:** Harika kod incelemelerinin anahtarı net iletişimdir. Branch adın, commit mesajların ve kodun bir hikâye anlatmalı!

Hadi kodunu takım için hazırlayalım! 🚀`,
    "teamwork.level3.story.realWorldContext":
        "Kod incelemeleri profesyonel geliştirmede standart uygulamadır. Kod kalitesini artırır, hataları erken yakalar ve takımların birbirinden öğrenmesini sağlar. Çoğu şirket bu süreç için Pull Request (GitHub) ya da Merge Request (GitLab) kullanır.",
    "teamwork.level3.story.taskIntroduction":
        "Kodu takım incelemesine hazırlamanın profesyonel iş akışını öğren: branch açma, commit'leme ve push'lama adımları.",

    // Archaeology Stage
    "archaeology.name": "Git Arkeolojisi",
    "archaeology.description": "Kod geçmişini araştır ve bir dedektif gibi Git incelemesi yap",

    // Mastery Stage
    "mastery.name": "Git Ustalığı",
    "mastery.description": "Gerçek ustalar için nihai Git görevleri",

    "mastery.level1.name": "Çok Branch'li Merge Görevi",
    "mastery.level1.description": "Çakışmalı, birden fazla branch içeren karmaşık merge'lerde ustalaş",
    "mastery.level1.objective1": "Birden fazla feature branch'ini aynı anda merge et",
    "mastery.level1.objective2": "Karmaşık merge çakışmalarını çöz",
    "mastery.level1.objective3": "Çözülen çakışmaları staging'e al",
    "mastery.level1.objective4": "Çok yönlü merge'ü tamamla",
    "mastery.level1.hint1": "Birden fazla branch'i tek seferde birleştirmek için git merge kullan",
    "mastery.level1.hint2": "Her çakışmayı dikkatle incele - birbirlerini etkileyebilirler",
    "mastery.level1.hint3": "En iyi çözüm çoğu zaman tüm branch'lerden parçaları bir araya getirir",
    "mastery.level1.hint4": "Commit'lemeden önce birleştirdiğin kodu test et",
    "mastery.level1.requirement1.description": "Tüm feature branch'lerini main'e merge et",
    "mastery.level1.requirement1.success": "Karmaşık merge başlatıldı! Şimdi çakışmaları çöz.",
    "mastery.level1.requirement2.description": "Çözülen tüm dosyaları staging'e al",
    "mastery.level1.requirement2.success": "Çakışmalar çözüldü ve staging'e alındı!",
    "mastery.level1.requirement3.description": "Merge'ü bir commit ile tamamla",
    "mastery.level1.requirement3.success": "Usta seviyesi merge tamamlandı! Çok yönlü merge'leri fethettin!",
    "mastery.level1.story.title": "Entegrasyon Sınavı",
    "mastery.level1.story.narrative":
        "Üç takım, çeyreklik sürüm için paralel olarak çalışıyordu. Her takım kritik özellikleri ayrı branch'lerde geliştirdi. Şimdi entegrasyon günü ve her şeyi birleştirmekten sorumlu baş geliştirici sensin. Zorluk şu: üç branch de ortak yardımcı dosyaları değiştirdi. Tutarlı ve çalışan bir sistem oluşturmak için tüm branch'leri merge edip çakışmaları çözmelisin.",
    "mastery.level1.story.realWorldContext":
        "Karmaşık, çok branch'li merge'ler; birden fazla paralel geliştirme hattı olan büyük projelerde sık görülür. Bu beceride ustalaşmak kıdemli geliştiriciler ve teknik liderler için şarttır.",
    "mastery.level1.story.taskIntroduction":
        "Değişiklikleri örtüşen üç feature branch'ini merge et ve birleşik bir kod tabanı oluşturmak için tüm çakışmaları çöz.",

    "mastery.level2.name": "Git Hook'ları ve Otomasyon",
    "mastery.level2.description":
        "İş akışlarını otomatikleştirmek ve kalite standartlarını uygulatmak için Git hook'ları kur",
    "mastery.level2.objective1": "Kod kalitesi için pre-commit hook'ları oluştur",
    "mastery.level2.objective2": "Bildirimler için post-commit hook'ları ayarla",
    "mastery.level2.objective3": "Sunucu tarafı hook'ları kur",
    "mastery.level2.objective4": "Otomatik iş akışı hatları kur",
    "mastery.level2.hint1": "pre-commit hook'ları, commit oluşturulmadan önce çalışır",
    "mastery.level2.hint2": "post-commit hook'ları, başarılı commit'lerden sonra çalışır",
    "mastery.level2.hint3": "pre-commit hook'larında commit'i engellemek için çıkış kodlarını kullan",
    "mastery.level2.hint4": "Sunucu tarafı hook'ları neyin push'lanabileceğini denetler",
    "mastery.level2.requirement1.description": "pre-commit hook'unu çalıştırılabilir yap",
    "mastery.level2.requirement1.success": "pre-commit hook'u etkinleştirildi!",
    "mastery.level2.requirement2.description": "pre-commit hook'unu test etmek için dosyaları staging'e al",
    "mastery.level2.requirement2.success": "Dosyalar staging'e alındı!",
    "mastery.level2.requirement3.description": "Kalite kontrollerini tetiklemek için bir commit dene",
    "mastery.level2.requirement3.success": "Kalite kontrollerinden geçildi!",
    "mastery.level2.story.title": "Kalite Bekçisi",
    "mastery.level2.story.narrative": `⚡ DevOps Mühendisliğine terfi ettin ve ilk görevin "Kalite Bekçisi"ni hayata geçirmek - kötü kodun repository'ye girmesini engelleyen otomatik bir sistem.

Geliştirme takımı hızla büyüyor ve büyümeyle birlikte tutarsızlık da geliyor:
- Düzgün test edilmeden atılan commit'ler
- Kod stili ihlalleri
- Yanlışlıkla commit'lenen gizli anahtarlar
- main'e push'lanan bozuk build'ler

Takım liderin Sarah vizyonu anlatıyor:

"Kalite standartlarımızı uygulatmak için otomasyona ihtiyacımız var. Her commit otomatik olarak şunlar açısından kontrol edilmeli:
- Lint ve kod stili
- Birim testlerin geçmesi
- Güvenlik açıkları
- Commit mesajı standartları"

"Git hook'ları bunun için birebir. Git iş akışının belirli noktalarında çalışan betiklerdir. Onları, kodun geçmesi gereken kalite kapıları gibi düşün."

Hook ekosistemi:
- pre-commit: Commit oluşturulmadan önce kontrolleri çalıştırır
- pre-push: Remote'a push'lamadan önce doğrulama yapar
- post-commit: Bildirim gönderir veya build tetikler
- Sunucu tarafı hook'lar: Neyin push'lanabileceğini denetler

Görevin:
1. Kalite kontrolleri için bir pre-commit hook'u kur
2. Otomatik test ve lint ayarla
3. Bildirim sistemleri oluştur
4. Kapsamlı bir kalite hattı kur

Bu, takımındaki her geliştiriciye fayda sağlayacak bir altyapı işi. Sadece kod yazmıyorsun - kod kalitesinin temelini atıyorsun.`,
    "mastery.level2.story.realWorldContext":
        "Git hook'ları, profesyonel geliştirme ortamlarında otomatik kalite güvencesi ve iş akışı otomasyonu kurmak için vazgeçilmezdir.",
    "mastery.level2.story.taskIntroduction":
        "Standartları uygulatan ve takım verimliliğini artıran otomatik kalite sistemleri kurmak için Git hook'larında ustalaş.",

    "mastery.level3.name": "Git Ustalığı: Son Sınav",
    "mastery.level3.description":
        "Karmaşık ve gerçekçi bir senaryoyu çözmek için tüm ileri seviye Git tekniklerini bir araya getir",
    "mastery.level3.objective1": "Birden fazla hotfix içeren karmaşık bir sürümü yönet",
    "mastery.level3.objective2": "Acil geri dönüşleri ve kurtarma işlemlerini yönet",
    "mastery.level3.objective3": "Aynı anda birden fazla takımla koordinasyon kur",
    "mastery.level3.objective4": "Tüm tekniklere hâkim olduğunu göster",
    "mastery.level3.hint1": "Bu görev, öğrendiğin her şeyi bir araya getiriyor",
    "mastery.level3.hint2": "Branch yönetimi konusunda stratejik düşün",
    "mastery.level3.hint3": "İletişim, teknik beceriler kadar önemlidir",
    "mastery.level3.hint4": "Kararlarını takım için belgelendir",
    "mastery.level3.requirement1.description": "Acil geri dönüş için bir branch oluştur",
    "mastery.level3.requirement1.success": "Acil durum prosedürleri başlatıldı!",
    "mastery.level3.requirement2.description": "Kritik düzeltmeleri cherry-pick'le",
    "mastery.level3.requirement2.success": "Kritik düzeltmeler uygulandı!",
    "mastery.level3.requirement3.description": "Acil sürümü tag'le",
    "mastery.level3.requirement3.success": "Acil sürüm tag'lendi!",
    "mastery.level3.requirement4.description": "Acil sürüm tag'lerini push'la",
    "mastery.level3.requirement4.success": "🎉 USTALIĞA ULAŞTIN! Artık bir Git Ustasısın!",
    "mastery.level3.story.title": "Nihai Git Sınavı: Black Friday Krizi",
    "mastery.level3.story.narrative": `🚨 BLACK FRIDAY, SABAH 02:00 - NİHAİ SINAV

MegaCorp'ta Kıdemli DevOps Mühendisisin ve yılın en yoğun alışveriş gününde Git sorunlarının mükemmel fırtınasıyla karşı karşıyasın.

Durum:
- Hatalı bir dağıtım yüzünden üretim kısmen bozuk
- Üç ayrı takım aynı anda hotfix push'ladı
- Ödeme sistemi ara ara hata veriyor
- Müşteri desteği yetişemiyor
- CEO saatlik güncelleme istiyor
- Black Friday trafiği normalin 50 katı

CTO'n acil bir toplantı çağırıyor:

"Seni bu yüzden işe aldık. İnşa ettiğimiz her şey, öğrendiğimiz her şey bu ana bakıyor. Aşırı baskı altında karmaşık Git işlemlerini yürütebilecek birine ihtiyacımız var."

Bu sınav şunları kapsıyor:
1. **Acil Geri Dönüş**: Sorunlu dağıtımı hızla geri al
2. **Seçici Kurtarma**: Yalnızca sağlam değişiklikleri cherry-pick'le
3. **Hotfix Koordinasyonu**: Birden fazla takımdan gelen kritik düzeltmeleri merge et
4. **Sürüm Yönetimi**: Acil yamalar oluştur ve dağıt
5. **Takım İletişimi**: Geliştirme, QA ve operasyon arasında koordinasyonu sağla

Cephanendeki her Git tekniğini kullanmalısın:
- Dağınık commit'leri toparlamak için \`git rebase -i\`
- Yalnızca çalışan özellikleri seçmek için \`git cherry-pick <commit-hash>\` (belirli commit'leri bir branch'ten diğerine kopyalar)
- Takımların emeğini birleştirmek için \`git merge\` ile ileri seviye merge
- Sorunlu commit'i tam olarak bulmak için \`git bisect\` (hataları bulmak üzere geçmişte ikili arama yapar)
- Hatalardan kurtulmak için \`git reflog\`
- Sürüm yönetimi için \`git tag\` ve branch'ler
- Git geçmişini koruyarak dosya taşımak veya yeniden adlandırmak için \`git mv <old> <new>\`

**git cherry-pick nedir?**
Cherry-pick, belirli commit'leri bir branch'ten diğerine kopyalamanı sağlar. Branch'lerin tamamını merge etmek yerine tek tek commit'leri seçebilirsin. Bir branch'teki hotfix'leri başka bir branch'e uygulamak için birebir!

Örnek: \`git cherry-pick abc123\` - abc123 commit'ini mevcut branch'ine uygular

**git bisect nedir?**
Bisect, hangi commit'in hatayı getirdiğini ikili arama ile bulmana yardımcı olur. Git senin test etmen için commit'leri checkout eder, sen de "good" ya da "bad" dersin; sorunlu commit bulunana kadar bu böyle sürer.

Örnek:
\`git bisect start\`
\`git bisect bad\` (mevcut commit bozuk)
\`git bisect good abc123\` (bu eski commit çalışıyordu)
Git bundan sonra, ilk bozuk commit'i bulana dek test edeceğin commit'lerde sana rehberlik eder!

**git mv nedir?**
Git geçmişini bozmadan dosya taşımanı veya yeniden adlandırmanı sağlar. Dosyaları elle yeniden adlandırmaktan daha iyidir; çünkü Git ad değişikliğini takip eder.

Örnek: \`git mv old-name.js new-name.js\`

Bu iş sadece Git komutlarıyla ilgili değil - liderlikle, baskı altında karar vermekle ve her şey yanarken sistematik düşünebilmekle ilgili.

Şirketin Black Friday geliri sana bağlı. Milyonlarca müşteri bekliyor. Takımın yol göstermeni bekliyor.

Bu senin anın. Bir Git Ustası'nın neler yapabileceğini onlara göster.

Ustalığını kanıtlamaya hazır mısın? Saat işliyor...`,
    "mastery.level3.story.realWorldContext":
        "Gerçek hayatta Git ustalığı; baskı altında karmaşık işlemleri yürütmeyi, birden fazla paydaşı idare etmeyi ve iş süreçlerini etkileyen kritik kararlar almayı kapsar.",
    "mastery.level3.story.taskIntroduction":
        "Bu, nihai Git sınavı - karmaşık ve yüksek baskılı bir acil durum senaryosunu yönetmek için tüm becerilerini birleştir.",

    // Archaeology Stage Levels
    "archaeology.level1.name": "Git Blame - Kod Arkeolojisi",
    "archaeology.level1.description": "Değişiklikleri anlamak ve hataların kaynağını bulmak için kod geçmişini araştır",
    "archaeology.level1.objective1":
        "src/utils/validator.js dosyasındaki her satırı hangi commit'in en son değiştirdiğini görmek için git blame kullan",
    "archaeology.level1.objective2": "Commit geçmişine kısa ve öz bir bakış için git log --oneline kullan",
    "archaeology.level1.objective3": "Belirli bir commit'in tüm ayrıntılarını incelemek için git show kullan",
    "archaeology.level1.hint1":
        "Her satırı hangi commit'in en son değiştirdiğini görmek için `git blame src/utils/validator.js` çalıştır",
    "archaeology.level1.hint2":
        "Dosyanın belirli bir bölümüne odaklanmak için `git blame -L 10,20 src/utils/validator.js` gibi bir satır aralığı ekle",
    "archaeology.level1.hint3":
        "Tüm commit'lerin kısa hash'leriyle birlikte özet bir geçmişini görmek için `git log --oneline` çalıştır",
    "archaeology.level1.hint4":
        "Log'dan bir commit hash'i kopyala ve tam olarak neyin değiştiğini görmek için `git show <hash>` (veya `git show HEAD`) çalıştır",
    "archaeology.level1.requirement1.description":
        "Her satırı hangi commit'in en son değiştirdiğini görmek için src/utils/validator.js üzerinde git blame çalıştır",
    "archaeology.level1.requirement1.success": "Kodun yazarı ortaya çıktı!",
    "archaeology.level1.requirement2.description": "Özet bir commit geçmişi görmek için git log --oneline çalıştır",
    "archaeology.level1.requirement2.success": "Son geçmiş incelendi!",
    "archaeology.level1.requirement3.description":
        "Tam ayrıntılarını görmek için bir commit üzerinde git show çalıştır, örn. git show HEAD",
    "archaeology.level1.requirement3.success": "Commit ayrıntıları analiz edildi!",
    "archaeology.level1.story.title": "Gizemli Hata Vakası",
    "archaeology.level1.story.narrative":
        "Doğrulama kodundaki kritik bir hata, Avrupalı müşterilerin %23'ünü etkiliyor. Bu kod 18 ay boyunca 4 farklı geliştirici tarafından yazılmış. Kıdemli geliştiricin açıklıyor: 'Kod arkeolojisine hoş geldin! Git yalnızca bir sürüm kontrol sistemi değil - aynı zamanda senin zaman makinen. Her satırın bir hikâyesi var.' Her satırı hangi commit'in en son değiştirdiğini görmek için `git blame src/utils/validator.js` ile başla, ardından kodun neden böyle yazıldığını anlamak için `git log --oneline` ve `git show` kullan.",
    "archaeology.level1.story.realWorldContext":
        "Kod arkeolojisi becerileri; zaman içinde birçok katkıcının çalıştığı büyük ve uzun ömürlü kod tabanlarını sürdürebilmek için şarttır.",
    "archaeology.level1.story.taskIntroduction":
        "Git'in inceleme araçlarıyla kod geçmişini araştırmayı ve hataların kaynağını bulmayı öğren: git blame, git log ve git show.",

    "archaeology.level2.name": "Git Log ile Commit Soruşturması",
    "archaeology.level2.description": "Karmaşık kod geçmişini araştırmanın ileri seviye tekniklerinde ustalaş",
    "archaeology.level2.objective1": "Commit mesajlarında bir anahtar kelime aramak için git log --grep kullan",
    "archaeology.level2.objective2": "Eklenen veya kaldırılan belirli bir metni bulmak için git log -S kullan",
    "archaeology.level2.objective3": "Commit'leri belirli bir kişiye göre filtrelemek için git log --author kullan",
    "archaeology.level2.hint1": "Commit mesajlarında 'security' aramak için `git log --grep=security` çalıştır",
    "archaeology.level2.hint2":
        "Kodda 'password' kelimesini ekleyen veya kaldıran commit'leri bulmak için `git log -S password` çalıştır",
    "archaeology.level2.hint3": "Yalnızca Sarah'nın commit'lerini görmek için `git log --author=Sarah` çalıştır",
    "archaeology.level2.hint4": "Daha kısa bir çıktı için bunları `--oneline` ile birleştirebilirsin",
    "archaeology.level2.requirement1.description": "git log --grep=security ile commit mesajlarında 'security' ara",
    "archaeology.level2.requirement1.success": "Güvenlikle ilgili commit'ler bulundu!",
    "archaeology.level2.requirement2.description":
        "git log -S password ile 'password' kelimesini ekleyen veya kaldıran commit'leri bul",
    "archaeology.level2.requirement2.success": "Parolayla ilgili değişiklikler izlendi!",
    "archaeology.level2.requirement3.description": "git log --author=Sarah ile Sarah'nın tüm commit'lerini bul",
    "archaeology.level2.requirement3.success": "Sarah'nın katkı geçmişi analiz edildi!",
    "archaeology.level2.story.title": "Güvenlik Denetim İzi",
    "archaeology.level2.story.narrative":
        "Şirketin bir güvenlik denetiminden geçti. Denetçiler güvenlikle ilgili tüm değişikliklerin eksiksiz geçmişini istiyor: kimlik doğrulama, parola işleme, şifreleme. Kod tabanında 3 yıla yayılmış 2.847 commit var. Güvenlik lideriniz Git'in arama yeteneklerini anlatıyor: mesajlar için --grep, kod içeriği için -S, katkıcılar için --author. İleri seviye git log teknikleriyle kapsamlı bir denetim izi oluştur.",
    "archaeology.level2.story.realWorldContext":
        "İleri seviye git log teknikleri; güvenlik denetimleri, kod incelemeleri ve karmaşık proje geçmişlerini anlamak için vazgeçilmezdir.",
    "archaeology.level2.story.taskIntroduction":
        "Kapsamlı kod geçmişi araştırması ve adli analiz için ileri seviye git log tekniklerinde ustalaş.",

    "archaeology.level3.name": "Git Reflog - Zaman Makinesi",
    "archaeology.level3.description":
        "Kaybolan commit'leri kurtarmak ve repository durum değişikliklerini anlamak için Git reflog kullan",
    "archaeology.level3.objective1":
        "'Kaybolan' commit'ler dahil HEAD'in tüm hareketlerini görmek için git reflog kullan",
    "archaeology.level3.objective2":
        "Kaybolan çalışmayı geri getirmek için bir reflog referansıyla (örn. HEAD@{0}) git reset --hard kullan",
    "archaeology.level3.objective3":
        "Kurtarılan commit'leri saklamak için bir reflog kaydına işaret eden bir branch oluştur",
    "archaeology.level3.hint1":
        "`git reflog`, HEAD'in işaret ettiği - 'silinmiş' görünenler dahil - her commit'i listeler",
    "archaeology.level3.hint2":
        "Her reflog kaydının `HEAD@{0}`, `HEAD@{1}` gibi bir referansı vardır - en son işlem `HEAD@{0}`'dır",
    "archaeology.level3.hint3": "Branch'i o commit'e geri döndürmek için `git reset --hard <reflog-referansı>` kullan",
    "archaeology.level3.hint4":
        "Ayrıca yeni bir branch'i doğrudan bir reflog kaydına işaret ettirebilirsin: `git branch <isim> <reflog-referansı>`",
    "archaeology.level3.requirement1.description": "Son HEAD hareketlerini görmek için git reflog çalıştır",
    "archaeology.level3.requirement1.success": "Reflog geçmişi incelendi!",
    "archaeology.level3.requirement2.description":
        "Kaybolan commit'i git reset --hard ve bir reflog referansıyla geri getir, örn. git reset --hard HEAD@{0}",
    "archaeology.level3.requirement2.success": "Repository durumu geri getirildi!",
    "archaeology.level3.requirement3.description":
        "Bir reflog kaydına işaret eden bir kurtarma branch'i oluştur, örn. git branch recovery HEAD@{1}",
    "archaeology.level3.requirement3.success": "Kurtarma branch'i oluşturuldu!",
    "archaeology.level3.story.title": "Büyük Git Felaket Kurtarma Operasyonu",
    "archaeology.level3.story.narrative":
        "Saat cuma 16:30. Takım arkadaşın Jake panik hâlinde: 'Yanlışlıkla git reset --hard çalıştırdım ve iki haftalık emeğimi kaybettim! Kimlik doğrulama sistemi, arayüz bileşenleri, testler - hepsi gitti!' Ama sen biliyorsun: Git asla unutmaz. Git reflog her commit'i, branch geçişini, merge'ü ve reset'i kaydeder. 'Silinmiş' commit'ler bile reflog'da 90 gün durur. Görevin: `git reflog` çalıştır, kaybolan commit'leri bul ve Jake'in çalışmasını `git reset --hard` ile ve bir kurtarma branch'i oluşturarak geri getir. Kahraman olma vakti!",
    "archaeology.level3.story.realWorldContext":
        "Git reflog, geliştiricileri felaket boyutundaki veri kayıplarından kurtarabilen güçlü bir kurtarma aracıdır.",
    "archaeology.level3.story.taskIntroduction":
        "'Kaybolan' çalışmayı kurtarıp takım arkadaşlarının gününü kurtaran kahraman olmak için Git reflog'da ustalaş.",

    // Intro Level 4
    "intro.level4.name": "Değişiklikleri İnceleme",
    "intro.level4.description": "Dosyalarında tam olarak neyin değiştiğini gör",
    "intro.level4.objective1": "Hangi dosyaların değiştiğini bul",
    "intro.level4.objective2": "Değişiklikleri satır satır incele",
    "intro.level4.hint1": "Hangi dosyaların değiştiğini görmek için `git status` kullan",
    "intro.level4.hint2": "O dosyaların içindeki değişiklikleri tam olarak görmek için `git diff` kullan",
    "intro.level4.hint3": "Tek bir dosyayı incelemek için `git diff <file>` de çalıştırabilirsin",
    "intro.level4.requirement1.description": "Hangi dosyaların değiştiğini kontrol et",
    "intro.level4.requirement1.success": "Güzel! `git status`, src/config.js dosyasının değiştiğini gösteriyor.",
    "intro.level4.requirement2.description": "Değişiklikleri git diff ile tam olarak göster",
    "intro.level4.requirement2.success":
        "Harika! Artık herhangi bir şey commit'lenmeden önce hangi satırların değiştiğini tam olarak görebiliyorsun.",
    "intro.level4.story.title": "Gizemli Değişiklik",
    "intro.level4.story.narrative":
        'TechStart\'ta pazartesi sabahı. Alex endişeli bir ifadeyle masana koşuyor.\n\n"Sarah cuma günü çıkmadan önce site yapılandırmasında bir şey değiştirmiş - ama şu an tatilde ve biz bugün sürüm çıkıyoruz. Tam olarak neyi değiştirdiğini bilmem lazım."\n\nAçıklıyor: "`git status` sana yalnızca HANGİ dosyaların değiştiğini söyler. İçlerinde NEYİN değiştiğini görmek için `git diff` kullanırız. Çalışma dosyalarını son commit ile karşılaştırır ve eklenen, silinen her satırı gösterir."\n\n"Önce repository\'nin durumunu kontrol et, sonra değişikliği `git diff` ile incele. + ile başlayan satırlar eklenmiş, - ile başlayanlar silinmiştir."',
    "intro.level4.story.realWorldContext":
        "Geliştiriciler `git diff` komutunu günde defalarca çalıştırır - özellikle de commit'lemeden hemen önce. Kendi değişikliklerini önce gözden geçirmek; hata ayıklama bayraklarını, unutulmuş test kodlarını ve gizli anahtarları proje geçmişine karışmadan yakalamanın yoludur.",
    "intro.level4.story.taskIntroduction":
        "Değişen dosyayı bulmak için `git status`, tam olarak neyin değiştiğini görmek için `git diff` kullan.",

    // Files Level 4
    "files.level4.name": "Dosyaları Yeniden Adlandırma",
    "files.level4.description": "Bir dosyayı Git ile yeniden adlandır ve geçmişini koru",
    "files.level4.objective1": "git mv kullanarak src/app-config.js dosyasını src/config.js olarak yeniden adlandır",
    "files.level4.objective2": "Ad değişikliğini açıklayıcı bir mesajla commit'le",
    "files.level4.hint1": "`git mv <old-name> <new-name>` komutunu kullan",
    "files.level4.hint2": "`git mv` dosyayı yeniden adlandırır ve değişikliği tek adımda staging'e alır",
    "files.level4.hint3": "Ad değişikliğini kayda geçirmek için `git commit -m 'Your message'` ile bitir",
    "files.level4.requirement1.description": "Dosyayı git mv kullanarak yeniden adlandır",
    "files.level4.requirement1.success":
        "Güzel! Git dosyayı yeniden adlandırdı ve değişikliği senin için staging'e aldı.",
    "files.level4.requirement2.description": "Ad değişikliğini bir mesajla commit'le",
    "files.level4.requirement2.success": "Mükemmel! Ad değişikliği artık proje geçmişinin bir parçası.",
    "files.level4.story.title": "Derli Toplu Bir Kod Tabanı",
    "files.level4.story.narrative":
        '"Kod incelemesinden önce bir şey daha," diyor Alex, dosya ağacını göstererek. "Takımca kısa ve tutarlı dosya adları kullanmaya karar vermiştik. app-config.js yalnızca config.js olmalı."\n\nEkliyor: "Sakın dosya gezgininden elle yeniden adlandırma! Onun yerine `git mv` kullan - dosyayı yeniden adlandırır ve değişikliği tek adımda staging\'e alır; böylece Git dosyanın geçmişini takip etmeye devam eder."',
    "files.level4.story.realWorldContext":
        "Projeler büyüdükçe ve adlandırma kuralları değiştikçe dosyaları yeniden adlandırmak sürekli karşılaşılan bir iştir. `git mv` sayesinde Git, alakasız bir silme ile yepyeni bir dosya görmek yerine ad değişikliğini temiz biçimde kaydeder.",
    "files.level4.story.taskIntroduction":
        "src/app-config.js dosyasını `git mv` ile src/config.js olarak yeniden adlandır ve ardından değişikliği commit'le.",

    // Branches Level 6
    "branches.level6.name": "Branch Temizliği",
    "branches.level6.description":
        "Repository'ni derli toplu tutmak için merge edilmiş ve terk edilmiş branch'leri sil",
    "branches.level6.objective1": "Merge edilmiş feature/search-filters branch'ini sil",
    "branches.level6.objective2": "Terk edilmiş experiment/new-ui branch'ini zorla sil",
    "branches.level6.hint1": "Hangi branch'lerin hâlâ durduğunu görmek için `git branch` çalıştır",
    "branches.level6.hint2":
        "`git branch -d feature/search-filters` kullan - küçük harfli -d yalnızca tamamen merge edilmiş branch'leri siler",
    "branches.level6.hint3":
        "Git, merge edilmemiş branch'leri -d ile silmeyi reddeder. Silmeyi zorlamak için `git branch -D experiment/new-ui` kullan",
    "branches.level6.requirement1.description":
        "git branch -d kullanarak merge edilmiş feature/search-filters branch'ini sil",
    "branches.level6.requirement1.success":
        "Aferin! feature/search-filters'taki her şey zaten main'de olduğu için Git silmeye izin verdi.",
    "branches.level6.requirement2.description":
        "git branch -D kullanarak terk edilmiş experiment/new-ui branch'ini zorla sil",
    "branches.level6.requirement2.success":
        "Mükemmel! -D ile merge edilmemiş denemeyi çöpe attın - branch listen yine tertemiz.",
    "branches.level6.story.title": "Repository'de Bahar Temizliği",
    "branches.level6.story.narrative":
        "\"Branch listemiz iyice kalabalıklaştı,\" diyor Alex, repository'de gezinirken. \"feature/search-filters'taki arama filtreleri haftalar önce main'e merge edildi, experiment/new-ui ise vazgeçtiğimiz bir prototipti.\"\n\nAçıklıyor: \"Merge edilmiş branch için `git branch -d` kullan - küçük harfli -d güvenlidir; çünkü Git hiçbir şeyin kaybolmadığını kontrol eder. Deneme branch'inde ise Git reddedecek, zira commit'leri hiç merge edilmedi. Büyük harfli -D tam da bunun için var: merge edilmemiş çalışma olsa bile branch'i siler, o yüzden yalnızca emin olduğunda kullan.\"",
    "branches.level6.story.realWorldContext":
        "Gerçek projelerde zamanla onlarca eskimiş branch birikir. Merge edilmiş branch'leri düzenli olarak silmek, repository'de gezinmeyi kolaylaştırır. Küçük harfli -d güvenli varsayılandır; çünkü Git merge edilmemiş commit'leri korur. -D ise çalışmayı bilinçli olarak çöpe atar - commit'ler çoğu zaman reflog üzerinden hâlâ kurtarılabilir, ama buna asla güvenmemelisin.",
    "branches.level6.story.taskIntroduction":
        "Önce merge edilmiş feature/search-filters branch'ini `git branch -d` ile sil, ardından terk edilmiş experiment/new-ui branch'ini `git branch -D` ile zorla sil.",

    // Merge Level 4
    "merge.level4.name": "Merge Çakışmalarını Çözme",
    "merge.level4.description": "Bir merge çakışmasını elle çöz ve merge'ü tamamla",
    "merge.level4.objective1": "Hangi dosyanın çakıştığını git status ile kontrol et",
    "merge.level4.objective2":
        "src/api.js dosyasını düzenle, çakışma işaretlerini kaldır ve çözülen dosyayı staging'e al",
    "merge.level4.objective3": "Merge'ü bir commit ile tamamla",
    "merge.level4.hint1": "Hangi dosyaların çakıştığını görmek için `git status` ile başla",
    "merge.level4.hint2":
        "`src/api.js` dosyasını aç ve çakışma işaretlerini kaldır (`<<<<<<<`, `=======`, `>>>>>>>`) — takımın ihtiyaç duyduğu kodu bırak, sonra dosyayı `git add .` ile staging'e al",
    "merge.level4.hint3": "Merge'ü `git commit -m 'Resolve merge conflict'` ile bitir",
    "merge.level4.requirement1.description": "Çakışmayı git status ile incele",
    "merge.level4.requirement1.success":
        "Güzel! Artık hangi dosyanın ilgini beklediğini tam olarak biliyorsun: src/api.js.",
    "merge.level4.requirement2.description": "Çözülen dosyayı staging'e al",
    "merge.level4.requirement2.success": "Harika! Çözülen dosya staging'e alındı — geride hiç çakışma işareti kalmadı.",
    "merge.level4.requirement3.description": "Merge'ü tamamlamak için commit'le",
    "merge.level4.requirement3.success": "Muhteşem! İlk merge çakışmanı tam bir profesyonel gibi çözdün.",
    "merge.level4.story.title": "Artık Kaçmak Yok",
    "merge.level4.story.narrative":
        '"İptal ettiğimiz merge\'ü hatırlıyor musun?" diye soruyor Sarah gülümseyerek. "Rate limiter bugün yayına girmek zorunda — bu sefer geri çekilmek yerine çakışmayı çözüyoruz."\n\nEkranını işaret ediyor: "Git çakışmayı dosyanın tam içine işaretledi. <<<<<<< HEAD ile ======= arasındaki her şey main\'deki bizim sürümümüz, oradan >>>>>>> işaretine kadar olan kısım ise feature/rate-limit\'ten geliyor. Senin işin: dosyayı düzenle, ihtiyacımız olanı bırak, işaretleri sil. Sonra `git add` ve `git commit` — bir merge işte böyle bitirilir."',
    "merge.level4.story.realWorldContext":
        "Çakışma çözmek takım çalışmasında sıradan bir iştir. Adımlar hep aynıdır: 1) çakışan dosyayı aç, 2) hangi kodun kalacağına karar ver (çoğu zaman ikisinin bileşimi), 3) işaretleri kaldır, 4) dosyayı staging'e alıp commit'le. Modern editörler işaretleri senin için vurgular ama altta yatan tam olarak bu iş akışıdır.",
    "merge.level4.story.taskIntroduction":
        "feature/rate-limit branch'inin main'e merge'ü, src/api.js dosyasındaki bir çakışma yüzünden durdu. Durumu kontrol et, dosyadaki çakışmayı çöz, sonra dosyayı staging'e al ve merge'ü bir commit ile tamamla.",

    // Rebase Level 5
    "rebase.level5.name": "Branch Değiştirmeden Rebase",
    "rebase.level5.description":
        "Bir branch'i önce checkout etmeden rebase etmek için git rebase'in iki argümanlı biçimini öğren",
    "rebase.level5.objective1":
        "git rebase'in iki argümanlı biçimini kullanarak feature/payment-api branch'ini main üzerine rebase et",
    "rebase.level5.hint1":
        "İki argüman verebilirsin: `git rebase <upstream> <branch>` — Git, `<branch>` branch'ini checkout eder ve tek adımda `<upstream>` üzerine rebase eder",
    "rebase.level5.hint2": "`git rebase main feature/payment-api` komutunu dene — önce branch değiştirmene gerek yok",
    "rebase.level5.requirement1.description": "İki argümanlı biçimle feature/payment-api'yi main üzerine rebase et",
    "rebase.level5.requirement1.success":
        "Harikasın! feature/payment-api'yi tek bir komutla main üzerine rebase ettin — branch değiştirmeye hiç gerek kalmadı.",
    "rebase.level5.story.title": "Tek Komut, İki Argüman",
    "rebase.level5.story.narrative":
        '"Ödemeler sürümünü bu gece yayınlıyoruz," diyor Alex, panoya göz atarak. "Sen main üzerinde sürümü son bir kez kontrol ediyorsun ve feature/payment-api branch\'i yine geride kalmış."\n\nSırıtıyor: "Çoğu kişinin kaçırdığı bir püf noktası var: git rebase ikinci bir argüman alabiliyor. Önce branch değiştirmek yerine, hangi branch\'in rebase edileceğini doğrudan komutta Git\'e söyle — branch\'i checkout edip tek seferde main üzerine yeniden uygular."',
    "rebase.level5.story.realWorldContext":
        "İki argümanlı git rebase <upstream> <branch> biçimi günlük işte kullanışlı bir kısayoldur: <branch> branch'ini checkout eder ve tek adımda <upstream> üzerine rebase eder. Fazladan bir checkout'tan kurtarır ve yoğun sürüm günlerinde işleri akıtır.",
    "rebase.level5.story.taskIntroduction":
        "main üzerindesin. feature/payment-api'yi tek komutla main üzerine rebase et: git rebase main feature/payment-api",

    // Remote Level 4
    "remote.level4.name": "-u ile Upstream Takibi",
    "remote.level4.description": "Upstream'i bir kez ayarla, sonra hiç argüman vermeden push'la",
    "remote.level4.objective1": "login-form branch'ini upstream takibiyle yayınla",
    "remote.level4.objective2": "İyileştirilmiş hata mesajlarını commit'le",
    "remote.level4.objective3": "Tekrar push'la — bu sefer hiç argüman vermeden",
    "remote.level4.hint1":
        "Önce branch'i yayınla: `git push -u origin login-form`. `-u` bayrağı yerel branch'ini remote branch ile ilişkilendirir.",
    "remote.level4.hint2":
        "Sonra rötuşları staging'e alıp commit'le: önce `git add .`, ardından `git commit -m 'Polish login error messages'`",
    "remote.level4.hint3":
        "Upstream ayarlandığı için artık düz bir `git push` yeterli — ne remote adı ne de branch adı gerek.",
    "remote.level4.requirement1.description": "login-form branch'ini `git push -u origin login-form` ile yayınla",
    "remote.level4.requirement1.success":
        "Branch yayınlandı! Git artık login-form'un origin/login-form'u takip ettiğini biliyor.",
    "remote.level4.requirement2.description": "src/login.js içindeki iyileştirilmiş hata mesajlarını commit'le",
    "remote.level4.requirement2.success": "Harika! Rötuşların yerelde commit'lendi — takıma ulaşmasına bir adım kaldı.",
    "remote.level4.requirement3.description": "Yeni commit'ini düz bir `git push` ile gönder",
    "remote.level4.requirement3.success": "Mükemmel! Düz bir `git push` yetti — upstream takibinin gücü işte bu.",
    "remote.level4.story.title": "Bir Kez Ayarla, Hep Push'la",
    "remote.level4.story.narrative":
        "\"Giriş formu harika görünüyor!\" diyor Alex, TechStart'ta sandalyesini masana doğru kaydırarak. \"`login-form` branch'ini yayınla ki takım incelemeye başlasın. Ve kendine bir iyilik yap: `-u` ile push'la. Bu bayrak upstream'i ayarlar — Git, yerel branch'inin hangi remote branch'e ait olduğunu hatırlar.\"\n\nSırıtıyor: \"`src/login.js` içinde hâlâ commit'lenmemiş bir iyileştirme görüyorum — daha dostane hata mesajları. Önce branch'i yayınla, sonra rötuşları commit'leyip tekrar push'la. İyi izle: ikinci seferde düz bir `git push` yeterli olacak. Ne remote adı ne branch adı — Git nereye gideceğini zaten biliyor.\"",
    "remote.level4.story.realWorldContext":
        "Yeni bir branch'in ilk push'u neredeyse her zaman `git push -u origin <branch>` şeklindedir. Upstream ayarlandıktan sonra `git push` ve `git pull` argümansız çalışır, `git status` da remote'un kaç commit önünde ya da gerisinde olduğunu söyleyebilir. Upstream olmadan Git seni o meşhur hatayla durdurur: 'The current branch has no upstream branch.'",
    "remote.level4.story.taskIntroduction":
        "Branch'i `git push -u origin login-form` ile yayınla, sonra iyileştirilmiş hata mesajlarını commit'le ve düz bir `git push` ile gönder.",

    // Workflow Level 4
    "workflow.level4.name": "Kusursuz Commit: Amend",
    "workflow.level4.description": "Hatayı kimse görmeden son commit'ini git commit --amend ile düzelt",
    "workflow.level4.objective1": "Unutulan yapılandırma dosyasını staging'e al",
    "workflow.level4.objective2": "Dosyayı dahil etmek ve mesajı düzeltmek için son commit'ine amend uygula",
    "workflow.level4.objective3": "Düzeltilmiş commit'i remote'a push'la",
    "workflow.level4.hint1":
        "`git status` çalıştır — güncellenen /src/config.js hiç staging'e alınmamış, yani düzeltme commit'in eksik.",
    "workflow.level4.hint2": "Eksik dosyayı `git add src/config.js` (ya da `git add .`) ile staging'e al.",
    "workflow.level4.hint3":
        "Staging'deki dosyayı son commit'ine katmak VE mesajdaki yazım hatasını düzeltmek için `git commit --amend -m 'Fix login timeout'` kullan.",
    "workflow.level4.hint4":
        "Commit hiç push'lanmadığı için burada amend güvenlidir. `git push origin main` ile bitir. Zaten push'lanmış commit'lere asla amend uygulama!",
    "workflow.level4.requirement1.description": "Unutulan yapılandırma dosyasını staging'e al",
    "workflow.level4.requirement1.success": "Dosya staging'e alındı! Artık önceki commit'e katılabilir.",
    "workflow.level4.requirement2.description": "'git commit --amend' ile son commit'e amend uygula",
    "workflow.level4.requirement2.success":
        "Commit düzeltildi! Tek hata, tek temiz commit — yapılandırma dosyası dahil ve mesajda yazım hatası yok.",
    "workflow.level4.requirement3.description": "Düzeltilmiş commit'i 'git push origin main' ile push'la",
    "workflow.level4.requirement3.success":
        "Push'landı! Yazım hatasından kimsenin haberi olmayacak — geçmişin, ilk seferde doğru yapmışsın gibi görünüyor.",
    "workflow.level4.story.title": "Neredeyse Kusursuz Commit",
    "workflow.level4.story.narrative":
        "TechStart'ta cuma günü saat 16:55. Login-timeout hatasının düzeltmesini az önce commit'ledin ve ceketine uzanıyorsun ki takım lideri Alex sandalyesini masana doğru kaydırıyor.\n\n\"Bir dakika — şu son commit'ine bak,\" diyor Alex, ekranı göstererek.\n\n`git log` commit mesajını gösteriyor: **\"Fix login timout\"**. Ah, yazım hatası. `git status` ise daha kötü bir şeyi ortaya çıkarıyor: oturum zaman aşımını gerçekten 30 dakikaya çıkaran dosya olan `src/config.js` hiç staging'e alınmamış. \"Düzeltme\" commit'in, düzeltmenin yalnızca yarısını içeriyor.\n\n\"Panik yapma,\" diye sırıtıyor Alex. \"Henüz push'lamadın. Yani son commit'i, o hata hiç olmamış gibi yeniden yazabiliriz.\"\n\n**`git commit --amend` ne yapar?**\nSon commit'ini düzeltilmiş bir sürümle DEĞİŞTİRİR:\n- Staging'de ne varsa commit'e eklenir\n- `-m` ile bambaşka bir commit mesajı yazabilirsin\n- Eski commit çöpe gider — geçmiş temiz kalır\n\n**Kurtarma planı:**\n1. Unutulan dosyayı staging'e al: `git add src/config.js`\n2. Commit'i yeniden yaz: `git commit --amend -m \"Fix login timeout\"`\n3. Gönder: `git push origin main`\n\n**Altın kural:** Yalnızca HENÜZ push'lanmamış commit'lere amend uygula. Amend geçmişi yeniden yazar — takım arkadaşların eski commit'i çoktan çektiyse her klonda kaosa yol açarsın. Yerelde ve push'lanmamış mı? Gönül rahatlığıyla amend et.",
    "workflow.level4.story.realWorldContext":
        "Bir dosyayı unutmak ya da commit mesajında yazım hatası yapmak her geliştiricinin her hafta başına gelir. `git commit --amend`, geçmişi temiz tutan günlük araçtır: tek mantıksal değişiklik, tek derli toplu commit. Profesyonel takımlar tek bir demir kurala uyar — zaten push'lanmış bir commit'e asla amend uygulama, çünkü paylaşılan geçmişi yeniden yazmak takım arkadaşlarının repository'lerini bozar.",
    "workflow.level4.story.taskIntroduction":
        "Son commit'ini kurtar: unutulan yapılandırma dosyasını staging'e al, commit'e düzeltilmiş bir mesajla amend uygula, sonra kimsenin fark edemeyeceği kadar temiz bir geçmiş push'la.",

    // Reset Level 4
    "reset.level4.name": "Revert ile Güvenli Geri Alma",
    "reset.level4.description": "Geçmişi yeniden yazmadan herkese açık bir commit'i geri al",
    "reset.level4.objective1": "Hatalı commit'i bulmak için geçmişi incele",
    "reset.level4.objective2": "Son commit'i revert ile güvenle geri al",
    "reset.level4.hint1": "Derli toplu bir geçmiş görmek için `git log --oneline` kullan",
    "reset.level4.hint2": "`git revert HEAD`, son commit'i geri alan yeni bir commit oluşturur",
    "reset.level4.hint3":
        "`git reset`in aksine revert, takım arkadaşlarının çoktan çektiği geçmişi asla yeniden yazmaz",
    "reset.level4.requirement1.description": "Derli toplu commit geçmişini göster",
    "reset.level4.requirement1.success": "İşte orada — en üstteki hatalı commit 'Quick fix without review'.",
    "reset.level4.requirement2.description": "Son commit'i revert et",
    "reset.level4.requirement2.success":
        "Mükemmel! Yeni bir revert commit'i değişikliği geri alıyor — geçmiş olduğu gibi kalıyor.",
    "reset.level4.story.title": "İadeleri Bozan Düzeltme",
    "reset.level4.story.narrative":
        "Kırmızı alarm! Biri incelemeden geçirmeden doğrudan main'e bir 'hızlı düzeltme' push'lamış — ve bu, iade akışını bozuyor.\n\nAlex koşarak geliyor: \"Burada `git reset` kullanamayız. Commit çoktan herkese açık hâle geldi ve bütün takım onu çekti. Şimdi geçmişi yeniden yazarsak herkesin repository'si bozulur.\n\n`git revert` tam da bunun için var: hatalı commit'i geri alan YENİ bir commit oluşturur. Geçmiş olduğu gibi kalır ve herkes senkron kalır.\"",
    "reset.level4.story.realWorldContext":
        "Paylaşılan branch'lerde profesyonel takımlar neredeyse her zaman reset yerine revert kullanır. Herkese açık geçmişi yeniden yazmak, onu çoktan çekmiş olan herkes için kaosa yol açar.",
    "reset.level4.story.taskIntroduction":
        "Geçmişi `git log --oneline` ile kontrol et, ardından hatalı commit'i `git revert HEAD` ile geri al.",

    // Stash Level 4
    "stash.level4.name": "Yedeğini Koru: Stash Apply",
    "stash.level4.description": "Stash'i yedek olarak saklarken stash'lediğin çalışmayı uygula",
    "stash.level4.objective1": "Riskli denemeni stash'le",
    "stash.level4.objective2": "Çalışmayı apply ile geri getir (stash'i silmeden)",
    "stash.level4.objective3": "Denemeye güvendiğinde onu commit'le",
    "stash.level4.hint1": "`git stash` değişikliklerini kaydeder ve sana tertemiz bir çalışma dizini bırakır",
    "stash.level4.hint2":
        "`git stash apply` değişiklikleri geri yükler ama bir kopyayı stash'te tutar — `git stash pop`un aksine",
    "stash.level4.hint3": "Staging'e `git add` ile aldıktan sonra `git commit -m \"message\"` ile commit'le",
    "stash.level4.requirement1.description": "Mevcut değişikliklerini stash'le",
    "stash.level4.requirement1.success": "Deneme güvenle kenara kaldırıldı — çalışma dizinin tertemiz.",
    "stash.level4.requirement2.description": "Stash'i silmeden uygula",
    "stash.level4.requirement2.success": "Çalışma geri geldi — ve stash hâlâ yedek kopyanı tutuyor!",
    "stash.level4.requirement3.description": "Denemeyi commit'le",
    "stash.level4.requirement3.success": "Commit'lendi! Stash yedeği, riskli çalışmanı kaybetmekten seni kurtardı.",
    "stash.level4.story.title": "Riskli Deneme",
    "stash.level4.story.narrative":
        "Bulanık arama (fuzzy search) üzerinde deneme yapıyorsun — umut verici ama riskli.\n\nAlex öneriyor: \"Daha ileri gitmeden önce onu stash'le. Ama sana bir pro hamle: geri getirirken `pop` yerine `git stash apply` kullan. Apply değişikliklerini geri yükler ama kopyayı stash'te TUTAR. Sonraki adımın ters giderse yedeğin hâlâ orada olur.\"",
    "stash.level4.story.realWorldContext":
        "Geliştiriciler bir güvenlik ağı istediklerinde `pop` yerine `apply` kullanır: stash kaydı, onlar açıkça silene kadar yedek olarak durur.",
    "stash.level4.story.taskIntroduction": "Denemeyi stash'le, `git stash apply` ile geri getir, sonra commit'le.",

    // Teamwork Level 4
    "teamwork.level4.name": "Göndermeden Önce Gözden Geçir",
    "teamwork.level4.description": "Commit'lemeden önce kendi değişikliklerini git diff ile gözden geçir",
    "teamwork.level4.objective1": "Staging'e alınmamış değişikliklerini gözden geçir",
    "teamwork.level4.objective2": "Gözden geçirdiğin değişiklikleri staging'e al",
    "teamwork.level4.objective3": "Commit'lenmek üzere olanı bir kez daha kontrol et",
    "teamwork.level4.objective4": "Gözden geçirdiğin değişiklikleri commit'le",
    "teamwork.level4.hint1": "`git diff`, çalışma dizinindeki henüz staging'e alınmamış değişiklikleri gösterir",
    "teamwork.level4.hint2": "`git diff --staged`, bir sonraki commit'e tam olarak neyin gireceğini gösterir",
    "teamwork.level4.hint3": "Önce gözden geçir, sonra `git add`, ardından `--staged` ile tekrar bak ve commit'le",
    "teamwork.level4.requirement1.description": "Staging'e alınmamış değişikliklerini göster",
    "teamwork.level4.requirement1.success":
        "Güzel alışkanlık! Hiçbir şeyi staging'e almadan önce diff'i gözden geçirdin.",
    "teamwork.level4.requirement2.description": "Değişiklikleri staging'e al",
    "teamwork.level4.requirement2.success": "Değişiklikler staging'e alındı — son kontrole hazır.",
    "teamwork.level4.requirement3.description": "Staging'deki değişiklikleri göster",
    "teamwork.level4.requirement3.success": "Commit'e girecek olan tam olarak bu. Sürpriz yok.",
    "teamwork.level4.requirement4.description": "Gözden geçirdiğin değişiklikleri commit'le",
    "teamwork.level4.requirement4.success": "Gönül rahatlığıyla gönderildi — iki kez bakıldı, bir kez commit'lendi!",
    "teamwork.level4.story.title": "Kendi Kodunu Gözden Geçirme Alışkanlığı",
    "teamwork.level4.story.narrative":
        "Takım arkadaşın Sarah az önce yandı: yanlışlıkla bir hata ayıklama satırı commit'ledi ve inceleyen kişi bunu pull request'te yakaladı. Utanç verici.\n\nAlex takımın altın kuralını paylaşıyor: \"Başkası görmeden önce KENDİ diff'ini gözden geçir. `git diff` neyi değiştirdiğini gösterir; staging'e aldıktan sonra da `git diff --staged` commit'e tam olarak neyin gireceğini gösterir. Unutulmuş hata ayıklama satırlarını, yazım hatalarını ve atlanan dosyaları yakalayan iki hızlı kontrol.\"",
    "teamwork.level4.story.realWorldContext":
        "Commit'lemeden önce diff'leri kendi kendine gözden geçirmek, profesyonel takımlarda en çok fark yaratan alışkanlıklardan biridir — hatalar kod incelemesine ulaşmadan yakalanır.",
    "teamwork.level4.story.taskIntroduction":
        "`git diff` ile gözden geçir, `git add` ile staging'e al, `git diff --staged` ile doğrula, sonra commit'le.",

    // Advanced Level 4
    "advanced.level4.name": "Bisect ile Hata Avı",
    "advanced.level4.description": "İkili arama kullanarak uygulamayı bozan commit'i bul",
    "advanced.level4.objective1": "Bir bisect oturumu başlat",
    "advanced.level4.objective2": "Bozuk ve çalışan sürümleri işaretle",
    "advanced.level4.objective3": "Bisect oturumunu sonlandır",
    "advanced.level4.hint1": "`git bisect start`, geçmişinde ikili aramayı başlatır",
    "advanced.level4.hint2":
        "Mevcut bozuk durumu `git bisect bad` ile, çalıştığını bildiğin bir commit'i de `git bisect good` ile işaretle",
    "advanced.level4.hint3": "İşin bitince `git bisect reset` seni başladığın yere geri döndürür",
    "advanced.level4.requirement1.description": "Bisect'i başlat",
    "advanced.level4.requirement1.success": "Bisect oturumu başladı — Git suçluyu daraltmaya hazır.",
    "advanced.level4.requirement2.description": "Mevcut commit'i bad olarak işaretle",
    "advanced.level4.requirement2.success": "Mevcut sürüm bozuk olarak işaretlendi.",
    "advanced.level4.requirement3.description": "Çalışan bir commit'i good olarak işaretle",
    "advanced.level4.requirement3.success":
        "Git artık good/bad aralığını biliyor ve ikisi arasında ikili arama yapabilir!",
    "advanced.level4.requirement4.description": "Bisect oturumunu sonlandır",
    "advanced.level4.requirement4.success": "Oturum kapandı — suçluyu logaritmik sürede buldun!",
    "advanced.level4.story.title": "Samanlıkta İğne",
    "advanced.level4.story.narrative":
        "Arama üretimde bozuk — ama geçen hafta gayet iyi çalışıyordu ve arada onlarca commit var.\n\nAlex sırıtıyor: \"Her commit'i elle kontrol etmek saatler sürer. `git bisect` ikili arama yapar: ona bir bozuk, bir de çalışan commit söyle; işleri bozan commit'i tam olarak bulana kadar aradaki ortayı tekrar tekrar checkout eder. Yirmi commit mi? Yaklaşık beş kontrol yeter.\"",
    "advanced.level4.story.realWorldContext":
        "git bisect, büyük geçmişlerde regresyonları bulmanın en hızlı yoludur. 1000 commit varsa ikili aramanın suçluyu bulması için yalnızca ~10 adım yeter.",
    "advanced.level4.story.taskIntroduction":
        "`git bisect start` ile başla, sürümleri `bad` ve `good` ile işaretle, sonra `git bisect reset` ile bitir.",

    // Archaeology Level 4
    "archaeology.level4.name": "Çalışma Dizini Kurtarma",
    "archaeology.level4.description": "Yanlışlıkla yapılan değişiklikleri git restore ile geri al",
    "archaeology.level4.objective1": "Yanlışlıkla staging'e alınan yapılandırma değişikliğini geri çıkar",
    "archaeology.level4.objective2": "Notlar dosyasındaki karman çorman değişiklikleri çöpe at",
    "archaeology.level4.hint1":
        "`git restore --staged config.js`, bir dosyayı değişikliklerini kaybetmeden staging alanından çıkarır",
    "archaeology.level4.hint2":
        "`git restore notes.md`, çalışma dizinindeki değişiklikleri atar ve commit'lenmiş sürümü geri getirir",
    "archaeology.level4.hint3":
        "Neyin staged, neyin değiştirilmiş olduğunu görmek için istediğin an `git status` çalıştır",
    "archaeology.level4.requirement1.description": "Yapılandırma dosyasını staging'den çıkar",
    "archaeology.level4.requirement1.success": "Yerel URL staging alanından çıktı — kriz atlatıldı.",
    "archaeology.level4.requirement2.description": "Notlar dosyasını commit'lenmiş hâline geri getir",
    "archaeology.level4.requirement2.success": "Kedinin şaheseri gitti — notların commit'lenmiş sürüme geri döndü.",
    "archaeology.level4.story.title": "Klavyedeki Kedi Vakası",
    "archaeology.level4.story.narrative":
        "Felaket iki kez vuruyor: önce uygulamayı localhost'a yönlendiren bir yapılandırma değişikliğini yanlışlıkla staging'e aldın — bunun commit'lenMEMESİ gerek. Sonra kedin klavyenin üzerinde yürüyüp sprint notlarını karman çorman etti.\n\nAlex gülüyor: \"Herkesin başına gelir. `git restore --staged` bir dosyayı staging alanından geri çıkarır; düz `git restore` ise çalışma dizinindeki değişiklikleri atıp son commit'lenmiş sürümü geri getirir. İki farklı kurtarma, tek komut.\"",
    "archaeology.level4.story.realWorldContext":
        "git restore; staging'den çıkarma ve değişiklikleri atma işleri için eski 'git checkout -- file' ve 'git reset HEAD file' reçetelerinin modern ve daha güvenli karşılığıdır.",
    "archaeology.level4.story.taskIntroduction":
        "config.js dosyasını `git restore --staged config.js` ile staging'den çıkar, ardından notes.md değişikliklerini `git restore notes.md` ile at.",

    // Mastery Level 4
    "mastery.level4.name": "Kusursuz Sürüm",
    "mastery.level4.description": "Son commit'i --amend ile düzelt ve sürümü tag'le",
    "mastery.level4.objective1": "Unutulan sürüm notlarını staging'e al",
    "mastery.level4.objective2": "Sürüm commit'ine amend uygulayıp notları dahil et",
    "mastery.level4.objective3": "Cilalanmış sürümü tag'le",
    "mastery.level4.hint1": "Unutulan dosyayı `git add .` ile staging'e al",
    "mastery.level4.hint2": "`git commit --amend -m \"message\"`, staging'deki değişiklikleri önceki commit'e katar",
    "mastery.level4.hint3": 'Açıklamalı bir tag oluştur: `git tag -a v3.0.0 -m "Release 3.0.0"`',
    "mastery.level4.requirement1.description": "Sürüm notlarını staging'e al",
    "mastery.level4.requirement1.success": "Sürüm notları staging'e alındı — sürüm commit'ine katılmaya hazır.",
    "mastery.level4.requirement2.description": "Önceki commit'e amend uygula",
    "mastery.level4.requirement2.success": "Sürüm commit'i artık notları da içeriyor — sanki hiç unutmamışsın gibi.",
    "mastery.level4.requirement3.description": "Açıklamalı bir sürüm tag'i oluştur",
    "mastery.level4.requirement3.success": "v3.0.0 tag'lendi — kusursuz bir sürüm. Git'te gerçekten ustalaştın!",
    "mastery.level4.story.title": "Sürümü Yöneten Tek Commit",
    "mastery.level4.story.narrative":
        "Sürüm günü! 'Prepare release v3.0.0' commit'ini attın — sonra sürüm notları dosyasını fark ettin: staging'e alınmamış ve unutulmuş. İkinci bir 'aaa, notları unutmuşum' commit'i geçmiş kayıtlarında özensiz durur.\n\nAlex onaylarcasına başını sallıyor: \"Commit henüz push'lanmadığına göre `git commit --amend` kullan. Staging'deki değişikliklerini, sanki başından beri oradaymış gibi önceki commit'e katar. Sonra da açıklamalı bir tag'le taçlandır.\"",
    "mastery.level4.story.realWorldContext":
        "Push'lanmamış commit'lere amend uygulamak geçmişi temiz ve bilinçli tutar. Açıklamalı tag'lerle birleştiğinde, profesyonellerin derli toplu ve iyi belgelenmiş sürümler çıkarma yöntemi budur.",
    "mastery.level4.story.taskIntroduction":
        "Notları `git add .` ile staging'e al, `git commit --amend` ile önceki commit'e kat, sonra `git tag -a` ile tag'le.",
};

export default levels;
