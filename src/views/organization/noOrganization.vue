<template>
  <div class="content-container">
    <div class="content">
      <el-image src="https://fh.dji.com/assets/img/organization_none.d4abecfb.png" style="width: 600px"></el-image>
      <h1>当前没有组织</h1>
      <el-button type="primary"><div style="width: 200px">创建组织</div></el-button>
      <el-button type="text">返回登录页面</el-button>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》 ';

export default {
  name: 'NoOrganizationList',
  // import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {}
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 方法集合
  methods: {},
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {
  },
  beforeCreate() {
  },
  beforeMount() {
  }, // 生命周期 - 挂载之前
  beforeUpdate() {
  }, // 生命周期 - 更新之前
  updated() {
  }, // 生命周期 - 更新之后
  beforeDestroy() {
  }, // 生命周期 - 销毁之前
  destroyed() {
  }, // 生命周期 - 销毁完成
  activated() {
  } // 如果页面有 keep-alive 缓存功能,这个函数会触发
}
</script>

<style scoped lang="scss">
@import "~@/styles/mixin.scss";
.content-container{
  height: 100%;
  @include flexCenter;
  .content{
    @include flexCenter;
    flex-direction: column;
  }
}
</style>
