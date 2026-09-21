const installation = {
    "installation.title": "Git Kurulum Rehberi",
    "installation.subtitle": "Git'e Başlarken",
    "installation.intro":
        "Bu rehber, Git'i işletim sistemine kurup yapılandırmana yardımcı olacak. Başlamak için aşağıdan platformunu seç.",
    "installation.download": "Git'i İndir",
    "installation.moreDistros": "Diğer Linux Dağıtımları",

    // Windows
    "installation.windows.title": "Windows'a Git Kurulumu",
    "installation.windows.download": "Windows için Git'i indir",
    "installation.windows.step1": "Resmî Git sitesini ziyaret et: git-scm.com/downloads.",
    "installation.windows.step2": "Windows indirme bağlantısına tıkla.",
    "installation.windows.step3": "İndirme otomatik olarak başlayacaktır.",
    "installation.windows.install": "Git'i Windows'a kur",
    "installation.windows.step4": "İndirdiğin çalıştırılabilir dosyayı çalıştır.",
    "installation.windows.step5":
        "Kurulum sihirbazını takip et. Varsayılan seçenekler çoğu kullanıcı için genellikle uygundur.",
    "installation.windows.step6":
        "Kurulum sırasında Git'i PATH'ine eklemek için 'Use Git from the Windows Command Prompt' seçeneğini işaretle.",
    "installation.windows.step7": "Kurulumu tamamla ve 'Finish' düğmesine tıkla.",

    // Linux
    "installation.linux.title": "Linux'a Git Kurulumu",
    "installation.linux.debian": "Debian/Ubuntu ve Türevleri",
    "installation.linux.fedora": "Fedora/RHEL/CentOS",
    "installation.linux.arch": "Arch Linux",

    // Mac
    "installation.mac.title": "macOS'a Git Kurulumu",
    "installation.mac.option1": "1. Seçenek: Command Line Tools",
    "installation.mac.option1Desc":
        "Mac'te Git kurmanın en kolay yolu Terminal'i açıp 'git --version' yazmaktır. Git kurulu değilse Command Line Tools'u kurman istenir.",
    "installation.mac.option2": "2. Seçenek: Git Kurulum Dosyasını İndir",
    "installation.mac.step1": "Resmî Git sitesini ziyaret et: git-scm.com/downloads.",
    "installation.mac.step2": "macOS indirme bağlantısına tıkla.",
    "installation.mac.step3": "İndirdiğin paketi, ekrandaki yönergeleri izleyerek kur.",
    "installation.mac.brew": "3. Seçenek: Homebrew ile",
    "installation.mac.brewDesc": "Homebrew kuruluysa Git'i şu komutlarla kurabilirsin:",

    // Common Configuration
    "installation.config": "Git'i Yapılandır",
    "installation.configDesc":
        "Kurulumdan sonra kullanıcı adını ve e-posta adresini ayarlaman gerekir. Bu bilgiler her Git commit'inde kullanılır.",
    "installation.verification": "Kurulumu Doğrula",
    "installation.verificationDesc":
        "Git'in doğru kurulduğundan emin olmak için bir terminal ya da komut istemi açıp şunu çalıştır:",

    // SSH Key Generation
    "installation.ssh.title": "SSH Anahtarı Oluştur",
    "installation.ssh.intro":
        "SSH anahtarları; GitHub, GitLab veya Bitbucket gibi Git barındırma hizmetlerine her push/pull işleminde parola girmeden güvenli şekilde bağlanmanı sağlar.",
    "installation.ssh.generate": "SSH Anahtarı Oluştur",
    "installation.ssh.generateDesc":
        "Yeni bir SSH anahtarı oluşturmak için şu komutu çalıştır. E-posta adresini kendi adresinle değiştir:",
    "installation.ssh.saveLocation": "Kayıt Konumunu Onayla",
    "installation.ssh.saveLocationDesc":
        "Anahtarın nereye kaydedileceği sorulduğunda varsayılan konum için Enter'a bas:",
    "installation.ssh.passphrase": "Parola (İsteğe Bağlı)",
    "installation.ssh.passphraseDesc":
        "Ek güvenlik için bir parola girebilir ya da devam etmek için Enter'a basabilirsin:",
    "installation.ssh.copyKey": "Genel Anahtarı Kopyala",
    "installation.ssh.copyKeyDesc": "Genel SSH anahtarının içeriğini panoya kopyala:",
    "installation.ssh.windows.copyKey": "Windows için (Git Bash/PowerShell):",
    "installation.ssh.mac.copyKey": "macOS için:",
    "installation.ssh.linux.copyKey": "Linux için:",

    // GitHub/GitLab Connection
    "installation.github.title": "GitHub'a Bağlan",
    "installation.github.intro": "GitHub, en popüler Git barındırma hizmetidir. SSH anahtarını şöyle ekleyebilirsin:",
    "installation.github.step1": "GitHub.com'a git ve hesabına giriş yap",
    "installation.github.step2": "Profil fotoğrafına tıkla (sağ üst) → Settings",
    "installation.github.step3": "Sol kenar çubuğundaki 'SSH and GPG keys' bölümüne tıkla",
    "installation.github.step4": "'New SSH key' düğmesine tıkla",
    "installation.github.step5": "Açıklayıcı bir başlık gir (ör. 'My Laptop')",
    "installation.github.step6": "Kopyaladığın SSH anahtarını 'Key' alanına yapıştır",
    "installation.github.step7": "'Add SSH key' düğmesine tıkla",
    "installation.github.test": "Bağlantıyı Test Et",
    "installation.github.testDesc": "GitHub'a olan SSH bağlantısını şu komutla test et:",
    "installation.github.testSuccess": "Bağlantı başarılı olduğunda GitHub'dan bir karşılama mesajı göreceksin.",

    "installation.gitlab.title": "GitLab'a Bağlan",
    "installation.gitlab.intro":
        "GitLab da popüler bir diğer Git barındırma platformudur. SSH anahtarını şöyle ekleyebilirsin:",
    "installation.gitlab.step1": "GitLab.com'a git ve hesabına giriş yap",
    "installation.gitlab.step2": "Profil fotoğrafına tıkla (sağ üst) → Edit profile",
    "installation.gitlab.step3": "Sol kenar çubuğundaki 'SSH Keys' bölümüne tıkla",
    "installation.gitlab.step4": "SSH anahtarını 'Key' alanına yapıştır",
    "installation.gitlab.step5": "Açıklayıcı bir başlık gir",
    "installation.gitlab.step6": "Bir son kullanma tarihi seç (isteğe bağlı ama önerilir)",
    "installation.gitlab.step7": "'Add key' düğmesine tıkla",
    "installation.gitlab.test": "Bağlantıyı Test Et",
    "installation.gitlab.testDesc": "GitLab'a olan SSH bağlantısını test et:",

    // First Repository Setup
    "installation.firstRepo.title": "İlk Repository'yi Kur",
    "installation.firstRepo.intro":
        "Git yapılandırıldıktan ve SSH bağlantısı kurulduktan sonra çalışmaya başlayabilirsin:",
    "installation.firstRepo.clone": "Mevcut Bir Repository'yi Clone'la",
    "installation.firstRepo.cloneDesc": "GitHub/GitLab üzerindeki mevcut bir repository'yi clone'lamak için:",
    "installation.firstRepo.create": "Yeni Repository Oluştur",
    "installation.firstRepo.createDesc": "Yeni bir yerel repository oluşturmak için:",
    "installation.firstRepo.connect": "Yerel Repository'yi Remote'a Bağla",
    "installation.firstRepo.connectDesc": "Yerel bir repository'yi remote bir repository'ye bağlamak için:",

    // Troubleshooting
    "installation.troubleshooting.title": "Sorun Giderme",
    "installation.troubleshooting.intro":
        "Git kurulumu ve yapılandırması sırasında karşılaşılan yaygın sorunların çözümleri:",
    "installation.troubleshooting.commandNotFound": "Hata: 'git' command not found",
    "installation.troubleshooting.commandNotFoundSolution":
        "• Git'in doğru kurulup kurulmadığını kontrol et\n• Git'in PATH'ine eklendiğinden emin ol\n• Terminali/komut istemini yeniden başlat\n• Windows'ta: Git Bash kullan ya da Git'i PATH'ine elle ekle",
    "installation.troubleshooting.permissionDenied": "Hata: Permission denied (publickey)",
    "installation.troubleshooting.permissionDeniedSolution":
        "• SSH anahtarının GitHub/GitLab'a doğru eklendiğini kontrol et\n• HTTPS değil, SSH clone URL'sini kullandığından emin ol\n• SSH bağlantısını 'ssh -T git@github.com' ile test et\n• SSH agent'ın çalışıp çalışmadığını kontrol et: 'ssh-add -l'",
    "installation.troubleshooting.httpsToSsh": "HTTPS'ten SSH'a Geçiş",
    "installation.troubleshooting.httpsToSshSolution":
        "Bir repository'yi daha önce HTTPS ile clone'ladıysan SSH kimlik doğrulamasına geçebilirsin:",
    "installation.troubleshooting.sslError": "SSL Sertifikası Hatası",
    "installation.troubleshooting.sslErrorSolution":
        "Kurumsal ağlarda veya proxy sunucularında SSL sorunları yaşanabilir:\n• Geçici çözüm: 'git config --global http.sslVerify false' (önerilmez)\n• Daha iyisi: Git'i proxy'ne göre yapılandır ya da kurumsal sertifikayı kullan",
    "installation.troubleshooting.lineEndingIssues": "Satır Sonu Sorunları",
    "installation.troubleshooting.lineEndingIssuesSolution":
        "Farklı işletim sistemlerinin bir arada kullanıldığı takımlarda:\n• Windows: 'git config --global core.autocrlf true'\n• macOS/Linux: 'git config --global core.autocrlf input'\n• Alternatif: Hassas kontrol için .gitattributes dosyasını kullan",
    "installation.troubleshooting.mergeConflicts": "Merge Çakışmalarında İlk Yardım",
    "installation.troubleshooting.mergeConflictsSolution":
        "• Etkilenen dosyaları görmek için 'git status' kullan\n• Dosyaları elle düzenle ya da bir merge aracı kullan\n• Düzenledikten sonra: 'git add .' ve 'git commit'\n• Emin değilsen: Merge'ü iptal etmek için 'git merge --abort'",

    // Enhanced Platform Details
    "installation.windows.enhanced.title": "Ayrıntılı Windows Kurulumu",
    "installation.windows.enhanced.prereq": "Ön Koşullar",
    "installation.windows.enhanced.prereqDesc":
        "• Windows 7 veya daha yenisi\n• Kurulum için yönetici yetkisi\n• İndirme için internet erişimi",
    "installation.windows.enhanced.installerOptions": "Önemli Kurulum Seçenekleri",
    "installation.windows.enhanced.installerOptionsDesc":
        "Kurulum sırasında şu seçenekleri işaretle:\n• 'Git from the command line and also from 3rd-party software'\n• 'Use bundled OpenSSH'\n• 'Use the OpenSSL library'\n• 'Checkout Windows-style, commit Unix-style line endings'\n• 'Use Windows' default console window'",
    "installation.windows.enhanced.postInstall": "Kurulumdan Sonra",
    "installation.windows.enhanced.postInstallDesc":
        "• Git Bash bağlam menüsünden erişilebilir (klasörlerde sağ tıkla)\n• Git GUI grafik bir arayüz sunar\n• Windows Terminal veya PowerShell de kullanılabilir",

    "installation.linux.enhanced.title": "Ayrıntılı Linux Kurulumu",
    "installation.linux.enhanced.package": "Paket Yöneticisiyle Kurulum",
    "installation.linux.enhanced.packageDesc":
        "Linux'ta önerilen yöntem, kurulumu paket yöneticisi üzerinden yapmaktır:",
    "installation.linux.enhanced.source": "Kaynaktan Derleme (İleri Seviye)",
    "installation.linux.enhanced.sourceDesc": "En yeni sürüm ya da özel yapılandırmalar için:",
    "installation.linux.enhanced.sourceSteps":
        "# Bağımlılıkları kur (Ubuntu/Debian)\nsudo apt-get install make libssl-dev libghc-zlib-dev libcurl4-gnutls-dev libncurses5-dev autoconf build-essential\n\n# Git kaynak kodunu indir\nwget https://github.com/git/git/archive/v2.43.0.tar.gz\ntar -zxf v2.43.0.tar.gz\ncd git-2.43.0\n\n# Derle ve kur\nmake configure\n./configure --prefix=/usr/local\nmake all\nsudo make install",

    "installation.mac.enhanced.title": "Ayrıntılı macOS Kurulumu",
    "installation.mac.enhanced.xcode": "Xcode Command Line Tools",
    "installation.mac.enhanced.xcodeDesc":
        "macOS kullanıcıları için en basit yöntem:\n• Terminal'i aç (Applications → Utilities → Terminal)\n• 'git --version' yaz\n• Git kurulu değilse kurman istenecek\n• Command Line Tools'u kurmak için 'Install' düğmesine tıkla",
    "installation.mac.enhanced.homebrew": "Homebrew (Önerilen)",
    "installation.mac.enhanced.homebrewDesc":
        "Homebrew, geliştirici araçlarını yönetmeyi kolaylaştıran bir macOS paket yöneticisidir:",
    "installation.mac.enhanced.homebrewSteps":
        "# Homebrew'u kur (henüz kurulu değilse)\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\n\n# Git'i kur\nbrew install git\n\n# Git'i güncelle (ileride)\nbrew upgrade git",
    "installation.mac.enhanced.macports": "MacPorts (Alternatif)",
    "installation.mac.enhanced.macportsDesc":
        "MacPorts kullanıyorsan:\n• sudo port install git +universal\n• sudo port install git-flow (isteğe bağlı)",

    // Additional Settings
    "installation.additionalSettings.title": "Ek Yapılandırma",
    "installation.additionalSettings.intro": "Git'i en verimli şekilde kullanmak için önerilen bazı ek ayarlar:",
    "installation.additionalSettings.lineEndings": "Satır Sonlarını Yapılandır",
    "installation.additionalSettings.lineEndingsDesc":
        "Farklı işletim sistemleri satır sonlarını farklı şekilde ele alır. Git'i bunları doğru işleyecek biçimde yapılandır:",
    "installation.additionalSettings.defaultBranch": "Varsayılan Branch Adını Belirle",
    "installation.additionalSettings.defaultBranchDesc":
        "Modern Git iş akışlarında varsayılan branch adı olarak genellikle 'master' yerine 'main' kullanılır:",
    "installation.additionalSettings.editor": "Varsayılan Editörü Yapılandır",
    "installation.additionalSettings.editorDesc":
        "Git commit mesajları ve diğer işlemler için tercih ettiğin metin editörünü ayarla:",

    // Resources
    "installation.resources.title": "Ek Kaynaklar",
    "installation.resources.download": "İndir",
    "installation.resources.gui": "Git GUI İstemcileri",
    "installation.resources.githubDesktop": "GitHub'ın basit ve kullanıcı dostu Git istemcisi",
    "installation.resources.gitkraken": "Görsel commit geçmişi sunan güçlü bir Git istemcisi",
    "installation.resources.sourcetree": "Windows ve Mac için ücretsiz Git istemcisi",
    "installation.resources.editors": "Git Dostu Kod Editörleri",
    "installation.resources.vscode": "Yerleşik Git desteğine sahip ücretsiz kod editörü",
    "installation.resources.atom": "Git entegrasyonlu ücretsiz kod editörü",
    "installation.resources.sublime": "Git eklentileri olan popüler metin editörü",
    "installation.resources.docs": "Dokümantasyon",
    "installation.resources.officialDocs": "Resmî Git Dokümantasyonu",
    "installation.resources.proGitBook": "Pro Git Kitabı (Ücretsiz)",
    "installation.resources.githubGuide": "GitHub'ın Git Kurulum Rehberi",
};

export default installation;
