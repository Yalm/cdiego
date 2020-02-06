export interface Token {
    readonly access_token: string;
    readonly token_type?: string;
    readonly expires_in?: number;
}
