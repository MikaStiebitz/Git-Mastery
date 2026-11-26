# Glossário da tradução pt-BR

Decisões de vocabulário usadas em `src/translations/pt-BR/`. A regra geral é traduzir a explicação e a interface, mas manter o jargão que desenvolvedores brasileiros usam em inglês e que mapeia direto para comandos Git.

## Manter em inglês

`commit`, `branch`, `merge`, `push`, `pull`, `fetch`, `rebase`, `stash`, `reset` (comando Git), `checkout`, `switch`, `clone`, `remote`, `origin`, `main`, `develop`, `feature` (nome de branch), `hotfix`, `HEAD`, `hash`, `tag`, `PR/MR`, `fork`, `deploy`, `rollback`, `bug`, `feedback`, `Playground`, `Arcade`, `XP`, `FAQ`, `Git Gud`, `Committer`, `Brancher`, `Merger`, `Rebaser`, `Maintainer`.

## Traduzir

| Inglês                      | pt-BR                   |
| --------------------------- | ----------------------- |
| repository                  | repositório             |
| working tree                | árvore de trabalho      |
| working directory           | diretório de trabalho   |
| staging area                | área de staging         |
| commit message              | mensagem de commit      |
| merge conflict              | conflito de merge       |
| history                     | histórico               |
| leaderboard                 | ranking                 |
| achievements                | conquistas              |
| stars                       | estrelas                |
| shop                        | loja                    |
| coins                       | moedas                  |
| account                     | conta                   |
| sign in / sign out          | entrar / sair           |
| username / password         | nome de usuário / senha |
| hint                        | dica                    |
| challenge                   | desafio                 |
| level                       | nível                   |
| stage (substantivo do jogo) | etapa                   |
| stage (verbo: stage a file) | preparar                |
| progress                    | progresso               |
| difficulty                  | dificuldade             |
| badge / mascot              | selo / mascote          |
| cheat sheet                 | colinha ou guia rápido  |
| claim reward                | resgatar recompensa     |
| sponsor / paywall           | patrocinar / plano pago |

## Evitar traduções literais

| Não usar                     | Usar                        |
| ---------------------------- | --------------------------- |
| “cometer um commit”          | “fazer um commit”           |
| “confirmar” para commit      | “fazer commit”              |
| “empurrar” / “puxar”         | “fazer push” / “fazer pull” |
| “misturar” / “fundir”        | “fazer merge” / “mesclar”   |
| “esconderijo”                | “stash”                     |
| “estágio” para etapa do jogo | “etapa”                     |
| “estagiar um arquivo”        | “preparar um arquivo”       |
| “ramo” / “filial”            | “branch”                    |
| “garfo”                      | “fork”                      |
| “realimentação”              | “feedback”                  |
| “tabela de líderes”          | “ranking”                   |
| “muro de pagamento”          | “plano pago”                |
| “pedido de puxar”            | “pull request (PR)”         |
| “finalizar compra”           | “checkout”                  |
| “reivindicar recompensa”     | “resgatar recompensa”       |

## Convenções de escrita

- “você”, informal; imperativos naturais (“Faça”, “Use”, “Digite”, “Toque”).
- Concordância: “a branch foi mesclada”, “o commit foi desfeito”, “as alterações foram preparadas”.
- Preservar placeholders (`{file}`, `{level}`, `{count}` etc.), comandos entre crases, nomes de branches, URLs, emojis, Markdown e quebras `\n`.
- Rótulos de instaladores externos permanecem em inglês, porque é o que o usuário vê na tela.
- `'help'` e `'next'` são comandos do terminal e não são traduzidos.
