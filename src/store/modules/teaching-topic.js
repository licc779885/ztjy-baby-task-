import { getDocument } from '@/services/common'
import store from '@/store/index'
import { jsToClient, namespace } from '@/utils/client'
import { getPlan } from '@/services/teaching-topic'
const versionCompare = require('szyutils/modules/versionCompare')
  const state = {
    teachingActivityId: '',
    teachingActivitieJoinId :'',
    isChangeDate: false,
    JNHDA007: '',
    JNHDA008: '',
    JNHDA0011: '',
    JNHDA0013: '',
    classList: [],
    planData: {
      teacherInfo:{
        teacherName:''
      }
    },
    refresh: false,
    currentClassId: '',
    newVersion: '6.34.0',
    isOldVersion: false
  }
  // getters
  const getters = {
    teachingActivityId: state => state.teachingActivityId,
    teachingActivitieJoinId: state => state.teachingActivitieJoinId,
    isChangeDate: state => state.isChangeDate,
    JNHDA007: state => state.JNHDA007,
    JNHDA008: state => state.JNHDA008,
    JNHDA0011: state => state.JNHDA0011,
    JNHDA0013: state => state.JNHDA0013,
    classList: state => state.classList,
    callbackKey: state => state.planData.callbackKey,
    materialFile: state => JSON.parse(state.planData.materialFile),
    teacherInfo: state => state.planData.teacherInfo,
    refresh: state => state.refresh,
    classId: state => state.planData.classId,
    currentClassId: state => state.currentClassId,
    isOldVersion: state => state.isOldVersion,
    teacherName: state => state.planData.teacherInfo.teacherName
  }
  const actions = {
    setJoinActivityId ({ commit, state }, id) {
        commit('setJoinActivityState', id)
    },
    setActivetyId ({ commit, state }, id) {
      commit('setActivityState', id)
    },
    changeDate ({commit, state}, bol) {
      commit('setIsChangeDate')
    },
    getDocument ({commit, state}) {
      getDocument({
        schoolId: store.state.global.userInfo.school_id,
        positionKeys: 'JNHD-A007,JNHD-A008,JNHD-A0011,JNHD-A0013',
      }).then((res)=>{
        commit('setDocument', res)
      })
    },
    getClassList ({commit, state}) {
      if (namespace) {
        return jsToClient('getClassInfoList',{type: 2}).then((data)=>{
          commit('setClassList', JSON.parse(data).gradeClassList)
        })
      }
    },
    setPlanData ({commit, state},data) {
      commit('setPlanData', data)
    },
    refresh ({commit, state}){
      commit('refresh',!state.refresh)
    },
    setCurrentClassId ({commit, state}, classId){
      commit('setCurrentClassId',classId)
    },
    juageVersion ({commit, state}){
      let appVersion = store.state.global.userInfo.st.app_ver
      let version = versionCompare(appVersion,state.newVersion)
      if(version >=0){
        commit('juageVersion',false)
      }else{
        commit('juageVersion',true)
      }
    },
  }
  // 状态更改的地方
  const mutations = {
    setJoinActivityState (state, teachingActivitieJoinId) {
      state.teachingActivitieJoinId = teachingActivitieJoinId
    },
    setActivityState (state, teachingActivityId) {
      state.teachingActivityId = teachingActivityId
    },
    setIsChangeDate (state) {
      state.isChangeDate = !state.isChangeDate
    },
    setDocument (state, data) {
      state.JNHDA007 = data['JNHD-A007']
      state.JNHDA008 = data['JNHD-A008']
      state.JNHDA0011 = data['JNHD-A0011']
      state.JNHDA0013 = data['JNHD-A0013']
    },
    setClassList (state, classList) {
      state.classList = classList
    },
    setPlanData (state, planData) {
      state.planData = planData
    },
    refresh (state, bol) {
      state.refresh = bol
    },
    setCurrentClassId (state, classId) {
      state.currentClassId = classId
    },
    juageVersion (state, bol) {
      state.isOldVersion = bol
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
  