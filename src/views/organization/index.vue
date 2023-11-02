<template>
  <div class="content-container">
    <div class="organization-header">我的组织</div>
    <div class="main-content">
      <div class="action-container flexBetween">
        <div class="left">
          <el-button type="primary">创建组织</el-button>
          <el-button>加入项目</el-button>
        </div>
        <div class="right">
          <el-select :value="searchForm.role" size="small" placeholder="请选择角色" @change="handleRoleChange">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="tableData">
          <el-table-column prop="name" label="组织名称" />
          <el-table-column prop="name" label="组织ID" />
          <el-table-column prop="role" label="组织角色" />
          <el-table-column prop="name" label="人员组织名称" />
          <el-table-column prop="createTime" label="加入时间" />
          <el-table-column prop="action" label="操作"  >
            <template v-slot="{row}">
              <el-button type="text">{{row.name}}退出组织</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-pagination flexEnd">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000"
            :page-size="10"
            :pager-count="7"
            :current-page="1"
          />
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

  .action-container {
    padding: 20px 0;
  }
  .table-container{
    background: #fff;
    padding: 24px 24px 0;
    flex: 1 1 auto;
    .table-pagination{
      margin-top: 20px;
    }
  }
}
</style>
