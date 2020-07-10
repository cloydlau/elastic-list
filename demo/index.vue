<template>
  <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" title="elastic-list">
    <ElasticList v-model="value"
                 :isTable="isTable"
                 :editable="editable"
                 :rowTemplate="rowTemplate"
                 :count="count"
                 :elTableProps="elTableProps"
    >
      <el-table-column label="类型" prop="name" v-if="isTable"/>
      <!--覆盖默认的操作列-->
      <!--<template #operation-column="{showDelBtn,deleteRow}" v-if="isTable">
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

      <!--<template v-slot> can only appear at the root level inside the receiving component-->
      <template v-if="!isTable" v-slot="{v,i,showDelBtn,deleteRow}">
        <div class="row">
          <i class="el-icon-circle-close"
             @click="deleteRow(i)"
             v-show="showDelBtn"
          />
          {{v}}
        </div>
      </template>
      <el-button v-if="!isTable" slot="append-row-btn">自定义添加行按钮</el-button>
    </ElasticList>

    <h2>props</h2>
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <span class="title">【isTable】是否表格形式</span>
          <el-tag>Boolean</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-switch v-model="isTable"
                       active-color="#13ce66"
                       :active-value="true"
                       :inactive-value="false">
            </el-switch>
          </div>
          <el-tag type="success">默认值：true</el-tag>
          <el-tag>表格采用的是element</el-tag>
          <el-tag>支持自定义列表</el-tag>
        </el-card>
      </el-collapse-item>
      <el-collapse-item v-show="isTable">
        <template slot="title">
          <span class="title">【elTableProps】el-table属性</span>
          <el-tag>Object</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-input :value="JSON.stringify(elTableProps)"/>
          </div>
          <el-tag type="success">默认值：{border:true, fit:true, stripe:true, highlightCurrentRow:true,}</el-tag>
        </el-card>
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          <span class="title">【editable】是否开启增加/删除row功能</span>
          <el-tag>Boolean</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-switch v-model="editable"
                       active-color="#13ce66"
                       :active-value="true"
                       :inactive-value="false">
            </el-switch>
          </div>
          <el-tag type="success">默认值：true</el-tag>
        </el-card>
      </el-collapse-item>
      <div v-show="editable">
        <el-collapse-item>
          <template slot="title">
            <span class="title">【count】行数限制</span>
            <el-radio v-model="countType__" label="Number">Number</el-radio>
            <el-radio v-model="countType__" label="Array">Array</el-radio>
          </template>
          <el-card>
            <div slot="header">
              <el-input-number v-model="count" clearable :min="1" v-if="countType__==='Number'"/>
              <el-slider v-else
                         v-model="count"
                         range
                         show-stops
                         :max="5"
              />
            </div>
            <el-tag type="success">默认值：undefined（不作限制）</el-tag>
            <el-tag v-show="countType__==='Number'">最大行数限制</el-tag>
            <el-tag v-show="countType__==='Array'">['最小行数限制', '最大行数限制']</el-tag>
          </el-card>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <span class="title">【rowTemplate】新增加row对应的对象模板</span>
            <el-tag>Object</el-tag>
          </template>
          <el-card>
            <div slot="header">
              <el-input :value="JSON.stringify(rowTemplate)"/>
            </div>
            <el-tag type="success">默认值：{}</el-tag>
          </el-card>
        </el-collapse-item>
      </div>
    </el-collapse>
  </el-dialog>
</template>

<script>
import ElasticList from '../src/index'
//todo: import { ElasticList } from 'elastic-list'

export default {
  components: { ElasticList },
  data () {
    return {
      value: Array.from(Array(3)).map((v, i) => ({ name: i })),
      isTable: true,
      editable: true,
      rowTemplate: {
        name: 'new'
      },
      count: 5,
      elTableProps: {},

      countType__: 'Number',
      showDialog: true,
    }
  },
}
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 50px;
}

.el-tag ~ .el-tag {
  margin-left: 16px;
}

.title {
  margin-right: 16px;
}

.row {
  border: 1px solid lightgrey;
  border-radius: 3px;
  margin-bottom: 16px;
  padding: 16px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  i {
    position: absolute;
    font-size: 32px;
    right: 16px;
    top: 10px;
    cursor: pointer;
  }
}
</style>
