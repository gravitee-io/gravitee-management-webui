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

import {StateParams, StateService} from '@uirouter/core';
import ApiService from "../../../../../services/api.service";
import NotificationService from "../../../../../services/notification.service";
import _ = require('lodash');

class ApiResponseTemplateController {
  private api: any;
  private initialApi: any;

  private selectedStatusCode: any;
  private selectedTemplateKey: any;
  private formResponseTemplate: any;
  private creation: boolean = false;
  private keys: any;
  private templates:  any;

  constructor (
    private ApiService: ApiService,
    private NotificationService: NotificationService,
    private $rootScope: ng.IRootScopeService,
    private $scope,
    private $stateParams: StateParams,
    private $state: StateService,
  ) {
    'ngInject';

    this.creation = (this.$stateParams.key === undefined);
    this.selectedTemplateKey = this.$stateParams.key;

    this.initialApi = _.cloneDeep(this.$scope.$parent.apiCtrl.api);
    this.api = _.cloneDeep(this.$scope.$parent.apiCtrl.api);

    this.templates = [];

    if (this.api.response_templates && this.api.response_templates[this.$stateParams.key]) {
      Object
        .keys(this.api.response_templates[this.$stateParams.key])
        .forEach(type => {
          let template = this.api.response_templates[this.$stateParams.key][type];
          this.templates.push({
            type: type,
            status: template.status,
            body: template.body,
            headers:
              (template.headers) ?
                Object.keys(template.headers).map(name => ({name, value: template.headers[name]})) : []
          });
        });
    }

    this.keys = [
      'API_KEY_MISSING',
      'API_KEY_INVALID',
      'RATE_LIMIT_TOO_MANY_REQUESTS',
      'QUOTA_TOO_MANY_REQUESTS',
      'JSON_VALIDATION_INVALID'
    ];
  }

  onSelectedTemplateKey (key) {
    this.selectedTemplateKey = key;
  }

  querySearchTemplateKey (query) {
    return query ? this.keys.filter(this.createFilterForTemplateKey(query)) : this.keys;
  }

  createFilterForTemplateKey (query) {
    return function filterFn(state) {
      return (state.indexOf(query) === 0);
    };
  }

  addTemplate() {
    this.templates.push({
      type: '*/*',
      status: 400,
      headers: []
    });
  }

  deleteTemplate(type) {
    _.remove(this.templates, (template: any) => template.type === type);
    this.formResponseTemplate.$setDirty();
  }

  update() {
    let apiResponseTemplates = this.api['response_templates'] ||  {};

    if (this.templates.length > 0) {
      apiResponseTemplates[this.selectedTemplateKey] =
        _.mapValues(
          _.keyBy(this.templates, (template) => template.type),
          (template) => {
            return {
              status: template.status,
              headers: _.mapValues(_.keyBy(template.headers, 'name'), 'value'),
              body: template.body
            };
          });
      this.api['response_templates'] = apiResponseTemplates;
    } else {
      delete this.api['response_templates'][this.selectedTemplateKey];
    }

    this.ApiService.update(this.api).then((updatedApi) => {
      this.api = updatedApi.data;
      this.api.etag = updatedApi.headers('etag');
      this.onApiUpdate();
    });
  }

  onApiUpdate() {
    this.$rootScope.$broadcast('apiChangeSuccess', {api: this.api});
    this.NotificationService.show('Response template saved for key: ' + this.selectedTemplateKey);
    this.$state.go('management.apis.detail.proxy.responsetemplates.list');
  }

  reset() {
    this.selectedStatusCode = null;
    if (this.creation) {
      this.selectedTemplateKey = null;
    }
    this.api = _.cloneDeep(this.initialApi);
    if (this.formResponseTemplate) {
      this.formResponseTemplate.$setPristine();
      this.formResponseTemplate.$setUntouched();
    }

  }
}

export default ApiResponseTemplateController;
