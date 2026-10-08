(function() {
  const SECRET_TOKEN = "MTMzNw=="; // ПИН-код (по умолчанию "1337"). Чтобы сменить: btoa("ваш_пин")

  // Если уже авторизован на этом устройстве — ничего не показываем
  if (localStorage.getItem("dev_auth_token") === SECRET_TOKEN) {
    return;
  }

  // Приостанавливаем выполнение стартовых скриптов или блокируем видимость
  const overlay = document.createElement("div");
  overlay.id = "dev-lock-screen";
  overlay.style.cssText = `
    position: fixed; inset: 0; background: #0b0b14; z-index: 9999999;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: monospace; color: #00ffcc;
  `;

  overlay.innerHTML = `
    <div style="text-align: center; max-width: 320px; padding: 20px; box-sizing: border-box;">
      <h2 style="margin-bottom: 8px; text-shadow: 0 0 10px #00ffcc;">DEV ACCESS</h2>
      <p style="color: #888; font-size: 13px; margin-bottom: 20px;">PIN</p>
      <input type="password" id="dev-pin-input" placeholder="PIN" style="
          width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #00ffcc;
          background: #151528; color: #fff; text-align: center; font-size: 20px;
          letter-spacing: 4px; outline: none; margin-bottom: 12px; box-sizing: border-box;">
      <button id="dev-unlock-btn" style="
          width: 100%; padding: 12px; border-radius: 8px; border: none;
          background: #00ffcc; color: #000; font-weight: bold; font-size: 14px;
          cursor: pointer;">ENTER</button>
      <p id="dev-error-msg" style="color: #ff3366; font-size: 12px; margin-top: 10px; display: none;">Incorrect</p>
    </div>
  `;

  // Вставляем оверлей в самом начале, как только DOM доступен
  if (document.body) {
    document.body.appendChild(overlay);
  } else {
    document.addEventListener("DOMContentLoaded", () => document.body.appendChild(overlay));
  }

  function handleAuth() {
    const pinInput = document.getElementById("dev-pin-input");
    const errorMsg = document.getElementById("dev-error-msg");

    if (btoa(pinInput.value.trim()) === SECRET_TOKEN) {
      localStorage.setItem("dev_auth_token", SECRET_TOKEN);
      overlay.remove();
    } else {
      errorMsg.style.display = "block";
      pinInput.value = "";
      setTimeout(() => { errorMsg.style.display = "none"; }, 2000);
    }
  }

  // Привязываем обработчики после вставки
  setTimeout(() => {
    const btn = document.getElementById("dev-unlock-btn");
    const input = document.getElementById("dev-pin-input");
    if (btn && input) {
      btn.addEventListener("click", handleAuth);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleAuth();
      });
      input.focus();
    }
  }, 50);
})();
