export function formatExternalURL(url) {
    if (
        !url.startsWith("//") &&
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) url = `//${url}`;
    return url;
}