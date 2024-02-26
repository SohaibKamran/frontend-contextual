import { TestBed } from '@angular/core/testing';

import { ManageAdvertisersService } from './manage-advertisers.service';

describe('ManageAdvertisersService', () => {
  let service: ManageAdvertisersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageAdvertisersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
