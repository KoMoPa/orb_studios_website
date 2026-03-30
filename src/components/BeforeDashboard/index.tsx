import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'
import { AdminDashboardLink } from '../AdminDashboardLink/AdminDashboardLink'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      <div className={`${baseClass}__links`}>
        <AdminDashboardLink />
      </div>
    </div>
  )
}

export default BeforeDashboard
