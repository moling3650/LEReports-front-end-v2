<template>
  <div id="reportFieldForm">
    <el-dialog :title="`${form.prop} 字段修改`" :visible.sync="visible" :close-on-click-modal="false">
      <el-form :model="form" ref="form" label-width="100px" style="height: 300px;">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="是否可见">
              <el-switch v-model="form.state" :active-value="1" :inactive-value="0"/>
            </el-form-item>
            <template v-if="form.state">
              <el-form-item label="字段标签">
                <el-input v-model.trim="form.label" placeholder="请输入标签"/>
              </el-form-item>
              <el-form-item label="字段宽度">
                <el-input v-model.trim="form.width" placeholder="为空时自适应"/>
              </el-form-item>
              <el-form-item label="字段排序">
                <el-input v-model.number="form.idx" placeholder="请输入数字"/>
              </el-form-item>
              <el-form-item label="字段对齐">
                <el-select v-model="form.align" style="width: 100%;">
                  <el-option v-for="key in ['left', 'center', 'right']" :key="key" :value="key"/>
                </el-select>
              </el-form-item>
            </template>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可否查询">
              <el-switch v-model="form.is_check" :active-value="1" :inactive-value="0"/>
            </el-form-item>
            <template v-if="form.is_check">
              <el-form-item label="控件名称">
                <el-select v-model.trim="form.control_code" filterable style="width: 100%;">
                  <el-option v-for="qc in queryControls" :key="qc.value" :label="qc.label" :value="qc.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="控件宽度">
                <el-input v-model.number="form.control_span" placeholder="请输入数字"/>
              </el-form-item>
              <el-form-item label="扩展参数">
                <el-input v-model.trim="form.options_api"/>
              </el-form-item>
              <el-form-item label="是否必填">
                <el-switch v-model="form.required" :active-value="1" :inactive-value="0"/>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="saveReportField">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'reportFieldForm',
  computed: {
    queryControls () {
      return this.$store.getters.queryControls
    }
  },
  data () {
    return {
      visible: false,
      form: {}
    }
  },
  methods: {
    open (form) {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = form
      this.visible = true
    },
    saveReportField () {
      if (this.form.width !== '') {
        this.form.width = (parseInt(this.form.width) || '').toString()
      }
      this.form.idx = parseInt(this.form.idx) || 1
      this.form.control_span = parseInt(this.form.control_span) || 6
      if (this.form.control_code === 'mDatePicker') {
        this.form.control_span = Math.max(this.form.control_span, 8)
      }
      this.$store.dispatch('saveReportField', Object.assign({}, this.form)).then(() => {
        this.$message.success('保存成功!')
        this.visible = false
      }).catch(() => this.$message.error('保存失败！'))
    }
  }
}
</script>
