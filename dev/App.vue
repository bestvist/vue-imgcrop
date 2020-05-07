<template>
    <div id="app">
        <h2>本地裁剪</h2>

        <div class="content">
            <div class="avatar"><img :src="avatar"></div>
            <button @click="visible = true">上传</button>
        </div>

        <VueImgCrop :size="10" v-model="visible" @save="save" @close="close"></VueImgCrop>        
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

    private save(imgData) {
        this.avatar = imgData;
    }

    private close() {
        console.log('close')
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

    h2 {
        color: #333;
    }
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
</style>