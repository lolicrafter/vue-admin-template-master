<template>
  <div class="content-container">
    <div class="organization-header">个人中心</div>
    <div class="main-content">
      <div class="table-container base-info">
        <div class="top">
          个人基本信息
        </div>
        <div class="bottom flexStart">
          <div class="bottom-item">
            <div class="bottom-item-label">账号xxxxxxxx</div>
            <div class="bottom-item-value">19955144854</div>
          </div>
        </div>
      </div>
      <div class="table-container">
        <div class="top">
          个人组织信息
        </div>
        <div class="bottom flexStart">
          <div class="bottom-item">
            <div class="bottom-item-label">组织名称</div>
            <div class="bottom-item-value">组织名称1</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-item-label">人员组织名称</div>
            <div class="bottom-item-value">19955144854</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-item-label">用户角色</div>
            <div class="bottom-item-value">超级管理员</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》 ';

export default {
  name: 'OrganizationList',
  // import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      // 角色下拉框选项
      roleOptions: [
        {
          value: '1',
          label: '超级管理员'
        },
        {
          value: '2',
          label: '管理员'
        },
        {
          value: '3',
          label: '普通用户'
        }
      ],
      // 搜索条件
      searchForm: {
        role: '1'
      },
      // 表格数据
      tableData: [
        {
          name: '组织名称',
          role: '超级管理员',
          createTime: '2020-01-01',
          action: '操作'
        }
      ]
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
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
  },
  // 方法集合
  methods: {
    handleRoleChange(val) {
      console.log('handleRoleChange', val)
      this.searchForm.role = val
    }
  } // 如果页面有 keep-alive 缓存功能,这个函数会触发
}
</script>

<style scoped lang="scss">
@import "~@/styles/mixin.scss";

.content-container {
  width: 100%;
  height: 100%;
  background-color: #f7f9fa;
}

.organization-header {
  color: #595959;
  line-height: 28px;
  padding: 16px 40px;
  font-size: 20px;
  background: #fff;
}

.main-content {
  height: calc(100% - 60px);
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;

  .table-container {
    margin-top: 24px;
    background: #fff;
    padding: 24px;
    height: 159px;
    .top{
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 24px;
      color: rgba(0,0,0,.85);
    }
    .bottom-item{
      flex: 1;
      font-size: 14px;
      .bottom-item-label{
        color:#595959;
        margin-bottom: 8px;
      }
      .bottom-item-value{
        color: #000;
      }
    }
  }
  .base-info{
    height: 159px;
  }
}
</style>
