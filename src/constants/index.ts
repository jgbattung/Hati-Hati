import { LucideIcon, Users, User, ChartLine, CircleUserRound } from "lucide-react"

interface IFooterRoute {
  route: string,
  iconId: string;
  icon: LucideIcon,
  text: string,
}

export const footerRoutes: IFooterRoute[] = [
  {
    route: "/groups",
    iconId: "groups",
    icon: Users,
    text: "Groups",
  },
  {
    route: "/friends",
    iconId: "friends",
    icon: User,
    text: "Friends",
  },
  {
    route: "/activity",
    iconId: "activity",
    icon: ChartLine,
    text: "Activity",
  },
  {
    route: "/account",
    iconId: "account",
    icon: CircleUserRound,
    text: "Account",
  },
]