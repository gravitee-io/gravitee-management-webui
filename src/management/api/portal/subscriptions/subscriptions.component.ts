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
import ApiService from "../../../../services/api.service";
import NotificationService from "../../../../services/notification.service";
import { PagedResult } from "../../../../entities/pagedResult";
import { StateService } from '@uirouter/core';
import apisAnalyticsRouterConfig from '../../analytics/apis.analytics.route';

export class SubscriptionQuery {
  status?: string[] = ['ACCEPTED', 'PENDING', 'PAUSED'];
  applications?: string[];
  plans?: string[];
  page?: number = 1;
  size?: number = 20;
}

const ApiSubscriptionsComponent: ng.IComponentOptions = {
  bindings: {
    api: '<',
    plans: '<',
    subscriptions: '<',
    subscribers: '<'
  },
  template: require('./subscriptions.html'),
  controller: class {

    private subscriptions: PagedResult;
    private allSubscriptionsForExport: any[];
    private api: any;

    private query: SubscriptionQuery = new SubscriptionQuery();

    private status = {
      'ACCEPTED': 'Accepted',
      'CLOSED': 'Closed',
      'PAUSED': 'Paused',
      'PENDING': 'Pending',
      'REJECTED': 'Rejected'
    };

    private subscriptionsFiltersForm: any;

    constructor(
      private ApiService: ApiService,
      private NotificationService: NotificationService,
      private $mdDialog: angular.material.IDialogService,
      private $state: StateService
    ) {
      'ngInject';

      this.onPaginate = this.onPaginate.bind(this);
      
    }

    onClickExport(){
      
      this.allSubscriptionsForExport = [];
      this.getAllSubscriptionsForExport(1); 
    }

    getAllSubscriptionsForExport(page){
      let query = this.buildQuery(page, 100);
      this.ApiService.getSubscriptions(this.api.id, query).then((response) => {
        var data = response.data as PagedResult;
        var that = this;
        data.data.forEach(function(subscription){
          that.allSubscriptionsForExport.push([
            data.metadata[subscription.api].name, 
            data.metadata[subscription.plan].name, 
            data.metadata[subscription.application].name, 
            that.formatDate(new Date(subscription.created_at)), 
            that.formatDate(new Date(subscription.processed_at)), 
            that.formatDate(new Date(subscription.starting_at)), 
            subscription.ending_at == undefined ? "" : that.formatDate(new Date(subscription.ending_at)), 
            subscription.closed_at == undefined ? "" : that.formatDate(new Date(subscription.closed_at)), 
            subscription.status.toUpperCase()
          ]);
        });
        if(data.page.total_pages > page){
          this.getAllSubscriptionsForExport(page+1);
        }else{
          this.generateExport();
        }
      });
    }

    generateExport() {
      let headers = "API,PLAN,APPLICATION,CREATED_AT,PROCESSED_AT,STARTING_AT,ENDING_AT,CLOSED_AT,STATUS\n";
      let csvContent = headers + this.allSubscriptionsForExport.map(e=>e.join(",")).join("\n");
      let file = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
      let apiName = this.api.name;
      apiName = apiName.replace(/[\s]/gi, '-');
      apiName = apiName.replace(/[^\w]/gi, '-');
      let fileName = apiName+"-subscriptions.csv";
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(file, fileName);
      } else {
        var link = document.createElement("a");
        var url = URL.createObjectURL(file);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(function() {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);  
        }, 0); 
      }
    }

    formatDate(date){
      return this.pad(date.getMonth()+1)+"-"+this.pad(date.getDate())+"-"+date.getFullYear()+" "+this.pad(date.getHours())+":"+this.pad(date.getMinutes())+":"+this.pad(date.getSeconds());
    }

    pad(n) {
      return n<10 ? '0'+n : n;
    }

    onPaginate(page) {
      this.query.page = page;
      this.doSearch();
    }

    clearFilters() {
      this.subscriptionsFiltersForm.$setPristine();
      this.query = new SubscriptionQuery();
      this.doSearch();
    }

    search() {
      this.query.page = 1;
      this.query.size = 20;
      this.doSearch();
    }

    buildQuery(inPage = null, inSize = null) {
      let page = inPage != null ? inPage : this.query.page;
      let size = inSize != null ? inSize : this.query.size;
      let query = '?page=' + page + '&size=' + size + '&';
      let parameters = {};

      if (this.query.status !== undefined) {
        parameters['status'] = this.query.status.join(',');
      }

      if (this.query.applications !== undefined) {
        parameters['application'] = this.query.applications.join(',');
      }

      if (this.query.plans !== undefined) {
        parameters['plan'] = this.query.plans.join(',');
      }

      _.mapKeys(parameters, (value, key ) => {
        return query += key + '=' + value + '&';
      });

      return query;
    }

    doSearch() {
      let query = this.buildQuery();

      this.ApiService.getSubscriptions(this.api.id, query).then((response) => {
        this.subscriptions = response.data as PagedResult;
      });
    }

    showAddSubscriptionModal() {
      this.ApiService.getPublishedApiPlans(this.api.id).then( (response) => {
        // Allow only subscribable plan
        let plans = _.filter(response.data, (plan: any) => { return plan.security !== 'key_less'; });

        this.$mdDialog.show({
          controller: 'DialogSubscriptionCreateController',
          controllerAs: 'dialogSubscriptionCreateController',
          template: require('./subscription.create.dialog.html'),
          clickOutsideToClose: true,
          locals: {
            api: this.api,
            plans: plans
          }
        }).then( (data) => {
          if (data && data.applicationId && data.planId) {
            this.ApiService.subscribe(this.api.id, data.applicationId, data.planId).then( (response) => {
              let subscription = response.data;
              this.NotificationService.show('A new subscription has been created.');
              this.$state.go('management.apis.detail.portal.subscriptions.subscription', {subscriptionId: subscription.id}, {reload: true});
            });
          }
        });
      });
    }
  }
};

export default ApiSubscriptionsComponent;
