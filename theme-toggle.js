const darkModeToggle = document.getElementById("darkModeToggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");

    // アイコンの切り替え
    darkModeToggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";
});

// ページロード時のテーマ適用
if (localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-theme");
    darkModeToggle.textContent = "☀️";
} else {
    document.body.classList.remove("dark-theme");
    darkModeToggle.textContent = "🌙";
}
