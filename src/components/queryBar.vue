<template>
  <div id="queryBar" style="width: 98%; margin: 0 auto;">
    <el-row :gutter="10">
      <el-col v-for="c in controls" :key="c.prop" :span="c.span" class="cell">
        <component :is="c.type" :ref="c.prop" :label="c.label" :ex="c.ex" @enter="search"/>
      </el-col>
      <el-col :span="2" class="cell">
        <el-button @click="search">查询</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mDatePicker from '@/components/queryControls/mDatePicker'
import mInput from '@/components/queryControls/mInput'
import mInputLike from '@/components/queryControls/mInputLike'
import mInputMultiValue from '@/components/queryControls/mInputMultiValue'
import mSelect from '@/components/queryControls/mSelect'
import mSelectMultiValue from '@/components/queryControls/mSelectMultiValue'
import mCascader from '@/components/queryControls/mCascader'

export default {
  name: 'queryBar',
  props: {
    report: {
      type: String,
      required: true
    },
    queryType: {
      type: Number,
      default: 0
    },
    querySQL: {
      type: String,
      required: true
    }
  },
  components: {
    mDatePicker,
    mInput,
    mInputLike,
    mInputMultiValue,
    mSelect,
    mSelectMultiValue,
    mCascader
  },
  computed: {
    controls () {
      return this.$store.getters.controls
    },
    thead () {
      return this.$store.getters.thead
    },
    types () {
      return this.$store.getters.fieldsType
    }
  },
  methods: {
    _propToField (prop) {
      const type = this.types[prop]
      return {
        DATETIME: `CAST(${prop} AS DATETIME) AS [${prop}]`,
        DECIMAL: `dbo.ToDecimal(${prop}) AS [${prop}]`
      }[type] || `[${prop}]`
    },
    _getQueryParams () {
      let paramList = []
      let paramMap = {}
      let isValid = true
      this.controls.forEach(item => {
        let value = this.$refs[item.prop][0].value

        if (value) {
          let str = ''
          if (item.type === 'mDatePicker') {
            str = `${item.prop} BETWEEN @start_${item.prop} AND @end_${item.prop}`
            if (this.types[item.prop] === 'DATETIME') {
              str = `CAST(${item.prop} AS DATETIME) BETWEEN @start_${item.prop} AND @end_${item.prop}`
            }
            paramMap[`start_${item.prop}`] = value[0]
            paramMap[`end_${item.prop}`] = value[1]
          } else if (item.type === 'mInputLike') {
            str = `${item.prop} LIKE @${item.prop}`
            paramMap[item.prop] = `%${value}%`
          } else if (item.type.endsWith('MultiValue')) {
            str = `${item.prop} IN (${value.map((v, i) => `@${item.prop}${i}`).join(',')})`
            value.map((v, i) => (paramMap[`${item.prop}${i}`] = v))
          } else {
            str = `${item.prop} = @${item.prop}`
            paramMap[item.prop] = value
          }
          paramList.push(str)
        } else if (item.required) {
          this.$message.error(`${item.label}为必填字段`)
          isValid = false
        }
      })
      if (this.queryType && !paramList.length) {
        this.$message.error({ showClose: true, message: '至少输入一个条件查询' })
        isValid = false
      }

      const fields = this.thead.map(({ prop }) => this._propToField(prop)).join(', ')
      const where = paramList.length ? `WHERE ${paramList.join(' AND ')}` : ''
      let sql = this.querySQL.replace('{fields}', fields).replace('{where}', where)
      // if (this.report === 'V_SFC_DC_CELL_GROUP') {
      //   sql += ' ORDER BY PEARL_BATCH, CAST(DC_TIME AS DATETIME)'
      // }
      return isValid && { sql, queryParams: paramMap }
    },
    search () {
      const payload = this._getQueryParams()
      payload && this.$emit('search', payload)
    }
  }
}
</script>

<style lang="css" scoped>
.cell {
  margin: 5px 0;
}
</style>
