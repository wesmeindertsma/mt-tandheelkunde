import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { FOTO_MANIFEST, FotoManifest } from './services/data.service';

/** Overzicht van de foto's die scripts/fotos-uit-firestore.mjs vóór de build heeft weggeschreven. */
function leesFotoManifest(): FotoManifest {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'tmp', 'foto-manifest.json'), 'utf8'));
  } catch {
    return {};
  }
}

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [{ provide: FOTO_MANIFEST, useFactory: leesFotoManifest }],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
