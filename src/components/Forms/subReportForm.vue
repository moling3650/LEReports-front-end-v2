<template>
  <div id="subReportForm">
    <el-dialog :title="subReportId ? '编辑子报表' : '新建子报表'" :visible.sync="visible" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="按钮文字" prop="btn_text">
          <el-input v-model="form.btn_text"/>
        </el-form-item>
        <el-form-item label="功能说明" prop="description">
          <el-input v-model="form.description"/>
        </el-form-item>
        <el-form-item label="SQL" prop="sql">
          <el-input type="textarea" rows="5" v-model="form.sql"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="saveSubReport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'subReportForm',
  props: {
    reportCode: {
      type: String,
      required: true
    },
    subReportId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      visible: false,
      form: {},
      rules: {
        btn_text: [
          { required: true, message: '请输入按钮文字', trigger: 'blur' }
        ],
        sql: [
          { required: true, message: '请输入SQL', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open () {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = Object.assign({}, this.$store.getters.getSubReportByID(this.subReportId))
      this.visible = true
    },
    saveSubReport () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const subReport = {
            uid: parseInt(this.subReportId) || 0,
            report_code: this.reportCode,
            btn_text: this.form.btn_text,
            sql: this.form.sql,
            description: this.form.description
          }
          this.$store.dispatch('saveSubReport', subReport)
            .then(() => this.$message.success({ message: '保存成功!', showClose: true, duration: 1500 }))
            .then(() => (this.visible = false))
            .catch(() => this.$message.error({ message: '保存失败!', showClose: true }))
        } else {
          return false
        }
      })
    }
  }
}
</script>
