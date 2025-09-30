# Musicfy - PWA (mini)

## Descripción
Musicfy es una PWA demo que muestra playlists simuladas usando la iTunes Search API. Incluye:
- Pantalla Splash y Home (CSR).
- SSR para `/playlist/:term` (Express) con prerender de tracks.
- Service Worker para offline (cache app shell + runtime cache).
- Favoritos en `localStorage`.
- Notificaciones locales (Notification API).
- Acceso a micrófono (SpeechRecognition o getUserMedia) y geolocalización.

## Estructura
- `public/` -> archivos estáticos (index, css, js, manifest)
- `sw.js` -> service worker
- `server.js` -> Express (SSR)
- `package.json`

## Instalación
1. Node >= 18 recomendado.
2. `npm install`
3. `npm start`
4. Abrir `http://localhost:3000`

## Cómo probar características
- **Offline**: iniciar, luego desconectar la red y recargar (el SW servirá el caché).
- **SSR**: abrir `http://localhost:3000/playlist/rock` → HTML renderizado en servidor.
- **Favoritos**: en Home, click ❤ para agregar/remove.
- **Notificaciones**: click en "🔔 Notif" y aceptar permiso.
- **Micrófono**: click en "🎙️ Voz" (Chrome soporta SpeechRecognition).
- **Geolocalización**: click en "📍 Local".

## Notas
- Para un push notifications real (con suscripciones), se necesita implementar VAPID y endpoint de push

TAREA 1: Desarrollo de repositorio web
MANUEL CONTRERAS CASTILLO
• 26 sept

REYES VARGAS JOSE GABRIEL IDGS11