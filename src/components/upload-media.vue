<template>
    <div class="upload" @click="selectMedia"></div>
</template>
<script>
import { Toast } from 'vant'
import { jsToClient, clientToJs } from '@/utils/client'
// 客户端上传图片或者视频组件
export default ({
    name: 'upload-media',
    computed: {},
    watch: {},
    data () {
        return {
            files:[],
            // 上传类型 1：视频和照片 2：仅有照片 3：仅有视频
            type: 2,
            maxMediaNumber: 50
        }
    },
    created () {
    },
    mounted () {
    },
    methods:{
        // todo 选择图片或者视频
        // 返回数据
        selectMedia(){
            jsToClient('selectMedia',{
                'type': this.type, // 1：视频和照片 2：仅有照片 3：仅有视频
                'maxMediaNumber': this.maxMediaNumber, // 最大媒体数
                //'isShowCamera':false,  // 是否展示拍摄
                //'isCut':true, //图片或者视频是否需要裁剪  默认添加裁剪
                // 'width':200, //图片裁剪的宽
                //'height':300, //图片裁剪的高
                //'selectedPicLocalUrl':[String,String] //已选中的本地图片路径
            }).then((data)=>{
                // 返回数据
                //  'photo':[{
                //         'photoFilePath': '',
                //         'width': 1,
                //         'height': 1,
                //         },''] , //照片
                //     'video':[{
                //         'videoFilePath': '',
                //         'startTime': 0.0,//视频开始时间  单位毫秒
                //         'endTime': 0.0,//视频结束时间 单位毫秒
                //     }],
                data = JSON.parse(data)
                let uploadMediaData = {}
                if(this.type == 1){
                    uploadMediaData['photo'] = data.photo
                    uploadMediaData['video'] = data.video
                }else if(this.type == 2){
                    uploadMediaData['photo'] = data.photo
                }
                this.uploadMedia(uploadMediaData)
            })
        },
         // todo 上传图片和视频
        uploadMedia(data){
            this.addLoading({message:'上传中'})
            let param = {
                'compressId': '',//压缩id   无可以传“”
                'businessId': '93c1467005056bb08295',//上传业务id   必传  两端同步
                'interruptMode': 1,//中断模式  1单个文件失败中止后续文件上传(默认),   2单个文件失败继续上传后续文件上传， 必传
                'cellNetMode': 2,//允许蜂窝网络上传模式: 4G上传    1蜂窝网络下所有文件取消上传   2蜂窝网络下所有文件允许上传   4 蜂窝网络下不允许视频文件上传  必传
                'compressMode': 2, //文件压缩模式 1.所有文件不进行压缩（默认）  2.如果包含图片则使用原图压缩策略    4如果包含图片则使用图片非原图压缩(如果同时选择原图压缩和非原图压缩优先使用原图压缩)    8如果包含视频则进行压缩  10文本压缩  必传
                'slicesMode': 1,//1大于20M文件自动执行分片   2所有文件分片（小于10*1024kb文件不执行分片上传）   4所有文件不进行分片 8所有视频文件分片（小于10*1024kb视频文件不执行分片上传）（默认）  必传
            }
            // 合并选择的上传图片或者视频参数
            param = Object.assign(param,data)
            jsToClient('uploadMedia',param)
            // 上传成功
            clientToJs('uploadSuccess',(data)=>{
                this.removeLoading()
                alert(data)
                // {
                    // "fileUrls ": [{
                        // "url": "", 云路径
                        // "fileType": 1, //文件类型 1图片 2视频 4音频  8其他
                        // "width": 1,
                        // "height": 1,
                        // "duration": 12 //多媒体时长(秒)
                    // }]
                // }
                data = JSON.parse(data)
                this.files = data.fileUrls
                this.maxMediaNumber -=this.files.length
                this.$emit('complete',this.files)
            })
            // 上传失败
            clientToJs('uploadFail',(data)=>{
                this.removeLoading()
                // Toast.clear()
                alert(data)
                // "localUrl":""
                // "errorCode": //错误码
                // "errorMsg"： ,//错误信息
            })

        }
    }
})
</script>
<style lang="scss" scoped>
.upload {
    width: 191px;
    height: 191px;
    border: 1px dotted #ddd;
    background:url('~@/assets/images/teaching-topic/upload@2x.png') no-repeat;
    background-size: 100% 100%;
}
</style>