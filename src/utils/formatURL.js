export function formatExternalURL(url, protocol) {
    if (
        !url.startsWith("//") &&
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) url = `${protocol || ""}//${url}`;
    return url;
}