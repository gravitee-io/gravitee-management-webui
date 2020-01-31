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
import _ = require('lodash');

const IdentityProviderLdapComponent: ng.IComponentOptions = {
  bindings: {
    identityProvider: '<',
    formIdentityProvider: '<'
  },
  template: require('./identity-provider-ldap.html'),
  controller: function(
  ) {
    'ngInject';

    this.$onInit = () => {
      if (_.isEmpty(this.identityProvider.configuration)) {
        this._initProviderLdapConfiguration();
      }
    };

    this.newRoleMapping = {};

    this._initProviderLdapConfiguration = () => {
      this.identityProvider.configuration.authentication = {};
      this.identityProvider.configuration.authentication.group = {};
      this.identityProvider.configuration.authentication.group.role = {};
      this.identityProvider.configuration.authentication.group.role.mapper = {};
      this.identityProvider.configuration.context = {};
      this.identityProvider.configuration.lookup = {};
      this.identityProvider.configuration.lookup.user = {};
    };

    this.addRoleMapping = () => {
      if (this.newRoleMapping.group && this.newRoleMapping.role) {
        this.identityProvider.configuration.authentication.group.role.mapper[this.newRoleMapping.group] = this.newRoleMapping.role;
        this.formIdentityProvider.$setDirty();
        this.newRoleMapping = {};
      }
    };

    this.deleteRoleMapping = (key: string) => {
      this.formIdentityProvider.$setDirty();
      delete this.identityProvider.configuration.authentication.group.role.mapper[key];
    };
  }
};

export default IdentityProviderLdapComponent;
