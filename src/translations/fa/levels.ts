const levels = {
    // Level Page
    "level.gitTerminal": "ترمینال Git",
    "level.currentChallenge": "چالش فعلی",
    "level.objectives": "اهداف:",
    "level.showHints": "نمایش راهنما",
    "level.hideHints": "مخفی کردن راهنما",
    "level.nextLevel": "سطح بعدی",
    "level.filesToEdit": "فایل‌های قابل ویرایش:",
    "level.workingTreeClean": "درخت کاری تمیز",
    "level.staged": "آماده شده",
    "level.modified": "تغییر یافته",
    "level.untracked": "ردیابی نشده",
    "level.gitNotInitialized": "Git هنوز راه‌اندازی نشده",
    "level.branch": "شاخه:",
    "level.gitStatus": "وضعیت Git",
    "level.advancedOptions": "گزینه‌های پیشرفته",
    "level.hideAdvancedOptions": "مخفی کردن گزینه‌های پیشرفته",
    "level.resetLevel": "بازنشانی سطح",
    "level.resetAllProgress": "بازنشانی تمام پیشرفت",
    "level.resetConfirm": "آیا مطمئن هستید که می‌خواهید تمام پیشرفت خود را بازنشانی کنید؟",
    "level.level": "سطح",
    "level.levelCompleted": "سطح تکمیل شد!",
    "level.realWorldContext": "زمینه دنیای واقعی",
    "level.task": "وظیفه شما",
    "level.startCoding": "شروع کدنویسی",
    "level.storyButton": "نمایش داستان",
    "level.advancedModeOn": "حالت پیشرفته (فعال)",
    "level.advancedModeOff": "حالت پیشرفته (غیرفعال)",
    "level.notFound": "سطح پیدا نشد",
    "level.techModeOn": "تمرکز بر دستورات (حالت فنی)",
    "level.storyModeOn": "نمایش زمینه داستان (حالت داستان)",
    "level.techModeDescription":
        "حالت فنی بر دستورات Git بدون داستان‌ها یا زمینه متمرکز است برای تجربه‌ای سریع‌تر و مستقیم‌تر.",
    "level.storyModeDescription":
        "حالت داستان زمینه دنیای واقعی و توضیحات را فراهم می‌کند تا کمک کند بفهمید چرا و چگونه دستورات Git استفاده می‌شوند.",
    "level.editFile": "ویرایش فایل",
    "level.deleteFile": "حذف فایل",
    "level.confirmDelete": "آیا مطمئن هستید که می‌خواهید {file} را حذف کنید؟",
    "level.hints": "راهنماها",

    // Level Content - Intro Stage
    "intro.name": "مقدمه‌ای بر Git",
    "intro.description": "مبانی Git را یاد بگیرید",

    "intro.level1.name": "راه‌اندازی Git",
    "intro.level1.description": "ایجاد یک مخزن Git جدید",
    "intro.level1.objective1": "راه‌اندازی یک مخزن Git جدید",
    "intro.level1.hint1": "از دستور `git init` استفاده کنید",
    "intro.level1.hint2": "این یک دایرکتوری مخفی .git ایجاد می‌کند",
    "intro.level1.requirement1.description": "راه‌اندازی یک مخزن Git",
    "intro.level1.requirement1.success": "عالی! شما یک مخزن Git ایجاد کرده‌اید.",
    "intro.level1.story.title": "خوش آمدید به تیم",
    "intro.level1.story.narrative":
        "به شغل جدید خود به عنوان یک توسعه‌دهنده در TechStart خوش آمدید! من الکس هستم، رهبر تیم شما.\n\nاین اولین روز شماست و ما می‌خواهیم به شما کمک کنیم تا سریعاً مفید شوید. ما از Git برای کنترل نسخه استفاده می‌کنیم - این به ما کمک می‌کند تا تغییرات در کد را ردیابی کنیم و به عنوان یک تیم با هم کار کنیم.\n\nاولین کاری که باید انجام دهید ایجاد یک مخزن جدید برای پروژه راه‌اندازی شماست. ما از دستور `git init` برای این کار استفاده می‌کنیم.",
    "intro.level1.story.realWorldContext":
        "در تیم‌های توسعه واقعی، Git ضروری است. این اولین ابزاری است که برای یک پروژه جدید راه‌اندازی می‌کنید.",
    "intro.level1.story.taskIntroduction": "بیایید یک مخزن جدید برای پروژه شما ایجاد کنیم.",

    "intro.level2.name": "وضعیت مخزن",
    "intro.level2.description": "بررسی وضعیت مخزن شما",
    "intro.level2.objective1": "نمایش وضعیت مخزن Git شما",
    "intro.level2.hint1": "از دستور `git status` استفاده کنید",
    "intro.level2.hint2": "این دستور وضعیت فعلی مخزن شما را نشان می‌دهد",
    "intro.level2.requirement1.description": "نمایش وضعیت مخزن",
    "intro.level2.requirement1.success": "عالی! حالا می‌توانید وضعیت مخزن خود را ببینید.",
    "intro.level2.story.title": "چه اتفاقی در مخزن شما می‌افتد؟",
    "intro.level2.story.narrative":
        "عالی! شما اولین مخزن Git خود را ایجاد کرده‌اید. دایرکتوری مخفی .git حالا تمام اطلاعاتی که Git نیاز دارد را شامل می‌شود.\n\nالکس می‌گذرد: \"کار عالی! بعد باید ببینید چه اتفاقی در مخزن شما می‌افتد. با `git status` می‌توانید وضعیت فعلی را در هر زمان بررسی کنید.\"",
    "intro.level2.story.realWorldContext":
        "توسعه‌دهندگان `git status` را چندین بار در روز اجرا می‌کنند تا ببینند کدام فایل‌ها تغییر کرده‌اند و کدام‌ها برای کامیت بعدی آماده هستند.",
    "intro.level2.story.taskIntroduction": "وضعیت مخزن خود را با `git status` بررسی کنید.",

    // Level Content - Files Stage
    "files.name": "عملیات فایل",
    "files.description": "یاد بگیرید چگونه فایل‌ها را با Git مدیریت کنید",

    "files.level1.name": "آماده‌سازی تغییرات",
    "files.level1.description": "اضافه کردن فایل‌ها به ناحیه آماده‌سازی",
    "files.level1.objective1": "اضافه کردن تمام فایل‌ها به ناحیه آماده‌سازی",
    "files.level1.hint1": "از دستور `git add .` استفاده کنید",
    "files.level1.hint2": "نقطه نشان‌دهنده 'تمام فایل‌ها در دایرکتوری فعلی' است",
    "files.level1.requirement1.description": "اضافه کردن تمام فایل‌ها به ناحیه آماده‌سازی",
    "files.level1.requirement1.success": "عالی! شما تمام فایل‌ها را به ناحیه آماده‌سازی اضافه کرده‌اید.",
    "files.level1.story.title": "آماده‌سازی تغییرات کد",
    "files.level1.story.narrative":
        "\"سلام!\" سارا، همکار شما صدا می‌زند، \"می‌بینم که شما قبلاً با Git شروع کرده‌اید. بعد باید یاد بگیرید چگونه تغییرات را آماده کنید.\"\n\nاو توضیح می‌دهد: \"وقتی فایل‌ها را تغییر می‌دهید، باید صراحتاً به Git بگویید کدام تغییرات باید در کامیت بعدی گنجانده شوند. این 'آماده‌سازی' نامیده می‌شود و با `git add` کار می‌کند.\"",
    "files.level1.story.realWorldContext":
        "مفهوم آماده‌سازی یک ویژگی قدرتمند Git است. این به شما امکان می‌دهد تا فقط تغییرات انتخاب شده را کامیت کنید در حالی که بقیه می‌توانند در حال انجام باقی بمانند.",
    "files.level1.story.taskIntroduction": "تمام فایل‌ها را با `git add .` به ناحیه آماده‌سازی اضافه کنید.",

    "files.level2.name": "کامیت کردن تغییرات",
    "files.level2.description": "ایجاد یک کامیت با تغییرات شما",
    "files.level2.objective1": "ایجاد یک کامیت با پیام",
    "files.level2.hint1": "از دستور `git commit -m 'پیام شما'` استفاده کنید",
    "files.level2.hint2": "پیام باید تغییرات شما را توصیف کند",
    "files.level2.requirement1.description": "ایجاد یک کامیت با پیام",
    "files.level2.requirement1.success": "عالی! شما با موفقیت یک کامیت ایجاد کرده‌اید.",
    "files.level2.story.title": "اولین کامیت شما",
    "files.level2.story.narrative":
        '"کار عالی!" الکس وقتی پیشرفت شما را می‌بیند می‌گوید. "شما تغییرات را به ناحیه آماده‌سازی اضافه کرده‌اید. حالا وقت اولین کامیت شماست."\n\nاو توضیح می‌دهد: "یک کامیت مانند یک تصویر فوری از پروژه شما در یک نقطه خاص از زمان است. هر کامیت به پیامی نیاز دارد که آنچه تغییر کرده را توصیف کند. این برای قابلیت ردیابی مهم است."',
    "files.level2.story.realWorldContext":
        "پیام‌های کامیت خوب در تیم‌های توسعه بسیار مهم هستند. آن‌ها به همه کمک می‌کنند تا بفهمند چرا تغییری انجام شده، نه فقط آنچه تغییر کرده.",
    "files.level2.story.taskIntroduction": "اولین کامیت خود را با پیامی معنادار ایجاد کنید.",

    "files.level3.name": "حذف فایل‌ها",
    "files.level3.description": "یاد بگیرید چگونه فایل‌ها را از Git حذف کنید",
    "files.level3.objective1": "حذف یک فایل از هم دایرکتوری کاری و هم ایندکس",
    "files.level3.hint1": "از دستور `git rm <file>` استفاده کنید",
    "files.level3.hint2": "این فایل را از Git حذف می‌کند و همچنین آن را از دایرکتوری کاری شما نیز پاک می‌کند",
    "files.level3.requirement1.description": "حذف یک فایل با استفاده از Git",
    "files.level3.requirement1.success": "عالی! شما فایل را از Git و دایرکتوری کاری خود حذف کرده‌اید.",
    "files.level3.story.title": "تمیز کردن",
    "files.level3.story.narrative":
        '"می‌بینم که پیشرفت خوبی داشته‌اید،" الکس وقتی کار شما را بررسی می‌کند می‌گوید. "اما متوجه می‌شوم که فایل‌های موقت یا پیش‌نویس‌هایی وجود دارند که دیگر نیازی نداریم. باید مخزن را تمیز کنیم."\n\nاو توضیح می‌دهد: "وقتی می‌خواهید فایل‌هایی که توسط Git ردیابی می‌شوند را حذف کنید، باید از `git rm` استفاده کنید نه اینکه آن‌ها را به صورت دستی حذف کنید. این اطمینان می‌دهد که Git حذف را به درستی ردیابی می‌کند."',
    "files.level3.story.realWorldContext":
        "نگه داشتن مخازن تمیز با حذف فایل‌های غیرضروری یک تمرین خوب است. دستور `git rm` اطمینان می‌دهد که Git حذف فایل را ردیابی می‌کند.",
    "files.level3.story.taskIntroduction": "فایل غیرضروری را از مخزن با `git rm` حذف کنید.",

    // Level Content - Branches Stage
    "branches.name": "کار با شاخه‌ها",
    "branches.description": "یاد بگیرید چگونه با شاخه‌ها کار کنید",

    "branches.level1.name": "نمایش شاخه‌ها",
    "branches.level1.description": "نمایش تمام شاخه‌های موجود در مخزن شما",
    "branches.level1.objective1": "نمایش تمام شاخه‌های موجود",
    "branches.level1.hint1": "از دستور `git branch` استفاده کنید",
    "branches.level1.hint2": "این تمام شاخه‌های محلی را نشان می‌دهد",
    "branches.level1.requirement1.description": "نمایش تمام شاخه‌ها",
    "branches.level1.requirement1.success": "خیلی خوب! حالا می‌توانید تمام شاخه‌های موجود در مخزن خود را ببینید.",
    "branches.level1.story.title": "شاخه‌های کد",
    "branches.level1.story.narrative":
        "\"وقت چیزی پیشرفته‌تر است،\" الکس می‌گوید و یک درخت با شاخه‌ها روی تخته سفید می‌کشد. \"این شاخه‌ها مانند شاخه‌های Git هستند. آن‌ها به شما امکان می‌دهند روی نسخه‌های مختلف کد خود به طور همزمان کار کنید.\"\n\nاو ادامه می‌دهد: \"در حال حاضر شما روی شاخه 'main' کار می‌کنید. بیایید ابتدا ببینیم چه شاخه‌هایی داریم.\"",
    "branches.level1.story.realWorldContext":
        "شاخه‌ها یک مفهوم اساسی در Git هستند. آن‌ها توسعه موازی، جداسازی ویژگی‌ها و کار تجربی را بدون تأثیر بر کد اصلی امکان‌پذیر می‌کنند.",
    "branches.level1.story.taskIntroduction": "تمام شاخه‌های موجود را با git branch نمایش دهید.",

    "branches.level2.name": "ایجاد و تغییر به شاخه",
    "branches.level2.description": "ایجاد یک شاخه جدید و تغییر به آن با استفاده از دستور مدرن git switch",
    "branches.level2.objective1": "ایجاد یک شاخه جدید به نام 'feature' و تغییر به آن",
    "branches.level2.hint1": "از دستور `git switch -c feature` استفاده کنید",
    "branches.level2.hint2": "پرچم -c یک شاخه جدید ایجاد می‌کند و در یک مرحله به آن تغییر می‌دهد",
    "branches.level2.requirement1.description": "ایجاد یک شاخه جدید و تغییر به آن با git switch -c",
    "branches.level2.requirement1.success":
        "عالی! شما یک شاخه جدید ایجاد کرده‌اید و با استفاده از دستور مدرن git switch به آن تغییر داده‌اید.",
    "branches.level2.story.title": "ایجاد شاخه مدرن",
    "branches.level2.story.narrative":
        "\"عالی! حالا می‌خواهیم یک ویژگی جدید پیاده‌سازی کنیم،\" الکس می‌گوید. \"برای این کار، یک شاخه جدید به نام 'feature' ایجاد می‌کنیم تا تغییرات ما روی کد اصلی تأثیر نگذارند.\"\n\nاو روش مدرن را به شما نشان می‌دهد: \"Git دستور `git switch` را معرفی کرد تا عملیات شاخه‌ها واضح‌تر شود. از `git switch -c feature` استفاده کنید تا شاخه جدید را ایجاد کرده و در یک مرحله به آن تغییر دهید. این روش ترجیحی مدرن به جای `git checkout -b` قدیمی است.\"",
    "branches.level2.story.realWorldContext":
        "در تیم‌های توسعه حرفه‌ای، شما تقریباً هرگز مستقیماً روی شاخه main کار نمی‌کنید. دستور `git switch` که در Git 2.23 معرفی شد، روشی تمیزتر و شهودی‌تر برای کار با شاخه‌ها در مقایسه با دستور checkout قدیمی فراهم می‌کند.",
    "branches.level2.story.taskIntroduction":
        "یک شاخه جدید به نام 'feature' ایجاد کنید و با `git switch -c` به آن تغییر دهید.",

    "branches.level3.name": "تغییر بین شاخه‌ها",
    "branches.level3.description": "تغییر بین شاخه‌های موجود",
    "branches.level3.objective1": "تغییر بین شاخه‌ها با استفاده از git switch",
    "branches.level3.hint1": "از دستور `git switch <branch>` استفاده کنید",
    "branches.level3.hint2": "این به یک شاخه موجود تغییر می‌دهد",
    "branches.level3.requirement1.description": "تغییر به شاخه دیگری با استفاده از git switch",
    "branches.level3.requirement1.success": "عالی! شما با استفاده از git switch بین شاخه‌ها تغییر کرده‌اید.",
    "branches.level3.story.title": "ناوبری شاخه",
    "branches.level3.story.narrative":
        "\"حالا که می‌دانید چگونه شاخه‌ها را ایجاد کنید، بیایید حرکت بین آن‌ها را تمرین کنیم،\" سارا می‌گوید. \"این چیزی است که در کار توسعه واقعی دائماً انجام خواهید داد.\"\n\nاو توضیح می‌دهد: \"می‌توانید با `git switch <branch-name>` به هر شاخه موجودی تغییر دهید. این خیلی واضح‌تر از `git checkout` قدیمی است که می‌توانست گیج‌کننده باشد چون کارهای زیادی انجام می‌داد.\"",
    "branches.level3.story.realWorldContext":
        "تغییر بین شاخه‌ها یکی از رایج‌ترین عملیات Git است. دستور اختصاصی `git switch` قصد را واضح می‌کند و در مقایسه با دستور چندمنظوره checkout سردرگمی را کاهش می‌دهد.",
    "branches.level3.story.taskIntroduction": "تغییر به شاخه دیگری را با `git switch` تمرین کنید.",

    // Level Content - Merge Stage
    "merge.name": "ادغام شاخه‌ها",
    "merge.description": "یاد بگیرید چگونه شاخه‌ها را ادغام کنید",

    "merge.level1.name": "ادغام شاخه‌ها",
    "merge.level1.description": "ادغام یک شاخه در شاخه فعلی",
    "merge.level1.objective1": "ادغام شاخه \"feature\" در شاخه \"main\"",
    "merge.level1.hint1": "از دستور `git merge feature` استفاده کنید",
    "merge.level1.hint2": "این شاخه feature را در شاخه فعلی شما ادغام می‌کند",
    "merge.level1.requirement1.description": "ادغام یک شاخه",
    "merge.level1.requirement1.success": "عالی! شما با موفقیت یک شاخه را ادغام کرده‌اید.",
    "merge.level1.story.title": "یکپارچه‌سازی کد",
    "merge.level1.story.narrative":
        '"عالی! ویژگی شما کامل و تست شده است،" الکس می‌گوید. "حالا وقت یکپارچه‌سازی این تغییرات در کد اصلی است."\n\nاو توضیح می‌دهد: "از آنجایی که شما قبلاً روی شاخه main هستید، می‌توانید شاخه feature را مستقیماً با `git merge feature` ادغام کنید."',
    "merge.level1.story.realWorldContext":
        "ادغام بخش مهمی از گردش کار Git است. در تیم‌های بزرگ‌تر، این اغلب از طریق pull request ها و بررسی کد رسمی‌سازی می‌شود.",
    "merge.level1.story.taskIntroduction": "شاخه \"feature\" را در شاخه \"main\" ادغام کنید.",

    "merge.level2.name": "مدیریت تعارضات ادغام",
    "merge.level2.description": "یاد بگیرید چگونه ادغام‌های دارای تعارض را مدیریت یا لغو کنید",
    "merge.level2.objective1": "لغو یک ادغام دارای تعارض",
    "merge.level2.hint1": "از دستور `git merge --abort` استفاده کنید",
    "merge.level2.hint2": "این فرآیند ادغام را متوقف می‌کند و به حالت قبل از شروع ادغام برمی‌گرداند",
    "merge.level2.requirement1.description": "لغو یک ادغام دارای تعارض",
    "merge.level2.requirement1.success": "عالی! شما با موفقیت عملیات ادغام را لغو کرده‌اید.",
    "merge.level2.story.title": "وقتی ادغام‌ها اشتباه پیش می‌روند",
    "merge.level2.story.narrative":
        '"گاهی اوقات چیزها با ادغام‌ها طبق برنامه پیش نمی‌روند،" الکس هشدار می‌دهد. "اگر همان قسمت از یک فایل در دو شاخه‌ای که ادغام می‌کنید متفاوت تغییر کرده باشد، Git نمی‌تواند آن‌ها را به صورت خودکار ترکیب کند."\n\nاو ادامه می‌دهد: "وقتی با تعارضات ادغام مواجه می‌شوید، دو گزینه دارید: آن‌ها را به صورت دستی حل کنید، یا اگر هنوز آماده برخورد با آن‌ها نیستید ادغام را لغو کنید."',
    "merge.level2.story.realWorldContext":
        "تعارضات ادغام بخش رایج توسعه مشارکتی هستند. دانستن نحوه مدیریت آن‌ها - چه با حل کردن و چه لغو موقت - مهارت ضروری است.",
    "merge.level2.story.taskIntroduction": "لغو یک عملیات ادغام را با git merge --abort تمرین کنید.",

    // Remote Stage
    "remote.name": "مخازن راه‌دور",
    "remote.description": "یاد بگیرید با مخازن راه‌دور کار کنید",

    // Remote Level 1
    "remote.level1.name": "اضافه کردن مخازن راه‌دور",
    "remote.level1.description": "اتصال به یک مخزن راه‌دور",
    "remote.level1.objective1": "اضافه کردن یک مخزن راه‌دور",
    "remote.level1.hint1": "از دستور `git remote add <name> <url>` استفاده کنید",
    "remote.level1.hint2": "قرارداد این است که مخزن راه‌دور اصلی خود را 'origin' نام‌گذاری کنید",
    "remote.level1.requirement1.description": "اضافه کردن یک مخزن راه‌دور",
    "remote.level1.requirement1.success": "عالی! شما یک مخزن راه‌دور اضافه کرده‌اید.",
    "remote.level1.story.title": "اتصال مخازن",
    "remote.level1.story.narrative":
        '"پیشرفت عالی تا الان! حالا وقت اتصال مخزن محلی شما به یک مخزن راه‌دور است،" الکس می‌گوید. "این به شما امکان می‌دهد کد خود را با تیم به اشتراک بگذارید و به طور مؤثر همکاری کنید."\n\nاو توضیح می‌دهد: "اولین قدم اضافه کردن اتصال به مخزن راه‌دور با `git remote add` است. این هنوز هیچ کدی منتقل نمی‌کند - فقط اتصال را ایجاد می‌کند."',
    "remote.level1.story.realWorldContext":
        "مخازن راه‌دور مرکز گردش کارهای توسعه مشارکتی هستند. اکثر سیستم‌های مبتنی بر Git مانند GitHub، GitLab و Bitbucket با میزبانی مخازن راه‌دوری کار می‌کنند که اعضای تیم به آن‌ها متصل می‌شوند.",
    "remote.level1.story.taskIntroduction": "یک مخزن راه‌دور به نام 'origin' به مخزن خود اضافه کنید.",

    // Remote Level 2
    "remote.level2.name": "ارسال تغییرات",
    "remote.level2.description": "ارسال تغییرات شما به یک مخزن راه‌دور",
    "remote.level2.objective1": "ارسال کامیت‌های شما به مخزن راه‌دور",
    "remote.level2.hint1": "از دستور `git push <remote> <branch>` استفاده کنید",
    "remote.level2.hint2": "برای اولین push شما به یک شاخه جدید، ممکن است نیاز باشد upstream را با -u تنظیم کنید",
    "remote.level2.requirement1.description": "ارسال تغییرات شما به مخزن راه‌دور",
    "remote.level2.requirement1.success": "عالی! شما تغییرات خود را به مخزن راه‌دور ارسال کرده‌اید.",
    "remote.level2.story.title": "به اشتراک‌گذاری کار شما",
    "remote.level2.story.narrative":
        '"حالا که به مخزن راه‌دور متصل شده‌ایم، وقت به اشتراک‌گذاری کار شما با تیم است،" الکس می‌گوید. "این با استفاده از دستور `git push` انجام می‌شود."\n\nاو ادامه می‌دهد: "وقتی push می‌کنید، کامیت‌های شما به مخزن راه‌دور آپلود می‌شوند و در دسترس سایر اعضای تیم قرار می‌گیرند. این نحوه همکاری در Git است."',
    "remote.level2.story.realWorldContext":
        "Push کردن نحوه به اشتراک‌گذاری کار شما در گردش کار مبتنی بر Git است. این برعکس pull است که تغییرات دیگران را به مخزن محلی شما می‌آورد.",
    "remote.level2.story.taskIntroduction": "تغییرات خود را به مخزن راه‌دور push کنید.",

    // Rebase Stage
    "rebase.name": "Rebasing",
    "rebase.description": "یاد بگیرید چگونه شاخه‌ها را rebase کنید",

    // Rebase Level 1
    "rebase.level1.name": "Rebasing پایه‌ای",
    "rebase.level1.description": "اعمال کامیت‌ها از یک شاخه روی شاخه دیگر",
    "rebase.level1.objective1": "rebase کردن شاخه فعلی روی شاخه دیگر",
    "rebase.level1.hint1": "از دستور `git rebase <branch>` استفاده کنید",
    "rebase.level1.hint2": "این تاریخچه را بازنویسی می‌کند با اعمال کامیت‌های شما روی شاخه هدف",
    "rebase.level1.requirement1.description": "rebase روی شاخه دیگر",
    "rebase.level1.requirement1.success": "عالی! شما با موفقیت شاخه را rebase کرده‌اید.",
    "rebase.level1.story.title": "ایجاد تاریخچه تمیز",
    "rebase.level1.story.narrative":
        '"می‌بینم که با ادغام راحت شده‌اید،" سارا می‌گوید. "حالا بیایید روش متفاوتی برای یکپارچه‌سازی تغییرات را بررسی کنیم: rebasing."\n\nاو توضیح می‌دهد: "در حالی که ادغام تاریخچه‌ها را ترکیب می‌کند، rebasing آن را بازنویسی می‌کند با انتقال کامیت‌های شما تا بعد از کامیت‌های شاخه دیگر ظاهر شوند. این تاریخچه‌ای خطی‌تر و تمیزتر ایجاد می‌کند."',
    "rebase.level1.story.realWorldContext":
        "Rebasing اغلب ترجیح داده می‌شود وقتی می‌خواهید تاریخچه پروژه‌ای تمیز و خطی نگه دارید. بسیاری از تیم‌ها از آن برای یکپارچه‌سازی شاخه‌های ویژگی قبل از ادغام آن‌ها به شاخه اصلی استفاده می‌کنند.",
    "rebase.level1.story.taskIntroduction": "سعی کنید شاخه فعلی خود را روی شاخه دیگری rebase کنید.",

    // Rebase Level 2
    "rebase.level2.name": "مدیریت تعارضات Rebase",
    "rebase.level2.description": "یاد بگیرید چگونه rebase های دارای تعارض را مدیریت یا لغو کنید",
    "rebase.level2.objective1": "لغو یک rebase دارای تعارض",
    "rebase.level2.hint1": "از دستور `git rebase --abort` استفاده کنید",
    "rebase.level2.hint2": "این فرآیند rebase را متوقف می‌کند و به حالت قبل از شروع rebase برمی‌گرداند",
    "rebase.level2.requirement1.description": "لغو یک rebase دارای تعارض",
    "rebase.level2.requirement1.success": "عالی! شما با موفقیت عملیات rebase را لغو کرده‌اید.",
    "rebase.level2.story.title": "وقتی Rebase ها پیچیده می‌شوند",
    "rebase.level2.story.narrative":
        '"درست مانند ادغام، rebasing می‌تواند منجر به تعارض شود،" الکس اشاره می‌کند. "اما حل تعارضات در حین rebase می‌تواند پیچیده‌تر باشد چون Git هر یک از کامیت‌های شما را یکی یکی اعمال می‌کند."\n\nاو ادامه می‌دهد: "اگر در وسط یک rebase هستید و تصمیم می‌گیرید که خیلی پیچیده است یا نیاز دارید رویکرد خود را دوباره فکر کنید، همیشه می‌توانید فرآیند را لغو کنید."',
    "rebase.level2.story.realWorldContext":
        "دانستن زمان و نحوه لغو rebase در توسعه دنیای واقعی مهم است. گاهی تعارضات خیلی پیچیده هستند که فوراً حل شوند، یا متوجه می‌شوید که استراتژی متفاوتی بهتر خواهد بود.",
    "rebase.level2.story.taskIntroduction": "لغو یک عملیات rebase را با git rebase --abort تمرین کنید.",

    // Rebase Level 3
    "rebase.level3.name": "Interactive Rebasing",
    "rebase.level3.description": "یاد بگیرید چگونه از interactive rebasing برای تغییر تاریخچه کامیت استفاده کنید",
    "rebase.level3.objective1": "شروع یک جلسه interactive rebase",
    "rebase.level3.hint1": "از دستور `git rebase -i` استفاده کنید",
    "rebase.level3.hint2": "interactive rebasing به شما امکان می‌دهد کامیت‌ها را مرتب‌سازی، ویرایش، ترکیب یا حذف کنید",
    "rebase.level3.requirement1.description": "شروع یک interactive rebase",
    "rebase.level3.requirement1.success": "عالی! شما یک جلسه interactive rebase را شروع کرده‌اید.",
    "rebase.level3.story.title": "تمیز کردن تاریخچه",
    "rebase.level3.story.narrative":
        '"ویژگی شما خوب به نظر می‌رسد،" الکس می‌گوید، کد شما را بررسی می‌کند. "اما متوجه می‌شوم که چندین کامیت کوچک با اصلاحات تایپو و تغییرات جزئی دارید. قبل از اینکه این را به main ادغام کنیم، بیایید تاریخچه کامیت را تمیز کنیم."\n\nاو توضیح می‌دهد، "Git ابزار قدرتمندی به نام interactive rebasing ارائه می‌دهد که به شما امکان می‌دهد تاریخچه کامیت خود را تغییر دهید. می‌توانید کامیت‌های کوچک را ترکیب کنید، پیام‌های کامیت را بازنویسی کنید، یا حتی کامیت‌ها را کاملاً حذف کنید."',
    "rebase.level3.story.realWorldContext":
        "Interactive rebasing معمولاً برای ایجاد تاریخچه کامیت تمیز و منسجم قبل از ادغام شاخه‌های ویژگی استفاده می‌شود. این تاریخچه کدبیس را خوانا و معنادارتر می‌کند.",
    "rebase.level3.story.taskIntroduction": "یک جلسه interactive rebase را برای تغییر تاریخچه کامیت خود شروع کنید.",

    // Rebase Level 4
    "rebase.level4.name": "Rebasing روی Main",
    "rebase.level4.description": "یاد بگیرید گردش کار rebasing شاخه‌های ویژگی روی شاخه‌های main به‌روزرسانی شده",
    "rebase.level4.objective1": "rebase کردن شاخه ویژگی شما روی شاخه main به‌روزرسانی شده",
    "rebase.level4.hint1": "از `git rebase main` در حالی که روی شاخه ویژگی خود هستید استفاده کنید",
    "rebase.level4.hint2": "این تغییرات ویژگی شما را روی آخرین تغییرات شاخه main اعمال می‌کند",
    "rebase.level4.requirement1.description": "rebase feature روی main",
    "rebase.level4.requirement1.success": "عالی! شما شاخه ویژگی خود را روی آخرین شاخه main rebase کرده‌اید.",
    "rebase.level4.story.title": "به‌روز ماندن",
    "rebase.level4.story.narrative":
        '"می‌بینم که در حالی که شما روی ویژگی خود کار می‌کردید، شخص دیگری تغییراتی را به شاخه main ارسال کرده،" سارا اشاره می‌کند. "قبل از اینکه کار شما را ادغام کنیم، باید این آخرین تغییرات را ترکیب کنید."\n\nاو ادامه می‌دهد، "به جای ادغام main در شاخه شما، که یک کامیت ادغام ایجاد می‌کند، توصیه می‌کنم شاخه شما را روی main rebase کنید. این تاریخچه را تمیزتر نگه می‌دارد."',
    "rebase.level4.story.realWorldContext":
        "در محیط‌های مشارکتی، شاخه‌های main مکرراً به‌روزرسانی می‌شوند. Rebasing شاخه‌های ویژگی روی main یک گردش کار رایج است که به جلوگیری از تعارضات ادغام کمک می‌کند و شاخه‌های ویژگی را به‌روز نگه می‌دارد.",
    "rebase.level4.story.taskIntroduction":
        "شاخه ویژگی خود را روی شاخه main به‌روزرسانی شده rebase کنید تا آخرین تغییرات را ترکیب کنید.",
};

export default levels;
