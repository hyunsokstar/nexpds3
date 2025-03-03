// src/widgets/main-layout/config/menu-items.ts
import { 
  FileText, 
  Activity, 
  LayoutDashboard, 
  Phone, 
  Send, 
  Repeat, 
  ServerCog 
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

// 패널 컴포넌트들 import
import CampaignManage from '../ui/TabContainer/TabContent/panels/CampaignManage'
import Dashboard from '../ui/TabContainer/TabContent/panels/Dashboard'
import CallStatus from '../ui/TabContainer/TabContent/panels/CallStatus'
import CampaignHistory from '../ui/TabContainer/TabContent/panels/CampaignHistory'
import RetryMonitor from '../ui/TabContainer/TabContent/panels/RetryMonitor'
import SystemMonitor from '../ui/TabContainer/TabContent/panels/SystemMonitor'
import CampaignGroup from '../ui/TabContainer/TabContent/panels/CampaignGroup'
import MonitorPanel from '../ui/TabContainer/TabContent/panels/MonitorPanel'

// React 컴포넌트 타입 (함수형 컴포넌트)
type ComponentType = React.ComponentType<any>;

// Define a clear type for menu items
export interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
  component: ComponentType;
}

// Each menu item represents a module that can be opened in a tab
export const MainMenuItems: MenuItem[] = [
  { 
    id: 'CampaignGroup',
    name: '캠페인 그룹관리', 
    icon: FileText,
    component: CampaignGroup
  },
  { 
    id: 'CampaignManage',
    name: '캠페인 관리', 
    icon: FileText,
    component: CampaignManage
  },
  { 
    id: 'MonitorPanel',
    name: '통합모니터', 
    icon: Activity,
    component: MonitorPanel
  },
  { 
    id: 'Dashboard',
    name: '종합대시보드', 
    icon: LayoutDashboard,
    component: Dashboard
  },
  { 
    id: 'CallStatus',
    name: '발신전화상태', 
    icon: Phone,
    component: CallStatus
  },
  { 
    id: 'CampaignHistory',
    name: '캠페인발송내역', 
    icon: Send,
    component: CampaignHistory
  },
  { 
    id: 'RetryMonitor',
    name: '재발 모니터', 
    icon: Repeat,
    component: RetryMonitor
  },
  { 
    id: 'SystemMonitor',
    name: '시스템모니터링', 
    icon: ServerCog,
    component: SystemMonitor
  }
]