document.addEventListener('click', (event) => {
    const reviewToggle = event.target.closest('.btn-rvtxt');
    if (reviewToggle) {
        const reviewText = reviewToggle.closest('.review-txt');
        if (!reviewText) return;

        const isExpanded = reviewText.classList.toggle('fold') === false;
        const label = reviewToggle.querySelector('span');
        reviewToggle.setAttribute('aria-expanded', String(isExpanded));
        if (label) label.textContent = isExpanded ? '접기' : '더보기';
        return;
    }

    const helpfulButton = event.target.closest('.btn-helpful');
    if (helpfulButton) {
        const count = helpfulButton.querySelector('span');
        const wasPressed = helpfulButton.getAttribute('aria-pressed') === 'true';
        helpfulButton.setAttribute('aria-pressed', String(!wasPressed));
        helpfulButton.classList.toggle('on', !wasPressed);

        if (count) {
            const currentCount = Number(count.textContent) || 0;
            count.textContent = String(Math.max(0, currentCount + (wasPressed ? -1 : 1)));
        }
        return;
    }

    const reportLink = event.target.closest('.btn-report');
    if (reportLink) event.preventDefault();
});
