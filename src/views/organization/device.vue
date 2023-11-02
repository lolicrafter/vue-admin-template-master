<template>
  <div class="content-container device-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="飞行器" name="drone">
        <Drone/>
      </el-tab-pane>
      <el-tab-pane label="机场" name="airport">
        <Airport/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》 ';

export default {
  name: 'DeviceList',
  // import 引入的组件需要注入到对象中才能使用
  components: {
    // 导入组件
    Drone: () => import('./components/drone.vue'),
    Airport: () => import('./components/airport.vue')
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      activeName: 'drone'
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      this.activeName = tab.name
    }
  }
}
</script>

<style scoped lang="scss">
.content-container {
  width: 100%;
  height: 100%;
  background-color: #f7f9fa;
}
</style>
<style lang="scss">
.content-container.device-container{
  .el-tabs{
    height: 100%;
    .el-tabs__nav-scroll{
      padding: 0 40px;
    }
    .el-tabs__content{
      height: 100%;
      .el-tab-pane{
        height: 100%;
      }
    }
  }
}
</style>
