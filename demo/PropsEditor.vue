<template>
  <div>
    <h2>props</h2>
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <span class="title">【isTable】是否表格形式</span>
          <el-tag>Boolean</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-switch v-model="value.isTable"
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
      <el-collapse-item v-show="value.isTable">
        <template slot="title">
          <span class="title">【elTableProps】el-table属性</span>
          <el-tag>Object</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-input :value="JSON.stringify(value.elTableProps)"/>
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
            <el-switch v-model="value.editable"
                       active-color="#13ce66"
                       :active-value="true"
                       :inactive-value="false">
            </el-switch>
          </div>
          <el-tag type="success">默认值：true</el-tag>
        </el-card>
      </el-collapse-item>
      <div v-show="value.editable">
        <el-collapse-item>
          <template slot="title">
            <span class="title">【count】行数限制</span>
            <el-radio v-model="countType__" label="Number">Number</el-radio>
            <el-radio v-model="countType__" label="Array">Array</el-radio>
          </template>
          <el-card>
            <div slot="header">
              <el-input-number v-model="value.count" clearable :min="1" v-if="countType__==='Number'"/>
              <el-slider v-else
                         v-model="value.count"
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
            <el-radio v-model="rowTemplateType__" label="Object">Object</el-radio>
            <el-radio v-model="rowTemplateType__" label="Function" disabled>Function</el-radio>
          </template>
          <el-card>
            <div slot="header">
              <el-input :value="JSON.stringify(value.rowTemplate)"/>
            </div>
            <el-tag type="success">默认值：{}</el-tag>
          </el-card>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data () {
    return {
      countType__: 'Number',
      rowTemplateType__: 'Object',
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
</style>
