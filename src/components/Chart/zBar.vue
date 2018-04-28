<template>
  <div class="z-bar">
    <div v-show="data.length" class="chart" ref="chart"></div>
    <div v-show="!data.length" style="margin-top: 200px; text-align: center;">暂无数据</div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')

export default {
  name: 'zBar',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    data: 'render'
  },
  methods: {
    render () {
      this.$nextTick(() => {
        if (!this.data.length || !this.label || !this.values.length) {
          return
        }
        this.chart.resize()
        const series = this.values.filter(s => s && s.value && s.label).map(s => {
          return {
            name: s.label,
            type: 'bar',
            data: this.data.map(item => item[s.value])
          }
        })
        const labels = this.data.map(d => d[this.label])
        this.chart.setOption({
          title: {
            text: this.title
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '1%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {},
          dataZoom: [
            {
              start: (this.data.length - 10) / this.data.length * 100,
              end: 100
            }
          ],
          xAxis: {
            axisLabel: {
              rotate: -20,
              margin: 25,
              textStyle: {
                align: 'center'
              }
            },
            data: labels
          },
          yAxis: {
          },
          series
        }, true)
      })
    }
  },
  mounted () {
    this.chart = echarts.init(this.$refs.chart)
  }
}
</script>

<style lang="css" scoped>
.z-bar {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #ebeef5;
  border-radius: 5px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
