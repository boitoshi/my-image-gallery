document.addEventListener('DOMContentLoaded', () => {
    // 1. 必要な要素の取得
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const modalBackground = document.getElementById('modal-background');
    const modalImg = document.getElementById('modal-img');
    const modalInfo = document.getElementById('modal-info');
    const closeModal = document.getElementById('close-modal');
    const copyUrlButton = document.getElementById('copy-url');
    const searchBox = document.getElementById('searchbox');
    let allImages = [];
    let currentPage = 1;
    let totalPages = 1;
    let imagesPerPage = 50; // 1ページあたりの表示数


    // デバッグログの追加
    console.log('Elements found:', {
        gallery: !!gallery,
        modal: !!modal,
        modalImg: !!modalImg,
        modalInfo: !!modalInfo,
        modalBackground: !!modalBackground
    });



    // 2. モーダル関連の機能
    gallery.addEventListener('click', (e) => {
        // イベントの詳細をログ出力
        console.log({
            target: e.target,
            currentTarget: e.currentTarget,
            path: e.composedPath()
        });
        
        if (e.target.tagName.toLowerCase() === 'img') {
            console.log('Image clicked:', e.target.src);
            modalImg.src = e.target.src;
            modalInfo.value = e.target.src;
            modal.classList.remove('hidden');
            modalBackground.classList.remove('hidden');
        }
    });

    // モーダルを閉じる
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        modalBackground.classList.add('hidden');
    });
    // モーダル背景をクリックして閉じる
    modalBackground.addEventListener('click', () => {
        modal.classList.add('hidden');
        modalBackground.classList.add('hidden');
    });
    //  URLをコピーする
    copyUrlButton.addEventListener('click', () => {
        navigator.clipboard.writeText(modalInfo.value)
            .then(() => showToast('URLをコピーしました!', 'success'))
            .catch(() => showToast('URLコピー失敗じゃあ。', 'error'));
    });

    // トースト通知を表示する関数
    function showToast(message, type = 'success') {
        // 既存のトーストを削除
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // トースト要素を作成
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // スタイルを動的に設定
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
            zIndex: '10000'
        });

        // トーストを表示
        document.body.appendChild(toast);
        
        // フェードイン
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // 1秒後に消去
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 100);
        }, 1000);
    }

    // 3. 初期表示: 全ての画像を取得
    fetchAllImages().then(images => {
        allImages = images;
        displayCurrentPageImages(allImages);
    });

    // 検索機能
    let debounceTimer;
    searchBox.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchBox.value.trim().toLowerCase();
            const filteredImages = allImages.filter(image => 
                image.title.rendered.toLowerCase().includes(query)
            );
            displayImages(filteredImages);
        }, 500);
    });




    // 画像取得関数
    async function fetchAllImages() {
        const perPage = 100;
        let page = 1;
        let allImages = [];
        
        try {
            // まず1ページ目を取得してトータルページ数を確認
            const firstResponse = await fetch(
                `https://www.pokebros.net/wp-json/wp/v2/media?per_page=${perPage}&page=1`
            );
            const totalPages = parseInt(firstResponse.headers.get('X-WP-TotalPages'));
            const firstPageImages = await firstResponse.json();
            allImages = allImages.concat(firstPageImages);
    
            // 2ページ目以降を取得
            for(let currentPage = 2; currentPage <= totalPages; currentPage++) {
                const response = await fetch(
                    `https://www.pokebros.net/wp-json/wp/v2/media?per_page=${perPage}&page=${currentPage}`
                );
                const images = await response.json();
                allImages = allImages.concat(images);
            }
        } catch (error) {
            console.error('画像データの取得に失敗:', error);
        }
        return allImages;
    }

    // 画像表示関数
    function displayImages(images) {
        gallery.innerHTML = '';
        images.forEach(image => {
            const div = document.createElement('div');
            div.className = "image-container";
            div.dataset.name = image.title.rendered.toLowerCase();

            const img = document.createElement('img');
            img.src = image.source_url;
            img.alt = image.title.rendered || "ギャラリー画像";

            div.appendChild(img);
            gallery.appendChild(div);
        });
    }
        // ページネーション用のUIを追加する関数
        function createPagination(totalImages) {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            totalPages = Math.ceil(totalImages.length / imagesPerPage);
    
            // 「前へ」ボタン
            const prevButton = document.createElement('button');
            prevButton.textContent = '前へ';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayCurrentPageImages(allImages);
                    updatePagination();
                }
            });
    
            // 「次へ」ボタン
            const nextButton = document.createElement('button');
            nextButton.textContent = '次へ';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayCurrentPageImages(allImages);
                    updatePagination();
                }
            });
    
            // ページ番号の表示
            const pageInfo = document.createElement('span');
            pageInfo.textContent = `${currentPage} / ${totalPages}`;
            pageInfo.className = 'page-info';
    
            paginationContainer.appendChild(prevButton);
            paginationContainer.appendChild(pageInfo);
            paginationContainer.appendChild(nextButton);
    
            // 既存のページネーションを削除して新しいものを追加
            const existingPagination = document.querySelector('.pagination');
            if (existingPagination) {
                existingPagination.remove();
            }
            gallery.parentNode.insertBefore(paginationContainer, gallery.nextSibling);
        }
    
        // 現在のページの画像のみを表示する関数
        function displayCurrentPageImages(images) {
            const start = (currentPage - 1) * imagesPerPage;
            const end = start + imagesPerPage;
            const pageImages = images.slice(start, end);
            displayImages(pageImages);
            createPagination(images);
        }
    
        // ページネーションの更新
        function updatePagination() {
            const prevButton = document.querySelector('.pagination button:first-child');
            const nextButton = document.querySelector('.pagination button:last-child');
            const pageInfo = document.querySelector('.page-info');
    
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
            pageInfo.textContent = `${currentPage} / ${totalPages}`;
        }
    
        // 既存の検索機能も現在のページ表示に対応
        searchBox.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = searchBox.value.trim().toLowerCase();
                const filteredImages = allImages.filter(image => 
                    image.title.rendered.toLowerCase().includes(query)
                );
                currentPage = 1; // 検索時はページを1に戻す
                displayCurrentPageImages(filteredImages);
            }, 500);
        });
});
