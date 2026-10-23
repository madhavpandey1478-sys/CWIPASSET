
(function () {
    "use strict";

    /* =========================================================
       CWIP ASSET DISPOSAL
       Fields: Asset ID, Retirement Month
       Independent from CWIP ASSET UPDATE
       ========================================================= */

    var FIELDS = [
        {
            field: "assetId",
            label: "ASSET ID",
            type: "text",
            width: 220,
            readonly: true
        },
        {
            field: "retirementMonth",
            label: "RETIREMENT MONTH",
            type: "month",
            width: 220
        }
    ];

    var CSS = `
        :host {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 250px;
            font-family: "72", "72full", Arial, sans-serif;
            color: #243746;
            font-size: 12px;
        }

        * {
            box-sizing: border-box;
        }

        .wrap {
            height: 100%;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            background: #fff;
            border: 1px solid #d9e0e7;
            border-radius: 8px;
            overflow: hidden;
        }

        .widget-title {
            padding: 12px 14px;
            background: #edf4fb;
            color: #243746;
            border-bottom: 1px solid #d4e0eb;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: .3px;
        }

        .top {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            padding: 10px;
            background: #f8fafc;
            border-bottom: 1px solid #dfe6ee;
            min-height: 56px;
        }

        .search {
            height: 36px;
            width: 265px;
            max-width: 100%;
            padding: 0 12px;
            border: 1px solid #cfd8e3;
            border-radius: 7px;
            background: #fff;
            font: inherit;
            outline: none;
        }

        .search:focus {
            border-color: #0a6ed1;
            box-shadow: 0 0 0 2px #0a6ed11c;
        }

        .visible {
            color: #617586;
            white-space: nowrap;
        }

        .actions {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-left: auto;
            flex-wrap: wrap;
        }

        button {
            font: 600 12px "72", "72full", Arial, sans-serif;
            cursor: pointer;
            border: 1px solid #d1dae4;
            background: #fff;
            color: #1767ad;
            border-radius: 7px;
            padding: 0 13px;
            height: 32px;
            white-space: nowrap;
        }

        button:hover {
            background: #eef6ff;
            border-color: #a9c9ed;
        }

        button.primary {
            background: #0a6ed1;
            border-color: #0a6ed1;
            color: #fff;
        }

        button.primary:hover {
            background: #085caf;
        }

        button:disabled {
            opacity: .45;
            cursor: default;
        }

        .paging {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 9px;
            padding: 7px 10px;
            color: #6a7c8c;
            border-bottom: 1px solid #e1e7ed;
            min-height: 42px;
        }

        .page-info {
            white-space: nowrap;
        }

        .table-area {
            flex: 1;
            min-height: 100px;
            overflow: auto;
            background: #fff;
        }

        table {
            border-collapse: separate;
            border-spacing: 0;
            table-layout: fixed;
            width: 100%;
            min-width: 560px;
        }

        th {
            position: sticky;
            top: 0;
            z-index: 3;
            height: 40px;
            padding: 0 10px;
            text-align: left;
            white-space: nowrap;
            background: #edf4fb;
            color: #30495f;
            border-bottom: 1px solid #d4e0eb;
            font-size: 11px;
            font-weight: 700;
        }

        th:first-child,
        td:first-child {
            width: 60px;
            text-align: center;
        }

        td {
            height: 46px;
            padding: 5px 8px;
            border-bottom: 1px solid #e7ebf0;
            background: #fff;
            vertical-align: middle;
        }

        tr:hover td {
            background: #f7fbff;
        }

        tr.selected td {
            background: #e5f2ff;
        }

        .check {
            width: 18px;
            height: 18px;
            accent-color: #0a6ed1;
            cursor: pointer;
            vertical-align: middle;
        }

        .cell {
            width: 100%;
            height: 34px;
            border: 1px solid #d7dee7;
            border-radius: 6px;
            background: #fff;
            padding: 0 9px;
            color: #2e4356;
            font: 12px "72", "72full", Arial, sans-serif;
            outline: none;
            min-width: 0;
        }

        .cell:focus {
            border-color: #0a6ed1;
            box-shadow: 0 0 0 2px #0a6ed11c;
        }

        .cell[readonly] {
            background: #f1f4f7;
            color: #5f7181;
            cursor: not-allowed;
        }

        .status {
            display: flex;
            align-items: center;
            gap: 18px;
            min-height: 32px;
            padding: 0 10px;
            border-top: 1px solid #dfe6ee;
            background: #f8fafc;
            color: #607486;
            font-size: 11px;
            white-space: nowrap;
        }

        .status strong {
            color: #344d62;
        }

        .empty {
            padding: 24px;
            text-align: center;
            color: #728394;
        }
    `;

    var template = document.createElement("template");

    template.innerHTML =
        "<style>" + CSS + "</style>" +
        '<div class="wrap">' +
'<div class="widget-title">ASSET DISPOSAL</div>' +
            '<div class="top">' +
                '<input id="search" class="search" ' +
                    'placeholder="Search Asset ID..." ' +
                    'aria-label="Search Asset ID">' +

                '<span class="visible">Visible: ' +
                    '<strong id="visibleCount">0</strong></span>' +

                '<div class="actions">' +
                    '<button id="load">Load Data</button>' +
                    '<button id="save" class="primary">Save Changes</button>' +
                    '<button id="clear">Clear</button>' +
                '</div>' +
            '</div>' +

            '<div class="paging">' +
                '<span id="range" class="page-info">' +
                    'Showing 0 to 0 of 0</span>' +
                '<button id="prev">Previous</button>' +
                '<span id="page">Page 1 of 1</span>' +
                '<button id="next">Next</button>' +
            '</div>' +

            '<div class="table-area">' +
                '<table>' +
                    '<thead><tr id="head"></tr></thead>' +
                    '<tbody id="body"></tbody>' +
                '</table>' +
            '</div>' +

            '<div class="status">' +
                '<span>Total Rows: <strong id="total">0</strong></span>' +
                '<span>Selected Rows: <strong id="selected">0</strong></span>' +
            '</div>' +
        '</div>';

    class AssetDisposalWidget extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" })
                .appendChild(template.content.cloneNode(true));

            this._rows = [];
            this._selected = new Set();
            this._page = 1;
            this._pageSize = 50;
            this._search = "";
            this._lastEvent = "";

            var self = this;

            [
                "search",
                "visibleCount",
                "load",
                "save",
                "clear",
                "range",
                "prev",
                "page",
                "next",
                "head",
                "body",
                "total",
                "selected"
            ].forEach(function (id) {
                self[id] = self.shadowRoot.getElementById(id);
            });

            this._bind();
            this._render();
        }

        connectedCallback() {
            this._fire("onReady", "ready");
        }

        _bind() {
            var self = this;

            this.search.addEventListener("input", function () {
                self._search = this.value;
                self._page = 1;
                self._render();
            });

            this.prev.onclick = function () {
                if (self._page > 1) {
                    self._page--;
                    self._render();
                }
            };

            this.next.onclick = function () {
                if (self._page < self._pageCount()) {
                    self._page++;
                    self._render();
                }
            };

            this.load.onclick = function () {
                self._fire("onDataChange", "loadData");
            };

            this.save.onclick = function () {
                self._fire(
                    "onDataChange",
                    "saveChanges|" + self._rows.length
                );
            };

            this.clear.onclick = function () {
                self._clearSelectedOrAll();
            };
        }

        _fire(name, value) {
            this._lastEvent = String(value == null ? "" : value);

            this.dispatchEvent(
                new Event(name, { bubbles: true })
            );
        }

        _key(row, index) {
            if (!row.__widgetKey) {
                row.__widgetKey =
                    "disposal_" + index + "_" +
                    Math.random().toString(36).slice(2);
            }

            return row.__widgetKey;
        }

        _normalize(rows) {
            return rows.map(function (source) {
                var row = Object.assign({}, source);

                if (row.assetId === undefined && row.AssetID !== undefined) {
                    row.assetId = row.AssetID;
                }

                if (
                    row.retirementMonth === undefined &&
                    row.RetirementMonth !== undefined
                ) {
                    row.retirementMonth = row.RetirementMonth;
                }

                if (
                    row.retirementMonth === undefined &&
                    row.retirement_month !== undefined
                ) {
                    row.retirementMonth = row.retirement_month;
                }

                if (row.assetId == null) {
                    row.assetId = "";
                }

                if (row.retirementMonth == null) {
                    row.retirementMonth = "";
                }

                row.selected = false;

                return row;
            });
        }

        /*
         * SAC scripting:
         * Pass a JSON array containing assetId and retirementMonth.
         * Retirement month format: YYYY-MM.
         */
        setData(raw) {
            try {
                var parsed =
                    typeof raw === "string" ? JSON.parse(raw) : raw;

                this._rows = this._normalize(
                    Array.isArray(parsed) ? parsed : []
                );
            } catch (e) {
                this._rows = [];
            }

            this._selected.clear();
            this._page = 1;
            this._render();
        }

        /*
         * Returns all rows as JSON for SAC scripting.
         */
        getData() {
            return JSON.stringify(
                this._rows.map(function (row) {
                    var result = Object.assign({}, row);

                    delete result.__widgetKey;
                    delete result.selected;

                    return result;
                })
            );
        }

        getLastEvent() {
            return this._lastEvent;
        }

        /*
         * Returns selected rows as JSON for SAC scripting.
         */
        getSelectedData() {
            var self = this;

            return JSON.stringify(
                this._rows.filter(function (row, index) {
                    return self._selected.has(self._key(row, index));
                }).map(function (row) {
                    var result = Object.assign({}, row);

                    delete result.__widgetKey;
                    delete result.selected;

                    return result;
                })
            );
        }

        /*
         * Sets a cell value programmatically.
         * Asset ID remains read-only in the user interface.
         */
        setCellValue(rowIndex, field, value) {
            if (!this._rows[rowIndex]) {
                return;
            }

            if (field === "assetId") {
                this._rows[rowIndex].assetId = value;
            } else if (field === "retirementMonth") {
                this._rows[rowIndex].retirementMonth = value;
            } else {
                return;
            }

            this._render();
        }

        _filtered() {
            var query = this._search.toLowerCase();

            return this._rows.map(function (row, index) {
                return { row: row, index: index };
            }).filter(function (item) {
                var id = String(item.row.assetId || "").toLowerCase();

                return !query || id.indexOf(query) !== -1;
            });
        }

        _pageCount() {
            return Math.max(
                1,
                Math.ceil(this._filtered().length / this._pageSize)
            );
        }

        _render() {
            var self = this;
            var filtered = this._filtered();
            var pageCount = this._pageCount();

            if (this._page > pageCount) {
                this._page = pageCount;
            }

            var start = (this._page - 1) * this._pageSize;
            var pageItems = filtered.slice(
                start,
                start + this._pageSize
            );

            this.head.innerHTML =
                '<th class="selhead">' +
                    'SEL <input id="selectAll" class="check" type="checkbox">' +
                '</th>' +
                FIELDS.map(function (col) {
                    return '<th style="width:' + col.width + 'px">' +
                        self._esc(col.label) +
                    '</th>';
                }).join("");

            var selectAll =
                this.shadowRoot.getElementById("selectAll");

            selectAll.checked =
                pageItems.length > 0 &&
                pageItems.every(function (item) {
                    return self._selected.has(
                        self._key(item.row, item.index)
                    );
                });

            selectAll.onchange = function () {
                pageItems.forEach(function (item) {
                    var key = self._key(item.row, item.index);

                    if (selectAll.checked) {
                        self._selected.add(key);
                    } else {
                        self._selected.delete(key);
                    }
                });

                self._render();

                self._fire(
                    "onDataChange",
                    "selectAll|" + selectAll.checked
                );
            };

            this.body.innerHTML = "";

            if (!pageItems.length) {
                this.body.innerHTML =
                    '<tr><td class="empty" colspan="3">' +
                    'No matching records</td></tr>';
            }

            pageItems.forEach(function (item) {
                var row = item.row;
                var index = item.index;
                var key = self._key(row, index);
                var tr = document.createElement("tr");

                if (self._selected.has(key)) {
                    tr.classList.add("selected");
                }

                var selectCell = document.createElement("td");
                var checkbox = document.createElement("input");

                checkbox.type = "checkbox";
                checkbox.className = "check";
                checkbox.checked = self._selected.has(key);

                checkbox.onchange = function () {
                    if (checkbox.checked) {
                        self._selected.add(key);
                    } else {
                        self._selected.delete(key);
                    }

                    self._render();

                    self._fire(
                        "onDataChange",
                        "selectRow|" + index + "|" + checkbox.checked
                    );
                };

                selectCell.appendChild(checkbox);
                tr.appendChild(selectCell);

                FIELDS.forEach(function (col) {
                    var td = document.createElement("td");
                    var control = document.createElement("input");

                    control.type = col.type;
                    control.className = "cell";
                    control.value = row[col.field] || "";

                    if (col.readonly) {
                        control.readOnly = true;
                        control.setAttribute(
                            "aria-label",
                            "Read-only Asset ID"
                        );
                    }

                    control.addEventListener("change", function () {
                        if (col.readonly) {
                            return;
                        }

                        row[col.field] = control.value;
                        self._updateStatus();

                        self._fire(
                            "onFieldChange",
                            "fieldChange|" + index + "|" +
                            col.field + "|" + control.value
                        );
                    });

                    td.appendChild(control);
                    tr.appendChild(td);
                });

                self.body.appendChild(tr);
            });

            this.visibleCount.textContent = filtered.length;

            this.range.textContent = filtered.length
                ? "Showing " + (start + 1) + " to " +
                  Math.min(start + this._pageSize, filtered.length) +
                  " of " + filtered.length
                : "Showing 0 to 0 of 0";

            this.page.textContent =
                "Page " + this._page + " of " + pageCount;

            this.prev.disabled = this._page <= 1;
            this.next.disabled = this._page >= pageCount;

            this._updateStatus();
        }

        _clearSelectedOrAll() {
            var self = this;

            if (this._selected.size) {
                this._rows.forEach(function (row, index) {
                    if (
                        self._selected.has(
                            self._key(row, index)
                        )
                    ) {
                        row.retirementMonth = "";
                    }
                });

                this._selected.clear();
            } else {
                this._rows.forEach(function (row) {
                    row.retirementMonth = "";
                });
            }

            this._render();
            this._fire("onClear", "clear");
        }

        _updateStatus() {
            this.total.textContent = this._rows.length;
            this.selected.textContent = this._selected.size;
        }

        _esc(value) {
            return String(value == null ? "" : value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    /*
     * Unique custom element registration.
     * Does not overwrite CWIP ASSET UPDATE.
     */
    if (!customElements.get("com-madhav-assetdisposal")) {
        customElements.define(
            "com-madhav-assetdisposal",
            AssetDisposalWidget
        );
    }
})();
