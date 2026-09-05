<div align="center">

# AMBATUKAM-MD

### Modern WhatsApp Multi-Device Bot built with Node.js & Baileys

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=180&section=header&text=AMBATUKAM-MD&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35" width="100%" />

<p>
  <b>Plugin-based</b> · <b>Multi-Device</b> · <b>SQLite Session</b> · <b>Hot Reload</b>
</p>

<p>
  <img src="https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/WhatsApp-Baileys-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES2026-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/License-ISC-7C3AED?style=for-the-badge" />
</p>

<p>
  <a href="#-features">Features</a> ·
  <a href="#-installation">Installation</a> ·
  <a href="#-project-structure">Structure</a> ·
  <a href="#-development">Development</a>
</p>

</div>

---

## About

**AMBATUKAM-MD** is a JavaScript-based WhatsApp Multi-Device bot designed around a modular plugin architecture. The project uses **Baileys** for the WhatsApp connection layer and separates the runtime, handler, database, session management, and plugins into dedicated modules.

The project is configured as an **ES Module** application and can be started directly with Node.js.

> This README describes the repository structure and capabilities visible in the source. No imaginary feature list invented by an AI was harmed in the making of this documentation.

---

## Features

### Core

- WhatsApp Multi-Device connection through Baileys
- Plugin-based command architecture
- Automatic plugin discovery from `plugins/`
- Plugin hot reload when JavaScript plugin files change
- Worker-based application launcher
- Automatic worker restart handling
- Runtime command input through the terminal
- SQLite-backed authentication/session state
- JSON database storage
- Automatic database save scheduling
- Group participant event handling
- Message event handling
- Group update handling
- Delete-message event handling
- High-quality link previews
- Full history synchronization support
- Connection retry and keep-alive configuration

### Plugin Categories

The repository currently organizes plugins into categories including:

| Category | Purpose |
|---|---|
| `ai` | AI-related commands |
| `anime` | Anime-related commands |
| `bypass` | Bypass utilities |
| `command` | Command utilities |
| `core` | Core bot functionality |
| `downloader` | Downloader functionality |
| `fun` | Fun commands |
| `games` | Games |
| `group` | Group management |
| `info` | Information commands |
| `internet` | Internet utilities |
| `jadibot` | Jadibot functionality |
| `main` | Main bot commands |
| `maker` | Content maker utilities |
| `owner` | Owner-level commands |
| `rpg` | RPG functionality |

Plugin names and behavior may change as development continues.

---

## Tech Stack

| Technology | Role |
|---|---|
| **Node.js** | Runtime |
| **JavaScript / ESM** | Application code |
| **Baileys** | WhatsApp Multi-Device layer |
| **better-sqlite3** | SQLite support |
| **Pino** | Logging |
| **Chalk** | Terminal output styling |
| **Sharp** | Image processing |
| **Cheerio** | HTML parsing |
| **Axios / Fetch** | HTTP requests |
| **FFmpeg** | Media processing |
| **QRCode** | QR utilities |
| **Prettier** | Formatting |
| **ESLint** | Linting |

---

## Project Structure

```text
AMBATUKAM-MD/
├── assets/             # Project assets
├── data/               # Runtime database data
├── json/               # JSON resources
├── lib/                # Core libraries and helpers
├── media/              # Media resources
├── plugins/            # Bot plugins grouped by category
├── sessions/           # WhatsApp authentication/session data
├── config.js           # Runtime configuration
├── handler.js          # Message and event handling
├── index.js            # Worker launcher / process manager
├── main.js             # Main bot runtime
├── package.json        # Dependencies and scripts
├── package-lock.json   # Locked dependency tree
├── CL8QHRYN.ttf        # Font resource
└── raizell.ttf         # Font resource
```

### Runtime Flow

```text
index.js
   │
   ▼
Worker → main.js
   │
   ├── config.js
   ├── SQLite session
   ├── Database
   ├── Baileys socket
   ├── handler.js
   │      ├── messages
   │      ├── group participants
   │      ├── group updates
   │      └── delete updates
   │
   └── plugins/
          └── dynamic loader + hot reload
```

---

## Installation

### Requirements

- Node.js **20+ recommended**
- npm
- A working internet connection
- A WhatsApp account for the bot session

### Clone

```bash
git clone https://github.com/nexacodeid/AMBATUKAM-MD.git
cd AMBATUKAM-MD
```

### Install dependencies

```bash
npm install
```

### Start

```bash
npm start
```

The project starts through `index.js`, which launches `main.js` inside a Worker.

---

## Configuration

Runtime configuration is handled through `config.js` and environment/runtime values used by the project.

Before running the bot in production, review:

```text
config.js
sessions/
data/
```

Do **not** publish authentication/session credentials, private API keys, or other secrets to a public repository.

---

## Terminal Controls

The launcher accepts simple terminal input while running:

```text
restart
reset
exit
```

`restart` and `reset` restart the worker, while `exit` terminates the application.

---

## Plugin Development

Plugins are automatically discovered from the `plugins/` directory and nested folders.

A plugin can export a function or an object exposing an `all` function. The loader records the plugin filename and rebuilds the active plugin map when plugins are loaded again.

When a plugin JavaScript file changes, the runtime can automatically reload the plugin set without requiring a full manual process restart.

A simplified plugin shape is:

```js
export default async function plugin(m, { conn, text }) {
  // your plugin logic
}
```

Use the existing plugins as the source of truth for the exact message and context APIs available in this project.

---

## Database

The runtime initializes a JSON database at:

```text
data/database.json
```

The default data model includes areas for:

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

Database writes are scheduled and written through a temporary file before being renamed into place, reducing the chance of leaving a partially written database file.

---

## Session Safety

The repository contains a `sessions/` directory because the bot stores authentication state locally.

**Never upload real session credentials to a public repository.** If session files are already tracked, remove them from Git history as appropriate and add the relevant paths to `.gitignore` before deploying the repository publicly.

---

## Development Scripts

```bash
npm start
npm run format
npm run lint
```

| Script | Action |
|---|---|
| `npm start` | Start the bot |
| `npm run format` | Format the project with Prettier |
| `npm run lint` | Run ESLint |

---

## Visual Preview

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=PLUGIN%20SYSTEM&fontSize=30&fontColor=ffffff&animation=fadeIn" width="90%" />

<br><br>

<img src="https://github-readme-activity-graph.vercel.app/graph?username=nexacodeid&repo=AMBATUKAM-MD&theme=react-dark&hide_border=true" width="95%" />

</div>

---

## Repository Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=nexacodeid&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" height="170" />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=nexacodeid&repo=AMBATUKAM-MD&layout=compact&theme=tokyonight&hide_border=true" height="170" />

<br><br>

<img src="https://streak-stats.demolab.com?user=nexacodeid&theme=tokyonight&hide_border=true" width="70%" />

</div>

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run formatting and lint checks.
5. Test the bot locally.
6. Open a pull request with a clear description.

Keep plugins modular and avoid committing secrets, authentication sessions, generated runtime data, or unnecessary binaries.

---

## Disclaimer

This project is provided for educational and development purposes. Use automation responsibly and comply with WhatsApp's terms, applicable laws, and the rights of other users.

The maintainers are not responsible for misuse, account restrictions, data loss, or other consequences resulting from deployment or modification of the software.

---

## License

This project is released under the **ISC License** as declared in `package.json`.

---

<div align="center">

### AMBATUKAM-MD

Built with JavaScript, Baileys, and an unreasonable amount of plugins.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=footer&animation=fadeIn" width="100%" />

</div>
