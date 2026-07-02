import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendar – Institution Admin",
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <section className=" bg-background min-h-full">{children}</section>
}