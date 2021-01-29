<template>
    <van-popup v-model="showDate" position="bottom"  >
        <van-datetime-picker v-model="currentDate"  @cancel="cancelDate" @confirm="selectComplate" type="date" title="选择预计开课时间"  :min-date="minDateTemp" :max-date="maxDateTemp" />
    </van-popup> 
</template>
<script>
import { DatetimePicker } from 'vant';
import { mapState, mapGetters } from "vuex";
const moment = require('moment');
import { getUrlParam } from 'szyutils'
// 可限定范围的日期选择控件 默认是今天开始计算
// 支持配置日期最小和最大值间隔天数
export default ({
    name: 'select-date-range',
    components: {
        [DatetimePicker.name]:DatetimePicker
    },
    model:{
        prop:'date',
        event:'complete'
    },
    props: {
        date: {
            type: String,
            default: ''
        },
        minDate: {
            type: String,
            default: ''
        },
        maxDate: {
            type: String,
            default: ''
        },
        // 配置日期最小和最大值间隔天数
        range: {
            type: Number,
            default: 30
        }
    },
    computed: {
        ...mapGetters({
            teachingActivityId: 'teaching-topic/teachingActivityId',
        }),
    },
    watch: {},
    data () {
        // 限定范围最小日期和最大日期间隔为30天
        // 默认时间是今天往后延两天
        let currentDate = new Date()
        currentDate = moment(currentDate).add(2,'d')
        currentDate = this.setDate(currentDate)
        if(this.date){
            currentDate = this.setDate(this.date)
        }
        let today = new Date()
        today = moment(today)
        today = this.setDate(today)
        let mMaxDate = moment(today).add(this.range,'d')
        let maxDate = this.setDate(mMaxDate)
        let minDate = new Date()
        if(this.minDate){
            minDate = this.setDate(this.minDate)
        }
        if(this.maxDate){
            maxDate = this.setDate(this.maxDate)
        }
        return {
            currentDate,
            showDate: false,
            minDateTemp: minDate,
            maxDateTemp: maxDate,
        }
    },
    created () {
    },
    mounted () {
    },
    methods:{
        show(){
            this.showDate = true
        },
        cancelDate(){
            this.ev({
                event_id: 'click_estimated_start_time_cancel',
                obj_id: getUrlParam('teachingActivityId') ? getUrlParam('teachingActivityId') : this.teachingActivityId
            })
            this.showDate = false
        },
        selectComplate(value){
             this.ev({
                event_id: 'click_estimated_start_time_determine',
                obj_id: getUrlParam('teachingActivityId') ? getUrlParam('teachingActivityId') : this.teachingActivityId
            })
            this.showDate = false
            let dateStr = moment(value).format('YYYY-MM-DD')
            this.$emit('complete', dateStr)
        },
        setDate(date){
            let mDate = date
            if(typeof(date) == 'string'){
                mDate = moment(date)
            }
            return new Date(mDate.year(), mDate.month(), mDate.date())
        }
    }
})
</script>
<style lang="scss" scoped>
</style>