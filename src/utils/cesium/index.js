/* global Cesium */

import { satelliteModel } from './TModels'

export class TCesium {
  viewer = null;
  scene = null;
  TDL_YX_LAY = null;
  moveCallback;
  clickPCallback;
  contextMenuHandler;

  /**
   * 构造器函数：实例化cesium
   * @param {*} dom 节点id
   */

  constructor(dom, moveCallback, clickPCallback) {
    this.moveCallback = moveCallback
    this.clickPCallback = clickPCallback
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
    // const TDT_SL = new Cesium.WebMapTileServiceImageryProvider({
    //   url: 'http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=72ae36dc9100e748cced033dfed33952\t\n',
    //   layer: 'vec',
    //   style: 'default',
    //   format: 'tiles',
    //   tileMatrixSetID: 'w',
    //   subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    //   maximumLevel: 18
    // })
    // // 添加天地图矢量图 (底图对象，层级) 返回图层
    // this.TDL_YX_LAY = this.viewer.imageryLayers.addImageryProvider(TDT_SL, 1)
    // 影像图
    this.viewer._cesiumWidget._creditContainer.style.display = 'none'
    this.viewer.scene.postProcessStages.fxaa.enabled = true // 开启抗锯齿
    this.viewer.scene.globe.depthTestAgainstTerrain = true // 地形遮挡
    this.scene = this.viewer.scene
    // 开启地形深度检测
    this.addTerrain()
    // 添加天地图影像注记底图
    // this.addTMap(this.viewer, 'vec')
    // this.addTMap(this.viewer, 'cva')
    this.addTMap(this.viewer, 'img')
    this.addTMap(this.viewer, 'cia')
    // 比如说两秒之后，视角移动到目标区域
    setTimeout(() => {
      // 相机视角移动至目标位置
      this.flyToTarget(117.2001357238927, 31.84962713505064, 1200, 0, -90, 0, 1)
      this.addModel('wjw-001', '测试模型', 117, 36, 100000, 0, 0, 0)
    }, 2000)
    this.addRectangle()
    // 监听地图点击事件
    // 左键点击事件
    this.removeHandler()
    this.addHandler()
  }

