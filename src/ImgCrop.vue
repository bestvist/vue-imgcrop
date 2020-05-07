<template>
    <div class="crop-img">
        <div class="crop-wrap" :style="wrapStyle" ref="cropWrap">
            <img v-if="src" :src="src">
            <!-- 裁剪显示容器 -->
            <div class="crop-box" :style="cropBoxStyle">
                <div class="crop-box__move" @mouseup="cropMoveEnd" @mousedown="cropMoveStart" @mousemove="cropMove"
                    @mouseout="cropMoveEnd"></div>
                <div class="zoom-box" @mousedown="zoomMoveStart"></div>
            </div>
            <!-- 阴影遮挡块 -->
            <div class="cover-wrap">
                <div class="cover-box" v-for="(style,index) in coverBoxs" :key="index" :style="style"></div>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

const MIN_CROP_SIZE = 110;
const DEFAULT_CROP_BOX = {
    top: 23,
    left: 40,
    width: 150,
    height: 150,
    x: 0,
    y: 0,
    isMove: false
};

@Component
export default class EditImg extends Vue {
    @Prop() src?: string;

    private imgData = '';
    private minSize = MIN_CROP_SIZE;

    // 整体容器
    private container = {
        width: 416,
        height: 310
    };
    // 裁剪容器
    private wrapBox = {
        top: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };
    // 原图片
    private originImg: any = null;

    // 图片属性
    private scale = {
        width: 0,
        height: 0,
        ratio: 1
    };

    // 预览块
    private cropBox = Object.assign({}, DEFAULT_CROP_BOX);

    // 缩放块
    private zoomBox = {
        x: 0,
        y: 0,
        isMove: false
    };

    // 阴影遮罩块
    private coverBoxs = {
        top: { left: '40px', width: '150px', height: '50px' },
        right: { left: '190px', width: '200px' },
        bottom: { top: '180px', left: '40px', width: '150px', height: '60px' },
        left: { width: '40px' }
    };

    // 裁剪容器样式
    get wrapStyle() {
        const { wrapBox } = this;
        return {
            width: wrapBox.width + 'px',
            height: wrapBox.height + 'px',
            marginTop: wrapBox.top + 'px'
        };
    }

    // 裁剪预览容器样式
    get cropBoxStyle() {
        const { cropBox } = this;
        return {
            top: cropBox.top + 'px',
            left: cropBox.left + 'px',
            width: cropBox.width + 'px',
            height: cropBox.height + 'px'
        };
    }

    @Watch('src')
    private onSrcChange(val: string) {
        this.start(val);
    }

    // 设置裁剪容器大小位置
    private setWrapBox() {
        const { scale, container } = this;
        if (!scale.width || !scale.height) return null;
        let width,
            height,
            top = 0;
        if (scale.width > scale.height) {
            width = container.width;
            height = Math.floor((container.width * scale.height) / scale.width);
            top = (container.height - height) / 2;
        } else {
            width = Math.floor((container.height * scale.width) / scale.height);
            height = container.height;
        }

        this.wrapBox = Object.assign(this.wrapBox, {
            width,
            height,
            top: top
        });

        scale.ratio = scale.width / width;
    }

    // 设置裁剪容器位置
    private setWrapPosition() {
        let x, y;
        this.$nextTick(() => {
            const el = this.$refs['cropWrap'] as any;
            if (el) {
                const rect = el.getBoundingClientRect();
                x = rect.x || rect.left;
                y = rect.y || rect.top;
                this.wrapBox = Object.assign(this.wrapBox, {
                    x,
                    y
                });
            }
        });
    }

    // 设置默认裁剪框
    private setDefaultCrop() {
        const { cropBox, wrapBox } = this,
            size = Math.min(wrapBox.width, wrapBox.height);
        // 图片加载后小于默认最小值
        if (size <= this.minSize) {
            cropBox.width = cropBox.height = size;
            cropBox.top = cropBox.left = 0;
            this.minSize = size;
        }
        // 图片加载后大于默认最小值&&小于默认裁剪框
        else if (size > this.minSize && size < cropBox.left + cropBox.width) {
            cropBox.width = cropBox.height = this.minSize;
            cropBox.top = cropBox.left = 0;
        } else {
            this.cropBox = Object.assign({}, DEFAULT_CROP_BOX);
            this.minSize = MIN_CROP_SIZE;
        }
    }

    // 设置阴影遮挡块
    private setCoverBox() {
        function nonnegative(val: number) {
            return val < 0 ? 0 : val;
        }

        const { coverBoxs, cropBox, wrapBox } = this,
            { top, right, bottom, left } = coverBoxs;
        top.left = bottom.left = left.width = cropBox.left + 'px';
        top.width = bottom.width = cropBox.width + 'px';
        top.height = cropBox.top + 'px';
        right.left = cropBox.left + cropBox.width + 'px';
        right.width = nonnegative(wrapBox.width - cropBox.left - cropBox.width) + 'px';
        bottom.top = cropBox.top + cropBox.height + 'px';
        bottom.height = nonnegative(wrapBox.height - cropBox.top - cropBox.height) + 'px';
    }

