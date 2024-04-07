import { ComponentProps } from "react";
import { twMerge } from 'tailwind-merge'

interface TableCellProps extends ComponentProps<'td'> {}

export function TableCell(props: TableCellProps) {
  return (
    <th 
      {...props} 
      className={twMerge("py-3 px-4 text-sm font-medium text-zinc-300 text-left", props.className)} 
    />
  )
}