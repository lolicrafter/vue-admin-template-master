import { satelliteModel } from './TModels'

export class TCesium {
  viewer = null;
  scene = null;
  TDL_YX_LAY = null;

  /**
   * 构造器函数：实例化cesium
   * @param {*} dom 节点id
   */

  constructor(dom,moveCallback) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4M2Q1OTNmOC1kZWMwLTQ3NDMtOWM5Zi01YjZmMjUzMjI1MjciLCJpZCI6MTg2MTYwLCJpYXQiOjE3MDM0NjQwNTd9.mv1lXD2voJA2Ft0dyEVagcEJ8C8cSbL4EQoga5TNU-s'
    this.viewer = new Cesium.Viewer(dom, {
      homeButton: true, // 是否显示Home按钮
      sceneModePicker: false, // 是否显示3D/2D选择器
      baseLayerPicker: false, // 影像切换
      animation: true, // 是否显示动画控件
      infoBox: true, // 是否显示点击要素之后显示的信息
      selectionIndicator: false, // 要素选中框
      geocoder: true, // 是否显示地名查找控件
      timeline: true, // 是否显示时间线控件
      fullscreenButton: false, // 是否显示全屏按钮
      shouldAnimate: false, // 是否显示动画控件
      navigationHelpButton: false // 是否显示帮助信息控件
    })

