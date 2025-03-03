// src\widgets\main-layout\ui\sidebar\sidebar-items.ts
import { Building, Headphones } from 'lucide-react'

export type TreeItem = {
  id: string
  name: string
  icon?: React.ElementType
  children?: TreeItem[]
  path?: string
}

export const treeData: TreeItem[] = [
  {
    id: 'tenants',
    name: '테넌트',
    icon: Building,
    children: [
      {
        id: 'tenant-a',
        name: '하나금융그룹',
        icon: Building,
        path: '/tenants/hana',
        children: [
          {
            id: 'campaign-a1',
            name: '신용카드 프로모션',
            icon: Headphones,
            path: '/campaigns/card-promo'
          },
          {
            id: 'campaign-a2',
            name: '대출 상품 안내',
            icon: Headphones,
            path: '/campaigns/loan-info'
          }
        ]
      },
      {
        id: 'tenant-b',
        name: '우리은행',
        icon: Building,
        path: '/tenants/woori',
        children: [
          {
            id: 'campaign-b1',
            name: '적금 상품 홍보',
            icon: Headphones,
            path: '/campaigns/savings'
          },
          {
            id: 'campaign-b2',
            name: '모바일뱅킹 안내',
            icon: Headphones,
            path: '/campaigns/mobile-banking'
          }
        ]
      },
      {
        id: 'tenant-c',
        name: 'SK텔레콤',
        icon: Building,
        path: '/tenants/skt',
        children: [
          {
            id: 'campaign-c1',
            name: '5G 요금제 소개',
            icon: Headphones,
            path: '/campaigns/5g-plan'
          },
          {
            id: 'campaign-c2',
            name: '단말기 교체 프로모션',
            icon: Headphones,
            path: '/campaigns/device-promo'
          }
        ]
      }
    ]
  }
]