export const WHATSAPP_PHONE = "2348179383426";
export const PHONE_NUMBER = "+2348179383426";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello! I'm interested in Zion Study Centre & Leadership Academy and would like to book a counselling session. I'd appreciate guidance on the ___ programme that best suits my goals. Thank you.";

export function getWhatsAppLink(message = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_PHONE}`;
}

export function getPhoneLink() {
  return `tel:${PHONE_NUMBER}`;
}
