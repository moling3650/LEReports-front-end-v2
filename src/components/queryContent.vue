<template>
  <div id="queryContent">
    <el-button-group :style="{ float: 'right', margin: '-30px 5px 0' }">
      <el-button size="mini" type="primary" @click="handleSelectFields">筛选字段</el-button>
      <el-button size="mini" type="primary" @click="handleExport">导出</el-button>
    </el-button-group>
    <el-tabs type="border-card" style="margin-top: 30px;" @tab-click="handleTabClick">
      <el-tab-pane label="数据表格">
        <div class="z-table tab-content">
          <div class="table-wrap" :style="{ height: (pageSize + 2) * 36 + 50 + 'px'}">
            <el-table v-loading="loading"
              :data="tableData" border stripe size="mini"
              :header-cell-style="{backgroundColor: '#409eff', color: '#fff'}"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              style="width: 100%"
              tooltip-effect="dark"
            >
              <el-table-column v-for="f in fields"
                v-if="f.state"
                :key="f.prop"
                :prop="f.prop"
                :label="f.label"
                :width="f.width"
                :align="f.align"
                show-overflow-tooltip
              />
            </el-table>
          </div>
          <el-pagination
          v-if="data.length"
          background
          style="position: absolute;bottom: 5px; right: 10px"
          layout="total, prev, pager, next"
          :total="data.length"
          :page-size="pageSize"
          :current-page.sync="index"/>
        </div>
      </el-tab-pane>
      <el-tab-pane v-for="c in charts" :key="c.id" :label="c.name">
        <div class="tab-content">
          <component :is="c.type" :data="data" :label="c.label" :values="c.value"/>
        </div>
      </el-tab-pane>
    </el-tabs>

    <fieldsForm ref="fieldsDialog"/>
  </div>
</template>

<script>
import { exportXlsx } from '@/lib/exportData'
import fieldsForm from '@/components/Forms/fieldsForm'
import zBar from '@/components/Chart/zBar'
import zLine from '@/components/Chart/zLine'

export default {
  name: 'queryContent',
  components: {
    fieldsForm,
    zBar,
    zLine
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  computed: {
    fields () {
      return this.$store.getters.thead
    },
    tableData () {
      return this.data.slice((this.index - 1) * this.pageSize, this.index * this.pageSize)
    },
    charts () {
      return this.$store.getters.charts
    }
  },
  data () {
    return {
      index: 1
    }
  },
  watch: {
    data () {
      this.index = 1
    }
  },
  methods: {
    handleTabClick (tab) {
      this.$nextTick(() => {
        tab.$children.filter(c => c.chart && c.chart.resize).map(c => c.chart.resize())
      })
    },
    handleSelectFields () {
      this.$refs.fieldsDialog.open()
    },
    handleExport () {
      const data = [this.fields.map(f => f.label), ...this.data.map(row => this.fields.map(f => row[f.prop]))]
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
#queryContent {
  width: 98%;
  margin: 5px 1%;
}

.tab-content {
  position: relative;
  width: 100%;
  height: 480px;
}
</style>
