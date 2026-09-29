// 상품에 해당하는 리뷰 데이터를 상세 페이지에 표시합니다.
const reviewUl = document.querySelector('.review');

function escapeReviewText(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function maskReviewName(name) {
    const characters = [...String(name)];
    if (characters.length <= 1) return `${characters[0] ?? ''}*`;
    if (characters.length === 2) return `${characters[0]}*`;
    return `${characters[0]}*${characters.at(-1)}`;
}

function createReviewStars(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    return Array.from({ length: safeRating }, () =>
        '<img src="./img/star.svg" alt="">'
    ).join('');
}

function createReviewImages(images = []) {
    return images.map((image, index) => `
        <li>
            <img src="./img/review/${encodeURIComponent(image)}"
                alt="고객 리뷰 이미지 ${index + 1}" loading="lazy">
        </li>`).join('');
}

if (reviewUl) {
    if (!reviewInfo.length) {
        reviewUl.innerHTML = '<li class="review-empty">아직 등록된 상품 리뷰가 없습니다.</li>';
    } else {
        reviewUl.innerHTML = reviewInfo.map((item) => {
            const helpfulCount = item.helpful ?? item.rid * 4;
            const reviewImages = createReviewImages(item.reviewImgs);
            const imageSection = reviewImages ? `
                <div class="review-img">
                    <ul class="review-gallery">${reviewImages}</ul>
                </div>` : '';

            return `<li>
                <div class="review-user">
                    <span class="rev-name">${escapeReviewText(maskReviewName(item.userName))}</span>
                    <span class="rev-date">${escapeReviewText(item.date)}</span>
                </div>
                <div class="review-content">
                    <div class="stars" aria-label="별점 ${item.rating}점">
                        ${createReviewStars(item.rating)}
                    </div>
                    <div class="review-txt fold">
                        <p>${escapeReviewText(item.reviewTxt).replaceAll('\n', '<br>')}</p>
                        <button class="btn-rvtxt" type="button" aria-expanded="false">
                            <span>더보기</span><span class="review-toggle-icon" aria-hidden="true">⌄</span>
                        </button>
                    </div>
                    ${imageSection}
                    <div class="review-etc">
                        <button class="btn-helpful" type="button" aria-pressed="false">
                            ♡ 유용해요 <span>${helpfulCount}</span>
                        </button>
                        <a href="#" class="btn-report">신고/차단</a>
                    </div>
                </div>
            </li>`;
        }).join('');
    }
}
