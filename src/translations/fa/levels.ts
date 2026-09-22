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
    "branches.level2.requirement1.description":
        "با استفاده از git switch -c یک شاخه جدید ایجاد کرده و به آن جابجا شوید",
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
    "branches.level5.requirement1.description":
        "با استفاده از git switch -c یک شاخه جدید ایجاد کرده و به آن جابجا شوید",
    "branches.level5.requirement1.success": "عالی! حالا بر هر دو روش ایجاد شاخه مسلط هستید.",
    "branches.level5.story.title": "ایجاد سریع شاخه",
    "branches.level5.story.narrative":
        "\"یک ترفند کاربردی دیگر،\" Sarah می‌گوید. \"می‌توانید از 'git switch -c' برای ایجاد یک شاخه جدید و جابجایی همزمان به آن استفاده کنید.\"\n\nاو توضیح می‌دهد: \"این روش مدرن در Git است. پرچم -c مخفف 'create' است و دقیقاً همان کاری را انجام می‌دهد که 'git checkout -b' قدیمی‌تر انجام می‌داد، اما واضح‌تر و شهودی‌تر است.\"",
    "branches.level5.story.realWorldContext":
        "الگوی switch -c روش مدرن و توصیه‌شده برای ایجاد و جابجایی بین شاخه‌هاست. این روش در Git 2.23 معرفی شد تا عملیات مربوط به شاخه را از سایر عملکردهای checkout جدا کرده و شهودی‌تر کند.",
    "branches.level5.story.taskIntroduction":
        "با استفاده از git switch -c یک شاخه جدید ایجاد کنید و به‌طور خودکار به آن جابجا شوید.",

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
    "remote.level3.story.taskIntroduction":
        "شاخه ویژگی خود را به مخزن راه‌دور پوش کنید تا دیگران بتوانند آن را ببینند.",

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
    "rebase.level1.hint2":
        "این کار تاریخچه را بازنویسی می‌کند و کامیت‌های شما را روی آخرین کامیت‌های main اعمال می‌کند",
    "rebase.level1.hint3": "از 'git log --oneline' برای دیدن تاریخچه کامیت‌ها بعد از ریبیس استفاده کنید",
    "rebase.level1.requirement1.description": "روی شاخه دیگری ریبیس کنید",
    "rebase.level1.requirement1.success": "کار خوبی بود! شما با موفقیت شاخه را ریبیس کردید.",
    "rebase.level1.story.title": "ایجاد تاریخچه‌ای تمیز",
    "rebase.level1.story.narrative":
        '"می‌بینم دارید با ادغام راحت می‌شوید،" Sarah می‌گوید. "حالا بیایید یک رویکرد متفاوت برای یکپارچه‌سازی تغییرات را بررسی کنیم: ریبیس کردن."\n\nاو توضیح می‌دهد: "در حالی که ادغام تاریخچه‌ها را ترکیب می‌کند، ریبیس آن را بازنویسی می‌کند و کامیت‌های شما را طوری جابجا می‌کند که بعد از کامیت‌های شاخه دیگر ظاهر شوند. این کار یک تاریخچه خطی‌تر و تمیزتر ایجاد می‌کند."',
    "rebase.level1.story.realWorldContext":
        "ریبیس کردن معمولاً زمانی ترجیح داده می‌شود که بخواهید تاریخچه پروژه‌ای تمیز و خطی داشته باشید. بسیاری از تیم‌ها از آن برای یکپارچه‌سازی شاخه‌های ویژگی پیش از ادغام آن‌ها در شاخه main استفاده می‌کنند.",
    "rebase.level1.story.taskIntroduction":
        "شما روی شاخه feature هستید. آن را با استفاده از git rebase main روی main ریبیس کنید",

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
    "rebase.level2.story.taskIntroduction":
        "تمرین کنید که یک عملیات ریبیس را با استفاده از git rebase --abort لغو کنید.",

    // Rebase Level 3
    "rebase.level3.name": "ریبیس تعاملی",
    "rebase.level3.description": "یاد بگیرید چگونه از ریبیس تعاملی برای تغییر تاریخچه کامیت‌ها استفاده کنید",
    "rebase.level3.objective1": "یک نشست ریبیس تعاملی را شروع کنید",
    "rebase.level3.hint1": "از دستور `git rebase -i` استفاده کنید",
    "rebase.level3.hint2":
        "ریبیس تعاملی به شما اجازه می‌دهد کامیت‌ها را دوباره مرتب کنید، ویرایش کنید، ادغام (squash) کنید یا حذف کنید",
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
    "advanced.name": "تکنیک‌های پیشرفته Git",
    "advanced.description": "بر ویژگی‌ها و گردش‌کارهای پیشرفته Git مسلط شوید",

    // Advanced Level 1: Git Tags
    "advanced.level1.name": "برچسب‌گذاری نسخه",
    "advanced.level1.description": "یاد بگیرید چگونه نقاط مهم تاریخچه را با تگ مشخص کنید",
    "advanced.level1.objective1": "یک تگ حاشیه‌دار (annotated) برای یک انتشار ایجاد کنید",
    "advanced.level1.objective2": "تمام تگ‌های مخزن را فهرست کنید",
    "advanced.level1.objective3": "تگ‌ها را به مخزن راه‌دور پوش کنید",
    "advanced.level1.hint1": "یک تگ حاشیه‌دار بسازید با: git tag -a v1.0.1 -m 'Bug fix release'",
    "advanced.level1.hint2": "تمام تگ‌ها را با git tag فهرست کنید",
    "advanced.level1.hint3": "تگ‌های حاشیه‌دار شامل اطلاعات نویسنده و یک پیام هستند",
    "advanced.level1.hint4": "تگ‌ها برای مشخص کردن نقاط انتشار استفاده می‌شوند (v1.0، v2.0 و غیره)",
    "advanced.level1.requirement1.description": "یک تگ نسخه ایجاد کنید",
    "advanced.level1.requirement1.success": "عالی! شما این کامیت را به‌عنوان یک نقطه انتشار تگ زدید.",
    "advanced.level1.requirement2.description": "تمام تگ‌ها را فهرست کنید تا تگ جدید خود را ببینید",
    "advanced.level1.requirement2.success": "عالی! می‌توانید تمام تگ‌های مخزن را ببینید.",
    "advanced.level1.requirement3.description": "تگ‌ها را به مخزن راه‌دور پوش کنید",
    "advanced.level1.requirement3.success": "عالی! تگ‌های شما اکنون برای تیم در دسترس هستند.",
    "advanced.level1.story.title": "مشخص کردن نقاط عطف",
    "advanced.level1.story.narrative":
        '"ما در حال استقرار نسخه 1.0 در تولید هستیم،" سرپرست تیم شما اعلام می‌کند. "قبل از اینکه این کار را انجام دهیم، باید این کامیت را تگ بزنیم. تگ‌ها مثل نشانک‌ها در تاریخچه Git شما هستند - نقاط مهمی مانند انتشارها را مشخص می‌کنند."\n\nاو ادامه می‌دهد: "برخلاف شاخه‌ها که با کامیت‌های جدید حرکت می‌کنند، تگ‌ها ثابت می‌مانند. این یعنی همیشه می‌توانیم دقیقاً به همان چیزی که در v1.0 منتشر کردیم برگردیم، حتی سال‌ها بعد."\n\n"در تیم‌های حرفه‌ای، هر انتشار تولید تگ می‌خورد. این کار برای دیباگ کردن، بازگشت به نسخه قبلی و changelogها ضروری است."',
    "advanced.level1.story.realWorldContext":
        "تگ‌ها استاندارد صنعتی برای مشخص کردن انتشارها هستند. آن‌ها نسخه‌گذاری معنایی (v1.0.0) را ممکن می‌سازند، بازگشت به نسخه قبلی را امن می‌کنند و به تیم‌ها کمک می‌کنند درباره نسخه‌های خاص ارتباط برقرار کنند.",
    "advanced.level1.story.taskIntroduction":
        "یک تگ حاشیه‌دار بسازید تا این انتشار را مشخص کند: git tag -a v1.0.1 -m 'Bug fix release'",

    // Advanced Level 2: Git Log Advanced
    "advanced.level2.name": "تاریخچه کامیت پیشرفته",
    "advanced.level2.description": "بر تکنیک‌های پیشرفته کاوش در تاریخچه مخزن مسلط شوید",
    "advanced.level2.objective1": "تاریخچه فشرده کامیت‌ها را مشاهده کنید",
    "advanced.level2.objective2": "کامیت‌ها را بر اساس نویسنده یا تاریخ فیلتر کنید",
    "advanced.level2.objective3": "پیام‌های کامیت را جستجو کنید",
    "advanced.level2.hint1": "تاریخچه کامیت تک‌خطی را با git log --oneline ببینید",
    "advanced.level2.hint2": "تاریخچه کامیت را با گراف نشان دهید: git log --graph --oneline",
    "advanced.level2.hint3": "محدود به N کامیت آخر: git log --oneline -n 5",
    "advanced.level2.hint4": "در پیام‌های کامیت جستجو کنید: git log --grep='fix'",
    "advanced.level2.requirement1.description": "تاریخچه فشرده کامیت را مشاهده کنید",
    "advanced.level2.requirement1.success": "عالی! شما تاریخچه کامیت را کاوش کردید.",
    "advanced.level2.requirement2.description": "کامیت‌ها را بر اساس نویسنده فیلتر کنید",
    "advanced.level2.requirement2.success": "عالی! حالا می‌توانید کامیت‌های نویسندگان خاص را پیدا کنید.",
    "advanced.level2.requirement3.description": "پیام‌های کامیت را برای متن خاصی جستجو کنید",
    "advanced.level2.requirement3.success": "عالی! حالا می‌توانید در پیام‌های کامیت جستجو کنید.",
    "advanced.level2.story.title": "کاوش در تاریخچه",
    "advanced.level2.story.narrative":
        '"یک باگ جایی در 50 کامیت آخر وارد شده،" همکار شما با ناراحتی می‌گوید. "چطور پیدایش کنم؟"\n\nتوسعه‌دهنده ارشد شما لبخند می‌زند: "git log ابزار کارآگاهی توست. فرمت پیش‌فرض همه‌چیز را نشان می‌دهد، اما این می‌تواند طاقت‌فرسا باشد. بگذار ابزارهای قدرتمند را نشانت بدهم."\n\n"git log --oneline هر کامیت را در یک خط نشان می‌دهد - عالی برای مرور سریع. --graph را اضافه کن تا ساختار شاخه‌ها را ببینی. از --grep برای جستجوی پیام‌های کامیت استفاده کن. این مهارت‌ها تو را از یک کاربر Git به یک کارآگاه Git تبدیل می‌کنند."',
    "advanced.level2.story.realWorldContext":
        "تسلط بر git log برای دیباگ کردن، باستان‌شناسی کد و درک تکامل پروژه ضروری است. توسعه‌دهندگان حرفه‌ای این پرچم‌ها را روزانه استفاده می‌کنند.",
    "advanced.level2.story.taskIntroduction": "تاریخچه کامیت را با استفاده از git log --oneline کاوش کنید",

    // Advanced Level 3: Git Show
    "advanced.level3.name": "بررسی کامیت‌ها",
    "advanced.level3.description": "یاد بگیرید چگونه کامیت‌های مشخص را با جزئیات بررسی کنید",
    "advanced.level3.objective1": "با استفاده از هش آن، یک کامیت مشخص را بررسی کنید",
    "advanced.level3.hint1": "ابتدا از 'git log --oneline' برای پیدا کردن یک هش کامیت استفاده کنید",
    "advanced.level3.hint2": "یک کامیت مشخص را نشان دهید: git show <commit-hash>",
    "advanced.level3.hint3": "git show پیام کامیت، نویسنده، تاریخ و تفاوت تغییرات فایل را نمایش می‌دهد",
    "advanced.level3.requirement1.description": "با استفاده از هش آن، یک کامیت را بررسی کنید",
    "advanced.level3.requirement1.success": "عالی! شما جزئیات کامیت و تغییرات فایل را بررسی کردید.",
    "advanced.level3.story.title": "پزشکی قانونی کامیت",
    "advanced.level3.story.narrative":
        '"این کامیت یک چیزی را خراب کرد، اما نمی‌توانم بفهمم چه چیزی تغییر کرده،" هم‌تیمی شما می‌گوید.\n\n"از git show استفاده کن!" با اطمینان پاسخ می‌دهید. "این دستور همه‌چیز را درباره یک کامیت نشان می‌دهد: پیام، چه کسی آن را ساخته، چه زمانی، و از همه مهم‌تر - تغییرات واقعی کد."\n\n"مثل یک ذره‌بین برای کامیت‌هاست. برای بازبینی کد، دیباگ کردن و فهمیدن اینکه همکاران چه چیزی را تغییر داده‌اند ضروری است."',
    "advanced.level3.story.realWorldContext":
        "git show ابزاری بنیادین برای بازبینی کد و دیباگ کردن است. به‌طور مداوم در pull requestها و هنگام بررسی مشکلات استفاده می‌شود.",
    "advanced.level3.story.taskIntroduction": "آخرین کامیت را با استفاده از git show بررسی کنید",

    // Workflow Stage
    "workflow.name": "گردش‌کارهای Git",
    "workflow.description": "بر گردش‌کارهای حرفه‌ای Git و الگوهای همکاری مسلط شوید",

    "workflow.level1.name": "گردش‌کار شاخه ویژگی",
    "workflow.level1.description":
        "گردش‌کار استاندارد صنعتی شاخه ویژگی که در سراسر جهان توسط تیم‌ها استفاده می‌شود را بیاموزید",
    "workflow.level1.objective1": "یک شاخه ویژگی از main ایجاد کنید",
    "workflow.level1.objective2": "کامیت‌هایی با پیام‌های توصیفی بسازید",
    "workflow.level1.objective3": "شاخه ویژگی خود را به remote پوش کنید",
    "workflow.level1.objective4": "به شاخه main بازگردید",
    "workflow.level1.objective5": "شاخه ویژگی خود را دوباره در main ادغام کنید",
    "workflow.level1.objective6": "گردش‌کار شاخه ویژگی را کامل کنید",
    "workflow.level1.hint1": "با ایجاد یک شاخه ویژگی شروع کنید: 'git switch -c feature/user-auth'",
    "workflow.level1.hint2": "فایل auth.js را تغییر دهید، سپس از 'git add' برای استیج کردن تغییرات خود استفاده کنید",
    "workflow.level1.hint3": "کامیت کنید با: 'git commit'",
    "workflow.level1.hint4": "به remote پوش کنید: 'git push origin feature/user-auth'",
    "workflow.level1.hint5": "به main بازگردید: 'git switch main'",
    "workflow.level1.hint6": "در نهایت ادغام کنید: 'git merge feature/user-auth'",
    "workflow.level1.requirement1.description": "یک شاخه ویژگی جدید با 'git switch -c <branch>' ایجاد کنید",
    "workflow.level1.requirement1.success": "شاخه ویژگی با موفقیت ایجاد شد!",
    "workflow.level1.requirement2.description": "تغییرات خود را استیج کنید (ابتدا یک فایل را تغییر دهید!)",
    "workflow.level1.requirement2.success": "تغییرات استیج شدند!",
    "workflow.level1.requirement3.description": "تغییرات خود را با یک پیام توصیفی کامیت کنید",
    "workflow.level1.requirement3.success": "تغییرات کامیت شدند!",
    "workflow.level1.requirement4.description": "شاخه ویژگی خود را به remote پوش کنید (git push origin <your-branch>)",
    "workflow.level1.requirement4.success": "شاخه ویژگی به remote پوش شد!",
    "workflow.level1.requirement5.description": "با 'git switch main' به شاخه main بازگردید",
    "workflow.level1.requirement5.success": "به شاخه main جابجا شدید!",
    "workflow.level1.requirement6.description": "شاخه ویژگی خود را در main ادغام کنید",
    "workflow.level1.requirement6.success":
        "ویژگی با موفقیت ادغام شد! این‌گونه است که تیم‌های واقعی ویژگی‌های جدید را یکپارچه می‌کنند.",
    "workflow.level1.story.title": "کارخانه ویژگی",
    "workflow.level1.story.narrative": `شما یک توسعه‌دهنده در TechCorp هستید، و تیم از گردش‌کارهای سخت‌گیرانه Git پیروی می‌کند. مدیر شما Sarah به‌تازگی یک ویژگی جدید به شما محول کرده: پیاده‌سازی احراز هویت کاربر.

"یادت باشد،" Sarah می‌گوید، "ما هرگز مستقیماً در main کامیت نمی‌کنیم. همیشه از شاخه‌های ویژگی استفاده کن، و مطمئن شو کامیت‌هایت یک داستان را روایت می‌کنند."

**شاخه ویژگی چیست؟**
شاخه ویژگی یک شاخه جداگانه است که در آن یک ویژگی جدید را به‌صورت مجزا توسعه می‌دهید. این کار به شما اجازه می‌دهد:
- بدون تأثیر بر شاخه پایدار main کار کنید
- کد خود را پیش از ادغام بازبینی کنید
- به‌راحتی کار را رها یا تغییر دهید بدون تأثیر بر دیگران

**گردش‌کار کامل:**
1. یک شاخه ویژگی از main ایجاد کنید: \`git switch -c feature/user-auth\`
2. فایل‌ها را تغییر دهید و با \`git add\` استیج کنید
3. تغییرات را با پیام‌های توصیفی کامیت کنید
4. شاخه خود را به remote پوش کنید: \`git push origin feature/user-auth\`
5. به main بازگردید: \`git switch main\`
6. ویژگی را ادغام کنید: \`git merge feature/user-auth\`

**Pull Requestها (PR) چه هستند؟**
در تیم‌های واقعی، بعد از مرحله 4 (پوش کردن شاخه)، به‌جای ادغام مستقیم یک **Pull Request** روی GitHub/GitLab ایجاد می‌کنید:

**گردش‌کار Pull Request:**
1. شاخه ویژگی خود را به مخزن راه‌دور پوش می‌کنید
2. روی GitHub/GitLab، یک Pull Request از \`feature/user-auth\` به \`main\` باز می‌کنید
3. هم‌تیمی‌های شما یک اعلان دریافت می‌کنند
4. آن‌ها کد شما را بازبینی می‌کنند، نظر می‌گذارند و پیشنهاد بهبود می‌دهند
5. بر اساس بازخورد تغییراتی اعمال کرده و دوباره پوش می‌کنید
6. پس از تأیید، کسی PR را در main ادغام می‌کند
7. ویژگی شما اکنون بخشی از کدبیس اصلی است!

**چرا Pull Requestها اهمیت دارند:**
- **کیفیت کد**: چند نگاه مختلف باگ‌ها را پیدا کرده و پیشنهاد بهبود می‌دهند
- **اشتراک دانش**: تیم پیش از انتشار تغییرات، از آن‌ها مطلع می‌شود
- **مستندسازی**: توضیحات PR دلیل تغییرات را شرح می‌دهند
- **بحث**: تصمیمات پیچیده بحث و ثبت می‌شوند
- **ایمنی**: از رسیدن کد خراب به تولید جلوگیری می‌کند

در این سطح، ما با پوش و ادغام مستقیم گردش‌کار را شبیه‌سازی می‌کنیم تا دستورات Git را یاد بگیرید. در پروژه‌های واقعی، همیشه از Pull Requestها برای همکاری تیمی استفاده می‌کنید!`,
    "workflow.level1.story.realWorldContext":
        "گردش‌کار شاخه ویژگی استاندارد صنعتی است. توسعه‌دهندگان شاخه‌های مجزا ایجاد می‌کنند، آن‌ها را به مخازن راه‌دور (GitHub/GitLab) پوش می‌کنند، برای بازبینی کد Pull Request ایجاد می‌کنند و پس از تأیید ادغام می‌کنند. این رویکرد مشارکتی از رسیدن کد ناپایدار به تولید جلوگیری می‌کند و کیفیت کد را از طریق بازبینی همتا بهبود می‌بخشد.",
    "workflow.level1.story.taskIntroduction":
        "بر گردش‌کار کامل شاخه ویژگی مسلط شوید: ایجاد، کامیت، پوش و ادغام. این‌گونه است که تیم‌های حرفه‌ای هر روز ویژگی‌ها را منتشر می‌کنند.",

    "workflow.level2.name": "گردش‌کار Hotfix",
    "workflow.level2.description": "رفع فوری مشکلات تولید را با گردش‌کار hotfix مدیریت کنید",
    "workflow.level2.objective1": "یک شاخه hotfix از main ایجاد کنید",
    "workflow.level2.objective2": "رفع مشکل را استیج و کامیت کنید",
    "workflow.level2.objective3": "به main بازگردید",
    "workflow.level2.objective4": "شاخه hotfix را ادغام کنید",
    "workflow.level2.hint1": "Hotfixها مستقیماً از main/master شاخه می‌گیرند",
    "workflow.level2.hint2": "از نام‌های توصیفی hotfix مانند 'hotfix/critical-security-patch' استفاده کنید",
    "workflow.level2.hint3": "Hotfixها باید به هر دو شاخه main و develop ادغام شوند",
    "workflow.level2.hint4": "همیشه انتشارهای hotfix را برای پیگیری تگ بزنید",
    "workflow.level2.requirement1.description": "یک شاخه hotfix برای مشکل امنیتی ایجاد کنید",
    "workflow.level2.requirement1.success": "شاخه hotfix ایجاد شد!",
    "workflow.level2.requirement2.description": "رفع مشکلات امنیتی خود را استیج کنید",
    "workflow.level2.requirement2.success": "رفع مشکلات امنیتی استیج شد!",
    "workflow.level2.requirement3.description": "پچ امنیتی حیاتی را کامیت کنید",
    "workflow.level2.requirement3.success": "پچ امنیتی کامیت شد!",
    "workflow.level2.requirement4.description": "به شاخه main بازگردید",
    "workflow.level2.requirement4.success": "به شاخه main جابجا شدید!",
    "workflow.level2.requirement5.description": "hotfix را در main ادغام کنید",
    "workflow.level2.requirement5.success": "Hotfix با موفقیت ادغام شد!",
    "workflow.level2.story.title": "کد قرمز: وضعیت اضطراری تولید",
    "workflow.level2.story.narrative": `🚨 فوری: تولید از کار افتاده! 🚨

ساعت 2:47 بامداد، گوشی شما با اعلان‌ها می‌لرزد. سیستم پرداخت خراب شده و مشتریان نمی‌توانند خریدشان را تکمیل کنند. سیستم پیگیری باگ نشان می‌دهد یک آسیب‌پذیری امنیتی حیاتی در آخرین انتشار وارد شده است.

به‌عنوان توسعه‌دهنده کشیک، باید:
1. بلافاصله یک شاخه hotfix ایجاد کنید: \`git switch -c hotfix/security-patch\`
2. مشکل امنیتی حیاتی را در کد رفع کنید
3. رفع مشکلات خود را استیج و کامیت کنید
4. به main بازگردید: \`git switch main\`
5. hotfix را ادغام کنید: \`git merge hotfix/security-patch\`

هر دقیقه برای شرکت هزاران دلار هزینه دارد. همین چیزی است که توسعه‌دهندگان جونیور را از سینیورها متمایز می‌کند - آرامش تحت فشار و دانستن گردش‌کارهای صحیح Git.

زمان همان پول است. بیایید این را رفع کنیم!`,
    "workflow.level2.story.realWorldContext":
        "Hotfixهای تولید برای حفظ پایداری سیستم حیاتی هستند و نیازمند اجرای فوری و متمرکز گردش‌کار هستند.",
    "workflow.level2.story.taskIntroduction": "بر گردش‌کار hotfix برای رفع اضطراری مشکلات تولید مسلط شوید.",

    "workflow.level3.name": "تسلط بر Git Flow",
    "workflow.level3.description": "بر گردش‌کار کامل Git Flow با شاخه‌های release مسلط شوید",
    "workflow.level3.objective1": "یک شاخه release از develop ایجاد کنید",
    "workflow.level3.objective2": "تغییرات انتشار را آماده و کامیت کنید",
    "workflow.level3.objective3": "release را در main ادغام کنید",
    "workflow.level3.objective4": "نسخه انتشار را تگ بزنید",
    "workflow.level3.hint1": "از develop شروع کنید و یک شاخه release ایجاد کنید: 'git switch -c release/2.0.0'",
    "workflow.level3.hint2": "تنظیمات نهایی را انجام داده و آماده‌سازی انتشار خود را کامیت کنید",
    "workflow.level3.hint3": "به main جابجا شوید: 'git switch main'",
    "workflow.level3.hint4": "release را ادغام کنید: 'git merge release/2.0.0'",
    "workflow.level3.hint5": "release را تگ بزنید: 'git tag v2.0.0'",
    "workflow.level3.hint6": "در پروژه‌های واقعی، همچنین به develop نیز ادغام می‌کنید",
    "workflow.level3.requirement1.description": "یک شاخه release ایجاد کنید (مثلاً 'release/2.0.0')",
    "workflow.level3.requirement1.success": "شاخه release ایجاد شد!",
    "workflow.level3.requirement2.description": "تغییرات آماده‌سازی انتشار خود را استیج کنید",
    "workflow.level3.requirement2.success": "تغییرات انتشار استیج شدند!",
    "workflow.level3.requirement3.description": "آماده‌سازی انتشار را با یک پیام واضح کامیت کنید",
    "workflow.level3.requirement3.success": "آماده‌سازی انتشار کامیت شد!",
    "workflow.level3.requirement4.description": "برای آماده‌سازی ادغام انتشار، به شاخه main جابجا شوید",
    "workflow.level3.requirement4.success": "به main جابجا شدید!",
    "workflow.level3.requirement5.description": "شاخه release خود را در main ادغام کنید",
    "workflow.level3.requirement5.success": "release در main ادغام شد!",
    "workflow.level3.requirement6.description": "انتشار را با شماره نسخه تگ بزنید (مثلاً 'v2.0.0')",
    "workflow.level3.requirement6.success": "انتشار تگ خورد! نسخه 2.0.0 اکنون در تولید فعال است!",
    "workflow.level3.story.title": "مدیر انتشار",
    "workflow.level3.story.narrative": `تبریک می‌گویم! شما به سمت مدیر انتشار در GitFlow Inc. ارتقا یافته‌اید، شرکتی که هر دو هفته یک‌بار مثل ساعت نرم‌افزار منتشر می‌کند.

وظیفه شما هماهنگی انتشار نسخه 2.0 است که شامل موارد زیر است:
- سه ویژگی جدید از تیم‌های مختلف
- دو رفع باگ حیاتی
- بهبود عملکرد
- به‌روزرسانی مستندات

**گردش‌کار انتشار:**

1. **ایجاد شاخه Release**: از develop شروع کرده و یک شاخه release ایجاد کنید
   \`git switch -c release/2.0.0\`

2. **آماده‌سازی‌های نهایی**: به‌روزرسانی شماره نسخه‌ها، CHANGELOG و غیره
   - فایل‌ها را در صورت نیاز ویرایش کنید
   - \`git add .\`
   - \`git commit -m "Prepare release 2.0.0"\`

3. **ادغام در Main**: استقرار در تولید
   - \`git switch main\`
   - \`git merge release/2.0.0\`

4. **تگ زدن به انتشار**: این نسخه را در تاریخچه مشخص کنید
   \`git tag v2.0.0\`

این کار یک نشانگر دائمی برای این انتشار ایجاد می‌کند. در پروژه‌های واقعی، همچنین باید:
- برای همگام ماندن، دوباره در develop ادغام کنید
- شاخه release را حذف کنید
- همه‌چیز را به remote پوش کنید
- در تولید مستقر کنید

این مدیریت Git در سطح سازمانی است. به لیگ بزرگ‌ها خوش آمدید!`,
    "workflow.level3.story.realWorldContext":
        "شاخه‌های release در Git Flow برای آماده‌سازی انتشارهای تولید استفاده می‌شوند. آن‌ها امکان رفع باگ‌های نهایی و به‌روزرسانی مستندات را بدون مسدود کردن توسعه در حال انجام فراهم می‌کنند. انتشار برای مرجع‌دهی آسان و بازگشت به نسخه قبلی در صورت نیاز تگ می‌خورد.",
    "workflow.level3.story.taskIntroduction":
        "گردش‌کار حرفه‌ای انتشار را بیاموزید: شاخه‌سازی، آماده‌سازی، ادغام و تگ زدن. این‌گونه است که تیم‌ها نرم‌افزار پایدار را در تولید منتشر می‌کنند.",

    // Teamwork Stage
    "teamwork.name": "همکاری تیمی",
    "teamwork.description": "یاد بگیرید چگونه با استفاده از تکنیک‌های همکاری Git به‌طور مؤثر با تیم‌ها کار کنید",

    "teamwork.level1.name": "مبانی همکاری تیمی",
    "teamwork.level1.description": "یاد بگیرید چگونه با استفاده از Git به‌طور مؤثر با یک تیم کار کنید",
    "teamwork.level1.objective1": "آخرین کد تیم را از remote پول کنید",
    "teamwork.level1.objective2": "یک شاخه ویژگی جدید برای کار خود ایجاد کنید",
    "teamwork.level1.objective3": "فایل team.md را ویرایش کرده و نام خود را به لیست اعضای تیم اضافه کنید",
    "teamwork.level1.objective4": "تغییرات خود را استیج کنید",
    "teamwork.level1.objective5": "تغییرات خود را کامیت کنید",
    "teamwork.level1.objective6": "تغییرات خود را به مخزن راه‌دور پوش کنید",
    "teamwork.level1.hint1": "از 'git pull origin main' برای دریافت آخرین کد تیم استفاده کنید",
    "teamwork.level1.hint2": "یک شاخه جدید با 'git switch -c feature/YOUR-NAME' ایجاد کنید",
    "teamwork.level1.hint3": "فایل team.md را ویرایش کنید تا نام و نقش خود را اضافه کنید",
    "teamwork.level1.hint4": "تمام تغییرات را با 'git add .' استیج کنید",
    "teamwork.level1.hint5": "با یک پیام واضح کامیت کنید: 'git commit -m \"Add my profile\"'",
    "teamwork.level1.hint6": "شاخه خود را با 'git push origin feature/YOUR-NAME' پوش کنید",
    "teamwork.level1.requirement1.description": "آخرین تغییرات را از مخزن تیم پول کنید",
    "teamwork.level1.requirement1.success": "آخرین تغییرات با موفقیت پول شدند!",
    "teamwork.level1.requirement2.description": "شاخه ویژگی خود را برای پروفایل تیم ایجاد کنید",
    "teamwork.level1.requirement2.success": "شاخه ویژگی ایجاد شد!",
    "teamwork.level1.requirement3.description": "team.md را ویرایش کرده و نام خود را به لیست اضافه کنید",
    "teamwork.level1.requirement3.success": "فایل تغییر کرد! نام شما اضافه شد.",
    "teamwork.level1.requirement4.description": "تغییرات پروفایل تیم خود را استیج کنید",
    "teamwork.level1.requirement4.success": "تغییرات استیج شدند!",
    "teamwork.level1.requirement5.description": "پروفایل تیم خود را با یک پیام توصیفی کامیت کنید",
    "teamwork.level1.requirement5.success": "پروفایل تیم کامیت شد!",
    "teamwork.level1.requirement6.description": "تغییرات خود را به مخزن راه‌دور پوش کنید",
    "teamwork.level1.requirement6.success": "تغییرات به remote پوش شدند!",
    "teamwork.level1.story.title": "به تیم توسعه خوش آمدید",
    "teamwork.level1.story.narrative": `🎉 تبریک می‌گویم! شما به‌تازگی به‌عنوان توسعه‌دهنده در InnovateCorp، یک استارتاپ فناوری در حال رشد سریع، استخدام شده‌اید.

سرپرست تیم شما، Alex، شما را در اولین روزتان راهنمایی می‌کند:

"به تیم خوش آمدید! ما اینجا برای همه‌چیز از Git استفاده می‌کنیم. کدبیس فضای کاری مشترک ماست و همه هر روز در آن مشارکت می‌کنند. اولین وظیفه شما ساده اما مهم است - پروفایل خود را به صفحه تیم ما اضافه کنید."

"یادت باشد،" Alex ادامه می‌دهد، "ما 12 توسعه‌دهنده روی این پروژه کار می‌کنند. همه باید همگام بمانند. همیشه قبل از پوش کردن \`git pull\` بزن، و مطمئن شو پیام‌های کامیتت واضح هستند تا بقیه ما بدانیم روی چه چیزی کار می‌کنی."

مأموریت شما:
1. آخرین کد را از مخزن تیم با \`git pull origin main\` دریافت کنید
2. شاخه ویژگی خود را ایجاد کنید: \`git switch -c feature/team-profile\`
3. پروفایل توسعه‌دهنده خود را به صفحه تیم اضافه کنید
4. تغییرات را استیج کنید: \`git add .\`
5. تغییرات خود را کامیت کنید: \`git commit -m "Add my profile"\`

این توسعه تیمی در دنیای واقعی است. بیایید اولین مشارکت شما را انجام دهیم!`,
    "teamwork.level1.story.realWorldContext":
        "همکاری تیمی قلب توسعه نرم‌افزار است. یادگیری کار با مخازن مشترک برای هر توسعه‌دهنده‌ای ضروری است.",
    "teamwork.level1.story.taskIntroduction":
        "مبانی گردش‌کار تیمی Git را بیاموزید و اولین مشارکت گروهی خود را انجام دهید.",

    "teamwork.level2.name": "مدیریت تعارض‌های ادغام در تیم‌ها",
    "teamwork.level2.description":
        "تعارض‌های ادغامی را که هنگام کار چند توسعه‌دهنده روی فایل‌های یکسان رخ می‌دهند حل کنید",
    "teamwork.level2.objective1": "تغییرات محلی خود را استیج و کامیت کنید",
    "teamwork.level2.objective2": "تغییرات remote را پول کنید (باعث بروز تعارض می‌شود)",
    "teamwork.level2.objective3": "نشانگرهای تعارض ادغام را حل کنید",
    "teamwork.level2.objective4": "راه‌حل ادغام‌شده را استیج و کامیت کنید",
    "teamwork.level2.hint1": "از 'cat /src/auth/login.js' برای دیدن تغییرات کامیت‌نشده فعلی خود استفاده کنید",
    "teamwork.level2.hint2": "از 'git status' برای تأیید تغییر فایل استفاده کنید",
    "teamwork.level2.hint3": "کامیت کنید با 'git add /src/auth/login.js' سپس 'git commit -m \"message\"'",
    "teamwork.level2.hint4": "پول کنید با 'git pull origin main' - این کار تعارض را ایجاد می‌کند!",
    "teamwork.level2.hint5": "به دنبال نشانگرهای تعارض بگردید: <<<<<<<، =======، >>>>>>>",
    "teamwork.level2.hint6": "login.js را ویرایش کنید تا بهبودهای شما و Sarah را ترکیب کنید",
    "teamwork.level2.hint7": "بهترین راه‌حل هر دو را حفظ می‌کند: بررسی ایمیل Sarah و طول‌های سخت‌گیرانه‌تر شما",
    "teamwork.level2.hint8": "بعد از حل تعارض: 'git add .' سپس 'git commit -m \"Resolve merge conflict\"'",
    "teamwork.level2.requirement1.description": "تغییرات محلی خود در login.js را استیج کنید",
    "teamwork.level2.requirement1.success": "تغییرات محلی استیج شدند!",
    "teamwork.level2.requirement2.description": "ابتدا تغییرات محلی خود را کامیت کنید",
    "teamwork.level2.requirement2.success": "تغییرات محلی کامیت شدند!",
    "teamwork.level2.requirement3.description": "تغییرات Sarah را پول کنید تا تعارض ایجاد شود",
    "teamwork.level2.requirement3.success":
        "تغییرات دارای تعارض پول شدند! login.js را برای نشانگرهای تعارض بررسی کنید.",
    "teamwork.level2.requirement4.description": "تعارض حل‌شده را استیج کنید",
    "teamwork.level2.requirement4.success": "راه‌حل تعارض استیج شد!",
    "teamwork.level2.requirement5.description": "راه‌حل ادغام را کامیت کنید",
    "teamwork.level2.requirement5.success": "تعارض ادغام حل شد!",
    "teamwork.level2.story.title": "بحران بزرگ تعارض ادغام",
    "teamwork.level2.story.narrative": `⚠️ به اولین تعارض ادغام خود خوش آمدید!

**وضعیت:**
شما امروز صبح روی \`/src/auth/login.js\` کار می‌کرده‌اید. اعتبارسنجی رمز عبور را سخت‌گیرانه‌تر کرده‌اید (حداقل 5 کاراکتر برای نام کاربری، 10 برای رمز عبور). کار خوبی بود!

اما در همان حین که کدنویسی می‌کردید، هم‌تیمی شما Sarah هم تغییراتی را به همان فایل پوش کرد! او منطق اعتبارسنجی ایمیل را اضافه کرد. حالا هر دوی شما نسخه‌های متفاوتی از همان خطوط کد دارید.

**مأموریت شما:**

**1. تغییرات محلی خود را بررسی کنید:** \`cat /src/auth/login.js\` را اجرا کنید تا بهبودهای خودتان را ببینید (قبلاً انجام شده، اما هنوز کامیت نشده!)

**2. ابتدا تغییرات خودتان را کامیت کنید:**
\` git add /src/auth/login.js
git commit -m "Improve password validation requirements"
\`

**3. حالا سعی کنید تغییرات Sarah را پول کنید:**
\` git pull origin main \`

**4. 💥 تعارض ادغام!** Git نمی‌تواند به‌طور خودکار ادغام کند چون هم شما و هم Sarah همان خطوط را تغییر داده‌اید! نشانگرهای تعارض را در فایل خواهید دید:
\`<<<<<<< HEAD
(تغییرات شما)
=======
(تغییرات Sarah)
>>>>>>> abc1234\`

**5. تعارض را حل کنید:**
- \`/src/auth/login.js\` را ویرایش کنید تا بهترین بخش هر دو نسخه را ترکیب کنید
- نشانگرهای تعارض را حذف کنید (\`<<<<<<<\`، \`=======\`، \`>>>>>>>\`)
- هم طول سخت‌گیرانه‌تر رمز عبور شما و هم اعتبارسنجی ایمیل Sarah را حفظ کنید!

**6. ادغام را کامل کنید:**
\`git add .
git commit -m "Merge Sarah's email validation with my password improvements"\`

**نکته حرفه‌ای:** بهترین راه‌حل اغلب هر دو تغییر را ترکیب می‌کند! در این مورد، این‌ها را حفظ کنید:
- منطق اعتبارسنجی ایمیل Sarah (\`username.includes('@')\`)
- الزامات طول سخت‌گیرانه‌تر شما (\`username.length >= 5\` و \`password.length >= 10\`)

این کاملاً در توسعه تیمی طبیعی است! تعارض‌های ادغام زمانی رخ می‌دهند که چند توسعه‌دهنده روی کد یکسانی کار می‌کنند. نکته کلیدی حل کردن آن‌ها با دقت و تفکر است.`,
    "teamwork.level2.story.realWorldContext":
        "تعارض‌های ادغام در توسعه تیمی اجتناب‌ناپذیرند. یادگیری حل سریع و صحیح آن‌ها یک مهارت حیاتی است.",
    "teamwork.level2.story.taskIntroduction": "بر حل تعارض‌های ادغام مسلط شوید تا یک همکار تیمی با اعتماد به‌نفس شوید.",

    "teamwork.level3.name": "گردش‌کار بازبینی کد",
    "teamwork.level3.description": "یاد بگیرید چگونه در بازبینی‌های کد شرکت کنید و از طریق pull request همکاری کنید",
    "teamwork.level3.objective1": "یک شاخه ویژگی جدید ایجاد کنید",
    "teamwork.level3.objective2": "کار تکمیل‌شده خود را استیج کنید",
    "teamwork.level3.objective3": "با یک پیام واضح کامیت کنید",
    "teamwork.level3.objective4": "شاخه خود را برای بازبینی تیم پوش کنید",
    "teamwork.level3.hint1": "یک شاخه ویژگی ایجاد کنید: git switch -c feature/password-reset",
    "teamwork.level3.hint2": "جایگزین (کلاسیک): git checkout -b feature/password-reset",
    "teamwork.level3.hint3": "تمام تغییرات را استیج کنید: git add .",
    "teamwork.level3.hint4": 'با یک پیام توصیفی کامیت کنید: git commit -m "Add password reset functionality"',
    "teamwork.level3.hint5": "به remote پوش کنید: git push origin feature/password-reset",
    "teamwork.level3.hint6": "جایگزین با میان‌بر: git push -u origin feature/password-reset",
    "teamwork.level3.hint7":
        "توجه: از نام شاخه‌ای که ساخته‌اید استفاده کنید (نه 'feature/password-reset' اگر نام دیگری انتخاب کرده‌اید)",
    "teamwork.level3.requirement1.description": "یک شاخه برای نمایش بازبینی کد ایجاد کنید",
    "teamwork.level3.requirement1.success": "شاخه ویژگی ایجاد شد! ✨",
    "teamwork.level3.requirement2.description": "کد خود را برای بازبینی استیج کنید",
    "teamwork.level3.requirement2.success": "کد برای بازبینی استیج شد! 📦",
    "teamwork.level3.requirement3.description": "با یک پیام واضح و قابل بازبینی کامیت کنید",
    "teamwork.level3.requirement3.success": "کد با پیام واضح کامیت شد! 💬",
    "teamwork.level3.requirement4.description": "شاخه خود را برای بازبینی کد پوش کنید",
    "teamwork.level3.requirement4.success":
        "کد برای بازبینی تیم پوش شد! 🚀 در تیم‌های واقعی، اکنون یک Pull Request ایجاد می‌کردید!",
    "teamwork.level3.story.title": "فرهنگ بازبینی کد",
    "teamwork.level3.story.narrative": `📝 به فرآیند بازبینی کد InnovateCorp خوش آمدید!

**وضعیت:**
شما تازه پیاده‌سازی ویژگی بازنشانی رمز عبور را تمام کرده‌اید. کد در تست‌های محلی شما بی‌نقص کار می‌کند! 🎉

اما صبر کنید - در InnovateCorp، هیچ کدی بدون بازبینی به تولید نمی‌رود. این موضوع درباره اعتماد نیست - درباره کیفیت، اشتراک دانش و پیدا کردن باگ‌ها پیش از دیدن مشتریان است.

**چرا بازبینی کد اهمیت دارد:**
- **کیفیت:** ممکن است Sarah یک مشکل امنیتی را که از قلم انداخته‌اید پیدا کند
- **اشتراک دانش:** Mike از راه‌حل هوشمندانه شما یاد می‌گیرد
- **کد بهتر:** دیدگاه‌های متعدد نرم‌افزار بهتری می‌سازند
- **رشد تیم:** همه به توسعه‌دهنده بهتری تبدیل می‌شوند

**وظیفه شما:**
باید ویژگی بازنشانی رمز عبور خود را برای بازبینی تیم آماده کنید. گردش‌کار حرفه‌ای را دنبال کنید:

**قدم 1: یک شاخه ویژگی ایجاد کنید**
هرگز مستقیماً روی \`main\` کار نکنید! یک شاخه اختصاصی برای ویژگی خود ایجاد کنید.

**قدم 2: کار خود را استیج کنید**
فایل‌های تکمیل‌شده خود را به ناحیه استیجینگ اضافه کنید.

**قدم 3: با یک پیام واضح کامیت کنید**
پیام کامیتی بنویسید که توضیح دهد چه چیزی ساخته‌اید. هم‌تیمی‌های شما باید بدون خواندن تک‌تک خطوط کد، تغییرات شما را درک کنند.

**قدم 4: به Remote پوش کنید**
شاخه ویژگی خود را آپلود کنید تا تیم شما بتواند آن را بازبینی کند. در تیم‌های واقعی، سپس یک Pull Request روی GitHub/GitLab ایجاد می‌کردید.

**به یاد داشته باشید:** کلید بازبینی‌های کد عالی، ارتباط واضح است. نام شاخه، پیام‌های کامیت و کد شما باید یک داستان را روایت کنند!

بیایید کد شما را برای تیم آماده کنیم! 🚀`,
    "teamwork.level3.story.realWorldContext":
        "بازبینی کد یک رویه استاندارد در توسعه حرفه‌ای است. این کار کیفیت کد را بهبود می‌بخشد، باگ‌ها را زود پیدا می‌کند و به تیم‌ها کمک می‌کند از یکدیگر یاد بگیرند. بیشتر شرکت‌ها از Pull Request (GitHub) یا Merge Request (GitLab) برای این فرآیند استفاده می‌کنند.",
    "teamwork.level3.story.taskIntroduction":
        "گردش‌کار حرفه‌ای آماده‌سازی کد برای بازبینی تیم از طریق شاخه‌ها، کامیت‌ها و عملیات پوش را بیاموزید.",

    // Archaeology Stage
    "archaeology.name": "باستان‌شناسی Git",
    "archaeology.description": "تاریخچه کد را بررسی کنید و مانند یک کارآگاه، پزشکی قانونی Git انجام دهید",

    // Mastery Stage
    "mastery.name": "تسلط بر Git",
    "mastery.description": "چالش‌های نهایی Git برای استادان واقعی",

    "mastery.level1.name": "چالش ادغام چندشاخه‌ای",
    "mastery.level1.description": "بر ادغام‌های پیچیده بین چند شاخه دارای تعارض مسلط شوید",
    "mastery.level1.objective1": "چند شاخه ویژگی را به‌طور هم‌زمان ادغام کنید",
    "mastery.level1.objective2": "تعارض‌های پیچیده ادغام را حل کنید",
    "mastery.level1.objective3": "تعارض‌های حل‌شده را استیج کنید",
    "mastery.level1.objective4": "ادغام چندجانبه را کامل کنید",
    "mastery.level1.hint1": "از git merge برای ادغام چند شاخه به‌طور هم‌زمان استفاده کنید",
    "mastery.level1.hint2": "هر تعارض را با دقت بررسی کنید - ممکن است با هم تعامل داشته باشند",
    "mastery.level1.hint3": "بهترین راه‌حل اغلب عناصری از تمام شاخه‌ها را ترکیب می‌کند",
    "mastery.level1.hint4": "کد ادغام‌شده خود را پیش از کامیت تست کنید",
    "mastery.level1.requirement1.description": "تمام شاخه‌های ویژگی را در main ادغام کنید",
    "mastery.level1.requirement1.success": "ادغام پیچیده آغاز شد! حالا تعارض‌ها را حل کنید.",
    "mastery.level1.requirement2.description": "تمام فایل‌های حل‌شده را استیج کنید",
    "mastery.level1.requirement2.success": "تعارض‌ها حل و استیج شدند!",
    "mastery.level1.requirement3.description": "ادغام را با یک کامیت کامل کنید",
    "mastery.level1.requirement3.success": "ادغام در سطح استادانه تکمیل شد! شما بر ادغام‌های چندجانبه غلبه کردید!",
    "mastery.level1.story.title": "چالش یکپارچه‌سازی",
    "mastery.level1.story.narrative":
        "سه تیم به‌طور موازی برای انتشار فصلی کار می‌کرده‌اند. هر تیم ویژگی‌های حیاتی را روی شاخه‌های جداگانه توسعه داده است. حالا روز یکپارچه‌سازی است و شما توسعه‌دهنده ارشد مسئول ادغام همه‌چیز هستید. چالش: هر سه شاخه فایل‌های ابزار مشترک را تغییر داده‌اند. باید تمام شاخه‌ها را ادغام کرده و تعارض‌ها را حل کنید تا یک سیستم منسجم و کارآمد بسازید.",
    "mastery.level1.story.realWorldContext":
        "ادغام‌های پیچیده چندشاخه‌ای در پروژه‌های بزرگ با چندین جریان توسعه موازی رایج هستند. تسلط بر این مهارت برای توسعه‌دهندگان ارشد و سرپرستان فنی ضروری است.",
    "mastery.level1.story.taskIntroduction":
        "سه شاخه ویژگی با تغییرات همپوشان را ادغام کرده و تمام تعارض‌ها را حل کنید تا یک کدبیس یکپارچه بسازید.",

    "mastery.level2.name": "هوک‌های Git و خودکارسازی",
    "mastery.level2.description":
        "هوک‌های Git را پیاده‌سازی کنید تا گردش‌کارها را خودکار کرده و استانداردهای کیفیت را اعمال کنید",
    "mastery.level2.objective1": "هوک‌های pre-commit برای کیفیت کد ایجاد کنید",
    "mastery.level2.objective2": "هوک‌های post-commit را برای اعلان‌ها تنظیم کنید",
    "mastery.level2.objective3": "هوک‌های سمت سرور را پیاده‌سازی کنید",
    "mastery.level2.objective4": "خط لوله‌های گردش‌کار خودکار بسازید",
    "mastery.level2.hint1": "هوک‌های pre-commit پیش از ایجاد کامیت‌ها اجرا می‌شوند",
    "mastery.level2.hint2": "هوک‌های post-commit پس از کامیت‌های موفق اجرا می‌شوند",
    "mastery.level2.hint3": "از exit codeها برای جلوگیری از کامیت در هوک‌های pre-commit استفاده کنید",
    "mastery.level2.hint4": "هوک‌های سمت سرور کنترل می‌کنند چه چیزی می‌تواند پوش شود",
    "mastery.level2.requirement1.description": "هوک pre-commit را قابل اجرا کنید",
    "mastery.level2.requirement1.success": "هوک pre-commit فعال شد!",
    "mastery.level2.requirement2.description": "فایل‌ها را برای تست هوک pre-commit استیج کنید",
    "mastery.level2.requirement2.success": "فایل‌ها استیج شدند!",
    "mastery.level2.requirement3.description": "برای فعال کردن بررسی‌های کیفیت، یک کامیت امتحان کنید",
    "mastery.level2.requirement3.success": "بررسی‌های کیفیت با موفقیت انجام شدند!",
    "mastery.level2.story.title": "نگهبان کیفیت",
    "mastery.level2.story.narrative": `⚡ شما به سمت مهندس DevOps ارتقا یافته‌اید، و اولین مأموریت شما پیاده‌سازی «نگهبان کیفیت» است - سیستمی خودکار که از ورود کد بد به مخزن جلوگیری می‌کند.

تیم توسعه به‌سرعت در حال رشد بوده و با رشد، ناهماهنگی هم می‌آید:
- کامیت‌ها بدون تست مناسب
- نقض سبک کد
- اطلاعات محرمانه که تصادفاً کامیت شده‌اند
- بیلدهای خراب که به main پوش شده‌اند

سرپرست تیم شما، Sarah، این چشم‌انداز را توضیح می‌دهد:

"ما به خودکارسازی نیاز داریم تا استانداردهای کیفیت خود را اعمال کنیم. هر کامیت باید به‌طور خودکار برای موارد زیر بررسی شود:
- Linting و سبک کد
- موفقیت تست‌های واحد
- آسیب‌پذیری‌های امنیتی
- استانداردهای پیام کامیت"

"هوک‌های Git برای این کار عالی هستند. آن‌ها اسکریپت‌هایی هستند که در نقاط مشخصی از گردش‌کار Git اجرا می‌شوند. آن‌ها را مثل دروازه‌های کیفیتی در نظر بگیر که کد باید از آن‌ها عبور کند."

اکوسیستم هوک‌ها:
- pre-commit: بررسی‌ها را پیش از ایجاد کامیت‌ها اجرا می‌کند
- pre-push: پیش از پوش کردن به remote اعتبارسنجی می‌کند
- post-commit: اعلان می‌فرستد یا بیلدها را فعال می‌کند
- هوک‌های سمت سرور: کنترل می‌کنند چه چیزی می‌تواند پوش شود

مأموریت شما:
1. یک هوک pre-commit برای بررسی‌های کیفیت پیاده‌سازی کنید
2. تست و linting خودکار را راه‌اندازی کنید
3. سیستم‌های اعلان ایجاد کنید
4. یک خط لوله کیفیت جامع بسازید

این کار زیرساختی است که به نفع هر توسعه‌دهنده تیم شما خواهد بود. شما فقط کد نمی‌نویسید - دارید پایه کیفیت کد را می‌سازید.`,
    "mastery.level2.story.realWorldContext":
        "هوک‌های Git برای پیاده‌سازی تضمین کیفیت خودکار و خودکارسازی گردش‌کار در محیط‌های توسعه حرفه‌ای ضروری هستند.",
    "mastery.level2.story.taskIntroduction":
        "بر هوک‌های Git مسلط شوید تا سیستم‌های کیفیت خودکاری بسازید که استانداردها را اعمال کرده و بهره‌وری تیم را بهبود می‌بخشند.",

    "mastery.level3.name": "تسلط بر Git: چالش نهایی",
    "mastery.level3.description":
        "تمام تکنیک‌های پیشرفته Git را ترکیب کنید تا یک سناریوی پیچیده دنیای واقعی را حل کنید",
    "mastery.level3.objective1": "یک انتشار پیچیده همراه با چند hotfix را هماهنگ کنید",
    "mastery.level3.objective2": "بازگشت‌های اضطراری و بازیابی را مدیریت کنید",
    "mastery.level3.objective3": "به‌طور هم‌زمان با چند تیم هماهنگ شوید",
    "mastery.level3.objective4": "تسلط بر تمام تکنیک‌ها را نشان دهید",
    "mastery.level3.hint1": "این چالش تمام آنچه یاد گرفته‌اید را ترکیب می‌کند",
    "mastery.level3.hint2": "درباره مدیریت شاخه‌ها استراتژیک فکر کنید",
    "mastery.level3.hint3": "ارتباطات به‌اندازه مهارت‌های فنی مهم است",
    "mastery.level3.hint4": "تصمیمات خود را برای تیم مستند کنید",
    "mastery.level3.requirement1.description": "یک شاخه بازگشت اضطراری ایجاد کنید",
    "mastery.level3.requirement1.success": "رویه‌های اضطراری آغاز شدند!",
    "mastery.level3.requirement2.description": "رفع‌های حیاتی را cherry-pick کنید",
    "mastery.level3.requirement2.success": "رفع‌های حیاتی اعمال شدند!",
    "mastery.level3.requirement3.description": "انتشار اضطراری را تگ بزنید",
    "mastery.level3.requirement3.success": "انتشار اضطراری تگ خورد!",
    "mastery.level3.requirement4.description": "تگ‌های انتشار اضطراری را پوش کنید",
    "mastery.level3.requirement4.success": "🎉 تسلط به‌دست آمد! شما اکنون یک استاد Git هستید!",
    "mastery.level3.story.title": "نهایی‌ترین چالش Git: بحران جمعه سیاه",
    "mastery.level3.story.narrative": `🚨 جمعه سیاه، ساعت 2:00 بامداد - آزمون نهایی

شما مهندس ارشد DevOps در MegaCorp هستید و در بزرگ‌ترین روز خرید سال، با طوفانی کامل از چالش‌های Git روبه‌رو شده‌اید.

وضعیت:
- تولید به دلیل یک استقرار بد تا حدی خراب شده است
- سه تیم مختلف به‌طور هم‌زمان hotfix پوش کرده‌اند
- سیستم پرداخت به‌طور متناوب خراب می‌شود
- پشتیبانی مشتری تحت فشار زیادی است
- مدیرعامل خواستار به‌روزرسانی‌های ساعتی است
- ترافیک جمعه سیاه 50 برابر سطح عادی است

مدیر ارشد فناوری شما یک جلسه اضطراری تشکیل می‌دهد:

"دقیقاً به همین دلیل تو را استخدام کردیم. هر چیزی که ساخته‌ایم، هر چیزی که یاد گرفته‌ایم، به این لحظه ختم می‌شود. ما به کسی نیاز داریم که بتواند عملیات پیچیده Git را تحت فشار شدید هدایت کند."

این چالش شامل موارد زیر است:
1. **بازگشت اضطراری**: به‌سرعت استقرار مشکل‌دار را برگردانید
2. **بازیابی انتخابی**: فقط تغییرات درست را cherry-pick کنید
3. **هماهنگی Hotfix**: رفع‌های حیاتی چند تیم را ادغام کنید
4. **مدیریت انتشار**: پچ‌های اضطراری را ایجاد و مستقر کنید
5. **ارتباط تیمی**: بین توسعه، QA و عملیات هماهنگ شوید

باید از تمام تکنیک‌های Git موجود در زرادخانه خود استفاده کنید:
- \`git rebase -i\` برای پاکسازی کامیت‌های درهم‌ریخته
- \`git cherry-pick <commit-hash>\` برای انتخاب فقط ویژگی‌های کارآمد (کامیت‌های مشخصی را از یک شاخه به شاخه دیگر کپی می‌کند)
- ادغام پیشرفته با \`git merge\` برای ترکیب تلاش‌های تیم‌ها
- \`git bisect\` برای پیدا کردن دقیق کامیت مشکل‌دار (جستجوی دودویی در تاریخچه برای پیدا کردن باگ‌ها)
- \`git reflog\` برای بازیابی از اشتباهات
- \`git tag\` و شاخه‌ها برای مدیریت انتشار
- \`git mv <old> <new>\` برای تغییر نام فایل‌ها با حفظ تاریخچه Git

**git cherry-pick چیست؟**
Cherry-picking به شما اجازه می‌دهد کامیت‌های مشخصی را از یک شاخه به شاخه دیگر کپی کنید. به‌جای ادغام کل شاخه‌ها، می‌توانید کامیت‌های تکی را انتخاب کنید. عالی برای اعمال hotfixها از یک شاخه به شاخه دیگر!

مثال: \`git cherry-pick abc123\` - کامیت abc123 را روی شاخه فعلی شما اعمال می‌کند

**git bisect چیست؟**
Bisect به شما کمک می‌کند با استفاده از جستجوی دودویی پیدا کنید کدام کامیت باعث بروز یک باگ شده است. Git کامیت‌ها را برای تست شما checkout می‌کند و شما به آن می‌گویید "خوب" یا "بد" تا کامیت مشکل‌دار را پیدا کند.

مثال:
\`git bisect start\`
\`git bisect bad\` (کامیت فعلی خراب است)
\`git bisect good abc123\` (این کامیت قدیمی کار می‌کرد)
سپس Git شما را در تست کامیت‌ها راهنمایی می‌کند تا اولین کامیت بد را پیدا کند!

**git mv چیست؟**
فایل‌ها را جابجا یا تغییر نام دهید در حالی که تاریخچه Git دست‌نخورده می‌ماند. بهتر از تغییر نام دستی فایل‌ها، چون Git تغییر نام را ردیابی می‌کند.

مثال: \`git mv old-name.js new-name.js\`

این فقط درباره دستورات Git نیست - درباره رهبری، تصمیم‌گیری تحت فشار و توانایی فکر کردن سیستماتیک زمانی است که همه‌چیز در حال سوختن است.

درآمد جمعه سیاه شرکت به شما بستگی دارد. میلیون‌ها مشتری منتظرند. تیم شما به دنبال راهنمایی شماست.

این لحظه شماست. به آن‌ها نشان دهید یک استاد Git چه کاری می‌تواند انجام دهد.

آماده‌اید تسلط خود را ثابت کنید؟ ساعت در حال تیک‌تاک است...`,
    "mastery.level3.story.realWorldContext":
        "تسلط بر Git در دنیای واقعی شامل هماهنگی عملیات پیچیده تحت فشار، مدیریت ذی‌نفعان متعدد و تصمیم‌گیری‌های حیاتی است که بر عملیات کسب‌وکار تأثیر می‌گذارند.",
    "mastery.level3.story.taskIntroduction":
        "این نهایی‌ترین چالش Git است - تمام مهارت‌های خود را ترکیب کنید تا یک سناریوی اضطراری پیچیده و پرفشار را مدیریت کنید.",

    // Archaeology Stage Levels
    "archaeology.level1.name": "Git Blame - باستان‌شناسی کد",
    "archaeology.level1.description": "تاریخچه کد را بررسی کنید تا تغییرات را درک کرده و منشأ باگ‌ها را پیدا کنید",
    "archaeology.level1.objective1":
        "از git blame استفاده کنید تا ببینید کدام کامیت آخرین بار هر خط از src/utils/validator.js را تغییر داده است",
    "archaeology.level1.objective2": "از git log --oneline برای دریافت مروری فشرده از تاریخچه کامیت‌ها استفاده کنید",
    "archaeology.level1.objective3": "از git show برای بررسی جزئیات کامل یک کامیت مشخص استفاده کنید",
    "archaeology.level1.hint1":
        "`git blame src/utils/validator.js` را اجرا کنید تا ببینید کدام کامیت آخرین بار هر خط را تغییر داده است",
    "archaeology.level1.hint2":
        "یک بازه خط مانند `git blame -L 10,20 src/utils/validator.js` اضافه کنید تا روی یک بخش از فایل تمرکز کنید",
    "archaeology.level1.hint3":
        "`git log --oneline` را اجرا کنید تا تاریخچه فشرده تمام کامیت‌ها را با هش کوتاه هر کدام ببینید",
    "archaeology.level1.hint4":
        "یک هش کامیت را از لاگ کپی کنید و `git show <hash>` (یا `git show HEAD`) را اجرا کنید تا دقیقاً ببینید چه چیزی تغییر کرده است",
    "archaeology.level1.requirement1.description":
        "git blame را روی src/utils/validator.js اجرا کنید تا ببینید کدام کامیت آخرین بار هر خط را تغییر داده است",
    "archaeology.level1.requirement1.success": "نویسندگی کد آشکار شد!",
    "archaeology.level1.requirement2.description": "git log --oneline را اجرا کنید تا تاریخچه فشرده کامیت‌ها را ببینید",
    "archaeology.level1.requirement2.success": "تاریخچه اخیر بررسی شد!",
    "archaeology.level1.requirement3.description":
        "git show را روی یک کامیت اجرا کنید، مثلاً git show HEAD، تا جزئیات کامل آن را ببینید",
    "archaeology.level1.requirement3.success": "جزئیات کامیت تحلیل شد!",
    "archaeology.level1.story.title": "پرونده باگ مرموز",
    "archaeology.level1.story.narrative":
        "یک باگ حیاتی در کد اعتبارسنجی، 23 درصد از مشتریان اروپایی را تحت تأثیر قرار داده است. این کد توسط 4 توسعه‌دهنده مختلف در طول 18 ماه نوشته شده. توسعه‌دهنده ارشد شما توضیح می‌دهد: «به باستان‌شناسی کد خوش آمدی! Git فقط کنترل نسخه نیست - ماشین زمان توست. هر خط یک داستان دارد.» با `git blame src/utils/validator.js` شروع کن تا ببینی کدام کامیت آخرین بار هر خط را تغییر داده، سپس از `git log --oneline` و `git show` استفاده کن تا بفهمی چرا کد این‌طور نوشته شده است.",
    "archaeology.level1.story.realWorldContext":
        "مهارت‌های باستان‌شناسی کد برای نگهداری کدبیس‌های بزرگ و طولانی‌مدت با مشارکت‌کنندگان متعدد در طول زمان ضروری هستند.",
    "archaeology.level1.story.taskIntroduction":
        "یاد بگیرید چگونه تاریخچه کد را بررسی کرده و با استفاده از ابزارهای پزشکی قانونی Git - یعنی git blame، git log و git show - منشأ باگ‌ها را پیدا کنید.",

    "archaeology.level2.name": "پزشکی قانونی کامیت با Git Log",
    "archaeology.level2.description": "بر تکنیک‌های پیشرفته بررسی تاریخچه پیچیده کد مسلط شوید",
    "archaeology.level2.objective1": "از git log --grep برای جستجوی یک کلیدواژه در پیام‌های کامیت استفاده کنید",
    "archaeology.level2.objective2":
        "از git log -S برای پیدا کردن کامیت‌هایی که یک متن را اضافه یا حذف کرده‌اند استفاده کنید",
    "archaeology.level2.objective3": "از git log --author برای فیلتر کردن کامیت‌ها بر اساس یک فرد مشخص استفاده کنید",
    "archaeology.level2.hint1":
        "`git log --grep=security` را اجرا کنید تا در پیام‌های کامیت به دنبال 'security' بگردید",
    "archaeology.level2.hint2":
        "`git log -S password` را اجرا کنید تا کامیت‌هایی که کلمه 'password' را در کد اضافه یا حذف کرده‌اند پیدا کنید",
    "archaeology.level2.hint3": "`git log --author=Sarah` را اجرا کنید تا فقط کامیت‌های ساخته‌شده توسط Sarah را ببینید",
    "archaeology.level2.hint4": "می‌توانید این‌ها را با `--oneline` ترکیب کنید تا خروجی فشرده‌تری داشته باشید",
    "archaeology.level2.requirement1.description":
        "با git log --grep=security در پیام‌های کامیت به دنبال 'security' بگردید",
    "archaeology.level2.requirement1.success": "کامیت‌های مرتبط با امنیت پیدا شدند!",
    "archaeology.level2.requirement2.description":
        "با git log -S password کامیت‌هایی که کلمه 'password' را اضافه یا حذف کرده‌اند پیدا کنید",
    "archaeology.level2.requirement2.success": "تغییرات مرتبط با password ردیابی شدند!",
    "archaeology.level2.requirement3.description": "با git log --author=Sarah تمام کامیت‌های Sarah را پیدا کنید",
    "archaeology.level2.requirement3.success": "تاریخچه مشارکت Sarah تحلیل شد!",
    "archaeology.level2.story.title": "مسیر ممیزی امنیتی",
    "archaeology.level2.story.narrative":
        "شرکت شما یک ممیزی امنیتی دریافت کرده است. ممیزان تاریخچه کاملی از تمام تغییرات مرتبط با امنیت می‌خواهند: احراز هویت، مدیریت رمز عبور، رمزنگاری. کدبیس در طول 3 سال دارای 2,847 کامیت است. سرپرست امنیت شما قابلیت‌های جستجوی Git را توضیح می‌دهد: --grep برای پیام‌ها، -S برای محتوای کد، --author برای مشارکت‌کنندگان. یک مسیر ممیزی جامع با استفاده از تکنیک‌های پیشرفته git log بسازید.",
    "archaeology.level2.story.realWorldContext":
        "تکنیک‌های پیشرفته git log برای ممیزی‌های امنیتی، بازبینی کد و درک تاریخچه‌های پیچیده پروژه ضروری هستند.",
    "archaeology.level2.story.taskIntroduction":
        "بر تکنیک‌های پیشرفته git log برای بررسی جامع تاریخچه کد و تحلیل پزشکی قانونی مسلط شوید.",

    "archaeology.level3.name": "Git Reflog - ماشین زمان",
    "archaeology.level3.description":
        "از Git reflog برای بازیابی کامیت‌های ازدست‌رفته و درک تغییرات وضعیت مخزن استفاده کنید",
    "archaeology.level3.objective1":
        "از git reflog برای دیدن هر حرکت HEAD، از جمله کامیت‌های 'ازدست‌رفته'، استفاده کنید",
    "archaeology.level3.objective2":
        "از git reset --hard همراه با یک مرجع reflog (مثلاً HEAD@{0}) برای بازیابی کار ازدست‌رفته استفاده کنید",
    "archaeology.level3.objective3":
        "یک شاخه ایجاد کنید که به یک ورودی reflog اشاره کند تا کامیت‌های بازیابی‌شده را ذخیره کنید",
    "archaeology.level3.hint1":
        "`git reflog` تمام کامیت‌هایی را که HEAD به آن‌ها اشاره کرده فهرست می‌کند، حتی آن‌هایی که 'حذف‌شده' به نظر می‌رسند",
    "archaeology.level3.hint2":
        "هر ورودی reflog یک مرجع مانند `HEAD@{0}`، `HEAD@{1}` دارد - اخیرترین عملیات `HEAD@{0}` است",
    "archaeology.level3.hint3":
        "از `git reset --hard <reflog-reference>` استفاده کنید تا شاخه را به آن کامیت بازگردانید",
    "archaeology.level3.hint4":
        "همچنین می‌توانید یک شاخه جدید را به یک ورودی reflog اشاره دهید: `git branch <name> <reflog-reference>`",
    "archaeology.level3.requirement1.description": "git reflog را اجرا کنید تا حرکت‌های اخیر HEAD را ببینید",
    "archaeology.level3.requirement1.success": "تاریخچه reflog بررسی شد!",
    "archaeology.level3.requirement2.description":
        "کامیت ازدست‌رفته را با git reset --hard و یک مرجع reflog بازیابی کنید، مثلاً git reset --hard HEAD@{0}",
    "archaeology.level3.requirement2.success": "وضعیت مخزن بازیابی شد!",
    "archaeology.level3.requirement3.description":
        "یک شاخه بازیابی ایجاد کنید که به یک ورودی reflog اشاره کند، مثلاً git branch recovery HEAD@{1}",
    "archaeology.level3.requirement3.success": "شاخه بازیابی ایجاد شد!",
    "archaeology.level3.story.title": "بازیابی بزرگ فاجعه Git",
    "archaeology.level3.story.narrative":
        "ساعت 4:30 بعدازظهر جمعه است. هم‌تیمی شما Jake وحشت‌زده می‌گوید: «تصادفاً git reset --hard را اجرا کردم و دو هفته کار را از دست دادم! سیستم احراز هویت، کامپوننت‌های رابط کاربری، تست‌ها - همه رفتند!» اما شما به یاد می‌آورید: Git هرگز فراموش نمی‌کند. Git reflog هر کامیت، تعویض شاخه، ادغام و ریست را ردیابی می‌کند. حتی کامیت‌های 'حذف‌شده' به مدت 90 روز در reflog باقی می‌مانند. مأموریت شما: `git reflog` را اجرا کنید، کامیت‌های ازدست‌رفته را پیدا کنید و کار Jake را با `git reset --hard` و یک شاخه بازیابی، بازیابی کنید. وقت قهرمان شدن است!",
    "archaeology.level3.story.realWorldContext":
        "Git reflog ابزاری قدرتمند برای بازیابی است که می‌تواند توسعه‌دهندگان را از سناریوهای فاجعه‌بار از دست دادن داده نجات دهد.",
    "archaeology.level3.story.taskIntroduction":
        "بر Git reflog مسلط شوید تا قهرمانی شوید که می‌تواند کار 'ازدست‌رفته' را بازیابی کرده و روز را برای هم‌تیمی‌های خود نجات دهد.",

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
