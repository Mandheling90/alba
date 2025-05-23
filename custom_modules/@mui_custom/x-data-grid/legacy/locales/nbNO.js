import { nbNO as nbNOCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var nbNOGrid = {
  // Root
  noRowsLabel: 'Ingen rader',
  noResultsOverlayLabel: 'Fant ingen resultat.',
  // Density selector toolbar button text
  toolbarDensity: 'Tetthet',
  toolbarDensityLabel: 'Tetthet',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Komfortabelt',
  // Columns selector toolbar button text
  toolbarColumns: 'Kolonner',
  toolbarColumnsLabel: 'Velg kolonner',
  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Vis filter',
  toolbarFiltersTooltipHide: 'Skjul fitler',
  toolbarFiltersTooltipShow: 'Vis filter',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " aktive filter") : "".concat(count, " aktivt filter");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Søk…',
  toolbarQuickFilterLabel: 'Søk',
  toolbarQuickFilterDeleteIconLabel: 'Slett',
  // Export selector toolbar button text
  toolbarExport: 'Eksporter',
  toolbarExportLabel: 'Eksporter',
  toolbarExportCSV: 'Last ned som CSV',
  toolbarExportPrint: 'Skriv ut',
  toolbarExportExcel: 'Last ned som Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Finn kolonne',
  columnsPanelTextFieldPlaceholder: 'Kolonne tittel',
  columnsPanelDragIconLabel: 'Reorganiser kolonne',
  columnsPanelShowAllButton: 'Vis alle',
  columnsPanelHideAllButton: 'Skjul alle',
  // Filter panel text
  filterPanelAddFilter: 'Legg til filter',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Slett',
  filterPanelLogicOperator: 'Logisk operator',
  filterPanelOperator: 'Operatører',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eller',
  filterPanelColumns: 'Kolonner',
  filterPanelInputLabel: 'Verdi',
  filterPanelInputPlaceholder: 'Filter verdi',
  // Filter operators text
  filterOperatorContains: 'inneholder',
  filterOperatorEquals: 'er lik',
  filterOperatorStartsWith: 'starter med',
  filterOperatorEndsWith: 'slutter med',
  filterOperatorIs: 'er',
  filterOperatorNot: 'er ikke',
  filterOperatorAfter: 'er etter',
  filterOperatorOnOrAfter: 'er på eller etter',
  filterOperatorBefore: 'er før',
  filterOperatorOnOrBefore: 'er på eller før',
  filterOperatorIsEmpty: 'er tom',
  filterOperatorIsNotEmpty: 'er ikke tom',
  filterOperatorIsAnyOf: 'er en av',
  // Filter values text
  filterValueAny: 'noen',
  filterValueTrue: 'sant',
  filterValueFalse: 'usant',
  // Column menu text
  columnMenuLabel: 'Meny',
  columnMenuShowColumns: 'Vis kolonner',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Skjul',
  columnMenuUnsort: 'Usorter',
  columnMenuSortAsc: 'Sorter ØKENDE',
  columnMenuSortDesc: 'Sorter SYNKENDE',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " aktive filter") : "".concat(count, " aktivt filter");
  },
  columnHeaderFiltersLabel: 'Vis filter',
  columnHeaderSortIconLabel: 'Sorter',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count !== 1 ? "".concat(count.toLocaleString(), " rader valgt") : "".concat(count.toLocaleString(), " rad valgt");
  },
  // Total row amount footer text
  footerTotalRows: 'Totalt antall rader:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " av ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Avmerkingsboks valgt',
  checkboxSelectionSelectAllRows: 'Velg alle rader',
  checkboxSelectionUnselectAllRows: 'Velg bort alle rader',
  checkboxSelectionSelectRow: 'Velg rad',
  checkboxSelectionUnselectRow: 'Velg bort rad',
  // Boolean cell text
  booleanCellTrueLabel: 'sant',
  booleanCellFalseLabel: 'usant',
  // Actions cell more text
  actionsCellMore: 'mer',
  // Column pinning text
  pinToLeft: 'Fest til venstre',
  pinToRight: 'Fest til høyre',
  unpin: 'Løsne',
  // Tree Data
  treeDataGroupingHeaderName: 'Grupper',
  treeDataExpand: 'se barn',
  treeDataCollapse: 'skjul barn',
  // Grouping columns
  groupingColumnHeaderName: 'Grupper',
  groupColumn: function groupColumn(name) {
    return "Grupper p\xE5 ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "Stopp \xE5 grupper p\xE5 ".concat(name);
  },
  // Master/detail
  // detailPanelToggle: 'Detail panel toggle',
  expandDetailPanel: 'Utvid',
  collapseDetailPanel: 'Kollaps',
  // Row reordering text
  rowReorderingHeaderName: 'Rad reorganisering'

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export var nbNO = getGridLocalization(nbNOGrid, nbNOCore);