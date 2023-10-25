import type { ILine, ISymbol, IThemeSpec } from '@visactor/vrender';
import { createLine, createSymbol } from '@visactor/vrender';
import { PointScale, LinearScale } from '@visactor/vscale';
import { isValid } from '../../../tools/util';
import { Group } from '../../graphic/group';
import type { CellInfo, CheckboxColumnDefine, CheckboxStyleOption, SparklineSpec } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { isObject } from '@visactor/vutils';
import { CheckBox } from '@visactor/vrender-components';
import { getHierarchyOffset } from '../../utils/get-hierarchy-offset';
import { getOrApply } from '../../../tools/helper';

export function createCheckboxCellGroup(
  cellGroup: Group | null,
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  colWidth: number | 'auto',
  width: number,
  height: number,
  padding: number[],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  define: CheckboxColumnDefine
) {
  // cell
  if (!cellGroup) {
    cellGroup = new Group({
      x: xOrigin,
      y: yOrigin,
      width,
      height,

      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,

      strokeArrayWidth: (cellTheme?.group as any)?.strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,

      lineCap: 'square',

      clip: true
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    columnGroup?.addChild(cellGroup);
  }

  // chart
  const checkboxComponent = createCheckbox(col, row, colWidth, width, height, padding, cellTheme, define, table);
  if (checkboxComponent) {
    cellGroup.appendChild(checkboxComponent);
  }

  checkboxComponent.render();

  width -= padding[1] + padding[3];
  height -= padding[0] + padding[2];
  if (textAlign === 'center') {
    checkboxComponent.setAttribute('x', padding[3] + (width - checkboxComponent.AABBBounds.width()) / 2);
  } else if (textAlign === 'right') {
    checkboxComponent.setAttribute('x', padding[3] + width - checkboxComponent.AABBBounds.width());
  } else {
    checkboxComponent.setAttribute('x', padding[3]);
  }

  if (textBaseline === 'middle') {
    checkboxComponent.setAttribute('y', padding[0] + (height - checkboxComponent.AABBBounds.height()) / 2);
  } else if (textBaseline === 'bottom') {
    checkboxComponent.setAttribute('y', padding[0] + height - checkboxComponent.AABBBounds.height());
  } else {
    checkboxComponent.setAttribute('y', padding[0]);
  }

  return cellGroup;
}

function createCheckbox(
  col: number,
  row: number,
  colWidth: number | 'auto',
  cellWidth: number,
  cellHeight: number,
  padding: number[],
  cellTheme: IThemeSpec,
  define: CheckboxColumnDefine,
  table: BaseTableAPI
) {
  const value = table.getCellValue(col, row) as string | { text: string; checked: boolean; disable: boolean };
  const dataValue = table.getCellOriginValue(col, row);
  let isChecked;
  let isDisabled;
  let text = value as string;
  if (isObject(value)) {
    isChecked = value.checked;
    isDisabled = value.disable;
    text = value.text;
  }

  const hierarchyOffset = getHierarchyOffset(col, row, table);
  const cellStyle = table._getCellStyle(col, row) as CheckboxStyleOption; // to be fixed
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const { lineClamp } = cellStyle;
  const { checked, disable } = define;

  const globalChecked = getOrApply(checked as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });
  const globalDisable = getOrApply(disable as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });

  const autoColWidth = colWidth === 'auto';
  const autoRowHeight = table.heightMode === 'autoHeight';

  const attribute = {
    text: text.length === 1 && !autoWrapText ? text[0] : text, // 单行(no-autoWrapText)为字符串，多行(autoWrapText)为字符串数组
    maxLineWidth: autoColWidth ? Infinity : cellWidth - (padding[1] + padding[3] + hierarchyOffset),
    // fill: true,
    // textAlign: 'left',
    textBaseline: 'top',
    autoWrapText,
    lineClamp,
    wordBreak: 'break-word',
    // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
    heightLimit: autoRowHeight ? -1 : cellHeight - (padding[0] + padding[2]),
    pickable: false,
    dx: hierarchyOffset
  };
  const testAttribute = cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute;

  const checkbox = new CheckBox({
    x: 0,
    y: 0,
    text: testAttribute,
    checked: isChecked ?? globalChecked ?? false,
    disabled: isDisabled ?? globalDisable ?? false
  });
  checkbox.name = 'checkbox';

  return checkbox;
}