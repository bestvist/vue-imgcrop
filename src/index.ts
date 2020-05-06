import VueImgCrop from "./index.vue";

const install: any = function(Vue: any) {
    if (install.installed) return;
    install.installed = true;
    Vue.component(VueImgCrop.name, VueImgCrop);
};

export default {
    install,
    VueImgCrop
};
export { VueImgCrop, install };
