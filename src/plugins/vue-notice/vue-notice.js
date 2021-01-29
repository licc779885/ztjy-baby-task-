import Vue from 'vue';

const notice = new Vue();

/**
 * 使用方式
 * Vue.use(notice)
 * this.$notice('eventName', id);
 * 
 * notice: {
 *  eventName(id) {
 *    console.log(id);
 *  }
 * }
 */
export default {
  install(Vue) {
    Vue.prototype.$notice = (type, ...args) => {
      notice.$emit(type, ...args);
    };

    Vue.mixin({
      beforeCreate() {
        const noticeOptions = this.$options.notice;
        if (noticeOptions) {
          this.$_notice = [];

          const addListeners = (map) => {
            for (const event in map) {
              const handler = map[event].bind(this);
              notice.$on(event, handler);
              this.$_notice.push({ event, handler });
            }
          };

          if (Array.isArray(noticeOptions)) {
            noticeOptions.forEach(addListeners);
          } else {
            addListeners(noticeOptions);
          }
        }
      },
      beforeDestroy() {
        if (this.$_notice) {
          for (const listener of this.$_notice) {
            notice.$off(listener.event, listener.handler);
          }
        }
      }
    });

    Vue.config.optionMergeStrategies.notice = (parent, child, vm) => {
      if (Array.isArray(parent)) {
        if (Array.isArray(child)) {
          return parent.concat(child);
        } else {
          parent.push(child);
          return parent;
        }
      } else if (Array.isArray(child)) {
        child.push(parent);
        return child;
      } else if (parent && child) {
        return [parent, child];
      } else if (parent) {
        return parent;
      }
      return child;
    };
  }
};