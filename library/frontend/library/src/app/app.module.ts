import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuestComponent } from './guest/guest.component';
import {HttpClientModule} from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { ReaderComponent } from './reader/reader.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { AddbookComponent } from './addbook/addbook.component';
import { RegisterComponent } from './register/register.component';
import { BorrowedComponent } from './borrowed/borrowed.component';
import { HistoryComponent } from './history/history.component';
import { BookrequestsComponent } from './bookrequests/bookrequests.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditbookComponent } from './editbook/editbook.component';
import { TopthreeComponent } from './topthree/topthree.component';


@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    SearchComponent,
    BookInfoComponent,
    ReaderComponent,
    AdminComponent,
    ProfileComponent,
    AddbookComponent,
    RegisterComponent,
    BorrowedComponent,
    HistoryComponent,
    BookrequestsComponent,
    EditbookComponent,
    TopthreeComponent  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
