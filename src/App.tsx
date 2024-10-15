import Calendar from './components/Calendar'
import Sidebar from './components/Sidebar'
import '@unocss/reset/tailwind.css'
import '@fontsource/geist-sans/400.css'
import './styles/index.css'

const App = () => {
  return (
    <div className="flex">
      <Calendar />
      <Sidebar />
    </div>
  )
}

export default App
