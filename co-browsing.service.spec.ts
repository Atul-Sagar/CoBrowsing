import { TestBed } from '@angular/core/testing';

import { CoBrowsingService } from './co-browsing.service';

describe('CoBrowsingService', () => {
  let service: CoBrowsingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoBrowsingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
