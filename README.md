<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=250&section=header&text=AMBATUKAM-MD&fontSize=56&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=WhatsApp%20Multi-Device%20Bot%20%E2%80%A2%20Plugin%20Architecture%20%E2%80%A2%20Modern%20Runtime&descSize=17&descAlignY=61&color=gradient" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=18&duration=2800&pause=800&color=8B5CF6&center=true&vCenter=true&width=760&lines=AMBATUKAM-MD;Modern+WhatsApp+Automation;Plugin-Based+%7C+Hot+Reload+%7C+SQLite;Built+with+Node.js+%2B+Baileys" alt="Typing SVG" />

<br>

<img src="https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Baileys-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827" />
<img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
<img src="https://img.shields.io/badge/License-ISC-7C3AED?style=for-the-badge" />

<br><br>

**A modern, modular WhatsApp bot focused on clean architecture, extensibility and a polished developer experience.**

</div>

---

## ✦ Project Overview

**AMBATUKAM-MD** is a lightweight WhatsApp Multi-Device bot built with **Node.js**, **JavaScript ESM**, and **Baileys**.

The runtime is designed around a modular plugin system with recursive discovery, dynamic imports, hot reload, SQLite-backed authentication, JSON persistence and worker-based execution.

<div align="center">

| Architecture | Runtime | Storage | Development |
|:---:|:---:|:---:|:---:|
| Plugin-first | Worker Thread | SQLite + JSON | Hot Reload |

</div>

---

## 🎬 AMBATUKAM Visual

<div align="center">

<img src="https://media1.tenor.com/m/JPX5iWzkrfQAAAAd/akudama-drive-anime.gif" width="92%" alt="AMBATUKAM anime animation" />

<br><br>

<img src="https://media1.tenor.com/m/KTESg0AKoCsAAAAd/cyberpunk-anime.gif" width="45%" alt="Anime animation" />
&nbsp;
<img src="https://media1.tenor.com/m/WHsik1NuWbkAAAAd/cyberpunk-cyberpunk-anime.gif" width="45%" alt="Cyberpunk anime animation" />

<br><br>

<img src="https://capsule-render.vercel.app/api?type=rect&height=80&text=AMBATUKAM%20%E2%80%A2%20SYSTEM%20ONLINE&fontSize=25&fontColor=ffffff&animation=fadeIn&color=gradient" width="90%" />

</div>

---

## ⚡ Core Features

<table>
<tr>
<td width="50%">

### Runtime

- WhatsApp Multi-Device support
- Baileys socket integration
- Worker-based launcher
- Automatic worker recovery
- Keep-alive and retry handling
- Full history synchronization
- High-quality link previews

</td>
<td width="50%">

### Developer Experience

- Recursive plugin discovery
- Dynamic ESM loading
- Hot reload for plugins
- SQLite authentication state
- JSON database persistence
- Terminal runtime controls
- Modular project structure

</td>
</tr>
</table>

---

## 🧩 Plugin System

Plugins are organized into focused modules so features can evolve without turning the core runtime into an archaeological site.

<div align="center">

| Category | Category | Category | Category |
|:---|:---|:---|:---|
| `ai` | `anime` | `bypass` | `command` |
| `core` | `downloader` | `fun` | `games` |
| `group` | `info` | `internet` | `jadibot` |
| `main` | `maker` | `owner` | `rpg` |

</div>

---

## 🛠 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,js,sqlite,npm,git,github&theme=dark" />

<br><br>

| Technology | Role |
|:---|:---|
| **Node.js** | Runtime environment |
| **JavaScript / ESM** | Application architecture |
| **Baileys** | WhatsApp Multi-Device layer |
| **better-sqlite3** | SQLite support |
| **Pino** | Logging |
| **Chalk** | Terminal output |
| **Sharp** | Image processing |
| **Cheerio** | HTML parsing |
| **Axios / Fetch** | HTTP requests |
| **FFmpeg** | Media processing |
| **QRCode** | QR utilities |

</div>

---

## 🏗 Architecture

<div align="center">

```text
                         AMBATUKAM-MD
                              │
                    ┌─────────▼─────────┐
                    │      index.js     │
                    │   Worker Launcher │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │      main.js      │
                    │    Runtime Core   │
                    └──────┬─────┬──────┘
                           │     │
              ┌────────────┘     └────────────┐
              ▼                               ▼
       ┌──────────────┐                ┌──────────────┐
       │   Baileys    │                │   Storage    │
       │  WhatsApp MD │                │ SQLite + JSON│
       └──────┬───────┘                └──────────────┘
              │
              ▼
       ┌──────────────┐
       │  handler.js  │
       │ Event Router │
       └──────┬───────┘
              │
              ▼
       ┌──────────────────┐
       │     plugins/     │
       │ Dynamic + Reload │
       └──────────────────┘
```

