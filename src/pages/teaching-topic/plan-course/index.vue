<template>
    <div class="plan-course">
        <div class="box">
            <page-header :input="classObj" :teachingActivitieJoinId="planList.teachingActivitieJoinId" ></page-header>
            <plan-list :plan="planList"></plan-list>
        </div>
        <page-footer></page-footer>
    </div>
</template>
<script>
import pageHeader from './components/page-header'
import planList from './components/plan-list'
import pageFooter from './components/page-footer'
import { getPlan } from '@/services/teaching-topic'
import { mapState, mapGetters } from "vuex"
import { getUrlParam } from 'szyutils'
export default ({
    name: '',
    components: {
        [pageHeader.name]:pageHeader,
        [pageFooter.name]:pageFooter,
        [planList.name]:planList
    },
    computed: { 
        ...mapGetters({
            refresh: 'teaching-topic/refresh',
        }),
    },
    watch: {
        // 重新刷新数据
        refresh(bol){
            this.getData()
        }
    },
    data () {
        // todo 从url获取老师id 开课时间 头像
        const teachingActivitieJoinId = getUrlParam('teachingActivityJoinId')
        return {
            teachingActivitieJoinId,
            classObj:{
                classId:'1',
                className:'班级1',
            },
            planList:{
                teachingActivitieJoinId,
                startDate:'',
                templateId:'',
                course:{
                    courseId:'',
                    title:'',
                    content:'',
                    cover:'',
                    gradeTypeId:'',
                    createTime:'',
                    updateTime:''
                },
                growthTask:{
                    taskId:'',
                    templateId:'',
                    title:'',
                    cover:'',
                },
                growth:{
                    images:[],
                    growthId:'',
                    growthType:''
                },
                taskOnlineStatus:'',
                callbackKey:'',
                materialUrl:''
            }
        }
    },
    created () {
        this.$store.dispatch('global/getUserInfo').then(()=>{
            this.$store.dispatch('teaching-topic/getDocument')
            this.$store.dispatch('teaching-topic/juageVersion')
        })
        this.getData()
    },
    mounted () {

    },
    methods:{
        // 获取课程安排
        getData(){
            this.addLoading()
            const teachingActivitieJoinId = getUrlParam('teachingActivityJoinId')
            return getPlan({
                teachingActivitieJoinId: teachingActivitieJoinId,
            }).then((res)=>{
           
                if(!res['growth']){
                    res['growth'] = {
                        images:[],
                        growthId:'',
                        growthType:''
                    }
                }
                Object.assign(this.planList,res)
                this.classObj = {
                    classId: this.planList.classId,
                    className: this.planList.className,
                }
                this.pv({
                    page: 'class_schedule',
                    page_category: 3,
                    parm: this.planList.teachingActivityId
                })
                this.$store.dispatch('teaching-topic/setPlanData',this.planList)
                this.$store.dispatch('teaching-topic/setActivetyId',this.planList.teachingActivityId)
                this.$store.dispatch('teaching-topic/setJoinActivityId',teachingActivitieJoinId)
                this.removeLoading()
            }).catch(()=>{
                this.removeLoading()
            })
        }
    }
})
</script>
<style lang="scss" scoped>
.plan-course {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    .box {
        flex:1;
        overflow:auto;
    }
}
</style>