function formatWon(value) {
    return Math.round(value).toLocaleString('ko-KR');
}

function applyProductFromQuery() {
    if (typeof newProductArray === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const requestedId = Number(params.get('id') ?? params.get('pid'));
    if (!Number.isFinite(requestedId)) return;

    const product = newProductArray.find((item) => item.pid === requestedId);
    if (!product) return;

    const discountRate = Number(product.pdiscount) || 0;
    const salePrice = Number.isFinite(product.priceDiscount)
        ? product.priceDiscount
        : Math.round(product.price * (1 - discountRate));
    const memberPrice = Math.round(salePrice * 0.95);
    const cartPrice = Math.round(memberPrice * 0.97);
    const cardPrice = Math.max(0, cartPrice - 10000);
    const monthlyPrice = Math.round(cartPrice / 6);
    const pointAmount = Math.round(cartPrice * 0.001);

    const title = document.querySelector('.product-txt > .product-name .product-title');
    const categoryBadge = document.querySelector('.product-txt > .product-name .category-badge');
    const mainImage = document.querySelector('.thumbnail-big img');
    const firstThumb = document.querySelector('.gallery-thumb');
    const originalPrice = document.querySelector('.product-pay .pay-original');
    const discount = document.querySelector('.product-pay .discount');
    const salePriceText = document.querySelector('.product-pay .pay b');
    const benefitPrices = document.querySelectorAll('.price-benefit b');
    const extraBenefits = document.querySelectorAll('.benefits > .benefit:nth-of-type(2) .desc-benefit');
    const pointBenefit = document.querySelector('.benefits > .benefit:nth-of-type(3) .desc-benefit');
    const totalPrice = document.querySelector('.pay-info > b');

    if (title) title.textContent = `[FORME] ${product.pname}`;
    if (categoryBadge) categoryBadge.textContent = 'NEW';

    if (mainImage) {
        mainImage.src = `./img/${product.pthumbFileName}`;
        mainImage.alt = product.pname;
    }

    if (firstThumb) {
        firstThumb.dataset.image = `./img/${product.pthumbFileName}`;
        firstThumb.dataset.alt = product.pname;
        const thumbImage = firstThumb.querySelector('img');
        if (thumbImage) {
            thumbImage.src = `./img/${product.pthumbFileName}`;
            thumbImage.alt = '';
        }
    }

    if (originalPrice) {
        originalPrice.hidden = discountRate === 0;
        const value = originalPrice.querySelector('span');
        if (value) value.textContent = formatWon(product.price);
    }

    if (discount) {
        discount.hidden = discountRate === 0;
        discount.textContent = `${Math.round(discountRate * 100)}%`;
    }

    if (salePriceText) salePriceText.textContent = formatWon(salePrice);
    if (benefitPrices[0]) benefitPrices[0].textContent = formatWon(memberPrice);
    if (benefitPrices[1]) benefitPrices[1].textContent = formatWon(cartPrice);
    if (extraBenefits[0]) extraBenefits[0].textContent = `월 ${formatWon(monthlyPrice)}원부터, 최대 6개월`;
    if (extraBenefits[1]) {
        extraBenefits[1].childNodes[0].textContent = `${formatWon(cardPrice)}원 `;
    }
    if (pointBenefit) {
        pointBenefit.childNodes[0].textContent = `${formatWon(pointAmount)}P 적립 예정 `;
    }
    if (totalPrice) totalPrice.textContent = formatWon(salePrice);

    document.title = `${product.pname} | FORME`;
}

applyProductFromQuery();

const mainProductImage = document.querySelector('.thumbnail-big img');
const galleryThumbs = document.querySelectorAll('.gallery-thumb');
const galleryScroller = document.querySelector('.horizontal-scroll-gallery');

galleryThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
        if (!mainProductImage) return;

        mainProductImage.src = thumb.dataset.image;
        mainProductImage.alt = thumb.dataset.alt;

        galleryThumbs.forEach((item) => item.classList.remove('is-active'));
        thumb.classList.add('is-active');
    });
});

if (galleryScroller) {
    galleryScroller.addEventListener('wheel', (event) => {
        if (galleryScroller.scrollWidth <= galleryScroller.clientWidth) return;

        const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;
        const maxScrollLeft = galleryScroller.scrollWidth - galleryScroller.clientWidth;
        const canScroll = distance < 0
            ? galleryScroller.scrollLeft > 0
            : galleryScroller.scrollLeft < maxScrollLeft;

        if (!canScroll) return;

        event.preventDefault();
        galleryScroller.scrollLeft += distance;
    }, { passive: false });

    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let startScrollLeft = 0;

    galleryScroller.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;

        isDragging = true;
        didDrag = false;
        startX = event.clientX;
        startScrollLeft = galleryScroller.scrollLeft;
        galleryScroller.setPointerCapture(event.pointerId);
        galleryScroller.classList.add('is-dragging');
    });

    galleryScroller.addEventListener('pointermove', (event) => {
        if (!isDragging) return;

        const distance = event.clientX - startX;
        if (Math.abs(distance) > 4) didDrag = true;
        galleryScroller.scrollLeft = startScrollLeft - distance;
    });

    const stopDragging = (event) => {
        if (!isDragging) return;

        isDragging = false;
        galleryScroller.classList.remove('is-dragging');
        if (galleryScroller.hasPointerCapture(event.pointerId)) {
            galleryScroller.releasePointerCapture(event.pointerId);
        }
    };

    galleryScroller.addEventListener('pointerup', stopDragging);
    galleryScroller.addEventListener('pointercancel', stopDragging);
    galleryScroller.addEventListener('click', (event) => {
        if (!didDrag) return;

        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
    }, true);
}

document.querySelectorAll('.btn-rvtxt').forEach((button) => {
    button.addEventListener('click', () => {
        const reviewText = button.closest('.review-txt');
        if (!reviewText) return;

        const isExpanded = reviewText.classList.toggle('fold') === false;
        const label = button.querySelector('span');

        button.setAttribute('aria-expanded', String(isExpanded));
        if (label) label.textContent = isExpanded ? '접기' : '더보기';
    });
});

const productMenuLinks = document.querySelectorAll('.sticky-product-menu a');
const productSections = [...productMenuLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

productMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        productMenuLinks.forEach((item) => item.classList.remove('on'));
        link.classList.add('on');
    });
});

if ('IntersectionObserver' in window && productSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleSection = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleSection) return;

        productMenuLinks.forEach((link) => {
            link.classList.toggle('on', link.hash === `#${visibleSection.target.id}`);
        });
    }, {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.15, 0.5]
    });

    productSections.forEach((section) => sectionObserver.observe(section));
}
