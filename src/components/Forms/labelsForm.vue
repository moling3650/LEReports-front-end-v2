<template>
  <div id="labelsForm">
    <el-dialog title="别名修改" :visible.sync="visible" width="80%" top="10vh" :close-on-click-modal="false">
      <el-form ref="form" label-width="250px">
        <el-row :gutter="10">
          <el-col :span="8" v-for="f in fields" :key="f.prop">
            <el-form-item :label="f.prop">
              <el-input v-model="form[f.prop]" @keyup.enter.native="updateLabels"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="updateLabels">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'labelsForm',
  computed: {
    fields () {
      return this.$store.getters.fields
    }
  },
  data () {
    return {
      visible: false,
      form: {}
    }
  },
  methods: {
    open () {
      this.fields.map(f => {
        this.form[f.prop] = f.label
      })
      this.visible = true
    },
    updateLabels () {
      const payload = []
      this.fields.forEach(f => {
        const label = this.form[f.prop].trim()
        if (label && f.label !== label) {
          payload.push({
            report_code: f.report_code,
            prop: f.prop,
            label
          })
        }
      })
      payload.length && this.$store.dispatch('updateFieldsLabel', payload)
      this.visible = false
    }
  }
}
</script>
