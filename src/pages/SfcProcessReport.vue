<template>
  <div id="SfcProcessReport">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model.trim="sfc" @keyup.enter.native="search"/>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <div class="table-wrap">
      <el-table :data="tableData" border stripe size="mini" height="500"
        :header-cell-style="{backgroundColor: '#409eff', color: '#fff'}"
        @row-dblclick="handleDbclick">
        <el-table-column v-for="f in tableFields" :key="f" :prop="f" :label="f"/>
      </el-table>
    </div>
    <el-dialog :title="processName" :visible.sync="dialogVisible" :fullscreen="true">
      <el-button-group :style="{ float: 'right', margin: '-30px 5px 0' }">
        <el-button size="mini" type="primary" @click="handleExport">导出</el-button>
      </el-button-group>
      <el-table :data="subTableData" border stripe size="mini" height="600"
        :header-cell-style="{backgroundColor: '#409eff', color: '#fff'}">
        <el-table-column  v-for="f in subTableFileds" :key="f.prop" :prop="f.prop" :label="f.label"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/apis/sfcDcProcess'
import { exportXlsx } from '@/lib/exportData'

export default {
  name: 'SfcProcessReport',
  data () {
    return {
      dialogVisible: false,
      sfc: '',
      processName: '',
      tableFields: ['工单', '条码', '工序组', '工序', '工站', '生产时间', '结果', '员工'],
      tableData: [],
      subTableFileds: [],
      subTableData: []
    }
  },
  methods: {
    search () {
      api.fetchDataBySFC(this.sfc).then(data => {
        if (data.length) {
          this.tableFields = Object.keys(data[0])
        } else {
          this.$message.error('没有查询到数据')
        }
        this.tableData = data
      })
    },
    handleExport () {
      const data = [this.subTableFileds.map(f => f.label), ...this.subTableData.map(row => this.subTableFileds.map(f => row[f.prop]))]
      this.$prompt('', '请输入文件名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\u4e00-\u9fa5\w]+/,
        inputErrorMessage: '文件名格式不正确'
      }).then(({ value }) => exportXlsx(data, value))
    },
    handleDbclick ({'条码': sfc, '工序': processName}) {
      if (this.processName === processName) {
        this.dialogVisible = true
        return
      }
      this.processName = processName
      Promise.all([api.fetchFields(processName), api.fetchProcessDataBySFC(sfc, processName)])
        .then(([fields, data]) => {
          if (fields.length) {
            this.subTableFileds = fields.filter(f => f.state).map(f => {
              return {
                prop: f.prop,
                label: f.label
              }
            })
          } else if (data.length) {
            this.subTableFileds = Object.keys(data[0]).map(key => {
              return {
                prop: key,
                label: key
              }
            })
          }
          this.subTableData = data
          this.dialogVisible = true
        })
    }
  }
}
</script>

<style lang="css" scoped>
#SfcProcessReport {
  margin: 5px;
}

.table-wrap {
  margin-top: 5px;
}
</style>
