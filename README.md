# Fast OS Monorepo

[![Status da Build](https://github.com/Math23Kskb/fast-os/actions/workflows/ci.yml/badge.svg)](https://github.com/Math23Kskb/fast-os/actions/workflows/ci.yml)

Este repositório contém o código-fonte para o aplicativo móvel Fast OS e seu servidor backend, gerenciados em um monorepo Nx. A estrutura de monorepo permite o desenvolvimento centralizado, o compartilhamento eficiente de código e a padronização de ferramentas entre os projetos.

## Índice

- [Stack de Tecnologias](#stack-de-tecnologias)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Pré-requisitos](#pré-requisitos)
- [Primeiros Passos](#primeiros-passos)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Qualidade e Testes](#qualidade-e-testes)
- [Relatórios de Cobertura de Código](#relatórios-de-cobertura-de-código)
- [Como Contribuir](#como-contribuir)

## Stack de Tecnologias

- **Monorepo:** [Nx](https://nx.dev/)
- **Frontend (Mobile):** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Backend (Server):** [Spring Boot](https://spring.io/projects/spring-boot) com Java 21 e [Gradle](https://gradle.org/)
- **Testes Frontend:** [Jest](https://jestjs.io/)
- **Testes & Cobertura Backend:** [JUnit 5](https://junit.org/junit5/) & [Jacoco](https://www.eclemma.org/jacoco/)
- **Qualidade de Código:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)
- **Automação de Qualidade (Git Hooks):** [Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/okonet/lint-staged)

## Estrutura de Diretórios

A estrutura do monorepo é organizada para separar claramente as aplicações, pacotes compartilhados e ferramentas.

```
.
├── .github/          # Configurações de CI/CD (GitHub Actions)
├── .husky/           # Scripts dos Git Hooks (pre-commit, pre-push)
├── mobile/           # Código-fonte do aplicativo móvel (React Native/Expo)
├── packages/         # Pacotes/bibliotecas compartilhadas (ex: libs de UI, lógica de negócios)
├── server/           # Código-fonte do servidor backend (Spring Boot/Gradle)
├── tools/            # Scripts e ferramentas de automação do workspace
├── .gitignore        # Arquivos e pastas a serem ignorados pelo Git
├── nx.json           # Configuração principal do workspace Nx
└── package.json      # Dependências e scripts do Node.js para o monorepo
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (ex: v22.x ou superior)
- Java JDK (ex: v21 ou superior)

## Primeiros Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Math23Kskb/fast-os.git
    cd fast-os
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

## Fluxo de Desenvolvimento

Você pode executar as aplicações de frontend e backend simultaneamente, cada uma em seu próprio terminal.

-   **Para executar o App Móvel (Expo):**
    ```bash
    npx nx serve mobile
    ```

-   **Para executar o Servidor Backend (Spring Boot):**
    ```bash
    npx nx serve server
    ```

## Qualidade e Testes

O projeto possui "quality gates" (portões de qualidade) automatizados para garantir a consistência e a qualidade do código.

### Executando Testes

-   **Testes do Frontend:** Executa o Jest e gera um relatório de cobertura.
    ```bash
    npx nx test mobile
    ```

-   **Testes do Backend:** Executa a tarefa `check` do Gradle, que roda os testes unitários e valida a cobertura mínima de 75% com Jacoco.
    ```bash
    npx nx test server
    ```

### Testando Apenas o Código Afetado (Recomendado)

Para otimizar o tempo, teste apenas os projetos afetados pelas suas mudanças. Este é o comando mais eficiente para validação local.
```bash
npx nx affected -t test
```

### Hooks Automatizados (Husky)

-   **Pre-commit (`git commit`):** O `lint-staged` formata o código com Prettier e verifica erros de lint com ESLint.
-   **Pre-push (`git push`):** O comando `npx nx affected -t test` é executado, bloqueando o push se algum teste falhar.

## Relatórios de Cobertura de Código

Para uma análise detalhada da cobertura de testes, abra os seguintes relatórios no seu navegador:

-   **Relatório do Frontend:** `coverage/mobile/lcov-report/index.html`
-   **Relatório do Backend:** `server/build/reports/jacoco/test/html/index.html`

## Como Contribuir

Para manter o projeto organizado e de alta qualidade, por favor, siga estas diretrizes.

### Estratégia de Branches

-   A branch `main` é protegida. Todo o trabalho deve ser feito em branches separadas.
-   Use prefixos para nomear suas branches:
    -   `feat/`: Para novas funcionalidades (ex: `feat/login-screen`).
    -   `fix/`: Para correções de bugs (ex: `fix/button-alignment`).
    -   `chore/`: Para tarefas de manutenção do repositório (ex: `chore/update-dependencies`).
    -   `docs/`: Para mudanças na documentação.

### Mensagens de Commit

**Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/).** Este padrão é obrigatório e validado automaticamente antes de cada commit.

Isso nos ajuda a manter um histórico de commits legível e a automatizar a geração de changelogs e o controle de versão.

**Formato:**
```
<tipo>(<escopo>): <assunto>
```

-   **Tipo:** Descreve a natureza da mudança. Os mais comuns são:
    -   `feat`: Uma nova funcionalidade.
    -   `fix`: Uma correção de bug.
    -   `chore`: Mudanças de build, configuração ou ferramentas que não afetam o código de produção.
    -   `docs`: Mudanças na documentação.
    -   `style`: Mudanças de formatação (Prettier, etc.).
    -   `refactor`: Refatoração de código que não corrige um bug nem adiciona uma funcionalidade.
    -   `test`: Adição ou correção de testes.

-   **Escopo (Opcional):** O nome do projeto ou da parte do código afetada (ex: `mobile`, `server`, `ci`, `auth`).

-   **Assunto:** Uma descrição curta, no imperativo, começando com letra minúscula e sem ponto final.

**Exemplos Válidos:**
-   `feat(server): adiciona endpoint para criação de usuários`
-   `fix(mobile): corrige alinhamento do botão de login`
-   `docs: atualiza README com as regras de conventional commits`
-   `chore: adiciona validação de mensagens de commit com commitlint`

**IMPORTANTE:** Sua mensagem de commit será validada pelo `commitlint` usando o hook `commit-msg`. Se o formato não estiver correto, **o commit será bloqueado** até que a mensagem seja corrigida.

### Pull Requests (PRs)

1.  **Título Claro:** Use o padrão de Conventional Commits no título do seu PR.
2.  **Descrição Detalhada:** Explique o *quê* e o *porquê* das suas mudanças.
3.  **Assigne a si mesmo:** Marque-se como "Assignee".
4.  **Adicione Labels:** Categorize seu PR (ex: `enhancement`, `bug`).
5.  **Solicite Revisão:** Peça a um ou mais membros da equipe para revisar seu código.
6.  **Garanta que a CI passe:** Todos os checks automatizados devem estar verdes.
7.  **Use "Squash and Merge":** Ao mesclar, use a opção "Squash and merge" para manter o histórico da `main` limpo e linear.

### Pull Requests (PRs)

1.  **Título Claro:** Use o padrão de Conventional Commits no título do seu PR.
2.  **Descrição Detalhada:** Explique o *quê* e o *porquê* das suas mudanças.
3.  **Assigne a si mesmo:** Marque-se como "Assignee".
4.  **Adicione Labels:** Categorize seu PR (ex: `enhancement`, `bug`).
5.  **Solicite Revisão:** Peça a um ou mais membros da equipe para revisar seu código.
6.  **Garanta que a CI passe:** Todos os checks automatizados devem estar verdes.
7.  **Use "Squash and Merge":** Ao mesclar, use a opção "Squash and merge" para manter o histórico da `main` limpo e linear.
