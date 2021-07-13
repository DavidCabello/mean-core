import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NamePipe } from './pipes/name.pipe';

//COMPONENTS
import { FooterComponent } from './snippets/footer/footer.component';
import { HeaderComponent } from './snippets/header/header.component';
import { LoadingButtonComponent } from './snippets/loading-button/loading-button.component';
import { MenuComponent } from './snippets/menu/menu.component';
import { ModalComponent } from './snippets/modal/modal.component';
import { LoaderComponent } from './snippets/loader/loader.component';
import { NotificationsComponent } from './snippets/notifications/notifications.component';
import { CalendarPipe } from './pipes/calendar.pipe';

const components = [
  FooterComponent,
  HeaderComponent,
  LoadingButtonComponent,
  MenuComponent,
  ModalComponent,
  LoaderComponent,
  NotificationsComponent,
  NamePipe,
  CalendarPipe
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: components
})
export class SharedModule { }
