// 필요한 페이지에서 선택적으로 사용할 수 있는 데스크톱 관성 스크롤 유틸리티입니다.
const canUseSmoothMouse = window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUseSmoothMouse) {
    let currentY = window.scrollY;
    let targetY = currentY;
    let animationFrame = 0;

    function animateSmoothScroll() {
        currentY += (targetY - currentY) * 0.12;
        window.scrollTo(0, currentY);

        if (Math.abs(targetY - currentY) < 0.5) {
            window.scrollTo(0, targetY);
            animationFrame = 0;
            return;
        }

        animationFrame = window.requestAnimationFrame(animateSmoothScroll);
    }

    window.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.target.closest('.horizontal-scroll-gallery, .review-img')) return;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetY = Math.max(0, Math.min(targetY + event.deltaY, maxScroll));
        event.preventDefault();

        if (!animationFrame) animationFrame = window.requestAnimationFrame(animateSmoothScroll);
    }, { passive: false });

    window.addEventListener('scroll', () => {
        if (!animationFrame) {
            currentY = window.scrollY;
            targetY = currentY;
        }
    }, { passive: true });
}
