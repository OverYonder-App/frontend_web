import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendar – Institution Admin",
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <section className=" bg-gray-50 dark:bg-gray-900 min-h-full">{children}</section>
}