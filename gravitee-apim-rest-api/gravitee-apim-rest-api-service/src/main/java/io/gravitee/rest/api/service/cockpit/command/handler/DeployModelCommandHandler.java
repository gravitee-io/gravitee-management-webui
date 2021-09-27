/**
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
package io.gravitee.rest.api.service.cockpit.command.handler;

import io.gravitee.cockpit.api.command.Command;
import io.gravitee.cockpit.api.command.CommandHandler;
import io.gravitee.cockpit.api.command.CommandStatus;
import io.gravitee.cockpit.api.command.designer.DeployModelCommand;
import io.gravitee.cockpit.api.command.designer.DeployModelPayload;
import io.gravitee.cockpit.api.command.designer.DeployModelReply;
import io.gravitee.rest.api.model.UserEntity;
import io.gravitee.rest.api.model.api.ApiEntity;
import io.gravitee.rest.api.service.ApiService;
import io.gravitee.rest.api.service.UserService;
import io.reactivex.Single;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author Julien GIOVARESCO (julien.giovaresco at graviteesource.com)
 * @author GraviteeSource Team
 */
@Component
public class DeployModelCommandHandler implements CommandHandler<DeployModelCommand, DeployModelReply> {

    private final Logger logger = LoggerFactory.getLogger(DeployModelCommandHandler.class);

    private final ApiService apiService;
    private final UserService userService;

    public DeployModelCommandHandler(ApiService apiService, UserService userService) {
        this.apiService = apiService;
        this.userService = userService;
    }

    @Override
    public Command.Type handleType() {
        return Command.Type.DEPLOY_MODEL_COMMAND;
    }

    @Override
    public Single<DeployModelReply> handle(DeployModelCommand command) {
        DeployModelPayload payload = command.getPayload();

        String apiId = payload.getModelId();
        String userId = payload.getUserId();
        String swaggerDefinition = payload.getSwaggerDefinition();

        try {
            final UserEntity user = userService.findBySource("cockpit", userId, false);
            final ApiEntity api = apiService.createFromCockpit(apiId, user.getId(), swaggerDefinition);
            logger.info("Api imported [{}].", api.getId());

            return Single.just(new DeployModelReply(command.getId(), CommandStatus.SUCCEEDED));

        } catch (Exception e) {
            logger.error(
                    "Error occurred when importing api [{}].",
                    payload.getModelId(),
                    e
            );
            return Single.just(new DeployModelReply(command.getId(), CommandStatus.ERROR));
        }
    }
}