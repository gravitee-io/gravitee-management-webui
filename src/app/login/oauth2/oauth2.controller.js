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
function OAuth2Controller($window, $state, $location, $cookieStore) {
  'ngInject';

  // get access token parameter (implicit grant flow)
  var responseParameters = $location.path().substr(1).split("&");

  // decode access token
  var parameterMap = [];
  for(var i = 0; i < responseParameters.length; i++) {
    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
  }

  // handle access token
  if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
    var access_token = parameterMap.access_token;
    $cookieStore.put('access_token', access_token);
    $window.location.href = $window.location.pathname;
  } else {
    $state.go('home');
  }
}

export default OAuth2Controller;
