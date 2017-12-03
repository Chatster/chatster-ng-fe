import { TestBed, inject } from '@angular/core/testing';

import { HeaderBarService } from './header-bar.service';

describe('HeaderBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderBarService]
    });
  });

  it('should be created', inject([HeaderBarService], (service: HeaderBarService) => {
    expect(service).toBeTruthy();
  }));
});
