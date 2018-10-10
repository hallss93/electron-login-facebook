import Home from './Home/router'
export default [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '*',
  redirect: '/'
}]