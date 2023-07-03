let walking = null
export function Walking(params) {
  console.log(params)
  if (!walking) {
    walking = new AMap.Walking({
      map: params.map,
      hideMarkers: true,
    })
  }
  //根据起终点坐标规划步行路线
  walking.search(
    params.position_start,
    params.position_end,
    (status, result) => {
      if (status === 'complete') {
        if (params.complete && typeof params.complete == 'function') {
          params.complete(result) //定位成功
        }
        // console.log('绘制步行路线完成')
      } else {
        // console.log('步行路线数据查询失败' + result)
      }
    }
  )
}
