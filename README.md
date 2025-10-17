# Fast OS Monorepo

[![Status da Build](https://github.com/Math23Kskb/fast-os/actions/workflows/ci.yml/badge.svg)](https://github.com/Math23Kskb/fast-os/actions/workflows/ci.yml)

Este repositório contém o código-fonte para o aplicativo móvel Fast OS e seu servidor backend, gerenciados em um monorepo Nx. A estrutura de monorepo permite o desenvolvimento centralizado, o compartilhamento eficiente de código e a padronização de ferramentas entre os projetos.

## Índice

- [Stack de Tecnologias](#stack-de-tecnologias)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Pré-requisitos](#pré-requisitos)
- [Primeiros Passos](#primeiros-passos)
- [Comandos Essenciais do Dia a Dia](#-comandos-essenciais-do-dia-a-dia)
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

- [Node.js](https://nodejs.org/) (ex: v20.x ou superior)
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

## 🚀 Comandos Essenciais do Dia a Dia

Para simplificar o fluxo de trabalho e garantir consistência, todos os comandos importantes foram padronizados como scripts no `package.json` raiz. Utilize sempre os comandos `npm run ...` listados abaixo, pois eles são atalhos otimizados para as operações mais comuns.

### 🏁 Iniciando as Aplicações em Modo de Desenvolvimento

| Comando | Descrição |
| :--- | :--- |
| `npm run start:mobile` | Inicia o servidor de desenvolvimento do **app móvel** (Expo). |
| `npm run start:server` | Inicia o servidor de desenvolvimento do **backend** (Spring Boot). |

_Nota: Você precisará de dois terminais abertos para rodar ambos simultaneamente._

### ✅ Validando seu Código com Testes

Nossa estratégia de testes é otimizada para velocidade. O comando `npm test` é o que você usará na maior parte do tempo.

| Comando | Descrição | Quando Usar |
| :--- | :--- | :--- |
| **`npm test`** | **(Comando Padrão)** Roda os testes **apenas nos projetos afetados** pelas suas mudanças. | **Use este 99% do tempo.** É o mais rápido e eficiente para validar seu trabalho antes de um `git push`. |
| `npm run test:mobile` | Roda **todos** os testes do projeto `mobile`. | Quando você faz mudanças profundas no app móvel e quer garantir que nada quebrou. |
| `npm run test:server` | Roda **todos** os testes do projeto `server`. | Quando você faz mudanças profundas no backend. |
| `npm run test:all` | Roda **todos os testes de todos os projetos** no monorepo. | Raramente. Útil antes de um grande release ou para ter certeza absoluta de que tudo está funcionando. |

### ✨ Mantendo a Qualidade e a Formatação

Estes comandos ajudam a manter o código limpo e padronizado.

| Comando | Descrição |
| :--- | :--- |
| `npm run format` | **Formata automaticamente** todo o código do projeto usando Prettier. |
| `npm run lint` | Roda o ESLint em **todos os projetos** para encontrar problemas de qualidade e possíveis bugs. |

> **Lembre-se: Tudo é Automatizado!**
> Graças aos Git Hooks (Husky), a formatação (`format`), o lint (`lint`) e os testes afetados (`npm test`) já são executados automaticamente antes de cada `git commit` e `git push`. Estes comandos manuais são para sua conveniência durante o desenvolvimento.

### 📊 Visualizando Relatórios de Cobertura de Código

Após rodar os testes com `npm run test:mobile` ou `npm run test:server`, você pode abrir os relatórios detalhados de cobertura no seu navegador:

-   **Relatório do Frontend:** `coverage/mobile/lcov-report/index.html`
-   **Relatório do Backend:** `server/build/reports/jacoco/test/html/index.html`

## Como Contribuir

Para manter o projeto organizado e de alta qualidade, por favor, siga estas diretrizes. Para um guia mais detalhado sobre o fluxo de trabalho diário, consulte o arquivo `CONTRIBUTING.md`.

### Estratégia de Branches

-   A branch `main` é protegida. Todo o trabalho deve ser feito em branches separadas.
-   Use prefixos para nomear suas branches: `feat/`, `fix/`, `chore/`, `docs/`.

### Mensagens de Commit

**Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/).** Este padrão é **obrigatório** e validado automaticamente antes de cada commit pelo `commitlint`.

**Formato:** `<tipo>(<escopo>): <assunto>`

**Exemplos Válidos:**
-   `feat(server): adiciona endpoint para criação de usuários`
-   `fix(mobile): corrige alinhamento do botão de login`
-   `docs: atualiza README com as regras de conventional commits`

### Pull Requests (PRs)

1.  **Título Claro:** Use o padrão de Conventional Commits no título do seu PR.
2.  **Descrição Detalhada:** Explique o *quê* e o *porquê* das suas mudanças.
3.  **Solicite Revisão:** Peça a um ou mais membros da equipe para revisar seu código.
4.  **Garanta que a CI passe:** Todos os checks automatizados devem estar verdes.
5.  **Use "Squash and Merge":** Ao mesclar, use a opção "Squash and merge" para manter o histórico da `main` limpo e linear.