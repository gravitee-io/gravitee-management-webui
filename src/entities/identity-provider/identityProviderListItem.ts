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
import { IdentityProviderType } from './identityProvider';

export interface IdentityProviderListItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sync: boolean;
  type: IdentityProviderType;
  created_at: number;
  updated_at: number;
}

export const GraviteeIdpListItem: IdentityProviderListItem = {
  id: 'gravitee',
  name: 'Gravitee',
  description: 'Gravitee Identity Provider',
  enabled: true,
  sync: false,
  type: 'GRAVITEE',
  created_at: 0,
  updated_at: 0,
};