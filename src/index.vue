<template>
    <div class="local-upload">
        <div class="local-wrap" @drop="handleSelectFile" @dragover="e => e.preventDefault()">
            <!-- 选择图片 -->
            <div v-if="uploadStatus==='select'">
                <div class="upload-select">
                    <label class="upload-select__inner" for="imgUpload-file0">
                        选择图片
                        <input name="file" type="file" id="imgUpload-file0"
                            accept="image/jpg,image/jpeg,image/png,image/bmp" @change="handleSelectFile">
                    </label>
                </div>
                <p class="tip-limit">仅支持JPG、PNG，大小不超过10M</p>
            </div>
            <!-- 预览图片 -->
            <div v-if="uploadStatus==='preview'" class="local-wrap__img">
                <ImgCrop :src="imgSrc" @change="hanldeEdit"></ImgCrop>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import ImgCrop from './ImgCrop.vue';

const defaultOptions = {
    fileType: ['jpg', 'png', 'bmp', 'jpeg'],
    fileSize: 1024 * 1024 * 10
};

@Component({
    name: 'VueImgCrop',
    components: {
        ImgCrop
    }
})
export default class LocalUpload extends Vue {
    @Prop({ default: () => defaultOptions }) options?: any;
    private imgSrc = '';
    private errorMsg = '';
    private uploadStatus = 'select';

    private hanldeEdit(imgData: string) {
        this.$emit('change', imgData);
    }

    // 选择图片文件
    private handleSelectFile($event: any) {
        $event.preventDefault();
        let file;
        if ($event.type === 'drop') {
            file = $event.dataTransfer.files[0];
        } else {
            file = $event.target.files[0];
        }
        if (!file) return;
        if (this.validFile(file)) {
            const url = window.URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                this.imgSrc = url;
                this.uploadStatus = 'preview';
            };
            img.src = url;
        }
    }

    // 校验文件信息
    private validFile(file: File) {
        let valid = true;
        this.errorMsg = '';
        const fileType = file.name.split('.').reverse()[0];
        if (!fileType) {
            valid = false;
            this.errorMsg = '上传失败\uFF0C上传文件类型无法识别';
        }
        if (this.options.fileType.indexOf(fileType) === -1) {
            valid = false;
            this.errorMsg = '上传失败\uFF0C仅支持JPG\u3001PNG格式';
        }
        if (this.options.fileSize <= file.size) {
            valid = false;
            this.errorMsg = '上传失败\uFF0C图片大小超过10M';
        }

        if (!valid) {
            this.uploadStatus = 'error';
            // 2s后重新选择
            const timer = setTimeout(() => {
                this.uploadStatus = 'select';
                this.errorMsg = '';
                clearTimeout(timer);
            }, 2000);
        }
        return valid;
    }
}
</script>
<style lang="scss" scoped>
$primary: #409eff;

.local {
    &-upload {
        &::after {
            content: '';
            display: table;
            clear: both;
        }

        input[type='file'] {
            position: absolute;
            top: -9999px;
            left: -9999px;
            width: 0;
            height: 0;
            opacity: 0;
        }
    }

    &-wrap {
        width: 416px;
        height: 310px;
        border: 1px solid #ececec;
        float: left;
        background: #f5f5f5;

        &__img {
            position: relative;
            width: 416px;
            height: 310px;
            margin: auto;
            box-sizing: border-box;
            user-select: none;
        }
    }
}

.upload-select {
    margin: 117px auto 20px;
    width: 136px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(213, 213, 213, 0.5);
    border-radius: 2px;

    &__inner {
        display: block;
        width: 136px;
        height: 40px;
        cursor: pointer;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: $primary;
        &:hover {
            background: lighten($primary, 35%);
        }
    }
}

.tip-limit {
    margin: 0;
    font-size: 14px;
    color: #666;
    text-align: center;
}
</style>