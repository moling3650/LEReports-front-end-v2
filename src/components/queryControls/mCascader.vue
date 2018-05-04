<template>
  <el-cascader
    v-model="rawValue"
    :options="options"
    :show-all-levels="true"
    :placeholder="`请选择${label}`"
    @change="$emit('change', value)"
    clearable
    expand-trigger="hover"
    style="width: 100%"
  />
</template>

<script>
import api from '@/apis'

export default {
  name: 'mCascader',
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
      rawValue: []
    }
  },
  computed: {
    value () {
      return this.rawValue[this.rawValue.length - 1]
    }
  },
  created () {
    if (!this.ex) {
      return this.$message.error({ message: '需要配置SQL', showClose: true })
    }
    api.fetchOptions(this.ex).then(data => {
      if (!data) {
        return this.$message.error({ message: '配置错误的SQL', showClose: true })
      }
      const options = []

      data.map(item => {
        let ptr = options
        const values = Object.values(item)
        for (var i = 0; i < values.length; i += 2) {
          const index = ptr.findIndex(p => p.value === values[i])
          if (~index) {
            ptr = ptr[index].children
          } else {
            const node = {
              value: values[i],
              label: values[i + 1]
            }
            ptr.push(node)
            if (i + 2 < values.length) {
              node.children = []
              ptr = ptr[ptr.length - 1].children
            }
          }
        }
      })
      this.options = options
    })
  }
}
</script>
