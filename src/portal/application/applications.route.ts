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
import ApplicationService from '../../services/application.service';
import GroupService from '../../services/group.service';
import * as _ from 'lodash';
import UserService from "../../services/user.service";
import {StateParams} from '@uirouter/core';

export default function applicationsConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('portal.applications', {
      abstract: true,
      url: '/applications'
    })
    .state('portal.applications.list', {
      url: '/',
      component: 'portalApplications',
      data: {
        devMode: true
      },
      resolve: {
        applications: (ApplicationService: ApplicationService) => ApplicationService.list().then(response => response.data)
      }
    })
    .state('portal.applications.new', {
      url: '/new',
      component: 'portalApplicationCreate',
      data: {
        perms: {
          only: ['portal-application-c']
        },
        devMode: true,
        docs: {
          page: 'management-create-application'
        }
      },
      resolve: {
        applications: (ApplicationService: ApplicationService) => ApplicationService.list().then(response => response.data)
      }
    })
    .state('portal.applications.application', {
      abstract: true,
      url: '/:applicationId',
      component: 'portalApplication',
      resolve: {
        application: ($stateParams, ApplicationService: ApplicationService) =>
          ApplicationService.get($stateParams.applicationId).then(response => response.data),
        resolvedApplicationPermissions: (ApplicationService, $stateParams) => ApplicationService.getPermissions($stateParams.applicationId),
        onEnter: function (UserService, resolvedApplicationPermissions) {
          UserService.currentUser.userApplicationPermissions = [];
          _.forEach(_.keys(resolvedApplicationPermissions.data), function (permission) {
            _.forEach(resolvedApplicationPermissions.data[permission], function (right) {
              let permissionName = 'APPLICATION-' + permission + '-' + right;
              UserService.currentUser.userApplicationPermissions.push(_.toLower(permissionName));
            });
          });
          UserService.reloadPermissions();
        }
      }
    })
    .state('portal.applications.application.general', {
      url: '/',
      data: {
        devMode: true,
        perms: {
          only: ['application-definition-r']
        },
        docs: {
          page: 'management-application'
        }
      },
      resolve: {
        groups: (UserService: UserService, GroupService: GroupService) => {
          if (UserService.currentUser.isAdmin()) {
            return GroupService.list().then((groups) => {
              return groups.data;
            });
          } else {
            return [];
          }
        }
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationGeneral'}
      }
    })
    .state('portal.applications.application.subscriptions', {
      url: '/subscriptions',
      resolve: {
        subscriptions: ($stateParams, ApplicationService: ApplicationService) =>
          ApplicationService.listSubscriptions($stateParams.applicationId).then(response => response.data),

        subscribers: ($stateParams, ApplicationService: ApplicationService) =>
          ApplicationService.getSubscribedAPI($stateParams.applicationId).then(response => response.data)
      },
      data: {
        devMode: true,
        perms: {
          only: ['application-subscription-r']
        },
        docs: {
          page: 'management-application-subscriptions'
        }
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationSubscriptions'}
      }
    })
    .state('portal.applications.application.subscriptions.subscription', {
      url: '/:subscriptionId',
      resolve: {
        subscription: ($stateParams, ApplicationService: ApplicationService) =>
          ApplicationService.getSubscription($stateParams.applicationId, $stateParams.subscriptionId).then(response => response.data)
      },
      data: {
        perms: {
          only: ['application-subscription-r']
        },
        docs: {
          page: 'management-application-subscriptions'
        }
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationSubscription'}
      }
    })
    .state('portal.applications.application.members', {
      url: '/members',
      resolve: {
        members: ($stateParams, ApplicationService: ApplicationService) =>
          ApplicationService.getMembers($stateParams.applicationId).then(response => response.data),
        resolvedGroups: (GroupService: GroupService) => {
          return GroupService.list().then(response => {
            return response.data;
          });
        },
      },
      data: {
        devMode: true,
        perms: {
          only: ['application-member-r']
        },
        docs: {
          page: 'management-application-members'
        }
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationMembers'}
      }
    })
    .state('portal.applications.application.analytics', {
      url: '/analytics?from&to&q',
      data: {
        devMode: true,
        perms: {
          only: ['application-analytics-r']
        },
        docs: {
          page: 'management-application-analytics'
        }
      },
      params: {
        from: {
          type: "int",
          dynamic: true
        },
        to: {
          type: "int",
          dynamic: true
        },
        q: {
          type: 'string',
          dynamic: true
        }
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationAnalytics'}
      }
    })
    .state('portal.applications.application.logs', {
      url: '/logs?from&to&q',
      data: {
        devMode: true,
        perms: {
          only: ['application-log-r']
        },
        docs: {
          page: 'management-application-logs'
        }
      },
      params: {
        from: {
          type: 'int',
          dynamic: true
        },
        to: {
          type: 'int',
          dynamic: true
        },
        q: {
          type: 'string',
          dynamic: true
        }
      },
      resolve: {
        apis: ($stateParams: StateParams, ApplicationService: ApplicationService) =>
          ApplicationService.getSubscribedAPI($stateParams.applicationId)
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationLogs'}
      }
    })
    .state('portal.applications.application.log', {
      url: '/logs/:logId?timestamp&from&to&q',
      resolve: {
        log: ($stateParams, ApplicationService: ApplicationService) =>
          ApplicationService.getLog($stateParams.applicationId, $stateParams.logId, $stateParams.timestamp).then(response => response.data)
      },
      data: {
        devMode: true,
        perms: {
          only: ['application-log-r']
        }
      },
      views: {
        'header': {component: 'portalApplicationHeader'},
        'content': {component: 'portalApplicationLog'}
      }
    });
}
