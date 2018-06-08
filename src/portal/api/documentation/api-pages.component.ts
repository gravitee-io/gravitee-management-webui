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
import * as _ from 'lodash';
// import * as templatePages from './api-pages.html';

const ApiPagesComponent: ng.IComponentOptions = {
  bindings: {
    pages: '<',
    api: '<'
  },
  template: require('./api-pages.html'),
  controller: function($state, $stateParams, $location) {
    'ngInject';

    this.$onInit = function() {

      this.pagesTree = [];
      this.pagesByTitle = new Map();

      var filterByTitle = function(map, page, title, name) {

        if (title && name) {

          if (!map.has(title)) {
            map.set(title, new Array());
          }

          map.get(title).push(page);

          page.name = name;
        }
      };

      var filterTree = function(array, page, title) {
        if (title) {
          array.push(title);
        } else {
          array.push(page);
        }
      } ;

      this.pages.forEach(page => {
        var selected = ($stateParams.pageId && page.id === $stateParams.pageId);

        var title = undefined;
        var name = undefined;

        if (page.name.indexOf("::") !== -1) {
          title = page.name.split("::")[0];
          name = page.name.split("::")[1];
        }

        filterTree(this.pagesTree, page, title);
        filterByTitle(this.pagesByTitle, page, title, name);
        page.selected = selected;

      });

      this.pagesTree = this.pagesTree
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(title => {
        var toReturn = title;
        if (typeof title === 'string') toReturn = {"value": title, "selected": false};
        return toReturn;
      });

      if (this.pages.length && !$stateParams.pageId) {
        $location.url(`/apis/${$stateParams.apiId}/pages/${this.pages[0].id}`);
      }

    };

    this.getPages = function(title: String) {
      return this.pagesByTitle.get(title);
    };

    this.isTitleObj = function(value) {
      return value["value"] !== undefined;
    };

    this.selectPage = function (page) {
      _.each(this.pages, function(p) { p.selected = false; });
      page.selected = true;
      $state.go('portal.api.pages.page', {pageId: page.id});
    }

    this.selectPageWithTilte = function (title) {
      var pageId;
      _.each(this.pages, function(p) {
        p.selected = false;
        if (p.name === title) {
          p.selected = true;
          this.pageLevel1Selected = p;
          pageId = p.id;
        }
      });

      $state.go('portal.pages.page', {pageId: pageId});
    };
  }
};

export default ApiPagesComponent;
