<template>
  <div class="layout-header">
    <div class="logo-box">
      <el-dropdown :hide-on-click="false">
        <div class="project-dropdown flexCenter">
          <el-image
            src="https://fh.dji.com/assets/img/logo.564ee6f7.png"
            style="width: 35px;height: 30px"
            fit="fill"
          />
          <span class="el-dropdown-link">
            组织名称1111<i class="el-icon-arrow-down el-icon--right" />
          </span>
        </div>
        <el-dropdown-menu>
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="menu-box">
      <div v-for="item in menuList" :key="item.value" class="menu-item" :class="{activeName:activeName===item.name}" @click="handleMenuClick(item.value)">
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div class="user-box">
      <el-dropdown @command="handleCommand">
        <div class="dropdown-title flexCenter">
          <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <div class="user-name">用户名111</div>
        </div>
        <el-dropdown-menu>
          <el-dropdown-item command="user">
            <i class="el-icon-user" />
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="organization">
            <i class="el-icon-edit-outline" />
            我的组织
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="el-icon-setting" />
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>

  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》 ';

export default {
  name: 'LayoutHeader',
  // import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      menuList: [
        {
          label: '项目',
          value: 'project',
          name: 'Project'
        },
        {
          label: '人员管理',
          value: 'member',
          name: 'Member'
        },
        {
          label: '设备管理',
          value: 'device',
          name: 'Device'
        }
      ]
    }
  },
  // 计算属性 类似于 data 概念
  computed: {
    activeName() {
      return this.$route.name
    }
  },
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {
    console.log('this.$route.path😊===》', this.$route)
  },
  // 方法集合
  methods: {
    // 切换路由
    handleMenuClick(route) {
      this.$router.push({ path: route })
    },
    // 点击下拉
    handleCommand(command) {
      if (command === 'logout') {
        console.log('退出登录😊===》')
      }
      this.$router.push({ path: command })
    }
  }
}
</script>

<style scoped lang="scss">
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  background-color: #000;
  //box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  color: #ffffff;

  .logo-box {
    display: flex;
    align-items: center;
    .project-dropdown{
      color: #ffffff;
      font-size: 18px;
    }
    .el-image {
      margin-right: 10px;
    }
  }

  .menu-box {
    display: flex;
    align-items: center;

    .menu-item {
      margin: 0 10px;
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }
    }
    .activeName{
      color: #409EFF;
    }
  }

  .user-box {
    display: flex;
    align-items: center;
    cursor: pointer;

    .user-name {
      margin-left: 10px;
      color: #ffffff;
    }

    &:hover {
      color: #409EFF;
    }
  }
}
</style>
