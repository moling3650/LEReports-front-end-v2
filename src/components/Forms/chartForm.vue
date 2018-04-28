<template>
  <div id="chartForm">
    <el-dialog :title="chartId ? '编辑图表' : '新建图表'" :visible.sync="visible" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="200px">
        <el-form-item label="标题" prop="name">
          <el-col :span="12">
            <el-input v-model="form.name"/>
          </el-col>
        </el-form-item>
        <el-form-item label="图表" prop="chart_type_code">
          <el-col :span="12">
            <el-select v-model="form.chart_type_code" class="select" placeholder="请选择图表">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="类别" prop="label">
          <el-col :span="12">
            <el-select v-model="form.label" class="select" placeholder="请选择类别">
              <el-option
                v-for="item in fieldOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="数据" prop="value">
          <el-col :span="12">
            <el-select v-model="form.value" class="select" multiple placeholder="请选择数据">
              <el-option
                v-for="item in fieldOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="启用" required>
          <el-switch v-model="form.state" :active-value="1" :inactive-value="0"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="saveChart">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'chartForm',
  computed: mapGetters({
    typeOptions: 'chartTypes',
    fieldOptions: 'fieldOptions'
  }),
  props: {
    reportCode: {
      type: String,
      required: true
    },
    chartId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      visible: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入图表标题', trigger: 'blur' }
        ],
        chart_type_code: [
          { required: true, message: '请选择图表类型', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请选择图表类别', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请选择图表数据', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open () {
      this.$refs.form && this.$refs.form.resetFields()
      const chart = Object.assign({}, this.$store.getters.getChartByID(this.chartId))
      this.form = {
        chart_type_code: chart.chart_type_code || '',
        name: chart.name || '',
        label: chart.label || '',
        value: chart.value ? chart.value.split(',') : [],
        state: /^[01]$/.test(chart.state + '') ? chart.state : 1
      }
      this.visible = true
    },
    saveChart () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const chart = {
            id: parseInt(this.chartId) || 0,
            report_code: this.reportCode,
            chart_type_code: this.form.chart_type_code,
            name: this.form.name,
            label: this.form.label,
            value: this.form.value.join(','),
            state: this.form.state
          }
          this.$store.dispatch('saveChart', chart)
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

<style lang="css" scoped>
.select {
  width: 100%;
}
</style>
