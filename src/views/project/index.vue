<template>
  <div class="project-container">
    <div class="project-sidebar flexColumnStart">
      <div class="project-sidebar-header">
        <div class="project-sidebar-header-title">项目列表</div>
        <div class="project-sidebar-header-add">
          <el-tooltip content="创建项目" placement="bottom">
            <i class="el-icon-plus" @click="showAdd=true" />
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
            <div class="flexColumn hoverPointer" @click="showAdd=true">
              <div class="project-sidebar-content-empty-icon">
                <i class="el-icon-plus" />
              </div>
              <div class="project-sidebar-content-empty-text">点击新建项目</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="project-list">
            <div v-for="item in projectList" :key="item.id" class="project-item hoverPointer flexBetween">
              <div class="project-item-left w100">
                <div class="project-item-project-title flexBetween">
                  <div class="project-item-title-left flexBetween">
                    <div class="project-item-left-status">
                      <el-tag> {{ item.status }}</el-tag>
                    </div>
                    <div class="project-item-left-name ml10">{{ item.name }}</div>
                  </div>
                  <div class="project-item-title-right">
                    <i class="el-icon-star-off" />
                  </div>
                </div>
                <div class="project-item-left-desc mt10">{{ item.desc }}</div>
                <div class="project-item-left-time mt10">{{ item.create_time }}</div>
                <div class="project-item-left-creator">{{ item.creator }}</div>
              </div>
              <div class="project-item-right flexCenter">
                <div class="project-item-right-icon">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="project-sidebar project-sidebar-new" :class="{'project-sidebar-new-active':showAdd}">
      <div class="project-sidebar-header flexStart">
        <div class="project-sidebar-header-add">
          <el-tooltip content="返回" placement="bottom">
            <i class="el-icon-back" @click="showAdd=false" />
          </el-tooltip>
        </div>
        <div class="project-sidebar-header-title ml10">创建项目</div>
      </div>
      <div class="project-sidebar-content">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-position="top"
          label-width="100px"
          class="demo-ruleForm customForm"
        >
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="ruleForm.name" class="darkInput" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="项目简介" prop="desc">
            <el-input
              v-model="ruleForm.desc"
              type="textarea"
              :rows="4"
              class="darkInput"
              placeholder="项目简介"
            />
          </el-form-item>
          <div class="form-item flexBetween mb20">
            <div class="left"> 申请码加入项目</div>
            <div class="right">
              <el-tooltip content="项目创建完成后才能修改改选项" placement="top">
                <el-button type="text" disabled><span class="mr10">未开启</span><i class="el-icon-arrow-right" />
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="form-item flexBetween mb20">
            <div class="left"> 项目成员</div>
            <div class="right">
              <el-button type="text" @click="showAddMember=true;showAddDevice=false"><i class="el-icon-plus" />添加成员
              </el-button>
            </div>
          </div>
          <el-table
            :data="memberList"
            border
            style="width: 100%"
            class="darkTable mb20"
            :highlight-current-row="false"
            :cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
            :header-cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
            empty-text="暂无数据"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" prop="group" label="人员项目呼号" width="180">
              <template v-slot="scope">
                <div>{{ scope.row.group }}
                  <el-tooltip v-if="scope.row.group==='组织1'" content="我的账号" placement="top">
                    <i class="el-icon-user-solid hoverPointer" />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="项目角色" />
            <el-table-column align="center" prop="name" label="编辑">
              <template v-slot="scope">
                <el-tooltip content="编辑" placement="top">
                  <el-button type="text" icon="el-icon-edit" @click="handleMemberEdit(scope.row)" />
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button disabled type="text" icon="el-icon-remove-outline" @click="handleMemberRemove(scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="form-item flexBetween mb20">
            <div class="left"> 项目设备</div>
            <div class="right">
              <el-button type="text" @click="showAddMember=false;showAddDevice=true"><i class="el-icon-plus" />添加飞行器
              </el-button>
            </div>
          </div>
          <el-table
            :data="deviceList"
            border
            style="width: 100%"
            class="darkTable mb20"
            :highlight-current-row="false"
            :cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
            :header-cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
            empty-text="暂无数据"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" prop="group" label="设备项目呼号" width="180">
              <template v-slot="scope">
                <div>{{ scope.row.group }}
                  <el-tooltip v-if="scope.row.group==='组织1'" content="我的账号" placement="top">
                    <i class="el-icon-user-solid hoverPointer" />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="设备型号" />
            <el-table-column align="center" prop="name" label="编辑">
              <template v-slot="scope">
                <el-tooltip content="编辑" placement="top">
                  <el-button type="text" icon="el-icon-edit" @click="handleMemberEdit(scope.row)" />
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button disabled type="text" icon="el-icon-remove-outline" @click="handleMemberRemove(scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="form-item flexBetween mb20">
            <div class="left"> 项目作业中心点
              <el-tooltip content="项目在地图上的地理位置" placement="bottom">
                <i class="el-icon-warning-outline hoverPointer" />
              </el-tooltip>
            </div>
            <div class="right">
              <el-button type="text" @click="showAddMember=true"><i class="el-icon-location-outline" />设置项目中心点
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
      <div class="submit-form flexCenter">
        <el-button type="primary" :disabled="!ruleForm.name" @click="submitForm('ruleForm')">
          <div style="width: 180px;">创建项目</div>
        </el-button>
      </div>
    </div>
    <!--    添加成员/飞行器-->
    <div
      class="project-sidebar project-sidebar-new-member"
      :class="{'project-sidebar-new-member-active':(showAdd&&showAddMember||showAdd&&showAddDevice)}"
    >
      <div class="project-sidebar-header flexBetween">
        <div class="project-sidebar-header-title ml10">{{ showAddMember ? '添加成员' : '添加飞行器' }}</div>
        <div class="project-sidebar-header-add">
          <i class="el-icon-close" @click="showAddMember=false;showAddDevice=false" />
        </div>
      </div>
      <div v-if="showAddMember" class="project-sidebar-content pd16">
        <div class="search-input mb10">
          <el-input v-if="showAddMember" v-model="memberName" placeholder="搜索" class="darkInput">
            <i slot="suffix" class="el-input__icon el-icon-search hoverPointer" @click="handleSearchMember" />
          </el-input>
        </div>
        <el-table
          :data="memberList"
          border
          style="width: 100%"
          class="darkTable"
          :highlight-current-row="false"
          :cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
          :header-cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
          empty-text="暂无数据"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column align="center" prop="group" label="人员组织名称" width="180">
            <template v-slot="scope">
              <div>{{ scope.row.group }}
                <el-tooltip v-if="scope.row.group==='组织1'" content="我的账号" placement="top">
                  <i class="el-icon-user-solid hoverPointer" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="成员账号" />
        </el-table>
      </div>
      <div v-if="showAddDevice" class="project-sidebar-content pd16">
        <div class="search-input mb10">
          <el-input v-model="deviceName" placeholder="搜索" class="darkInput">
            <i slot="suffix" class="el-input__icon el-icon-search hoverPointer" @click="handleSearchMember" />
          </el-input>
        </div>
        <el-table
          :data="deviceList"
          border
          style="width: 100%"
          class="darkTable"
          :highlight-current-row="false"
          :cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
          :header-cell-style="{'backgroundColor':'#101010','color':'#ffffff'}"
          empty-text="暂无数据"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column align="center" prop="group" label="人员组织名称" width="180">
            <template v-slot="scope">
              <div>{{ scope.row.group }}
                <el-tooltip v-if="scope.row.group==='组织1'" content="我的账号" placement="top">
                  <i class="el-icon-user-solid hoverPointer" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="成员账号" />
        </el-table>
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
      // 新建项目表单
      ruleForm: {
        name: '',
        desc: ''
      },
      // 新建项目表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 新建项目
      showAdd: false,
      // 新建项目成员
      showAddMember: false,
      // 新建飞行器
      showAddDevice: false,
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
      projectList: [
        {
          id: 1,
          status: '进行中',
          name: '项目1',
          desc: '项目1简介',
          create_time: '2020-01-01',
          creator: '张三'
        },
        {
          id: 2,
          status: '进行中',
          name: '项目2',
          desc: '项目2简介',
          create_time: '2022-01-01',
          creator: '李四'
        }
      ],
      // 成员名称
      memberName: '',
      // 人员列表
      memberList: [
        {
          group: '组织1',
          name: '成员1'
        },
        {
          group: '组织2',
          name: '成员2'
        }
      ],
      // 飞行器名称
      deviceName: '',
      // 飞行器列表
      deviceList: [
        // {
        //   group: '组织1',
        //   name: '飞行器1'
        // },
        // {
        //   group: '组织2',
        //   name: '飞行器2'
        // }
      ]
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 编辑成员
    handleMemberEdit(row) {
      console.log('编辑成员', row)
    },
    // 删除成员
    handleMemberRemove(row) {
      console.log('删除成员', row)
    },
    // 搜索成员
    handleSearchMember() {
      console.log('搜索成员')
    },
    // 选择人员
    handleSelectionChange(val) {
      console.log(val)
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.project-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;

  .project-sidebar {
    width: 370px;
    height: 100%;
    color: #ffffff;
    background-color: #232323;
    border-right: 1px solid #444;
    overflow: hidden;
    box-shadow: 1px 0 5px 0 rgba(0, 0, 0, .6);

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

      .searchbar-item {
        margin-right: 10px;
      }
    }

    .project-sidebar-content {
      width: 100%;
      height: calc(100% - 60px - 60px - 10px - 10px);
      flex: 1;
      overflow-y: auto;

      .project-sidebar-content-empty {
        width: 100%;
        height: 100%;
        color: #646464;

        .project-sidebar-content-empty-text {
          margin-top: 16px;
        }
      }

      .project-list {
        .project-item {
          box-sizing: border-box;
          width: 100%;
          height: 137px;
          border-bottom: 1px solid #4f4f4f;

          .project-item-left {
            box-sizing: border-box;
            padding: 16px;
            &:hover {
              background: #3c3c3c;
              box-shadow: inset 0 -1px 0 0 #4f4f4f;
            }
          }
        }

        .project-item-right {
          width: 48px;
          height: 100%;
          background-color: #303030;
          &:hover {
            background: #484848;
          }
        }
      }

    }
  }

  .project-sidebar-new {
    position: absolute;
    left: -370px;
    top: 0;
    width: 370px;
    height: 100%;
    color: #ffffff;
    background-color: #232323;
    border-right: 1px solid #444;
    transition: all 0.3s ease-in-out;

    .demo-ruleForm {
      padding: 16px;
      font-size: 14px;
    }

    .submit-form {
      padding: 16px;
      border-top: 1px solid #444;
      border-bottom: 1px solid #444;
    }
  }

  .project-sidebar-new-active {
    left: 0;
  }

  .project-sidebar-new-member {
    position: absolute;
    left: 0;
    top: 0;
    width: 370px;
    height: 100%;
    color: #ffffff;
    background-color: #232323;
    border-right: 1px solid #444;
    transition: all 0.3s ease-in;
    z-index: -1;
    opacity: 0;
  }

  .project-sidebar-new-member-active {
    z-index: 0;
    opacity: 1;
    left: 370px;
  }
}
</style>
