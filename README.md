# 🚀 Trae Dashboard Generator

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-000000.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](#english) | [Português](#português)

---

## English

### 🎯 Overview

**Trae Dashboard Generator** — AI-powered dashboard generator using Trae IDE. Automatically creates interactive data visualizations and business dashboards from data sources with intelligent layout suggestions.

Total source lines: **11,823** across **104** files in **4** languages.

### ✨ Key Features

- **Production-Ready Architecture**: Modular, well-documented, and following best practices
- **Comprehensive Implementation**: Complete solution with all core functionality
- **Clean Code**: Type-safe, well-tested, and maintainable codebase
- **Easy Deployment**: Docker support for quick setup and deployment

### 🚀 Quick Start

#### Prerequisites
- Node.js 20+ and npm


#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/galafis/trae-dashboard-generator.git
cd trae-dashboard-generator
```

2. **Install dependencies**
```bash
npm install
```

#### Running

```bash
npm run dev
```


### 🧪 Testing

```bash
npm test
```

### 📁 Project Structure

```
trae-dashboard-generator/
├── client/
│   ├── public/
│   └── src/
│       ├── _core/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── App.tsx
│       ├── const.ts
│       └── main.tsx
├── drizzle/
│   ├── meta/
│   │   ├── 0000_snapshot.json
│   │   ├── 0001_snapshot.json
│   │   └── _journal.json
│   ├── migrations/
│   ├── 0000_damp_logan.sql
│   ├── 0001_aromatic_mordo.sql
│   ├── relations.ts
│   └── schema.ts
├── patches/
├── server/
│   ├── _core/
│   │   ├── types/
│   │   ├── context.ts
│   │   ├── cookies.ts
│   │   ├── dataApi.ts
│   │   ├── env.ts
│   │   ├── imageGeneration.ts
│   │   ├── index.ts
│   │   ├── llm.ts
│   │   ├── notification.ts
│   │   ├── oauth.ts
│   │   ├── sdk.ts
│   │   ├── systemRouter.ts
│   │   ├── trpc.ts
│   │   ├── vite.ts
│   │   └── voiceTranscription.ts
│   ├── db.ts
│   ├── routers.ts
│   └── storage.ts
├── shared/
│   ├── _core/
│   │   └── errors.ts
│   ├── const.ts
│   └── types.ts
├── README.md
├── components.json
├── drizzle.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| TypeScript | 100 files |
| SQL | 2 files |
| HTML | 1 files |
| CSS | 1 files |

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 👤 Author

**Gabriel Demetrios Lafis**

- GitHub: [@galafis](https://github.com/galafis)
- LinkedIn: [Gabriel Demetrios Lafis](https://linkedin.com/in/gabriel-demetrios-lafis)

---

## Português

### 🎯 Visão Geral

**Trae Dashboard Generator** — AI-powered dashboard generator using Trae IDE. Automatically creates interactive data visualizations and business dashboards from data sources with intelligent layout suggestions.

Total de linhas de código: **11,823** em **104** arquivos em **4** linguagens.

### ✨ Funcionalidades Principais

- **Arquitetura Pronta para Produção**: Modular, bem documentada e seguindo boas práticas
- **Implementação Completa**: Solução completa com todas as funcionalidades principais
- **Código Limpo**: Type-safe, bem testado e manutenível
- **Fácil Implantação**: Suporte Docker para configuração e implantação rápidas

### 🚀 Início Rápido

#### Pré-requisitos
- Node.js 20+ e npm


#### Instalação

1. **Clone the repository**
```bash
git clone https://github.com/galafis/trae-dashboard-generator.git
cd trae-dashboard-generator
```

2. **Install dependencies**
```bash
npm install
```

#### Execução

```bash
npm run dev
```

### 🧪 Testes

```bash
npm test
```

### 📁 Estrutura do Projeto

```
trae-dashboard-generator/
├── client/
│   ├── public/
│   └── src/
│       ├── _core/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── App.tsx
│       ├── const.ts
│       └── main.tsx
├── drizzle/
│   ├── meta/
│   │   ├── 0000_snapshot.json
│   │   ├── 0001_snapshot.json
│   │   └── _journal.json
│   ├── migrations/
│   ├── 0000_damp_logan.sql
│   ├── 0001_aromatic_mordo.sql
│   ├── relations.ts
│   └── schema.ts
├── patches/
├── server/
│   ├── _core/
│   │   ├── types/
│   │   ├── context.ts
│   │   ├── cookies.ts
│   │   ├── dataApi.ts
│   │   ├── env.ts
│   │   ├── imageGeneration.ts
│   │   ├── index.ts
│   │   ├── llm.ts
│   │   ├── notification.ts
│   │   ├── oauth.ts
│   │   ├── sdk.ts
│   │   ├── systemRouter.ts
│   │   ├── trpc.ts
│   │   ├── vite.ts
│   │   └── voiceTranscription.ts
│   ├── db.ts
│   ├── routers.ts
│   └── storage.ts
├── shared/
│   ├── _core/
│   │   └── errors.ts
│   ├── const.ts
│   └── types.ts
├── README.md
├── components.json
├── drizzle.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|------------|-----|
| TypeScript | 100 files |
| SQL | 2 files |
| HTML | 1 files |
| CSS | 1 files |

### 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 👤 Autor

**Gabriel Demetrios Lafis**

- GitHub: [@galafis](https://github.com/galafis)
- LinkedIn: [Gabriel Demetrios Lafis](https://linkedin.com/in/gabriel-demetrios-lafis)
