<template>
  <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" title="elastic-list">
    <!--表格展示-->
    <ElasticList v-model="value" v-bind="props" v-if="props.isTable">
      <el-table-column label="类型" prop="name"/>
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
    </ElasticList>

    <!--列表展示-->
    <ElasticList v-model="value" v-bind="props" v-else>
      <template v-if="!props.isTable" v-slot="{v,i,showDelBtn,deleteRow}">
        <div class="row">
          <i class="el-icon-circle-close"
             @click="deleteRow(i)"
             v-show="showDelBtn"
          />
          {{v}}
        </div>
      </template>
      <el-button v-if="!props.isTable" slot="append-row-btn">自定义添加行按钮</el-button>
    </ElasticList>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import ElasticList from '../src/index'
//todo: import { ElasticList } from 'elastic-list'
import PropsEditor from './PropsEditor'

export default {
  components: { ElasticList, PropsEditor },
  data () {
    return {
      value: Array.from(Array(3)).map((v, i) => ({ name: i })),
      props:{
        isTable: true,
        editable: true,
        rowTemplate: {
          name: 'new'
        },
        count: 5,
        elTableProps: {},
      },

      showDialog: true,
    }
  },
}
</script>

<style lang="scss" scoped>
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
