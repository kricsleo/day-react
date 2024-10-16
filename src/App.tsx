import Calendar from './components/Calendar'
import MarkContextMenu from './components/MarkContextMenu'
import Sidebar from './components/Sidebar'
import '@unocss/reset/tailwind.css'
import '@fontsource/geist-sans/400.css'
import './styles/index.css'

const App = () => {
  return (
    <div className="flex">
      <Calendar />
      <Sidebar />
      <MarkContextMenu />
    </div>
  )
}

export default App
