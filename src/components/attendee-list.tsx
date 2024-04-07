import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Table } from "./table/table";
import { IconButton } from "./icon-button";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
  name: string,
  email: string,
  id: string,
  checkedInAt: string | null,
  createdAt: string,
}

export function AttendeeList() {
  const [ search, setSearch ] = useState(() => {
    const url = new URL(window.location.toString())

    if(url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })
  const [ page, setPage ] = useState(() => {
    const url = new URL(window.location.toString())

    if(url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [ totalAttendes, setTotalAttendees ] = useState(0)
  const [ attendees, setAttendees ] = useState<Attendee[]>([])

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/b45032ed-2a3c-4c0d-9215-dece1acec822/attendees')

    url.searchParams.set('pageIndex', String(page - 1))

    if(search.length > 0) {
      url.searchParams.set('query', search)
    }
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees)
        setTotalAttendees(data.total)
      })
  }, [page, search])

  const totalPages = Math.ceil(totalAttendes / 10)

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    goToFirstPage()
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)

    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', search)

    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4" />
          <input 
            type="text" 
            value={search}
            onChange={onSearchInputChanged}
            placeholder="Buscar participante..." 
            className="flex-1 !outline-none !h-auto !border-none !ring-0 !p-0 !text-sm !bg-transparent"
          />
        </div>  
      </div>

      <Table>
        <thead>
          <TableRow>
            <TableHeader style={{ width: 48 }}>
              <input type="checkbox" className="!size-4 !bg-black/20 !rounded !border border-white/10 !ring-0 checked:!bg-orange-400 cursor-pointer outline-none" />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de Inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 48 }}></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map(attendee => (
            <TableRow key={attendee.id}>
              <TableCell>
                <input type="checkbox" className="!size-4 !bg-black/20 !rounded !border border-white/10 !ring-0 checked:!bg-orange-400 cursor-pointer" />
              </TableCell>
              <TableCell>{attendee.id}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-white">{attendee.name}</span>
                  <span>{attendee.email}</span>
                </div>
              </TableCell>
              <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
              <TableCell>{
                attendee.checkedInAt === null ? 
                <span className="text-zinc-400">Não fez check-in</span> : 
                dayjs().to(attendee.checkedInAt)
              }</TableCell>
              <td>
                <IconButton transparent>
                  <MoreHorizontal className="size-4" />
                </IconButton>
              </td>
            </TableRow>
          ))}
        </tbody>
        <tfoot>
          <TableRow>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {totalAttendes} itens
            </TableCell>
            <TableCell colSpan={3} className="py-3 px-4 text-sm text-zinc-300 text-right">
              <div className="items-center gap-8 inline-flex">
                <span>Página {page} de {totalPages}</span>

                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  )
}