export function showSnackBar(msg, placement) {
    const element = document.createElement("mdui-snackbar");
    if (placement) element.placement = placement;
    element.innerText = msg;
    element.autoCloseDelay = 2500;
    document.body.appendChild(element);
    element.addEventListener('closed', evt => document.body.removeChild(evt.target));
    setTimeout(() => {
        element.open = true;
    }, 0);  // wtf
}