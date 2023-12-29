<template>
  <div class="container">
    <div id="my-map" />
    <div class="panels">
      <div>
        <el-button type="primary" @click="removeMap">移除cesium实例</el-button>
        <el-button type="primary" @click="removeLayer">移除天地图图层</el-button>
      </div>
      <div>
        <el-button type="primary" @click="zoomIn">放大</el-button>
        <el-button type="primary" @click="zoomOut">缩小</el-button>
      </div>
      <div>
        cameraHeight:{{ cameraHeight }}
        <el-button type="primary" @click="getCameraHeight">获取当前相机高度</el-button>
      </div>
      <div>
        cameraPosition:{{ cameraPosition }}
        <el-button type="primary" @click="getCameraPosition">获取当前相机位置</el-button>
      </div>
      <div>
        cameraPosition:{{ extent }}
        <el-button type="primary" @click="getExtent">获取当前可视区域的经纬度范围</el-button>
      </div>
      <div>
        <el-button type="primary" @click="toImg">截取图片</el-button>
      </div>
      <div>
        <el-button type="primary" @click="removeModelById('wjw-001')">删除模型</el-button>
      </div>
      <div>
        <el-button type="primary" @click="addModel('wjw-001', '测试模型', 117, 36, 100000, 0, 0, 0)">添加模型</el-button>
      </div>
    </div>
    <div class="position">
      {{ position.longitude }},{{ position.latitude }}
    </div>
  </div>
</template>

<script>
// import * as Cesium from 'cesium'
import { TCesium } from '@/utils/cesium'
export default {
  name: 'HomeView',
  data() {
    return {
      mapObject: null,
      cameraHeight: 0,
      cameraPosition: null,
      extent: null,
      position: {
        latitude: 0,
        longitude: 0
      },
      clickPosition: {
        latitude: 0,
        longitude: 0
      }
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    this.mapObject.removeHandler()
  },
  methods: {
    initMap() {
      this.mapObject = new TCesium('my-map', this.moveCallback, this.clickPCallback)
      setTimeout(() => {
        this.loadPoints()
      }, 2000)
    },
    moveCallback(longitude, latitude) {
      // console.log('moveCallback----longitude, latitude😊===》', longitude, latitude)
      this.position.latitude = latitude
      this.position.longitude = longitude
    },
    clickPCallback(longitude, latitude) {
      // console.log('moveCallback----longitude, latitude😊===》', longitude, latitude)
      this.clickPosition.latitude = latitude
      this.clickPosition.longitude = longitude
      this.$message({
        message: `点击位置：${longitude},${latitude}`,
        type: 'success'
      })
    },
    /**
     * 移除天地图图层
     */
    removeLayer() {
      this.mapObject.removeLayer()
    },
    /**
     * 移除cesium实例
     */
    removeMap() {
      this.mapObject.destroy()
    },
    /**
     * 地图放大
     */
    zoomIn() {
      this.mapObject.zoomIn()
    },
    /**
     * 地图放大
     */
    zoomOut() {
      this.mapObject.zoomOut()
    },
    /**
     * 获取当前相机高度
     */
    getCameraHeight() {
      this.cameraHeight = this.mapObject.getCameraHeight()
    },
    /**
     * 获取当前相机位置
     */
    getCameraPosition() {
      this.cameraPosition = this.mapObject.getCameraPosition()
    },
    /**
     * 获取当前可视区域的经纬度范围
     */
    getExtent() {
      this.extent = this.mapObject.getExtent()
    },
    /**
     * 截图
     */
    toImg() {
      this.mapObject.toImg()
    },
    /**
     * 添加卫星模型  - by wjw
     * @param lon 经度
     * @param lat 纬度
     * @param height 高度
     * @param heading 航向角
     * @param pitch 俯仰角
     * @param roll 转向角度
     * @param id 模型唯一标识符
     * @param description 描述
     */
    addModel(id, description, lon, lat, height, heading, pitch, roll) {
      this.mapObject.addModel(id, description, lon, lat, height, heading, pitch, roll)
    },
    /**
     * 根据 ID 删除模型  - by wjw
     * @param id 模型唯一标识符 id
     */
    removeModelById(id) {
      this.mapObject.removeModelById(id)
    },
    loadPoints() {
      // 用模拟数据测试
      const pointInfo = [
        {
          id: '392f7fbb-ae25-4eef-ac43-58fd91148d1f',
          latitude: '31.87532',
          longitude: '120.55538',
          psName: '有限公司1'
        },
        {
          id: '0278a88c-b4f4-4d64-9ccb-65831b3fb19d',
          latitude: '31.991057',
          longitude: '120.700713',
          psName: '有限公司2'
        },
        {
          id: '248f6853-2ced-4aa6-b679-ea6422a5f3ac',
          latitude: '31.94181',
          longitude: '120.51517',
          psName: '有限公司3'
        },
        {
          id: 'F8DADA95-A438-49E1-B263-63AE3BD7DAC4',
          latitude: '31.97416',
          longitude: '120.56132',
          psName: '有限公司4'
        },
        {
          id: '9402a911-78c5-466a-9162-d5b04d0e48f0',
          latitude: '31.91604',
          longitude: '120.57771',
          psName: '有限公司5'
        },
        {
          id: 'EB392DD3-6998-437F-8DCB-F805AD4DB340',
          latitude: '31.88727',
          longitude: '120.48887',
          psName: '有限公司6'
        }
      ]
      this.addMarker(pointInfo)
    },
    // cesium 加载点位
    addMarker(pointInfo) {
      this.mapObject.addMarker(pointInfo)
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height: 100%;
  .panels{
    position: absolute;
    right: 20px;
    top:10%;
    background-color: #c4be45;
  }
  .position{
    position: absolute;
    left: 0;
    bottom:10%;
    width: 100%;
    height: 100px;
    background-color: rgba(0,0,0,.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: red;
  }
}
#my-map {
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>

