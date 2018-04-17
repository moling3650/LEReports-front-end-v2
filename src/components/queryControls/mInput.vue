<template>
  <el-input v-model.trim="value" clearable :placeholder="`请输入${label}`" @keyup.enter.native="$emit('enter')"/>
</template>

<script>
export default {
  name: 'mInput',
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: ''
    }
  }
}
</script>
