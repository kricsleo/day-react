import Calendar from './components/Calendar'
import Footer from './components/Footer'
import Theme from './components/Theme'
import '@unocss/reset/tailwind.css'
import '@fontsource/geist-sans/400.css'
import './styles/index.css'

const App = () => {
  return (
    <div className="flex">
      <Calendar />
      <Footer />

      {/* <Theme /> */}
    </div>
  )
}

export default App
