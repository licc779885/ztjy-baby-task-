<template>
    <div class="" @click="downLoad">下载</div>
</template>
<script>
import { jsToClient, clientToJs } from '@/utils/client'
export default ({
    name: '',
    props:{
        url:{
            type: String,
            default: ''
        }
    },
    computed: {},
    watch: {},
    data () {
        return {
        }
    },
    created () {
    },
    mounted () {
    },
    methods:{
        // todo 点击下载
        downLoad(){
            // 调起外部浏览器下载
            jsToClient('startBrowser',{
                url: this.url
            })
        }
    }
})
</script>
<style lang="scss" scoped>
</style>