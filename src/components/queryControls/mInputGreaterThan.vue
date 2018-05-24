<template>
  <el-input style="vertical-align: top;" v-model.number="value" clearable @keyup.enter.native="$emit('enter')">
    <template slot="prepend">{{ label }} &gt;= </template>
  </el-input>
</template>

<script>
export default {
  name: 'mInputGreaterThan',
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
