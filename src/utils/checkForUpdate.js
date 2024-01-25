import { showSnackBar } from './snackBar';

export function checkForUpdate() {
    fetch("/latest.json")
        .then(r => r.text())
        .then(t => JSON.parse(t))
        .then(l => {
            if (l.buildTime && l.assets && l.buildTime !== window.spec.currentVersionBuildTime) {
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ action: "update", assets: l.assets });
                    showSnackBar("Updating...")
                } else showSnackBar("Update failed.")
            }
        })
        .catch(e => showSnackBar("Update check failed."));
}