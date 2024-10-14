import Calendar from './components/Calendar'
import Footer from './components/Footer'
import '@unocss/reset/tailwind.css'
import '@fontsource/geist-sans/400.css'
import './styles/index.css'

const App = () => {
  return (
    <div className="flex">
      <Calendar />
      <Footer />
    </div>
  )
}

export default App
