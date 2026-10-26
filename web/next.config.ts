import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/kaggle/project';

const nextConfig: NextConfig = {
  basePath: basePath === '' ? undefined : basePath,
  async rewrites() {
    return [
      // Doctor Portal Routes
      {
        source: '/portal/doctor',
        destination: '/doctor/rounds',
      },
      {
        source: '/portal/doctor/rounds',
        destination: '/doctor/rounds',
      },
      {
        source: '/portal/doctor/intelligence',
        destination: '/doctor/intelligence',
      },
      {
        source: '/portal/doctor/patient',
        destination: '/patient',
      },
      {
        source: '/portal/doctor/patient/:path*',
        destination: '/patient/:path*',
      },
      {
        source: '/portal/doctor/emergency',
        destination: '/emergency/alert',
      },
      {
        source: '/portal/doctor/emergency/:path*',
        destination: '/emergency/:path*',
      },
      {
        source: '/portal/doctor/billing',
        destination: '/billing/ledger',
      },
      {
        source: '/portal/doctor/billing/:path*',
        destination: '/billing/:path*',
      },
      {
        source: '/portal/doctor/audits',
        destination: '/audits/forensic',
      },
      {
        source: '/portal/doctor/audits/:path*',
        destination: '/audits/:path*',
      },
      {
        source: '/portal/doctor/settings',
        destination: '/settings',
      },

      // Patient Portal Routes
      {
        source: '/portal/patient',
        destination: '/patient/dashboard',
      },
      {
        source: '/portal/patient/dashboard',
        destination: '/patient/dashboard',
      },
      {
        source: '/portal/patient/settings',
        destination: '/settings',
      },
      {
        source: '/portal/patient/emergency',
        destination: '/emergency/alert',
      },
      {
        source: '/portal/patient/emergency/:path*',
        destination: '/emergency/:path*',
      },
      {
        source: '/portal/patient/billing',
        destination: '/billing/ledger',
      },
      {
        source: '/portal/patient/billing/:path*',
        destination: '/billing/:path*',
      },
      {
        source: '/portal/patient/patient/:path*',
        destination: '/patient/:path*',
      },
      {
        source: '/portal/patient/:path*',
        destination: '/patient/:path*',
      },

      // Staff Portal Routes
      {
        source: '/portal/staff',
        destination: '/patient',
      },
      {
        source: '/portal/staff/patient',
        destination: '/patient',
      },
      {
        source: '/portal/staff/patient/:path*',
        destination: '/patient/:path*',
      },
      {
        source: '/portal/staff/emergency',
        destination: '/emergency/alert',
      },
      {
        source: '/portal/staff/emergency/:path*',
        destination: '/emergency/:path*',
      },
      {
        source: '/portal/staff/billing',
        destination: '/billing/ledger',
      },
      {
        source: '/portal/staff/billing/:path*',
        destination: '/billing/:path*',
      },
      {
        source: '/portal/staff/audits',
        destination: '/audits/forensic',
      },
      {
        source: '/portal/staff/audits/:path*',
        destination: '/audits/:path*',
      },
      {
        source: '/portal/staff/settings',
        destination: '/settings',
      },
    ];
  },
};

export default nextConfig;
