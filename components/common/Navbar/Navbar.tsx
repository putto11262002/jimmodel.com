import { FC } from 'react'
import Link from 'next/link'

const Navbar: FC = () => {
  return (
    <nav className="d-flex justify-between">
      <div></div>
      <ul className="flex justify-around">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/men">Men</Link>
        </li>
        <li>
          <Link href="/women">Women</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>

      <div></div>
    </nav>
  )
}

export default Navbar
