const installation = {
    "installation.title": "Guia de instalação do Git",
    "installation.subtitle": "Começando com o Git",
    "installation.intro":
        "Este guia ajuda você a instalar e configurar o Git no seu sistema operacional. Escolha sua plataforma abaixo para começar.",
    "installation.download": "Baixar o Git",
    "installation.moreDistros": "Mais distribuições Linux",
    "installation.windows.title": "Instalando o Git no Windows",
    "installation.windows.download": "Baixar o Git para Windows",
    "installation.windows.step1": "Acesse o site oficial do Git em git-scm.com/downloads.",
    "installation.windows.step2": "Clique no link de download para Windows.",
    "installation.windows.step3": "O download deve começar automaticamente.",
    "installation.windows.install": "Instalar o Git no Windows",
    "installation.windows.step4": "Execute o arquivo executável baixado.",
    "installation.windows.step5":
        "Siga o assistente de instalação. As opções padrão costumam servir para a maioria dos usuários.",
    "installation.windows.step6":
        "Durante a instalação, selecione 'Use Git from the Windows Command Prompt' para adicionar o Git ao PATH.",
    "installation.windows.step7": "Conclua a instalação e clique em 'Finish'.",
    "installation.linux.title": "Instalando o Git no Linux",
    "installation.linux.debian": "Debian/Ubuntu e derivados",
    "installation.linux.fedora": "Fedora/RHEL/CentOS",
    "installation.linux.arch": "Arch Linux",
    "installation.mac.title": "Instalando o Git no macOS",
    "installation.mac.option1": "Opção 1: Ferramentas de linha de comando",
    "installation.mac.option1Desc":
        "O jeito mais fácil de instalar o Git no Mac é abrir o Terminal e digitar 'git --version'. Se o Git não estiver instalado, você será convidado a instalar as Ferramentas de linha de comando.",
    "installation.mac.option2": "Opção 2: Baixar o instalador do Git",
    "installation.mac.step1": "Acesse o site oficial do Git em git-scm.com/downloads.",
    "installation.mac.step2": "Clique no link de download para macOS.",
    "installation.mac.step3": "Instale o pacote baixado seguindo as instruções na tela.",
    "installation.mac.brew": "Opção 3: Usando o Homebrew",
    "installation.mac.brewDesc": "Se você já tem o Homebrew instalado, pode instalar o Git com os comandos abaixo:",
    "installation.config": "Configurar o Git",
    "installation.configDesc":
        "Depois de instalar, você precisa definir seu nome de usuário e e-mail. Essas informações são usadas em todo commit do Git.",
    "installation.verification": "Verificar a instalação",
    "installation.verificationDesc":
        "Para confirmar que o Git foi instalado corretamente, abra um terminal ou prompt de comando e execute:",
    "installation.ssh.title": "Gerar chaves SSH",
    "installation.ssh.intro":
        "As chaves SSH permitem uma conexão segura com serviços de hospedagem Git como GitHub, GitLab ou Bitbucket, sem digitar a senha a cada push/pull.",
    "installation.ssh.generate": "Criar chave SSH",
    "installation.ssh.generateDesc":
        "Execute o comando abaixo para criar uma nova chave SSH. Troque o endereço de e-mail pelo seu:",
    "installation.ssh.saveLocation": "Confirmar onde salvar",
    "installation.ssh.saveLocationDesc":
        "Quando perguntarem onde salvar a chave, pressione Enter para usar o local padrão:",
    "installation.ssh.passphrase": "Passphrase (opcional)",
    "installation.ssh.passphraseDesc":
        "Você pode digitar uma passphrase para mais segurança ou pressionar Enter para continuar:",
    "installation.ssh.copyKey": "Copiar chave pública",
    "installation.ssh.copyKeyDesc": "Copie o conteúdo da sua chave SSH pública para a área de transferência:",
    "installation.ssh.windows.copyKey": "No Windows (Git Bash/PowerShell):",
    "installation.ssh.mac.copyKey": "No macOS:",
    "installation.ssh.linux.copyKey": "No Linux:",
    "installation.github.title": "Conectar ao GitHub",
    "installation.github.intro":
        "O GitHub é o serviço de hospedagem Git mais popular. Veja como adicionar sua chave SSH:",
    "installation.github.step1": "Acesse GitHub.com e entre na sua conta",
    "installation.github.step2": "Clique na sua foto de perfil (canto superior direito) → Configurações",
    "installation.github.step3": "Clique em 'SSH and GPG keys' na barra lateral esquerda",
    "installation.github.step4": "Clique em 'New SSH key'",
    "installation.github.step5": "Digite um título descritivo (ex.: 'Meu notebook')",
    "installation.github.step6": "Cole a chave SSH copiada no campo 'Key'",
    "installation.github.step7": "Clique em 'Add SSH key'",
    "installation.github.test": "Testar conexão",
    "installation.github.testDesc": "Teste a conexão SSH com o GitHub usando este comando:",
    "installation.github.testSuccess": "Se a conexão funcionar, você verá uma mensagem de boas-vindas do GitHub.",
    "installation.gitlab.title": "Conectar ao GitLab",
    "installation.gitlab.intro":
        "O GitLab é outra plataforma popular de hospedagem Git. Veja como adicionar sua chave SSH:",
    "installation.gitlab.step1": "Acesse GitLab.com e entre na sua conta",
    "installation.gitlab.step2": "Clique na sua foto de perfil (canto superior direito) → Editar perfil",
    "installation.gitlab.step3": "Clique em 'SSH Keys' na barra lateral esquerda",
    "installation.gitlab.step4": "Cole sua chave SSH no campo 'Key'",
    "installation.gitlab.step5": "Digite um título descritivo",
    "installation.gitlab.step6": "Selecione uma data de expiração (opcional, mas recomendado)",
    "installation.gitlab.step7": "Clique em 'Add key'",
    "installation.gitlab.test": "Testar conexão",
    "installation.gitlab.testDesc": "Teste a conexão SSH com o GitLab:",
    "installation.firstRepo.title": "Configurar o primeiro repositório",
    "installation.firstRepo.intro": "Com o Git configurado e a conexão SSH pronta, você já pode começar a trabalhar:",
    "installation.firstRepo.clone": "Clonar repositório existente",
    "installation.firstRepo.cloneDesc": "Para clonar um repositório existente do GitHub/GitLab:",
    "installation.firstRepo.create": "Criar novo repositório",
    "installation.firstRepo.createDesc": "Para criar um novo repositório local:",
    "installation.firstRepo.connect": "Conectar repositório local ao remote",
    "installation.firstRepo.connectDesc": "Para conectar um repositório local a um repositório remoto:",
    "installation.troubleshooting.title": "Solução de problemas",
    "installation.troubleshooting.intro":
        "Veja soluções para problemas comuns durante a instalação e configuração do Git:",
    "installation.troubleshooting.commandNotFound": "Erro: comando 'git' não encontrado",
    "installation.troubleshooting.commandNotFoundSolution":
        "• Verifique se o Git foi instalado corretamente\n• Confira se o Git foi adicionado ao seu PATH\n• Reinicie o terminal/prompt de comando\n• No Windows: use o Git Bash ou adicione o Git ao PATH manualmente",
    "installation.troubleshooting.permissionDenied": "Erro: Permission denied (publickey)",
    "installation.troubleshooting.permissionDeniedSolution":
        "• Verifique se sua chave SSH foi adicionada corretamente ao GitHub/GitLab\n• Confira se você está usando a URL SSH de clone (e não HTTPS)\n• Teste a conexão SSH com 'ssh -T git@github.com'\n• Verifique se o SSH agent está rodando: 'ssh-add -l'",
    "installation.troubleshooting.httpsToSsh": "Trocar de HTTPS para SSH",
    "installation.troubleshooting.httpsToSshSolution":
        "Se você já clonou um repositório com HTTPS, pode trocar para autenticação SSH:",
    "installation.troubleshooting.sslError": "Erro de certificado SSL",
    "installation.troubleshooting.sslErrorSolution":
        "Em redes corporativas ou servidores proxy, podem ocorrer problemas de SSL:\n• Temporário: 'git config --global http.sslVerify false' (não recomendado)\n• Melhor: configure o Git para o seu proxy ou use o certificado da empresa",
    "installation.troubleshooting.lineEndingIssues": "Problemas com finais de linha",
    "installation.troubleshooting.lineEndingIssuesSolution":
        "Em equipes com sistemas operacionais diferentes:\n• Windows: 'git config --global core.autocrlf true'\n• macOS/Linux: 'git config --global core.autocrlf input'\n• Alternativa: use o arquivo .gitattributes para controle preciso",
    "installation.troubleshooting.mergeConflicts": "Primeiros socorros para conflitos de merge",
    "installation.troubleshooting.mergeConflictsSolution":
        "• Use 'git status' para ver os arquivos afetados\n• Edite os arquivos manualmente ou use uma ferramenta de merge\n• Depois de editar: 'git add .' e 'git commit'\n• Se estiver na dúvida: 'git merge --abort' para cancelar o merge",
    "installation.windows.enhanced.title": "Instalação detalhada no Windows",
    "installation.windows.enhanced.prereq": "Pré-requisitos",
    "installation.windows.enhanced.prereqDesc":
        "• Windows 7 ou mais recente\n• Direitos de administrador para instalar\n• Acesso à internet para o download",
    "installation.windows.enhanced.installerOptions": "Opções importantes do instalador",
    "installation.windows.enhanced.installerOptionsDesc":
        "Durante a instalação, escolha estas opções:\n• 'Git from the command line and also from 3rd-party software'\n• 'Use bundled OpenSSH'\n• 'Use the OpenSSL library'\n• 'Checkout Windows-style, commit Unix-style line endings'\n• 'Use Windows' default console window'",
    "installation.windows.enhanced.postInstall": "Depois da instalação",
    "installation.windows.enhanced.postInstallDesc":
        "• O Git Bash fica disponível no menu de contexto (clique com o botão direito em pastas)\n• O Git GUI oferece uma interface gráfica\n• Você também pode usar o Windows Terminal ou o PowerShell",
    "installation.linux.enhanced.title": "Instalação detalhada no Linux",
    "installation.linux.enhanced.package": "Usando o gerenciador de pacotes",
    "installation.linux.enhanced.packageDesc":
        "A instalação pelo gerenciador de pacotes é o método recomendado no Linux:",
    "installation.linux.enhanced.source": "Compilar do código-fonte (avançado)",
    "installation.linux.enhanced.sourceDesc": "Para a versão mais recente ou configurações especiais:",
    "installation.linux.enhanced.sourceSteps":
        "# Install dependencies (Ubuntu/Debian)\nsudo apt-get install make libssl-dev libghc-zlib-dev libcurl4-gnutls-dev libncurses5-dev autoconf build-essential\n\n# Download Git source\nwget https://github.com/git/git/archive/v2.43.0.tar.gz\ntar -zxf v2.43.0.tar.gz\ncd git-2.43.0\n\n# Compile and install\nmake configure\n./configure --prefix=/usr/local\nmake all\nsudo make install",
    "installation.mac.enhanced.title": "Instalação detalhada no macOS",
    "installation.mac.enhanced.xcode": "Xcode Command Line Tools",
    "installation.mac.enhanced.xcodeDesc":
        "O método mais simples para usuários de macOS:\n• Abra o Terminal (Aplicativos → Utilidades → Terminal)\n• Digite 'git --version'\n• Se o Git não estiver instalado, você será convidado a instalá-lo\n• Clique em 'Install' para instalar as Ferramentas de linha de comando",
    "installation.mac.enhanced.homebrew": "Homebrew (recomendado)",
    "installation.mac.enhanced.homebrewDesc":
        "O Homebrew é um gerenciador de pacotes para macOS que facilita o gerenciamento de ferramentas de desenvolvimento:",
    "installation.mac.enhanced.homebrewSteps":
        '# Install Homebrew (if not already present)\n/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n\n# Install Git\nbrew install git\n\n# Update Git (later)\nbrew upgrade git',
    "installation.mac.enhanced.macports": "MacPorts (alternativa)",
    "installation.mac.enhanced.macportsDesc":
        "Se você usa MacPorts:\n• sudo port install git +universal\n• sudo port install git-flow (opcional)",
    "installation.additionalSettings.title": "Configurações adicionais",
    "installation.additionalSettings.intro":
        "Veja algumas configurações adicionais recomendadas para usar o Git da melhor forma:",
    "installation.additionalSettings.lineEndings": "Configurar finais de linha",
    "installation.additionalSettings.lineEndingsDesc":
        "Sistemas operacionais diferentes lidam com finais de linha de formas diferentes. Configure o Git para tratá-los corretamente:",
    "installation.additionalSettings.defaultBranch": "Definir o nome da branch padrão",
    "installation.additionalSettings.defaultBranchDesc":
        "Fluxos de trabalho modernos com Git costumam usar 'main' como nome da branch padrão em vez de 'master':",
    "installation.additionalSettings.editor": "Configurar o editor padrão",
    "installation.additionalSettings.editorDesc":
        "Defina seu editor de texto preferido para mensagens de commit e outras operações do Git:",
    "installation.resources.title": "Recursos adicionais",
    "installation.resources.download": "Baixar",
    "installation.resources.gui": "Clientes Git com interface gráfica",
    "installation.resources.githubDesktop": "Cliente Git simples e amigável do GitHub",
    "installation.resources.gitkraken": "Cliente Git poderoso com histórico de commits visual",
    "installation.resources.sourcetree": "Cliente Git gratuito para Windows e Mac",
    "installation.resources.editors": "Editores de código compatíveis com Git",
    "installation.resources.vscode": "Editor de código gratuito com suporte a Git integrado",
    "installation.resources.atom": "Editor de código gratuito com integração com Git",
    "installation.resources.sublime": "Editor de texto popular com plugins de Git",
    "installation.resources.docs": "Documentação",
    "installation.resources.officialDocs": "Documentação oficial do Git",
    "installation.resources.proGitBook": "Livro Pro Git (gratuito)",
    "installation.resources.githubGuide": "Guia do GitHub para configurar o Git",
};

export default installation;
