---
category: examples
group: Component
title: title
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/tooltip.png
order: 8-4
---

# title

在该示例中，配置了表格的主副标题，并分别设置了不同的样式。

## 关键配置

- `title` 配置表格标题 具体可参考：https://www.visactor.io/vtable/option/ListTable#title

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "caption": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "caption": "Product Name",
        "width": "200"
    },
    {
        "field": "Category",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "caption": "Order Date",
        "width": "auto"
    },
    {
        "field": "Quantity",
        "caption": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "caption": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "caption": "Profit",
        "width": "auto"
    }
];

  const option = {
    records:data,
    columns,
    widthMode:'standard',
    tooltip:{
      isShowOverflowTextTooltip: true,
    },
    title: {
      text: 'North American supermarket sales analysis',
      subtext: `The data includes 15 to 18 years of retail transaction data for North American supermarket`,
      orient: 'top',
      padding:20,
      textStyle:{
        fontSize:30,
        fill: 'black'
      },
      subtextStyle:{
        fontSize:20,
        fill: 'blue'
      }
    },
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
  window['tableInstance'] = tableInstance;
})
```

## 相关教程

[性能优化](link)