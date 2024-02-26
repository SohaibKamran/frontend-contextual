import { TestBed } from '@angular/core/testing';

import { TaggerResetPasswordService } from './tagger-reset-password.service';

describe('TaggerResetPasswordService', () => {
  let service: TaggerResetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaggerResetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
