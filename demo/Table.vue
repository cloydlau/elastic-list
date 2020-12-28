<template>
  <div>
    <ElasticList
      v-model="value"
      v-bind="$attrs.props"
      :sortablejsProps="{handle:'.handle'}"
      :row-template="rowTemplate"
      ref="elasticList"
      @select="onSelect"
    >
      <el-table-column type="index">
        <template slot-scope="scope">
          <span class="handle">
            {{ '# ' + (scope.$index + 1) }}
          </span>
        </template>
      </el-table-column>
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
    <br/>
    <el-button @click="set" type="primary" style="width:100%">编程式设值</el-button>

    <br/><br/>
    <JsonEditorVue :value="value"/>
  </div>
</template>

<script>
import { JsonEditorVue } from 'json-editor-vue'
import ElasticList from '../src/index'

export default {
  components: { ElasticList, JsonEditorVue },
  data () {
    return {
      value: Array.from(Array(3), (v, i) => ({ name: i })),
      rowTemplate: () => ({
        name: Math.random()
      }),
    }
  },
  mounted () {
    this.$refs.elasticList.$children[0].$on('row-click', e => {
      console.log(e)
    })
  },
  methods: {
    set () {
      this.value = Array.from(Array(3), (v, i) => ({ name: i + 10 }))
    },
    onSelect (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.elastic-list {
  cursor: unset;
}

.handle {
  cursor: move;
}
</style>
