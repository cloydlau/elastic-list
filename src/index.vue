<template>
  <div class="elastic-list" v-if="show">
    <!--<div v-for="v of value">{{v}}</div>-->
    <template v-if="isTable">
      <el-table :data="value__" v-bind="ElTableProps">
        <slot/>
        <slot name="operation-column"
              v-if="!Disabled"
              :showDelBtn="canDel"
              :deleteRow="deleteRow"
        >
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger"
                         circle
                         icon="el-icon-delete"
                         @click="()=>{deleteRow(scope.$index)}"
                         v-show="canDel"
              />
            </template>
          </el-table-column>
        </slot>
      </el-table>

      <span @click="appendRow" v-show="canAppend">
        <slot name="append-row-btn">
          <el-button icon="el-icon-plus" class="append-row-btn"/>
        </slot>
      </span>
    </template>

    <template v-else>
      <transition-group class="list-wrapper"
                        :enter-active-class="sorting?'':'animate__animated animate__zoomIn'">
        <div v-for="(v,i) of value" :key="value__[i][rowKey]">
          <slot :v="v"
                :i="i"
                :showDelBtn="canDel"
                :deleteRow="deleteRow"
          />
        </div>
      </transition-group>
      <span v-if="!Disabled"
            @click="appendRow"
            v-show="!maxRow||value.length<maxRow">
        <slot name="append-row-btn"/>
      </span>
    </template>
  </div>
</template>

<script>
import 'animate.css'
import cloneDeep from 'lodash/cloneDeep'
import isPlainObject from 'lodash/isPlainObject'
import { sortable, elTableProps, disabled, count, rowTemplate } from './config.ts'
import { v1 as uuidv1 } from 'uuid'

export default {
  name: 'ElasticList',
  inject: {
    elForm: {
      default: ''
    },
  },
  props: {
    value: {
      validator: value => ['Null', 'Array'].includes(({}).toString.call(value).slice(8, -1)),
    },
    count: {
      type: [Number, Array]
    },
    rowTemplate: {},
    elTableProps: Object,
    disabled: Boolean,
    sortable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    canAppend () {
      return !this.Disabled && (!this.maxRow || this.value.length < this.maxRow)
    },
    canDel () {
      return !this.Disabled && (!this.minRow || this.value.length > this.minRow)
    },
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
      return this.Disabled ?
        false :
        typeof this.sortable === 'boolean' ?
          this.sortable :
          typeof sortable === 'boolean' ?
            sortable : true

    },
    Disabled () {
      return this.disabled || disabled || (this.elForm || {}).disabled
    },
    RowTemplate () {
      return this.rowTemplate === undefined ?
        rowTemplate === undefined ?
          this.isObjArr ? {} : ''
          : rowTemplate
        : this.rowTemplate
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
    isObjArr () {
      return this.value && isPlainObject(this.value[0])
    }
  },
  created () {
    /*const unwatch = this.$watch('value', newVal => {
      if (this.synchronizing) {
        this.synchronizing = false
      } else {
        if (this.value) {
          this.value__ = this.value.map(v => ({
            [this.rowKey]: uuidv1(),
            ...isPlainObject(v) && v,
          }))
        }
      }
    }, {
      immediate: true,
      deep: true
    })*/

    if (this.value) {
      this.value__ = this.value.map(v => ({
        [this.rowKey]: uuidv1(),
        ...isPlainObject(v) && v,
      }))
    }
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
      sortablejs: null,
      synchronizing: false,
    }
  },
  watch: {
    value__: {
      deep: true,
      handler (newVal, oldVal) {
        //if (this.synchronizing) {
        //  this.synchronizing = false
        //} else {
        //if (!isEqualWith(newVal, this.value)) {
        this.isTable && this.sync(cloneDeep(newVal).map(v => {
          delete v[this.rowKey]
          return v
        }))
        //this.$emit('input', newVal)
        //}
        //}
      }
    },
    Sortable (newVal) {
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
    sync (value) {
      this.synchronizing = true
      this.$emit('input', value)
      // fixing: 用于el表单中 且校验触发方式为blur时 没有生效
      if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
        this.$parent.$emit('el.form.blur')
      }
    },
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

            if (!this.isTable) {
              const value = cloneDeep(this.value)
              value.splice(newIndex, 0, value.splice(oldIndex, 1)[0])
              this.sync(value)
            }

            this.$nextTick(() => {
              this.sorting = false
            })
            //})
          }
        })
      }
    },
    appendRow () {
      const template = this.RowTemplate instanceof Function ? this.RowTemplate(this.value__.length + 1) : this.RowTemplate
      this.value__.push({
        [this.rowKey]: uuidv1(),
        ...this.isTable && template
      })
      if (!this.isTable) {
        this.sync([
          ...cloneDeep(this.value),
          template
        ])
      }
    },
    deleteRow (index) {
      this.value__.splice(index, 1)
      if (!this.isTable) {
        const value = cloneDeep(this.value)
        value.splice(index, 1)
        this.sync(value)
      }
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