  /**
   * 添加监听
   */
  addHandler() {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    handler.setInputAction((click) => {
      // 获取点击位置笛卡尔坐标
      const cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid)
      if (cartesian) {
        this.deleteEntitiesByName('projectLocation')
        // 将笛卡尔坐标转换为地理坐标（经纬度）
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        // 获取经纬度
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        // 创建一个新的实体，表示图标
        const obj = {
          id: new Date().getTime(),
          name: 'projectLocation',
          latitude: latitude,
          longitude: longitude,
          psName: `测试点位${Math.random() * 100}`
        }
        this.addMarker([obj])
        console.log('longitude, latitude', longitude, latitude)
        this.clickPCallback(longitude, latitude)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
        this.moveCallback(longitude, latitude)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction((movement) => {
      // 获取鼠标点击的位置
      const pickedObject = this.viewer.scene.pick(movement.position)
      console.log('pickedObject😊===》', pickedObject.id.name, pickedObject.id.id, pickedObject.id._label._text._value)
      console.log('pickedObject😊===》', pickedObject)
      // console.log('pickedObject------id😊===》', JSON.stringify(pickedObject.id))
      // 判断是否点击到了点位
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.name === 'projectLocation') {
        // console.log('pickedObject😊===》', pickedObject.id.name)

        // 获取点击到的 Entity 的坐标
        const entityPosition = pickedObject.id.position.getValue()

        // 将地理坐标转换为像素坐标
        const canvasPosition = this.viewer.scene.cartesianToCanvasCoordinates(entityPosition)

        // 获取像素坐标
        const pixelX = canvasPosition.x
        const pixelY = canvasPosition.y
        const position = {
          x: pixelX,
          y: pixelY
        }
        // 获取点击到的 Entity 的 id
        const entityId = pickedObject.id.id
        // 弹出删除菜单
        this.showContextMenu(position, entityId)
        console.log('position, entityId', position, entityId)
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  /**
   * 删除所有 name 为指定值的 Entity
   */
  deleteEntitiesByName(name) {
    // 获取所有的 Entity
    const allEntities = this.viewer.entities.values
    // 遍历所有 Entity
    allEntities.forEach((entity) => {
      // 判断 Entity 是否符合条件
      if (entity.name === name) {
        // 从 viewer.entities 中移除符合条件的 Entity
        this.viewer.entities.remove(entity)
      }
    })
  }
  /**
   * 卸载监听
   */
  removeHandler() {
    this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this.removeContextMenuListener()
  }
  /**
   * 移除右键菜单的事件监听器
   */
  removeContextMenuListener() {
    if (this.contextMenuHandler) {
      document.removeEventListener('click', this.contextMenuHandler)
    }
  }

  /**
   * 自定义删除菜单的显示方法
   */
  showContextMenu(position, entityIdToDelete) {
    // 创建菜单
    const menuElement = document.createElement('div')
    menuElement.className = 'menu'
    menuElement.innerHTML = '删除点位'
    menuElement.style.position = 'absolute'
    menuElement.style.left = position.x + 'px'
    menuElement.style.top = position.y + 'px'
    menuElement.style.backgroundColor = 'white'
    menuElement.style.padding = '5px'
    menuElement.style.border = '1px solid #ccc'
    menuElement.style.borderRadius = '4px'
    menuElement.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)'
    menuElement.style.cursor = 'pointer'

    // 添加菜单到 DOM 中
    document.body.appendChild(menuElement)
    // 定义点击事件处理函数
    const handleMenuClick = (e) => {
      // 判断点击的是否为删除菜单
      if (e.target.innerHTML === '删除点位') {
        console.log('删除点位😊===》')
        // 删除点位
        // 获取要删除的 Entity
        const entityToDelete = this.viewer.entities.getById(entityIdToDelete)

        console.log('entityToDelete😊===》', entityToDelete)
        console.log('Cesium.defined(entityToDelete)😊===》', Cesium.defined(entityToDelete))
        // 判断 Entity 是否存在
        if (Cesium.defined(entityToDelete)) {
          // 从 viewer.entities 中移除指定的 Entity
          this.viewer.entities.remove(entityToDelete)
        } else {
          // 如果 Entity 不存在，可以在控制台输出一条消息
          console.warn(`Entity with id '${entityIdToDelete}' not found.`)
        }
      }
      // 移除菜单
      document.body.removeChild(menuElement)
    }
    // 添加点击事件监听器
    menuElement.addEventListener('click', handleMenuClick)
    // 将 handleMenuClick 方法保存到组件实例的变量中
    this.contextMenuHandler = handleMenuClick
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
   * 计算中心点
   * lon 经度
   * lat 纬度
   * brng 俯视角
   * dist 距离
   */
  getCenterLatlng(lng, lat, brng, dist) {
    // brng = -brng
    dist = 8000 / Math.tan(90 * Math.PI / 180)
    const a = 6378137
    const b = 6356752.3142
    const f = 1 / 298.257223563
    const lon1 = lng * 1
    const lat1 = lat * 1
    const s = dist
    const alpha1 = brng * (Math.PI / 180)
    const sinAlpha1 = Math.sin(alpha1)
    const cosAlpha1 = Math.cos(alpha1)
    const tanU1 = (1 - f) * Math.tan(lat1 * (Math.PI / 180))
    const cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)); const sinU1 = tanU1 * cosU1
    const sigma1 = Math.atan2(tanU1, cosAlpha1)
    const sinAlpha = cosU1 * sinAlpha1
    const cosSqAlpha = 1 - sinAlpha * sinAlpha
    const uSq = cosSqAlpha * (a * a - b * b) / (b * b)
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))
    let sigma = s / (b * A); let sigmaP = 2 * Math.PI
    while (Math.abs(sigma - sigmaP) > 1e-12) {
      var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
      var sinSigma = Math.sin(sigma)
      var cosSigma = Math.cos(sigma)
      var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)))
      sigmaP = sigma
      sigma = s / (b * A) + deltaSigma
    }

    const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
    const lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
      (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp))
    const lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1)
    const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
    const L = lambda - (1 - C) * f * sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

    // const revAz = Math.atan2(sinAlpha, -tmp) // final bearing

    const lngLatObj = { lng: lon1 + L * (180 / Math.PI), lat: lat2 * (180 / Math.PI) }
    return lngLatObj
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
  flyToTarget(lng, lat, height, heading, pitch, roll, duration) {
    // const newCenter = this.getCenterLatlng(lon, lat, pitch, height)
    // console.log('newCenter😊===》', newCenter)
    const that_ = this
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, height), // 经纬度以及相机离地高度
      orientation: {
        heading: Cesium.Math.toRadians(heading), // 航向角
        pitch: Cesium.Math.toRadians(pitch), // 俯仰角
        roll: roll // 距中心的距离，以米为单位
      },
      duration: duration, // 飞行时间
      complete: function() {
        console.log('this.viewer😊===》', that_.viewer)
        // 飞行结束后，将相机移动到新的中心点
        // if (newCenter && that_.viewer) {
        //   console.log('飞行结束后，将相机移动到新的中心点😊===》')
        //   // that_.viewer.camera.lookAt(newCenter, new Cesium.Cartesian3(0.0, 0.0, height))
        // }
      }
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
        name: pointObj.name,
        code: pointObj.id,
        id: pointObj.id,
        position: Cesium.Cartesian3.fromDegrees(
          pointObj.longitude * 1,
          pointObj.latitude * 1,
          10
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
          // verticalOrigin: Cesium.VerticalOrigin.TOP, // 垂直方向以底部来计算标签的位置
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
          pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 高度参考
        },
        // 图标
        billboard: {
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 高度参考
          image: require('@/assets/imgs/point.png'),
          width: 18,
          height: 24
        }
      })
    })
  }

  // type TMapType = 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta' | 'ibo' | 'eva' | 'eia'
  /**
   * 为cesimu添加天地图的底图
   * @param viewer cesium viewer
   * @param layer vec：矢量底图、cva：矢量标注、img：影像底图、cia：影像标注 ter：地形晕渲、cta：地形标注、eva：矢量英文标注、eia：影像英文标注
   */
  addTMap(viewer, layer) {
    // 添加天地图影像注记底图
    const tMapImagery = new Cesium.WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.gov.cn/${layer}_w/wmts?tk=72ae36dc9100e748cced033dfed33952`,
      layer,
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      maximumLevel: 18
    })
    viewer.imageryLayers.addImageryProvider(tMapImagery)
  }

  /**
   * 添加矩形区域
   */
  addRectangle() {
    // 指定矩形的中心经纬度坐标
    const centerLongitude = 117.2
    const centerLatitude = 31.85

    // 指定矩形的宽度和高度（这里是 20m x 20m）
    const rectangleWidth = 200.0 / (111319.9 * Math.cos(centerLatitude * Math.PI / 180)) // 将20m转换为经度差
    const rectangleHeight = 200.0 / 111319.9 // 将20m转换为纬度差

    // 计算矩形的边界坐标
    const west = centerLongitude - rectangleWidth / 2.0
    const south = centerLatitude - rectangleHeight / 2.0
    const east = centerLongitude + rectangleWidth / 2.0
    const north = centerLatitude + rectangleHeight / 2.0

    // 创建矩形实体
    const rectangleEntity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        (west + east) / 2, // 计算中心点的经度
        (south + north) / 2, // 计算中心点的纬度
        10 // 适当的高度
      ),
      name: '测试矩形区域',
      code: '测试矩形区域',
      id: '测试矩形区域',
      // 文字标签
      label: {
        // show: false,
        text: '测试矩形区域',
        font: '14px monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        // fillColor: Cesium.Color.LIME,
        fillColor: Cesium.Color.fromCssColorString('rgb(11, 255, 244)'),
        outlineWidth: 4,
        // verticalOrigin: Cesium.VerticalOrigin.TOP, // 垂直方向以底部来计算标签的位置
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
        pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 高度参考
      },
      // 图标
      billboard: {
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 高度参考
        image: require('@/assets/imgs/point.png'),
        width: 18,
        height: 24
      },
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
        material: Cesium.Color.RED.withAlpha(0.5), // 设置矩形的颜色和透明度
        outline: true,
        outlineColor: Cesium.Color.BLACK
      }
    })
    this.viewer.zoomTo(rectangleEntity)
  }
}
