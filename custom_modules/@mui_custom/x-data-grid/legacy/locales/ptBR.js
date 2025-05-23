import { ptBR as ptBRCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var ptBRGrid = {
  // Root
  noRowsLabel: 'Nenhuma linha',
  noResultsOverlayLabel: 'Nenhum resultado encontrado.',
  // Density selector toolbar button text
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Confortável',
  // Columns selector toolbar button text
  toolbarColumns: 'Colunas',
  toolbarColumnsLabel: 'Exibir seletor de colunas',
  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Exibir filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Exibir filtros',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return "".concat(count, " ").concat(count !== 1 ? 'filtros' : 'filtro', " ").concat(count !== 1 ? 'ativos' : 'ativo');
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Procurar…',
  toolbarQuickFilterLabel: 'Procurar',
  toolbarQuickFilterDeleteIconLabel: 'Limpar',
  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Baixar como CSV',
  toolbarExportPrint: 'Imprimir',
  toolbarExportExcel: 'Baixar como Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Localizar coluna',
  columnsPanelTextFieldPlaceholder: 'Título da coluna',
  columnsPanelDragIconLabel: 'Reordenar Coluna',
  columnsPanelShowAllButton: 'Mostrar todas',
  columnsPanelHideAllButton: 'Ocultar todas',
  // Filter panel text
  filterPanelAddFilter: 'Adicionar filtro',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Excluir',
  filterPanelLogicOperator: 'Operador lógico',
  filterPanelOperator: 'Operador',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colunas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Filtrar valor',
  // Filter operators text
  filterOperatorContains: 'contém',
  filterOperatorEquals: 'é igual a',
  filterOperatorStartsWith: 'começa com',
  filterOperatorEndsWith: 'termina com',
  filterOperatorIs: 'é',
  filterOperatorNot: 'não é',
  filterOperatorAfter: 'após',
  filterOperatorOnOrAfter: 'em ou após',
  filterOperatorBefore: 'antes de',
  filterOperatorOnOrBefore: 'em ou antes de',
  filterOperatorIsEmpty: 'está vazio',
  filterOperatorIsNotEmpty: 'não está vazio',
  filterOperatorIsAnyOf: 'é qualquer um dos',
  // Filter values text
  filterValueAny: 'qualquer',
  filterValueTrue: 'verdadeiro',
  filterValueFalse: 'falso',
  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Exibir colunas',
  columnMenuManageColumns: 'Gerir colunas',
  columnMenuFilter: 'Filtrar',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Desfazer ordenação',
  columnMenuSortAsc: 'Ordenar do menor para o maior',
  columnMenuSortDesc: 'Ordenar do maior para o menor',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return "".concat(count, " ").concat(count !== 1 ? 'filtros' : 'filtro', " ").concat(count !== 1 ? 'ativos' : 'ativo');
  },
  columnHeaderFiltersLabel: 'Exibir Filtros',
  columnHeaderSortIconLabel: 'Ordenar',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count !== 1 ? "".concat(count.toLocaleString(), " linhas selecionadas") : "".concat(count.toLocaleString(), " linha selecionada");
  },
  // Total row amount footer text
  footerTotalRows: 'Total de linhas:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " de ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleção',
  checkboxSelectionSelectAllRows: 'Selecionar todas linhas',
  checkboxSelectionUnselectAllRows: 'Deselecionar todas linhas',
  checkboxSelectionSelectRow: 'Selecionar linha',
  checkboxSelectionUnselectRow: 'Deselecionar linha',
  // Boolean cell text
  booleanCellTrueLabel: 'sim',
  booleanCellFalseLabel: 'não',
  // Actions cell more text
  actionsCellMore: 'mais',
  // Column pinning text
  pinToLeft: 'Fixar à esquerda',
  pinToRight: 'Fixar à direita',
  unpin: 'Desafixar',
  // Tree Data
  treeDataGroupingHeaderName: 'Grupo',
  treeDataExpand: 'mostrar filhos',
  treeDataCollapse: 'esconder filhos',
  // Grouping columns
  groupingColumnHeaderName: 'Grupo',
  groupColumn: function groupColumn(name) {
    return "Agrupar por ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "Parar agrupamento por ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'Painel de detalhes',
  expandDetailPanel: 'Expandir',
  collapseDetailPanel: 'Esconder',
  // Row reordering text
  rowReorderingHeaderName: 'Reorganizar linhas'

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export var ptBR = getGridLocalization(ptBRGrid, ptBRCore);