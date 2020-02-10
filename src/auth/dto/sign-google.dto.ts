export interface SignGoogleDto {
    readonly authorizationData: {
        readonly redirect_uri: string;
    };
    readonly oauthData: {
        readonly code: string;
    };
}
