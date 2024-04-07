import { NlwUniteIcon } from "../assets/nlw-unite-icon";
import { NavLink } from "./nav-link";

export function Header() {
  return (
    <div className="flex items-center gap-5 ">
      <NlwUniteIcon />

      <nav className="flex items-center gap-5 py-2">
        <NavLink href="/evento">Evento</NavLink>
        <NavLink href="/participantes">Participantes</NavLink>
      </nav>
    </div>
  )
}