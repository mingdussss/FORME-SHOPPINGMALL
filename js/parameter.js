function getParameter(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}
