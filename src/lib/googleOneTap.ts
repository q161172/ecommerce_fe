/** After logout, skip One Tap briefly so GIS doesn't fire a failing `status` probe. */
export const ONE_TAP_COOLDOWN_KEY = 'maison_one_tap_cooldown_until';
const COOLDOWN_MS = 60_000;

export function suppressGoogleOneTap(ms = COOLDOWN_MS) {
    try {
        sessionStorage.setItem(ONE_TAP_COOLDOWN_KEY, String(Date.now() + ms));
    } catch {
        /* private mode / blocked storage */
    }
    try {
        window.google?.accounts?.id?.cancel();
        window.google?.accounts?.id?.disableAutoSelect();
    } catch {
        /* GIS not loaded yet */
    }
}

export function isOneTapCoolingDown() {
    try {
        const until = Number(sessionStorage.getItem(ONE_TAP_COOLDOWN_KEY) ?? 0);
        return until > Date.now();
    } catch {
        return false;
    }
}
