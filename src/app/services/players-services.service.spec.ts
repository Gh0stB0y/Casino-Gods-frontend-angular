import { TestBed } from '@angular/core/testing';

import { PlayersServicesService } from './players-services.service';

describe('PlayersServicesService', () => {
  let service: PlayersServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayersServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
