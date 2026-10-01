function initializeHeader() {
    const headerWrap = document.querySelector('#header-wrap');
    if (!headerWrap || headerWrap.dataset.initialized === 'true') return;
    if (!headerWrap.querySelector('header, .smart-header')) return;

    headerWrap.dataset.initialized = 'true';

    // HOME은 메인으로, 상품 메뉴와 하위 메뉴는 상품 목록으로 이동합니다.
    headerWrap.querySelectorAll('.gnb a, .gnb2depth-smart a').forEach((link) => {
        const isHome = link.textContent.trim().toUpperCase() === 'HOME';
        link.setAttribute('href', isHome ? './index.html' : './list.html');
    });

    // 모바일 상단 메뉴는 HOME을 제외하고 오버레이 내부 탭으로 사용합니다.
    headerWrap.querySelectorAll('.gnb-smart > li > a').forEach((link) => {
        const isHome = link.textContent.trim().toUpperCase() === 'HOME';
        link.setAttribute('href', isHome ? './index.html' : '#');
    });

    const btnMenu = headerWrap.querySelector('.btn-menu');
    const smartOverlayMenu = headerWrap.querySelector('.smart-overlay-menu');
    const btnMenuClose = headerWrap.querySelector('.btn-menu-close');

    if (btnMenu && smartOverlayMenu) {
        btnMenu.addEventListener('click', (event) => {
            event.preventDefault();
            smartOverlayMenu.classList.add('on');
        });
    }

    if (btnMenuClose && smartOverlayMenu) {
        btnMenuClose.addEventListener('click', (event) => {
            event.preventDefault();
            smartOverlayMenu.classList.remove('on');
        });
    }

    const smartMenu = headerWrap.querySelector('.gnb-smart');
    const gnb2depthSmarts = headerWrap.querySelectorAll('.gnb2depth-smart');

    if (smartMenu) {
        smartMenu.addEventListener('click', (event) => {
            const listItem = event.target.closest('.gnb-smart > li');
            if (!listItem || !smartMenu.contains(listItem)) return;

            const index = Array.from(smartMenu.children).indexOf(listItem);
            if (index === 0) return;

            event.preventDefault();
            Array.from(smartMenu.children).forEach((item) => item.classList.remove('on'));
            listItem.classList.add('on');
            gnb2depthSmarts.forEach((item) => item.classList.remove('on'));
            gnb2depthSmarts[index - 1]?.classList.add('on');
        });
    }
}

document.addEventListener('header:loaded', initializeHeader);
initializeHeader();
