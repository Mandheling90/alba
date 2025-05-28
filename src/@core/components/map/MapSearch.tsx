import { Autocomplete, debounce } from '@mui/material'
import { FC, useState } from 'react'
import { useMap } from 'src/hooks/useMap'
import TextFieldSearch from '../molecule/TextFieldSearch'

interface IPlacesList {
  placeName: string
  x: string
  y: string
  type: 'address' | 'place'
}

interface IMapSearch {
  onSearch?: (lat: number, lon: number) => void
  useSearchButton?: boolean
  textFieldColor?: string
}

const MapSearch: FC<IMapSearch> = ({ onSearch, textFieldColor, useSearchButton = false }): React.ReactElement => {
  const [placesList, setPlacesList] = useState<IPlacesList[]>([])
  const { mapInfo, setMapInfo } = useMap()

  const handleSearch = debounce((searchValue: string) => {
    const places = new kakao.maps.services.Places()
    const geocoder = new kakao.maps.services.Geocoder()
    let placeResults: IPlacesList[] = []
    let addressResults: IPlacesList[] = []

    // 장소 검색
    places.keywordSearch(searchValue, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        placeResults = data.map(item => ({
          placeName: item.place_name,
          x: item.x,
          y: item.y,
          type: 'place' as const
        }))
        setPlacesList([...placeResults, ...addressResults])
      }
    })

    // 주소 검색
    geocoder.addressSearch(searchValue, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        addressResults = data.map(item => ({
          placeName: item.address_name,
          x: item.x,
          y: item.y,
          type: 'address' as const
        }))
        setPlacesList([...placeResults, ...addressResults])
      }
    })
  }, 500)

  const searchFn = () => {
    const firstResult = placesList[0]

    if (firstResult) {
      setMapInfo({
        ...mapInfo,
        center: { lat: Number(firstResult.y), lon: Number(firstResult.x) },
        mapLevel: 3
      })
      onSearch?.(Number(firstResult.y), Number(firstResult.x))
    }
  }

  return (
    <Autocomplete
      freeSolo
      id='areaAutocomplete'
      disableClearable
      options={placesList}
      getOptionLabel={(option: string | IPlacesList) => {
        if (typeof option === 'string') return option

        return `${option.placeName} (${option.type === 'address' ? '주소' : '장소'})`
      }}
      size='small'
      onChange={(event, newValue: string | IPlacesList) => {
        if (typeof newValue !== 'string') {
          setMapInfo({ ...mapInfo, center: { lat: Number(newValue.y), lon: Number(newValue.x) }, mapLevel: 3 })
          onSearch?.(Number(newValue.y), Number(newValue.x))
        }
      }}
      onInputChange={(event, newInputValue) => {
        setPlacesList([]) // 새로운 검색 시작 시 이전 결과 초기화
        handleSearch(newInputValue)
      }}
      renderInput={params => (
        <TextFieldSearch
          params={params}
          label={'지도 위치 검색'}
          onClick={() => {
            searchFn()
          }}
          textFieldColor={textFieldColor}
          onKeyDown={e => {
            if (e.key === 'Enter' && placesList.length > 0) {
              searchFn()
            }
          }}
        />
      )}
    />
  )
}

export default MapSearch
