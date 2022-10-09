import { FC, ReactNode } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
type Props = {
  children: ReactNode
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </>
  )
}

export default Layout
