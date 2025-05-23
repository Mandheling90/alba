import { jaJP as jaJPCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var jaJPGrid = {
  // Root
  noRowsLabel: '行がありません。',
  noResultsOverlayLabel: '結果がありません。',
  // Density selector toolbar button text
  toolbarDensity: '行間隔',
  toolbarDensityLabel: '行間隔',
  toolbarDensityCompact: 'コンパクト',
  toolbarDensityStandard: '標準',
  toolbarDensityComfortable: '広め',
  // Columns selector toolbar button text
  toolbarColumns: '列一覧',
  toolbarColumnsLabel: '列選択',
  // Filters toolbar button text
  toolbarFilters: 'フィルター',
  toolbarFiltersLabel: 'フィルター表示',
  toolbarFiltersTooltipHide: 'フィルター非表示',
  toolbarFiltersTooltipShow: 'フィルター表示',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return "".concat(count, "\u4EF6\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u9069\u7528\u4E2D");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: '検索…',
  toolbarQuickFilterLabel: '検索',
  toolbarQuickFilterDeleteIconLabel: 'クリア',
  // Export selector toolbar button text
  toolbarExport: 'エクスポート',
  toolbarExportLabel: 'エクスポート',
  toolbarExportCSV: 'CSVダウンロード',
  toolbarExportPrint: '印刷',
  toolbarExportExcel: 'Excelダウンロード',
  // Columns panel text
  columnsPanelTextFieldLabel: '列検索',
  columnsPanelTextFieldPlaceholder: '検索クエリを入力…',
  columnsPanelDragIconLabel: '列並べ替え',
  columnsPanelShowAllButton: 'すべて表示',
  columnsPanelHideAllButton: 'すべて非表示',
  // Filter panel text
  filterPanelAddFilter: 'フィルター追加',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: '削除',
  filterPanelLogicOperator: '論理演算子',
  filterPanelOperator: '演算子',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: '列',
  filterPanelInputLabel: '値',
  filterPanelInputPlaceholder: '値を入力…',
  // Filter operators text
  filterOperatorContains: '...を含む',
  filterOperatorEquals: '...に等しい',
  filterOperatorStartsWith: '...で始まる',
  filterOperatorEndsWith: '...で終わる',
  filterOperatorIs: '...である',
  filterOperatorNot: '...でない',
  filterOperatorAfter: '...より後ろ',
  filterOperatorOnOrAfter: '...以降',
  filterOperatorBefore: '...より前',
  filterOperatorOnOrBefore: '...以前',
  filterOperatorIsEmpty: '...空である',
  filterOperatorIsNotEmpty: '...空でない',
  filterOperatorIsAnyOf: '...のいずれか',
  // Filter values text
  filterValueAny: 'いずれか',
  filterValueTrue: '真',
  filterValueFalse: '偽',
  // Column menu text
  columnMenuLabel: 'メニュー',
  columnMenuShowColumns: '列表示',
  columnMenuManageColumns: '列管理',
  columnMenuFilter: 'フィルター',
  columnMenuHideColumn: '列非表示',
  columnMenuUnsort: 'ソート解除',
  columnMenuSortAsc: '昇順ソート',
  columnMenuSortDesc: '降順ソート',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return "".concat(count, "\u4EF6\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u9069\u7528\u4E2D");
  },
  columnHeaderFiltersLabel: 'フィルター表示',
  columnHeaderSortIconLabel: 'ソート',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return "".concat(count, "\u884C\u3092\u9078\u629E\u4E2D");
  },
  // Total row amount footer text
  footerTotalRows: '総行数:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " / ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'チェックボックス',
  checkboxSelectionSelectAllRows: 'すべての行を選択',
  checkboxSelectionUnselectAllRows: 'すべての行選択を解除',
  checkboxSelectionSelectRow: '行を選択',
  checkboxSelectionUnselectRow: '行選択を解除',
  // Boolean cell text
  booleanCellTrueLabel: '真',
  booleanCellFalseLabel: '偽',
  // Actions cell more text
  actionsCellMore: 'もっと見る',
  // Column pinning text
  pinToLeft: '左側に固定',
  pinToRight: '右側に固定',
  unpin: '固定解除',
  // Tree Data
  treeDataGroupingHeaderName: 'グループ',
  treeDataExpand: '展開',
  treeDataCollapse: '折りたたみ',
  // Grouping columns
  groupingColumnHeaderName: 'グループ',
  groupColumn: function groupColumn(name) {
    return "".concat(name, "\u3067\u30B0\u30EB\u30FC\u30D7\u5316");
  },
  unGroupColumn: function unGroupColumn(name) {
    return "".concat(name, "\u306E\u30B0\u30EB\u30FC\u30D7\u3092\u89E3\u9664");
  },
  // Master/detail
  detailPanelToggle: '詳細パネルの切り替え',
  expandDetailPanel: '展開',
  collapseDetailPanel: '折りたたみ',
  // Row reordering text
  rowReorderingHeaderName: '行並び替え',
  // Aggregation
  aggregationMenuItemHeader: '合計',
  aggregationFunctionLabelSum: '和',
  aggregationFunctionLabelAvg: '平均',
  aggregationFunctionLabelMin: '最小値',
  aggregationFunctionLabelMax: '最大値',
  aggregationFunctionLabelSize: 'サイズ'
};
export var jaJP = getGridLocalization(jaJPGrid, jaJPCore);