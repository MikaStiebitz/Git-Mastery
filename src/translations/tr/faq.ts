const faq = {
    "faq.title": "Git Hakkında Sıkça Sorulan Sorular",
    "faq.subtitle": "Git Hakkında Bilmen Gereken Her Şey",
    "faq.intro":
        "Git, güçlü ve çok yaygın kullanılan bir sürüm kontrol sistemidir. Aşağıda Git'in ne olduğu, ne işe yaradığı ve yazılım geliştirmede nasıl kullanıldığı hakkındaki sık sorulan soruların yanıtlarını bulacaksın.",

    // Categories
    "faq.categories.basics": "Git'in Temelleri",
    "faq.categories.concepts": "Temel Kavramlar",
    "faq.categories.usage": "Pratik Kullanım",

    // Basics Section
    "faq.whatIsGit.question": "Git nedir?",
    "faq.whatIsGit.answer":
        "Git, dosyalarda zaman içinde yapılan değişiklikleri takip eden dağıtık bir sürüm kontrol sistemidir. Birden fazla kişinin aynı proje üzerinde çalışmasına, değişikliklerin geçmişinin tutulmasına ve gerektiğinde önceki sürümlere dönülmesine olanak tanır. Merkezi sürüm kontrol sistemlerinin aksine Git, her geliştiriciye repository'nin tam bir kopyasını verir; böylece çevrimdışı çalışmak mümkün olur ve yedeklilik sağlanır.",

    "faq.whyCreated.question": "Git neden geliştirildi?",
    "faq.whyCreated.answer":
        "Git, 2005 yılında Linus Torvalds tarafından Linux çekirdeğinin geliştirilmesi için yazıldı. Torvalds'ın; hızlı çalışan, binlerce paralel branch ile doğrusal olmayan geliştirmeyi destekleyen ve Linux çekirdeği gibi büyük projeleri verimli biçimde yönetebilen dağıtık bir sürüm kontrol sistemine ihtiyacı vardı. O dönemin mevcut araçları bu gereksinimleri karşılayamadığı için Git'i kendisi geliştirdi. 'git' kelimesi İngiliz argosunda 'sevimsiz tip' anlamına gelir; Torvalds bu ismi şakayla karışık hem yazılıma hem de kendisine yakıştırmıştır.",

    "faq.vsOtherVcs.question": "Git, diğer sürüm kontrol sistemlerinden nasıl ayrılır?",
    "faq.vsOtherVcs.answer":
        "Git, SVN (Subversion) veya CVS gibi eski sistemlerden birkaç önemli noktada ayrılır:\n\n• Merkezi değil dağıtıktır; her geliştiriciye repository'nin tam bir kopyasını verir\n• Güçlü branch oluşturma ve merge yetenekleriyle doğrusal olmayan geliştirme için tasarlanmıştır\n• Özellikle branch oluşturma ve merge gibi işlemlerde çok daha hızlıdır\n• Veriyi saklarken farklı bir yaklaşım kullanır; dosya farklarına değil anlık görüntülere odaklanır\n• SHA-1 hash'leri sayesinde veri bütünlüğü daha güçlüdür\n• Çevrimdışı işlemler için güçlü destek sunar",

    "faq.benefits.question": "Git kullanmanın başlıca faydaları nelerdir?",
    "faq.benefits.answer":
        "Git, yazılım geliştirmeye pek çok avantaj sunar:\n\n• Özellikle büyük projelerde hız ve verimlilik\n• Doğrusal olmayan geliştirmeyi destekleyen güçlü branch ve merge yetenekleri\n• Yedeklilik sağlayan ve çevrimdışı çalışmaya imkân veren dağıtık yapı\n• Paralel geliştirme iş akışları için güçlü destek\n• Mükemmel veri bütünlüğü ve değişiklik takibi\n• GitHub, GitLab ve Bitbucket gibi araçlar ve barındırma hizmetleriyle sağlam bir ekosistem\n• Sektörde çok yaygın kullanım; bu da onu geliştiriciler için değerli bir beceri hâline getirir\n• Ücretsiz ve açık kaynaklı bir yazılım olması",

    "faq.gitVsGithub.question": "Git ile GitHub arasındaki fark nedir?",
    "faq.gitVsGithub.answer":
        "Git, sürüm kontrol sisteminin kendisidir; yani dosyalarındaki değişiklikleri takip etmek için bilgisayarına kurduğun yazılımdır. GitHub ise Git repository'lerini barındıran web tabanlı bir hizmettir. GitHub; pull request, issue takibi, kod incelemesi ve başka iş birliği araçları gibi ek özellikler getirir. GitLab ve Bitbucket da benzer hizmetlerdir. Git'i araç, GitHub'ı ise bu aracı daha kullanıcı dostu kılmak ve iş birliği özellikleri eklemek için onun etrafında kurulmuş bir hizmet olarak düşünebilirsin.",

    // Concepts Section
    "faq.repositories.question": "Git'te repository nedir?",
    "faq.repositories.answer":
        "Repository (kısaca 'repo'), Git'in temel birimidir. Projenin bütün dosyalarını ve bu dosyalarda yapılmış değişikliklerin tüm geçmişini barındırır. Teknik olarak bir Git repository'si, projene ait tüm meta verileri ve nesne veritabanını saklayan .git dizinidir. Bir repository'yi clone'ladığında bu geçmişin tamamının bir kopyasını almış olursun. Repository'ler yerel (kendi makinende) ya da remote (GitHub gibi bir sunucuda) olabilir.",

    "faq.commits.question": "Commit nedir ve neden önemlidir?",
    "faq.commits.answer":
        "Commit'ler, repository'nin belirli bir andaki anlık görüntüleridir. Her commit'in benzersiz bir kimliği (hash) vardır; neyin değiştiğini, değişikliği kimin ne zaman yaptığını ve değişikliği anlatan bir mesajı içerir. Commit'ler şu nedenlerle önemlidir:\n\n• Projenin gelişim geçmişini oluştururlar\n• Projenin önceki hâllerine dönmeni sağlarlar\n• Belirli değişikliklerin ne zaman ve kim tarafından yapıldığını bulmana yardımcı olurlar\n• Net referans noktaları sunarak iş birliğini mümkün kılarlar\n\nİyi yazılmış commit mesajları, koda sonradan geri döndüğünde değişikliklerin ardındaki 'neden'i anlamak için hayati önemdedir.",

    "faq.branches.question": "Branch nedir ve nasıl çalışır?",
    "faq.branches.answer":
        "Git'te branch'ler (dallar), aslında commit'lere işaret eden hareketli işaretçilerden ibarettir. Paralel geliştirme hatları açmanı sağlarlar; böylece farklı özellikler veya düzeltmeler birbirine karışmadan aynı anda geliştirilebilir. Varsayılan branch genellikle 'main' (eskiden 'master') olarak adlandırılır.\n\nBir branch oluşturduğunda, esasen mevcut commit'e işaret eden yeni bir işaretçi yaratmış olursun. O branch üzerinde yeni commit'ler oluşturdukça işaretçi otomatik olarak ileri kayar. Bu sayede projenin farklı hâlleri arasında kolayca geçiş yapabilir, hazır olduğunda da bir branch'teki değişiklikleri bir diğerine merge edebilirsin.",

    "faq.merge.question": "Merge nedir ve merge çakışmaları nasıl oluşur?",
    "faq.merge.answer":
        "Merge, bir branch'teki değişiklikleri bir diğeriyle birleştirme işlemidir. Örneğin bir özellik, kendi özellik branch'inde tamamlandığında onu ana branch'e merge edersin. Değişiklikler birbiriyle örtüşmediği sürece Git merge işlemini kendiliğinden halleder.\n\nMerge çakışmaları (conflict), merge edilen iki branch'te bir dosyanın aynı bölümü farklı şekilde değiştirildiğinde ortaya çıkar. Git hangi sürümün kullanılacağına kendi başına karar veremez; bu yüzden dosyayı, elle çözülmesi gereken bir çakışma içeriyor olarak işaretler. Dosyadaki çakışma işaretleri kodun her iki sürümünü de gösterir; merge'ü tamamlamadan önce dosyayı düzenleyip nihai sürümü oluşturman gerekir.",

    "faq.workflow.question": "Tipik bir Git iş akışı nasıldır?",
    "faq.workflow.answer":
        "Yaygın bir Git iş akışı şöyle görünebilir:\n\n1. Yeni bir özellik veya hata düzeltmesi için bir branch oluştur\n2. Değişiklikleri yap ve branch'ine commit'le\n3. Branch'ini remote repository'ye push'la\n4. Bir pull request aç (GitHub/GitLab üzerinde) veya kod incelemesi iste\n5. İstenirse ek değişiklikler yap\n6. Onaylandığında branch'i ana branch'e merge et\n7. Merge edildikten sonra özellik branch'ini sil\n\nGitHub Flow, GitFlow ve Trunk-Based Development gibi oturmuş birkaç iş akışı modeli vardır; her birinin branch'lere, sürümlere ve dağıtımlara yaklaşımı kendine özgüdür.",

    // Usage Section
    "faq.whenUse.question": "Git'i ne zaman kullanmalıyım?",
    "faq.whenUse.answer":
        "Zaman içindeki değişiklikleri takip etmen gereken hemen hemen her projede, özellikle de işin içinde kod varsa Git kullanmalısın. Buna şunlar dahildir:\n\n• Her ölçekten yazılım geliştirme projesi\n• Dokümantasyon projeleri\n• Yapılandırma dosyaları\n• Kitap veya makale gibi yazı projeleri\n• Birden fazla kişinin aynı dosyalar üzerinde çalıştığı her türlü ortak proje\n\nTek başına yürüttüğün projelerde bile Git; geçmiş takibi, değişiklikleri güvenle deneyebilme ve yedekleme gibi değerli imkânlar sunar.",

    "faq.smallProjects.question": "Git küçük projeler için fazla mı kaçar?",
    "faq.smallProjects.answer":
        "Git, büyük ve karmaşık projeleri yönetmek üzere tasarlanmış güçlü özelliklere sahip olsa da küçük projelerde de değerlidir. Küçük ya da kişisel projelerde bile Git şunları sunar:\n\n• Bir şey bozulduğunda değişiklikleri geri almanı sağlayan bir güvenlik ağı\n• Çalışmanın eksiksiz bir geçmişi\n• Branch'ler sayesinde aynı anda birden fazla özellik üzerinde çalışabilme\n• Projenin tüm geçmişini remote repository'lere kolayca yedekleyebilme\n• İleride iş birliğine açılabilme potansiyeli\n\nGit'i öğrenmek için baştan harcadığın emek, bu faydalar sayesinde küçük projelerde bile kendini fazlasıyla amorti eder.",

    "faq.teamCollaboration.question": "Git takım çalışmasına nasıl yardımcı olur?",
    "faq.teamCollaboration.answer":
        "Git, takım çalışmasını pek çok açıdan güçlendirir:\n\n• Birden fazla geliştirici aynı proje üzerinde, birbirinin çalışmasının üzerine yazmadan aynı anda çalışabilir\n• Değişiklikler yazar bilgisi ve zaman damgasıyla net biçimde takip edilir\n• Branch'ler sayesinde farklı özellikler birbirine karışmadan ayrı ayrı geliştirilebilir\n• Pull request'ler (GitHub gibi platformlarda) kod incelemesini kolaylaştırır\n• Çakışmalar ortaya çıktıkları anda otomatik olarak tespit edilir\n• Proje geçmişi hesap verebilirlik ve şeffaflık sağlar\n• Remote repository'ler herkesin en güncel koda erişebilmesini güvence altına alır\n• Issue takibi ve proje yönetimi araçları Git iş akışlarıyla sorunsuz bütünleşir",

    "faq.commandLine.question": "Git için komut satırını kullanmak zorunda mıyım?",
    "faq.commandLine.answer":
        "Hayır, komut satırını kullanmak zorunda değilsin; yine de Git komutlarını anlamak işine yarar. Git için pek çok grafik arayüz (GUI) mevcut:\n\n• GitHub Desktop: Basit ve kullanıcı dostu bir arayüz\n• GitKraken: Güçlü, çoklu platform desteği olan bir Git istemcisi\n• Sourcetree: Windows ve Mac için özellik dolu bir Git istemcisi\n• Git Extensions: Windows için açık kaynaklı bir arayüz\n• TortoiseGit: Git'in Windows kabuk arayüzü\n\nAyrıca Visual Studio Code, IntelliJ IDEA gibi modern IDE'lerin çoğunda yerleşik Git entegrasyonu bulunur; bu sayede yaygın Git işlemlerini doğrudan editörden yapabilirsin.",

    "faq.hosting.question": "Git repository'lerimi nerede barındırabilirim?",
    "faq.hosting.answer":
        "Git repository'lerini barındırmak için birkaç popüler hizmet var:\n\n• GitHub: En popüler platform; pek çok iş birliği özelliği sunar\n• GitLab: CI/CD yetenekleriyle birlikte eksiksiz bir DevOps platformu sunar\n• Bitbucket: Jira gibi diğer Atlassian ürünleriyle iyi bütünleşir\n• Azure DevOps: Microsoft'un çözümü; kendi ekosistemiyle geniş çaplı entegrasyon sağlar\n• Kendi sunucunda barındırma: Kendi sunucularında çalıştırmak için GitLab Community Edition veya Gitea\n\nBu hizmetlerin çoğu, herkese açık repository'ler ve bireysel geliştiriciler için ücretsiz paketler; özel repository'ler ve takımlar için ise ücretli planlar sunar.",

    // Call to action
    "faq.readyToStart.title": "Git'e Başlamaya Hazır mısın?",
    "faq.readyToStart.text":
        "Artık Git'in temellerini anladığına göre, onu kendi projelerinde kullanmaya başlamaya hazırsın!",
    "faq.readyToStart.installButton": "Git'i Kur",
    "faq.readyToStart.practiceButton": "Git Komutlarını Dene",
};

export default faq;
