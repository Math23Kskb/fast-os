# Guia de Contribuição para o Fast OS

Bem-vindo(a) ao time de desenvolvimento do Fast OS! Este documento serve como um guia essencial para garantir que todos possamos trabalhar juntos de forma eficiente, organizada e mantendo um alto padrão de qualidade em nosso código.

A leitura e o seguimento destas diretrizes são **obrigatórios** para todos os contribuidores.

## 📜 Princípios Fundamentais

1.  **A `main` é Sagrada:** A branch `main` deve estar sempre em um estado funcional e passível de deploy. Nenhuma contribuição é feita diretamente nela.
2.  **Tudo Passa por Revisão:** Todo código novo ou alterado deve ser revisado por pelo menos um outro membro da equipe através de um Pull Request.
3.  **Qualidade é Inegociável:** Todo código deve ser acompanhado de testes e passar por todas as verificações automáticas de qualidade (linting, formatação, testes).

## 🚀 Workflow de Desenvolvimento: Do Início ao Fim

Este é o passo a passo padrão para desenvolver uma nova funcionalidade (ex: uma nova tela) ou corrigir um bug.

### 1. Sincronize com a `main`

Antes de iniciar qualquer trabalho, garanta que sua base de código local está atualizada com a versão mais recente da `main`.

```bash
git checkout main
git pull origin main
```

### 2. Crie sua Feature Branch

Crie uma nova branch a partir da `main`. Utilize os prefixos definidos no `README.md` para nomear sua branch (`feat/`, `fix/`, `chore/`, etc.).

```bash
# Exemplo para uma tela de perfil do usuário
git checkout -b feat/user-profile-screen
```

### 3. Desenvolvendo uma Tela no App Mobile

O ponto de entrada do aplicativo é o arquivo `mobile/src/app/App.tsx`. Para poder visualizar a tela em que você está trabalhando, será necessário modificá-lo **temporariamente**.

1.  Abra o arquivo `mobile/src/app/App.tsx`.
2.  Encontre o bloco de comentário `NOTA PARA DESENVOLVEDORES`.
3.  Comente a tela que está sendo renderizada atualmente (ex: `<LoginScreen />`).
4.  Importe e adicione o componente da sua tela no lugar.

Agora você pode rodar `npm run start:mobile` para ver a sua tela em desenvolvimento.

### 4. Finalizando sua Tarefa (O Passo Mais Importante!)

Quando você terminar de desenvolver sua funcionalidade e **todos os seus testes estiverem passando** (rodando `npm test`), você **DEVE** reverter a mudança temporária feita no passo anterior.

**Reverta o arquivo `mobile/src/app/App.tsx` para o seu estado original, renderizando a tela de entrada oficial do aplicativo.**

> ❗ **Aviso:** Se você não reverter este arquivo, seu Pull Request irá quebrar o fluxo principal do aplicativo e **falhará no CI**, bloqueando o merge.

### 5. Commit e Pull Request

Com o `App.tsx` devidamente revertido, faça o commit de todas as suas mudanças e envie sua branch.

1.  **Adicione seus arquivos:**
    ```bash
    git add .
    ```

2.  **Faça o commit:** Lembre-se de seguir o padrão **Conventional Commits** detalhado no `README.md`.
    ```bash
    # O hook pre-commit irá formatar seu código e rodar o linter.
    # O hook commit-msg irá validar sua mensagem de commit.
    git commit -m "feat(user): implementa a tela de perfil do usuário"
    ```

3.  **Envie sua branch:**
    ```bash
    # O hook pre-push irá rodar "npm test", que executa os testes nos projetos afetados.
    git push origin feat/user-profile-screen
    ```

4.  **Crie o Pull Request:**
    *   Vá para a interface do GitHub/GitLab.
    *   Abra um Pull Request da sua branch para a `main`.
    *   Siga o template de PR, descrevendo suas mudanças.
    *   Atribua pelo menos um revisor da equipe.
    *   Aguarde a aprovação e a conclusão dos checks do CI antes de mesclar.

Obrigado por contribuir para o Fast OS!