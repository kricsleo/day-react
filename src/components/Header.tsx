import Theme from './Theme'
import Today from './Today'

export default function Header() {
  return (
    <header className="y-center justify-end px-2xl py-md">
      <Today />
      <Theme />
    </header>
  )
}
