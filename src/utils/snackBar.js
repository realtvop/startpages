export function showSnackBar(msg, placement) {
    const element = document.createElement("mdui-snackbar");
    if (placement) element.placement = placement;
    element.innerText = msg;
    
    return element;
}