const levels = {
    // Level Page

    "level.gitTerminal": "Git Terminal",
    "level.currentChallenge": "Aktuelle Herausforderung",
    "level.objectives": "Ziele:",
    "level.showHints": "Hinweise anzeigen",
    "level.hideHints": "Hinweise ausblenden",
    "level.nextLevel": "Nächstes Level",
    "level.filesToEdit": "Dateien zum Bearbeiten:",
    "level.workingTreeClean": "Working tree clean",
    "level.staged": "staged",
    "level.modified": "modified",
    "level.untracked": "untracked",
    "level.gitNotInitialized": "Git ist noch nicht initialisiert",
    "level.branch": "Branch:",
    "level.gitStatus": "Git Status",
    "level.advancedOptions": "Erweiterte Optionen anzeigen",
    "level.hideAdvancedOptions": "Erweiterte Optionen ausblenden",
    "level.resetLevel": "Level zurücksetzen",
    "level.resetAllProgress": "Gesamten Fortschritt zurücksetzen",
    "level.resetConfirm": "Möchtest du wirklich deinen gesamten Fortschritt zurücksetzen?",
    "level.level": "Level",
    "level.levelCompleted": "Level abgeschlossen!",
    "level.realWorldContext": "Kontext in der echten Welt",
    "level.task": "Deine Aufgabe",
    "level.startCoding": "Mit dem Coding beginnen",
    "level.storyButton": "Story anzeigen",
    "level.advancedModeOn": "Fortgeschrittenen-Modus (An)",
    "level.advancedModeOff": "Fortgeschrittenen-Modus (Aus)",
    "level.notFound": "Level nicht gefunden",
    "level.techModeOn": "Fokus auf Befehle (Tech-Modus)",
    "level.storyModeOn": "Story-Kontext anzeigen (Story-Modus)",
    "level.techModeDescription":
        "Der technische Modus konzentriert sich auf Git-Befehle ohne Geschichten oder Kontext für ein schnelleres, direkteres Erlebnis.",
    "level.storyModeDescription":
        "Der Story-Modus bietet Kontext aus der realen Welt und Erklärungen, um zu verstehen, warum und wie Git-Befehle verwendet werden.",
    "level.editFile": "Datei bearbeiten",
    "level.deleteFile": "Datei löschen",
    "level.confirmDelete": "Möchten Sie {file} wirklich löschen?",
    "level.hints": "Hinweise",

    // Level Content - Intro Stage
    "intro.name": "Einführung in Git",
    "intro.description": "Lerne die Grundlagen von Git",

    "intro.level1.name": "Git initialisieren",
    "intro.level1.description": "Erstelle ein neues Git-Repository",
    "intro.level1.objective1": "Initialisiere ein neues Git-Repository",
    "intro.level1.hint1": "Verwende den Befehl `git init`",
    "intro.level1.hint2": "Dies erstellt ein verstecktes .git-Verzeichnis",
    "intro.level1.requirement1.description": "Initialisiere ein Git-Repository",
    "intro.level1.requirement1.success": "Gut gemacht! Du hast ein Git-Repository erstellt.",
    "intro.level1.story.title": "Willkommen im Team",
    "intro.level1.story.narrative":
        "Herzlich willkommen in deinem neuen Job als Entwickler bei TechStart! Ich bin Alex, dein Team-Lead.\n\nEs ist dein erster Tag und wir wollen dir helfen, schnell produktiv zu werden. Wir nutzen Git für unsere Versionskontrolle - damit verfolgen wir Änderungen im Code und arbeiten im Team zusammen.\n\nAls erstes musst du ein neues Repository für dein Onboarding-Projekt anlegen. Dafür nutzen wir den Befehl `git init`.",
    "intro.level1.story.realWorldContext":
        "In echten Entwicklerteams ist Git unverzichtbar. Es ist das erste Tool, das du bei einem neuen Projekt einrichtest.",
    "intro.level1.story.taskIntroduction": "Lass uns ein neues Repository für dein Projekt erstellen.",

    "intro.level2.name": "Repository Status",
    "intro.level2.description": "Überprüfe den Status deines Repositories",
    "intro.level2.objective1": "Zeige den Status deines Git-Repositories an",
    "intro.level2.hint1": "Verwende den Befehl `git status`",
    "intro.level2.hint2": "Dieser Befehl zeigt dir den aktuellen Status deines Repositories",
    "intro.level2.requirement1.description": "Zeige den Status des Repositories",
    "intro.level2.requirement1.success": "Perfekt! Du kannst nun den Status deines Repositories sehen.",
    "intro.level2.story.title": "Was ist los in deinem Repo?",
    "intro.level2.story.narrative":
        "Großartig! Du hast dein erstes Git-Repository erstellt. Das versteckte .git-Verzeichnis enthält nun alle Informationen, die Git braucht.\n\nAlex schaut vorbei: \"Super! Als nächstes solltest du dir anschauen, was in deinem Repository passiert. Mit `git status` kannst du jederzeit den aktuellen Zustand überprüfen.\"",
    "intro.level2.story.realWorldContext":
        "Entwickler führen `git status` mehrmals täglich aus, um zu sehen, welche Dateien geändert wurden und welche für den nächsten Commit bereit sind.",
    "intro.level2.story.taskIntroduction": "Überprüfe den Status deines Repositories mit `git status`.",

    "intro.level3.name": "Repositories klonen",
    "intro.level3.description": "Lerne, bestehende Repositories zu klonen",
    "intro.level3.objective1": "Klone ein Remote-Repository",
    "intro.level3.objective2": "Navigiere in das geklonte Repository",
    "intro.level3.hint1": "Verwende den Befehl `git clone <url>`",
    "intro.level3.hint2": "Nach dem Klonen verwende `cd`, um in den Repository-Ordner zu navigieren",
    "intro.level3.hint3": "Die Repository-URL kann jede gültige Git-Repository-URL sein",
    "intro.level3.requirement1.description": "Klone ein Remote-Repository",
    "intro.level3.requirement1.success": "Großartig! Du hast das Repository geklont.",
    "intro.level3.requirement2.description": "Navigiere mit cd in das geklonte Repository",
    "intro.level3.requirement2.success": "Perfekt! Du bist jetzt im geklonten Repository.",
    "intro.level3.story.title": "Einem existierenden Projekt beitreten",
    "intro.level3.story.narrative":
        "Deine erste Woche bei TechStart läuft großartig! Alex ruft dich mit aufregenden Neuigkeiten.\n\n\"Wir haben ein Team-Projekt, bei dem wir deine Hilfe brauchen\", sagt er. \"Die Codebasis ist bereits auf unserem Git-Server. Du musst sie auf deinen lokalen Rechner klonen, um damit arbeiten zu können.\"\n\nEr erklärt: \"Wenn du einem existierenden Projekt beitrittst, fängst du nicht bei Null an. Stattdessen klonst du das Remote-Repository, was eine vollständige Kopie auf deinem Rechner erstellt - inklusive des gesamten Codes, der Historie und aller Branches.\"\n\n\"Stell es dir vor wie ein Buch aus der Bibliothek auszuleihen, nur dass du auch noch alle Bibliotheksaufzeichnungen dazu bekommst! Verwende `git clone <repository-url>` um loszulegen.\"\n\n\"Sobald geklont, kannst du mit `cd <ordner-name>` in den Projekt-Ordner wechseln und sofort mit der Arbeit beginnen. Die gesamte Projekthistorie und alle Änderungen stehen dir zur Verfügung.\"",
    "intro.level3.story.realWorldContext":
        "Das Klonen ist die Art und Weise, wie Entwickler existierenden Projekten beitreten. Ob beim Beitragen zu Open Source oder beim Eintritt in ein neues Team, git clone ist typischerweise der erste Befehl, den du ausführst.",
    "intro.level3.story.taskIntroduction": "Klone ein Repository und navigiere hinein, um mit der Arbeit am Projekt zu beginnen.",

    // Level Content - Files Stage
    "files.name": "Dateioperationen",
    "files.description": "Lerne, wie du Dateien mit Git verwaltest",

    "files.level1.name": "Änderungen stagen",
    "files.level1.description": "Füge Dateien zur Staging-Area hinzu",
    "files.level1.objective1": "Füge alle Dateien zur Staging-Area hinzu",
    "files.level1.hint1": "Verwende den Befehl `git add .`",
    "files.level1.hint2": "Der Punkt steht für 'alle Dateien im aktuellen Verzeichnis'",
    "files.level1.requirement1.description": "Füge alle Dateien zum Staging-Bereich hinzu",
    "files.level1.requirement1.success": "Großartig! Du hast alle Dateien zur Staging-Area hinzugefügt.",
    "files.level1.story.title": "Code-Änderungen vorbereiten",
    "files.level1.story.narrative":
        '"Hey!" ruft Sarah, deine Kollegin, "ich sehe, du hast schon mit Git angefangen. Als nächstes solltest du lernen, wie man Änderungen staged."\n\nSie erklärt: "Wenn du Dateien änderst, musst du Git explizit sagen, welche Änderungen in den nächsten Commit aufgenommen werden sollen. Das nennt man \'Staging\' und funktioniert mit `git add`."',
    "files.level1.story.realWorldContext":
        "Das Staging-Konzept ist ein mächtiges Feature von Git. Es erlaubt dir, nur ausgewählte Änderungen zu committen, während andere noch in Bearbeitung bleiben können.",
    "files.level1.story.taskIntroduction": "Füge alle Dateien zur Staging-Area hinzu mit `git add .`.",

    "files.level2.name": "Änderungen committen",
    "files.level2.description": "Erstelle einen Commit mit deinen Änderungen",
    "files.level2.objective1": "Erstelle einen Commit mit einer Nachricht",
    "files.level2.hint1": "Verwende den Befehl `git commit -m 'Deine Nachricht'`",
    "files.level2.hint2": "Die Nachricht sollte die Änderungen beschreiben",
    "files.level2.requirement1.description": "Erstelle einen Commit mit einer Nachricht",
    "files.level2.requirement1.success": "Ausgezeichnet! Du hast erfolgreich einen Commit erstellt.",
    "files.level2.story.title": "Dein erster Commit",
    "files.level2.story.narrative":
        '"Super gemacht!" sagt Alex, als er deine Fortschritte sieht. "Du hast Änderungen zur Staging-Area hinzugefügt. Jetzt ist es Zeit für deinen ersten Commit."\n\nEr erklärt: "Ein Commit ist wie ein Snapshot deines Projekts zu einem bestimmten Zeitpunkt. Jeder Commit braucht eine Nachricht, die beschreibt, was geändert wurde. Das ist wichtig für die Nachvollziehbarkeit."',
    "files.level2.story.realWorldContext":
        "Gute Commit-Nachrichten sind in Entwicklerteams extrem wichtig. Sie helfen allen zu verstehen, warum eine Änderung gemacht wurde, nicht nur was geändert wurde.",
    "files.level2.story.taskIntroduction": "Erstelle deinen ersten Commit mit einer aussagekräftigen Nachricht.",

    "files.level3.name": "Dateien entfernen",
    "files.level3.description": "Lerne, wie man Dateien aus Git entfernt",
    "files.level3.objective1": "Entferne eine Datei sowohl aus dem Arbeitsverzeichnis als auch aus dem Index",
    "files.level3.hint1": "Verwende den Befehl `git rm <Datei>`",
    "files.level3.hint2": "Dies entfernt die Datei aus Git und löscht sie auch aus deinem Arbeitsverzeichnis",
    "files.level3.requirement1.description": "Entferne eine Datei mit Git",
    "files.level3.requirement1.success":
        "Gut gemacht! Du hast die Datei aus Git und deinem Arbeitsverzeichnis entfernt.",
    "files.level3.story.title": "Aufräumen",
    "files.level3.story.narrative":
        '"Ich sehe, du machst gute Fortschritte", sagt Alex, während er deine Arbeit überprüft. "Aber ich bemerke, dass es einige temporäre Dateien oder Entwürfe gibt, die wir nicht mehr brauchen. Wir sollten das Repository aufräumen."\n\nEr erklärt: "Wenn du Dateien entfernen möchtest, die von Git verfolgt werden, solltest du \'git rm\' verwenden, anstatt sie manuell zu löschen. So wird sichergestellt, dass Git die Löschung richtig verfolgt."',
    "files.level3.story.realWorldContext":
        "Repositories sauber zu halten, indem unnötige Dateien entfernt werden, ist eine bewährte Methode. Der Befehl git rm stellt sicher, dass Git die Dateientfernung verfolgt.",
    "files.level3.story.taskIntroduction": "Entferne die unnötige Datei aus dem Repository mit git rm.",

    // Level Content - Branches Stage
    "branches.name": "Arbeiten mit Branches",
    "branches.description": "Lerne, wie du mit Branches arbeitest",

    "branches.level1.name": "Branches anzeigen",
    "branches.level1.description": "Zeige alle Branches in deinem Repository",
    "branches.level1.objective1": "Zeige alle vorhandenen Branches an",
    "branches.level1.hint1": "Verwende den Befehl `git branch`",
    "branches.level1.hint2": "Dies zeigt dir alle lokalen Branches an",
    "branches.level1.requirement1.description": "Zeige alle Branches an",
    "branches.level1.requirement1.success": "Sehr gut! Du kannst nun alle Branches in deinem Repository sehen.",
    "branches.level1.story.title": "Verzweigungen im Code",
    "branches.level1.story.narrative":
        '"Zeit für etwas Fortgeschritteneres", sagt Alex und zeichnet einen Baum mit Zweigen auf ein Whiteboard. "Diese Zweige sind wie Git-Branches. Sie erlauben dir, an verschiedenen Versionen deines Codes gleichzeitig zu arbeiten."\n\nEr erklärt weiter: "Derzeit arbeitest du auf dem \'main\'-Branch. Lass uns zuerst überprüfen, welche Branches wir haben."',
    "branches.level1.story.realWorldContext":
        "Branches sind ein fundamentales Konzept in Git. Sie ermöglichen parallele Entwicklung, Feature-Isolation und experimentelles Arbeiten ohne den Hauptcode zu beeinträchtigen.",
    "branches.level1.story.taskIntroduction": "Zeige dir alle vorhandenen Branches mit git branch an.",

    "branches.level2.name": "Branch erstellen und wechseln",
    "branches.level2.description": "Erstelle einen neuen Branch und wechsle zu ihm mit dem modernen git switch Befehl",
    "branches.level2.objective1": "Erstelle einen neuen Branch namens 'feature' und wechsle zu ihm",
    "branches.level2.hint1": "Verwende den Befehl `git switch -c feature`",
    "branches.level2.hint2": "Das -c Flag erstellt einen neuen Branch und wechselt in einem Schritt zu ihm",
    "branches.level2.requirement1.description": "Erstelle einen neuen Branch und wechsle zu ihm mit git switch -c",
    "branches.level2.requirement1.success":
        "Hervorragend! Du hast einen neuen Branch erstellt und zu ihm gewechselt mit dem modernen git switch Befehl.",
    "branches.level2.story.title": "Moderne Branch-Erstellung",
    "branches.level2.story.narrative":
        "\"Perfekt! Jetzt wollen wir ein neues Feature implementieren\", sagt Alex. \"Dafür erstellen wir einen neuen Branch namens 'feature', damit unsere Änderungen den Hauptcode nicht beeinflussen.\"\n\nEr zeigt dir den modernen Ansatz: \"Git hat den 'git switch' Befehl eingeführt, um Branch-Operationen klarer zu machen. Verwende 'git switch -c feature', um den neuen Branch zu erstellen und gleichzeitig zu ihm zu wechseln. Das ist der bevorzugte moderne Weg anstelle des älteren 'git checkout -b'.\"",
    "branches.level2.story.realWorldContext":
        "In professionellen Entwicklungsteams arbeitet man fast nie direkt im main-Branch. Der git switch Befehl, eingeführt in Git 2.23, bietet eine sauberere, intuitivere Art mit Branches zu arbeiten verglichen mit dem älteren checkout Befehl.",
    "branches.level2.story.taskIntroduction":
        "Erstelle einen neuen Branch namens 'feature' und wechsle zu ihm mit git switch -c.",

    "branches.level3.name": "Zwischen Branches wechseln",
    "branches.level3.description": "Wechsle zwischen bestehenden Branches",
    "branches.level3.objective1": "Wechsle zwischen Branches mit git switch",
    "branches.level3.hint1": "Verwende den Befehl `git switch <branch>`",
    "branches.level3.hint2": "Dies wechselt zu einem bestehenden Branch",
    "branches.level3.requirement1.description": "Wechsle zu einem anderen Branch mit git switch",
    "branches.level3.requirement1.success": "Großartig! Du hast zwischen Branches gewechselt mit git switch.",
    "branches.level3.story.title": "Branch-Navigation",
    "branches.level3.story.narrative":
        '"Jetzt da du weißt, wie man Branches erstellt, lass uns das Wechseln zwischen ihnen üben", sagt Sarah. "Das ist etwas, was du ständig in der echten Entwicklungsarbeit machen wirst."\n\nSie erklärt: "Du kannst zu jedem bestehenden Branch wechseln mit \'git switch <branch-name>\'. Das ist viel klarer als das alte \'git checkout\', welches verwirrend sein konnte, weil es viele verschiedene Dinge getan hat."',
    "branches.level3.story.realWorldContext":
        "Das Wechseln zwischen Branches ist eine der häufigsten Git-Operationen. Der dedizierte git switch Befehl macht die Absicht klar und reduziert Verwirrung verglichen mit dem Mehrzweck-checkout Befehl.",
    "branches.level3.story.taskIntroduction": "Übe das Wechseln zu einem anderen Branch mit git switch.",

    "branches.level4.name": "Branches mit Checkout wechseln",
    "branches.level4.description": "Lerne den klassischen git checkout Befehl zum Wechseln von Branches",
    "branches.level4.objective1": "Wechsle zu einem anderen Branch mit git checkout",
    "branches.level4.hint1": "Verwende den Befehl `git checkout <branch-name>`",
    "branches.level4.hint2": "checkout ist der ältere Befehl zum Wechseln von Branches",
    "branches.level4.requirement1.description": "Wechsle zu einem anderen Branch mit git checkout",
    "branches.level4.requirement1.success": "Sehr gut! Du kennst jetzt beide Wege, zwischen Branches zu wechseln.",
    "branches.level4.story.title": "Der klassische Ansatz",
    "branches.level4.story.narrative":
        '"Es ist wichtig, auch git checkout zu kennen", erklärt Alex. "Obwohl git switch der moderne Weg ist, wirst du checkout in älteren Projekten, Tutorials und Dokumentationen oft sehen."\n\nEr fügt hinzu: "checkout kann viele Dinge tun - Branches wechseln, Dateien wiederherstellen, und mehr. Das ist der Grund, warum Git die Befehle switch und restore eingeführt hat - um die Absichten klarer zu machen."',
    "branches.level4.story.realWorldContext":
        "git checkout war jahrelang DER Befehl für Branch-Operationen. Viele Entwickler und Tools verwenden ihn noch. Beide zu kennen macht dich flexibler im Umgang mit verschiedenen Projekten und Teams.",
    "branches.level4.story.taskIntroduction": "Wechsle zu einem anderen Branch mit dem klassischen git checkout Befehl.",

    "branches.level5.name": "Branch erstellen mit Checkout",
    "branches.level5.description": "Erstelle und wechsle zu einem neuen Branch mit git checkout -b",
    "branches.level5.objective1": "Erstelle einen neuen Branch mit git checkout -b",
    "branches.level5.hint1": "Verwende den Befehl `git checkout -b <neuer-branch-name>`",
    "branches.level5.hint2": "Das -b Flag sagt checkout, einen neuen Branch zu erstellen",
    "branches.level5.requirement1.description": "Erstelle und wechsle zu einem neuen Branch mit git checkout -b",
    "branches.level5.requirement1.success":
        "Perfekt! Du beherrschst jetzt beide Methoden zum Erstellen von Branches.",
    "branches.level5.story.title": "Schnelles Branch-Erstellen",
    "branches.level5.story.narrative":
        '"Ein letzter Trick mit checkout", sagt Sarah. "Du kannst mit \'git checkout -b\' einen neuen Branch erstellen und gleichzeitig zu ihm wechseln - genau wie switch -c."\n\nSie erklärt: "In vielen älteren Git-Tutorials und Projekten wirst du dieses Pattern sehen. Es ist dasselbe Konzept wie switch -c, nur mit der älteren Syntax."',
    "branches.level5.story.realWorldContext":
        "Das checkout -b Pattern ist in der Git-Community sehr verbreitet. Viele Entwickler haben Muscle Memory dafür aufgebaut und verwenden es weiterhin, selbst nachdem switch eingeführt wurde.",
    "branches.level5.story.taskIntroduction":
        "Erstelle einen neuen Branch mit git checkout -b und wechsle automatisch zu ihm.",

    // Level Content - Merge Stage
    "merge.name": "Branches zusammenführen",
    "merge.description": "Lerne, wie du Branches zusammenführst",

    "merge.level1.name": "Feature-Branch zusammenführen",
    "merge.level1.description": "Merge einen Feature-Branch in den Development-Branch",
    "merge.level1.objective1": "Führe den 'feature/user-auth' Branch in den 'develop' Branch zusammen",
    "merge.level1.hint1": "Du bist bereits auf dem develop-Branch",
    "merge.level1.hint2": "Verwende `git merge feature/user-auth` um den Feature-Branch zu integrieren",
    "merge.level1.requirement1.description": "Führe den Feature-Branch zusammen",
    "merge.level1.requirement1.success": "Ausgezeichnet! Das Feature wurde in develop integriert.",
    "merge.level1.story.title": "Code-Review und Integration",
    "merge.level1.story.narrative":
        '"Dein Feature ist fertig!", sagt Sarah, die Team Lead. "Aber bevor wir es in main pushen, müssen wir es erst in den develop-Branch mergen und testen."\n\nSie erklärt: "In professionellen Teams mergen wir nie direkt in main. Erst feature → develop für Tests, dann develop → main für Production."',
    "merge.level1.story.realWorldContext":
        "🔍 Best Practice: Pull Requests\n\nIn echten Projekten würdest du jetzt einen Pull Request (PR) oder Merge Request (MR) auf GitHub/GitLab erstellen:\n\n1️⃣ Du pushst deinen Feature-Branch\n\n2️⃣ Du öffnest einen PR: feature/user-auth → develop\n\n3️⃣ Team-Mitglieder reviewen deinen Code\n\n4️⃣ Nach Approval wird der PR gemerged\n\nDas ermöglicht Code-Reviews, Diskussionen und automatische Tests vor dem Merge! 🚀",
    "merge.level1.story.taskIntroduction":
        "Führe den 'feature/user-auth'-Branch in den 'develop'-Branch zusammen (du bist bereits auf develop).",

    "merge.level2.name": "Production Deploy",
    "merge.level2.description": "Merge getesteten Code in den main-Branch",
    "merge.level2.objective1": "Führe den 'develop' Branch in den 'main' Branch zusammen",
    "merge.level2.hint1": "Du bist bereits auf dem main-Branch",
    "merge.level2.hint2": "Verwende `git merge develop` um den getesteten Code zu integrieren",
    "merge.level2.requirement1.description": "Führe develop in main zusammen",
    "merge.level2.requirement1.success": "Perfekt! Der Code ist nun in Production.",
    "merge.level2.story.title": "Production Release",
    "merge.level2.story.narrative":
        '"Super! Das Feature läuft perfekt auf develop und alle Tests sind grün", sagt Sarah. "Jetzt können wir es in main mergen und deployen."\n\nSie betont: "main ist unser Production-Branch. Nur getesteter, stabiler Code kommt hier rein. Deshalb haben wir vorher in develop getestet!"',
    "merge.level2.story.realWorldContext":
        "Git Flow Workflow 🌊\n\n📦 main: Production-ready Code\n\n🔧 develop: Integration und Testing\n\n✨ feature/*: Neue Features\n\nDieser Workflow verhindert, dass ungetesteter Code in Production landet. Viele Teams nutzen zusätzlich auch noch release-Branches!",
    "merge.level2.story.taskIntroduction": "Führe den 'develop'-Branch in den 'main'-Branch zusammen.",

    "merge.level3.name": "Umgang mit Merge-Konflikten",
    "merge.level3.description": "Lerne, wie man mit Konflikten umgeht oder Merges abbricht",
    "merge.level3.objective1": "Brich einen Merge mit Konflikten ab",
    "merge.level3.hint1": "Verwende den Befehl `git merge --abort`",
    "merge.level3.hint2": "Dies stoppt den Merge-Prozess und kehrt zum Zustand vor dem Merge zurück",
    "merge.level3.requirement1.description": "Brich einen Merge mit Konflikten ab",
    "merge.level3.requirement1.success": "Gut gemacht! Du hast den Merge-Vorgang erfolgreich abgebrochen.",
    "merge.level3.story.title": "Wenn Merges schief gehen",
    "merge.level3.story.narrative":
        '"Manchmal laufen Merges nicht wie geplant", warnt Sarah. "Wenn der gleiche Teil einer Datei in beiden Branches unterschiedlich geändert wurde, entsteht ein Merge-Konflikt."\n\nSie erklärt: "Du hast zwei Optionen: Entweder du löst den Konflikt manuell, oder du brichst den Merge mit `git merge --abort` ab und bereitest dich besser vor."',
    "merge.level3.story.realWorldContext":
        "Merge-Konflikte sind ein häufiger Teil der kollaborativen Entwicklung. Zu wissen, wie man mit ihnen umgeht – ob durch Lösung oder vorübergehendes Abbrechen – ist eine wesentliche Fähigkeit.",
    "merge.level3.story.taskIntroduction": "Übe das Abbrechen eines Merge-Vorgangs mit git merge --abort.",

    // Stash Stage
    "stash.name": "Git Stash",
    "stash.description": "Lerne, Änderungen vorübergehend zu speichern",

    "stash.level1.name": "Änderungen Stashen",
    "stash.level1.description": "Speichere deine Arbeit temporär und hole sie später zurück",
    "stash.level1.objective1": "Stashe Änderungen, wechsle Branches und hole sie zurück",
    "stash.level1.hint1": "Verwende `git stash` um deine Änderungen zu speichern",
    "stash.level1.hint2": "Mit `git stash pop` kannst du die Änderungen zurückholen",
    "stash.level1.requirement1.description": "Stashe deine aktuellen Änderungen",
    "stash.level1.requirement1.success": "Änderungen erfolgreich gestasht!",
    "stash.level1.requirement2.description": "Wechsle zum hotfix Branch",
    "stash.level1.requirement2.success": "Zu hotfix gewechselt!",
    "stash.level1.requirement3.description": "Wechsle zurück zum feature Branch",
    "stash.level1.requirement3.success": "Zurück zu feature!",
    "stash.level1.requirement4.description": "Hole deine gestashten Änderungen zurück",
    "stash.level1.requirement4.success": "Änderungen wiederhergestellt!",
    "stash.level1.story.title": "Unterbrechung durch Hotfix",
    "stash.level1.story.narrative":
        '"Code Red!", ruft dein Manager. "Es gibt einen kritischen Bug in Production. Du musst SOFORT zum hotfix-Branch wechseln!"\n\nDu schaust auf deinen Code - mitten in der Arbeit, halb fertig. Du kannst jetzt nicht committen, das würde den Build brechen.\n\n"Verwende `git stash`", rät deine Kollegin Lisa. "Damit speicherst du deine Änderungen temporär, ohne zu committen. Nach dem Hotfix holst du sie mit `git stash pop` zurück."',
    "stash.level1.story.realWorldContext":
        "Git Stash ist ein Lebensretter im Entwickleralltag!\n\n**Wann brauchst du Stash?**\n\n🚨 Dringender Hotfix unterbricht deine Arbeit\n\n🔄 Du willst Branches wechseln ohne zu committen\n\n🧪 Du möchtest etwas ausprobieren ohne Änderungen zu verlieren\n\n💾 Deine Arbeit ist noch nicht commit-reif\n\n**Der Stash ist wie ein Clipboard** für deine Änderungen - sie verschwinden aus dem Working Directory, aber bleiben sicher gespeichert!",
    "stash.level1.story.taskIntroduction":
        "Stashe deine Änderungen, wechsle zum hotfix Branch, dann zurück zu feature, und hole deine Arbeit mit stash pop zurück.",

    "stash.level2.name": "Zwischen Tasks wechseln",
    "stash.level2.description": "Jongliere mehrere Aufgaben mit git stash",
    "stash.level2.objective1": "Stashe alte Arbeit, erstelle neuen Branch, kehre zurück",
    "stash.level2.hint1": "Starte mit `git stash` um die aktuelle Arbeit zu sichern",
    "stash.level2.hint2": "Erstelle den neuen Branch mit `git checkout -b feature/new-task`",
    "stash.level2.hint3": "Wechsle zurück und hole mit `git stash pop` die Arbeit zurück",
    "stash.level2.requirement1.description": "Stashe die aktuelle Arbeit",
    "stash.level2.requirement1.success": "Arbeit gesichert!",
    "stash.level2.requirement2.description": "Wechsle zu main",
    "stash.level2.requirement2.success": "Auf main Branch!",
    "stash.level2.requirement3.description": "Erstelle feature/new-task Branch",
    "stash.level2.requirement3.success": "Neuer Branch erstellt!",
    "stash.level2.requirement4.description": "Wechsle zurück zu feature/old-task",
    "stash.level2.requirement4.success": "Zurück zur alten Aufgabe!",
    "stash.level2.requirement5.description": "Hole die gestashte Arbeit zurück",
    "stash.level2.requirement5.success": "Arbeit wiederhergestellt!",
    "stash.level2.story.title": "Multi-Tasking Meister",
    "stash.level2.story.narrative":
        '"Hey, kannst du schnell mal an der neuen Feature-Anfrage arbeiten?", fragt dein Product Owner.\n\nDu sitzt mitten in einer anderen Aufgabe. Früher hättest du alles committen müssen oder die Änderungen verloren.\n\n"Stash ist perfekt dafür", erklärt dein Senior Developer Marc. "Sichere deine aktuelle Arbeit, erstelle einen neuen Branch für die neue Aufgabe, und später holst du die alte Arbeit einfach zurück."',
    "stash.level2.story.realWorldContext":
        "**Stash im Team-Alltag**\n\nDeveloper jonglieren oft mehrere Tasks gleichzeitig:\n\n- Sprint Planning ändert Prioritäten\n- Urgent Bugs unterbrechen Features\n- Code Reviews erfordern Context-Switches\n- Meetings unterbrechen den Flow\n\n**Git Stash macht Context-Switching schmerzlos!**\n\nOhne Stash müsstest du entweder:\n- Unfertigen Code committen (schlecht für die History)\n- Änderungen verwerfen (Arbeit verloren)\n- In einem dreckigen State bleiben (kann nicht wechseln)\n\nMit Stash: Sichere, wechsle, arbeite, kehre zurück - alles sauber! ✨",
    "stash.level2.story.taskIntroduction":
        "Stashe deine Arbeit, wechsle zu main, erstelle einen neuen Branch, kehre zurück zur alten Aufgabe und hole deine Arbeit zurück.",

    "stash.level3.name": "Stash Verwalten",
    "stash.level3.description": "Lerne Stash-Einträge anzuzeigen und zu verwalten",
    "stash.level3.objective1": "Liste Stashes auf und wende sie an",
    "stash.level3.hint1": "Verwende `git stash list` um alle Stashes zu sehen",
    "stash.level3.hint2": "Hole den Stash mit `git stash pop` zurück",
    "stash.level3.requirement1.description": "Liste alle Stash-Einträge auf",
    "stash.level3.requirement1.success": "Stashes angezeigt!",
    "stash.level3.requirement2.description": "Hole den neuesten Stash zurück",
    "stash.level3.requirement2.success": "Stash wiederhergestellt!",
    "stash.level3.story.title": "Stash-Organisation",
    "stash.level3.story.narrative":
        '"Moment, wo habe ich die Änderungen nochmal gestasht?", fragst du dich.\n\n"Verwende `git stash list`", sagt Lisa. "Das zeigt dir alle gespeicherten Stashes. Mit `git stash pop` holst du den neuesten zurück und entfernst ihn aus dem Stash."\n\nSie erklärt weiter: "Es gibt auch `git stash apply` - das wendet den Stash an, aber lässt ihn im Stash. Nützlich wenn du die gleichen Änderungen mehrmals brauchst!"',
    "stash.level3.story.realWorldContext":
        "**Stash Management Commands**\n\n`git stash list` - Zeigt alle Stashes\n\n`git stash pop` - Wendet Stash an und löscht ihn\n\n`git stash apply` - Wendet Stash an, behält ihn\n\n`git stash drop` - Löscht einen Stash\n\n`git stash clear` - Löscht alle Stashes\n\n**Pro Tip**: Du kannst Stashes Namen geben mit `git stash push -m \"WIP: Feature X\"` - das macht die Liste übersichtlicher!",
    "stash.level3.story.taskIntroduction": "Liste deine Stashes auf und hole den neuesten zurück.",

    // Remote Stage
    "remote.name": "Remote-Repositories",
    "remote.description": "Lerne, mit Remote-Repositories zu arbeiten",

    // Remote Level 1
    "remote.level1.name": "Remotes hinzufügen",
    "remote.level1.description": "Verbinde dich mit einem Remote-Repository",
    "remote.level1.objective1": "Füge ein Remote-Repository hinzu",
    "remote.level1.hint1": "Verwende den Befehl `git remote add <name> <url>`",
    "remote.level1.hint2": "Üblicherweise nennt man sein Haupt-Remote 'origin'",
    "remote.level1.requirement1.description": "Füge ein Remote-Repository hinzu",
    "remote.level1.requirement1.success": "Ausgezeichnet! Du hast ein Remote-Repository hinzugefügt.",
    "remote.level1.story.title": "Repositories verbinden",
    "remote.level1.story.narrative":
        '"Großartige Fortschritte bisher! Jetzt ist es Zeit, dein lokales Repository mit einem Remote-Repository zu verbinden", sagt Alex. "Dies wird es dir ermöglichen, deinen Code mit dem Team zu teilen und effektiv zusammenzuarbeiten."\n\nEr erklärt: "Der erste Schritt ist, eine Verbindung zum Remote-Repository mit \'git remote add\' herzustellen. Dies überträgt noch keinen Code – es erstellt nur die Verbindung."',
    "remote.level1.story.realWorldContext":
        "Remote-Repositories sind zentral für kollaborative Entwicklungs-Workflows. Die meisten Git-basierten Systeme wie GitHub, GitLab und Bitbucket funktionieren, indem sie Remote-Repositories hosten, mit denen sich Teammitglieder verbinden.",
    "remote.level1.story.taskIntroduction": "Füge ein Remote namens 'origin' zu deinem Repository hinzu.",

    // Remote Level 2
    "remote.level2.name": "Commits zum Remote pushen",
    "remote.level2.description": "Lerne, wann und wie du deine Commits hochlädst",
    "remote.level2.objective1": "Pushe deine lokalen Commits zum Remote-Repository",
    "remote.level2.objective2": "Verstehe den Unterschied zwischen lokalem Commit und Remote Push",
    "remote.level2.hint1": "Verwende `git push origin main` um zum main-Branch zu pushen",
    "remote.level2.hint2":
        "WICHTIG: Push erst NACHDEM du einen Commit gemacht hast! Push lädt deine Commits hoch, nicht einzelne Dateien.",
    "remote.level2.hint3": "Tipp: Verwende `git log` um zu sehen, welche Commits du hast",
    "remote.level2.requirement1.description": "Pushe deine Commits zum Remote",
    "remote.level2.requirement1.success": "Perfekt! Deine Commits sind jetzt im Remote-Repository verfügbar.",
    "remote.level2.story.title": "Vom lokalen zum Remote-Repository",
    "remote.level2.story.narrative":
        '"Lass mich dir zeigen, wie der Git-Workflow funktioniert", sagt Alex und zeichnet ein Diagramm:\n\n1️⃣ Du änderst Dateien (Working Directory)\n2️⃣ Du staged sie mit `git add` (Staging Area)\n3️⃣ Du commitest sie mit `git commit` (Lokales Repository)\n4️⃣ Du pushst mit `git push` (Remote Repository)\n\n"Wichtig zu verstehen: git push lädt deine COMMITS hoch, nicht einzelne Dateien! Du musst erst einen Commit machen, bevor du pushen kannst. Deine lokalen Commits existieren nur auf deinem Computer, bis du sie pushst."',
    "remote.level2.story.realWorldContext":
        "Der Unterschied zwischen lokalem und Remote-Repository ist fundamental: Lokale Commits sind nur auf deinem Rechner. Erst durch git push werden sie für dein Team sichtbar. Das bedeutet: Du kannst beliebig viele lokale Commits machen und dann alle auf einmal pushen!",
    "remote.level2.story.taskIntroduction":
        "Du hast bereits einen Commit gemacht. Jetzt pushe diesen Commit zum Remote-Repository mit `git push origin main`.",

    "remote.level3.name": "Feature Branch pushen",
    "remote.level3.description": "Pushe einen Feature Branch zum Remote-Repository",
    "remote.level3.objective1": "Pushe deinen Feature Branch mit allen seinen Commits",
    "remote.level3.hint1": "Verwende `git push origin <branch-name>`",
    "remote.level3.hint2": "Du kannst auch `git push -u origin <branch-name>` verwenden, um das Upstream zu setzen",
    "remote.level3.requirement1.description": "Pushe einen Feature Branch zum Remote",
    "remote.level3.requirement1.success":
        "Ausgezeichnet! Dein Feature Branch ist jetzt im Remote-Repository verfügbar.",
    "remote.level3.story.title": "Features teilen",
    "remote.level3.story.narrative":
        '"Du hast an einem tollen neuen Feature auf einem separaten Branch gearbeitet", sagt Sarah. "Jetzt ist es Zeit, diesen Branch ins Remote-Repository zu pushen, damit andere Teammitglieder deine Arbeit sehen und reviewen können."\n\nSie erklärt: "Wenn du einen Branch zum ersten Mal pushst, solltest du die -u (oder --set-upstream) Option verwenden. Das verknüpft deinen lokalen Branch mit dem Remote-Branch, was zukünftige Pushs und Pulls einfacher macht."',
    "remote.level3.story.realWorldContext":
        "In professionellen Teams werden neue Features typischerweise auf separaten Branches entwickelt und dann zur Review gepusht, bevor sie in den Hauptcode gemerged werden. Das ist ein zentraler Teil des Pull-Request-Workflows.",
    "remote.level3.story.taskIntroduction":
        "Pushe deinen Feature Branch zum Remote-Repository, damit andere ihn sehen können.",

    // Reset Stage
    "reset.name": "Commits zurücknehmen",
    "reset.description": "Lerne, wie du Commits mit git reset rückgängig machst",

    "reset.level1.name": "Soft Reset - Änderungen behalten",
    "reset.level1.description": "Gehe zu einem früheren Commit zurück, behalte aber deine Änderungen",
    "reset.level1.objective1": "Verwende git reset --soft, um einen Commit rückgängig zu machen",
    "reset.level1.hint1": "Verwende `git reset --soft HEAD~1`",
    "reset.level1.hint2": "HEAD~1 bedeutet 'ein Commit vor dem aktuellen'",
    "reset.level1.requirement1.description": "Mache einen Commit mit --soft rückgängig",
    "reset.level1.requirement1.success":
        "Sehr gut! Die Änderungen sind noch gestaged, aber der Commit wurde rückgängig gemacht.",
    "reset.level1.story.title": "Einen Fehler korrigieren",
    "reset.level1.story.narrative":
        '"Oh nein!", ruft Alex aus. "Ich habe gerade gesehen, dass der letzte Commit einen Fehler in der Commit-Nachricht hat und die Config-Datei falsch ist. Zum Glück gibt es git reset --soft!"\n\nEr erklärt: "Mit --soft kannst du zu einem früheren Commit zurückgehen, aber alle deine Änderungen bleiben im Staging-Bereich. Das ist perfekt, wenn du nur die Commit-Nachricht ändern oder Dateien zum Commit hinzufügen/entfernen möchtest."',
    "reset.level1.story.realWorldContext":
        "git reset --soft ist super nützlich, wenn du deinen letzten Commit korrigieren möchtest, ohne die Arbeit zu verlieren. Du kannst die Änderungen bearbeiten und dann erneut committen.",
    "reset.level1.story.taskIntroduction":
        "Verwende git reset --soft HEAD~1, um den letzten Commit rückgängig zu machen, aber die Änderungen zu behalten.",

    "reset.level2.name": "Hard Reset - Alles verwerfen",
    "reset.level2.description": "Gehe zu einem früheren Commit zurück und verwerfe alle Änderungen",
    "reset.level2.objective1": "Verwende git reset --hard, um Commits und Änderungen zu verwerfen",
    "reset.level2.hint1": "Verwende `git reset --hard HEAD~1`",
    "reset.level2.hint2": "WARNUNG: Alle Änderungen seit diesem Commit gehen verloren!",
    "reset.level2.hint3": "Im echten Leben: Sei vorsichtig mit --hard, es kann Arbeit vernichten!",
    "reset.level2.requirement1.description": "Verwerfe Commits mit --hard",
    "reset.level2.requirement1.success": "Der Commit und alle Änderungen wurden komplett entfernt!",
    "reset.level2.story.title": "Einen Neuanfang machen",
    "reset.level2.story.narrative":
        '"Manchmal läuft experimenteller Code völlig schief", sagt Alex ernst. "Der letzte Commit hat Bugs eingeführt und die Codebase ist jetzt instabil. Wir müssen komplett zur letzten funktionierenden Version zurück."\n\nEr warnt: "git reset --hard ist wie ein Zurückspulen der Zeit. Es entfernt Commits UND verwirft alle Änderungen im Arbeitsverzeichnis. Verwende es mit Vorsicht!"',
    "reset.level2.story.realWorldContext":
        "--hard reset ist ein mächtiges aber gefährliches Tool. Es wird verwendet, wenn du wirklich einen sauberen Slate brauchst. In Teams solltest du vorsichtig sein mit reset auf gepushten Commits - das kann andere verwirren.",
    "reset.level2.story.taskIntroduction":
        "Verwende git reset --hard HEAD~1, um zum vorherigen Commit zurückzukehren und alles zu verwerfen.",

    "reset.level3.name": "Reset zu einem spezifischen Commit",
    "reset.level3.description": "Gehe zu einem spezifischen Commit in der History zurück",
    "reset.level3.objective1": "Verwende git reset mit einem Commit-Hash oder HEAD~n",
    "reset.level3.hint1": "Verwende `git log` um Commits und ihre Hashes zu sehen",
    "reset.level3.hint2": "Dann verwende `git reset --soft HEAD~2`, um zwei Commits zurückzugehen",
    "reset.level3.requirement1.description": "Reset zu einem älteren Commit",
    "reset.level3.requirement1.success": "Perfekt! Du kannst jetzt zu jedem Punkt in der History zurückkehren.",
    "reset.level3.story.title": "Zeitreise in Git",
    "reset.level3.story.narrative":
        '"Manchmal musst du mehrere Commits zurückgehen", erklärt Sarah. "Du kannst HEAD~2 für zwei Commits zurück verwenden, HEAD~3 für drei, und so weiter. Oder du kannst den spezifischen Commit-Hash verwenden."\n\nSie zeigt dir: "git log zeigt dir alle Commits mit ihren Hashes. Du kannst dann git reset <hash> verwenden, um zu diesem exakten Punkt zurückzugehen."',
    "reset.level3.story.realWorldContext":
        "Die Fähigkeit, zu jedem Punkt in der History zurückzukehren, ist eine von Gits mächtigsten Features. Es gibt dir Sicherheit beim Experimentieren - du kannst immer zurück.",
    "reset.level3.story.taskIntroduction": "Verwende git reset, um zu einem früheren Commit in der History zurückzugehen.",

    // Rebase Stage
    "rebase.name": "Rebasing",
    "rebase.description": "Lerne, wie du Branches rebasen kannst",

    // Rebase Level 1
    "rebase.level1.name": "Grundlegendes Rebasing",
    "rebase.level1.description": "Wende Commits von einem Branch auf einen anderen an",
    "rebase.level1.objective1": "Rebase den aktuellen Branch auf einen anderen Branch",
    "rebase.level1.hint1": "Verwende den Befehl `git rebase <branch>`",
    "rebase.level1.hint2": "Dies schreibt die Historie um, indem deine Commits auf den Ziel-Branch angewendet werden",
    "rebase.level1.requirement1.description": "Rebase auf einen anderen Branch",
    "rebase.level1.requirement1.success": "Großartig! Du hast den Branch erfolgreich rebasiert.",
    "rebase.level1.story.title": "Erstellen einer sauberen Historie",
    "rebase.level1.story.narrative":
        '"Ich sehe, du wirst vertraut mit dem Mergen", sagt Sarah. "Lass uns jetzt einen anderen Ansatz zur Integration von Änderungen erkunden: Rebasing."\n\nSie erklärt: "Während das Mergen Historien zusammenführt, schreibt Rebasing sie um, indem deine Commits so verschoben werden, dass sie nach den Commits eines anderen Branches erscheinen. Dies erzeugt eine linearere, sauberere Historie."',
    "rebase.level1.story.realWorldContext":
        "Rebasing wird oft bevorzugt, wenn du eine saubere, lineare Projekthistorie beibehalten möchtest. Viele Teams nutzen es, um Feature-Branches zu integrieren, bevor sie in den Hauptbranch gemerged werden.",
    "rebase.level1.story.taskIntroduction": "Versuche, deinen aktuellen Branch auf einen anderen Branch zu rebasen.",

    // Rebase Level 2
    "rebase.level2.name": "Umgang mit Rebase-Konflikten",
    "rebase.level2.description": "Lerne, wie man mit Rebase-Konflikten umgeht oder Rebases abbricht",
    "rebase.level2.objective1": "Brich einen Rebase mit Konflikten ab",
    "rebase.level2.hint1": "Verwende den Befehl `git rebase --abort`",
    "rebase.level2.hint2": "Dies stoppt den Rebase-Prozess und kehrt zum Zustand vor dem Rebase zurück",
    "rebase.level2.requirement1.description": "Brich einen Rebase mit Konflikten ab",
    "rebase.level2.requirement1.success": "Ausgezeichnet! Du hast den Rebase-Vorgang erfolgreich abgebrochen.",
    "rebase.level2.story.title": "Wenn Rebases kompliziert werden",
    "rebase.level2.story.narrative":
        '"Genau wie beim Mergen kann Rebasing zu Konflikten führen", weist Alex darauf hin. "Aber das Lösen von Konflikten während eines Rebases kann komplexer sein, weil Git jeden deiner Commits einzeln anwendet."\n\nEr fährt fort: "Wenn du mitten in einem Rebase bist und entscheidest, dass es zu komplex ist oder du deinen Ansatz überdenken musst, kannst du den Prozess jederzeit abbrechen."',
    "rebase.level2.story.realWorldContext":
        "Zu wissen, wann und wie man einen Rebase abbricht, ist in der realen Entwicklung wichtig. Manchmal sind die Konflikte zu komplex, um sie sofort zu lösen, oder du erkennst, dass eine andere Strategie besser wäre.",
    "rebase.level2.story.taskIntroduction": "Übe das Abbrechen eines Rebase-Vorgangs mit git rebase --abort.",

    // Rebase Level 3
    "rebase.level3.name": "Interaktives Rebasing",
    "rebase.level3.description": "Lerne, wie man interaktives Rebasing nutzt, um die Commit-Historie zu ändern",
    "rebase.level3.objective1": "Starte eine interaktive Rebasing-Sitzung",
    "rebase.level3.hint1": "Verwende den Befehl `git rebase -i`",
    "rebase.level3.hint2":
        "Interaktives Rebasing ermöglicht dir, Commits zu ordnen, zu bearbeiten, zusammenzuführen oder zu löschen",
    "rebase.level3.requirement1.description": "Starte ein interaktives Rebase",
    "rebase.level3.requirement1.success": "Perfekt! Du hast eine interaktive Rebasing-Sitzung gestartet.",
    "rebase.level3.story.title": "Aufräumen der Historie",
    "rebase.level3.story.narrative":
        '"Dein Feature sieht gut aus", sagt Alex, während er deinen Code überprüft. "Aber ich sehe, dass du mehrere kleine Commits mit Tippfehler-Korrekturen und kleinen Änderungen hast. Bevor wir das in den main-Branch mergen, sollten wir die Commit-Historie aufräumen."\n\nEr erklärt: "Git bietet ein mächtiges Werkzeug namens interaktives Rebasing, mit dem du deine Commit-Historie ändern kannst. Du kannst kleine Commits zusammenführen, Commit-Nachrichten umformulieren oder sogar Commits komplett löschen."',
    "rebase.level3.story.realWorldContext":
        "Interaktives Rebasing wird häufig verwendet, um eine saubere, zusammenhängende Commit-Historie zu erstellen, bevor Feature-Branches gemerged werden. Dies macht die Codebase-Historie lesbarer und aussagekräftiger.",
    "rebase.level3.story.taskIntroduction":
        "Starte eine interaktive Rebasing-Sitzung, um deine Commit-Historie zu modifizieren.",

    // Rebase Level 4
    "rebase.level4.name": "Rebasing auf Main",
    "rebase.level4.description":
        "Lerne den Workflow des Rebasings von Feature-Branches auf aktualisierte Main-Branches",
    "rebase.level4.objective1": "Rebase deinen Feature-Branch auf den aktualisierten Main-Branch",
    "rebase.level4.hint1": "Verwende `git rebase main` während du auf deinem Feature-Branch bist",
    "rebase.level4.hint2": "Dies wird deine Feature-Änderungen auf den neuesten Stand des Main-Branches anwenden",
    "rebase.level4.requirement1.description": "Rebase Feature auf Main",
    "rebase.level4.requirement1.success":
        "Ausgezeichnet! Du hast deinen Feature-Branch auf den neuesten Main-Branch rebasiert.",
    "rebase.level4.story.title": "Auf dem neuesten Stand bleiben",
    "rebase.level4.story.narrative":
        '"Ich sehe, dass während du an deinem Feature gearbeitet hast, jemand anderes Änderungen zum Main-Branch gepusht hat", weist Sarah hin. "Bevor wir deine Arbeit mergen, solltest du diese neuesten Änderungen einarbeiten."\n\nSie fährt fort: "Anstatt Main in deinen Branch zu mergen, was einen Merge-Commit erzeugt, empfehle ich, deinen Branch auf Main zu rebasen. Das hält die Historie sauberer."',
    "rebase.level4.story.realWorldContext":
        "In kollaborativen Umgebungen werden Main-Branches häufig aktualisiert. Das Rebasing von Feature-Branches auf Main ist ein gängiger Workflow, der hilft, Merge-Konflikte zu vermeiden und Feature-Branches auf dem neuesten Stand zu halten.",
    "rebase.level4.story.taskIntroduction":
        "Rebase deinen Feature-Branch auf den aktualisierten Main-Branch, um die neuesten Änderungen einzuarbeiten.",
};

export default levels;
