<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="ElasticList">
    <el-tabs type="border-card">
      <el-tab-pane label="表格形式">
        <ForTable :props="props"/>
      </el-tab-pane>
      <el-tab-pane label="列表形式">
        <ForList :props="props"/>
      </el-tab-pane>
    </el-tabs>

    <br/><br/><br/>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import ForTable from './ForTable'
import ForList from './ForList'
import PropsEditor from './PropsEditor'

export default {
  components: { ForTable, ForList, PropsEditor },
  data () {
    return {
      props: {
        animate: undefined,
        sortable: true,
        disabled: false,
        count: [1, 5],
        elTableProps: {},
        watchValue: true
      },
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
