<template>
  <div id="reportEditor" :style="{margin: '10px 0'}">
    <el-row>
      <el-col class="cell" :span="6">
        <el-select v-model="reportCode" clearable filterable placeholder="请选择报表" style="width: 95%">
          <el-option v-for="item in reportOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col class="cell" :span="6">
        <el-button-group>
          <el-button @click="handleEditReport" :type="reportCode ? 'primary' : 'success'">
            {{ reportCode ? '编辑' : '新建' }}报表
          </el-button>
          <el-button :disabled="!reportCode" @click="handleDeleteReport" type="danger">删除报表</el-button>
          <el-button :disabled="!reportCode" @click="handleOpenReport">打开报表</el-button>
        </el-button-group>
      </el-col>

      <el-col v-show="reportCode" class="cell" :span="6">
        <el-select v-model="chartId" clearable filterable placeholder="请选择图表" style="width: 95%">
          <el-option v-for="item in chartOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col v-show="reportCode" class="cell" :span="6">
        <el-button-group>
          <el-button @click="handleEditChart" :type="chartId ? 'primary' : 'success'">
            {{ chartId ? '编辑' : '新建' }}图表
          </el-button>
          <el-button :disabled="!chartId" @click="handleDeleteChart" type="danger">删除图表</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <chartForm :reportCode="reportCode" :chartId="chartId" ref="chartDialog"/>
    <reportForm :reportCode.sync="reportCode" ref="reportDialog"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import chartForm from '@/components/Forms/chartForm'
import reportForm from '@/components/Forms/reportForm'

export default {
  name: 'reportEditor',
  components: {
    chartForm,
    reportForm
  },
  computed: mapGetters([
    'reportOptions',
    'chartOptions'
  ]),
  data () {
    return {
      reportCode: '',
      chartId: ''
    }
  },
  watch: {
    reportCode () {
      this.$store.dispatch('fetchFieldsByReportCode', this.reportCode)
      this.$store.dispatch('fetchChartsByReportCode', this.reportCode)
    }
  },
  methods: {
    handleEditReport () {
      this.$refs.reportDialog.open()
    },
    handleDeleteReport () {
      this.$confirm('此操作将永久删除该报表, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        cancelButtonClass: 'el-button--danger',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        type: 'warning'
      })
        .then(() => this.$message.info({ message: '已取消删除', showClose: true, duration: 1500 }))
        .catch(() => this.$store.dispatch('deleteReportByCode', this.reportCode)
          .then(() => this.$set(this, 'reportCode', ''))
          .then(() => this.$message.success({ message: '删除成功!', showClose: true, duration: 1500 }))
          .catch(() => this.$message.error({ message: '删除失败！', showClose: true, duration: 1500 }))
        )
    },
    handleOpenReport () {
      window.open(`${location.origin}${location.pathname}#/ReportQuerier?reportCode=${this.reportCode}`)
    },
    handleEditChart () {
      this.$refs.chartDialog.open()
    },
    handleDeleteChart () {
      this.$confirm('此操作将永久删除该图表, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        cancelButtonClass: 'el-button--danger',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        type: 'warning'
      })
        .then(() => this.$message.info({ message: '已取消删除', showClose: true, duration: 1500 }))
        .catch(() => this.$store.dispatch('deleteChartById', this.chartId)
          .then(() => this.$set(this, 'chartId', ''))
          .then(() => this.$message.success({ message: '删除成功!', showClose: true, duration: 1500 }))
          .catch(() => this.$message.error({ message: '删除失败！', showClose: true, duration: 1500 }))
        )
    }
  }
}
</script>
