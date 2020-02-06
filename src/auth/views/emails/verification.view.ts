export function verification(data: { token: string, host: string, name?: string }): string {
    return `
        <h2>Hola${data.name ? ' ' + data.name : ''},</h2>
        <p>Haz clic en este enlace para verificar tu dirección de correo electrónico.</p>
        <a href="${data.host}/email/verify/${data.token}">Verficar ahora</a>
        <p>Si no has emitido esta solicitud, ignora este mensaje.</p>
        <p>Gracias</p>
    `;
}
