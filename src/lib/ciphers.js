// All cipher algorithms. Each cipher exports encrypt/decrypt/defaultConfig/label/description/icon name.

// ---------- Caesar ----------
function caesarShift(text, shift) {
  const s = ((shift % 26) + 26) % 26;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 65 && c <= 90) out += String.fromCharCode(((c - 65 + s) % 26) + 65);
    else if (c >= 97 && c <= 122) out += String.fromCharCode(((c - 97 + s) % 26) + 97);
    else out += text[i];
  }
  return out;
}

// ---------- XOR ----------
const enc = new TextEncoder();
const dec = new TextDecoder();

function xorEncrypt(text, config) {
  const key = config.key || "";
  if (!key) throw new Error("Key required");
  const tb = enc.encode(text);
  const kb = enc.encode(key);
  const out = new Uint8Array(tb.length);
  for (let i = 0; i < tb.length; i++) out[i] = tb[i] ^ kb[i % kb.length];
  return Array.from(out).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function xorDecrypt(text, config) {
  const key = config.key || "";
  if (!key) throw new Error("Key required");
  const clean = text.trim();
  if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2 !== 0)
    throw new Error("Invalid hex input");
  const m = clean.match(/.{1,2}/g) || [];
  const tb = new Uint8Array(m.map((h) => parseInt(h, 16)));
  const kb = enc.encode(key);
  const out = new Uint8Array(tb.length);
  for (let i = 0; i < tb.length; i++) out[i] = tb[i] ^ kb[i % kb.length];
  return dec.decode(out);
}

// ---------- Vigenère ----------
function vigenere(text, keyword, decrypt = false) {
  const k = (keyword || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Keyword must contain letters");
  let out = "";
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    const shift = (k.charCodeAt(ki % k.length) - 65) * (decrypt ? -1 : 1);
    if (c >= 65 && c <= 90) {
      out += String.fromCharCode(((c - 65 + shift + 260) % 26) + 65);
      ki++;
    } else if (c >= 97 && c <= 122) {
      out += String.fromCharCode(((c - 97 + shift + 260) % 26) + 97);
      ki++;
    } else out += text[i];
  }
  return out;
}

// ---------- Rail Fence ----------
function railPattern(len, rails) {
  const pattern = new Array(len);
  let r = 0, dir = 1;
  for (let i = 0; i < len; i++) {
    pattern[i] = r;
    if (r === rails - 1) dir = -1;
    if (r === 0) dir = 1;
    r += dir;
  }
  return pattern;
}
function railEncrypt(text, config) {
  const rails = Math.max(2, Math.min(parseInt(config.rails, 10) || 2, 10));
  if (rails >= text.length) return text;
  const pat = railPattern(text.length, rails);
  const buckets = Array.from({ length: rails }, () => "");
  for (let i = 0; i < text.length; i++) buckets[pat[i]] += text[i];
  return buckets.join("");
}
function railDecrypt(text, config) {
  const rails = Math.max(2, Math.min(parseInt(config.rails, 10) || 2, 10));
  if (rails >= text.length) return text;
  const pat = railPattern(text.length, rails);
  const counts = new Array(rails).fill(0);
  pat.forEach((r) => counts[r]++);
  const segs = [];
  let pos = 0;
  for (let r = 0; r < rails; r++) {
    segs.push(text.slice(pos, pos + counts[r]));
    pos += counts[r];
  }
  const idx = new Array(rails).fill(0);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const r = pat[i];
    out += segs[r][idx[r]++];
  }
  return out;
}

