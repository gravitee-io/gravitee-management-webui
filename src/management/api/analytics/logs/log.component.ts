import {StateService} from "@uirouter/core";
import NotificationService from '../../../../services/notification.service';

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
const LogComponent: ng.IComponentOptions = {
  bindings: {
    log: '<'
  },
  controller: function($state: StateService, Constants: any, NotificationService: NotificationService) {
    'ngInject';
    this.Constants = Constants;
    this.backStateParams = {
      from: $state.params['from'],
      to: $state.params['to'],
      q: $state.params['q'],
    };
    
    this.getMimeType = function(log) {

      if (log.headers['Content-Type'] !== undefined) {
        let contentType = log.headers['Content-Type'][0];
        return contentType.split(';', 1)[0];
      }

      return null;
    };
    this.getCurl = function(log, scope){
      var request = (scope == "client") ? log.clientRequest : log.proxyRequest;
      if(scope == "client"){
        var uri = request.headers['X-Forwarded-Proto']+"://"+request.headers['Host']+request.headers['X-Forwarded-Prefix']+request.uri;
      }else{
        var uri = request.uri+"";
      }
      
      var curl = "curl -X "+request.method.toUpperCase()+" '"+uri+"'";

      curl+= (request.body != undefined) ? " -d '"+request.body+"'" : "";

      for(var headerName in request.headers){
        curl += " -H '"+headerName+":"+request.headers[headerName]+"'";
      }

      if(scope=="client"){
        this.clientCurl = curl;
        this.displayClientCurl = true;
      }else{
        this.proxyCurl = curl;
        this.displayProxyCurl = true;
      }
      
    };
    this.hideCurl = function(scope){
      if(scope == "client"){
        this.displayClientCurl = false;
      }else if(scope == "proxy"){
        this.displayProxyCurl = false;
      }
    };
    this.onCopyCurlSuccess = function(e){
      NotificationService.show('Curl has been copied to clipboard');
      e.clearSelection();
    };
  },
  template: require('./log.html')
};

export default LogComponent;
