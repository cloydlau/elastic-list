<template>
  <div>
    <el-form :model="form">
      <ElasticList
        v-model="form.list"
        v-bind="$attrs.props"
      >
        <template v-slot="{item,i,showDelBtn,deleteRow}">
          <div class="round">
            <!--删除按钮-->
            <i class="el-icon-circle-close"
               @click="deleteRow(i)"
               v-show="showDelBtn"
            />
            <!--可编辑元素-->
            <el-form-item label="名称" :prop="'list.' + i + '.name'">
              <el-input v-model="item.name"/>
            </el-form-item>
            <el-form-item label="排序" :prop="'list.' + i + '.sort'">
              <el-input-number v-model="item.sort"/>
            </el-form-item>
          </div>
        </template>
      </ElasticList>
    </el-form>

    <br/>
    <JsonEditorVue :value="form.list"/>
  </div>
</template>

<script>
import { JsonEditorVue } from 'json-editor-vue'
import ElasticList from '../src/index'

export default {
  components: { ElasticList, JsonEditorVue },
  data () {
    return {
      form: {
        list: [],
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.round {
  border: 1px solid lightgrey;
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;
  position: relative;

  .el-icon-circle-close {
    position: absolute;
    font-size: 32px;
    right: -10px;
    top: -10px;
    cursor: pointer;
  }
}
</style>
