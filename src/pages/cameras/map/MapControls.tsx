import { Box } from '@mui/material'
import React from 'react'
import MapSearch from 'src/@core/components/map/MapSearch'
import { IViewType } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'

interface IMapControls {
  viewType: IViewType
  setViewType: (viewType: { type: 'map' | 'image' | 'newImage'; size: 'full' | 'half' }) => void
  newImageAddMode: boolean
  newImageAddModeFn: () => void
}

const MapControls: React.FC<IMapControls> = ({ viewType, setViewType, newImageAddMode, newImageAddModeFn }) => {
  return (
    <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {viewType.type === 'map' && viewType.size === 'full' ? (
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setViewType({ type: 'map', size: 'half' })}
        >
          <IconCustom isCommon path='camera' icon='map-mode-half' hoverIcon='map-mode-half-hovering' />
        </Box>
      ) : (
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setViewType({ type: 'map', size: 'half' })}
        >
          <IconCustom isCommon path='camera' icon='map-mode-full' hoverIcon='map-mode-full-hovering' />
        </Box>
      )}

      {newImageAddMode ? (
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => newImageAddModeFn()}>
          <IconCustom isCommon path='camera' icon='image-add-mode' hoverIcon='image-add-mode-hovering' />
        </Box>
      ) : (
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => {
            setViewType({
              type: 'image',
              size: 'half'
            })
          }}
        >
          <IconCustom isCommon path='camera' icon='image-mode' hoverIcon='image-mode-hovering' />
        </Box>
      )}

      <Box sx={{ flex: 0.7 }}>
        <MapSearch useSearchButton textFieldColor='#fff' />
      </Box>
    </Box>
  )
}

// const MapControls: React.FC<IMapControls> = ({ viewType, setViewType }) => {
//   return (
//     <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//       {viewType.type === 'map' && viewType.size === 'full' ? (
//         <Box
//           sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//           onClick={() => setViewType({ type: 'map', size: 'half' })}
//         >
//           <IconCustom isCommon path='camera' icon='map-mode-half' hoverIcon='map-mode-half-hovering' />
//         </Box>
//       ) : (
//         <Box
//           sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//           onClick={() => setViewType({ type: 'map', size: `${viewType.type === 'map' ? 'full' : 'half'}` })}
//         >
//           <IconCustom isCommon path='camera' icon='map-mode-full' hoverIcon='map-mode-full-hovering' />
//         </Box>
//       )}

//       <Box
//         sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//         onClick={() =>
//           setViewType({
//             type: 'image',
//             size: `${viewType.type === 'image' ? (viewType.size === 'full' ? 'half' : 'full') : 'half'}`
//           })
//         }
//       >
//         <IconCustom isCommon path='camera' icon='image-add-mode' hoverIcon='image-add-mode-hovering' />
//       </Box>

//       <Box sx={{ flex: 0.7 }}>
//         <MapSearch useSearchButton textFieldColor='#fff' />
//       </Box>
//     </Box>
//   )
// }

export default MapControls
