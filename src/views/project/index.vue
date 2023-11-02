<template>
  <div class="project-container">
    <div class="project-sidebar flexColumnStart">
      <div class="project-sidebar-header">
        <div class="project-sidebar-header-title">项目列表</div>
        <div class="project-sidebar-header-add">
          <el-tooltip content="创建项目" placement="bottom">
            <i class="el-icon-plus" />
          </el-tooltip>
        </div>
      </div>
      <div class="project-sidebar-searchbar flexBetween">
        <div class="searchbar-item">
          <el-select v-model="searchForm.projectStatus" class="darkInput" size="mini" placeholder="状态">
            <el-option
              v-for="item in projectStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="searchbar-item">
          <el-select v-model="searchForm.projectStatus" class="darkInput" size="mini" placeholder="项目">
            <el-option
              v-for="item in projectStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="searchbar-item">
          <el-select v-model="searchForm.projectStatus" class="darkInput" size="mini" placeholder="排序">
            <el-option
              v-for="item in projectStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="searchbar-item hoverPointer">
          <el-tooltip content="搜索" placement="top">
            <i class="el-icon-search" />
          </el-tooltip>
        </div>
      </div>
      <div class="project-sidebar-content">
        <template v-if="projectList.length===0">
          <div class="project-sidebar-content-empty flexColumn">
            <div class="flexColumn hoverPointer">
              <div class="project-sidebar-content-empty-icon">
                <i class="el-icon-plus" />
              </div>
              <div class="project-sidebar-content-empty-text">点击新建项目</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》 ';

export default {
  name: 'ProjectPage',
  // import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      searchForm: {
        projectStatus: ''
      },
      projectStatusOptions: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '进行中',
          value: 'processing'
        },
        {
          label: '已完成',
          value: 'completed'
        }
      ],
      // 项目列表
      projectList: []
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 方法集合
  methods: {}
}
</script>

<style scoped lang="scss">
.project-container {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .project-sidebar {
    width: 370px;
    height: 100%;
    color: #ffffff;
    background-color: #232323;
    border-right: 1px solid #444;

    .project-sidebar-header {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid #444;
      margin-bottom: 10px;

      .project-sidebar-header-title {
        font-size: 16px;
        //font-weight: 600;
      }

      .project-sidebar-header-add {
        cursor: pointer;
      }
    }

    .project-sidebar-searchbar {
      width: 100%;
      padding: 0 10px 10px;
      border-bottom: 1px solid #444;
      .searchbar-item{
        margin-right: 10px;
      }
    }

    .project-sidebar-content{
      width: 100%;
      flex: 1;
      .project-sidebar-content-empty{
        width: 100%;
        height: 100%;
        color: #646464;
        .project-sidebar-content-empty-text{
          margin-top: 16px;
        }
      }
    }
  }
}
</style>
