import { TestBed } from '@angular/core/testing';

import { AceRuntimeService } from './ace-runtime.service';

describe('AceRuntimeService', () => {
  let service: AceRuntimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AceRuntimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
