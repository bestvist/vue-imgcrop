# vue-imgcrop

A vue component for image crop. (vue 图片裁剪组件)

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
|--|--|--|--|