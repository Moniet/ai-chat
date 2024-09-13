import { PropsWithChildren } from "react"

const Gutter = ({ children }: PropsWithChildren) => {
  return <div className="px-5">{children}</div>
}

export default Gutter
