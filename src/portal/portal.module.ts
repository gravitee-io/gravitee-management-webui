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
import angular = require('angular');

import 'angular-material';
import 'angular-translate';
import 'angular-translate-loader-static-files';

import * as moment from 'moment';

import portalRouterConfig from './portal.route';
import authenticationConfig from '../authentication/authentication.config';
import portalI18nConfig from './portal.i18n';

// i18n
import i18nCustomLoader from './i18n/loader';

import { HomeController } from './home/home.controller';
import { PortalApisController } from './api/apis.controller';
import PortalApiListController from './api/api-list.controller';

// API
import PortalService from '../services/portal.service';
import ApiComponent from './api/api.component';
import ApiHeaderComponent from './api/header/api-header.component';
import ApiHomepageComponent from './api/home/api-homepage.component';
import ApiPlansComponent from './api/plan/api-plans.component';
import ApiSubscribeComponent from './api/subscribe/api-subscribe.component';
import ApiRatingsComponent from './api/rating/api-ratings.component';

// Documentation
import PortalPagesComponent from './components/documentation/pages.component';
import PortalPageComponent from './components/documentation/page.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import ThemeElementDirective from './components/theme/theme-element.directive';

import uiRouter from '@uirouter/angularjs';
import {permission, uiPermission} from 'angular-permission';
import StarRatingDirective from "./components/starRating/star.rating.directive";

import ApiSupport from './api/support/api-support.component';

// Views
import PortalViewsController from './views/views.controller';
import PortalViewController from './views/view/view.controller';

import RouterService from '../services/router.service';

// Applications
import applicationRouterConfig from './application/applications.route';

// Applications
import ApplicationService from '../services/application.service';
import ApplicationsComponent from './application/applications.component';
import ApplicationsController from './application/applications.controller';
import CreateApplicationsComponent from './application/create-application.component';
import ApplicationComponent from './application/details/application.component';
import ApplicationHeaderComponent from './application/header/application-header.component';
import ApplicationGeneralController from './application/details/general/application-general.controller';
import ApplicationGeneralComponent from './application/details/general/application-general.component';
import ApplicationMembersController from './application/details/members/application-members.controller';
import ApplicationMembersComponent from './application/details/members/application-members.component';
import ApplicationSubscriptionsController
  from './application/details/subscriptions/application-subscriptions.controller';
import ApplicationSubscriptionsComponent from './application/details/subscriptions/application-subscriptions.component';
import ApplicationSubscriptionComponent from './application/details/subscriptions/application-subscription.component';
import ApplicationAnalyticsController from './application/details/analytics/application-analytics.controller';
import ApplicationAnalyticsComponent from './application/details/analytics/application-analytics.component';
import ApplicationLogsController from './application/details/logs/application-logs.controller';
import ApplicationLogsComponent from './application/details/logs/application-logs.component';
import ApplicationLogComponent from './application/details/logs/application-log.component';
import DialogAddMemberController from './application/details/members/addMemberDialog.controller';
import DialogTransferApplicationController from './application/details/members/transferApplicationDialog.controller';

require('angulartics');

import {AuthProvider} from 'satellizer';
import NotificationService from "../services/notification.service";
import DocumentationService from "../services/documentation.service";

angular.module('gravitee-portal', [uiRouter, permission, uiPermission, 'ngMaterial', 'pascalprecht.translate',
  'duScroll', 'satellizer', 'angulartics', require('angulartics-google-analytics')])
  .value('duScrollOffset', 54)
  .config(portalRouterConfig)
  .config(portalI18nConfig)
  .config(authenticationConfig)
  .config(applicationRouterConfig)
  .factory('i18nCustomLoader', i18nCustomLoader)
  .controller('HomeController', HomeController)
  .controller('PortalApisController', PortalApisController)
  .controller('PortalApiListController', PortalApiListController)
  .controller('PortalViewsController', PortalViewsController)
  .controller('PortalViewController', PortalViewController)
  .component('api', ApiComponent)
  .component('apiPortalHeader', ApiHeaderComponent) // apiHeader already used in management.... :(
  .component('apiHomepage', ApiHomepageComponent)
  .component('apiPlans', ApiPlansComponent)
  .component('portalPages', PortalPagesComponent)
  .component('portalPage', PortalPageComponent)
  .component('apiSupport', ApiSupport)
  .component('apiSubscribe', ApiSubscribeComponent)
  .component('graviteeNavbar', NavbarComponent)
  .component('apiRatings', ApiRatingsComponent)
  .directive('gvThemeElement', () => ThemeElementDirective)
  .directive('gvStarRating', () => StarRatingDirective)
  .service('PortalService', PortalService)

  // Applications
  .service('ApplicationService', ApplicationService)
  .component('portalApplications', ApplicationsComponent)
  .component('portalApplication', ApplicationComponent)
  .component('portalApplicationHeader', ApplicationHeaderComponent)
  .component('portalApplicationCreate', CreateApplicationsComponent)
  .component('portalApplicationGeneral', ApplicationGeneralComponent)
  .component('portalApplicationSubscriptions', ApplicationSubscriptionsComponent)
  .component('portalApplicationSubscription', ApplicationSubscriptionComponent)
  .component('portalApplicationMembers', ApplicationMembersComponent)
  .component('portalApplicationAnalytics', ApplicationAnalyticsComponent)
  .component('portalApplicationLogs', ApplicationLogsComponent)
  .component('portalApplicationLog', ApplicationLogComponent)
  .controller('DialogAddMemberController', DialogAddMemberController)
  .controller('ApplicationsController', ApplicationsController)
  .controller('ApplicationGeneralController', ApplicationGeneralController)
  .controller('ApplicationMembersController', ApplicationMembersController)
  .controller('ApplicationSubscriptionsController', ApplicationSubscriptionsController)
  .controller('ApplicationAnalyticsController', ApplicationAnalyticsController)
  .controller('ApplicationLogsController', ApplicationLogsController)
  .controller('DialogTransferApplicationController', DialogTransferApplicationController)

  .filter('humanDateFilter', function () {
    return function(input) {
      if (!moment().subtract(1, 'weeks').isAfter(input)) {
        return moment(input).fromNow();
      } else {
        return moment(input).format('D MMM. YYYY');
      }
    };
  })
  .config(function ($mdThemingProvider: ng.material.IThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('blue');

    $mdThemingProvider.theme('sidenav')
      .backgroundPalette('grey', {
        'default': '50'
      });

    $mdThemingProvider.theme('toast-success');
    $mdThemingProvider.theme('toast-error');
  }).run(function(Constants, $window, $transitions, $location, RouterService: RouterService) {
    $transitions.onStart({to: 'login'}, function(trans) {
      RouterService.setLastRoute(trans.from(), trans.params('from'));
    });

    if ((Constants.portal.analytics && Constants.portal.analytics.enabled)) {
      const script = document.createElement('script');
      script.async = true;
      script.text = '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n' +
        '          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n' +
        '          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n' +
        '        })(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');';
      document.head.appendChild(script);

      $window.ga('create', Constants.portal.analytics.trackingId, { 'cookieDomain': 'none' });

      $transitions.onSuccess({}, function() {
        $window.ga('send', 'pageview', $location.path());
      });
    }
  });
