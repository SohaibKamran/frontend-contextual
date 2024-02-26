import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserAuthGuard } from 'src/app/core/guards/user-auth.guard';
import { AuthGuard } from 'src/app/theme/shared/components/_helpers';
import { ROLES } from 'src/app/account/register/roles';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./watch-video/watch-video.module').then(m => m.WatchVideoModule), canActivate: [UserAuthGuard, AuthGuard],
    data: {
      role: ROLES.viewer
    }
  },
  {
    path: 'shopping', loadChildren: () => import('./my-shopping/my-shopping.module').then(m => m.MyShoppingModule), canActivate: [UserAuthGuard, AuthGuard],
    data: {
      role: ROLES.viewer
    }
  },
  {
    path: 'my-emails', loadChildren: () => import('./my-email/my-email.module').then(m => m.MyEmailModule), canActivate: [UserAuthGuard, AuthGuard],
    data: {
      role: ROLES.viewer
    }
  },
  {
    path: 'media-buys', loadChildren: () => import('./media-buys/media-buys.module').then(m => m.MyMediaBuysComponent), canActivate: [UserAuthGuard, AuthGuard],
    data: {
      role: ROLES.viewer
    }
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {path: 'feedback', 
  component: FeedbackComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoUserRoutingModule { }
