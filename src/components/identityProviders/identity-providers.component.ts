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
import { StateService } from '@uirouter/core';
import { IdentityProvider, IdentityProviderActivation } from '../../entities/identityProvider';
import IdentityProviderService from '../../services/identityProvider.service';
import NotificationService from '../../services/notification.service';
import PortalConfigService from '../../services/portalConfig.service';
import { IScope } from 'angular';
import OrganizationService from '../../services/organization.service';
import EnvironmentService from '../../services/environment.service';
import UserService from '../../services/user.service';
import _ = require('lodash');

const IdentityProvidersComponent: ng.IComponentOptions = {
  bindings: {
    identityProviders: '<',
    identities: '<',
    target: '<',
    targetId: '<'
  },
  template: require('./identity-providers.html'),
  controller: function (
    $mdDialog: angular.material.IDialogService,
    IdentityProviderService: IdentityProviderService,
    EnvironmentService: EnvironmentService,
    OrganizationService: OrganizationService,
    PortalConfigService: PortalConfigService,
    NotificationService: NotificationService,
    UserService: UserService,
    $state: StateService,
    Constants,
    $rootScope: IScope
  ) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.activatedIdps = {};
    this.settings = _.cloneDeep(Constants);

    this.$onInit = () => {
      this.identities.forEach((ipa: IdentityProviderActivation) => this.activatedIdps[ipa.identityProvider] = true);
      this.socialIdentityProviders = _.filter(this.identityProviders, idp => idp.type === 'github' || idp.type === 'google' || idp.type === 'graviteeio_am' || idp.type === 'oidc');
      this.internalIdentityProviders = _.filter(this.identityProviders, idp => idp.type === 'memory' || idp.type === 'gravitee' || idp.type === 'ldap');
    };

    this.currentUserSource = UserService.currentUser.source;
    this.availableProviders = [
      { 'name': 'Gravitee.io AM', 'icon': 'perm_identity', 'type': 'graviteeio_am' },
      { 'name': 'Google', 'icon': 'google-plus', 'type': 'google' },
      { 'name': 'GitHub', 'icon': 'github-circle', 'type': 'github' },
      { 'name': 'LDAP', 'icon': 'group', 'type': 'ldap' },
      { 'name': 'OpenID Connect', 'icon': 'perm_identity', 'type': 'oidc' }
    ];

    this.create = (type) => {
      $state.go('management.settings.organization.identityproviders.new', { type: type });
    };

    this.delete = (provider: IdentityProvider) => {
      if (this.currentUserSource === provider.id) {
        var alert = $mdDialog.alert()
          .title('Attention')
          .textContent('Deleting this identity provider is forbidden since you have been authenticated with')
          .ok('Close');

        $mdDialog.show(alert);
      } else {
        let that = this;
        $mdDialog.show({
          controller: 'DialogConfirmController',
          controllerAs: 'ctrl',
          template: require('../dialog/confirmWarning.dialog.html'),
          clickOutsideToClose: true,
          locals: {
            title: 'Are you sure you want to delete this identity provider?',
            msg: '',
            confirmButton: 'Delete'
          }
        }).then(function (response) {
          if (response) {
            IdentityProviderService.delete(provider).then(response => {
              NotificationService.show('Identity provider \'' + provider.name + '\' has been deleted');
              $state.go('management.settings.organization.identityproviders.list', {}, { reload: true });
            });
          }
        });
      }
    };

    this.saveForceLogin = () => {
      PortalConfigService.save({
        authentication: {
          forceLogin: {
            enabled: this.settings.authentication.forceLogin.enabled
          }
        }
      }).then(response => {
        NotificationService.show('Authentication is now ' + (this.settings.authentication.forceLogin.enabled ? 'mandatory' : 'optional'));
        Constants.authentication.forceLogin = response.data.authentication.forceLogin;
      });
    };

    this.saveShowLoginForm = () => {
      PortalConfigService.save({
        authentication: {
          localLogin: {
            enabled: this.settings.authentication.localLogin.enabled
          }
        }
      }).then(response => {
        NotificationService.show('Login form is now ' + (this.settings.authentication.localLogin.enabled ? 'enabled' : 'disabled'));
        Constants.authentication.localLogin = response.data.authentication.localLogin;
      });
    };

    this.toggleActivatedIdp = (identityProviderId: string) => {
      const updatedIPA: IdentityProviderActivation[] =
        _.filter(Object.keys(this.activatedIdps), idpId => this.activatedIdps[idpId] === true)
          .map(idpId => ({ identityProvider: idpId }));

      if (this.target === 'ORGANIZATION') {
        OrganizationService.updateOrganizationIdentities(updatedIPA).then(response =>
          NotificationService.show(identityProviderId + ' is now ' + (this.activatedIdps[identityProviderId] ? 'enabled' : 'disabled'))
        );
      } else if (this.target === 'ENVIRONMENT') {
        EnvironmentService.updateEnvironmentIdentities(this.targetId, updatedIPA).then(response =>
          NotificationService.show(identityProviderId + ' is now ' + (this.activatedIdps[identityProviderId] ? 'enabled' : 'disabled'))
        );
      }
    };

    this.changeIdentityProviderStatus = (identityProvider: IdentityProvider) => {
      if (this.currentUserSource === identityProvider.id) {
        var alert = $mdDialog.alert()
          .title('Attention')
          .textContent('Disabling this identity provider is forbidden since you have been authenticated with')
          .ok('Close');
        identityProvider.enabled = true;
        $mdDialog.show(alert);
      } else {
        IdentityProviderService.get(identityProvider.id).then(response => {
          let idp: IdentityProvider = response;
          idp.enabled = identityProvider.enabled;
          IdentityProviderService.update(idp).then(response => {
            NotificationService.show('Identity provider \'' + idp.name + '\' has been updated');
          });
        });
      }
    };

    this.upward = (identityProvider: IdentityProvider) => {
      IdentityProviderService.get(identityProvider.id).then(response => {
        let idp: IdentityProvider = response;
        idp.order = idp.order - 1;
        IdentityProviderService.update(idp).then(response => {
          NotificationService.show('Identity provider \'' + idp.name + '\' order has been changed with success');
          this.refresh();
        });
      });
    };

    this.downward = (identityProvider: IdentityProvider) => {
      IdentityProviderService.get(identityProvider.id).then(response => {
        let idp: IdentityProvider = response;
        idp.order = idp.order + 1;
        IdentityProviderService.update(idp).then(response => {
          NotificationService.show('Identity provider \'' + idp.name + '\' order has been changed with success');
          this.refresh();
        });
      });
    };

    this.refresh = () => {
      IdentityProviderService.list().then(response => {
        this.identityProviders = response;
        this.internalIdentityProviders = _.filter(this.identityProviders, idp => idp.type === 'memory' || idp.type === 'gravitee' || idp.type === 'ldap');

      });
    };
  }
};

export default IdentityProvidersComponent;
