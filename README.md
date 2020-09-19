# elastic-list / 弹性列表&动态表格

![preview](./preview.gif)

<br/><br/>

### Features

- √ v-model双绑
- √ 表格展示、列表展示两种展示方式
- √ 自定义列表 slot传入
- √ 对行进行增加、删除、拖拉拽排序
- √ 对行的数量上限、下限进行限制
- √ 自定义新增对象模板
- √ 全局安装/单独引入 通用参数支持全局配置

<br/><br/>

### Installation
![NPM](https://nodei.co/npm/elastic-list.png)
``` bash
$ yarn add pic-viewer
```

**Dependencies**：vue element-ui

<br/>

```js
import { ElasticList } from 'elastic-list'
components: { ElasticList }
```

**Globally:**
```js
import ElasticList from 'elastic-list'
Vue.use(ElasticList)
```

<br/><br/>

### Quick Start

表格形式：

```html
<ElasticList v-model="value">
  <el-table-column label="类型" prop="name"/>
  <!--自定义末尾的操作列-->
  <!--<template #operation-column="{showDelBtn,deleteRow}">
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button>其他按钮</el-button>
        <el-button type="danger"
                   circle
                   icon="el-icon-delete"
                   @click="()=>{deleteRow(scope.$index)}"
                   v-show="showDelBtn"
        />
      </template>
    </el-table-column>
  </template>-->
  <!--自定义增加行按钮-->
  <!--<button slot="append-row-btn">增加一行</button>-->
</ElasticList>
```

列表形式：

```html
<ElasticList v-model="value">
  <template v-slot="{v,i,showDelBtn,deleteRow}">
    <div class="row">
      <el-input v-model="value[i]"/>
      <i class="el-icon-circle-close"
         @click="deleteRow(i)"
         v-show="showDelBtn"
      />
    </div>
  </template>
  <el-button slot="append-row-btn">自定义增加行按钮</el-button>
</ElasticList>
```

props: 

| Attribute | Description | Way Of Configuration | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- | --- |
| value / v-model | 双绑 | props | String | | |
| sortable | 是否开启拖拉拽排序 | global，props | Boolean | | true |
| elTableProps | el-table属性 | global，props | Object | *详见下方说明 | |
| disabled | 是否禁用增加/删除row功能 | global，props | Boolean | | true |
| count | 行数限制 | global，props | Number, Array | *详见下方说明 | undefined（不作限制） |
| rowTemplate | 新增加row对应的对象模板 | global，props | Object, Function | | {} |

elTableProps:

默认值：

```
{
  border: true,
  fit: true,
  stripe: true,
  highlightCurrentRow: true,
}
```

配置方式：与默认值进行混入 [el-table文档](https://element.eleme.cn/#/zh-CN/component/table)

<br/>

count:

比如你想限制不能超过5行：

```js
Vue.use(ElasticList, {
  count: 5              
})
```

如果你还想限制不能低于2行：

```js
Vue.use(ElasticList, {
  count: [2, 5]              
})
```
