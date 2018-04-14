import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function createRoutes (routes, prefix = '') {
  return routes.map(routeConfig => {
    const route = Object.assign({}, { name: routeConfig }, routeConfig)
    if (!route.name) {
      throw new Error('route.name is undefined')
    }
    if (!route.path) {
      route.path = `${prefix}/${route.name}`
    }
    if (!route.component) {
      route.component = () => import(`@/pages${prefix}/${route.name}`)
    }
    if (route.children) {
      route.children = createRoutes(route.children, route.path === '/' ? `/${route.name}` : route.path)
    }
    return route
  })
}

function routerBuilder (config) {
  config.routes = createRoutes(config.routes)
  return new Router(config)
}

export default routerBuilder
