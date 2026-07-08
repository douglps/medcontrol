# Proposta de Trabalho – MedControl

## Contexto

Você é um desenvolvedor Full-Stack com foco em Backend, especialista em arquitetura de software, escalabilidade e segurança. Você foi contratado por uma equipe de saúde para avaliar a viabilidade e desenhar a arquitetura de um novo sistema de gestão de medicamentos chamado **MedControl**. O sistema visa substituir planilhas e processos manuais, oferecendo controle de estoque, agendamento de dispensações e histórico clínico digital.

## Entregável

Crie um documento técnico completo em Markdown (.md) que apresente:

1.  **Visão Geral** do projeto e sua proposta de valor.
2.  **Análise de Viabilidade** baseada em sua experiência com sistemas de saúde.
3.  **Arquitetura de Software** (Backend em Node.js/Express + PostgreSQL, Frontend em React + TypeScript).
4.  **Modelagem de Dados** relacional.
5.  **Endpoints de API** REST (JSON).
6.  **Regras de Negócio** críticas e como implementá-las.

O documento deve ser formal, bem estruturado e servir como guia técnico para o desenvolvimento.

## Especificação do Projeto

### 1. Visão Geral e Proposta de Valor

-   Descreva o que é o MedControl e como ele se diferencia de soluções genéricas.
-   Enfatize a segurança e conformidade (LGPD/HIPAA) como diferenciais competitivos.

### 2. Análise de Viabilidade

-   Avalie a viabilidade técnica, econômica e operacional do projeto.
-   Identifique riscos potenciais e ofereça alternativas.

### 3. Arquitetura de Software

-   **Backend:** Node.js + Express + TypeScript
-   **Banco de Dados:** PostgreSQL
-   **Frontend:** React + TypeScript
-   **Infraestrutura:** Docker, Nginx (opcional)

### 4. Modelagem de Dados

-   Desenhe o schema relacional do PostgreSQL.

### 5. Endpoints de API

-   Defina os endpoints RESTful com métodos HTTP, parâmetros, response e error codes.

### 6. Regras de Negócio

-   Descreva as regras críticas e como implementá-las.

## Entregável

Crie um documento técnico completo em Markdown (.md) que apresente:

1. **Visão Geral** do projeto e sua proposta de valor.
2. **Análise de Viabilidade** baseada em sua experiência com sistemas de saúde.
3. **Arquitetura de Software** (Backend em Node.js/Express + PostgreSQL, Frontend em React + TypeScript).
4. **Modelagem de Dados** relacional.
5. **Endpoints de API** REST (JSON).
6. **Regras de Negócio** críticas e como implementá-las.

O documento deve ser formal, bem estruturado e servir como guia técnico para o desenvolvimento.

## Especificação do Projeto

### 1. Visão Geral e Proposta de Valor

- Descreva o que é o MedControl e como ele se diferencia de soluções genéricas.
- Enfatize a segurança e conformidade (LGPD/HIPAA) como diferenciais competitivos.

