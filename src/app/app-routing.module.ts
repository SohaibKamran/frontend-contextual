import { StreamerGuard } from './core/guards/streamer.guard';
// Angular Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { LoginComponent } from './account/login/login.component';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { DashboardContainerComponent } from './pages/indexer-dashboard/dashboard-container/dashboard-container.component';
import { ROLES } from './account/register/roles';
import { AuthGuard } from './theme/shared/components/_helpers';
import { Observable } from 'rxjs';
import { TaggerAuthGuard } from './core/guards/tagger-auth.guard';
import { UserAuthGuard } from './core/guards/user-auth.guard';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,

    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'videos',
        loadChildren: () => import('./pages/videos/videos.module').then(m => m.VideosModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'streamer-dashboard',
        loadChildren: () => import('./pages/streamer-dashboard/streamer-dashboard.module').then(m => m.StreamerDashboardModule),
        canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'database',
        loadChildren: () => import('./pages/database/database.module').then(m => m.DatabaseModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'demo',
        loadChildren: () => import('./pages/ad-inventory/ad-inventory.module').then(m => m.AdInventoryModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'manage-streamer',
        loadChildren: () => import('./pages/manage-streamer/manage-streamer.module').then(m => m.ManageStreamerModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'manage-annotators',
        loadChildren: () => import('./pages/manage-annotators/manage-annotators.module').then(m => m.ManageAnnotatorsModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'manage-advertisers',
        loadChildren: () => import('./pages/manage-advertisers/manage-advertisers.module').then(m => m.ManageAdvertisersModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'user-accounts',
        loadChildren: () => import('./pages/user-accounts/user-accounts.module').then(m => m.UserAccountsModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'scene-mapping',
        loadChildren: () => import('./pages/scene-mapping/scene-mapping.module').then(m => m.SceneMappingModule), canActivate: [AuthGuard],
        data: {
          role: ROLES.superAdmin
        }
      },
      {
        path: 'addEpisode',
        loadChildren: () => import('./pages/new-tv-episode/new-tv-episode.module').then(m => m.NewTVEpisodeModule), data: { title: 'Add Episode' }
      },
      {
        path: 'addMovie',
        loadChildren: () => import('./pages/new-movie/new-movie.module').then(m => m.NewMovieModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/tagger/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'tagger',
        loadChildren: () => import('./pages/tagger/tagger.module').then(m => m.TaggerModule), canActivate: [TaggerAuthGuard],
        data: {
          role: ROLES.tagger
        }
      },

      {
        path: 'indexer',
        component: DashboardContainerComponent,
        loadChildren: () => import('./pages/indexer-dashboard/indexer-dashboard.module').then(m => m.IndexerDashboardModule), canActivate: [TaggerAuthGuard, AuthGuard],
        data: {
          role: ROLES.tagger
        }
      },
      {
        path: 'streamer',
        loadChildren: () => import('./pages/streamer/streamer.module').then(m => m.StreamerModule), canActivate: [StreamerGuard,AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () => import('./pages/demo-user/demo-user.module').then(m => m.DemoUserModule), canActivate: [UserAuthGuard, AuthGuard]
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [{
      path: '',
      loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
    }]
  },
  {
    path: 'auth',
    component: GuestComponent,
    children: [{
      path: '',
      loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
