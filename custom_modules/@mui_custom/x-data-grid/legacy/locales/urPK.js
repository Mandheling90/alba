import { urPKCore } from './coreLocales';
import { getGridLocalization } from '../utils/getGridLocalization';
var urPKGrid = {
  // Root
  noRowsLabel: 'کوئی قطاریں نہیں',
  noResultsOverlayLabel: 'کوئی نتائج نہیں',
  // Density selector toolbar button text
  toolbarDensity: 'کثافت',
  toolbarDensityLabel: 'کثافت',
  toolbarDensityCompact: 'تنگ',
  toolbarDensityStandard: 'درمیانہ',
  toolbarDensityComfortable: 'مناسب',
  // Columns selector toolbar button text
  toolbarColumns: 'کالمز',
  toolbarColumnsLabel: 'کالمز کو منتخب کریں',
  // Filters toolbar button text
  toolbarFilters: 'فلٹرز',
  toolbarFiltersLabel: 'فلٹرز دکھائیں',
  toolbarFiltersTooltipHide: 'فلٹرز چھپائیں',
  toolbarFiltersTooltipShow: 'فلٹرز دکھائیں',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " \u0641\u0639\u0627\u0644 \u0641\u0644\u0679\u0631\u0632") : "".concat(count, " \u0641\u0644\u0679\u0631\u0632 \u0641\u0639\u0627\u0644");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'تلاش کریں۔۔۔',
  toolbarQuickFilterLabel: 'تلاش کریں',
  toolbarQuickFilterDeleteIconLabel: 'کلئیر کریں',
  // Export selector toolbar button text
  toolbarExport: 'ایکسپورٹ',
  toolbarExportLabel: 'ایکسپورٹ',
  toolbarExportCSV: 'CSV کے طور پر ڈاوٴنلوڈ کریں',
  toolbarExportPrint: 'پرنٹ کریں',
  toolbarExportExcel: 'ایکسل کے طور پر ڈاوٴنلوڈ کریں',
  // Columns panel text
  columnsPanelTextFieldLabel: 'کالم کو تلاش کریں',
  columnsPanelTextFieldPlaceholder: 'کالم کا عنوان',
  columnsPanelDragIconLabel: 'کالم کی ترتیب تبدیل کریں',
  columnsPanelShowAllButton: 'سارے دکھائیں',
  columnsPanelHideAllButton: 'سارے چھپائیں',
  // Filter panel text
  filterPanelAddFilter: 'نیا فلٹر',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'ختم کریں',
  filterPanelLogicOperator: 'لاجک آپریٹر',
  filterPanelOperator: 'آپریٹر',
  filterPanelOperatorAnd: 'اور',
  filterPanelOperatorOr: 'یا',
  filterPanelColumns: 'کالمز',
  filterPanelInputLabel: 'ویلیو',
  filterPanelInputPlaceholder: 'ویلیو کو فلٹر کریں',
  // Filter operators text
  filterOperatorContains: 'شامل ہے',
  filterOperatorEquals: 'برابر ہے',
  filterOperatorStartsWith: 'شروع ہوتا ہے',
  filterOperatorEndsWith: 'ختم ہوتا ہے',
  filterOperatorIs: 'ہے',
  filterOperatorNot: 'نہیں',
  filterOperatorAfter: 'بعد میں ہے',
  filterOperatorOnOrAfter: 'پر یا بعد میں ہے',
  filterOperatorBefore: 'پہلے ہے',
  filterOperatorOnOrBefore: 'پر یا پہلے ہے',
  filterOperatorIsEmpty: 'خالی ہے',
  filterOperatorIsNotEmpty: 'خالی نہیں ہے',
  filterOperatorIsAnyOf: 'ان میں سے کوئی ہے',
  // Filter values text
  filterValueAny: 'کوئی بھی',
  filterValueTrue: 'صحیح',
  filterValueFalse: 'غلط',
  // Column menu text
  columnMenuLabel: 'مینیو',
  columnMenuShowColumns: 'کالم دکھائیں',
  columnMenuManageColumns: 'کالم مینج کریں',
  columnMenuFilter: 'فلٹر',
  columnMenuHideColumn: 'چھپائیں',
  columnMenuUnsort: 'sort ختم کریں',
  columnMenuSortAsc: 'ترتیب صعودی',
  columnMenuSortDesc: 'ترتیب نزولی',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " \u0641\u0639\u0627\u0644 \u0641\u0644\u0679\u0631\u0632") : "".concat(count, " \u0641\u0644\u0679\u0631\u0632 \u0641\u0639\u0627\u0644");
  },
  columnHeaderFiltersLabel: 'فلٹرز دکھائیں',
  columnHeaderSortIconLabel: 'Sort',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count !== 1 ? "".concat(count.toLocaleString(), " \u0645\u0646\u062A\u062E\u0628 \u0642\u0637\u0627\u0631\u06CC\u06BA") : "".concat(count.toLocaleString(), " \u0645\u0646\u062A\u062E\u0628 \u0642\u0637\u0627\u0631");
  },
  // Total row amount footer text
  footerTotalRows: 'کل قطاریں:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(totalCount.toLocaleString(), " \u0645\u06CC\u06BA \u0633\u06D2 ").concat(visibleCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'چیک باکس منتخب کریں',
  checkboxSelectionSelectAllRows: 'تمام قطاریں منتخب کریں',
  checkboxSelectionUnselectAllRows: 'تمام قطاریں نامنتخب کریں ',
  checkboxSelectionSelectRow: 'قطار منتخب کریں',
  checkboxSelectionUnselectRow: 'قطار نامنتخب کریں',
  // Boolean cell text
  booleanCellTrueLabel: 'ہاں',
  booleanCellFalseLabel: 'نہیں',
  // Actions cell more text
  actionsCellMore: 'ذیادہ',
  // Column pinning text
  pinToLeft: 'بائیں جانب pin کریں',
  pinToRight: 'دائیں جانب pin کریں',
  unpin: 'pin ختم کریں',
  // Tree Data
  treeDataGroupingHeaderName: 'گروپ',
  treeDataExpand: 'شاخیں دیکھیں',
  treeDataCollapse: 'شاخیں چھپائیں',
  // Grouping columns
  groupingColumnHeaderName: 'گروپ',
  groupColumn: function groupColumn(name) {
    return "".concat(name, " \u0633\u06D2 \u06AF\u0631\u0648\u067E \u06A9\u0631\u06CC\u06BA");
  },
  unGroupColumn: function unGroupColumn(name) {
    return "".concat(name, " \u0633\u06D2 \u06AF\u0631\u0648\u067E \u062E\u062A\u0645 \u06A9\u0631\u06CC\u06BA");
  },
  // Master/detail
  detailPanelToggle: 'ڈیٹیل پینل کھولیں / بند کریں',
  expandDetailPanel: 'پھیلائیں',
  collapseDetailPanel: 'تنگ کریں',
  // Row reordering text
  rowReorderingHeaderName: 'قطاروں کی ترتیب تبدیل کریں',
  // Aggregation
  aggregationMenuItemHeader: 'Aggregation',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'avg',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'size'
};
export var urPK = getGridLocalization(urPKGrid, urPKCore);