<template>
  <div id="fieldsForm">
    <el-dialog title="筛选字段" :visible.sync="visible" :close-on-click-modal="false">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        <el-badge :value="checkList.length" class="item">
          <el-button type="text" @click="handleCheckAll">全选</el-button>
        </el-badge>
      </el-checkbox>
      <el-checkbox-group v-model="checkList" @change="handleCheckedFieldsChange">
        <el-row :gutter="20">
          <el-col :span="8" v-for="f in options" :key="f.value">
            <el-checkbox :label="f.value">{{f.label}}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="updateFields">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'fieldsForm',
  computed: {
    options () {
      return this.$store.getters.fieldOptions
    },
    fields () {
      return this.$store.getters.thead
    }
  },
  data () {
    return {
      visible: false,
      checkAll: true,
      isIndeterminate: false,
      checkList: []
    }
  },
  methods: {
    handleCheckAll () {
      this.checkAll = !this.checkAll
      this.handleCheckAllChange(this.checkAll)
    },
    handleCheckAllChange (val) {
      this.checkList = val ? this.fields.filter(o => o.state).map(o => o.prop) : []
      this.isIndeterminate = false
    },
    handleCheckedFieldsChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.fields.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fields.length
    },
    open () {
      this.checkAll = true
      this.isIndeterminate = false
      this.checkList = this.fields.filter(o => o.state).map(o => o.prop)
      this.visible = true
    },
    updateFields () {
      this.$store.commit('updateFieldsState', this.checkList)
      this.visible = false
    }
  }
}
</script>