### 2. Análise de Viabilidade

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MedControl — Proposta Técnica</title>
<style>
  /* ── TOKENS ── */
  :root {
    --bg:        #F7F9FC;
    --surface:   #FFFFFF;
    --border:    #E2E8F2;
    --text:      #1A2233;
    --muted:     #6B7A99;
    --accent:    #2563EB;
    --accent-lt: #EFF4FF;
    --green:     #16A34A;
    --green-lt:  #F0FDF4;
    --amber:     #D97706;
    --amber-lt:  #FFFBEB;
    --red:       #DC2626;
    --red-lt:    #FEF2F2;
    --purple:    #7C3AED;
    --purple-lt: #F5F3FF;
    --teal:      #0D9488;
    --teal-lt:   #F0FDFA;

    /* Kanban colunas */
    --col-backlog:   #64748B;
    --col-todo:      #2563EB;
    --col-progress:  #D97706;
    --col-review:    #7C3AED;
    --col-done:      #16A34A;

    --radius: 10px;
    --shadow: 0 1px 4px rgba(0,0,0,.08);
    --shadow-md: 0 4px 16px rgba(0,0,0,.10);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 15px;
    line-height: 1.6;
  }

  /* ── LAYOUT ── */
  .page { max-width: 1100px; margin: 0 auto; padding: 48px 24px 80px; }

  /* ── COVER ── */
  .cover {
    background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #1D4ED8 100%);
    border-radius: 16px;
    padding: 56px 48px;
    margin-bottom: 48px;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .cover::before {
    content: '+';
    font-size: 340px;
    font-weight: 900;
    color: rgba(255,255,255,.04);
    position: absolute;
    right: -40px;
    top: -60px;
    line-height: 1;
    pointer-events: none;
  }
  .cover-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .05em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .cover h1 { font-size: 42px; font-weight: 800; letter-spacing: -.02em; line-height: 1.1; }
  .cover h1 span { color: #93C5FD; }
  .cover p { margin-top: 16px; font-size: 17px; color: rgba(255,255,255,.75); max-width: 560px; }
  .cover-meta { margin-top: 36px; display: flex; gap: 32px; flex-wrap: wrap; }
  .cover-meta-item { font-size: 13px; color: rgba(255,255,255,.65); }
  .cover-meta-item strong { display: block; color: #fff; font-size: 15px; }

  /* ── SECTION ── */
  .section { margin-bottom: 48px; }
  .section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  h2 { font-size: 24px; font-weight: 700; letter-spacing: -.01em; margin-bottom: 12px; }
  h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }

  p { margin-bottom: 12px; color: #374151; }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--shadow);
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }

  /* ── PROBLEM/VISION ── */
  .problem-card {
    border-left: 4px solid var(--red);
    background: var(--red-lt);
    padding: 20px 24px;
    border-radius: 0 var(--radius) var(--radius) 0;
    margin-bottom: 12px;
  }
  .vision-card {
    border-left: 4px solid var(--green);
    background: var(--green-lt);
    padding: 20px 24px;
    border-radius: 0 var(--radius) var(--radius) 0;
  }

  /* ── STAT BOXES ── */
  .stat-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    text-align: center;
  }
  .stat-num { font-size: 32px; font-weight: 800; letter-spacing: -.02em; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 500; }

  /* ── DATA MODEL ── */
  .entity {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }
  .entity-header {
    padding: 10px 16px;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .entity-body { padding: 12px 16px; }
  .entity-field {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 4px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .entity-field:last-child { border: none; }
  .field-name { font-family: 'Fira Code', 'Courier New', monospace; color: var(--text); flex: 0 0 auto; }
  .field-type { font-size: 11px; color: var(--muted); font-family: monospace; }
  .field-pk { font-size: 10px; background: var(--accent); color: #fff; border-radius: 3px; padding: 1px 5px; font-weight: 700; }
  .field-fk { font-size: 10px; background: var(--purple); color: #fff; border-radius: 3px; padding: 1px 5px; font-weight: 700; }

  /* ── API ROUTES ── */
  .route-group { margin-bottom: 20px; }
  .route-group h3 { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px; font-weight: 700; }
  .route {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: var(--bg);
    border-radius: 6px;
    margin-bottom: 4px;
    font-size: 13px;
    font-family: 'Fira Code', monospace;
  }
  .method {
    font-size: 11px;
    font-weight: 700;
    border-radius: 4px;
    padding: 2px 8px;
    min-width: 52px;
    text-align: center;
    letter-spacing: .04em;
  }
  .GET    { background: var(--green-lt); color: var(--green); }
  .POST   { background: var(--accent-lt); color: var(--accent); }
  .PUT    { background: var(--amber-lt); color: var(--amber); }
  .PATCH  { background: var(--teal-lt); color: var(--teal); }
  .DELETE { background: var(--red-lt); color: var(--red); }
  .route-desc { font-family: system-ui, sans-serif; color: var(--muted); font-size: 12px; margin-left: auto; }

  /* ── BUSINESS RULES ── */
  .rule {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 8px;
    align-items: flex-start;
  }
  .rule-id {
    background: var(--accent);
    color: #fff;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .rule-text { font-size: 14px; color: #374151; }

  /* ── SCREENS ── */
  .screen-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .screen-header {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 14px;
  }
  .screen-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .screen-body { padding: 16px 20px; font-size: 13px; color: var(--muted); }
  .screen-tag {
    display: inline-block;
    background: var(--accent-lt);
    color: var(--accent);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    margin-right: 4px;
    margin-bottom: 4px;
  }

  /* ── STACK ── */
  .stack-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .stack-icon { font-size: 24px; }
  .stack-label { font-weight: 600; font-size: 13px; }
  .stack-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* ══════════════════════════════════════
     KANBAN
  ══════════════════════════════════════ */
  .kanban-intro {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 24px;
  }
  .kanban-board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    overflow-x: auto;
  }
  .kanban-col { min-width: 200px; }
  .kanban-col-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: var(--radius) var(--radius) 0 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 8px;
  }
  .kanban-col-header .count {
    margin-left: auto;
    background: rgba(255,255,255,.25);
    border-radius: 10px;
    padding: 1px 8px;
    font-size: 11px;
  }
  .col-backlog  .kanban-col-header { background: var(--col-backlog); }
  .col-todo     .kanban-col-header { background: var(--col-todo); }
  .col-progress .kanban-col-header { background: var(--col-progress); }
  .col-review   .kanban-col-header { background: var(--col-review); }
  .col-done     .kanban-col-header { background: var(--col-done); }

  .kanban-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 8px;
    box-shadow: var(--shadow);
    position: relative;
  }
  .kanban-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 8px 0 0 8px;
  }
  .col-backlog  .kanban-card::before { background: var(--col-backlog); }
  .col-todo     .kanban-card::before { background: var(--col-todo); }
  .col-progress .kanban-card::before { background: var(--col-progress); }
  .col-review   .kanban-card::before { background: var(--col-review); }
  .col-done     .kanban-card::before { background: var(--col-done); }

  .card-title { font-size: 13px; font-weight: 600; margin-bottom: 6px; line-height: 1.4; }
  .card-desc  { font-size: 11px; color: var(--muted); margin-bottom: 8px; line-height: 1.4; }
  .card-tags  { display: flex; gap: 4px; flex-wrap: wrap; }
  .card-tag {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: .03em;
  }
  .tag-be  { background: #FEF3C7; color: #92400E; }
  .tag-fe  { background: #DBEAFE; color: #1E40AF; }
  .tag-db  { background: #F3E8FF; color: #6B21A8; }
  .tag-auth{ background: #DCFCE7; color: #14532D; }
  .tag-test{ background: #FFE4E6; color: #9F1239; }
  .tag-devops{ background: #E0F2FE; color: #075985; }
  .tag-design{ background: #FEF9C3; color: #713F12; }
  .card-points {
    position: absolute; top: 10px; right: 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    color: var(--muted);
  }

  /* ── SPRINT PLAN ── */
  .sprint-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 16px;
  }
  .sprint-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .sprint-num {
    font-size: 11px;
    font-weight: 700;
    background: var(--accent);
    color: #fff;
    border-radius: 5px;
    padding: 2px 10px;
    letter-spacing: .04em;
  }
  .sprint-name { font-weight: 700; font-size: 15px; }
  .sprint-period { margin-left: auto; font-size: 12px; color: var(--muted); }
  .sprint-goal {
    padding: 10px 20px;
    font-size: 13px;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--accent-lt);
    font-style: italic;
  }
  .sprint-tasks { padding: 16px 20px; }
  .sprint-task {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .sprint-task:last-child { border: none; }
  .task-check { color: var(--green); font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .task-name { flex: 1; }
  .task-owner {
    font-size: 11px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 8px;
    color: var(--muted);
    white-space: nowrap;
  }
  .task-pts {
    font-size: 11px;
    color: var(--accent);
    font-weight: 700;
    min-width: 24px;
    text-align: right;
  }

  /* ── DoD ── */
  .dod-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .dod-item:last-child { border: none; }
  .dod-icon { font-size: 15px; }

  /* ── RISK TABLE ── */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: var(--bg); padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); border-bottom: 2px solid var(--border); }
  td { padding: 10px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
  tr:last-child td { border: none; }
  .risk-high { color: var(--red); font-weight: 700; }
  .risk-med  { color: var(--amber); font-weight: 700; }
  .risk-low  { color: var(--green); font-weight: 700; }

  /* ── FOOTER ── */
  .footer { text-align: center; margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); }

  /* ── STACK OVERVIEW ── */
  .stack-overview {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }
  .stack-col { flex: 1; min-width: 160px; }
  .stack-col-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    border-radius: 6px;
    padding: 4px 10px;
    margin-bottom: 10px;
    display: inline-block;
  }
  .stack-pill-group { display: flex; flex-wrap: wrap; gap: 5px; }
  .stack-pill {
    font-size: 11px;
    font-weight: 600;
    border-radius: 5px;
    padding: 2px 9px;
  }
  .pill-fe   { background: #DBEAFE; color: #1E40AF; }
  .pill-be   { background: #FEF9C3; color: #713F12; }
  .pill-db   { background: #F3E8FF; color: #6B21A8; }
  .pill-test { background: #CCFBF1; color: #0F766E; }
  .pill-infra{ background: #DCFCE7; color: #14532D; }

  /* ── STACK DETAIL GRID ── */
  .stack-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .stack-detail-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .stack-detail-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: var(--bg);
    border-bottom: 2px solid;
  }
  .stack-detail-icon { font-size: 18px; }
  .stack-detail-title { font-weight: 700; font-size: 15px; flex: 1; }
  .stack-detail-lang {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 8px;
  }
  .stack-detail-body { padding: 16px 20px; }
  .stack-lib {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .stack-lib:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .stack-lib-name { font-weight: 600; font-size: 13px; margin-bottom: 4px; }
  .stack-lib-role { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .stack-lib-role code {
    font-family: 'Fira Code', monospace;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 11px;
  }

  /* ── SHARED SCHEMAS ── */
  .stack-shared {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: var(--accent-lt);
    border: 1px solid #BFDBFE;
    border-radius: var(--radius);
    padding: 18px 20px;
  }
  .stack-shared-icon { font-size: 22px; flex-shrink: 0; }

  @media (max-width: 768px) {
    .stack-detail-grid { grid-template-columns: 1fr; }
    .stack-detail-card[style*="span 2"] { grid-column: span 1; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .kanban-board { grid-template-columns: repeat(5, 220px); }
    .cover { padding: 32px 24px; }
    .cover h1 { font-size: 28px; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- COVER -->
  <div class="cover">
    <div class="cover-badge">📋 Proposta Técnica — Equipe Dev</div>
    <h1>Med<span>Control</span></h1>
    <p>Assistente inteligente de medicamentos para cuidadores de idosos e pacientes crônicos — controle de doses, estoque e aderência em um único lugar.</p>
    <div class="cover-meta">
      <div class="cover-meta-item"><strong>Versão</strong>1.0 — MVP</div>
      <div class="cover-meta-item"><strong>Stack</strong>React · Node.js · PostgreSQL</div>
      <div class="cover-meta-item"><strong>Metodologia</strong>Kanban + Sprints de 2 semanas</div>
      <div class="cover-meta-item"><strong>Estimativa</strong>12 semanas · 4 sprints</div>
    </div>
  </div>

  <!-- 1. PROBLEMA & VISÃO -->
  <div class="section">
    <div class="section-title">01 — Problema &amp; Visão</div>
    <div class="problem-card">
      <h3 style="color:var(--red);margin-bottom:6px;">⚠️ O problema</h3>
      <p style="margin:0;color:#7F1D1D;">Famílias que cuidam de idosos ou pacientes crônicos gerenciam múltiplos medicamentos <strong>sem nenhuma ferramenta adequada</strong>. O resultado é dose esquecida, estoque zerado no pior momento e cuidador sem histórico para mostrar ao médico na consulta.</p>
    </div>
    <div class="vision-card">
      <h3 style="color:var(--green);margin-bottom:6px;">🎯 A visão</h3>
      <p style="margin:0;color:#14532D;">Um aplicativo que funciona como <strong>assistente do cuidador</strong> — mostra o checklist do dia, avisa quando o estoque está acabando e mantém histórico de aderência pronto para a consulta médica.</p>
    </div>
  </div>

  <!-- 2. MÉTRICAS DE SUCESSO -->
  <div class="section">
    <div class="section-title">02 — Métricas de Sucesso (MVP)</div>
    <div class="grid-4">
      <div class="stat-box">
        <div class="stat-num" style="color:var(--accent);">≥85%</div>
        <div class="stat-label">Taxa de aderência registrada nas primeiras 4 semanas de uso</div>
      </div>
      <div class="stat-box">
        <div class="stat-num" style="color:var(--green);">&lt;30s</div>
        <div class="stat-label">Tempo médio para registrar uma dose no checklist</div>
      </div>
      <div class="stat-box">
        <div class="stat-num" style="color:var(--amber);">100%</div>
        <div class="stat-label">Alertas de estoque enviados antes de zerar o medicamento</div>
      </div>
      <div class="stat-box">
        <div class="stat-num" style="color:var(--purple);">0</div>
        <div class="stat-label">Edições retroativas no histórico de doses — integridade garantida</div>
      </div>
    </div>
  </div>

  <!-- 3. MODELO DE DADOS -->
  <div class="section">
    <div class="section-title">03 — Modelo de Dados</div>
    <div class="grid-3" style="margin-bottom:12px;">

      <div class="entity">
        <div class="entity-header" style="background:#EFF4FF;color:var(--accent);">👤 User</div>
        <div class="entity-body">
          <div class="entity-field"><span class="field-pk">PK</span><span class="field-name">id</span><span class="field-type">uuid</span></div>
          <div class="entity-field"><span class="field-name">name</span><span class="field-type">varchar</span></div>
          <div class="entity-field"><span class="field-name">email</span><span class="field-type">varchar unique</span></div>
          <div class="entity-field"><span class="field-name">password_hash</span><span class="field-type">varchar</span></div>
        </div>
      </div>

      <div class="entity">
        <div class="entity-header" style="background:#F0FDF4;color:var(--green);">🧑‍🦳 Patient</div>
        <div class="entity-body">
          <div class="entity-field"><span class="field-pk">PK</span><span class="field-name">id</span><span class="field-type">uuid</span></div>
          <div class="entity-field"><span class="field-name">name</span><span class="field-type">varchar</span></div>
          <div class="entity-field"><span class="field-name">birthDate</span><span class="field-type">date</span></div>
          <div class="entity-field"><span class="field-name">relationship</span><span class="field-type">varchar</span></div>
          <div class="entity-field"><span class="field-fk">FK</span><span class="field-name">userId</span><span class="field-type">→ User.id</span></div>
        </div>
      </div>

      <div class="entity">
        <div class="entity-header" style="background:#FFFBEB;color:var(--amber);">💊 Medication</div>
        <div class="entity-body">
          <div class="entity-field"><span class="field-pk">PK</span><span class="field-name">id</span><span class="field-type">uuid</span></div>
          <div class="entity-field"><span class="field-name">name</span><span class="field-type">varchar</span></div>
          <div class="entity-field"><span class="field-name">dosage</span><span class="field-type">varchar</span></div>
          <div class="entity-field"><span class="field-name">form</span><span class="field-type">enum</span></div>
          <div class="entity-field"><span class="field-name">stockQty</span><span class="field-type">decimal</span></div>
          <div class="entity-field"><span class="field-name">stockUnit</span><span class="field-type">varchar</span></div>
          <div class="entity-field"><span class="field-name">lowStockAlert</span><span class="field-type">decimal</span></div>
          <div class="entity-field"><span class="field-fk">FK</span><span class="field-name">patientId</span><span class="field-type">→ Patient.id</span></div>
        </div>
      </div>

    </div>
    <div class="grid-2">

      <div class="entity">
        <div class="entity-header" style="background:#F5F3FF;color:var(--purple);">🕐 Schedule</div>
        <div class="entity-body">
          <div class="entity-field"><span class="field-pk">PK</span><span class="field-name">id</span><span class="field-type">uuid</span></div>
          <div class="entity-field"><span class="field-name">time</span><span class="field-type">time (HH:MM)</span></div>
          <div class="entity-field"><span class="field-name">daysOfWeek</span><span class="field-type">json [1,2,3,4,5]</span></div>
          <div class="entity-field"><span class="field-fk">FK</span><span class="field-name">medicationId</span><span class="field-type">→ Medication.id</span></div>
        </div>
      </div>

      <div class="entity">
        <div class="entity-header" style="background:#F0FDFA;color:var(--teal);">📝 DoseLog</div>
        <div class="entity-body">
          <div class="entity-field"><span class="field-pk">PK</span><span class="field-name">id</span><span class="field-type">uuid</span></div>
          <div class="entity-field"><span class="field-name">scheduledAt</span><span class="field-type">timestamp</span></div>
          <div class="entity-field"><span class="field-name">takenAt</span><span class="field-type">timestamp?</span></div>
          <div class="entity-field"><span class="field-name">status</span><span class="field-type">enum: taken|missed|skipped|pending</span></div>
          <div class="entity-field"><span class="field-name">note</span><span class="field-type">text?</span></div>
          <div class="entity-field"><span class="field-fk">FK</span><span class="field-name">scheduleId</span><span class="field-type">→ Schedule.id</span></div>
        </div>
      </div>

    </div>
    <div class="card" style="margin-top:12px;background:var(--bg);">
      <p style="margin:0;font-size:13px;color:var(--muted);"><strong>Relacionamentos:</strong> User 1:N Patient → Patient 1:N Medication → Medication 1:N Schedule → Schedule 1:N DoseLog</p>
    </div>
  </div>

  <!-- 4. ROTAS DA API -->
  <div class="section">
    <div class="section-title">04 — Rotas da API (REST)</div>
    <div class="grid-2">
      <div class="card">
        <div class="route-group">
          <h3>Autenticação</h3>
          <div class="route"><span class="method POST">POST</span>/auth/register<span class="route-desc">Cadastro de usuário</span></div>
          <div class="route"><span class="method POST">POST</span>/auth/login<span class="route-desc">Retorna JWT</span></div>
        </div>
        <div class="route-group">
          <h3>Pacientes</h3>
          <div class="route"><span class="method GET">GET</span>/patients<span class="route-desc">Lista do usuário autenticado</span></div>
          <div class="route"><span class="method POST">POST</span>/patients<span class="route-desc">Cadastrar paciente</span></div>
          <div class="route"><span class="method PUT">PUT</span>/patients/:id<span class="route-desc">Editar paciente</span></div>
          <div class="route"><span class="method DELETE">DEL</span>/patients/:id<span class="route-desc">Remover paciente</span></div>
        </div>
        <div class="route-group">
          <h3>Medicamentos</h3>
          <div class="route"><span class="method GET">GET</span>/patients/:id/medications</div>
          <div class="route"><span class="method POST">POST</span>/patients/:id/medications</div>
          <div class="route"><span class="method PUT">PUT</span>/medications/:id</div>
          <div class="route"><span class="method DELETE">DEL</span>/medications/:id</div>
        </div>
      </div>
      <div class="card">
        <div class="route-group">
          <h3>Horários</h3>
          <div class="route"><span class="method GET">GET</span>/medications/:id/schedules</div>
          <div class="route"><span class="method POST">POST</span>/medications/:id/schedules</div>
          <div class="route"><span class="method DELETE">DEL</span>/schedules/:id</div>
        </div>
        <div class="route-group">
          <h3>Checklist &amp; Doses</h3>
          <div class="route"><span class="method GET">GET</span>/checklist?patientId=&amp;date=<span class="route-desc">Doses do dia</span></div>
          <div class="route"><span class="method PATCH">PATCH</span>/doselogs/:id<span class="route-desc">Registrar taken/missed/skipped</span></div>
        </div>
        <div class="route-group">
          <h3>Relatórios</h3>
          <div class="route"><span class="method GET">GET</span>/patients/:id/adherence?month=<span class="route-desc">% aderência mensal</span></div>
          <div class="route"><span class="method GET">GET</span>/medications/:id/stock<span class="route-desc">Estoque e previsão de duração</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. REGRAS DE NEGÓCIO -->
  <div class="section">
    <div class="section-title">05 — Regras de Negócio</div>
    <div class="rule"><span class="rule-id">R1</span><span class="rule-text"><strong>Decremento automático de estoque:</strong> <code>stockQty</code> diminui automaticamente a cada <code>DoseLog</code> com <code>status=taken</code>. Implementar via trigger no banco ou middleware da API.</span></div>
    <div class="rule"><span class="rule-id">R2</span><span class="rule-text"><strong>Alerta de estoque baixo:</strong> quando <code>stockQty ≤ lowStockAlert</code>, notificação push/e-mail é disparada para o cuidador.</span></div>
    <div class="rule"><span class="rule-id">R3</span><span class="rule-text"><strong>Geração dinâmica do checklist:</strong> <code>Schedule.daysOfWeek</code> contém o dia atual → cria <code>DoseLog</code> com <code>status=pending</code>. Job agendado a cada meia-noite (cron).</span></div>
    <div class="rule"><span class="rule-id">R4</span><span class="rule-text"><strong>Imutabilidade histórica:</strong> <code>DoseLog</code> só pode ser atualizado no mesmo dia da criação — sem edição retroativa para garantir integridade do histórico.</span></div>
    <div class="rule"><span class="rule-id">R5</span><span class="rule-text"><strong>Cálculo de aderência:</strong> <code>(taken / (taken + missed)) × 100</code> nos últimos N dias. Doses com <code>status=skipped</code> são excluídas do cálculo.</span></div>
  </div>

  <!-- 6. TELAS PRINCIPAIS -->
  <div class="section">
    <div class="section-title">06 — Telas Principais (React)</div>
    <div class="grid-3">
      <div class="screen-card">
        <div class="screen-header">
          <div class="screen-icon" style="background:#EFF4FF;">🏠</div>
          Dashboard
        </div>
        <div class="screen-body">
          Lista de pacientes com alertas visuais de dose pendente ou estoque baixo. Card por paciente com status em tempo real.
          <div style="margin-top:10px;">
            <span class="screen-tag">Pendentes</span>
            <span class="screen-tag">Estoque baixo</span>
            <span class="screen-tag">Badges</span>
          </div>
        </div>
      </div>
      <div class="screen-card">
        <div class="screen-header">
          <div class="screen-icon" style="background:#F0FDF4;">✅</div>
          Checklist do Dia
        </div>
        <div class="screen-body">
          Lista de doses por horário com botões de ação rápida. Feedback visual imediato ao registrar cada dose.
          <div style="margin-top:10px;">
            <span class="screen-tag">Tomou</span>
            <span class="screen-tag">Pulou</span>
            <span class="screen-tag">Perdeu</span>
          </div>
        </div>
      </div>
      <div class="screen-card">
        <div class="screen-header">
          <div class="screen-icon" style="background:#FFFBEB;">💊</div>
          Medicamentos
        </div>
        <div class="screen-body">
          CRUD completo com controle de estoque, configuração de horários por dia da semana e definição de alerta.
          <div style="margin-top:10px;">
            <span class="screen-tag">CRUD</span>
            <span class="screen-tag">Horários</span>
            <span class="screen-tag">Estoque</span>
          </div>
        </div>
      </div>
      <div class="screen-card">
        <div class="screen-header">
          <div class="screen-icon" style="background:#F5F3FF;">📅</div>
          Histórico
        </div>
        <div class="screen-body">
          Calendário com cor por aderência diária. Verde (100%), Amarelo (parcial), Vermelho (nenhuma dose tomada).
          <div style="margin-top:10px;">
            <span class="screen-tag">Calendário</span>
            <span class="screen-tag">Por dia</span>
          </div>
        </div>
      </div>
      <div class="screen-card">
        <div class="screen-header">
          <div class="screen-icon" style="background:#F0FDFA;">📊</div>
          Relatório
        </div>
        <div class="screen-body">
          Gráfico de barras de aderência mensal por medicamento. Exportável para PDF para levar à consulta médica.
          <div style="margin-top:10px;">
            <span class="screen-tag">Gráfico</span>
            <span class="screen-tag">Mensal</span>
            <span class="screen-tag">PDF export</span>
          </div>
        </div>
      </div>
      <div class="screen-card">
        <div class="screen-header">
          <div class="screen-icon" style="background:#FFF7ED;">🔔</div>
          Notificações
        </div>
        <div class="screen-body">
          Central de alertas: doses próximas do horário, estoque baixo e lembretes de consulta. Push e e-mail.
          <div style="margin-top:10px;">
            <span class="screen-tag">Push</span>
            <span class="screen-tag">E-mail</span>
            <span class="screen-tag">In-app</span>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- 7. STACK TÉCNICA -->
  <div class="section">
    <div class="section-title">07 — Stack Técnica</div>
    <div class="grid-3">

      <div class="stack-item">
        <div class="stack-icon">⚛️</div>
        <div>
          <div class="stack-label">Frontend</div>
          <div class="stack-sub">React + TailwindCSS</div>
        </div>
      </div>

      <div class="stack-item">
        <div class="stack-icon">🟢</div>
        <div>
          <div class="stack-label">Backend</div>
          <div class="stack-sub">Node.js + Express</div>
        </div>
      </div>

      <div class="stack-item">
        <div class="stack-icon">🔧</div>
        <div>
          <div class="stack-label">DevOps</div>
          <div class="stack-sub">Docker Compose + GitHub Actions + Railway</div>
        </div>
      </div>

    </div>
  </div>

  <!-- ══════════════════════════════════════
       8. KANBAN — BOARD COMPLETO
  ══════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">08 — Kanban Board</div>

    <div class="kanban-intro">
      <h2 style="margin-bottom:8px;">Visão Geral do Kanban</h2>
      <p style="margin-bottom:16px;color:var(--muted);">O board é a fonte única de verdade do estado atual do projeto. Cada card representa uma tarefa atômica com estimativa em pontos de esforço (1 = ~2h, 3 = ~meio dia, 5 = ~1 dia, 8 = ~2 dias). Os cards são organizados nas 5 colunas padrão abaixo.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;"><span style="width:12px;height:12px;background:var(--col-backlog);border-radius:50%;display:inline-block;"></span><strong>Backlog</strong> — priorizado, não iniciado</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;"><span style="width:12px;height:12px;background:var(--col-todo);border-radius:50%;display:inline-block;"></span><strong>A Fazer</strong> — Sprint atual, não iniciado</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;"><span style="width:12px;height:12px;background:var(--col-progress);border-radius:50%;display:inline-block;"></span><strong>Em Progresso</strong> — WIP ativo</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;"><span style="width:12px;height:12px;background:var(--col-review);border-radius:50%;display:inline-block;"></span><strong>Em Revisão</strong> — PR aberto / QA</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;"><span style="width:12px;height:12px;background:var(--col-done);border-radius:50%;display:inline-block;"></span><strong>Concluído</strong> — merge + deploy feitos</div>
      </div>
    </div>

    <div class="kanban-board">

      <!-- BACKLOG -->
      <div class="kanban-col col-backlog">
        <div class="kanban-col-header">📦 Backlog<span class="count">7</span></div>

        <div class="kanban-card">
          <div class="card-points">5pts</div>
          <div class="card-title">Relatório exportável em PDF</div>
          <div class="card-desc">Gerar PDF de aderência mensal para levar à consulta médica.</div>
          <div class="card-tags"><span class="card-tag tag-fe">Frontend</span><span class="card-tag tag-be">Backend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Notificações push (PWA)</div>
          <div class="card-desc">Alertar cuidador no horário da dose via Service Worker.</div>
          <div class="card-tags"><span class="card-tag tag-fe">Frontend</span><span class="card-tag tag-devops">DevOps</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Notificação por e-mail (estoque baixo)</div>
          <div class="card-desc">Envio via Resend/Nodemailer quando stockQty ≤ lowStockAlert.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">5pts</div>
          <div class="card-title">Tela de Histórico — calendário</div>
          <div class="card-desc">Calendário mensal com cor de aderência por dia.</div>
          <div class="card-tags"><span class="card-tag tag-fe">Frontend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">2pts</div>
          <div class="card-title">Filtro de intervalo no relatório</div>
          <div class="card-desc">Selecionar período customizado no gráfico de aderência.</div>
          <div class="card-tags"><span class="card-tag tag-fe">Frontend</span><span class="card-tag tag-be">Backend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Múltiplos cuidadores por paciente</div>
          <div class="card-desc">Compartilhamento de paciente entre contas de usuário diferentes.</div>
          <div class="card-tags"><span class="card-tag tag-db">DB</span><span class="card-tag tag-be">Backend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">2pts</div>
          <div class="card-title">Modo escuro</div>
          <div class="card-desc">Tema dark completo com preferência salva em localStorage.</div>
          <div class="card-tags"><span class="card-tag tag-fe">Frontend</span><span class="card-tag tag-design">Design</span></div>
        </div>
      </div>

      <!-- A FAZER (Sprint 1) -->
      <div class="kanban-col col-todo">
        <div class="kanban-col-header">📋 A Fazer<span class="count">6</span></div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Setup do projeto (monorepo)</div>
          <div class="card-desc">Turborepo com packages/api e packages/web. ESLint, Prettier, Husky configurados.</div>
          <div class="card-tags"><span class="card-tag tag-devops">DevOps</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">2pts</div>
          <div class="card-title">Docker Compose local</div>
          <div class="card-desc">PostgreSQL + pgAdmin + API em contêineres. Seed de dados de teste.</div>
          <div class="card-tags"><span class="card-tag tag-devops">DevOps</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">5pts</div>
          <div class="card-title">Migrations do banco (Sequelize)</div>
          <div class="card-desc">User, Patient, Medication, Schedule, DoseLog. Índices, constraints e seeders de teste.</div>
          <div class="card-tags"><span class="card-tag tag-db">DB</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Auth — registro e login (JWT)</div>
          <div class="card-desc">POST /auth/register e /auth/login. Hash bcrypt, token com expiração.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span><span class="card-tag tag-auth">Auth</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">2pts</div>
          <div class="card-title">Middleware de autenticação</div>
          <div class="card-desc">Verificação de JWT em todas as rotas protegidas da API.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span><span class="card-tag tag-auth">Auth</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">CI com GitHub Actions</div>
          <div class="card-desc">Pipeline: lint → test → build a cada PR para main.</div>
          <div class="card-tags"><span class="card-tag tag-devops">DevOps</span></div>
        </div>
      </div>

      <!-- EM PROGRESSO -->
      <div class="kanban-col col-progress">
        <div class="kanban-col-header">⚡ Em Progresso<span class="count">4</span></div>

        <div class="kanban-card">
          <div class="card-points">5pts</div>
          <div class="card-title">CRUD de Pacientes (API)</div>
          <div class="card-desc">GET /patients, POST, PUT /:id, DELETE /:id com validação Zod e isolamento por usuário autenticado.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">5pts</div>
          <div class="card-title">CRUD de Medicamentos (API)</div>
          <div class="card-desc">Rotas de medicamentos vinculadas ao paciente. Validação de form, dosagem e estoque inicial.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Design System base (Figma)</div>
          <div class="card-desc">Tokens de cor, tipografia, espaçamento e componentes atômicos (Button, Input, Card, Badge).</div>
          <div class="card-tags"><span class="card-tag tag-design">Design</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Tela de Login/Registro (React)</div>
          <div class="card-desc">Formulários com React Hook Form + Zod. Redirecionamento pós-auth e persistência de token.</div>
          <div class="card-tags"><span class="card-tag tag-fe">Frontend</span></div>
        </div>
      </div>

      <!-- EM REVISÃO -->
      <div class="kanban-col col-review">
        <div class="kanban-col-header">🔍 Em Revisão<span class="count">3</span></div>

        <div class="kanban-card">
          <div class="card-points">8pts</div>
          <div class="card-title">Endpoint /checklist (API)</div>
          <div class="card-desc">Gera DoseLog dinâmico do dia com base nos Schedules ativos. Regra R3 implementada e com testes de integração.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span><span class="card-tag tag-test">Testes</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">PATCH /doselogs/:id</div>
          <div class="card-desc">Registrar taken/missed/skipped. Regras R1 (decremento estoque) e R4 (imutabilidade histórica) com guard de mesma data.</div>
          <div class="card-tags"><span class="card-tag tag-be">Backend</span><span class="card-tag tag-test">Testes</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">2pts</div>
          <div class="card-title">Testes unitários — Auth</div>
          <div class="card-desc">Vitest: cobertura dos casos de registro duplicado, senha inválida e token expirado.</div>
          <div class="card-tags"><span class="card-tag tag-test">Testes</span></div>
        </div>
      </div>

      <!-- CONCLUÍDO -->
      <div class="kanban-col col-done">
        <div class="kanban-col-header">✅ Concluído<span class="count">3</span></div>

        <div class="kanban-card">
          <div class="card-points">2pts</div>
          <div class="card-title">Levantamento de requisitos</div>
          <div class="card-desc">Entrevistas com cuidadores, definição de personas e validação das regras de negócio.</div>
          <div class="card-tags"><span class="card-tag tag-design">Design</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">3pts</div>
          <div class="card-title">Wireframes das 5 telas</div>
          <div class="card-desc">Fluxos navegáveis no Figma: Dashboard, Checklist, Medicamentos, Histórico, Relatório.</div>
          <div class="card-tags"><span class="card-tag tag-design">Design</span></div>
        </div>

        <div class="kanban-card">
          <div class="card-points">1pt</div>
          <div class="card-title">Definição do modelo de dados</div>
          <div class="card-desc">Diagrama ER aprovado pela equipe. Relacionamentos, tipos e constraints definidos.</div>
          <div class="card-tags"><span class="card-tag tag-db">DB</span></div>
        </div>
      </div>

    </div><!-- /kanban-board -->
  </div>

  <!-- 9. PLANEJAMENTO POR SPRINT -->
  <div class="section">
    <div class="section-title">09 — Planejamento por Sprint (12 semanas)</div>

    <div class="sprint-block">
      <div class="sprint-header">
        <span class="sprint-num">SPRINT 1</span>
        <span class="sprint-name">Fundação</span>
        <span class="sprint-period">Semanas 1–2 · 28 pts</span>
      </div>
      <div class="sprint-goal">🎯 Meta: ambiente rodando localmente, banco modelado e autenticação funcional.</div>
      <div class="sprint-tasks">
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Setup monorepo (Turborepo + workspaces)</span><span class="task-owner">DevOps</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Docker Compose local (PostgreSQL + pgAdmin + API)</span><span class="task-owner">DevOps</span><span class="task-pts">2</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Migrations Sequelize — todas as entidades + seeders</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">POST /auth/register + /auth/login (JWT + bcrypt)</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Middleware de verificação JWT</span><span class="task-owner">Backend</span><span class="task-pts">2</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">CI GitHub Actions (lint + test + build)</span><span class="task-owner">DevOps</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Design System base no Figma (tokens + átomos)</span><span class="task-owner">Design</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Tela de Login/Registro (React + React Hook Form)</span><span class="task-owner">Frontend</span><span class="task-pts">5</span></div>
      </div>
    </div>

    <div class="sprint-block">
      <div class="sprint-header">
        <span class="sprint-num">SPRINT 2</span>
        <span class="sprint-name">Core CRUD</span>
        <span class="sprint-period">Semanas 3–4 · 32 pts</span>
      </div>
      <div class="sprint-goal">🎯 Meta: cuidador consegue cadastrar pacientes e medicamentos com horários completos.</div>
      <div class="sprint-tasks">
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">CRUD de Pacientes — API (GET/POST/PUT/DELETE)</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">CRUD de Medicamentos — API (por paciente)</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">CRUD de Horários (Schedule) — API</span><span class="task-owner">Backend</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">GET /medications/:id/stock — previsão de duração</span><span class="task-owner">Backend</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Dashboard (React) — lista de pacientes + alertas</span><span class="task-owner">Frontend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Tela de Medicamentos (React) — CRUD completo</span><span class="task-owner">Frontend</span><span class="task-pts">8</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Testes unitários — CRUD Patients/Medications</span><span class="task-owner">QA</span><span class="task-pts">3</span></div>
      </div>
    </div>

    <div class="sprint-block">
      <div class="sprint-header">
        <span class="sprint-num">SPRINT 3</span>
        <span class="sprint-name">Checklist &amp; Doses</span>
        <span class="sprint-period">Semanas 5–8 · 38 pts</span>
      </div>
      <div class="sprint-goal">🎯 Meta: fluxo principal funcionando — cuidador vê as doses do dia e registra cada tomada em tempo real.</div>
      <div class="sprint-tasks">
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Cron job de geração do checklist diário (R3)</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">GET /checklist?patientId&amp;date — endpoint + testes</span><span class="task-owner">Backend</span><span class="task-pts">8</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">PATCH /doselogs/:id — R1 (estoque) + R4 (guard data)</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">R2: trigger/webhook de alerta estoque baixo</span><span class="task-owner">Backend</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Tela Checklist do Dia (React) — botões Tomou/Pulou/Perdeu</span><span class="task-owner">Frontend</span><span class="task-pts">8</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Toast de feedback + otimistic update (React Query)</span><span class="task-owner">Frontend</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Testes integração — fluxo completo checklist → dose</span><span class="task-owner">QA</span><span class="task-pts">6</span></div>
      </div>
    </div>

    <div class="sprint-block">
      <div class="sprint-header">
        <span class="sprint-num">SPRINT 4</span>
        <span class="sprint-name">Relatórios &amp; Launch</span>
        <span class="sprint-period">Semanas 9–12 · 30 pts</span>
      </div>
      <div class="sprint-goal">🎯 Meta: MVP em produção com histórico, gráfico de aderência e notificações funcionais.</div>
      <div class="sprint-tasks">
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">GET /patients/:id/adherence?month — cálculo R5</span><span class="task-owner">Backend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Tela Histórico — calendário com cores de aderência</span><span class="task-owner">Frontend</span><span class="task-pts">8</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Tela Relatório — gráfico de barras mensal (Recharts)</span><span class="task-owner">Frontend</span><span class="task-pts">5</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Notificações e-mail (Resend) — estoque baixo</span><span class="task-owner">Backend</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Deploy em produção (Railway) + variáveis de ambiente</span><span class="task-owner">DevOps</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Smoke tests pós-deploy + monitoramento básico</span><span class="task-owner">QA</span><span class="task-pts">3</span></div>
        <div class="sprint-task"><span class="task-check">○</span><span class="task-name">Documentação da API (Swagger/OpenAPI)</span><span class="task-owner">Backend</span><span class="task-pts">3</span></div>
      </div>
    </div>
  </div>

  <!-- 10. DEFINITION OF DONE -->
  <div class="section">
    <div class="section-title">10 — Definition of Done (DoD)</div>
    <div class="card">
      <p style="color:var(--muted);font-size:13px;margin-bottom:16px;">Um card só sai da coluna <strong>Em Revisão</strong> para <strong>Concluído</strong> quando todos os critérios abaixo forem atendidos:</p>
      <div class="dod-item"><span class="dod-icon">✅</span><div><strong>Código revisado</strong> — PR aprovado por pelo menos 1 dev da equipe. Sem comentários não resolvidos.</div></div>
      <div class="dod-item"><span class="dod-icon">🧪</span><div><strong>Testes escritos</strong> — unitários para lógica de negócio, integração para endpoints. Cobertura mínima de 80% nos módulos tocados.</div></div>
      <div class="dod-item"><span class="dod-icon">🔒</span><div><strong>Segurança verificada</strong> — endpoints autenticados validados, inputs sanitizados com Zod, sem dados sensíveis expostos.</div></div>
      <div class="dod-item"><span class="dod-icon">📱</span><div><strong>Responsivo</strong> — tela testada em mobile (375px) e desktop (1280px). Sem overflow horizontal.</div></div>
      <div class="dod-item"><span class="dod-icon">🚀</span><div><strong>Pipeline verde</strong> — GitHub Actions passou (lint + test + build) no branch do PR.</div></div>
      <div class="dod-item"><span class="dod-icon">📝</span><div><strong>Documentado</strong> — endpoint novo tem entrada no Swagger; componente complexo tem JSDoc mínimo.</div></div>
    </div>
  </div>

  <!-- 11. RISCOS -->
  <div class="section">
    <div class="section-title">11 — Riscos e Mitigações</div>
    <div class="card" style="padding:0;overflow:hidden;">
      <table>
        <thead>
          <tr>
            <th>Risco</th>
            <th>Probabilidade</th>
            <th>Impacto</th>
            <th>Mitigação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cron job falha e checklist do dia não é gerado</td>
            <td class="risk-med">Média</td>
            <td class="risk-high">Alto</td>
            <td>Geração lazy no GET /checklist como fallback + alertas de falha de job</td>
          </tr>
          <tr>
            <td>Estoque negativo por race condition</td>
            <td class="risk-low">Baixa</td>
            <td class="risk-med">Médio</td>
            <td>Transação atômica no banco (Sequelize transaction) ao registrar dose</td>
          </tr>
          <tr>
            <td>Escopo crescendo além do MVP</td>
            <td class="risk-high">Alta</td>
            <td class="risk-med">Médio</td>
            <td>Backlog com WIP limit por coluna; novos itens só entram via refinamento semanal</td>
          </tr>
          <tr>
            <td>Falta de adoção pelo cuidador</td>
            <td class="risk-med">Média</td>
            <td class="risk-high">Alto</td>
            <td>Onboarding simplificado; checklist acessível na home sem login repetido (remember me)</td>
          </tr>
          <tr>
            <td>Dados sensíveis de saúde expostos</td>
            <td class="risk-low">Baixa</td>
            <td class="risk-high">Alto</td>
            <td>HTTPS obrigatório, autenticação JWT, nunca logar dados de pacientes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="footer">
    MedControl · Proposta Técnica v1.0 · Confidencial — uso interno da equipe Dev
  </div>

</div>
</body>
</html>
