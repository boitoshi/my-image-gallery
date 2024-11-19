document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const modalBackground = document.getElementById('modal-background');
    const modalImg = document.getElementById('modal-img');
    const modalInfo = document.getElementById('modal-info');
    const closeModal = document.getElementById('close-modal');
    const copyUrlButton = document.getElementById('copy-url');

    gallery.addEventListener('click', (e) => {
        console.log("クリックイベントが発生しました！"); // デバッグログ
        if (e.target.tagName === 'IMG') { // クリックが画像の場合
            console.log("画像がクリックされました: ", e.target.src); // クリックされた画像のURLをログ出力
            modalImg.src = e.target.src;
            modalInfo.value = e.target.src; // URLを表示
            modal.classList.remove('hidden'); // モーダルを表示
            modalBackground.classList.remove('hidden'); // 背景を表示
        }
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden'); // モーダルを閉じる
        modalBackground.classList.add('hidden'); // 背景を閉じる
    });

    modalBackground.addEventListener('click', () => {
        modal.classList.add('hidden'); // モーダルを閉じる
        modalBackground.classList.add('hidden'); // 背景を閉じる
    });

    copyUrlButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(modalInfo.value);
            alert('URLがコピーされました!');
        } catch (err) {
            console.error('URLのコピーに失敗しました: ', err);
        }
    });
});
