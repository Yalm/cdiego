export function reset(data: { email: string, host: string, token: string }): string {
    return `
        <h2>Hola</h2>
        <p>Haz clic en este enlace para cambiar la contraseña de tu cuenta</p>
        <a href="${data.host}/password/reset?token=${data.token}">Cambiar contraseña</a>
        <p>Si no has emitido esta solicitud, ignora este mensaje.</p>
        <p>Gracias</p>
    `;
}
