import { esES as esESCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
const esESGrid = {
  // Root
  noRowsLabel: 'Sin filas',
  noResultsOverlayLabel: 'Resultados no encontrados',
  // Density selector toolbar button text
  toolbarDensity: 'Densidad',
  toolbarDensityLabel: 'Densidad',
  toolbarDensityCompact: 'Compacta',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comoda',
  // Columns selector toolbar button text
  toolbarColumns: 'Columnas',
  toolbarColumnsLabel: 'Seleccionar columnas',
  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: count => count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Buscar…',
  toolbarQuickFilterLabel: 'Buscar',
  toolbarQuickFilterDeleteIconLabel: 'Limpiar',
  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descargar como CSV',
  toolbarExportPrint: 'Imprimir',
  toolbarExportExcel: 'Descargar como Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Columna de búsqueda',
  columnsPanelTextFieldPlaceholder: 'Título de columna',
  columnsPanelDragIconLabel: 'Reordenar columna',
  columnsPanelShowAllButton: 'Mostrar todo',
  columnsPanelHideAllButton: 'Ocultar todo',
  // Filter panel text
  filterPanelAddFilter: 'Agregar filtro',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Borrar',
  filterPanelLogicOperator: 'Operador lógico',
  filterPanelOperator: 'Operadores',
  filterPanelOperatorAnd: 'Y',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor de filtro',
  // Filter operators text
  filterOperatorContains: 'contiene',
  filterOperatorEquals: 'es igual',
  filterOperatorStartsWith: 'comienza con',
  filterOperatorEndsWith: 'termina con',
  filterOperatorIs: 'es',
  filterOperatorNot: 'no es',
  filterOperatorAfter: 'es posterior',
  filterOperatorOnOrAfter: 'es en o posterior',
  filterOperatorBefore: 'es anterior',
  filterOperatorOnOrBefore: 'es en o anterior',
  filterOperatorIsEmpty: 'está vacío',
  filterOperatorIsNotEmpty: 'no esta vacío',
  filterOperatorIsAnyOf: 'es cualquiera de',
  // Filter values text
  filterValueAny: 'cualquiera',
  filterValueTrue: 'verdadero',
  filterValueFalse: 'falso',
  // Column menu text
  columnMenuLabel: 'Menú',
  columnMenuShowColumns: 'Mostrar columnas',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Desordenar',
  columnMenuSortAsc: 'Ordenar ASC',
  columnMenuSortDesc: 'Ordenar DESC',
  // Column header text
  columnHeaderFiltersTooltipActive: count => count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Ordenar',
  // Rows selected footer text
  footerRowSelected: count => count > 1 ? `${count.toLocaleString()} filas seleccionadas` : `${count.toLocaleString()} fila seleccionada`,
  // Total row amount footer text
  footerTotalRows: 'Filas Totales:',
  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleccionar casilla',
  checkboxSelectionSelectAllRows: 'Seleccionar todas las filas',
  checkboxSelectionUnselectAllRows: 'Deseleccionar todas las filas',
  checkboxSelectionSelectRow: 'Seleccionar fila',
  checkboxSelectionUnselectRow: 'Deseleccionar fila',
  // Boolean cell text
  booleanCellTrueLabel: 'si',
  booleanCellFalseLabel: 'no',
  // Actions cell more text
  actionsCellMore: 'más',
  // Column pinning text
  pinToLeft: 'Anclar a la izquierda',
  pinToRight: 'Anclar a la derecha',
  unpin: 'Desanclar',
  // Tree Data
  treeDataGroupingHeaderName: 'Grupo',
  treeDataExpand: 'mostrar hijos',
  treeDataCollapse: 'ocultar hijos',
  // Grouping columns
  groupingColumnHeaderName: 'Grupo',
  groupColumn: name => `Agrupar por ${name}`,
  unGroupColumn: name => `No agrupar por ${name}`,
  // Master/detail
  detailPanelToggle: 'Alternar detalle',
  expandDetailPanel: 'Expandir',
  collapseDetailPanel: 'Contraer',
  // Row reordering text
  rowReorderingHeaderName: 'Reordenar filas',
  // Aggregation
  aggregationMenuItemHeader: 'Agregación',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'avg',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'tamaño'
};
export const esES = getGridLocalization(esESGrid, esESCore);