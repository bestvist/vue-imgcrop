<template>
    <div class="upload" v-if="value">
        <div class="upload-cover"></div>
        <div class="upload-dialog">
            <div class="title">图片裁剪<span class="icon-close" @click="handleClose()"></span></div>
            <div class="upload-wrap">
                <Upload :format="format" :size="size" @change="handleAvatar"></Upload>
                <button class="save-btn" @click="handleSave">保存</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Model, Emit, Vue } from 'vue-property-decorator';
import Upload from './Upload.vue';

const defaultOptions = {
    format: ['jpg', 'png', 'bmp', 'jpeg'],
    size: 5
};

@Component({
    name: 'VueImgCrop',
    components: {
        Upload
    }
})
export default class VueImgCrop extends Vue {
    @Prop({ default: () => defaultOptions.format }) format?: string[];
    @Prop({ default: () => defaultOptions.size }) size?: number;

    private imgData = '';

    @Model('input', { type: Boolean })
    value!: boolean;

    @Emit('input')
    input(bool) {
        return bool;
    }

    @Emit()
    save() {
        return this.imgData;
    }

    @Emit()
    close() {
        return false;
    }

    private handleAvatar(imgData: string) {
        this.imgData = imgData;
    }

    private handleSave() {
        this.save();
        this.input(false);
    }

    private handleClose() {
        this.input(false);
        this.close();
    }
}
</script>

<style lang="scss" scoped>
$primary: #409eff;

.upload {
    &-cover {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.7;
        background-color: #000;
    }

    &-dialog {
        position: fixed;
        z-index: 1002;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 546px;
        height: 500px;
        background: #fff;
    }

    &-wrap {
        padding: 0 54px;
        text-align: center;
    }

    .title {
        position: relative;
        font-size: 20px;
        color: #333;
        padding: 19px 0;
        margin: 0 30px;
        border-bottom: 1px solid #f3f3f3;
    }

    .icon-close {
        cursor: pointer;
        position: absolute;
        top: 20px;
        right: -10px;
        display: block;
        width: 16px;
        height: 16px;
        background: url('./img/icon-close.png');
    }
}

.save-btn {
    margin: 27px auto 0;
    width: 340px;
    height: 46px;
    line-height: 46px;
    background: $primary;
    border-radius: 2px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    border: none;
    cursor: pointer;
    &:hover {
        background: darken($primary, 10%);
    }
}
</style>