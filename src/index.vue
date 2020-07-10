<template>
  <div class="elastic-list">
    <template v-if="IsTable">
      <el-table :data="value" v-bind="ElTableProps">
        <slot/>
        <slot name="operation-column" v-if="Editable">
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger"
                         circle
                         icon="el-icon-delete"
                         @click="()=>{deleteRow(scope.$index)}"
                         v-show="!minRow||value__.length>minRow"
              />
            </template>
          </el-table-column>
        </slot>
      </el-table>

      <el-button v-if="Editable"
                 icon="el-icon-plus"
                 class="append-row-btn"
                 @click="appendRow"
                 v-show="!maxRow||value.length<maxRow"
      />
    </template>

    <template v-else>
      <transition-group class="list-wrapper"
                        :enter-active-class="sorting?'':'animate__animated animate__zoomIn'">
        <div v-for="(v,i) of value" :key="i">
          <slot :v="v"
                :i="i"
                :showDelBtn="Editable&&!minRow||value__.length>minRow"
                :deleteRow="deleteRow"
          />
        </div>
      </transition-group>
      <span v-if="Editable"
            @click="appendRow"
            v-show="!maxRow||value.length<maxRow">
        <slot name="append-row-btn"/>
      </span>
    </template>
  </div>
</template>

<script>
import 'animate.css'
import Sortable from 'sortablejs'
import { isEqualWith, cloneDeep } from 'lodash'
import { isTable, elTableProps, editable, rowCount, rowTemplate } from './config.ts'

export default {
  name: 'ElasticList',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      validator: value => ['Null', 'Array'].includes(({}).toString.call(value).slice(8, -1)),
    },
    rowCount: {
      type: [Number, Array]
    },
    rowTemplate: Object,
    elTableProps: Object,
    editable: {
      type: Boolean,
      default: undefined
    },
    isTable: {
      type: Boolean,
      default: undefined
    },
  },
  computed: {
    ElTableProps () {
      return {
        border: true,
        fit: true,
        stripe: true,
        highlightCurrentRow: true,
        ...(this.elTableProps || elTableProps || {}),
      }
    },
    IsTable () {
      const IsTable = typeof this.isTable === 'boolean' ?
        this.isTable :
        typeof isTable === 'boolean' ?
          isTable : true
      this.$nextTick(() => {
        const el = document.querySelector(IsTable ? '.elastic-list tbody' : '.elastic-list .list-wrapper')
        Sortable.create(el, {
          animation: 500,
          onStart: () => {
            this.sorting = true
          },
          onEnd: ({ newIndex, oldIndex }) => {
            const copy = cloneDeep(this.value__)
            copy.splice(newIndex, 0, copy.splice(oldIndex, 1)[0])
            //解决：顺序改变不触发el-table更新data
            this.value__ = []
            this.$nextTick(() => {
              this.value__ = copy
              this.$nextTick(() => {
                this.sorting = false
              })
            })
          }
        })
      })
      return IsTable
    },
    Editable () {
      return typeof this.editable === 'boolean' ?
        this.editable :
        typeof editable === 'boolean' ?
          editable : true
    },
    RowTemplate () {
      return this.rowTemplate || rowTemplate || {}
    },
    maxRow () {
      const globalRowCount = this.rowCount || rowCount
      if (globalRowCount) {
        return globalRowCount instanceof Array ? globalRowCount[1] : globalRowCount
      }
    },
    minRow () {
      const globalRowCount = this.rowCount || rowCount
      if (globalRowCount instanceof Array) {
        return globalRowCount[0]
      }
    }
  },
  data () {
    return {
      show: true,
      value__: [],
      sorting: false
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.value__ = newVal || []
      }
    },
    value__: {
      deep: true,
      handler (newVal, oldVal) {
        //避免死循环
        if (!isEqualWith(newVal, this.value)) {
          this.$emit('change', newVal)
        }
      }
    },
  },
  /*updated () {
    this.dragTable()
  },*/
  methods: {
    /*dragTable () {
      this.$nextTick(() => {
        const el = document.querySelector('.elastic-list .el-table__body-wrapper table')
        const dragger = tableDragger(el, {
          mode: 'row',
          dragHandler: 'td',
          onlyBody: true,
        })
        dragger.on('drop', (from, to) => {
          const copy = cloneDeep(this.value__)
          copy.splice(to, 0, copy.splice(from, 1)[0])
        })
      })
    },*/
    appendRow () {
      this.value__.push(this.RowTemplate)
    },
    deleteRow (index) {
      this.value__.splice(index, 1)
    }
  },
}
</script>

<style lang="scss" scoped>
.elastic-list {
  user-select: none;

  .append-row-btn {
    width: 100%;
    margin-top: 16px;
  }
}
</style>
