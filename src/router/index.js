import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/club-content/Home'
import Message from '../components/club-content/Message'
import More from '../components/club-content/More'
import Login from '../components/club-content/Login'
import Person from '../components/club-content/Person'
import TopicContent from '../components/club-content/TopicContent'
import Self from '../components/club-content/Self'
import SelfMes from '../components/club-content/SelfMes'
import Publish from '../components/club-content/Publish'
Vue.use(Router)
const routes = [
  {path: '/home', name: 'Home', component: Home},
  {path: '/message', name: 'Message', component: Message},
  {path: '/login', name: ' Login', component: Login},
  {path: '/more', name: 'More', component: More},
  {path: '/person', name: 'Person', component: Person},
  {path: '/topic-content', name: 'Topic-content', component: TopicContent},
  {path: '/self', name: 'Self', component: Self},
  {path: '/self-mes', name: 'Self-Mes', component: SelfMes},
  {path: '/publish', name: 'Publish', component: Publish}
]
let router = new Router({
  routes,
  linkActiveClass: 'active'
})
router.push('/home')
export default router
