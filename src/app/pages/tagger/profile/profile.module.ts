import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { CoreModule } from '../../../core/core.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './profile.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        ProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgSelectModule

    ],
    providers: [ProfileService]
})
export class ProfileModule { }
