<template>
    <div id="app">
        <h2>本地裁剪</h2>

        <div class="content">
            <div class="avatar"><img :src="avatar"></div>
            <button @click="visible = true">上传</button>
        </div>

        <div class="upload" v-if="visible">
            <div class="upload-cover"></div>
            <div class="upload-dialog">
                <div class="title">图片裁剪<span class="icon-close" @click="close()"></span></div>
                <div class="upload-wrap">
                    <VueImgCrop @change="handleAvatar"></VueImgCrop>
                    <button class="save-btn" @click="handleSave">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { VueImgCrop } from '../src/index';

@Component({
    components: {
        VueImgCrop
    }
})
export default class Upload extends Vue {
    private visible = false;
    private avatar = `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`;
    private imgData = '';

    private handleAvatar(imgData: string) {
        this.imgData = imgData;
    }

    private handleSave() {
        this.avatar = this.imgData;
        this.visible = false;
    }

    private close() {
        this.visible = false;
    }
}
</script>

<style lang="scss" scoped>
$primary: #409eff;

#app {
    height: 100%;
    padding: 50px;
    background: #f5f5f5;
    text-align: center;
}

.content {
    
    .avatar {
        img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 2px solid rgba(0, 0, 0, 0.05);
        }
    }
    button {
        margin-top: 30px;
        padding: 5px 30px;
        border-radius: 2px;
        border: none;
        font-size: 16px;
        color: #ffffff;
        background: $primary;
        cursor: pointer;
    }
}

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