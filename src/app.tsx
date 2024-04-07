import { AttendeeList } from "./components/attendee-list";
import { Header } from "./components/header";

export function App() {
  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto py-5 text-zinc-50 antialiased">
      <Header />
      <AttendeeList />
    </div>
  )
}