import { csCZ as csCZCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var csCZGrid = {
  // Root
  noRowsLabel: 'Žádné záznamy',
  noResultsOverlayLabel: 'Nenašli se žadné výsledky.',
  // Density selector toolbar button text
  toolbarDensity: 'Hustota',
  toolbarDensityLabel: 'Hustota',
  toolbarDensityCompact: 'Kompaktní',
  toolbarDensityStandard: 'Standartní',
  toolbarDensityComfortable: 'Komfortní',
  // Columns selector toolbar button text
  toolbarColumns: 'Sloupce',
  toolbarColumnsLabel: 'Vybrat sloupec',
  // Filters toolbar button text
  toolbarFilters: 'Filtry',
  toolbarFiltersLabel: 'Zobrazit filtry',
  toolbarFiltersTooltipHide: 'Skrýt filtry',
  toolbarFiltersTooltipShow: 'Zobrazit filtry',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    var pluralForm = 'aktivních filtrů';
    if (count > 1 && count < 5) {
      pluralForm = 'aktivní filtry';
    } else if (count === 1) {
      pluralForm = 'aktivní filtr';
    }
    return "".concat(count, " ").concat(pluralForm);
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Vyhledávat…',
  toolbarQuickFilterLabel: 'Vyhledat',
  toolbarQuickFilterDeleteIconLabel: 'Vymazat',
  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Stáhnout jako CSV',
  toolbarExportPrint: 'Vytisknout',
  toolbarExportExcel: 'Stáhnout jako Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Najít sloupec',
  columnsPanelTextFieldPlaceholder: 'Název sloupce',
  columnsPanelDragIconLabel: 'Uspořádat sloupce',
  columnsPanelShowAllButton: 'Zobrazit vše',
  columnsPanelHideAllButton: 'Skrýt vše',
  // Filter panel text
  filterPanelAddFilter: 'Přidat filtr',
  filterPanelRemoveAll: 'Odstranit vše',
  filterPanelDeleteIconLabel: 'Odstranit',
  filterPanelLogicOperator: 'Logický operátor',
  filterPanelOperator: 'Operátory',
  filterPanelOperatorAnd: 'A',
  filterPanelOperatorOr: 'Nebo',
  filterPanelColumns: 'Sloupce',
  filterPanelInputLabel: 'Hodnota',
  filterPanelInputPlaceholder: 'Hodnota filtru',
  // Filter operators text
  filterOperatorContains: 'obsahuje',
  filterOperatorEquals: 'rovná se',
  filterOperatorStartsWith: 'začíná s',
  filterOperatorEndsWith: 'končí na',
  filterOperatorIs: 'je',
  filterOperatorNot: 'není',
  filterOperatorAfter: 'je po',
  filterOperatorOnOrAfter: 'je na nebo po',
  filterOperatorBefore: 'je před',
  filterOperatorOnOrBefore: 'je na nebo dříve',
  filterOperatorIsEmpty: 'je prázdný',
  filterOperatorIsNotEmpty: 'není prázdný',
  filterOperatorIsAnyOf: 'je jeden z',
  // Filter values text
  filterValueAny: 'jakýkoliv',
  filterValueTrue: 'ano',
  filterValueFalse: 'ne',
  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Zobrazit sloupce',
  columnMenuManageColumns: 'Spravovat sloupce',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Skrýt',
  columnMenuUnsort: 'Zrušit filtry',
  columnMenuSortAsc: 'Seřadit vzestupně',
  columnMenuSortDesc: 'Seřadit sestupně',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    var pluralForm = 'aktivních filtrů';
    if (count > 1 && count < 5) {
      pluralForm = 'aktivní filtry';
    } else if (count === 1) {
      pluralForm = 'aktivní filtr';
    }
    return "".concat(count, " ").concat(pluralForm);
  },
  columnHeaderFiltersLabel: 'Zobrazit filtry',
  columnHeaderSortIconLabel: 'Filtrovat',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    var pluralForm = 'vybraných záznamů';
    if (count > 1 && count < 5) {
      pluralForm = 'vybrané záznamy';
    } else if (count === 1) {
      pluralForm = 'vybraný záznam';
    }
    return "".concat(count, " ").concat(pluralForm);
  },
  // Total row amount footer text
  footerTotalRows: 'Celkem řádků:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    var str = totalCount.toString();
    var firstDigit = str[0];
    var op = ['4', '6', '7'].includes(firstDigit) || firstDigit === '1' && str.length % 3 === 0 ? 'ze' : 'z';
    return "".concat(visibleCount.toLocaleString(), " ").concat(op, " ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Výběr řádku',
  checkboxSelectionSelectAllRows: 'Označit všechny řádky',
  checkboxSelectionUnselectAllRows: 'Odznačit všechny řádky',
  checkboxSelectionSelectRow: 'Označit řádek',
  checkboxSelectionUnselectRow: 'Odznačit řádek',
  // Boolean cell text
  booleanCellTrueLabel: 'ano',
  booleanCellFalseLabel: 'ne',
  // Actions cell more text
  actionsCellMore: 'více',
  // Column pinning text
  pinToLeft: 'Připnout na levo',
  pinToRight: 'Připnout na pravo',
  unpin: 'Odepnout',
  // Tree Data
  treeDataGroupingHeaderName: 'Skupina',
  treeDataExpand: 'zobrazit potomky',
  treeDataCollapse: 'skrýt potomky',
  // Grouping columns
  groupingColumnHeaderName: 'Skupina',
  groupColumn: function groupColumn(name) {
    return "Zeskupit podle ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "P\u0159estat zeskupovat podle ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'Přepnout detail panelu',
  expandDetailPanel: 'Rozbalit',
  collapseDetailPanel: 'Sbalit',
  // Row reordering text
  rowReorderingHeaderName: 'Přeuspořádávání řádků',
  // Aggregation
  aggregationMenuItemHeader: 'Seskupování',
  aggregationFunctionLabelSum: 'součet',
  aggregationFunctionLabelAvg: 'průměr',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'počet'
};
export var csCZ = getGridLocalization(csCZGrid, csCZCore);