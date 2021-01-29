<template>
    <van-popup v-model="showSelect" position="bottom" >
        <van-picker show-toolbar title="选择任教班级" :columns="columns" @cancel='cancelEvent' @confirm="onConfirm" :default-index="defaultIndex" value-key="className"/>
    </van-popup>
</template>
<script>
// 选择任教班级
import { Popup, Picker, Toast } from 'vant';
import { jsToClient, clientToJs } from '@/utils/client'
import { isJoinCheck } from '@/services/teaching-topic'
import { mapGetters } from "vuex"
export default ({
    name: 'select-class',
    components: {
        [Picker.name]: Picker,
        [Popup.name]: Popup  
    },
    computed: {
         ...mapGetters({
            isChangeDate:'teaching-topic/isChangeDate',
            userId: 'global/userId',
            schoolId: 'global/schoolId',
            teachingActivityId: 'teaching-topic/teachingActivityId',
        })
    },
    model:{
        prop:'selection',
        event:'select'
    },
    props:{
        selection:{
            type: String,
            default: ''
        },
        // 创建过程 还是更换过程
        changeType: {
            type: Boolean,
            default: false
        }
    },
    watch: {},
    data () {
        return {
            defaultIndex: 0,
            showSelect:false,
            columns: []
        }
    },
    created () {
        this.getData()
    },
    mounted () {

    },
    methods:{
        // todo 获取班级数据 序列化数据结构
        getData(){
            jsToClient('getClassInfoList', {type: 2}).then((data)=>{
                this.columns = JSON.parse(data).gradeClassList
            })
        },
        cancelEvent(){
            this.showSelect = false
            this.ev({
                event_id: 'click_change_class_cancel',
                // parm: 'golden'
            })
        },
        // todo 选择班级
        // 前置条件：
        // 若当前老师选择更换的班级未开课
        // 点击【更换】后 toast提示：您选择的班级尚未开课，请选择预计开课时间 3s消失
        // 跳转专题介绍页并上弹出选择预计开课时间的弹框

        //  勾选其他班级，点击【更换】后
        // toast提示：更换成功 3s消失后
        // 返回课程安排页，且当前课程班级变更为勾选后的班级
        onConfirm(value){
            this.ev({
                event_id: 'click_change_class_determine',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            // 判断班级参与情况 是否已经开课
            this.addLoading()
            isJoinCheck({
                teachingActivityId: this.teachingActivityId,
                classId: value.classId,
                userId: this.userId,
                schoolId: this.schoolId
            }).then((res)=>{
                this.removeLoading()
                let isConflict = res.isConflict
                let isJoined = res.isJoined
                if(isJoined){
                    if(!this.changeType){
                        Toast({
                            message: '您已经创建过，不能再次创建',
                            position: 'top'
                        })
                    }else{
                        this.showSelect = false
                        this.$emit('change',value.classId)
                        this.$emit('changeClass',{classId: value.classId, isJoined:isJoined,teachingActivityJoinId:res.teachingActivityJoinId})
                    }
                }else{
                    // 是否冲突（同个班级别人已建）
                    if(isConflict){
                        Toast({
                            message: `当前班级已被同班的${res.conflictTeacherInfo.teacherName}抢先预约开课啦`,
                            position: 'top'
                        })
                        // this.showSelect = false
                    }else {
                        // 是否已经参与
                        Toast({
                            message: '您选择的班级尚未开课，请选择预计开课时间',
                            position: 'top'
                        })
                        this.showSelect = false
                        this.$emit('change',value.classId)
                        this.$emit('complete',{classId: value.classId, isJoined:isJoined})
                        this.$store.dispatch('teaching-topic/changeDate')
                    }  
                }
            }).catch(()=>{
                this.removeLoading()
            })
        },
        show(){
            this.showSelect = true
            this.defaultIndex = this.columns.findIndex((item)=>{
                return item.classId == this.selection
            })
        }
    }
})
</script>
<style lang="scss" scoped>
</style>