// This file contains copies of the core locales for `MuiTablePagination` released
// after the `@mui/material` package `v5.4.1` (peer dependency of `@mui/x-data-grid`).
// This allows not to bump the minimal version of `@mui/material` in peerDependencies which results
// in broader compatibility between the packages.
// See https://github.com/mui/mui-x/pull/7646#issuecomment-1404605556 for additional context.

export var beBYCore = {
  components: {
    MuiTablePagination: {
      defaultProps: {
        getItemAriaLabel: function getItemAriaLabel(type) {
          if (type === 'first') {
            return 'Перайсці на першую старонку';
          }
          if (type === 'last') {
            return 'Перайсці на апошнюю старонку';
          }
          if (type === 'next') {
            return 'Перайсці на наступную старонку';
          }
          // if (type === 'previous') {
          return 'Перайсці на папярэднюю старонку';
        },
        labelRowsPerPage: 'Радкоў на старонцы:',
        labelDisplayedRows: function labelDisplayedRows(_ref) {
          var from = _ref.from,
            to = _ref.to,
            count = _ref.count;
          return "".concat(from, "\u2013").concat(to, " \u0437 ").concat(count !== -1 ? count : "\u0431\u043E\u043B\u044C\u0448 \u0447\u044B\u043C ".concat(to));
        }
      }
    }
  }
};
export var urPKCore = {
  components: {
    MuiTablePagination: {
      defaultProps: {
        getItemAriaLabel: function getItemAriaLabel(type) {
          if (type === 'first') {
            return 'پہلے صفحے پر جائیں';
          }
          if (type === 'last') {
            return 'آخری صفحے پر جائیں';
          }
          if (type === 'next') {
            return 'اگلے صفحے پر جائیں';
          }
          // if (type === 'previous') {
          return 'پچھلے صفحے پر جائیں';
        },
        labelRowsPerPage: 'ایک صفحے پر قطاریں:',
        labelDisplayedRows: function labelDisplayedRows(_ref2) {
          var from = _ref2.from,
            to = _ref2.to,
            count = _ref2.count;
          return "".concat(count !== -1 ? "".concat(count, " \u0645\u06CC\u06BA \u0633\u06D2") : "".concat(to, " \u0633\u06D2 \u0630\u06CC\u0627\u062F\u06C1 \u0645\u06CC\u06BA \u0633\u06D2"), " ").concat(from, " \u0633\u06D2 ").concat(to, " \u0642\u0637\u0627\u0631\u06CC\u06BA");
        }
      }
    }
  }
};