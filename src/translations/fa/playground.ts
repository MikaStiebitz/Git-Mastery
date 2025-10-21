const playground = {
    // Playground
    "playground.title": "زمین بازی Git",
    "playground.subtitle": "آزادانه با دستورات Git آزمایش کنید و از برگه تقلب یاد بگیرید",
    "playground.gitTerminal": "ترمینال Git (حالت آزاد)",
    "playground.gitCheatSheet": "برگه تقلب Git",
    "playground.searchCommands": "جستجوی دستورات Git...",
    "playground.usage": "استفاده:",
    "playground.example": "مثال:",
    "playground.explanation": "توضیح:",
    "playground.noCommands": "هیچ دستوری برای",
    "playground.resetSearch": "بازنشانی جستجو",

    // توضیحات دستورات
    "playground.commands.gitInit.description": "یک مخزن Git جدید را مقداردهی اولیه می‌کند",
    "playground.commands.gitInit.explanation":
        "در پوشهٔ فعلی شما یک مخزن Git تازه می‌سازد و پوشهٔ مخفی .git را با همهٔ فراداده‌ها ایجاد می‌کند.",
    "playground.commands.gitStatus.description": "وضعیت مخزن را نشان می‌دهد",
    "playground.commands.gitStatus.explanation":
        "وضعیت فعلی مخزن را نشان می‌دهد؛ این‌که کدام فایل‌ها تغییر کرده، در مرحلهٔ staging هستند یا رهگیری نشده‌اند.",
    "playground.commands.gitAdd.description": "محتوای فایل‌ها را به فهرست staging اضافه می‌کند",
    "playground.commands.gitAdd.explanation":
        "تغییرات را برای کامیت بعدی علامت‌گذاری می‌کند. با 'git add .' می‌توانید همهٔ تغییرات پوشهٔ جاری را اضافه کنید.",
    "playground.commands.gitCommit.description": "تغییرات را در مخزن ثبت می‌کند",
    "playground.commands.gitCommit.explanation":
        "یک کامیت جدید با تمام تغییرات staging می‌سازد. پیام کامیت باید کوتاه و دقیق توضیح دهد چه چیزی تغییر کرده است.",
    "playground.commands.gitConfig.description": "تنظیمات Git را پیکربندی می‌کند",
    "playground.commands.gitConfig.explanation":
        "مقادیر مربوط به نام کاربری، ایمیل، ویرایشگر و سایر ترجیحات را تعیین می‌کند. با --global این تنظیمات برای همهٔ مخزن‌ها اعمال می‌شود.",
    "playground.commands.gitHelp.description": "اطلاعات راهنما را نمایش می‌دهد",
    "playground.commands.gitHelp.explanation":
        "اطلاعات راهنمای کامل هر دستور Git را نشان می‌دهد. می‌توانید از 'git <command> --help' نیز استفاده کنید.",
    "playground.commands.gitBranch.description": "شاخه‌ها را فهرست، ایجاد یا حذف می‌کند",
    "playground.commands.gitBranch.explanation":
        "بدون پارامتر همهٔ شاخه‌های موجود را فهرست می‌کند. با وارد کردن نام، شاخهٔ جدیدی می‌سازد (اما به آن سوییچ نمی‌کند).",
    "playground.commands.gitCheckout.description": "بین شاخه‌ها جابه‌جا می‌شود یا فایل‌ها را بازمی‌گرداند",
    "playground.commands.gitCheckout.explanation":
        "به شاخهٔ دیگری می‌رود. با '-b' شاخهٔ جدیدی می‌سازد و بلافاصله به آن می‌رود.",
    "playground.commands.gitMerge.description": "تاریخچه‌های توسعه را با هم ادغام می‌کند",
    "playground.commands.gitMerge.explanation":
        "تغییرات شاخهٔ مشخص‌شده را در شاخهٔ فعلی ادغام می‌کند. اگر ادغام fast-forward نباشد یک merge commit ساخته می‌شود.",
    "playground.commands.gitSwitch.description": "به شاخهٔ مشخصی سوییچ می‌کند",
    "playground.commands.gitSwitch.explanation":
        "جایگزین مدرن 'git checkout' برای تغییر شاخه است. با '-c' یک شاخهٔ جدید ساخته و همان لحظه به آن می‌روید.",
    "playground.commands.gitBranchDelete.description": "یک شاخه را حذف می‌کند",
    "playground.commands.gitBranchDelete.explanation":
        "اگر شاخه به طور کامل ادغام شده باشد آن را حذف می‌کند. با '-D' می‌توانید حتی بدون ادغام نیز حذف را اجباری کنید.",
    "playground.commands.gitLog.description": "تاریخچهٔ کامیت‌ها را نشان می‌دهد",
    "playground.commands.gitLog.explanation":
        "تاریخچهٔ کامیت‌ها را همراه با نویسنده، تاریخ و پیام نمایش می‌دهد. گزینه‌های زیادی برای شخصی‌سازی خروجی وجود دارد.",
    "playground.commands.gitDiff.description": "تفاوت بین کامیت‌ها را نشان می‌دهد",
    "playground.commands.gitDiff.explanation":
        "تفاوت بین دو کامیت، بین کامیت و پوشهٔ کاری و غیره را نشان می‌دهد. بدون آرگومان، تغییرات unstaged را نمایش می‌دهد.",
    "playground.commands.gitShow.description": "انواع اشیای Git را نمایش می‌دهد",
    "playground.commands.gitShow.explanation":
        "اطلاعات یک شیء Git را نشان می‌دهد. برای کامیت‌ها پیام و تغییرات اعمال‌شده را نمایش می‌دهد.",
    "playground.commands.gitBlame.description": "نشان می‌دهد چه کسی هر بخش فایل را تغییر داده",
    "playground.commands.gitBlame.explanation":
        "خط‌به‌خط نشان می‌دهد چه کسی و در کدام کامیت تغییری انجام داده است. برای فهم تاریخچهٔ یک فایل مفید است.",
    "playground.commands.gitClone.description": "یک مخزن را در پوشه‌ای جدید کلون می‌کند",
    "playground.commands.gitClone.explanation":
        "یک کپی محلی از مخزن راه‌دور می‌سازد، شامل همهٔ شاخه‌ها و تاریخچه.",
    "playground.commands.gitPull.description": "تغییرات مخزن راه‌دور را می‌گیرد و ادغام می‌کند",
    "playground.commands.gitPull.explanation":
        "دستورهای 'git fetch' و 'git merge' را ترکیب می‌کند تا تغییرات شاخهٔ راه‌دور را دریافت و در شاخهٔ فعلی ادغام کند.",
    "playground.commands.gitPush.description": "مراجع راه‌دور و اشیای مرتبط را به‌روزرسانی می‌کند",
    "playground.commands.gitPush.explanation":
        "کامیت‌های محلی شما را به مخزن راه‌دور می‌فرستد تا دیگران بتوانند آن را ببینند و دریافت کنند.",
    "playground.commands.gitRemote.description": "مخزن‌های راه‌دور را مدیریت می‌کند",
    "playground.commands.gitRemote.explanation":
        "مخزن‌های راه‌دور را فهرست، اضافه یا حذف می‌کند. با 'git remote -v' می‌توانید آدرس‌ها را ببینید.",
    "playground.commands.gitFetch.description": "اشیا و رفرنس‌ها را از راه‌دور دانلود می‌کند",
    "playground.commands.gitFetch.explanation":
        "همهٔ شاخه‌ها و کامیت‌های مخزن راه‌دور را بدون ادغام با شاخه‌های محلی دانلود می‌کند.",
    "playground.commands.gitRestore.description": "فایل‌های پوشهٔ کاری را بازمی‌گرداند",
    "playground.commands.gitRestore.explanation":
        "تغییرات پوشهٔ کاری را (بدون گزینه) برمی‌گرداند یا با --staged فایل‌ها را از مرحلهٔ staging خارج می‌کند.",
    "playground.commands.gitReset.description": "HEAD را به وضعیت مشخصی بازنشانی می‌کند",
    "playground.commands.gitReset.explanation":
        "شاخهٔ شما را به یک کامیت خاص برمی‌گرداند. با --soft تغییرات در staging می‌مانند، --mixed (پیش‌فرض) آنها را unstaged می‌کند و --hard همه‌چیز را حذف می‌کند.",
    "playground.commands.gitRevert.description": "کامیتی می‌سازد که تغییرات را برمی‌گرداند",
    "playground.commands.gitRevert.explanation":
        "کامیت جدیدی می‌سازد که تغییرات کامیت قبلی را معکوس می‌کند. برای شاخه‌های مشترک از reset امن‌تر است.",
    "playground.commands.gitRebase.description": "کامیت‌ها را روی پایه‌ای دیگر دوباره اعمال می‌کند",
    "playground.commands.gitRebase.explanation":
        "تغییرات شما را روی آخرین نسخهٔ شاخهٔ پایه منتقل می‌کند و تاریخچه‌ای تمیزتر از merge ایجاد می‌کند.",
    "playground.commands.gitStash.description": "تغییرات را موقتاً نگه می‌دارد",
    "playground.commands.gitStash.explanation":
        "تغییرات ذخیره‌نشده را موقت ذخیره می‌کند تا بتوانید با پوشهٔ کاری تمیز کار کنید. با 'pop' دوباره اعمالشان کنید.",
    "playground.commands.gitTag.description": "برچسب‌ها را ایجاد، فهرست یا حذف می‌کند",
    "playground.commands.gitTag.explanation":
        "برچسب‌ها نقاط مشخصی از تاریخچهٔ Git را علامت‌گذاری می‌کنند، معمولاً برای انتشار نسخه‌ها. با ‎-a برچسب مشروح می‌سازید.",
    "playground.commands.gitCherryPick.description": "تغییرات کامیت‌های مشخص را اعمال می‌کند",
    "playground.commands.gitCherryPick.explanation":
        "تغییرات کامیت‌های انتخابی را به شاخهٔ فعلی می‌آورد. برای برداشت انتخابی تغییرات از شاخه‌ای دیگر مفید است.",
    "playground.commands.gitBisect.description": "با جستجوی دودویی خطا را پیدا می‌کند",
    "playground.commands.gitBisect.explanation":
        "با علامت‌گذاری کامیت‌ها به عنوان «خوب» یا «بد» کمک می‌کند کامیتی را که خطا را وارد کرده پیدا کنید."
};

export default playground;
