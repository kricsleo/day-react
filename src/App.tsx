import Calendar from './components/Calendar'
import Header from './components/Header'
import MarkContext from './components/MarkContext'
import PlanContext from './components/PlanContext'
import Sidebar from './components/Sidebar'
import '@unocss/reset/tailwind.css'
import '@fontsource/geist-sans/400.css'
import './styles/index.css'

const App = () => {
  return (
    <div>
      {/* <Header /> */}
      <Calendar />
      {/* <Sidebar /> */}
      <MarkContext />
      <PlanContext />
    </div>
  )
}

export default App
