<template>
  <div>
    <ElasticList
      v-model="value"
      v-bind="$attrs.props"
      :row-template="rowTemplate"
      v-if="!loading"
      :watchValue="false"
    >
      <template v-slot="{v,i,showDelBtn,deleteRow}">
        <div class="row">
          <i class="el-icon-circle-close"
             @click="deleteRow(i)"
             v-show="showDelBtn"
          />
          <el-input v-model="value[i]"/>
        </div>
      </template>
      <el-button slot="append-row-btn">自定义增加行按钮</el-button>
    </ElasticList>
    <br/>
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
      value: [''],
      rowTemplate: i => `第 ${i} 行`,
      loading: true
    }
  },
  created () {
    setTimeout(() => {
      this.value = Array.from(Array(3), (v, i) => i)
      this.loading = false
    }, 500)
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
    right: -16px;
    top: -16px;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
