import { Host, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddbookComponent } from './addbook/addbook.component';
import { AdminComponent } from './admin/admin.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { BookrequestsComponent } from './bookrequests/bookrequests.component';
import { BorrowedComponent } from './borrowed/borrowed.component';
import { GuestComponent } from './guest/guest.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';
import { ReaderComponent } from './reader/reader.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { TopthreeComponent } from './topthree/topthree.component';

const routes: Routes = [
  {path:"", component:GuestComponent},
  {path:'search', component:SearchComponent},
  {path:'info/:id', component:BookInfoComponent},
  { path:'reader', component:ReaderComponent},
  {path:'admin', component: AdminComponent},
  {path:'profile', component:ProfileComponent},
  {path:'register', component:RegisterComponent},
  {path:'borrowed',component:BorrowedComponent},
  {path:'history',component:HistoryComponent},
  {path:'addbook',component:AddbookComponent},
  {path:'bookrequests',component:BookrequestsComponent},
  {path:'topthree',component:TopthreeComponent},
  {path:'admin/:page',component:AdminComponent}
  /*{
    path:'register',
    component: RegisterComponent
  }
*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
