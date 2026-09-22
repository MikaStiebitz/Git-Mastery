const levels = {
    // Level Page
    "level.gitTerminal": "Git Terminal",
    "level.currentChallenge": "Current Challenge",
    "level.objectives": "Objectives:",
    "level.showHints": "Show Hints",
    "level.hideHints": "Hide Hints",
    "level.nextLevel": "Next Level",
    "level.filesToEdit": "Files to Edit:",
    "level.workingTreeClean": "Working tree clean",
    "level.staged": "staged",
    "level.modified": "modified",
    "level.untracked": "untracked",
    "level.gitNotInitialized": "Git is not initialized yet",
    "level.branch": "Branch",
    "level.gitStatus": "Git Status",
    "level.advancedOptions": "Advanced Options",
    "level.hideAdvancedOptions": "Hide Advanced Options",
    "level.resetLevel": "Reset Level",
    "level.resetAllProgress": "Reset All Progress",
    "level.resetConfirm": "Are you sure you want to reset all your progress?",
    "level.resetOptions": "Reset Options",
    "level.resetDescription": "Choose what you want to reset:",
    "level.resetAllConfirm": "Are you sure you want to reset ALL your progress? This cannot be undone!",
    "level.level": "Level",
    "level.levelCompleted": "Level completed!",
    "level.realWorldContext": "Real-World Context",
    "level.task": "Your Task",
    "level.startCoding": "Start Coding",
    "level.storyButton": "Show Story",
    "level.advancedModeOn": "Advanced Mode (On)",
    "level.advancedModeOff": "Advanced Mode (Off)",
    "level.notFound": "Level not found",
    "level.techModeOn": "Focus on Commands (Tech Mode)",
    "level.storyModeOn": "Show Story Context (Story Mode)",
    "level.techModeDescription":
        "Technical mode focuses on Git commands without stories or context for a faster, more direct experience.",
    "level.storyModeDescription":
        "Story mode provides real-world context and explanations to help understand why and how Git commands are used.",
    "level.editFile": "Edit file",
    "level.deleteFile": "Delete file",
    "level.confirmDelete": "Are you sure you want to delete {file}?",
    "level.hints": "Hints",
    "level.tab.challenge": "चुनौती",
    "level.tab.graph": "Git ग्राफ़",

    // Level Visualizer (interactive commit graph)
    "visualizer.emptyTitle": "आपकी Git कहानी यहीं से शुरू होती है",
    "visualizer.emptyInitHint": "`git init` से एक repository बनाएँ और आपका commit ग्राफ़ यहीं बढ़ेगा।",
    "visualizer.emptyCommitHint": "अपना पहला commit करें और देखें कि आपका विज़ुअल पथ यहाँ कैसे दिखता है।",
    "visualizer.branchFilterHint": "इस branch का इतिहास हाइलाइट करने के लिए क्लिक करें",
    "visualizer.zoomIn": "ज़ूम इन",
    "visualizer.zoomOut": "ज़ूम आउट",
    "visualizer.fit": "फ़िट करें",
    "visualizer.mergeCommit": "Merge",
    "visualizer.close": "बंद करें",
    "visualizer.interactHint": "विवरण के लिए commit पर टैप करें · पथ हाइलाइट करने के लिए branch पर टैप करें",

    // Level Content - Intro Stage
    "intro.name": "Git का परिचय",
    "intro.description": "Git की मूल बातें सीखें",

    "intro.level1.name": "Git शुरू करें",
    "intro.level1.description": "एक नई Git रिपॉजिटरी बनाएं",
    "intro.level1.objective1": "एक नई रिपॉजिटरी शुरू (initialize) करें",
    "intro.level1.hint1": "`git init` कमांड का उपयोग करें",
    "intro.level1.hint2": "यह एक छिपी हुई .git डायरेक्टरी बनाता है",
    "intro.level1.requirement1.description": "एक Git रिपॉजिटरी शुरू करें",
    "intro.level1.requirement1.success": "बहुत बढ़िया! आपने एक Git रिपॉजिटरी बना ली है।",
    "intro.level1.story.title": "टीम में आपका स्वागत है",
    "intro.level1.story.narrative":
        "TechStart में एक डेवलपर के रूप में आपकी नई नौकरी में आपका स्वागत है! मैं Alex हूं, आपका टीम लीड।\n\nयह आपका पहला दिन है और हम चाहते हैं कि आप जल्दी ही काम में माहिर हो जाएं। हम अपने वर्जन कंट्रोल के लिए Git का उपयोग करते हैं - यह हमें कोड में हुए बदलावों को ट्रैक करने और एक टीम की तरह साथ काम करने में मदद करता है।\n\nसबसे पहला काम जो आपको करना है, वह है अपने ऑनबोर्डिंग प्रोजेक्ट के लिए एक नई रिपॉजिटरी बनाना। इसके लिए हम `git init` कमांड का उपयोग करते हैं।",
    "intro.level1.story.realWorldContext":
        "असली डेवलपमेंट टीमों में Git बेहद ज़रूरी है। यह किसी भी नए प्रोजेक्ट के लिए सबसे पहला टूल है जिसे आप सेट अप करते हैं।",
    "intro.level1.story.taskIntroduction": "चलिए अपने प्रोजेक्ट के लिए एक नई रिपॉजिटरी बनाते हैं।",

    "intro.level2.name": "रिपॉजिटरी स्टेटस",
    "intro.level2.description": "अपनी रिपॉजिटरी का स्टेटस जांचें",
    "intro.level2.objective1": "अपनी रिपॉजिटरी का स्टेटस दिखाएं",
    "intro.level2.hint1": "`git status` कमांड का उपयोग करें",
    "intro.level2.hint2": "यह कमांड आपकी रिपॉजिटरी का मौजूदा स्टेटस दिखाता है",
    "intro.level2.requirement1.description": "रिपॉजिटरी का स्टेटस दिखाएं",
    "intro.level2.requirement1.success": "बिल्कुल सही! अब आप अपनी रिपॉजिटरी का स्टेटस देख सकते हैं।",
    "intro.level2.story.title": "आपकी रिपो में क्या हो रहा है?",
    "intro.level2.story.narrative":
        "बढ़िया! आपने अपनी पहली Git रिपॉजिटरी बना ली है। छिपी हुई .git डायरेक्टरी में अब वह सारी जानकारी है जिसकी Git को ज़रूरत है।\n\nAlex रुककर कहते हैं: \"बहुत बढ़िया काम! अब आपको यह देखना चाहिए कि आपकी रिपॉजिटरी में क्या हो रहा है। `git status` से आप किसी भी समय मौजूदा स्थिति जांच सकते हैं।\"",
    "intro.level2.story.realWorldContext":
        "डेवलपर दिन में कई बार `git status` चलाते हैं ताकि यह देख सकें कि कौन सी फ़ाइलें बदली गई हैं और कौन सी अगले कमिट के लिए तैयार हैं।",
    "intro.level2.story.taskIntroduction": "`git status` से अपनी रिपॉजिटरी का स्टेटस जांचें।",

    "intro.level3.name": "रिपॉजिटरी क्लोन करना",
    "intro.level3.description": "मौजूदा रिपॉजिटरी को क्लोन करना सीखें",
    "intro.level3.objective1": "एक रिमोट रिपॉजिटरी क्लोन करें",
    "intro.level3.objective2": "क्लोन की गई रिपॉजिटरी में जाएं (नेविगेट करें)",
    "intro.level3.hint1": "`git clone <url>` कमांड का उपयोग करें",
    "intro.level3.hint2": "क्लोन करने के बाद, रिपॉजिटरी फ़ोल्डर में जाने के लिए `cd` का उपयोग करें",
    "intro.level3.hint3": "रिपॉजिटरी URL कोई भी मान्य Git रिपॉजिटरी URL हो सकता है",
    "intro.level3.requirement1.description": "एक रिमोट रिपॉजिटरी क्लोन करें",
    "intro.level3.requirement1.success": "बढ़िया! आपने रिपॉजिटरी क्लोन कर ली है।",
    "intro.level3.requirement2.description": "cd का उपयोग करके क्लोन की गई रिपॉजिटरी में जाएं",
    "intro.level3.requirement2.success": "बिल्कुल सही! अब आप क्लोन की गई रिपॉजिटरी के अंदर हैं।",
    "intro.level3.story.title": "एक मौजूदा प्रोजेक्ट से जुड़ना",
    "intro.level3.story.narrative":
        'TechStart में आपका पहला हफ़्ता बहुत अच्छा चल रहा है! Alex एक रोमांचक खबर के साथ आपको बुलाते हैं।\n\n"हमारे पास एक टीम प्रोजेक्ट है जिसमें आपकी मदद चाहिए," वे कहते हैं। "कोडबेस पहले से हमारे Git सर्वर पर है। इस पर काम शुरू करने के लिए आपको इसे अपनी लोकल मशीन पर क्लोन करना होगा।"\n\nवे समझाते हैं: "जब आप किसी मौजूदा प्रोजेक्ट से जुड़ते हैं, तो आपको शून्य से शुरुआत नहीं करनी पड़ती। इसके बजाय, आप रिमोट रिपॉजिटरी को क्लोन करते हैं, जिससे आपकी मशीन पर एक पूरी कॉपी बन जाती है—सारा कोड, इतिहास और ब्रांचों सहित।"\n\n"इसे ऐसे समझें जैसे लाइब्रेरी से कोई किताब इशू करा रहे हों, बस फ़र्क़ यह है कि आपको पूरी लाइब्रेरी का रिकॉर्ड भी मिल जाता है! शुरू करने के लिए `git clone <repository-url>` का उपयोग करें।"\n\n"क्लोन होने के बाद, आप `cd <folder-name>` से प्रोजेक्ट फ़ोल्डर में जाकर तुरंत काम शुरू कर सकते हैं। प्रोजेक्ट का सारा इतिहास और बदलाव आपके लिए उपलब्ध हैं।"',
    "intro.level3.story.realWorldContext":
        "क्लोनिंग वह तरीका है जिससे डेवलपर मौजूदा प्रोजेक्ट्स से जुड़ते हैं। चाहे ओपन सोर्स में योगदान देना हो या किसी नई टीम से जुड़ना, git clone आमतौर पर पहली कमांड होती है जो आप चलाते हैं।",
    "intro.level3.story.taskIntroduction": "प्रोजेक्ट पर काम शुरू करने के लिए एक रिपॉजिटरी क्लोन करें और उसमें जाएं।",

    // Level Content - Files Stage
    "files.name": "फ़ाइल संचालन",
    "files.description": "Git के साथ फ़ाइलों को मैनेज करना सीखें",

    "files.level1.name": "बदलावों को स्टेज करना",
    "files.level1.description": "फ़ाइलों को स्टेजिंग एरिया में जोड़ें",
    "files.level1.objective1": "सभी फ़ाइलों को स्टेजिंग एरिया में जोड़ें",
    "files.level1.hint1": "`git add .` कमांड का उपयोग करें",
    "files.level1.hint2": "यह डॉट 'मौजूदा डायरेक्टरी की सभी फ़ाइलों' को दर्शाता है",
    "files.level1.requirement1.description": "सभी फ़ाइलों को स्टेजिंग एरिया में जोड़ें",
    "files.level1.requirement1.success": "बढ़िया! आपने सभी फ़ाइलों को स्टेजिंग एरिया में जोड़ दिया है।",
    "files.level1.story.title": "कोड बदलावों की तैयारी",
    "files.level1.story.narrative":
        '"अरे!" आपकी सहकर्मी Sarah बुलाती हैं, "मैं देख रही हूं कि आपने Git से शुरुआत कर दी है। अब आपको बदलावों को स्टेज करना सीखना चाहिए।"\n\nवे समझाती हैं: "जब आप फ़ाइलों में बदलाव करते हैं, तो आपको Git को साफ़-साफ़ बताना होता है कि अगले कमिट में कौन से बदलाव शामिल होने चाहिए। इसे \'स्टेजिंग\' कहते हैं और यह `git add` के ज़रिए होता है।"',
    "files.level1.story.realWorldContext":
        "स्टेजिंग की अवधारणा Git की एक शक्तिशाली विशेषता है। यह आपको केवल चुने हुए बदलावों को कमिट करने देती है, जबकि बाकी बदलाव अभी प्रोग्रेस में रह सकते हैं।",
    "files.level1.story.taskIntroduction": "`git add .` से सभी फ़ाइलों को स्टेजिंग एरिया में जोड़ें।",

    "files.level2.name": "बदलावों को कमिट करना",
    "files.level2.description": "अपने बदलावों के साथ एक कमिट बनाएं",
    "files.level2.objective1": "एक संदेश के साथ कमिट बनाएं",
    "files.level2.hint1": "`git commit -m 'आपका संदेश'` कमांड का उपयोग करें",
    "files.level2.hint2": "संदेश में आपके बदलावों का विवरण होना चाहिए",
    "files.level2.requirement1.description": "एक संदेश के साथ कमिट बनाएं",
    "files.level2.requirement1.success": "शानदार! आपने सफलतापूर्वक एक कमिट बना लिया है।",
    "files.level2.story.title": "आपका पहला कमिट",
    "files.level2.story.narrative":
        '"बहुत बढ़िया!" आपकी प्रगति देखकर Alex कहते हैं। "आपने स्टेजिंग एरिया में बदलाव जोड़ दिए हैं। अब समय है आपके पहले कमिट का।"\n\nवे समझाते हैं: "एक कमिट किसी खास समय पर आपके प्रोजेक्ट का स्नैपशॉट जैसा होता है। हर कमिट के लिए एक संदेश चाहिए जो बताए कि क्या बदला गया। यह ट्रेसेबिलिटी के लिए ज़रूरी है।"',
    "files.level2.story.realWorldContext":
        "अच्छे कमिट संदेश डेवलपमेंट टीमों में बेहद ज़रूरी होते हैं। वे सबको यह समझने में मदद करते हैं कि बदलाव क्यों किया गया, न कि सिर्फ़ क्या बदला गया।",
    "files.level2.story.taskIntroduction": "एक सार्थक संदेश के साथ अपना पहला कमिट बनाएं।",

    "files.level3.name": "फ़ाइलें हटाना",
    "files.level3.description": "Git से फ़ाइलें हटाना सीखें",
    "files.level3.objective1": "वर्किंग डायरेक्टरी और इंडेक्स, दोनों से एक फ़ाइल हटाएं",
    "files.level3.hint1": "`git rm <file>` कमांड का उपयोग करें",
    "files.level3.hint2": "यह फ़ाइल को Git से हटाता है और साथ ही आपकी वर्किंग डायरेक्टरी से भी डिलीट कर देता है",
    "files.level3.requirement1.description": "Git का उपयोग करके एक फ़ाइल हटाएं",
    "files.level3.requirement1.success": "बहुत बढ़िया! आपने फ़ाइल को Git और अपनी वर्किंग डायरेक्टरी, दोनों से हटा दिया है।",
    "files.level3.story.title": "सफ़ाई करना",
    "files.level3.story.narrative":
        '"मैं देख रहा हूं कि आप अच्छी प्रगति कर रहे हैं," आपका काम रिव्यू करते हुए Alex कहते हैं। "लेकिन मुझे कुछ टेम्पररी फ़ाइलें या ड्राफ़्ट दिख रहे हैं जिनकी अब हमें ज़रूरत नहीं है। हमें रिपॉजिटरी साफ़ करनी चाहिए।"\n\nवे समझाते हैं: "जब आप Git में ट्रैक की गई फ़ाइलों को हटाना चाहें, तो सिर्फ़ उन्हें मैन्युअली डिलीट करने के बजाय `git rm` का उपयोग करना चाहिए। इससे यह सुनिश्चित होता है कि Git हटाने को सही तरीके से ट्रैक करे।"',
    "files.level3.story.realWorldContext":
        "अनावश्यक फ़ाइलों को हटाकर रिपॉजिटरी को साफ़ रखना एक अच्छी आदत (best practice) है। `git rm` कमांड यह सुनिश्चित करता है कि Git फ़ाइल के हटाए जाने को ट्रैक करे।",
    "files.level3.story.taskIntroduction": "`git rm` का उपयोग करके रिपॉजिटरी से अनावश्यक फ़ाइल हटाएं।",

    // Level Content - Branches Stage
    "branches.name": "ब्रांच के साथ काम करना",
    "branches.description": "ब्रांच के साथ काम करना सीखें",

    "branches.level1.name": "ब्रांच देखना",
    "branches.level1.description": "अपनी रिपॉजिटरी की सभी ब्रांच दिखाएं",
    "branches.level1.objective1": "सभी मौजूदा ब्रांच दिखाएं",
    "branches.level1.hint1": "`git branch` कमांड का उपयोग करें",
    "branches.level1.hint2": "यह सभी लोकल ब्रांच दिखाता है",
    "branches.level1.requirement1.description": "सभी ब्रांच दिखाएं",
    "branches.level1.requirement1.success": "बहुत बढ़िया! अब आप अपनी रिपॉजिटरी की सभी ब्रांच देख सकते हैं।",
    "branches.level1.story.title": "कोड की ब्रांचें",
    "branches.level1.story.narrative":
        '"अब कुछ थोड़ा एडवांस्ड सीखने का समय है," Alex कहते हैं और व्हाइटबोर्ड पर शाखाओं वाला एक पेड़ बनाते हैं। "ये शाखाएं Git ब्रांच जैसी हैं। इनकी मदद से आप एक साथ अपने कोड के अलग-अलग वर्ज़न पर काम कर सकते हैं।"\n\nवे आगे कहते हैं: "फ़िलहाल आप \'main\' ब्रांच पर काम कर रहे हैं। पहले देखते हैं कि हमारे पास कौन-कौन सी ब्रांच हैं।"',
    "branches.level1.story.realWorldContext":
        "ब्रांच Git की एक बुनियादी अवधारणा है। ये समानांतर डेवलपमेंट, फ़ीचर आइसोलेशन और मुख्य कोड को प्रभावित किए बिना प्रयोग करने की सुविधा देती हैं।",
    "branches.level1.story.taskIntroduction": "git branch से सभी मौजूदा ब्रांच दिखाएं।",

    "branches.level2.name": "ब्रांच बनाना और स्विच करना",
    "branches.level2.description": "एक नई ब्रांच बनाएं और उस पर स्विच करें",
    "branches.level2.objective1": "'feature' नाम की एक नई ब्रांच बनाएं और उस पर स्विच करें",
    "branches.level2.hint1": "`git switch -c feature` कमांड का उपयोग करें",
    "branches.level2.hint2": "-c फ्लैग एक ही चरण में नई ब्रांच बनाता है और उस पर स्विच कर देता है",
    "branches.level2.requirement1.description": "git switch -c का उपयोग करके एक नई ब्रांच बनाएं और उस पर स्विच करें",
    "branches.level2.requirement1.success":
        "शानदार! आपने आधुनिक git switch कमांड का उपयोग करके एक नई ब्रांच बनाई और उस पर स्विच किया।",
    "branches.level2.story.title": "आधुनिक तरीके से ब्रांच बनाना",
    "branches.level2.story.narrative":
        '"बढ़िया! अब हम एक नया फ़ीचर बनाना चाहते हैं," Alex कहते हैं। "इसके लिए, हम \'feature\' नाम की एक नई ब्रांच बनाएंगे ताकि हमारे बदलाव मुख्य कोड को प्रभावित न करें।"\n\nवे आपको आधुनिक तरीका दिखाते हैं: "Git ने ब्रांच ऑपरेशंस को और स्पष्ट बनाने के लिए `git switch` कमांड पेश किया। नई ब्रांच बनाने और एक ही चरण में उस पर स्विच करने के लिए `git switch -c feature` का उपयोग करें। पुराने `git checkout -b` की जगह अब यही पसंदीदा आधुनिक तरीका है।"',
    "branches.level2.story.realWorldContext":
        "पेशेवर डेवलपमेंट टीमों में आप लगभग कभी भी सीधे main ब्रांच पर काम नहीं करते। Git 2.23 में पेश किया गया `git switch` कमांड, पुराने checkout कमांड की तुलना में ब्रांच के साथ काम करने का एक साफ़ और सहज तरीका देता है।",
    "branches.level2.story.taskIntroduction":
        "`git switch -c` का उपयोग करके 'feature' नाम की एक नई ब्रांच बनाएं और उस पर स्विच करें।",

    "branches.level3.name": "ब्रांचों के बीच स्विच करना",
    "branches.level3.description": "मौजूदा ब्रांचों के बीच स्विच करें",
    "branches.level3.objective1": "ब्रांचों के बीच स्विच करें",
    "branches.level3.hint1": "`git switch <branch>` कमांड का उपयोग करें",
    "branches.level3.hint2": "यह किसी मौजूदा ब्रांच पर स्विच करता है",
    "branches.level3.requirement1.description": "git switch का उपयोग करके किसी दूसरी ब्रांच पर स्विच करें",
    "branches.level3.requirement1.success": "बहुत बढ़िया काम! आपने git switch का उपयोग करके ब्रांचों के बीच स्विच किया।",
    "branches.level3.story.title": "ब्रांच नेविगेशन",
    "branches.level3.story.narrative":
        '"अब जब आप जानते हैं कि ब्रांच कैसे बनाई जाती है, चलिए उनके बीच आगे-पीछे जाने का अभ्यास करते हैं," Sarah कहती हैं। "असली डेवलपमेंट के काम में आप यह लगातार करते रहेंगे।"\n\nवे समझाती हैं: "आप `git switch <branch-name>` का उपयोग करके किसी भी मौजूदा ब्रांच पर स्विच कर सकते हैं। यह पुराने `git checkout` से कहीं ज़्यादा स्पष्ट है, जो कई अलग-अलग काम करने की वजह से भ्रमित कर सकता था।"',
    "branches.level3.story.realWorldContext":
        "ब्रांचों के बीच स्विच करना Git के सबसे आम ऑपरेशंस में से एक है। समर्पित `git switch` कमांड मक़सद को साफ़ बना देता है और बहुउद्देश्यीय checkout कमांड की तुलना में भ्रम कम करता है।",
    "branches.level3.story.taskIntroduction": "`git switch` का उपयोग करके किसी दूसरी ब्रांच पर स्विच करने का अभ्यास करें।",

    "branches.level4.name": "Checkout से ब्रांच स्विच करना",
    "branches.level4.description": "ब्रांच स्विच करने की क्लासिक कमांड सीखें",
    "branches.level4.objective1": "क्लासिक कमांड से किसी दूसरी ब्रांच पर स्विच करें",
    "branches.level4.hint1": "`git checkout <branch-name>` कमांड का उपयोग करें",
    "branches.level4.hint2": "checkout ब्रांच स्विच करने की पुरानी कमांड है",
    "branches.level4.requirement1.description": "git checkout का उपयोग करके किसी दूसरी ब्रांच पर स्विच करें",
    "branches.level4.requirement1.success": "बढ़िया! अब आप ब्रांच स्विच करने के दोनों तरीके जानते हैं।",
    "branches.level4.story.title": "पारंपरिक तरीका",
    "branches.level4.story.narrative":
        '"git checkout जानना भी ज़रूरी है," Alex समझाते हैं। "भले ही git switch आधुनिक तरीका है, आप इसे पुराने प्रोजेक्ट्स, ट्यूटोरियल्स और डॉक्यूमेंटेशन में हर जगह देखेंगे।"\n\nवे जोड़ते हैं: "checkout कई काम कर सकता है - ब्रांच स्विच करना, फ़ाइलें रीस्टोर करना, और भी बहुत कुछ। इसीलिए Git ने switch और restore पेश किए - ताकि मक़सद ज़्यादा स्पष्ट हो सके।"',
    "branches.level4.story.realWorldContext":
        "git checkout सालों तक ब्रांच ऑपरेशंस के लिए THE कमांड रहा है। कई डेवलपर और टूल आज भी इसका उपयोग करते हैं। दोनों जानने से आप अलग-अलग प्रोजेक्ट्स और टीमों में ज़्यादा दक्ष बनते हैं।",
    "branches.level4.story.taskIntroduction": "क्लासिक git checkout कमांड का उपयोग करके किसी दूसरी ब्रांच पर स्विच करें।",

    "branches.level5.name": "Switch से ब्रांच बनाना",
    "branches.level5.description": "एक ही चरण में एक नई ब्रांच बनाएं और उस पर स्विच करें",
    "branches.level5.objective1": "एक नई ब्रांच बनाएं",
    "branches.level5.hint1": "`git switch -c <new-branch-name>` कमांड का उपयोग करें",
    "branches.level5.hint2": "-c फ्लैग switch को नई ब्रांच बनाने के लिए कहता है",
    "branches.level5.requirement1.description": "git switch -c का उपयोग करके एक नई ब्रांच बनाएं और उस पर स्विच करें",
    "branches.level5.requirement1.success": "बिल्कुल सही! अब आपने ब्रांच बनाने के दोनों तरीकों में महारत हासिल कर ली है।",
    "branches.level5.story.title": "झटपट ब्रांच बनाना",
    "branches.level5.story.narrative":
        "\"एक और काम की तरकीब,\" Sarah कहती हैं। \"आप 'git switch -c' का उपयोग करके एक नई ब्रांच बना सकते हैं और उसी समय उस पर स्विच भी कर सकते हैं।\"\n\nवे समझाती हैं: \"यह Git में आधुनिक तरीका है। -c फ्लैग का मतलब 'create' है और यह पुराने 'git checkout -b' जैसा ही काम करता है, बस यह ज़्यादा स्पष्ट और सहज है।\"",
    "branches.level5.story.realWorldContext":
        "switch -c पैटर्न ब्रांच बनाने और उस पर स्विच करने का आधुनिक, अनुशंसित तरीका है। इसे Git 2.23 में ब्रांच ऑपरेशंस को checkout के दूसरे कामों से अलग करने और उन्हें ज़्यादा सहज बनाने के लिए पेश किया गया था।",
    "branches.level5.story.taskIntroduction": "git switch -c का उपयोग करके एक नई ब्रांच बनाएं और अपने आप उस पर स्विच हो जाएं।",

    // Level Content - Merge Stage
    "merge.name": "ब्रांचों को मर्ज करना",
    "merge.description": "ब्रांचों को मर्ज करना सीखें",

    "merge.level1.name": "फ़ीचर ब्रांच मर्ज करना",
    "merge.level1.description": "एक फ़ीचर ब्रांच को डेवलपमेंट ब्रांच में मर्ज करें",
    "merge.level1.objective1": "'feature/user-auth' ब्रांच को 'develop' ब्रांच में मर्ज करें",
    "merge.level1.hint1": "आप पहले से ही develop ब्रांच पर हैं",
    "merge.level1.hint2": "फ़ीचर ब्रांच को इंटीग्रेट करने के लिए `git merge feature/user-auth` का उपयोग करें",
    "merge.level1.requirement1.description": "फ़ीचर ब्रांच को मर्ज करें",
    "merge.level1.requirement1.success": "शानदार! फ़ीचर को develop में इंटीग्रेट कर दिया गया है।",
    "merge.level1.story.title": "कोड रिव्यू और इंटीग्रेशन",
    "merge.level1.story.narrative":
        '"आपका फ़ीचर तैयार है!", टीम लीड Sarah कहती हैं। "लेकिन इसे main पर पुश करने से पहले, हमें इसे develop ब्रांच में मर्ज करके टेस्ट करना होगा।"\n\nवे समझाती हैं: "पेशेवर टीमों में, हम कभी सीधे main में मर्ज नहीं करते। पहले feature → develop, टेस्टिंग के लिए, फिर develop → main, प्रोडक्शन के लिए।"',
    "merge.level1.story.realWorldContext":
        "🔍 सर्वश्रेष्ठ अभ्यास: पुल रिक्वेस्ट\n\nअसली प्रोजेक्ट्स में, अब आप GitHub/GitLab पर एक Pull Request (PR) या Merge Request (MR) बनाएंगे:\n\n1️⃣ आप अपनी फ़ीचर ब्रांच पुश करते हैं\n\n2️⃣ आप एक PR खोलते हैं: feature/user-auth → develop\n\n3️⃣ टीम के सदस्य आपके कोड की समीक्षा करते हैं\n\n4️⃣ अप्रूवल के बाद, PR मर्ज हो जाता है\n\nयह मर्ज करने से पहले कोड रिव्यू, चर्चा और ऑटोमेटिक टेस्ट को संभव बनाता है! 🚀",
    "merge.level1.story.taskIntroduction":
        "'feature/user-auth' ब्रांच को 'develop' ब्रांच में मर्ज करें (आप पहले से ही develop पर हैं)।",

    "merge.level2.name": "प्रोडक्शन डिप्लॉय",
    "merge.level2.description": "टेस्ट किए गए कोड को main ब्रांच में मर्ज करें",
    "merge.level2.objective1": "'develop' ब्रांच को 'main' ब्रांच में मर्ज करें",
    "merge.level2.hint1": "आप पहले से ही main ब्रांच पर हैं",
    "merge.level2.hint2": "टेस्ट किए गए कोड को इंटीग्रेट करने के लिए `git merge develop` का उपयोग करें",
    "merge.level2.requirement1.description": "develop को main में मर्ज करें",
    "merge.level2.requirement1.success": "बिल्कुल सही! कोड अब प्रोडक्शन में है।",
    "merge.level2.story.title": "प्रोडक्शन रिलीज़",
    "merge.level2.story.narrative":
        '"शानदार! फ़ीचर develop पर बिल्कुल सही चल रहा है और सारे टेस्ट पास हो गए हैं," Sarah कहती हैं। "अब हम इसे main में मर्ज करके डिप्लॉय कर सकते हैं।"\n\nवे ज़ोर देकर कहती हैं: "main हमारी प्रोडक्शन ब्रांच है। यहां सिर्फ़ टेस्ट किया हुआ, स्थिर कोड आता है। इसीलिए हमने पहले develop पर टेस्ट किया!"',
    "merge.level2.story.realWorldContext":
        "Git Flow वर्कफ़्लो 🌊\n\n📦 main: प्रोडक्शन के लिए तैयार कोड\n\n🔧 develop: इंटीग्रेशन और टेस्टिंग\n\n✨ feature/*: नए फ़ीचर\n\nयह वर्कफ़्लो बिना टेस्ट किए कोड को प्रोडक्शन तक पहुंचने से रोकता है। कई टीमें रिलीज़ ब्रांच का भी उपयोग करती हैं!",
    "merge.level2.story.taskIntroduction": "'develop' ब्रांच को 'main' ब्रांच में मर्ज करें।",

    "merge.level3.name": "मर्ज कॉन्फ्लिक्ट संभालना",
    "merge.level3.description": "कॉन्फ्लिक्ट वाले मर्ज को संभालना या रद्द करना सीखें",
    "merge.level3.objective1": "कॉन्फ्लिक्ट वाला मर्ज रद्द करें",
    "merge.level3.hint1": "`git merge --abort` कमांड का उपयोग करें",
    "merge.level3.hint2": "यह मर्ज प्रक्रिया रोक देगा और मर्ज शुरू होने से पहले की स्थिति में वापस ले जाएगा",
    "merge.level3.requirement1.description": "कॉन्फ्लिक्ट वाला मर्ज रद्द करें",
    "merge.level3.requirement1.success": "बढ़िया काम! आपने मर्ज ऑपरेशन को सफलतापूर्वक रद्द कर दिया है।",
    "merge.level3.story.title": "जब मर्ज गड़बड़ हो जाए",
    "merge.level3.story.narrative":
        '"कभी-कभी मर्ज योजना के मुताबिक नहीं होते," Sarah चेतावनी देती हैं। "जब किसी फ़ाइल के एक ही हिस्से को दोनों ब्रांचों में अलग-अलग तरीके से बदला गया हो, तो मर्ज कॉन्फ्लिक्ट होता है।"\n\nवे समझाती हैं: "आपके पास दो विकल्प हैं: या तो आप कॉन्फ्लिक्ट को मैन्युअली सुलझाएं, या फिर `git merge --abort` से मर्ज रद्द करके बेहतर तैयारी करें।"',
    "merge.level3.story.realWorldContext":
        "मर्ज कॉन्फ्लिक्ट सहयोगी डेवलपमेंट का एक सामान्य हिस्सा हैं। इन्हें संभालना जानना—चाहे सुलझाकर या अस्थायी रूप से रद्द करके—एक ज़रूरी हुनर है।",
    "merge.level3.story.taskIntroduction": "git merge --abort का उपयोग करके मर्ज ऑपरेशन रद्द करने का अभ्यास करें।",

    // Stash Stage
    "stash.name": "Git Stash",
    "stash.description": "अपने बदलावों को अस्थायी रूप से सहेजना सीखें",

    "stash.level1.name": "अपना काम स्टैश करें",
    "stash.level1.description": "बदलावों को अस्थायी रूप से सहेजना और ब्रांचों के बीच स्विच करना सीखें",
    "stash.level1.objective1": "अपने प्रगति में चल रहे बदलावों को सहेजें",
    "stash.level1.objective2": "अर्जेंट समस्या संभालने के लिए hotfix ब्रांच पर स्विच करें",
    "stash.level1.objective3": "अपना काम जारी रखने के लिए feature ब्रांच पर वापस लौटें",
    "stash.level1.objective4": "अपने स्टैश किए गए बदलाव वापस लाएं",
    "stash.level1.hint1": "अपने बदलावों को अस्थायी रूप से सहेजने के लिए 'git stash' का उपयोग करें",
    "stash.level1.hint2": "'git switch <branch-name>' या 'git checkout <branch-name>' से ब्रांच स्विच करें",
    "stash.level1.hint3": "'git stash pop' से अपने बदलाव वापस लाएं",
    "stash.level1.hint4": "'git stash list' से स्टैश लिस्ट देखें",
    "stash.level1.requirement1.description": "अपने प्रगति में चल रहे बदलावों को स्टैश करें",
    "stash.level1.requirement1.success": "✅ बढ़िया! आपके बदलाव सुरक्षित रूप से स्टैश हो गए हैं!",
    "stash.level1.requirement2.description": "hotfix ब्रांच पर स्विच करें",
    "stash.level1.requirement2.success": "✅ बिल्कुल सही! अब आप hotfix ब्रांच पर हैं।",
    "stash.level1.requirement3.description": "feature ब्रांच पर वापस लौटें",
    "stash.level1.requirement3.success": "✅ बढ़िया! feature ब्रांच पर वापस आ गए।",
    "stash.level1.requirement4.description": "अपने स्टैश किए गए बदलाव वापस लाएं",
    "stash.level1.requirement4.success": "✅ शानदार! आपके बदलाव वापस आ गए हैं!",
    "stash.level1.story.title": "आपातकालीन बाधा",
    "stash.level1.story.narrative":
        'आप पूरी तरह अपने काम में डूबे हुए हैं, एक नए फ़ीचर पर काम कर रहे हैं। आपका कोड आधा-अधूरा है, टेस्ट टूटे हुए हैं, और अचानक... Slack में धमाका हो जाता है! 💥\n\n"अर्जेंट: प्रोडक्शन डाउन है! अभी hotfix चाहिए!" 🚨\n\nआप इस गड़बड़ को कमिट नहीं कर सकते, लेकिन इसे यूं छोड़ भी नहीं सकते। आप क्या करेंगे?\n\n**git stash आज़माएं** - आपका आपातकालीन सेव बटन! 🎯\n\nइसे वीडियो गेम में पॉज़ दबाने जैसा समझें। आपका काम एक ख़ास जगह पर सहेज दिया जाता है, आपकी वर्कस्पेस साफ़ हो जाती है, और आप दूसरा काम शुरू कर सकते हैं। वापस आने पर बस रीज़्यूम दबाएं (git stash pop) और ठीक वहीं से जारी रखें जहां आपने छोड़ा था!',
    "stash.level1.story.realWorldContext":
        "असली डेवलपमेंट में, बाधाएं लगातार आती रहती हैं। प्रोडक्ट मैनेजर्स को 'त्वरित बदलाव' चाहिए होते हैं, प्रोडक्शन में बग सामने आते हैं, और साथियों को अर्जेंट कोड रिव्यू चाहिए होता है। Git stash बिना अपना फ़्लो खोए संदर्भ बदलने का आपका सर्वाइवल टूल है।",
    "stash.level1.story.taskIntroduction":
        "चलिए स्टैश वर्कफ़्लो का अभ्यास करते हैं: अपना काम सहेजें, इमरजेंसी संभालें, फिर आगे बढ़ें!",

    "stash.level2.name": "एक साथ कई काम संभालना",
    "stash.level2.description": "स्टैश का उपयोग करके कई कामों के बीच स्विच करने में महारत हासिल करें",
    "stash.level2.objective1": "अपने मौजूदा अधूरे काम को स्टैश करें",
    "stash.level2.objective2": "नई फ़ीचर ब्रांच बनाने के लिए main ब्रांच पर स्विच करें",
    "stash.level2.objective3": "एक नई फ़ीचर ब्रांच बनाएं",
    "stash.level2.objective4": "अपनी पुरानी टास्क ब्रांच पर वापस लौटें",
    "stash.level2.objective5": "अपना स्टैश किया हुआ काम वापस लाएं",
    "stash.level2.hint1": "स्टैश करके शुरू करें: git stash",
    "stash.level2.hint2": "main पर स्विच करें: git switch main (या git checkout main)",
    "stash.level2.hint3": "नई ब्रांच बनाएं: git switch -c feature/new-task (या git checkout -b feature/new-task)",
    "stash.level2.hint4": "पुराने टास्क पर वापस जाएं: git switch feature/old-task",
    "stash.level2.hint5": "काम वापस लाएं: git stash pop",
    "stash.level2.requirement1.description": "अपने अधूरे काम को स्टैश करें",
    "stash.level2.requirement1.success": "✅ काम स्टैश हो गया! टास्क बदलने के लिए तैयार।",
    "stash.level2.requirement2.description": "main ब्रांच पर स्विच करें",
    "stash.level2.requirement2.success": "✅ अब आप main ब्रांच पर हैं।",
    "stash.level2.requirement3.description": "feature/new-task ब्रांच बनाएं",
    "stash.level2.requirement3.success": "✅ नई ब्रांच बन गई!",
    "stash.level2.requirement4.description": "feature/old-task पर वापस लौटें",
    "stash.level2.requirement4.success": "✅ अपने पुराने टास्क पर वापस आ गए।",
    "stash.level2.requirement5.description": "अपना स्टैश किया हुआ काम वापस लाएं",
    "stash.level2.requirement5.success": "✅ बिल्कुल सही! काम वापस आ गया!",
    "stash.level2.story.title": "मल्टी-टास्किंग मास्टर",
    "stash.level2.story.narrative":
        '"अरे, क्या आप इस नए फ़ीचर रिक्वेस्ट पर जल्दी से काम कर सकते हैं?", आपके प्रोडक्ट ओनर पूछते हैं।\n\nआप एक दूसरे टास्क के बीच में हैं। पहले आपको सब कुछ कमिट करना पड़ता या बदलाव खोने पड़ते।\n\n"इसके लिए Stash एकदम सही है," आपके सीनियर डेवलपर Marc समझाते हैं। "अपना मौजूदा काम सहेजो, नए टास्क के लिए एक नई ब्रांच बनाओ, और बाद में बस पुराना काम वापस ले लो।"',
    "stash.level2.story.realWorldContext":
        "**टीम की ज़िंदगी में Stash**\n\nडेवलपर अक्सर कई कामों को एक साथ संभालते हैं:\n\n- स्प्रिंट प्लानिंग प्राथमिकताएं बदल देती है\n- अर्जेंट बग फ़ीचर के काम में बाधा डालते हैं\n- कोड रिव्यू के लिए संदर्भ बदलना पड़ता है\n- मीटिंग्स फ़्लो में बाधा डालती हैं\n\n**Git Stash संदर्भ बदलना आसान बना देता है!**\n\nStash के बिना आपको या तो:\n- अधूरा कोड कमिट करना पड़ता (इतिहास के लिए बुरा)\n- बदलाव छोड़ने पड़ते (काम खो जाता)\n- गंदी स्थिति में रहना पड़ता (स्विच नहीं कर सकते)\n\nStash के साथ: सहेजो, स्विच करो, काम करो, वापस आओ - सब कुछ साफ़! ✨",
    "stash.level2.story.taskIntroduction":
        "अपना काम स्टैश करें, main पर स्विच करें, नई ब्रांच बनाएं, पुराने टास्क पर लौटें और अपना काम वापस लाएं।",

    "stash.level3.name": "स्टैश मैनेज करना",
    "stash.level3.description": "स्टैश एंट्रीज़ को लिस्ट करना और मैनेज करना सीखें",
    "stash.level3.objective1": "सभी स्टैश किए गए बदलाव देखें",
    "stash.level3.objective2": "सबसे हाल के स्टैश को वापस लाएं",
    "stash.level3.hint1": "सभी स्टैश देखने के लिए 'git stash list' का उपयोग करें",
    "stash.level3.hint2": "'git stash pop' से स्टैश वापस लाएं",
    "stash.level3.hint3": "स्टैश एक स्टैक की तरह सहेजे जाते हैं (LIFO - Last In, First Out)",
    "stash.level3.requirement1.description": "सभी स्टैश एंट्रीज़ लिस्ट करें",
    "stash.level3.requirement1.success": "✅ स्टैश दिखा दिए गए!",
    "stash.level3.requirement2.description": "सबसे हाल का स्टैश वापस लाएं",
    "stash.level3.requirement2.success": "✅ स्टैश वापस आ गया!",
    "stash.level3.story.title": "स्टैश का संगठन",
    "stash.level3.story.narrative":
        '"रुको, मैंने वे बदलाव कहां स्टैश किए थे?", आप सोचते हैं।\n\n"`git stash list` का उपयोग करो," Lisa कहती हैं। "यह सभी सहेजे गए स्टैश दिखाता है। `git stash pop` से आप सबसे नया वापस लाते हैं और उसे स्टैश से हटा देते हैं।"\n\nवे आगे कहती हैं: "`git stash apply` भी है - यह स्टैश को लागू करता है लेकिन उसे बनाए रखता है। जब आपको एक ही बदलाव कई बार चाहिए हों तो यह उपयोगी है!"',
    "stash.level3.story.realWorldContext":
        '**स्टैश मैनेजमेंट कमांड**\n\n`git stash list` - सभी स्टैश दिखाता है\n\n`git stash pop` - स्टैश लागू करता है और हटा देता है\n\n`git stash apply` - स्टैश लागू करता है, उसे बनाए रखता है\n\n`git stash drop` - एक स्टैश हटाता है\n\n`git stash clear` - सभी स्टैश हटाता है\n\n**प्रो टिप**: अपने स्टैश को `git stash push -m "WIP: Feature X"` से नाम दें - इससे लिस्ट ज़्यादा व्यवस्थित दिखती है!',
    "stash.level3.story.taskIntroduction": "अपने स्टैश लिस्ट करें और सबसे हाल वाला वापस लाएं।",

    // Remote Stage
    "remote.name": "रिमोट रिपॉजिटरी",
    "remote.description": "रिमोट रिपॉजिटरी के साथ काम करना सीखें",

    // Remote Level 1
    "remote.level1.name": "रिमोट जोड़ना",
    "remote.level1.description": "एक रिमोट रिपॉजिटरी से कनेक्ट करें",
    "remote.level1.objective1": "एक रिमोट रिपॉजिटरी जोड़ें",
    "remote.level1.hint1": "`git remote add <name> <url>` कमांड का उपयोग करें",
    "remote.level1.hint2": "परंपरा के अनुसार अपने मुख्य रिमोट का नाम 'origin' रखा जाता है",
    "remote.level1.requirement1.description": "एक रिमोट रिपॉजिटरी जोड़ें",
    "remote.level1.requirement1.success": "शानदार! आपने एक रिमोट रिपॉजिटरी जोड़ दी है।",
    "remote.level1.story.title": "रिपॉजिटरी को जोड़ना",
    "remote.level1.story.narrative":
        '"अब तक बहुत बढ़िया प्रगति! अब समय है अपनी लोकल रिपॉजिटरी को एक रिमोट रिपॉजिटरी से जोड़ने का," Alex कहते हैं। "इससे आप अपना कोड टीम के साथ शेयर कर पाएंगे और असरदार तरीके से सहयोग कर पाएंगे।"\n\nवे समझाते हैं: "पहला कदम है `git remote add` का उपयोग करके रिमोट रिपॉजिटरी से एक कनेक्शन जोड़ना। इससे अभी कोई कोड ट्रांसफ़र नहीं होता—यह सिर्फ़ कनेक्शन बनाता है।"',
    "remote.level1.story.realWorldContext":
        "सहयोगी डेवलपमेंट वर्कफ़्लो में रिमोट रिपॉजिटरी केंद्रीय भूमिका निभाती हैं। GitHub, GitLab और Bitbucket जैसे ज़्यादातर Git-आधारित सिस्टम रिमोट रिपॉजिटरी होस्ट करके काम करते हैं जिनसे टीम के सदस्य जुड़ते हैं।",
    "remote.level1.story.taskIntroduction": "अपनी रिपॉजिटरी में 'origin' नाम का एक रिमोट जोड़ें।",

    // Remote Level 2
    "remote.level2.name": "रिमोट पर कमिट पुश करना",
    "remote.level2.description": "जानें कि अपने कमिट कब और कैसे अपलोड करें",
    "remote.level2.objective1": "अपने लोकल कमिट को रिमोट रिपॉजिटरी पर पुश करें",
    "remote.level2.objective2": "लोकल कमिट और रिमोट पुश के बीच अंतर समझें",
    "remote.level2.hint1": "main ब्रांच पर पुश करने के लिए `git push origin main` का उपयोग करें",
    "remote.level2.hint2":
        "ज़रूरी: कमिट करने के बाद ही पुश करें! पुश आपके कमिट अपलोड करता है, अलग-अलग फ़ाइलें नहीं।",
    "remote.level2.hint3": "टिप: अपने पास मौजूद कमिट देखने के लिए `git log` का उपयोग करें",
    "remote.level2.requirement1.description": "अपने कमिट रिमोट पर पुश करें",
    "remote.level2.requirement1.success": "बिल्कुल सही! आपके कमिट अब रिमोट रिपॉजिटरी में उपलब्ध हैं।",
    "remote.level2.story.title": "लोकल से रिमोट रिपॉजिटरी तक",
    "remote.level2.story.narrative":
        '"मैं आपको दिखाता हूं कि Git वर्कफ़्लो कैसे काम करता है," Alex एक डायग्राम बनाते हुए कहते हैं:\n\n1️⃣ आप फ़ाइलें बदलते हैं (Working Directory)\n2️⃣ आप उन्हें `git add` से स्टेज करते हैं (Staging Area)\n3️⃣ आप उन्हें `git commit` से कमिट करते हैं (Local Repository)\n4️⃣ आप `git push` से पुश करते हैं (Remote Repository)\n\n"समझने वाली ज़रूरी बात: git push आपके COMMITS अपलोड करता है, अलग-अलग फ़ाइलें नहीं! पुश करने से पहले आपको एक कमिट बनाना ही होगा। आपके लोकल कमिट तब तक सिर्फ़ आपके कंप्यूटर पर मौजूद रहते हैं जब तक आप उन्हें पुश न करें।"',
    "remote.level2.story.realWorldContext":
        "लोकल और रिमोट रिपॉजिटरी के बीच का अंतर बुनियादी है: लोकल कमिट सिर्फ़ आपकी मशीन पर मौजूद होते हैं। git push के ज़रिए ही वे आपकी टीम को दिखाई देते हैं। इसका मतलब: आप जितने चाहें उतने लोकल कमिट बना सकते हैं और फिर उन सबको एक साथ पुश कर सकते हैं!",
    "remote.level2.story.taskIntroduction":
        "आपने पहले ही एक कमिट बना लिया है। अब `git push origin main` का उपयोग करके इस कमिट को रिमोट रिपॉजिटरी पर पुश करें।",

    "remote.level3.name": "फ़ीचर ब्रांच पुश करना",
    "remote.level3.description": "एक फ़ीचर ब्रांच को रिमोट रिपॉजिटरी पर पुश करें",
    "remote.level3.objective1": "अपनी फ़ीचर ब्रांच को उसके सभी कमिट के साथ पुश करें",
    "remote.level3.hint1": "`git push origin <branch-name>` का उपयोग करें",
    "remote.level3.hint2": "अपस्ट्रीम सेट करने के लिए आप `git push -u origin <branch-name>` भी उपयोग कर सकते हैं",
    "remote.level3.requirement1.description": "एक फ़ीचर ब्रांच रिमोट पर पुश करें",
    "remote.level3.requirement1.success": "शानदार! आपकी फ़ीचर ब्रांच अब रिमोट रिपॉजिटरी में उपलब्ध है।",
    "remote.level3.story.title": "फ़ीचर शेयर करना",
    "remote.level3.story.narrative":
        '"आप एक अलग ब्रांच पर एक शानदार नए फ़ीचर पर काम कर रहे थे," Sarah कहती हैं। "अब समय है इस ब्रांच को रिमोट रिपॉजिटरी पर पुश करने का ताकि बाकी टीम के सदस्य आपका काम देख और रिव्यू कर सकें।"\n\nवे समझाती हैं: "किसी ब्रांच को पहली बार पुश करते समय, आपको -u (या --set-upstream) विकल्प का उपयोग करना चाहिए। इससे आपकी लोकल ब्रांच रिमोट ब्रांच से जुड़ जाती है, जिससे भविष्य में पुश और पुल करना आसान हो जाता है।"',
    "remote.level3.story.realWorldContext":
        "पेशेवर टीमों में, नए फ़ीचर आमतौर पर अलग-अलग ब्रांचों पर डेवलप किए जाते हैं और फिर मुख्य कोडबेस में मर्ज होने से पहले रिव्यू के लिए पुश किए जाते हैं। यह पुल रिक्वेस्ट वर्कफ़्लो का एक अहम हिस्सा है।",
    "remote.level3.story.taskIntroduction": "अपनी फ़ीचर ब्रांच को रिमोट रिपॉजिटरी पर पुश करें ताकि बाकी लोग इसे देख सकें।",

    // Reset Stage
    "reset.name": "कमिट पूर्ववत करना",
    "reset.description": "कमिट पूर्ववत करना और इतिहास में पीछे जाना सीखें",

    "reset.level1.name": "Soft Reset - बदलाव बनाए रखें",
    "reset.level1.description": "पिछले कमिट पर वापस जाएं लेकिन अपने बदलाव बनाए रखें",
    "reset.level1.objective1": "बदलावों को staged रखते हुए आख़िरी कमिट पूर्ववत करें",
    "reset.level1.objective2": "अवधारणा समझने के लिए HEAD (मौजूदा कमिट) पर रीसेट करें",
    "reset.level1.objective3": "HEAD~n नोटेशन का उपयोग करके किसी विशेष पिछले कमिट पर रीसेट करें",
    "reset.level1.hint1": "आसान शुरुआत करें: git reset --soft HEAD~1 (आख़िरी कमिट पूर्ववत करें)",
    "reset.level1.hint2": "पहले कमिट इतिहास देखें: git log --oneline",
    "reset.level1.hint3": "git reset --soft HEAD सब कुछ वैसे ही रखता है (कोई बदलाव नहीं)",
    "reset.level1.hint4": "git reset --soft HEAD~2 दो कमिट पीछे जाता है",
    "reset.level1.hint5": "--soft रीसेट के बाद फ़ाइलें staged रहती हैं - कमिट संदेश ठीक करने के लिए बिल्कुल सही!",
    "reset.level1.hint6": "रीसेट के बाद क्या staged है, यह देखने के लिए git status का उपयोग करें",
    "reset.level1.requirement1.description": "--soft का उपयोग करके आख़िरी कमिट पूर्ववत करें",
    "reset.level1.requirement1.success": "✅ बढ़िया! कमिट चला गया लेकिन फ़ाइलें अब भी staged हैं!",
    "reset.level1.requirement2.description": "अवधारणा समझने के लिए HEAD पर रीसेट करें",
    "reset.level1.requirement2.success": "✅ बिल्कुल सही! HEAD पर रीसेट का मतलब है 'जहां हो वहीं रहो' - कोई बदलाव नहीं!",
    "reset.level1.requirement3.description": "HEAD~n का उपयोग करके किसी पुराने कमिट पर रीसेट करें",
    "reset.level1.requirement3.success": "✅ शानदार! आपने soft reset के लिए HEAD~n नोटेशन में महारत हासिल कर ली है!",
    "reset.level1.story.title": "git reset --soft को समझना",
    "reset.level1.story.narrative": `🔄 **git reset --soft को समझना**

**स्थिति:**
आप एक फ़ीचर पर काम कर रहे हैं और आपने 5 कमिट बना दिए हैं। लेकिन पीछे मुड़कर देखने पर आपको पता चलता है:
- कमिट 5: "Add database config" - ओह! इसमें संवेदनशील क्रेडेंशियल्स हैं! 🔐
- कमिट 4: "Update API endpoints" - यह ठीक है ✅
- कमिट 3: "Add authentication" - ठीक है ✅
- कमिट 2: "Setup routing" - ठीक है ✅
- कमिट 1: "Initial project setup" - ठीक है ✅

आपको कमिट 5 को पूर्ववत करना है, उसे ठीक करना है, और फिर से सही तरीके से कमिट करना है!

**git reset --soft क्या है?**
Git कमिट को डिब्बों के ढेर 📦📦📦 जैसा समझें। हर डिब्बा एक कमिट है।

\`git reset --soft\` ढेर के सबसे ऊपर से डिब्बे हटाता है, लेकिन सारी चीज़ों (आपके बदलावों) को एक स्टेजिंग टेबल पर रखता है, नए डिब्बे में पैक होने के लिए तैयार!

**git reset --soft उपयोग करने के तीन तरीके:**

**1. पिछले कमिट पर रीसेट करें (सबसे आम):**
\`git reset --soft HEAD~1\`
- HEAD = "आप अभी कहां हैं" (सबसे ऊपर वाला डिब्बा)
- ~1 = "1 डिब्बा पीछे जाओ"
- नतीजा: आख़िरी कमिट हट गया, लेकिन बदलाव staged रहते हैं!

**2. HEAD पर रीसेट करें (शैक्षिक - कुछ नहीं होता):**
\`git reset --soft HEAD\`
- इसका मतलब है "जहां मैं पहले से हूं वहीं रीसेट करो"
- कुछ नहीं होता! अवधारणा समझने के लिए अच्छा है।

**3. किसी पुराने कमिट पर रीसेट करें:**
\`git reset --soft HEAD~3\`
- 3 कमिट पीछे जाता है
- उन 3 कमिट के सारे बदलाव staged रहते हैं
- कई कमिट को एक में मिलाने के लिए बिल्कुल सही!

**आपका मिशन:**

**चरण 1:** आख़िरी कमिट हटाएं (जिसमें क्रेडेंशियल्स हैं)
\`git reset --soft HEAD~1\`
\`git status\` से जांचें - आपकी फ़ाइलें अब भी staged हैं! ✨

**चरण 2:** HEAD पर रीसेट करके देखें (शैक्षिक)
\`git reset --soft HEAD\`
ध्यान दें: कुछ नहीं बदला! आप पहले से ही HEAD पर हैं।

**चरण 3:** अभ्यास के लिए और पीछे जाएं
\`git reset --soft HEAD~2\`
अब आपने 2 कमिट हटा दिए हैं, लेकिन फ़ाइलें अब भी staged हैं!

**याद रखें:**
- 📦 कमिट इतिहास से हट जाते हैं
- ✅ फ़ाइलें staging area में रहती हैं
- 🎯 कमिट संदेश ठीक करने या कमिट मिलाने के लिए बिल्कुल सही
- ⚠️  सिर्फ़ उन्हीं कमिट पर उपयोग करें जो अभी पुश नहीं हुए हैं!

चलिए इन तीन तरीकों का अभ्यास करते हैं! 🚀`,
    "reset.level1.story.realWorldContext":
        "जब आप अपने आख़िरी कमिट को बिना काम खोए ठीक करना चाहते हैं, तब git reset --soft बेहद उपयोगी है। आप बदलाव एडिट करके फिर से कमिट कर सकते हैं।",
    "reset.level1.story.taskIntroduction":
        "git reset --soft को अलग-अलग टारगेट के साथ आज़माएं: HEAD~1, HEAD, और HEAD~2।",

    "reset.level2.name": "Hard Reset - सब कुछ मिटा दें",
    "reset.level2.description": "पिछले कमिट पर वापस जाएं और सारे बदलाव मिटा दें",
    "reset.level2.objective1": "आख़िरी बग वाले कमिट को पूरी तरह मिटा दें",
    "reset.level2.objective2": "यह समझने के लिए HEAD पर रीसेट करें कि यह कुछ नहीं करता",
    "reset.level2.objective3": "कई कमिट पीछे जाएं और सब कुछ मिटा दें",
    "reset.level2.hint1": "⚠️  चेतावनी: --hard विनाशकारी है! सारे बदलाव हमेशा के लिए खो जाते हैं!",
    "reset.level2.hint2": "पहले देखें कि आप क्या खोने वाले हैं: git log --oneline",
    "reset.level2.hint3": "git reset --hard HEAD~1 आख़िरी कमिट AND सारे बदलाव हटा देता है",
    "reset.level2.hint4": "git reset --hard HEAD कुछ नहीं करता (पहले से ही HEAD पर हैं)",
    "reset.level2.hint5": "git reset --hard HEAD~3 तीन कमिट पीछे जाता है, सब कुछ मिटा देता है",
    "reset.level2.hint6": "इसका उपयोग तब करें जब आपको ख़राब कोड पूरी तरह फेंकना हो",
    "reset.level2.hint7": "💡 असल ज़िंदगी में: --hard सिर्फ़ उस कोड पर उपयोग करें जो अभी पुश नहीं हुआ!",
    "reset.level2.requirement1.description": "--hard का उपयोग करके आख़िरी कमिट मिटा दें",
    "reset.level2.requirement1.success": "💥 कमिट और सारे बदलाव नष्ट! अब वापसी नहीं!",
    "reset.level2.requirement2.description": "HEAD पर रीसेट करें (शैक्षिक - कुछ नहीं होता)",
    "reset.level2.requirement2.success": "✅ कुछ नहीं बदला - आप पहले से ही HEAD पर हैं!",
    "reset.level2.requirement3.description": "--hard का उपयोग करके कई कमिट मिटा दें",
    "reset.level2.requirement3.success": "💥 कई कमिट नष्ट! वर्कस्पेस फिर से साफ़ है!",
    "reset.level2.story.title": "git reset --hard को समझना - THE NUCLEAR OPTION",
    "reset.level2.story.narrative": `⚠️  **git reset --hard को समझना - THE NUCLEAR OPTION**

**स्थिति:**
शुक्रवार की शाम है। आप पूरे दिन एक नए फ़ीचर के साथ प्रयोग कर रहे हैं:
- कमिट 6: "Try experimental algorithm v3" - पूरी तरह टूटा हुआ! 💀
- कमिट 5: "Try experimental algorithm v2" - फिर भी टूटा हुआ! 🐛
- कमिट 4: "Try experimental algorithm v1" - नहीं चला! ❌
- कमिट 3: "Add user dashboard" - यह काम कर रहा था! ✅
- कमिट 2: "Add user authentication" - ठीक है ✅
- कमिट 1: "Initial project" - ठीक है ✅

आपको एहसास होता है: ये प्रयोग बेकार हैं। आप इन्हें हमेशा के लिए ख़त्म करना चाहते हैं। 💣

**git reset --hard क्या है?**
वही डिब्बों वाली मिसाल याद है? 📦📦📦

\`git reset --soft\` डिब्बे हटाता था लेकिन चीज़ों को स्टेजिंग टेबल पर रखता था।

\`git reset --hard\` डिब्बे हटाता है AND सारी चीज़ें कूड़ेदान में फेंक देता है! 🗑️

**⚠️  बेहद ज़रूरी: यह विनाशकारी और स्थायी है!**
- कमिट इतिहास से डिलीट हो जाते हैं
- फ़ाइलों के सारे बदलाव डिलीट हो जाते हैं
- वर्किंग डायरेक्टरी साफ़ हो जाती है
- स्टेजिंग एरिया खाली हो जाता है
- **इसे वापस नहीं लिया जा सकता!**

**git reset --hard उपयोग करने के तीन तरीके:**

**1. आख़िरी कमिट नष्ट करें (सबसे आम):**
\`git reset --hard HEAD~1\`
- आख़िरी कमिट हटाता है
- उस कमिट के सारे बदलाव डिलीट कर देता है
- वर्किंग डायरेक्टरी पिछले कमिट जैसी दिखने लगती है
- ⚠️  बदलाव हमेशा के लिए चले गए!

**2. HEAD पर रीसेट करें (शैक्षिक - कुछ नहीं होता):**
\`git reset --hard HEAD\`
- इसका मतलब है "मेरी वर्कस्पेस को HEAD जैसा बना दो"
- चूंकि आप पहले से ही HEAD पर हैं, कुछ नहीं बदलता
- समझने के लिए अच्छा: HEAD = मौजूदा स्थिति

**3. कई कमिट नष्ट करें:**
\`git reset --hard HEAD~4\`
- 4 कमिट पीछे जाता है
- सारे 4 कमिट इतिहास से DELETE हो जाते हैं
- उन कमिट के सारे बदलाव DELETE हो जाते हैं
- मानो वे कभी थे ही नहीं! 👻

**--hard कब उपयोग करें:**
- ✅ प्रयोग असफल रहा, उसे फेंक दें
- ✅ सब कुछ टूट गया, दोबारा शुरू करना है
- ✅ गलती से सीक्रेट्स/पासवर्ड कमिट हो गए
- ❌ उन कमिट पर नहीं जो आप पहले ही पुश कर चुके हैं!
- ❌ अगर बाद में बदलावों की ज़रूरत पड़ सकती है तो नहीं!

**आपका मिशन:**

**चरण 1:** आख़िरी टूटा हुआ कमिट नष्ट करें
\`git reset --hard HEAD~1\`
\`git status\` से जांचें - वर्कस्पेस साफ़ है! 🧹

**चरण 2:** HEAD पर रीसेट करके देखें (सुरक्षित अभ्यास)
\`git reset --hard HEAD\`
कुछ नहीं होता - आप पहले से ही वहां हैं!

**चरण 3:** कई असफल प्रयोग नष्ट करें
\`git reset --hard HEAD~3\`
सारे 3 ख़राब कमिट चले गए! मानो शुक्रवार कभी हुआ ही न हो! 😅

**याद रखें:**
- 💥 यह NUCLEAR OPTION है
- 🗑️  सब कुछ डिलीट हो जाता है - कमिट AND बदलाव
- ⏪ वापस नहीं लिया जा सकता (जब तक आपके पास कमिट हैश न हो)
- 🎯 सिर्फ़ तभी उपयोग करें जब आप 100% निश्चित हों
- ⚠️  पुश किए गए कमिट पर कभी उपयोग न करें!

**मज़ेदार तथ्य:** पेशेवर डेवलपर जब पूरी तरह दोबारा शुरू करना चाहते हैं तो कहते हैं "मैं इस पर hard reset करने जा रहा हूं"! 🔥

सुरक्षित विनाश का अभ्यास करने के लिए तैयार हैं? चलिए शुरू करते हैं! 💪`,
    "reset.level2.story.realWorldContext":
        "--hard reset एक शक्तिशाली लेकिन ख़तरनाक टूल है। इसका उपयोग तब होता है जब आपको वाकई एक साफ़ शुरुआत चाहिए। टीमों में, पुश किए गए कमिट पर reset करते समय सावधान रहें - यह दूसरों को भ्रमित कर सकता है।",
    "reset.level2.story.taskIntroduction":
        "Nuclear option का अभ्यास करें: कमिट और बदलावों को पूरी तरह मिटाने के लिए git reset --hard का उपयोग करें।",

    "reset.level3.name": "किसी विशेष कमिट पर रीसेट करना",
    "reset.level3.description": "इतिहास में किसी विशेष कमिट पर वापस जाएं",
    "reset.level3.objective1": "कमिट इतिहास देखें और अच्छे कमिट की पहचान करें",
    "reset.level3.objective2": "किसी कमिट के हैश का उपयोग करके उस पर रीसेट करें",
    "reset.level3.hint1": "पहले, अपना कमिट इतिहास जांचें: git log --oneline",
    "reset.level3.hint2": "हर कमिट का एक यूनिक हैश होता है (जैसे 'a1b2c3d')",
    "reset.level3.hint3": "git reset --soft <commit-hash> बदलावों को staged रखता है",
    "reset.level3.hint4": "git reset --hard <commit-hash> उस कमिट के बाद सब कुछ नष्ट कर देता है",
    "reset.level3.hint5": "कमिट हैश स्थायी ID होते हैं - HEAD~n सापेक्ष (relative) होता है",
    "reset.level3.hint6": "प्रो टिप: आपको हैश के सिर्फ़ पहले 7 अक्षर चाहिए!",
    "reset.level3.hint7": "'Version 2 - Good version' ढूंढें और उसका हैश उपयोग करें",
    "reset.level3.requirement1.description": "अच्छे कमिट की पहचान करने के लिए कमिट इतिहास देखें",
    "reset.level3.requirement1.success": "✅ बढ़िया! अब आप सारे कमिट और उनके हैश देख सकते हैं!",
    "reset.level3.requirement2.description": "किसी कमिट के हैश का उपयोग करके उस पर रीसेट करें",
    "reset.level3.requirement2.success": "🎯 बिल्कुल सही! आपने किसी विशेष कमिट हैश पर रीसेट करने में महारत हासिल कर ली!",
    "reset.level3.story.title": "एडवांस्ड रीसेट: कमिट हैश का उपयोग",
    "reset.level3.story.narrative": `🎯 **एडवांस्ड रीसेट: कमिट हैश का उपयोग**

**स्थिति:**
आपका प्रोजेक्ट बढ़ गया है। अभी आप कमिट 8 पर हैं, लेकिन आपको कमिट 3 पर वापस जाना है।

5 कमिट पीछे गिनने के लिए \`HEAD~5\` का उपयोग करना परेशान करने वाला और गलती-प्रवण है। अगर आपके काम करते समय कोई और कमिट जोड़ दे तो? गिनती बदल जाती है!

**पेशेवर समाधान: कमिट हैश**

हर कमिट का एक यूनिक ID (हैश) होता है, फ़िंगरप्रिंट की तरह:
\`a1b2c3d - "Version 2 - Good version"\`

यह हैश कभी नहीं बदलता! यह स्थायी और यूनिक है।

**मौजूदा स्थिति:**
- कमिट 8: "Attempted fix v3" - अब भी टूटा हुआ! 💔
- कमिट 7: "Attempted fix v2" - नहीं चला! 🐛
- कमिट 6: "Attempted fix v1" - असफल! ❌
- कमिट 5: "Add broken feature" - गड़बड़ यहीं से शुरू हुई 🔥
- कमिट 4: "Update styling" - कॉस्मेटिक ✨
- कमिट 3: "Version 2 - GOOD VERSION" - आख़िरी ज्ञात अच्छी स्थिति! ✅
- कमिट 2: "Version 1" - शुरुआती वर्ज़न ✅
- कमिट 1: "Initial commit" - नींव ✅

**आपका मिशन:**

**चरण 1: अच्छा कमिट खोजें**
चलाएं: \`git log --oneline\`

आपको कुछ ऐसा दिखेगा:
\`\`\`
f7e8a9b Attempted fix v3
d6c7b8a Attempted fix v2
c5b6a7f Attempted fix v1
b4a5c6e Add broken feature
a3b4c5d Update styling
9a2b3c4 Version 2 - Good version  ← यही है!
8a1b2c3 Version 1
7a0b1c2 Initial commit
\`\`\`

**चरण 2: उस कमिट पर रीसेट करें**
\`git reset --soft 9a2b3c4\`
(आपको जो असली हैश दिखे उसका उपयोग करें!)

या (ज़्यादा विनाशकारी):
\`git reset --hard 9a2b3c4\`

**HEAD~n बनाम कमिट हैश:**

**सापेक्ष (HEAD~n):**
- \`HEAD~1\` = "पिछला कमिट"
- \`HEAD~5\` = "5 कमिट पहले"
- ❌ नए कमिट जुड़ने पर बदल जाता है
- ✅ हाल के कमिट के लिए तेज़

**पूर्ण (कमिट हैश):**
- \`git reset --soft a1b2c3d\`
- ✅ स्थायी संदर्भ
- ✅ कभी नहीं बदलता
- ✅ पेशेवर तरीका
- 🎯 किसी विशेष ज्ञात-अच्छी स्थिति पर वापस जाने के लिए सबसे अच्छा

**प्रो टिप्स:**
- पूरे हैश की बजाय सिर्फ़ पहले 7 अक्षर चाहिए: \`9a2b3c4\`
- आप \`git log\` से हैश कॉपी कर सकते हैं
- हैश किसी भी git कमांड के साथ काम करते हैं: \`git show a1b2c3d\`
- आसान rollback के लिए ज़रूरी कमिट हैश नोट्स में सहेज कर रखें!

**असली दुनिया का परिदृश्य:**
"अरे टीम, अगर डिप्लॉय टूट जाए, तो कमिट 9a2b3c4 पर rollback करो - वही हमारा आख़िरी स्थिर वर्ज़न है!"

**CI/CD सिस्टम में:**
प्रोडक्शन डिप्लॉय अक्सर सटीक वर्ज़न कंट्रोल के लिए कमिट हैश का उपयोग करते हैं:
\`\`\`
deploy.sh --commit=9a2b3c4
\`\`\`

चलिए पेशेवर स्तर की Git का अभ्यास करते हैं! 🚀`,
    "reset.level3.story.realWorldContext":
        "कमिट हैश का उपयोग इतिहास में किसी विशेष बिंदु को संदर्भित करने का पेशेवर तरीका है। ये स्थायी, स्पष्ट होते हैं, और टीम के हर सदस्य की रिपॉजिटरी में एक जैसे काम करते हैं।",
    "reset.level3.story.taskIntroduction":
        "कमिट हैश खोजने के लिए git log का उपयोग करें, फिर किसी विशेष हैश के साथ git reset का उपयोग करें।",

    // Rebase Stage
    "rebase.name": "रीबेस करना",
    "rebase.description": "ब्रांचों को रीबेस करना सीखें",

    // Rebase Level 1
    "rebase.level1.name": "बेसिक रीबेसिंग",
    "rebase.level1.description": "एक ब्रांच के कमिट को दूसरी ब्रांच पर लागू करें",
    "rebase.level1.objective1": "मौजूदा ब्रांच को किसी दूसरी ब्रांच पर रीबेस करें",
    "rebase.level1.hint1": "आप feature ब्रांच पर हैं - इसे main पर इस तरह रीबेस करें: git rebase main",
    "rebase.level1.hint2": "यह आपके कमिट को main के सबसे नए कमिट के ऊपर लागू करके इतिहास फिर से लिखता है",
    "rebase.level1.hint3": "रीबेस के बाद कमिट इतिहास देखने के लिए 'git log --oneline' का उपयोग करें",
    "rebase.level1.requirement1.description": "किसी दूसरी ब्रांच पर रीबेस करें",
    "rebase.level1.requirement1.success": "बढ़िया काम! आपने ब्रांच को सफलतापूर्वक रीबेस कर दिया है।",
    "rebase.level1.story.title": "एक साफ़ इतिहास बनाना",
    "rebase.level1.story.narrative":
        '"मैं देख रही हूं कि आप मर्ज करने में सहज हो रहे हैं," Sarah कहती हैं। "अब चलिए बदलावों को इंटीग्रेट करने का एक अलग तरीका देखते हैं: रीबेसिंग।"\n\nवे समझाती हैं: "मर्ज जहां इतिहास को जोड़ता है, वहीं रीबेस आपके कमिट को दूसरी ब्रांच के कमिट के बाद दिखाने के लिए इतिहास को फिर से लिखता है। इससे एक ज़्यादा रैखिक (linear), साफ़ इतिहास बनता है।"',
    "rebase.level1.story.realWorldContext":
        "जब आप एक साफ़, रैखिक प्रोजेक्ट इतिहास बनाए रखना चाहते हैं, तो अक्सर रीबेस को प्राथमिकता दी जाती है। कई टीमें फ़ीचर ब्रांचों को main में मर्ज करने से पहले इंटीग्रेट करने के लिए इसका उपयोग करती हैं।",
    "rebase.level1.story.taskIntroduction": "आप feature ब्रांच पर हैं। इसे main पर रीबेस करें: git rebase main",

    // Rebase Level 2
    "rebase.level2.name": "रीबेस कॉन्फ्लिक्ट संभालना",
    "rebase.level2.description": "कॉन्फ्लिक्ट वाले रीबेस को संभालना या रद्द करना सीखें",
    "rebase.level2.objective1": "कॉन्फ्लिक्ट वाला रीबेस रद्द करें",
    "rebase.level2.hint1": "`git rebase --abort` कमांड का उपयोग करें",
    "rebase.level2.hint2": "यह रीबेस प्रक्रिया रोक देगा और रीबेस शुरू होने से पहले की स्थिति में वापस ले जाएगा",
    "rebase.level2.requirement1.description": "कॉन्फ्लिक्ट वाला रीबेस रद्द करें",
    "rebase.level2.requirement1.success": "शानदार! आपने रीबेस ऑपरेशन को सफलतापूर्वक रद्द कर दिया है।",
    "rebase.level2.story.title": "जब रीबेस उलझ जाए",
    "rebase.level2.story.narrative":
        '"मर्ज की तरह, रीबेस भी कॉन्फ्लिक्ट पैदा कर सकता है," Alex बताते हैं। "लेकिन रीबेस के दौरान कॉन्फ्लिक्ट सुलझाना ज़्यादा जटिल हो सकता है क्योंकि Git आपके हर कमिट को एक-एक करके लागू करता है।"\n\nवे आगे कहते हैं: "अगर आप किसी रीबेस के बीच में हैं और लगे कि यह बहुत जटिल है या आपको अपना तरीका फिर से सोचना है, तो आप हमेशा इस प्रक्रिया को रद्द कर सकते हैं।"',
    "rebase.level2.story.realWorldContext":
        "असली डेवलपमेंट में यह जानना ज़रूरी है कि रीबेस कब और कैसे रद्द करें। कभी-कभी कॉन्फ्लिक्ट तुरंत सुलझाने के लिए बहुत जटिल होते हैं, या आपको एहसास होता है कि कोई दूसरी रणनीति बेहतर होगी।",
    "rebase.level2.story.taskIntroduction": "git rebase --abort का उपयोग करके रीबेस ऑपरेशन रद्द करने का अभ्यास करें।",

    // Rebase Level 3
    "rebase.level3.name": "इंटरैक्टिव रीबेसिंग",
    "rebase.level3.description": "कमिट इतिहास बदलने के लिए इंटरैक्टिव रीबेसिंग का उपयोग करना सीखें",
    "rebase.level3.objective1": "एक इंटरैक्टिव रीबेस सेशन शुरू करें",
    "rebase.level3.hint1": "`git rebase -i` कमांड का उपयोग करें",
    "rebase.level3.hint2": "इंटरैक्टिव रीबेसिंग से आप कमिट को फिर से क्रम में लगा सकते हैं, एडिट कर सकते हैं, स्क्वैश कर सकते हैं या हटा सकते हैं",
    "rebase.level3.requirement1.description": "एक इंटरैक्टिव रीबेस शुरू करें",
    "rebase.level3.requirement1.success": "बिल्कुल सही! आपने एक इंटरैक्टिव रीबेस सेशन शुरू कर दिया है।",
    "rebase.level3.story.title": "इतिहास की सफ़ाई",
    "rebase.level3.story.narrative":
        '"आपका फ़ीचर अच्छा दिख रहा है," आपका कोड रिव्यू करते हुए Alex कहते हैं। "लेकिन मुझे कई छोटे-छोटे कमिट दिख रहे हैं जिनमें टाइपो फ़िक्स और मामूली बदलाव हैं। इसे main में मर्ज करने से पहले, चलिए कमिट इतिहास को साफ़ करते हैं।"\n\nवे समझाते हैं, "Git एक शक्तिशाली टूल देता है जिसे इंटरैक्टिव रीबेसिंग कहते हैं, जिससे आप अपना कमिट इतिहास बदल सकते हैं। आप छोटे कमिट को मिला सकते हैं, कमिट संदेश दोबारा लिख सकते हैं, या कमिट पूरी तरह हटा भी सकते हैं।"',
    "rebase.level3.story.realWorldContext":
        "फ़ीचर ब्रांचों को मर्ज करने से पहले एक साफ़, सुसंगत कमिट इतिहास बनाने के लिए इंटरैक्टिव रीबेसिंग आमतौर पर उपयोग की जाती है। इससे कोडबेस का इतिहास ज़्यादा पठनीय और सार्थक बनता है।",
    "rebase.level3.story.taskIntroduction": "अपना कमिट इतिहास बदलने के लिए एक इंटरैक्टिव रीबेस सेशन शुरू करें।",

    // Rebase Level 4
    "rebase.level4.name": "Main पर रीबेस करना",
    "rebase.level4.description": "अपडेटेड main ब्रांच पर फ़ीचर ब्रांचों को रीबेस करने का वर्कफ़्लो सीखें",
    "rebase.level4.objective1": "अपनी फ़ीचर ब्रांच को अपडेटेड main ब्रांच पर रीबेस करें",
    "rebase.level4.hint1": "अपनी फ़ीचर ब्रांच पर रहते हुए `git rebase main` का उपयोग करें",
    "rebase.level4.hint2": "यह आपके फ़ीचर के बदलावों को main ब्रांच के सबसे नए बदलावों के ऊपर लागू करेगा",
    "rebase.level4.requirement1.description": "feature को main पर रीबेस करें",
    "rebase.level4.requirement1.success": "शानदार! आपने अपनी फ़ीचर ब्रांच को सबसे नए main ब्रांच पर रीबेस कर दिया है।",
    "rebase.level4.story.title": "अप टू डेट रहना",
    "rebase.level4.story.narrative":
        '"मैं देख रही हूं कि जब से आप अपने फ़ीचर पर काम कर रहे हैं, किसी और ने main ब्रांच पर बदलाव पुश कर दिए हैं," Sarah बताती हैं। "आपका काम मर्ज करने से पहले, आपको ये नए बदलाव शामिल करने चाहिए।"\n\nवे आगे कहती हैं, "main को अपनी ब्रांच में मर्ज करने के बजाय, जिससे एक मर्ज कमिट बनता है, मैं सुझाव देती हूं कि आप अपनी ब्रांच को main पर रीबेस करें। इससे इतिहास साफ़ रहता है।"',
    "rebase.level4.story.realWorldContext":
        "सहयोगी माहौल में, main ब्रांच बार-बार अपडेट होती रहती है। फ़ीचर ब्रांचों को main पर रीबेस करना एक आम वर्कफ़्लो है जो मर्ज कॉन्फ्लिक्ट से बचने और फ़ीचर ब्रांचों को अप-टू-डेट रखने में मदद करता है।",
    "rebase.level4.story.taskIntroduction":
        "सबसे नए बदलाव शामिल करने के लिए अपनी फ़ीचर ब्रांच को अपडेटेड main ब्रांच पर रीबेस करें।",

    // Advanced Stage
    "advanced.name": "एडवांस्ड Git तकनीकें",
    "advanced.description": "एडवांस्ड Git फ़ीचर और वर्कफ़्लो में महारत हासिल करें",

    // Advanced Level 1: Git Tags
    "advanced.level1.name": "वर्ज़न टैगिंग",
    "advanced.level1.description": "टैग के साथ इतिहास में ज़रूरी बिंदुओं को चिह्नित करना सीखें",
    "advanced.level1.objective1": "किसी रिलीज़ के लिए एक annotated टैग बनाएं",
    "advanced.level1.objective2": "रिपॉजिटरी के सभी टैग लिस्ट करें",
    "advanced.level1.objective3": "टैग को रिमोट रिपॉजिटरी पर पुश करें",
    "advanced.level1.hint1": "इससे एक annotated टैग बनाएं: git tag -a v1.0.1 -m 'Bug fix release'",
    "advanced.level1.hint2": "सभी टैग देखने के लिए: git tag",
    "advanced.level1.hint3": "Annotated टैग में लेखक की जानकारी और एक संदेश शामिल होता है",
    "advanced.level1.hint4": "टैग रिलीज़ पॉइंट्स (v1.0, v2.0, आदि) चिह्नित करने के लिए उपयोग किए जाते हैं",
    "advanced.level1.requirement1.description": "एक वर्ज़न टैग बनाएं",
    "advanced.level1.requirement1.success": "शानदार! आपने इस कमिट को एक रिलीज़ पॉइंट के रूप में टैग कर दिया है।",
    "advanced.level1.requirement2.description": "अपना नया टैग देखने के लिए सभी टैग लिस्ट करें",
    "advanced.level1.requirement2.success": "बिल्कुल सही! अब आप रिपॉजिटरी के सभी टैग देख सकते हैं।",
    "advanced.level1.requirement3.description": "टैग को रिमोट रिपॉजिटरी पर पुश करें",
    "advanced.level1.requirement3.success": "शानदार! अब आपके टैग टीम के लिए उपलब्ध हैं।",
    "advanced.level1.story.title": "माइलस्टोन चिह्नित करना",
    "advanced.level1.story.narrative":
        '"हम वर्ज़न 1.0 को प्रोडक्शन में डिप्लॉय करने वाले हैं," आपकी टीम लीड घोषणा करती हैं। "इससे पहले, हमें इस कमिट को टैग करना होगा। टैग आपके Git इतिहास में बुकमार्क जैसे होते हैं - वे रिलीज़ जैसे ज़रूरी बिंदुओं को चिह्नित करते हैं।"\n\nवे आगे कहती हैं: "नए कमिट के साथ आगे बढ़ने वाली ब्रांचों के उलट, टैग स्थिर रहते हैं। इसका मतलब है कि हम हमेशा—सालों बाद भी—ठीक उसी चीज़ पर वापस जा सकते हैं जो हमने v1.0 में शिप की थी।"\n\n"पेशेवर टीमों में, हर प्रोडक्शन रिलीज़ को टैग किया जाता है। यह डिबगिंग, rollbacks और चेंजलॉग के लिए ज़रूरी है।"',
    "advanced.level1.story.realWorldContext":
        "रिलीज़ चिह्नित करने के लिए टैग इंडस्ट्री स्टैंडर्ड हैं। ये सिमैंटिक वर्ज़निंग (v1.0.0) को संभव बनाते हैं, rollbacks को सुरक्षित बनाते हैं, और टीमों को विशेष वर्ज़न के बारे में बातचीत करने में मदद करते हैं।",
    "advanced.level1.story.taskIntroduction":
        "इस रिलीज़ को चिह्नित करने के लिए एक annotated टैग बनाएं: git tag -a v1.0.1 -m 'Bug fix release'",

    // Advanced Level 2: Git Log Advanced
    "advanced.level2.name": "एडवांस्ड कमिट इतिहास",
    "advanced.level2.description": "रिपॉजिटरी इतिहास खोजने की एडवांस्ड तकनीकों में महारत हासिल करें",
    "advanced.level2.objective1": "संक्षिप्त कमिट इतिहास देखें",
    "advanced.level2.objective2": "लेखक या तारीख़ के अनुसार कमिट फ़िल्टर करें",
    "advanced.level2.objective3": "कमिट संदेशों में खोजें",
    "advanced.level2.hint1": "इससे एक-पंक्ति वाला कमिट इतिहास देखें: git log --oneline",
    "advanced.level2.hint2": "ग्राफ़ के साथ कमिट इतिहास दिखाएं: git log --graph --oneline",
    "advanced.level2.hint3": "आख़िरी N कमिट तक सीमित करें: git log --oneline -n 5",
    "advanced.level2.hint4": "कमिट संदेशों में खोजें: git log --grep='fix'",
    "advanced.level2.requirement1.description": "संक्षिप्त कमिट इतिहास देखें",
    "advanced.level2.requirement1.success": "बिल्कुल सही! आपने कमिट इतिहास खोज लिया है।",
    "advanced.level2.requirement2.description": "लेखक के अनुसार कमिट फ़िल्टर करें",
    "advanced.level2.requirement2.success": "बढ़िया! अब आप विशेष लेखकों के कमिट खोज सकते हैं।",
    "advanced.level2.requirement3.description": "किसी विशेष टेक्स्ट के लिए कमिट संदेशों में खोजें",
    "advanced.level2.requirement3.success": "शानदार! अब आप कमिट संदेशों में खोज कर सकते हैं।",
    "advanced.level2.story.title": "इतिहास खोजना",
    "advanced.level2.story.narrative":
        '"पिछले 50 कमिट में कहीं एक बग आ गया," आपका सहकर्मी आह भरता है। "मैं इसे कैसे खोजूं?"\n\nआपका सीनियर डेवलपर मुस्कुराते हुए कहता है: "Git log आपका जासूसी टूल है। डिफ़ॉल्ट फ़ॉर्मैट सब कुछ दिखाता है, लेकिन वह बहुत ज़्यादा है। चलिए मैं आपको पावर टूल्स दिखाता हूं।"\n\n"git log --oneline हर कमिट को एक लाइन में दिखाता है - स्कैन करने के लिए बिल्कुल सही। ब्रांच की संरचना देखने के लिए --graph जोड़ें। कमिट संदेश खोजने के लिए --grep का उपयोग करें। ये हुनर आपको एक Git उपयोगकर्ता से एक Git जासूस में बदल देते हैं।"',
    "advanced.level2.story.realWorldContext":
        "git log में महारत हासिल करना डिबगिंग, कोड आर्कियोलॉजी और प्रोजेक्ट के विकास को समझने के लिए ज़रूरी है। पेशेवर डेवलपर इन फ्लैग्स का रोज़ उपयोग करते हैं।",
    "advanced.level2.story.taskIntroduction": "इसका उपयोग करके कमिट इतिहास खोजें: git log --oneline",

    // Advanced Level 3: Git Show
    "advanced.level3.name": "कमिट का निरीक्षण करना",
    "advanced.level3.description": "विशेष कमिट का विस्तार से निरीक्षण करना सीखें",
    "advanced.level3.objective1": "किसी कमिट के हैश का उपयोग करके उसका निरीक्षण करें",
    "advanced.level3.hint1": "पहले कमिट हैश खोजने के लिए 'git log --oneline' का उपयोग करें",
    "advanced.level3.hint2": "किसी विशेष कमिट को दिखाएं: git show <commit-hash>",
    "advanced.level3.hint3": "git show कमिट संदेश, लेखक, तारीख़ और फ़ाइल बदलावों का diff दिखाता है",
    "advanced.level3.requirement1.description": "किसी कमिट के हैश का उपयोग करके उसका निरीक्षण करें",
    "advanced.level3.requirement1.success": "बढ़िया! आपने कमिट का विवरण और फ़ाइल बदलावों का निरीक्षण कर लिया है।",
    "advanced.level3.story.title": "कमिट फ़ॉरेंसिक्स",
    "advanced.level3.story.narrative":
        '"इस कमिट ने कुछ तोड़ दिया, लेकिन मुझे समझ नहीं आ रहा कि क्या बदला," आपका साथी कहता है।\n\n"git show का उपयोग करो!" आप भरोसे के साथ जवाब देते हैं। "यह आपको किसी कमिट के बारे में सब कुछ दिखाता है: संदेश, इसे किसने बनाया, कब, और सबसे ज़रूरी - असली कोड बदलाव।"\n\n"यह कमिट के लिए एक मैग्निफ़ाइंग ग्लास जैसा है। कोड रिव्यू, डिबगिंग और यह समझने के लिए कि साथियों ने क्या बदला, यह बेहद ज़रूरी है।"',
    "advanced.level3.story.realWorldContext":
        "git show कोड रिव्यू और डिबगिंग के लिए एक बुनियादी टूल है। इसका उपयोग पुल रिक्वेस्ट में और समस्याओं की जांच करते समय लगातार किया जाता है।",
    "advanced.level3.story.taskIntroduction": "इसका उपयोग करके सबसे नए कमिट का निरीक्षण करें: git show",

    // Workflow Stage
    "workflow.name": "Git वर्कफ़्लो",
    "workflow.description": "पेशेवर Git वर्कफ़्लो और सहयोग के पैटर्न में महारत हासिल करें",

    "workflow.level1.name": "फ़ीचर ब्रांच वर्कफ़्लो",
    "workflow.level1.description": "दुनिया भर की टीमों द्वारा उपयोग किया जाने वाला इंडस्ट्री-स्टैंडर्ड फ़ीचर ब्रांच वर्कफ़्लो सीखें",
    "workflow.level1.objective1": "main से एक फ़ीचर ब्रांच बनाएं",
    "workflow.level1.objective2": "विवरणात्मक संदेशों के साथ कमिट बनाएं",
    "workflow.level1.objective3": "अपनी फ़ीचर ब्रांच को रिमोट पर पुश करें",
    "workflow.level1.objective4": "वापस main ब्रांच पर स्विच करें",
    "workflow.level1.objective5": "अपनी फ़ीचर ब्रांच को वापस main में मर्ज करें",
    "workflow.level1.objective6": "फ़ीचर ब्रांच वर्कफ़्लो पूरा करें",
    "workflow.level1.hint1": "एक फ़ीचर ब्रांच बनाकर शुरू करें: 'git switch -c feature/user-auth'",
    "workflow.level1.hint2": "auth.js फ़ाइल में बदलाव करें, फिर अपने बदलाव स्टेज करने के लिए 'git add' का उपयोग करें",
    "workflow.level1.hint3": "इससे कमिट करें: 'git commit'",
    "workflow.level1.hint4": "रिमोट पर पुश करें: 'git push origin feature/user-auth'",
    "workflow.level1.hint5": "वापस main पर स्विच करें: 'git switch main'",
    "workflow.level1.hint6": "आख़िर में मर्ज करें: 'git merge feature/user-auth'",
    "workflow.level1.requirement1.description": "'git switch -c <branch>' से एक नई फ़ीचर ब्रांच बनाएं",
    "workflow.level1.requirement1.success": "फ़ीचर ब्रांच सफलतापूर्वक बन गई!",
    "workflow.level1.requirement2.description": "अपने बदलाव स्टेज करें (पहले किसी फ़ाइल में बदलाव करें!)",
    "workflow.level1.requirement2.success": "बदलाव स्टेज हो गए!",
    "workflow.level1.requirement3.description": "एक विवरणात्मक संदेश के साथ अपने बदलाव कमिट करें",
    "workflow.level1.requirement3.success": "बदलाव कमिट हो गए!",
    "workflow.level1.requirement4.description": "अपनी फ़ीचर ब्रांच को रिमोट पर पुश करें (git push origin <your-branch>)",
    "workflow.level1.requirement4.success": "फ़ीचर ब्रांच रिमोट पर पुश हो गई!",
    "workflow.level1.requirement5.description": "'git switch main' से वापस main ब्रांच पर स्विच करें",
    "workflow.level1.requirement5.success": "main ब्रांच पर स्विच हो गए!",
    "workflow.level1.requirement6.description": "अपनी फ़ीचर ब्रांच को main में मर्ज करें",
    "workflow.level1.requirement6.success":
        "फ़ीचर सफलतापूर्वक मर्ज हो गया! असली टीमें नए फ़ीचर को इसी तरह इंटीग्रेट करती हैं।",
    "workflow.level1.story.title": "फ़ीचर फ़ैक्ट्री",
    "workflow.level1.story.narrative": `आप TechCorp में एक डेवलपर हैं, और टीम सख़्त Git वर्कफ़्लो का पालन करती है। आपकी मैनेजर Sarah ने अभी आपको एक नया फ़ीचर सौंपा है: यूज़र ऑथेंटिकेशन लागू करना।

"याद रखो," Sarah कहती हैं, "हम कभी सीधे main में कमिट नहीं करते। हमेशा फ़ीचर ब्रांच का उपयोग करो, और सुनिश्चित करो कि तुम्हारे कमिट एक कहानी बताएं।"

**फ़ीचर ब्रांच क्या है?**
फ़ीचर ब्रांच एक अलग ब्रांच है जहां आप किसी नए फ़ीचर को अलग से डेवलप करते हैं। इससे आप:
- स्थिर main ब्रांच को प्रभावित किए बिना काम कर सकते हैं
- मर्ज करने से पहले कोड रिव्यू करा सकते हैं
- दूसरों को प्रभावित किए बिना आसानी से काम छोड़ या बदल सकते हैं

**पूरा वर्कफ़्लो:**
1. main से एक फ़ीचर ब्रांच बनाएं: \`git switch -c feature/user-auth\`
2. फ़ाइलों में बदलाव करें और उन्हें \`git add\` से स्टेज करें
3. विवरणात्मक संदेशों के साथ बदलाव कमिट करें
4. अपनी ब्रांच को रिमोट पर पुश करें: \`git push origin feature/user-auth\`
5. वापस main पर स्विच करें: \`git switch main\`
6. फ़ीचर को मर्ज करें: \`git merge feature/user-auth\`

**पुल रिक्वेस्ट (PR) क्या हैं?**
असली टीमों में, चरण 4 (आपकी ब्रांच पुश करने) के बाद, आप सीधे मर्ज करने के बजाय GitHub/GitLab पर एक **Pull Request** बनाते हैं:

**पुल रिक्वेस्ट वर्कफ़्लो:**
1. आप अपनी फ़ीचर ब्रांच को रिमोट रिपॉजिटरी पर पुश करते हैं
2. GitHub/GitLab पर, आप \`feature/user-auth\` से \`main\` तक एक Pull Request खोलते हैं
3. आपके साथियों को एक नोटिफ़िकेशन मिलता है
4. वे आपका कोड रिव्यू करते हैं, कमेंट छोड़ते हैं, और सुधार सुझाते हैं
5. आप फ़ीडबैक के आधार पर बदलाव करते हैं और फिर से पुश करते हैं
6. अप्रूव होने के बाद, कोई PR को main में मर्ज करता है
7. अब आपका फ़ीचर मुख्य कोडबेस का हिस्सा है!

**पुल रिक्वेस्ट क्यों ज़रूरी हैं:**
- **कोड क्वालिटी**: कई निगाहें बग पकड़ती हैं और सुधार सुझाती हैं
- **नॉलेज शेयरिंग**: टीम लाइव होने से पहले बदलावों के बारे में जानती है
- **डॉक्यूमेंटेशन**: PR डिस्क्रिप्शन बताते हैं कि बदलाव क्यों किए गए
- **चर्चा**: जटिल फ़ैसलों पर चर्चा होती है और उन्हें रिकॉर्ड किया जाता है
- **सुरक्षा**: टूटे हुए कोड को प्रोडक्शन तक पहुंचने से रोकता है

इस स्तर में, हम Git कमांड सिखाने के लिए आपसे सीधे पुश और मर्ज कराकर वर्कफ़्लो का सिमुलेशन कर रहे हैं। असली प्रोजेक्ट्स में, टीम सहयोग के लिए आप हमेशा Pull Requests का उपयोग करेंगे!`,
    "workflow.level1.story.realWorldContext":
        "फ़ीचर ब्रांच वर्कफ़्लो इंडस्ट्री स्टैंडर्ड है। डेवलपर अलग-अलग ब्रांच बनाते हैं, उन्हें रिमोट रिपॉज़ (GitHub/GitLab) पर पुश करते हैं, कोड रिव्यू के लिए Pull Requests बनाते हैं, और अप्रूवल के बाद मर्ज करते हैं। यह सहयोगी तरीका अस्थिर कोड को प्रोडक्शन तक पहुंचने से रोकता है और पीयर रिव्यू के ज़रिए कोड की गुणवत्ता सुधारता है।",
    "workflow.level1.story.taskIntroduction":
        "पूरा फ़ीचर ब्रांच वर्कफ़्लो सीखें: बनाना, कमिट करना, पुश करना और मर्ज करना। पेशेवर टीमें हर दिन फ़ीचर इसी तरह शिप करती हैं।",

    "workflow.level2.name": "हॉटफिक्स वर्कफ़्लो",
    "workflow.level2.description": "hotfix वर्कफ़्लो के साथ अर्जेंट प्रोडक्शन फ़िक्स संभालें",
    "workflow.level2.objective1": "main से एक hotfix ब्रांच बनाएं",
    "workflow.level2.objective2": "फ़िक्स को स्टेज करें और कमिट करें",
    "workflow.level2.objective3": "वापस main पर स्विच करें",
    "workflow.level2.objective4": "hotfix ब्रांच को मर्ज करें",
    "workflow.level2.hint1": "Hotfix सीधे main/master से ब्रांच होते हैं",
    "workflow.level2.hint2": "'hotfix/critical-security-patch' जैसे विवरणात्मक hotfix नाम उपयोग करें",
    "workflow.level2.hint3": "Hotfix को main और develop, दोनों ब्रांचों में वापस मर्ज किया जाना चाहिए",
    "workflow.level2.hint4": "ट्रैकिंग के लिए हमेशा hotfix रिलीज़ को टैग करें",
    "workflow.level2.requirement1.description": "सुरक्षा समस्या के लिए एक hotfix ब्रांच बनाएं",
    "workflow.level2.requirement1.success": "Hotfix ब्रांच बन गई!",
    "workflow.level2.requirement2.description": "अपने सुरक्षा फ़िक्स स्टेज करें",
    "workflow.level2.requirement2.success": "सुरक्षा फ़िक्स स्टेज हो गए!",
    "workflow.level2.requirement3.description": "गंभीर सुरक्षा पैच कमिट करें",
    "workflow.level2.requirement3.success": "सुरक्षा पैच कमिट हो गया!",
    "workflow.level2.requirement4.description": "वापस main ब्रांच पर स्विच करें",
    "workflow.level2.requirement4.success": "main ब्रांच पर स्विच हो गए!",
    "workflow.level2.requirement5.description": "hotfix को main में मर्ज करें",
    "workflow.level2.requirement5.success": "Hotfix सफलतापूर्वक मर्ज हो गया!",
    "workflow.level2.story.title": "कोड रेड: प्रोडक्शन इमरजेंसी",
    "workflow.level2.story.narrative": `🚨 अर्जेंट: प्रोडक्शन डाउन है! 🚨

रात 2:47 बजे, आपके फ़ोन पर अलर्ट आता है। पेमेंट सिस्टम फ़ेल हो रहा है, और ग्राहक ख़रीदारी पूरी नहीं कर पा रहे। बग ट्रैकर दिखाता है कि सबसे नई रिलीज़ में एक गंभीर सुरक्षा कमज़ोरी आ गई है।

ऑन-कॉल डेवलपर के तौर पर, आपको यह करना है:
1. तुरंत एक hotfix ब्रांच बनाएं: \`git switch -c hotfix/security-patch\`
2. कोड में गंभीर सुरक्षा समस्या ठीक करें
3. अपने फ़िक्स स्टेज करें और कमिट करें
4. वापस main पर स्विच करें: \`git switch main\`
5. hotfix को मर्ज करें: \`git merge hotfix/security-patch\`

हर मिनट कंपनी को हज़ारों डॉलर का नुक़सान पहुंचाता है। यही चीज़ जूनियर डेवलपरों को सीनियर डेवलपरों से अलग करती है - दबाव में शांत रहना और सही Git वर्कफ़्लो जानना।

समय ही पैसा है। चलिए इसे ठीक करते हैं!`,
    "workflow.level2.story.realWorldContext":
        "प्रोडक्शन hotfix सिस्टम की स्थिरता बनाए रखने के लिए बेहद ज़रूरी होते हैं और तुरंत, केंद्रित वर्कफ़्लो निष्पादन की मांग करते हैं।",
    "workflow.level2.story.taskIntroduction": "इमरजेंसी प्रोडक्शन फ़िक्स के लिए hotfix वर्कफ़्लो में महारत हासिल करें।",

    "workflow.level3.name": "Git Flow में महारत",
    "workflow.level3.description": "रिलीज़ ब्रांच के साथ पूरे Git Flow वर्कफ़्लो में महारत हासिल करें",
    "workflow.level3.objective1": "develop से एक रिलीज़ ब्रांच बनाएं",
    "workflow.level3.objective2": "रिलीज़ बदलाव तैयार करें और कमिट करें",
    "workflow.level3.objective3": "रिलीज़ को main में मर्ज करें",
    "workflow.level3.objective4": "रिलीज़ वर्ज़न को टैग करें",
    "workflow.level3.hint1": "develop पर शुरू करें और रिलीज़ ब्रांच बनाएं: 'git switch -c release/2.0.0'",
    "workflow.level3.hint2": "अंतिम समायोजन करें और अपनी रिलीज़ तैयारी कमिट करें",
    "workflow.level3.hint3": "main पर स्विच करें: 'git switch main'",
    "workflow.level3.hint4": "रिलीज़ को मर्ज करें: 'git merge release/2.0.0'",
    "workflow.level3.hint5": "रिलीज़ को टैग करें: 'git tag v2.0.0'",
    "workflow.level3.hint6": "असली प्रोजेक्ट्स में, आप इसे develop में भी वापस मर्ज करेंगे",
    "workflow.level3.requirement1.description": "एक रिलीज़ ब्रांच बनाएं (जैसे, 'release/2.0.0')",
    "workflow.level3.requirement1.success": "रिलीज़ ब्रांच बन गई!",
    "workflow.level3.requirement2.description": "अपने रिलीज़ तैयारी बदलाव स्टेज करें",
    "workflow.level3.requirement2.success": "रिलीज़ बदलाव स्टेज हो गए!",
    "workflow.level3.requirement3.description": "एक स्पष्ट संदेश के साथ रिलीज़ तैयारी कमिट करें",
    "workflow.level3.requirement3.success": "रिलीज़ तैयारी कमिट हो गई!",
    "workflow.level3.requirement4.description": "रिलीज़ मर्ज की तैयारी के लिए main ब्रांच पर स्विच करें",
    "workflow.level3.requirement4.success": "main पर स्विच हो गए!",
    "workflow.level3.requirement5.description": "अपनी रिलीज़ ब्रांच को main में मर्ज करें",
    "workflow.level3.requirement5.success": "रिलीज़ main में मर्ज हो गई!",
    "workflow.level3.requirement6.description": "रिलीज़ को वर्ज़न नंबर से टैग करें (जैसे, 'v2.0.0')",
    "workflow.level3.requirement6.success": "रिलीज़ टैग हो गई! वर्ज़न 2.0.0 अब प्रोडक्शन में लाइव है!",
    "workflow.level3.story.title": "रिलीज़ मैनेजर",
    "workflow.level3.story.narrative": `बधाई हो! आपको GitFlow Inc. में Release Manager के पद पर प्रमोट कर दिया गया है, एक ऐसी कंपनी जो हर दो हफ़्ते में घड़ी की सुई की तरह सटीक रूप से सॉफ़्टवेयर शिप करती है।

आपका काम वर्ज़न 2.0 की रिलीज़ को व्यवस्थित करना है, जिसमें शामिल हैं:
- अलग-अलग टीमों के तीन नए फ़ीचर
- दो गंभीर बग फ़िक्स
- परफ़ॉर्मेंस सुधार
- अपडेटेड डॉक्यूमेंटेशन

**रिलीज़ वर्कफ़्लो:**

1. **रिलीज़ ब्रांच बनाएं**: develop से शुरू करें और एक रिलीज़ ब्रांच बनाएं
   \`git switch -c release/2.0.0\`

2. **अंतिम तैयारियां**: वर्ज़न नंबर, CHANGELOG, आदि अपडेट करें
   - ज़रूरत के अनुसार फ़ाइलें एडिट करें
   - \`git add .\`
   - \`git commit -m "Prepare release 2.0.0"\`

3. **Main में मर्ज करें**: प्रोडक्शन में डिप्लॉय करें
   - \`git switch main\`
   - \`git merge release/2.0.0\`

4. **रिलीज़ को टैग करें**: इस वर्ज़न को इतिहास में चिह्नित करें
   \`git tag v2.0.0\`

इससे इस रिलीज़ के लिए एक स्थायी निशान बन जाता है। असली प्रोजेक्ट्स में, आप यह भी करेंगे:
- सिंक बनाए रखने के लिए develop में वापस मर्ज करना
- रिलीज़ ब्रांच डिलीट करना
- सब कुछ रिमोट पर पुश करना
- प्रोडक्शन में डिप्लॉय करना

यह एंटरप्राइज़-स्तर का Git मैनेजमेंट है। बड़ी लीग में आपका स्वागत है!`,
    "workflow.level3.story.realWorldContext":
        "Git Flow में रिलीज़ ब्रांच का उपयोग प्रोडक्शन रिलीज़ तैयार करने के लिए किया जाता है। ये चल रहे डेवलपमेंट को रोके बिना अंतिम बग फ़िक्स और डॉक्यूमेंटेशन अपडेट की सुविधा देते हैं। ज़रूरत पड़ने पर आसान संदर्भ और rollback के लिए रिलीज़ को टैग किया जाता है।",
    "workflow.level3.story.taskIntroduction":
        "पेशेवर रिलीज़ वर्कफ़्लो सीखें: ब्रांच बनाना, तैयार करना, मर्ज करना, और टैग करना। टीमें प्रोडक्शन में स्थिर सॉफ़्टवेयर इसी तरह शिप करती हैं।",

    // Teamwork Stage
    "teamwork.name": "टीम सहयोग",
    "teamwork.description": "Git सहयोग तकनीकों का उपयोग करके टीम के साथ प्रभावी ढंग से काम करना सीखें",

    "teamwork.level1.name": "टीम सहयोग की बुनियादी बातें",
    "teamwork.level1.description": "Git का उपयोग करके टीम के साथ प्रभावी ढंग से काम करना सीखें",
    "teamwork.level1.objective1": "रिमोट से टीम का सबसे नया कोड पुल करें",
    "teamwork.level1.objective2": "अपने काम के लिए एक नई फ़ीचर ब्रांच बनाएं",
    "teamwork.level1.objective3": "team.md एडिट करें और टीम सदस्यों की लिस्ट में अपना नाम जोड़ें",
    "teamwork.level1.objective4": "अपने बदलाव स्टेज करें",
    "teamwork.level1.objective5": "अपने बदलाव कमिट करें",
    "teamwork.level1.objective6": "अपने बदलाव रिमोट रिपॉजिटरी पर पुश करें",
    "teamwork.level1.hint1": "टीम का सबसे नया कोड पाने के लिए 'git pull origin main' का उपयोग करें",
    "teamwork.level1.hint2": "'git switch -c feature/YOUR-NAME' से एक नई ब्रांच बनाएं",
    "teamwork.level1.hint3": "अपना नाम और भूमिका जोड़ने के लिए team.md फ़ाइल एडिट करें",
    "teamwork.level1.hint4": "'git add .' से सभी बदलाव स्टेज करें",
    "teamwork.level1.hint5": "एक स्पष्ट संदेश के साथ कमिट करें: 'git commit -m \"Add my profile\"'",
    "teamwork.level1.hint6": "अपनी ब्रांच को 'git push origin feature/YOUR-NAME' से पुश करें",
    "teamwork.level1.requirement1.description": "टीम रिपॉजिटरी से सबसे नए बदलाव पुल करें",
    "teamwork.level1.requirement1.success": "सबसे नए बदलाव सफलतापूर्वक पुल हो गए!",
    "teamwork.level1.requirement2.description": "टीम प्रोफ़ाइल के लिए अपनी फ़ीचर ब्रांच बनाएं",
    "teamwork.level1.requirement2.success": "फ़ीचर ब्रांच बन गई!",
    "teamwork.level1.requirement3.description": "team.md एडिट करें और लिस्ट में अपना नाम जोड़ें",
    "teamwork.level1.requirement3.success": "फ़ाइल बदल गई! आपका नाम जोड़ दिया गया है।",
    "teamwork.level1.requirement4.description": "अपने टीम प्रोफ़ाइल बदलाव स्टेज करें",
    "teamwork.level1.requirement4.success": "बदलाव स्टेज हो गए!",
    "teamwork.level1.requirement5.description": "एक विवरणात्मक संदेश के साथ अपना टीम प्रोफ़ाइल कमिट करें",
    "teamwork.level1.requirement5.success": "टीम प्रोफ़ाइल कमिट हो गई!",
    "teamwork.level1.requirement6.description": "अपने बदलाव रिमोट रिपॉजिटरी पर पुश करें",
    "teamwork.level1.requirement6.success": "बदलाव रिमोट पर पुश हो गए!",
    "teamwork.level1.story.title": "डेव टीम में आपका स्वागत है",
    "teamwork.level1.story.narrative": `🎉 बधाई हो! आपको अभी-अभी InnovateCorp में डेवलपर के तौर पर नौकरी मिली है, जो एक तेज़ी से बढ़ता हुआ टेक स्टार्टअप है।

आपके टीम लीड, Alex, आपको अपने पहले दिन के बारे में बताते हैं:

"टीम में आपका स्वागत है! हम यहां हर काम के लिए Git का उपयोग करते हैं। कोडबेस हमारा साझा वर्कस्पेस है, और हर कोई रोज़ाना इसमें योगदान देता है। आपका पहला काम आसान लेकिन ज़रूरी है - हमारे टीम पेज पर अपनी प्रोफ़ाइल जोड़ना।"

"याद रखिए," Alex आगे कहते हैं, "इस प्रोजेक्ट पर 12 डेवलपर काम कर रहे हैं। सबको सिंक में रहना ज़रूरी है। पुश करने से पहले हमेशा \`git pull\` करें, और सुनिश्चित करें कि आपके कमिट संदेश स्पष्ट हों ताकि बाकी सबको पता चले कि आप किस पर काम कर रहे हैं।"

आपका मिशन:
1. \`git pull origin main\` से टीम रिपॉजिटरी से सबसे नया कोड लें
2. अपनी फ़ीचर ब्रांच बनाएं: \`git switch -c feature/team-profile\`
3. टीम पेज पर अपनी डेवलपर प्रोफ़ाइल जोड़ें
4. बदलाव स्टेज करें: \`git add .\`
5. अपने बदलाव कमिट करें: \`git commit -m "Add my profile"\`

यह असली दुनिया की टीम डेवलपमेंट है। चलिए आपका पहला योगदान करते हैं!`,
    "teamwork.level1.story.realWorldContext":
        "टीम सहयोग सॉफ़्टवेयर डेवलपमेंट की जान है। साझा रिपॉजिटरी के साथ काम करना सीखना किसी भी डेवलपर के लिए ज़रूरी है।",
    "teamwork.level1.story.taskIntroduction":
        "टीम-आधारित Git वर्कफ़्लो की बुनियादी बातें सीखें और अपना पहला सहयोगी योगदान दें।",

    "teamwork.level2.name": "टीमों में मर्ज कॉन्फ्लिक्ट संभालना",
    "teamwork.level2.description": "मर्ज कॉन्फ्लिक्ट सुलझाएं जो तब होते हैं जब कई डेवलपर एक ही फ़ाइलों पर काम करते हैं",
    "teamwork.level2.objective1": "अपने लोकल बदलाव स्टेज करें और कमिट करें",
    "teamwork.level2.objective2": "रिमोट बदलाव पुल करें (कॉन्फ्लिक्ट ट्रिगर करता है)",
    "teamwork.level2.objective3": "मर्ज कॉन्फ्लिक्ट मार्कर सुलझाएं",
    "teamwork.level2.objective4": "मर्ज किए गए समाधान को स्टेज करें और कमिट करें",
    "teamwork.level2.hint1": "अपने मौजूदा uncommitted बदलाव देखने के लिए 'cat /src/auth/login.js' का उपयोग करें",
    "teamwork.level2.hint2": "यह पुष्टि करने के लिए कि फ़ाइल बदली गई है, 'git status' का उपयोग करें",
    "teamwork.level2.hint3": "'git add /src/auth/login.js' से स्टेज करें फिर 'git commit -m \"message\"' से कमिट करें",
    "teamwork.level2.hint4": "'git pull origin main' से पुल करें - इससे कॉन्फ्लिक्ट ट्रिगर होगा!",
    "teamwork.level2.hint5": "कॉन्फ्लिक्ट मार्कर ढूंढें: <<<<<<<, =======, >>>>>>>",
    "teamwork.level2.hint6": "अपनी और Sarah की, दोनों की सुधार मिलाने के लिए login.js एडिट करें",
    "teamwork.level2.hint7": "सबसे अच्छा समाधान दोनों को रखता है: Sarah की email जांच AND आपकी सख़्त लंबाई सीमाएं",
    "teamwork.level2.hint8": "सुलझाने के बाद: 'git add .' फिर 'git commit -m \"Resolve merge conflict\"'",
    "teamwork.level2.requirement1.description": "login.js में अपने लोकल बदलाव स्टेज करें",
    "teamwork.level2.requirement1.success": "लोकल बदलाव स्टेज हो गए!",
    "teamwork.level2.requirement2.description": "पहले अपने लोकल बदलाव कमिट करें",
    "teamwork.level2.requirement2.success": "लोकल बदलाव कमिट हो गए!",
    "teamwork.level2.requirement3.description": "कॉन्फ्लिक्ट ट्रिगर करने के लिए Sarah के बदलाव पुल करें",
    "teamwork.level2.requirement3.success": "टकराने वाले बदलाव पुल हो गए! login.js में कॉन्फ्लिक्ट मार्कर देखें।",
    "teamwork.level2.requirement4.description": "सुलझाया गया कॉन्फ्लिक्ट स्टेज करें",
    "teamwork.level2.requirement4.success": "कॉन्फ्लिक्ट रिज़ॉल्यूशन स्टेज हो गया!",
    "teamwork.level2.requirement5.description": "मर्ज रिज़ॉल्यूशन कमिट करें",
    "teamwork.level2.requirement5.success": "मर्ज कॉन्फ्लिक्ट सुलझ गया!",
    "teamwork.level2.story.title": "बड़ा मर्ज कॉन्फ्लिक्ट संकट",
    "teamwork.level2.story.narrative": `⚠️ आपके पहले मर्ज कॉन्फ्लिक्ट में आपका स्वागत है!

**स्थिति:**
आप आज सुबह से \`/src/auth/login.js\` पर काम कर रहे हैं। आपने पासवर्ड वैलिडेशन को सख़्त बना दिया है (username के लिए कम से कम 5 अक्षर, password के लिए 10)। बहुत बढ़िया काम!

लेकिन जब आप कोड लिख रहे थे, आपकी साथी Sarah ने भी उसी फ़ाइल में बदलाव पुश कर दिए! उन्होंने email वैलिडेशन लॉजिक जोड़ा। अब आप दोनों के पास कोड की उन्हीं लाइनों के अलग-अलग वर्ज़न हैं।

**आपका मिशन:**

**1. अपने लोकल बदलाव जांचें:** अपने सुधार देखने के लिए \`cat /src/auth/login.js\` चलाएं (पहले ही हो चुके हैं, पर अभी कमिट नहीं हुए!)

**2. पहले अपने बदलाव कमिट करें:**
\` git add /src/auth/login.js
git commit -m "Improve password validation requirements"
\`

**3. अब Sarah के बदलाव पुल करने की कोशिश करें:**
\` git pull origin main \`

**4. 💥 मर्ज कॉन्फ्लिक्ट!** Git अपने-आप मर्ज नहीं कर सकता क्योंकि आपने और Sarah दोनों ने वही लाइनें बदली हैं! आपको फ़ाइल में कॉन्फ्लिक्ट मार्कर दिखेंगे:
\`<<<<<<< HEAD
(आपके बदलाव)
=======
(Sarah के बदलाव)
>>>>>>> abc1234\`

**5. कॉन्फ्लिक्ट सुलझाएं:**
- दोनों वर्ज़न का सबसे अच्छा हिस्सा मिलाने के लिए \`/src/auth/login.js\` एडिट करें
- कॉन्फ्लिक्ट मार्कर हटाएं (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`)
- अपना सख़्त पासवर्ड लंबाई नियम AND Sarah का email वैलिडेशन, दोनों रखें!

