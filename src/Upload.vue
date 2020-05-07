<template>
    <div class="local-upload">
        <div class="local-wrap" @drop="handleSelectFile" @dragover="e => e.preventDefault()">
            <!-- 选择图片 -->
            <div v-if="uploadStatus==='select'">
                <div class="upload-select">
                    <label class="upload-select__inner" for="imgUpload-file0">
                        选择图片
                        <input name="file" type="file" id="imgUpload-file0" @change="handleSelectFile">
                    </label>
                </div>
                <p class="tip-limit">仅支持{{limitFileType}}，大小不超过{{limitFileSize}}</p>
            </div>
            <div v-else-if="uploadStatus==='error'" class="tip-error">
                {{errorMsg}}
            </div>
            <!-- 预览图片 -->
            <div v-else-if="uploadStatus==='preview'" class="local-wrap__img">
                <ImgCrop :src="imgSrc" @change="hanldeEdit"></ImgCrop>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import ImgCrop from './ImgCrop.vue';

@Component({
    components: {
        ImgCrop
    }
})
export default class Upload extends Vue {
    @Prop({ required: true }) format?: string[];
    @Prop({ required: true }) size?: number;

    private imgSrc = '';
    private errorMsg = '';
    private uploadStatus = 'select';

    get limitFileType() {
        return this.format?.join('、').toUpperCase();
    }

    get limitFileSize() {
        return this.size + 'M';
    }

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
            this.errorMsg = '上传失败，上传文件类型无法识别';
        }
        if (this.format?.indexOf(fileType) === -1) {
            valid = false;
            this.errorMsg = '上传失败，仅支持' + this.format?.join('、').toUpperCase() + '格式';
        }
        if ((this.size || 5) * 1024 * 1024 < file.size) {
            valid = false;
            this.errorMsg = '上传失败，图片大小超过' + this.size + 'M';
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
    font-size: 13px;
    color: #666;
    text-align: center;
}

.tip-error {
    margin-top: 30%;
    color: #f94848;
    font-size: 14px;
}
</style>