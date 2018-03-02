<template>
    <div  :is="current">
      <login/>
      <self-mes/>
    </div>
</template>

<script>
  import Login from './Login'
  import SelfMes from './SelfMes'
    export default {
        data () {
            return {
              current: Login
            }
        },
        created () {
          // 动态组件,如果本地存储了accessToken就显示用户详情组件否则显示登陆组件
          if (localStorage.getItem('accessToken')) {
            this.current = SelfMes
          } else {
            this.current = Login
          }
        },
        components: {
          Login,
          SelfMes
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