**6. मर्ज पूरा करें:**
\`git add .
git commit -m "Merge Sarah's email validation with my password improvements"\`

**प्रो टिप:** सबसे अच्छा समाधान अक्सर दोनों बदलावों को मिलाता है! इस मामले में, रखें:
- Sarah का email वैलिडेशन लॉजिक (\`username.includes('@')\`)
- आपकी सख़्त लंबाई की शर्तें (\`username.length >= 5\` और \`password.length >= 10\`)

टीम डेवलपमेंट में यह बिल्कुल सामान्य है! जब कई डेवलपर एक ही कोड पर काम करते हैं तो मर्ज कॉन्फ्लिक्ट होते हैं। असली बात है उन्हें सोच-समझकर सुलझाना।`,
    "teamwork.level2.story.realWorldContext":
        "टीम डेवलपमेंट में मर्ज कॉन्फ्लिक्ट होना तय है। उन्हें जल्दी और सही तरीके से सुलझाना सीखना एक अहम हुनर है।",
    "teamwork.level2.story.taskIntroduction":
        "एक भरोसेमंद टीम सहयोगी बनने के लिए मर्ज कॉन्फ्लिक्ट सुलझाने में महारत हासिल करें।",

    "teamwork.level3.name": "कोड रिव्यू वर्कफ़्लो",
    "teamwork.level3.description": "कोड रिव्यू में हिस्सा लेना और पुल रिक्वेस्ट के ज़रिए सहयोग करना सीखें",
    "teamwork.level3.objective1": "एक नई फ़ीचर ब्रांच बनाएं",
    "teamwork.level3.objective2": "अपना पूरा किया हुआ काम स्टेज करें",
    "teamwork.level3.objective3": "एक स्पष्ट संदेश के साथ कमिट करें",
    "teamwork.level3.objective4": "टीम रिव्यू के लिए अपनी ब्रांच पुश करें",
    "teamwork.level3.hint1": "एक फ़ीचर ब्रांच बनाएं: git switch -c feature/password-reset",
    "teamwork.level3.hint2": "विकल्प (क्लासिक): git checkout -b feature/password-reset",
    "teamwork.level3.hint3": "सभी बदलाव स्टेज करें: git add .",
    "teamwork.level3.hint4": 'एक विवरणात्मक संदेश के साथ कमिट करें: git commit -m "Add password reset functionality"',
    "teamwork.level3.hint5": "रिमोट पर पुश करें: git push origin feature/password-reset",
    "teamwork.level3.hint6": "शॉर्टहैंड विकल्प: git push -u origin feature/password-reset",
    "teamwork.level3.hint7":
        "ध्यान दें: वही ब्रांच नाम उपयोग करें जो आपने बनाया है (अगर आपने अलग नाम चुना है तो 'feature/password-reset' नहीं)",
    "teamwork.level3.requirement1.description": "कोड रिव्यू डेमो के लिए एक ब्रांच बनाएं",
    "teamwork.level3.requirement1.success": "फ़ीचर ब्रांच बन गई! ✨",
    "teamwork.level3.requirement2.description": "रिव्यू के लिए अपना कोड स्टेज करें",
    "teamwork.level3.requirement2.success": "कोड रिव्यू के लिए स्टेज हो गया! 📦",
    "teamwork.level3.requirement3.description": "एक स्पष्ट, रिव्यू करने लायक संदेश के साथ कमिट करें",
    "teamwork.level3.requirement3.success": "कोड एक स्पष्ट संदेश के साथ कमिट हो गया! 💬",
    "teamwork.level3.requirement4.description": "कोड रिव्यू के लिए अपनी ब्रांच पुश करें",
    "teamwork.level3.requirement4.success":
        "कोड टीम रिव्यू के लिए पुश हो गया! 🚀 असली टीमों में, अब आप एक Pull Request बनाते!",
    "teamwork.level3.story.title": "कोड रिव्यू की संस्कृति",
    "teamwork.level3.story.narrative": `📝 InnovateCorp की कोड रिव्यू प्रोसेस में आपका स्वागत है!

**स्थिति:**
आपने अभी-अभी password reset फ़ीचर लागू करना पूरा किया है। कोड आपके लोकल टेस्ट में बिल्कुल सही काम करता है! 🎉

लेकिन रुकिए - InnovateCorp में, कोई भी कोड बिना कोड रिव्यू के प्रोडक्शन में नहीं जाता। यह भरोसे की बात नहीं है - यह गुणवत्ता, नॉलेज शेयरिंग, और ग्राहकों तक पहुंचने से पहले बग पकड़ने की बात है।

**कोड रिव्यू क्यों ज़रूरी हैं:**
- **गुणवत्ता:** Sarah शायद वह सुरक्षा समस्या पकड़ ले जो आपसे छूट गई
- **नॉलेज शेयरिंग:** Mike आपके चतुर समाधान से सीखता है
- **बेहतर कोड:** कई नज़रिए बेहतर सॉफ़्टवेयर बनाते हैं
- **टीम की ग्रोथ:** हर कोई एक बेहतर डेवलपर बनता है

**आपका काम:**
आपको अपना password reset फ़ीचर टीम रिव्यू के लिए तैयार करना है। पेशेवर वर्कफ़्लो का पालन करें:

**चरण 1: एक फ़ीचर ब्रांच बनाएं**
कभी सीधे \`main\` पर काम न करें! अपने फ़ीचर के लिए एक समर्पित ब्रांच बनाएं।

**चरण 2: अपना काम स्टेज करें**
अपनी पूरी की हुई फ़ाइलों को स्टेजिंग एरिया में जोड़ें।

**चरण 3: एक स्पष्ट संदेश के साथ कमिट करें**
एक कमिट संदेश लिखें जो बताए कि आपने क्या बनाया। आपके साथियों को हर लाइन कोड पढ़े बिना आपके बदलाव समझ आने चाहिए।

**चरण 4: रिमोट पर पुश करें**
अपनी फ़ीचर ब्रांच अपलोड करें ताकि आपकी टीम इसे रिव्यू कर सके। असली टीमों में, फिर आप GitHub/GitLab पर एक Pull Request बनाते।

**याद रखें:** बेहतरीन कोड रिव्यू की कुंजी स्पष्ट संवाद है। आपके ब्रांच का नाम, कमिट संदेश, और कोड को एक कहानी बतानी चाहिए!

चलिए आपका कोड टीम के लिए तैयार करते हैं! 🚀`,
    "teamwork.level3.story.realWorldContext":
        "पेशेवर डेवलपमेंट में कोड रिव्यू एक मानक प्रथा है। ये कोड की गुणवत्ता सुधारते हैं, बग जल्दी पकड़ते हैं, और टीमों को एक-दूसरे से सीखने में मदद करते हैं। ज़्यादातर कंपनियां इसके लिए Pull Requests (GitHub) या Merge Requests (GitLab) का उपयोग करती हैं।",
    "teamwork.level3.story.taskIntroduction":
        "ब्रांच, कमिट, और पुश ऑपरेशंस के ज़रिए कोड को टीम रिव्यू के लिए तैयार करने का पेशेवर वर्कफ़्लो सीखें।",

    // Archaeology Stage
    "archaeology.name": "Git आर्कियोलॉजी",
    "archaeology.description": "किसी जासूस की तरह कोड इतिहास की जांच करें और Git फ़ॉरेंसिक्स करें",

    // Mastery Stage
    "mastery.name": "Git महारत",
    "mastery.description": "सच्चे मास्टर्स के लिए बेहतरीन Git चुनौतियां",

    "mastery.level1.name": "मल्टी-ब्रांच मर्ज चुनौती",
    "mastery.level1.description": "कॉन्फ्लिक्ट के साथ कई ब्रांचों में जटिल मर्ज में महारत हासिल करें",
    "mastery.level1.objective1": "एक साथ कई फ़ीचर ब्रांच मर्ज करें",
    "mastery.level1.objective2": "जटिल मर्ज कॉन्फ्लिक्ट सुलझाएं",
    "mastery.level1.objective3": "सुलझाए गए कॉन्फ्लिक्ट स्टेज करें",
    "mastery.level1.objective4": "मल्टी-वे मर्ज पूरा करें",
    "mastery.level1.hint1": "एक साथ कई ब्रांच मर्ज करने के लिए git merge का उपयोग करें",
    "mastery.level1.hint2": "हर कॉन्फ्लिक्ट को ध्यान से देखें - वे एक-दूसरे को प्रभावित कर सकते हैं",
    "mastery.level1.hint3": "सबसे अच्छा समाधान अक्सर सभी ब्रांचों के तत्वों को मिलाता है",
    "mastery.level1.hint4": "कमिट करने से पहले अपने मर्ज किए गए कोड को टेस्ट करें",
    "mastery.level1.requirement1.description": "सभी फ़ीचर ब्रांच को main में मर्ज करें",
    "mastery.level1.requirement1.success": "जटिल मर्ज शुरू हो गया! अब कॉन्फ्लिक्ट सुलझाएं।",
    "mastery.level1.requirement2.description": "सभी सुलझाई गई फ़ाइलें स्टेज करें",
    "mastery.level1.requirement2.success": "कॉन्फ्लिक्ट सुलझ गए और स्टेज हो गए!",
    "mastery.level1.requirement3.description": "एक कमिट के साथ मर्ज पूरा करें",
    "mastery.level1.requirement3.success": "मास्टर-स्तर का मर्ज पूरा हुआ! आपने मल्टी-वे मर्ज पर विजय पा ली!",
    "mastery.level1.story.title": "इंटीग्रेशन चुनौती",
    "mastery.level1.story.narrative":
        "तिमाही रिलीज़ के लिए तीन टीमें समानांतर काम कर रही थीं। हर टीम ने अलग-अलग ब्रांचों पर ज़रूरी फ़ीचर डेवलप किए। अब इंटीग्रेशन का दिन है, और आप वह लीड डेवलपर हैं जो सब कुछ एक साथ मर्ज करने के ज़िम्मेदार हैं। चुनौती यह है: तीनों ब्रांचों ने साझा यूटिलिटी फ़ाइलों में बदलाव किए हैं। आपको सभी ब्रांच मर्ज करके और कॉन्फ्लिक्ट सुलझाकर एक सुसंगत, काम करने वाला सिस्टम बनाना है।",
    "mastery.level1.story.realWorldContext":
        "बड़े प्रोजेक्ट्स में जहां कई समानांतर डेवलपमेंट स्ट्रीम चलती हैं, वहां जटिल मल्टी-ब्रांच मर्ज आम बात है। सीनियर डेवलपर्स और टेक्निकल लीड के लिए इस हुनर में महारत हासिल करना ज़रूरी है।",
    "mastery.level1.story.taskIntroduction":
        "ओवरलैप करने वाले बदलावों के साथ तीन फ़ीचर ब्रांच मर्ज करें और एक एकीकृत कोडबेस बनाने के लिए सभी कॉन्फ्लिक्ट सुलझाएं।",

    "mastery.level2.name": "Git हुक्स और ऑटोमेशन",
    "mastery.level2.description": "वर्कफ़्लो को ऑटोमेट करने और गुणवत्ता मानकों को लागू करने के लिए Git हुक्स लागू करें",
    "mastery.level2.objective1": "कोड क्वालिटी के लिए pre-commit हुक्स बनाएं",
    "mastery.level2.objective2": "नोटिफ़िकेशन के लिए post-commit हुक्स सेट करें",
    "mastery.level2.objective3": "सर्वर-साइड हुक्स लागू करें",
    "mastery.level2.objective4": "ऑटोमेटेड वर्कफ़्लो पाइपलाइन बनाएं",
    "mastery.level2.hint1": "Pre-commit हुक्स कमिट बनने से पहले चलते हैं",
    "mastery.level2.hint2": "Post-commit हुक्स सफल कमिट के बाद चलते हैं",
    "mastery.level2.hint3": "pre-commit हुक्स में कमिट रोकने के लिए exit code का उपयोग करें",
    "mastery.level2.hint4": "सर्वर-साइड हुक्स नियंत्रित करते हैं कि क्या पुश किया जा सकता है",
    "mastery.level2.requirement1.description": "pre-commit हुक को एक्ज़ीक्यूटेबल बनाएं",
    "mastery.level2.requirement1.success": "Pre-commit हुक सक्रिय हो गया!",
    "mastery.level2.requirement2.description": "pre-commit हुक टेस्ट करने के लिए फ़ाइलें स्टेज करें",
    "mastery.level2.requirement2.success": "फ़ाइलें स्टेज हो गईं!",
    "mastery.level2.requirement3.description": "क्वालिटी चेक ट्रिगर करने के लिए एक कमिट की कोशिश करें",
    "mastery.level2.requirement3.success": "क्वालिटी चेक पास हो गए!",
    "mastery.level2.story.title": "क्वालिटी गार्डियन",
    "mastery.level2.story.narrative": `⚡ आपको DevOps इंजीनियर के पद पर प्रमोट कर दिया गया है, और आपका पहला मिशन है "Quality Guardian" लागू करना - एक ऑटोमेटेड सिस्टम जो ख़राब कोड को रिपॉजिटरी में आने से रोकता है।

डेवलपमेंट टीम तेज़ी से बढ़ रही है, और बढ़त के साथ असंगति भी आती है:
- बिना सही टेस्टिंग के कमिट
- कोड स्टाइल का उल्लंघन
- गलती से कमिट हुए सीक्रेट्स
- main में पुश हुए टूटे हुए बिल्ड

आपकी टीम लीड, Sarah, अपना विज़न समझाती हैं:

"हमें अपने क्वालिटी मानकों को लागू करने के लिए ऑटोमेशन चाहिए। हर कमिट अपने-आप इन चीज़ों के लिए जांचा जाना चाहिए:
- Linting और कोड स्टाइल
- यूनिट टेस्ट का पास होना
- सुरक्षा कमज़ोरियां
- कमिट संदेश मानक"

"इसके लिए Git हुक्स बिल्कुल सही हैं। ये ऐसी स्क्रिप्ट होती हैं जो Git वर्कफ़्लो के विशेष बिंदुओं पर चलती हैं। इन्हें क्वालिटी गेट्स समझें जिनसे कोड को गुज़रना ही होता है।"

हुक इकोसिस्टम:
- pre-commit: कमिट बनने से पहले जांच चलाता है
- pre-push: रिमोट पर पुश करने से पहले वैलिडेट करता है
- post-commit: नोटिफ़िकेशन भेजता है या बिल्ड ट्रिगर करता है
- सर्वर-साइड हुक्स: नियंत्रित करते हैं कि क्या पुश किया जा सकता है

आपका मिशन:
1. क्वालिटी चेक के लिए एक pre-commit हुक लागू करें
2. ऑटोमेटेड टेस्टिंग और लिंटिंग सेट करें
3. नोटिफ़िकेशन सिस्टम बनाएं
4. एक व्यापक क्वालिटी पाइपलाइन बनाएं

यह इंफ़्रास्ट्रक्चर का काम है जिससे आपकी टीम का हर डेवलपर फ़ायदा उठाएगा। आप सिर्फ़ कोड नहीं लिख रहे हैं - आप कोड क्वालिटी की नींव बना रहे हैं।`,
    "mastery.level2.story.realWorldContext":
        "पेशेवर डेवलपमेंट माहौल में ऑटोमेटेड क्वालिटी एश्योरेंस और वर्कफ़्लो ऑटोमेशन लागू करने के लिए Git हुक्स बेहद ज़रूरी हैं।",
    "mastery.level2.story.taskIntroduction":
        "ऑटोमेटेड क्वालिटी सिस्टम बनाने के लिए Git हुक्स में महारत हासिल करें जो मानकों को लागू करें और टीम की उत्पादकता बढ़ाएं।",

    "mastery.level3.name": "Git महारत: अंतिम चुनौती",
    "mastery.level3.description": "एक जटिल असल-दुनिया परिदृश्य हल करने के लिए सारी एडवांस्ड Git तकनीकें मिलाएं",
    "mastery.level3.objective1": "कई hotfix के साथ एक जटिल रिलीज़ को व्यवस्थित करें",
    "mastery.level3.objective2": "इमरजेंसी rollback और रिकवरी संभालें",
    "mastery.level3.objective3": "एक साथ कई टीमों के साथ समन्वय करें",
    "mastery.level3.objective4": "सभी तकनीकों में अपनी महारत दिखाएं",
    "mastery.level3.hint1": "यह चुनौती वह सब कुछ मिलाती है जो आपने सीखा है",
    "mastery.level3.hint2": "ब्रांच मैनेजमेंट के बारे में रणनीतिक रूप से सोचें",
    "mastery.level3.hint3": "संवाद उतना ही ज़रूरी है जितना तकनीकी हुनर",
    "mastery.level3.hint4": "टीम के लिए अपने फ़ैसले दर्ज करें",
    "mastery.level3.requirement1.description": "एक इमरजेंसी rollback ब्रांच बनाएं",
    "mastery.level3.requirement1.success": "इमरजेंसी प्रक्रिया शुरू हो गई!",
    "mastery.level3.requirement2.description": "गंभीर फ़िक्स को cherry-pick करें",
    "mastery.level3.requirement2.success": "गंभीर फ़िक्स लागू हो गए!",
    "mastery.level3.requirement3.description": "इमरजेंसी रिलीज़ को टैग करें",
    "mastery.level3.requirement3.success": "इमरजेंसी रिलीज़ टैग हो गई!",
    "mastery.level3.requirement4.description": "इमरजेंसी रिलीज़ टैग को पुश करें",
    "mastery.level3.requirement4.success": "🎉 महारत हासिल हुई! अब आप एक Git मास्टर हैं!",
    "mastery.level3.story.title": "बेहतरीन Git चुनौती: ब्लैक फ़्राइडे संकट",
    "mastery.level3.story.narrative": `🚨 ब्लैक फ़्राइडे, रात 2:00 बजे - सबसे बड़ी परीक्षा

आप MegaCorp में Senior DevOps Engineer हैं, और साल के सबसे बड़े शॉपिंग दिन पर आप Git चुनौतियों के सबसे भयानक तूफ़ान का सामना कर रहे हैं।

स्थिति:
- एक ख़राब डिप्लॉयमेंट की वजह से प्रोडक्शन आंशिक रूप से टूटा हुआ है
- तीन अलग-अलग टीमों ने एक साथ hotfix पुश किए
- पेमेंट सिस्टम रुक-रुक कर फ़ेल हो रहा है
- कस्टमर सपोर्ट पर दबाव बहुत ज़्यादा है
- CEO हर घंटे अपडेट मांग रहे हैं
- ब्लैक फ़्राइडे का ट्रैफ़िक सामान्य से 50 गुना ज़्यादा है

आपके CTO एक इमरजेंसी मीटिंग बुलाते हैं:

"इसीलिए हमने आपको नियुक्त किया था। हमने जो कुछ भी बनाया है, जो कुछ भी सीखा है, वह सब इसी पल पर टिका है। हमें ऐसे किसी की ज़रूरत है जो भारी दबाव में जटिल Git ऑपरेशंस संभाल सके।"

चुनौती में शामिल है:
1. **इमरजेंसी Rollback**: समस्याग्रस्त डिप्लॉयमेंट को तुरंत वापस लें
2. **चुनिंदा रिकवरी**: सिर्फ़ अच्छे बदलावों को cherry-pick करें
3. **Hotfix समन्वय**: कई टीमों के गंभीर फ़िक्स मर्ज करें
4. **रिलीज़ मैनेजमेंट**: इमरजेंसी पैच बनाएं और डिप्लॉय करें
5. **टीम संवाद**: डेवलपमेंट, QA, और ऑपरेशंस के बीच समन्वय करें

आपको अपने भंडार का हर Git तकनीक इस्तेमाल करनी होगी:
- गड़बड़ कमिट साफ़ करने के लिए \`git rebase -i\`
- सिर्फ़ काम करने वाले फ़ीचर चुनने के लिए \`git cherry-pick <commit-hash>\` (एक ब्रांच से दूसरी ब्रांच में विशेष कमिट कॉपी करता है)
- टीम के काम को मिलाने के लिए \`git merge\` से एडवांस्ड मर्जिंग
- ठीक-ठीक समस्या वाला कमिट खोजने के लिए \`git bisect\` (बग खोजने के लिए इतिहास में बाइनरी सर्च)
- ग़लतियों से उबरने के लिए \`git reflog\`
- रिलीज़ मैनेजमेंट के लिए \`git tag\` और ब्रांच
- Git इतिहास बनाए रखते हुए फ़ाइलों का नाम बदलने के लिए \`git mv <old> <new>\`

**git cherry-pick क्या है?**
Cherry-picking से आप एक ब्रांच से दूसरी ब्रांच में विशेष कमिट कॉपी कर सकते हैं। पूरी ब्रांच मर्ज करने के बजाय, आप अलग-अलग कमिट चुन सकते हैं। एक ब्रांच से दूसरी में hotfix लागू करने के लिए बिल्कुल सही!

उदाहरण: \`git cherry-pick abc123\` - कमिट abc123 को आपकी मौजूदा ब्रांच पर लागू करता है

**git bisect क्या है?**
Bisect बाइनरी सर्च का उपयोग करके यह पता लगाने में मदद करता है कि किस कमिट ने बग पैदा किया। Git आपके लिए टेस्ट करने को कमिट checkout करता रहता है, और आप उसे "good" या "bad" बताते रहते हैं जब तक कि वह समस्याग्रस्त कमिट न खोज ले।

उदाहरण:
\`git bisect start\`
\`git bisect bad\` (मौजूदा कमिट टूटा हुआ है)
\`git bisect good abc123\` (यह पुराना कमिट ठीक काम करता था)
इसके बाद Git आपको तब तक कमिट टेस्ट करने में मार्गदर्शन देगा जब तक कि उसे पहला ख़राब कमिट न मिल जाए!

**git mv क्या है?**
Git इतिहास बरकरार रखते हुए फ़ाइलों को मूव या रीनेम करें। फ़ाइलों को मैन्युअली रीनेम करने से बेहतर, क्योंकि Git रीनेम को ट्रैक करता है।

उदाहरण: \`git mv old-name.js new-name.js\`

यह सिर्फ़ Git कमांड की बात नहीं है - यह नेतृत्व, दबाव में फ़ैसले लेने, और जब सब कुछ जल रहा हो तब व्यवस्थित तरीके से सोचने की काबिलियत की बात है।

कंपनी का ब्लैक फ़्राइडे रेवेन्यू आप पर निर्भर है। लाखों ग्राहक इंतज़ार कर रहे हैं। आपकी टीम आपकी तरफ़ मार्गदर्शन के लिए देख रही है।

यह आपका पल है। उन्हें दिखाइए कि एक Git मास्टर क्या कर सकता है।

अपनी महारत साबित करने के लिए तैयार हैं? घड़ी टिक-टिक कर रही है...`,
    "mastery.level3.story.realWorldContext":
        "असल दुनिया की Git महारत में भारी दबाव में जटिल ऑपरेशंस को व्यवस्थित करना, कई स्टेकहोल्डर्स को संभालना, और ऐसे अहम फ़ैसले लेना शामिल है जो बिज़नेस ऑपरेशंस को प्रभावित करते हैं।",
    "mastery.level3.story.taskIntroduction":
        "यह सबसे बड़ी Git चुनौती है - एक जटिल, भारी दबाव वाली इमरजेंसी स्थिति संभालने के लिए अपने सारे हुनर मिलाएं।",

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
    "intro.level4.name": "बदलावों की जाँच",
    "intro.level4.description": "ठीक-ठीक देखें कि आपकी फ़ाइलों में क्या बदला है",
    "intro.level4.objective1": "पता लगाएँ कि कौन सी फ़ाइलें बदली गई हैं",
    "intro.level4.objective2": "बदलावों को लाइन दर लाइन जाँचें",
    "intro.level4.hint1": "`git status` कमांड से देखें कि कौन सी फ़ाइलें बदली गई हैं",
    "intro.level4.hint2": "`git diff` कमांड से उन फ़ाइलों के अंदर के सटीक बदलाव देखें",
    "intro.level4.hint3": "आप `git diff <file>` से किसी एक फ़ाइल की भी जाँच कर सकते हैं",
    "intro.level4.requirement1.description": "जाँचें कि कौन सी फ़ाइलें बदली गई हैं",
    "intro.level4.requirement1.success": "बहुत बढ़िया! `git status` दिखाता है कि src/config.js बदली गई है।",
    "intro.level4.requirement2.description": "git diff से सटीक बदलाव दिखाएँ",
    "intro.level4.requirement2.success":
        "शानदार! अब आप commit होने से पहले ठीक-ठीक देख सकते हैं कि कौन सी लाइनें बदली हैं।",
    "intro.level4.story.title": "रहस्यमय बदलाव",
    "intro.level4.story.narrative":
        'TechStart में सोमवार की सुबह है। Alex चिंतित चेहरे के साथ आपकी डेस्क पर आते हैं।\n\n"शुक्रवार को जाने से पहले Sarah ने वेबसाइट के कॉन्फ़िगरेशन में कुछ बदला था - लेकिन अब वह छुट्टी पर है और आज हमारी रिलीज़ है। मुझे ठीक-ठीक जानना है कि उसने क्या बदला।"\n\nवे समझाते हैं: "`git status` सिर्फ़ यह बताता है कि कौन सी फ़ाइलें बदली हैं। उनके अंदर क्या बदला, यह देखने के लिए हम `git diff` इस्तेमाल करते हैं। यह कमांड आपकी वर्किंग फ़ाइलों की तुलना आख़िरी commit से करता है और हर जोड़ी या हटाई गई लाइन दिखाता है।"\n\n"पहले रिपॉज़िटरी का स्टेटस देखें, फिर `git diff` से बदलाव की जाँच करें। + से शुरू होने वाली लाइनें जोड़ी गई हैं और - से शुरू होने वाली लाइनें हटाई गई हैं।"',
    "intro.level4.story.realWorldContext":
        "डेवलपर दिन में कई बार `git diff` चलाते हैं - ख़ासकर commit करने से ठीक पहले। अपने बदलावों की पहले ख़ुद समीक्षा करने से डिबग फ़्लैग, बचा हुआ टेस्ट कोड और सीक्रेट प्रोजेक्ट हिस्ट्री में जाने से पहले ही पकड़ में आ जाते हैं।",
    "intro.level4.story.taskIntroduction":
        "`git status` से बदली हुई फ़ाइल ढूँढें और फिर `git diff` से ठीक-ठीक देखें कि क्या बदला है।",

    // Files Level 4
    "files.level4.name": "फ़ाइलों का नाम बदलना",
    "files.level4.description": "Git के साथ किसी फ़ाइल का नाम बदलें और उसका इतिहास सुरक्षित रखें",
    "files.level4.objective1": "git mv से src/app-config.js का नाम बदलकर src/config.js करें",
    "files.level4.objective2": "नाम बदलने को एक स्पष्ट संदेश के साथ commit करें",
    "files.level4.hint1": "`git mv <old-name> <new-name>` कमांड का उपयोग करें",
    "files.level4.hint2": "`git mv` एक ही चरण में फ़ाइल का नाम बदलता है और बदलाव को stage कर देता है",
    "files.level4.hint3": "अंत में `git commit -m 'आपका संदेश'` से नाम बदलने को रिकॉर्ड करें",
    "files.level4.requirement1.description": "git mv से फ़ाइल का नाम बदलें",
    "files.level4.requirement1.success":
        "बहुत बढ़िया! Git ने फ़ाइल का नाम बदल दिया और बदलाव को आपके लिए stage भी कर दिया।",
    "files.level4.requirement2.description": "नाम बदलने को एक संदेश के साथ commit करें",
    "files.level4.requirement2.success": "शानदार! नाम बदलना अब प्रोजेक्ट के इतिहास का हिस्सा है।",
    "files.level4.story.title": "साफ़-सुथरा कोडबेस",
    "files.level4.story.narrative":
        '"कोड रिव्यू से पहले एक और बात," Alex आपके फ़ाइल ट्री की ओर इशारा करते हुए कहते हैं। "टीम में हमने छोटे और एक जैसे फ़ाइल नामों पर सहमति बनाई है। app-config.js का नाम बस config.js होना चाहिए।"\n\nवे आगे कहते हैं: "इसे सिर्फ़ फ़ाइल एक्सप्लोरर में नाम मत बदलिए! इसके बजाय `git mv` का उपयोग कीजिए - यह एक ही चरण में फ़ाइल का नाम बदलता है और बदलाव को stage कर देता है, जिससे Git फ़ाइल का इतिहास बनाए रखता है।"',
    "files.level4.story.realWorldContext":
        "जब प्रोजेक्ट बढ़ते हैं और नामकरण की परंपराएँ बदलती हैं, तो फ़ाइलों का नाम बदलना आम बात है। `git mv` के साथ Git नाम बदलने को साफ़ तरीके से रिकॉर्ड करता है, बजाय इसके कि उसे एक हटी हुई और एक बिल्कुल नई फ़ाइल दिखे।",
    "files.level4.story.taskIntroduction":
        "`git mv` से src/app-config.js का नाम बदलकर src/config.js करें और फिर बदलाव को commit करें।",

    // Branches Level 6
    "branches.level6.name": "ब्रांच की सफ़ाई",
    "branches.level6.description": "मर्ज हो चुकी और छोड़ी गई ब्रांचों को डिलीट करके अपनी रिपॉज़िटरी साफ़ रखें",
    "branches.level6.objective1": "मर्ज हो चुकी ब्रांच feature/search-filters को डिलीट करें",
    "branches.level6.objective2": "छोड़ी गई ब्रांच experiment/new-ui को फ़ोर्स-डिलीट करें",
    "branches.level6.hint1": "`git branch` चलाकर देखें कि कौन-कौन सी ब्रांच अभी मौजूद हैं",
    "branches.level6.hint2":
        "`git branch -d feature/search-filters` का इस्तेमाल करें - छोटा -d सिर्फ़ उन्हीं ब्रांचों को डिलीट करता है जो पूरी तरह मर्ज हो चुकी हैं",
    "branches.level6.hint3":
        "बिना मर्ज हुई ब्रांच को Git -d से डिलीट करने से मना कर देता है। डिलीट फ़ोर्स करने के लिए `git branch -D experiment/new-ui` का इस्तेमाल करें",
    "branches.level6.requirement1.description":
        "git branch -d से मर्ज हो चुकी ब्रांच feature/search-filters को डिलीट करें",
    "branches.level6.requirement1.success":
        "शाबाश! Git ने डिलीट की अनुमति दी, क्योंकि feature/search-filters का सारा काम पहले से main में मौजूद है।",
    "branches.level6.requirement2.description": "git branch -D से छोड़ी गई ब्रांच experiment/new-ui को डिलीट करें",
    "branches.level6.requirement2.success":
        "बहुत बढ़िया! -D से आपने बिना मर्ज हुआ प्रयोग हटा दिया - आपकी ब्रांच सूची फिर से साफ़ है।",
    "branches.level6.story.title": "रिपॉज़िटरी की सफ़ाई",
    "branches.level6.story.narrative":
        '"हमारी ब्रांच सूची भरती जा रही है," एलेक्स रिपॉज़िटरी स्क्रॉल करते हुए कहते हैं। "feature/search-filters के सर्च फ़िल्टर हफ़्तों पहले main में मर्ज हो चुके हैं, और experiment/new-ui एक प्रोटोटाइप था जिसे आगे न बढ़ाने का हमने फ़ैसला किया।"\n\nवे समझाते हैं: "मर्ज हो चुकी ब्रांच के लिए `git branch -d` का इस्तेमाल करो - छोटा -d सुरक्षित है, क्योंकि Git जाँचता है कि कुछ खोए नहीं। उस प्रयोग के लिए Git मना कर देगा, क्योंकि उसके कमिट कभी मर्ज नहीं हुए। इसीलिए बड़ा -D है: यह बिना मर्ज हुए काम के साथ भी ब्रांच डिलीट कर देता है - इसलिए इसे तभी इस्तेमाल करो जब तुम पूरी तरह निश्चित हो।"',
    "branches.level6.story.realWorldContext":
        "असली प्रोजेक्ट्स में समय के साथ दर्जनों बेकार ब्रांचें जमा हो जाती हैं। मर्ज हो चुकी ब्रांचों को नियमित रूप से डिलीट करने से रिपॉज़िटरी में काम करना आसान रहता है। छोटा -d सुरक्षित डिफ़ॉल्ट है, क्योंकि Git बिना मर्ज हुए कमिट की रक्षा करता है, जबकि -D जान-बूझकर काम को हटा देता है - कमिट अक्सर reflog से वापस मिल सकते हैं, पर उस पर कभी भरोसा नहीं करना चाहिए।",
    "branches.level6.story.taskIntroduction":
        "पहले मर्ज हो चुकी ब्रांच feature/search-filters को `git branch -d` से डिलीट करें, फिर छोड़ी गई ब्रांच experiment/new-ui को `git branch -D` से फ़ोर्स-डिलीट करें।",

    // Merge Level 4
    "merge.level4.name": "मर्ज कॉन्फ्लिक्ट सुलझाना",
    "merge.level4.description": "मर्ज कॉन्फ्लिक्ट को हाथ से सुलझाकर मर्ज पूरा करें",
    "merge.level4.objective1": "git status से जाँचें कि कौन-सी फ़ाइल में कॉन्फ्लिक्ट है",
    "merge.level4.objective2": "src/api.js को एडिट करें, कॉन्फ्लिक्ट मार्कर हटाएँ और सुलझाई हुई फ़ाइल को stage करें",
    "merge.level4.objective3": "एक कमिट के साथ मर्ज पूरा करें",
    "merge.level4.hint1": "`git status` से शुरू करें ताकि पता चले कि कौन-सी फ़ाइलें कॉन्फ्लिक्ट में हैं",
    "merge.level4.hint2":
        "`src/api.js` खोलें और कॉन्फ्लिक्ट मार्कर (`<<<<<<<`, `=======`, `>>>>>>>`) हटा दें — वही कोड रखें जो टीम को चाहिए, फिर फ़ाइल को `git add .` से stage करें",
    "merge.level4.hint3": "`git commit -m 'Resolve merge conflict'` से मर्ज पूरा करें",
    "merge.level4.requirement1.description": "git status से कॉन्फ्लिक्ट की जाँच करें",
    "merge.level4.requirement1.success": "बढ़िया! अब आप ठीक-ठीक जानते हैं कि किस फ़ाइल पर ध्यान देना है: src/api.js.",
    "merge.level4.requirement2.description": "सुलझाई हुई फ़ाइल को stage करें",
    "merge.level4.requirement2.success": "शानदार! सुलझाई हुई फ़ाइल stage हो गई — कोई कॉन्फ्लिक्ट मार्कर बाकी नहीं बचा।",
    "merge.level4.requirement3.description": "मर्ज पूरा करने के लिए कमिट करें",
    "merge.level4.requirement3.success": "कमाल! आपने अपना पहला मर्ज कॉन्फ्लिक्ट किसी प्रो की तरह सुलझा लिया।",
    "merge.level4.story.title": "अब भागना नहीं है",
    "merge.level4.story.narrative":
        '"वह मर्ज याद है जिसे हमने रद्द कर दिया था?", सारा मुस्कुराते हुए पूछती है। "rate limiter आज ही लाइव होना है — इस बार हम पीछे हटने के बजाय कॉन्फ्लिक्ट को सुलझाएँगे।"\n\nवह आपकी स्क्रीन की ओर इशारा करती है: "Git ने कॉन्फ्लिक्ट को सीधे फ़ाइल के अंदर चिह्नित कर दिया है। <<<<<<< HEAD और ======= के बीच का हिस्सा main का हमारा वर्ज़न है, और वहाँ से >>>>>>> तक का हिस्सा feature/rate-limit से आया है। आपका काम: फ़ाइल एडिट करें, ज़रूरी कोड रखें और मार्कर हटा दें। फिर `git add` और `git commit` — इसी तरह मर्ज पूरा होता है।"',
    "merge.level4.story.realWorldContext":
        "कॉन्फ्लिक्ट सुलझाना टीम डेवलपमेंट का रोज़मर्रा का हिस्सा है। कदम हमेशा वही रहते हैं: 1) कॉन्फ्लिक्ट वाली फ़ाइल खोलें, 2) तय करें कि कौन-सा कोड रहेगा (अक्सर दोनों का मेल), 3) मार्कर हटाएँ, 4) फ़ाइल को stage करें और कमिट करें। आधुनिक एडिटर मार्कर हाइलाइट कर देते हैं, पर उसके पीछे यही वर्कफ़्लो होता है।",
    "merge.level4.story.taskIntroduction":
        "feature/rate-limit को main में मर्ज करते समय src/api.js में कॉन्फ्लिक्ट आ गया है। स्टेटस जाँचें, फ़ाइल में कॉन्फ्लिक्ट सुलझाएँ, फिर उसे stage करें और एक कमिट के साथ मर्ज पूरा करें।",

    // Rebase Level 5
    "rebase.level5.name": "बिना ब्रांच बदले Rebase",
    "rebase.level5.description":
        "git rebase का दो-आर्ग्युमेंट रूप सीखें, जिससे किसी ब्रांच को पहले checkout किए बिना rebase किया जा सकता है",
    "rebase.level5.objective1": "git rebase के दो-आर्ग्युमेंट रूप से feature/payment-api ब्रांच को main पर rebase करें",
    "rebase.level5.hint1":
        "आप दो आर्ग्युमेंट दे सकते हैं: `git rebase <upstream> <branch>` — Git `<branch>` को checkout करके उसे एक ही चरण में `<upstream>` पर rebase कर देता है",
    "rebase.level5.hint2": "`git rebase main feature/payment-api` आज़माएँ — पहले ब्रांच बदलने की ज़रूरत नहीं है",
    "rebase.level5.requirement1.description": "दो-आर्ग्युमेंट रूप से feature/payment-api को main पर rebase करें",
    "rebase.level5.requirement1.success":
        "शानदार! आपने सिर्फ़ एक कमांड में feature/payment-api को main पर rebase कर दिया — बिना कोई ब्रांच बदले।",
    "rebase.level5.story.title": "एक कमांड, दो आर्ग्युमेंट",
    "rebase.level5.story.narrative":
        '"आज रात हम पेमेंट्स रिलीज़ शिप कर रहे हैं," Alex बोर्ड की ओर देखते हुए कहते हैं। "तुम अभी main पर रिलीज़ की जाँच कर रहे हो, और feature/payment-api ब्रांच फिर से पीछे रह गई है।"\n\nवे मुस्कुराते हैं: "एक तरकीब जो ज़्यादातर लोग नहीं जानते: git rebase एक दूसरा आर्ग्युमेंट भी लेता है। पहले ब्रांच बदलने के बजाय, कमांड में ही Git को बता दो कि कौन-सी ब्रांच rebase करनी है — Git उसे checkout करके एक ही बार में main पर फिर से लागू कर देता है।"',
    "rebase.level5.story.realWorldContext":
        "दो-आर्ग्युमेंट रूप git rebase <upstream> <branch> रोज़मर्रा के काम में एक उपयोगी शॉर्टकट है: यह <branch> को checkout करके एक ही चरण में <upstream> पर rebase कर देता है। इससे एक अतिरिक्त checkout बचता है और व्यस्त रिलीज़ के दिन आसानी से आगे बढ़ते हैं।",
    "rebase.level5.story.taskIntroduction":
        "आप main पर हैं। एक ही कमांड में feature/payment-api को main पर rebase करें: git rebase main feature/payment-api",

    // Remote Level 4
    "remote.level4.name": "-u के साथ Upstream Tracking",
    "remote.level4.description": "एक बार upstream सेट करें, फिर बिना किसी argument के push करें",
    "remote.level4.objective1": "login-form ब्रांच को upstream tracking के साथ publish करें",
    "remote.level4.objective2": "बेहतर error messages को commit करें",
    "remote.level4.objective3": "फिर से push करें — इस बार बिना किसी argument के",
    "remote.level4.hint1":
        "पहले ब्रांच publish करें: `git push -u origin login-form`. `-u` फ्लैग आपकी लोकल ब्रांच को remote ब्रांच से जोड़ देता है।",
    "remote.level4.hint2":
        "फिर बदलाव stage करके commit करें: पहले `git add .` और फिर `git commit -m 'Polish login error messages'`",
    "remote.level4.hint3":
        "क्योंकि upstream सेट है, अब सिर्फ़ `git push` काफ़ी है — न remote का नाम चाहिए, न ब्रांच का।",
    "remote.level4.requirement1.description": "`git push -u origin login-form` से login-form ब्रांच publish करें",
    "remote.level4.requirement1.success":
        "ब्रांच publish हो गई! अब Git याद रखेगा कि login-form, origin/login-form को track करती है।",
    "remote.level4.requirement2.description": "src/login.js में बेहतर error messages को commit करें",
    "remote.level4.requirement2.success":
        "बहुत बढ़िया! आपका आख़िरी सुधार लोकल commit हो गया — टीम तक पहुँचने में बस एक कदम बाकी है।",
    "remote.level4.requirement3.description": "अपना नया commit सिर्फ़ `git push` से भेजें",
    "remote.level4.requirement3.success": "शानदार! सिर्फ़ `git push` काफ़ी था — यही upstream tracking की ताक़त है।",
    "remote.level4.story.title": "एक बार सेट करें, हमेशा push करें",
    "remote.level4.story.narrative":
        '"लॉगिन फ़ॉर्म शानदार बना है!" Alex अपनी कुर्सी खिसकाकर TechStart में आपकी डेस्क तक आते हैं। "अपनी `login-form` ब्रांच publish करो ताकि टीम review शुरू कर सके। और अपने लिए एक अच्छा काम करो: उसे `-u` के साथ push करो। यह फ्लैग upstream सेट करता है — Git याद रखता है कि तुम्हारी लोकल ब्रांच किस remote ब्रांच से जुड़ी है।"\n\nवे मुस्कुराते हैं: "मुझे `src/login.js` में अभी भी एक uncommitted सुधार दिख रहा है — वही friendly error messages। पहले ब्रांच publish करो, फिर सुधार commit करो और दोबारा push करो। ग़ौर से देखना: दूसरी बार सिर्फ़ `git push` काफ़ी है। न remote, न ब्रांच का नाम — Git को पहले से पता है कि उसे कहाँ जाना है।"',
    "remote.level4.story.realWorldContext":
        "किसी नई ब्रांच का पहला push लगभग हमेशा `git push -u origin <branch>` होता है। एक बार upstream सेट हो जाए, तो `git push` और `git pull` बिना arguments के काम करते हैं, और `git status` बता सकता है कि आप remote से कितने commits आगे या पीछे हैं। बिना upstream के Git आपको मशहूर error के साथ रोक देता है: 'The current branch has no upstream branch.'",
    "remote.level4.story.taskIntroduction":
        "ब्रांच को `git push -u origin login-form` से publish करें, फिर बेहतर error messages commit करें और उन्हें सिर्फ़ `git push` से भेजें।",

    // Workflow Level 4
    "workflow.level4.name": "परफ़ेक्ट कमिट: Amend",
    "workflow.level4.description": "किसी को ग़लती पता चलने से पहले अपनी आख़िरी कमिट को git commit --amend से ठीक करो",
    "workflow.level4.objective1": "भूली हुई config फ़ाइल को stage करो",
    "workflow.level4.objective2": "अपनी आख़िरी कमिट को amend करके फ़ाइल जोड़ो और मैसेज ठीक करो",
    "workflow.level4.objective3": "सुधरी हुई कमिट को remote पर push करो",
    "workflow.level4.hint1":
        "`git status` चलाओ — अपडेट की गई /src/config.js कभी stage ही नहीं हुई, इसलिए तुम्हारी fix कमिट अधूरी है।",
    "workflow.level4.hint2": "छूटी हुई फ़ाइल को `git add src/config.js` (या `git add .`) से stage करो।",
    "workflow.level4.hint3":
        "`git commit --amend -m 'Fix login timeout'` से stage की गई फ़ाइल को आख़िरी कमिट में शामिल करो और साथ ही मैसेज की स्पेलिंग भी ठीक करो।",
    "workflow.level4.hint4":
        "यहाँ amend सुरक्षित है क्योंकि कमिट अभी तक push नहीं हुई। `git push origin main` से काम पूरा करो। जो कमिट पहले ही push हो चुकी हों, उन्हें कभी amend मत करो!",
    "workflow.level4.requirement1.description": "भूली हुई config फ़ाइल को stage करो",
    "workflow.level4.requirement1.success": "फ़ाइल stage हो गई! अब इसे पिछली कमिट में शामिल किया जा सकता है।",
    "workflow.level4.requirement2.description": "आख़िरी कमिट को 'git commit --amend' से amend करो",
    "workflow.level4.requirement2.success":
        "कमिट amend हो गई! एक बग, एक साफ़-सुथरी कमिट — config फ़ाइल और बिना ग़लती वाले मैसेज के साथ।",
    "workflow.level4.requirement3.description": "सुधरी हुई कमिट को 'git push origin main' से push करो",
    "workflow.level4.requirement3.success":
        "Push हो गई! टाइपो के बारे में किसी को कभी पता नहीं चलेगा — तुम्हारी history ऐसी दिखती है जैसे पहली बार में ही सब सही किया हो।",
    "workflow.level4.story.title": "लगभग परफ़ेक्ट कमिट",
    "workflow.level4.story.narrative":
        'TechStart में शुक्रवार शाम के 4:55 बजे हैं। तुमने अभी-अभी login-timeout बग का fix कमिट किया है और जैकेट उठाने ही वाले हो कि टीम लीड Alex अपनी कुर्सी खिसकाते हुए तुम्हारी डेस्क पर आते हैं।\n\n"रुको — ज़रा अपनी आख़िरी कमिट देखो," Alex स्क्रीन की ओर इशारा करते हुए कहते हैं।\n\n`git log` तुम्हारा कमिट मैसेज दिखाता है: **"Fix login timout"**। अरे, स्पेलिंग की ग़लती! और `git status` उससे भी बुरी बात बताता है: `src/config.js` — वही फ़ाइल जो session timeout को असल में 30 मिनट करती है — कभी stage ही नहीं हुई। तुम्हारी "fix" कमिट में आधा ही समाधान है।\n\n"घबराओ मत," Alex मुस्कुराते हैं। "तुमने अभी push नहीं किया है। यानी हम आख़िरी कमिट को ऐसे फिर से लिख सकते हैं जैसे ग़लती कभी हुई ही न हो।"\n\n**`git commit --amend` क्या करता है?**\nयह तुम्हारी आख़िरी कमिट को सुधरे हुए संस्करण से बदल देता है:\n- जो कुछ भी अभी stage किया हुआ है, वह कमिट में जुड़ जाता है\n- `-m` के साथ तुम बिल्कुल नया कमिट मैसेज लिख सकते हो\n- पुरानी कमिट हट जाती है — history साफ़ रहती है\n\n**बचाव योजना:**\n1. भूली हुई फ़ाइल को stage करो: `git add src/config.js`\n2. कमिट को फिर से लिखो: `git commit --amend -m "Fix login timeout"`\n3. भेज दो: `git push origin main`\n\n**सुनहरा नियम:** सिर्फ़ उन्हीं कमिट्स को amend करो जो अभी push नहीं हुई हैं। amend history को फिर से लिखता है — अगर साथियों ने पुरानी कमिट पहले ही pull कर ली हो, तो हर क्लोन में गड़बड़ मच जाएगी। लोकल और बिना push की हुई? तो बेझिझक amend करो।',
    "workflow.level4.story.realWorldContext":
        "फ़ाइल भूल जाना या कमिट मैसेज में टाइपो कर देना हर डेवलपर के साथ होता है — हर हफ़्ते। `git commit --amend` history को साफ़ रखने का रोज़मर्रा का औज़ार है: एक तार्किक बदलाव, एक सधी हुई कमिट। पेशेवर टीमों का एक पक्का नियम है — जो कमिट push हो चुकी हो उसे कभी amend मत करो, क्योंकि साझा history को फिर से लिखने से साथियों की repositories टूट जाती हैं।",
    "workflow.level4.story.taskIntroduction":
        "अपनी आख़िरी कमिट को बचाओ: भूली हुई config फ़ाइल को stage करो, सुधरे हुए मैसेज के साथ कमिट को amend करो, और इतनी साफ़ history push करो कि किसी को कभी पता ही न चले।",

    // Reset Level 4
    "reset.level4.name": "Revert से सुरक्षित Undo",
    "reset.level4.description": "इतिहास को दोबारा लिखे बिना एक सार्वजनिक commit को undo करें",
    "reset.level4.objective1": "खराब commit खोजने के लिए इतिहास की जाँच करें",
    "reset.level4.objective2": "revert से आख़िरी commit को सुरक्षित रूप से undo करें",
    "reset.level4.hint1": "संक्षिप्त इतिहास देखने के लिए `git log --oneline` का उपयोग करें",
    "reset.level4.hint2": "`git revert HEAD` एक नया commit बनाता है जो आख़िरी commit को उलट देता है",
    "reset.level4.hint3":
        "`git reset` के विपरीत, revert कभी भी वह इतिहास दोबारा नहीं लिखता जिसे साथी पहले ही pull कर चुके हैं",
    "reset.level4.requirement1.description": "संक्षिप्त commit इतिहास दिखाएँ",
    "reset.level4.requirement1.success": "वह रहा — 'Quick fix without review' सबसे ऊपर वाला खराब commit है।",
    "reset.level4.requirement2.description": "आख़िरी commit को revert करें",
    "reset.level4.requirement2.success":
        "बहुत बढ़िया! एक नया revert commit बदलाव को उलट देता है — इतिहास सुरक्षित रहता है।",
    "reset.level4.story.title": "वह Fix जिसने Refunds तोड़ दिए",
    "reset.level4.story.narrative":
        "रेड अलर्ट! किसी ने बिना review के सीधे main पर एक 'quick fix' push कर दिया — और वह refund flow को तोड़ देता है।\n\nAlex दौड़कर आते हैं: \"यहाँ हम `git reset` नहीं चला सकते। Commit सार्वजनिक हो चुका है और पूरी टीम उसे pull कर चुकी है। अगर हम अब इतिहास दोबारा लिखें, तो सबका repository टूट जाएगा।\n\nठीक इसी के लिए `git revert` है: यह एक नया commit बनाता है जो खराब commit को उलट देता है। इतिहास सुरक्षित रहता है और सब सिंक में रहते हैं।\"",
    "reset.level4.story.realWorldContext":
        "साझा branches पर पेशेवर टीमें लगभग हमेशा reset के बजाय revert का उपयोग करती हैं। सार्वजनिक इतिहास दोबारा लिखने से उन सबके लिए अफरा-तफरी मच जाती है जिन्होंने उसे pull किया है।",
    "reset.level4.story.taskIntroduction":
        "`git log --oneline` से इतिहास देखें, फिर `git revert HEAD` से खराब commit को undo करें।",

    // Stash Level 4
    "stash.level4.name": "अपना बैकअप रखें: Stash Apply",
    "stash.level4.description": "Stash किए काम को apply करें और stash को बैकअप के रूप में रखें",
    "stash.level4.objective1": "अपने जोखिम भरे प्रयोग को stash करें",
    "stash.level4.objective2": "apply से काम वापस लाएँ (stash बना रहता है)",
    "stash.level4.objective3": "भरोसा होने पर प्रयोग को commit करें",
    "stash.level4.hint1": "`git stash` आपके बदलाव सहेजता है और working tree साफ़ कर देता है",
    "stash.level4.hint2":
        "`git stash apply` बदलाव वापस लाता है लेकिन `git stash pop` के विपरीत stash में एक कॉपी रखता है",
    "stash.level4.hint3": '`git add` से stage करने के बाद `git commit -m "संदेश"` से commit करें',
    "stash.level4.requirement1.description": "अपने मौजूदा बदलावों को stash करें",
    "stash.level4.requirement1.success": "प्रयोग सुरक्षित रख दिया गया — आपका working tree साफ़ है।",
    "stash.level4.requirement2.description": "Stash को हटाए बिना apply करें",
    "stash.level4.requirement2.success": "काम वापस आ गया — और stash में अब भी आपकी बैकअप कॉपी है!",
    "stash.level4.requirement3.description": "प्रयोग को commit करें",
    "stash.level4.requirement3.success": "Commit हो गया! Stash बैकअप ने जोखिम भरा काम खोने से बचा लिया।",
    "stash.level4.story.title": "जोखिम भरा प्रयोग",
    "stash.level4.story.narrative":
        'आप fuzzy search पर प्रयोग कर रहे हैं — उम्मीद जगाने वाला, पर जोखिम भरा।\n\nAlex सुझाव देते हैं: "आगे बढ़ने से पहले इसे stash करो। और एक प्रो टिप: वापस लाते समय `pop` की जगह `git stash apply` इस्तेमाल करो। Apply बदलाव वापस लाता है लेकिन stash में कॉपी बनाए रखता है। अगर अगला कदम गलत हुआ, तो तुम्हारा बैकअप अब भी वहीं है।"',
    "stash.level4.story.realWorldContext":
        "जब डेवलपर्स को सेफ़्टी नेट चाहिए होता है तो वे `pop` की बजाय `apply` उपयोग करते हैं: stash entry तब तक बैकअप के रूप में रहती है जब तक उसे स्पष्ट रूप से हटाया न जाए।",
    "stash.level4.story.taskIntroduction": "प्रयोग को stash करें, `git stash apply` से वापस लाएँ, फिर commit करें।",

    // Teamwork Level 4
    "teamwork.level4.name": "Ship करने से पहले Review",
    "teamwork.level4.description": "Commit से पहले git diff से अपने बदलावों की समीक्षा करें",
    "teamwork.level4.objective1": "अपने unstaged बदलावों की समीक्षा करें",
    "teamwork.level4.objective2": "समीक्षा किए गए बदलावों को stage करें",
    "teamwork.level4.objective3": "जो commit होने वाला है उसे दोबारा जाँचें",
    "teamwork.level4.objective4": "समीक्षा किए गए बदलावों को commit करें",
    "teamwork.level4.hint1": "`git diff` वे बदलाव दिखाता है जो अभी stage नहीं हुए हैं",
    "teamwork.level4.hint2": "`git diff --staged` ठीक वही दिखाता है जो अगले commit में जाएगा",
    "teamwork.level4.hint3": "पहले समीक्षा, फिर `git add`, फिर `--staged` से दोबारा जाँच, फिर commit",
    "teamwork.level4.requirement1.description": "अपने unstaged बदलाव दिखाएँ",
    "teamwork.level4.requirement1.success": "अच्छी आदत! आपने stage करने से पहले diff देख लिया।",
    "teamwork.level4.requirement2.description": "बदलावों को stage करें",
    "teamwork.level4.requirement2.success": "बदलाव stage हो गए — अंतिम जाँच के लिए तैयार।",
    "teamwork.level4.requirement3.description": "Staged बदलाव दिखाएँ",
    "teamwork.level4.requirement3.success": "ठीक यही commit में जाएगा। कोई चौंकाने वाली बात नहीं।",
    "teamwork.level4.requirement4.description": "समीक्षा किए गए बदलावों को commit करें",
    "teamwork.level4.requirement4.success": "पूरे भरोसे के साथ ship किया — दो बार जाँचा, एक बार commit किया!",
    "teamwork.level4.story.title": "खुद Review करने की आदत",
    "teamwork.level4.story.narrative":
        'आपकी साथी Sarah अभी-अभी फँसी: उन्होंने गलती से एक debug line commit कर दी और reviewer ने उसे pull request में पकड़ लिया। शर्मिंदगी!\n\nAlex टीम का सुनहरा नियम बताते हैं: "अपना खुद का diff किसी और के देखने से पहले जाँचो। `git diff` बताता है कि तुमने क्या बदला, और stage करने के बाद `git diff --staged` ठीक वही दिखाता है जो commit में जाएगा। दो झटपट जाँचें जो debug lines, typos और भूली हुई फ़ाइलें पकड़ लेती हैं।"',
    "teamwork.level4.story.realWorldContext":
        "Commit से पहले अपना diff खुद जाँचना पेशेवर टीमों की सबसे असरदार आदतों में से एक है — गलतियाँ code review तक पहुँचने से पहले ही पकड़ी जाती हैं।",
    "teamwork.level4.story.taskIntroduction":
        "`git diff` से जाँचें, `git add` से stage करें, `git diff --staged` से पुष्टि करें, फिर commit करें।",

    // Advanced Level 4
    "advanced.level4.name": "Bisect से Bug की खोज",
    "advanced.level4.description": "Binary search से वह commit खोजें जिसने ऐप तोड़ दिया",
    "advanced.level4.objective1": "एक bisect session शुरू करें",
    "advanced.level4.objective2": "टूटी और चालू versions को चिह्नित करें",
    "advanced.level4.objective3": "Bisect session समाप्त करें",
    "advanced.level4.hint1": "`git bisect start` इतिहास में binary search शुरू करता है",
    "advanced.level4.hint2":
        "मौजूदा टूटी स्थिति को `git bisect bad` से और एक चालू commit को `git bisect good` से चिह्नित करें",
    "advanced.level4.hint3": "पूरा होने पर `git bisect reset` आपको शुरुआती जगह वापस ले आता है",
    "advanced.level4.requirement1.description": "Bisect शुरू करें",
    "advanced.level4.requirement1.success": "Bisect session शुरू — Git दोषी को घेरने के लिए तैयार है।",
    "advanced.level4.requirement2.description": "मौजूदा commit को bad चिह्नित करें",
    "advanced.level4.requirement2.success": "मौजूदा version टूटा हुआ चिह्नित किया गया।",
    "advanced.level4.requirement3.description": "एक चालू commit को good चिह्नित करें",
    "advanced.level4.requirement3.success": "अब Git को good/bad सीमा पता है और वह बीच में binary search कर सकता है!",
    "advanced.level4.requirement4.description": "Bisect session समाप्त करें",
    "advanced.level4.requirement4.success": "Session बंद — आपने दोषी को logarithmic समय में खोज लिया!",
    "advanced.level4.story.title": "भूसे के ढेर में सुई",
    "advanced.level4.story.narrative":
        'Production में search टूट गया है — पर पिछले हफ़्ते तो ठीक चल रहा था, और बीच में दर्जनों commits हैं।\n\nAlex मुस्कुराते हैं: "हर commit हाथ से जाँचने में घंटों लगेंगे। `git bisect` binary search करता है: उसे एक bad और एक good commit बताओ, और वह बार-बार बीच वाला commit checkout करता है जब तक ठीक वही commit न मिल जाए जिसने सब तोड़ा। बीस commits? बस क़रीब पाँच जाँचें।"',
    "advanced.level4.story.realWorldContext":
        "बड़े इतिहास में regressions खोजने का सबसे तेज़ तरीक़ा git bisect है। 1000 commits पर binary search को दोषी तक पहुँचने में केवल ~10 क़दम लगते हैं।",
    "advanced.level4.story.taskIntroduction":
        "`git bisect start` से शुरू करें, versions को `bad` और `good` से चिह्नित करें, फिर `git bisect reset` से समाप्त करें।",

    // Archaeology Level 4
    "archaeology.level4.name": "Working Tree बचाव",
    "archaeology.level4.description": "git restore से आकस्मिक बदलावों को undo करें",
    "archaeology.level4.objective1": "गलती से stage हुए config बदलाव को unstage करें",
    "archaeology.level4.objective2": "Notes फ़ाइल के बिगड़े बदलावों को हटा दें",
    "archaeology.level4.hint1":
        "`git restore --staged config.js` फ़ाइल को बदलाव खोए बिना staging area से बाहर निकालता है",
    "archaeology.level4.hint2":
        "`git restore notes.md` working directory के बदलाव हटाकर committed version वापस लाता है",
    "archaeology.level4.hint3": "कभी भी `git status` से देखें कि क्या staged है और क्या modified",
    "archaeology.level4.requirement1.description": "Config फ़ाइल को unstage करें",
    "archaeology.level4.requirement1.success": "Local URL staging area से बाहर — संकट टल गया।",
    "archaeology.level4.requirement2.description": "Notes फ़ाइल को committed स्थिति में वापस लाएँ",
    "archaeology.level4.requirement2.success": "बिल्ली की कलाकारी गायब — आपके notes committed version पर वापस हैं।",
    "archaeology.level4.story.title": "कीबोर्ड बिल्ली कांड",
    "archaeology.level4.story.narrative":
        'दो बार आफत: पहले आपने गलती से एक config बदलाव stage कर दिया जो ऐप को localhost की ओर मोड़ देता है — वह कभी commit नहीं होना चाहिए। फिर आपकी बिल्ली कीबोर्ड पर चल दी और sprint notes बिगाड़ गई।\n\nAlex हँसते हैं: "सबके साथ होता है। `git restore --staged` फ़ाइल को staging area से वापस खींच लाता है, और सादा `git restore` working directory के बदलाव हटाकर आख़िरी committed version लौटा देता है। दो अलग बचाव, एक command।"',
    "archaeology.level4.story.realWorldContext":
        "Unstage और बदलाव हटाने के लिए git restore पुराने 'git checkout -- file' और 'git reset HEAD file' नुस्खों का आधुनिक, सुरक्षित विकल्प है।",
    "archaeology.level4.story.taskIntroduction":
        "`git restore --staged config.js` से config.js को unstage करें, फिर `git restore notes.md` से notes.md के बदलाव हटाएँ।",

    // Mastery Level 4
    "mastery.level4.name": "एकदम सही Release",
    "mastery.level4.description": "--amend से आख़िरी commit सुधारें और release को tag करें",
    "mastery.level4.objective1": "भूले हुए release notes को stage करें",
    "mastery.level4.objective2": "Amend से उन्हें release commit में जोड़ें",
    "mastery.level4.objective3": "तैयार release को tag करें",
    "mastery.level4.hint1": "भूली हुई फ़ाइल को `git add .` से stage करें",
    "mastery.level4.hint2": '`git commit --amend -m "संदेश"` staged बदलावों को पिछले commit में मिला देता है',
    "mastery.level4.hint3": '`git tag -a v3.0.0 -m "Release 3.0.0"` से annotated tag बनाएँ',
    "mastery.level4.requirement1.description": "Release notes को stage करें",
    "mastery.level4.requirement1.success": "Release notes staged — release commit में शामिल होने के लिए तैयार।",
    "mastery.level4.requirement2.description": "पिछले commit को amend करें",
    "mastery.level4.requirement2.success": "Release commit में अब notes शामिल हैं — मानो आप कभी भूले ही नहीं।",
    "mastery.level4.requirement3.description": "Annotated release tag बनाएँ",
    "mastery.level4.requirement3.success": "v3.0.0 tag हो गया — एक बेदाग़ release। आपने सच में Git में महारत पा ली!",
    "mastery.level4.story.title": "एक Commit जो Release पर राज करे",
    "mastery.level4.story.narrative":
        "Release का दिन! आपने 'Prepare release v3.0.0' commit किया — और तभी release notes फ़ाइल दिखती है: unstaged और भूली हुई। 'oops, notes भूल गया' वाला दूसरा commit इतिहास में लापरवाह दिखेगा।\n\nAlex सराहते हुए कहते हैं: \"जब तक commit push नहीं हुआ, `git commit --amend` उपयोग करो। यह staged बदलावों को पिछले commit में ऐसे मिला देता है जैसे वे हमेशा से वहीं थे। फिर annotated tag से ताज पहनाओ।\"",
    "mastery.level4.story.realWorldContext":
        "Unpushed commits को amend करना इतिहास साफ़ और सोच-समझा रखता है। Annotated tags के साथ मिलकर पेशेवर इसी तरह सुव्यवस्थित, अच्छी तरह प्रलेखित releases बनाते हैं।",
    "mastery.level4.story.taskIntroduction":
        "Notes को `git add .` से stage करें, `git commit --amend` से मिलाएँ, फिर `git tag -a` से tag करें।",
};

export default levels;