    // 生成裁剪后图片
    private createImg() {
        const { cropBox, wrapBox, originImg } = this,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d') as any;
        canvas.width = cropBox.width;
        canvas.height = cropBox.height;
        ctx.drawImage(originImg, -cropBox.left, -cropBox.top, wrapBox.width, wrapBox.height);
        this.imgData = canvas.toDataURL();
    }

    // 裁剪框开始移动
    private cropMoveStart(e: MouseEvent) {
        e.preventDefault();
        const { cropBox } = this;
        cropBox.x = e.screenX;
        cropBox.y = e.screenY;
        cropBox.isMove = true;
    }

    // 裁剪框移动结束
    private cropMoveEnd(e: MouseEvent) {
        e.preventDefault();
        const { cropBox } = this;
        cropBox.isMove = false;
    }

    // 裁剪框移动
    private cropMove(e: MouseEvent) {
        e.preventDefault();
        const { cropBox, wrapBox } = this,
            { x, y, left, top, width, height, isMove } = cropBox;
        if (!isMove) return;
        const ex = e.screenX,
            ey = e.screenY,
            rLeft = left - (x - ex),
            rTop = top - (y - ey);
        cropBox.left = rLeft >= 0 && rLeft <= wrapBox.width - width ? rLeft : cropBox.left;
        cropBox.top = rTop >= 0 && rTop <= wrapBox.height - height ? rTop : cropBox.top;
        cropBox.x = ex;
        cropBox.y = ey;
        this.setCoverBox();
        this.crop();
    }

    // 缩放框开始移动
    private zoomMoveStart(e: MouseEvent) {
        e.preventDefault();
        this.zoomBox.isMove = true;
    }

    // 缩放框移动结束
    private zoomMoveEnd(e: MouseEvent) {
        e.preventDefault();
        this.zoomBox.isMove = false;
    }

    // 缩放框移动
    private zoomMove(e: MouseEvent) {
        e.preventDefault();
        const { cropBox, wrapBox, zoomBox, minSize } = this,
            { isMove } = zoomBox,
            { left, top } = cropBox;
        if (!isMove) return;
        const ex = e.clientX,
            ey = e.clientY,
            rWidth = ex - wrapBox.x - left,
            rHeight = ey - wrapBox.y - top,
            size = Math.max(rWidth, rHeight);
        if (size >= minSize && size <= Math.min(wrapBox.width - left, wrapBox.height - top)) {
            cropBox.width = cropBox.height = Math.max(rWidth, rHeight);
            this.setCoverBox();
            this.crop();
        }
    }

    private crop() {
        this.createImg();
        this.$emit('change', this.imgData);
    }

    // 开始裁剪
    private start(src: string | null | undefined) {
        if (!src) return;
        const img = new Image();
        img.src = src;
        img.setAttribute('crossOrigin', 'Anonymous');
        img.onload = () => {
            this.originImg = img;
            const { scale } = this;
            scale.width = img.width;
            scale.height = img.height;

            this.setWrapBox();
            this.setWrapPosition();
            this.setDefaultCrop();
            this.setCoverBox();
            this.crop();
        };
    }

    public mounted() {
        this.start(this.src);
        // 绑定缩放拖拽事件
        document.addEventListener('mouseup', this.zoomMoveEnd);
        document.addEventListener('mousemove', this.zoomMove);
    }

    public destroyed() {
        document.removeEventListener('mouseup', this.zoomMoveEnd);
        document.removeEventListener('mousemove', this.zoomMove);
    }
}
</script>
<style lang="scss" scoped>
.crop-img {
    width: 100%;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
    }
}

.crop {
    &-wrap {
        height: 100px;
        position: relative;
        margin: auto;
        box-sizing: border-box;
        background: #ccc;
        img {
            width: 100%;
            height: 100%;
        }
    }

    &-box {
        position: absolute;
        z-index: 2;

        &__move {
            width: 100%;
            height: 100%;
            border: 2px solid rgba(255, 255, 255, 0.6);
            box-sizing: border-box;
            background: rgba(0, 0, 0, 0); // fix: ie10 无背景bug
            cursor: move;
        }

        .zoom-box {
            position: absolute;
            right: -3px;
            bottom: -3px;
            width: 5px;
            height: 5px;
            background: #ffffff;
            cursor: se-resize;
        }
    }
}

.cover {
    &-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 1;
    }

    &-box {
        position: absolute;
        top: 0;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
}
</style>