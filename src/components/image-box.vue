<template>
    <div class="image-box" :class="{loading:loadding}" ref="imageBox">
        <van-loading size="24px" vertical v-show="loadding" class="loadding"></van-loading>
        <img :src="url" alt="" v-show="!loadding" @load="loadImg">
    </div>
</template>
<script>
import { Loading } from 'vant';
export default ({
    name: 'image-box',
    props:{
        url:{
            type:String,
            default:''
        }
    },
    components: {
        [Loading.name]: Loading
    },
    computed: {},
    watch: {},
    data () {
        return {
            loadding: true
        }
    },
    created () {
    },
    mounted () {
    },
    methods:{
        loadImg () {
			this.loadding = false
		},
    }
})
</script>
<style lang="scss" scoped>
.image-box {
    width:100%;
    height:100%;
	position: relative;
    img {
        width:100%;
        height:100%;
        object-fit:cover;
    }
}
.loadding {
    flex-direction:row;
    justify-content:center;
    position:absolute;
    z-index:2;
    width:100%;
    height:100%;
}
</style>