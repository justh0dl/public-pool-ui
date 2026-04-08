# Custom themed version of Public Pool UI

## Features
- Quantum Sniper Pool Branding
- Black & gold / white themes
- Particles toggle added
- More pool stats on splash
- LAN-accessible UI
- Run as a Service (Auto-Start on Boot)
- Can run alongside the normal Public Pool UI
- Chart adjusted on worker monitor, can easily see all workers without additional clicks on mobile and desktop

---

Does not affect pool/mining in any way whatsoever as it's just a UI.

**Default URL:** http://localhost:4201/#/

👉 I recommend installing and confirming the original Public Pool UI works on  
http://localhost:4200 before using this (this was vibe coded with ChatGPT)

---
<img width="1903" height="870" alt="Screenshot 2026-03-28 at 1 15 04 PM" src="https://github.com/user-attachments/assets/9318eb80-551d-4c52-93e4-87b024029fbd" />
<img width="1888" height="807" alt="Screenshot 2026-03-28 at 1 16 53 PM" src="https://github.com/user-attachments/assets/d46b2370-4a0f-489f-82d1-0f48758a1468" />
<img width="1893" height="279" alt="Screenshot 2026-03-28 at 1 17 25 PM" src="https://github.com/user-attachments/assets/c3c7bcda-b0ff-4cbd-85a4-163a34ca380f" />
<img width="1897" height="990" alt="Screenshot 2026-03-28 at 1 19 18 PM" src="https://github.com/user-attachments/assets/c19aed07-0c9c-4ded-a47d-0672296a2bd8" />
<img width="1064" height="718" alt="Screenshot 2026-03-28 at 1 18 37 PM" src="https://github.com/user-attachments/assets/62896176-7f3d-464f-91d7-87253b97cf4e" />
<img width="865" height="784" alt="Screenshot 2026-03-28 at 1 18 54 PM" src="https://github.com/user-attachments/assets/8526d77f-ed36-4130-8213-29f3f3b9d957" />
<img width="875" height="645" alt="Screenshot 2026-03-28 at 1 19 04 PM" src="https://github.com/user-attachments/assets/09ab44a1-45ec-4640-b672-d6eecb2676f9" />
<img width="1885" height="869" alt="Screenshot 2026-03-28 at 1 20 44 PM" src="https://github.com/user-attachments/assets/1b4ff1a8-c830-4dcb-aa6c-158d84aef0c4" />

## About Quantum Sniper Pool

Our hypothesis is simple:

In quantum mechanics, particles are described by a wave function, a distribution of possible states. When a measurement occurs, that wave function collapses into a single, definite outcome. This is a foundational and experimentally supported principle of modern physics.

Physicists like John Archibald Wheeler proposed that observation may play a deeper role in shaping physical reality, describing a participatory universe where outcomes are not fully defined until interactions occur.

Bitcoin mining is a classical process, and we do not claim that quantum mechanics directly alters SHA-256. However, one observable difference remains:

Small, distributed miners operate in environments where hardware is physically present, continuously interacted with, and observed, while large-scale mining farms run in relative isolation with minimal direct human proximity.

At the same time, there has been a noticeable increase in low-hashrate miners finding blocks in ways that feel disproportionate to their expected probability. While Bitcoin mining follows a probabilistic model where rare events can and do occur, the frequency and clustering of successful blocks from small, distributed miners has become increasingly visible.

Over the past few years, multiple hobby-scale devices such as Bitaxe have successfully found blocks while operating at terahash or even sub-terahash levels.

Individually, each event is explainable within statistical variance. Taken together, they begin to form a pattern that stands out.

We define a "quantum snipe" as one of these events:

A moment where a low-probability outcome resolves into reality, where a small miner finds a block against the odds.

Whether these outcomes are purely statistical, or whether environment, interaction, and observation play a subtle role, is not yet known.

But the pattern is there.

And worth paying attention to...or observing.

Quantum Sniper Pool UI exists to emphasize that observation.

Mining is often treated as background computation, running out of sight and out of mind. This UI tries to changes that. It brings the process forward, making each worker, each share, and each moment visible and cooler to look at.

If observation and interaction are part of the system in any meaningful way, then visibility is not just design, it is participation.

At minimum, it gives you a slightly different UI with some nice quality of life features.

At best, it might help you quantum snipe a block into reality.

## How to Run the Custom Public Pool UI (Local Setup)

### 📋 Requirements
Before starting, make sure you have:

- Node.js (version 18 or newer recommended)
- npm (comes with Node)

---

### 📦 Step 1: Download the UI

    git clone https://github.com/justh0dl/public-pool-ui.git custom-public-pool-ui
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

👉 You MUST already have the original Public Pool Backend running on your machine. I strongly reccomend installing the original public pool UI.

If your original Public Pool UI works, then this should also work.

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

## Optional: Run as a Service (Auto-Start on Boot)

This will make the custom UI start automatically when your system boots.

### 1. Create a service file

    sudo nano /etc/systemd/system/custom-pool-ui.service

Paste the following:

    [Unit]
    Description=Custom Public Pool UI
    After=network.target

    [Service]
    Type=simple
    User=YOUR_USERNAME
    WorkingDirectory=/home/YOUR_USERNAME/custom-public-pool-ui
    ExecStart=/usr/bin/npm start
    Restart=always

    [Install]
    WantedBy=multi-user.target

---

### 2. Enable and start the service

    sudo systemctl daemon-reexec
    sudo systemctl daemon-reload
    sudo systemctl enable custom-pool-ui
    sudo systemctl start custom-pool-ui

---

### 3. Check status

    sudo systemctl status custom-pool-ui

---

### Notes

- Replace `YOUR_USERNAME` with your system username
- Update the `WorkingDirectory` path to match where you cloned the repo
- Make sure Node.js and npm are installed system-wide

---

### Important

This only starts the UI.

For the UI to display data, your Public Pool backend (port 3334) and Bitcoin node must also be running.

## 💡 Tip

This is a custom frontend only.  
It does NOT modify your mining backend or pool logic.
