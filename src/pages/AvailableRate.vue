<template>
  <div id="AvailableRate">
    <el-row :gutter="10" class="search-bar">
      <el-col :span="8">
        <el-date-picker
          v-model="startDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button @click="renderChart">查询</el-button>
      </el-col>
    </el-row>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import apis from '@/apis/oee'

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
  name: 'AvailableRate',
  data () {
    return {
      chart: null,
      startDate: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() + 3600000 * 24 > Date.now()
        }
      }
    }
  },
  methods: {
    renderChart () {
      const statusMap = {
        FAULT: '故障',
        STANDBY: '待机',
        RUN: '运行',
        REPAIR: '维修',
        MAINTAIN: '保养'
      }
      const startDay = this.startDate[0].toJSON().replace(/T.+/, '')
      const endDay = this.startDate[1].toJSON().replace(/T.+/, '')
      apis.getMachineSatausByDate(startDay, endDay).then(data => {
        const statuses = Array.from(new Set(data.map(item => item.status)))
          .sort((a, b) => a[1].charCodeAt() - b[1].charCodeAt())
          .map(key => statusMap[key] || key)
        const machines = {}
        data.map(({station_name: station, status, second}) => {
          if (!machines[station]) {
            machines[station] = {}
          }
          const key = statusMap[status] || status
          machines[station][key] = Math.round(second / 3600 * 100) / 100
        })
        const stations = Object.keys(machines)
        // console.log(machines, statuses, stations)

        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: statuses
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          dataZoom: [
            {
              start: (stations.length - 10) / stations.length * 100,
              end: 100
            }
          ],
          yAxis: {
            type: 'value'
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              rotate: -20,
              margin: 25,
              textStyle: {
                align: 'center'
              }
            },
            data: stations
          },
          series: statuses.map(status => {
            return {
              name: status,
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: stations.map(station => machines[station][status] || '-')
            }
          })
        }
        this.chart.setOption(option)
      })
    }
  },
  mounted () {
    this.chart = echarts.init(this.$refs.chart)
  }
}
</script>

<style lang="css" scoped>
#AvailableRate {
  padding: 5px;
}

.chart {
  width: 100%;
  height: 500px;
  border: 1px solid #333;
  border-radius: 5px;
}

.search-bar {
  margin: 5px 0;
}
</style>
