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
import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: '[gioClipboardCopyWrapper]',
  styles: [require('./gio-clipboard-button-inner.component.scss')],
  template: `
    <ng-content></ng-content>
    <span
      #tooltip="matTooltip"
      class="right"
      [class.clicked]="clicked"
      [cdkCopyToClipboard]="contentToCopy"
      (cdkCopyToClipboardCopied)="onCopied($event, tooltip)"
      matRipple
      [matRippleCentered]="true"
      [matRippleUnbounded]="true"
      [matTooltip]="tooltipMessage"
      [matTooltipPosition]="'after'"
    >
      <mat-icon [inline]="true">{{ clicked ? 'check' : 'content_copy' }}</mat-icon>
    </span>
  `,
})
export class GioClipboardCopyWrapperComponent {
  tooltipMessage = 'Copy to clipboard';
  tooltipHideDelay = 0;
  clicked = false;

  @Input() contentToCopy: string;

  onCopied(success: boolean, tooltip: MatTooltip) {
    tooltip.message = success ? 'Copied !' : 'Failed to copy !';
    tooltip.hideDelay = 2000;
    tooltip.show();
    this.clicked = true;

    setTimeout(() => {
      tooltip.hide();
    }, 2000);

    setTimeout(() => {
      this.clicked = false;
      tooltip.message = this.tooltipMessage;
      tooltip.hideDelay = this.tooltipHideDelay;
    }, 2500);
  }
}
