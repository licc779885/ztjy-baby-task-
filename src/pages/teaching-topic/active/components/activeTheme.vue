<template>
  <div>
    <div class="active-theme">
        <img class="theme-icon" src="../../../../assets/images/teaching-topic/active-icon.png" alt="">
        <div class="theme-right">
            <p>{{activeTxt}}</p>
            <span>{{className}}</span>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'activeTheme',
    props: {
        activeTxt: {
            type: String,
            default: ''
        },
        className:{
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss" scoped>
.active-theme{
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(150,149,149,0.24);
    border-radius: 30px 30px 30px 100px;
    width: 690px;
    height: 200px;
    margin: 0 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .theme-icon{
        margin-left: 30px;
        width: 120px;
        height: 120px;
    }
    .theme-right{
        width: 490px;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
        margin-right: 30px;
        p{
            font-size: 28px;
            color: #333333;
            line-height: 40px;
            overflow: hidden;
            text-overflow:ellipsis;
            display:-webkit-box; 
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            font-weight: bold;
        }
        span{
            display: inline-block;
            width: 490px;
            margin-top: 12px;
            font-size: 24px;
            color: #818D9D;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>