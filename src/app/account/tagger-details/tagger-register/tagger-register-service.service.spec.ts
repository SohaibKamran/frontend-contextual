import { TestBed } from '@angular/core/testing';

import { TaggerRegisterServiceService } from './tagger-register-service.service';

describe('TaggerRegisterServiceService', () => {
  let service: TaggerRegisterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaggerRegisterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
