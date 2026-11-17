// ===== Модуль шифрування (AES-256-GCM, Web Crypto API) =====
const APP_SECRET = "Lab-KAI-TECH-586KB-secret";   // секрет застосунку
const SALT = new TextEncoder().encode("cryptoweb-salt-2026");

// Отримання ключа AES-256 із секрету за допомогою PBKDF2
async function getKey() {
  const baseKey = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(APP_SECRET), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: SALT, iterations: 100000, hash: "SHA-256" },
    baseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

function toBase64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))); }
function fromBase64(str) { return Uint8Array.from(atob(str), c => c.charCodeAt(0)); }

// Шифрування рядка: повертає {iv, data} у Base64
async function encryptText(text) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));   // новий IV для кожного запису
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
  return { iv: toBase64(iv), data: toBase64(encrypted) };
}

// Дешифрування рядка
async function decryptText(obj) {
  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(obj.iv) }, key, fromBase64(obj.data));
  return new TextDecoder().decode(decrypted);
}

// Хешування пароля SHA-256 (для перевірки адміністратора)
async function sha256(text) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// Робота з LocalStorage
function getStoredUsers() { return JSON.parse(localStorage.getItem("usersEncrypted") || "[]"); }
function saveStoredUsers(list) { localStorage.setItem("usersEncrypted", JSON.stringify(list)); }

// Шифрування всього об'єкта користувача перед записом у LocalStorage
async function encryptUser(user) {
  return {
    name: await encryptText(user.name),
    surname: await encryptText(user.surname),
    login: await encryptText(user.login),
    password: await encryptText(user.password),
    registered: await encryptText(user.registered)
  };
}

async function decryptUser(enc) {
  return {
    name: await decryptText(enc.name),
    surname: await decryptText(enc.surname),
    login: await decryptText(enc.login),
    password: await decryptText(enc.password),
    registered: await decryptText(enc.registered)
  };
}

// Перевірка ролі під час відкриття сторінки
function requireRole(role) {
  const session = JSON.parse(sessionStorage.getItem("session") || "null");
  if (!session || session.role !== role) { window.location.href = "index.html"; return null; }
  return session;
}
function logout() { sessionStorage.removeItem("session"); window.location.href = "index.html"; }
