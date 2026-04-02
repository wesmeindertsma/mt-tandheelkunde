import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BeheerComponent } from './beheer.component';

@NgModule({
  declarations: [BeheerComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BeheerComponent }])
  ]
})
export class BeheerModule {}
