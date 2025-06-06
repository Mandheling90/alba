import { Box, IconButton, Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import IconCustom from 'src/layouts/components/IconCustom'

interface ColumnConfig {
  field: string
  headerName: string
  type?: 'string' | 'number' | 'boolean' | 'date'
  flex?: number
  width?: number
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  renderCell?: (params: any) => JSX.Element
  renderHeader?: () => JSX.Element
  editable?: boolean
  sortable?: boolean
  filterable?: boolean
  isEmpty?: boolean
}

interface ColumnGeneratorProps {
  columns: ColumnConfig[]
  customRenderers?: Record<string, (params: any) => JSX.Element>
  actions?: {
    edit?: (params: any) => void
    delete?: (params: any) => void
    statusChange?: (params: any) => void
  }
}

export const generateColumns = (props: ColumnGeneratorProps): GridColDef[] => {
  const { columns, customRenderers = {}, actions = {} } = props

  return columns.map(column => {
    const baseColumn: GridColDef = {
      field: column.field,
      headerName: column.headerName,
      type: column.type || 'string',
      flex: column.flex || 1,
      width: column.width,
      align: column.align || 'center',
      headerAlign: column.headerAlign || 'center',
      editable: column.editable || false,
      sortable: column.sortable !== false,
      filterable: column.filterable !== false
    }

    // 커스텀 헤더 렌더러가 있는 경우 적용
    if (column.renderHeader) {
      baseColumn.renderHeader = column.renderHeader
    }

    // 빈 컬럼인 경우 빈 렌더러 추가
    if (column.isEmpty) {
      baseColumn.renderCell = () => <></>

      return baseColumn
    }

    // 커스텀 렌더러가 있는 경우 적용
    if (customRenderers[column.field]) {
      baseColumn.renderCell = customRenderers[column.field]
    }

    // 액션 컬럼 처리
    if (column.field === 'actions' && (actions.edit || actions.delete)) {
      baseColumn.renderCell = (params: any) => (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
          {actions.edit && (
            <IconButton sx={{ color: 'text.secondary' }} onClick={() => actions.edit?.(params.row)}>
              <IconCustom path='settingCard' icon='pen' />
            </IconButton>
          )}
          {actions.delete && (
            <IconButton sx={{ color: 'text.secondary' }} onClick={() => actions.delete?.(params.row)}>
              <IconCustom path='settingCard' icon='delete' />
            </IconButton>
          )}
        </Box>
      )
    }

    // 상태 컬럼 처리
    if (column.field === 'status' && actions.statusChange) {
      baseColumn.renderCell = (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Switch
            checked={params.row.status === 1}
            onChange={event =>
              actions.statusChange?.({
                ...params.row,
                status: event.target.checked ? 1 : 0
              })
            }
          />
        </Box>
      )
    }

    return baseColumn
  })
}

// 사용 예시:
/*
const columns = generateColumns({
  columns: [
    { field: 'name', headerName: '이름', type: 'string' },
    { field: 'email', headerName: '이메일', type: 'string' },
    { field: 'status', headerName: '상태', type: 'boolean' },
    { field: 'actions', headerName: '작업', type: 'string' }
  ],
  actions: {
    edit: (row) => console.log('수정', row),
    delete: (row) => console.log('삭제', row),
    statusChange: (row) => console.log('상태 변경', row)
  }
})
*/
