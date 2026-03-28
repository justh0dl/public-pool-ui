# Custom themed version of Public Pool UI

## Features
- Quantum Sniper Pool Branding
- Black & gold / white themes
- More pool stats on splash
- Chart adjusted on worker monitoring
- LAN-accessible UI
- Systemd service support *(not fully tested)*
- Can run alongside the normal Public Pool UI

---

Does not affect pool/mining in any way whatsoever as it's just a UI.

**Default URL:** http://localhost:4201/#/

👉 I recommend installing and confirming the original Public Pool UI works on  
http://localhost:4200 before using this (this was vibe coded with ChatGPT)

---

## How to Run the Custom Public Pool UI (Local Setup)

### 📋 Requirements
Before starting, make sure you have:

- Node.js (version 18 or newer recommended)
- npm (comes with Node)

---

### 📦 Step 1: Download the UI

    git clone https://github.com/justh0dl/public-pool-ui.git
    cd custom-public-pool-ui

---

### 📥 Step 2: Install Dependencies

    npm install

---

### ▶️ Step 3: Start the UI

    npm start

---

### 🌐 Step 4: Open in Browser

Go to:

    http://localhost:4201

---

## ⚙️ Important Notes

### 🔌 Backend Requirement (VERY IMPORTANT)

This UI connects to the Public Pool backend API at:

    127.0.0.1:3334

👉 You MUST already have the original Public Pool UI running on your machine.

If your original Public Pool UI works, then you're good.

---

### 🔁 Running Both UIs

You can run both at the same time:

- Original UI → http://localhost:4200  
- Custom UI → http://localhost:4201  

---

### ⚠️ If the UI Shows No Data

Check that:

- Your pool backend is running  
- Port 3334 is active  
- Your miner is connected  

---

## 🛠️ Troubleshooting

### ❌ Port already in use

If 4201 is busy:

    ng serve --port 4202

---

### ❌ Node version issues

Check your version:

    node -v

If it's below 18, update Node.js.

---

### ❌ Cannot connect to API

Make sure:

- Public Pool is running  
- API is accessible at 127.0.0.1:3334  

---

## 💡 Tip

This is a custom frontend only.  
It does NOT modify your mining backend or pool logic.
