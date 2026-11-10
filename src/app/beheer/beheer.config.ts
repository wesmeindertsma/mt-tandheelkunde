/**
 * Wie mag inloggen in het beheer.
 *
 * LET OP: deze lijst staat ook in firestore.rules. Pas beide aan en publiceer
 * daarna de regels opnieuw, anders kan een nieuw adres wel inloggen maar niet opslaan.
 */
export const BEHEER_CONFIG = {
  toegestaneEmails: ['msmtijink@gmail.com', 'wesmeindertsma@gmail.com'],
};
