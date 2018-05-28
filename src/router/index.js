import createRouter from '@/lib/createRouter'

const routerConfig = {
  routes: [
    'AvailableRate',
    'SfcProcessReport',
    'ProcessReports',
    'ReportBuilder',
    'ReportQuerier'
  ]
}

export default createRouter(routerConfig)
