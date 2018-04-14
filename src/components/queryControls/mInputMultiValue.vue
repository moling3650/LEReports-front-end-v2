<template>
  <el-input v-model.trim="rawValue" clearable :placeholder="`请输入一个或多个${label}`" @keyup.enter.native="$emit('enter')"/>
</template>

<script>
export default {
  name: 'mInputMultiValue',
  props: {
    label: {
      type: String,
      default: '数值'
    }
  },
  data () {
    return {
      rawValue: ''
    }
  },
  computed: {
    value () {
      return this.rawValue && this.rawValue.split(/[\s,]+/)
    }
  }
}
</script>
