import axios from 'axios'
var myaxios = {}
myaxios.install = function (Vue) {
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')
    Vue.prototype.$http = axios
}
export default myaxios