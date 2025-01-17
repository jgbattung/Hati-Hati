import { LucideIcon, Users, User, ChartLine, CircleUserRound } from "lucide-react"

interface IFooterRoute {
  route: string,
  icon: LucideIcon,
  text: string,
}

export const footerRoutes: IFooterRoute[] = [
  {
    route: "/groups",
    icon: Users,
    text: "Groups",
  },
  {
    route: "/friends",
    icon: User,
    text: "Friends",
  },
  {
    route: "/activity",
    icon: ChartLine,
    text: "Activity",
  },
  {
    route: "/account",
    icon: CircleUserRound,
    text: "Account",
  },
]