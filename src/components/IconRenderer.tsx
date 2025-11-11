import {
  Calculator,
  BarChart3,
  TrendingUp,
  FlaskConical,
  Star,
  BookOpen,
  Clock,
  Target,
  FunctionSquare,
  LineChart,
  Zap,
  Flame,
  Award,
  Trophy,
  BookMarked,
  Crown,
  Calendar,
  Rocket,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Calculator,
  FunctionSquare,
  BarChart3,
  TrendingUp,
  LineChart,
  FlaskConical,
  Star,
  BookOpen,
  Clock,
  Target,
  Zap,
  Flame,
  Award,
  Trophy,
  BookMarked,
  Crown,
  Calendar,
  Rocket,
};

interface IconRendererProps {
  iconName: string;
  size?: number;
  className?: string;
}

export const IconRenderer = ({ iconName, size = 32, className }: IconRendererProps) => {
  const IconComponent = iconMap[iconName] || BookOpen;
  return <IconComponent size={size} className={className} />;
};

export default IconRenderer;

