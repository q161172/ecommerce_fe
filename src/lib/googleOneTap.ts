/** After logout / FedCM deny, skip One Tap so GIS doesn't spam NetworkError. */
export const ONE_TAP_COOLDOWN_KEY = 'maison_one_tap_cooldown_until';
export const ONE_TAP_SKIP_KEY = 'maison_one_tap_skip';
const COOLDOWN_MS = 60_000;

/** Module-level: only attempt One Tap once per page-load session. */
let promptedThisLoad = false;

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

/** Stop further One Tap attempts this tab (FedCM blocked / user dismissed). */
export function skipGoogleOneTapPermanentlyForSession() {
    try {
        sessionStorage.setItem(ONE_TAP_SKIP_KEY, '1');
    } catch {
        /* ignore */
    }
    suppressGoogleOneTap(COOLDOWN_MS);
}

export function isOneTapCoolingDown() {
    try {
        const until = Number(sessionStorage.getItem(ONE_TAP_COOLDOWN_KEY) ?? 0);
        return until > Date.now();
    } catch {
        return false;
    }
}

export function isOneTapSkippedThisSession() {
    try {
        return sessionStorage.getItem(ONE_TAP_SKIP_KEY) === '1';
    } catch {
        return false;
    }
}

export function hasOneTapPromptedThisLoad() {
    return promptedThisLoad;
}

export function markOneTapPromptedThisLoad() {
    promptedThisLoad = true;
}

/**
 * FedCM disabled in site settings → `identity-credentials-get` is denied.
 * Calling prompt() then logs: FedCM get() rejects with NetworkError.
 */
export async function canUseFedCmOneTap(): Promise<boolean> {
    try {
        if (!('Permissions' in window) || !navigator.permissions?.query) return true;
        const status = await navigator.permissions.query({
            // Chrome FedCM permission name (not in all TS libs yet)
            name: 'identity-credentials-get' as PermissionName,
        });
        return status.state !== 'denied';
    } catch {
        // Permission name unsupported — still try One Tap
        return true;
    }
}
