<template>
  <div id="reportForm">
    <el-dialog :title="reportCode ? '编辑报表' : '新建报表'" :visible.sync="visible" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="报表编号" prop="report_code">
          <el-input v-model.trim="form.report_code" :disabled="reportCode !== ''"/>
        </el-form-item>
        <el-form-item label="报表名称" prop="report_name">
          <el-input v-model.trim="form.report_name" @keyup.enter.native="saveReport"/>
        </el-form-item>
        <el-form-item label="条件必输" prop="query_type" required>
          <el-switch v-model="form.query_type" :active-value="1" :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="SQL" prop="query_sql" v-if="(form.report_code || '').startsWith('Z_')">
          <el-input type="textarea" rows="5" v-model.trim="form.query_sql" @keyup.enter.native="saveReport"/>
        </el-form-item>

        <el-form-item label="SQL" prop="orderBy" v-else>
          <el-input placeholder="请输入排序语句" v-model.trim="form.orderBy">
            <template slot="prepend">SELECT {fields} FROM {{form.report_code}} {where}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="saveReport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'reportForm',
  props: {
    reportCode: {
      type: String,
      required: true
    }
  },
  data () {
    var checkReportCode = (rule, value, callback) => {
      if (this.reportCode) {
        return callback()
      }
      if (!value) {
        return callback(new Error('报表编码不能为空'))
      }

      this.$store.dispatch('validReportCode', value).then(result => {
        if (!result) {
          return callback(new Error('请求失败'))
        }
        if (result.has_report) {
          return callback(new Error('该报表已存在'))
        } else if (!result.has_object && !value.startsWith('Z_')) {
          return callback(new Error('数据库没有该表或视图'))
        }
        return callback()
      })
    }
    return {
      visible: false,
      form: {},
      rules: {
        report_code: [
          { required: true, validator: checkReportCode, trigger: 'blur' }
        ],
        report_name: [
          { required: true, message: '请输入报表名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open () {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = this.$store.getters.getReportByCode(this.reportCode)
      this.form.orderBy = this.form.query_sql ? this.form.query_sql.replace(/.+{where}(\s+)?/, '') : ''
      this.visible = true
    },
    saveReport () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.form.report_code.startsWith('Z_')) {

        } else {
          this.form.query_sql = `SELECT {fields} FROM ${this.form.report_code} {where} ${this.form.orderBy}`
        }
        this.$store.dispatch('saveReport', Object.assign({}, this.form)).then(() => {
          this.$message.success('保存成功!')
          this.$emit('update:reportCode', this.form.report_code)
          this.visible = false
        }).catch(() => this.$message.error('保存失败！'))
      })
    }
  }
}
</script>
