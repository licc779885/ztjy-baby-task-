import { Toast } from 'vant'
export default {
	mounted () {
  },
  methods: {
    addLoading (option={}) {
      let obj = {
        message: '',
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner'
      };
      Object.assign(obj,option)
      Toast.loading(obj)
    },
    removeLoading () {
      Toast.clear()
    }
  }
}
