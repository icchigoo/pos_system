import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
 

  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Groups',
    path: '/groups',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Membership',
  //   path: '/membership',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserIcon />
  //     </SvgIcon>
  //   )
  // }, 
  {
    title: 'Company',
    path: '/company',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  }, 
  // {
  //   title: 'Opening',
  //   path: '/opening',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  {
    title: 'Category',
    path: '/category',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product',
    path: '/product',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Stock Adjustment',
  //   path: '/stock-adjustment',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Supplier',
  //   path: '/supplier',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },

  {
    title: 'Tax',
    path: '/tax',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Unit',
    path: '/unit',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
 


  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
