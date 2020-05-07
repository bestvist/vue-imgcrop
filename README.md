# vue-imgcrop

![npm version](https://img.shields.io/npm/v/vue-imgcrop.svg)
![npm downloads](https://img.shields.io/npm/dt/vue-imgcrop.svg)
![MIT](https://img.shields.io/badge/license-MIT-blue.svg)

A vue component for image crop. (Vue 图片裁剪组件)

## Demo 示例

[click me](https://bestvist.github.io/vue-imgcrop/)

## Env 环境

vue@2 + vue-cli3

## Install 安装

```
npm install vue-imgcrop
```

## Usage 使用

```html
<div>
  <VueImgCrop @change="handleChange"></VueImgCrop>
</div>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { VueImgCrop } from 'vue-imgcrop';

  @Component({
      components: {
          VueImgCrop
      }
  })
  export default class App extends Vue {

       private handleChange(imgData) {
          console.log(imgData);
        },
    };
</script>
```

### Options 配置项

| Prop | Type | Default | Desc |
| format | Array | ['jpg', 'png', 'bmp', 'jpeg'] | limit image format |
| size | Number | 5 | limit image size |
|--|--|--|--|
