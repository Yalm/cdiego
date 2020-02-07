export function orderUser(data: { id: number}): string {
    return `
        <h2>Hola</h2>
        <p>Se ha realizado un nuevo pedido.</p>
        <a href="https://admin.comercialdiego.com/orders/${data.id}/edit">Ver Pedido</a>
        <p>Si no has emitido esta solicitud, ignora este mensaje.</p>
        <p>Gracias</p>
    `;
}
