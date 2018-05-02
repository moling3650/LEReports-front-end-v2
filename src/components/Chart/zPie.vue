<template>
  <div class="z-pie">
    <div v-show="data.length" class="chart" ref="chart"></div>
    <div v-show="!data.length" style="margin-top: 200px; text-align: center;">暂无数据</div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')

export default {
  name: 'zPie',
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
    },
    maxItem: {
      type: Number,
      default: 10
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

        const dataMap = {}
        this.data.forEach(item => {
          const key = item[this.label]
          if (!dataMap[key]) {
            dataMap[key] = 0
          }
          dataMap[key] += parseFloat(item[this.values[0].value]) || 0
        })

        const data = Object.entries(dataMap).sort((a, b) => b[1] - a[1])
        if (data.length > this.maxItem) {
          const other = ['其他', data.slice(this.maxItem).reduce((total, item) => total + item[1], 0)]
          data.splice(this.maxItem - 1, data.length, other)
        }

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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          series: [{
            name: this.values[0].label,
            type: 'pie',
            center: ['50%', '60%'],
            label: {
              normal: {
                // position: 'inner',
                formatter: '{d}%',
                textStyle: {
                  // color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 14
                }
              }
            },
            data: data.map(item => {
              return {
                name: item[0],
                value: item[1]
              }
            })
          }]
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
.z-pie {
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
