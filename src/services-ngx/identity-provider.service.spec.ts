/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IdentityProviderService } from './identity-provider.service';

import { CONSTANTS_TESTING, GioHttpTestingModule } from '../shared/testing';
import { fakeIdentityProviderListItem } from '../entities/identity-provider/identityProviderListItem.fixture';

describe('IdentityProviderService', () => {
  let httpTestingController: HttpTestingController;
  let identityProviderService: IdentityProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GioHttpTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    identityProviderService = TestBed.inject<IdentityProviderService>(IdentityProviderService);
  });

  describe('list', () => {
    it('should return a list of identity providers', (done) => {
      const identityProviders = [
        fakeIdentityProviderListItem({ id: 'google', type: 'GOOGLE' }),
        [fakeIdentityProviderListItem({ id: 'github', type: 'GITHUB' })],
      ];

      identityProviderService.list().subscribe((identityProviders) => {
        expect(identityProviders).toEqual(identityProviders);
        done();
      });

      const req = httpTestingController.expectOne(`${CONSTANTS_TESTING.org.baseURL}/configuration/identities`);
      expect(req.request.method).toEqual('GET');

      req.flush(identityProviders);
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});