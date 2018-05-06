import createRouter from '@/lib/createRouter'

const routerConfig = {
  routes: [
    'SfcProcessReport',
    'ProcessReports',
    'ReportBuilder',
    'ReportQuerier'
  ]
}

export default createRouter(routerConfig)
