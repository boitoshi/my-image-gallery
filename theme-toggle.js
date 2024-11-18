// 切り替えボタンを取得
const toggleButton = document.getElementById('themeToggle');
const body = document.body;

// ローカルストレージに保存されているテーマを確認
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '☀️ ライトモード';
}

// ボタンクリック時の切り替え処理
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️ ライトモード';
        localStorage.setItem('theme', 'dark'); // ダークモードを保存
    } else {
        toggleButton.textContent = '🌙 ダークモード';
        localStorage.setItem('theme', 'light'); // ライトモードを保存
    }
});
