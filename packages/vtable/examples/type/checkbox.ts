import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'percent',
        title: 'percent',
        width: 120
      },
      {
        field: 'percent',
        title: 'checkbox',
        width: 120,
        cellType: 'checkbox',
        disable: true,
        checked: true
      },
      {
        field: 'check',
        title: 'checkbox',
        width: 120,
        cellType: 'checkbox'
        // disable: true
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard'
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords([
    { percent: '100%', value: 20, check: { text: 'unchecked', checked: false, disable: false } },
    { percent: '80%', value: 18, check: { text: 'checked', checked: true, disable: false } },
    { percent: '60%', value: 16, check: { text: 'disable', checked: true, disable: true } },
    { percent: '40%', value: 14, check: { text: 'disable', checked: false, disable: true } },
    { percent: '20%', value: 12, check: { text: 'checked', checked: false, disable: false } },
    { percent: '0%', value: 10, check: { text: 'checked', checked: false, disable: false } },
    { percent: '0%', value: -10, check: { text: 'checked', checked: false, disable: false } }
  ]);

  bindDebugTool(instance.scenegraph.stage as any, {
    // customGrapicKeys: ['role', '_updateTag'],
  });

  const { CHECKBOX_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  instance.on(CHECKBOX_STATE_CHANGE, e => {
    console.log(e.col, e.row, e.checked);
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}