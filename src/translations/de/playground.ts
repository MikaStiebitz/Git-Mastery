const playground = {
    // Playground
    "playground.title": "Git Playground",
    "playground.subtitle": "Experimentiere frei mit Git-Befehlen und lerne aus dem Spickzettel",
    "playground.gitTerminal": "Git Terminal (Freier Modus)",
    "playground.gitCheatSheet": "Git Spickzettel",
    "playground.searchCommands": "Suche nach Git-Befehlen...",
    "playground.usage": "Verwendung:",
    "playground.example": "Beispiel:",
    "playground.explanation": "Erklärung:",
    "playground.noCommands": "Keine Befehle gefunden für",
    "playground.resetSearch": "Suche zurücksetzen",

    // Befehlsbeschreibungen
    "playground.commands.gitInit.description": "Initialisiert ein neues Git-Repository",
    "playground.commands.gitInit.explanation":
        "Erstellt in deinem aktuellen Verzeichnis ein neues Git-Repository und legt das versteckte .git-Verzeichnis mit allen Metadaten an.",
    "playground.commands.gitStatus.description": "Zeigt den Status des Repositorys",
    "playground.commands.gitStatus.explanation":
        "Zeigt dir den aktuellen Zustand deines Repositorys – welche Dateien geändert, gestaged oder untracked sind.",
    "playground.commands.gitAdd.description": "Fügt Dateiinhalte dem Index hinzu",
    "playground.commands.gitAdd.explanation":
        "Markiert Änderungen für den nächsten Commit. Mit 'git add .' markierst du alle Änderungen im aktuellen Verzeichnis.",
    "playground.commands.gitCommit.description": "Speichert Änderungen im Repository",
    "playground.commands.gitCommit.explanation":
        "Erstellt einen neuen Commit mit allen gestagten Änderungen. Die Nachricht sollte kurz und präzise beschreiben, was geändert wurde.",
    "playground.commands.gitConfig.description": "Git-Einstellungen konfigurieren",
    "playground.commands.gitConfig.explanation":
        "Setzt Konfigurationswerte wie Benutzername, E-Mail, Editor und weitere Optionen. Mit --global gelten sie für alle Repositories.",
    "playground.commands.gitHelp.description": "Hilfetext anzeigen",
    "playground.commands.gitHelp.explanation":
        "Zeigt detaillierte Hilfe zu jedem Git-Befehl. Alternativ funktioniert auch 'git <Befehl> --help'.",
    "playground.commands.gitBranch.description": "Listet, erstellt oder löscht Branches",
    "playground.commands.gitBranch.explanation":
        "Ohne Parameter listet der Befehl alle vorhandenen Branches. Mit einem Namen wird ein neuer Branch erstellt (aber nicht gewechselt).",
    "playground.commands.gitCheckout.description": "Wechselt Branches oder stellt Dateien wieder her",
    "playground.commands.gitCheckout.explanation":
        "Wechselt auf einen anderen Branch. Mit '-b' wird ein neuer Branch erstellt und direkt gewechselt.",
    "playground.commands.gitMerge.description": "Führt Entwicklungsverläufe zusammen",
    "playground.commands.gitMerge.explanation":
        "Integriert Änderungen des angegebenen Branches in den aktuellen Branch. Bei keinem Fast-Forward entsteht ein Merge-Commit.",
    "playground.commands.gitSwitch.description": "Zu einem bestimmten Branch wechseln",
    "playground.commands.gitSwitch.explanation":
        "Moderne Alternative zu 'git checkout' zum Wechseln von Branches. Mit '-c' wird ein neuer Branch erstellt und direkt gewechselt.",
    "playground.commands.gitBranchDelete.description": "Branch löschen",
    "playground.commands.gitBranchDelete.explanation":
        "Löscht den angegebenen Branch, wenn er vollständig gemerged wurde. Mit '-D' wird das Löschen erzwungen, auch wenn er nicht gemerged ist.",
    "playground.commands.gitLog.description": "Zeigt die Commit-Historie",
    "playground.commands.gitLog.explanation":
        "Zeigt die Commit-Historie mit Details wie Autor, Datum und Nachricht. Zahlreiche Optionen passen die Ausgabe an.",
    "playground.commands.gitDiff.description": "Zeigt Unterschiede zwischen Commits",
    "playground.commands.gitDiff.explanation":
        "Zeigt Unterschiede zwischen zwei Commits, zwischen Commit und Arbeitsverzeichnis usw. Ohne Argumente die unstaged Änderungen.",
    "playground.commands.gitShow.description": "Zeigt verschiedene Git-Objekte",
    "playground.commands.gitShow.explanation":
        "Zeigt Informationen zu einem Git-Objekt. Bei Commits die Nachricht und die eingeführten Änderungen.",
    "playground.commands.gitBlame.description": "Zeigt, wer welche Zeile geändert hat",
    "playground.commands.gitBlame.explanation":
        "Zeigt zeilenweise, wer eine Änderung vorgenommen hat und in welchem Commit. Hilfreich zum Nachvollziehen der Dateihistorie.",
    "playground.commands.gitClone.description": "Klonen eines Repositorys in ein neues Verzeichnis",
    "playground.commands.gitClone.explanation":
        "Erstellt eine lokale Kopie eines Remote-Repositorys inklusive aller Branches und Historie.",
    "playground.commands.gitPull.description": "Holt und integriert Änderungen von einem Remote",
    "playground.commands.gitPull.explanation":
        "Kombiniert 'git fetch' und 'git merge', um Änderungen von einem Remote-Branch zu holen und in deinen aktuellen Branch einzubauen.",
    "playground.commands.gitPush.description": "Aktualisiert Remote-Referenzen und Objekte",
    "playground.commands.gitPush.explanation":
        "Sendet deine lokalen Commits an ein Remote-Repository. Andere können die Änderungen anschließend sehen und abrufen.",
    "playground.commands.gitRemote.description": "Remote-Repositories verwalten",
    "playground.commands.gitRemote.explanation":
        "Listet, fügt hinzu oder entfernt Remotes. Mit 'git remote -v' siehst du die zugehörigen URLs.",
    "playground.commands.gitFetch.description": "Lädt Objekte und Referenzen vom Remote",
    "playground.commands.gitFetch.explanation":
        "Lädt alle Branches und Commits eines Remote-Repositorys herunter, ohne sie in deine lokalen Branches zu mergen.",
    "playground.commands.gitRestore.description": "Stellt Dateien im Arbeitsverzeichnis wieder her",
    "playground.commands.gitRestore.explanation":
        "Macht Änderungen im Arbeitsverzeichnis rückgängig oder entfernt Dateien mit --staged aus dem Staging-Bereich.",
    "playground.commands.gitReset.description": "Setzt HEAD auf einen bestimmten Zustand zurück",
    "playground.commands.gitReset.explanation":
        "Setzt deinen Branch auf einen bestimmten Commit zurück. --soft behält gestagte Änderungen, --mixed (Standard) nimmt sie aus dem Staging, --hard verwirft alles.",
    "playground.commands.gitRevert.description": "Erstellt einen Commit, der Änderungen rückgängig macht",
    "playground.commands.gitRevert.explanation":
        "Erstellt einen neuen Commit, der die Änderungen eines früheren Commits rückgängig macht. Sicherer als reset auf gemeinsamen Branches.",
    "playground.commands.gitRebase.description": "Wendet Commits auf eine andere Basis erneut an",
    "playground.commands.gitRebase.explanation":
        "Überträgt deine Änderungen auf die neueste Version des Basis-Branches und sorgt so für eine sauberere Historie als Merges.",
    "playground.commands.gitStash.description": "Legt Änderungen vorübergehend beiseite",
    "playground.commands.gitStash.explanation":
        "Speichert deine uncommitteten Änderungen temporär, damit du mit einem sauberen Arbeitsverzeichnis weiterarbeiten kannst. Mit 'pop' wendest du sie wieder an.",
    "playground.commands.gitTag.description": "Erstellt, listet oder löscht Tags",
    "playground.commands.gitTag.explanation":
        "Tags markieren bestimmte Punkte in der Git-Historie, meist für Releases. Mit -a erstellst du annotierte Tags.",
    "playground.commands.gitCherryPick.description": "Übernimmt Änderungen einzelner Commits",
    "playground.commands.gitCherryPick.explanation":
        "Überträgt Änderungen einzelner Commits in deinen aktuellen Branch. Nützlich, um Änderungen gezielt aus einem anderen Branch zu holen.",
    "playground.commands.gitBisect.description": "Findet Fehler per binärer Suche",
    "playground.commands.gitBisect.explanation":
        "Hilft dir, den Commit zu finden, der einen Fehler eingeführt hat, indem du Commits als 'gut' oder 'schlecht' markierst."
};

export default playground;
