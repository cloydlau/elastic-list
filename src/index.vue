<template>
  <div class="elastic-list" v-if="show">
    <!--<div v-for="v of value">{{v}}</div>-->
    <template v-if="isTable">
      <el-table :data="value__" v-bind="ElTableProps">
        <slot/>
        <slot name="operation-column"
              v-if="Editable"
              :showDelBtn="!minRow||value__.length>minRow"
              :deleteRow="deleteRow"
        >
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

      <span v-if="Editable"
            @click="appendRow"
            v-show="!maxRow||value__.length<maxRow"
      >
        <slot name="append-row-btn">
          <el-button icon="el-icon-plus" class="append-row-btn"/>
        </slot>
      </span>
    </template>

    <template v-else>
      <transition-group class="list-wrapper"
                        :enter-active-class="sorting?'':'animate__animated animate__zoomIn'">
        <div v-for="(v,i) of value__" :key="v[rowKey]">
          <slot :v="v"
                :i="i"
                :showDelBtn="Editable&&!minRow||value__.length>minRow"
                :deleteRow="deleteRow"
          />
        </div>
      </transition-group>
      <span v-if="Editable"
            @click="appendRow"
            v-show="!maxRow||value__.length<maxRow">
        <slot name="append-row-btn"/>
      </span>
    </template>
  </div>
</template>

<script>
import 'animate.css'
import cloneDeep from 'lodash/cloneDeep'
import { sortable, elTableProps, editable, count, rowTemplate } from './config.ts'
import { v1 as uuidv1 } from 'uuid'

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
    count: {
      type: [Number, Array]
    },
    rowTemplate: [Object, Function],
    elTableProps: Object,
    editable: {
      type: Boolean,
      default: undefined
    },
    sortable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ElTableProps () {
      return {
        rowKey: this.rowKey,
        border: true,
        fit: true,
        stripe: true,
        highlightCurrentRow: true,
        ...(Object.getOwnPropertyNames(this.elTableProps || {}).length > 1 ? this.elTableProps :
          elTableProps ||
          {}),
      }
    },
    isTable () {
      return this.$slots.default && this.$slots.default[0]?.tag.includes('ElTableColumn')
    },
    Sortable () {
      return typeof this.sortable === 'boolean' ?
        this.sortable :
        typeof sortable === 'boolean' ?
          sortable : true
    },
    Editable () {
      return typeof this.editable === 'boolean' ?
        this.editable :
        typeof editable === 'boolean' ?
          editable : true
    },
    RowTemplate () {
      return Object.getOwnPropertyNames(this.rowTemplate || {}).length > 1 ? this.rowTemplate :
        rowTemplate || {}
    },
    maxRow () {
      const globalCount = this.count || count
      if (globalCount) {
        return globalCount instanceof Array ? globalCount[1] : globalCount
      }
    },
    minRow () {
      const globalCount = this.count || count
      if (globalCount instanceof Array) {
        return globalCount[0]
      }
    },
  },
  created () {
    const unwatch = this.$watch('value', (newVal, oldVal) => {
      if (newVal?.length > 0) {
        this.value__ = newVal.map(v => ({
          [this.rowKey]: uuidv1(),
          ...v,
        }))
        unwatch && unwatch() //仅初始化赋值一次 第一次触发时unwatch为空 所以需要判空
      }
    }, {
      deep: true,
      immediate: true
    })
  },
  mounted () {
    this.sort()
  },
  data () {
    return {
      show: true,
      value__: [],
      sorting: false,
      //uuid: 0,
      //weakMap: new weakMap(),
      rowKey: '__key',
      sortablejs: null
    }
  },
  watch: {
    value__: {
      deep: true,
      handler (newVal, oldVal) {
        //if (!isEqualWith(newVal, this.value)) {
        this.$emit('change', cloneDeep(newVal).map(v => {
          delete v[this.rowKey]
          return v
        }))
        //this.$emit('change', newVal)
        //}
        //fix: 用于el表单中 且校验触发方式为blur时 没有生效
        if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
          this.$parent.$emit('el.form.blur')
        }
      }
    },
    sortable (newVal) {
      this.sort()
      this.sortablejs.option('disabled', !newVal)
      //fix: 第二次之后禁用不起作用
      /*this.show = false
      this.$nextTick(() => {
        this.show = true
      })*/
    }
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
    sort () {
      if (this.sortable && !this.sortablejs) {
        const Sortable = require('sortablejs').default //(await import('sortablejs')).default 在生产环境报错
        const el = document.querySelector(this.isTable ? '.elastic-list tbody' : '.elastic-list .list-wrapper')
        this.sortablejs = Sortable.create(el, {
          animation: 500,
          onStart: () => {
            this.sorting = true
          },
          onEnd: ({ newIndex, oldIndex }) => {
            const copy = cloneDeep(this.value__)
            copy.splice(newIndex, 0, copy.splice(oldIndex, 1)[0])
            //fix: 视图不更新
            //this.value__ = []
            //this.$nextTick(() => {
            this.value__ = copy
            this.$nextTick(() => {
              this.sorting = false
            })
            //})
          }
        })
      }
    },
    appendRow () {
      this.value__.push({
        ...this.RowTemplate instanceof Function ? this.RowTemplate() : this.RowTemplate,
        [this.rowKey]: uuidv1()
      })
    },
    deleteRow (index) {
      this.value__.splice(index, 1)
    },
    /*getUuid (obj) {
      if (!this.weakMap.has(obj)) {
        this.weakMap.set(obj, ++this.uuid)
      }
      return this.weakMap.get(obj)
    },*/
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
