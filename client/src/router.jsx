import { createBrowserRouter } from 'react-router-dom'
import HomePage from './Home'
import LoginPage from './Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    exact: true
  },
  {
    path: '/login/oauth',
    element: <LoginPage />
  }
  // {
  //   path: '/about',
  //   component: () => import('./pages/About'),
  //   exact: true
  // },
  // {
  //   path: '/contact',
  //   component: () => import('./pages/Contact'),
  //   exact: true
  // }
])
export default router
