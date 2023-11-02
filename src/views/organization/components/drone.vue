<template>
  <div class="content-container">
    <div class="main-content">
      <div class="action-container flexBetween">
        <div class="left">
<!--          <el-button type="primary">添加人员</el-button>-->
        </div>
        <div class="right flexStart">
          <div class="search-item">
            <el-select :value="searchForm.project" placeholder="请选择项目" @change="handleRoleChange">
              <el-option
                v-for="item in projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="search-item">
            <el-select :value="searchForm.join" placeholder="请选择状态" @change="handleRoleChange">
              <el-option
                v-for="item in joinOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="search-item">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入SN/设备组织名称"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"/>
            </el-input>
          </div>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="tableData">
          <el-table-column prop="name" label="设备型号"/>
          <el-table-column prop="name" label="设备SN"/>
          <el-table-column prop="role" label="设备组织名称"/>
          <el-table-column prop="name" label="固件版本"/>
          <el-table-column prop="name" label="在线状态"/>
          <el-table-column prop="name" label="所属项目"/>
          <el-table-column prop="createTime" label="加入组织时间"/>
          <el-table-column prop="createTime" label="在线时间"/>
          <el-table-column prop="action" label="操作">
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
  name: 'DeviceDrone',
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
      // 项目下拉框选项
      projectOptions: [
        {
          value: '1',
          label: '项目1'
        },
        {
          value: '2',
          label: '项目2'
        },
        {
          value: '3',
          label: '项目3'
        }
      ],
      // 加入方式下拉框选项
      joinOptions: [
        {
          value: '1',
          label: '邀请加入'
        },
        {
          value: '2',
          label: '申请加入'
        }
      ],
      // 搜索条件
      searchForm: {
        role: '',
        project: '',
        join: ''
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
  // 方法集合
  methods: {
    handleRoleChange(val) {
      console.log('handleRoleChange', val)
      this.searchForm.role = val
    },
    handleSearch() {
      console.log('handleSearch')
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

    .search-item {
      width: 220px;
    }
  }

  .table-container {
    background: #fff;
    padding: 24px 24px 0;
    flex: 1 1 auto;

    .table-pagination {
      margin-top: 20px;
    }
  }
}
</style>
