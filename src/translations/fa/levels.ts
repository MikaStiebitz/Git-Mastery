const levels = {
    // Level Page
    "level.gitTerminal": "ترمینال Git",
    "level.currentChallenge": "چالش فعلی",
    "level.objectives": "اهداف:",
    "level.showHints": "نمایش راهنمایی‌ها",
    "level.hideHints": "پنهان کردن راهنمایی‌ها",
    "level.nextLevel": "سطح بعدی",
    "level.filesToEdit": "فایل‌های قابل ویرایش:",
    "level.workingTreeClean": "درخت کاری تمیز است",
    "level.staged": "استیج‌شده",
    "level.modified": "تغییریافته",
    "level.untracked": "ردیابی‌نشده",
    "level.gitNotInitialized": "Git هنوز مقداردهی اولیه نشده است",
    "level.branch": "شاخه",
    "level.gitStatus": "وضعیت Git",
    "level.advancedOptions": "گزینه‌های پیشرفته",
    "level.hideAdvancedOptions": "پنهان کردن گزینه‌های پیشرفته",
    "level.resetLevel": "بازنشانی سطح",
    "level.resetAllProgress": "بازنشانی تمام پیشرفت",
    "level.resetConfirm": "آیا مطمئن هستید که می‌خواهید تمام پیشرفت خود را بازنشانی کنید؟",
    "level.resetOptions": "گزینه‌های بازنشانی",
    "level.resetDescription": "انتخاب کنید چه چیزی را می‌خواهید بازنشانی کنید:",
    "level.resetAllConfirm": "آیا مطمئن هستید که می‌خواهید تمام پیشرفت خود را بازنشانی کنید؟ این عمل قابل بازگشت نیست!",
    "level.level": "سطح",
    "level.levelCompleted": "سطح تکمیل شد!",
    "level.realWorldContext": "زمینه دنیای واقعی",
    "level.task": "وظیفه شما",
    "level.startCoding": "شروع کدنویسی",
    "level.storyButton": "نمایش داستان",
    "level.advancedModeOn": "حالت پیشرفته (روشن)",
    "level.advancedModeOff": "حالت پیشرفته (خاموش)",
    "level.notFound": "سطح یافت نشد",
    "level.techModeOn": "تمرکز بر دستورات (حالت فنی)",
    "level.storyModeOn": "نمایش زمینه داستان (حالت داستانی)",
    "level.techModeDescription":
        "حالت فنی روی دستورات Git بدون داستان یا زمینه تمرکز دارد تا تجربه‌ای سریع‌تر و مستقیم‌تر ارائه دهد.",
    "level.storyModeDescription":
        "حالت داستانی زمینه دنیای واقعی و توضیحاتی ارائه می‌دهد تا به درک چرایی و چگونگی استفاده از دستورات Git کمک کند.",
    "level.editFile": "ویرایش فایل",
    "level.deleteFile": "حذف فایل",
    "level.confirmDelete": "آیا مطمئن هستید که می‌خواهید {file} را حذف کنید؟",
    "level.hints": "راهنمایی‌ها",
    "level.tab.challenge": "چالش",
    "level.tab.graph": "گراف Git",

    // Level Visualizer (interactive commit graph)
    "visualizer.emptyTitle": "داستان Git شما از اینجا شروع می‌شود",
    "visualizer.emptyInitHint": "با `git init` یک مخزن بسازید تا گراف کامیت شما همین‌جا رشد کند.",
    "visualizer.emptyCommitHint": "اولین کامیت خود را بسازید و ببینید مسیر بصری شما اینجا ظاهر می‌شود.",
    "visualizer.branchFilterHint": "برای برجسته‌کردن تاریخچه این شاخه کلیک کنید",
    "visualizer.zoomIn": "بزرگ‌نمایی",
    "visualizer.zoomOut": "کوچک‌نمایی",
    "visualizer.fit": "تنظیم اندازه",
    "visualizer.mergeCommit": "ادغام",
    "visualizer.close": "بستن",
    "visualizer.interactHint": "برای جزئیات روی یک کامیت بزنید · برای برجسته‌کردن مسیر روی یک شاخه بزنید",

    // Level Content - Intro Stage
    "intro.name": "مقدمه‌ای بر Git",
    "intro.description": "مبانی Git را بیاموزید",

    "intro.level1.name": "مقداردهی اولیه Git",
    "intro.level1.description": "یک مخزن Git جدید ایجاد کنید",
    "intro.level1.objective1": "یک مخزن جدید مقداردهی اولیه کنید",
    "intro.level1.hint1": "از دستور `git init` استفاده کنید",
    "intro.level1.hint2": "این کار یک دایرکتوری مخفی .git ایجاد می‌کند",
    "intro.level1.requirement1.description": "یک مخزن Git مقداردهی اولیه کنید",
    "intro.level1.requirement1.success": "آفرین! شما یک مخزن Git ایجاد کردید.",
    "intro.level1.story.title": "به تیم خوش آمدید",
    "intro.level1.story.narrative":
        "به شغل جدیدتان به‌عنوان توسعه‌دهنده در TechStart خوش آمدید! من Alex هستم، سرپرست تیم شما.\n\nامروز اولین روز کاری شماست و ما می‌خواهیم کمک کنیم سریع به بهره‌وری برسید. ما از Git برای کنترل نسخه استفاده می‌کنیم - این ابزار به ما کمک می‌کند تغییرات کد را پیگیری کنیم و به‌عنوان یک تیم با هم کار کنیم.\n\nاولین کاری که باید انجام دهید ایجاد یک مخزن جدید برای پروژه آشناسازی شماست. برای این کار از دستور `git init` استفاده می‌کنیم.",
    "intro.level1.story.realWorldContext":
        "در تیم‌های واقعی توسعه، Git ضروری است. این اولین ابزاری است که برای یک پروژه جدید راه‌اندازی می‌کنید.",
    "intro.level1.story.taskIntroduction": "بیایید یک مخزن جدید برای پروژه شما ایجاد کنیم.",

    "intro.level2.name": "وضعیت مخزن",
    "intro.level2.description": "وضعیت مخزن خود را بررسی کنید",
    "intro.level2.objective1": "وضعیت مخزن خود را نمایش دهید",
    "intro.level2.hint1": "از دستور `git status` استفاده کنید",
    "intro.level2.hint2": "این دستور وضعیت فعلی مخزن شما را نشان می‌دهد",
    "intro.level2.requirement1.description": "وضعیت مخزن را نمایش دهید",
    "intro.level2.requirement1.success": "عالی! حالا می‌توانید وضعیت مخزن خود را ببینید.",
    "intro.level2.story.title": "در مخزن شما چه می‌گذرد؟",
    "intro.level2.story.narrative":
        "عالی! شما اولین مخزن Git خود را ایجاد کردید. دایرکتوری مخفی .git اکنون شامل تمام اطلاعاتی است که Git به آن‌ها نیاز دارد.\n\nAlex سر می‌رسد: «کار خوبی بود! در مرحله بعد باید ببینید در مخزنتان چه می‌گذرد. با `git status` می‌توانید در هر لحظه وضعیت فعلی را بررسی کنید.»",
    "intro.level2.story.realWorldContext":
        "توسعه‌دهندگان چندین بار در روز `git status` را اجرا می‌کنند تا ببینند کدام فایل‌ها تغییر کرده‌اند و کدام‌ها برای کامیت بعدی آماده هستند.",
    "intro.level2.story.taskIntroduction": "وضعیت مخزن خود را با `git status` بررسی کنید.",

    "intro.level3.name": "کلون کردن مخازن",
    "intro.level3.description": "یاد بگیرید چگونه مخازن موجود را کلون کنید",
    "intro.level3.objective1": "یک مخزن راه‌دور را کلون کنید",
    "intro.level3.objective2": "وارد مخزن کلون‌شده شوید",
    "intro.level3.hint1": "از دستور `git clone <url>` استفاده کنید",
    "intro.level3.hint2": "پس از کلون کردن، از `cd` برای ورود به پوشه مخزن استفاده کنید",
    "intro.level3.hint3": "آدرس مخزن می‌تواند هر URL معتبر مخزن Git باشد",
    "intro.level3.requirement1.description": "یک مخزن راه‌دور را کلون کنید",
    "intro.level3.requirement1.success": "عالی! شما مخزن را کلون کردید.",
    "intro.level3.requirement2.description": "با استفاده از cd وارد مخزن کلون‌شده شوید",
    "intro.level3.requirement2.success": "عالی! اکنون داخل مخزن کلون‌شده هستید.",
    "intro.level3.story.title": "پیوستن به یک پروژه موجود",
    "intro.level3.story.narrative":
        'اولین هفته شما در TechStart خیلی خوب پیش می‌رود! Alex شما را صدا می‌زند تا خبر هیجان‌انگیزی بدهد.\n\n"ما یک پروژه تیمی داریم که به کمک شما نیاز دارد،" او می‌گوید. "کدبیس از قبل روی سرور Git ما قرار دارد. باید آن را روی دستگاه محلی خود کلون کنید تا بتوانید کار را شروع کنید."\n\nاو توضیح می‌دهد: "وقتی به یک پروژه موجود می‌پیوندید، از صفر شروع نمی‌کنید. در عوض، مخزن راه‌دور را کلون می‌کنید که یک نسخه کامل روی دستگاه شما ایجاد می‌کند—شامل تمام کد، تاریخچه و شاخه‌ها."\n\n"آن را مثل امانت گرفتن یک کتاب از کتابخانه در نظر بگیرید، با این تفاوت که سوابق کل کتابخانه را هم دریافت می‌کنید! برای شروع از `git clone <repository-url>` استفاده کنید."\n\n"پس از کلون کردن، می‌توانید با `cd <folder-name>` وارد پوشه پروژه شوید و بلافاصله کار را شروع کنید. تمام تاریخچه و تغییرات پروژه در دسترس شماست."',
    "intro.level3.story.realWorldContext":
        "کلون کردن روشی است که توسعه‌دهندگان از طریق آن به پروژه‌های موجود می‌پیوندند. چه در حال مشارکت در یک پروژه متن‌باز باشید و چه پیوستن به یک تیم جدید، git clone معمولاً اولین دستوری است که اجرا می‌کنید.",
    "intro.level3.story.taskIntroduction": "یک مخزن را کلون کنید و وارد آن شوید تا کار روی پروژه را شروع کنید.",

    // Level Content - Files Stage
    "files.name": "عملیات فایل",
    "files.description": "یاد بگیرید چگونه فایل‌ها را با Git مدیریت کنید",

    "files.level1.name": "استیج کردن تغییرات",
    "files.level1.description": "فایل‌ها را به ناحیه استیجینگ اضافه کنید",
    "files.level1.objective1": "تمام فایل‌ها را به ناحیه استیجینگ اضافه کنید",
    "files.level1.hint1": "از دستور `git add .` استفاده کنید",
    "files.level1.hint2": "نقطه به معنای «تمام فایل‌های دایرکتوری فعلی» است",
    "files.level1.requirement1.description": "تمام فایل‌ها را به ناحیه استیجینگ اضافه کنید",
    "files.level1.requirement1.success": "عالی! شما تمام فایل‌ها را به ناحیه استیجینگ اضافه کردید.",
    "files.level1.story.title": "آماده‌سازی تغییرات کد",
    "files.level1.story.narrative":
        '"سلام!" Sarah، همکار شما، صدا می‌زند، "می‌بینم که قبلاً با Git شروع کرده‌اید. در مرحله بعد باید یاد بگیرید چگونه تغییرات را استیج کنید."\n\nاو توضیح می‌دهد: "وقتی فایل‌ها را تغییر می‌دهید، باید صراحتاً به Git بگویید کدام تغییرات باید در کامیت بعدی گنجانده شوند. این کار \'استیجینگ\' نامیده می‌شود و با `git add` انجام می‌شود."',
    "files.level1.story.realWorldContext":
        "مفهوم استیجینگ یک ویژگی قدرتمند Git است. این امکان را می‌دهد که فقط تغییرات انتخاب‌شده را کامیت کنید در حالی که بقیه می‌توانند در حال انجام باقی بمانند.",
    "files.level1.story.taskIntroduction": "تمام فایل‌ها را با `git add .` به ناحیه استیجینگ اضافه کنید.",

    "files.level2.name": "کامیت کردن تغییرات",
    "files.level2.description": "یک کامیت با تغییرات خود ایجاد کنید",
    "files.level2.objective1": "یک کامیت همراه با پیام ایجاد کنید",
    "files.level2.hint1": "از دستور `git commit -m 'پیام شما'` استفاده کنید",
    "files.level2.hint2": "پیام باید تغییرات شما را توصیف کند",
    "files.level2.requirement1.description": "یک کامیت همراه با پیام ایجاد کنید",
    "files.level2.requirement1.success": "عالی! شما با موفقیت یک کامیت ایجاد کردید.",
    "files.level2.story.title": "اولین کامیت شما",
    "files.level2.story.narrative":
        '"کار خوبی بود!" Alex وقتی پیشرفت شما را می‌بیند می‌گوید. "شما تغییرات را به ناحیه استیجینگ اضافه کردید. حالا وقت اولین کامیت شماست."\n\nاو توضیح می‌دهد: "یک کامیت مثل یک عکس لحظه‌ای از پروژه شما در یک نقطه زمانی مشخص است. هر کامیت به یک پیام نیاز دارد که تغییرات انجام‌شده را توصیف کند. این موضوع برای قابلیت ردیابی بسیار مهم است."',
    "files.level2.story.realWorldContext":
        "پیام‌های کامیت خوب در تیم‌های توسعه بسیار مهم هستند. آن‌ها به همه کمک می‌کنند بفهمند چرا یک تغییر انجام شده، نه فقط چه چیزی تغییر کرده است.",
    "files.level2.story.taskIntroduction": "اولین کامیت خود را با یک پیام معنادار ایجاد کنید.",

    "files.level3.name": "حذف فایل‌ها",
    "files.level3.description": "یاد بگیرید چگونه فایل‌ها را از Git حذف کنید",
    "files.level3.objective1": "یک فایل را هم از دایرکتوری کاری و هم از ایندکس حذف کنید",
    "files.level3.hint1": "از دستور `git rm <file>` استفاده کنید",
    "files.level3.hint2": "این کار فایل را از Git حذف می‌کند و همچنین آن را از دایرکتوری کاری شما پاک می‌کند",
    "files.level3.requirement1.description": "یک فایل را با استفاده از Git حذف کنید",
    "files.level3.requirement1.success": "آفرین! شما فایل را از Git و دایرکتوری کاری خود حذف کردید.",
    "files.level3.story.title": "پاکسازی",
    "files.level3.story.narrative":
        '"می‌بینم پیشرفت خوبی داشته‌اید،" Alex در حین بررسی کار شما می‌گوید. "اما متوجه شدم چند فایل موقت یا پیش‌نویس هست که دیگر به آن‌ها نیاز نداریم. باید مخزن را پاکسازی کنیم."\n\nاو توضیح می‌دهد: "وقتی می‌خواهید فایل‌هایی را که توسط Git ردیابی می‌شوند حذف کنید، باید به‌جای حذف دستی، از `git rm` استفاده کنید. این کار تضمین می‌کند که Git حذف را به‌درستی ردیابی کند."',
    "files.level3.story.realWorldContext":
        "تمیز نگه‌داشتن مخازن با حذف فایل‌های غیرضروری یک روش بهینه است. دستور `git rm` تضمین می‌کند که Git حذف فایل را ردیابی کند.",
    "files.level3.story.taskIntroduction": "فایل غیرضروری را با استفاده از `git rm` از مخزن حذف کنید.",

    // Level Content - Branches Stage
    "branches.name": "کار با شاخه‌ها",
    "branches.description": "یاد بگیرید چگونه با شاخه‌ها کار کنید",

    "branches.level1.name": "مشاهده شاخه‌ها",
    "branches.level1.description": "تمام شاخه‌های مخزن خود را نمایش دهید",
    "branches.level1.objective1": "تمام شاخه‌های موجود را نمایش دهید",
    "branches.level1.hint1": "از دستور `git branch` استفاده کنید",
    "branches.level1.hint2": "این کار تمام شاخه‌های محلی را نشان می‌دهد",
    "branches.level1.requirement1.description": "تمام شاخه‌ها را نمایش دهید",
    "branches.level1.requirement1.success": "خیلی خوب! حالا می‌توانید تمام شاخه‌های مخزن خود را ببینید.",
    "branches.level1.story.title": "شاخه‌های کد",
    "branches.level1.story.narrative":
        '"وقت چیزی پیشرفته‌تر است،" Alex می‌گوید و روی تخته یک درخت با شاخه‌ها می‌کشد. "این شاخه‌ها مثل شاخه‌های Git هستند. آن‌ها به شما اجازه می‌دهند به‌طور همزمان روی نسخه‌های مختلف کد خود کار کنید."\n\nاو ادامه می‌دهد: "در حال حاضر شما روی شاخه \'main\' کار می‌کنید. بیایید اول ببینیم چه شاخه‌هایی داریم."',
    "branches.level1.story.realWorldContext":
        "شاخه‌ها یک مفهوم بنیادین در Git هستند. آن‌ها امکان توسعه موازی، جداسازی ویژگی‌ها و کار آزمایشی بدون تأثیر بر کد اصلی را فراهم می‌کنند.",
    "branches.level1.story.taskIntroduction": "تمام شاخه‌های موجود را با git branch نمایش دهید.",

    "branches.level2.name": "ایجاد و جابجایی به شاخه",
    "branches.level2.description": "یک شاخه جدید ایجاد کنید و به آن جابجا شوید",
    "branches.level2.objective1": "یک شاخه جدید به نام 'feature' ایجاد کنید و به آن جابجا شوید",
    "branches.level2.hint1": "از دستور `git switch -c feature` استفاده کنید",
    "branches.level2.hint2": "پرچم -c یک شاخه جدید ایجاد کرده و در یک مرحله به آن جابجا می‌شود",
    "branches.level2.requirement1.description": "با استفاده از git switch -c یک شاخه جدید ایجاد کرده و به آن جابجا شوید",
    "branches.level2.requirement1.success":
        "عالی! شما با استفاده از دستور مدرن git switch یک شاخه جدید ایجاد کرده و به آن جابجا شدید.",
    "branches.level2.story.title": "ایجاد شاخه به روش مدرن",
    "branches.level2.story.narrative":
        '"عالی! حالا می‌خواهیم یک ویژگی جدید پیاده‌سازی کنیم،" Alex می‌گوید. "برای این کار، یک شاخه جدید به نام \'feature\' ایجاد می‌کنیم تا تغییرات ما روی کد اصلی تأثیر نگذارد."\n\nاو روش مدرن را به شما نشان می‌دهد: "Git دستور `git switch` را معرفی کرد تا عملیات مربوط به شاخه‌ها روشن‌تر شود. از `git switch -c feature` برای ایجاد و جابجایی به شاخه جدید در یک مرحله استفاده کنید. این روش مدرن ترجیحی به‌جای `git checkout -b` قدیمی‌تر است."',
    "branches.level2.story.realWorldContext":
        "در تیم‌های حرفه‌ای توسعه، تقریباً هرگز مستقیماً روی شاخه main کار نمی‌کنید. دستور `git switch` که در Git 2.23 معرفی شد، روشی تمیزتر و شهودی‌تر برای کار با شاخه‌ها در مقایسه با دستور قدیمی‌تر checkout فراهم می‌کند.",
    "branches.level2.story.taskIntroduction":
        "یک شاخه جدید به نام 'feature' ایجاد کنید و با استفاده از `git switch -c` به آن جابجا شوید.",

    "branches.level3.name": "جابجایی بین شاخه‌ها",
    "branches.level3.description": "بین شاخه‌های موجود جابجا شوید",
    "branches.level3.objective1": "بین شاخه‌ها جابجا شوید",
    "branches.level3.hint1": "از دستور `git switch <branch>` استفاده کنید",
    "branches.level3.hint2": "این دستور به یک شاخه موجود جابجا می‌شود",
    "branches.level3.requirement1.description": "با استفاده از git switch به یک شاخه دیگر جابجا شوید",
    "branches.level3.requirement1.success": "کار خوبی بود! شما با استفاده از git switch بین شاخه‌ها جابجا شدید.",
    "branches.level3.story.title": "پیمایش بین شاخه‌ها",
    "branches.level3.story.narrative":
        '"حالا که یاد گرفتید چگونه شاخه بسازید، بیایید جابجایی بین آن‌ها را تمرین کنیم،" Sarah می‌گوید. "این کاری است که در کار واقعی توسعه به‌طور مداوم انجام خواهید داد."\n\nاو توضیح می‌دهد: "می‌توانید با استفاده از `git switch <branch-name>` به هر شاخه موجودی جابجا شوید. این کار خیلی واضح‌تر از `git checkout` قدیمی است که به دلیل انجام کارهای مختلف زیاد می‌توانست گیج‌کننده باشد."',
    "branches.level3.story.realWorldContext":
        "جابجایی بین شاخه‌ها یکی از رایج‌ترین عملیات Git است. دستور اختصاصی `git switch` هدف را روشن می‌کند و در مقایسه با دستور چندمنظوره checkout سردرگمی را کاهش می‌دهد.",
    "branches.level3.story.taskIntroduction": "تمرین کنید که با استفاده از `git switch` به شاخه دیگری جابجا شوید.",

    "branches.level4.name": "جابجایی بین شاخه‌ها با Checkout",
    "branches.level4.description": "دستور کلاسیک برای جابجایی بین شاخه‌ها را بیاموزید",
    "branches.level4.objective1": "با استفاده از دستور کلاسیک به شاخه دیگری جابجا شوید",
    "branches.level4.hint1": "از دستور `git checkout <branch-name>` استفاده کنید",
    "branches.level4.hint2": "checkout دستور قدیمی‌تر برای جابجایی بین شاخه‌هاست",
    "branches.level4.requirement1.description": "با استفاده از git checkout به یک شاخه دیگر جابجا شوید",
    "branches.level4.requirement1.success": "عالی! حالا هر دو روش جابجایی بین شاخه‌ها را می‌دانید.",
    "branches.level4.story.title": "روش کلاسیک",
    "branches.level4.story.narrative":
        '"دانستن git checkout هم مهم است،" Alex توضیح می‌دهد. "در حالی که git switch روش مدرن است، همیشه checkout را در پروژه‌های قدیمی‌تر، آموزش‌ها و مستندات خواهید دید."\n\nاو اضافه می‌کند: "checkout می‌تواند کارهای زیادی انجام دهد - جابجایی بین شاخه‌ها، بازیابی فایل‌ها و موارد دیگر. به همین دلیل Git دستورات switch و restore را معرفی کرد - تا اهداف روشن‌تر شوند."',
    "branches.level4.story.realWorldContext":
        "git checkout سال‌ها دستور اصلی برای عملیات مربوط به شاخه‌ها بود. بسیاری از توسعه‌دهندگان و ابزارها هنوز از آن استفاده می‌کنند. دانستن هر دو روش شما را در پروژه‌ها و تیم‌های مختلف چندمنظوره‌تر می‌کند.",
    "branches.level4.story.taskIntroduction": "با استفاده از دستور کلاسیک git checkout به شاخه دیگری جابجا شوید.",

    "branches.level5.name": "ایجاد شاخه با Switch",
    "branches.level5.description": "یک شاخه جدید ایجاد کنید و در یک مرحله به آن جابجا شوید",
    "branches.level5.objective1": "یک شاخه جدید ایجاد کنید",
    "branches.level5.hint1": "از دستور `git switch -c <new-branch-name>` استفاده کنید",
    "branches.level5.hint2": "پرچم -c به switch می‌گوید یک شاخه جدید ایجاد کند",
    "branches.level5.requirement1.description": "با استفاده از git switch -c یک شاخه جدید ایجاد کرده و به آن جابجا شوید",
    "branches.level5.requirement1.success": "عالی! حالا بر هر دو روش ایجاد شاخه مسلط هستید.",
    "branches.level5.story.title": "ایجاد سریع شاخه",
    "branches.level5.story.narrative":
        "\"یک ترفند کاربردی دیگر،\" Sarah می‌گوید. \"می‌توانید از 'git switch -c' برای ایجاد یک شاخه جدید و جابجایی همزمان به آن استفاده کنید.\"\n\nاو توضیح می‌دهد: \"این روش مدرن در Git است. پرچم -c مخفف 'create' است و دقیقاً همان کاری را انجام می‌دهد که 'git checkout -b' قدیمی‌تر انجام می‌داد، اما واضح‌تر و شهودی‌تر است.\"",
    "branches.level5.story.realWorldContext":
        "الگوی switch -c روش مدرن و توصیه‌شده برای ایجاد و جابجایی بین شاخه‌هاست. این روش در Git 2.23 معرفی شد تا عملیات مربوط به شاخه را از سایر عملکردهای checkout جدا کرده و شهودی‌تر کند.",
    "branches.level5.story.taskIntroduction": "با استفاده از git switch -c یک شاخه جدید ایجاد کنید و به‌طور خودکار به آن جابجا شوید.",

    // Level Content - Merge Stage
    "merge.name": "ادغام شاخه‌ها",
    "merge.description": "یاد بگیرید چگونه شاخه‌ها را ادغام کنید",

    "merge.level1.name": "ادغام شاخه ویژگی",
    "merge.level1.description": "یک شاخه ویژگی را در شاخه توسعه ادغام کنید",
    "merge.level1.objective1": "شاخه 'feature/user-auth' را در شاخه 'develop' ادغام کنید",
    "merge.level1.hint1": "شما در حال حاضر روی شاخه develop هستید",
    "merge.level1.hint2": "از `git merge feature/user-auth` برای یکپارچه‌سازی شاخه ویژگی استفاده کنید",
    "merge.level1.requirement1.description": "شاخه ویژگی را ادغام کنید",
    "merge.level1.requirement1.success": "عالی! ویژگی در develop یکپارچه شد.",
    "merge.level1.story.title": "بازبینی کد و یکپارچه‌سازی",
    "merge.level1.story.narrative":
        '"ویژگی شما تمام شد!"، Sarah، سرپرست تیم، می‌گوید. "اما قبل از اینکه آن را به main پوش کنیم، باید آن را در شاخه develop ادغام و تست کنیم."\n\nاو توضیح می‌دهد: "در تیم‌های حرفه‌ای، ما هرگز مستقیماً در main ادغام نمی‌کنیم. ابتدا feature → develop برای تست، سپس develop → main برای تولید."',
    "merge.level1.story.realWorldContext":
        "🔍 بهترین روش: Pull Request‌ها\n\nدر پروژه‌های واقعی، اکنون یک Pull Request (PR) یا Merge Request (MR) روی GitHub/GitLab ایجاد می‌کنید:\n\n1️⃣ شاخه ویژگی خود را پوش می‌کنید\n\n2️⃣ یک PR باز می‌کنید: feature/user-auth → develop\n\n3️⃣ اعضای تیم کد شما را بازبینی می‌کنند\n\n4️⃣ پس از تأیید، PR ادغام می‌شود\n\nاین کار بازبینی کد، بحث و تست‌های خودکار را پیش از ادغام ممکن می‌سازد! 🚀",
    "merge.level1.story.taskIntroduction":
        "شاخه 'feature/user-auth' را در شاخه 'develop' ادغام کنید (شما در حال حاضر روی develop هستید).",

    "merge.level2.name": "استقرار در تولید",
    "merge.level2.description": "کد تست‌شده را در شاخه main ادغام کنید",
    "merge.level2.objective1": "شاخه 'develop' را در شاخه 'main' ادغام کنید",
    "merge.level2.hint1": "شما در حال حاضر روی شاخه main هستید",
    "merge.level2.hint2": "از `git merge develop` برای یکپارچه‌سازی کد تست‌شده استفاده کنید",
    "merge.level2.requirement1.description": "develop را در main ادغام کنید",
    "merge.level2.requirement1.success": "عالی! کد اکنون در تولید است.",
    "merge.level2.story.title": "انتشار در محیط تولید",
    "merge.level2.story.narrative":
        '"عالی! ویژگی روی develop کاملاً درست کار می‌کند و تمام تست‌ها سبز هستند،" Sarah می‌گوید. "حالا می‌توانیم آن را در main ادغام و مستقر کنیم."\n\nاو تأکید می‌کند: "main شاخه تولید ماست. فقط کد تست‌شده و پایدار وارد اینجا می‌شود. به همین دلیل ابتدا روی develop تست کردیم!"',
    "merge.level2.story.realWorldContext":
        "گردش‌کار Git Flow 🌊\n\n📦 main: کد آماده تولید\n\n🔧 develop: یکپارچه‌سازی و تست\n\n✨ feature/*: ویژگی‌های جدید\n\nاین گردش‌کار مانع از رسیدن کد تست‌نشده به تولید می‌شود. بسیاری از تیم‌ها از شاخه‌های release هم استفاده می‌کنند!",
    "merge.level2.story.taskIntroduction": "شاخه 'develop' را در شاخه 'main' ادغام کنید.",

    "merge.level3.name": "مدیریت تعارض‌های ادغام",
    "merge.level3.description": "یاد بگیرید چگونه ادغام‌های دارای تعارض را مدیریت یا لغو کنید",
    "merge.level3.objective1": "یک ادغام دارای تعارض را لغو کنید",
    "merge.level3.hint1": "از دستور `git merge --abort` استفاده کنید",
    "merge.level3.hint2": "این کار فرآیند ادغام را متوقف کرده و به حالت قبل از شروع ادغام بازمی‌گردد",
    "merge.level3.requirement1.description": "یک ادغام دارای تعارض را لغو کنید",
    "merge.level3.requirement1.success": "کار خوبی بود! شما با موفقیت عملیات ادغام را لغو کردید.",
    "merge.level3.story.title": "وقتی ادغام‌ها خراب می‌شوند",
    "merge.level3.story.narrative":
        '"گاهی ادغام‌ها طبق برنامه پیش نمی‌روند،" Sarah هشدار می‌دهد. "وقتی بخش یکسانی از یک فایل در هر دو شاخه به شکل‌های متفاوتی تغییر کرده باشد، تعارض ادغام رخ می‌دهد."\n\nاو توضیح می‌دهد: "شما دو گزینه دارید: یا تعارض را به‌صورت دستی حل می‌کنید، یا ادغام را با `git merge --abort` لغو کرده و بهتر آماده می‌شوید."',
    "merge.level3.story.realWorldContext":
        "تعارض‌های ادغام بخش رایجی از توسعه مشارکتی هستند. دانستن نحوه مدیریت آن‌ها—چه با حل کردن و چه با لغو موقت—یک مهارت ضروری است.",
    "merge.level3.story.taskIntroduction": "تمرین کنید که یک عملیات ادغام را با استفاده از git merge --abort لغو کنید.",

    // Stash Stage
    "stash.name": "ذخیره موقت Git",
    "stash.description": "یاد بگیرید چگونه تغییرات خود را به‌طور موقت ذخیره کنید",

    "stash.level1.name": "ذخیره موقت کار خود",
    "stash.level1.description": "یاد بگیرید چگونه تغییرات را به‌طور موقت ذخیره کنید و بین شاخه‌ها جابجا شوید",
    "stash.level1.objective1": "تغییرات در حال انجام خود را ذخیره کنید",
    "stash.level1.objective2": "برای رسیدگی به مشکل فوری، به شاخه hotfix جابجا شوید",
    "stash.level1.objective3": "برای ادامه کار خود به شاخه feature بازگردید",
    "stash.level1.objective4": "تغییرات stash‌شده خود را بازیابی کنید",
    "stash.level1.hint1": "از 'git stash' برای ذخیره موقت تغییرات خود استفاده کنید",
    "stash.level1.hint2": "با 'git switch <branch-name>' یا 'git checkout <branch-name>' بین شاخه‌ها جابجا شوید",
    "stash.level1.hint3": "با 'git stash pop' تغییرات خود را بازگردانید",
    "stash.level1.hint4": "لیست stash را با 'git stash list' بررسی کنید",
    "stash.level1.requirement1.description": "تغییرات در حال انجام خود را stash کنید",
    "stash.level1.requirement1.success": "✅ عالی! تغییرات شما با خیال راحت stash شدند!",
    "stash.level1.requirement2.description": "به شاخه hotfix جابجا شوید",
    "stash.level1.requirement2.success": "✅ عالی! اکنون روی شاخه hotfix هستید.",
    "stash.level1.requirement3.description": "به شاخه feature بازگردید",
    "stash.level1.requirement3.success": "✅ خوب! به شاخه feature بازگشتید.",
    "stash.level1.requirement4.description": "تغییرات stash‌شده خود را بازیابی کنید",
    "stash.level1.requirement4.success": "✅ عالی! تغییرات شما بازیابی شدند!",
    "stash.level1.story.title": "وقفه اضطراری",
    "stash.level1.story.narrative":
        "شما کاملاً غرق کار هستید و روی یک ویژگی جدید کار می‌کنید. کد شما نیمه‌کاره است، تست‌ها خراب‌اند، و ناگهان... Slack منفجر می‌شود! 💥\n\n«فوری: تولید از کار افتاده! همین الان به hotfix نیاز داریم!» 🚨\n\nنمی‌توانید این آشفتگی را کامیت کنید، اما نمی‌توانید رهایش هم کنید. چه‌کار می‌کنید؟\n\n**git stash را وارد کنید** - دکمه ذخیره اضطراری شما! 🎯\n\nآن را مثل فشردن دکمه توقف موقت در یک بازی ویدیویی در نظر بگیرید. کار شما در جایی مخصوص ذخیره می‌شود، فضای کاری شما تمیز می‌شود و می‌توانید کار خود را عوض کنید. وقتی برگشتید، کافی است ادامه (git stash pop) را بزنید و دقیقاً از همان‌جایی که رها کرده بودید ادامه دهید!",
    "stash.level1.story.realWorldContext":
        "در توسعه واقعی، وقفه‌ها دائماً رخ می‌دهند. مدیران محصول به 'تغییرات سریع' نیاز دارند، باگ‌ها در تولید ظاهر می‌شوند و هم‌تیمی‌ها به بازبینی فوری کد نیاز دارند. git stash ابزار بقای شما برای تعویض زمینه کاری بدون از دست دادن روند کار است.",
    "stash.level1.story.taskIntroduction":
        "بیایید گردش‌کار stash را تمرین کنیم: کار خود را ذخیره کنید، به وضعیت اضطراری رسیدگی کنید، سپس ادامه دهید!",

    "stash.level2.name": "مدیریت هم‌زمان چند وظیفه",
    "stash.level2.description": "با استفاده از stash بر جابجایی بین چند وظیفه مسلط شوید",
    "stash.level2.objective1": "کار ناتمام فعلی خود را stash کنید",
    "stash.level2.objective2": "برای ایجاد شاخه ویژگی جدید، به شاخه main جابجا شوید",
    "stash.level2.objective3": "یک شاخه ویژگی جدید ایجاد کنید",
    "stash.level2.objective4": "به شاخه وظیفه قدیمی خود بازگردید",
    "stash.level2.objective5": "کار stash‌شده خود را بازیابی کنید",
    "stash.level2.hint1": "با stash کردن شروع کنید: git stash",
    "stash.level2.hint2": "به main جابجا شوید: git switch main (یا git checkout main)",
    "stash.level2.hint3": "شاخه جدید ایجاد کنید: git switch -c feature/new-task (یا git checkout -b feature/new-task)",
    "stash.level2.hint4": "به وظیفه قدیمی بازگردید: git switch feature/old-task",
    "stash.level2.hint5": "کار را بازیابی کنید: git stash pop",
    "stash.level2.requirement1.description": "کار ناتمام خود را stash کنید",
    "stash.level2.requirement1.success": "✅ کار stash شد! آماده تعویض وظیفه هستید.",
    "stash.level2.requirement2.description": "به شاخه main جابجا شوید",
    "stash.level2.requirement2.success": "✅ اکنون روی شاخه main هستید.",
    "stash.level2.requirement3.description": "شاخه feature/new-task را ایجاد کنید",
    "stash.level2.requirement3.success": "✅ شاخه جدید ایجاد شد!",
    "stash.level2.requirement4.description": "به feature/old-task بازگردید",
    "stash.level2.requirement4.success": "✅ به وظیفه قدیمی خود بازگشتید.",
    "stash.level2.requirement5.description": "کار stash‌شده خود را بازیابی کنید",
    "stash.level2.requirement5.success": "✅ عالی! کار بازیابی شد!",
    "stash.level2.story.title": "استاد چندوظیفگی",
    "stash.level2.story.narrative":
        '"سلام، می‌توانی سریع روی این درخواست ویژگی جدید کار کنی؟"، Product Owner شما می‌پرسد.\n\nشما در وسط یک وظیفه دیگر هستید. قبلاً باید همه‌چیز را کامیت می‌کردید یا تغییرات را از دست می‌دادید.\n\n"Stash دقیقاً برای همین موقعیت‌هاست،" Marc، توسعه‌دهنده ارشد شما، توضیح می‌دهد. "کار فعلی خود را ذخیره کن، یک شاخه جدید برای وظیفه جدید بساز، و بعداً کافی است کار قدیمی را بازیابی کنی."',
    "stash.level2.story.realWorldContext":
        "**Stash در زندگی تیمی**\n\nتوسعه‌دهندگان اغلب چند وظیفه را هم‌زمان مدیریت می‌کنند:\n\n- برنامه‌ریزی اسپرینت اولویت‌ها را تغییر می‌دهد\n- باگ‌های فوری کار روی ویژگی‌ها را قطع می‌کنند\n- بازبینی کد نیازمند تعویض زمینه کاری است\n- جلسات روند کار را مختل می‌کنند\n\n**Git Stash تعویض زمینه کاری را بدون دردسر می‌کند!**\n\nبدون Stash باید یکی از این کارها را می‌کردید:\n- کامیت کد ناتمام (برای تاریخچه بد است)\n- دور انداختن تغییرات (کار از دست می‌رود)\n- ماندن در وضعیت کثیف (نمی‌توانید جابجا شوید)\n\nبا Stash: ذخیره کن، جابجا شو، کار کن، برگرد - همه‌چیز تمیز! ✨",
    "stash.level2.story.taskIntroduction":
        "کار خود را stash کنید، به main جابجا شوید، شاخه جدید بسازید، به وظیفه قدیمی بازگردید و کار خود را بازیابی کنید.",

    "stash.level3.name": "مدیریت Stash‌ها",
    "stash.level3.description": "یاد بگیرید چگونه ورودی‌های stash را فهرست و مدیریت کنید",
    "stash.level3.objective1": "تمام تغییرات stash‌شده را مشاهده کنید",
    "stash.level3.objective2": "آخرین stash را بازیابی کنید",
    "stash.level3.hint1": "از 'git stash list' برای دیدن تمام stash‌ها استفاده کنید",
    "stash.level3.hint2": "با 'git stash pop' stash را بازیابی کنید",
    "stash.level3.hint3": "Stash‌ها مانند یک پشته (stack) ذخیره می‌شوند (LIFO - آخرین ورودی، اولین خروجی)",
    "stash.level3.requirement1.description": "تمام ورودی‌های stash را فهرست کنید",
    "stash.level3.requirement1.success": "✅ Stash‌ها نمایش داده شدند!",
    "stash.level3.requirement2.description": "آخرین stash را بازیابی کنید",
    "stash.level3.requirement2.success": "✅ Stash بازیابی شد!",
    "stash.level3.story.title": "سازمان‌دهی Stash",
    "stash.level3.story.narrative":
        '"صبر کن، من آن تغییرات را کجا stash کردم؟"، از خودتان می‌پرسید.\n\n"از `git stash list` استفاده کن،" Lisa می‌گوید. "تمام stash‌های ذخیره‌شده را نشان می‌دهد. با `git stash pop` آخرین مورد را بازیابی می‌کنی و از stash حذف می‌شود."\n\nاو ادامه می‌دهد: "`git stash apply` هم هست - stash را اعمال می‌کند اما آن را نگه می‌دارد. وقتی به تغییرات مشابه چندین بار نیاز داری مفید است!"',
    "stash.level3.story.realWorldContext":
        '**دستورات مدیریت Stash**\n\n`git stash list` - تمام stash‌ها را نشان می‌دهد\n\n`git stash pop` - stash را اعمال و حذف می‌کند\n\n`git stash apply` - stash را اعمال می‌کند و نگه می‌دارد\n\n`git stash drop` - یک stash را حذف می‌کند\n\n`git stash clear` - تمام stash‌ها را حذف می‌کند\n\n**نکته حرفه‌ای**: با `git stash push -m "WIP: Feature X"` برای stash‌های خود نام بگذارید - این کار فهرست را منظم‌تر می‌کند!',
    "stash.level3.story.taskIntroduction": "Stash‌های خود را فهرست کنید و آخرین مورد را بازیابی کنید.",

    // Remote Stage
    "remote.name": "مخازن راه‌دور",
    "remote.description": "یاد بگیرید چگونه با مخازن راه‌دور کار کنید",

    // Remote Level 1
    "remote.level1.name": "افزودن Remote‌ها",
    "remote.level1.description": "به یک مخزن راه‌دور متصل شوید",
    "remote.level1.objective1": "یک مخزن راه‌دور اضافه کنید",
    "remote.level1.hint1": "از دستور `git remote add <name> <url>` استفاده کنید",
    "remote.level1.hint2": "قرارداد رایج این است که remote اصلی خود را 'origin' نام‌گذاری کنید",
    "remote.level1.requirement1.description": "یک مخزن راه‌دور اضافه کنید",
    "remote.level1.requirement1.success": "عالی! شما یک مخزن راه‌دور اضافه کردید.",
    "remote.level1.story.title": "اتصال مخازن",
    "remote.level1.story.narrative":
        '"تا اینجا پیشرفت خوبی داشتید! حالا وقت آن است که مخزن محلی خود را به یک مخزن راه‌دور متصل کنید،" Alex می‌گوید. "این کار به شما اجازه می‌دهد کد خود را با تیم به اشتراک بگذارید و به‌طور مؤثر همکاری کنید."\n\nاو توضیح می‌دهد: "اولین قدم افزودن یک اتصال به مخزن راه‌دور با استفاده از `git remote add` است. این کار هنوز هیچ کدی را منتقل نمی‌کند—فقط اتصال را ایجاد می‌کند."',
    "remote.level1.story.realWorldContext":
        "مخازن راه‌دور محور اصلی گردش‌کارهای توسعه مشارکتی هستند. بیشتر سیستم‌های مبتنی بر Git مانند GitHub، GitLab و Bitbucket با میزبانی مخازن راه‌دور کار می‌کنند که اعضای تیم به آن‌ها متصل می‌شوند.",
    "remote.level1.story.taskIntroduction": "یک remote به نام 'origin' به مخزن خود اضافه کنید.",

    // Remote Level 2
    "remote.level2.name": "پوش کردن کامیت‌ها به Remote",
    "remote.level2.description": "یاد بگیرید چه زمانی و چگونه کامیت‌های خود را آپلود کنید",
    "remote.level2.objective1": "کامیت‌های محلی خود را به مخزن راه‌دور پوش کنید",
    "remote.level2.objective2": "تفاوت بین کامیت محلی و پوش راه‌دور را درک کنید",
    "remote.level2.hint1": "از `git push origin main` برای پوش کردن به شاخه main استفاده کنید",
    "remote.level2.hint2":
        "مهم: پوش را بعد از اینکه کامیت انجام دادید انجام دهید! پوش کامیت‌های شما را آپلود می‌کند، نه فایل‌های تکی را.",
    "remote.level2.hint3": "نکته: از `git log` برای دیدن کامیت‌هایی که دارید استفاده کنید",
    "remote.level2.requirement1.description": "کامیت‌های خود را به remote پوش کنید",
    "remote.level2.requirement1.success": "عالی! کامیت‌های شما اکنون در مخزن راه‌دور در دسترس هستند.",
    "remote.level2.story.title": "از مخزن محلی به مخزن راه‌دور",
    "remote.level2.story.narrative":
        '"بگذار نشانت بدهم گردش‌کار Git چطور کار می‌کند،" Alex می‌گوید و یک نمودار می‌کشد:\n\n1️⃣ فایل‌ها را تغییر می‌دهید (Working Directory)\n2️⃣ آن‌ها را با `git add` استیج می‌کنید (Staging Area)\n3️⃣ آن‌ها را با `git commit` کامیت می‌کنید (Local Repository)\n4️⃣ با `git push` پوش می‌کنید (Remote Repository)\n\n"مهم است درک کنید: git push کامیت‌های شما را آپلود می‌کند، نه فایل‌های تکی را! قبل از اینکه بتوانید پوش کنید، باید یک کامیت بسازید. کامیت‌های محلی شما فقط روی کامپیوتر شما وجود دارند تا زمانی که آن‌ها را پوش کنید."',
    "remote.level2.story.realWorldContext":
        "تفاوت بین مخزن محلی و راه‌دور بنیادین است: کامیت‌های محلی فقط روی دستگاه شما وجود دارند. فقط از طریق git push است که برای تیم شما قابل مشاهده می‌شوند. این یعنی: می‌توانید هر تعداد کامیت محلی که می‌خواهید بسازید و سپس همه را یک‌جا پوش کنید!",
    "remote.level2.story.taskIntroduction":
        "شما قبلاً یک کامیت ساخته‌اید. حالا این کامیت را با استفاده از `git push origin main` به مخزن راه‌دور پوش کنید.",

    "remote.level3.name": "پوش کردن شاخه ویژگی",
    "remote.level3.description": "یک شاخه ویژگی را به مخزن راه‌دور پوش کنید",
    "remote.level3.objective1": "شاخه ویژگی خود را همراه با تمام کامیت‌هایش پوش کنید",
    "remote.level3.hint1": "از `git push origin <branch-name>` استفاده کنید",
    "remote.level3.hint2": "همچنین می‌توانید از `git push -u origin <branch-name>` برای تنظیم upstream استفاده کنید",
    "remote.level3.requirement1.description": "یک شاخه ویژگی را به remote پوش کنید",
    "remote.level3.requirement1.success": "عالی! شاخه ویژگی شما اکنون در مخزن راه‌دور در دسترس است.",
    "remote.level3.story.title": "به اشتراک‌گذاری ویژگی‌ها",
    "remote.level3.story.narrative":
        '"شما روی یک شاخه جداگانه در حال کار روی یک ویژگی عالی جدید بوده‌اید،" Sarah می‌گوید. "حالا وقت آن است که این شاخه را به مخزن راه‌دور پوش کنید تا سایر اعضای تیم بتوانند کار شما را ببینند و بازبینی کنند."\n\nاو توضیح می‌دهد: "وقتی برای اولین بار یک شاخه را پوش می‌کنید، باید از گزینه -u (یا --set-upstream) استفاده کنید. این کار شاخه محلی شما را به شاخه راه‌دور متصل می‌کند و پوش‌ها و پول‌های بعدی را آسان‌تر می‌کند."',
    "remote.level3.story.realWorldContext":
        "در تیم‌های حرفه‌ای، ویژگی‌های جدید معمولاً روی شاخه‌های جداگانه توسعه داده می‌شوند و سپس برای بازبینی پوش می‌شوند پیش از اینکه در کدبیس اصلی ادغام شوند. این بخش اصلی گردش‌کار pull request است.",
    "remote.level3.story.taskIntroduction": "شاخه ویژگی خود را به مخزن راه‌دور پوش کنید تا دیگران بتوانند آن را ببینند.",

    // Reset Stage
    "reset.name": "لغو کامیت‌ها",
    "reset.description": "یاد بگیرید چگونه کامیت‌ها را لغو کنید و در تاریخچه به عقب برگردید",

    "reset.level1.name": "ریست نرم - حفظ تغییرات",
    "reset.level1.description": "به یک کامیت قبلی برگردید اما تغییرات خود را حفظ کنید",
    "reset.level1.objective1": "آخرین کامیت را لغو کنید و تغییرات را استیج‌شده نگه دارید",
    "reset.level1.objective2": "برای درک این مفهوم، به HEAD (کامیت فعلی) ریست کنید",
    "reset.level1.objective3": "با استفاده از نماد HEAD~n به یک کامیت قبلی مشخص ریست کنید",
    "reset.level1.hint1": "با یک مورد ساده شروع کنید: git reset --soft HEAD~1 (لغو آخرین کامیت)",
    "reset.level1.hint2": "ابتدا تاریخچه کامیت‌ها را ببینید: git log --oneline",
    "reset.level1.hint3": "git reset --soft HEAD همه‌چیز را همان‌طور که هست نگه می‌دارد (بدون تغییر)",
    "reset.level1.hint4": "git reset --soft HEAD~2 دو کامیت به عقب می‌رود",
    "reset.level1.hint5": "فایل‌ها پس از ریست --soft استیج‌شده باقی می‌مانند - عالی برای اصلاح پیام‌های کامیت!",
    "reset.level1.hint6": "از git status برای دیدن اینکه بعد از ریست چه چیزی استیج شده استفاده کنید",
    "reset.level1.requirement1.description": "آخرین کامیت را با استفاده از --soft لغو کنید",
    "reset.level1.requirement1.success": "✅ خوب! کامیت از بین رفت اما فایل‌ها هنوز استیج‌شده هستند!",
    "reset.level1.requirement2.description": "برای درک این مفهوم به HEAD ریست کنید",
    "reset.level1.requirement2.success": "✅ عالی! ریست به HEAD یعنی 'همان‌جا که هستید بمانید' - بدون تغییر!",
    "reset.level1.requirement3.description": "با استفاده از HEAD~n به یک کامیت قبلی‌تر ریست کنید",
    "reset.level1.requirement3.success": "✅ عالی! شما بر نماد HEAD~n برای ریست‌های نرم مسلط شدید!",
    "reset.level1.story.title": "درک git reset --soft",
    "reset.level1.story.narrative": `🔄 **درک git reset --soft**

**وضعیت:**
شما روی یک ویژگی کار می‌کنید و 5 کامیت ساخته‌اید. اما وقتی به عقب نگاه می‌کنید، متوجه می‌شوید:
- کامیت 5: "Add database config" - وای! این یکی اطلاعات محرمانه دارد! 🔐
- کامیت 4: "Update API endpoints" - این خوب است ✅
- کامیت 3: "Add authentication" - خوب ✅
- کامیت 2: "Setup routing" - خوب ✅
- کامیت 1: "Initial project setup" - خوب ✅

باید کامیت 5 را لغو کنید، آن را اصلاح کنید و دوباره درست کامیت کنید!

**git reset --soft چیست؟**
کامیت‌های Git را مثل یک پشته از جعبه‌ها 📦📦📦 تصور کنید. هر جعبه یک کامیت است.

\`git reset --soft\` جعبه‌ها را از بالای پشته برمی‌دارد، اما تمام اقلام (تغییرات شما) را روی یک میز استیجینگ نگه می‌دارد، آماده برای بسته‌بندی در یک جعبه جدید!

**سه روش استفاده از git reset --soft:**

**1. ریست به کامیت قبلی (رایج‌ترین حالت):**
\`git reset --soft HEAD~1\`
- HEAD = "جایی که الان هستید" (جعبه بالایی)
- ~1 = "یک جعبه به عقب برو"
- نتیجه: آخرین کامیت حذف می‌شود، اما تغییرات استیج‌شده باقی می‌مانند!

**2. ریست به HEAD (آموزشی - هیچ کاری نمی‌کند):**
\`git reset --soft HEAD\`
- این یعنی "ریست به همان‌جایی که الان هستم"
- هیچ اتفاقی نمی‌افتد! برای درک این مفهوم مفید است.

**3. ریست به یک کامیت قدیمی‌تر:**
\`git reset --soft HEAD~3\`
- 3 کامیت به عقب می‌رود
- تمام تغییرات آن 3 کامیت استیج‌شده باقی می‌مانند
- عالی برای ترکیب چند کامیت در یکی!

**مأموریت شما:**

**قدم 1:** آخرین کامیت (همان که اطلاعات محرمانه دارد) را حذف کنید
\`git reset --soft HEAD~1\`
با \`git status\` بررسی کنید - فایل‌های شما هنوز استیج‌شده‌اند! ✨

**قدم 2:** ریست به HEAD را امتحان کنید (آموزشی)
\`git reset --soft HEAD\`
توجه کنید: هیچ چیز تغییر نکرد! شما از قبل در HEAD هستید.

**قدم 3:** برای تمرین بیشتر عقب‌تر بروید
\`git reset --soft HEAD~2\`
حالا 2 کامیت را حذف کرده‌اید، اما فایل‌ها هنوز استیج‌شده هستند!

**به یاد داشته باشید:**
- 📦 کامیت‌ها از تاریخچه حذف می‌شوند
- ✅ فایل‌ها در ناحیه استیجینگ باقی می‌مانند
- 🎯 عالی برای اصلاح پیام‌های کامیت یا ترکیب کامیت‌ها
- ⚠️  فقط روی کامیت‌هایی استفاده کنید که هنوز پوش نکرده‌اید!

بیایید این سه تکنیک را تمرین کنیم! 🚀`,
    "reset.level1.story.realWorldContext":
        "git reset --soft زمانی که می‌خواهید آخرین کامیت خود را بدون از دست دادن کار اصلاح کنید، بسیار مفید است. می‌توانید تغییرات را ویرایش کرده و دوباره کامیت کنید.",
    "reset.level1.story.taskIntroduction":
        "تمرین کنید که git reset --soft را با اهداف مختلف استفاده کنید: HEAD~1، HEAD و HEAD~2.",

    "reset.level2.name": "ریست سخت - دور انداختن همه‌چیز",
    "reset.level2.description": "به یک کامیت قبلی برگردید و تمام تغییرات را دور بریزید",
    "reset.level2.objective1": "آخرین کامیت دارای باگ را کاملاً دور بریزید",
    "reset.level2.objective2": "به HEAD ریست کنید تا بفهمید هیچ کاری انجام نمی‌دهد",
    "reset.level2.objective3": "چند کامیت به عقب بپرید و همه‌چیز را دور بریزید",
    "reset.level2.hint1": "⚠️  هشدار: --hard مخرب است! تمام تغییرات برای همیشه از بین می‌روند!",
    "reset.level2.hint2": "ابتدا ببینید چه چیزی را از دست می‌دهید: git log --oneline",
    "reset.level2.hint3": "git reset --hard HEAD~1 آخرین کامیت و تمام تغییرات را حذف می‌کند",
    "reset.level2.hint4": "git reset --hard HEAD هیچ کاری انجام نمی‌دهد (از قبل در HEAD هستید)",
    "reset.level2.hint5": "git reset --hard HEAD~3 سه کامیت به عقب می‌رود و همه‌چیز را حذف می‌کند",
    "reset.level2.hint6": "زمانی از این استفاده کنید که می‌خواهید کد بد را کاملاً دور بریزید",
    "reset.level2.hint7": "💡 در دنیای واقعی: فقط روی کدی که هنوز پوش نکرده‌اید از --hard استفاده کنید!",
    "reset.level2.requirement1.description": "آخرین کامیت را با استفاده از --hard دور بریزید",
    "reset.level2.requirement1.success": "💥 کامیت و تمام تغییرات نابود شدند! راه بازگشتی نیست!",
    "reset.level2.requirement2.description": "به HEAD ریست کنید (آموزشی - هیچ کاری انجام نمی‌دهد)",
    "reset.level2.requirement2.success": "✅ هیچ چیز تغییر نکرد - شما از قبل در HEAD هستید!",
    "reset.level2.requirement3.description": "چند کامیت را با استفاده از --hard دور بریزید",
    "reset.level2.requirement3.success": "💥 چند کامیت نابود شدند! فضای کاری دوباره تمیز است!",
    "reset.level2.story.title": "درک git reset --hard - گزینه هسته‌ای",
    "reset.level2.story.narrative": `⚠️  **درک git reset --hard - گزینه هسته‌ای**

**وضعیت:**
جمعه عصر است. شما تمام روز را با یک ویژگی جدید آزمایش می‌کرده‌اید:
- کامیت 6: "Try experimental algorithm v3" - کاملاً خراب! 💀
- کامیت 5: "Try experimental algorithm v2" - هنوز خراب! 🐛
- کامیت 4: "Try experimental algorithm v1" - نه! ❌
- کامیت 3: "Add user dashboard" - این یکی کار می‌کرد! ✅
- کامیت 2: "Add user authentication" - خوب ✅
- کامیت 1: "Initial project" - خوب ✅

متوجه می‌شوید: این آزمایش‌ها آشغال‌اند. می‌خواهید برای همیشه از بین بروند. 💣

**git reset --hard چیست؟**
استعاره جعبه‌ها را یادتان هست؟ 📦📦📦

\`git reset --soft\` جعبه‌ها را برمی‌داشت اما اقلام را روی میز استیجینگ نگه می‌داشت.

\`git reset --hard\` جعبه‌ها را برمی‌دارد و تمام اقلام را در سطل زباله می‌ریزد! 🗑️

**⚠️  بسیار مهم: این کار مخرب و دائمی است!**
- کامیت‌ها از تاریخچه حذف می‌شوند
- تمام تغییرات فایل حذف می‌شوند
- دایرکتوری کاری پاک می‌شود
- ناحیه استیجینگ خالی می‌شود
- **هیچ راه بازگشتی وجود ندارد!**

**سه روش استفاده از git reset --hard:**

**1. نابود کردن آخرین کامیت (رایج‌ترین حالت):**
\`git reset --hard HEAD~1\`
- آخرین کامیت را حذف می‌کند
- تمام تغییرات آن کامیت را پاک می‌کند
- دایرکتوری کاری شبیه کامیت قبلی می‌شود
- ⚠️  تغییرات برای همیشه از بین می‌روند!

**2. ریست به HEAD (آموزشی - هیچ کاری نمی‌کند):**
\`git reset --hard HEAD\`
- یعنی "فضای کاری‌ام را شبیه HEAD کن"
- چون از قبل در HEAD هستید، هیچ چیز تغییر نمی‌کند
- برای درک این مفهوم مفید است: HEAD = موقعیت فعلی

**3. نابود کردن چند کامیت:**
\`git reset --hard HEAD~4\`
- 4 کامیت به عقب می‌رود
- هر 4 کامیت از تاریخچه حذف می‌شوند
- تمام تغییرات آن کامیت‌ها حذف می‌شوند
- انگار هیچ‌وقت وجود نداشته‌اند! 👻

**چه زمانی از --hard استفاده کنیم:**
- ✅ آزمایش شکست خورد، دورش بریزید
- ✅ همه‌چیز خراب شد، باید از نو شروع کنید
- ✅ اطلاعات محرمانه/رمز عبور را تصادفاً کامیت کرده‌اید
- ❌ روی کامیت‌هایی که قبلاً پوش کرده‌اید نه!
- ❌ اگر ممکن است بعداً به تغییرات نیاز داشته باشید نه!

**مأموریت شما:**

**قدم 1:** آخرین کامیت خراب را نابود کنید
\`git reset --hard HEAD~1\`
با \`git status\` بررسی کنید - فضای کاری تمیز است! 🧹

**قدم 2:** ریست به HEAD را امتحان کنید (تمرین امن)
\`git reset --hard HEAD\`
هیچ اتفاقی نمی‌افتد - شما از قبل همان‌جا هستید!

**قدم 3:** چند آزمایش شکست‌خورده را نابود کنید
\`git reset --hard HEAD~3\`
هر 3 کامیت بد از بین رفتند! انگار آن جمعه هیچ‌وقت اتفاق نیفتاده! 😅

**به یاد داشته باشید:**
- 💥 این گزینه هسته‌ای است
- 🗑️  همه‌چیز حذف می‌شود - هم کامیت‌ها و هم تغییرات
- ⏪ قابل بازگشت نیست (مگر اینکه هش کامیت را داشته باشید)
- 🎯 فقط زمانی استفاده کنید که 100% مطمئن هستید
- ⚠️  هرگز روی کامیت‌های پوش‌شده استفاده نکنید!

**نکته جالب:** توسعه‌دهندگان حرفه‌ای وقتی می‌خواهند کاملاً از نو شروع کنند می‌گویند «دارم روی این هارد ریست می‌زنم»! 🔥

آماده‌اید تمرین نابودی امن را انجام دهید؟ بزنیم بریم! 💪`,
    "reset.level2.story.realWorldContext":
        "ریست --hard ابزاری قدرتمند اما خطرناک است. زمانی استفاده می‌شود که واقعاً به یک شروع تازه نیاز دارید. در تیم‌ها، در استفاده از reset روی کامیت‌های پوش‌شده مراقب باشید - می‌تواند دیگران را گیج کند.",
    "reset.level2.story.taskIntroduction":
        "گزینه هسته‌ای را تمرین کنید: از git reset --hard برای دور انداختن کامل کامیت‌ها و تغییرات استفاده کنید.",

    "reset.level3.name": "ریست به یک کامیت مشخص",
    "reset.level3.description": "به یک کامیت مشخص در تاریخچه برگردید",
    "reset.level3.objective1": "تاریخچه کامیت‌ها را مشاهده کرده و کامیت خوب را شناسایی کنید",
    "reset.level3.objective2": "با استفاده از هش آن، به یک کامیت مشخص ریست کنید",
    "reset.level3.hint1": "ابتدا تاریخچه کامیت‌های خود را بررسی کنید: git log --oneline",
    "reset.level3.hint2": "هر کامیت یک هش یکتا دارد (مثل 'a1b2c3d')",
    "reset.level3.hint3": "git reset --soft <commit-hash> تغییرات را استیج‌شده نگه می‌دارد",
    "reset.level3.hint4": "git reset --hard <commit-hash> همه‌چیز بعد از آن کامیت را نابود می‌کند",
    "reset.level3.hint5": "هش‌های کامیت شناسه‌های دائمی هستند - HEAD~n نسبی است",
    "reset.level3.hint6": "نکته حرفه‌ای: فقط به 7 کاراکتر اول هش نیاز دارید!",
    "reset.level3.hint7": "'Version 2 - Good version' را پیدا کرده و از هش آن استفاده کنید",
    "reset.level3.requirement1.description": "تاریخچه کامیت‌ها را برای شناسایی کامیت خوب مشاهده کنید",
    "reset.level3.requirement1.success": "✅ خوب! حالا می‌توانید تمام کامیت‌ها و هش‌های آن‌ها را ببینید!",
    "reset.level3.requirement2.description": "با استفاده از هش آن به یک کامیت مشخص ریست کنید",
    "reset.level3.requirement2.success": "🎯 عالی! شما بر ریست کردن به هش کامیت‌های مشخص مسلط شدید!",
    "reset.level3.story.title": "ریست پیشرفته: استفاده از هش کامیت‌ها",
    "reset.level3.story.narrative": `🎯 **ریست پیشرفته: استفاده از هش کامیت‌ها**

**وضعیت:**
پروژه شما بزرگ شده است. حالا در کامیت 8 هستید، اما باید به کامیت 3 برگردید.

استفاده از \`HEAD~5\` برای شمردن 5 کامیت به عقب، کاری آزاردهنده و مستعد خطاست. اگر کسی در حین کار شما یک کامیت اضافه کند چه؟ شمارش تغییر می‌کند!

**راه‌حل حرفه‌ای: هش کامیت‌ها**

هر کامیت یک شناسه یکتا (هش) دارد، مثل اثر انگشت:
\`a1b2c3d - "Version 2 - Good version"\`

این هش هرگز تغییر نمی‌کند! دائمی و یکتاست.

**وضعیت فعلی:**
- کامیت 8: "Attempted fix v3" - هنوز خراب! 💔
- کامیت 7: "Attempted fix v2" - نه! 🐛
- کامیت 6: "Attempted fix v1" - شکست خورد! ❌
- کامیت 5: "Add broken feature" - شروع آشفتگی 🔥
- کامیت 4: "Update styling" - ظاهری ✨
- کامیت 3: "Version 2 - GOOD VERSION" - آخرین وضعیت شناخته‌شده سالم! ✅
- کامیت 2: "Version 1" - نسخه اولیه ✅
- کامیت 1: "Initial commit" - پایه‌گذاری ✅

**مأموریت شما:**

**قدم 1: کامیت خوب را پیدا کنید**
اجرا کنید: \`git log --oneline\`

چیزی شبیه این می‌بینید:
\`\`\`
f7e8a9b Attempted fix v3
d6c7b8a Attempted fix v2
c5b6a7f Attempted fix v1
b4a5c6e Add broken feature
a3b4c5d Update styling
9a2b3c4 Version 2 - Good version  ← همین یکی!
8a1b2c3 Version 1
7a0b1c2 Initial commit
\`\`\`

**قدم 2: به آن کامیت ریست کنید**
\`git reset --soft 9a2b3c4\`
(از هش واقعی که می‌بینید استفاده کنید!)

یا (مخرب‌تر):
\`git reset --hard 9a2b3c4\`

**HEAD~n در مقابل هش کامیت:**

**نسبی (HEAD~n):**
- \`HEAD~1\` = "کامیت قبلی"
- \`HEAD~5\` = "5 کامیت پیش"
- ❌ اگر کامیت جدید اضافه شود تغییر می‌کند
- ✅ برای کامیت‌های اخیر سریع است

**مطلق (هش کامیت):**
- \`git reset --soft a1b2c3d\`
- ✅ مرجع دائمی
- ✅ هرگز تغییر نمی‌کند
- ✅ رویکرد حرفه‌ای
- 🎯 بهترین گزینه برای بازگشت به وضعیت‌های شناخته‌شده سالم

**نکات حرفه‌ای:**
- فقط به 7 کاراکتر اول نیاز دارید: \`9a2b3c4\` به‌جای هش کامل
- می‌توانید هش‌ها را از \`git log\` کپی کنید
- هش‌ها با هر دستور git کار می‌کنند: \`git show a1b2c3d\`
- هش کامیت‌های مهم را برای بازگشت آسان یادداشت کنید!

**سناریوی دنیای واقعی:**
"سلام تیم، اگر دیپلوی خراب شد، به کامیت 9a2b3c4 برگردید - این آخرین نسخه پایدار ماست!"

**در سیستم‌های CI/CD:**
دیپلوی‌های تولید اغلب از هش کامیت برای کنترل نسخه دقیق استفاده می‌کنند:
\`\`\`
deploy.sh --commit=9a2b3c4
\`\`\`

بیایید Git را در سطح حرفه‌ای تمرین کنیم! 🚀`,
    "reset.level3.story.realWorldContext":
        "استفاده از هش کامیت‌ها روش حرفه‌ای برای اشاره به نقاط مشخص در تاریخچه است. آن‌ها دائمی، بدون ابهام هستند و در مخازن تمام اعضای تیم کار می‌کنند.",
    "reset.level3.story.taskIntroduction":
        "از git log برای پیدا کردن هش کامیت‌ها استفاده کنید، سپس از git reset با یک هش مشخص استفاده کنید.",

    // Rebase Stage
    "rebase.name": "ریبیس کردن",
    "rebase.description": "یاد بگیرید چگونه شاخه‌ها را ریبیس کنید",

    // Rebase Level 1
    "rebase.level1.name": "ریبیس پایه",
    "rebase.level1.description": "کامیت‌های یک شاخه را روی شاخه دیگر اعمال کنید",
    "rebase.level1.objective1": "شاخه فعلی را روی شاخه دیگری ریبیس کنید",
    "rebase.level1.hint1": "شما روی شاخه feature هستید - آن را با git rebase main روی main ریبیس کنید",
    "rebase.level1.hint2": "این کار تاریخچه را بازنویسی می‌کند و کامیت‌های شما را روی آخرین کامیت‌های main اعمال می‌کند",
    "rebase.level1.hint3": "از 'git log --oneline' برای دیدن تاریخچه کامیت‌ها بعد از ریبیس استفاده کنید",
    "rebase.level1.requirement1.description": "روی شاخه دیگری ریبیس کنید",
    "rebase.level1.requirement1.success": "کار خوبی بود! شما با موفقیت شاخه را ریبیس کردید.",
    "rebase.level1.story.title": "ایجاد تاریخچه‌ای تمیز",
    "rebase.level1.story.narrative":
        '"می‌بینم دارید با ادغام راحت می‌شوید،" Sarah می‌گوید. "حالا بیایید یک رویکرد متفاوت برای یکپارچه‌سازی تغییرات را بررسی کنیم: ریبیس کردن."\n\nاو توضیح می‌دهد: "در حالی که ادغام تاریخچه‌ها را ترکیب می‌کند، ریبیس آن را بازنویسی می‌کند و کامیت‌های شما را طوری جابجا می‌کند که بعد از کامیت‌های شاخه دیگر ظاهر شوند. این کار یک تاریخچه خطی‌تر و تمیزتر ایجاد می‌کند."',
    "rebase.level1.story.realWorldContext":
        "ریبیس کردن معمولاً زمانی ترجیح داده می‌شود که بخواهید تاریخچه پروژه‌ای تمیز و خطی داشته باشید. بسیاری از تیم‌ها از آن برای یکپارچه‌سازی شاخه‌های ویژگی پیش از ادغام آن‌ها در شاخه main استفاده می‌کنند.",
    "rebase.level1.story.taskIntroduction": "شما روی شاخه feature هستید. آن را با استفاده از git rebase main روی main ریبیس کنید",

    // Rebase Level 2
    "rebase.level2.name": "مدیریت تعارض‌های ریبیس",
    "rebase.level2.description": "یاد بگیرید چگونه ریبیس‌های دارای تعارض را مدیریت یا لغو کنید",
    "rebase.level2.objective1": "یک ریبیس دارای تعارض را لغو کنید",
    "rebase.level2.hint1": "از دستور `git rebase --abort` استفاده کنید",
    "rebase.level2.hint2": "این کار فرآیند ریبیس را متوقف کرده و به حالت قبل از شروع ریبیس بازمی‌گردد",
    "rebase.level2.requirement1.description": "یک ریبیس دارای تعارض را لغو کنید",
    "rebase.level2.requirement1.success": "عالی! شما با موفقیت عملیات ریبیس را لغو کردید.",
    "rebase.level2.story.title": "وقتی ریبیس‌ها پیچیده می‌شوند",
    "rebase.level2.story.narrative":
        '"درست مثل ادغام، ریبیس هم می‌تواند منجر به تعارض شود،" Alex اشاره می‌کند. "اما حل تعارض‌ها در طول ریبیس می‌تواند پیچیده‌تر باشد چون Git هر کدام از کامیت‌های شما را یکی‌یکی اعمال می‌کند."\n\nاو ادامه می‌دهد: "اگر در وسط یک ریبیس هستید و تصمیم می‌گیرید که خیلی پیچیده است یا باید رویکرد خود را دوباره فکر کنید، همیشه می‌توانید فرآیند را لغو کنید."',
    "rebase.level2.story.realWorldContext":
        "دانستن اینکه چه زمانی و چگونه یک ریبیس را لغو کنید در توسعه واقعی مهم است. گاهی تعارض‌ها برای حل فوری خیلی پیچیده‌اند، یا متوجه می‌شوید استراتژی متفاوتی بهتر خواهد بود.",
    "rebase.level2.story.taskIntroduction": "تمرین کنید که یک عملیات ریبیس را با استفاده از git rebase --abort لغو کنید.",

    // Rebase Level 3
    "rebase.level3.name": "ریبیس تعاملی",
    "rebase.level3.description": "یاد بگیرید چگونه از ریبیس تعاملی برای تغییر تاریخچه کامیت‌ها استفاده کنید",
    "rebase.level3.objective1": "یک نشست ریبیس تعاملی را شروع کنید",
    "rebase.level3.hint1": "از دستور `git rebase -i` استفاده کنید",
    "rebase.level3.hint2": "ریبیس تعاملی به شما اجازه می‌دهد کامیت‌ها را دوباره مرتب کنید، ویرایش کنید، ادغام (squash) کنید یا حذف کنید",
    "rebase.level3.requirement1.description": "یک ریبیس تعاملی را شروع کنید",
    "rebase.level3.requirement1.success": "عالی! شما یک نشست ریبیس تعاملی را شروع کردید.",
    "rebase.level3.story.title": "پاکسازی تاریخچه",
    "rebase.level3.story.narrative":
        '"ویژگی شما خوب به نظر می‌رسد،" Alex در حین بازبینی کد شما می‌گوید. "اما متوجه شدم چند کامیت کوچک با اصلاح غلط‌های تایپی و تغییرات جزئی دارید. قبل از اینکه این را در main ادغام کنیم، بیایید تاریخچه کامیت‌ها را پاکسازی کنیم."\n\nاو توضیح می‌دهد: "Git ابزاری قدرتمند به نام ریبیس تعاملی ارائه می‌دهد که به شما اجازه می‌دهد تاریخچه کامیت‌های خود را تغییر دهید. می‌توانید کامیت‌های کوچک را ترکیب کنید، پیام‌های کامیت را دوباره بنویسید، یا حتی کامیت‌ها را کاملاً حذف کنید."',
    "rebase.level3.story.realWorldContext":
        "ریبیس تعاملی معمولاً برای ایجاد یک تاریخچه کامیت تمیز و منسجم پیش از ادغام شاخه‌های ویژگی استفاده می‌شود. این کار تاریخچه کدبیس را خواناتر و معنادارتر می‌کند.",
    "rebase.level3.story.taskIntroduction": "یک نشست ریبیس تعاملی را شروع کنید تا تاریخچه کامیت‌های خود را تغییر دهید.",

    // Rebase Level 4
    "rebase.level4.name": "ریبیس کردن روی Main",
    "rebase.level4.description": "گردش‌کار ریبیس کردن شاخه‌های ویژگی روی شاخه‌های main به‌روزشده را بیاموزید",
    "rebase.level4.objective1": "شاخه ویژگی خود را روی شاخه main به‌روزشده ریبیس کنید",
    "rebase.level4.hint1": "در حالی که روی شاخه feature خود هستید، از `git rebase main` استفاده کنید",
    "rebase.level4.hint2": "این کار تغییرات ویژگی شما را روی آخرین تغییرات شاخه main اعمال می‌کند",
    "rebase.level4.requirement1.description": "feature را روی main ریبیس کنید",
    "rebase.level4.requirement1.success": "عالی! شما شاخه ویژگی خود را روی آخرین شاخه main ریبیس کردید.",
    "rebase.level4.story.title": "به‌روز ماندن",
    "rebase.level4.story.narrative":
        '"می‌بینم در حالی که روی ویژگی خود کار می‌کردید، شخص دیگری تغییراتی را به شاخه main پوش کرده است،" Sarah اشاره می‌کند. "قبل از اینکه کار شما را ادغام کنیم، باید این آخرین تغییرات را وارد کنید."\n\nاو ادامه می‌دهد: "به‌جای ادغام main در شاخه خود، که یک کامیت ادغام ایجاد می‌کند، پیشنهاد می‌کنم شاخه خود را روی main ریبیس کنید. این کار تاریخچه را تمیزتر نگه می‌دارد."',
    "rebase.level4.story.realWorldContext":
        "در محیط‌های مشارکتی، شاخه‌های main مکرراً به‌روزرسانی می‌شوند. ریبیس کردن شاخه‌های ویژگی روی main یک گردش‌کار رایج است که به جلوگیری از تعارض‌های ادغام کمک می‌کند و شاخه‌های ویژگی را به‌روز نگه می‌دارد.",
    "rebase.level4.story.taskIntroduction":
        "شاخه ویژگی خود را روی شاخه main به‌روزشده ریبیس کنید تا آخرین تغییرات را وارد کنید.",

    // Advanced Stage
    "advanced.name": "Advanced Git Techniques",
    "advanced.description": "Master advanced Git features and workflows",

    // Advanced Level 1: Git Tags
    "advanced.level1.name": "Version Tagging",
    "advanced.level1.description": "Learn to mark important points in history with tags",
    "advanced.level1.objective1": "Create an annotated tag for a release",
    "advanced.level1.objective2": "List all tags in the repository",
    "advanced.level1.objective3": "Push tags to remote repository",
    "advanced.level1.hint1": "Create an annotated tag with: git tag -a v1.0.1 -m 'Bug fix release'",
    "advanced.level1.hint2": "List all tags with: git tag",
    "advanced.level1.hint3": "Annotated tags include author info and a message",
    "advanced.level1.hint4": "Tags are used to mark release points (v1.0, v2.0, etc.)",
    "advanced.level1.requirement1.description": "Create a version tag",
    "advanced.level1.requirement1.success": "Excellent! You've tagged this commit as a release point.",
    "advanced.level1.requirement2.description": "List all tags to see your new tag",
    "advanced.level1.requirement2.success": "Perfect! You can see all tags in the repository.",
    "advanced.level1.requirement3.description": "Push tags to the remote repository",
    "advanced.level1.requirement3.success": "Excellent! Your tags are now available to the team.",
    "advanced.level1.story.title": "Marking Milestones",
    "advanced.level1.story.narrative":
        '"We\'re about to deploy version 1.0 to production," announces your team lead. "Before we do, we need to tag this commit. Tags are like bookmarks in your Git history - they mark important points like releases."\n\nShe continues: "Unlike branches that move with new commits, tags stay fixed. This means we can always go back to exactly what we shipped in v1.0, even years later."\n\n"In professional teams, every production release gets tagged. It\'s essential for debugging, rollbacks, and changelogs."',
    "advanced.level1.story.realWorldContext":
        "Tags are industry standard for marking releases. They enable semantic versioning (v1.0.0), make rollbacks safe, and help teams communicate about specific versions.",
    "advanced.level1.story.taskIntroduction":
        "Create an annotated tag to mark this release: git tag -a v1.0.1 -m 'Bug fix release'",

    // Advanced Level 2: Git Log Advanced
    "advanced.level2.name": "Advanced Commit History",
    "advanced.level2.description": "Master advanced techniques to explore repository history",
    "advanced.level2.objective1": "View condensed commit history",
    "advanced.level2.objective2": "Filter commits by author or date",
    "advanced.level2.objective3": "Search commit messages",
    "advanced.level2.hint1": "View one-line commit history with: git log --oneline",
    "advanced.level2.hint2": "Show commit history with graph: git log --graph --oneline",
    "advanced.level2.hint3": "Limit to last N commits: git log --oneline -n 5",
    "advanced.level2.hint4": "Search in commit messages: git log --grep='fix'",
    "advanced.level2.requirement1.description": "View compact commit history",
    "advanced.level2.requirement1.success": "Perfect! You've explored the commit history.",
    "advanced.level2.requirement2.description": "Filter commits by author",
    "advanced.level2.requirement2.success": "Great! You can now find commits by specific authors.",
    "advanced.level2.requirement3.description": "Search commit messages for specific text",
    "advanced.level2.requirement3.success": "Excellent! You can now search through commit messages.",
    "advanced.level2.story.title": "Exploring History",
    "advanced.level2.story.narrative":
        '"A bug was introduced somewhere in the last 50 commits," your colleague sighs. "How do I find it?"\n\nYour senior developer smiles: "Git log is your detective tool. The default format shows everything, but that\'s overwhelming. Let me show you the power tools."\n\n"git log --oneline shows each commit in one line - perfect for scanning. Add --graph to see branch structure. Use --grep to search commit messages. These skills turn you from a Git user into a Git detective."',
    "advanced.level2.story.realWorldContext":
        "Mastering git log is essential for debugging, code archaeology, and understanding project evolution. Professional developers use these flags daily.",
    "advanced.level2.story.taskIntroduction": "Explore the commit history using: git log --oneline",

    // Advanced Level 3: Git Show
    "advanced.level3.name": "Inspecting Commits",
    "advanced.level3.description": "Learn to inspect specific commits in detail",
    "advanced.level3.objective1": "Inspect a specific commit using its hash",
    "advanced.level3.hint1": "First use 'git log --oneline' to find a commit hash",
    "advanced.level3.hint2": "Show a specific commit: git show <commit-hash>",
    "advanced.level3.hint3": "git show displays the commit message, author, date, and diff with file changes",
    "advanced.level3.requirement1.description": "Inspect a commit using its hash",
    "advanced.level3.requirement1.success": "Great! You've inspected the commit details and file changes.",
    "advanced.level3.story.title": "Commit Forensics",
    "advanced.level3.story.narrative":
        '"This commit broke something, but I can\'t tell what changed," says your teammate.\n\n"Use git show!" you respond confidently. "It shows you everything about a commit: the message, who made it, when, and most importantly - the actual code changes."\n\n"It\'s like a magnifying glass for commits. Essential for code reviews, debugging, and understanding what colleagues changed."',
    "advanced.level3.story.realWorldContext":
        "git show is a fundamental tool for code review and debugging. It's used constantly in pull requests and when investigating issues.",
    "advanced.level3.story.taskIntroduction": "Inspect the latest commit using: git show",

    // Workflow Stage
    "workflow.name": "Git Workflows",
    "workflow.description": "Master professional Git workflows and collaboration patterns",

    "workflow.level1.name": "Feature Branch Workflow",
    "workflow.level1.description": "Learn the industry-standard feature branch workflow used by teams worldwide",
    "workflow.level1.objective1": "Create a feature branch from main",
    "workflow.level1.objective2": "Make commits with descriptive messages",
    "workflow.level1.objective3": "Push your feature branch to remote",
    "workflow.level1.objective4": "Switch back to main branch",
    "workflow.level1.objective5": "Merge your feature branch back to main",
    "workflow.level1.objective6": "Complete the feature branch workflow",
    "workflow.level1.hint1": "Start by creating a feature branch: 'git switch -c feature/user-auth'",
    "workflow.level1.hint2": "Modify the auth.js file, then use 'git add' to stage your changes",
    "workflow.level1.hint3": "Commit with: 'git commit'",
    "workflow.level1.hint4": "Push to remote: 'git push origin feature/user-auth'",
    "workflow.level1.hint5": "Switch back to main: 'git switch main'",
    "workflow.level1.hint6": "Finally merge: 'git merge feature/user-auth'",
    "workflow.level1.requirement1.description": "Create a new feature branch with 'git switch -c <branch>'",
    "workflow.level1.requirement1.success": "Feature branch created successfully!",
    "workflow.level1.requirement2.description": "Stage your changes (modify a file first!)",
    "workflow.level1.requirement2.success": "Changes staged!",
    "workflow.level1.requirement3.description": "Commit your changes with a descriptive message",
    "workflow.level1.requirement3.success": "Changes committed!",
    "workflow.level1.requirement4.description": "Push your feature branch to remote (git push origin <your-branch>)",
    "workflow.level1.requirement4.success": "Feature branch pushed to remote!",
    "workflow.level1.requirement5.description": "Switch back to main branch with 'git switch main'",
    "workflow.level1.requirement5.success": "Switched to main branch!",
    "workflow.level1.requirement6.description": "Merge your feature branch into main",
    "workflow.level1.requirement6.success":
        "Feature successfully merged! This is how real teams integrate new features.",
    "workflow.level1.story.title": "The Feature Factory",
    "workflow.level1.story.narrative": `You're a developer at TechCorp, and the team follows strict Git workflows. Your manager Sarah just assigned you a new feature: implementing user authentication.

"Remember," Sarah says, "we never commit directly to main. Always use feature branches, and make sure your commits tell a story."

**What's a Feature Branch?**
A feature branch is a separate branch where you develop a new feature in isolation. This allows you to:
- Work without affecting the stable main branch
- Get code reviewed before merging
- Easily abandon or modify work without impacting others

**The Complete Workflow:**
1. Create a feature branch from main: \`git switch -c feature/user-auth\`
2. Make changes to files and stage them with \`git add\`
3. Commit changes with descriptive messages
4. Push your branch to remote: \`git push origin feature/user-auth\`
5. Switch back to main: \`git switch main\`
6. Merge the feature: \`git merge feature/user-auth\`

**What are Pull Requests (PRs)?**
In real teams, after step 4 (pushing your branch), you'd create a **Pull Request** on GitHub/GitLab instead of merging directly:

**Pull Request Workflow:**
1. You push your feature branch to the remote repository
2. On GitHub/GitLab, you open a Pull Request from \`feature/user-auth\` to \`main\`
3. Your teammates receive a notification
4. They review your code, leave comments, and suggest improvements
5. You make changes based on feedback and push again
6. Once approved, someone merges the PR into main
7. Your feature is now part of the main codebase!

**Why Pull Requests Matter:**
- **Code Quality**: Multiple eyes catch bugs and suggest improvements
- **Knowledge Sharing**: Team learns about changes before they go live
- **Documentation**: PR descriptions explain WHY changes were made
- **Discussion**: Complex decisions are discussed and recorded
- **Safety**: Prevents broken code from reaching production

In this level, we're simulating the workflow by having you push and merge directly to learn the Git commands. In real projects, you'd always use Pull Requests for team collaboration!`,
    "workflow.level1.story.realWorldContext":
        "Feature branch workflow is the industry standard. Developers create isolated branches, push them to remote repos (GitHub/GitLab), create Pull Requests for code review, and merge after approval. This collaborative approach prevents unstable code from reaching production and improves code quality through peer review.",
    "workflow.level1.story.taskIntroduction":
        "Master the complete feature branch workflow: create, commit, push, and merge. This is how professional teams ship features every day.",

    "workflow.level2.name": "Hotfix Workflow",
    "workflow.level2.description": "Handle urgent production fixes with the hotfix workflow",
    "workflow.level2.objective1": "Create a hotfix branch from main",
    "workflow.level2.objective2": "Stage and commit the fix",
    "workflow.level2.objective3": "Switch back to main",
    "workflow.level2.objective4": "Merge the hotfix branch",
    "workflow.level2.hint1": "Hotfixes branch directly from main/master",
    "workflow.level2.hint2": "Use descriptive hotfix names like 'hotfix/critical-security-patch'",
    "workflow.level2.hint3": "Hotfixes should be merged back to both main and develop branches",
    "workflow.level2.hint4": "Always tag hotfix releases for tracking",
    "workflow.level2.requirement1.description": "Create a hotfix branch for the security issue",
    "workflow.level2.requirement1.success": "Hotfix branch created!",
    "workflow.level2.requirement2.description": "Stage your security fixes",
    "workflow.level2.requirement2.success": "Security fixes staged!",
    "workflow.level2.requirement3.description": "Commit the critical security patch",
    "workflow.level2.requirement3.success": "Security patch committed!",
    "workflow.level2.requirement4.description": "Switch back to main branch",
    "workflow.level2.requirement4.success": "Switched to main branch!",
    "workflow.level2.requirement5.description": "Merge the hotfix into main",
    "workflow.level2.requirement5.success": "Hotfix merged successfully!",
    "workflow.level2.story.title": "Code Red: Production Emergency",
    "workflow.level2.story.narrative": `🚨 URGENT: Production is down! 🚨

At 2:47 AM, your phone buzzes with alerts. The payment system is failing, and customers can't complete purchases. The bug tracker shows a critical security vulnerability was introduced in the latest release.

As the on-call developer, you need to:
1. Immediately create a hotfix branch: \`git switch -c hotfix/security-patch\`
2. Fix the critical security issue in the code
3. Stage and commit your fixes
4. Switch back to main: \`git switch main\`
5. Merge the hotfix: \`git merge hotfix/security-patch\`

Every minute costs the company thousands. This is what separates junior developers from senior ones - grace under pressure and knowing the right Git workflows.

Time is money. Let's fix this!`,
    "workflow.level2.story.realWorldContext":
        "Production hotfixes are critical for maintaining system stability and require immediate, focused workflow execution.",
    "workflow.level2.story.taskIntroduction": "Master the hotfix workflow for emergency production fixes.",

    "workflow.level3.name": "Git Flow Mastery",
    "workflow.level3.description": "Master the complete Git Flow workflow with release branches",
    "workflow.level3.objective1": "Create a release branch from develop",
    "workflow.level3.objective2": "Prepare and commit release changes",
    "workflow.level3.objective3": "Merge release to main",
    "workflow.level3.objective4": "Tag the release version",
    "workflow.level3.hint1": "Start on develop and create release branch: 'git switch -c release/2.0.0'",
    "workflow.level3.hint2": "Make final adjustments and commit your release preparation",
    "workflow.level3.hint3": "Switch to main: 'git switch main'",
    "workflow.level3.hint4": "Merge the release: 'git merge release/2.0.0'",
    "workflow.level3.hint5": "Tag the release: 'git tag v2.0.0'",
    "workflow.level3.hint6": "In real projects, you'd also merge back to develop",
    "workflow.level3.requirement1.description": "Create a release branch (e.g., 'release/2.0.0')",
    "workflow.level3.requirement1.success": "Release branch created!",
    "workflow.level3.requirement2.description": "Stage your release preparation changes",
    "workflow.level3.requirement2.success": "Release changes staged!",
    "workflow.level3.requirement3.description": "Commit release preparation with a clear message",
    "workflow.level3.requirement3.success": "Release preparation committed!",
    "workflow.level3.requirement4.description": "Switch to main branch to prepare for release merge",
    "workflow.level3.requirement4.success": "Switched to main!",
    "workflow.level3.requirement5.description": "Merge your release branch into main",
    "workflow.level3.requirement5.success": "Release merged to main!",
    "workflow.level3.requirement6.description": "Tag the release with version number (e.g., 'v2.0.0')",
    "workflow.level3.requirement6.success": "Release tagged! Version 2.0.0 is now live in production!",
    "workflow.level3.story.title": "The Release Manager",
    "workflow.level3.story.narrative": `Congratulations! You've been promoted to Release Manager at GitFlow Inc., a company that ships software every two weeks like clockwork.

Your job is to orchestrate the release of version 2.0, which includes:
- Three new features from different teams
- Two critical bug fixes
- Performance improvements
- Updated documentation

**The Release Workflow:**

1. **Create Release Branch**: Start from develop and create a release branch
   \`git switch -c release/2.0.0\`

2. **Final Preparations**: Update version numbers, CHANGELOG, etc.
   - Edit files as needed
   - \`git add .\`
   - \`git commit -m "Prepare release 2.0.0"\`

3. **Merge to Main**: Deploy to production
   - \`git switch main\`
   - \`git merge release/2.0.0\`

4. **Tag the Release**: Mark this version in history
   \`git tag v2.0.0\`

This creates a permanent marker for this release. In real projects, you'd also:
- Merge back to develop to keep it in sync
- Delete the release branch
- Push everything to remote
- Deploy to production

This is enterprise-level Git management. Welcome to the big leagues!`,
    "workflow.level3.story.realWorldContext":
        "Release branches are used in Git Flow to prepare production releases. They allow final bug fixes and documentation updates without blocking ongoing development. The release is tagged for easy reference and rollback if needed.",
    "workflow.level3.story.taskIntroduction":
        "Learn the professional release workflow: branch, prepare, merge, and tag. This is how teams ship stable software to production.",

    // Teamwork Stage
    "teamwork.name": "Team Collaboration",
    "teamwork.description": "Learn to work effectively with teams using Git collaboration techniques",

    "teamwork.level1.name": "Team Collaboration Basics",
    "teamwork.level1.description": "Learn how to work effectively with a team using Git",
    "teamwork.level1.objective1": "Pull the latest team code from remote",
    "teamwork.level1.objective2": "Create a new feature branch for your work",
    "teamwork.level1.objective3": "Edit team.md and add your name to the team members list",
    "teamwork.level1.objective4": "Stage your changes",
    "teamwork.level1.objective5": "Commit your changes",
    "teamwork.level1.objective6": "Push your changes to the remote repository",
    "teamwork.level1.hint1": "Use 'git pull origin main' to get the latest team code",
    "teamwork.level1.hint2": "Create a new branch with 'git switch -c feature/YOUR-NAME'",
    "teamwork.level1.hint3": "Edit the team.md file to add your name and role",
    "teamwork.level1.hint4": "Stage all changes with 'git add .'",
    "teamwork.level1.hint5": "Commit with a clear message: 'git commit -m \"Add my profile\"'",
    "teamwork.level1.hint6": "Push your branch with 'git push origin feature/YOUR-NAME'",
    "teamwork.level1.requirement1.description": "Pull the latest changes from the team repository",
    "teamwork.level1.requirement1.success": "Latest changes pulled successfully!",
    "teamwork.level1.requirement2.description": "Create your feature branch for team profile",
    "teamwork.level1.requirement2.success": "Feature branch created!",
    "teamwork.level1.requirement3.description": "Edit team.md and add your name to the list",
    "teamwork.level1.requirement3.success": "File modified! Your name has been added.",
    "teamwork.level1.requirement4.description": "Stage your team profile changes",
    "teamwork.level1.requirement4.success": "Changes staged!",
    "teamwork.level1.requirement5.description": "Commit your team profile with a descriptive message",
    "teamwork.level1.requirement5.success": "Team profile committed!",
    "teamwork.level1.requirement6.description": "Push your changes to the remote repository",
    "teamwork.level1.requirement6.success": "Changes pushed to remote!",
    "teamwork.level1.story.title": "Welcome to the Dev Team",
    "teamwork.level1.story.narrative": `🎉 Congratulations! You've just been hired as a developer at InnovateCorp, a fast-growing tech startup.

Your team lead, Alex, walks you through your first day:

"Welcome to the team! We use Git for everything here. The codebase is our shared workspace, and everyone contributes to it daily. Your first task is simple but important - add your profile to our team page."

"Remember," Alex continues, "we have 12 developers working on this project. Everyone needs to stay synchronized. Always \`git pull\` before you push, and make sure your commit messages are clear so the rest of us know what you're working on."

Your mission:
1. Get the latest code from the team repository with \`git pull origin main\`
2. Create your feature branch: \`git switch -c feature/team-profile\`
3. Add your developer profile to the team page
4. Stage changes: \`git add .\`
5. Commit your changes: \`git commit -m "Add my profile"\`

This is real-world team development. Let's make your first contribution!`,
    "teamwork.level1.story.realWorldContext":
        "Team collaboration is the heart of software development. Learning to work with shared repositories is essential for any developer.",
    "teamwork.level1.story.taskIntroduction":
        "Learn the fundamentals of team-based Git workflow and make your first collaborative contribution.",

    "teamwork.level2.name": "Handling Merge Conflicts in Teams",
    "teamwork.level2.description": "Resolve merge conflicts that occur when multiple developers work on the same files",
    "teamwork.level2.objective1": "Stage and commit your local changes",
    "teamwork.level2.objective2": "Pull remote changes (triggers conflict)",
    "teamwork.level2.objective3": "Resolve merge conflict markers",
    "teamwork.level2.objective4": "Stage and commit the merged solution",
    "teamwork.level2.hint1": "Use 'cat /src/auth/login.js' to see your current uncommitted changes",
    "teamwork.level2.hint2": "Use 'git status' to confirm the file is modified",
    "teamwork.level2.hint3": "Commit with 'git add /src/auth/login.js' then 'git commit -m \"message\"'",
    "teamwork.level2.hint4": "Pull with 'git pull origin main' - this will trigger the conflict!",
    "teamwork.level2.hint5": "Look for conflict markers: <<<<<<<, =======, >>>>>>>",
    "teamwork.level2.hint6": "Edit login.js to combine both your and Sarah's improvements",
    "teamwork.level2.hint7": "The best solution keeps BOTH: Sarah's email check AND your stricter lengths",
    "teamwork.level2.hint8": "After resolving: 'git add .' then 'git commit -m \"Resolve merge conflict\"'",
    "teamwork.level2.requirement1.description": "Stage your local changes to login.js",
    "teamwork.level2.requirement1.success": "Local changes staged!",
    "teamwork.level2.requirement2.description": "Commit your local changes first",
    "teamwork.level2.requirement2.success": "Local changes committed!",
    "teamwork.level2.requirement3.description": "Pull Sarah's changes to trigger the conflict",
    "teamwork.level2.requirement3.success": "Conflicting changes pulled! Check login.js for conflict markers.",
    "teamwork.level2.requirement4.description": "Stage the resolved conflict",
    "teamwork.level2.requirement4.success": "Conflict resolution staged!",
    "teamwork.level2.requirement5.description": "Commit the merge resolution",
    "teamwork.level2.requirement5.success": "Merge conflict resolved!",
    "teamwork.level2.story.title": "The Great Merge Conflict Crisis",
    "teamwork.level2.story.narrative": `⚠️ Welcome to your first merge conflict!

**The Situation:**
You've been working on \`/src/auth/login.js\` this morning. You've improved the password validation to be stricter (minimum 5 chars for username, 10 for password). Great work!

But while you were coding, your teammate Sarah also pushed changes to the SAME FILE! She added email validation logic. Now you both have different versions of the same lines of code.

**Your Mission:**

**1. Check your local changes:** Run \`cat /src/auth/login.js\` to see YOUR improvements (already done, but not committed yet!)

**2. Commit YOUR changes first:**
\` git add /src/auth/login.js
git commit -m "Improve password validation requirements"
\`

**3. Now try to pull Sarah's changes:**
\` git pull origin main \`

**4. 💥 MERGE CONFLICT!** Git can't automatically merge because you and Sarah both modified the same lines! You'll see conflict markers in the file:
\`<<<<<<< HEAD
(your changes)
=======
(Sarah's changes)
>>>>>>> abc1234\`

**5. Resolve the conflict:**
- Edit \`/src/auth/login.js\` to combine the best of both versions
- Remove the conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`)
- Keep both your stricter password length AND Sarah's email validation!

