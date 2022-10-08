import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
   imports: [CommonModule, FormsModule],
   exports: [CommonModule, FormsModule],
})
export class SharedModule {}