// ---------- Columnar ----------
function colOrder(keyword) {
  const arr = keyword.split("").map((ch, i) => ({ ch, i }));
  arr.sort((a, b) => (a.ch === b.ch ? a.i - b.i : a.ch < b.ch ? -1 : 1));
  return arr.map((x) => x.i); // reading order: original column indices
}
function columnarEncrypt(text, config) {
  const kw = (config.keyword || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (!kw) throw new Error("Keyword must contain letters");
  const cols = kw.length;
  const pad = (cols - (text.length % cols)) % cols;
  const padded = text + "X".repeat(pad);
  const rows = padded.length / cols;
  const order = colOrder(kw);
  let body = "";
  for (const c of order) {
    for (let r = 0; r < rows; r++) body += padded[r * cols + c];
  }
  return String(text.length).padStart(4, "0") + body;
}
function columnarDecrypt(text, config) {
  const kw = (config.keyword || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (!kw) throw new Error("Keyword must contain letters");
  if (text.length < 4) throw new Error("Invalid columnar input");
  const origLen = parseInt(text.slice(0, 4), 10);
  if (isNaN(origLen)) throw new Error("Invalid length header");
  const body = text.slice(4);
  const cols = kw.length;
  if (body.length % cols !== 0) throw new Error("Invalid body length");
  const rows = body.length / cols;
  const order = colOrder(kw);
  const grid = new Array(body.length);
  let pos = 0;
  for (const c of order) {
    for (let r = 0; r < rows; r++) {
      grid[r * cols + c] = body[pos++];
    }
  }
  return grid.join("").slice(0, origLen);
}

// ---------- Base64 ----------
function b64Encrypt(text) {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch {
    throw new Error("Base64 encode failed");
  }
}
function b64Decrypt(text) {
  try {
    return decodeURIComponent(escape(atob(text.trim())));
  } catch {
    throw new Error("Invalid Base64 input");
  }
}

export const ciphers = {
  caesar: {
    label: "Caesar",
    description: "A substitution cipher where each letter is shifted by a fixed position in the alphabet. Simple but foundational in cryptographic history.",
    icon: "ArrowLeftRight",
    color: "#8b5cf6",
    defaultConfig: { shift: 3 },
    encrypt: (t, c) => caesarShift(t, parseInt(c.shift, 10) || 0),
    decrypt: (t, c) => caesarShift(t, -(parseInt(c.shift, 10) || 0)),
    preview: (c) => `shift: ${c.shift}`,
  },
  xor: {
    label: "XOR",
    description: "Performs bitwise EXCLUSIVE OR between plaintext bytes and a repeating key. Crucial in modern stream ciphers for masking data.",
    icon: "Shuffle",
    color: "#22d3ee",
    defaultConfig: { key: "secret" },
    encrypt: xorEncrypt,
    decrypt: xorDecrypt,
    preview: (c) => `key: ${c.key}`,
  },
  vigenere: {
    label: "Vigenère",
    description: "A method of encrypting alphabetic text using a series of interwoven Caesar ciphers based on the letters of a keyword.",
    icon: "KeyRound",
    color: "#f59e0b",
    defaultConfig: { keyword: "KEY" },
    encrypt: (t, c) => vigenere(t, c.keyword, false),
    decrypt: (t, c) => vigenere(t, c.keyword, true),
    preview: (c) => `key: ${c.keyword}`,
  },
  railfence: {
    label: "Rail Fence",
    description: "A form of transposition cipher that writes the message in a zigzag pattern on virtual 'rails' and then reads off each rail sequentially.",
    icon: "AlignJustify",
    color: "#4ade80",
    defaultConfig: { rails: 3 },
    encrypt: railEncrypt,
    decrypt: railDecrypt,
    preview: (c) => `rails: ${c.rails}`,
  },
  columnar: {
    label: "Columnar",
    description: "Transposition cipher where text is written in rows of a fixed width and then read column-by-column in an order derived from a keyword.",
    icon: "Table2",
    color: "#f87171",
    defaultConfig: { keyword: "ZEBRA" },
    encrypt: columnarEncrypt,
    decrypt: columnarDecrypt,
    preview: (c) => `key: ${c.keyword}`,
  },
  base64: {
    label: "Base64",
    description: "An encoding scheme that represents binary data in an ASCII string format. Essential for transmitting data over text-only mediums.",
    icon: "Binary",
    color: "#a78bfa",
    defaultConfig: {},
    encrypt: (t) => b64Encrypt(t),
    decrypt: (t) => b64Decrypt(t),
    preview: () => "no config",
  },
};

export const cipherOrder = ["caesar", "xor", "vigenere", "railfence", "columnar", "base64"];
