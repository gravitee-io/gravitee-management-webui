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
import { Meta, moduleMetadata, StoryObj, componentWrapperDecorator } from '@storybook/angular';

import { GioAvatarComponent } from './gio-avatar.component';
import { GioAvatarModule } from './gio-avatar.module';

export default {
  title: 'Shared / Avatar',
  component: GioAvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [GioAvatarModule],
    }),
  ],
  argTypes: {
    id: {
      type: { name: 'string', required: false },
    },
    src: {
      type: { name: 'string', required: false },
    },
    name: {
      type: { name: 'string', required: false },
    },
    width: {
      type: { name: 'number', required: false },
    },
    roundedBorder: {
      type: { name: 'boolean', required: false },
    },
  },
  render: ({ id, src, name, width, roundedBorder }) => ({
    props: { id, src, name, width, roundedBorder },
  }),
} as Meta;

export const IconDefault: StoryObj = {};

export const ImageDefault: StoryObj<GioAvatarComponent> = {};
ImageDefault.args = {
  src: 'https://i.pravatar.cc/500',
};

export const IconWithParentDiv: StoryObj<GioAvatarComponent> = {};
IconWithParentDiv.args = {};
IconWithParentDiv.decorators = [componentWrapperDecorator((story) => `<div style="width:300px; height:300px">${story}</div>`) as any];

export const ImageWithParentDiv: StoryObj<GioAvatarComponent> = {};
ImageWithParentDiv.args = {
  src: 'https://i.pravatar.cc/500',
};
ImageWithParentDiv.decorators = [componentWrapperDecorator((story) => `<div style="width:300px; height:300px">${story}</div>`) as any];

export const IconWithWidth24Px: StoryObj<GioAvatarComponent> = {};
IconWithWidth24Px.args = {
  width: 24,
};

export const ImageWithWidth24Px: StoryObj<GioAvatarComponent> = {};
ImageWithWidth24Px.args = {
  src: 'https://i.pravatar.cc/100',
  width: 24,
};

export const IconWithRoundedBorder: StoryObj<GioAvatarComponent> = {};
IconWithRoundedBorder.args = {
  roundedBorder: true,
};

export const ImageWithRoundedBorder: StoryObj<GioAvatarComponent> = {};
ImageWithRoundedBorder.args = {
  src: 'https://i.pravatar.cc/100',
  roundedBorder: true,
};
