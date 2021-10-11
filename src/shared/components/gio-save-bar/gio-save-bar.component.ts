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
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'gio-save-bar',
  template: require('./gio-save-bar.component.html'),
  styles: [require('./gio-save-bar.component.scss')],
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ transform: 'translateY(100px)' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(100px)' })),
      ]),
    ]),
  ],
})
export class GioSaveBarComponent {
  @Input()
  opened = false;

  @Input()
  creationMode = false;

  @Input()
  form?: FormGroup;

  @Input()
  formInitialValues?: unknown;

  @Output()
  reset = new EventEmitter();

  @Output()
  submit = new EventEmitter();

  isOpen() {
    if (this.creationMode) {
      return true;
    }

    if (this.form) {
      return this.form.dirty;
    }
    return this.opened;
  }

  isSubmitDisabled() {
    return this.form && this.form.invalid;
  }

  onResetClicked(): void {
    if (this.form) {
      this.form.reset(this.formInitialValues);
      this.form.markAsPristine();
    }
    this.reset.emit();
  }

  onSubmitClicked(): void {
    if (this.isSubmitDisabled()) {
      this.form.markAllAsTouched();
      console.log(collectErrors(this.form));

      return;
    }
    this.submit.emit();
  }
}

function isFormGroup(control: AbstractControl): control is FormGroup {
  return !!(<FormGroup>control).controls;
}
function collectErrors(control: AbstractControl): any | null {
  if (isFormGroup(control)) {
    return Object.entries(control.controls).reduce((acc, [key, childControl]) => {
      const childErrors = collectErrors(childControl);
      if (childErrors) {
        acc = { ...acc, [key]: childErrors };
      }
      return acc;
    }, null);
  } else {
    return control.errors;
  }
}
