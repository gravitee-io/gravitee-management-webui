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

import { RoleService } from './role.service';

import { CONSTANTS_TESTING, GioHttpTestingModule } from '../shared/testing';
import { fakeRole } from '../entities/role/role.fixture';

describe('RoleService', () => {
  let httpTestingController: HttpTestingController;
  let roleService: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GioHttpTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    roleService = TestBed.inject<RoleService>(RoleService);
  });

  describe('list', () => {
    it('should call the API', (done) => {
      const fakeRoles = [fakeRole()];
      const scope = 'SCOPE';

      roleService.list(scope).subscribe((roles) => {
        expect(roles).toMatchObject(fakeRoles);
        done();
      });

      const req = httpTestingController.expectOne(`${CONSTANTS_TESTING.org.baseURL}/configuration/rolescopes/${scope}/roles`);
      expect(req.request.method).toEqual('GET');

      req.flush(fakeRoles);
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
