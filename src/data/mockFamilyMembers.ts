import type { FamilyMember } from '@/types'

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'm1',
    name: '王大爷',
    role: 'patient',
    phone: '138****1234',
    isEmergency: false,
    relation: '本人'
  },
  {
    id: 'm2',
    name: '李阿姨',
    role: 'spouse',
    phone: '139****5678',
    isEmergency: true,
    relation: '配偶'
  },
  {
    id: 'm3',
    name: '王小明',
    role: 'child',
    phone: '137****9012',
    isEmergency: true,
    relation: '儿子'
  },
  {
    id: 'm4',
    name: '王小红',
    role: 'child',
    phone: '136****3456',
    isEmergency: false,
    relation: '女儿'
  }
]
