import { Autocomplete, debounce } from '@mui/material'
import { FC, useState } from 'react'
import { useMap } from 'src/hooks/useMap'
import TextFieldSearch from '../molecule/TextFieldSearch'

interface IPlacesList {
  placeName: string
  x: string
  y: string
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
    const geocoder = new kakao.maps.services.Geocoder()

    geocoder.addressSearch(searchValue, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlacesList(
          data.map(item => {
            return {
              placeName: item.address_name,
              x: item.x,
              y: item.y
            }
          })
        )
      }
    })
  }, 500)

  return (
    <Autocomplete
      freeSolo
      id='areaAutocomplete'
      disableClearable
      options={placesList}
      getOptionLabel={(option: string | IPlacesList) => {
        return typeof option === 'string' ? option : option.placeName
      }}
      size='small'
      onChange={(event, newValue: string | IPlacesList) => {
        if (typeof newValue !== 'string') {
          setMapInfo({ ...mapInfo, center: { lat: Number(newValue.y), lon: Number(newValue.x) }, mapLevel: 3 })
          onSearch?.(Number(newValue.y), Number(newValue.x))
        }
      }}
      onInputChange={(event, newInputValue) => {
        handleSearch(newInputValue)
      }}
      renderInput={params => (
        <TextFieldSearch
          params={params}
          label={'지도 위치 검색'}
          onClick={() => {
            // console.log('onClick')
          }}
          textFieldColor={textFieldColor}
          useSearchButton={useSearchButton}
        />
      )}
    />
  )
}

export default MapSearch
