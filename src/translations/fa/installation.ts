const installation = {
    "installation.title": "راهنمای نصب Git",
    "installation.subtitle": "شروع کار با Git",
    "installation.intro":
        "این راهنما به شما کمک می‌کند Git را روی سیستم عامل خود نصب و پیکربندی کنید. پلتفرم خود را در زیر انتخاب کنید تا شروع کنید.",
    "installation.download": "دانلود Git",
    "installation.moreDistros": "توزیع‌های بیشتر لینوکس",

    // Windows
    "installation.windows.title": "نصب Git روی ویندوز",
    "installation.windows.download": "دانلود Git برای ویندوز",
    "installation.windows.step1": "به وب‌سایت رسمی Git در git-scm.com/downloads بروید.",
    "installation.windows.step2": "روی لینک دانلود ویندوز کلیک کنید.",
    "installation.windows.step3": "دانلود باید به صورت خودکار شروع شود.",
    "installation.windows.install": "نصب Git روی ویندوز",
    "installation.windows.step4": "فایل اجرایی دانلود شده را اجرا کنید.",
    "installation.windows.step5":
        "مراحل نصب را دنبال کنید. گزینه‌های پیش‌فرض معمولاً برای اکثر کاربران مناسب است.",
    "installation.windows.step6":
        "در حین نصب، 'Use Git from the Windows Command Prompt' را انتخاب کنید تا Git به PATH شما اضافه شود.",
    "installation.windows.step7": "فرآیند نصب را کامل کنید و روی 'Finish' کلیک کنید.",

    // Linux
    "installation.linux.title": "نصب Git روی لینوکس",
    "installation.linux.debian": "دبیان/اوبونتو و مشتقات آن",
    "installation.linux.fedora": "فدورا/RHEL/CentOS",
    "installation.linux.arch": "آرچ لینوکس",

    // Mac
    "installation.mac.title": "نصب Git روی macOS",
    "installation.mac.option1": "گزینه 1: ابزارهای خط فرمان",
    "installation.mac.option1Desc":
        "ساده‌ترین راه نصب Git روی مک باز کردن Terminal و تایپ 'git --version' است. اگر Git نصب نشده باشد، از شما خواسته می‌شود تا ابزارهای خط فرمان را نصب کنید.",
    "installation.mac.option2": "گزینه 2: دانلود نصب‌کننده Git",
    "installation.mac.step1": "به وب‌سایت رسمی Git در git-scm.com/downloads بروید.",
    "installation.mac.step2": "روی لینک دانلود macOS کلیک کنید.",
    "installation.mac.step3": "پکیج دانلود شده را طبق راهنما نصب کنید.",
    "installation.mac.brew": "گزینه 3: استفاده از Homebrew",
    "installation.mac.brewDesc": "اگر Homebrew نصب دارید، می‌توانید Git را با دستورات زیر نصب کنید:",

    // Common Configuration
    "installation.config": "پیکربندی Git",
    "installation.configDesc":
        "بعد از نصب، باید نام کاربری و آدرس ایمیل خود را تنظیم کنید. این اطلاعات با هر کامیت Git استفاده می‌شود.",
    "installation.verification": "تأیید نصب",
    "installation.verificationDesc":
        "برای تأیید اینکه Git به درستی نصب شده است، یک terminal یا command prompt باز کنید و اجرا کنید:",

    // SSH Key Generation
    "installation.ssh.title": "تولید کلیدهای SSH",
    "installation.ssh.intro":
        "کلیدهای SSH امکان اتصال امن به سرویس‌های میزبانی Git مانند GitHub، GitLab یا Bitbucket بدون وارد کردن رمز عبور برای هر push/pull را فراهم می‌کنند.",
    "installation.ssh.generate": "ایجاد کلید SSH",
    "installation.ssh.generateDesc":
        "دستور زیر را برای ایجاد یک کلید SSH جدید اجرا کنید. آدرس ایمیل را با ایمیل خود جایگزین کنید:",
    "installation.ssh.saveLocation": "تأیید مکان ذخیره",
    "installation.ssh.saveLocationDesc":
        "وقتی پرسیده می‌شود کجا کلید را ذخیره کنید، برای مکان پیش‌فرض Enter فشار دهید:",
    "installation.ssh.passphrase": "عبارت عبور (اختیاری)",
    "installation.ssh.passphraseDesc":
        "می‌توانید یک عبارت عبور برای امنیت اضافی وارد کنید یا Enter فشار دهید تا ادامه دهید:",
    "installation.ssh.copyKey": "کپی کلید عمومی",
    "installation.ssh.copyKeyDesc":
        "محتوای کلید SSH عمومی خود را به کلیپ‌بورد کپی کنید:",
    "installation.ssh.windows.copyKey": "برای ویندوز (Git Bash/PowerShell):",
    "installation.ssh.mac.copyKey": "برای macOS:",
    "installation.ssh.linux.copyKey": "برای لینوکس:",

    // GitHub/GitLab Connection
    "installation.github.title": "اتصال به GitHub",
    "installation.github.intro":
        "GitHub محبوب‌ترین سرویس میزبانی Git است. در اینجا نحوه اضافه کردن کلید SSH شما آورده شده:",
    "installation.github.step1": "به GitHub.com بروید و وارد حساب خود شوید",
    "installation.github.step2": "روی عکس پروفایل خود (بالا راست) → Settings کلیک کنید",
    "installation.github.step3": "روی 'SSH and GPG keys' در نوار کناری چپ کلیک کنید",
    "installation.github.step4": "روی 'New SSH key' کلیک کنید",
    "installation.github.step5": "یک عنوان توصیفی وارد کنید (مثل 'My Laptop')",
    "installation.github.step6": "کلید SSH کپی شده خود را در فیلد 'Key' بچسبانید",
    "installation.github.step7": "روی 'Add SSH key' کلیک کنید",
    "installation.github.test": "تست اتصال",
    "installation.github.testDesc": "اتصال SSH به GitHub را با این دستور تست کنید:",
    "installation.github.testSuccess": "در صورت اتصال موفق، پیام خوش‌آمدگویی از GitHub خواهید دید.",

    "installation.gitlab.title": "اتصال به GitLab",
    "installation.gitlab.intro":
        "GitLab پلتفرم محبوب دیگری برای میزبانی Git است. در اینجا نحوه اضافه کردن کلید SSH شما آورده شده:",
    "installation.gitlab.step1": "به GitLab.com بروید و وارد حساب خود شوید",
    "installation.gitlab.step2": "روی عکس پروفایل خود (بالا راست) → Edit profile کلیک کنید",
    "installation.gitlab.step3": "روی 'SSH Keys' در نوار کناری چپ کلیک کنید",
    "installation.gitlab.step4": "کلید SSH خود را در فیلد 'Key' بچسبانید",
    "installation.gitlab.step5": "یک عنوان توصیفی وارد کنید",
    "installation.gitlab.step6": "تاریخ انقضا انتخاب کنید (اختیاری اما توصیه شده)",
    "installation.gitlab.step7": "روی 'Add key' کلیک کنید",
    "installation.gitlab.test": "تست اتصال",
    "installation.gitlab.testDesc": "اتصال SSH به GitLab را تست کنید:",

    // First Repository Setup
    "installation.firstRepo.title": "راه‌اندازی اولین مخزن",
    "installation.firstRepo.intro":
        "بعد از اینکه Git پیکربندی شد و اتصال SSH تنظیم شد، می‌توانید شروع به کار کنید:",
    "installation.firstRepo.clone": "کلون کردن مخزن موجود",
    "installation.firstRepo.cloneDesc": "برای کلون کردن یک مخزن موجود از GitHub/GitLab:",
    "installation.firstRepo.create": "ایجاد مخزن جدید",
    "installation.firstRepo.createDesc": "برای ایجاد یک مخزن محلی جدید:",
    "installation.firstRepo.connect": "اتصال مخزن محلی به مخزن راه‌دور",
    "installation.firstRepo.connectDesc": "برای اتصال یک مخزن محلی به مخزن راه‌دور:",

    // Troubleshooting
    "installation.troubleshooting.title": "عیب‌یابی",
    "installation.troubleshooting.intro":
        "در اینجا راه‌حل‌هایی برای مشکلات رایج در حین نصب و پیکربندی Git آورده شده:",
    "installation.troubleshooting.commandNotFound": "خطا: دستور 'git' پیدا نشد",
    "installation.troubleshooting.commandNotFoundSolution":
        "• بررسی کنید که آیا Git به درستی نصب شده است\n• مطمئن شوید که Git به PATH شما اضافه شده است\n• terminal/command prompt را مجدداً راه‌اندازی کنید\n• در ویندوز: از Git Bash استفاده کنید یا دستی Git را به PATH اضافه کنید",
    "installation.troubleshooting.permissionDenied": "خطا: دسترسی رد شد (publickey)",
    "installation.troubleshooting.permissionDeniedSolution":
        "• بررسی کنید که کلید SSH شما به درستی به GitHub/GitLab اضافه شده است\n• مطمئن شوید که از URL کلون SSH استفاده می‌کنید (نه HTTPS)\n• اتصال SSH را با 'ssh -T git@github.com' تست کنید\n• بررسی کنید که SSH agent در حال اجرا است: 'ssh-add -l'",
    "installation.troubleshooting.httpsToSsh": "تغییر از HTTPS به SSH",
    "installation.troubleshooting.httpsToSshSolution":
        "اگر قبلاً مخزنی را با HTTPS کلون کرده‌اید، می‌توانید به احراز هویت SSH تغییر دهید:",
    "installation.troubleshooting.sslError": "خطای گواهی SSL",
    "installation.troubleshooting.sslErrorSolution":
        "در شبکه‌های شرکتی یا سرورهای پروکسی، مشکلات SSL ممکن است رخ دهد:\n• موقت: 'git config --global http.sslVerify false' (توصیه نمی‌شود)\n• بهتر: Git را برای پروکسی خود پیکربندی کنید یا از گواهی شرکتی استفاده کنید",
    "installation.troubleshooting.lineEndingIssues": "مشکلات پایان خط",
    "installation.troubleshooting.lineEndingIssuesSolution":
        "در تیم‌های سیستم عامل مختلط:\n• ویندوز: 'git config --global core.autocrlf true'\n• macOS/لینوکس: 'git config --global core.autocrlf input'\n• جایگزین: از فایل .gitattributes برای کنترل دقیق استفاده کنید",
    "installation.troubleshooting.mergeConflicts": "کمک اولیه برای تعارضات ادغام",
    "installation.troubleshooting.mergeConflictsSolution":
        "• از 'git status' برای دیدن فایل‌های تأثیرپذیر استفاده کنید\n• فایل‌ها را به صورت دستی ویرایش کنید یا از ابزار ادغام استفاده کنید\n• بعد از ویرایش: 'git add .' و 'git commit'\n• اگر مطمئن نیستید: 'git merge --abort' برای لغو ادغام",

    // Enhanced Platform Details
    "installation.windows.enhanced.title": "نصب تفصیلی ویندوز",
    "installation.windows.enhanced.prereq": "پیش‌نیازها",
    "installation.windows.enhanced.prereqDesc":
        "• ویندوز 7 یا جدیدتر\n• حقوق مدیر برای نصب\n• دسترسی به اینترنت برای دانلود",
    "installation.windows.enhanced.installerOptions": "گزینه‌های مهم نصب‌کننده",
    "installation.windows.enhanced.installerOptionsDesc":
        "در حین نصب، این گزینه‌ها را انتخاب کنید:\n• 'Git from the command line and also from 3rd-party software'\n• 'Use bundled OpenSSH'\n• 'Use the OpenSSL library'\n• 'Checkout Windows-style, commit Unix-style line endings'\n• 'Use Windows' default console window'",
    "installation.windows.enhanced.postInstall": "بعد از نصب",
    "installation.windows.enhanced.postInstallDesc":
        "• Git Bash در منوی کلیک راست (کلیک راست در پوشه‌ها) در دسترس است\n• Git GUI رابط گرافیکی ارائه می‌دهد\n• Windows Terminal یا PowerShell نیز می‌تواند استفاده شود",

    "installation.linux.enhanced.title": "نصب تفصیلی لینوکس",
    "installation.linux.enhanced.package": "استفاده از مدیر بسته",
    "installation.linux.enhanced.packageDesc":
        "نصب از طریق مدیر بسته روش توصیه شده برای لینوکس است:",
    "installation.linux.enhanced.source": "کامپایل از سورس (پیشرفته)",
    "installation.linux.enhanced.sourceDesc":
        "برای آخرین نسخه یا پیکربندی‌های خاص:",
    "installation.linux.enhanced.sourceSteps":
        "# نصب وابستگی‌ها (اوبونتو/دبیان)\nsudo apt-get install make libssl-dev libghc-zlib-dev libcurl4-gnutls-dev libncurses5-dev autoconf build-essential\n\n# دانلود سورس Git\nwget https://github.com/git/git/archive/v2.43.0.tar.gz\ntar -zxf v2.43.0.tar.gz\ncd git-2.43.0\n\n# کامپایل و نصب\nmake configure\n./configure --prefix=/usr/local\nmake all\nsudo make install",

    "installation.mac.enhanced.title": "نصب تفصیلی macOS",
    "installation.mac.enhanced.xcode": "ابزارهای خط فرمان Xcode",
    "installation.mac.enhanced.xcodeDesc":
        "ساده‌ترین روش برای کاربران macOS:\n• Terminal را باز کنید (Applications → Utilities → Terminal)\n• 'git --version' تایپ کنید\n• اگر Git نصب نشده باشد، از شما خواسته می‌شود تا نصب کنید\n• روی 'Install' کلیک کنید تا ابزارهای خط فرمان نصب شوند",
    "installation.mac.enhanced.homebrew": "Homebrew (توصیه شده)",
    "installation.mac.enhanced.homebrewDesc":
        "Homebrew یک مدیر بسته برای macOS است که مدیریت ابزارهای توسعه‌دهنده را ساده می‌کند:",
    "installation.mac.enhanced.homebrewSteps":
        "# نصب Homebrew (اگر قبلاً موجود نیست)\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\n\n# نصب Git\nbrew install git\n\n# به‌روزرسانی Git (بعداً)\nbrew upgrade git",
    "installation.mac.enhanced.macports": "MacPorts (جایگزین)",
    "installation.mac.enhanced.macportsDesc":
        "اگر از MacPorts استفاده می‌کنید:\n• sudo port install git +universal\n• sudo port install git-flow (اختیاری)",

    // Additional Settings
    "installation.additionalSettings.title": "پیکربندی اضافی",
    "installation.additionalSettings.intro":
        "در اینجا برخی تنظیمات اضافی توصیه شده برای پیکربندی Git برای استفاده بهینه آورده شده:",
    "installation.additionalSettings.lineEndings": "پیکربندی پایان خط‌ها",
    "installation.additionalSettings.lineEndingsDesc":
        "سیستم‌عامل‌های مختلف پایان خط‌ها را متفاوت مدیریت می‌کنند. Git را پیکربندی کنید تا آن‌ها را به درستی مدیریت کند:",
    "installation.additionalSettings.defaultBranch": "تنظیم نام شاخه پیش‌فرض",
    "installation.additionalSettings.defaultBranchDesc":
        "گردش کارهای مدرن Git معمولاً از 'main' به عنوان نام شاخه پیش‌فرض به جای 'master' استفاده می‌کنند:",
    "installation.additionalSettings.editor": "پیکربندی ویرایشگر پیش‌فرض",
    "installation.additionalSettings.editorDesc":
        "ویرایشگر متن مورد نظر خود را برای پیام‌های کامیت Git و سایر عملیات تنظیم کنید:",

    // Resources
    "installation.resources.title": "منابع اضافی",
    "installation.resources.download": "دانلود",
    "installation.resources.gui": "کلاینت‌های GUI Git",
    "installation.resources.githubDesktop": "کلاینت Git ساده و کاربرپسند توسط GitHub",
    "installation.resources.gitkraken": "کلاینت قدرتمند Git با تاریخچه کامیت بصری",
    "installation.resources.sourcetree": "کلاینت رایگان Git برای ویندوز و مک",
    "installation.resources.editors": "ویرایشگرهای کد دوستدار Git",
    "installation.resources.vscode": "ویرایشگر کد رایگان با پشتیبانی داخلی Git",
    "installation.resources.atom": "ویرایشگر کد رایگان با یکپارچه‌سازی Git",
    "installation.resources.sublime": "ویرایشگر متن محبوب با افزونه‌های Git",
    "installation.resources.docs": "مستندات",
    "installation.resources.officialDocs": "مستندات رسمی Git",
    "installation.resources.proGitBook": "کتاب Pro Git (رایگان)",
    "installation.resources.githubGuide": "راهنمای GitHub برای راه‌اندازی Git",
};

export default installation;
