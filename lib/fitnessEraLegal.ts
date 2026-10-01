import type { Lang } from "./translations";

/**
 * Política de privacidad, salud y términos de Fitness Era.
 * Tiene que decir lo mismo que la pantalla que el jugador acepta dentro del juego
 * (FitnessEra/Assets/RepQuest/Scripts/Legal/LegalTexts.cs). Si cambia algo importante,
 * se sube la versión aquí y en el juego (Consent.CurrentVersion).
 */
export const POLICY_VERSION = 1;
export const POLICY_DATE: Record<Lang, string> = { es: "29 de septiembre de 2026", en: "September 29, 2026" };
export const CONTACT_EMAIL = "picarogamestudio@gmail.com";

export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  after?: string[];
}

export const policy: Record<Lang, { title: string; intro: string; sections: PolicySection[] }> = {
  es: {
    title: "Privacidad, salud y términos de uso",
    intro:
      "Fitness Era usa la cámara del teléfono y te pone a hacer ejercicio de verdad. Aquí explicamos qué pasa con tu imagen y tus datos, y lo que tienes que saber para jugar de forma segura. Es lo mismo que aceptas dentro del juego la primera vez que lo abres.",
    sections: [
      {
        id: "quienes-somos",
        title: "Quiénes somos",
        paragraphs: [
          `Fitness Era es un juego de Pícaro Game Studio (Chile). Para cualquier consulta o solicitud sobre tus datos, escríbenos a ${CONTACT_EMAIL}.`,
        ],
      },
      {
        id: "camara",
        title: "Tu imagen no sale de tu teléfono",
        paragraphs: [
          "El juego usa la cámara frontal solo para detectar la posición de tu cuerpo y contar repeticiones. Todo ese proceso ocurre dentro del teléfono y en el momento.",
        ],
        bullets: [
          "No grabamos video ni tomamos fotos.",
          "No guardamos tu imagen ni la enviamos a ningún servidor, ni nuestro ni de terceros.",
          "Nadie más ve tu cámara: ni nosotros ni otros jugadores.",
          "La cámara solo se enciende durante una pelea o la práctica libre. Puedes quitarle el permiso cuando quieras desde los ajustes del teléfono.",
        ],
      },
      {
        id: "datos",
        title: "Qué datos se guardan",
        bullets: [
          "En tu teléfono: tu progreso en el juego (nivel, repeticiones, armas, eras) y tus ajustes.",
          "Progreso en línea: con una cuenta anónima (sin correo ni contraseña) guardamos en los servidores de Unity Gaming Services (Unity Technologies) una copia de tu progreso de juego: nombre de jugador, nivel, repeticiones, victorias y derrotas, monedas, racha, Pase del Héroe, anuncios vistos, compras, versión del juego e idioma. La usamos para darte soporte, moderar el juego (por ejemplo, ante trampas) y enviarte regalos del equipo. No incluye tu imagen, tu ciudad ni tu ubicación, y otros jugadores no la ven.",
          "Códigos y torneos entre amigos: si canjeas un código guardamos que lo usaste; si juegas un torneo entre amigos guardamos tus intentos, y los participantes ven tu nombre de jugador, nivel y puntaje.",
          "Mensajes y feedback: si contestas un mensaje del equipo o nos mandas feedback desde el juego, guardamos lo que escribes junto a tu nombre de jugador y la versión del juego. Solo lo ve el equipo y lo usamos para mejorar el juego. Te pedimos no escribir datos personales.",
          "Datos de uso, solo si lo aceptas: información anónima sobre cómo se juega, como tiempo de juego, sesiones, niveles, peleas ganadas o perdidas, repeticiones por pelea, cofres abiertos, modelo del teléfono, sistema operativo, país aproximado y un identificador aleatorio de instalación. Se procesa con Unity Analytics (Unity Technologies) y la usamos solo para mejorar el juego y su balance.",
          "Ranking, solo si entras: se crea una cuenta anónima (sin correo ni contraseña) y guardamos en los servidores de Unity Gaming Services (Unity Technologies) tu nombre de jugador, tu marco, tu nivel, las repeticiones, duración y ritmo de tus peleas, y la ciudad y el país que elijas. Los demás jugadores ven tu nombre, marco, nivel, repeticiones de la semana y ciudad.",
          "Para sugerir tu ciudad se puede usar la ubicación aproximada del teléfono, si das el permiso. Las coordenadas se usan dentro del teléfono para buscar la ciudad más cercana y no se envían ni se guardan: solo el nombre de la ciudad.",
          "Foto de perfil (opcional): si eliges una de tu galería, se sube achicada a los servidores de Unity. Primero la revisamos, y solo si se aprueba la ven los demás jugadores en el ranking. Puedes cambiarla, o borrarla junto con tu cuenta, cuando quieras.",
          "Anuncios (opcionales): solo aparecen cuando tú tocas \"Ver anuncio\" (para seguir una pelea, doblar el oro, el cofre gratis o llenar la vida). Los entrega Unity LevelPlay con sus redes de anuncios, que pueden usar el identificador de publicidad del teléfono y datos técnicos del dispositivo según sus propias políticas. Puedes limitar o restablecer ese identificador en los ajustes del teléfono.",
          "No pedimos tu nombre real, correo ni ubicación exacta. Nosotros no vendemos tus datos ni los usamos para publicidad.",
        ],
        after: [
          "Compartir datos de uso es opcional. Puedes activarlo o desactivarlo en Ajustes → Privacidad y seguridad, y ahí mismo borrar todo lo que guardamos en los servidores (tu cuenta anónima, tu progreso en línea y lo enviado); tu progreso en el teléfono no se toca. Entrar al ranking también es opcional: en la pestaña Ranking puedes salir y borrar tu cuenta y lo que el servidor guarda de ti. También puedes escribirnos para acceder a tus datos, corregirlos o eliminarlos.",
        ],
      },
      {
        id: "salud",
        title: "Tu salud es primero",
        paragraphs: [
          "Fitness Era es un juego. No es un programa médico ni de entrenamiento personalizado, y no reemplaza la opinión de un profesional de la salud.",
          "Consulta a un médico antes de jugar si tienes alguna enfermedad del corazón, presión alta, lesiones o dolor en hombros, muñecas, espalda o rodillas, estás embarazada, te estás recuperando de una operación o no haces ejercicio hace tiempo.",
        ],
      },
      {
        id: "seguridad",
        title: "Mientras juegas",
        bullets: [
          "Para de inmediato si sientes dolor, mareo, falta de aire o presión en el pecho.",
          "Haz las repeticiones a tu ritmo. Puedes descansar cuando quieras.",
          "Juega en un espacio despejado, con piso firme y que no resbale, lejos de muebles, escaleras y objetos.",
          "Deja el teléfono estable en el suelo o apoyado, donde no te tropieces con él.",
          "Calienta antes, toma agua y usa ropa y calzado cómodos.",
        ],
      },
      {
        id: "responsabilidad",
        title: "Responsabilidad",
        paragraphs: [
          "Haces los ejercicios de forma voluntaria y bajo tu propia responsabilidad. En la medida que lo permita la ley aplicable, los creadores de Fitness Era no son responsables de lesiones, daños o problemas de salud derivados de hacer ejercicio con el juego, ni de daños al teléfono o a objetos cercanos. Nada de esto limita los derechos que la ley te garantiza como consumidor.",
        ],
      },
      {
        id: "menores",
        title: "Menores de edad",
        paragraphs: [
          "Si tienes menos de 18 años, juega solo con permiso y supervisión de tu madre, padre o un adulto responsable. El juego no está dirigido a menores de 13 años y no recopilamos a sabiendas datos de ellos.",
        ],
      },
      {
        id: "prueba",
        title: "Versión de prueba",
        paragraphs: [
          "Durante las pruebas, el juego está en desarrollo: puede tener errores, el conteo de repeticiones puede fallar y el progreso podría reiniciarse entre versiones.",
        ],
      },
      {
        id: "cambios",
        title: "Cambios",
        paragraphs: ["Si cambiamos esta política de manera importante, el juego te pedirá aceptarla de nuevo."],
      },
    ],
  },
  en: {
    title: "Privacy, health and terms of use",
    intro:
      "Fitness Era uses your phone's camera and gets you doing real exercise. Here we explain what happens to your image and your data, and what you need to know to play safely. It's the same text you accept in the game the first time you open it.",
    sections: [
      {
        id: "quienes-somos",
        title: "Who we are",
        paragraphs: [
          `Fitness Era is a game by Pícaro Game Studio (Chile). For any question or request about your data, write to ${CONTACT_EMAIL}.`,
        ],
      },
      {
        id: "camara",
        title: "Your image never leaves your phone",
        paragraphs: [
          "The game uses the front camera only to detect your body position and count reps. All of this happens on your phone, in real time.",
        ],
        bullets: [
          "We don't record video or take photos.",
          "We don't store your image or send it to any server, ours or anyone else's.",
          "Nobody else sees your camera: not us, not other players.",
          "The camera only turns on during a fight or free practice. You can revoke its permission anytime in your phone settings.",
        ],
      },
      {
        id: "datos",
        title: "What data is kept",
        bullets: [
          "On your phone: your game progress (level, reps, weapons, eras) and settings.",
          "Online progress: with an anonymous account (no email or password) we keep on Unity Gaming Services servers (Unity Technologies) a copy of your game progress: player name, level, reps, wins and losses, currencies, streak, Hero Pass, ads watched, purchases, game version and language. We use it to support you, moderate the game (for example, against cheating) and send you gifts from the team. It does not include your image, your city or your location, and other players don't see it.",
          "Codes and friends' tournaments: if you redeem a code we keep that you used it; if you play a friends' tournament we keep your attempts, and its players see your player name, level and score.",
          "Messages and feedback: if you answer a message from the team or send us feedback from the game, we keep what you write along with your player name and the game version. Only the team sees it, and we use it to improve the game. Please don't write personal data.",
          "Usage data, only if you agree: anonymous information about how the game is played, such as play time, sessions, levels, fights won or lost, reps per fight, chests opened, phone model, operating system, approximate country and a random install ID. It is processed with Unity Analytics (Unity Technologies) and used only to improve the game and its balance.",
          "Ranking, only if you join: an anonymous account is created (no email or password) and we store on Unity Gaming Services servers (Unity Technologies) your player name, frame, level, the reps, duration and pace of your fights, and the city and country you pick. Other players see your name, frame, level, reps this week and city.",
          "To suggest your city the phone's approximate location can be used, if you grant permission. The coordinates are used on the phone to find the nearest city and are never sent or stored: only the city name.",
          "Profile photo (optional): if you pick one from your gallery, a small version is uploaded to Unity's servers. We review it first, and other players only see it in the ranking once it's approved. You can change it, or delete it along with your account, anytime.",
          "Ads (optional): they only show when you tap \"Watch ad\" (to continue a fight, double your gold, the free chest or refill your HP). They are served by Unity LevelPlay and its ad networks, which may use the phone's advertising ID and technical device data under their own policies. You can limit or reset that ID in your phone settings.",
          "We don't ask for your real name, email or exact location. We don't sell your data or use it for advertising.",
        ],
        after: [
          "Sharing usage data is optional. You can turn it on or off in Settings → Privacy and safety, and delete everything we keep on the servers there (your anonymous account, your online progress and what was sent); your progress on the phone is kept. Joining the ranking is optional too: in the Ranking tab you can leave and delete your account and what the server keeps about you. You can also write to us to access, correct or delete your data.",
        ],
      },
      {
        id: "salud",
        title: "Your health comes first",
        paragraphs: [
          "Fitness Era is a game. It is not a medical or personal training program and does not replace advice from a health professional.",
          "Check with a doctor before playing if you have a heart condition, high blood pressure, injuries or pain in your shoulders, wrists, back or knees, are pregnant, are recovering from surgery, or haven't exercised in a while.",
        ],
      },
      {
        id: "seguridad",
        title: "While you play",
        bullets: [
          "Stop right away if you feel pain, dizziness, shortness of breath or chest pressure.",
          "Do reps at your own pace. You can rest anytime.",
          "Play in a clear space with a firm, non-slip floor, away from furniture, stairs and objects.",
          "Keep the phone stable on the floor or propped up, where you won't trip over it.",
          "Warm up first, drink water and wear comfortable clothes and shoes.",
        ],
      },
      {
        id: "responsabilidad",
        title: "Responsibility",
        paragraphs: [
          "You do the exercises voluntarily and at your own risk. To the extent permitted by applicable law, the makers of Fitness Era are not liable for injuries, damages or health problems resulting from exercising with the game, or for damage to your phone or nearby objects. Nothing here limits your statutory rights as a consumer.",
        ],
      },
      {
        id: "menores",
        title: "Minors",
        paragraphs: [
          "If you are under 18, only play with permission and supervision from a parent or responsible adult. The game is not directed at children under 13 and we do not knowingly collect their data.",
        ],
      },
      {
        id: "prueba",
        title: "Test version",
        paragraphs: [
          "During testing the game is in development: it may have bugs, rep counting may fail and progress could be reset between versions.",
        ],
      },
      {
        id: "cambios",
        title: "Changes",
        paragraphs: ["If we change this policy in a significant way, the game will ask you to accept it again."],
      },
    ],
  },
};
