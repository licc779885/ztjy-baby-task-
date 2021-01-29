<template>
    <div class="image-list-box">
        <!-- 上传图片 -->
        <!-- <upload-media @complete="uploadComplete" class="item" v-if="growthId"></upload-media> -->
        <!-- 发表动态 -->
        <div class="push-btn item" v-if="imageList.length == 0 && !growthId" @click="pushDynimic"></div>
        <template v-for="(item,index) in imageList" >
            <div class="item"  @click="preview(index)" v-if="index <= imgIndex" :key="item.imageUrl">
                <!-- <div class="delete" @click="deleteImage($event,index)"></div> -->
                <image-box :url="item.imageUrl"></image-box>
                <div class="layer-more" v-if="index == imgIndex" @click="showMore">
                    <span>查看更多</span>
                </div>
            </div>
        </template>
        <preview-image-full-screen :dataSouce="imageList" :index="imgIndex" ref="previewEle" v-if="imageList.length>imgIndex"></preview-image-full-screen>
        <preview-image-full-screen :dataSouce="imageList" :index="0" ref="previewEle" v-else ></preview-image-full-screen>
    </div>
</template>
<script>
// 发布动态
import uploadMeadia from '@/components/upload-media'
import imageBox from '@/components/image-box'
import previewImageFullScreen from '@/components/preview-image-full-screen'
import { jsToClient, clientToJs, namespace } from '@/utils/client'
import { mapState, mapGetters } from "vuex";
const defaultImg = require('@/assets/images/teaching-topic/a1.jpg')
export default ({
    name: 'push-dynamic',
    components: {
        [uploadMeadia.name]:uploadMeadia,
        [imageBox.name]:imageBox,
        [previewImageFullScreen.name]:previewImageFullScreen
    },
    props: {
        imageList: {
            type: Array,
            default: []
        },
        growthId: {
            type: String,
            default: ''
        }
    },
    computed: {
         ...mapGetters({
            teachingActivityId: 'teaching-topic/teachingActivityId',
            teachingActivitieJoinId: 'teaching-topic/teachingActivitieJoinId',
            callbackKey: 'teaching-topic/callbackKey',
            isOldVersion: 'teaching-topic/isOldVersion',
        }),
        
    },
    watch: {},
    data () {
        return {
            showImages: false,
            imgIndex: 8
        }
    },
    created () {
        
    },
    mounted () {

    },
    methods:{
        // 删除图片
        deleteImage(event,index){
            event.stopPropagation()
            this.imageList.splice(index,1)
        },
        // 点击图片预览
        preview(index){
            this.$refs['previewEle'].showIndex(index)
        },
        //todo 上传成功
        uploadComplete(data){
            
        },
        // todo 显示更多
        showMore (event) {
            event.stopPropagation()
            this.$refs['previewEle'].showIndex(this.imgIndex)
        },
        // 发布动态
        pushDynimic(){
            this.ev({
                event_id: 'click_post_photos',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            if(!this.isOldVersion){
                jsToClient('jumpTo', {
                    action: 'DynamicPublishDefault',
                    data: {
                        businessId: this.teachingActivitieJoinId,
                        apiPath: this.callbackKey, // 回调的接口
                        successCallJs: namespace+'.successCallJs',
                        failureCallJs: namespace+'.failureCallJs',
                        sendStatusCallJs: namespace+'.sendStatusCallJs',
                    }
                })
                clientToJs('successCallJs',(res)=>{
                    // alert(res)
                    this.$store.dispatch('teaching-topic/refresh')
                    this.removeLoading()
                })
                clientToJs('failureCallJs',(res)=>{
                    alert('失败'+ res)
                    this.removeLoading()
                })
                clientToJs('sendStatusCallJs',(res)=>{
                    this.addLoading()
                })
            }else{
                this.$toast('请升级至最新版本再试')
            }
        }
    }
})
</script>
<style lang="scss" scoped>
.image-list-box {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    align-items: center;
    .item {
        width: 191px;
        height: 191px;
        margin-top: 20px;
        margin-right: 10px;
        position: relative;
        /deep/ img {
            border-radius: 15px;
        }
    }
    .delete {
        width: 32px;
        height: 32px;
        background:url('~@/assets/images/teaching-topic/icon_delete@2x.png') no-repeat;
        background-size: 100% 100%;
        right: 8px;
        top: 8px;
        position: absolute;
        z-index:1;
    }
    .layer-more {
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 28px;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
    }
}
.push-btn {
    width: 191px;
    height: 191px;
    border: 1px dotted #ddd;
    background:url('~@/assets/images/teaching-topic/addimg-copy@2x.png') no-repeat;
    background-size: 100% 100%;
    .dynamic-ico {
        
    }
    .txt {

    }
}
</style>