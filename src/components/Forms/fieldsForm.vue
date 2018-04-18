<template>
  <div id="fieldsForm">
    <el-dialog title="筛选字段" :visible.sync="visible" :close-on-click-modal="false">
      <el-checkbox-group v-model="checkList">
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
      checkList: []
    }
  },
  methods: {
    open () {
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
