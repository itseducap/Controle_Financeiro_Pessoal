# Orbit — protótipo de dashboard financeiro

Interface em Nuxt 4, Vue 3 e TypeScript baseada em `Orbit_Finance_Dashboard.svg`.
Este projeto contém apenas o frontend. Todos os valores são fictícios e as alterações
existem somente na memória da página: recarregar restaura o estado inicial.

## Executar

Para instalar, requer Node.js 20.19+ e npm. Dentro desta pasta:

```powershell
npm install
npm run dev
```

Abra `http://127.0.0.1:3000`. O Nuxt está fixado em 4.5.2 e os scripts usam Node 22.23.2,
instalado como dependência local de desenvolvimento. Isso permite usar as correções
atuais do framework sem alterar o Node global da máquina. Durante a primeira instalação
com Node 20, o npm pode mostrar avisos de engine até instalar o runtime local.
O `package-lock.json` registra as versões; `npm ci` reproduz essa instalação.
Prefira os comandos `npm run ...`, que disponibilizam o runtime local automaticamente.

## Organização

| Local                             | Responsabilidade                                                            |
| --------------------------------- | --------------------------------------------------------------------------- |
| `app/app.vue`                     | Composição dos painéis, navegação e abertura dos diálogos.                  |
| `app/components/`                 | Componentes visuais e formulários com contratos tipados de props e eventos. |
| `app/composables/useDashboard.ts` | Estado reativo e operações locais da demonstração.                          |
| `app/data/dashboard.ts`           | Dados fictícios e séries dos gráficos.                                      |
| `app/types/finance.ts`            | Tipos compartilhados da interface.                                          |
| `app/utils/format.ts`             | Formatação de dinheiro, datas e progresso.                                  |
| `app/assets/css/main.css`         | Tokens do SVG, estilos organizados por região e regras responsivas.         |
| `tests/dashboard.spec.ts`         | Verificação dos fluxos reais no navegador.                                  |

## Decisões de implementação

- Os componentes de painel recebem dados por props e emitem intenções por eventos.
  A atualização do estado fica no composable, facilitando uma futura integração com a API.
- Valores monetários são inteiros em centavos. A conversão para reais ocorre na
  apresentação ou na entrada dos formulários, evitando somar valores decimais em reais.
- A tipografia Manrope é servida localmente pelo pacote `@fontsource/manrope`.
  Ícones e gráfico são vetores locais, sem serviços externos durante o uso da página.
- O texto em inglês e a formatação `R$ 24,680.00` reproduzem o SVG. Para localizar a
  interface, centralize as mensagens e ajuste os formatadores em `utils/format.ts`.
- `ssr: false` mantém o protótipo como SPA. `npm run generate` exporta os arquivos
  estáticos em `.output/public`, sem depender de FastAPI ou de banco de dados.
- O CSS usa variáveis de tema e breakpoints em 1250, 1000 e 700px. Em telas pequenas,
  os painéis se empilham, a navegação pode ser expandida e a tabela tem rolagem própria.
- Os diálogos nativos gerenciam foco e Escape. Há navegação por teclado, link para
  pular o menu, rótulos acessíveis e suporte à preferência por movimento reduzido.

## Interações disponíveis

- Busca por nome ou categoria, inclusive com o atalho `Ctrl/Cmd + K`.
- Alternância de períodos do gráfico e expansão da lista de transações.
- Barras de fluxo de caixa com ampliação suave e tooltip por receita/despesa.
- Segmentos e linhas do orçamento com realce de espessura e tooltip com gasto, limite e percentual.
- Cadastro temporário de receita ou despesa, atualizando saldo, orçamento e gráfico.
- Criação de metas e edição dos limites de orçamento durante a sessão.
- Consulta das contas de exemplo e janelas informativas de notificações/configurações.

O período de referência é setembro de 2026. Lançamentos novos recebem a data fixa
18/09/2026 e pertencem à conta de uso diário. A lista de transações é apenas um recorte
dos lançamentos: não deve ser usada para recalcular os saldos iniciais. O indicador
“Net cash flow” é o resultado do mês de referência; os botões do gráfico alteram a
escala temporal da série, não o período desse indicador. Metas são acompanhamentos
independentes, sem transferências de saldo entre contas.

### Interações dos gráficos

Passe o mouse, navegue com Tab ou toque em uma barra para consultar seus dados.
Enter e Espaço também abrem a dica; Escape, toque fora, rolagem ou redimensionamento
a fecham. É possível mover o ponteiro da barra para o tooltip sem perder a informação.
Trocar o período fecha a dica anterior. Valores zero continuam consultáveis pelo teclado,
sem uma área invisível de hover. O mouse ativa somente a barra colorida, não as margens
ao redor nem a parte vazia do trilho do orçamento.

`ChartTooltip.vue` centraliza a apresentação e limita o posicionamento ao viewport.
`useChartTooltip.ts` reúne os eventos e sua limpeza. Cada gráfico resolve a seleção
por identificador nos dados reativos, evitando valores desatualizados. As transformações
ocorrem nos elementos visuais internos, mantendo estável o layout. A área do mouse acompanha
o preenchimento visível. A transição usa 300 ms com desaceleração gradual: crescimento de 4%
no fluxo de caixa e de 15% apenas na espessura do orçamento (aproximadamente 0,6 a 1,2 px).
Ao sair da barra, o tamanho retorna suavemente mesmo que a dica permaneça aberta para leitura.
A animação respeita `prefers-reduced-motion`; o realce e as informações continuam disponíveis.
Os dados atuais são agregados ilustrativos, não um extrato completo de lançamentos por barra.

## Verificar

```powershell
npm run typecheck
npm run build
npm run format:check
npm run test:e2e
```

Os testes usam o Microsoft Edge instalado e iniciam o servidor de desenvolvimento
automaticamente. Cobrem desktop (1440px), mobile (390px), largura mínima (320px),
busca, formulários, atualização de saldos, períodos, navegação e foco dos diálogos.
As capturas são gravadas em `test-results/`, pasta ignorada pelo Git.

Para testar em Chromium em outra máquina:

```powershell
npx playwright install chromium
$env:PLAYWRIGHT_CHANNEL = 'chromium'
npm run test:e2e
```

Use `npm run format` para aplicar a formatação padronizada. Os comentários explicam
decisões e limites da demonstração; os nomes e contratos descrevem o funcionamento
rotineiro para manter a leitura direta.

## Integração futura

O backend ainda não foi implementado. Quando existir, substitua os dados locais do
composable por uma camada de acesso à API, acrescentando estados de carregamento,
erro e persistência. Os tipos atuais descrevem este protótipo e devem ser alinhados
ao contrato real do backend antes da integração.
