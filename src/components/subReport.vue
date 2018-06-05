<template>
  <div class="subReport">
    <el-dialog :title="title" :visible.sync="visible" :fullscreen="true">
      <el-button-group style="float: right; margin: -30px 0px 0">
        <el-button size="mini" type="primary" @click="handleExport">导出</el-button>
      </el-button-group>
      <div class="table-wrap">
        <el-table v-loading="loading" :data="tableData" border stripe size="mini" height="400"
          :header-cell-style="{backgroundColor: '#409eff', color: '#fff'}">
          <el-table-column  v-for="f in fields" :key="f" :prop="f" :label="f"/>
        </el-table>
      </div>
      <el-pagination
        v-if="rawData.length"
        background
        style="float: right;"
        layout="total, prev, pager, next"
        :total="rawData.length"
        :page-size="size"
        :current-page.sync="index"/>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/apis'
import { exportXlsx } from '@/lib/exportData'

export default {
  name: 'subReport',
  computed: {
    tableData () {
      return this.rawData.slice((this.index - 1) * this.size, this.index * this.size)
    }
  },
  data () {
    return {
      visible: false,
      loading: true,
      title: '子报表',
      rawData: [],
      fields: [],
      index: 1,
      size: 10
    }
  },
  methods: {
    open (title, sql, queryParams) {
      this.title = title
      this.rawData = []
      this.loading = true
      this.index = 1
      this.visible = true
      api.fetchData({sql, queryParams}).then(data => {
        this.rawData = data
        this.fields = data.length ? Object.keys(data[0]) : []
        this.loading = false
      })
    },
    handleExport () {
      const data = [
        this.fields,
        ...this.rawData.map(row => this.fields.map(f => row[f]))
      ]
      this.$prompt('', '请输入文件名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\u4e00-\u9fa5\w]+/,
        inputErrorMessage: '文件名格式不正确'
      }).then(({ value }) => exportXlsx(data, value))
    }
  }
}
</script>

<style lang="css" scoped>
 .table-wrap {
  position: relative;
  height: 500px;
 }
</style>
