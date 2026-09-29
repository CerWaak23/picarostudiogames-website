/**
 * Donaciones al estudio. Solo son enlaces a páginas de pago externas: la web no maneja
 * tarjetas ni datos de pago.
 *
 * - Ko-fi: la dirección de tu página, por ejemplo "https://ko-fi.com/picarogamestudio".
 * - Mercado Pago: un «Link de pago» por monto, creado en mercadopago.cl → Cobrar → Link de pago.
 *   `url` vacío = ese monto no se muestra. `other` es un link donde la persona elige el monto.
 *
 * Mientras todo esté vacío, la sección de apoyo no aparece en la web.
 */
export const support = {
  kofi: "",
  mercadoPago: {
    amounts: [
      { label: "$2.000", url: "" },
      { label: "$5.000", url: "" },
      { label: "$10.000", url: "" },
    ],
    other: "",
  },
};

export const mercadoPagoAmounts = support.mercadoPago.amounts.filter((a) => a.url);
export const hasMercadoPago = mercadoPagoAmounts.length > 0 || !!support.mercadoPago.other;
export const hasKofi = !!support.kofi;
export const hasSupport = hasKofi || hasMercadoPago;
