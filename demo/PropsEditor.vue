<template>
  <div>
    <h2>props</h2>

    <el-form>
      <el-form-item label="elTableProps">
        <json-editor-vue v-model="value.elTableProps"/>
      </el-form-item>
      <el-form-item label="animate">
        <el-radio v-model="animateType__" label="string">string</el-radio>
        <el-radio v-model="animateType__" label="array">array</el-radio>
        <el-input v-model="value.animate" clearable v-if="animateType__==='string'"/>
        <json-editor-vue v-else v-model="value.animate"/>
      </el-form-item>
      <el-form-item label="sortable">
        <el-switch v-model="value.sortable"
                   :active-value="true"
                   :inactive-value="false">
        </el-switch>
      </el-form-item>
      <el-form-item label="disabled">
        <el-switch v-model="value.disabled"
                   :active-value="true"
                   :inactive-value="false">
        </el-switch>
      </el-form-item>
      <template v-show="!value.disabled">
        <el-form-item label="count">
          <el-radio v-model="countType__" label="number">number</el-radio>
          <el-radio v-model="countType__" label="array">array</el-radio>
          <el-input-number v-model="value.count" clearable :min="1" v-if="countType__==='number'"/>
          <el-slider
            v-else
            v-model="value.count"
            range
            show-stops
            :max="5"
          />
        </el-form-item>
        <el-form-item label="rowTemplate">
          <el-radio v-model="rowTemplateType__" label="Object">Object</el-radio>
          <el-radio v-model="rowTemplateType__" label="Function" disabled>Function</el-radio>
          <json-editor-vue v-if="typeof value.rowTemplate==='object'" v-model="value.rowTemplate"/>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { JsonEditorVue } from 'json-editor-vue'

export default {
  props: {
    value: Object
  },
  components: { JsonEditorVue },
  watch: {
    animateType__: {
      immediate: true,
      handler (newVal) {
        if (newVal === 'array' && !this.value.animate) {
          this.value.animate = []
        }
      }
    }
  },
  data () {
    return {
      countType__: 'number',
      animateType__: 'string',
      rowTemplateType__: 'object',
      elTableProps__: {
        border: true,
        fit: true,
        stripe: true,
        highlightCurrentRow: true,
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.el-tag ~ .el-tag {
  margin-left: 16px;
}

.title {
  margin-right: 16px;
}
</style>
