import createRouter from '@/lib/createRouter'

const routerConfig = {
  routes: [
    'ProcessReports',
    'ReportBuilder',
    'ReportQuerier'
  ]
}

export default createRouter(routerConfig)
