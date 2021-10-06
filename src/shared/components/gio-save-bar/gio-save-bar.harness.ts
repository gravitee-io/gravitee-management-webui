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

import { ComponentHarness } from '@angular/cdk/testing';

export class GioSaveBarHarness extends ComponentHarness {
  static hostSelector = 'gio-save-bar';

  protected getSubmitButton = this.locatorFor('.save-bar__content__submit-button');
  protected getResetButton = this.locatorFor('.save-bar__content__reset-button');

  async isVisible(): Promise<boolean> {
    const submitButton = await this.locatorForOptional('.save-bar__content__submit-button')();
    return submitButton !== null;
  }

  async clickSubmit(): Promise<void> {
    const submitButton = await this.getSubmitButton();
    return submitButton.click();
  }

  async clickReset(): Promise<void> {
    const resetButton = await this.getResetButton();
    return resetButton.click();
  }
}
