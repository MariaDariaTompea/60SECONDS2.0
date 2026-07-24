require('dotenv').config()
const fs = require('fs')
const path = require('path')
const db = require('../database/dbContext')

const CHARACTER_FOLDER = path.join(__dirname, '../../character-images')
const ITEM_FOLDER = path.join(__dirname, '../../item-images')

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.webp') return 'image/webp'
  return 'application/octet-stream'
}

// a data-k név szerint (a fájlnévből jövő name-hez párosítva)
const characterData = {
  'Dolores': {
    story: 'Egy hiú fodrász a külvárosból, aki a világvége után is a kinézetére ad. A férje @Ted, akivel a bunkerben ragadt, és a lányuk @MaryJane is velük van. A bunkerben nehezen viseli a mocskot, de meglepően talpraesett, ha muszáj.',
    stats: { hunger: 4, thirst: 4, health: 5, sanity: 3 },
    perks: ['gyors', 'hiú', 'talpraesett'],
  },
  'Mary Jane': {
    story: 'A család csendes, visszahúzódó tagja, @Dolores és @Ted lánya. Keveset beszél, de figyel mindenre. Legszívesebben a @BoyScoutHandbook fölött görnyed, mert a benne lévő tudás segít túlélni.',
    stats: { hunger: 3, thirst: 3, health: 4, sanity: 5 },
    perks: ['nyugodt', 'megfigyelő'],
  },
  'Sharikov': {
    story: 'A család macskája. Nem sokat tesz hozzá a túléléshez, de a morált feldobja. @Timmy kedvence, aki mindig utánamegy, ha a macska napokra eltűnik a romok közt.',
    stats: { hunger: 2, thirst: 2, health: 3, sanity: 5 },
    perks: ['független', 'morálnövelő'],
  },
  'Ted': {
    story: 'A családfő, @Dolores férje. Kicsit lassú, de megbízható és erős. Ő cipeli a nehéz dolgokat, és ha veszély közeleg, ő az, aki a @Rifle után nyúl, hogy megvédje a családot.',
    stats: { hunger: 5, thirst: 5, health: 5, sanity: 4 },
    perks: ['erős', 'megbízható', 'lassú'],
  },
  'Timmy': {
    story: 'A család legfiatalabb tagja, @Ted és @Dolores fia. Energikus és kíváncsi, ami a bunkerben áldás is meg átok is. A @Flashlight az egyik kedvenc holmija, mert imád felderíteni a sötét sarkokat.',
    stats: { hunger: 4, thirst: 4, health: 3, sanity: 2 },
    perks: ['energikus', 'gyorsan tanul', 'ijedős'],
  },
}

const itemData = {
  'Axe': {
    story: 'Egy megbízható fejsze. Fát aprít, ajtót tör, és ha muszáj, önvédelemre is jó. Rendszerint @Ted kezében látni, a bunker egyik legsokoldalúbb szerszáma.',
    stats: { durability: 5, usefulness: 4, weight: 3 },
    tags: ['szerszám', 'fegyver', 'tartós'],
  },
  'Boy Scout Handbook': {
    story: 'A cserkészkönyv tele van túlélési tippekkel. @MaryJane a legszorgalmasabb olvasója. Nem old meg mindent, de a megfelelő pillanatban aranyat ér a benne lévő tudás.',
    stats: { durability: 2, usefulness: 5, weight: 1 },
    tags: ['tudás', 'túlélés', 'könnyű'],
  },
  'Flashlight': {
    story: 'Egy elemlámpa, ami átvezet a sötétségen. @Timmy kedvence a felderítéshez. Nélkülözhetetlen, de az elem véges — okosan kell bánni vele.',
    stats: { durability: 3, usefulness: 4, weight: 1 },
    tags: ['felderítés', 'fény', 'elemes'],
  },
  'Map': {
    story: 'A környék térképe. Megmutatja, hova érdemes menni és mit érdemes elkerülni. A @Flashlight fényénél a legjobb tanulmányozni, mielőtt valaki felderítőútra indul.',
    stats: { durability: 1, usefulness: 4, weight: 1 },
    tags: ['felderítés', 'navigáció', 'könnyű'],
  },
  'Padlock': {
    story: 'Egy erős lakat. Nem sok mindent csinál, de a megfelelő ajtón kulcsfontosságú lehet — kizárja a nem kívánt látogatókat, amíg @Ted a @Rifle mögött őrködik.',
    stats: { durability: 5, usefulness: 3, weight: 2 },
    tags: ['biztonság', 'védelem', 'tartós'],
  },
  'Rifle': {
    story: 'Egy puska. A legjobb védelem a bunker körül ólálkodó veszélyek ellen. Általában @Ted tartja magánál — feltéve, hogy van hozzá lőszer és van, aki használni tudja.',
    stats: { durability: 4, usefulness: 5, weight: 4 },
    tags: ['fegyver', 'védelem', 'nehéz'],
  },
}

async function uploadFolder(folder, type, dataMap) {
  const files = fs.readdirSync(folder)

  for (const file of files) {
    const filePath = path.join(folder, file)
    const buffer = fs.readFileSync(filePath)
    const name = path.parse(file).name
    const mention = name.replace(/\s+/g, '')
    const mimeType = getMimeType(file)
    const data = dataMap[name] || null

    await db.characterItem.create({
      type: type,
      name: name,
      mention: mention,
      photo: buffer,
      photoType: mimeType,
      data: data,
    })

    console.log(`Feltöltve (${type}): ${name} → @${mention}${data ? '' : ' (nincs data!)'}`)
  }
}

async function uploadAll() {
  try {
    await uploadFolder(CHARACTER_FOLDER, 'character', characterData)
    await uploadFolder(ITEM_FOLDER, 'item', itemData)
    console.log('Minden feltöltve.')
  } catch (error) {
    console.error('Hiba:', error.message)
  }
}

uploadAll()