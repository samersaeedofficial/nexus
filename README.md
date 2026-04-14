# ⚡ NEXUS EVIL TWIN
> **Industrial-Grade Automated Rogue AP Deployment & Intelligence Suite.**

[![Version](https://img.shields.io/badge/Version-2.0.0--Stable-cyan.svg?style=for-the-badge)]()
[![OS](https://img.shields.io/badge/OS-Kali--Linux-red.svg?style=for-the-badge)]()
[![Platform](https://img.shields.io/badge/Platform-Node.js%20%26%20Bash-green.svg?style=for-the-badge)]()

---

## 💎 Overview
**Nexus Evil Twin** is an advanced, "one-command" tactical suite that bridges the gap between modern full-stack web technologies and low-level Linux networking. Designed for penetration testers and security researchers, it automates the deployment of sophisticated captive portals and provides a streamlined interface for real-time network monitoring and intelligence gathering.

---

## 🔥 Key Features
* **🚀 Full Auto-Build System:** Automatically generates a production-ready build from the React source using an integrated pipeline.
* **📊 Live Terminal Dashboard:** High-fidelity tracking of connected devices and real-time credential exfiltration.
* **🎨 Premium Captive Portal:** A modern, high-conversion UI built with **React**, **Framer Motion**, and **Tailwind CSS**.
* **🛠️ System-Wide Integration:** Installs as a global binary, allowing you to trigger the `nexus` command from any terminal path.
* **💉 Automated Routing:** Seamless traffic hijacking via pre-configured `iptables` and DNS redirection.

---

## 📂 Project Structure
```text
├── Source/                   # Core Application Source
│   ├── src/                  # React Frontend (Vite)
│   ├── server.js             # Express.js Backend Logic
│   └── package.json          # Dependency Management
├── nexus_wifi_app.sh         # The "Brain" (Master Automation Script)
├── dist/                     # Production Build Output (Auto-generated)
└── captured_data.log         # Secure Logs for Captured Intelligence

Fully Automated Setup

You no longer need to manually install Node modules, build the frontend, or manage separate terminals. The master bash script handles everything automatically, ensuring a clean and production-ready environment (optimized for systems like Kali Linux).

### Prerequisites

- A Linux environment (Root privileges required)
- An active internet connection for the initial setup
- A compatible wireless network adapter

### 1-Click Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/samersaeedofficial/nexus.git](https://github.com/samersaeedofficial/nexus.git)

2. **Installation Process:**
   ```bash
   cd nexus
   sudo ./nexus_wifi_app.sh install

3. **Run App:**
   ```bash
   nexus
