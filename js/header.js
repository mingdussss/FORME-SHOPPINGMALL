const btnMenu = document.querySelector('.btn-menu');
const smartOverlayMenu = document.querySelector('.smart-overlay-menu');
const btnMenuClose = document.querySelector('.btn-menu-close');

// 실제로 준비된 페이지 기준으로 헤더 내 상품 탐색 링크를 연결합니다.
// HOME은 메인으로, 나머지 GNB/서브메뉴는 상품 목록으로 이동합니다.
const headerMenuLinks = document.querySelectorAll(
    '.gnb a, .gnb-smart a, .gnb2depth-smart a'
);

headerMenuLinks.forEach((link) => {
    const isHome = link.textContent.trim().toUpperCase() === 'HOME';
    link.setAttribute('href', isHome ? './index.html' : './list.html');
});

//스마트 디바이스 메뉴 열기 닫기 기능
if(btnMenu){
btnMenu.addEventListener('click',()=>{
    smartOverlayMenu.classList.add('on');
    });
}

if(btnMenuClose){
btnMenuClose.addEventListener('click',()=>{
    smartOverlayMenu.classList.remove('on');
    });
}

const smartLists = document.querySelectorAll('.gnb-smart>li');
const gnb2depthSmarts = document.querySelectorAll('.gnb2depth-smart');

smartLists.forEach((li,idx)=>{
    li.addEventListener('click',(e)=>{
        const link = e.target.closest('a');
        if(link && link.getAttribute('href') !== '#'){return}
        if(idx===0){return}
        e.preventDefault();
        smartLists.forEach(litag=>litag.classList.remove('on'));
        li.classList.add('on');
        gnb2depthSmarts.forEach(div=>div.classList.remove('on'));
        gnb2depthSmarts[idx-1].classList.add('on');
    });
})
