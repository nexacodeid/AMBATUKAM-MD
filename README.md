<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8B5CF6,50:EC4899,100:06B6D4&height=230&section=header&text=AMBATUKAM-MD&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Kawaii%20WhatsApp%20Multi-Device%20Bot&descAlignY=60&descSize=18" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=18&duration=2800&pause=900&color=C084FC&center=true&vCenter=true&width=650&lines=Modern+WhatsApp+Multi-Device+Bot;Plugin-Based+%E2%80%A2+Hot+Reload+%E2%80%A2+SQLite+Session;Built+with+Node.js+%2B+Baileys;Cute+UI%2C+Serious+Code." alt="Typing SVG" />

<br>

<img src="https://img.shields.io/badge/Node.js-ESM-8B5CF6?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Baileys-WhatsApp-EC4899?style=for-the-badge&logo=whatsapp&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-ES2026-06B6D4?style=for-the-badge&logo=javascript&logoColor=white" />
<img src="https://img.shields.io/badge/License-ISC-A78BFA?style=for-the-badge" />

<br><br>

> **A cute-looking bot with a surprisingly serious runtime.**
>
> *Because apparently software can have both architecture and sparkles.*

</div>

---

## ୨୧ About

**AMBATUKAM-MD** is a modular WhatsApp Multi-Device bot built with **Node.js**, **JavaScript ESM**, and **Baileys**.

The project uses a plugin-first architecture with dynamic discovery, hot reload, SQLite-backed authentication, JSON data storage, worker-based execution, and event-driven WhatsApp handling.

<div align="center">

### ૮ ˶ᵔ ᵕ ᵔ˶ ა  **Kawaii on the outside. Modular on the inside.**

</div>

---

## 🌸 Kawaii Anime Gallery

<div align="center">

<img src="https://media1.tenor.com/images/f821cf181eb277c84d461183d713be64/tenor.gif?itemid=8731036" width="210" alt="Kawaii anime girl GIF" />
&nbsp;&nbsp;
<img src="https://media1.tenor.com/images/b9bac6f190cabf3574165538e277c33d/tenor.gif?itemid=12005681" width="210" alt="Dancing anime girl GIF" />
&nbsp;&nbsp;
<img src="https://media.tenor.com/zf41nXpMrjAAAAAe/anime-talk.png" width="210" alt="Pink-haired kawaii anime girl" />

<br><br>

`♡ kawaii` · `♡ anime` · `♡ coding` · `♡ coffee`

</div>

---

## ✦ Features

<table>
<tr>
<td width="50%">

### ♡ Core Runtime

- Multi-Device WhatsApp connection
- Baileys socket integration
- Worker-based launcher
- Automatic worker restart handling
- Keep-alive & retry configuration
- Full history synchronization
- High-quality link previews

</td>
<td width="50%">

### ♡ Developer System

- Modular plugin architecture
- Recursive plugin discovery
- Plugin hot reload
- Dynamic ESM imports
- SQLite session state
- JSON database persistence
- Terminal runtime controls

</td>
</tr>
</table>

---

## 🎀 Plugin Universe

The bot currently organizes its plugins into a collection of dedicated modules:

<div align="center">

| ♡ | Category | ♡ | Category |
|:---:|:---|:---:|:---|
| ✦ | `ai` | ✦ | `anime` |
| ✦ | `bypass` | ✦ | `command` |
| ✦ | `core` | ✦ | `downloader` |
| ✦ | `fun` | ✦ | `games` |
| ✦ | `group` | ✦ | `info` |
| ✦ | `internet` | ✦ | `jadibot` |
| ✦ | `main` | ✦ | `maker` |
| ✦ | `owner` | ✦ | `rpg` |

</div>

> Plugin behavior and names can evolve as the project grows.

---

## 🌸 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,js,sqlite,npm,git,github&theme=dark" />

<br><br>

| Technology | Purpose |
|:---|:---|
| **Node.js** | Runtime environment |
| **JavaScript / ESM** | Application architecture |
| **Baileys** | WhatsApp Multi-Device layer |
| **better-sqlite3** | SQLite support |
| **Pino** | Logging |
| **Chalk** | Terminal styling |
| **Sharp** | Image processing |
| **Cheerio** | HTML parsing |
| **Axios / Fetch** | HTTP requests |
| **FFmpeg** | Media processing |
| **QRCode** | QR utilities |
| **Prettier** | Code formatting |
| **ESLint** | Code quality |

</div>

---

## 🐰 Architecture

<div align="center">

```text
                    ╭──────────────────────╮
                    │      index.js        │
                    │    Process Launcher   │
                    ╰──────────┬───────────╯
                               │
                               ▼
                    ╭──────────────────────╮
                    │      Worker Thread   │
                    ╰──────────┬───────────╯
                               │
                               ▼
                    ╭──────────────────────╮
                    │       main.js        │
                    │    Bot Runtime Core  │
                    ╰──────┬─────┬─────────╯
                           │     │
              ┌────────────┘     └────────────┐
              ▼                               ▼
       ╭──────────────╮                ╭──────────────╮
       │   Baileys    │                │   Database   │
       │ WhatsApp MD  │                │ JSON + SQLite│
       ╰──────┬───────╯                ╰──────────────╯
              │
              ▼
       ╭──────────────╮
       │  handler.js  │
       │ Events/Input │
       ╰──────┬───────╯
              │
              ▼
       ╭──────────────╮
       │   plugins/   │
       │ Dynamic Load │
       │  + Hot Reload│
       ╰──────────────╯
```

