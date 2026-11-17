const msg = document.getElementById("msg");
function showMsg(text, ok) { msg.textContent = text; msg.className = "msg " + (ok ? "ok" : "err"); }

function showTab(tab) {
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("regForm").classList.toggle("hidden", tab !== "reg");
  document.getElementById("tabLogin").classList.toggle("active", tab === "login");
  document.getElementById("tabReg").classList.toggle("active", tab === "reg");
  showMsg("", true);
}

// Реєстрація: перевірка, шифрування і запис у LocalStorage
document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    name: regName.value.trim(),
    surname: regSurname.value.trim(),
    login: regLogin.value.trim(),
    password: regPass.value,
    registered: new Date().toLocaleString("uk-UA")
  };
  if (user.password.length < 6) return showMsg("Пароль має містити щонайменше 6 символів", false);
  if (ADMIN_DB.some(a => a.login === user.login)) return showMsg("Цей логін зайнятий", false);

  const stored = getStoredUsers();
  for (const enc of stored) {
    if (await decryptText(enc.login) === user.login) return showMsg("Користувач з таким логіном уже існує", false);
  }
  stored.push(await encryptUser(user));          // шифрування перед збереженням
  saveStoredUsers(stored);
  e.target.reset();
  showTab("login");
  showMsg("Реєстрація успішна! Тепер увійдіть.", true);
});

// Вхід: спочатку перевіряємо адміністратора в БД, потім користувачів у LocalStorage
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = loginLogin.value.trim(), pass = loginPass.value;

  const admin = ADMIN_DB.find(a => a.login === login);
  if (admin) {
    if (await sha256(pass) === admin.passwordHash) {
      sessionStorage.setItem("session", JSON.stringify({ role: "admin", name: admin.name + " " + admin.surname }));
      return window.location.href = "admin.html";
    }
    return showMsg("Невірний пароль адміністратора", false);
  }

  for (const enc of getStoredUsers()) {
    const u = await decryptUser(enc);
    if (u.login === login && u.password === pass) {
      sessionStorage.setItem("session", JSON.stringify({ role: "user", name: u.name + " " + u.surname }));
      return window.location.href = "user.html";
    }
  }
  showMsg("Невірний логін або пароль", false);
});
