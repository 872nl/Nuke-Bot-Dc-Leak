<div align="center">

# 🤖 Raid Tool By Butizada

Discord Raid Bot made with Node.js.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)

</div>

---

## 📦 Installation

```bash
git clone https://github.com/tu-usuario/Raid-Tool-By-Butizada
cd Raid-Tool-By-Butizada
npm install
npm install discord.js
node .
```

---

## 💻 Commands

```text
.help / .h            → Shows all commands

.nuke                 → Full server nuke (deletes everything, creates 100 channels, spams)
.bypass               → Renames the whole server and spams with webhooks

.kickall              → Kicks all members
.banall               → Bans all members
.banbots              → Bans all bots
.massnick             → Changes every member's nickname

.deleteall            → Deletes all channels
.createall            → Creates 100 text channels
.rename <name>        → Renames all channels

.admin                → Gives you the Raid Admin role
.eadmin               → Gives admin to everyone
```

---

## ⚙️ How It Works

```text
The bot connects to a Discord server with administrator permissions
and exposes a set of commands that execute massive actions in seconds.

Uses Node's native fetch to hit the Discord API directly for bulk
operations, with automatic retries on rate limits (429).

Every command has a 60 second cooldown per user, except .help.

Runs an internal HTTP server on port 1111 (or process.env.PORT)
to keep the process alive on hosting platforms.
```

---

## 📚 Dependencies

```bash
discord.js
```

Requires **Node.js 18+** (for native `fetch`).

---

## ⚠️ Warning

```text
This project is for educational purposes only.

This bot performs destructive and irreversible actions.

Using raid bots violates Discord's Terms of Service.
Use it at your own responsibility.
```

---

<div align="center">

Made with ❤️ by **Butizada**

</div>
