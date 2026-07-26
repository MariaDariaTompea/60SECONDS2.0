require('dotenv').config()
const db = require('../database/dbContext')

const newsList = [
  {
    title: 'Fejlesztői napló #3',
    excerpt: 'Új bunker-mechanikák és a legújabb karakter-animációk a fejlesztés alatt.',
    content: {
      blocks: [
        { type: 'heading', text: 'Mi történt a műhelyben?' },
        { type: 'paragraph', text: 'Az elmúlt hetekben a **bunker-mechanikákon** dolgoztunk. A cél, hogy minden döntés *tétje* érezhető legyen, ahogy @Ted a nehéz tárgyakat cipeli.' },
        { type: 'list', items: ['Új crafting rendszer', 'Fejlettebb karakter-animációk', 'Optimalizált mentés'] },
        { type: 'paragraph', text: 'A következő naplóban a **hangdizájnról** lesz szó. Maradjatok velünk!' },
      ],
    },
  },
  {
    title: 'Új karakter érkezik',
    excerpt: 'Hamarosan bemutatjuk a család legújabb tagját. Maradj velünk!',
    content: {
      blocks: [
        { type: 'heading', text: 'Egy új arc a bunkerben' },
        { type: 'paragraph', text: 'A család hamarosan **bővül**. Az új karakter @Dolores és @Ted mellé érkezik, egyedi képességekkel, amik *alapjaiban* változtatják meg a túlélési stratégiát.' },
        { type: 'paragraph', text: 'A teljes bemutatót a **jövő héten** tesszük közzé.' },
      ],
    },
  },
  {
    title: 'Köszönjük a közösségnek',
    excerpt: 'Elértük az első nagy mérföldkövet a wishlist számában.',
    content: {
      blocks: [
        { type: 'heading', text: 'Mérföldkő!' },
        { type: 'paragraph', text: 'Hihetetlen, de átléptük az **első nagy határt** a Steam wishlist-en. Ez mind a ti érdemetek!' },
        { type: 'list', items: ['Köszönjük a visszajelzéseket', 'Köszönjük a megosztásokat', 'Köszönjük a türelmet'] },
        { type: 'paragraph', text: 'A *legjobb* még hátravan.' },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #4',
    excerpt: 'A hangdizájn kulisszái mögött — hogyan szól egy atombunker?',
    content: {
      blocks: [
        { type: 'heading', text: 'A csend hangja' },
        { type: 'paragraph', text: 'Ebben a naplóban a **hangdizájnról** mesélünk. A bunker atmoszféráját a *legapróbb* zajok teszik hitelessé — még @Sharikov dorombolása is hallható.' },
        { type: 'list', items: ['Környezeti hangok', 'Radió-recsegés', 'A karakterek lélegzése'] },
        { type: 'paragraph', text: 'A hang a túlélés része — figyelj oda rá!' },
      ],
    },
  },
  {
    title: 'Bemutatjuk: a konzervkészlet',
    excerpt: 'A túlélés alapja a megfelelő tartalék. Minden a konzervekről.',
    content: {
      blocks: [
        { type: 'heading', text: 'Amit érdemes felhalmozni' },
        { type: 'paragraph', text: 'A **konzervek** a bunker aranyai. De vigyázz: a lejárat *téged is* utolér. @Timmy már meg is számolta mind.' },
        { type: 'paragraph', text: 'A készletgazdálkodás lesz a legfontosabb döntésed.' },
      ],
    },
  },
  {
    title: 'Roadmap frissítés',
    excerpt: 'Megmutatjuk, mi vár rátok a következő hónapokban.',
    content: {
      blocks: [
        { type: 'heading', text: 'Merre tartunk?' },
        { type: 'paragraph', text: 'Frissítettük a **roadmapet**. Íme a következő mérföldkövek:' },
        { type: 'list', items: ['Zárt béta', 'Új zónák', 'Steam Early Access', 'Teljes megjelenés'] },
        { type: 'paragraph', text: 'Minden lépésről *időben* értesítünk.' },
      ],
    },
  },
  {
    title: 'A bunker feltérképezve',
    excerpt: 'Nézz körül a menedékedben, mielőtt lehullanak a bombák.',
    content: {
      blocks: [
        { type: 'heading', text: 'Otthon, édes bunker' },
        { type: 'paragraph', text: 'A bunker minden **zuga** rejt valamit. Egy @Flashlight és egy @Map nélkül viszont ne indulj felderíteni.' },
        { type: 'list', items: ['Raktárhelyiség', 'Rádiószoba', 'Vészkijárat'] },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #5',
    excerpt: 'A döntési rendszer, avagy hogyan lesz minden választás fájdalmas.',
    content: {
      blocks: [
        { type: 'heading', text: 'Nehéz döntések' },
        { type: 'paragraph', text: 'A játék szíve a **döntési rendszer**. Kit küldj a felszínre — @Ted vagy @Dolores? Mit áldozz fel? Nincs *könnyű* válasz.' },
        { type: 'paragraph', text: 'Minden döntésnek súlya van — és következménye.' },
      ],
    },
  },
  {
    title: 'Közösségi kihívás indul',
    excerpt: 'Túléled 30 napig? Oszd meg a történeted!',
    content: {
      blocks: [
        { type: 'heading', text: 'A nagy túlélő-kihívás' },
        { type: 'paragraph', text: 'Indítunk egy **közösségi kihívást**: ki tud a legtovább életben maradni? A legjobb történeteket *megosztjuk*!' },
        { type: 'list', items: ['Játssz végig egy futamot', 'Készíts képernyőképet', 'Oszd meg a közösségben'] },
      ],
    },
  },
  {
    title: 'Bemutatjuk: a rádió',
    excerpt: 'A rádió a kapcsolatod a külvilággal. Használd bölcsen.',
    content: {
      blocks: [
        { type: 'heading', text: 'Hangok a romok közül' },
        { type: 'paragraph', text: 'A **rádió** híreket, segélykéréseket és néha *csapdákat* közvetít. @Ted mindig kétszer meggondolja, mielőtt válaszol egy hívásra.' },
        { type: 'paragraph', text: 'Hallgass, mérlegelj, és dönts.' },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #6',
    excerpt: 'A felszíni expedíciók — kockázat és jutalom.',
    content: {
      blocks: [
        { type: 'heading', text: 'Ki a szabadba' },
        { type: 'paragraph', text: 'A **felszíni expedíciók** a legveszélyesebb pillanatok. Egy @Rifle a kézben sokat segít, de a *zsákmány* sosem garantált.' },
        { type: 'list', items: ['Nyersanyagok', 'Túlélők', 'Ismeretlen veszélyek'] },
      ],
    },
  },
  {
    title: 'Karakter reflektorfényben: a családfő',
    excerpt: 'Ismerd meg közelebbről a család erős emberét.',
    content: {
      blocks: [
        { type: 'heading', text: 'A ház ereje' },
        { type: 'paragraph', text: '@Ted cipeli a nehéz terheket — szó szerint. **Megbízható**, de kicsit *lassú*. A felesége, @Dolores, gyakran noszogatja.' },
        { type: 'paragraph', text: 'Nélküle a nehéz tárgyak a bunkerben ragadnának.' },
      ],
    },
  },
  {
    title: 'Steam oldal frissítve',
    excerpt: 'Új képernyőképek és egy friss trailer a Steam oldalon.',
    content: {
      blocks: [
        { type: 'heading', text: 'Nézd meg élőben' },
        { type: 'paragraph', text: 'Frissítettük a **Steam oldalt** friss képekkel és egy új *trailerrel*. Ne felejtsd el a wishlistet!' },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #7',
    excerpt: 'A mentési rendszer — mert a túlélés hosszú út.',
    content: {
      blocks: [
        { type: 'heading', text: 'Mentés és folytatás' },
        { type: 'paragraph', text: 'Megújítottuk a **mentési rendszert**. Mostantól *bármikor* folytathatod, ahol abbahagytad.' },
        { type: 'list', items: ['Automatikus mentés', 'Több mentési hely', 'Felhő-szinkron (tervben)'] },
      ],
    },
  },
  {
    title: 'A macska titkai',
    excerpt: 'Sharikov nem csak dísz — több van benne, mint hinnéd.',
    content: {
      blocks: [
        { type: 'heading', text: 'Négylábú túlélő' },
        { type: 'paragraph', text: '@Sharikov a morál titkos fegyvere. Néha eltűnik, de mindig *visszatér* — általában valami meglepetéssel. @Timmy a legjobb barátja.' },
      ],
    },
  },
  {
    title: 'Event: bunker-nyitás hétvége',
    excerpt: 'Különleges hétvégi esemény a közösségnek.',
    content: {
      blocks: [
        { type: 'heading', text: 'Nyitott hétvége' },
        { type: 'paragraph', text: 'Hétvégén **különleges eseményt** tartunk. Élő fejlesztői beszélgetés, kérdezz-felelek és *exkluzív* betekintés.' },
        { type: 'list', items: ['Szombat: fejlesztői stream', 'Vasárnap: közösségi Q&A'] },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #8',
    excerpt: 'A felület újratervezve — tisztább, gyorsabb, szebb.',
    content: {
      blocks: [
        { type: 'heading', text: 'Új külső' },
        { type: 'paragraph', text: 'Teljesen **újraterveztük a felületet**. Célunk, hogy minden információ *egy pillantással* elérhető legyen.' },
        { type: 'paragraph', text: 'A visszajelzéseitek alapján finomítottunk.' },
      ],
    },
  },
  {
    title: 'Bemutatjuk: a térkép',
    excerpt: 'A térkép nélkül eltévedsz. Vele túlélsz.',
    content: {
      blocks: [
        { type: 'heading', text: 'Merre menj?' },
        { type: 'paragraph', text: 'A @Map megmutatja, mit érdemes felderíteni és mit *elkerülni*. A @BoyScoutHandbook mellett a legfontosabb túlélő-eszközöd.' },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #9',
    excerpt: 'A véletlen események rendszere — soha két egyforma futam.',
    content: {
      blocks: [
        { type: 'heading', text: 'Kiszámíthatatlanság' },
        { type: 'paragraph', text: 'Bevezettük a **véletlen események** rendszerét. Minden futam *más* — sosem tudod, mi vár rád.' },
        { type: 'list', items: ['Váratlan látogatók', 'Erőforrás-válságok', 'Morális dilemmák'] },
      ],
    },
  },
  {
    title: 'Wishlist-mérföldkő elérve',
    excerpt: 'Átléptük a következő nagy határt. Köszönjük!',
    content: {
      blocks: [
        { type: 'heading', text: 'Együtt erősebbek vagyunk' },
        { type: 'paragraph', text: 'Elértük a következő **wishlist-mérföldkövet**! Ez a ti *lelkesedésetek* eredménye.' },
        { type: 'paragraph', text: 'Hálásak vagyunk minden egyes támogatásért.' },
      ],
    },
  },
  {
    title: 'Fejlesztői napló #10',
    excerpt: 'A befejezések — hány módon érhet véget a történeted?',
    content: {
      blocks: [
        { type: 'heading', text: 'Sokféle vég' },
        { type: 'paragraph', text: 'A játéknak **több befejezése** van. A döntéseid — és az, hogy megvéded-e @Timmy-t — vezetnek el a *saját* történetedhez.' },
        { type: 'list', items: ['A túlélő', 'Az áldozat', 'A hős', 'A titkos vég'] },
        { type: 'paragraph', text: 'Vajon melyiket éred el?' },
      ],
    },
  },
  {
    title: 'Zárt béta bejelentés',
    excerpt: 'Hamarosan indul a zárt béta. Így jelentkezhetsz.',
    content: {
      blocks: [
        { type: 'heading', text: 'Legyél az elsők között' },
        { type: 'paragraph', text: 'Indul a **zárt béta**! A jelentkezők közül *véletlenszerűen* választunk tesztelőket.' },
        { type: 'list', items: ['Iratkozz fel a hírlevélre', 'Csatlakozz a Discordhoz', 'Várd a meghívót'] },
      ],
    },
  },
  {
    title: 'Köszönet a tesztelőknek',
    excerpt: 'A béta-visszajelzések alapján rengeteget javítottunk.',
    content: {
      blocks: [
        { type: 'heading', text: 'A ti érdemetek' },
        { type: 'paragraph', text: 'A **béta-tesztelők** felbecsülhetetlen segítséget nyújtottak. Több száz *hibát* javítottunk a visszajelzéseik alapján.' },
        { type: 'paragraph', text: 'A játék miattatok lett jobb.' },
      ],
    },
  },
]

async function uploadNews() {
  try {
    for (const entry of newsList) {
      await db.News.create({
        title: entry.title,
        excerpt: entry.excerpt,
        content: entry.content,
      })

      console.log(`Feltöltve: ${entry.title}`)
    }

    console.log('Minden hír feltöltve.')
  } catch (error) {
    console.error('Hiba:', error.message)
  }
}

uploadNews()