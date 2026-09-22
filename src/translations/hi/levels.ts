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

    "reset.level2.name": "Hard Reset - Discard Everything",
    "reset.level2.description": "Go back to a previous commit and discard all changes",
    "reset.level2.objective1": "Completely discard the last buggy commit",
    "reset.level2.objective2": "Reset to HEAD to understand it does nothing",
    "reset.level2.objective3": "Jump back multiple commits and discard everything",
    "reset.level2.hint1": "⚠️  WARNING: --hard is DESTRUCTIVE! All changes are permanently lost!",
    "reset.level2.hint2": "Check what you'll lose first: git log --oneline",
    "reset.level2.hint3": "git reset --hard HEAD~1 removes last commit AND all changes",
    "reset.level2.hint4": "git reset --hard HEAD does nothing (already at HEAD)",
    "reset.level2.hint5": "git reset --hard HEAD~3 goes back 3 commits, deletes everything",
    "reset.level2.hint6": "Use this when you want to throw away bad code completely",
    "reset.level2.hint7": "💡 In real life: Only use --hard on code you haven't pushed!",
    "reset.level2.requirement1.description": "Discard the last commit using --hard",
    "reset.level2.requirement1.success": "💥 Commit and all changes destroyed! No going back!",
    "reset.level2.requirement2.description": "Reset to HEAD (educational - does nothing)",
    "reset.level2.requirement2.success": "✅ Nothing changed - you're already at HEAD!",
    "reset.level2.requirement3.description": "Discard multiple commits using --hard",
    "reset.level2.requirement3.success": "💥 Multiple commits destroyed! Workspace is clean again!",
    "reset.level2.story.title": "Understanding git reset --hard - THE NUCLEAR OPTION",
    "reset.level2.story.narrative": `⚠️  **Understanding git reset --hard - THE NUCLEAR OPTION**

**The Situation:**
It's Friday evening. You've been experimenting with a new feature all day:
- Commit 6: "Try experimental algorithm v3" - Completely broken! 💀
- Commit 5: "Try experimental algorithm v2" - Still broken! 🐛
- Commit 4: "Try experimental algorithm v1" - Nope! ❌
- Commit 3: "Add user dashboard" - This was working! ✅
- Commit 2: "Add user authentication" - Good ✅
- Commit 1: "Initial project" - Good ✅

You realize: These experiments are garbage. You want them GONE. Forever. 💣

**What is git reset --hard?**
Remember the boxes metaphor? 📦📦📦

\`git reset --soft\` removed boxes but kept the items on the staging table.

\`git reset --hard\` removes boxes AND throws all items in the trash! 🗑️

**⚠️  CRITICAL: This is DESTRUCTIVE and PERMANENT!**
- Commits are deleted from history
- ALL file changes are deleted
- Working directory is cleaned
- Staging area is cleared
- **THERE IS NO UNDO!**

**Three Ways to Use git reset --hard:**

**1. Destroy the last commit (most common):**
\`git reset --hard HEAD~1\`
- Removes the last commit
- Deletes all changes in that commit
- Working directory looks like the previous commit
- ⚠️  Changes are GONE FOREVER!

**2. Reset to HEAD (educational - does nothing):**
\`git reset --hard HEAD\`
- Means "make my workspace look like HEAD"
- Since you're already at HEAD, nothing changes
- Good for understanding: HEAD = current position

**3. Destroy multiple commits:**
\`git reset --hard HEAD~4\`
- Goes back 4 commits
- All 4 commits are DELETED from history
- All changes in those commits are DELETED
- It's like they never existed! 👻

**When to Use --hard:**
- ✅ Experiment failed, throw it away
- ✅ Broke everything, need to start over
- ✅ Committed secrets/passwords by accident
- ❌ NOT on commits you've already pushed!
- ❌ NOT if you might need the changes later!

**Your Mission:**

**Step 1:** Destroy the last broken commit
\`git reset --hard HEAD~1\`
Check with \`git status\` - workspace is clean! 🧹

**Step 2:** Try resetting to HEAD (safe practice)
\`git reset --hard HEAD\`
Nothing happens - you're already there!

**Step 3:** Destroy multiple failed experiments
\`git reset --hard HEAD~3\`
All 3 bad commits are gone! It's like Friday never happened! 😅

**Remember:**
- 💥 This is the NUCLEAR OPTION
- 🗑️  Everything is deleted - commits AND changes
- ⏪ Can't be undone (unless you have the commit hash)
- 🎯 Only use when you're 100% sure
- ⚠️  NEVER use on pushed commits!

**Fun Fact:** Professional developers say "I'm going hard reset on this" when they want to start over completely! 🔥

Ready to practice safe destruction? Let's go! 💪`,
    "reset.level2.story.realWorldContext":
        "--hard reset is a powerful but dangerous tool. It's used when you really need a clean slate. In teams, be careful with reset on pushed commits - it can confuse others.",
    "reset.level2.story.taskIntroduction":
        "Practice the nuclear option: use git reset --hard to completely discard commits and changes.",

    "reset.level3.name": "Reset to Specific Commit",
    "reset.level3.description": "Go back to a specific commit in history",
    "reset.level3.objective1": "View commit history and identify the good commit",
    "reset.level3.objective2": "Reset to a specific commit using its hash",
    "reset.level3.hint1": "First, check your commit history: git log --oneline",
    "reset.level3.hint2": "Each commit has a unique hash (like 'a1b2c3d')",
    "reset.level3.hint3": "git reset --soft <commit-hash> keeps changes staged",
    "reset.level3.hint4": "git reset --hard <commit-hash> destroys everything after that commit",
    "reset.level3.hint5": "Commit hashes are permanent IDs - HEAD~n is relative",
    "reset.level3.hint6": "Pro tip: You only need the first 7 characters of the hash!",
    "reset.level3.hint7": "Find 'Version 2 - Good version' and use its hash",
    "reset.level3.requirement1.description": "View commit history to identify the good commit",
    "reset.level3.requirement1.success": "✅ Good! Now you can see all commits and their hashes!",
    "reset.level3.requirement2.description": "Reset to a specific commit using its hash",
    "reset.level3.requirement2.success": "🎯 Perfect! You've mastered resetting to specific commit hashes!",
    "reset.level3.story.title": "Advanced Reset: Using Commit Hashes",
    "reset.level3.story.narrative": `🎯 **Advanced Reset: Using Commit Hashes**

**The Situation:**
Your project has grown. You're now at commit 8, but you need to go back to commit 3.

Using \`HEAD~5\` to count back 5 commits is annoying and error-prone. What if someone adds a commit while you're working? The count changes!

**The Professional Solution: Commit Hashes**

Every commit has a unique ID (hash), like a fingerprint:
\`a1b2c3d - "Version 2 - Good version"\`

This hash NEVER changes! It's permanent and unique.

**Current Situation:**
- Commit 8: "Attempted fix v3" - Still broken! 💔
- Commit 7: "Attempted fix v2" - Nope! 🐛
- Commit 6: "Attempted fix v1" - Failed! ❌
- Commit 5: "Add broken feature" - Started the mess 🔥
- Commit 4: "Update styling" - Cosmetic ✨
- Commit 3: "Version 2 - GOOD VERSION" - Last known good state! ✅
- Commit 2: "Version 1" - Initial version ✅
- Commit 1: "Initial commit" - Foundation ✅

**Your Mission:**

**Step 1: Find the Good Commit**
Run: \`git log --oneline\`

You'll see something like:
\`\`\`
f7e8a9b Attempted fix v3
d6c7b8a Attempted fix v2
c5b6a7f Attempted fix v1
b4a5c6e Add broken feature
a3b4c5d Update styling
9a2b3c4 Version 2 - Good version  ← THIS ONE!
8a1b2c3 Version 1
7a0b1c2 Initial commit
\`\`\`

**Step 2: Reset to That Commit**
\`git reset --soft 9a2b3c4\`
(Use the actual hash you see!)

OR (more destructive):
\`git reset --hard 9a2b3c4\`

**HEAD~n vs Commit Hash:**

**Relative (HEAD~n):**
- \`HEAD~1\` = "previous commit"
- \`HEAD~5\` = "5 commits ago"
- ❌ Changes if new commits are added
- ✅ Quick for recent commits

**Absolute (Commit Hash):**
- \`git reset --soft a1b2c3d\`
- ✅ Permanent reference
- ✅ Never changes
- ✅ Professional approach
- 🎯 Best for going back to specific known-good states

**Pro Tips:**
- Only need first 7 characters: \`9a2b3c4\` instead of full hash
- You can copy hashes from \`git log\`
- Hashes work with ANY git command: \`git show a1b2c3d\`
- Save important commit hashes in notes for easy rollback!

**Real-World Scenario:**
"Hey team, if the deploy breaks, rollback to commit 9a2b3c4 - that's our last stable version!"

**In CI/CD Systems:**
Production deploys often use commit hashes for precise version control:
\`\`\`
deploy.sh --commit=9a2b3c4
\`\`\`

Let's practice professional-grade Git! 🚀`,
    "reset.level3.story.realWorldContext":
        "Using commit hashes is the professional way to reference specific points in history. They're permanent, unambiguous, and work across all team members' repositories.",
    "reset.level3.story.taskIntroduction":
        "Use git log to find commit hashes, then use git reset with a specific hash.",

    // Rebase Stage
    "rebase.name": "Rebasing",
    "rebase.description": "Learn how to rebase branches",

    // Rebase Level 1
    "rebase.level1.name": "Basic Rebasing",
    "rebase.level1.description": "Apply commits from one branch onto another",
    "rebase.level1.objective1": "Rebase the current branch onto another branch",
    "rebase.level1.hint1": "You're on the feature branch - rebase it onto main with: git rebase main",
    "rebase.level1.hint2": "This rewrites history by applying your commits on top of main's latest commits",
    "rebase.level1.hint3": "Use 'git log --oneline' to see the commit history after rebasing",
    "rebase.level1.requirement1.description": "Rebase onto another branch",
    "rebase.level1.requirement1.success": "Great job! You've successfully rebased the branch.",
    "rebase.level1.story.title": "Creating a Clean History",
    "rebase.level1.story.narrative":
        '"I see you\'re getting comfortable with merging," says Sarah. "Now let\'s explore a different approach to integrating changes: rebasing."\n\nShe explains: "While merging combines histories, rebasing rewrites it by moving your commits to appear after the commits from another branch. This creates a more linear, cleaner history."',
    "rebase.level1.story.realWorldContext":
        "Rebasing is often preferred when you want to maintain a clean, linear project history. Many teams use it to integrate feature branches before merging them to the main branch.",
    "rebase.level1.story.taskIntroduction": "You're on the feature branch. Rebase it onto main using: git rebase main",

    // Rebase Level 2
    "rebase.level2.name": "Handling Rebase Conflicts",
    "rebase.level2.description": "Learn how to handle or abort rebases with conflicts",
    "rebase.level2.objective1": "Abort a rebase with conflicts",
    "rebase.level2.hint1": "Use the `git rebase --abort` command",
    "rebase.level2.hint2": "This will stop the rebase process and return to the state before the rebase began",
    "rebase.level2.requirement1.description": "Abort a rebase with conflicts",
    "rebase.level2.requirement1.success": "Excellent! You've successfully aborted the rebase operation.",
    "rebase.level2.story.title": "When Rebases Get Complicated",
    "rebase.level2.story.narrative":
        '"Just like merging, rebasing can lead to conflicts," Alex points out. "But resolving conflicts during a rebase can be more complex because Git applies each of your commits one by one."\n\nHe continues: "If you\'re in the middle of a rebase and decide it\'s too complex or you need to rethink your approach, you can always abort the process."',
    "rebase.level2.story.realWorldContext":
        "Knowing when and how to abort a rebase is important in real-world development. Sometimes the conflicts are too complex to resolve immediately, or you realize a different strategy would be better.",
    "rebase.level2.story.taskIntroduction": "Practice aborting a rebase operation using git rebase --abort.",

    // Rebase Level 3
    "rebase.level3.name": "Interactive Rebasing",
    "rebase.level3.description": "Learn how to use interactive rebasing to modify commit history",
    "rebase.level3.objective1": "Start an interactive rebase session",
    "rebase.level3.hint1": "Use the `git rebase -i` command",
    "rebase.level3.hint2": "Interactive rebasing allows you to reorder, edit, squash, or delete commits",
    "rebase.level3.requirement1.description": "Start an interactive rebase",
    "rebase.level3.requirement1.success": "Perfect! You've started an interactive rebase session.",
    "rebase.level3.story.title": "Cleaning Up History",
    "rebase.level3.story.narrative":
        '"Your feature is looking good," says Alex, reviewing your code. "But I notice you have several small commits with typo fixes and minor changes. Before we merge this to main, let\'s clean up the commit history."\n\nHe explains, "Git offers a powerful tool called interactive rebasing that lets you modify your commit history. You can combine small commits, reword commit messages, or even delete commits entirely."',
    "rebase.level3.story.realWorldContext":
        "Interactive rebasing is commonly used to create a clean, coherent commit history before merging feature branches. This makes the codebase history more readable and meaningful.",
    "rebase.level3.story.taskIntroduction": "Start an interactive rebase session to modify your commit history.",

    // Rebase Level 4
    "rebase.level4.name": "Rebasing onto Main",
    "rebase.level4.description": "Learn the workflow of rebasing feature branches onto updated main branches",
    "rebase.level4.objective1": "Rebase your feature branch onto the updated main branch",
    "rebase.level4.hint1": "Use `git rebase main` while on your feature branch",
    "rebase.level4.hint2": "This will apply your feature changes on top of the latest main branch changes",
    "rebase.level4.requirement1.description": "Rebase feature onto main",
    "rebase.level4.requirement1.success": "Excellent! You've rebased your feature branch onto the latest main branch.",
    "rebase.level4.story.title": "Staying Up to Date",
    "rebase.level4.story.narrative":
        '"I see that while you\'ve been working on your feature, someone else has pushed changes to the main branch," Sarah points out. "Before we merge your work, you should incorporate these latest changes."\n\nShe continues, "Instead of merging main into your branch, which creates a merge commit, I recommend rebasing your branch onto main. This keeps the history cleaner."',
    "rebase.level4.story.realWorldContext":
        "In collaborative environments, main branches are frequently updated. Rebasing feature branches onto main is a common workflow that helps avoid merge conflicts and keeps feature branches up to date.",
    "rebase.level4.story.taskIntroduction":
        "Rebase your feature branch onto the updated main branch to incorporate the latest changes.",

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