</div>

---

## 🍥 Project Structure

```text
AMBATUKAM-MD/
│
├── assets/             → Project assets
├── data/               → Runtime database data
├── json/               → JSON resources
├── lib/                → Core libraries & helpers
├── media/              → Media resources
├── plugins/            → Bot plugin universe
│   ├── ai/
│   ├── anime/
│   ├── downloader/
│   ├── games/
│   ├── group/
│   ├── jadibot/
│   ├── maker/
│   ├── owner/
│   └── rpg/
├── sessions/           → WhatsApp authentication state
├── config.js           → Runtime configuration
├── handler.js          → Message & event handling
├── index.js            → Worker launcher
├── main.js             → Main runtime
├── package.json        → Dependencies & scripts
├── package-lock.json   → Locked dependency tree
├── CL8QHRYN.ttf        → Font resource
└── raizell.ttf         → Font resource
```

---

## 🧸 Installation

### 01 · Clone

```bash
git clone https://github.com/nexacodeid/AMBATUKAM-MD.git
cd AMBATUKAM-MD
```

### 02 · Install

```bash
npm install
```

### 03 · Run

```bash
npm start
```

<div align="center">

`Node.js 20+` · `npm` · `WhatsApp Account`

</div>

---

## 💜 Runtime Controls

```text
┌──────────────────────────────────────────┐
│  AMBATUKAM-MD :: terminal controls       │
├──────────────────────────────────────────┤
│  restart   → restart worker              │
│  reset     → restart / reset worker      │
│  exit      → terminate application       │
└──────────────────────────────────────────┘
```

---

## 🎐 Plugin Development

Plugins are discovered recursively from `plugins/` and dynamically loaded as ES modules.

A simplified plugin can look like:

```js
export default async function plugin(m, { conn, text }) {
  // your plugin logic
}
```

The existing plugins remain the source of truth for the exact message context and helper APIs available in the project.

When JavaScript plugin files change, the runtime can rebuild the active plugin set without requiring a full manual restart.

---

## 🌙 Data & Sessions

The runtime maintains its JSON database at:

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

### ⚠ Session Warning

Never publish real WhatsApp session credentials, private API keys, or other secrets to a public repository.

The `sessions/` directory contains authentication state and should be handled carefully in development and deployment.

---

## 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=nexacodeid&show_icons=true&theme=tokyonight&hide_border=true&rank_icon=github&include_all_commits=true" height="180" />

<br><br>

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=nexacodeid&layout=compact&theme=tokyonight&hide_border=true&langs_count=8" height="180" />

<br><br>

<img src="https://streak-stats.demolab.com?user=nexacodeid&theme=tokyonight&hide_border=true&border_radius=12" width="72%" />

<br><br>

<img src="https://github-profile-trophy.vercel.app/?username=nexacodeid&theme=tokyonight&no-frame=true&no-bg=true&margin-w=8&row=1" width="92%" />

</div>

---

## 📈 Activity

<div align="center">

<img src="https://github-readme-activity-graph.vercel.app/graph?username=nexacodeid&repo=AMBATUKAM-MD&theme=react-dark&hide_border=true&area=true&radius=10" width="96%" />

</div>

---

## 🎀 Anime Showcase

<div align="center">

<img src="https://media.tenor.com/zf41nXpMrjAAAAAe/anime-talk.png" width="150" alt="Pink-haired anime girl" />

**かわいいコード、ちゃんと動く。**

<img src="https://media1.tenor.com/images/b9bac6f190cabf3574165538e277c33d/tenor.gif?itemid=12005681" width="170" alt="Anime dance GIF" />
<img src="https://media1.tenor.com/images/f821cf181eb277c84d461183d713be64/tenor.gif?itemid=8731036" width="170" alt="Kawaii anime GIF" />

<br><br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:EC4899,50:8B5CF6,100:06B6D4&height=90&text=PLUGIN%20SYSTEM&fontSize=28&fontColor=ffffff&animation=fadeIn" width="88%" />

</div>

---

## 🛠 Development

```bash
npm start
npm run format
npm run lint
```

| Command | Action |
|:---|:---|
| `npm start` | Start the bot |
| `npm run format` | Format with Prettier |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run formatting and lint checks.
5. Test locally.
6. Open a pull request with a clear description.

Keep plugins modular and never commit secrets, session credentials, generated runtime data, or unnecessary binaries.

---

## 📜 Disclaimer

This project is provided for educational and development purposes. Use automation responsibly and comply with WhatsApp's terms, applicable laws, and the rights of other users.

The maintainers are not responsible for misuse, account restrictions, data loss, or other consequences resulting from deployment or modification of the software.

---

<div align="center">

### ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა  AMBATUKAM-MD

**Built with Node.js · Baileys · Plugins · questionable amounts of coffee**

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,50:8B5CF6,100:EC4899&height=150&section=footer&animation=fadeIn" width="100%" />

</div>
