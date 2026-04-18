<div align="center">

# 🔒 CipherStack

### Visual Cascade Encryption Pipeline Builder

*Drag. Chain. Encrypt. — A node-based cryptographic workbench that lets you visually compose multi-layer encryption pipelines in real-time.*

[![Local-First](https://img.shields.io/badge/Execution-Local%20Only-10b981?style=flat-square)](#-privacy--security)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero-10b981?style=flat-square)](#-privacy--security)
[![Ciphers](https://img.shields.io/badge/Algorithms-6%20Built--In-8b5cf6?style=flat-square)](#-supported-ciphers)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)](#license)

---

</div>

## 🎯 What is CipherStack?

**CipherStack** is a fully local, zero-dependency cryptographic workbench that allows users to build, visualize, and execute multi-stage encryption pipelines using a drag-and-drop node-based interface. Instead of encrypting text with a single algorithm, CipherStack lets you **chain multiple classical ciphers together** — transforming your plaintext through a cascade of operations, each feeding its output into the next.

Think of it as a **visual programming environment for encryption**: each node represents a cipher algorithm with configurable parameters, and the pipeline flows top-to-bottom through every node sequentially.

> **Example:** `Plaintext → Caesar (shift 13) → Base64 → Vigenère (key: VYRO) → XOR (key: hack) → Ciphertext`

---

## ✨ Key Features

### 🔗 Visual Pipeline Builder
- **Drag-and-drop** cipher nodes onto a vertical canvas
- **Reorder** nodes via drag handles to change encryption sequence
- **Duplicate** or **delete** nodes with single-click actions
- **Animated connectors** between nodes show data flow with traveling dot particles
- **Character count badges** on connectors display intermediate data sizes

### 🔄 Bidirectional Encryption Engine
- **Encrypt** mode processes nodes top → bottom
- **Decrypt** mode **automatically reverses** the pipeline (bottom → top) and applies each cipher's inverse function
- Full **round-trip integrity**: `Encrypt(x) → Decrypt(result) = x`

### 🔁 Multi-Pass Chaining
- Re-encrypt the output through the entire pipeline **up to 10 times**
- Configurable via an intuitive `−` / `+` stepper UI
- Useful for studying how cascading passes exponentially increase cipher complexity

### 📊 Byte-Level Visual Diff
- Every cipher node displays a **side-by-side INPUT / OUTPUT** comparison
- Characters that have been **mutated** by the cipher are highlighted in **cyan** (`#22d3ee`)
- Unchanged characters remain muted — making it instantly visible *where* each algorithm affects the data

### 💾 Pipeline Export / Import (JSON Serialization)
- **Export** your current pipeline configuration as a downloadable `.json` file
- **Import** previously saved pipelines to instantly reconstruct complex chains
- Toast notifications confirm successful import or report errors
- Pipeline files are human-readable and version-stamped

### ℹ️ Interactive Cipher Descriptions
- Each cipher node has a hoverable **info icon** (ℹ) in its header
- Hovering reveals a **glassmorphism tooltip** with a detailed, academic-level explanation of how the algorithm works
- Helps users understand the cryptographic principles behind each transformation

### ⚡ Pipeline Presets
- **Classic Stack**: Caesar → XOR → Vigenère (3 nodes)
- **Maximum Chaos**: Caesar → Rail Fence → Columnar → XOR → Vigenère (5 nodes)
- **Minimal Trio**: Base64 → Caesar → XOR (3 nodes)
- One-click loading with automatic pipeline reset

### 🏛️ Engine Architecture Modal
- A `?` button in the bottom-left corner opens a modal explaining the **decoupled, pure-function engine architecture**
- Documents how new ciphers can be added with **zero UI rewrites** — just export `encrypt`/`decrypt` functions
- Demonstrates professional-grade modularity to evaluators

### 🎨 Premium Dark UI
- **Glassmorphism** and **backdrop blur** effects throughout
- Custom **radial gradient** canvas ambience (subtle purple)
- **Micro-animations**: node enter transitions, button press scaling, traveling connector dots, typewriter output effect
- **Monospace code fonts** for all data displays
- Custom scrollbars, recessed I/O panels, accent-colored node headers

---

## 🔐 Supported Ciphers

| Cipher | Type | Key/Config | Description |
|--------|------|-----------|-------------|
| **Caesar** | Substitution | Shift amount (−25 to 25) | Each letter is shifted by a fixed position in the alphabet. Simple but foundational in cryptographic history. |
| **XOR** | Bitwise | Text key | Performs bitwise EXCLUSIVE OR between plaintext bytes and a repeating key. Crucial in modern stream ciphers for masking data. |
| **Vigenère** | Polyalphabetic | Keyword | Encrypts alphabetic text using a series of interwoven Caesar ciphers based on the letters of a keyword. |
| **Rail Fence** | Transposition | Number of rails (2–10) | Writes the message in a zigzag pattern on virtual "rails" and reads off each rail sequentially. |
| **Columnar** | Transposition | Keyword | Text is written in rows of a fixed width and read column-by-column in an order derived from a keyword. |
| **Base64** | Encoding | None | Represents binary data in an ASCII string format. Essential for transmitting data over text-only mediums. |

---

## 🛡️ Privacy & Security

CipherStack is designed with a **local-first, zero-trust** philosophy:

- ✅ **All cryptographic operations run entirely in your browser** — nothing is sent to any server
- ✅ **Zero telemetry** — no analytics, no tracking, no external requests
- ✅ **No API keys required** — works completely offline after initial page load
- ✅ **No dependencies on external crypto libraries** — all algorithms are implemented as pure JavaScript functions
- ✅ A trust badge in the navbar permanently displays: `Local Execution Only | Zero Telemetry`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/ibrahimalee/vyro_hackathon.git
cd vyro_hackathon

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

```bash
npm run build    # Outputs to ./dist
npm run preview  # Preview the production build locally
```

---

## 🏗️ Architecture

```
src/
├── App.jsx                  # Root orchestrator — state, pipeline execution, modal
├── main.jsx                 # SPA entry point
├── styles.css               # Global styles, animations, scrollbars
├── components/
│   ├── Navbar.jsx           # Top bar — node count, import/export, telemetry badge
│   ├── Sidebar.jsx          # Cipher library panel — click to add nodes
│   ├── PipelineCanvas.jsx   # Drag-and-drop canvas with DnD Kit
│   ├── CipherNode.jsx       # Individual cipher node — config, I/O diff, tooltips
│   ├── Connector.jsx        # Animated vertical connectors between nodes
│   └── IOPanel.jsx          # Input/output panel — run, presets, multi-pass, copy
├── hooks/
│   └── useTypewriter.js     # Character-by-character output reveal animation
└── lib/
    ├── ciphers.js           # Pure-function cipher implementations (6 algorithms)
    ├── pipeline.js          # Pipeline execution engine with error boundaries
    └── utils.js             # UUID generator, text truncation
```

### Design Principles

1. **Decoupled Engine**: Every cipher is a pure function (`encrypt(text, config) → string`). The UI knows nothing about algorithm internals.

2. **Zero UI Rewrites**: Adding a new cipher requires only:
   - Exporting `encrypt`/`decrypt` functions in `ciphers.js`
   - Adding a config schema entry to the cipher registry
   - The UI, canvas, pipeline engine, and reverse-traversal logic automatically adopt it.

3. **Error Boundaries**: Each node is wrapped in a try/catch. If a cipher fails mid-pipeline (e.g., invalid Base64 during decrypt), the engine halts gracefully, marks the failing node with a red error state (`ERR_PIPELINE_FAULT`), and preserves all successful results.

4. **Reactive State Flow**: All state lives in `App.jsx` and flows downward via props. Pipeline results are keyed by node ID for O(1) lookups. Any change to nodes or config automatically clears stale results.

---

## 🖥️ How It Works

### Encryption Flow
```
User Input → Node 1 (encrypt) → Node 2 (encrypt) → ... → Node N (encrypt) → Final Output
```

### Decryption Flow (Automatic Reversal)
```
Ciphertext → Node N (decrypt) → ... → Node 2 (decrypt) → Node 1 (decrypt) → Original Plaintext
```

### Multi-Pass Flow (e.g., 3×)
```
Pass 1: Input → [Pipeline] → Output₁
Pass 2: Output₁ → [Pipeline] → Output₂
Pass 3: Output₂ → [Pipeline] → Final Output
```

---

## 🎬 UI Walkthrough

| Area | What It Does |
|------|-------------|
| **Left Sidebar** | Browse the Cipher Library. Click any cipher to append it to your pipeline. Each entry shows its name, icon, and description. |
| **Center Canvas** | Your pipeline. Drag nodes to reorder. Each node shows its config inputs, and after running, displays a side-by-side I/O diff. Animated connectors show data flow. |
| **Right Panel** | Enter plaintext, toggle Encrypt/Decrypt mode, set multi-pass count (1–10×), run the pipeline, view the final output with typewriter animation, copy to clipboard, or load presets. |
| **Top Navbar** | Shows pipeline readiness status, Import/Export buttons, and the Zero Telemetry trust badge. |
| **Bottom-Left `?`** | Opens the Engine Architecture modal explaining the pure-function design. |

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based UI framework |
| **Vite 7** | Lightning-fast dev server and build tool |
| **Tailwind CSS 4** | Utility-first styling |
| **@dnd-kit** | Accessible drag-and-drop toolkit for node reordering |
| **Lucide React** | Minimal, consistent icon library |
| **Sonner** | Elegant toast notification system |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy!

The included `vercel.json` handles SPA routing automatically.

### Other Platforms

CipherStack builds to a static `dist/` folder. It can be hosted on **any** static file server:
- Netlify, GitHub Pages, Cloudflare Pages, Firebase Hosting, etc.

---

## 🤝 Adding a New Cipher

CipherStack's modular architecture makes it trivial to extend. Here's how to add a new cipher in **under 2 minutes**:

**Step 1:** Add your encrypt/decrypt functions to `src/lib/ciphers.js`:

```javascript
function myEncrypt(text, config) {
  // Your encryption logic here
  return encryptedString;
}

function myDecrypt(text, config) {
  // Your decryption logic here
  return decryptedString;
}
```

**Step 2:** Register it in the `ciphers` object:

```javascript
export const ciphers = {
  // ... existing ciphers
  myCipher: {
    label: "My Cipher",
    description: "A brief explanation of what this cipher does.",
    icon: "KeyRound",          // Any Lucide icon name
    color: "#ff6b6b",          // Accent color for the node header
    defaultConfig: { key: "default" },
    encrypt: myEncrypt,
    decrypt: myDecrypt,
    preview: (c) => `key: ${c.key}`,
  },
};
```

**Step 3:** Add it to the render order:

```javascript
export const cipherOrder = [..., "myCipher"];
```

**That's it.** The sidebar, canvas, pipeline engine, drag-and-drop, I/O diff, export/import, and reverse-traversal all work automatically.

---

## 📄 License

MIT License — free for personal and commercial use.

---

<div align="center">

**Built for [Vyrothon 2026](https://vyrothon.com)** · Made with 🔐 by Ibrahim Ali

</div>
