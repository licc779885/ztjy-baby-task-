<template>
    <div class="footer">
        <span class="download" @click="downloadEvent">
            下载教学资料
        </span>
        <span class="sum" @click="lookSum">查看总结</span>
    </div>
</template>
<script>
import { jsToClient } from '@/utils/client'
import { mapState, mapGetters } from "vuex";
const versionCompare = require('szyutils/modules/versionCompare')
export default ({
    name: 'page-footer',
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    computed: {
         ...mapGetters({
            userInfo:'global/userInfo',
            newVersion: 'teaching-topic/newVersion',
            teachingActivityId: 'teaching-topic/teachingActivityId',
            teachingActivitieJoinId: 'teaching-topic/teachingActivitieJoinId',
            teachingActivityId: 'teaching-topic/teachingActivityId',
            callbackKey: 'teaching-topic/callbackKey',
            materialFile: 'teaching-topic/materialFile',
            isOldVersion: 'teaching-topic/isOldVersion',
        }),
        appVersion(){
            return this.userInfo.st.app_ver
        }
    },
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
        // 下载素材
        downloadEvent(){
            this.ev({
                event_id: 'click_download_ material',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            if(!this.isOldVersion){
                console.log(this.materialFile,'下载信息')
                jsToClient('jumpTo', {
                    action: 'startDownloadFile',
                    data: {
                        name: this.materialFile.name,
                        fileId: this.materialFile.fileId,
                        size: this.materialFile.size, // 单位：B
                        type: this.materialFile.type,
                        url: this.materialFile.url
                    }
                })
            }else{
                this.$toast('请升级至最新版本再试')
            }

        },
        lookSum(){
            this.ev({
                event_id: 'click_view_summary',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            let url =  `${window.domain}/teaching-topic/active/summary?teachingActivityJoinId=${this.teachingActivitieJoinId}&teachingActivityId=${this.teachingActivityId}`
            jsToClient('jumpTo',{
                action:'html',
                data:{
                    url
                }
            })
            // this.$router.push({name:'teacherTopicActiveSummary',query:{teachingActivitieJoinId:this.teachingActivitieJoinId}})
        }
    }
})
</script>
<style lang="scss" scoped>
.footer {
    display:flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #E0E0E0;
    span {
        padding: 24px 0px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;
        font-weight: bold;
    }
    .download {
        color: #00AAFF;
    }
    .sum {
        background: #00AAFF;
        color: #fff;
    }
}
</style>