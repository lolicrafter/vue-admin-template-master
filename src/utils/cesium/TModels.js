/**
 * 普通卫星模型
 * @param id 模型唯一标识ID
 * @param position 位置信息
 * @param orientation 方向信息
 * @param description 模型描述
 * @returns {{orientation, description, model: {minimumPixelSize: number, show: boolean, scale: number, maximumSize: number, uri: string}, id, position}}
 */
export const satelliteModel = function(id, position, orientation, description, modelData) {
  return {
    // 模型id
    id: id,
    // 模型类型
    modelType: 'wx',
    // 模型位置
    position: position,
    // 模型自定义数据
    modelData: modelData,
    // 模型方向
    orientation: orientation,
    // 模型资源
    model: {
      // 模型路径
      uri: '/static/models/simple_satellite_low_poly_free/scene.gltf',
      scale: 1000.0, // 放大倍数
      // 模型是否可见
      show: true,
      // 模型最小刻度
      minimumPixelSize: 150,
      // 模型最大刻度
      maximumSize: 150,
      // // 模型轮廓颜色
      silhouetteColor: Cesium.Color.WHITE,
      // // 模型轮廓大小，单位px
      silhouetteSize: 0
    },
    // 添加描述
    description: description
  }
}

