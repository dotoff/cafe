import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Allow IDE tunnels to connect to HMR
  allowedDevOrigins: ['172.16.0.2', 'localhost'],
}

export default withPayload(nextConfig)
