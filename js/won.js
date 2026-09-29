function won(price) {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice)) return '0';
    return Math.round(numericPrice).toLocaleString('ko-KR');
}