</div>

---

## 📁 Project Structure

```text
AMBATUKAM-MD/
│
├── assets/             → Project assets
├── data/               → Runtime data
├── json/               → JSON resources
├── lib/                → Core libraries
├── media/              → Media resources
├── plugins/            → Feature modules
│   ├── ai/
│   ├── anime/
│   ├── downloader/
│   ├── games/
│   ├── group/
│   ├── jadibot/
│   ├── maker/
│   ├── owner/
│   └── rpg/
├── sessions/           → WhatsApp auth state
├── config.js           → Configuration
├── handler.js          → Event handling
├── index.js            → Worker launcher
├── main.js             → Runtime core
├── package.json        → Dependencies
└── package-lock.json   → Locked dependencies
```

---

## 🚀 Getting Started

### Clone

```bash
git clone https://github.com/nexacodeid/AMBATUKAM-MD.git
cd AMBATUKAM-MD
```

### Install

```bash
npm install
```

### Start

```bash
npm start
```

<div align="center">

`Node.js 20+` · `npm` · `WhatsApp Account`

</div>

---

## 🎮 Runtime Controls

```text
┌────────────────────────────────────────────┐
│ AMBATUKAM-MD                               │
├────────────────────────────────────────────┤
│ restart   → restart worker                 │
│ reset     → restart / reset worker         │
│ exit      → terminate application          │
└────────────────────────────────────────────┘
```

---

## 🧪 Plugin Development

Plugins are loaded recursively from `plugins/` as ES modules.

```js
export default async function plugin(m, { conn, text }) {
  // plugin logic
}
```

When plugin files change, the runtime can refresh the active plugin set without requiring a complete manual restart.

---

## 💾 Data & Sessions

The main JSON database is stored at:

```text
data/database.json
```

Default data areas include:

```text
users
chats
settings
stats
sticker
menfess
sewa
jadibotNumbers
jadibotOrders
jadibotAccess
```

> Keep `sessions/` private. Never commit WhatsApp authentication state, API keys or other secrets to a public repository.

---

## 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=nexacodeid&show_icons=true&theme=radical&hide_border=true&rank_icon=github&include_all_commits=true" height="180" />
&nbsp;
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=nexacodeid&layout=compact&theme=radical&hide_border=true&langs_count=8" height="180" />

<br><br>

<img src="https://streak-stats.demolab.com?user=nexacodeid&theme=radical&hide_border=true&border_radius=12" width="75%" />

<br><br>

<img src="https://github-profile-trophy.vercel.app/?username=nexacodeid&theme=radical&no-frame=true&no-bg=true&margin-w=8&row=1" width="94%" />

</div>

---

## 📈 Activity

<div align="center">

<img src="https://github-readme-activity-graph.vercel.app/graph?username=nexacodeid&repo=AMBATUKAM-MD&theme=react-dark&hide_border=true&area=true&radius=10" width="96%" />

</div>

---

## 🌈 AMBATUKAM Mode

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=160&section=header&text=AMBATUKAM&fontSize=46&fontColor=ffffff&animation=fadeIn&color=gradient" width="100%" />

<br><br>

<img src="https://media1.tenor.com/m/JPX5iWzkrfQAAAAd/akudama-drive-anime.gif" width="88%" alt="AMBATUKAM anime GIF" />

<br><br>

```text
> system.boot()
> loading plugins.............. OK
> initializing database........ OK
> connecting to whatsapp....... OK
> ambatukam-md................. ONLINE
```

</div>

---

## 🔧 Development

```bash
npm start
npm run format
npm run lint
```

| Command | Description |
|:---|:---|
| `npm start` | Start the bot |
| `npm run format` | Format source files |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Run formatting and lint checks.
5. Test locally.
6. Open a pull request with a clear description.

Keep modules isolated, code readable and secrets out of version control.

---

## 📜 Disclaimer

This project is provided for educational and development purposes. Use automation responsibly and comply with WhatsApp's terms, applicable laws and the rights of other users.

The maintainers are not responsible for misuse, account restrictions, data loss or other consequences resulting from deployment or modification of the software.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=170&section=footer&text=AMBATUKAM-MD&fontSize=38&fontColor=ffffff&animation=fadeIn&color=gradient" width="100%" />

**Node.js · Baileys · Plugins · Modern Runtime**

</div>
