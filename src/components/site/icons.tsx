import {
  Badge,
  BookOpen,
  CalendarDays,
  Coffee,
  FilePenLine,
  FlaskConical,
  HeartPulse,
  Plane,
  Scale,
  Shirt,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

/** Icon keys stored in the CMS (`icon` column) mapped to Lucide icons. */
export const iconMap: Record<string, LucideIcon> = {
  badge: Badge,
  bag: ShoppingBag,
  book: BookOpen,
  'calendar-days': CalendarDays,
  'file-pen': FilePenLine,
  flask: FlaskConical,
  'heart-pulse': HeartPulse,
  mug: Coffee,
  plane: Plane,
  ribbon: Sparkles,
  scale: Scale,
  shirt: Shirt,
  stethoscope: Stethoscope,
  user: UsersRound,
  users: UsersRound,
  sparkles: Sparkles,
};

export function IconFor({ name, size = 24 }: { name?: string | null; size?: number }) {
  const Icon = iconMap[name || ''] || CalendarDays;
  return <Icon size={size} />;
}
