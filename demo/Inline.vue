<template>
  <div class="inline">
    <div>
      <ElasticList
        v-model="value1"
        v-bind="$attrs.props"
        :sortablejs-props="{
          group: 'x',
        }"
      >

        <template v-slot="{item,i,showDelBtn,deleteRow}">
          <div class="row" :style="{backgroundColor:item.bg}"/>
        </template>

        <div slot="empty">empty</div>

        <div slot="append-row-btn"/>

      </ElasticList>

      <br/>
      <el-button @click="value1.push({bg:''})" style="width:100%">push（编程式设值）</el-button>

      <br/><br/>
      <JsonEditorVue :value="value1"/>
    </div>

    <div>
      <ElasticList
        v-model="value2"
        v-bind="$attrs.props"
        :sortablejs-props="{
          group: 'x',
        }"
      >

        <template v-slot="{item,i,showDelBtn,deleteRow}">
          <div class="row" :style="{backgroundColor:item.bg}"/>
        </template>

        <div slot="empty">empty</div>

        <div slot="append-row-btn"/>

      </ElasticList>

      <br/>
      <el-button @click="value2.push({bg:''})" style="width:100%">push（编程式设值）</el-button>

      <br/><br/>
      <JsonEditorVue :value="value2"/>
    </div>
  </div>
</template>

<script>
import { JsonEditorVue } from 'json-editor-vue'
import ElasticList from '../src/index'

export default {
  components: { ElasticList, JsonEditorVue },
  data () {
    return {
      value1: [{ bg: '#eaff56' }, { bg: '#bce672' }, { bg: '#ff461f' }, { bg: '#70f3ff' }],
      value2: [{ bg: '#5d513c' }, { bg: '#9b4400' }, { bg: '#1bd1a5' }, { bg: '#ff0097' }],
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .elastic-list {
  border: 1px solid red;
  padding: 1rem;

  .item {
    display: inline-block;
  }
}

.inline {
  display: flex;

  & > div {
    flex: 1;

    & > .elastic-list {
      height: 416px;
    }

    &:first-child {
      margin-right: 1rem;
    }
  }
}

.row {
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-right: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
