<template>
  <div class="inline">
    <div>
      <ElasticList
        v-model="value1"
        v-bind="$attrs.props"
        :sortablejs-props="{
          group: 'x'
        }"
        :watchValue="false"
      >

        <template v-slot="{item,i,showDelBtn,deleteRow}">
          <div class="row" :style="{backgroundColor:value1[i]}"/>
        </template>

        <div slot="append-row-btn"/>

      </ElasticList>

      <br/>
      <JsonEditorVue :value="value1"/>
    </div>

    <div>
      <ElasticList
        v-model="value2"
        v-bind="$attrs.props"
        :sortablejs-props="{
          group: 'x'
        }"
        :watchValue="false"
      >

        <template v-slot="{item,i,showDelBtn,deleteRow}">
          <div class="row" :style="{backgroundColor:value2[i]}"/>
        </template>

        <div slot="append-row-btn"/>

      </ElasticList>

      <br/>
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
      value1: ['#eaff56', '#bce672', '#ff461f', '#70f3ff'],
      value2: ['#5d513c', '#9b4400', '#1bd1a5', '#ff0097'],
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .elastic-list {
  border: 1px solid red;
  padding: 1rem;

  .list-wrapper > div {
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
