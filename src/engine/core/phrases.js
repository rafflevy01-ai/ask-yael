// Localized response strings (the NLG layer's phrase book).
//
// Keeping copy as data — keyed by locale — means a new language is added by
// extending this table, not by touching the dialog logic. Interpolation is a
// tiny pure helper so we avoid a template dependency.

import { LOCALES, OFFERED_LOCALES } from "../domain/locales.js";

const PHRASES = Object.freeze({
  en: Object.freeze({
    greeting: "Hello, you've reached the clinic. This is Yael, the virtual receptionist.",
    languageMenu: "You can speak with me in Hebrew, French, or English. Which do you prefer?",
    howCanIHelp: "How can I help you today?",
    booking: "Sure, I can help you book an appointment. What day works best for you?",
    askAppointmentType: "I can book that for you. What type of appointment do you need — a check-up, cleaning, filling, or root canal?",
    askDay: "Great. What day works best for you?",
    bookingConfirmed: "You're all set — I've booked your {type} for {day}. You'll get a confirmation by SMS shortly.",
    smsConfirmation: "Your {type} appointment is booked for {day}. Reply to this message to change it.",
    reschedule: "No problem, let's reschedule your appointment. What is your name and current appointment date?",
    cancel: "I can cancel that for you. Can I have your name and the appointment date?",
    faq: "Happy to help with that. Let me find the information for you.",
    takeMessage: "I'll take a message and have the team call you back. What would you like to say?",
    handoff: "Of course, I'm connecting you with a member of our team now.",
    emergency: "This sounds urgent. If this is a medical emergency, please hang up and call {number} immediately. I'm alerting our on-call staff now.",
    fallback: "I'm sorry, I didn't quite catch that. Could you tell me if you'd like to book, reschedule, cancel, ask a question, or leave a message?",
    goodbye: "Thank you for calling. Take care!",
  }),
  fr: Object.freeze({
    greeting: "Bonjour, vous êtes bien à la clinique. Je suis Yaël, la réceptionniste virtuelle.",
    languageMenu: "Vous pouvez me parler en hébreu, en français ou en anglais. Que préférez-vous ?",
    howCanIHelp: "Comment puis-je vous aider aujourd'hui ?",
    booking: "Bien sûr, je peux vous aider à prendre rendez-vous. Quel jour vous conviendrait le mieux ?",
    askAppointmentType: "Je peux vous prendre un rendez-vous. Quel type de rendez-vous souhaitez-vous — un contrôle, un détartrage, un plombage ou un traitement de canal ?",
    askDay: "Parfait. Quel jour vous conviendrait le mieux ?",
    bookingConfirmed: "C'est noté — j'ai réservé votre {type} pour {day}. Vous recevrez une confirmation par SMS sous peu.",
    smsConfirmation: "Votre rendez-vous {type} est réservé pour {day}. Répondez à ce message pour le modifier.",
    reschedule: "Pas de problème, reprogrammons votre rendez-vous. Quel est votre nom et la date actuelle du rendez-vous ?",
    cancel: "Je peux annuler cela pour vous. Puis-je avoir votre nom et la date du rendez-vous ?",
    faq: "Avec plaisir. Laissez-moi trouver l'information pour vous.",
    takeMessage: "Je vais prendre un message et l'équipe vous rappellera. Que souhaitez-vous transmettre ?",
    handoff: "Bien sûr, je vous mets en relation avec un membre de notre équipe.",
    emergency: "Cela semble urgent. En cas d'urgence médicale, veuillez raccrocher et appeler le {number} immédiatement. J'alerte notre personnel de garde.",
    fallback: "Je suis désolée, je n'ai pas bien compris. Souhaitez-vous prendre, reprogrammer ou annuler un rendez-vous, poser une question ou laisser un message ?",
    goodbye: "Merci de votre appel. Prenez soin de vous !",
  }),
  he: Object.freeze({
    greeting: "שלום, הגעתם למרפאה. כאן יעל, הפקידה הווירטואלית.",
    languageMenu: "אפשר לדבר איתי בעברית, בצרפתית או באנגלית. מה מתאים לכם?",
    howCanIHelp: "איך אפשר לעזור לכם היום?",
    booking: "בשמחה, אני יכולה לעזור לקבוע תור. איזה יום מתאים לכם?",
    askAppointmentType: "אני יכולה לקבוע לכם תור. איזה סוג תור צריך — בדיקה, ניקוי אבנית, סתימה או טיפול שורש?",
    askDay: "מצוין. איזה יום מתאים לכם?",
    bookingConfirmed: "הכול מסודר — קבעתי לכם {type} ל{day}. תקבלו אישור ב-SMS בקרוב.",
    smsConfirmation: "התור שלכם ({type}) נקבע ל{day}. השיבו להודעה כדי לשנות אותו.",
    reschedule: "אין בעיה, נשנה את מועד התור. מה השם שלכם ומה מועד התור הנוכחי?",
    cancel: "אני יכולה לבטל את זה עבורכם. אפשר לקבל שם ומועד תור?",
    faq: "בשמחה אעזור. תנו לי למצוא את המידע עבורכם.",
    takeMessage: "אשאיר הודעה והצוות יחזור אליכם. מה תרצו למסור?",
    handoff: "כמובן, אני מעבירה אתכם לנציג מהצוות שלנו.",
    emergency: "זה נשמע דחוף. אם מדובר במקרה חירום רפואי, נתקו ותתקשרו ל-{number} מיד. אני מתריעה לצוות הכונן שלנו.",
    fallback: "סליחה, לא הבנתי במדויק. תרצו לקבוע תור, לשנות, לבטל, לשאול שאלה או להשאיר הודעה?",
    goodbye: "תודה שהתקשרתם. שיהיה לכם יום טוב!",
  }),
});

// phrase :: (locale, key, vars?) -> string
// Falls back to English for an unknown locale/key so the caller always hears
// something sensible.
export function phrase(locale, key, vars = {}) {
  const table = PHRASES[locale] || PHRASES.en;
  const template = table[key] != null ? table[key] : PHRASES.en[key] || "";
  return interpolate(template, vars);
}

// interpolate :: (string, object) -> string  ("{name}" -> vars.name)
function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

// The spoken language-selection menu, e.g. "Hebrew / French / English".
export function offeredLanguagesLine() {
  return OFFERED_LOCALES.map((code) => LOCALES[code].name).join(" / ");
}
