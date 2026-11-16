// Haalt de foto's die in beheer zijn geüpload (base64 in Firestore) op en zet ze
// als losse bestanden in public/fotos/. Tijdens het prerenderen gebruikt de site
// dan deze bestanden in plaats van de base64-tekst, zodat de HTML klein blijft
// (prettig voor Google en AI-crawlers).
//
// Draait automatisch vóór `npm run build` (zie "prebuild" in package.json).
// Lukt het ophalen niet, dan gaat de build gewoon door met de base64-foto's.

import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROJECT = 'mttandheelkunde';
const BASIS   = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const MAP      = join(process.cwd(), 'public', 'fotos');
// Buiten public/, zodat het overzicht niet mee online gaat (/tmp staat in .gitignore)
const MANIFEST = join(process.cwd(), 'tmp', 'foto-manifest.json');

/** Zet een Firestore REST-waarde om naar gewone JSON. */
function waarde(v) {
  if (!v) return undefined;
  if ('stringValue'  in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue'  in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue'    in v) return null;
  if ('arrayValue'   in v) return (v.arrayValue.values ?? []).map(waarde);
  if ('mapValue'     in v) return velden(v.mapValue.fields);
  return undefined;
}
const velden = (f = {}) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, waarde(v)]));

async function haal(pad) {
  const res = await fetch(`${BASIS}/${pad}`);
  if (!res.ok) throw new Error(`${pad}: HTTP ${res.status}`);
  return res.json();
}

const manifest = {};
let aantal = 0;

/** Schrijft één data-URI weg en onthoudt het pad onder `sleutel`. */
async function bewaar(sleutel, src) {
  const m = typeof src === 'string' && src.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/);
  if (!m) return;
  const ext  = m[1] === 'jpeg' ? 'jpg' : m[1];
  const hash = createHash('sha1').update(src).digest('hex').slice(0, 12);
  const naam = `${hash}.${ext}`;
  await writeFile(join(MAP, naam), Buffer.from(m[2], 'base64'));
  // De lengte dient als controle: verandert de foto vlak vóór het prerenderen,
  // dan valt de site terug op de base64-versie in plaats van een oude foto te tonen.
  manifest[sleutel] = { pad: `fotos/${naam}`, lengte: src.length };
  aantal++;
}

try {
  await rm(MAP, { recursive: true, force: true });
  await mkdir(MAP, { recursive: true });

  const site = velden((await haal('site/data')).fields);
  for (const b of site.behandelingen ?? []) await bewaar(`beh:${b.id}`, b.foto);

  let token = '';
  do {
    const lijst = await haal(`portfolioCases?pageSize=300${token ? `&pageToken=${token}` : ''}`);
    for (const d of lijst.documents ?? []) {
      const c = velden(d.fields);
      for (const f of c.fotos ?? []) await bewaar(`pf:${c.id}/${f.id}`, f.src);
    }
    token = lijst.nextPageToken ?? '';
  } while (token);

  console.log(`Foto's uit Firestore: ${aantal} bestand(en) in public/fotos/`);
} catch (err) {
  console.warn(`Foto's uit Firestore niet opgehaald (${err.message}); de site gebruikt de base64-versies.`);
}

await mkdir(join(process.cwd(), 'tmp'), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
