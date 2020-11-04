<template>
  <div :id="id" class="elastic-list" v-if="show">
    <!--<div v-for="v of value">{{v}}</div>-->
    <template v-if="isTable">
      <el-table :data="value__" v-bind="ElTableProps">
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
      <transition-group
        class="list-wrapper"
        :enter-active-class="Animate&&adding?`animate__animated animate__${Animate}`:''">
        <div v-for="(v,i) of value__" :key="value__[i][rowKey]">
          <slot
            :i="i"
            :v="v"
            :item="v"
            :showDelBtn="canDel"
            :deleteRow="deleteRow"
          />
        </div>
      </transition-group>
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
import 'animate.css'
import { cloneDeep, isPlainObject } from 'lodash'
import uuidv1 from 'uuid/dist/esm-browser/v1'
import { sortable, elTableProps, disabled, count, rowTemplate, watchValue, animate } from './config'
import { typeOf } from 'plain-kit'

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个 此时有两个疑问：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 全局＞实例＞默认
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
    count: {
      type: [Number, Array]
    },
    rowTemplate: {},
    elTableProps: Object,
    disabled: {
      // 不能用type 因为type为Boolean时 如果用户没传 默认值为false而不是undefined 会影响getFinalProp的判断
      validator: value => ['boolean'].includes(typeOf(value)),
    },
    sortable: {
      validator: value => ['boolean'].includes(typeOf(value)),
    },
    watchValue: {
      validator: value => ['boolean'].includes(typeOf(value)),
    },
    animate: String
  },
  computed: {
    Animate () {
      return getFinalProp(animate, this.animate, 'zoomIn')
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
    isTable () {
      return this.$slots.default && this.$slots.default[0]?.tag.includes('ElTableColumn')
    },
    Sortable () {
      return this.Disabled ? false :
        getFinalProp(sortable, this.sortable, true)
    },
    Disabled () {
      return getFinalProp(disabled, this.disabled, this.elForm?.disabled)
    },
    RowTemplate () {
      return getFinalProp(rowTemplate, this.rowTemplate, this.isObjArr ? {} : '')
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
      id: 'elastic-list-' + uuidv1()
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
    watchValue: {
      immediate: true,
      handler (newVal) {
        const unWatchValue = this.$watch('value', newVal => {
          // 内部同步
          if (this.synchronizing) {
            this.synchronizing = false
          }
          // 外部设值
          else if (newVal) {
            this.value__ = newVal.map(v => ({
              [this.rowKey]: uuidv1(),
              ...isPlainObject(v) && v
            }))
          }
        }, {
          immediate: true,
          deep: true
        })

        if (!getFinalProp(watchValue, newVal, true)) {
          unWatchValue()
        }
      }
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
      if (this.Sortable) {
        const Sortable = require('sortablejs').default //(await import('sortablejs')).default 在生产环境报错
        const el = document.querySelector('#' + this.id + (this.isTable ? ' tbody' : ' .list-wrapper'))
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
      this.adding = true
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
      this.$nextTick(() => {
        this.adding = false
      })
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
