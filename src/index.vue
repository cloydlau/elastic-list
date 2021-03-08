<template>
  <div :id="id" class="elastic-list" v-if="show">
    <!--<div v-for="v of value">{{v}}</div>-->
    <template v-if="mode === 'elTable'">
      <el-table :data="value__" v-bind="ElTableProps" v-on="$listeners">
        <slot/>
        <slot
          name="operation-column"
          v-if="!Disabled"
          :showDelBtn="canDel"
          :deleteRow="deleteRow"
        >
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="danger"
                circle
                icon="el-icon-delete"
                @click="()=>{deleteRow(scope.$index)}"
                v-show="canDel"
              />
            </template>
          </el-table-column>
        </slot>
        <slot name="append"/>
      </el-table>

      <span @click="appendRow" v-show="canAppend">
        <slot name="append-row-btn">
          <el-button icon="el-icon-plus" class="append-row-btn"/>
        </slot>
      </span>
    </template>

    <template v-else>
      <div
        class="list"
        :enter-active-class="activeClass[0]&&adding?`animate__animated animate__${activeClass[0]}`:''"
        :leave-active-class="activeClass[1]?`animate__animated animate__${activeClass[1]}`:''"
      >
        <div v-for="(v,i) of value__" :key="value__[i][rowKey]" class="item">
          <slot
            :i="i"
            :v="v"
            :item="v"
            :showDelBtn="canDel"
            :deleteRow="deleteRow"
          />
        </div>
        <span v-show="!value||value.length===0" :key="'placeholder'">
          <slot name="placeholder"/>
        </span>
      </div>
      <span
        v-if="!Disabled"
        @click="appendRow"
        v-show="!maxRow||value__.length<maxRow">
        <slot name="append-row-btn">
          <el-button icon="el-icon-plus" class="append-row-btn"/>
        </slot>
      </span>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import 'animate.css'
import { cloneDeep, isPlainObject } from 'lodash'
import uuidv1 from 'uuid/dist/esm-browser/v1'
import { typeOf } from 'kayran'
import globalProps from './config'

const { sortable, elTableProps, disabled, count, rowTemplate, animate, sortablejsProps } = globalProps

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 实例＞全局＞默认
 *
 * @param {any} globalProp - 全局参数
 * @param {any} prop - 实例参数
 * @param {any} defaultValue - 默认值
 * @return {any} 最终
 */
function getFinalProp (globalProp, prop, defaultValue) {
  return prop !== undefined ? prop :
    globalProp !== undefined ? globalProp :
      defaultValue
}

