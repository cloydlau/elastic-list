<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="elastic-list">
    <h2>表格形式：</h2>
    <ElasticList v-model="value" v-bind="props">
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

    <h2>列表形式：</h2>
    <ElasticList v-model="value" v-bind="props">
      <template v-slot="{v,i,showDelBtn,deleteRow}">
        <div class="row">
          <i class="el-icon-circle-close"
             @click="deleteRow(i)"
             v-show="showDelBtn"
          />
          {{v}}
        </div>
      </template>
      <el-button slot="append-row-btn">自定义增加行按钮</el-button>
    </ElasticList>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import ElasticList from '../src/index' //dev
//import { ElasticList } from '../dist/elastic-list.umd' //prod
//import { ElasticList } from 'elastic-list' //todo
import PropsEditor from './PropsEditor'

export default {
  components: { PropsEditor, ElasticList },
  data () {
    return {
      value: Array.from(Array(3)).map((v, i) => ({ name: i })),
      props: {
        sortable: true,
        editable: true,
        rowTemplate: () => ({
          name: Math.random()
        }),
        count: 5,
        elTableProps: {},
      },
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