**6. Complete the merge:**
\`git add .
git commit -m "Merge Sarah's email validation with my password improvements"\`

**Pro Tip:** The best resolution often combines both changes! In this case, keep:
- Sarah's email validation logic (\`username.includes('@')\`)
- Your stricter length requirements (\`username.length >= 5\` and \`password.length >= 10\`)

This is completely normal in team development! Merge conflicts happen when multiple developers work on the same code. The key is resolving them thoughtfully.`,
    "teamwork.level2.story.realWorldContext":
        "Merge conflicts are inevitable in team development. Learning to resolve them quickly and correctly is a crucial skill.",
    "teamwork.level2.story.taskIntroduction":
        "Master merge conflict resolution to become a confident team collaborator.",

    "teamwork.level3.name": "Code Review Workflow",
    "teamwork.level3.description": "Learn to participate in code reviews and collaborate through pull requests",
    "teamwork.level3.objective1": "Create a new feature branch",
    "teamwork.level3.objective2": "Stage your completed work",
    "teamwork.level3.objective3": "Commit with a clear message",
    "teamwork.level3.objective4": "Push your branch for team review",
    "teamwork.level3.hint1": "Create a feature branch: git switch -c feature/password-reset",
    "teamwork.level3.hint2": "Alternative (classic): git checkout -b feature/password-reset",
    "teamwork.level3.hint3": "Stage all changes: git add .",
    "teamwork.level3.hint4": 'Commit with a descriptive message: git commit -m "Add password reset functionality"',
    "teamwork.level3.hint5": "Push to remote: git push origin feature/password-reset",
    "teamwork.level3.hint6": "Alternative with shorthand: git push -u origin feature/password-reset",
    "teamwork.level3.hint7":
        "Note: Use the branch name you created (not 'feature/password-reset' if you chose a different name)",
    "teamwork.level3.requirement1.description": "Create a branch for code review demonstration",
    "teamwork.level3.requirement1.success": "Feature branch created! ✨",
    "teamwork.level3.requirement2.description": "Stage your code for review",
    "teamwork.level3.requirement2.success": "Code staged for review! 📦",
    "teamwork.level3.requirement3.description": "Commit with a clear, reviewable message",
    "teamwork.level3.requirement3.success": "Code committed with clear message! 💬",
    "teamwork.level3.requirement4.description": "Push your branch for code review",
    "teamwork.level3.requirement4.success":
        "Code pushed for team review! 🚀 In real teams, you'd now create a Pull Request!",
    "teamwork.level3.story.title": "The Code Review Culture",
    "teamwork.level3.story.narrative": `📝 Welcome to InnovateCorp's Code Review Process!

**The Situation:**
You've just finished implementing the password reset feature. The code works perfectly in your local tests! 🎉

But wait - at InnovateCorp, no code goes to production without a code review. It's not about trust - it's about quality, knowledge sharing, and catching bugs before customers see them.

**Why Code Reviews Matter:**
- **Quality:** Sarah might catch a security issue you missed
- **Knowledge Sharing:** Mike learns from your clever solution
- **Better Code:** Multiple perspectives make better software
- **Team Growth:** Everyone becomes a better developer

**Your Task:**
You need to prepare your password reset feature for team review. Follow the professional workflow:

**Step 1: Create a Feature Branch**
Never work directly on \`main\`! Create a dedicated branch for your feature.

**Step 2: Stage Your Work**
Add your completed files to the staging area.

**Step 3: Commit with a Clear Message**
Write a commit message that explains what you built. Your teammates should understand your changes without reading every line of code.

**Step 4: Push to Remote**
Upload your feature branch so your team can review it. In real teams, you'd then create a Pull Request on GitHub/GitLab.

**Remember:** The key to great code reviews is clear communication. Your branch name, commit messages, and code should tell a story!

Let's get your code ready for the team! 🚀`,
    "teamwork.level3.story.realWorldContext":
        "Code reviews are standard practice in professional development. They improve code quality, catch bugs early, and help teams learn from each other. Most companies use Pull Requests (GitHub) or Merge Requests (GitLab) for this process.",
    "teamwork.level3.story.taskIntroduction":
        "Learn the professional workflow for preparing code for team review through branches, commits, and push operations.",

    // Archaeology Stage
    "archaeology.name": "Git Archaeology",
    "archaeology.description": "Investigate code history and perform Git forensics like a detective",

    // Mastery Stage
    "mastery.name": "Git Mastery",
    "mastery.description": "The ultimate Git challenges for true masters",

    "mastery.level1.name": "Multi-Branch Merge Challenge",
    "mastery.level1.description": "Master complex merges across multiple branches with conflicts",
    "mastery.level1.objective1": "Merge multiple feature branches simultaneously",
    "mastery.level1.objective2": "Resolve complex merge conflicts",
    "mastery.level1.objective3": "Stage the resolved conflicts",
    "mastery.level1.objective4": "Complete the multi-way merge",
    "mastery.level1.hint1": "Use git merge to merge multiple branches at once",
    "mastery.level1.hint2": "Analyze each conflict carefully - they may interact",
    "mastery.level1.hint3": "The best solution often combines elements from all branches",
    "mastery.level1.hint4": "Test your merged code before committing",
    "mastery.level1.requirement1.description": "Merge all feature branches into main",
    "mastery.level1.requirement1.success": "Complex merge initiated! Now resolve the conflicts.",
    "mastery.level1.requirement2.description": "Stage all resolved files",
    "mastery.level1.requirement2.success": "Conflicts resolved and staged!",
    "mastery.level1.requirement3.description": "Complete the merge with a commit",
    "mastery.level1.requirement3.success": "Master-level merge completed! You've conquered multi-way merges!",
    "mastery.level1.story.title": "The Integration Challenge",
    "mastery.level1.story.narrative":
        "Three teams have been working in parallel for the quarterly release. Each team developed critical features on separate branches. Now it's integration day, and you're the lead developer responsible for merging everything together. The challenge: all three branches modified shared utility files. You must merge all branches and resolve the conflicts to create a coherent, working system.",
    "mastery.level1.story.realWorldContext":
        "Complex multi-branch merges are common in large projects with multiple parallel development streams. Mastering this skill is essential for senior developers and technical leads.",
    "mastery.level1.story.taskIntroduction":
        "Merge three feature branches with overlapping changes and resolve all conflicts to create a unified codebase.",

    "mastery.level2.name": "Git Hooks and Automation",
    "mastery.level2.description": "Implement Git hooks to automate workflows and enforce quality standards",
    "mastery.level2.objective1": "Create pre-commit hooks for code quality",
    "mastery.level2.objective2": "Set up post-commit hooks for notifications",
    "mastery.level2.objective3": "Implement server-side hooks",
    "mastery.level2.objective4": "Build automated workflow pipelines",
    "mastery.level2.hint1": "Pre-commit hooks run before commits are created",
    "mastery.level2.hint2": "Post-commit hooks run after successful commits",
    "mastery.level2.hint3": "Use exit codes to prevent commits in pre-commit hooks",
    "mastery.level2.hint4": "Server-side hooks control what can be pushed",
    "mastery.level2.requirement1.description": "Make the pre-commit hook executable",
    "mastery.level2.requirement1.success": "Pre-commit hook activated!",
    "mastery.level2.requirement2.description": "Stage files to test the pre-commit hook",
    "mastery.level2.requirement2.success": "Files staged!",
    "mastery.level2.requirement3.description": "Attempt a commit to trigger the quality checks",
    "mastery.level2.requirement3.success": "Quality checks passed!",
    "mastery.level2.story.title": "The Quality Guardian",
    "mastery.level2.story.narrative": `⚡ You've been promoted to DevOps Engineer, and your first mission is to implement the "Quality Guardian" - an automated system that prevents bad code from entering the repository.

The development team has been growing rapidly, and with growth comes inconsistency:
- Commits without proper testing
- Code style violations
- Secrets accidentally committed
- Broken builds pushed to main

Your team lead, Sarah, explains the vision:

"We need automation to enforce our quality standards. Every commit should be automatically checked for:
- Linting and code style
- Unit test passage
- Security vulnerabilities
- Commit message standards"

"Git hooks are perfect for this. They're scripts that run at specific points in the Git workflow. Think of them as quality gates that code must pass through."

The hook ecosystem:
- pre-commit: Run checks before commits are created
- pre-push: Validate before pushing to remote
- post-commit: Send notifications or trigger builds
- Server-side hooks: Control what can be pushed

Your mission:
1. Implement a pre-commit hook for quality checks
2. Set up automated testing and linting
3. Create notification systems
4. Build a comprehensive quality pipeline

This is infrastructure work that will benefit every developer on your team. You're not just writing code - you're building the foundation for code quality.`,
    "mastery.level2.story.realWorldContext":
        "Git hooks are essential for implementing automated quality assurance and workflow automation in professional development environments.",
    "mastery.level2.story.taskIntroduction":
        "Master Git hooks to build automated quality systems that enforce standards and improve team productivity.",

    "mastery.level3.name": "Git Mastery: The Final Challenge",
    "mastery.level3.description": "Combine all advanced Git techniques to solve a complex real-world scenario",
    "mastery.level3.objective1": "Orchestrate a complex release with multiple hotfixes",
    "mastery.level3.objective2": "Handle emergency rollbacks and recovery",
    "mastery.level3.objective3": "Coordinate with multiple teams simultaneously",
    "mastery.level3.objective4": "Demonstrate mastery of all techniques",
    "mastery.level3.hint1": "This challenge combines everything you've learned",
    "mastery.level3.hint2": "Think strategically about branch management",
    "mastery.level3.hint3": "Communication is as important as technical skills",
    "mastery.level3.hint4": "Document your decisions for the team",
    "mastery.level3.requirement1.description": "Create an emergency rollback branch",
    "mastery.level3.requirement1.success": "Emergency procedures initiated!",
    "mastery.level3.requirement2.description": "Cherry-pick critical fixes",
    "mastery.level3.requirement2.success": "Critical fixes applied!",
    "mastery.level3.requirement3.description": "Tag the emergency release",
    "mastery.level3.requirement3.success": "Emergency release tagged!",
    "mastery.level3.requirement4.description": "Push the emergency release tags",
    "mastery.level3.requirement4.success": "🎉 MASTERY ACHIEVED! You are now a Git Master!",
    "mastery.level3.story.title": "The Ultimate Git Challenge: Black Friday Crisis",
    "mastery.level3.story.narrative": `🚨 BLACK FRIDAY, 2:00 AM - THE ULTIMATE TEST

You are the Senior DevOps Engineer at MegaCorp, and you're facing the perfect storm of Git challenges on the biggest shopping day of the year.

The situation:
- Production is partially broken due to a bad deployment
- Three different teams pushed hotfixes simultaneously
- The payment system is failing intermittently
- Customer support is overwhelmed
- The CEO is asking for hourly updates
- Black Friday traffic is 50x normal levels

Your CTO calls an emergency meeting:

"This is why we hired you. Everything we've built, everything we've learned, comes down to this moment. We need someone who can navigate complex Git operations under extreme pressure."

The challenge involves:
1. **Emergency Rollback**: Quickly revert the problematic deployment
2. **Selective Recovery**: Cherry-pick only the good changes
3. **Hotfix Coordination**: Merge critical fixes from multiple teams
4. **Release Management**: Create and deploy emergency patches
5. **Team Communication**: Coordinate across development, QA, and operations

You must use every Git technique in your arsenal:
- \`git rebase -i\` to clean up messy commits
- \`git cherry-pick <commit-hash>\` to select only working features (copies specific commits from one branch to another)
- Advanced merging with \`git merge\` to combine team efforts
- \`git bisect\` to find the exact problem commit (binary search through history to find bugs)
- \`git reflog\` to recover from mistakes
- \`git tag\` and branches for release management
- \`git mv <old> <new>\` to rename files while preserving Git history

**What is git cherry-pick?**
Cherry-picking allows you to copy specific commits from one branch to another. Instead of merging entire branches, you can pick and choose individual commits. Perfect for applying hotfixes from one branch to another!

Example: \`git cherry-pick abc123\` - applies commit abc123 to your current branch

**What is git bisect?**
Bisect helps you find which commit introduced a bug using binary search. Git will checkout commits for you to test, and you tell it "good" or "bad" until it finds the problematic commit.

Example:
\`git bisect start\`
\`git bisect bad\` (current commit is broken)
\`git bisect good abc123\` (this old commit worked)
Git will then guide you through testing commits until it finds the first bad one!

**What is git mv?**
Move or rename files while keeping Git history intact. Better than manually renaming files because Git tracks the rename.

Example: \`git mv old-name.js new-name.js\`

This isn't just about Git commands - it's about leadership, decision-making under pressure, and the ability to think systematically when everything is on fire.

The company's Black Friday revenue depends on you. Millions of customers are waiting. Your team is looking to you for guidance.

This is your moment. Show them what a Git Master can do.

Ready to prove your mastery? The clock is ticking...`,
    "mastery.level3.story.realWorldContext":
        "Real-world Git mastery involves orchestrating complex operations under pressure, managing multiple stakeholders, and making critical decisions that affect business operations.",
    "mastery.level3.story.taskIntroduction":
        "This is the ultimate Git challenge - combine all your skills to handle a complex, high-pressure emergency scenario.",

    // Archaeology Stage Levels
    "archaeology.level1.name": "Git Blame - Code Archaeology",
    "archaeology.level1.description": "Investigate code history to understand changes and find the origin of bugs",
    "archaeology.level1.objective1": "Find who wrote specific lines",
    "archaeology.level1.objective2": "Track down the history of a bug",
    "archaeology.level1.objective3": "Understand the context of code changes",
    "archaeology.level1.objective4": "Find related commits and changes",
    "archaeology.level1.hint1": "git blame shows who last modified each line",
    "archaeology.level1.hint2": "Use -L option to blame specific line ranges",
    "archaeology.level1.hint3": "Combine blame with log to understand context",
    "archaeology.level1.hint4": "Look for patterns in commit messages",
    "archaeology.level1.requirement1.description": "Investigate who wrote the validation logic",
    "archaeology.level1.requirement1.success": "Code authorship revealed!",
    "archaeology.level1.requirement2.description": "Check recent commit history for context",
    "archaeology.level1.requirement2.success": "Recent history examined!",
    "archaeology.level1.requirement3.description": "Examine the details of a specific commit",
    "archaeology.level1.requirement3.success": "Commit details analyzed!",
    "archaeology.level1.story.title": "The Case of the Mysterious Bug",
    "archaeology.level1.story.narrative":
        "A critical bug in the validation code is affecting 23% of European customers. The code was written by 4 different developers over 18 months. Your senior developer explains: 'Welcome to code archaeology! Git isn't just version control - it's your time machine. Every line has a story.' Use git blame, git log, and git show to investigate the bug and understand why the code was written this way.",
    "archaeology.level1.story.realWorldContext":
        "Code archaeology skills are essential for maintaining large, long-lived codebases with multiple contributors over time.",
    "archaeology.level1.story.taskIntroduction":
        "Learn to investigate code history and track down the source of bugs using Git forensic tools.",

    "archaeology.level2.name": "Commit Forensics with Git Log",
    "archaeology.level2.description": "Master advanced techniques to investigate complex code history",
    "archaeology.level2.objective1": "Use advanced log filtering to find specific changes",
    "archaeology.level2.objective2": "Track file renames and moves",
    "archaeology.level2.objective3": "Find commits by content changes",
    "archaeology.level2.objective4": "Analyze commit patterns and trends",
    "archaeology.level2.hint1": "Use --grep to search commit messages",
    "archaeology.level2.hint2": "Use -S to find when specific text was added/removed",
    "archaeology.level2.hint3": "Use --follow to track files through renames",
    "archaeology.level2.hint4": "Combine filters for powerful searches",
    "archaeology.level2.requirement1.description": "Find all commits related to security",
    "archaeology.level2.requirement1.success": "Security-related commits found!",
    "archaeology.level2.requirement2.description": "Find commits that added or removed 'password' text",
    "archaeology.level2.requirement2.success": "Password-related changes tracked!",
    "archaeology.level2.requirement3.description": "Find all commits by Sarah to understand her contributions",
    "archaeology.level2.requirement3.success": "Sarah's contribution history analyzed!",
    "archaeology.level2.story.title": "The Security Audit Trail",
    "archaeology.level2.story.narrative":
        "Your company received a security audit. The auditors want a complete history of all security-related changes: authentication, password handling, encryption. The codebase has 2,847 commits over 3 years. Your security lead explains Git's search capabilities: --grep for messages, -S for code content, --author for contributors. Build a comprehensive audit trail using advanced git log techniques.",
    "archaeology.level2.story.realWorldContext":
        "Advanced Git log techniques are essential for security audits, code reviews, and understanding complex project histories.",
    "archaeology.level2.story.taskIntroduction":
        "Master advanced Git log techniques for comprehensive code history investigation and forensic analysis.",

    "archaeology.level3.name": "Git Reflog - The Time Machine",
    "archaeology.level3.description": "Use Git reflog to recover lost commits and understand repository state changes",
    "archaeology.level3.objective1": "Understand what reflog tracks",
    "archaeology.level3.objective2": "Recover accidentally deleted commits",
    "archaeology.level3.objective3": "Find lost branch references",
    "archaeology.level3.objective4": "Restore previous repository states",
    "archaeology.level3.hint1": "Reflog tracks all HEAD movements",
    "archaeology.level3.hint2": "Use git reflog to see recent actions",
    "archaeology.level3.hint3": "git reset --hard can use reflog references",
    "archaeology.level3.hint4": "Reflog entries expire after 90 days by default",
    "archaeology.level3.requirement1.description": "Check the reflog to see recent HEAD movements",
    "archaeology.level3.requirement1.success": "Reflog history examined!",
    "archaeology.level3.requirement2.description": "Reset to a previous state using reflog reference",
    "archaeology.level3.requirement2.success": "Repository state restored!",
    "archaeology.level3.requirement3.description": "Create a recovery branch from a reflog entry",
    "archaeology.level3.requirement3.success": "Recovery branch created!",
    "archaeology.level3.story.title": "The Great Git Disaster Recovery",
    "archaeology.level3.story.narrative":
        "It's Friday 4:30 PM. Your teammate Jake panics: 'I accidentally ran git reset --hard and lost two weeks of work! The authentication system, UI components, tests - all gone!' But you remember: Git never forgets. Git reflog tracks every commit, branch switch, merge, and reset. Even 'deleted' commits exist in reflog for 90 days. Your mission: examine the reflog, find the lost commits, and recover Jake's work. Time to be the hero!",
    "archaeology.level3.story.realWorldContext":
        "Git reflog is a powerful recovery tool that can save developers from catastrophic data loss scenarios.",
    "archaeology.level3.story.taskIntroduction":
        "Master Git reflog to become the hero who can recover 'lost' work and save the day for your teammates.",

    // Intro Level 4
    "intro.level4.name": "بررسی تغییرات",
    "intro.level4.description": "دقیقاً ببین چه چیزی در فایل‌هایت تغییر کرده است",
    "intro.level4.objective1": "بفهم کدام فایل‌ها تغییر کرده‌اند",
    "intro.level4.objective2": "تغییرات دقیق را خط به خط بررسی کن",
    "intro.level4.hint1": "از دستور `git status` استفاده کن تا ببینی کدام فایل‌ها تغییر کرده‌اند",
    "intro.level4.hint2": "از دستور `git diff` استفاده کن تا تغییرات دقیق داخل آن فایل‌ها را ببینی",
    "intro.level4.hint3": "می‌توانی با `git diff <file>` فقط یک فایل مشخص را بررسی کنی",
    "intro.level4.requirement1.description": "بررسی کن کدام فایل‌ها تغییر کرده‌اند",
    "intro.level4.requirement1.success": "آفرین! دستور `git status` نشان می‌دهد که src/config.js تغییر کرده است.",
    "intro.level4.requirement2.description": "تغییرات دقیق را با git diff نمایش بده",
    "intro.level4.requirement2.success":
        "عالی! حالا دقیقاً می‌بینی کدام خط‌ها تغییر کرده‌اند، پیش از آن‌که چیزی commit شود.",
    "intro.level4.story.title": "تغییر مرموز",
    "intro.level4.story.narrative":
        "صبح دوشنبه در TechStart. الکس با نگاهی نگران به سمت میز تو می‌آید.\n\n«سارا جمعه قبل از رفتن چیزی را در تنظیمات وب‌سایت تغییر داده - اما الان در مرخصی است و ما امروز نسخهٔ جدید را منتشر می‌کنیم. باید دقیقاً بدانم چه چیزی را تغییر داده است.»\n\nاو توضیح می‌دهد: «دستور `git status` فقط می‌گوید کدام فایل‌ها تغییر کرده‌اند. برای دیدن این‌که چه چیزی داخل آن‌ها تغییر کرده، از `git diff` استفاده می‌کنیم. این دستور فایل‌های در حال کارَت را با آخرین commit مقایسه می‌کند و هر خط اضافه یا حذف‌شده را نشان می‌دهد.»\n\n«اول وضعیت مخزن را بررسی کن و بعد تغییر را با `git diff` ببین. خط‌هایی که با + شروع می‌شوند اضافه شده‌اند و خط‌هایی که با - شروع می‌شوند حذف شده‌اند.»",
    "intro.level4.story.realWorldContext":
        "توسعه‌دهندگان روزانه بارها `git diff` را اجرا می‌کنند - به‌خصوص درست قبل از commit کردن. بازبینی تغییرات خودت پیش از commit راهی است برای پیدا کردن فلگ‌های دیباگ، کدهای تست جامانده و اطلاعات محرمانه، قبل از آن‌که وارد تاریخچهٔ پروژه شوند.",
    "intro.level4.story.taskIntroduction":
        "با `git status` فایل تغییرکرده را پیدا کن و سپس با `git diff` دقیقاً ببین چه چیزی تغییر کرده است.",

    // Files Level 4
    "files.level4.name": "تغییر نام فایل‌ها",
    "files.level4.description": "با Git نام یک فایل را تغییر بده و تاریخچه‌اش را حفظ کن",
    "files.level4.objective1": "با git mv نام src/app-config.js را به src/config.js تغییر بده",
    "files.level4.objective2": "تغییر نام را با یک پیام گویا کامیت کن",
    "files.level4.hint1": "از دستور `git mv <old-name> <new-name>` استفاده کن",
    "files.level4.hint2": "`git mv` در یک مرحله نام فایل را تغییر می‌دهد و تغییر را stage می‌کند",
    "files.level4.hint3": "در پایان با `git commit -m 'پیام تو'` تغییر نام را ثبت کن",
    "files.level4.requirement1.description": "نام فایل را با git mv تغییر بده",
    "files.level4.requirement1.success": "آفرین! Git نام فایل را تغییر داد و تغییر را هم برایت stage کرد.",
    "files.level4.requirement2.description": "تغییر نام را با یک پیام کامیت کن",
    "files.level4.requirement2.success": "عالی! تغییر نام حالا بخشی از تاریخچه پروژه است.",
    "files.level4.story.title": "کدبیس مرتب",
    "files.level4.story.narrative":
        "الکس قبل از بازبینی کد به درخت فایل‌هایت اشاره می‌کند و می‌گوید: «یک نکته دیگر! ما در تیم روی نام‌های کوتاه و یکدست فایل‌ها توافق کرده‌ایم. app-config.js باید به‌سادگی config.js نام داشته باشد.»\n\nو اضافه می‌کند: «فقط در فایل‌منیجر نامش را عوض نکن! به جای آن از `git mv` استفاده کن - این دستور در یک مرحله نام فایل را تغییر می‌دهد و تغییر را stage می‌کند تا Git تاریخچه فایل را حفظ کند.»",
    "files.level4.story.realWorldContext":
        "وقتی پروژه‌ها بزرگ می‌شوند و قراردادهای نام‌گذاری تغییر می‌کنند، تغییر نام فایل‌ها اتفاقی روزمره است. با `git mv`، Git تغییر نام را تمیز ثبت می‌کند، به جای آنکه یک حذف و یک فایل کاملاً جدید ببیند.",
    "files.level4.story.taskIntroduction":
        "با `git mv` نام src/app-config.js را به src/config.js تغییر بده و سپس تغییر را کامیت کن.",

    // Branches Level 6
    "branches.level6.name": "پاک‌سازی برنچ‌ها",
    "branches.level6.description": "برنچ‌های مرج‌شده و کنارگذاشته‌شده را حذف کن تا مخزنت مرتب بماند",
    "branches.level6.objective1": "برنچ مرج‌شده feature/search-filters را حذف کن",
    "branches.level6.objective2": "برنچ کنارگذاشته‌شده experiment/new-ui را با حذف اجباری پاک کن",
    "branches.level6.hint1": "دستور `git branch` را اجرا کن تا ببینی چه برنچ‌هایی هنوز وجود دارند",
    "branches.level6.hint2":
        "از `git branch -d feature/search-filters` استفاده کن - حرف کوچک -d فقط برنچ‌هایی را حذف می‌کند که کاملاً مرج شده‌اند",
    "branches.level6.hint3":
        "گیت حذف برنچ‌های مرج‌نشده را با -d رد می‌کند. برای حذف اجباری از `git branch -D experiment/new-ui` استفاده کن",
    "branches.level6.requirement1.description": "برنچ مرج‌شده feature/search-filters را با git branch -d حذف کن",
    "branches.level6.requirement1.success":
        "آفرین! گیت اجازه حذف را داد، چون همه تغییرات feature/search-filters از قبل در main موجود است.",
    "branches.level6.requirement2.description": "برنچ کنارگذاشته‌شده experiment/new-ui را با git branch -D حذف کن",
    "branches.level6.requirement2.success":
        "عالی! با -D آزمایشِ مرج‌نشده را کنار گذاشتی - فهرست برنچ‌هایت دوباره تمیز شد.",
    "branches.level6.story.title": "خانه‌تکانی در مخزن",
    "branches.level6.story.narrative":
        "الکس در حالی که مخزن را مرور می‌کند می‌گوید: «فهرست برنچ‌های ما دارد شلوغ می‌شود. فیلترهای جستجو از feature/search-filters هفته‌ها پیش در main مرج شدند و experiment/new-ui هم فقط یک نمونه اولیه بود که از آن صرف‌نظر کردیم.»\n\nاو توضیح می‌دهد: «برای برنچ مرج‌شده از `git branch -d` استفاده کن - حرف کوچک -d امن است، چون گیت بررسی می‌کند که چیزی از دست نرود. اما برای آن آزمایش، گیت قبول نمی‌کند، چون کامیت‌هایش هرگز مرج نشده‌اند. حرف بزرگ -D برای همین است: برنچ را حتی با کارِ مرج‌نشده حذف می‌کند - پس فقط وقتی از آن استفاده کن که مطمئن باشی.»",
    "branches.level6.story.realWorldContext":
        "در پروژه‌های واقعی با گذشت زمان ده‌ها برنچ بلااستفاده جمع می‌شود. حذف منظم برنچ‌های مرج‌شده، مخزن را قابل‌پیمایش نگه می‌دارد. حرف کوچک -d پیش‌فرض امن است، چون گیت از کامیت‌های مرج‌نشده محافظت می‌کند، در حالی که -D کار را آگاهانه دور می‌ریزد - کامیت‌ها را اغلب هنوز می‌توان از طریق reflog نجات داد، اما هرگز نباید به آن تکیه کنی.",
    "branches.level6.story.taskIntroduction":
        "ابتدا برنچ مرج‌شده feature/search-filters را با `git branch -d` حذف کن و سپس برنچ کنارگذاشته‌شده experiment/new-ui را با `git branch -D` به‌صورت اجباری پاک کن.",

    // Merge Level 4
    "merge.level4.name": "حل تعارض‌های ادغام",
    "merge.level4.description": "یک تعارض ادغام را دستی حل کن و ادغام را کامل کن",
    "merge.level4.objective1": "با git status بررسی کن کدام فایل دچار تعارض است",
    "merge.level4.objective2": "فایل src/api.js را ویرایش کن، نشانگرهای تعارض را حذف کن و فایل حل‌شده را stage کن",
    "merge.level4.objective3": "ادغام را با یک کامیت کامل کن",
    "merge.level4.hint1": "با `git status` شروع کن تا ببینی کدام فایل‌ها در تعارض هستند",
    "merge.level4.hint2":
        "فایل `src/api.js` را باز کن و نشانگرهای تعارض (`<<<<<<<`، `=======`، `>>>>>>>`) را حذف کن — کدی را که تیم لازم دارد نگه دار و سپس فایل را با `git add .` استیج کن",
    "merge.level4.hint3": "ادغام را با `git commit -m 'Resolve merge conflict'` تمام کن",
    "merge.level4.requirement1.description": "تعارض را با git status بررسی کن",
    "merge.level4.requirement1.success": "خوب! حالا دقیقاً می‌دانی کدام فایل به توجه تو نیاز دارد: src/api.js.",
    "merge.level4.requirement2.description": "فایل حل‌شده را stage کن",
    "merge.level4.requirement2.success": "عالی! فایل حل‌شده استیج شد — هیچ نشانگر تعارضی باقی نمانده است.",
    "merge.level4.requirement3.description": "برای کامل کردن ادغام کامیت کن",
    "merge.level4.requirement3.success": "فوق‌العاده! اولین تعارض ادغامت را مثل یک حرفه‌ای حل کردی.",
    "merge.level4.story.title": "دیگر فرار نمی‌کنیم",
    "merge.level4.story.narrative":
        "سارا با لبخند می‌پرسد: «آن ادغامی را که لغو کردیم یادت هست؟ محدودکنندهٔ نرخ باید امروز منتشر شود — این بار به‌جای عقب‌نشینی، تعارض را حل می‌کنیم.»\n\nاو به صفحه‌ات اشاره می‌کند: «گیت تعارض را مستقیم داخل فایل علامت‌گذاری کرده است. هر چه بین <<<<<<< HEAD و ======= است نسخهٔ ما از main است و هر چه پایین‌تر تا >>>>>>> آمده، از feature/rate-limit می‌آید. کار تو: فایل را ویرایش کن، آنچه را لازم داریم نگه دار و نشانگرها را حذف کن. بعد `git add` و `git commit` — یک ادغام این‌طور تمام می‌شود.»",
    "merge.level4.story.realWorldContext":
        "حل تعارض بخشی از کار روزمرهٔ توسعهٔ تیمی است. مراحل همیشه یکسان است: ۱) فایل دچار تعارض را باز کن، ۲) تصمیم بگیر کدام کد باقی بماند (اغلب ترکیبی از هر دو)، ۳) نشانگرها را حذف کن، ۴) فایل را stage و سپس کامیت کن. ویرایشگرهای مدرن نشانگرها را برایت برجسته می‌کنند، اما در نهایت همین گردش کار پشت آن است.",
    "merge.level4.story.taskIntroduction":
        "ادغام feature/rate-limit در main با یک تعارض در src/api.js متوقف شده است. وضعیت را بررسی کن، تعارض را داخل فایل حل کن، سپس فایل را stage کن و ادغام را با یک کامیت کامل کن.",

    // Rebase Level 5
    "rebase.level5.name": "ریبیس بدون تعویض شاخه",
    "rebase.level5.description":
        "شکل دوآرگومانی git rebase را یاد بگیرید تا یک شاخه را بدون checkout کردن آن ریبیس کنید",
    "rebase.level5.objective1": "شاخه feature/payment-api را با شکل دوآرگومانی git rebase روی main ریبیس کنید",
    "rebase.level5.hint1":
        "می‌توانید دو آرگومان بدهید: `git rebase <upstream> <branch>` — گیت `<branch>` را checkout می‌کند و آن را در یک مرحله روی `<upstream>` ریبیس می‌کند",
    "rebase.level5.hint2":
        "دستور `git rebase main feature/payment-api` را امتحان کنید — لازم نیست اول شاخه را عوض کنید",
    "rebase.level5.requirement1.description": "ریبیس feature/payment-api روی main با شکل دوآرگومانی",
    "rebase.level5.requirement1.success":
        "عالی! feature/payment-api را تنها با یک دستور روی main ریبیس کردید — بدون هیچ تعویض شاخه‌ای.",
    "rebase.level5.story.title": "یک دستور، دو آرگومان",
    "rebase.level5.story.narrative":
        "الکس در حالی که به برد نگاه می‌کند می‌گوید: «امشب نسخهٔ پرداخت‌ها را منتشر می‌کنیم. تو الان روی main هستی و داری ریلیز را بررسی می‌کنی، و شاخهٔ feature/payment-api دوباره عقب افتاده است.»\n\nبا لبخند ادامه می‌دهد: «ترفندی هست که خیلی‌ها از آن بی‌خبرند: git rebase یک آرگومان دوم هم می‌گیرد. به‌جای اینکه اول شاخه را عوض کنی، همان‌جا در دستور به گیت بگو کدام شاخه باید ریبیس شود — گیت خودش آن را checkout می‌کند و یک‌جا روی main بازپخش می‌کند.»",
    "rebase.level5.story.realWorldContext":
        "شکل دوآرگومانی git rebase <upstream> <branch> در کار روزمره میان‌بری کاربردی است: <branch> را checkout می‌کند و در یک مرحله روی <upstream> ریبیس می‌کند. یک checkout اضافه کمتر، و روزهای شلوغ انتشار روان‌تر پیش می‌روند.",
    "rebase.level5.story.taskIntroduction":
        "شما روی main هستید. feature/payment-api را با یک دستور روی main ریبیس کنید: git rebase main feature/payment-api",

    // Remote Level 4
    "remote.level4.name": "ردیابی Upstream با -u",
    "remote.level4.description": "یک بار upstream را تنظیم کن و بعد بدون هیچ آرگومانی push کن",
    "remote.level4.objective1": "شاخه login-form را با ردیابی upstream منتشر کن",
    "remote.level4.objective2": "پیام‌های خطای بهبودیافته را کامیت کن",
    "remote.level4.objective3": "دوباره push کن — این بار بدون هیچ آرگومانی",
    "remote.level4.hint1":
        "اول شاخه را منتشر کن: `git push -u origin login-form`. فلگ `-u` شاخهٔ محلی تو را به شاخهٔ remote متصل می‌کند.",
    "remote.level4.hint2":
        "سپس تغییرات را stage و کامیت کن: اول `git add .` و بعد `git commit -m 'Polish login error messages'`",
    "remote.level4.hint3":
        "چون upstream تنظیم شده، حالا یک `git push` ساده کافی است — نه نام remote لازم است و نه نام شاخه.",
    "remote.level4.requirement1.description": "شاخه login-form را با `git push -u origin login-form` منتشر کن",
    "remote.level4.requirement1.success":
        "شاخه منتشر شد! حالا Git به خاطر می‌سپارد که login-form شاخهٔ origin/login-form را دنبال می‌کند.",
    "remote.level4.requirement2.description": "پیام‌های خطای بهبودیافته در src/login.js را کامیت کن",
    "remote.level4.requirement2.success":
        "عالی! تغییرات نهایی تو به صورت محلی کامیت شد — فقط یک قدم تا رسیدن به تیم مانده.",
    "remote.level4.requirement3.description": "کامیت جدیدت را با یک `git push` ساده ارسال کن",
    "remote.level4.requirement3.success": "فوق‌العاده! یک `git push` ساده کافی بود — این قدرت ردیابی upstream است.",
    "remote.level4.story.title": "یک بار تنظیم کن، همیشه push کن",
    "remote.level4.story.narrative":
        "«فرم ورود فوق‌العاده شده!» الکس این را می‌گوید و با صندلی‌اش به سمت میز تو در TechStart می‌آید. «شاخهٔ `login-form` را منتشر کن تا تیم بتواند بازبینی را شروع کند. و در حق خودت لطفی کن: آن را با `-u` push کن. این فلگ upstream را تنظیم می‌کند — Git به خاطر می‌سپارد که شاخهٔ محلی تو به کدام شاخهٔ remote تعلق دارد.»\n\nاو لبخند می‌زند: «هنوز یک بهبود کامیت‌نشده در `src/login.js` می‌بینم — همان پیام‌های خطای دوستانه‌تر. اول شاخه را منتشر کن، بعد تغییرات نهایی را کامیت کن و دوباره push کن. خوب دقت کن: بار دوم فقط یک `git push` ساده کافی است. نه remote و نه نام شاخه — Git خودش می‌داند کجا باید برود.»",
    "remote.level4.story.realWorldContext":
        "اولین push یک شاخهٔ جدید تقریباً همیشه با `git push -u origin <branch>` انجام می‌شود. وقتی upstream تنظیم شد، `git push` و `git pull` بدون آرگومان کار می‌کنند و `git status` می‌تواند بگوید چند کامیت از remote جلوتر یا عقب‌تر هستی. بدون upstream، Git با خطای معروف «The current branch has no upstream branch» جلوی تو را می‌گیرد.",
    "remote.level4.story.taskIntroduction":
        "شاخه را با `git push -u origin login-form` منتشر کن، سپس پیام‌های خطای بهبودیافته را کامیت کن و آن‌ها را با یک `git push` ساده ارسال کن.",

    // Workflow Level 4
    "workflow.level4.name": "کامیت بی‌نقص: Amend",
    "workflow.level4.description":
        "آخرین کامیت خود را با git commit --amend اصلاح کن، قبل از اینکه کسی متوجه اشتباه شود",
    "workflow.level4.objective1": "فایل پیکربندی فراموش‌شده را stage کن",
    "workflow.level4.objective2": "آخرین کامیت را amend کن تا فایل اضافه شود و پیام اصلاح گردد",
    "workflow.level4.objective3": "کامیت اصلاح‌شده را به ریموت push کن",
    "workflow.level4.hint1":
        "دستور `git status` را اجرا کن — فایل به‌روزشده /src/config.js هرگز stage نشده، پس کامیتِ فیکس تو ناقص است.",
    "workflow.level4.hint2": "فایل جاافتاده را با `git add src/config.js` (یا `git add .`) stage کن.",
    "workflow.level4.hint3":
        "با `git commit --amend -m 'Fix login timeout'` فایل stage‌شده را وارد آخرین کامیت کن و هم‌زمان غلط تایپی پیام را اصلاح کن.",
    "workflow.level4.hint4":
        "این‌جا amend امن است چون کامیت هنوز push نشده. کار را با `git push origin main` تمام کن. هرگز کامیت‌هایی را که قبلاً push شده‌اند amend نکن!",
    "workflow.level4.requirement1.description": "فایل پیکربندی فراموش‌شده را stage کن",
    "workflow.level4.requirement1.success": "فایل stage شد! حالا می‌توان آن را در کامیت قبلی جای داد.",
    "workflow.level4.requirement2.description": "آخرین کامیت را با 'git commit --amend' اصلاح کن",
    "workflow.level4.requirement2.success":
        "کامیت اصلاح شد! یک باگ، یک کامیت تمیز — همراه با فایل پیکربندی و پیامی بدون غلط تایپی.",
    "workflow.level4.requirement3.description": "کامیت اصلاح‌شده را با 'git push origin main' ارسال کن",
    "workflow.level4.requirement3.success":
        "push شد! هیچ‌کس هرگز از آن غلط تایپی باخبر نمی‌شود — تاریخچه‌ات طوری به نظر می‌رسد که انگار از اول همه‌چیز درست بوده.",
    "workflow.level4.story.title": "کامیتِ تقریباً بی‌نقص",
    "workflow.level4.story.narrative":
        'ساعت ۴:۵۵ بعدازظهر جمعه در TechStart است. تازه فیکسِ باگ لاگین-تایم‌اوت را کامیت کرده‌ای و داری کاپشنت را برمی‌داری که Alex، سرپرست تیم، با صندلی‌اش به سمت میز تو می‌آید.\n\n«صبر کن — یک نگاه به آخرین کامیتت بینداز،» Alex می‌گوید و به صفحه اشاره می‌کند.\n\n`git log` پیام کامیتت را نشان می‌دهد: **«Fix login timout»**. آخ، غلط تایپی! و `git status` چیز بدتری را آشکار می‌کند: فایل `src/config.js` — همان فایلی که واقعاً تایم‌اوت نشست را به ۳۰ دقیقه افزایش می‌دهد — هرگز stage نشده است. کامیتِ «فیکس» تو فقط نصف راه‌حل را در خود دارد.\n\n«نگران نباش،» Alex لبخند می‌زند. «هنوز push نکرده‌ای. یعنی می‌توانیم آخرین کامیت را طوری بازنویسی کنیم که انگار هیچ اشتباهی رخ نداده.»\n\n**`git commit --amend` چه می‌کند؟**\nآخرین کامیت تو را با نسخه‌ای اصلاح‌شده جایگزین می‌کند:\n- هر چیزی که الان stage شده باشد به کامیت اضافه می‌شود\n- با `-m` می‌توانی یک پیام کامیت کاملاً جدید بنویسی\n- کامیت قدیمی کنار گذاشته می‌شود — تاریخچه تمیز می‌ماند\n\n**نقشه نجات:**\n1. فایل فراموش‌شده را stage کن: `git add src/config.js`\n2. کامیت را بازنویسی کن: `git commit --amend -m "Fix login timeout"`\n3. تحویل بده: `git push origin main`\n\n**قانون طلایی:** فقط کامیت‌هایی را amend کن که هنوز push نشده‌اند. amend تاریخچه را بازنویسی می‌کند — اگر هم‌تیمی‌ها کامیت قدیمی را pull کرده باشند، در همه کلون‌ها هرج‌ومرج به پا می‌کنی. محلی و push‌نشده؟ پس با خیال راحت amend کن.',
    "workflow.level4.story.realWorldContext":
        "فراموش کردن یک فایل یا غلط تایپی در پیام کامیت برای هر توسعه‌دهنده‌ای پیش می‌آید — هر هفته. `git commit --amend` ابزار روزمره برای تمیز نگه داشتن تاریخچه است: یک تغییر منطقی، یک کامیت مرتب. تیم‌های حرفه‌ای یک قانون آهنین دارند: هرگز کامیتی را که قبلاً push شده amend نکن، چون بازنویسی تاریخچهٔ مشترک، مخزن هم‌تیمی‌هایت را خراب می‌کند.",
    "workflow.level4.story.taskIntroduction":
        "آخرین کامیتت را نجات بده: فایل پیکربندی فراموش‌شده را stage کن، کامیت را با پیام اصلاح‌شده amend کن و تاریخچه‌ای چنان تمیز push کن که هیچ‌کس هرگز متوجه چیزی نشود.",

    // Reset Level 4
    "reset.level4.name": "بازگردانی امن با Revert",
    "reset.level4.description": "یک کامیت عمومی را بدون بازنویسی تاریخچه لغو کنید",
    "reset.level4.objective1": "تاریخچه را بررسی کنید تا کامیت خراب را پیدا کنید",
    "reset.level4.objective2": "آخرین کامیت را به‌صورت امن با revert لغو کنید",
    "reset.level4.hint1": "برای دیدن تاریخچه فشرده از `git log --oneline` استفاده کنید",
    "reset.level4.hint2": "`git revert HEAD` یک کامیت جدید می‌سازد که آخرین کامیت را خنثی می‌کند",
    "reset.level4.hint3":
        "برخلاف `git reset`، دستور revert هرگز تاریخچه‌ای را که هم‌تیمی‌ها گرفته‌اند بازنویسی نمی‌کند",
    "reset.level4.requirement1.description": "تاریخچه فشرده کامیت‌ها را نمایش دهید",
    "reset.level4.requirement1.success": "همان‌جاست — 'Quick fix without review' کامیت خراب در بالای تاریخچه است.",
    "reset.level4.requirement2.description": "آخرین کامیت را لغو کنید",
    "reset.level4.requirement2.success": "عالی! یک کامیت revert جدید تغییر را خنثی کرد — تاریخچه دست‌نخورده ماند.",
    "reset.level4.story.title": "اصلاحی که بازپرداخت‌ها را خراب کرد",
    "reset.level4.story.narrative":
        "وضعیت قرمز! کسی یک «اصلاح سریع» را بدون بازبینی مستقیم روی main پوش کرده — و جریان بازپرداخت را خراب می‌کند.\n\nالکس با عجله می‌آید: «اینجا نمی‌توانیم از `git reset` استفاده کنیم. کامیت عمومی شده و کل تیم آن را pull کرده است. اگر الان تاریخچه را بازنویسی کنیم، مخزن همه خراب می‌شود.\n\n`git revert` دقیقاً برای همین است: یک کامیت جدید می‌سازد که کامیت خراب را خنثی می‌کند. تاریخچه دست‌نخورده می‌ماند و همه هماهنگ می‌مانند.»",
    "reset.level4.story.realWorldContext":
        "روی شاخه‌های مشترک، تیم‌های حرفه‌ای تقریباً همیشه از revert به‌جای reset استفاده می‌کنند. بازنویسی تاریخچه عمومی برای همه کسانی که آن را گرفته‌اند دردسر می‌سازد.",
    "reset.level4.story.taskIntroduction":
        "تاریخچه را با `git log --oneline` بررسی کنید و سپس کامیت خراب را با `git revert HEAD` لغو کنید.",

    // Stash Level 4
    "stash.level4.name": "پشتیبانت را نگه دار: Stash Apply",
    "stash.level4.description": "کار stash‌شده را اعمال کنید و stash را به‌عنوان پشتیبان نگه دارید",
    "stash.level4.objective1": "آزمایش پرریسک خود را stash کنید",
    "stash.level4.objective2": "کار را با apply برگردانید (stash حفظ می‌شود)",
    "stash.level4.objective3": "وقتی به آزمایش اطمینان کردید آن را کامیت کنید",
    "stash.level4.hint1": "`git stash` تغییرات شما را ذخیره می‌کند و فضای کاری تمیزی برایتان می‌گذارد",
    "stash.level4.hint2":
        "`git stash apply` تغییرات را برمی‌گرداند اما برخلاف `git stash pop` یک نسخه در stash نگه می‌دارد",
    "stash.level4.hint3": 'پس از stage کردن با `git add`، با `git commit -m "پیام"` کامیت کنید',
    "stash.level4.requirement1.description": "تغییرات فعلی خود را stash کنید",
    "stash.level4.requirement1.success": "آزمایش با خیال راحت کنار گذاشته شد — فضای کاری شما تمیز است.",
    "stash.level4.requirement2.description": "stash را بدون حذف آن اعمال کنید",
    "stash.level4.requirement2.success": "کار برگشت — و stash هنوز نسخه پشتیبان شما را دارد!",
    "stash.level4.requirement3.description": "آزمایش را کامیت کنید",
    "stash.level4.requirement3.success": "کامیت شد! پشتیبانِ stash شما را از دست دادن کار پرریسک نجات داد.",
    "stash.level4.story.title": "آزمایش پرریسک",
    "stash.level4.story.narrative":
        "شما روی جست‌وجوی فازی آزمایش می‌کنید — امیدوارکننده، اما پرریسک.\n\nالکس پیشنهاد می‌دهد: «قبل از اینکه جلوتر بروی، آن را stash کن. و یک حرکت حرفه‌ای: وقتی برش می‌گردانی از `git stash apply` به‌جای `pop` استفاده کن. Apply تغییرات را برمی‌گرداند اما نسخه‌ای در stash نگه می‌دارد. اگر قدم بعدی‌ات خراب شد، پشتیبانت هنوز آنجاست.»",
    "stash.level4.story.realWorldContext":
        "توسعه‌دهندگان وقتی تور ایمنی می‌خواهند از `apply` به‌جای `pop` استفاده می‌کنند: ورودی stash تا وقتی صراحتاً حذف نشود به‌عنوان پشتیبان می‌ماند.",
    "stash.level4.story.taskIntroduction": "آزمایش را stash کنید، با `git stash apply` برگردانید و سپس کامیت کنید.",

    // Teamwork Level 4
    "teamwork.level4.name": "قبل از ارسال بازبینی کن",
    "teamwork.level4.description": "پیش از کامیت، تغییرات خود را با git diff بازبینی کنید",
    "teamwork.level4.objective1": "تغییرات stage نشده خود را بازبینی کنید",
    "teamwork.level4.objective2": "تغییرات بازبینی‌شده را stage کنید",
    "teamwork.level4.objective3": "آنچه قرار است کامیت شود را دوباره بررسی کنید",
    "teamwork.level4.objective4": "تغییرات بازبینی‌شده را کامیت کنید",
    "teamwork.level4.hint1": "`git diff` تغییراتی را نشان می‌دهد که هنوز stage نشده‌اند",
    "teamwork.level4.hint2": "`git diff --staged` دقیقاً نشان می‌دهد چه چیزی وارد کامیت بعدی می‌شود",
    "teamwork.level4.hint3": "اول بازبینی، بعد `git add`، دوباره بازبینی با `--staged`، سپس کامیت",
    "teamwork.level4.requirement1.description": "تغییرات stage نشده را نمایش دهید",
    "teamwork.level4.requirement1.success": "عادت خوبی است! پیش از stage کردن، diff را بازبینی کردید.",
    "teamwork.level4.requirement2.description": "تغییرات را stage کنید",
    "teamwork.level4.requirement2.success": "تغییرات stage شدند — آماده بررسی نهایی.",
    "teamwork.level4.requirement3.description": "تغییرات stage شده را نمایش دهید",
    "teamwork.level4.requirement3.success": "دقیقاً همین وارد کامیت می‌شود. بدون غافلگیری.",
    "teamwork.level4.requirement4.description": "تغییرات بازبینی‌شده را کامیت کنید",
    "teamwork.level4.requirement4.success": "با اطمینان ارسال شد — دو بار بازبینی، یک بار کامیت!",
    "teamwork.level4.story.title": "عادت خودبازبینی",
    "teamwork.level4.story.narrative":
        "هم‌تیمی شما سارا تازه ضربه خورد: تصادفاً یک خط دیباگ را کامیت کرد و بازبین در pull request آن را پیدا کرد. خجالت‌آور بود.\n\nالکس قانون طلایی تیم را می‌گوید: «diff خودت را قبل از اینکه کس دیگری ببیند بازبینی کن. `git diff` نشان می‌دهد چه تغییری داده‌ای و بعد از stage کردن، `git diff --staged` دقیقاً نشان می‌دهد چه چیزی وارد کامیت می‌شود. دو بررسی سریع که خطوط دیباگ، غلط‌های تایپی و فایل‌های فراموش‌شده را می‌گیرند.»",
    "teamwork.level4.story.realWorldContext":
        "بازبینی diff خود پیش از کامیت یکی از موثرترین عادت‌ها در تیم‌های حرفه‌ای است — خطاها پیش از رسیدن به بازبینی کد گرفته می‌شوند.",
    "teamwork.level4.story.taskIntroduction":
        "با `git diff` بازبینی کنید، با `git add` استیج کنید، با `git diff --staged` تأیید کنید و سپس کامیت کنید.",

    // Advanced Level 4
    "advanced.level4.name": "شکار باگ با Bisect",
    "advanced.level4.description": "کامیتی که برنامه را خراب کرد با جست‌وجوی دودویی پیدا کنید",
    "advanced.level4.objective1": "یک جلسه bisect شروع کنید",
    "advanced.level4.objective2": "نسخه خراب و نسخه سالم را علامت‌گذاری کنید",
    "advanced.level4.objective3": "جلسه bisect را پایان دهید",
    "advanced.level4.hint1": "`git bisect start` جست‌وجوی دودویی در تاریخچه را آغاز می‌کند",
    "advanced.level4.hint2":
        "وضعیت خراب فعلی را با `git bisect bad` و سپس یک کامیت سالم را با `git bisect good` علامت بزنید",
    "advanced.level4.hint3": "در پایان، `git bisect reset` شما را به نقطه شروع برمی‌گرداند",
    "advanced.level4.requirement1.description": "Bisect را شروع کنید",
    "advanced.level4.requirement1.success": "جلسه bisect شروع شد — Git آماده است مقصر را محاصره کند.",
    "advanced.level4.requirement2.description": "کامیت فعلی را خراب علامت بزنید",
    "advanced.level4.requirement2.success": "نسخه فعلی به‌عنوان خراب علامت خورد.",
    "advanced.level4.requirement3.description": "یک کامیت سالم را خوب علامت بزنید",
    "advanced.level4.requirement3.success": "حالا Git بازه خوب/خراب را می‌داند و می‌تواند بینشان دودویی جست‌وجو کند!",
    "advanced.level4.requirement4.description": "جلسه bisect را پایان دهید",
    "advanced.level4.requirement4.success": "جلسه بسته شد — مقصر را در زمان لگاریتمی پیدا کردید!",
    "advanced.level4.story.title": "سوزن در انبار کاه",
    "advanced.level4.story.narrative":
        "جست‌وجو در محیط production خراب است — اما هفته پیش خوب کار می‌کرد و ده‌ها کامیت بینشان است.\n\nالکس لبخند می‌زند: «بررسی دستی هر کامیت ساعت‌ها طول می‌کشد. `git bisect` جست‌وجوی دودویی می‌کند: یک کامیت خراب و یک کامیت سالم به آن بده، و مدام وسط بازه را چک می‌کند تا دقیقاً کامیتی که همه‌چیز را خراب کرد پیدا شود. بیست کامیت؟ فقط حدود پنج بررسی.»",
    "advanced.level4.story.realWorldContext":
        "git bisect سریع‌ترین راه یافتن رگرسیون در تاریخچه‌های بزرگ است. با ۱۰۰۰ کامیت، جست‌وجوی دودویی فقط حدود ۱۰ گام تا مقصر نیاز دارد.",
    "advanced.level4.story.taskIntroduction":
        "با `git bisect start` شروع کنید، نسخه‌ها را با `bad` و `good` علامت بزنید و با `git bisect reset` تمام کنید.",

    // Archaeology Level 4
    "archaeology.level4.name": "نجات فضای کاری",
    "archaeology.level4.description": "تغییرات تصادفی را با git restore لغو کنید",
    "archaeology.level4.objective1": "تغییر config که تصادفی stage شده را از staging خارج کنید",
    "archaeology.level4.objective2": "تغییرات به‌هم‌ریخته فایل یادداشت‌ها را دور بریزید",
    "archaeology.level4.hint1":
        "`git restore --staged config.js` فایل را بدون از دست دادن تغییراتش از staging خارج می‌کند",
    "archaeology.level4.hint2":
        "`git restore notes.md` تغییرات فضای کاری را دور می‌ریزد و نسخه کامیت‌شده را برمی‌گرداند",
    "archaeology.level4.hint3": "هر زمان با `git status` ببینید چه چیزی stage شده و چه چیزی تغییر کرده",
    "archaeology.level4.requirement1.description": "فایل config را از staging خارج کنید",
    "archaeology.level4.requirement1.success": "آدرس لوکال از staging خارج شد — بحران رفع شد.",
    "archaeology.level4.requirement2.description": "فایل یادداشت‌ها را به وضعیت کامیت‌شده برگردانید",
    "archaeology.level4.requirement2.success": "شاهکار گربه پاک شد — یادداشت‌ها به نسخه کامیت‌شده برگشتند.",
    "archaeology.level4.story.title": "ماجرای گربه و صفحه‌کلید",
    "archaeology.level4.story.narrative":
        "دو فاجعه پشت سر هم: اول تصادفاً تغییری در config را stage کردی که برنامه را به localhost وصل می‌کند — این هرگز نباید کامیت شود. بعد گربه‌ات از روی صفحه‌کلید رد شد و یادداشت‌های اسپرینت را به هم ریخت.\n\nالکس می‌خندد: «برای همه پیش می‌آید. `git restore --staged` فایل را از staging بیرون می‌کشد و `git restore` ساده تغییرات فضای کاری را دور می‌ریزد و آخرین نسخه کامیت‌شده را برمی‌گرداند. دو نجات متفاوت، یک دستور.»",
    "archaeology.level4.story.realWorldContext":
        "git restore جایگزین مدرن و امن‌تر دستورهای قدیمی 'git checkout -- file' و 'git reset HEAD file' برای خارج کردن از staging و دور ریختن تغییرات است.",
    "archaeology.level4.story.taskIntroduction":
        "config.js را با `git restore --staged config.js` از staging خارج کنید، سپس تغییرات notes.md را با `git restore notes.md` دور بریزید.",

    // Mastery Level 4
    "mastery.level4.name": "انتشار بی‌نقص",
    "mastery.level4.description": "آخرین کامیت را با --amend اصلاح و انتشار را tag کنید",
    "mastery.level4.objective1": "یادداشت‌های انتشار فراموش‌شده را stage کنید",
    "mastery.level4.objective2": "با amend آن‌ها را به کامیت انتشار اضافه کنید",
    "mastery.level4.objective3": "انتشار نهایی را tag بزنید",
    "mastery.level4.hint1": "فایل فراموش‌شده را با `git add .` استیج کنید",
    "mastery.level4.hint2": '`git commit --amend -m "پیام"` تغییرات stage شده را در کامیت قبلی ادغام می‌کند',
    "mastery.level4.hint3": 'با `git tag -a v3.0.0 -m "Release 3.0.0"` یک tag توضیح‌دار بسازید',
    "mastery.level4.requirement1.description": "یادداشت‌های انتشار را stage کنید",
    "mastery.level4.requirement1.success": "یادداشت‌های انتشار stage شدند — آماده پیوستن به کامیت انتشار.",
    "mastery.level4.requirement2.description": "کامیت قبلی را amend کنید",
    "mastery.level4.requirement2.success": "کامیت انتشار حالا یادداشت‌ها را دارد — انگار هرگز فراموش نشده بودند.",
    "mastery.level4.requirement3.description": "یک tag توضیح‌دار برای انتشار بسازید",
    "mastery.level4.requirement3.success": "v3.0.0 تگ خورد — یک انتشار بی‌نقص. شما واقعاً به Git مسلط شدید!",
    "mastery.level4.story.title": "یک کامیت برای فرمانروایی بر انتشار",
    "mastery.level4.story.narrative":
        "روز انتشار! کامیت 'Prepare release v3.0.0' را ثبت کردی — و بعد فایل یادداشت‌های انتشار را می‌بینی: stage نشده و فراموش‌شده. یک کامیت دومِ «اوه، یادداشت‌ها یادم رفت» در تاریخچه شلخته به نظر می‌رسد.\n\nالکس با رضایت سر تکان می‌دهد: «تا وقتی کامیت push نشده، از `git commit --amend` استفاده کن. تغییرات stage شده را طوری در کامیت قبلی ادغام می‌کند که انگار همیشه آنجا بوده‌اند. بعد با یک tag توضیح‌دار تاجش را بگذار.»",
    "mastery.level4.story.realWorldContext":
        "amend کردن کامیت‌های push نشده تاریخچه را تمیز و آگاهانه نگه می‌دارد. همراه با tagهای توضیح‌دار، این روش حرفه‌ای‌ها برای انتشارهای مرتب و مستند است.",
    "mastery.level4.story.taskIntroduction":
        "یادداشت‌ها را با `git add .` استیج کنید، با `git commit --amend` ادغام کنید و با `git tag -a` تگ بزنید.",
};

export default levels;