export default {
  name: 'ElasticList',
  inject: {
    elForm: {
      default: ''
    },
  },
  props: {
    value: {
      validator: value => ['null', 'array'].includes(typeOf(value)),
    },
    count: [Number, Array],
    rowTemplate: {},
    elTableProps: Object,
    sortablejsProps: Object,
    disabled: {
      // 不能用type 因为type为Boolean时 如果用户没传 默认值为false而不是undefined 会影响getFinalProp的判断
      // 由此带来的副作用：如果使用者只是书写了该属性但并没有显式指定其值为true的话 其值为''
      validator: value => value === '' || ['boolean'].includes(typeOf(value)),
    },
    sortable: {
      validator: value => value === '' || ['boolean'].includes(typeOf(value)),
    },
    animate: [String, Array]
  },
  computed: {
    activeClass () {
      const result = getFinalProp(animate, this.animate, 'zoomIn')
      return typeof result === 'string' ? [result] : result
    },
    canAppend () {
      return !this.Disabled && (!this.maxRow || this.value?.length < this.maxRow)
    },
    canDel () {
      return !this.Disabled && (!this.minRow || this.value?.length > this.minRow)
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
    mode () {
      if (this.$slots.default?.[0]?.tag.includes('ElTableColumn')) {
        return 'elTable'
      } else if (this.$slots.default?.[0]?.tag.includes('ElTransfer')) {
        return 'elTransfer'
      } else {
        return 'list'
      }
    },
    SortablejsProps () {
      return {
        filter: 'input,.el-rate',
        preventOnFilter: false,
        animation: 500,
        ...getFinalProp(sortablejsProps, this.sortablejsProps)
      }
    },
    Sortable () {
      return this.Disabled ? false :
        getFinalProp(sortable, this.sortable === '' ? true : this.sortable, true)
    },
    Disabled () {
      return getFinalProp(disabled, this.disabled === '' ? true : this.disabled, this.elForm?.disabled)
    },
    RowTemplate () {
      return getFinalProp(rowTemplate, this.rowTemplate, typeof this.value?.[0] === 'string' ? '' : {})
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
      adding: false,
      unWatchValue: null,
      id: 'elastic-list-' + uuidv1(),
      transferring: false,
      isPlainObjectArray: true,
    }
  },
  watch: {
    value__: {
      deep: true,
      handler (newVal, oldVal) {
        console.log('value__')
        if (this.isPlainObjectArray) {
          this.syncValue(cloneDeep(newVal).map(v => {
            delete v[this.rowKey]
            return v
          }))
        }
      },
    },
    Sortable: {
      immediate: true,
      handler (newVal) {
        if (this.sortablejs) {
          this.sortablejs.option('disabled', !newVal)
        } else {
          this.$nextTick(this.sort)
        }
        //fix: 第二次之后禁用不起作用
        /*this.show = false
        this.$nextTick(() => {
          this.show = true
        })*/
      }
    },
    isPlainObjectArray: {
      immediate: true,
      handler (newVal) {
        if (this.unWatchValue) {
          if (!newVal) {
            this.unWatchValue()
            this.unWatchValue = null
          }
        } else {
          this.unWatchValue = this.$watch('value', newValue => {
            // 内部同步
            if (this.synchronizing) {
              this.synchronizing = false
            }
            // 外部设值
            else {
              this.mapValue(newValue)
            }
          }, {
            immediate: true,
            deep: true
          })
        }
      }
    }
  },
  mounted () {
    if (this.SortablejsProps.group) {
      if (!Vue.prototype.eventBus__) {
        Vue.prototype.eventBus__ = new Vue({
          methods: {
            emit (event, ...args) {
              this.$emit(event, ...args)
            },
            on (event, callback) {
              this.$on(event, callback)
            },
            off (event, callback) {
              this.$off(event, callback)
            }
          }
        })
      }

      this.eventBus__.on('transfer', (oldDraggableValue, oldDraggableValue__, newDraggableIndex) => {
        if (this.transferring) {
          this.transferring = false
        } else {
          //const copy = cloneDeep(this.value__)
          //copy.splice(newDraggableIndex, 0, oldDraggableValue__)
          this.value__.splice(newDraggableIndex, 0, oldDraggableValue__)
          /*if (this.mode !== 'elTable') {
            const value = cloneDeep(this.value)
            value.splice(newDraggableIndex, 0, oldDraggableValue)
            this.syncValue(value)
          }*/
        }
      })
    }
  },
  /*updated () {
    this.dragTable()
  },*/
  methods: {
    mapValue (value) {
      console.log('value')
      this.value__ = value?.map(v => {
        const vIsPlainObject = v && isPlainObject(v)
        if (!vIsPlainObject) {
          this.isPlainObjectArray = false
        }
        return {
          ...vIsPlainObject && v,
          [this.rowKey]: uuidv1(),
        }
      })
    },
    setValue (value) {
      this.mapValue(value)
    },
    syncValue (value) {
      this.synchronizing = true
      this.$emit('input', value)
      // fixing: 用于el表单中 且校验触发方式为blur时 没有生效
      if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
        // fix: el-form-item深层嵌套时事件触发过早
        this.$parent.$nextTick(() => {
          this.$parent.$emit('el.form.blur')
        })
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
      if (this.Sortable) {
        const Sortable = require('sortablejs').default //(await import('sortablejs')).default 在生产环境报错
        const el = document.querySelector('#' + this.id + (this.mode === 'elTable' ? ' tbody' : ' .list'))
        this.sortablejs = Sortable.create(el, {
          ...this.SortablejsProps,
          onStart: e => {
            this.sorting = true
            this.SortablejsProps.onStart?.(e)
            this.$emit('start', e)
          },
          onEnd: e => {
            this.$nextTick(() => {
              this.sorting = false
            })
            this.SortablejsProps.onEnd?.(e)
            this.$emit('end', e)
          },
          onUpdate: e => {
            const { newDraggableIndex, oldDraggableIndex } = e
            if (this.isPlainObjectArray) {
              const copy = cloneDeep(this.value__)
              copy.splice(newDraggableIndex, 0, copy.splice(oldDraggableIndex, 1)[0])
              this.value__ = copy
            } else {
              const copy = cloneDeep(this.value)
              copy.splice(newDraggableIndex, 0, copy.splice(oldDraggableIndex, 1)[0])
              console.log(copy)
              this.setValue(copy)
            }
            //fix: 视图不更新
            //this.value__ = []
            //this.$nextTick(() => {
            /*if (this.mode !== 'elTable') {
              const value = cloneDeep(this.value)
              value.splice(newDraggableIndex, 0, value.splice(oldDraggableIndex, 1)[0])
              this.syncValue(value)
            }*/
            this.SortablejsProps.onUpdate?.(e)
            this.$emit('update', e)
          },
          onAdd: e => {
            //this.transfer()
            this.SortablejsProps.onAdd?.(e)
            this.$emit('add', e)
          },
          onRemove: e => {
            const { newDraggableIndex, oldDraggableIndex } = e
            this.transferring = true
            this.eventBus__.emit('transfer', this.value[oldDraggableIndex], this.value__[oldDraggableIndex], newDraggableIndex)
            this.deleteRow(e.oldDraggableIndex)
            this.SortablejsProps.onRemove?.(e)
            this.$emit('remove', e)
          },
          onChoose: e => {
            this.SortablejsProps.onChoose?.(e)
            this.$emit('choose', e)
          },
          onUnchoose: e => {
            this.SortablejsProps.onUnchoose?.(e)
            this.$emit('unchoose', e)
          },
          onSort: e => {
            this.SortablejsProps.onSort?.(e)
            this.$emit('sort', e)
          },
          onFilter: e => {
            this.SortablejsProps.onFilter?.(e)
            this.$emit('filter', e)
          },
          onMove: e => {
            this.SortablejsProps.onMove?.(e)
            this.$emit('move', e)
          },
          onClone: e => {
            this.SortablejsProps.onClone?.(e)
            this.$emit('clone', e)
          },
          onChange: e => {
            this.SortablejsProps.onChange?.(e)
            //this.$emit('change', e)
          }
        })
      }
    },
    appendRow () {
      this.adding = true
      const template = this.RowTemplate instanceof Function ? this.RowTemplate(this.value__.length + 1) :
        this.RowTemplate
      if (this.isPlainObjectArray) {
        this.value__.push({
          [this.rowKey]: uuidv1(),
          ...this.mode === 'elTable' && template
        })
      } else {
        this.setValue([...this.value, {
          [this.rowKey]: uuidv1(),
          ...this.mode === 'elTable' && template
        }])
      }
      /*if (this.mode !== 'elTable') {
        this.syncValue([
          ...cloneDeep(this.value),
          template
        ])
      }*/
      this.$nextTick(() => {
        this.adding = false
      })
    },
    deleteRow (index) {
      if (this.isPlainObjectArray) {
        this.value__.splice(index, 1)
      } else {
        const copy = cloneDeep(this.value)
        copy.splice(index, 1)
        this.setValue(copy)
      }
      /*if (this.mode !== 'elTable') {
        const value = cloneDeep(this.value)
        value.splice(index, 1)
        this.syncValue(value)
      }*/
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
  .list {
    display: block;
    height: 100%;

    & > .item {
      user-select: none;
      cursor: move;
    }
  }

  .append-row-btn {
    width: 100%;
    margin-top: 16px;
  }
}
</style>
