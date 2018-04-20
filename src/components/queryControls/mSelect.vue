<template>
  <el-select v-model="value" :placeholder="`请选择${label}`" clearable filterable style="width: 100%">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import api from '@/apis'

export default {
  name: 'mSelect',
  props: {
    label: {
      type: String,
      default: ''
    },
    ex: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      options: [],
      value: ''
    }
  },
  created () {
    api.fetchOptions(this.ex).then(data => {
      if (!data) {
        return this.$message.error({ message: '配置错误的SQL', showClose: true })
      }
      this.options = data.map(item => {
        let [value, label] = Object.values(item)
        label = label || value
        return { value, label }
      })
    })
  }
}
</script>
