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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';

import { OrgSettingsIdentityProviderComponent } from './org-settings-identity-provider.component';

import { OrganizationSettingsModule } from '../organization-settings.module';
import { GioFormCardGroupHarness } from '../../../shared/components/form-card-group/gio-form-card-group.harness';

describe('OrgSettingsIdentityProviderComponent', () => {
  let fixture: ComponentFixture<OrgSettingsIdentityProviderComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, OrganizationSettingsModule],
    });

    fixture = TestBed.createComponent(OrgSettingsIdentityProviderComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should change provider type', async () => {
    const formCardGroup = await loader.getHarness(GioFormCardGroupHarness.with({ selector: '[formControlName=type]' }));

    expect(await formCardGroup.getSelectedValue()).toEqual('GRAVITEEIO_AM');

    await formCardGroup.select('GITHUB');

    expect(await formCardGroup.getSelectedValue()).toEqual('GITHUB');
  });
});
