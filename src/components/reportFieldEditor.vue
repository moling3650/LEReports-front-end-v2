<template>
  <div id="reportFieldEditor">
    <el-button-group class="btn-group">
      <el-button size="mini" type="primary" @click="handleEditLabels" :disabled="!fields.length">批量编字段标签</el-button>
    </el-button-group>
    <div class="table-wrap">
      <el-table v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="fields"
        border stripe
        size="mini"
        style="width: 100%"
        height="450px"
        :header-cell-style="{backgroundColor: '#409eff', color: '#fff'}"
        tooltip-effect="dark"
      >
        <el-table-column prop="prop" label="字段属性" align="center"/>
        <el-table-column prop="label" label="字段标签" align="center"/>
        <el-table-column prop="width" label="字段宽度" align="center" :formatter="fmtWidth"/>
        <el-table-column prop="idx" label="字段排序" align="center"/>
        <el-table-column prop="align" label="字段对齐" align="center"/>
        <el-table-column prop="state" label="是否可见" align="center" :formatter="fmtBoolean"/>
        <el-table-column prop="is_check" label="是否可查询" align="center" :formatter="fmtBoolean"/>
        <el-table-column prop="control_code" label="控件" align="center" :formatter="fmtQueryControl"/>
        <el-table-column prop="control_span" label="控件宽度" align="center"/>
        <el-table-column prop="required" label="是否必填" align="center" :formatter="fmtBoolean"/>
        <el-table-column prop="options_api" label="扩展参数" align="center" show-overflow-tooltip/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="fields.length" background
        :total="$store.getters.fields.length"
        :page-size="pageSize"
        :current-page.sync="index"
        style="position: absolute;bottom: 0px; right: 10px"
        layout="total, prev, pager, next"
      />
    </div>

    <reportFieldForm ref="reportFieldDialog"/>
    <labelsForm ref="labelsDialog"/>
  </div>
</template>

<script>
import reportFieldForm from '@/components/Forms/reportFieldForm'
import labelsForm from '@/components/Forms/labelsForm'

export default {
  name: 'reportFieldEditor',
  components: {
    reportFieldForm,
    labelsForm
  },
  computed: {
    fields () {
      return this.$store.getters.fields.slice((this.index - 1) * this.pageSize, this.index * this.pageSize)
    }
  },
  watch: {
    '$store.getters.fieldsReload' () {
      if (this.$store.getters.fieldsReload) {
        this.index = 1
        this.$store.commit('setFieldsReload', false)
      }
    }
  },
  data () {
    return {
      loading: false,
      pageSize: 10,
      index: 1
    }
  },
  methods: {
    handleRowEdit (index, row) {
      this.$refs.reportFieldDialog.open({ ...row })
    },
    handleEditLabels () {
      this.$refs.labelsDialog.open()
    },
    fmtWidth (row, col, value) {
      return value ? `${value}px` : '自适应'
    },
    fmtBoolean (row, col, value) {
      return value ? '是' : '否'
    },
    fmtQueryControl (row, col, value) {
      const queryControl = this.$store.getters.queryControls.find(qc => qc.value === value)
      return queryControl ? queryControl['label'] : '未知控件'
    }
  },
  created () {
    this.$store.dispatch('fetchQueryControls')
  }
}
</script>

<style scoped>
.btn-group {
  position: absolute;
  top: 60px;
  right: 10px;
}

.table-wrap {
  position: relative;
  height: 530px;
  top: 30px;
}
</style>
