<template>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    range-separator=" 至 "
    :start-placeholder="`${label}（开始）`"
    :end-placeholder="`${label}（结束）`"
    style="width: 100%"
    @change="handleChange">
  </el-date-picker>
</template>

<script>
export default {
  name: 'mDatePicker',
  props: {
    label: {
      type: String
    },
    ex: {
      type: String,
      default: '31'
    }
  },
  data () {
    return {
      value: null
    }
  },
  methods: {
    handleChange () {
      if (this.value && this.value.length) {
        const days = parseInt(this.ex) || 31
        const maxDate = new Date(this.value[0].getTime() + days * 24 * 3600000)
        if (maxDate < this.value[1]) {
          this.$message({ showClose: true, message: `最多只能查询${days}天的数据` })
          this.$set(this.value, 1, maxDate)
        }
      }
    }
  }
}
</script>
