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

export const MainMenuItems = [
  { 
    name: '캠페인 그룹관리', 
    icon: FileText,
    path: '/CampaignGroup',
    component: 'CampaignGroup'
  },
  { 
    name: '캠페인 관리', 
    icon: FileText,
    path: '/CampaignManage',
    component: 'CampaignManage'
  },
  { 
    name: '통합모니터', 
    icon: Activity,
    path: '/Monitor',
    component: 'MonitorPanel'
  },
  { 
    name: '종합대시보드', 
    icon: LayoutDashboard,
    path: '/Dashboard',
    component: 'Dashboard'
  },
  { 
    name: '발신전화상태', 
    icon: Phone,
    path: '/CallStatus',
    component: 'CallStatus'
  },
  { 
    name: '캠페인발송내역', 
    icon: Send,
    path: '/CampaignHistory',
    component: 'CampaignHistory'
  },
  { 
    name: '재발 모니터', 
    icon: Repeat,
    path: '/RetryMonitor',
    component: 'RetryMonitor'
  },
  { 
    name: '시스템모니터링', 
    icon: ServerCog,
    path: '/SystemMonitor',
    component: 'SystemMonitor'
  }
]