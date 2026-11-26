const faq = {
    "faq.title": "Perguntas frequentes sobre o Git",
    "faq.subtitle": "Tudo o que você precisa saber sobre o Git",
    "faq.intro":
        "O Git é um sistema de controle de versão poderoso e amplamente usado. Aqui estão as respostas para perguntas comuns sobre o Git, para que ele serve e como é usado no desenvolvimento de software.",
    "faq.categories.basics": "Noções básicas de Git",
    "faq.categories.concepts": "Conceitos essenciais",
    "faq.categories.usage": "Uso prático",
    "faq.whatIsGit.question": "O que é o Git?",
    "faq.whatIsGit.answer":
        "O Git é um sistema de controle de versão distribuído que acompanha as alterações nos arquivos ao longo do tempo. Ele permite que várias pessoas colaborem em projetos, mantenham um histórico de alterações e voltem a versões anteriores quando precisarem. Diferente dos sistemas de controle de versão centralizados, o Git fornece a cada desenvolvedor uma cópia completa do repositório, o que possibilita trabalhar offline e garante redundância.",
    "faq.whyCreated.question": "Por que o Git foi criado?",
    "faq.whyCreated.answer":
        "O Git foi criado por Linus Torvalds em 2005 para o desenvolvimento do kernel do Linux. Torvalds precisava de um sistema de controle de versão distribuído rápido, que suportasse desenvolvimento não linear com milhares de branches em paralelo e que lidasse com projetos grandes como o kernel do Linux com eficiência. As ferramentas existentes na época não atendiam a esses requisitos, então ele desenvolveu o Git. O nome 'git' é uma gíria britânica para 'pessoa desagradável', que Torvalds aplicou de brincadeira ao software (e a si mesmo).",
    "faq.vsOtherVcs.question": "Qual é a diferença entre o Git e outros sistemas de controle de versão?",
    "faq.vsOtherVcs.answer":
        "O Git se diferencia de sistemas mais antigos como SVN (Subversion) ou CVS em vários pontos importantes:\n\n• É distribuído em vez de centralizado, dando a cada desenvolvedor uma cópia completa do repositório\n• Foi projetado para desenvolvimento não linear, com recursos robustos de branch e merge\n• É muito mais rápido, especialmente em operações como criar branches e fazer merge\n• Usa uma abordagem diferente para armazenar dados, com foco em snapshots em vez de diferenças entre arquivos\n• Tem melhor integridade de dados por usar hashes SHA-1\n• Oferece forte suporte a operações offline",
    "faq.benefits.question": "Quais são os principais benefícios de usar o Git?",
    "faq.benefits.answer":
        "O Git oferece muitas vantagens para o desenvolvimento de software:\n\n• Velocidade e eficiência, especialmente em projetos grandes\n• Recursos poderosos de branch e merge que suportam desenvolvimento não linear\n• Natureza distribuída, que garante redundância e permite trabalhar offline\n• Forte suporte a fluxos de trabalho com desenvolvimento paralelo\n• Excelente integridade de dados e acompanhamento de alterações\n• Ecossistema robusto, com ferramentas e serviços de hospedagem como GitHub, GitLab e Bitbucket\n• Adoção ampla no mercado, o que faz dele uma habilidade valiosa para desenvolvedores\n• Software livre e de código aberto",
    "faq.gitVsGithub.question": "Qual é a diferença entre Git e GitHub?",
    "faq.gitVsGithub.answer":
        "O Git é o próprio sistema de controle de versão — o software que você instala no seu computador para acompanhar as alterações nos arquivos. Já o GitHub é um serviço de hospedagem na web para repositórios Git. O GitHub acrescenta recursos como pull requests, rastreamento de issues, revisão de código e outras ferramentas de colaboração. Serviços semelhantes incluem GitLab e Bitbucket. Pense no Git como a ferramenta e no GitHub como um serviço construído em torno dela para torná-la mais amigável e adicionar recursos de colaboração.",
    "faq.repositories.question": "O que são repositórios no Git?",
    "faq.repositories.answer":
        "Um repositório (ou 'repo') é a unidade fundamental no Git. Ele contém todos os arquivos do projeto e todo o histórico de alterações feitas neles. Tecnicamente, um repositório Git é o diretório .git do seu projeto, que guarda todos os metadados e o banco de dados de objetos. Quando você clona um repositório, recebe uma cópia de todo esse histórico. Os repositórios podem ser locais (na sua máquina) ou remotos (em um servidor como o GitHub).",
    "faq.commits.question": "O que são commits e por que eles são importantes?",
    "faq.commits.answer":
        "Commits são snapshots de todo o seu repositório em momentos específicos. Cada commit tem um identificador único (hash) e inclui informações sobre o que mudou, quem fez a mudança, quando e uma mensagem descrevendo a alteração. Commits são importantes porque:\n\n• Criam um histórico do desenvolvimento do seu projeto\n• Permitem voltar a estados anteriores do projeto\n• Ajudam a identificar quando e por quem determinadas mudanças foram introduzidas\n• Viabilizam a colaboração ao oferecer pontos de referência claros\n\nBoas mensagens de commit são essenciais para entender o 'porquê' por trás das mudanças quando você revisitar o código depois.",
    "faq.branches.question": "O que são branches e como elas funcionam?",
    "faq.branches.answer":
        "Branches no Git são simplesmente ponteiros móveis para commits. Elas permitem linhas paralelas de desenvolvimento, então features ou correções diferentes podem ser trabalhadas ao mesmo tempo sem interferir uma na outra. A branch padrão geralmente se chama 'main' (antes era 'master').\n\nQuando você cria uma branch, está basicamente criando um novo ponteiro para o commit atual. Conforme você faz novos commits nessa branch, o ponteiro avança automaticamente. Isso permite alternar facilmente entre diferentes estados do projeto e fazer merge das alterações de uma branch em outra quando estiver pronto.",
    "faq.merge.question": "O que é merge e como surgem os conflitos de merge?",
    "faq.merge.answer":
        "Merge é o processo de combinar alterações de uma branch em outra. Por exemplo, quando uma feature fica pronta em uma feature branch, você faz o merge dela na branch main. O Git resolve o merge automaticamente quando as alterações não se sobrepõem.\n\nConflitos de merge acontecem quando a mesma parte de um arquivo foi alterada de formas diferentes nas duas branches que estão sendo mescladas. O Git não consegue determinar automaticamente qual versão usar, então marca o arquivo como tendo um conflito que precisa ser resolvido manualmente. Os marcadores de conflito no arquivo mostram as duas versões do código, e você precisa editar o arquivo para criar a versão final antes de concluir o merge.",
    "faq.workflow.question": "Como é um fluxo de trabalho típico com Git?",
    "faq.workflow.answer":
        "Um fluxo de trabalho comum com Git pode ser assim:\n\n1. Crie uma branch para uma nova feature ou correção de bug\n2. Faça as alterações e commite-as na sua branch\n3. Faça push da sua branch para o repositório remoto\n4. Abra um pull request (no GitHub/GitLab) ou peça uma revisão de código\n5. Faça ajustes adicionais se forem solicitados\n6. Faça o merge da branch na main quando ela for aprovada\n7. Apague a feature branch depois do merge\n\nExistem vários modelos consolidados, como GitHub Flow, GitFlow e Trunk-Based Development, cada um com sua própria abordagem para branches, releases e deploys.",
    "faq.whenUse.question": "Quando devo usar o Git?",
    "faq.whenUse.answer":
        "Você deve usar o Git em praticamente qualquer projeto em que precise acompanhar alterações ao longo do tempo, especialmente se envolver código. Isso inclui:\n\n• Projetos de desenvolvimento de software de qualquer tamanho\n• Projetos de documentação\n• Arquivos de configuração\n• Projetos de escrita, como livros ou artigos\n• Qualquer projeto colaborativo em que várias pessoas precisem trabalhar nos mesmos arquivos\n\nMesmo em projetos solo, o Git oferece recursos valiosos, como histórico, possibilidade de experimentar mudanças com segurança e backup.",
    "faq.smallProjects.question": "O Git é exagero para projetos pequenos?",
    "faq.smallProjects.answer":
        "Embora o Git tenha recursos poderosos feitos para projetos grandes e complexos, ele continua valendo a pena em projetos pequenos. Mesmo em projetos pequenos ou pessoais, o Git oferece:\n\n• Uma rede de segurança que permite reverter alterações se algo quebrar\n• Um histórico completo do seu trabalho\n• A possibilidade de trabalhar em várias features ao mesmo tempo usando branches\n• Backup fácil de todo o histórico do projeto em repositórios remotos\n• Potencial de colaboração no futuro\n\nO investimento inicial em aprender Git compensa mesmo em projetos pequenos, com esses benefícios.",
    "faq.teamCollaboration.question": "Como o Git ajuda na colaboração em equipe?",
    "faq.teamCollaboration.answer":
        "O Git melhora a colaboração em equipe de várias formas:\n\n• Vários desenvolvedores podem trabalhar no mesmo projeto ao mesmo tempo sem sobrescrever o trabalho uns dos outros\n• As alterações são registradas claramente, com autor e data/hora\n• Branches permitem trabalho separado em features diferentes, sem interferência\n• Pull requests (em plataformas como GitHub) facilitam a revisão de código\n• Conflitos são identificados automaticamente quando ocorrem\n• O histórico do projeto traz responsabilidade e transparência\n• Repositórios remotos garantem que todos tenham acesso ao código mais recente\n• Ferramentas de rastreamento de issues e gestão de projetos se integram bem aos fluxos de trabalho com Git",
    "faq.commandLine.question": "Preciso usar a linha de comando para usar o Git?",
    "faq.commandLine.answer":
        "Não, você não precisa usar a linha de comando, embora entender os comandos do Git ajude. Existem muitas interfaces gráficas (GUIs) para Git, incluindo:\n\n• GitHub Desktop: uma interface simples e amigável\n• GitKraken: um cliente Git poderoso e multiplataforma\n• Sourcetree: cliente Git cheio de recursos para Windows e Mac\n• Git Extensions: interface de código aberto para Windows\n• TortoiseGit: interface de shell do Windows para o Git\n\nAlém disso, a maioria das IDEs modernas, como Visual Studio Code, IntelliJ IDEA e outras, tem integração com Git, permitindo executar operações comuns direto do editor.",
    "faq.hosting.question": "Onde posso hospedar meus repositórios Git?",
    "faq.hosting.answer":
        "Existem vários serviços populares para hospedar repositórios Git:\n\n• GitHub: a plataforma mais popular, com muitos recursos de colaboração\n• GitLab: oferece uma plataforma DevOps completa, com recursos de CI/CD\n• Bitbucket: integra bem com outros produtos Atlassian, como o Jira\n• Azure DevOps: solução da Microsoft com ampla integração ao ecossistema deles\n• Opções auto-hospedadas: GitLab Community Edition ou Gitea para hospedar nos seus próprios servidores\n\nA maioria desses serviços oferece planos gratuitos para repositórios públicos e desenvolvedores individuais, com planos pagos para repositórios privados e equipes.",
    "faq.readyToStart.title": "Pronto para começar com o Git?",
    "faq.readyToStart.text": "Agora que você entende o básico do Git, está pronto para usá-lo nos seus projetos!",
    "faq.readyToStart.installButton": "Instalar o Git",
    "faq.readyToStart.practiceButton": "Praticar comandos do Git",
};

export default faq;
