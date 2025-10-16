# Musicfy

## Descripción
Musicfy es una aplicación web progresiva (PWA) demo que implementa el concepto de App Shell, mostrando una estructura base (header, menú, main y footer) con contenido dinámico de playlists simuladas usando la iTunes Search API.
La app funciona sin conexión, gracias a su Service Worker, y aprovecha varias APIs modernas del navegador.

## Estructura del App Shell

El App Shell (index.html) está conformado por:
Encabezado (header): contiene el logo, nombre de la app y botones de acciones (voz, ubicación, notificaciones).
Contenido principal (main): muestra playlists dinámicas y una sección de favoritos.
Pie de página (footer): información de derechos y marca.
Splash screen inicial con logo y animación de carga.
Todos estos elementos se almacenan en caché por el Service Worker, permitiendo que la app cargue la interfaz aunque no haya conexión.

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


## Como probar las caracteristicas
Función	Descripción
Offline	Abre la app, luego desactiva la red y recarga. El Service Worker cargará el App Shell desde caché.
SSR	Abre /playlist/rock para ver prerender del lado del servidor (si se ejecuta con Express).
Favoritos	Usa el botón ❤️ para agregar o quitar canciones del almacenamiento local.
Notificaciones	Haz clic en 🔔 “Notif” y acepta el permiso.
Micrófono	Haz clic en 🎙️ “Voz” (usa SpeechRecognition o getUserMedia).
Geolocalización	Haz clic en 📍 “Local” para obtener la ubicación actual.

## Notas
- Para un push notifications real (con suscripciones), se necesita implementar VAPID y endpoint de push

ACTIVIDAD 3: Prueba de App Shell 
MANUEL CONTRERAS CASTILLO

REYES VARGAS JOSE GABRIEL IDGS11