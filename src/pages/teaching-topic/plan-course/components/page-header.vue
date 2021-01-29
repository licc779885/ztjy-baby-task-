<template>
    <div class="header-bg">
        <div class="header-block">
            <div class="arrow"></div>
            <div class="title">
                <p>尊敬的{{teacherName}}老师，您好！</p>
                <p>根据您的预计开课时间，已为您智能生成方案。</p>
            </div>
            <div class="text-block">
                [开课后，掌通助手将帮您定时发布亲子任务]
            </div>
        </div>
        <div class="grade">
            <div class="left">
                <span>当前开课班级：</span>
                <strong>{{input.className}}</strong>
            </div>  
            <div class="right">
                <span class="change-btn" @click="changeGrade">
                    更换班级
                </span>
            </div>
        </div>
        <select-class ref="selectGrade" v-model="selection" @changeClass="changeClassEvent" @complete="completeClass" v-if="selection" :changeType="changeType"></select-class>
    </div>
</template>
<script>
import selectClass from '@/components/select-class'
import { changeClass } from '@/services/teaching-topic'
import { mapState, mapGetters } from "vuex"
export default ({
    name: 'page-header',
    components: {
        [selectClass.name]:selectClass,
    },
    props: {
        input:{
            type: Object,
            default: {
                classId:'',
                className:'',
            }
        },
        teachingActivitieJoinId:{
            type: String,
            default: ''
        }
    },
    computed: {
         ...mapGetters({
            teachingActivityId: 'teaching-topic/teachingActivityId',
            userId:'global/userId',
            classId: 'teaching-topic/classId',
            teacherName: 'teaching-topic/teacherName',
        }),
        selection(){
            if(this.input.classId){
                return this.input.classId
            }else{
                return ''
            }
        }
    },
    watch: {},
    data () {
        return {
            changeType:true
        }
    },
    created () {

    },
    mounted () {
    },
    methods:{
        changeGrade(){
            this.ev({
                event_id: 'click_change_class',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            this.$refs['selectGrade'].show()
        },
        completeClass(data){
            this.$store.dispatch('teaching-topic/setCurrentClassId',data.classId)
        },
        changeClassEvent(data){
            this.$store.dispatch('teaching-topic/setCurrentClassId',data.classId)
            this.$router.replace({name:'teacherIngPlanCourse',query:{teachingActivityJoinId:data.teachingActivityJoinId}})
            this.$store.dispatch('teaching-topic/refresh')
           
            // if(data.isJoined){
            //     // 确认参与
            //     let param = {
            //         teachingActivityId: this.teachingActivityId,
            //         userId: this.userId,
            //         startDate: time,
            //         classId: this.classId
            //     }
            //     console.log(param, '入参')
            //     joinActive (param).then(res => {
            //         if (res.code && res.code !== 10000) {
            //             Toast(res.message)
            //             return
            //         }
            //         jsToClient('jumpTo', {
            //             action: 'html',
            //             data: {
            //                 title: '课程安排',
            //                 url: window.domain + '/teaching-topic/plan-course?teachingActivityJoinId=' + res.teachingActivityJoinId
            //             }
            //         })
            //     })
            // }
            // changeClass({teachingActivityJoinId:'',classId: data.classId}).then(()=>{ 
            //     this.$toast('更换成功');
            // })
        },
        selectDate(){

        }

    }
})
</script>
<style lang="scss" scoped>
.header-bg {
    height: 422px;
    background:url('~@/assets/images/teaching-topic/plan-header.png') no-repeat;
    background-size:100% 100%;
    width:100%;
    overflow: hidden;
    border-bottom: 1px solid #E0E0E0;
    .header-block {
        width:560px;
        height:274px;
        border-radius:24px;
        background-color:#fff;
        box-sizing: border-box;
        margin-left:160px;
        margin-top:40px;
        padding:30px 35px;
        position:relative;
    }
    .arrow {
        width: 0;
        height: 0;
        border-width: 0 15px 15px;
        border-style: solid;
        border-color: transparent transparent #fff;
        transform:rotate(-90deg);
        position:absolute;
        left:-20px;
        top:100px;
    }
    .title {
        font-size: 26px;
        color: #333333;
        line-height: 40px;
        // font-weight:bold;
    }
    .text-block {
        font-size: 26px;
        color: #FF9700;
        padding:6px 16px;
        margin-top:8px;
        // font-weight: bold;
        background: rgba(255,151,0,0.06);
        border-radius: 8px;
    }
    .grade {
        display: flex;
        justify-content: space-between;
        padding: 35px 30px 0px; 
        .left {
            white-space: nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
            flex:1;
            span {
                font-size: 28px;
                color: #818D9D;
            }
            strong {
                font-size: 28px;
                color: #333333;
            }
        }
        .right {

        }
    }
    .change-btn {
        background: #00AAFF;
        border-radius: 35px;
        padding: 16px 37px;
        color: #fff;
        font-size: 28px;
    }
}
</style>