    // 矢量图
    const TDT_SL = new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=72ae36dc9100e748cced033dfed33952\t\n',
      layer: 'vec',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      maximumLevel: 18
    })
    // 添加天地图矢量图 (底图对象，层级) 返回图层
    this.TDL_YX_LAY = this.viewer.imageryLayers.addImageryProvider(TDT_SL, 1)
    // 影像图
    this.viewer._cesiumWidget._creditContainer.style.display = 'none'
    this.viewer.scene.postProcessStages.fxaa.enabled = true // 开启抗锯齿
    this.viewer.scene.globe.depthTestAgainstTerrain = true // 地形遮挡
    this.scene = this.viewer.scene
    this.addTerrain()
    // 比如说两秒之后，视角移动到目标区域
    setTimeout(() => {
      // 相机视角移动至目标位置
      this.flyToTarget(117.000923, 36.675807, 12000000, 0, -90, 0, 2)
      this.addModel('wjw-001', '测试模型', 117, 36, 100000, 0, 0, 0)
    }, 2000)

    // 监听地图点击事件

    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    // 左键点击事件
    const leftclick = Cesium.ScreenSpaceEventType.LEFT_CLICK

    let mouseMove = Cesium.ScreenSpaceEventType.MOUSE_MOVE;

    this.viewer.screenSpaceEventHandler.removeInputAction(leftclick)
    this.viewer.screenSpaceEventHandler.removeInputAction(mouseMove)

    handler.setInputAction((click) => {
      // 获取点击位置笛卡尔坐标
      const cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid)
      if (cartesian) {
        // 将笛卡尔坐标转换为地理坐标（经纬度）
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        // 获取经纬度
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        console.log('longitude, latitude', longitude, latitude)
      }
    }, leftclick)
    handler.setInputAction((click) => {
      // 获取点击位置笛卡尔坐标
      const cartesian = this.viewer.camera.pickEllipsoid(click.endPosition, this.viewer.scene.globe.ellipsoid)
      if (cartesian) {
        // 将笛卡尔坐标转换为地理坐标（经纬度）
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        // 获取经纬度
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        // console.log('longitude, latitude', longitude, latitude)
        moveCallback(longitude, latitude)
      }
    }, mouseMove)
  }

  /**
   * 地形图
   */
  async addTerrain() {
    // 添加地形
    const terrainProvider = await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    })
    this.viewer.terrainProvider = terrainProvider
  }

  /**
   * 相机视角移动函数 - by wjw
   * @param lon 目标经度
   * @param lat 目标纬度
   * @param height  相机高度
   * @param heading  航向角
   * @param pitch  俯仰角
   * @param roll   距中心的距离，以米为单位
   * @param duration  飞行时间
   */
  flyToTarget(lon, lat, height, heading, pitch, roll, duration) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height), // 经纬度以及相机离地高度
      orientation: {
        heading: Cesium.Math.toRadians(heading), // 航向角
        pitch: Cesium.Math.toRadians(pitch), // 俯仰角
        roll: roll // 距中心的距离，以米为单位
      },
      duration: duration // 飞行时间
    })
  }

  /**
   * 移除图层
   */
  removeLayer() {
    this.viewer.imageryLayers.remove(this.TDL_YX_LAY)
  }

  /**
   * 添加图层
   */
  addLayer() {
    this.viewer.imageryLayers.add(this.TDL_YX_LAY)
  }

  /**
   * 销毁cesium
   */
  destroy() {
    this.viewer.destroy()
  }
  /**
   * 地图缩小
   */
  zoomOut() {
    // viewer 为 Viewer 对象
    const position = this.viewer.camera.position
    const cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height
    // 每次缩小 20 倍，参数可改
    const moveRate = cameraHeight / 20.0
    this.viewer.camera.moveBackward(moveRate)
  }
  /**
   * 地图放大
   */
  zoomIn() {
    // viewer 为 Viewer 对象
    const position = this.viewer.camera.position
    const cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height
    // 每次放大 20 倍，参数可改
    const moveRate = cameraHeight / 20.0
    this.viewer.camera.moveForward(moveRate)
  }

  /**
   * 获取当前相机高度
   */
  getCameraHeight() {
    const position = this.viewer.camera.position
    const cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height
    console.log('cameraHeight😊===》', cameraHeight)
    return cameraHeight
  }

  /**
   * 获取当前可视区域的经纬度范围
   */
  getExtent() {
    const extent = {}
    const scene = this.viewer.scene
    const canvas = scene.canvas
    const car3_lt = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), scene.globe.ellipsoid)
    const car3_rb = scene.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), scene.globe.ellipsoid)
    if (car3_lt && car3_rb) {
      const carto_lt = scene.globe.ellipsoid.cartesianToCartographic(car3_lt)
      const carto_rb = scene.globe.ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude)
    }
    return extent
  }

  /**
   * 获取当前层级
   */
  getLevel() {
    const level = this.viewer.camera.positionCartographic.height / 100000
    return level
  }

  /**
   * 获取当前相机位置
   */
  getCameraPosition() {
    const position = this.viewer.camera.position
    const ellipsoid = this.viewer.scene.globe.ellipsoid

    // 将笛卡尔坐标转换为地理坐标（经纬度）
    const cameraPositionCartographic = ellipsoid.cartesianToCartographic(position)

    // 获取经纬度
    const longitude = Cesium.Math.toDegrees(cameraPositionCartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cameraPositionCartographic.latitude)

    return {
      longitude,
      latitude
    }
  }
  /**
   * 截图
   */
  toImg() {
    if (this.viewer) {
      this.viewer.scene.render()
      const canvas = this.viewer.scene.canvas
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const link = document.createElement('a')
      const blob = this.dataURLtoBlob(image)
      const objUrl = URL.createObjectURL(blob)
      link.download = 'cesium.png'
      link.href = objUrl
      link.click()
    }
  }

  dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bStr = atob(arr[1])
    let n = bStr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bStr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
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
    // 模型位置信息
    const position = Cesium.Cartesian3.fromDegrees(lon, lat, height)
    // 设置模型方向
    const hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll))
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpRoll)
    // 向蓝星添加模型，返回模型对象
    const model = this.viewer.entities.add(satelliteModel(id, position, orientation, description))
    return model
  }
  /**
   * 根据 ID 查询模型  - by wjw
   * @param id 模型唯一标识符 id
   * @returns {Entity}
   */
  getModelById(id) {
    const model = this.viewer.entities.getById(id)
    return model
  }

  /**
   * 删除模型  - by wjw
   * @param model 模型实体对象
   */
  removeModel(model) {
    this.viewer.entities.remove(model)
  }
  /**
   * 根据 ID 删除模型  - by wjw
   * @param id 模型唯一标识符 id
   */
  removeModelById(id) {
    this.viewer.entities.removeById(id)
  }

  /**
   * 添加点位
   */
  addMarker(pointInfo) {
    // 设置最小缩放距离，值为相机与地表的最小距离，防止缩小地图时图标消失过快
    // this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000
    // this.viewer.scene.globe.maximumScreenSpaceError = 10 // 根据具体情况调整值

    // 自定义label颜色
    const _textColor = 'rgb(11, 255, 244)'
    // const Cesium = this.cesium
    // 清除上一次加载的点位
    // this.viewer.entities.removeAll()
    // foreach循环加载点位
    pointInfo.forEach((pointObj) => {
      this.viewer.entities.add({
        name: pointObj.psName,
        code: pointObj.id,
        id: pointObj.id,
        position: Cesium.Cartesian3.fromDegrees(
          pointObj.longitude * 1,
          pointObj.latitude * 1,
          1
        ),
        // 点
        // point: {
        //   pixelSize: 5,
        //   color: Cesium.Color.RED,
        //   outlineColor: Cesium.Color.WHITE,
        //   outlineWidth: 2,
        // },
        // 文字标签
        label: {
          // show: false,
          text: pointObj.psName,
          font: '14px monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          // fillColor: Cesium.Color.LIME,
          fillColor: Cesium.Color.fromCssColorString(_textColor),
          outlineWidth: 4,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
          pixelOffset: new Cesium.Cartesian2(0, -20) // 偏移量
        },
        // 图标
        billboard: {
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          image: require('@/assets/imgs/point.png'),
          width: 18,
          height: 24
        }
      })
    })
  }
}
