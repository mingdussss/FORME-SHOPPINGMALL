async function includeHtml(targetSelector, filePath, loadedEventName) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`${filePath} 로딩 실패 (${response.status})`);
        }

        target.innerHTML = await response.text();
        document.dispatchEvent(new CustomEvent(loadedEventName));
    } catch (error) {
        console.error(error);
    }
}

function includeCommonLayout() {
    includeHtml('#header-wrap', './header.html', 'header:loaded');
    includeHtml('#footer-wrap', './footer.html', 'footer:loaded');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', includeCommonLayout, { once: true });
} else {
    includeCommonLayout();
}
