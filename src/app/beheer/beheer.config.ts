/**
 * Beheer-configuratie – pas dit bestand aan na het instellen van Google OAuth2.
 *
 * Stap 1: Ga naar https://console.cloud.google.com
 * Stap 2: APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
 *         Type: Web application
 *         Authorized JavaScript origins: https://jouwdomein.nl
 *         (voor lokaal testen ook: http://localhost:4200)
 * Stap 3: Kopieer de Client ID hieronder
 * Stap 4: Voeg jouw Gmail-adres toe aan toegestaneEmails
 */
export const BEHEER_CONFIG = {
  googleClientId: '137945249520-4sae7hmlrep3h1fkn9ff08a8j33otl4h.apps.googleusercontent.com',
  toegestaneEmails: ['msmtijink@gmail.com', 'wesmeindertsma@gmail.com'],
};
