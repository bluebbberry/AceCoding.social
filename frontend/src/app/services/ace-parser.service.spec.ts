import { TestBed } from '@angular/core/testing';

import { AceParserService } from './ace-parser.service';

describe('AceParserService', () => {
  let service: AceParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AceParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
