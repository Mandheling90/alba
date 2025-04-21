import { useEffect } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

export default function MapCustomTilesetComponent(flowPlanData) {
  const Main = () => {
    const domain = `${process.env.NEXT_PUBLIC_FLOWPLAN_PATH}`
    const path = `/${flowPlanData?.flowPlanImgUrl}`

    const plan = (x, y, z) => {
      y = -y - 1
      const limit = Math.ceil(3 / Math.pow(2, z))

      if (0 <= y && y < limit && 0 <= x && x < limit) {
        return domain + path + 'planh' + z + '_' + y + '_' + x + '.png'
      } else {
        return 'https://i1.daumcdn.net/dmaps/apis/white.png'
      }
    }

    useEffect(() => {
      const tileset = new kakao.maps.Tileset({
        width: 512,
        height: 512,
        urlFunc: plan,
        dark: false,
        minZoom: 0,
        maxZoom: 2
      })
      kakao.maps.Tileset.add('PLAN', tileset)
    }, [])

    return (
      <>
        <Map // 지도를 표시할 Container
          projectionId={null}
          center={{
            x: 650,
            y: -550
          }}
          style={{ width: '100%', height: '100%' }}
          level={3} // 지도의 확대 레벨
          onCreate={map => map.setMapTypeId(kakao.maps.MapTypeId['PLAN'])}
        >
          <MapMarker
            position={{
              x: 650,
              y: -550
            }}
          >
            <div style={{ color: '#000000' }}>커스텀 타일셋을 올릴수 있습니다!</div>
          </MapMarker>
        </Map>
      </>
    )
  }

  return <Main />
}
