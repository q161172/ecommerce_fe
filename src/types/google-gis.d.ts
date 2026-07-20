export {};

interface GoogleCredentialResponse {
    credential?: string;
    select_by?: string;
}

interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    itp_support?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
}

interface GoogleAccountsId {
    initialize: (config: GoogleIdConfiguration) => void;
    prompt: (listener?: (notification: unknown) => void) => void;
    cancel: () => void;
    disableAutoSelect: () => void;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: GoogleAccountsId;
            };
        };
    }
}
