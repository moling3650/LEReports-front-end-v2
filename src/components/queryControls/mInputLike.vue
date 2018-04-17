<template>
  <el-input v-model.trim="value" clearable :placeholder="`模糊查询${label}`" @keyup.enter.native="$emit('enter')"/>
</template>

<script>
export default {
  name: 'mInputLike',
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
